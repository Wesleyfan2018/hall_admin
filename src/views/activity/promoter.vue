<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="推广员管理"></el-form-item>
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="success" @click="openAdd">添加推广员</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id" width="60"></el-table-column>
                <el-table-column align="center" label="推广员姓名" prop="name"></el-table-column>
                <el-table-column align="center" label="推广员手机号" prop="phone"></el-table-column>
                <el-table-column align="center" label="个人账号(showid)" prop="show_id"></el-table-column>
                <el-table-column align="center" label="推广码" width="250">
                     <template slot-scope="scope">
                        <el-image style="width: 100px; height: 100px" :src="scope.row.url" ></el-image>
                      </template>
                </el-table-column>
                <el-table-column align="center" label="状态" >
                            <template slot-scope="scope"><span>{{statusArr[scope.row.status]}}</span></template>
                </el-table-column>
                <el-table-column align="center" label="入职时间" prop="entry_date"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="dialog_div">
            <el-dialog
                title="编辑角色信息"
                :visible.sync="editVisble"
                 width="25%"
                :before-close="handleEditClose"
            >
                   <el-form
                    label-position="right"
                    label-width="120px"
                    :model="addData"
                    class="dialog-form"
                >
                    <el-form-item label="姓名">
                        <el-input class="form-input" v-model="selectData.name"></el-input>
                    </el-form-item>
                       <el-form-item label="手机号">
                        <el-input class="form-input" v-model="selectData.phone"></el-input>
                    </el-form-item>
                     <el-form-item label="showID">
                        <el-input class="form-input" v-model="selectData.show_id"></el-input>
                    </el-form-item>
                     <el-form-item label="推广地址(二维码)">
                        <el-input class="form-input" v-model="selectData.url"></el-input>
                    </el-form-item>
                    <el-form-item label="入职时间">
                        <el-date-picker v-model="selectData.entry_date"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="enddate"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>

                          <el-form-item  label="状态" >

                            <el-select v-model="selectData.status"  placeholder="请选择">
                                <el-option
                                v-for="(k,item) in statusArr"
                                :key="k"
                                :label="k"
                                :value="item">
                                </el-option>
                            </el-select>


                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirEdit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="添加信息"
                :visible.sync="addVisble"
                width="25%"
                :before-close="handleAddClose"
            >
                <el-form
                    label-position="right"
                    label-width="120px"
                    :model="addData"
                    class="dialog-form"
                >
                    <el-form-item label="姓名">
                        <el-input class="form-input" v-model="addData.name"></el-input>
                    </el-form-item>
                       <el-form-item label="手机号">
                        <el-input class="form-input" v-model="addData.phone"></el-input>
                    </el-form-item>
                     <el-form-item label="showID">
                        <el-input class="form-input" v-model="addData.show_id"></el-input>
                    </el-form-item>
                     <el-form-item label="推广地址(二维码)">
                        <el-input class="form-input" v-model="addData.url"></el-input>
                    </el-form-item>
                     <el-form-item label="入职时间">
                          <el-date-picker
                    v-model="addData.entry_date"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="enddate"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
                    </el-form-item>

                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addVisble = false">取 消</el-button>
                    <el-button type="success" @click="confirAdd">添 加</el-button>
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
            tableData: [],
            editVisble: false,
            addVisble: false,
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
        this.initList();
    },
    methods: {
        confirEdit() {
            let data = {};
            data.name = this.selectData.name;
            data.phone = this.selectData.phone;
            data.id = this.selectData.id;
            data.show_id = this.selectData.show_id;
            data.url = this.selectData.url;
            data.entry_date = this.selectData.entry_date;
            revoke('/index.php?m=Promoter&p=edit', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false;
                    this.$message({
                        message: '编辑成功！',
                        type: 'success'
                    });
                    this.getTableList();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        initList() {
            this.getTableList();
        },
        getTableList() {
            let data = {};
            revoke('/index.php?m=Promoter&p=getLists', data).then(res => {
                if (res.code === 0) {
                    // for
                    this.tableData = res.data.list;
                }
            });
        },
        // 编辑用户信息
        handleEdit(index, row) {
            this.editVisble = true;
            this.selectData.id = row.id;
            this.selectData.name = row.name;
            this.selectData.phone = row.phone;
            this.selectData.url = row.url;
            this.selectData.show_id = row.show_id;
            this.selectData.status = row.status;
            this.selectData.entry_date = row.entry_date;
        },

        // 弹出框close
        handleEditClose(done) {
            this.editVisble = false;
        },
        // 弹出框close
        handleAddClose(done) {
            this.addVisble = false;
        },
        openAdd() {
            this.addVisble = true;
        },
        confirAdd() {
            let data = {};
            data.name = this.addData.name;
            data.phone = this.addData.phone;
            data.show_id = this.addData.show_id;
            data.url = this.addData.url;
            data.entry_date = this.addData.entry_date;
            revoke('/index.php?m=Promoter&p=add', data).then(res => {
                if (res.code === 0) {
                    this.addVisble = false;
                    this.$message({
                        message: '新增成功！',
                        type: 'success'
                    });
                    this.getTableList();
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
