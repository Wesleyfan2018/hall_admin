<template>
    <div class="app-containei">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="发布日志">
                </el-form-item>
                <el-table border :data="logs">
                <el-table-column align="center" label="id" prop="id" width="50">
                </el-table-column>
                <el-table-column align="left" label="table" prop="table" width="150">
                </el-table-column>
                <el-table-column align="center" label="key" prop="key">
                </el-table-column>
              <el-table-column align="center" label="审批信息" prop="approverName" width="300">
                </el-table-column>

                <el-table-column align="center" label="状态" prop="statusName" width="120">
                </el-table-column>
                 <el-table-column align="center" label="申请时间" prop="cTimeFmt" >
                </el-table-column>
                 <el-table-column align="center" label="发布时间" prop="sTimeFmt" >
                </el-table-column>
                <el-table-column align="center" label="操作人" prop="adminName">
                </el-table-column>
                 <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button  size="mini" type="primary" @click="diff(scope.row)">对比</el-button>
                   </template>
                </el-table-column>

            </el-table>
            <div class="block pagination">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :pager-count="5"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage">
                </el-pagination>
            </div>

            </el-form>
              <el-dialog title="配置对比" :visible.sync="diffVisble" width="70%" :append-to-body="false" :close-on-click-modal="false">
              <section  class="publish">
                  <div class="diff_title">老代码</div>
                  <div class="diff_title">新代码</div>
                  <vue-code-diff :old-string="oldJson" :new-string="newJson" outputFormat="side-by-side" :context="10" />
              </section>
            </el-dialog>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';

import vueCodeDiff from 'vue-code-diff';
export default {
    components: { vueCodeDiff },
    data() {
        return {
            totalPage: 0,
            pageSize: 20,
            currentPage: 1,
            adminId: 0, // 当前登录adminid
            logs: [],
            diffVisble: false,
            oldJson: '',
            newJson: '',
        };
    },
    activated() {
        this.loadLog({ page: this.currentPage, pageNum: this.pageSize });
    },
    methods: {
        // 加载历史记录
        loadLog(data) {
            console.log('test');
            revoke('/index.php?m=SendConf&p=logList', data).then(res => {
                if (res.code === 0) {
                    this.logs = res.data.list;
                    this.totalPage = res.data.total;
                }
            });
        },
        diff(row) {
            console.log(row);
            console.log(row.newJson);
            this.oldJson = row.old_conf ? row.old_conf : '';
            this.newJson = row.new_conf ? row.new_conf : '';
            this.diffVisble = true;
        },

        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val;
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            };
            this.loadLog(data);
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            };
            this.loadLog(data);
        },
    }
};
</script>
<style>

    .diff_title {
        width:50%;float:left;text-align:center;height:20px;line-height:20px;color: rgb(191, 203, 217);
    }


</style>