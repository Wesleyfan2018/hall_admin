<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="OSS资源管理"></el-form-item>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="目录">
                    <el-select v-model="filterPath" placeholder="请选择">
                        <el-option
                            v-for="item in path"
                            :key="item.path"
                            :label="item.name"
                            :value="item.path"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="el-icon-search"
                        @click="load"
                    ></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="filter-item"
                        type="primary"

                        @click="addVisble=true"
                    >上传</el-button>
                </el-form-item>
            </el-form>

            <el-form :inline="true" class="demo-form-inline">
                <el-table border :data="ossList">
                    <el-table-column align="center" label="编号" prop="id" width="70"></el-table-column>
                    <el-table-column align="left" label="资源地址" prop="url" width="700"></el-table-column>
                    <el-table-column align="center" label="上传目录" prop="pathName"></el-table-column>
                    <el-table-column align="center" label="备注" prop="remark"></el-table-column>
                    <el-table-column align="center" label="操作时间" prop="create_time"></el-table-column>

                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="delClick(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block pagination">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :pager-count="5"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalPage"
                    ></el-pagination>
                </div>
            </el-form>

             <!-- 弹层区 -->
        <el-dialog title="上传"  :visible.sync="addVisble" width="40%">
            <el-form
                label-position="right"
                label-width="120px"
                :model="addConf"
                ref="addConf"
                :rules="rules"
                class="dialog-form"
            >
                 <el-form-item label="目录:">
                <el-select v-model="addData.path" placeholder="请选择">
                    <el-option
                        v-for="(item,i) in path"
                        :key="i"
                        :label="item.name"
                        :value="i"
                    ></el-option>
                </el-select>
            </el-form-item>

                <el-form-item label="本地上传" prop="image" >
                   <el-upload
                        class="upload-demo"
                        ref="upload"
                        :on-success="uploadSuccess"
                        :before-upload="upload"
                        :on-change="handleChange"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip"></div>
                        </el-upload>
                </el-form-item>
                 <el-form-item label="备注" prop="remark">
                    <el-input class="form-input" v-model="addData.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisble = false">取 消</el-button>
                <el-button type="success" @click="clickUpload()">添 加</el-button>
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
            totalPage: 0,
            pageSize: 20,
            currentPage: 1,
            selectDate: [],
            addVisble: false,
            filterPath: '',
            UploadFile: [],
            addData: {
                'remark': '',
                'path': '1',
            },
            ossList: [],
            path: [],

        };
    },
    activated() {
        this.load();
        this.loadPath();
    },
    methods: {
        // 初始化下载地址
        upload(file) {
            let data = { 'path': this.addData.path, 'remark': this.addData.remark };
            let fileData = { 'ossFile': file };
            revoke('/index.php?m=Oss&p=upload', data, fileData).then(res => {
                if (res.code === 0) {
                    this.addVisble = false;
                    this.load();
                } else {
                    this.$message.error(res.msg);
                }
            });
            return false;
        },
        handleChange(file, fileList) {
            this.UploadFile = fileList;
        },
        clickUpload() {
            console.log(this.$refs.upload, this.UploadFile);
            if (this.UploadFile.length === 0) {
                this.$message.error('请选择上传文件！');
            }
            this.$refs.upload.submit();
        },
        // 加载
        load() {
            let data = { page: this.currentPage, pageNum: this.pageSize, 'path': this.filterPath };
            revoke('/index.php?m=Oss&p=lists', data).then(res => {
                if (res.code === 0) {
                    this.ossList = res.data.list;
                    this.totalPage = res.data.total;
                } else {
                    this.ossList = [];
                    this.totalPage = 0;
                }
            });
        },
        loadPath() {
            revoke('/index.php?m=Oss&p=path', {}).then(res => {
                if (res.code === 0) {
                    this.path = res.data.list;

                } else {
                    this.path = [];
                }
            });
        },
        delClick(row) {
            this.$confirm('确认删除文件吗', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.del(row.id);
            }).catch(() => {});
        },
        del(id) {
            let data = { id: id };
            revoke('/index.php?m=Oss&p=del', data).then(res => {
                if (res.code === 0) {
                    this.load();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        // 修改分页器数量
        handleSizeChange(val) {
            this.pageSize = val;
            this.load();
        },
        // 切换分页器
        handleCurrentChange(val) {
            this.load();
        },

        // 提交上传
        submitUpload() {
            this.$refs.upload.submit();
        },

    }
};
</script>