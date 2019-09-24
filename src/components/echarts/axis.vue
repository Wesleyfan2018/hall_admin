<!-- 区域图 -->
<template>
   <div class="echarts-wrap"  :id="domid">
        <div class="myChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
export default {
    props: ['domid'],
    data() {
        return {

        };
    },
    created() {
    },
    computed: {
        ...mapState({
            axisEchartData: state => state.echarts.axisEchartData    // 获取区域图数据
        })
    },
    mounted() {
        this.echartsShow();
    },
    methods: {
        // 图表插件
        echartsShow() {
            let that = this;
            let chartData = this.axisEchartData[this.domid];
            // 找到容器
            let chartObj = document.getElementById(this.domid).getElementsByClassName('myChart')[0];
            let myChart = echarts.init(chartObj);
            let chartOptions = {
                title: {
                    text: (chartData && chartData.echartName) || '区域图'
                },
                tooltip: (chartData && chartData.tooltip) || {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: (chartData && chartData.legend) || {        // 是否选择性显示图表类型
                    data: (chartData && chartData.datas && chartData.datas.type),
                    // selected:chartData.datas.typeSelected
                },
                grid: (chartData && chartData.grid) || {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: (chartData && chartData.xAxis) || [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: chartData && chartData.datas && chartData.datas.times
                    }
                ],
                yAxis: (chartData && chartData.yAxis) || [
                    {
                        name: 'Y轴名称',
                        type: 'value',
                        axisLine: { // 设置轴线的属性
                            lineStyle: {
                                color: '#8e8e8e',
                                width: 1// 这里是为了突出显示加上的
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
                    }
                ],
                series: chartData && chartData.datas && chartData.datas.data
            };
            // 开始渲染
            myChart.setOption(chartOptions);

            // 自动缩放
            window.addEventListener('resize', myChart.resize);
        }
    },
    watch: {
        // 更新图表
        axisEchartData: {
            handler(newVal, oldVal) {
                if (newVal) {
                    let chartObj = document.getElementById(this.domid).getElementsByClassName('myChart')[0];
                    this.echartsShow(chartObj, newVal);
                }
            },
            deep: true
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