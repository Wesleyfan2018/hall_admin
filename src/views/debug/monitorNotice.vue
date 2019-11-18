<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">



                 <el-form-item class="text-right">
                    <el-button
                        class="filter-item"
                        type="primary"
                        @click="addVisble=true"
                    >添加</el-button>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button
                        class="filter-item"
                        type="primary"
                        @click="updatConf"
                    >更新生效</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData" @cell-dblclick="ToUserinfo">
                <el-table-column align="center" label="id" prop="id" class-name="a-hover"></el-table-column>
                <el-table-column align="center" label="监控类型" prop="typeName"></el-table-column>
                <el-table-column align="center" label="配置" prop="confStr"></el-table-column>
                <el-table-column align="center" label="通知信息" prop="receivestr"></el-table-column>

                <el-table-column align="center" label="添加时间" prop="utimeFormat"></el-table-column>
                <el-table-column align="center" label="操作" >
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
                        </template>

                </el-table-column>
            </el-table>


            <el-dialog title="添加"  :visible.sync="addVisble" width="40%">
                <el-form
                    label-position="right"
                    label-width="120px"

                    class="dialog-form"
                >
                <el-form-item label="监控类型:">
                    <el-select v-model="type" placeholder="请选择监控类型" class="nav-select"  @change="typeChange">
                        <el-option v-for="(item,i) in types" :key="i" :label="item.name" :value="i"></el-option>
                    </el-select>
                </el-form-item>
                <template v-for="item in fields">
                    <el-form-item :label="item.name" :key="item.id" >
                        <el-input v-model="fieldValues[item.key]" class="form-input"></el-input>
                    </el-form-item>
                </template>

                <template v-for="index  in receiveCount">
                    <el-form-item :key="index" :label=" index===1 && '接收人:'">
                        <el-input placeholder="姓名" v-model="receiveInfo[index-1]['name']" :key="index" class="form-input-mini"></el-input>
                        <el-input placeholder="请输入手机号" v-model="receiveInfo[index-1]['phone']" :key="index"  class="form-input"></el-input>
                        <i v-if="index===1" class="el-icon-circle-plus-outline" :key="index" @click="addReceive('add')"></i>
                        <i v-if="index>1" class="el-icon-remove-outline" :key="index" @click="reReceive('add',index)"></i>
                    </el-form-item>

                </template>


                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addVisble = false">取 消</el-button>
                    <el-button type="success" @click="add()">添 加</el-button>
                </span>
        </el-dialog>

            <el-dialog title="编辑"  :visible.sync="editVisble" width="40%">
                <el-form
                    label-position="right"
                    label-width="120px"
                    class="dialog-form"
                >
                <el-form-item label="监控类型:">
                    <el-select v-model="selectData.type" placeholder="请选择监控类型" class="nav-select" disabled>
                        <el-option v-for="(item,i) in types" :key="i" :label="item.name" :value="i"></el-option>
                    </el-select>
                </el-form-item>


                <template v-for="item in editFields">
                    <el-form-item :label="item.name" :key="item.id" >
                        <el-input v-model="editFieldValues[item.key]" class="form-input"></el-input>
                    </el-form-item>
                </template>

                <template v-for="index  in selectData.receiveCount">
                    <el-form-item :key="index" :label=" index===1 && '接收人:'">
                        <el-input placeholder="姓名" v-model="editReceiveInfo[index-1]['name']" :key="index" class="form-input-mini"></el-input>
                        <el-input placeholder="请输入手机号" v-model="editReceiveInfo[index-1]['phone']" :key="index"  class="form-input"></el-input>
                        <i v-if="index===1" class="el-icon-circle-plus-outline" :key="index" @click="addReceive('edit')"></i>
                        <i v-if="index>1" class="el-icon-remove-outline" :key="index" @click="reReceive('edit',index)"></i>
                    </el-form-item>

                </template>


                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisble=false">取 消</el-button>
                    <el-button type="success" @click="save()">保存</el-button>
                </span>
        </el-dialog>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    data() {
        return {
            // 日期插件
            initDate: new Date(),
            setRange: 7,
            startDate: '',
            type: '',
            addVisble: false,
            editVisble: false,
            endDate: '',
            tableData: [], // 默认3个月
            types: [],
            fields: [],
            fieldValues: {},
            receiveCount: 1,
            receiveInfo: [{}],
            selectData: { receiveCount: 1 },
            editFieldValues: {},
            editReceiveInfo: [{}],
            editFields: [],

        };
    },
    mounted() {
        this.getTableList();
        this.loadTypes();
    },
    methods: {
        getTableList() {
            let data = {};
            revoke('/index.php?m=MonitorNotice&p=lists', data).then(res => {
                if (res.code === 0) {
                    this.tableData = res.data.list;
                } else {
                    this.$message(res.msg, '信息', {});
                }
            });
        },

        add() {
            let data = {};
            data['type'] = this.type;
            data['conf'] = JSON.stringify(this.fieldValues);

            data['receiveInfo'] = JSON.stringify(this.receiveInfo);
            revoke('/index.php?m=MonitorNotice&p=add', data).then(res => {
                if (res.code === 0) {
                    this.addVisble = false;
                    this.getTableList();
                } else {
                    this.$message(res.msg, '信息', {});
                }
            });
        },
        updatConf() {
            let data = {};
            revoke('/index.php?m=MonitorNotice&p=updateConf', data).then(res => {
                if (res.code === 0) {
                    this.$message('更新成功', '信息', {});
                } else {
                    this.$message(res.msg, '信息', {});
                }
            });
        },
        save() {
            let data = {};
            data['type'] = this.selectData.type;
            data['id'] = this.selectData.id;
            data['conf'] = JSON.stringify(this.editFieldValues);
            data['receiveInfo'] = JSON.stringify(this.editReceiveInfo);

            revoke('/index.php?m=MonitorNotice&p=edit', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false;
                    this.getTableList();
                } else {
                    this.$message(res.msg, '信息', {});
                }
            });
        },
        // 日期选项
        selectDate(value) {
            this.startDate = value[0];
            this.endDate = value[1];
        },
        // 查找
        find() {
            this.currentPage = 1;
            this.getTableList();
        },

        loadTypes() {
            revoke('/index.php?m=MonitorNotice&p=types', {}).then(res => {
                if (res.code === 0) {
                    this.types = res.data.types;
                    this.fields = res.data.types[this.type].confField;
                    console.log(this.field);
                }
            });
        },
        // 编辑信息
        handleEdit(row) {
            this.editVisble = true;
            this.selectData.id = row.id;
            this.selectData.type = row.type;
            this.editFields = this.types[row.type].confField;
            this.selectData.receiveCount = row.receiveCount;
            this.editReceiveInfo = JSON.parse(row.receive_info);
            this.editFieldValues = JSON.parse(row.conf);
            console.log(this.selectData.receiveInfo);
        },
        typeChange(val) {
            this.type = val;
            this.fields = this.types[val].confField;
        },
        addReceive(type) {
            if (type === 'edit') {
                this.selectData.receiveCount++;
                this.editReceiveInfo.push({});

            } else {
                this.receiveCount++;
                this.receiveInfo.push({});
            }
        },
        reReceive(type, index) {
            if (type === 'edit') {
                this.selectData.receiveCount--;
                this.editReceiveInfo.splice(index - 1, 1);
            } else {
                this.receiveCount--;
                this.receiveInfo.splice(index - 1, 1);
            }
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
    width: 150px;
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
.form-input-mini {
    width: 80px !important;
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
.a-hover:hover {
    cursor: pointer;
    text-decoration: solid;
    color: #409eff;
}
</style>
