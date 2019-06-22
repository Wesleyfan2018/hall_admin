<template>
    <div class="app-wrapper">
        <el-container style="height:100%;">
            <el-aside width="200px" style=" background-color: #D3DCE6;">Aside</el-aside>
            <el-container>
                <el-header style="padding:0;">
                    <navbar />
                </el-header>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
// import ajax from '@/utils/ajax';
import { Navbar } from './components';
export default {
    name: 'Layout',
    components: {
        Navbar
    },
    data() {
        return {
            dataInfo: null
        };
    }
};
</script>

<style lang="scss">
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>
