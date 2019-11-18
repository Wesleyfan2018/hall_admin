<template>
    <div class="app-containei">
        <el-form :inline="false" class="demo-form-inline">
            <el-form-item label="日志查看"></el-form-item>

            <el-button size="mini" :type="but.data" @click="tag(0,1)">data目录</el-button>
            <el-button size="mini" :type="but.error" @click="tag(1,1)">错误日志</el-button>

            <el-form-item label="服务器:" style="margin: 0px 0px 0px 0px" v-show="multiIp">
                <el-button
                    size="mini"
                    :type="ip['type']"
                    v-for="(ip,index) in ips"
                    :key="index"
                    @click="tag(index,2)"
                    v-show="multiIp"
                >{{ ip.nip }}</el-button>
            </el-form-item>

            <el-table :data="dir" style="width: 100%" @cell-click="selectLog">
                <el-table-column prop="name" label="文件名"></el-table-column>
                <el-table-column prop="size" label="大小"></el-table-column>
                <el-table-column prop="utime" label="修改时间"></el-table-column>
                <el-table-column prop="utime" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="down(scope.row)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-input
                type="textarea"
                v-show="false"
                v-model="contents"
                style="margin: 0px 0px 0px 0px"
                placeholder="文件内容"
                :rows="9"
                resize="vertical"
            ></el-input>
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
            sip: '47.110.149.37',
            ips: [
                { nip: '172.16.19.122', ip: '47.110.149.37', type: 'primary' },
                { nip: '172.16.19.123', ip: '47.110.154.156', type: 'info' }
            ],
            multiIp: false,
            but: { data: 'primary', error: 'info' }
        };
    },

    mounted() {
        this.loadLog();
    },
    methods: {
        selectLog(row, column, cell, event) {
            // 查看功能去掉
            if (column.label != '') {
                return;
            }
            this.file = row.name;
            this.loadLog();
        },
        tag(tag, type) {
            // 目录跟错误日志切换处理
            if (type == 1) {
                if (tag === 1) {
                    this.but.error = 'primary';
                    this.but.data = 'info';
                } else {
                    this.but.error = 'info';
                    this.but.data = 'primary';
                }
                this.error = tag;
            } else {
                this.sip = this.ips[tag].ip;
                // IP切换
                console.log(tag);
                for (let i in this.ips) {
                    this.ips[i]['type'] = 'info';
                }
                this.ips[tag].type = 'primary';
            }
            this.loadLog();
        },
        // 调用系统的解码，性能快4倍
        decode(input) {
            return this._utf8_decode(window.atob(input));
        },
        // 加载历史记录
        loadLog() {
            let args = { file: this.file, error: this.error, ip: this.sip };
            revoke('/index.php?m=logs&p=cat', args).then(res => {
                if (res.code === 0) {
                    this.dir = res.data.dir;
                    if (res.data.contents) {
                        this.contents = this.decode(res.data.contents);
                    }
                    this.multiIp = res.data.ipNum > 1 ? true : false;

                    console.log(this.multiIp);
                }
            });
        },
        // 清空
        clear(row) {
            let file = row ? row.name : '';
            let args = { file: file, error: this.error, ip: this.sip };
            revoke('/index.php?m=logs&p=clear', args).then(res => {
                if (res.code === 0) {
                    this.loadLog();
                }
            });
        },
        // 下载日志
        down(row) {
            window.location.href = row.down;
        },
        _utf8_decode: function(utftext) {
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
                } else if (c > 191 && c < 224) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(
                        ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
                    );
                    i += 3;
                }
            }
            return string;
        }
    }
};
</script>