<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                    <date-range @selectDate="selectDate" :initDate="initDate" :setRange="setRange"></date-range>
                </el-form-item>

                <el-form-item label="渠道/版本：">
                    <el-cascader
                        v-model="channel_value"
                        :options="channel_options"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>

                <el-form-item label="地区：">
                    <area-select :isMultiple="area_multiple" :has_area="isHasArea" @areaValue="selectArea" :initArea="initArea"></area-select>
                </el-form-item>

                <el-form-item>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getTableData"></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" type="success" @click="excelExport()">导出excel</el-button>
                </el-form-item>
            </el-form>

            <!-- echart -->
            <el-form :inline="false" class="demo-form-inline">
                <el-form-item>
                    <div ref="mychart" id="myChart"  style="height:300px;"></div>
                </el-form-item>
                <el-form-item>
                    <div class="tag-group text-center" style="width:90%;margin:0 auto;">
                        <el-tag  v-for="(item, idx) in echartTag" :key="(item, idx)" :effect="item.name == currentTag ? 'dark' : 'plain'" @click="changeTag(item.name)">
                            <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                                <span>{{ item.zh }}</span>
                            </el-tooltip>
                        </el-tag>
                    </div>
                </el-form-item>
            </el-form>

            <!-- table区 -->
            <div class="table-main">
                <el-table stripe border :data="tableData" v-loading="loading">
                    <!-- 通用表格样式，porp对应每一列的属性值, label对应表头名称 -->
                    <el-table-column align="center" prop="collectdate" label="日期" >
                        <el-table-column align="center" prop="collectdate" label="" width="100"></el-table-column>
                    </el-table-column>
                     <el-table-column align="center" prop="num" label="用户数">
                        <el-table-column align="center" prop="num" label="" width="80"></el-table-column>
                    </el-table-column>
                       <template v-for="(item, idx) in tagList">
                            <el-table-column v-if="idx >1" :key="(item, idx)" align="center" :prop="item.name">
                              <template slot="header" :slot-scope="scope">
                                  <span>{{item.zh}}</span>
                              </template>
                              <template v-for="(item1, idx) in subTag">
                                <el-table-column  :key="(item1, idx)" align="center" :prop="item.name+item1.name"  width="70">
                                    <template slot="header" :slot-scope="scope">
                                      <el-tooltip class="item" effect="dark" :content="item1.title" placement="top">
                                          <span>{{item1.zh}}</span>
                                      </el-tooltip>
                                  </template>
                                </el-table-column>
                              </template>
                            </el-table-column>
                        </template>

                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import { revoke, exportToExcel } from '@/api/getApi';
