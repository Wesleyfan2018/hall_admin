<template>
    <div class="app-containei">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="日期：">
                    <el-date-picker v-model="sdate" type="date" placeholder="选择日期" :picker-options="enddate"  value-format="yyyy-MM-dd" @change="selectDate"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="find"></el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="dataList" :default-sort = "{prop: 'allNum', order: 'descending'}">
                <el-table-column align="center" label="分享ID" prop="id">
                </el-table-column>
                <el-table-column align="center" label="分享次数" prop="shareCount">
                </el-table-column>
                <el-table-column align="center" label="分享人数" prop="shareNum">
                </el-table-column>
            </el-table>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    data() {
        let year = new Date().getFullYear();
        let month =  new Date().getMonth() + 1;
        let day = new Date().getDate();

        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (day >= 0 && day <= 9) {
            day = '0' + day;
        }

        let currentdate = year + '-' + month + '-' + day;

        return {
            ip: '',
            ips: [],
            sdate: currentdate,
            dataList: [],
            enddate: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 24 * 3600;
                }
            },
        };
    },
    created() {
        this.find();
    },
    methods: {
        // 选择日期
        selectDate() {
            this.find();
        },
        // 查找数据
        find() {
            let data = {
                date: this.sdate,
            };
            revoke('/index.php?m=stat&p=shareHub', data).then(res => {
                if (res.code === 0) {
                    this.dataList = res.data.list;
                }
            });
        },
    }
};
</script>