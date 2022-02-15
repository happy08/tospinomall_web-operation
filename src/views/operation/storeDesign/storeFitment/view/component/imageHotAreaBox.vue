<template>
    <!-- 热区预览 -->
    <div v-if="isPreview">
        <div
            @click="handleLink"
            class="areaBox is-preview"
            :style="{
                width: areaInit.areaWidth + '%',
                height: areaInit.areaHeight + '%',
                left: areaInit.positionX + '%',
                top: areaInit.positionY + '%'
            }"
        ></div>
    </div>

    <!-- 热区编辑 -->
    <div v-else>
        <div
            class="areaBox"
            :style="{
                width: areaInit.areaWidth + 'px',
                height: areaInit.areaHeight + 'px',
                left: areaInit.positionX + 'px',
                top: areaInit.positionY + 'px'
            }"
            @dblclick="handleAddLink"
            @mousedown.left.stop.prevent="mouseDown($event)"
            @mouseup.left.stop.prevent="mouseUp($event)"
        >
            <span class="promptText">{{ $t("storeDesign.DoubleClickSet") }}{{ index + 1 }}</span>

            <!--删除-->
            <i class="del el-icon-delete" @click.stop="handleDel()" />

            <!--形变点-->
            <div class="shape" @mousedown.left.stop.prevent="shapeDown($event)" @mouseup.left.stop.prevent="mouseUp($event)" />
        </div>
    </div>
</template>

<script>
import { ref, inject, toRaw } from "vue";
import { throttle } from "@/utils/index.js";

