<template>
    <div>
        <el-upload
            class="upload"
            action
            multiple
            :limit="1"
            ref="upload"
            :http-request="toUpload"
            :file-list="fileList"
        >
            <el-button size="small" type="primary">{{butName}}</el-button>
            <div slot="tip" class="el-upload__tip">{{tip}}</div>
        </el-upload>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
// 引入oss
const OSS = require('ali-oss');
export default {
    name: 'AliOSS',
    props: ['fileList', 'imageMax', 'objectName', 'butName', 'tip'],

    data() {
        return {
            // 测试oss访问地址 http://steven-hz-sandbox.oss-cn-hangzhou.aliyuncs.com
            stvOssDomain:
                'http://steven-hz-sandbox.oss-cn-hangzhou.aliyuncs.com',
            uploadFilesName: '',
            uploadfile: [],
            uploadfileUrl: '',
            maxLength: 1, // 限制上传个数
            region: '',
            accessKeyId: '',
            accessKeySecret: '',
            bucket: '',
        };
    },
    mounted() {
        this.initOssConf();
    },
    methods: {
        initOssConf() {
            revoke('/index.php?m=config&p=getOssConf', {}).then(res => {
                if (res.code === 0) {
                    this.accessKeyId = res.data.ACCESS_KEY_ID;
                    this.accessKeySecret = res.data.ACCESS_KEY_SECRET;
                    this.bucket = res.data.BUCKET_NAME;
                    this.stvOssDomain = res.data.ACCESS_DOMAIN;
                    console.log(res.data, this.accessKeyId);
                }
            });
        },
        // 文件上传
        toUpload(option) {
            // oss 基本配置
            let client = new OSS({
                region: 'oss-cn-hangzhou',
                accessKeyId: this.accessKeyId, // 'LTAIdySbMbNALHfK',
                accessKeySecret: this.accessKeySecret, // 'VyuIrYRAA9IsZm6b4gSrOv5gcftv4H',
                bucket: this.bucket, // 'steven-hz-sandbox',
                secure: false
            });

            // 获取文件信息
            if (option.file) {
                let file = option.file;
                const point = file.name.lastIndexOf('.');
                let suffix = file.name.substr(point);

                // 方法块可改为同步
                client
                    .put(this.objectName + suffix, file)
                    .then(res => {
                        this.uploadfile.push({
                            url: this.stvOssDomain + this.objectName + suffix,
                            fileUrl: res.res.requestUrls[0],
                            name: res.name
                        });
                        this.$emit('getUploadData', this.uploadfile);
                    })
                    .catch(err => {
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
    }
};
</script>