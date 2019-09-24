<template>
    <div class="app-containei">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="日志查看">
                </el-form-item>

                 <el-button  size="mini" :type="but.data" @click="tag(0)">data目录</el-button>
                 <el-button  size="mini" :type="but.error" @click="tag(1)">错误日志</el-button>



                 <el-table :data="dir" style="width: 100%" @cell-click="selectLog">
                    <el-table-column prop="name" label="目录">
                    </el-table-column>
                     <el-table-column prop="size" label="大小">
                    </el-table-column>
                     <el-table-column prop="utime" label="修改时间">
                    </el-table-column>
                </el-table>

                  <el-form-item label="服务器IP:" style="margin: 0px 0px 0px 0px">
                      <span>{{sip}}</span>
                </el-form-item>

                   <el-input type="textarea"  v-model="contents" style="margin: 0px 0px 0px 0px" placeholder="文件内容" :rows="9" resize="vertical"></el-input>


            </el-form>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    data() {
        return {
            contents: '',
            file: '',
            error: 0,
            dir: [],
            sip: '',
            but: { 'data': 'info', 'error': 'primary' },
        };
    },
    mounted() {
        this.loadLog();
    },
    methods: {
        selectLog(row, column, cell, event) {
            this.file = row.name;
            this.loadLog();
        },
        tag(error) {
            if (error === 1) {
                this.but.error = 'info';
                this.but.data = 'primary';
            } else {
                this.but.error = 'primary';
                this.but.data = 'info';
            }
            this.error = error;
            this.loadLog();
        },
        // 调用系统的解码，性能快4倍
        decode(input) {
            return this._utf8_decode(window.atob(input));
        },
        // 加载历史记录
        loadLog() {
            let args = { 'file': this.file, 'error': this.error };
            let data = {
                callm: 'logs',
                callp: 'cat',
                args: JSON.stringify(args),
            };
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.dir = res.data.dir;
                    if (res.data.contents) {
                        this.contents = this.decode(res.data.contents);
                    }
                    this.sip = res.data.ip;
                }
            });
        },
        _utf8_decode: function (utftext) {
            let string = '';
            let i = 0;
            let c = 0;
            let c2 = 0;
            let c3 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        },
    }
};
</script>