export default {
    name: "imageHotAreaBox",
    props: {
        areaInit: {
            type: Object,
            default: () => {}
        },
        index: {
            type: Number,
            default: null
        },
        imgInfo: {
            type: Object
        },
        websiteUrl: {
            type: String,
            default: ""
        }
    },
    emits: ["delAreaBox", "linkUrlVisible"],
    setup(props, { emit }) {
        const isMobile = inject("isMobile");
        const isPreview = inject("isPreview");

        const imgInfo = toRaw(props.imgInfo);
        const imgWidth = isMobile ? 375 : 980; //图片相对宽度
        const imgHeight = imgWidth / imgInfo.percent; //图片相对高度

        // 跳转
        const pathGoods = props.websiteUrl + (isMobile ? "/cart/product/" : "/product/detail/");
        const pathSearch = props.websiteUrl + (isMobile ? "/search/" : "/product/");
        const categoryIds = isMobile ? "categoryId" : "categoryIds";
        const brandIds = isMobile ? "brandId" : "brandIds";
        const countryCodes = isMobile ? "supplyCountry" : "countryCodes";

        const handleLink = (item) => {
            if (!isPreview) {
                return;
            }
            const aa = [1, 2];
            window.open(`http://localhost:8080/#/?navCategoryIds=${aa}`);

            //链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
            switch (item.imageLinkType) {
                case 0:
                    window.open(`${pathGoods}${item.goodsId}`);
                    break;
                case 1:
                    let frontMenuIds = JSON.parse(item.frontMenuIds);
                    if (!frontMenuIds || frontMenuIds.lenght === 0) {
                        return;
                    }
                    let frontMenuValue = [];
                    for (let i in frontMenuIds) {
                        frontMenuValue.push(frontMenuIds[i][frontMenuIds[i].length - 1]); //每项获最后一个元素
                    }
                    window.open(`${pathSearch}?navCategoryIds=${isMobile ? frontMenuValue : frontMenuValue.join(",")}`);
                    break;
                case 2:
                    let serverMenuIds = JSON.parse(item.serverMenuIds);
                    if (!serverMenuIds || serverMenuIds.lenght === 0) {
                        return;
                    }
                    let serverMenuValue = [];
                    for (let i in serverMenuIds) {
                        serverMenuValue.push(serverMenuIds[i][serverMenuIds[i].length - 1]); //每项获最后一个元素
                    }

                    window.open(`${pathSearch}?${categoryIds}=${isMobile ? serverMenuValue : serverMenuValue.join(",")}`);
                    break;
                case 3:
                    window.open(`${pathSearch}?${brandIds}=${item.brandIds}`);
                    break;
                case 4:
                    window.open(`${pathSearch}?deliveryType=2&${countryCodes}=${isMobile ? item.fbtCountrys.split(",") : item.fbtCountrys}`);
                    break;
                case 5:
                    window.open(`${pathSearch}?deliveryType=1&${countryCodes}=${isMobile ? item.fbmCountrys.split(",") : item.fbmCountrys}`);
                    break;
                case 5:
                    window.open(item.outerLink);
                    break;

                default:
                    break;
            }
        };

        // 删除
        const handleDel = () => {
            proxy
                .$confirm(proxy.$t("confirmDelete"), {
                    type: "warning"
                })
                .then(() => {
                    emit("delAreaBox", props.index);
                })
                .catch(() => {});
        };

        // 开始拖动
        const mouseDown = (e) => {
            const clientX = e.clientX;
            const clientY = e.clientY;
            const areaWidth = props.areaInit.areaWidth;
            const areaHeight = props.areaInit.areaHeight;
            if (!document.onmousemove) {
                const initX = props.areaInit.positionX;
                const initY = props.areaInit.positionY;
                document.onmousemove = (ev) => {
                    _mouseDownFn(ev, clientX, clientY, areaWidth, areaHeight, initX, initY); // 给节流函数传参
                };
            }
        };
        const _mouseDownFn = throttle(mouseDownFn, 70); // 拖动节流函数
        function mouseDownFn(ev, clientX, clientY, areaWidth, areaHeight, initX, initY) {
            let x = initX + ev.clientX - clientX;
            let y = initY + ev.clientY - clientY;
            props.areaInit.positionX = x > 0 ? (x + areaWidth >= imgWidth ? imgWidth - areaWidth : x) : 0;
            props.areaInit.positionY = y > 0 ? (y + areaHeight >= imgHeight ? imgHeight - areaHeight : y) : 0;
        }

        // 结束拖动
        const mouseUp = () => {
            document.onmousemove = null;
        };

        // 形变开始
        const shapeDown = (e) => {
            const clientX = e.clientX;
            const clientY = e.clientY;
            const positionX = props.areaInit.positionX;
            const positionY = props.areaInit.positionY;
            if (!document.onmousemove) {
                const initX = props.areaInit.areaWidth;
                const initY = props.areaInit.areaHeight;
                document.onmousemove = (ev) => {
                    _shapeDownFn(ev, clientX, clientY, positionX, positionY, initX, initY); // 给节流函数传参
                };
            }
        };
        const _shapeDownFn = throttle(shapeDownFn, 70); // 拖动节流函数
        function shapeDownFn(ev, clientX, clientY, positionX, positionY, initX, initY) {
            const x = initX + ev.clientX - clientX;
            const y = initY + ev.clientY - clientY;
            props.areaInit.areaWidth = x + positionX > imgWidth ? imgWidth - positionX : x;
            props.areaInit.areaHeight = y + positionY > imgHeight ? imgHeight - positionY : y;
        }

        //选择链接弹窗
        const handleAddLink = () => {
            emit("linkUrlVisible", props.areaInit);
        };

        return {
            isPreview,
            handleDel,
            mouseDown,
            mouseUp,
            shapeDown,
            handleAddLink,
            handleLink
        };
    }
};
</script>

<style scoped lang="scss" ref="stylesheet/scss">
.areaBox {
    position: absolute;
    background-color: rgba(#42b7ae, 0.5);
    border: 0.7px dashed #42b7ae;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #eeeeee;
    font-size: 14px;
    cursor: move;
    z-index: 99;
    &.is-preview {
        opacity: 0;
        cursor: pointer;
    }
    .promptText {
        overflow: hidden;
        display: inline;
        max-width: 100%;
        max-height: 100%;
        text-align: center;
        font-size: 12px;
    }
    .del {
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
    }

    .shape {
        position: absolute;
        width: 7px;
        height: 7px;
        background: transparent;
        right: 0;
        bottom: 0;
        transform: translate3d(50%, 50%, 0);
        cursor: nwse-resize;
    }
}
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
