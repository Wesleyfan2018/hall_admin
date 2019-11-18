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
                        @change="handleChange"
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="地区：">
                    <area-select
                        :isMultiple="area_multiple"
                        :has_area="isHasArea"
                        @areaValue="selectArea"
                        :initArea="initArea"
                    ></area-select>
                </el-form-item>

                <el-form-item>
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="el-icon-search"
                        @click="getTableData"
                    ></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" type="success" @click="excelExport()">导出excel</el-button>
                </el-form-item>
            </el-form>

            <!-- echart -->
            <div class="table-main" style="display:">
                <pie-echart
                    v-if="show_1"
                    domid="hallRecharge"
                    :echartOption="echartOption1"
                    :searchTime="timestamp"
                ></pie-echart>
                <pie-echart
                    v-if="show_2"
                    domid="quickRecharge"
                    :echartOption="echartOption2"
                    :searchTime="timestamp"
                    style="margin-top:30px;"
                ></pie-echart>
                <pie-echart
                    v-if="show_3"
                    domid="rechargeScale"
                    :echartOption="echartOption3"
                    :searchTime="timestamp"
                    style="margin-top:30px;"
                ></pie-echart>
            </div>

            <!-- table区 -->
            <div class="table-main">
                <el-table stripe border :data="tableData" v-loading="loading">
                    <!-- 通用表格样式，porp对应每一列的属性值, label对应表头名称 -->
                    <el-table-column align="center">
                        <el-table-column align="center" prop="collectdate" label="日期"></el-table-column>
                    </el-table-column>
                    <el-table-column align="center">
                        <el-table-column align="center" prop="collectdate" label="统计数据"></el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="大厅充值">
                        <template v-for="(item, idx) in tagList">
                            <el-table-column
                                v-if="idx <= 7 && idx > 1"
                                :key="(item, idx)"
                                align="center"
                                :prop="item.name"
                            >
                                <template slot="header" :slot-scope="scope">
                                    <span>{{item.zh}}元</span>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="牌局充值">
                        <template v-for="(item, idx) in tagList">
                            <el-table-column
                                v-if="idx <= 13 && idx > 7"
                                :key="(item, idx)"
                                align="center"
                                :prop="item.name"
                            >
                                <template slot="header" :slot-scope="scope">
                                    <span>{{item.zh}}元</span>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import { revoke, exportToExcel } from '@/api/getApi'
