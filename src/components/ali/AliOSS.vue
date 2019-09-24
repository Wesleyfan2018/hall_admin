<template>
    <div>
        <el-upload
        class="upload"
        action
        multiple
        :limit="1"
         ref='upload'
        :http-request="toUpload"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    </div>
</template>
<script>
// 引入oss
const OSS = require('ali-oss');
export default {
    name: 'AliOSS',
    props: ['fileList', 'imageMax', 'objectName'],
    data() {
        return {
            // 测试oss访问地址 http://steven-hz-sandbox.oss-cn-hangzhou.aliyuncs.com
            stvOssDomain: 'http://steven-hz-sandbox.oss-cn-hangzhou.aliyuncs.com',
            uploadFilesName: '',
            uploadfile: [],
            uploadfileUrl: '',
            maxLength: 1,     // 限制上传个数
        };
    },
    methods: {
        // 文件上传
        toUpload(option) {

            // oss 基本配置
            let client = new OSS({
                region: 'oss-cn-hangzhou',
                accessKeyId: 'LTAIdySbMbNALHfK',
                accessKeySecret: 'VyuIrYRAA9IsZm6b4gSrOv5gcftv4H',
                bucket: 'steven-hz-sandbox',
                secure: false,
            });

            // 获取文件信息
            if (option.file) {

                let file = option.file;
                const point = file.name.lastIndexOf('.');
                let suffix = file.name.substr(point);

                // 方法块可改为同步
                client.put(this.objectName + suffix, file).then((res) => {
                    this.uploadfile.push({
                        url: this.stvOssDomain + this.objectName + suffix,
                        fileUrl: res.res.requestUrls[0],
                        name: res.name,
                    });
                    this.$emit('getUploadData', this.uploadfile);
                }).catch((err) => {
                    alert(err);
                });
            }
        },
        clearUpload() {
            this.$refs.upload.clearFiles();
        }
    },
    created() {
        this.maxLength = this.imageMax;
    },
};
</script>