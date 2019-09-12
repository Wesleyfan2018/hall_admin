<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                    <date-range @selectDate="selectDate" :initDate="initDate" :setRange="setRange"></date-range>
                </el-form-item>
                <el-form-item label="充值状态：">
                <el-select v-model="filterStatus" placeholder="请选择">
                  <el-option v-for="item in statusTypes" :key="item.type" :label="item.name" :value="item.type"></el-option>
                </el-select>
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
                <el-table-column align="center" label="玩家ID" prop="showUid" class-name="a-hover">
                </el-table-column>
                <el-table-column align="center" label="玩家昵称" prop="nickName">
                </el-table-column>
                <el-table-column align="center" label="平台订单号" prop="order_id">
                </el-table-column>
                <el-table-column align="center" label="第三方订单号" prop="order_num">
                </el-table-column>
                <el-table-column align="center" label="充值金额" prop="price">
                </el-table-column>
                <el-table-column align="center" label="充值方式" prop="pay_platform">
                </el-table-column>
                <el-table-column align="center" label="充值时间" prop="order_create_time">
                </el-table-column>
                <el-table-column align="center" label="充值状态" prop="statusName">
                </el-table-column>
                <el-table-column align="center" label="操作">
                     <template slot-scope="scope">
                        <el-button v-if="tableData[scope.$index].status==1" type="primary" size="small" @click="viewReason(scope.row)">支付状态</el-button>
                        <br/>
                        <el-button v-if="tableData[scope.$index].status==1" type="primary" size="small" style="margin-top:2px;" @click="confirmDelivery(scope.row)">手动发货</el-button>
                    </template>
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
            initDate: new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 1),
            setRange: 300,
            startDate: '',
            endDate: '',
            tableData: [], // 默认3个月
            filterStatus: 0,
            // 状态
            statusTypes: [
                { 'type': 0, 'name': '全部' },
                { 'type': 1, 'name': '预订单' },
                { 'type': 10, 'name': '已支付' },
                { 'type': 15, 'name': '已发货' },
                { 'type': 50, 'name': '已完成' },
                { 'type': 90, 'name': '取消' },
                { 'type': 99, 'name': '不可逆异常' },
            ],
            filterTypes: [
                { type: 1, name: '显示id' },
                { type: 2, name: 'playid' },
                { type: 3, name: '手机号' },
                { type: 4, name: 'guid' }
            ],
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
        this.getTableList({
            page: this.currentPage,
            pageNum: this.pageSize
        });
    },
    methods: {
        getTableList(args) {
            args['stime'] = this.startDate;
            args['etime'] = this.endDate;
            args['channel'] = this.filterChannel;
            args['provId'] = this.provId;
            args['cityId'] = this.cityId;
            args['status'] = this.filterStatus;
            args['type'] = this.filterType;
            args['value'] = this.filterUid;

            let data = {
                callm: 'rechargelog',
                callp: 'getList',
                args: JSON.stringify(args)
            };

            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.tableData = res.data.list;
                    this.totalPage = parseInt(res.data.total, 10);
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
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            };
            this.getTableList(data);
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            };
            this.getTableList(data);
        },
        // 查找
        find() {
            this.currentPage = 1;
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            };
            this.getTableList(data);
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
        // 查询状态
        viewReason(row) {
            let args = {};
            args['pay_platform'] = row._pay_platform;
            args['order_num'] = row.order_num;
            let data = {
                callm: 'rechargelog',
                callp: 'payStatus',
                args: JSON.stringify(args)
            };

            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {

                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message: res.data.json
                    });
                    return;
                } else {
                    this.$message(res.msg, '信息', { });
                    return;
                }
            });
            console.log(row);
        },

        confirmDelivery(row) {
            this.$confirm('确认手动发货？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delivery(row);
            }).catch(() => {

            });
        },
        // 手动发货
        delivery(row) {
            let args = {};
            args['pay_platform'] = row._pay_platform;
            args['order_id'] = row.order_id;
            let data = {
                callm: 'rechargelog',
                callp: 'delivery',
                args: JSON.stringify(args)
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.$message(res.msg, '信息', { });
                    this.getTableList({
                        page: this.currentPage,
                        pageNum: this.pageSize
                    });

                } else {
                    this.$message(res.msg, '信息', { });
                    return;
                }
            });
            console.log(row);

        }
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
