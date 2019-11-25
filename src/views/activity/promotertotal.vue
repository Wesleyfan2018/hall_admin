<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="注册日期：">
                    <el-date-picker
                        v-model="sdate"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="enddate"
                        value-format="yyyy-MM-dd"
                        @change="selectDate"
                    ></el-date-picker>
                  </el-form-item>
                 <el-form-item label="推广员：">
                    <el-select v-model="filterBindShowId" placeholder="请选择">
                        <el-option
                            v-for="item in promoters"
                            :key="item.show_id"
                            :label="item.name"
                            :value="item.show_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示ID:">
                    <el-input v-model="filterShowId" placeholder="显示ID(showid)" class="form-input"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" icon="el-icon-search" @click="search">搜索</el-button>
                    <el-button class="filter-item"  @click="exportCsv">导出</el-button>
                </el-form-item>

            </el-form>

            <el-table border :data="tableData">
                <el-table-column align="center" label="玩家昵称" prop="nickname"></el-table-column>
                <el-table-column align="center" label="显示ID" prop="showUID"></el-table-column>
                <el-table-column align="center" label="手机号" prop="phone"></el-table-column>
                <el-table-column align="center" label="玩牌总局数" prop="totalBureau"></el-table-column>
                <el-table-column align="center" label="充值总金额" prop="allPrice"></el-table-column>
                <el-table-column align="center" label="上次登录时间" width="250" prop="loginDevice"></el-table-column>
                <el-table-column align="center" label="上次登录设备" width="250" prop="loginTime"></el-table-column>
                <el-table-column align="center" label="地区" width="250" prop="area"></el-table-column>
                <el-table-column align="center" label="注册时间" prop="createTime"></el-table-column>
                <el-table-column align="center" label="绑定推广员">
                    <template slot-scope="scope" >
                        <template v-if="scope.row.bind_show_id>0">
                            <span>
                                {{promoters[scope.row.bind_show_id].name}}
                            </span>
                        </template>
                        <template v-else>
                            {{无}}
                        </template>
                    </template>

                </el-table-column>

            </el-table>
        </div>

    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    name: 'promoter',
    data() {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDate();

        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (day >= 0 && day <= 9) {
            day = '0' + day;
        }

        let currentdate = year + '-' + month + '-' + day;

        return {
            tableData: [],
            promoters: [],
            areas: [],
            sdate: currentdate,
            filterBindShowId: '0',
            filterShowId: '',
            selectData: {
                name: '',
                id: '',
                phone: '',
                show_id: '',
                status: '',
                url: '',
                entry_date: '',
            },
            addData: {
                name: '',
                phone: '',
                show_id: '',
                url: '',
                entry_date: '',
            }
        };
    },
    mounted() {
        this.loadPromoters();
    },
    methods: {
        search() {
            let sdate = this.sdate == null ? '' : this.sdate;
            let data = { 'filter_bind_show_id': this.filterBindShowId, 'filter_show_id': this.filterShowId, 'sdate': sdate };
            revoke('/index.php?m=Promoter&p=seachPromoter', data).then(res => {
                if (res.code === 0) {
                    // for
                    this.tableData = res.data.list;
                    this.areas = res.data.areas;
                }
            });
        },
        loadPromoters() {
            let data = { 'kv': 1, 'all': 1 };
            revoke('/index.php?m=Promoter&p=getLists', data).then(res => {
                if (res.code === 0) {
                    // for
                    this.promoters = res.data.list;
                }
            });
        },
        // 导出
        exportCsv() {
            let sdate = this.sdate == null ? '' : this.sdate;
            let data = {
                'filter_bind_show_id': this.filterBindShowId,
                'filter_show_id': this.filterShowId,
                'export': 1,
                'sdate': sdate,
            };
            revoke('/index.php?m=Promoter&p=seachPromoter', data).then(res => {
                if (res.code === 0) {
                    this.funDownload(res.data.csv, this.sdate + '.csv');
                }
            });
        },
        funDownload(content, filename) {
        // 创建隐藏的可下载链接
            let eleLink = document.createElement('a');
            eleLink.download = filename;
            eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            let blob = new Blob([content]);
            eleLink.href = URL.createObjectURL(blob);
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
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
    width: 200px !important;
}

.permission_settings {
    > .el-form-item__content {
        border: 1px solid #ebeef5;
    }
    h2 {
        font-size: 14px;
        color: #666;
        background: #f0f2f5;
        text-indent: 1rem;
    }
    .el-checkbox {
        margin-left: 10px;
    }
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
</style>
