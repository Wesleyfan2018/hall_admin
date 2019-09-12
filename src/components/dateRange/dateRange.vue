<template>
<div class="date-range">
    <el-date-picker v-model="selectDate" @change="dateChange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
</div>
</template>
<script>
export default {
    name: 'dateRange',
    props: ['setRange', 'initDate'],
    data() {
        return {
            selectDate: [new Date(this.initDate).setTime(new Date().getTime() - 3600 * 1000 * 24 * this.setRange), new Date(this.initDate)],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
        };
    },
    mounted() {
        this.selectDate[0] = this.getFormatDate(this.selectDate[0]);
        this.selectDate[1] = this.getFormatDate(this.selectDate[1]);
        this.$emit('selectDate', this.selectDate);
    },
    methods: {
        getFormatDate(datestr) {
            let seperator = '-';
            let date = new Date(datestr);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let nowDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = '0' + month;
            }
            if (nowDate >= 0 && nowDate <= 9) {
                nowDate = '0' + nowDate;
            }
            let newDate = year + seperator + month + seperator + nowDate;
            return newDate;
        },
        dateChange(val) {
            this.selectDate = val;
            this.selectDate[0] = this.getFormatDate(this.selectDate[0]);
            this.selectDate[1] = this.getFormatDate(this.selectDate[1]);
            this.$emit('selectDate', this.selectDate);
        }
    }
};
</script>
<style lang="scss">
.filter-container {
    .el-range-separator {
        padding: 0px;
    }
}
</style>