<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="查询条件：">
                    <el-input v-model="search" class="form-input"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="el-icon-search"
                        @click="doSearch"
                    >搜索</el-button>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button class="filter-item" type="primary" @click="openTreeView">树状形态查看</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="自增id" prop="id"></el-table-column>
                <el-table-column align="center" label="地区id" prop="code"></el-table-column>
                <el-table-column align="center" label="地区名称" prop="name"></el-table-column>
                <el-table-column align="center" label="所属上级" prop="parentInfo"></el-table-column>
                <el-table-column align="center" label="地区类型" prop="levelStr"></el-table-column>
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
                    :total="totalPage"
                ></el-pagination>
            </div>
        </div>
        <div class="dialog_div">
            <el-dialog
                title="树形展示"
                v-if="showTreeVisble"
                :visible.sync="showTreeVisble"
                width="50%"
                :before-close="hiddenTree"
            >
                <el-tree
                    class="filter-tree"
                    :props="defaultProps"
                    :load="loadNode1"
                    lazy
                    :accordion="true"
                    ref="tree2"
                >
                    <!--             
                :data="treeData"
                    default-expand-all 默认展开所有节点
                    accordion 是否每次只打开一个同级树节点展开
                    -->
                </el-tree>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi'
import { debuglog } from 'util'
export default {
    name: 'actor',
    data() {
        return {
            tableData: [],
            totalPage: 0,
            pageSize: 10,
            currentPage: 1,
            search: '',
            showTreeVisble: false,
            defaultProps: {
                label: 'name'
                // children: '成都市', // children 指定子树为节点对象的某个属性值,string, function(data, node)类型
                // isLeaf:true  //指定节点是否为叶子节点
            },
            treeData: [] //接收返回值
        }
    },
    mounted() {
        this.initList()
    },
    methods: {
        loadNode1(node, resolve) {
            // 接口请求数据如下
            let args = {
                nodeId: node.id //传入选中节点的id
            }
            revoke('/index.php?m=area&p=getList', args).then(res => {
                if (res.code === 0) {
                    let datas = res.data

                    // 接口返回数据datas结构如下
                    // [{
                    //     name: '成都市',
                    //     id:2,
                    //     num:22
                    // }, {
                    //     name: '绵阳市',
                    //     id:3,
                    //     num:3
                    // }]
                    // 末级节点时datas返回[]

                    let _datas = []
                    for (let i = 0; i < datas.length; i++) {
                        let _item = datas[i]
                        _datas.push({
                            name: _item.name + '(' + _item.num + ')',
                            id: _item.id
                        })
                    }
                    resolve(_datas)
                }
            })
        },
        initList() {
            this.getTableList()
        },
        hiddenTree(done) {
            this.showTreeVisble = false
        },
        // 打开树形弹窗
        openTreeView() {
            this.showTreeVisble = true
        },
        getTableList() {
            let that = this
            let args = {
                page: this.currentPage,
                pageNum: this.pageSize,
                search: this.search
            }
            revoke('/index.php?m=area&p=getList', args).then(res => {
                if (res.code === 0) {
                    // for
                    this.tableData = res.data.list
                    this.totalPage = res.data.total
                }
            })
        },
        doSearch() {
            this.getTableList()
        },
        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val
            this.getTableList()
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.currentPage = val
            this.getTableList()
        }
    }
}
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
    width: 100px;
    margin: 0 5px 10px 0;
}
.dialog-form {
    margin: 20px;
}
.form-input {
    width: 200px !important;
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
