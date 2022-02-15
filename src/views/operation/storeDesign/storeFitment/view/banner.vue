<template>
    <div class="bg-light-grey">
        <el-carousel v-if="datas && datas.componentDetails.length > 0" :height="isMobile ? '200px' : '500px'">
            <el-carousel-item v-for="(item, index) in datas.componentDetails" :key="index">
                <BmImage
                    :src="item.imageUrl || require('@/assets/img/default.png')"
                    @click="handleLink(item)"
                    fit="cover"
                    style="width:100%;height:100%"
                    :class="item.imageLinkType != -1 ? 'cp' : ''"
                />
            </el-carousel-item>
        </el-carousel>
        <div v-else class="flex center tc bg-light-grey" :style="{ height: isMobile ? '200px' : '500px' }">
            <i class="el-icon-picture light-grey" style="font-size:80px"></i>
        </div>
    </div>
</template>

<script>
import { inject } from "vue";
import { ElCarousel, ElCarouselItem } from "element-plus";

export default {
    name: "Banner",
    components: { ElCarousel, ElCarouselItem },
    props: {
        datas: Object,
        websiteUrl: {
            type: String,
            default: ""
        }
    },
    setup(props) {
        const isMobile = inject("isMobile");
        const isPreview = inject("isPreview");

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
                    window.open(`${pathSearch}?navCategoryIds=${frontMenuValue.join(",")}`);
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

                    window.open(`${pathSearch}?${categoryIds}=${serverMenuValue.join(",")}`);
                    break;
                case 3:
                    window.open(`${pathSearch}?${brandIds}=${item.brandIds}`);
                    break;
                case 4:
                    window.open(`${pathSearch}?deliveryType=2&${countryCodes}=${item.fbtCountrys}`);
                    break;
                case 5:
                    window.open(`${pathSearch}?deliveryType=1&${countryCodes}=${item.fbmCountrys}`);
                    break;
                case 5:
                    window.open(item.outerLink);
                    break;

                default:
                    break;
            }
        };

        return {
            isMobile,
            handleLink
        };
    }
};
</script>

<style lang="scss" scoped></style>
