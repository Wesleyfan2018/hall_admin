<template>
    <div class="app-wrapper">
        <el-container style="height:100%;">
            <sidebar />
            <el-container>
                <el-header class="headers">
                    <navbar />
                    <tags-view />
                </el-header>
                <app-main />
            </el-container>
        </el-container>
    </div>
</template>
<script>
// import ajax from '@/utils/ajax';
import { Navbar, AppMain, Sidebar, TagsView } from './components';
export default {
    name: 'Layout',
    components: {
        Navbar,
        AppMain,
        Sidebar,
        TagsView
    },
    data() {
        return {
            dataInfo: null
        };
    },
    methods: {
    }
};
</script>
<style lang="scss">
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    .headers {
        height:70px!important;
        padding:0!important;
    }
}
</style>
