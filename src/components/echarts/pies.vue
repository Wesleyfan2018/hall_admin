<!-- 饼图 -->
<template>
    <div class="echarts2-wrap" :id="domid">
        <div class="myChart"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
export default {
    props: ['domid'],
    computed: {
        ...mapState({
            pieEchartData: state => state.echarts.pieEchartData // 获取饼图数据
        })
    },
    mounted() {
        this.echartsShow()
    },
    methods: {
        // 图表插件
        echartsShow() {
            let that = this
            let chartData = this.pieEchartData[this.domid]
            // 找到容器
            let chartObj = document
                .getElementById(this.domid)
                .getElementsByClassName('myChart')[0]
            let myChart = echarts.init(chartObj)
            let chartOptions = {
                backgroundColor: '#fff',
                title: {
                    text:
                        chartData && chartData.echartName
                            ? chartData.echartName
                            : '饼图',
                    // subtext: '纯属虚构',
                    x: 'center'
                },
                visualMap:
                    chartData && chartData.visualMap
                        ? chartData.visualMap
                        : {
                              show: false,
                              min: 80,
                              max: 600,
                              inRange: {
                                  colorLightness: [0, 1]
                              }
                          },
                tooltip: (chartData && chartData.tooltip) || {
                    // 浮窗提示
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: (chartData && chartData.series) || [
                    {
                        name: chartData && chartData.echartXName,
                        type: 'pie',
                        radius: '55%',
                        data: chartData && chartData.datas,
                        roseType: 'angle',
                        label: {
                            normal: {
                                textStyle: {
                                    // 文字颜色
                                    color: 'rgba(0, 0, 0, 0.6)'
                                }
                            }
                        },
                        labelLine: {
                            // 引导线的颜色
                            normal: {
                                lineStyle: {
                                    color: 'rgba(0, 0, 0, 0.3)'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#c23531'
                                // shadowBlur: 200,
                                // shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }

            console.log('参数显示', chartOptions)
            // 开始渲染
            myChart.setOption(chartOptions)
            // 自动缩放
            window.addEventListener('resize', myChart.resize)
        }
    },
    watch: {
        // 更新图表
        pieEchartData: {
            handler(newVal, oldVal) {
                if (newVal) {
                    let chartObj = document
                        .getElementById(this.domid)
                        .getElementsByClassName('myChart')[0]
                    this.echartsShow(chartObj, newVal)
                }
            },
            deep: true
        }
    }
}
</script>

<style lang="scss">
.myChart {
    width: 100%;
    height: 400px;
}
</style>