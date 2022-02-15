<template>
    <div class="menu-wrapper">
        <template v-for="item in menu">
            <!-- 此菜单下没有子菜单 -->
            <el-menu-item v-if="!item.children && !item.hidden" :key="item.path" :index="parent ? parent + '/' + item.path : item.path">
                <i :class="item.hasOwnProperty('icon') ? item.icon : ''"></i>

                <span>
                    {{ item.hasOwnProperty("name") ? item.name : item.path + "未设置菜单名称" }}
                </span>
            </el-menu-item>

            <!-- 此菜单下只有一个子菜单（根据alone判断是否直接指向该菜单） -->
            <el-menu-item
                v-if="item.children && item.children.length === 1 && !item.hidden && item.alone"
                :key="item.path"
                :index="parent ? parent + '/' + item.path + '/' + item.children[0].path : item.path + '/' + item.children[0].path"
            >
                <i :class="item.children[0].hasOwnProperty('icon') ? item.children[0].icon : ''"></i>
                <span>
                    {{ item.children[0].hasOwnProperty("name") ? item.children[0].name : item.children[0].path + "未设置菜单名称" }}
                </span>
            </el-menu-item>

            <!-- 此菜单下还有子菜单 -->
            <el-submenu
                v-if="item.children && !item.hidden && (item.children.length > 1 || (item.children.length === 1 && !item.alone && typeof item.children[0] !== 'undefined'))"
                :key="item.path"
                :index="parent ? parent + '/' + item.path : item.path"
            >
                <template v-slot:title>
                    <i :class="item.hasOwnProperty('icon') ? item.icon : ''"></i>
                    <span>
                        {{ item.hasOwnProperty("name") ? item.name : item.path + "未设置菜单名称" }}
                    </span>
                </template>
                <sidebar-item :menu="item.children" :parent="parent ? parent + '/' + item.path : item.path" />
            </el-submenu>
            <!-- 递归 -->
        </template>
    </div>
</template>

<script>
import { ElMenuItem, ElSubmenu } from "element-plus";

export default {
    name: "SidebarItem",
    components: { ElMenuItem, ElSubmenu },
    props: ["menu", "parent"]
};
</script>
