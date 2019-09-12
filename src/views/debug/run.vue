<template>
    <div class="app-containei">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="php执行">
                </el-form-item>
                <el-input type="textarea"  v-model="cmd" :rows="6" placeholder="请输入内容"  resize="vertical"></el-input>
                <el-checkbox v-model="admin">管理后台执行</el-checkbox>
                <el-button type="success" style="margin: 8px 0px 0px 0px" size="small" @click="run">运行</el-button>
                <el-input type="textarea"  v-model="runOutPut" style="margin: 30px 0px 0px 0px" placeholder="这是执行结果!" :rows="9" resize="vertical"></el-input>
                <el-table :data="phpRunLog" style="width: 100%" @cell-click="SelectLog">
                <el-table-column prop="cmd" label="历史记录">
                </el-table-column>
                <el-table-column  label="收藏">
                  <template slot-scope="scope">
                        <el-button class="filter-item" type="primary"   :icon="scope.row.collectIcon" size="medium" @click="collect(scope.row)"></el-button>
                    </template>
                </el-table-column>
               </el-table>

            </el-form>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';

export default {
    data() {
        return {
            runOutPut: '',
            cmd: '',
            admin: false,
            phpRunLog: [],
        };
    },
    mounted() {
        this.loadLog();
    },
    methods: {
        run() {
            let data = {
                admin: this.admin ? 1 : 0,
                cmd: this.cmd,
            };
            revoke('/index.php?m=debug&p=Run', data).then(res => {
                if (res.code === 0) {
                    this.runOutPut = '运行时间:' + res.data.runTime + '秒 \r\n' + this.decode1(res.data.runOutPut);
                } else {
                    this.$message.error(res.msg);
                }
                // 重新加载
                this.loadLog();
            });
        },
        SelectLog(row, column, cell, event) {
            this.cmd = row.cmd;
        },
        // 加载历史记录
        loadLog() {
            let data = {};
            revoke('/index.php?m=debug&p=getPhpRunLog', data).then(res => {
                if (res.code === 0) {
                    for (let i in res.data.phpRunLog) {
                        res.data.phpRunLog[i].collectIcon = res.data.phpRunLog[i].collect === '1' ? 'el-icon-star-on' : 'el-icon-star-off';
                    }
                    this.phpRunLog = res.data.phpRunLog;
                }
            });
        },
        // base64解码
        decode: function (input) {
            let keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            let output = '';
            let chr1; let chr2; let chr3;
            let enc1; let enc2; let enc3;
            let enc4;
            let i = 0;
            let base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input))
            {
                return input;
            }
            let input1 = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
            while (i < input1.length) {
                enc1 = keyStr.indexOf(input1.charAt(i++));
                enc2 = keyStr.indexOf(input1.charAt(i++));
                enc3 = keyStr.indexOf(input1.charAt(i++));
                enc4 = keyStr.indexOf(input1.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = this._utf8_decode(output);
            return output;
        },
        // 调用系统的解码，性能快4倍
        decode1(input) {
            return this._utf8_decode(window.atob(input));
        },
        // private method for UTF-8 decoding
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
        // 收藏取消
        collect(row) {
            let data = { 'id': row.id, 'collect': row.collect === '1' ? 0 : 1 };
            revoke('/index.php?m=debug&p=collect', data).then(res => {
                if (res.code === 0) {
                    // 重新加载
                    this.loadLog();
                }
            });
        }
    },

};
</script>