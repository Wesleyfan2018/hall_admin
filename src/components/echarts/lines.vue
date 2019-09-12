<!-- 线图 -->
<template>
  <div class="echarts-wrap" :id="domid">
        <div class="myChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
    props: ['domid', 'echartOption', 'searchTime'],
    mounted() {
        this.echartsShow();
    },
    methods: {
        // 图表插件
        echartsShow() {
            let that = this;
            let chartData = that.echartOption.options;
            // 找到容器
            let chartObj = document.getElementById(that.domid).getElementsByClassName('myChart')[0];
            let myChart = echarts.init(chartObj);
            // 参数配置
            let chartOptions = {
                title: { text: (chartData && chartData.echartName) || '无标题' },
                xAxis: (chartData && chartData.xAxis) || { // X轴
                    type: 'category',
                    data: chartData && chartData.datas && chartData.datas.time,  // ['04/16', '04/21', '04/26', '05/01', '05/06', '05/11', '05/16'],
                    boundaryGap: false,
                    axisLine: { // 设置轴线的属性
                        lineStyle: {
                            color: '#8e8e8e', //
                            width: 1, // 这里是为了突出显示加上的
                        }
                    },
                    axisTick: { // 去掉坐标轴刻线
                        show: true
                    },
                },
                tooltip: (chartData && chartData.tooltip) || { // 鼠标悬停提示内容
                    trigger: 'axis',
                    // 在这里设置
                    // formatter: '{a0}：{c0}%',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: (chartData && chartData.grid) || { // 布局   控制图的大小，调整下面这些值就可以
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                legend: (chartData && chartData.legend) || {
                    data: (chartData && chartData.legenddata) || [],
                    selected: (chartData && chartData.selected) || [],
                    y: 'top'
                },
                yAxis: (chartData && chartData.yAxis) || [ // 两个y轴
                    {
                        name: 'Rate',
                        type: 'value',
                        axisLine: { // 设置轴线的属性
                            lineStyle: {
                                color: '#8e8e8e',
                                width: 1 // 这里是为了突出显示加上的
                            },
                            formatter: '{value} %'
                        },
                        splitLine: {    // 设置网格样式
                            show: true,
                            lineStyle: {
                                color: ['#F5F5F5'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                ],
                series: (chartData && chartData.series) || [ // 用于指定图标显示类型
                    {
                        name: (chartData && chartData.echartXName),
                        type: 'line',
                        tooltip: {
                            trigger: 'axis',
                        },
                        yAxisIndex: 0,
                        smooth: false, // true:光滑的曲线    false:直线
                        itemStyle: {
                            normal: {
                                color: 'rgba(93,98,1811,1)', // #268EFA  蓝色
                                lineStyle: {
                                    width: 1.4   // 设置线条粗细
                                },
                                label: {
                                    textStyle: {
                                        fontSize: 10,
                                        color: '#ccc'
                                    }
                                }
                            }
                        },
                        data: chartData && chartData.datas && chartData.datas.data
                    },
                ]
            };
            // 开始渲染
            myChart.setOption(chartOptions, true);
            // 自动缩放
            window.addEventListener('resize', myChart.resize);
        },
    },
    watch: {
        // 更新图表
        echartOption: {
            handler(newVal, oldVal) {
                debugger;
                if (newVal) {
                    let chartObj = document.getElementById(this.domid).getElementsByClassName('myChart')[0];
                    this.echartsShow(chartObj, newVal);
                }
            },
            deep: true
        },
        searchTime(val) {
            let chartObj = document.getElementById(this.domid).getElementsByClassName('myChart')[0];
            this.echartsShow(chartObj, this.echartOption);
        }
    }
};
</script>

<style lang="scss">
.myChart{
    width: 100%;
    height: 400px;
}
</style>