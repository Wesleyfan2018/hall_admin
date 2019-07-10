<template>
    <section class="app-main">
        <div class="app-container">
            <transition name="fade-transform" mode="out-in">
                <keep-alive :include="this.cachedViews">
                    <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
                    <router-view :key="key" />
                    <!-- </el-scrollbar> -->
                </keep-alive>
            </transition>
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex';
import router from '@/router';
export default {
    name: 'AppMain',
    computed: {
        ...mapState({
            cachedViews: state => state.tagsview.cachedViews,
        }),
        key() {
            return router.path;
        }
    }
};
</script>

<style scoped>
.app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 110px);
    width: 100%;
    position: relative;
    overflow: auto;
    background-color: #f0f2f5;
}
.app-container {
    min-height: calc(100vh - 140px);
    margin: 30px;
    margin-bottom: 0;
    background-color: #fff;
}
.fixed-header+.app-main {
    padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
</style>
