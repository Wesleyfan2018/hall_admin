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
                <el-form-item label=" uid：">
                  <el-input v-model="filterUid"  class="form-input"></el-input>
                </el-form-item>
                 <el-form-item>
                 <el-button class="filter-item" type="primary" icon="el-icon-search" @click="find"></el-button>
                 </el-form-item>

            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id" width="50" >
                </el-table-column>
                <el-table-column align="center" label="用户id" prop="uid" >
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
                <el-table-column align="center" label="操作"></el-table-column>
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
export default {
    name: 'actor',
    data() {
        return {
            tableData: [], // 默认3个月
            filterUid: '',
            filterGoodsType: 0,
            totalPage: 0,
            goodsTypes: [{ 'type': 0, 'name': '全部' }, { 'type': 1, 'name': '游戏币' }, { 'type': 2, 'name': '道具' }, { 'type': 3, 'name': '红包' }, { 'type': 4, 'name': '话费' }, { 'type': 5, 'name': '实物' }],
            pageSize: 25,
            currentPage: 1,
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
            args['uid'] = this.filterUid;

            let data = {
                callm: 'Exchangelog',
                callp: 'getList',
                args: JSON.stringify(args),
            };

            console.log(this.selectDate[0]);
            revoke('/hall-admin-new/index.php?m=CallProxy&p=callCommon', data).then(res => {
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
</style>
