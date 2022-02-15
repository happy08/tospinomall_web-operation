<template>
    <div>
        <!-- 拖动 -->
        <Draggable v-if="draggable" :list="fileList" tag="transition-group" item-key="url" @end="onDraggableEnd">
            <template #item="{ element,index }">
                <div :class="['el-upload-image', 'el-upload--picture-card', size]">
                    <BmImage v-if="fileType === 'image'" :src="element.urlBlob || element.url" style="width:100%;height:100%" />
                    <video v-else :src="element.url" width="148" height="148" controls></video>

                    <!-- 预览&删除 -->
                    <div class="el-upload-list--picture-card">
                        <span class="el-upload-list__item-actions">
                            <span
                                v-if="isPreview && fileType === 'image' && (element.urlBlob || element.url)"
                                class="el-upload-list__item-preview"
                                @click.stop="handlePreview(element.urlBlob || element.url)"
                            >
                                <i class="el-icon-zoom-in"></i>
                            </span>
                            <span class="el-upload-list__item-delete" @click.stop="handleRemove(index)"> <i class="el-icon-delete"></i> </span>
                        </span>
                    </div>

                    <!-- 进度条 -->
                    <div v-if="0 < element.percentage && element.percentage < 100" class="upload-progress">
                        <el-progress type="circle" :percentage="element.percentage" :width="80" :stroke-width="3" color="#68c5be">
                            <template #default>
                                <div class="white">{{ element.percentage }}%</div>
                            </template>
                        </el-progress>
                    </div>

                    <!-- 设为主图 -->
                    <div v-if="showMainPicture || mainPicture">
                        <div v-if="element.url !== mainPicture" @click.stop="handleMainPicture(element.url)" class="main-picture">{{ $t("setMainPicture") }}</div>
                    </div>
                </div>
            </template>
        </Draggable>

        <!-- 上传 -->
        <el-upload
            ref="uploadRef"
            v-bind="$attrs"
            :class="[draggable ? 'fl' : '', size, 'custom-upload']"
            :action="ossUpLoadUrl"
            :headers="headers"
            name="object"
            list-type="picture-card"
            :show-file-list="showFileList"
            :file-list="fileList"
            :accept="accept"
            :before-upload="beforeUpload"
            :limit="limit"
            :on-exceed="onExceed"
            :on-success="onSuccess"
            :on-progress="onProgress"
            :on-change="onChange"
            :on-error="onError"
            :disabled="disabled"
        >
            <template #default>
                <!-- 单个文件 -->
                <video v-if="fileType === 'video' && (fileUrl.urlBlob || fileUrl.url)" :src="fileUrl.urlBlob || fileUrl.url" width="148" height="148" controls></video>
                <BmImage v-else-if="fileType === 'image' && (fileUrl.urlBlob || fileUrl.url)" :src="fileUrl.urlBlob || fileUrl.url" fill="contain" style="width:100%;height:100%" />
                <div v-else class="flex center column lh-12" style="height:100%">
                    <i class="el-icon-plus"></i>
                    <div>{{ tip }}</div>
                </div>

                <div v-if="fileUrl.urlBlob || fileUrl.url" class="el-upload-list--picture-card">
                    <span class="el-upload-list__item-actions">
                        <span v-if="isPreview && fileType === 'image'" class="el-upload-list__item-preview" @click.stop="handlePreview(fileUrl.urlBlob || fileUrl.url)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                        <span class="el-upload-list__item-delete" @click.stop="handleRemove(fileUrl.urlBlob || fileUrl.url)">
                            <i class="el-icon-delete"></i>
                        </span>
                    </span>
                </div>

                <div v-if="fileUrl.percentage && 0 < fileUrl.percentage && fileUrl.percentage < 100" class="upload-progress">
                    <el-progress type="circle" :percentage="fileUrl.percentage" :width="80" :stroke-width="3" color="#68c5be">
                        <template #default>
                            <div class="white">{{ Math.ceil(fileUrl.percentage) }}%</div>
                        </template>
                    </el-progress>
                </div>
            </template>
            <template #file="{file}">
                <!-- 多个文件 -->
                <BmImage v-if="fileType === 'image'" class="el-upload-list__item-thumbnail" :src="file.urlBlob || file.url" fill="contain" style="width:100%;height:100%" />
                <video v-else-if="fileType === 'video'" :src="file.urlBlob || file.url" width="148" height="148" controls></video>

                <span class="el-upload-list__item-actions">
                    <span v-if="fileType === 'image' && (file.urlBlob || file.url)" class="el-upload-list__item-preview" @click.stop="handlePreview(file.urlBlob || file.url)">
                        <i class="el-icon-zoom-in"></i>
                    </span>
                    <span class="el-upload-list__item-delete" @click.stop="handleRemove(file.urlBlob || file.url)">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>

                <div v-if="0 < file.percentage && file.percentage < 100" class="upload-progress">
                    <el-progress type="circle" :percentage="file.percentage" :width="80" :stroke-width="3" color="#68c5be" style="width:80px">
                        <template #default>
                            <div class="white">{{ Math.ceil(file.percentage) }}%</div>
                        </template>
                    </el-progress>
                </div>
            </template>
        </el-upload>
    </div>

    <!-- 预览图片 -->
    <teleport to="body">
        <el-image
            ref="previewImageRef"
            :src="previewImageUrl"
            :preview-src-list="!showFileList && !draggable ? [fileUrl.urlBlob || fileUrl.url] : fileList.map((item) => item.urlBlob || item.url)"
            :z-index="3000"
            style="width:10px;height:10px"
        ></el-image>
    </teleport>
