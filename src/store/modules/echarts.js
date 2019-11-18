// import router from '@/router';
const echarts = {
    state: {
        lineEchartData: {},
        pieEchartData: {},
        axisEchartData: {}
    },
    mutations: {
        // 线图数据设置
        SET_Line_ECHARTS: (state, data) => {
            state.lineEchartData[data.id] = data.options; // 图表外层id
        },
        // 饼图数据设置
        SET_Pie_ECHARTS: (state, data) => {
            state.pieEchartData[data.id] = data.options; // 图表外层id
            // state.pieEchartData = data;
        },
        // 区域图数据设置
        SET_Axis_ECHARTS: (state, data) => {
            state.axisEchartData[data.id] = data.options; // 图表外层id
            // state.axisEchartData = data;
        }
    },
    actions: {}
};

export default echarts;
