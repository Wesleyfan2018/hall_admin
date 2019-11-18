<template>
    <div class="app-containei">
        <el-form :inline="false" class="demo-form-inline">
            <el-form-item label="Hall-Main接口测试"></el-form-item>

            <el-form-item label="请求方法：">
                <el-select
                    v-model="module_name"
                    placeholder="请选择模块"
                    class="nav-select"
                    @change="selectModule"
                >
                    <el-option v-for="(i) in modules" :key="(i)" :label="i" :value="i"></el-option>
                </el-select>

                <el-select v-model="method" placeholder="请选择方法" class="nav-select">
                    <el-option v-for="(i, t) in methods" :key="(i, t)" :label="i" :value="i"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="参数(json):">
                <el-input
                    type="textarea"
                    class="form-input"
                    v-model="args"
                    :rows="2"
                    placeholder="请求参数"
                    resize="vertical"
                ></el-input>
            </el-form-item>

            <el-form-item label="返回:">
                <el-input
                    type="textarea"
                    class="form-input"
                    v-model="out"
                    :rows="2"
                    placeholder="返回内容"
                    resize="vertical"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="success"
                    style="margin: 8px 0px 0px 0px"
                    size="small"
                    @click="run"
                >请求</el-button>
            </el-form-item>

            <el-form-item label="历史记录"></el-form-item>
            <el-table :data="ReqLog" style="width: 100%" @cell-click="SelectLog">
                <el-table-column prop="api" label="API"></el-table-column>
                <el-table-column prop="args" label="请求参数"></el-table-column>
            </el-table>
        </el-form>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi'

export default {
    data() {
        return {
            modules: [],
            methods: [],
            module_name: '',
            method: '',
            args: '{}',
            out: '',
            ReqLog: []
        }
    },
    mounted() {
        this.selectOption()
        this.loadLog()
    },
    methods: {
        run() {
            let data = {
                callm: this.module_name,
                callp: this.method,
                args: this.args
            }
            revoke('/index.php?m=ApiTest&p=Req', data).then(res => {
                if (res.code === 0) {
                    this.out = res.data.back
                } else {
                    this.$message.error(res.msg)
                }
                // 重新加载
                this.loadLog()
            })
        },
        selectOption() {
            let data = {
                callm: 'ApiTest',
                callp: 'getModules',
                args: JSON.stringify({})
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.modules = res.data.modules
                }
            })
        },
        selectModule(val) {
            let data = {
                callm: 'ApiTest',
                callp: 'getMethods',
                args: JSON.stringify({ module_name: val })
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.methods = res.data.methods
                    this.method = ''
                }
            })
        },
        // 加载历史记录
        loadLog() {
            let data = {}
            revoke('/index.php?m=ApiTest&p=getReqLog', data).then(res => {
                if (res.code === 0) {
                    this.ReqLog = res.data.reqLog
                }
            })
        },
        SelectLog(row, column, cell, event) {
            let api = row.api.split('.')
            this.module_name = api[0]
            this.method = api[1]
            this.args = row.args
        }
    }
}
</script>


<style>
.text-right {
    float: right;
}
.pagination {
    margin: 20px 0;
}
.nav-select {
    width: 100px;
    margin: 0 5px 10px 0;
}
.nav-input {
    width: 150px;
    margin: 0 5px 10px 0;
}
.dialog-form {
    margin: 20px;
}
.form-input {
    width: 400px !important;
}
</style>