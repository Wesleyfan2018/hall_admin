<template>
<div>
    <div>
        <el-form :inline="true" class="demo-form-inline text-right" style="width:90%;margin:0 5%;">
            <el-form-item class="text-right">
                <el-button class="filter-item" type="info" @click="showHistory">修改记录</el-button>
            </el-form-item>
            <el-form-item class="text-right">
                <el-button class="filter-item" type="primary" @keyup.enter="searchName" @click="toggleStatus">{{switchStatus}}</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div id="editor">
        <mavon-editor
            v-show="defaultStatus === 'preview'"
            v-model="value"
            :defaultOpen="defaultStatus"
            :toolbarsFlag="false"
            :subfield="false"
            :toolbars="toolbars"
            class="editor"
            :ishljs="true">
        </mavon-editor>
        <mavon-editor
            v-show="defaultStatus === 'edit'"
            v-model="value"
            :toolbars="toolbars"
            class="editor"
            :ishljs="true">
        </mavon-editor>
    </div>
    <div class="dialog_div">
        <el-dialog title="编辑用户信息" :visible.sync="editHistory" width="50%">
            <el-table
                :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column
                prop="date"
                label="日期"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
                label="姓名"
                width="180">
                </el-table-column>
                <el-table-column
                prop="address"
                label="地址">
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button
                        size="mini"
                        @click="console.log('编辑')">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="console.log('删除')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHistory = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</div>
</template>
<script>
// Local Registration
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
export default {
    name: 'editor',
    components: { mavonEditor },
    data() {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            searchStr: '',
            switchStatus: '编 辑',
            defaultStatus: 'preview', // 编辑器的状态：'edit'编辑状态，'preview'预览状态
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: true, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                save: true, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                // subfield: true, // 单双栏模式
                // preview: true, // 预览
            },
            value: '# h5', // 编辑器的值
            editHistory: false
        };
    },
    methods: {
        toggleStatus() {
            if (this.defaultStatus === 'edit') {
                this.switchStatus = '编 辑';
                this.defaultStatus = 'preview';
            } else {
                this.switchStatus = '预 览';
                this.defaultStatus = 'edit';
            }
        },
        showHistory() {
            this.editHistory = true;
        }
    }
};
</script>
<style lang="scss" scoped>
#editor {
    margin: auto;
    width: 90%;
    height: 580px;
}
.editor {
    height: 100%;
}
</style>