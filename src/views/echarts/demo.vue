<!-- 图表类 -->
<template>
  <div>
    <!-- 线图 -->
    <line-echart v-if="showLine" domid="line-demo"></line-echart>
    <line-echart v-if="showLine" domid="line-demo2"></line-echart>
    <button @click="setLineEcharts(1)" >查看本月数据</button>
    <button @click="setLineEcharts(2)" >查看2018年数据</button>


      <!-- 饼图 -->
      <pie-echart v-if="showPie" domid="pie-demo"></pie-echart>
      <pie-echart v-if="showPie" domid="pie-demo2"></pie-echart>

      <!-- 区域图 -->
      <axis-echart v-if="showAxis" domid="axis-demo1"></axis-echart>
      <axis-echart v-if="showAxis" domid="axis-demo2"></axis-echart>
  </div>
</template>

<script>
import lineEchart from '@/components/echarts/lines';
import pieEchart from '@/components/echarts/pies';
import axisEchart from '@/components/echarts/axis';
export default {
    data() {
        return {
            showLine: false,
            showPie: false,
            showAxis: false
        };
    },
    components: {
        lineEchart,
        pieEchart,
        axisEchart
    },
    mounted() {
        // 首次加载线图
        this.setLineEcharts();
        this.setLineEcharts2();
        // 首次加载饼图
        this.setPieEcharts();
        this.setPie2Echarts();
        // 首次加载区域图
        this.setAxisEcharts();
        this.setAxis2Echarts();
    },
    methods: {
        // 显示线图
        setLineEcharts(type) {
            // 根据type，请求后台接口，获取数据data

            // 将data按需填充到dataObj中
            let dataObj = {
                echartName: '日新增',
                echartXName: '新增用户数',
                datas: {
                    time: ['04/21', '04/26', '05/01', '05/06', '05/11', '05/16', '05/21', '05/26'],
                    data: [912, 879, 767, 601, 401, 705, 810, 812, 802]
                }
            };
            this.$store.commit('SET_Line_ECHARTS', {
                id: 'line-demo',
                options: dataObj
            });
            this.showLine = true;
        },
        // 显示线图2
        setLineEcharts2(type) {
            // 根据type，请求后台接口，获取数据data

            // 将data按需填充到dataObj中
            let dataObj = {
                echartName: '日新增2',
                echartXName: '新增用户数2',
                datas: {
                    time: ['04/21', '04/26', '05/06', '05/11', '05/16', '05/21', '05/26'],
                    data: [912, 879, 767, 401, 705, 810, 812, 802]
                }
            };
            this.$store.commit('SET_Line_ECHARTS', {
                id: 'line-demo2',
                options: dataObj
            });
            this.showLine = true;
        },

        // 显示饼图
        setPieEcharts() {
            let dataObj = {
                echartName: '饼图DEMO',
                echartXName: '访问来源',
                datas: [      // 待传入数据
                    {
                        value: 235, name: '平胡', itemStyle: {
                            color: '#9FDABF'
                        }
                    },
                    {
                        value: 274, name: '清一色', itemStyle: {
                            color: '#E98F6F'
                        }
                    },
                    {
                        value: 310, name: '七对', itemStyle: {
                            color: '#749F83'
                        }
                    }
                ]
            };
            this.$store.commit('SET_Pie_ECHARTS', {
                id: 'pie-demo',
                options: dataObj
            });
            this.showPie = true;
        },
        // 显示饼图
        setPie2Echarts() {
            let dataObj = {
                echartName: '饼图DEMO2',
                echartXName: '访问来源2',
                datas: [      // 待传入数据
                    {
                        value: 235, name: '平胡2', itemStyle: {
                            color: '#9FDABF'
                        }
                    },
                    {
                        value: 274, name: '清一色2', itemStyle: {
                            color: '#E98F6F'
                        }
                    },
                    {
                        value: 310, name: '七对2', itemStyle: {
                            color: '#749F83'
                        }
                    }
                ]
            };
            this.$store.commit('SET_Pie_ECHARTS', {
                id: 'pie-demo2',
                options: dataObj
            });
            this.showPie = true;
        },

        // 显示区域图
        setAxisEcharts() {
            let dataObj = {
                echartName: '堆叠区域图',
                datas: {
                    type: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎2', '直接访问2', '搜索引擎3'],
                    typeSelected: { '邮件营销': true, '联盟广告': true, '视频广告': true, '直接访问': true, '搜索引擎2': true, '直接访问2': true, '搜索引擎3': true },   // 是否显示当前type
                    times: ['08/05', '08/06', '08/07', '08/08', '08/09', '08/10', '08/11'],
                    data: [{
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [120, 132, 101, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [220, 182, 191, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [150, 232, 201, 190, 330, 410]
                    }, {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [120, 132, 101, 90, 230, 210]
                    },
                    {
                        name: '搜索引擎2',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [220, 182, 191, 290, 330, 310]
                    },
                    {
                        name: '直接访问2',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [150, 232, 201, 190, 330, 410]
                    },
                    {
                        name: '搜索引擎3',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [150, 232, 201, 190, 330, 410]
                    }
                    ]
                }
            };
            this.$store.commit('SET_Axis_ECHARTS', {
                id: 'axis-demo1',
                options: dataObj
            });
            this.showAxis = true;
        },
        // 显示区域图
        setAxis2Echarts() {
            let dataObj = {
                echartName: '堆叠区域图2',
                datas: {
                    type: ['邮件营销', '联盟广告2', '视频广告', '直接访问', '搜索引擎9', '直接访问9', '搜索引擎3'],
                    typeSelected: { '邮件营销': true, '联盟广告': true, '视频广告': true, '直接访问': true, '搜索引擎2': true, '直接访问2': true, '搜索引擎3': true },   // 是否显示当前type
                    times: ['08/05', '08/06', '08/07', '08/08', '08/09', '08/10', '08/11'],
                    data: [{
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [150, 232, 201, 154, 190, 330, 410]
                    }, {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '搜索引擎2',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '直接访问2',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '搜索引擎3',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [150, 232, 201, 154, 190, 330, 410]
                    }
                    ]
                }
            };
            this.$store.commit('SET_Axis_ECHARTS', {
                id: 'axis-demo2',
                options: dataObj
            });
            this.showAxis = true;
        }
    },
};
</script>

<style>

</style>