<template>
    <div class="app-containei">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="日志查看">
                </el-form-item>
                <el-input type="textarea"  v-model="cmd" :rows="6" placeholder="请输入内容"  resize="vertical"></el-input>



            </el-form>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    data() {
        return {
            runOutPut: '',
            cmd: '',
            admin: false,
            phpRunLog: [],
        };
    },
    mounted() {
        this.loadLog();
    },
    methods: {
        run() {
            let data = {
                admin: this.admin ? 1 : 0,
                cmd: this.cmd,
            };
            revoke('/hall-admin-new/index.php?m=debug&p=Run', data).then(res => {
                if (res.code === 0) {
                    this.runOutPut = '运行时间:' + res.data.runTime + '秒 \r\n' + res.data.runOutPut;
                } else {
                    this.$message.error(res.msg);
                }
                // 重新加载
                this.loadLog();
            });
        },
        SelectLog(row, column, cell, event) {
            this.cmd = row.cmd;
        },
        // 加载历史记录
        loadLog() {
            let data = {};
            revoke('/hall-admin-new/index.php?m=debug&p=getPhpRunLog', data).then(res => {
                if (res.code === 0) {
                    this.phpRunLog = res.data.phpRunLog;
                }
            });
        },
    }
};
</script>