<template>
    <div class="app-wrapper">
        <el-container style="height:100%;">
            <sidebar style="width:200px;height:100%;" />
            <el-container style="width:200px;height:100%;">
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
import { Navbar, AppMain, Sidebar, TagsView } from './components'
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
        }
    },
    created() {
        // console.log(
        //     'created Layout Page ',
        //     this.$route.name,
        //     this.$route.meta,
        //     this.$route.meta.keepAlive
        // )
    },
    updated() {
        // console.log(
        //     'updated Layout Page ',
        //     this.$route.name,
        //     this.$route.meta.keepAlive
        // )
    },
    activated() {
        // console.log(
        //     'activated Layout Page ',
        //     this.$route.name,
        //     this.$route.meta.keepAlive
        // )
    },
    methods: {}
}
</script>
<style lang="scss">
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    .headers {
        height: 80px !important;
        padding: 0 !important;
    }
}
</style>
