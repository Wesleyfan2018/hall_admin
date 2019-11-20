<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="绑定推广员"></el-form-item>

            </el-form>
            <el-form :inline="true" class="demo-form-inline">
                 <el-form-item label="显示ID(逗号分隔):">
                     <el-input type="textarea" v-model="show_id_str" placeholder="请输入内容" resize="vertical"   class="form-text" rows="5"></el-input>
                 </el-form-item>
                 <el-button class="filter-item" type="success" @click="search">查找</el-button>
            </el-form>

            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id" width="60"></el-table-column>
                <el-table-column align="center" label="玩家昵称" prop="nickname"></el-table-column>
                <el-table-column align="center" label="显示ID" prop="showUID"></el-table-column>
                <el-table-column align="center" label="玩牌总局数" prop="totalBureau"></el-table-column>
                <el-table-column align="center" label="登录设备" width="250" prop="loginDevice"></el-table-column>
                <el-table-column align="center" label="地区" width="250" prop="area"></el-table-column>
                <el-table-column align="center" label="注册时间" prop="createTime"></el-table-column>
                <el-table-column align="center" label="绑定推广员" prop="entry_date">
                    <template slot-scope="scope" >
                        <template v-if="scope.row.bind_show_id>0">
                            <span>
                                {{promoters[scope.row.bind_show_id].name}}
                            </span>
                        </template>
                        <template v-else>
                            <el-select v-model="bindInfo[scope.row.showUID]" placeholder="请选择">
                                <el-option
                                    v-for="item in promoters"
                                    :key="item.show_id"
                                    :label="item.name"
                                    :value="item.show_id"
                                ></el-option>
                            </el-select>
                        </template>
                    </template>

                 </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="scope.row.bind_show_id>0" @click="saveBind(scope.row,true)">解绑</el-button>
                        <el-button type="primary" v-if="scope.row.bind_show_id==0" @click="saveBind(scope.row,false)">保存绑定</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    name: 'actor',
    data() {
        return {
            tableData: [],
            areas: [],
            promoters: [],
            editVisble: false,
            addVisble: false,
            bindInfo: {},
            show_id_str: '',
            statusArr: { '0': '正常', '1': '封禁', '2': '离职' },
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
            let data = { 'show_id_str': this.show_id_str };
            revoke('/index.php?m=Promoter&p=seach', data).then(res => {
                if (res.code === 0) {
                    // for
                    this.tableData = res.data.list;
                    this.areas = res.data.areas;
                }
            });
        },
        loadPromoters() {
            let data = { 'kv': 1 };
            revoke('/index.php?m=Promoter&p=getLists', data).then(res => {
                if (res.code === 0) {
                    // for
                    this.promoters = res.data.list;
                }
            });
        },
        saveBind(row, unBind) {
            let bind_show_id = 0;
            if (!unBind) {
                bind_show_id = this.bindInfo[row.showUID] ? this.bindInfo[row.showUID] : 0;
            }
            let data = { 'show_id': row.showUID, 'bind_show_id': bind_show_id, 'reg_time': row.createTime };

            revoke('/index.php?m=Promoter&p=bind', data).then(res => {
                if (res.code === 0) {
                    this.search();
                } else {
                    this.$message.error(res.msg);
                }
            });

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
.form-text {
    width: 550px !important;
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
