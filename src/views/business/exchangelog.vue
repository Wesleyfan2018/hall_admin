<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                  <el-date-picker v-model="selectDate" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
                <el-form-item label="商品类型：">
                <el-select v-model="filterGoodsType" placeholder="请选择">
                  <el-option v-for="item in goodsTypes" :key="item.type" :label="item.name" :value="item.type"> </el-option>
                </el-select>
                  </el-form-item>
                <el-form-item label="状态：">
                <el-select v-model="filterStatus" placeholder="请选择">
                  <el-option v-for="item in status" :key="item.type" :label="item.name" :value="item.type"> </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="playerID：">
                  <el-input v-model="filterUid"  class="form-input"></el-input>
                </el-form-item>
                 <el-form-item>
                 <el-button class="filter-item" type="primary" icon="el-icon-search" @click="find"></el-button>
                 </el-form-item>

            </el-form>
            <el-table border :data="tableData" @cell-dblclick="ToUserinfo">
                <el-table-column align="center" label="id" prop="id" width="70">
                </el-table-column>
                <el-table-column align="center" label="玩家ID" prop="uid" class-name="a-hover">
                </el-table-column>
                <el-table-column align="center" label="玩家昵称" prop="nickName">
                </el-table-column>
                <el-table-column align="center" label="商品类型" prop="goodsType" >
                </el-table-column>
                <el-table-column align="center" label="商品数量" prop="goodsNum"  >
                </el-table-column>
                <el-table-column align="center" label="商品名称" prop="goodsName" width="170">
                </el-table-column>


              <el-table-column align="center" label="消耗" prop="consumeNum" >
                </el-table-column>

                 <el-table-column align="left" label="附加信息" prop="extInfo" width="250">
                </el-table-column>


                <el-table-column align="center" label="状态" prop="statusName">
                </el-table-column>
                <el-table-column align="center" label="兑换时间" prop="time">
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button  size="mini" v-if="tableData[scope.$index].status==1 && (tableData[scope.$index].type==3 || tableData[scope.$index].type==4) " type="primary" @click="caterr(scope.row)">原因</el-button>
                    <el-button  size="mini" v-if="tableData[scope.$index].status==1 && (tableData[scope.$index].type==3 || tableData[scope.$index].type==4) " type="primary" @click="refund(scope.row)">退款</el-button>
                    <el-button  size="mini" v-if="tableData[scope.$index].status==3 && tableData[scope.$index].type==5 " type="primary" @click="shipBut(scope.row)">发货</el-button>


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
        <div class="dialog_div">
            <el-dialog
                title="发货单号"
                :visible.sync="shipVisble"
                width="30%">
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="快递商">
                        <el-input class="form-input"  v-model="selectData.expressType"></el-input>
                    </el-form-item>
                    <el-form-item label="快递单号">
                        <el-input class="form-input"  v-model="selectData.expressNo"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="shipVisble = false">取 消</el-button>
                    <el-button type="success" @click="ship">确 定</el-button>
                </span>
            </el-dialog>

        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    name: 'actor',
    data() {
        return {
            tableData: [], // 默认3个月
            filterUid: '',
            filterGoodsType: 0,
            filterStatus: -1,
            shipVisble: false,
            totalPage: 0,
            goodsTypes: [{ 'type': 0, 'name': '全部' }, { 'type': 1, 'name': '游戏币' }, { 'type': 2, 'name': '道具' }, { 'type': 3, 'name': '红包' }, { 'type': 4, 'name': '话费' }, { 'type': 5, 'name': '实物' }],
            status: [{ 'type': -1, 'name': '全部' }, { 'type': 0, 'name': '完成' }, { 'type': 1, 'name': '失败' }, { 'type': 2, 'name': '审核中' }, { 'type': 3, 'name': '处理中' }, { 'type': 4, 'name': '已发货' }, { 'type': 5, 'name': '已退单' }],
            pageSize: 25,
            currentPage: 1,
            selectData: {
                expressType: '',
                expressNo: '',
            },
            selectDate: [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 90), new Date()],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
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
            args['stime'] = parseInt(this.selectDate[0] / 1000, 10);
            args['etime'] = parseInt(this.selectDate[1] / 1000, 10);
            args['goodsType'] = this.filterGoodsType;
            args['status'] = this.filterStatus;
            args['uid'] = this.filterUid;

            let data = {
                callm: 'Exchangelog',
                callp: 'getList',
                args: JSON.stringify(args),
            };

            console.log(this.selectDate[0]);
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    console.log(res);
                    this.tableData = res.data.list;
                    this.totalPage = parseInt(res.data.total, 10);
                    for (let i in this.tableData) {
                        let t = new Date(this.tableData[i].time * 1000);
                        this.tableData[i].time = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
                        this.tableData[i].consumeNum = this.tableData[i].consumeNum + this.tableData[i].consumeTypeName;
                    }
                }
            });
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
        // 查看失败原因
        caterr(row) {
            console.log(row);
            this.$alert(row.remarkStr, '信息', {
            });
        },
        refund(row) {
            let args = { 'id': row.id };
            let data = {
                callm: 'Exchangelog',
                callp: 'chargeback',
                args: JSON.stringify(args),
            };

            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.$alert(res.msg, '提示', {
                        type: 'success'
                    });
                    this.getTableList({ page: this.currentPage, pageNum: this.pageSize });
                } else {
                    this.$alert(res.msg, '警告', {
                        type: 'warning'
                    });
                }
            });
        },
        shipBut(row) {
            console.log(row);
            this.shipVisble = true;
            this.selectData.id = row.id;
        },
        ship() {
            let args = { 'id': this.selectData.id, 'expressType': this.selectData.expressType, 'expressNo': this.selectData.expressNo };
            let data = {
                callm: 'Exchangelog',
                callp: 'ship',
                args: JSON.stringify(args),
            };

            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.$alert(res.msg, '提示', {
                        type: 'success'
                    });
                    this.getTableList({ page: this.currentPage, pageNum: this.pageSize });
                    this.shipVisble = false;// 关闭
                    this.selectData.expressType = '';
                    this.selectDat.expressNo = '';
                } else {
                    this.$alert(res.msg, '警告', {
                        type: 'warning'
                    });
                }
            });
        },
        // 跳到用户详情页面
        ToUserinfo(row, column, cell, event) {
            if (column.property === 'uid') {
                console.log(row.uid);
                this.$router.push({
                    name: 'userinfo',
                    params: {
                        filterUid: row.uid,
                        filterType: 2, // playid
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