import { AreaSelect } from '@/components/areaselect';
import { dateRange } from '@/components/dateRange';
export default {
    name: 'overview',
    components: { dateRange, AreaSelect },
    data() {
        return {
            scope: 'scope',
            // 表格loading
            loading: true,
            // 地区插件是否支持多选
            area_multiple: false,
            // 地区插件是否支持选区
            isHasArea: true,
            initArea: [0],
            channel_value: ['-1', '-1|-1'],
            channel_options: [],
            tableData: [],
            tagList: [],
            // 导出所需表头
            tHeader: [],
            filterVal: [],
            currentTag: '1',
            // 日期插件
            initDate: new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 1),
            setRange: 15,
            startDate: '',
            endDate: '',
            // 地区插件
            provId: '-1',
            cityId: '-1',
            areaId: '-1',
            echartTag: [{ 'zh': '新增留存', 'name': '1' },
                { 'zh': '手机注册留存', 'name': '2' },
                { 'zh': '登陆留存', 'name': '3' },
                { 'zh': '玩牌留存', 'name': '4' },
                { 'zh': '付费留存', 'name': '5' }
            ],
            // echarts参数
            xAxis: [],
            series: [],
            echartOption: {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        max: 100,
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        data: [],
                    }
                ],
                legend: {
                    data: []
                },
            },
            subTag: [{ 'zh': '数量', 'name': '_num', 'format': 'percent', 'title': '数量' },
                { 'zh': '比例(%)', 'name': '', 'format': 'percent', 'title': '比例' },
            ],
        };
    },
    created() {
        this.initChannel();
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        // 获取表格信息
        getTableData() {
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
                channel: self.channel_value[0],
                version: self.splitStr(self.channel_value[1]),
                provId: self.provId,
                cityId: self.cityId,
                type: self.currentTag,
            };
            revoke('index.php?m=stat&p=userRemain', data).then(res => {
                if (res.code === 0) {
                    self.tagList = res.data.tableHead;

                    let data = res.data.data;
                    self.tableData = data;
                    self.loading = false;
                    // 初始化echart
                    self.initEchart();
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
        // 初始化echart
        initEchart() {
            let myChart = echarts.init(document.getElementById('myChart'));
            let xAxis = [];
            // 处理echart选项
            for (let xAxisItem in this.tableData) {
                xAxis.push(this.tableData[xAxisItem]['collectdate']);
            }
            this.xAxis = xAxis.reverse();
            let legendData = [];
            let seriesData = [];
            for (let tagIndex in this.tagList) {
                if (tagIndex < 2) {
                    continue;
                }
                let seriesItem = {};
                let legendName = (this.tagList[tagIndex].zh + '率');
                legendData.push(legendName);
                seriesItem.name = legendName;
                seriesItem.type = 'line';
                seriesItem.smooth = true;
                let seriesItemData = [];

                for (let xAxisIndex in xAxis) {
                    let dataIndex = xAxis.length - xAxisIndex - 1;
                    seriesItemData.push(this.tableData[dataIndex][this.tagList[tagIndex].name]);
                }
                seriesItem.data = seriesItemData;
                seriesData.push(seriesItem);
            }
            this.echartOption.xAxis[0].data = this.xAxis;

            this.echartOption.legend.data = legendData;
            this.echartOption.series = seriesData;
            myChart.setOption(this.echartOption);
        },
        // 切换tags
        changeTag(tag) {
            this.currentTag = tag;
            this.getTableData();
            this.initEchart();
        },
        // excel数据导出
        excelExport() {
            this.tHeader = [];
            this.filterVal = [];
            for (let i in this.tagList) {
                if (this.tagList[i]['name'].indexOf('remain') !== 0) {

                    this.tHeader.push(this.tagList[i]['zh']);
                    this.filterVal.push(this.tagList[i]['name']);
                } else {
                    this.tHeader.push(this.tagList[i]['zh'] + '率(%)');
                    this.tHeader.push(this.tagList[i]['zh'] + '数量');
                    this.filterVal.push(this.tagList[i]['name']);
                    this.filterVal.push(this.tagList[i]['name'] + '_num');

                }
            }
            exportToExcel(this.tHeader, this.filterVal, this.tableData);
        },
        // 日期选项
        selectDate(value) {
            this.startDate = value[0];
            this.endDate = value[1];
        },
        // init渠道/版本选项
        initChannel() {
            let data = {};
            revoke('index.php?m=stat&p=getChannelVersion', data).then(res => {
                if (res.code === 0) {
                    this.channel_options = res.data;
                }
            });
        },
        // 渠道/版本选项
        handleChange(value) {
            this.channel_value = value;
        },
        // 绑定选择后的地区选项值
        selectArea(array) {
            let str = array[0].toString();
            if (str.length <= 2) {
                if (str === '0') {
                    this.provId = '-1';
                    this.cityId = '-1';
                    this.areaId = '-1';
                    return;
                }
                this.provId = str;
                this.cityId = '-1';
                this.areaId = '-1';
            } else if (str.length <= 4) {
                this.provId = str.charAt(0) + str.charAt(1);
                this.cityId = str;
                this.areaId = '-1';
            } else {
                this.provId = str.charAt(0) + str.charAt(1);
                this.cityId = str.charAt(2) + str.charAt(3);
                this.areaId = str;
            }
        },
        // 数据格式修改
        splitStr(str) {
            let newStr = str.split('|');
            return newStr[1];
        }
    }
};
</script>
