<template>
    <el-dialog v-bind="$attrs" v-model="visible" :custom-class="title !== '' ? 'has-title' : ''" :before-close="beforeClose" :top="top">
        <template #title> {{ title }} </template>
        <slot></slot>

        <template #footer v-if="showFooter">
            <slot name="footer">
                <div class="flex hcenter vcenter">
                    <el-button @click="handelCancel">{{ cancelText || $t("cancel") }}</el-button>
                    <el-button v-if="!noConfirm" type="primary" @click="handelConfirm">
                        {{ confirmText || $t("confirm") }}
                    </el-button>
                </div>
            </slot>
        </template>
    </el-dialog>
</template>

<script>
export default {
    name: "BmDialog",
    props: {
        visible: {
            type: Boolean,
            default: true
        },
        //标题
        title: {
            type: String,
            default: ""
        },
        //距顶
        top: {
            type: String,
            default: "8vh"
        },
        //是否显示footer
        showFooter: {
            type: Boolean,
            default: true
        },
        //取消文字
        cancelText: {
            type: String,
            default: ""
        },
        //确认文字
        confirmText: {
            type: String,
            default: ""
        },
        //无确认按钮
        noConfirm: {
            type: Boolean,
            default: false
        },
        //取消
        cancel: {
            type: Function,
            default: () => {
                return true;
            }
        },
        //确认
        confirm: {
            type: Function,
            default: () => {
                return true;
            }
        },
        //关闭前校验
        beforeClose: {
            type: Function,
            default: () => {
                return true;
            }
        }
    },
    setup(props, context) {
        const close = () => {
            context.emit("update:visible", false);
        };

        //取消
        const handelCancel = () => {
            if (typeof props.beforeClose === "function") {
                if (props.beforeClose() && typeof props.cancel === "function") {
                    props.cancel();
                    close();
                }
            } else {
                typeof props.cancel === "function" && props.cancel();
                close();
            }
        };

        //确认
        const handelConfirm = () => {
            typeof props.confirm === "function" && props.confirm();
        };

        //关闭前
        const beforeClose = () => {
            handelCancel();
        };

        return {
            handelCancel,
            handelConfirm,
            beforeClose
        };
    }
};
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.el-dialog .el-dialog__header {
    height: 50px;
    padding: 12px 20px;
    font-size: 16px;
    .el-dialog__headerbtn {
        top: 12px;
        .el-dialog__close {
            font-size: 26px;
            color: #666666;
        }
    }
}
.el-dialog.has-title {
    .el-dialog__header {
        background: #f7f7f7;
    }
}
</style>
