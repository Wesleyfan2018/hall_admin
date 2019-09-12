<template>
    <div class="app-containei">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="文件变动">
                </el-form-item>
                <el-input type="textarea"  v-model="cmd" :rows="6" placeholder="请输入内容"  resize="vertical"></el-input>

                <el-button type="success" style="margin: 8px 0px 0px 0px" size="small" @click="run">查看</el-button>



            </el-form>
    </div>
</template>
<script>
// import { revoke } from '@/api/getApi';

export default {
    data() {
        return {
            runOutPut: '',
            cmd: '',
            admin: false,
            phpRunLog: [],
        };
    },

};
</script>