import { AreaSelect } from '@/components/areaselect'
import { dateRange } from '@/components/dateRange'
import pieEchart from '@/components/echarts/pies'
export default {
    name: 'payScene',
    components: { dateRange, AreaSelect, pieEchart },
    data() {
        return {
            show_1: true,
            show_2: true,
            show_3: true,
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
            tagList: [
                { zh: '日期', name: 'collectdate', format: '' },
                { zh: '日新增', name: 'register_num', format: '' },
                { zh: '5', name: 'register_phone_num', format: '' },
                { zh: '6', name: 'login_num', format: '' },
                { zh: '10', name: 'dau', format: '' },
                { zh: '30', name: 'acm_recharge_num', format: '' },
                { zh: '98', name: 'recharge_amount', format: 'float' },
                { zh: '198', name: 'recharge_num', format: '' },
                { zh: '5', name: 'pay_seep_rate', format: 'percent' },
                { zh: '6', name: 'arppu', format: 'float' },
                { zh: '10', name: 'rarpu', format: 'float' },
                { zh: '30', name: 'return30', format: '' },
                { zh: '98', name: 'reg_remain2', format: 'percent' },
                { zh: '198', name: 'reg_remain7', format: 'percent' }
            ],
            // 导出所需表头
            tHeader: [],
            filterVal: [],
            // 日期插件
            initDate: new Date().setTime(
                new Date().getTime() - 3600 * 1000 * 24 * 1
            ),
            setRange: 7,
            startDate: '',
            endDate: '',
            // 地区插件
            provId: '-1',
            cityId: '-1',
            areaId: '-1',
            // echarts参数
            xAxis: [],
            series: [],
            echartOption1: {},
            echartOption2: {},
            echartOption3: {},
            timestamp: ''
        }
    },
    created() {
        this.initChannel()
    },
    mounted() {
        this.getTableData()
        // 首次加载饼图
        this.setPieEcharts()
        this.setPie2Echarts()
    },
    methods: {
        // 获取表格信息
        getTableData() {
            let self = this
            let data = {
                startDate: self.startDate,
                endDate: self.endDate,
                channel: self.channel_value[0],
                version: self.splitStr(self.channel_value[1]),
                provId: self.provId,
                cityId: self.cityId,
                areaId: self.areaId
            }
            revoke('index.php?m=stat&p=payscene', data).then(res => {
                if (res.code === 0) {
                    // self.tagList = res.data.tableHead;
                    let data = res.data
                    // 表格数据格式format
                    for (let i in data) {
                    }
                    self.tableData = data
                    self.loading = false
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res,
                        duration: 3000
                    })
                }
            })
        },
        // 显示饼图
        setPieEcharts() {
            let dataObj = {
                echartName: '饼图DEMO',
                echartXName: '访问来源',
                datas: [
                    // 待传入数据
                    {
                        value: 235,
                        name: '平胡',
                        itemStyle: {
                            color: '#9FDABF'
                        }
                    },
                    {
                        value: 274,
                        name: '清一色',
                        itemStyle: {
                            color: '#E98F6F'
                        }
                    },
                    {
                        value: 310,
                        name: '七对',
                        itemStyle: {
                            color: '#749F83'
                        }
                    }
                ]
            }
            this.$store.commit('SET_Pie_ECHARTS', {
                id: 'hallRecharge',
                options: dataObj
            })
            this.showPie = true
        },
        // 显示饼图
        setPie2Echarts() {
            let dataObj = {
                echartName: '饼图DEMO2',
                echartXName: '访问来源2',
                datas: [
                    // 待传入数据
                    {
                        value: 235,
                        name: '平胡2',
                        itemStyle: {
                            color: '#9FDABF'
                        }
                    },
                    {
                        value: 274,
                        name: '清一色2',
                        itemStyle: {
                            color: '#E98F6F'
                        }
                    },
                    {
                        value: 310,
                        name: '七对2',
                        itemStyle: {
                            color: '#749F83'
                        }
                    }
                ]
            }
            this.$store.commit('SET_Pie_ECHARTS', {
                id: 'pie-demo2',
                options: dataObj
            })
            this.showPie = true
        },
        // excel数据导出
        excelExport() {
            let self = this
            for (let i in self.tableHead) {
                self.tHeader.push(self.tableHead[i]['zh'])
                self.filterVal.push(self.tableHead[i]['name'])
            }
            exportToExcel(self.tHeader, self.filterVal, self.tableData)
        },
        // 日期选项
        selectDate(value) {
            this.startDate = value[0]
            this.endDate = value[1]
        },
        // init渠道/版本选项
        initChannel() {
            let data = {}
            revoke('index.php?m=stat&p=getChannelVersion', data).then(res => {
                if (res.code === 0) {
                    this.channel_options = res.data
                }
            })
        },
        // 渠道/版本选项
        handleChange(value) {
            this.channel_value = value
        },
        // 绑定选择后的地区选项值
        selectArea(array) {
            let str = array[0].toString()
            if (str.length <= 2) {
                if (str === '0') {
                    this.provId = '-1'
                    this.cityId = '-1'
                    this.areaId = '-1'
                    return
                }
                this.provId = str
                this.cityId = '-1'
                this.areaId = '-1'
            } else if (str.length <= 4) {
                this.provId = str.charAt(0) + str.charAt(1)
                this.cityId = str
                this.areaId = '-1'
            } else {
                this.provId = str.charAt(0) + str.charAt(1)
                this.cityId = str.charAt(2) + str.charAt(3)
                this.areaId = str
            }
        },
        // 数据格式修改
        splitStr(str) {
            let newStr = str.split('|')
            return newStr[1]
        }
    }
}
</script>
