<template>
    <div class="app-containei">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="日期：">
                    <el-date-picker v-model="sdate" type="date" placeholder="选择日期" :picker-options="enddate"  value-format="yyyy-MM-dd" @change="selectDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="服务器：">
                    <el-select v-model="ip" placeholder="请选择服务器" class="nav-select">
                        <el-option
                            v-for="(i, t) in ips"
                            :key="(i, t)"
                            :label="i"
                            :value="t">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="find"></el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="loglist" :default-sort = "{prop: 'allNum', order: 'descending'}" @cell-click="dispChart">
                <el-table-column align="center" label="接口名称" prop="api">
                </el-table-column>
                <el-table-column align="center" label="请求数" sortable prop="allNum">
                </el-table-column>
                <el-table-column align="center" label="平均流入流量(kb)" sortable prop="allInput">
                </el-table-column>
                <el-table-column align="center" label="平均流出流量(kb)" sortable prop="allOutput">
                </el-table-column>
                <el-table-column align="center" label="平均运行时间(秒)" sortable prop="allRunTime">
                </el-table-column>
            </el-table>
            <el-dialog title="统计图" :visible.sync="dialogTableVisible" width="60%">
                <div id="myChart"  style="height:600px;"></div>
            </el-dialog>

    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
import echarts from 'echarts';
export default {
    data() {
        return {
            ip: '',
            ips: [],
            sdate: '',
            loglist: [],
            enddate: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 24 * 3600;
                }
            },
            chartfeild: {},
            chartdata: {},
            dialogTableVisible: false,
            chart_clickFeild: '',
            chart_unit: '',
            chart_api: '',
            chart_label: '',
        };
    },
    created() {
        this.sdate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        this.selectOption();
        this.find();
    },
    methods: {
        selectOption() {
            let args = {
                date: this.sdate,
                type: 1, // 1是获取ip列,2是获取数据列表
            };
            let data = {
                callm: 'Statistics',
                callp: 'catLog',
                args: JSON.stringify(args),
            };
            revoke('/hall-admin-new/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.ips = res.data.ips;
                }
            });
        },
        selectDate() {
            this.selectOption();
            this.find();
        },
        // 查找数据
        find() {
            let args = {
                date: this.sdate,
                ip: this.ip,
                type: 2, // 1是获取ip列,2是获取数据列表
            };
            let data = {
                callm: 'Statistics',
                callp: 'catLog',
                args: JSON.stringify(args),
            };
            revoke('/hall-admin-new/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    let tableData = res.data.list;
                    for (let i in tableData) {
                        tableData[i].allRunTime = Math.floor(tableData[i].allRunTime / tableData[i].allNum * 10000) / 10000;
                        tableData[i].allInput = Math.floor(tableData[i].allInput / tableData[i].allNum / 1024 * 100) / 100;
                        tableData[i].allOutput = Math.floor(tableData[i].allOutput / tableData[i].allNum / 1024 * 100) / 100;
                    }
                    this.loglist = tableData;
                }
            });
        },
        // 显示图表
        dispChart(row, column, cell, event) {
            let clickFeild = column.property;
            let unit = '';
            switch (clickFeild) {
                case 'allRunTime':
                    unit = '{value}秒';
                    break;
                case 'allNum':
                    unit = '{value}次';
                    break;
                case 'allInput':
                    unit = '{value}kb';
                    break;
                case 'allOutput':
                    unit = '{value}kb';
                    break;
                default:
                    return false;
            }
            this.dialogTableVisible = true;
            let args = {
                date: this.sdate,
                ip: this.ip,
                api: row.api,
            };
            let data = {
                callm: 'Statistics',
                callp: 'chart',
                args: JSON.stringify(args),
            };
            revoke('/hall-admin-new/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.chartdata = res.data.list;
                    this.chartfeild = res.data.keys;
                    console.log(this.chartdata[this.sdate]);
                    this.chart_clickFeild = clickFeild;
                    this.chart_unit = unit;
                    this.chart_api = row.api;
                    this.chart_label = column.label;
                    // this._dispChart(clickFeild, unit, row.api, column.label);
                    this._dispChart();
                }
            });
        },
        _dispChart(clickFeild, unit, api, label) {
            clickFeild = this.chart_clickFeild;
            unit = this.chart_unit;
            api = this.chart_api;
            label = this.chart_label;
            let xdata = [];
            let sdata = {};
            let legenddata = [];
            for (let i = 1; i <= 288; i++) {
                // 计算横坐标数据
                let temp = i * 300 * 1000 + new Date().getTimezoneOffset() * 60 * 1000;
                xdata.push(new Date(temp).getHours() + ':' + new Date(temp).getMinutes());
                // 计算纵坐标数据
                for (let j in this.chartfeild) {
                    let sdatatemp = 0;
                    if (this.chartdata[this.chartfeild[j]][i]) {
                        switch (clickFeild) {
                            case 'allRunTime':
                                sdatatemp = this.chartdata[this.chartfeild[j]][i].runtime;
                                break;
                            case 'allNum':
                                sdatatemp = this.chartdata[this.chartfeild[j]][i].num;
                                break;
                            case 'allInput':
                                sdatatemp = this.chartdata[this.chartfeild[j]][i].input;
                                break;
                            case 'allOutput':
                                sdatatemp = this.chartdata[this.chartfeild[j]][i].output;
                                break;
                        }
                    }
                    if (typeof sdata[this.chartfeild[j]] === 'undefined') {
                        sdata[this.chartfeild[j]] = [];
                    } else {
                        sdata[this.chartfeild[j]].push(sdatatemp);
                    }
                }
            }
            // 循环标识
            for (let j in this.chartfeild) {
                legenddata.push(this.chartfeild[j] + label);
            }
            console.log(sdata);
            console.log('myChart1');
            let myChart = echarts.init(document.getElementById('myChart'));
            console.log(legenddata);
            console.log(sdata[this.chartfeild[2]]);
            // 绘制图表
            myChart.setOption({
                title: { text: '接口' + api + '统计图' },
                tooltip: { trigger: 'axis' },
                legend: {
                    data: legenddata,
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true },
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xdata,
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: unit,
                        }
                    }
                ],
                series: [{
                    name: legenddata[0],
                    type: 'line',
                    data: sdata[this.chartfeild[0]],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' },
                        ]
                    }
                },
                {
                    name: legenddata[1],
                    type: 'line',
                    data: sdata[this.chartfeild[1]],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' },
                        ]
                    }
                },
                {
                    name: legenddata[2],
                    type: 'line',
                    data: sdata[this.chartfeild[2]],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' },
                        ]
                    }
                }

                ],

            });
        }
    }
};
</script>