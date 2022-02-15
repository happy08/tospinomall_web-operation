<template>
    <!-- 评价管理 -->
    <div class="top-search-form">
        <BmBreadcrumb />
        <div>
            <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
                <el-row el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <!-- 商品类目 -->
                        <el-form-item :label="$t('goods.category')" prop="categoryId">
                            <el-cascader
                                v-model="searchForm.categoryId"
                                :options="categoryList"
                                :props="{ checkStrictly: false, value: 'id', label: 'cnName' }"
                                clearable
                                filterable
                                :show-all-levels="false"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <!-- 时间 -->
                        <el-form-item prop="_tmpTimeValue">
                            <template #label>
                                <el-select v-model="searchForm.timeType" :placeholder="$t('pleaseSelect')">
                                    <el-option :label="$t('commentManagent.evaluationTime')" value="1"> </el-option>
                                    <el-option :label="$t('commentManagent.reviewTime')" value="2"> </el-option>
                                </el-select>
                            </template>
                            <el-date-picker
                                v-model="searchForm._tmpTimeValue"
                                type="datetimerange"
                                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                                :start-placeholder="$t('startDate')"
                                range-separator="-"
                                :end-placeholder="$t('endDate')"
                                :shortcuts="shortcuts"
                                :disabled-date="disabledDate"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('commentManagent.memberInfo')" prop="userKeyword">
                            <el-input v-model="searchForm.userKeyword" :placeholder="$t('commentManagent.pleaseEnterMemberAccount')" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('commentManagent.auditStatus')">
                            <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, i) in appraiseList" :label="item.label" :value="item.value" :key="i"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div id="elCollapse" class="h-0 hidden">
                    <el-row el-row :gutter="24">
                        <el-col :md="12" :lg="6">
                            <el-form-item :label="$t('commentManagent.screenSellers')" prop="sellerKeyword">
                                <BmSelectRemote
                                    v-model="searchForm.shopId"
                                    :remoteApi="adminSellerFindByConditionsNoPage"
                                    :keyword="['storeName', 'storeCode']"
                                    :option="{ label: 'storeName', value: 'id' }"
                                >
                                </BmSelectRemote>
                            </el-form-item>
                        </el-col>

                        <!-- <el-col :md="12" :lg="6">
                            <el-form-item :label="$t('commentManagent.goodsInfo')" prop="goodKeyword">
                                <el-input v-model="searchForm.goodKeyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
                            </el-form-item>
                        </el-col> -->

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
                            <el-form-item :label="$t('commentManagent.keyword')" prop="keyword">
                                <el-input v-model="searchForm.keyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :md="12" :lg="6">
                            <el-form-item :label="$t('commentManagent.whetherToBlock')">
                                <el-select v-model="searchForm.isShield" :placeholder="$t('pleaseSelect')">
                                    <el-option label="否" value="0"></el-option>
                                    <el-option label="是" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row el-row :gutter="24">
                        <el-col :md="12" :lg="6">
                            <el-form-item :label="$t('commentManagent.orderSN')" prop="orderKeyword">
                                <el-input v-model="searchForm.orderKeyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
                            </el-form-item>
                        </el-col>

                        <!-- 投诉状态 -->
                        <el-col :md="12" :lg="6">
                            <el-form-item :label="$t('commentManagent.complaintStatus')" prop="">
                                <el-select v-model="searchForm.complaintStatus" :placeholder="$t('pleaseSelect')">
                                    <el-option v-for="(item, i) in complaintList" :label="item.label" :value="item.value" :key="i"></el-option>
                                </el-select>
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
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between vtop">
            <div class="mb-5 p-5">
                <div class="flex vtop">
                    <el-radio-group v-model="searchForm.hasType" @change="changehasType">
                        <el-radio-button label="">{{ $t("commentManagent.all") }}</el-radio-button>
                        <el-radio-button label="1">{{ $t("commentManagent.havePicture") }}</el-radio-button>
                        <el-radio-button label="2">{{ $t("commentManagent.haveVideo") }}</el-radio-button>
                        <el-radio-button label="3">{{ $t("commentManagent.unanswered") }}</el-radio-button>
                        <el-radio-button label="4">{{ $t("commentManagent.replied") }}</el-radio-button>
                        <el-radio-button label="5">{{ $t("commentManagent.haveReview") }}</el-radio-button>
                        <el-radio-button label="6">{{ $t("commentManagent.reported") }}</el-radio-button>
                        <el-radio-button label="7">{{ $t("commentManagent.mainCommentHasText") }}</el-radio-button>
                        <el-radio-button label="8">{{ $t("commentManagent.haveVideoOrImg") }}</el-radio-button>
                    </el-radio-group>
                    <div class="ml-20 mt-10" style="white-space:nowrap;">{{ $t("commentManagent.pendingComplaint") }}({{ evaluatePendingCount.oneStarsStatistical }})</div>
                </div>
                <div class="mt-10">
                    <el-radio-group v-model="searchForm.goodsScores" @change="initData()" class="mr-15 mb-10">
                        <el-radio-button label="">{{ $t("commentManagent.all") }}</el-radio-button>
                        <el-radio-button label="1">{{ $t("commentManagent.oneStar") }}({{ evaluateLabelCount.oneStarsStatistical }})</el-radio-button>
                        <el-radio-button label="2">{{ $t("commentManagent.twoStar") }}({{ evaluateLabelCount.twoStarsStatistical }})</el-radio-button>
                        <el-radio-button label="3">{{ $t("commentManagent.threeStar") }}({{ evaluateLabelCount.threeStarsStatistical }})</el-radio-button>
                        <el-radio-button label="4">{{ $t("commentManagent.fourStar") }}({{ evaluateLabelCount.fourStarsStatistical }})</el-radio-button>
                        <el-radio-button label="5">{{ $t("commentManagent.fiveStar") }}({{ evaluateLabelCount.fiveStarsStatistical }})</el-radio-button>
                    </el-radio-group>
                    <el-radio-group v-model="timeShortcuts" @change="timeShortcutsChange" class=" mb-10">
                        <el-radio-button label="">{{ $t("commentManagent.all") }}</el-radio-button>
                        <el-radio-button label="30">{{ $t("commentManagent.nearly30Days") }}</el-radio-button>
                        <el-radio-button label="90">{{ $t("commentManagent.nearly90Days") }}</el-radio-button>
                        <el-radio-button label="180">{{ $t("commentManagent.nearly180Days") }}</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div class="mb-5 p-5">
                <div class="tr" style="white-space:nowrap;">
                    <el-button v-permission="'orderManagement_evaluate_batchAudit'" @click="handleAudit">{{ $t("commentManagent.batchReview") }}</el-button>
                </div>
                <div class="mt-10"></div>
            </div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%">
            <BmTableColumn type="selection"></BmTableColumn>
            <BmTableColumn prop="name" :label="$t('commentManagent.evaluationDetails')" min-width="480" show-overflow-tooltip>
                <template #default="scope">
                    <div class="flex vcenter mb-10 light-grey">
                        <span :class="scope.row.complaintStatus == 1 ? 'red' : scope.row.complaintStatus == 2 ? 'orange' : 'black'" class="mr-25">
                            <!-- 投诉状态: 0->正常 1->待处理 2->已驳回 3->已处理 -->
                            {{ scope.row.complaintStatus == 1 ? $t("commentManagent.complaintsPending") : "" }}
                            <!-- {{
                                scope.row.complaintStatus == 0
                                    ? $t("commentManagent.normal")
                                    : scope.row.complaintStatus == 1
                                    ? $t("commentManagent.pending")
                                    : scope.row.complaintStatus == 2
                                    ? $t("commentManagent.rejected")
                                    : scope.row.complaintStatus == 3
                                    ? $t("commentManagent.processed")
                                    : ""
                            }} -->
                        </span>
                        <span>{{ $t("commentManagent.commentId") }}: {{ scope.row.buyerId }}</span>
                        <span class="ml-25">{{ $t("commentManagent.likes") }}: ({{ scope.row.glike }})</span>
                        <span class="ml-15">{{ scope.row.hasReview == 0 ? $t("commentManagent.noReview") + ":" : scope.row.hasReview == 1 ? $t("commentManagent.haveReview") + ":" : "" }}</span>
                        <span class="green">({{ scope.row.additionalEvaluates.length > 0 ? scope.row.additionalEvaluates.length : "0" }})</span>
                        <span v-if="scope.row.status == 0" class="green">{{ $t("commentManagent.pendingReview") }}</span>
                    </div>
                    <div class="flex vcenter user mb-10 pb-5 light-grey">
                        <span>{{ $t("commentManagent.commodityEvaluationScore") }}: </span><el-rate disabled v-model="scope.row.goodsScores" class="ml-10"></el-rate>
                        <span class="ml-10">{{ $t("commentManagent.logisticsScore") }}: </span><el-rate disabled v-model="scope.row.expressScores" class="ml-10"></el-rate>
                        <!-- <span class="ml-10">{{ $t("commentManagent.serviceScore") }}: </span><el-rate disabled v-model="scope.row.serviceScores" class="ml-10"></el-rate> -->
                    </div>

                    <div class="mb-10 ">{{ scope.row.content }}</div>
                    <div class="mb-10">
                        <template v-for="(item, i) in scope.row.pictures" :key="i">
                            <BmImage
                                v-if="item.fileType == 1"
                                class="img_info mr-5 mb-5"
                                :src="item.imgUrl"
                                :preview-src-list="scope.row.pictures.filter((item) => item.fileType == 1).map((item) => item.imgUrl)"
                            />
                            <div v-else>
                                <video :src="item.imgUrl" controls="controls" class="mr-5 mb-5" :height="100">your browser does not support the video tag</video>
                            </div>
                        </template>
                    </div>
                    <div>
                        <span>{{ scope.row.createTime }}</span>
                    </div>
                </template>
            </BmTableColumn>

            <!-- 商品信息 -->
            <BmTableColumn prop="" :label="$t('orderQuery.goodsInfo')" align="center" min-width="350">
                <template #default="scope">
                    <div>
                        <div class="flex">
                            <div class="imgInfo">
                                <BmImage class="img_info" :src="scope.row.goodPicture" :preview-src-list="[scope.row.goodPicture]" />
                            </div>
                            <div class="ml-10 pr-10" style="text-align: left;">
                                <div>{{ $t("orderQuery.orderNumber") }}: {{ scope.row.orderSn }}</div>
                                <div>{{ scope.row.goodTitle }}</div>
                                <div>TSIN: {{ scope.row.tsin }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn :prop="rateTypeList[columnIndex].field" width="180" align="center">
                <template #header>
                    <el-dropdown @command="handleCommandColumn">
                        <span>
                            {{ rateTypeList[columnIndex].name }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="item in rateTypeList" :key="item.field" :command="item">{{ item.name }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
                <template #default="scope">
                    <el-rate v-model="scope.row[rateTypeNumber]" disabled></el-rate>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="" :label="$t('copingManagement.memberInfo')" align="center" width="100">
                <template #default="scope">
                    <div>{{ scope.row.buyerName }}</div>
                    <div>{{ scope.row.buyerPhone }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="" :label="$t('commentManagent.whetherToBlock')" align="center" width="100">
                <template #default="scope">
                    <div>
                        {{ scope.row.isShield == 0 ? $t("no") : scope.row.isShield == 1 ? $t("yes") : "" }}
                    </div>
                    <div v-if="scope.row.isShield == 1" class="green">
                        <el-popover placement="right" trigger="click" :content="scope.row.blockingReason.mark">
                            <template #reference>
                                <div>{{ $t("commentManagent.reasonForBlocking") }}</div>
                            </template>
                        </el-popover>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 审核状态 -->
            <BmTableColumn prop="" :label="$t('commentManagent.auditStatus')" align="center" width="100">
                <template #default="scope">
                    <div>{{ scope.row.statusName }}</div>
                    <div v-if="scope.row.status == 3">
                        <el-popover placement="right" :width="400" trigger="click">
                            <template #reference>
                                <div>{{ $t("commentManagent.denialReason") }}</div>
                            </template>
                            <div>{{ scope.row.explainFirst }}</div>
                        </el-popover>
                    </div>
                    <div v-if="scope.row.complaintStatus == 1" class="green">
                        {{ $t("commentManagent.complaintsPending") }}
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="" :label="$t('table.operation')" align="center" width="140" fixed="right">
                <template #default="scope">
                    <!-- 屏蔽  v-if="(scope.row.status == 1 || scope.row.status == 2) && scope.row.isShield == 0"-->
                    <el-button v-permission="'orderManagement_evaluate_shield'" type="text" v-if="scope.row.isShield == 0" @click="handleShield(scope.row)">{{ $t("status.shield") }}</el-button
                    ><br />
                    <!-- 审核 -->
                    <el-button v-permission="'orderManagement_evaluate_audit'" type="text" v-if="scope.row.status == 1" @click="handleAudit(scope.row)">{{ $t("status.audit") }}</el-button
                    ><br />
                    <!-- 查看详情 -->
                    <el-button type="text" @click="handleDetail(scope.row)">{{ $t("table.detail") }}</el-button
                    ><br />
                    <!-- 查看操作记录 -->
                    <el-button type="text" @click="handleLog(scope.row)">{{ $t("commentManagent.viewOperationRecords") }}</el-button
                    ><br />
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchForm.pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 屏蔽评价 -->
    <BmDialog v-model:visible="visible" :title="$t('commentManagent.blockEvaluation')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form :model="shieldForm" ref="shieldRef" label-width="80px">
            <el-form-item :label="$t('commentManagent.reasonForBlocking')" prop="mark" :rules="shieldRules.required">
                <el-input :placeholder="$t('pleaseEnter')" v-model="shieldForm.mark" type="textarea" maxlength="300" :rows="5" show-word-limit />
            </el-form-item>
        </el-form>
    </BmDialog>

    <!-- 批量审核 -->
    <Audit v-model:visible="auditVisible" :rows="auditRows" @reloadData="initData" />

    <!-- 查看详情 -->
    <Detail v-model:visible="detailVisible" :row="detailRow" @reloadData="initData" />

    <!-- 操作记录 -->
    <BmDialog v-model:visible="logVisible" :title="$t('commentManagent.operationRecords')" :cancel="cancelLog" :noConfirm="true" :width="600">
        <el-timeline>
            <el-timeline-item v-for="(activity, index) in activities" :key="index" :color="activity.color">
                <span>{{ activity.updateTime }}</span>
                <span class="ml-10">{{ activity.operatorName }}</span>
                <span class="ml-10">{{ activity.typeName }}</span>
                <span class="ml-10">{{ activity.mark }}</span>
            </el-timeline-item>
        </el-timeline>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
import { dateShortcuts } from "@/utils/dateShortcuts";
import {
    evaluatesSellerList,
    getsCategoryListTree,
    adminSellerFindByConditionsNoPage,
    getDictByType,
    productEvaluateShielding,
    productEvaluateLog,
    productEvaluateLabelCount,
    productEvaluatePendingCount
} from "@/api/transaction";
import Audit from "./component/audit";
import Detail from "./component/detail";
export default {
    name: "commentManagerment",
    components: { Audit, Detail },
    setup(props) {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            getDictType();
            initData();
        });
        //分页
        let pageTotal = ref(0);

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
            // {
            //     name: "UPC", //upc
            //     value: 2
            // },
            {
                name: proxy.$t("releaseGoods.goodsCode"), //商品编码
                value: 3
            }
            // {
            //     name: proxy.$t("goodsList.keyword"), //商品标题
            //     value: 4
            // }
        ]);

        //搜索
        let searchFormRef = ref(null);
        let searchForm = reactive({
            _tmpTimeValue: [],
            pageNum: 1,
            pageSize: 10,

            beginTime: "", //	开始时间
            categoryId: "", //	商品类目
            complaintStatus: "", //	投诉状态: 0->正常 1->待处理 2->已驳回 3->已处理
            createTime: "", //	创建时间
            createUser: "", //	创建人
            delFlag: "", //	删除状态
            endTime: "", //	结束时间
            explainType: "", //	类型 （1好评 2中评 3差评）
            goodKeyword: "", //	商品关键字，商品名称/商品tsin
            goodsId: "", //	商品ID	query
            goodsScores: "", //	商品评分（1-5分）
            hasType: "", //	筛选: 1->有图片 2->有视频 3->未回复 4->已回复 5->有追评 6->已举报 7->主评有文字 8->有视频/有图片
            id: "", //	主键
            isShield: "", //	是否屏蔽（0否 1是）
            orderKeyword: "", //	订单号
            shopId: "", //	店铺ID
            sortType: "", //	排序: 0->默认排序 1->最新创建时间排序
            status: "", //	1->待审核 2->审核通过(可以显示在前端) 3->审核不通过
            timeType: "", //	时间类型 1->表示评价时间 2->追评时间
            updateTime: "", //	更新时间
            updateUser: "", //	更新人
            userKeyword: "", // 会员关键字
            timeType: "1", // 时间类型 1.评价时间 2.追评时间
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        //商品类目列表
        let categoryList = ref([]);
        const getCategoryListTree = () => {
            getsCategoryListTree({ status: 1 })
                .then((res) => {
                    categoryList.value = res.data;
                })
                .catch((err) => {});
        };
        getCategoryListTree();

        //数据字典
        let appraiseList = ref([]);
        let complaintList = ref([]);
        const getDictType = () => {
            // 获取 评价 审核状态
            getDictByType("evaluate_approve_status")
                .then((res) => {
                    appraiseList.value = res.data;
                })
                .catch((err) => {});
            // 获取 评价投诉审核状态
            getDictByType("evaluate_reports_approve_status")
                .then((res) => {
                    complaintList.value = res.data;
                })
                .catch((err) => {});
        };
        getDictType();

        // 获取星级标签统计
        let evaluateLabelCount = ref({});
        const getProductEvaluateLabelCount = () => {
            productEvaluateLabelCount()
                .then((res) => {
                    evaluateLabelCount.value = res.data;
                })
                .catch((err) => {});
        };
        getProductEvaluateLabelCount();

        // 获取待处理统计
        let evaluatePendingCount = ref("");
        const getProductEvaluatePendingCount = () => {
            productEvaluatePendingCount()
                .then((res) => {
                    evaluatePendingCount.value = res.data;
                })
                .catch((err) => {});
        };
        // 是否改变搜索页码数据控制变量
        let pageFlag = ref(false);
        // 获取table分页数据
        let tableData = ref([]);
        const initData = () => {
            // 判断是否需要改变分页数据
            if (!pageFlag.value) {
                searchForm.pageNum = 1;
            }
            getProductEvaluatePendingCount(); //获取待处理统计
            if (searchForm._tmpTimeValue.length <= 0) {
                searchForm.timeType = "";
            }

            evaluatesSellerList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in appraiseList.value) {
                            if (item.status == appraiseList.value[i].value) {
                                item.statusName = appraiseList.value[i].label;
                                break;
                            }
                        }
                        return item;
                    });
                })
                .catch(() => {});
            pageFlag.value = false;
        };
        initData();

        //搜索
        const handelSearch = () => {
            searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[0], true);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[1], true);
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            initData();
        };

        //重置
        const resetForm = () => {
            searchForm.beginTime = "";
            searchForm.endTime = "";
            searchFormRef.value.resetFields();
            initData();
        };

        // 评论筛选
        const changehasType = (val) => {
            searchForm.hasType = val;
            initData();
        };

        //表格时间切换
        let columnIndex = ref(0);
        const handleCommandColumn = (item) => {
            columnIndex.value = item.value;
        };

        // 表格满意度切换
        const rateTypeList = computed(() => [
            {
                name: proxy.$t("evaluationManagement.serviceSatisfactionOfDeliveryPersonnel"), //配送人员的服务满意度
                value: 0,
                field: "distServiceScores"
            },
            {
                name: proxy.$t("evaluationManagement.expressPackagingSatisfaction"), //快递包装满意度
                value: 1,
                field: "expressPackingScores"
            },
            {
                name: proxy.$t("evaluationManagement.deliverySpeedSatisfaction"), //送货服务
                value: 2,
                field: "logisticsScores"
            }
        ]);

        const rateTypeNumber = computed(() => rateTypeList.value[columnIndex.value].field);

        // 时间快捷筛选
        let timeShortcuts = ref(""); //近30天 近90天 近180天
        const timeShortcutsChange = (days) => {
            if (days) {
                let start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
                searchForm.beginTime = formatDate(start) + " 00:00:00";
                searchForm.endTime = proxy.utils.formatStandardDate(new Date(), true);
            } else {
                searchForm.beginTime = "";
                searchForm.endTime = "";
            }
            initData();
        };

        //格式化日期：yyyy-MM-dd
        function formatDate(date) {
            let myyear = date.getFullYear();
            let mymonth = date.getMonth() + 1;
            let myweekday = date.getDate();

            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return myyear + "-" + mymonth + "-" + myweekday;
        }

        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
        };

        // 屏蔽评价
        let shieldRef = ref(null);
        const shieldRules = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" },
            isSelect: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }
        });
        const shieldForm = reactive({
            mark: "",
            id: ""
        });
        let visible = ref(false);
        let shiedReasonId = "";
        const handleShield = (val) => {
            shiedReasonId = val.id;
            visible.value = true;
        };
        const confirm = () => {
            shieldForm.id = shiedReasonId;
            shieldRef.value.validate((valid) => {
                if (valid) {
                    productEvaluateShielding(shieldForm)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            visible.value = false;
                            initData();
                        })
                        .catch(() => {});
                } else {
                    return false;
                }
            });
        };
        const cancel = () => {
            visible.value = false;
        };

        // 批量审核
        let auditVisible = ref(false);
        let auditRows = ref([]);
        const handleAudit = (row) => {
            if (row && row.id) {
                auditRows.value = [row];
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                } else {
                    auditRows.value = tableSelectionRows;
                }
            }
            auditVisible.value = true;
        };

        //查看操作记录
        let logVisible = ref(false);
        let activities = ref([]);
        const handleLog = (row) => {
            productEvaluateLog({ id: row.id }).then((res) => {
                logVisible.value = true;
                res.data.forEach((v) => {
                    v.color = "#f2f2f2";
                });
                activities.value = res.data;
                activities.value[0].color = "#0bbd87";
            });
        };
        const cancelLog = () => {
            logVisible.value = false;
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = row;
            detailVisible.value = true;
        };

        //分页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            pageFlag.value = true;
            initData();
        };

        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            initData();
        };

        return {
            initData,
            searchFormRef,
            searchForm,
            handelSearch,
            resetForm,
            categoryList,
            adminSellerFindByConditionsNoPage,
            appraiseList,
            complaintList,
            changehasType,
            rateTypeList,
            handleCommandColumn,
            rateTypeNumber,
            columnIndex,
            timeShortcutsChange,
            handleShield,
            visible,
            confirm,
            cancel,
            shieldRef,
            shieldRules,
            shieldForm,
            auditVisible,
            auditRows,
            handleAudit,
            handleSelectionChange,
            pageTotal,
            evaluateLabelCount,
            evaluatePendingCount,
            tableData,
            auditVisible,
            timeShortcuts,
            shortcuts,
            disabledDate,
            handleCurrentChange,
            handleSizeChange,
            activities,
            handleLog,
            cancelLog,
            logVisible,
            detailVisible,
            detailRow,
            handleDetail,
            goodsMultiList,
            pageFlag
        };
    }
};
</script>

<style lang="scss" scoped>
.user {
    // height: 54px;
    // line-height: 54px;
    border-bottom: 1px solid #e8e8e8;
}
.cells {
    position: relative;
    float: right;
}
.img_info {
    width: 60px;
    height: 60px;
    border-radius: 2px;
}
</style>
