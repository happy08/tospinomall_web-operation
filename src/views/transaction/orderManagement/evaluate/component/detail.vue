<template>
    <BmDialog v-model:visible="visible" :title="$t('table.detail')" noConfirm :cancel="cancel" @close="cancel" width="1000px">
        <div class="content-wrap top-search-form mb-25 p-25 bg-white round-4">
            <div v-if="repayForm" class="flex">
                <!-- 左边 -->
                <div class="left p-5" style="width: 25%;border-right: 1px solid #999999;">
                    <div class="flex hcenter pl-25 pr-25 pt-30 mb-30" style="border-radius: 10px;">
                        <div class="flex center" style="flex-direction: column;">
                            <BmImage class="img ava_img mb-20" :src="repayForm.buyerPortrait" />
                            <div>{{ repayForm.buyerName }}</div>
                        </div>
                    </div>
                    <div class="flex pl-25 mb-25">
                        <div>
                            <BmImage class="img" :src="repayForm.goodPicture" :preview-src-list="[repayForm.goodPicture]" />
                        </div>
                        <div class="ml-10">
                            <div class="mb-5 hidden-2">{{ repayForm.goodTitle }}</div>
                            <div>TSIN: {{ repayForm.tsin }}</div>
                        </div>
                    </div>
                    <div class="pl-25">{{ $t("evaluationManagement.date") }}: {{ repayForm.orderCreateTime }}</div>
                </div>

                <!-- 右边 -->
                <div class="right p-25" style="flex: 1;flex-wrap: wrap;">
                    <!-- 主评 -->
                    <div style="border-bottom:1px solid #999999;">
                        <div class="mb-25">
                            <span>{{ $t("evaluationManagement.helpful") }} ({{ repayForm.glike }})</span><span class="ml-20">{{ $t("evaluationManagement.read") }} {{ repayForm.readNumber }}</span>
                        </div>
                        <div>
                            <div style="text-indent:2em;" class="p-10">{{ repayForm.content }}</div>
                            <div class="pt-20 pb-20">
                                <BmImage class="img ml-5" v-for="(item, i) in repayForm.pictures" :src="item.imgUrl" :key="i" :preview-src-list="[item.imgUrl]" />
                            </div>
                            <div class="flex between mb-5">
                                <div>
                                    <span>{{ $t("evaluationManagement.review") }}</span>
                                    <!-- 评论审核 -->
                                    <el-button
                                        class="ml-15"
                                        v-if="repayForm.additionalEvaluates.length && repayForm.additionalEvaluates[0].status == 1"
                                        @click="handleAudit(repayForm.additionalEvaluates[0])"
                                        size="mini"
                                        type="primary"
                                    >
                                        {{ $t("evaluationManagement.commentReview") }}
                                    </el-button>
                                </div>
                                <div>{{ repayForm.createTime }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 追加评论的回复 -->
                    <div class="mb-20">
                        <!-- 追评 -->
                        <div class="pt-20" v-if="repayForm.additionalEvaluates.length > 0">
                            <div style="text-indent:2em;" class="p-10">
                                {{ repayForm.additionalEvaluates[0].content }}
                            </div>
                            <div class="mb-20">
                                <BmImage class="img mr-20" v-for="(item, i) in repayForm.additionalEvaluates[0].pictures" :key="i" :src="item.imgUrl" :preview-src-list="[item.imgUrl]" />
                            </div>
                        </div>
                        <!-- 商家对 评论的回复 -->
                        <div>
                            <div class="bg-grey pl-15" style="height: 25px;line-height: 25px;">
                                {{ $t("evaluationManagement.reply") }}
                            </div>
                            <div>
                                <div class="flex pl-15 pt-15 border" v-for="(item, i) in repayForm.sellerReplyList" :key="i">
                                    <div><img class="img ava_img" :src="item.replyPicture" /></div>
                                    <div class="ml-15">
                                        <div class="mb-15">{{ item.replyName }}</div>
                                        <div class="mb-15">
                                            {{ $t("evaluationManagement.reply") }} {{ repayForm.buyerName }}:
                                            <span class="hidden-1 bg-grey">{{ repayForm.content }}</span>
                                        </div>
                                        <div :class="item.checked ? 'mb-10 pr-15 hidden-2' : 'mb-10 pr-15'" style="text-indent:2em;">
                                            {{ item.replyContent }}
                                        </div>
                                        <div class="flex between pr-15 mb-5 cp">
                                            <span>{{ repayForm.createTime }}</span
                                            ><span class="cp green" @click="item.checked = !item.checked">{{
                                                item.checked ? proxy.$t("evaluationManagement.hide") : proxy.$t("evaluationManagement.show")
                                            }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 全部评论 -->
                    <div>
                        <div style="border-bottom: 1px solid #999999">{{ $t("evaluationManagement.allComments") }} {{ pageList.length }}</div>
                        <div class="pt-15 flex" style="border-bottom: 1px solid #e8e8e8;" v-for="(item, i) in pageList" :key="i">
                            <div><img class="img ava_img" :src="item.replyPicture" /></div>
                            <div class="ml-15">
                                <div class="mb-15 pr-15 flex between">
                                    <div>{{ item.replyName }}</div>
                                    <div>{{ item.createTime }}</div>
                                </div>
                                <div class="flex">
                                    <div style="width: 150px;">{{ $t("evaluationManagement.reply") }} {{ repayForm.buyerName }}:</div>
                                    <div class="hidden-2 ml-10" style="flex: 1;text-indent:2em;">
                                        {{ item.replyContent }}
                                    </div>
                                </div>
                                <div class="cp green pr-15" style="text-align: end;" @click="item.checked = !item.checked">
                                    {{ item.checked ? proxy.$t("evaluationManagement.hide") : proxy.$t("evaluationManagement.show") }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNum" :total="pageTotal"> </BmPagination>
        </div>
    </BmDialog>

    <!-- 审核 -->
    <Audit v-model:visible="auditVisible" :rows="auditRows" @reloadData="initData" />
</template>

<script>
import { ref, reactive, watch } from "vue";
import { productEvaluateInfo, productEvaluateReplyPage } from "@/api/transaction";
import Audit from "./audit";

export default {
    components: { Audit },
    props: {
        visible: Boolean,
        row: Object
    },
    setup(props, { emit }) {
        let form = reactive({
            pageNum: 1,
            pageSize: 10
        });
        watch(
            () => props.row,
            (nVal) => {
                getDetail(nVal.id);
                form.id = nVal.id;
                getPageList();
            }
        );

        let repayForm = ref(null);
        const getDetail = (id) => {
            productEvaluateInfo({ id: id }).then((res) => {
                res.data.sellerReplyList.forEach((v) => {
                    v.checked = true;
                });
                repayForm.value = res.data;
            });
        };

        //分页
        let pageTotal = ref(0);
        // 全部回复
        let pageList = ref([]);
        const getPageList = () => {
            productEvaluateReplyPage(form).then((res) => {
                pageList.value = res.data.records;
                pageTotal.value = res.data.total;
            });
        };

        const handleCurrentChange = (val) => {
            form.pageNum = val;
            getPageList();
        };

        const handleSizeChange = (val) => {
            form.pageNum = 1;
            form.pageSize = val;
            getPageList();
        };

        // 审核
        let auditVisible = ref(false);
        let auditRows = ref([]);
        const handleAudit = (row) => {
            auditRows.value = [row];
            auditVisible.value = true;
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            repayForm,
            handleSizeChange,
            handleCurrentChange,
            pageTotal,
            pageList,
            auditVisible,
            auditRows,
            handleAudit,
            form,
            cancel
        };
    }
};
</script>

<style lang="scss" scoped>
.img {
    width: 49px;
    height: 49px;
    border-radius: 5px;
}

.ava_img {
    border-radius: 50%;
}
.show-h {
    height: 40px;
}
</style>
