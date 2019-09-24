<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                    <date-range @selectDate="selectDate" :initDate="initDate" :setRange="setRange"></date-range>
                </el-form-item>
                <el-form-item label>
                <el-select v-model="filterType" placeholder="请选择">
                    <el-option
                        v-for="item in filterTypes"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                    ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label>
                    <el-input v-model="filterUid" class="form-input"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="find"></el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData" @cell-dblclick="ToUserinfo">
                <el-table-column align="center" label="邮件id" prop="n_mailID">
                </el-table-column>
                <el-table-column align="center" label="玩家id" prop="n_playerid">
                </el-table-column>
                <el-table-column align="center" label="发送者" prop="n_sender">
                </el-table-column>
                <el-table-column align="center" label="是否读取" prop="n_isRead">
                </el-table-column>
                <el-table-column align="center" label="是否领取" prop="isGetAttachName">
                </el-table-column>
                <el-table-column align="center" label="是否删除" prop="isDelName">
                </el-table-column>

                <el-table-column align="center" label="邮件类型" prop="mailTypeName">
                </el-table-column>
                <el-table-column align="center" label="邮件标题" prop="n_title">
                </el-table-column>
                <el-table-column align="center" label="邮件内容" prop="n_detail">
                </el-table-column>

                <el-table-column align="center" label="发送时间" prop="n_createTime">
                </el-table-column>

            </el-table>
             <div class="block" style="margin: 20px 0;">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :pager-count="5"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
import { dateRange } from '@/components/dateRange';
export default {
    name: 'actor',
    components: { dateRange },
    data() {
        return {
            // 日期插件
            initDate: new Date(),
            setRange: 7,
            startDate: '',
            endDate: '',
            tableData: [],
            filterTypes: [
                { type: 1, name: '显示id' },
                { type: 2, name: 'playid' },
                { type: 3, name: '手机号' },
                { type: 4, name: 'guid' }
            ],
            delMap: { 0: '未删除', 1: '已删除' },
            mailTypeMap: { 0: '系统文本邮件', 1: '红包邮件', 2: '排行榜邮件', 3: '货币邮件', 4: '更新版本邮件', 5: '场景邮件' },
            readMap: { 0: '未读', 1: '已读' },
            getAttachMap: { 0: '未领', 1: '已领' },
            // 玩家
            filterUid: '',
            filterType: 1,
            // 分页
            totalPage: 0,
            pageSize: 25,
            currentPage: 1,
        };
    },
    mounted() {
        this.getTableList();
    },

    methods: {

        getTableList() {
            let args = {};
            args['startDate'] = this.startDate;
            args['endDate'] = this.endDate;
            args['type'] = this.filterType;
            args['value'] = this.filterUid;
            args['page'] = this.currentPage;
            args['pageNum'] = this.pageSize;

            let data = {
                callm: 'playerMail',
                callp: 'getList',
                args: JSON.stringify(args)
            };

            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.tableData = res.data.list;
                    for (let i in this.tableData) {

                        this.tableData[i]['isDelName'] = this.delMap[this.tableData[i]['n_isDel']];
                        this.tableData[i]['mailTypeName'] = this.mailTypeMap[this.tableData[i]['n_mailType']];
                        this.tableData[i]['isReadName'] = this.readMap[this.tableData[i]['n_isRead']];
                        this.tableData[i]['isGetAttachName'] = this.getAttachMap[this.tableData[i]['n_isGetAttach']];
                    }
                    this.totalPage = res.data.total;
                } else {
                    this.$message(res.msg, '信息', { });
                    return;
                }
            });
        },
        // 日期选项
        selectDate(value) {
            this.startDate = value[0];
            this.endDate = value[1];
        },
        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val;
            this.getTableList();
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTableList();
        },
        // 查找
        find() {
            this.currentPage = 1;
            this.getTableList();
        },
        // 跳到用户详情页面
        ToUserinfo(row, column, cell, event) {
            if (column.property === 'showUid') {
                this.$router.push({
                    name: 'userinfo',
                    params: {
                        filterUid: row.showUid,
                        filterType: 1
                    }
                });
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.text-right {
    float: right;
}
.pagination {
    margin: 20px 0;
}
.nav-select {
    width: 100px;margin: 0 5px 10px 0;
}
.nav-input {
    width: 150px;margin: 0 5px 10px 0;
}
.dialog-form {
    margin: 20px;
}
.form-input {
    width: 200px!important;
}
</style>
<style lang="scss">
.el-dialog__header {
        padding: 20px 20px 10px;
        background-color: #f0f2f5;
    }
.el-dialog__footer {
    padding: 10px 20px 20px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #f0f2f5;
}

/*保留换行*/
.el-table .cell {
  white-space: pre-line;
}
.a-hover:hover{
  cursor:pointer;
  text-decoration: solid;
  color: #409eff;
}
</style>
