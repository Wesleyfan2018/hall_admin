<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                    <date-range @selectDate="selectDate" :initDate="initDate" :setRange="setRange"></date-range>
                </el-form-item>

                <el-form-item label="渠道：">
                    <el-select v-model="filterChannel" placeholder="请选择">
                        <el-option v-for="(item, index) in channelMap" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="地区：">
                    <area-select :isMultiple="area_multiple" :has_area="isHasArea" @areaValue="selectArea" :initArea="initArea"></area-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getEchartData"></el-button>
                </el-form-item>
            </el-form>

            <!-- echart -->
            <div class="table-main">
                <line-echart v-if="show_1" domid="online" :echartOption="echartOption1" :searchTime="timestamp"></line-echart>
                <line-echart v-if="show_2" domid="onlinePlay" :echartOption="echartOption2" :searchTime="timestamp" style="margin-top:30px;"></line-echart>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import { revoke } from '@/api/getApi';
import { AreaSelect } from '@/components/areaselect';
import { dateRange } from '@/components/dateRange';
import lineEchart from '@/components/echarts/lines';
export default {
    name: 'online',
    components: { dateRange, AreaSelect, lineEchart },
    data() {
        return {
            show_1: false,
            show_2: false,
            scope: 'scope',
            // 表格loading
            loading: true,
            // 地区插件是否支持多选
            area_multiple: false,
            // 地区插件是否支持选区
            isHasArea: true,
            initArea: [0],
            channel_value: ['0', '0'],
            channel_options: [],
            // 日期插件
            initDate: new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 1),
            setRange: 7,
            startDate: '',
            endDate: '',
            // 渠道
            filterChannel: '0',
            channelMap: [],
            // 地区插件
            provId: '0',
            cityId: '0',
            areaId: '0',
            // echarts参数
            data: [],
            echartOption1: {},
            echartOption2: {},
            timestamp: ''
        };
    },
    created() {
        this.initChannel();
    },
    mounted() {
        this.getEchartData();
    },
    methods: {
        // 获取表格信息
        getEchartData() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let self = this;
            let data = {
                startDate: self.startDate,
                endDate: self.endDate,
                channel: self.filterChannel,
                provId: self.provId,
                cityId: self.cityId,
                areaId: self.areaId,
            };
            revoke('index.php?m=stat&p=getOnlineRecharge', data).then(res => {
                if (res.code === 0) {
                    self.data = res.data;
                    self.loading = false;
                    // 充值金额 echart
                    self.initOnlineEchart();
                    // 充值人数 echart
                    self.initPlayEchart();
                    loading.close();
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res,
                        duration: 3000
                    });
                }
            });
        },
        // 充值金额 echart
        initOnlineEchart() {
            let self = this;
            let dataObj = {
                echartName: '充值金额',
                legenddata: self.data.legend,
                series: self.data.recharge_amount,
                datas: {
                    time: self.data.xAxis,
                    data: []
                },
            };
            this.echartOption1.id = 'online';
            this.echartOption1.options = dataObj;
            this.timestamp = new Date().getTime();
            this.show_1 = true;
        },
        // 充值人数 echart
        initPlayEchart() {
            let self = this;
            let dataObj = {
                echartName: '充值人数',
                legenddata: self.data.legend,
                series: self.data.recharge_num,
                datas: {
                    time: self.data.xAxis,
                    data: []
                },
            };
            this.echartOption2.id = 'onlinePlay';
            this.echartOption2.options = dataObj;
            this.timestamp = new Date().getTime();
            this.show_2 = true;
        },
        // 日期选项
        selectDate(value) {
            this.startDate = value[0];
            this.endDate = value[1];
        },
        // init渠道/版本选项
        initChannel() {
            let data = {};
            revoke('index.php?m=stat&p=getChannel', data).then(res => {
                if (res.code === 0) {
                    this.channelMap = res.data;
                }
            });
        },
        // 绑定选择后的地区选项值
        selectArea(array) {
            let str = array[0].toString();
            if (str.length <= 2) {
                this.provId = str;
                this.cityId = '0';
                this.areaId = '0';
            } else if (str.length <= 4) {
                this.provId = str.charAt(0) + str.charAt(1);
                this.cityId = str;
                this.areaId = '0';
            } else {
                this.provId = str.charAt(0) + str.charAt(1);
                this.cityId = str.charAt(2) + str.charAt(3);
                this.areaId = str;
            }
        }
    }
};
</script>
