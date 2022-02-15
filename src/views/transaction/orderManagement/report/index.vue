<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <div>
            <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
                <el-row el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <!-- 商品类目 -->
                        <el-form-item prop="_tpmTime" :label="$t('evaluationComplaintManagement.reportTime')">
                            <el-date-picker
                                v-model="searchForm._tpmTime"
                                type="datetimerange"
                                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                                :start-placeholder="$t('startDate')"
                                range-separator="-"
                                :end-placeholder="$t('endDate')"
                                :shortcuts="shortcuts"
                                :disabled-date="disabledDate"
                                clearable
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <!-- 投诉类型 举报来源 -->
                        <el-form-item prop="utype" :label="$t('evaluationComplaintManagement.reportSource')">
                            <el-select v-model="searchForm.utype" clearable :placeholder="$t('pleaseSelect')">
                                <el-option :label="$t('evaluationComplaintManagement.buyerComplain')" value="0"></el-option>
                                <el-option :label="$t('evaluationComplaintManagement.sellerComplain')" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <!-- 投诉状态 -->
                    <el-col :md="12" :lg="6">
                        <el-form-item prop="complaintStatus" :label="$t('evaluationComplaintManagement.complaintStatus')">
                            <el-select v-model="searchForm.complaintStatus" clearable placeholder="">
                                <el-option v-for="(item, i) in complaintList" :label="item.label" :value="item.value" :key="i"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <el-form-item prop="reportingScene" :label="$t('evaluationComplaintManagement.reportReason')">
                            <el-select v-model="searchForm.reportingScene" clearable :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, i) in reportReasonList" :label="item.label" :value="item.value" :key="i"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div id="elCollapse" class="h-0 hidden">
                    <el-row el-row :gutter="24">
                        <el-col :md="12" :lg="6">
                            <el-form-item prop="reportingContent" :label="$t('evaluationComplaintManagement.reportInfo')">
                                <el-input v-model="searchForm.reportingContent" :placeholder="$t('pleaseEnter')" clearable></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :md="12" :lg="6">
                            <el-form-item prop="uid" :label="$t('evaluationComplaintManagement.sellerInfo')">
                                <el-select v-model="searchForm.uid" :placeholder="$t('pleaseSelect')" filterable remote reserve-keyword clearable :remote-method="getStoreList">
                                    <el-option v-for="(item, index) in storeList" :key="index" :label="item.storeName" :value="item.id"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :md="12" :lg="6">
                            <el-form-item prop="uid" :label="$t('evaluationComplaintManagement.memberInfoL')">
                                <el-select v-model="searchForm.uid" :placeholder="$t('pleaseSelect')" filterable remote reserve-keyword clearable :remote-method="getBuyerList">
                                    <el-option v-for="(item, index) in buyerList" :key="index" :label="item.account" :value="item.id"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <div class="table-search-btns">
                    <!-- 查询 -->
                    <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                    <!-- 重置 -->
                    <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                    <!-- 展开  -->
                    <BmCollapse el="#elCollapse" :isShow="false" />
                </div>
            </el-form>
        </div>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between vcenter mb-15">
            <div>
                <el-button v-permission="'orderManagement_report_batchAudit'" @click="reportDialog">{{ $t("evaluationComplaintManagement.batchReview") }}</el-button>
            </div>
        </div>
        <BmTable ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
            <BmTableColumn type="selection"></BmTableColumn>
            <BmTableColumn prop="reportingContent" :label="$t('evaluationComplaintManagement.reportContent')">
                <template #default="scope">
                    <div>
                        {{ scope.row.reportingContent }}
                    </div>
                    <div>
                        <BmImage
                            v-for="(item, i) in scope.row.pictures"
                            :key="i"
                            :src="item.imgUrl"
                            :preview-src-list="scope.row.pictures.map((item) => item.imgUrl)"
                            style="width:40px;height:40px"
                            class="mr-5 mb-5 mt-5"
                        ></BmImage>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="content" :label="$t('evaluationComplaintManagement.commentContent')">
                <template #default="scope">
                    <div>{{ $t("evaluationComplaintManagement.commentId") }}: {{ scope.row.goodsEvaluateVo.id }}</div>
                    <div>{{ scope.row.goodsEvaluateVo.content }}</div>
                    <div>
                        <span v-for="(item, i) in scope.row.goodsEvaluateVo.pictures" :key="i">
                            <BmImage
                                v-if="item.fileType == 1"
                                :src="item.imgUrl"
                                :preview-src-list="scope.row.goodsEvaluateVo.pictures.filter((item) => item.fileType == 1).map((item) => item.imgUrl)"
                                style="width:40px;height:40px"
                                class="mr-5 mb-5 mt-5"
                            ></BmImage>
                        </span>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="reportingScene" :label="$t('evaluationComplaintManagement.reportReason')" width="120">
                <template #default="scope">
                    {{ scope.row.reportingSceneName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('status.status')" width="100">
                <template #default="scope">
                    <div class="flex venter">
                        <div>
                            {{
                                scope.row.status == 1
                                    ? $t("evaluationComplaintManagement.pendingReview")
                                    : scope.row.status == 2
                                    ? $t("evaluationComplaintManagement.examinationPassed")
                                    : scope.row.status == 3
                                    ? $t("evaluationComplaintManagement.rejected")
                                    : ""
                            }}
                        </div>
                        <div v-if="scope.row.status == 3 && scope.row.approveMark">
                            <el-popover placement="right" trigger="hover">
                                <template #reference>
                                    <div>
                                        <i class="el-icon-question fs-16 light-grey"></i>
                                    </div>
                                </template>
                                <div>{{ scope.row.approveMark }}</div>
                            </el-popover>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="utype" :label="$t('evaluationComplaintManagement.reportSource')" width="100">
                <template #default="scope">
                    <!-- 投诉人类型: 0->买家投诉 1->商家投诉 -->
                    <div>
                        {{ scope.row.utype == 1 ? $t("evaluationComplaintManagement.sellerReport") : scope.row.utype == 0 ? $t("evaluationComplaintManagement.buyerReport") : "" }}
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="informerName" :label="$t('evaluationComplaintManagement.reporter')" width="100">
                <template #default="scope">
                    <div>{{ scope.row.informerName }}</div>
                    <div>{{ scope.row.informerCode }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="createTime" :label="$t('evaluationComplaintManagement.reportTime')" width="150"> </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" fixed="right" width="100px" align="center">
                <template #default="scope">
                    <el-button v-permission="'orderManagement_report_audit'" v-if="scope.row.status == 1" @click.stop="reportDialog(scope.row)" type="text">{{ $t("status.audit") }}</el-button>
                </template>
            </BmTableColumn>
        </BmTable>
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 审核 -->
    <BmDialog v-model:visible="visibleReport" :title="$t('status.audit')" :confirm="confirmReport" :cancel="cancelReport" :width="600">
        <el-form :model="reportForm" ref="reportFormRef" label-width="80px">
            <el-form-item :label="$t('status.audit')" prop="action" :rules="shieldRules.required">
                <el-radio-group v-model="reportForm.action">
                    <el-radio label="agree">{{ $t("status.pass") }}</el-radio>
                    <el-radio label="reject">{{ $t("status.reject") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="reportForm.action == 'reject'" :label="$t('evaluationComplaintManagement.rejectReason')" prop="mark" :rules="shieldRules.required">
                <el-input :placeholder="$t('pleaseEnter')" v-model="reportForm.mark" type="textarea" maxlength="300" :rows="5" show-word-limit />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { productEvaluateReportsPage, getDictByType, productEvaluateReportsApprove, adminSellerFindByConditionsNoPage, adminBuyerFindByConditions } from "@/api/transaction";
export default {
    setup(props) {
        const { proxy } = getCurrentInstance();

        //分页
        let pageTotal = ref(0);

        let searchFormRef = ref(null);
        let searchForm = reactive({
            _tpmTime: [],
            utype: "", // 投诉人类型: 0->买家投诉 1->商家投诉
            status: "", // "0->待审核 1->审核通过 2->审核不通过
            reportingScene: "", // 举报场景
            reportingContent: "", // 举报内容
            startTime: "", //	开始时间
            endTime: "", //	结束时间
            uid: "", // 举报人id 商家,买家
            pageNum: 1,
            pageSize: 10
        });
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        // 获取table分页数据
        let tableData = ref([]);
        const getListData = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }
            productEvaluateReportsPage(searchForm)
                .then((res) => {
                    // 举报原因(数字转文字 1.晒单图片与商品不符 2.非法欺诈 3.黄赌毒暴力政治 4.广告灌水 99.其他)
                    tableData.value = res.data.records.map((item) => {
                        for (let i in reportReasonList.value) {
                            if (reportReasonList.value[i].value == item.reportingScene) {
                                item.reportingSceneName = reportReasonList.value[i].label;
                            }
                        }
                        return item;
                    });
                    pageTotal.value = res.data.total;
                })
                .catch((err) => {});
            pageFlag.value = false;
        };
        getListData();

        //搜索
        const handelSearch = () => {
            searchForm.startTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[0], true);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[1], true);
            getListData();
        };

        //重置
        const resetForm = () => {
            searchForm.startTime = "";
            searchForm.endTime = "";
            searchFormRef.value.resetFields();
            getListData();
        };

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        //数据字典
        let reportReasonList = ref([]);
        let complaintList = ref([]);
        const getDictType = () => {
            // 获取 评价投诉审核状态
            getDictByType("evaluate_reports_approve_status")
                .then((res) => {
                    complaintList.value = res.data;
                })
                .catch((err) => {});
            // 获取 举报原因
            getDictByType("product_goods_evaluate_scene")
                .then((res) => {
                    reportReasonList.value = res.data;
                })
                .catch((err) => {});
        };
        getDictType();

        // 卖家店铺列表
        let storeList = ref([]);
        const getStoreList = (keyword) => {
            adminSellerFindByConditionsNoPage({ storeName: keyword, storeCode: keyword })
                .then((res) => {
                    storeList.value = res.data;
                })
                .catch((err) => {});
        };

        // 用户信息列表
        let buyerList = ref([]);
        const getBuyerList = (val) => {
            adminBuyerFindByConditions({ userInfo: val }).then((res) => {
                buyerList.value = res.data.records;
            });
        };

        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
        };

        // ------------------举报----------------------
        const shieldRules = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" },
            isSelect: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }
        });
        let reportFormRef = ref(null);
        let reportForm = reactive({
            action: "",
            mark: "",
            paramList: []
        });

        let visibleReport = ref(false);
        const reportDialog = (row) => {
            if (row && row.id) {
                reportForm.paramList.push({
                    id: row.id,
                    evaluateId: row.evaluateId
                });
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                } else {
                    tableSelectionRows.forEach((v) => {
                        reportForm.paramList.push({
                            id: v.id,
                            evaluateId: v.evaluateId
                        });
                    });
                }
            }
            visibleReport.value = true;
        };

        const confirmReport = () => {
            reportFormRef.value.validate((valid) => {
                if (valid) {
                    productEvaluateReportsApprove(reportForm).then((res) => {
                        proxy.$message.success(res.msg);
                        visibleReport.value = false;
                        reportFormRef.value.resetFields();
                        getListData();
                    });
                } else {
                    return false;
                }
            });
        };

        const cancelReport = () => {
            visibleReport.value = false;
            reportFormRef.value.resetFields();
        };

        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            pageFlag.value = true;
            getListData();
        };

        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            getListData();
        };

        return {
            shortcuts,
            disabledDate,
            cancelReport,
            reportFormRef,
            confirmReport,
            reportForm,
            reportDialog,
            visibleReport,
            handleCurrentChange,
            handleSizeChange,
            searchFormRef,
            searchForm,
            tableData,
            handleSelectionChange,
            pageTotal,
            handelSearch,
            resetForm,
            buyerList,
            storeList,
            reportReasonList,
            complaintList,
            getStoreList,
            getBuyerList,
            shieldRules,
            pageFlag
        };
    }
};
</script>
