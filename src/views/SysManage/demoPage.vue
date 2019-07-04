<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="地区：">
                    <el-select v-model="value" multiple collapse-tags filterable clearable placeholder="请选择">
                        <el-option
                            v-for="(i, t) in options"
                            :key="(i, t)"
                            :label="i"
                            :value="t">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div data-v-121113ae="" class="el-select"><div class="el-select__tags" style="width: 100%; max-width: 185px;"><span><span class="el-tag el-tag--info el-tag--small el-tag--light"><span class="el-select__tags-text">贵州省</span><i class="el-tag__close el-icon-close"></i></span><span class="el-tag el-tag--info el-tag--small el-tag--light"><span class="el-select__tags-text">+ 3</span></span></span><!----><input type="text" autocomplete="off" class="el-select__input" style="flex-grow: 1; width: 0.108108%; max-width: 175px;"></div><div class="el-input el-input--suffix is-focus"><!----><input type="text" readonly="readonly" autocomplete="off" placeholder="" class="el-input__inner" style="height: 40px;"><!----><span class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-select__caret el-input__icon el-icon-arrow-up is-reverse" style=""></i><!----><!----><!----><!----><!----></span><!----></span><!----><!----></div></div>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @keyup.enter="searchName" @click="searchName"></el-button>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="success" @keyup.enter="searchName" @click="openAdd">添加用户</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="id" prop="id">
                </el-table-column>
                <el-table-column align="center" label="账户名" prop="name">
                </el-table-column>
                <el-table-column align="center" label="姓名" prop="real_name">
                </el-table-column>
                <el-table-column align="center" label="角色" prop="actorStr">
                </el-table-column>
                <el-table-column align="center" label="状态" prop="statusStr">
                </el-table-column>
                <el-table-column align="center" label="电话号码" prop="phone">
                </el-table-column>
                <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
                </el-table-column>
            </el-table>
            <div class="block pagination">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 25, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalPage">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="编辑用户信息" :visible.sync="editVisble" width="30%" :before-close="handleEditClose">
            <el-form label-position="right" label-width="120px" :model="selectUser">
                <el-form-item label="姓名">
                    <el-input class="form-input" disabled v-model="selectUser.name"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select class="form-input" v-model="selectUser.actor">
                        <el-option
                            v-for="(i, t) in actors"
                            :key="(i, t)"
                            :label="i"
                            :value="t">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="重置密码">
                    <el-input class="form-input" placeholder="如需修改请输入新密码" v-model="rePassword"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input class="form-input" placeholder="请输入电话号码" v-model="selectUser.phone"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="selectUser.status">
                    <el-radio v-for="(i, t) in status" :key="(i, t)" :label="t">{{i}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisble = false">取 消</el-button>
                <el-button type="success" @click="confirEdit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增用户信息" :visible.sync="addVisble" width="30%" :before-close="handleAddClose">
            <el-form label-position="right" label-width="120px" :model="addUser" class="dialog-form">
                <el-form-item label="账号名">
                    <el-input class="form-input" v-model="addUser.name"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input class="form-input" v-model="addUser.real_name"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select class="form-input" v-model="addUser.actor" placeholder="请选择角色">
                        <el-option
                            v-for="(i, t) in actors"
                            :key="(i, t)"
                            :label="i"
                            :value="t">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设置密码">
                    <el-input class="form-input" type="password" placeholder="请设置密码" v-model="addUser.password"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input class="form-input" placeholder="请输入电话号码" v-model="addUser.phone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisble = false">取 消</el-button>
                <el-button type="success" @click="confirAdd">添 加</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@/utils/ajax';
import router from '@/router';
import { Enmd5 } from '@/utils/auth';
export default {
    name: 'UserList',
    data() {
        return {
            options: {
                51: '四川省',
                5101: '成都市',
                510107: '武侯区',
                510104: '锦江区',
                510105: '青羊区',
                510106: '金牛区',
                510108: '成华区',
                510112: '龙泉驿区',
                510115: '温江区',
                510114: '新都区',
                510113: '青白江区',
                510116: '双流区',
                510117: '郫都区',
                510181: '都江堰市',
                510182: '彭州市',
                510183: '邛崃市',
                510184: '崇州市',
                512081: '简阳市',
                510121: '金堂县',
                510129: '大邑县',
                510131: '蒲江县',
                510132: '新津县',
                5103: '自贡市',
                510302: '自流井区',
                510303: '贡井区',
                510304: '大安区',
                510311: '沿滩区',
                510321: '荣县',
                510322: '富顺区',
                5104: '攀枝花市',
                5105: '泸州市',
                5106: '德阳市',
                5107: '绵阳市',
                5108: '广元市',
                5109: '遂宁市',
                5110: '内江市',
                511001: '市辖区',
                511002: '市中区',
                511011: '东兴区',
                511024: '威远县',
                511025: '资中县',
                511028: '隆昌市',
                5111: '乐山市',
                5113: '南充市',
                5114: '眉山市',
                5115: '宜宾市',
                5116: '广安市',
                5117: '达州市',
                5118: '雅安市',
                5119: '巴中市',
                5120: '资阳市',
                52: '贵州省',
                5201: '贵阳市',
                5202: '六盘水市',
                5203: '遵义市',
                5204: '安顺市',
                5222: '铜仁地区',
                5223: '黔西南州',
                5224: '毕节地区',
                5226: '黔东南苗族侗族自治州',
                5227: '黔南布依族苗族自治州',
                34: '安徽省',
                3401: '合肥市',
                340101: '市辖区',
                340102: '瑶海区',
                340103: '庐阳区',
                340104: '蜀山区',
                340111: '包河区',
                340121: '长丰县',
                340122: '肥东县',
                340123: '肥西县',
                3402: '芜湖市',
                3403: '蚌埠市',
                340301: '市辖区',
                340302: '龙子湖区',
                340303: '蚌山区',
                340304: '禹会区',
                340311: '淮上区',
                340321: '怀远县',
                340322: '五河县',
                340323: '固镇县',
                3404: '淮南市',
                3405: '马鞍山市',
                3406: '淮北市',
                3407: '铜陵市',
                3408: '安庆市',
                3410: '黄山市',
                3411: '滁州市',
                3412: '阜阳市',
                341201: '市辖区',
                341202: '颍州区',
                341203: '颍东区',
                341204: '颍泉区',
                341221: '临泉县',
                341222: '太和县',
                341225: '阜南县',
                341226: '颍上县',
                341282: '界首市',
                3413: '宿州市',
                3414: '巢湖市',
                3415: '六安市',
                3416: '亳州市',
                3417: '池州市',
                3418: '宣城市'
            },
            value: '',
            status: [],
            tableData: [],
            actors: [],
            actor: 0,
            totalPage: 0,
            pageSize: 5,
            searchStr: '',
            currentPage: 1,
            editVisble: false,
            addVisble: false,
            rePassword: '',
            selectUser: {
                name: '',
                actor: '',
                status: '',
                password: '',
                phone: ''
            },
            addUser: {
                name: '',
                real_name: '',
                actor: '',
                password: '',
                phone: ''
            }
        };
    },
    created() {
        this.selectOption();
    },
    mounted() {
        this.initList();
    },
    methods: {
        confirEdit() {
            let data = {
                id: this.selectUser.id,
                real_name: this.selectUser.real_name,
                phone: this.selectUser.phone,
                actor: this.selectUser.actor,
                status: this.selectUser.status
            };
            data._sig = Enmd5(data);
            ajax.post('/hall-admin-new/index.php?m=user&p=edit&g=10000', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false;
                    this.$message({
                        message: '编辑成功！',
                        type: 'success'
                    });
                    let data = {
                        actor: this.actor,
                        name: this.searchStr,
                        page: this.currentPage,
                        pageNum: this.pageSize,
                    };
                    data._sig = Enmd5(data);
                    this.getTableList(data);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        selectOption() {
            let data = {};
            data._sig = Enmd5(data);
            ajax.post('/hall-admin-new/index.php?m=config&p=user&g=10000', data).then(res => {
                if (res.code === 0) {
                    this.actors = res.data.actor;
                    this.status = res.data.status;
                }
                if (res.code === -99) {
                    router.push({
                        path: '/login'
                    });
                }
            });
        },
        initList() {
            let self = this;
            let data = {
                actor: this.actor,
                name: '',
                page: self.currentPage,
                pageNum: self.pageSize,
            };
            data._sig = Enmd5(data);
            ajax.post('/hall-admin-new/index.php?m=user&p=lists&g=10000', data).then(res => {
                if (res.code === 0) {
                    let tableData = res.data.list;
                    for (let i in tableData) {
                        tableData[i].actorStr = self.actors[Number(tableData[i].actor)];
                        tableData[i].statusStr = self.status[Number(tableData[i].status)];
                    }
                    self.tableData = tableData;
                    self.totalPage = res.data.total;
                }
                if (res.code === -99) {
                    router.push({
                        path: '/login'
                    });
                }
            });
        },
        getTableList(data) {
            ajax.post('/hall-admin-new/index.php?m=user&p=lists&g=10000', data).then(res => {
                if (res.code === 0) {
                    let tableData = res.data.list;
                    for (let i in tableData) {
                        tableData[i].actorStr = this.actors[Number(tableData[i].actor)];
                        tableData[i].statusStr = this.status[Number(tableData[i].status)];
                    }
                    this.tableData = tableData;
                    this.totalPage = res.data.total;
                }
                if (res.code === -99) {
                    router.push({
                        path: '/login'
                    });
                }
            });
        },
        // 编辑用户信息
        handleEdit(index, row) {
            this.editVisble = true;
            this.selectUser.id = row.id;
            this.selectUser.phone = row.phone;
            this.selectUser.password = this.rePassword;
            this.selectUser.real_name = row.real_name;
            this.selectUser.name = row.real_name + '(' + row.name + ')';
            this.selectUser.actor = parseInt(row.actor, 10);
            this.selectUser.status = parseInt(row.status, 10);
        },
        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val;
            let data = {
                actor: this.actor,
                name: this.searchStr,
                page: this.currentPage,
                pageNum: this.pageSize,
            };
            data._sig = Enmd5(data);
            this.getTableList(data);
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                actor: this.actor,
                name: this.searchStr,
                page: this.currentPage,
                pageNum: this.pageSize,
            };
            data._sig = Enmd5(data);
            this.getTableList(data);
        },
        // 搜索
        searchName() {
            let data = {
                actor: this.actor,
                name: this.searchStr,
                page: this.currentPage,
                pageNum: this.pageSize,
            };
            data._sig = Enmd5(data);
            this.getTableList(data);
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
            this.addUser._sig = Enmd5(this.addUser);
            ajax.post('/hall-admin-new/index.php?m=user&p=add&g=10000', this.addUser).then(res => {
                if (res.code === 0) {
                    this.addVisble = false;
                    this.$message({
                        message: '新增用户成功！',
                        type: 'success'
                    });
                    let data = {
                        actor: this.actor,
                        name: this.searchStr,
                        page: this.currentPage,
                        pageNum: this.pageSize,
                    };
                    data._sig = Enmd5(data);
                    this.getTableList(data);
                } else {
                    this.$message.error(res.msg);
                }
            });
        }
    },
    watch: {
        value(val) {
            console.log(val);
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
</style>