</template>

<script>
import { computed, getCurrentInstance, ref, watch } from "vue";
import { ElProgress, ElUpload } from "element-plus";
import Draggable from "vuedraggable";
import { ossUpLoadUrl } from "@/api/user";
import storage from "@/utils/storage";

export default {
    name: "BmUpload",
    components: { ElProgress, ElUpload, Draggable },

    props: {
        //是否拖动
        draggable: {
            type: Boolean,
            default: false
        },
        //显示大小
        size: {
            type: String,
            default: "lg" //lg,xl,xs
        },
        //单文件url
        fileUrl: {
            type: String,
            default: ""
        },
        //类型image,video
        fileType: {
            type: String,
            default: "image"
        },
        accept: {
            type: String,
            default: "image/png,image/jpg,image/jpeg"
        },
        //是否多个文件
        showFileList: {
            type: Boolean,
            default: true
        },
        //多个文件list
        fileList: {
            type: Array,
            default() {
                return [];
            }
        },
        //是否预览
        isPreview: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        //限制个数
        limit: {
            type: Number,
            default: 10
        },
        //限制大小 单位M
        limitSize: {
            type: [Number, String],
            default: -1
        },
        //提示文字
        tip: {
            type: String,
            default: ""
        },
        //是否显示设置主图
        showMainPicture: {
            type: Boolean,
            default: false
        },
        //主图
        mainPicture: {
            type: String,
            default: ""
        }
    },
    emits: ["change"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let fileUrl = ref({});
        let fileList = ref([]);
        watch(
            () => props.fileUrl,
            (nVal) => {
                fileUrl.value = {
                    ...fileUrl.value,
                    url: nVal
                };
            },
            { immediate: true }
        );
        watch(
            () => props.fileList,
            (nVal) => {
                fileList.value = nVal || [];
            },
            { immediate: true }
        );

        const showFileList = computed(() => {
            //如果可拖动 showFileList必须为false
            if (props.draggable === true) {
                return false;
            }
            return props.showFileList;
        });

        //上传头部
        const headers = computed(() => {
            return {
                Authorization: proxy.$store.state.user.toten || storage.get("token"),
                language: proxy.$store.state.app.lang || storage.get("lang") || "en",
                site: proxy.$store.state.app.site || "",
                clientType: "web",
                version: ""
            };
        });

        //上传成功
        const onSuccess = (res, file, fileLists) => {
            //单文件
            if (!props.showFileList && !props.draggable) {
                fileUrl.value.percentage = 100;
                fileUrl.value.url = res.data;
                emit("change", fileUrl.value.url);
                return;
            }

            fileList.value.forEach((item) => {
                if (file.uid === item.uid) {
                    item.percentage = 100;
                    item.url = res.data;
                }
            });
            emit("change", fileList.value);
        };

        //上传进度
        const onProgress = (res, file) => {
            //单文件
            if (!props.showFileList && !props.draggable) {
                fileUrl.value.percentage = Math.ceil(file.percentage);
                return;
            }
            fileList.value.forEach((item) => {
                if (file.uid === item.uid || (file.raw && file.raw.uid === item.uid)) {
                    item.percentage = Math.ceil(file.percentage);
                }
            });
        };

        //上传失败
        const onError = (err, file, fileLists) => {
            proxy.$message.error(proxy.$t("uploadFail")); //上传失败

            //单文件
            if (!props.showFileList && !props.draggable) {
                fileUrl.value.percentage = 0;
                fileUrl.value.urlBlob = "";
                fileUrl.value.url = "";
                emit("change", "");
                return;
            }

            // 上传失败 删掉
            let index = fileList.value.findIndex((item) => item.uid && item.uid == file.uid);
            if (index > -1) {
                setTimeout(() => {
                    fileList.value.splice(index, 1);
                }, 1000);
            }
        };

        //修改
        const onChange = (file, fileLists) => {
            //单文件
            if (!props.showFileList && !props.draggable) {
                fileUrl.value.urlBlob = file.url;
                return;
            }
            const uids = fileList.value.map((item) => item.uid);
            if (!uids.includes(file.uid)) {
                fileList.value.push({ url: "", urlBlob: file.url, uid: file.uid });
            }
        };

        //删除
        const handleRemove = (url) => {
            //单文件
            if (!props.showFileList && !props.draggable) {
                fileUrl.value.urlBlob = "";
                fileUrl.value.url = "";
                emit("change", "");
                return;
            }
            //拖动的图片 直接删除第index个
            if (props.draggable) {
                fileList.value.splice(url, 1);
                emit("change", fileList.value);
                syncUploadFileList();
                return;
            }
            // 多文件
            const index = fileList.value.findIndex((item) => item.urlBlob == url || item.url == url);
            if (index > -1) {
                //setTimeout(() => {
                fileList.value.splice(index, 1);
                emit("change", fileList.value);
                syncUploadFileList();
                //}, 2000);
            }
        };

        // 同步el-upload的fileList列表
        let uploadRef = ref(null);
        const syncUploadFileList = (val) => {
            const list = val || fileList.value;
            if (uploadRef.value) {
                uploadRef.value.uploadFiles = list.map((item, i) => {
                    return {
                        ...item,
                        name: "pic" + i,
                        precenttage: 100,
                        status: "success",
                        uid: item.uid || "uid" + i
                    };
                });
            }
        };

        //上传校验
        const beforeUpload = (file) => {
            //文件格式
            let accept = proxy.accept.split(",");
            if (accept.indexOf(file.type) === -1) {
                const acceptType = accept.map((item) => item.split("/")[1]);
                proxy.$message.error(proxy.$t("updateType", { type: acceptType.join(",") }));

                //单文件
                if (!props.showFileList && !props.draggable) {
                    fileUrl.value.urlBlob = "";
                    return false;
                }

                // 格式不对 删掉
                const index = fileList.value.findIndex((item) => item.uid && item.uid == file.uid);
                if (index > -1) {
                    fileList.value.splice(index, 1);
                }
                return false;
            }
            //文件大小
            if (proxy.limitSize > 0) {
                const isLtM = file.size / 1024 / 1024 > proxy.limitSize;
                if (isLtM) {
                    proxy.$message.error(proxy.$t("updateSize", { size: proxy.limitSize })); //文件大小不能超过 2MB!

                    //单文件
                    if (!props.showFileList && !props.draggable) {
                        fileUrl.value.urlBlob = "";
                        return false;
                    }

                    // 超大小 删掉
                    const index = fileList.value.findIndex((item) => item.uid && item.uid == file.uid);
                    if (index > -1) {
                        fileList.value.splice(index, 1);
                    }
                    return false;
                }
            }
            try {
                //图片压缩
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    const image = new Image();
                    image.onload = (imageEvent) => {
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        // 默认按比例压缩
                        let w = image.width;
                        let h = image.height;
                        let ration;
                        if (w * h > 2000000) {
                            // 压缩尺寸
                            ration = Math.sqrt((w * h) / 2000000);
                            w /= ration;
                            h /= ration;
                        }
                        canvas.width = w;
                        canvas.height = h;
                        context.clearRect(0, 0, w, h);
                        context.drawImage(image, 0, 0, w, h);

                        let fileSize = parseFloat(parseInt(file["size"]) / 1024 / 1024).toFixed(2);
                        // 压缩像素
                        let base64;
                        if (fileSize <= 0.5) {
                            // 如果图片小于0.5兆 那么不执行压缩操作
                            base64 = canvas.toDataURL(file["type"], 1);
                        } else if (fileSize > 0.5 && fileSize <= 1) {
                            // 如果图片超过0.5M 那么压缩0.7
                            base64 = canvas.toDataURL(file["type"], 0.7);
                        } else if (fileSize > 1 && fileSize <= 3) {
                            base64 = canvas.toDataURL(file["type"], 0.6);
                        } else {
                            base64 = canvas.toDataURL(file["type"], 0.4);
                        }

                        // 将base64图片转为blob格式
                        var binary = atob(base64.split(",")[1]);
                        var array = [];
                        for (var i = 0; i < binary.length; i++) {
                            array.push(binary.charCodeAt(i));
                        }
                        const blobData = new Blob([new Uint8Array(array)], { type: file.type });
                        resolve(blobData);
                    };
                    reader.onload = (e) => {
                        image.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                });
            } catch (error) {
                return true;
            }
        };

        // 限制个数
        const onExceed = (file, fileList) => {
            proxy.$message.error(proxy.$t("limitUpload", { limit: props.limit }));
        };

        //设为主图
        const handleMainPicture = (url) => {
            emit("change", { mainPicture: url });
        };

        //拖动结束
        const onDraggableEnd = () => {
            emit("change", fileList.value);
        };

        //图片预览
        let previewImageUrl = ref("");
        let previewImageRef = ref(null);
        const handlePreview = (url) => {
            previewImageUrl.value = url;
            previewImageRef.value.clickHandler();
        };

        return {
            ossUpLoadUrl,
            headers,
            fileUrl,
            fileList,
            showFileList,

            uploadRef,
            syncUploadFileList,
            handleRemove,

            onSuccess,
            onProgress,
            onError,
            onChange,
            beforeUpload,
            onExceed,
            handleMainPicture,
            onDraggableEnd,

            previewImageUrl,
            previewImageRef,
            handlePreview
        };
    }
};
</script>
<style lang="scss" scoped>
.xs {
    ::v-deep(.el-upload) {
        width: 31px;
        height: 31px;
        line-height: 29px;
        border: solid 1px #dcdfe6;
        border-radius: 3px;
        .el-icon-plus {
            font-size: 12px;
        }
    }
}
.xl {
    ::v-deep(.el-upload) {
        width: 59px;
        height: 59px;
        line-height: 59px;
        border: solid 1px #dcdfe6;
        border-radius: 3px;
        .el-icon-plus {
            font-size: 12px;
        }
    }
}
::v-deep(.el-upload-list__item) {
    transition: all 0s;
}
::v-deep(.el-upload--picture-card) {
    position: relative;
}
.el-upload-list--picture-card {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    .el-upload-list__item-actions:hover span {
        display: inline;
    }
    i {
        font-size: 20px;
        color: #ffffff;
    }
}

.el-upload-image {
    float: left;
    margin: 0 5px 5px 0;
    position: relative;
    width: 148px;
    height: 148px;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    overflow: hidden;
    &.xs {
        width: 31px;
        height: 31px;
    }
    &.xl {
        width: 59px;
        height: 59px;
    }

    .main-picture {
        position: absolute;
        width: 100%;
        height: 24px;
        line-height: 24px;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        color: #ffffff;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
    }
}
.custom-upload {
    overflow: hidden;
}
.upload-progress {
    position: absolute;
    z-index: 9;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
