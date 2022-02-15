<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('workReturn.normTips')" icon="warning" class="mb-20" />

        <div class="flex between p-20 mb-15 border tc">
            <div class="flex1 vcenter">
                <div class="center">{{ $t("workReturn.workOrderVolume") }}</div>
                <div class="header">{{ workCounts.workCount }}{{ $t("workReturn.unlined") }}</div>
            </div>
            <div class="flex1 vcenter">
                <div class="center">{{ $t("workReturn.violationProcessingVolume") }}</div>
                <div class="header">{{ workCounts.violateDealCount }}{{ $t("workReturn.unlined") }}</div>
            </div>
            <div class="flex1 vcenter">
                <div class="center">{{ $t("workReturn.violationHandlingRate") }}</div>
                <div class="header">{{ workCounts.violateDealRate }}%</div>
            </div>
            <div class="flex1 vcenter">
                <div class="center">{{ $t("workReturn.completionRate") }}</div>
                <div class="header">{{ workCounts.completeRate }}%</div>
            </div>
            <div class="flex1 vcenter">
                <div class="center">{{ $t("workReturn.averageCompletionTime") }}</div>
                <div class="header">{{ workCounts.averageDealTime }}h</div>
            </div>
        </div>
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('workReturn.workOrderNumber')" prop="workSn">
                        <el-input v-model="searchForm.workSn" clearable :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('goodsListTable.sellerInfo')" prop="sellerKeyword">
                        <el-select v-model="searchForm.sellerKeyword" :placeholder="$t('pleaseSelect')" clearable filterable remote reserve-keyword :remote-method="getStoreList">
                            <el-option v-for="(item, index) in storeList" :key="index" :label="item.storeName" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('copingManagement.memberInfo')" prop="buyerKeyword">
                        <el-select v-model="searchForm.buyerKeyword" :placeholder="$t('pleaseSelect')" filterable remote reserve-keyword clearable :remote-method="getBuyerList">
                            <el-option v-for="(item, index) in buyerList" :key="index" :label="item.account" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item prop="_tempTime" :label="$t('workReturn.createTime')">
                        <el-date-picker
                            v-model="searchForm._tempTime"
                            @change="changeDate"
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
            </el-row>

            <div id="elCollapse" class="h-0 hidden">
                <el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('workReturn.orderNum')" prop="orderSn">
                            <el-input v-model="searchForm.orderSn" clearable :placeholder="$t('pleaseEnter')"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item prop="status" :label="$t('workReturn.ticketStatus')">
                            <el-select v-model="searchForm.status" clearable :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, i) in workStatus" :key="i" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('workReturn.liabilityDetermination')" prop="responsJudage">
                            <el-select v-model="searchForm.responsJudage" clearable :placeholder="$t('pleaseSelect')">
                                <el-option :label="$t('status.all')" value=""></el-option>
                                <el-option :label="$t('platform.noResponsibility')" value="0"></el-option>
                                <el-option :label="$t('platform.sellerResponsibility')" value="1"></el-option>
                                <el-option :label="$t('platform.buyerResponsibility')" value="2"></el-option>
                                <el-option :label="$t('workReturn.theRepairOrderViolations')" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('workReturn.refundJudgment')" prop="refundJudage">
                            <el-select v-model="searchForm.refundJudage" clearable :placeholder="$t('pleaseSelect')">
                                <el-option :label="$t('status.all')" value=""></el-option>
                                <el-option :label="$t('platform.noRefundRequired')" value="0"></el-option>
                                <el-option :label="$t('platform.refundToBuyer')" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <!-- SKU商品信息 -->
                        <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skeyword">
                            <template #label>
                                <el-select v-model="searchForm.sIndex" :placeholder="$t('pleaseSelect')">
                                    <el-option v-for="(item, index) in goodsMultiList" :key="index" :label="item.name" :value="item.value"> </el-option>
                                </el-select>
                            </template>
                            <el-input v-model="searchForm.skeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" :placeholder="$t('pleaseSelect')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <!-- 商品标题 -->
                        <el-form-item :label="$t('releaseGoods.commodityTitle')" prop="titleKeyword">
                            <el-input v-model="searchForm.titleKeyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
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

    <div class="p-25 bg-white round-4">
        <div class="flex between vcenter mb-20">
            <div class="flex vcenter">
                <el-button @click="workStatusChange('1')" plain>{{ $t("workReturn.toBeProof") }}({{ tableData.waitProofCount }})</el-button>
                <el-button @click="expireChange(1)" plain>{{ $t("workReturn.overdueWithin24Hours") }}({{ tableData.beExpireCount }})</el-button>
                <el-button @click="workStatusChange('2')" plain>{{ $t("workReturn.waitingForThePlatformToProcess") }}({{ tableData.waitMallHandleCount }})</el-button>
            </div>
            <div class="flex vcenter">
                <el-button v-permission="'returnManager_workOrder_export'" plain class="ml-15" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
            </div>
        </div>
        <BmTable ref="multipleTable" :data="tableData.omsOrderReturnWorks" @selection-change="handleSelectionChange" :column="tableColumn" class="mb-20">
            <BmTableColumn type="selection" width="55"></BmTableColumn>
            <BmTableColumn prop="workSn" :label="$t('workReturn.ticketID')" min-width="180" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn prop="createTime" :label="$t('workReturn.applicationTime')" width="150" header-align="center" align="center"> </BmTableColumn>
            <BmTableColumn prop="workType" :label="$t('workReturn.workOrderType')" header-align="center" align="center">
                <template #default="scope">
                    <div>
                        {{ scope.row.workType == 0 ? $t("copingManagement.returnMoney") : scope.row.workType == 1 ? $t("platform.refundReturn") : "-" }}
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('workReturn.ticketStatus')" width="100" header-align="center" align="center">
                <template #default="scope">
                    <div>
                        <!-- "待举证" "平台处理中" "工单关闭" "工单已完结" -->
                        {{
                            scope.row.status == 1
                                ? $t("workReturn.toBeProof")
                                : scope.row.status == 2
                                ? $t("workReturn.platformProcessing")
                                : scope.row.status == 3
                                ? $t("platform.ticketClosed")
                                : scope.row.status == 4
                                ? $t("workReturn.theWorkOrderFinished")
                                : ""
                        }}
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="workName" :label="$t('workReturn.questionName')" min-width="200" header-align="center" show-overflow-tooltip></BmTableColumn>
            <BmTableColumn prop="workDesc" :label="$t('workReturn.questionDescription')" min-width="300" header-align="center">
                <template #default="scope">
                    <div>{{ scope.row.workDesc }}</div>
                    <div>
                        <span v-for="(item, i) in scope.row.workMustVouchers" :key="i">
                            <BmImage class="tableImg ml-5" :src="item" :preview-src-list="[item]" />
                        </span>
                    </div>
                    <div>
                        <span v-for="(item, i) in scope.row.workOptionalVouchers" :key="i">
                            <BmImage class="tableImg ml-5" :src="item" :preview-src-list="[item]" />
                        </span>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="responsJudage" :label="$t('workReturn.liabilityDetermination')" header-align="center" min-width="100" align="center">
                <template #default="scope">
                    <div>
                        {{
                            scope.row.status == 1 || scope.row.status == 2
                                ? ""
                                : scope.row.responsJudage == 0
                                ? $t("platform.noResponsibility") //"均无责任"
                                : scope.row.responsJudage == 1
                                ? $t("platform.sellerResponsibility") //"商家责任"
                                : scope.row.responsJudage == 2
                                ? $t("platform.buyerResponsibility") //"买家责任"
                                : scope.row.responsJudage == 3
                                ? $t("platform.workOrderViolation") //"工单违规"
                                : ""
                        }}
                    </div>
                    <div class="light-grey">
                        <!--退款判定0表示无需退款 1退款给买家  -->
                        {{
                            scope.row.status == 1 || scope.row.status == 2
                                ? ""
                                : scope.row.refundJudage == 0
                                ? $t("platform.noRefundRequired")
                                : scope.row.refundJudage == 1
                                ? $t("platform.refundToBuyer")
                                : ""
                        }}
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="buyerUsername" :label="$t('orderQuery.applicant')" header-align="center" align="center">
                <template #default="scope">
                    <div>{{ $t("workReturn.buyer") }}: {{ scope.row.buyerUsername }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="handlerName" :label="$t('workReturn.handler')" header-align="center">
                <template #default="scope">
                    <div>{{ scope.row.handlerName }}</div>
                    <div>{{ scope.row.handleTime }}</div>
                </template>
            </BmTableColumn>
            <!-- <BmTableColumn prop="expirationDate" :label="$t('workReturn.createTime')"label="截止日期" min-width="150" header-align="center"></BmTableColumn> -->
            <BmTableColumn prop="orderSn" :label="$t('workReturn.orderNum')" min-width="250" show-overflow-tooltip header-align="center" align="center"></BmTableColumn>
            <!-- 备注 -->
            <BmTableColumn prop="mallRemark" :label="$t('remark')" :show-overflow-tooltip="true" min-width="50" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn prop="" :label="$t('table.operation')" min-width="100" header-align="center" align="center" fixed="right">
                <template #default="scope">
                    <div class="green cp">
                        <!-- 查看详情 -->
                        <el-button v-permission="'returnManager_workOrder_look'" type="text" @click="checkDetail(scope.row)" class="mb-15">{{ $t("table.detail") }}</el-button>
                        <!-- 处理 -->
                        <el-button v-permission="'returnManager_workOrder_deal'" type="text" @click="disposeJude(scope.row)" v-if="scope.row.status == 2">{{
                            $t("rewardPunishmentManagement.deal")
                        }}</el-button>
                    </div>
                </template>
            </BmTableColumn>
        </BmTable>
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- <el-dialog :title="$t('workReturn.addCredentials')" v-model="dialogFormVisible" @close="closeDialog">
        <div class="dialog_warning mb-25">
            <i class="el-icon-warning"></i><span class="ml-20">{{ $t("workReturn.normTips") }}</span>
        </div>
        <el-form :model="ruleForm" :label-position="labelPosition" :rules="rules" ref="ruleFormR">
            <el-form-item :label="$t('workReturn.reasonForComplaint')" v-if="ruleForm.workName" :label-width="formLabelWidth" prop="workName">
                <el-input v-model="ruleForm.workName" :rows="5" type="textarea" maxlength="500" show-word-limit autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('platform.supplementaryDescription')" :label-width="formLabelWidth" prop="workDesc">
                <el-input v-model="ruleForm.workDesc" :rows="5" type="textarea" maxlength="500" show-word-limit autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('platform.picture')" :label-width="formLabelWidth" prop="img_1">
                <div class="mb-15">
                    <div>1. {{ $t("platform.requiredCredentialsTips") }}</div>
                    <BmUpload @change="onChangeUploadImg_1($event)" :multiple="true" :fileList="ruleForm.img_1" :limit="8" size="xl" />
                </div>
                <div>
                    <div>2.{{ $t("platform.optionalCredentialsTips") }}</div>
                    <BmUpload @change="onChangeUploadImg_2($event)" :multiple="true" :fileList="ruleForm.img_2" :limit="8" size="xl" />
                </div>
            </el-form-item>
        </el-form>
        <div class="dialog_btn" v-if="ruleForm.workName == ''">
            <el-button @click="resetFormDialgo">{{ $t("cancel") }}</el-button>
            <el-button type="primary" @click="submitForm">{{ $t("confirm") }}</el-button>
        </div>
    </el-dialog> -->
    <!-- 查看详情弹窗 -->
    <JudgeDetail v-model:visible="dialogFormVisible" :row="editRow" @judgeJump="judgeJump(id)"></JudgeDetail>
    <!-- 处理 -->
    <BmDialog v-model:visible="visible_judage" :title="$t('workReturn.workOrderProcessing')" :confirm="confirm_judage" :cancel="cancel_judage" :width="800">
        <div class="flex vcenter rejectTips mb-10">
            <span> </span>
            <span class="ml-15">{{ $t("platform.condemnTips") }}</span>
        </div>
        <el-form :model="judageForm" label-width="110" ref="judageFormRef">
            <el-form-item :label="$t('platform.workOrderJudgment')" prop="responsJudage" :rules="judageFormRules.responsJudage">
                <el-radio-group v-model="judageForm.responsJudage">
                    <el-radio label="0">{{ $t("platform.noResponsibility") }}</el-radio>
                    <el-radio label="1">{{ $t("platform.sellerResponsibility") }}</el-radio>
                    <el-radio label="2">{{ $t("platform.buyerResponsibility") }}</el-radio>
                    <el-radio label="3">{{ $t("platform.workOrderViolation") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('platform.fundProcessing')" prop="refundJudage" :rules="judageFormRules.refundJudage">
                <el-select v-model="judageForm.refundJudage" :placeholder="$t('pleaseSelect')">
                    <el-option :label="$t('platform.refundToBuyer')" value="1"></el-option>
                    <el-option :label="$t('platform.noRefundRequired')" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('platform.supplementaryDescription')">
                <el-input v-model="judageForm.addDesc" type="textarea" rows="3" maxlength="255" show-word-limit :placeholder="$t('platform.supplementaryDescriptionTips')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('image')" prop="img">
                <div>{{ $t("platform.requiredCredentialsTips") }}</div>
                <!-- 主要凭证 -->
                <div class="mb-5">
                    <BmUpload @change="onChangeUploadJudageMain($event)" :multiple="true" :fileList="judageForm._tempImg" :limit="8" size="xl" />
                </div>
                <div>{{ $t("platform.optionalCredentialsTips") }}</div>
                <!-- 次要凭证 -->
                <BmUpload @change="onChangeUploadJudageOptional($event)" :multiple="true" :fileList="judageForm._tempImg2" :limit="8" size="xl" />
            </el-form-item>
            <el-form-item :label="$t('remark')">
                <el-input v-model="judageForm.note" type="textarea" rows="3" maxlength="255" show-word-limit :placeholder="$t('platform.remarkTips')"></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import JudgeDetail from "./component/JudgeDetail.vue";
import {
    orderReturnWorkSellerList,
    orderReturnWorkSellerCount,
    orderReturnAddToProof,
    adminSellerFindByConditionsNoPage,
    adminBuyerFindByConditions,
    orderReturnWorkOperatorProcess,
    aftersalesWorkOrderExport
} from "@/api/transaction";
import { exportExcel } from "@/utils/";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
export default {
    name: "wordOrder",
    components: { JudgeDetail },
    setup(props) {
        let { proxy } = getCurrentInstance();
        const router = useRouter();

        //分页
        let pageSize = 10,
            pageTotal = ref(0);

        // 表格数据
        const tableData = ref([]);

        let searchFormRef = ref("");

        let dialogImageUrl = ref("");
        let dialogVisible = ref(false);
        let disabled = ref(false);

        let labelPosition = ref("left");
        let dialogFormVisible = ref(false);

        let formLabelWidth = ref("120px");

        // 0tsin  1fnsku 2upc 3商品编码 4 商品标题 搜索
        const goodsMultiList = computed(() => [
            {
                name: "Tsin", //tsin
                value: 0
            },
            {
                name: "Fnsku", //fnsku
                value: 1
            },
            {
                name: "UPC", //upc
                value: 2
            },
            {
                name: proxy.$t("releaseGoods.goodsCode"), //商品编码
                value: 3
            }
            // {
            //     name: proxy.$t("goodsList.keyword"), //商品标题
            //     value: 4
            // }
        ]);

        let searchForm = reactive({
            _tempTime: [],
            beginTime: null, // 开始时间
            buyerKeyword: null, //	会员信息
            endTime: null, //	结束时间
            orderSn: null, //	订单号
            refundJudage: null, //	退款判定0表示无需退款 1退款给买家
            responsJudage: null, //	责任判定0->均无责任 1->商家责任 2->买家责任
            sellerKeyword: null, //	卖家信息
            status: null, //	工单状态1->待举证 2->等平台处理中 3->工单关闭 4->工单已完毕5->工单违规
            timeType: null, //	时间类型0默认创建时间
            workSn: null, //	工单编号
            pageNum: 1,
            pageSize: pageSize,
            isBeExpire: 0,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        let rules = ref({
            workDesc: [{ required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" }],
            date1: [{ type: "date", required: true, message: proxy.$t("workReturn.pleaseSelectDate"), trigger: "change" }],
            type: [
                {
                    type: "array",
                    required: true,
                    message: proxy.$t("workReturn.pleaseSelectOne"),
                    trigger: "change"
                }
            ]
        });

        let ruleFormR = ref("");
        let ruleForm = reactive({
            workDesc: "",
            orderWorkId: "",
            img_1: [],
            img_2: [],
            workName: ""
        });

        //全选
        let checkedAll = ref(false);
        let isIndeterminate = ref(false);
        let multipleSelection = ref([]);

        const multipleTable = ref(null);

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            // return time.getTime() > Date.now();
        };

        // 工单状态
        const workStatus = computed(() => [
            {
                name: proxy.$t("workReturn.forProof"), // 待举证
                value: "1"
            },
            {
                name: proxy.$t("workReturn.waitingPlatformProcessing"), // 等待平台处理中
                value: "2"
            },
            {
                name: proxy.$t("workReturn.workOrderClose"), // 工单关闭
                value: "3"
            },
            {
                name: proxy.$t("workReturn.theWorkOrderFinished"), // 工单已完毕
                value: "4"
            }
        ]);

        //创建时间
        let timeTypeValue = "createTime";
        let timeTypeName = ref(proxy.$t("createTime"));
        const timeType = computed(() => [
            {
                name: proxy.$t("createTime"), //创建时间
                value: "createTime"
            },
            {
                name: proxy.$t("updateTime"), //更新时间
                value: "updateTime"
            },
            {
                name: proxy.$t("auditTime"), //审核时间
                value: "auditTime"
            },
            {
                name: proxy.$t("putawayTime"), //上架时间
                value: "putawayTime"
            },
            {
                name: proxy.$t("soldoutTime"), //下架时间
                value: "soldoutTime"
            }
        ]);

        const handleCommandTimeType = (item) => {
            timeTypeValue = item.value;
            timeTypeName.value = item.name;
        };

        // 时间
        const changeDate = (val) => {
            console.log("val", val);
        };

        // table 多选
        const handleSelectionChange = (val) => {
            multipleSelection = val;
        };

        // dialog 图片
        const handleRemove = (file) => {};
        const handlePictureCardPreview = (file) => {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        };
        const handleDownload = (file) => {};

        const onChangeUploadImg_1 = (fileList) => {
            ruleForm.img_1 = fileList; // fileList.map((item) => item.url)
        };

        const onChangeUploadImg_2 = (fileList) => {
            ruleForm.img_2 = fileList; // fileList.map((item) => item.url)
        };

        // 举证dialog
        let orderWorkId = "";
        const takePoof = (val) => {
            dialogFormVisible.value = true;
            orderWorkId = val.id;
        };

        const submitForm = () => {
            let form = {
                workDesc: ruleForm.workDesc,
                orderWorkId: orderWorkId,
                workMustVoucher: "",
                workOptionalVoucher: ""
            };
            form.workMustVoucher = ruleForm.img_1.map((item) => item.url).join(",");
            form.workOptionalVoucher = ruleForm.img_2.map((item) => item.url).join(",");
            ruleFormR.value.validate((valid) => {
                if (valid) {
                    orderReturnAddToProof(form).then((res) => {
                        dialogFormVisible.value = false;
                        proxy.$message.success(res.msg);
                        getData();
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        const resetFormDialgo = () => {
            ruleFormR.value.resetFields();
            dialogFormVisible.value = false;
        };
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        // 工单列表
        const getData = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }
            orderReturnWorkSellerList(searchForm).then((res) => {
                pageTotal.value = res.data.total;
                res.data.records.omsOrderReturnWorks.forEach((v) => {
                    v.workMustVouchers = (v.workMustVoucher && v.workMustVoucher.split(",")) || [];
                    v.workOptionalVouchers = (v.workOptionalVoucher && v.workOptionalVoucher.split(",")) || [];
                });
                tableData.value = res.data.records;
            });
            pageFlag.value = false;
        };
        getData();

        // 搜索
        const handelSearch = () => {
            searchForm.beginTime = (searchForm._tempTime[0] && dayjs(searchForm._tempTime[0]).format("YYYY-MM-DD HH:mm:ss")) || "";
            searchForm.endTime = (searchForm._tempTime[1] && dayjs(searchForm._tempTime[1]).format("YYYY-MM-DD HH:mm:ss")) || "";
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            getData();
        };

        //重置
        const resetForm = () => {
            searchForm.beginTime = searchForm.endTime = "";
            searchFormRef.value.resetFields();
            getData();
        };

        // 工单数据统计
        let workCounts = ref({
            workCount: "",
            violateDealRate: "",
            completeRate: "",
            averageDealTime: "",
            averageDealTime: ""
        });
        const getorderReturnWorkListCount = () => {
            orderReturnWorkSellerCount().then((res) => {
                if (res.data == null) {
                    return;
                } else {
                    workCounts.value = res.data;
                }
            });
        };
        getorderReturnWorkListCount();

        // 筛选
        const workStatusChange = (val) => {
            // 清空是否24小时过期状态
            searchForm.isBeExpire = "";
            searchForm.status = val;
            getData();
        };

        // 是否超过期限
        const expireChange = () => {
            // 清空状态条件
            searchForm.status = "";
            if (searchForm.isBeExpire == 1) {
                searchForm.isBeExpire = 0;
            } else {
                searchForm.isBeExpire = 1;
            }
            getData();
        };

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            pageFlag.value = true;
            getData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            getData();
        };
        // 查看详情弹窗数据对象
        let editRow = ref({});
        // 详情
        const checkDetail = (row) => {
            // ruleForm.workDesc = val.workDesc;
            // ruleForm.workName = val.workName;
            // val.workMustVoucher.split(",").forEach((v) => {
            //     ruleForm.img_1.push({ url: v });
            // });
            // val.workOptionalVoucher.split(",").forEach((v) => {
            //     ruleForm.img_2.push({ url: v });
            // });
            // dialogFormVisible.value = true;
            editRow.value = {
                id: row.id,
                status: row.status
            };
            dialogFormVisible.value = true;
        };
        // 关闭查看详情，跳转至处理弹窗
        const judgeJump = (id) => {
            dialogFormVisible.value = false;
            disposeJude({ id });
        };
        const closeDialog = () => {
            ruleForm.img_1 = [];
            ruleForm.img_2 = [];
            resetFormDialgo();
        };

        // 卖家店铺列表
        let storeList = ref([]);
        const getStoreList = (keyword) => {
            adminSellerFindByConditionsNoPage({ storeName: keyword, storeCode: keyword })
                .then((res) => {
                    storeList.value = res.data;
                })
                .catch((err) => {});
        };
        // getStoreList()

        // 用户信息列表
        let buyerList = ref([]);
        const getBuyerList = (val) => {
            adminBuyerFindByConditions({ userInfo: val }).then((res) => {
                buyerList.value = res.data.records;
            });
        };
        // getBuyerList()

        // ------------------判责 处理 --------------------------------
        let visible_judage = ref(false);

        let judageFormRef = ref(null);
        let judageForm = reactive({
            _tempImg: [],
            _tempImg2: [],
            addDesc: "", // 补充描述
            id: "",
            mallMustVoucher: "", // 主要凭证
            mallOptionalVoucher: "", // 次要
            note: "", // 备注
            refundJudage: "", //退款判定0表示无需退款,1 退款给买家
            responsJudage: "" // 责任判定0->均无责任 1->商家责任 2->买家责任 3->工单违规
        });

        const judageFormRules = ref({
            refundJudage: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "blur" }],
            responsJudage: [{ required: true, message: proxy.$t("workReturn.pleaseFillInTheDescribe"), trigger: "blur" }]
        });

        // 判定 主要图片
        const onChangeUploadJudageMain = (fileList) => {
            judageForm._tempImg = fileList;
        };

        // 次要
        const onChangeUploadJudageOptional = (fileList) => {
            judageForm._tempImg2 = fileList;
        };

        const disposeJude = (row) => {
            judageForm.id = row.id;
            visible_judage.value = true;
        };
        // 提交判责
        const confirm_judage = () => {
            judageForm.mallMustVoucher = judageForm._tempImg.map((v) => v.url).join(",");
            judageForm.mallOptionalVoucher = judageForm._tempImg2.map((v) => v.url).join(",");
            delete judageForm._tempImg;
            delete judageForm._tempImg2;
            judageFormRef.value.validate((valid) => {
                if (valid) {
                    if (!judageForm.id) {
                        judageForm.id = editRow.value.id;
                    }
                    orderReturnWorkOperatorProcess(judageForm).then((res) => {
                        visible_judage.value = false;
                        proxy.$message.success(res.msg);
                        getData();
                        judageForm._tempImg = [];
                        judageForm._tempImg2 = [];
                        judageForm.addDesc = "";
                        judageForm.id = "";
                        judageForm.mallMustVoucher = "";
                        judageForm.mallOptionalVoucher = "";
                        judageForm.note = "";
                        judageForm.refundJudage = "";
                        judageForm.responsJudage = "";
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };
        const cancel_judage = () => {
            visible_judage.value = false;
            judageForm._tempImg = [];
            judageForm._tempImg2 = [];
        };
        // 导出excel表格
        const handleExportExcel = (val) => {
            aftersalesWorkOrderExport(searchForm)
                .then((res) => {
                    exportExcel("AfterSalesWorkOrder", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                })
                .catch((err) => {});
        };
        return {
            searchFormRef,
            searchForm,
            timeTypeValue,
            handleCommandTimeType,
            timeType,
            handelSearch,
            resetForm,
            changeDate,
            disabledDate,
            shortcuts,
            timeTypeName,
            tableData,
            handleSelectionChange,
            isIndeterminate,
            checkedAll,
            multipleSelection,
            handleCurrentChange,
            handleSizeChange,
            dialogFormVisible,
            ruleForm,
            ruleFormR,
            formLabelWidth,
            labelPosition,
            dialogImageUrl,
            dialogVisible,
            disabled,
            handleRemove,
            handlePictureCardPreview,
            handleDownload,
            rules,
            resetFormDialgo,
            submitForm,
            workStatus,
            workStatusChange,
            multipleTable,
            pageTotal,
            workCounts,
            takePoof,
            onChangeUploadImg_1,
            onChangeUploadImg_2,
            expireChange,
            checkDetail,
            closeDialog,
            storeList,
            getStoreList,
            buyerList,
            getBuyerList,
            visible_judage,
            disposeJude,
            judageForm,
            judageFormRef,
            judageFormRules,
            confirm_judage,
            cancel_judage,
            onChangeUploadJudageMain,
            onChangeUploadJudageOptional,
            editRow,
            judgeJump,
            handleExportExcel,
            goodsMultiList,
            pageFlag
        };
    }
};
</script>

<style lang="scss" scoped>
// .dialog_warning {
//     height: 31px;
//     line-height: 31px;
//     background: #fffbe6;
//     border-radius: 2px;
//     border: 1px solid #ffe58f;
//     padding-left: 20px;
// }
// .el-icon-warning:before {
//     color: #faad14;
// }
// .dialog_btn {
//     position: relative;
//     bottom: 0px;
//     text-align: center;
// }
.tableImg {
    width: 42px;
    height: 42px;
}
</style>
