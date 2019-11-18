<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                    <date-range @selectDate="selectDate" :initDate="initDate" :setRange="setRange"></date-range>
                </el-form-item>

                <el-form-item label="玩法：">
                    <el-select v-model="filterGame" placeholder="请选择">
                        <el-option
                            v-for="(item, index) in gameMap"
                            :key="index"
                            :value="index"
                            :label="item"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="场次：">
                    <el-select v-model="filterGame" placeholder="请选择">
                        <el-option
                            v-for="(item, index) in gameMap"
                            :key="index"
                            :value="index"
                            :label="item"
                        ></el-option>
                    </el-select>
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

            <!-- table区 -->
            <div class="table-main">
                <el-table stripe border :data="tableData" v-loading="loading">
                    <!-- 通用表格样式，porp对应每一列的属性值, label对应表头名称 -->
                    <el-table-column align="center">
                        <el-table-column align="center" prop="collectdate" label="日期"></el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="新增">
                        <template v-for="(item, idx) in tagList">
                            <el-table-column
                                v-if="idx <= 2 && idx > 0"
                                :key="(item, idx)"
                                align="center"
                                :prop="item.name"
                            >
                                <template slot="header" :slot-scope="scope">
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        :content="item.title"
                                        placement="top"
                                    >
                                        <span>{{item.zh}}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="活跃人数">
                        <template v-for="(item, idx) in tagList">
                            <el-table-column
                                v-if="idx <= 5 && idx > 2"
                                :key="(item, idx)"
                                align="center"
                                :prop="item.name"
                            >
                                <template slot="header" :slot-scope="scope">
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        :content="item.title"
                                        placement="top"
                                    >
                                        <span>{{item.zh}}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="日收入">
                        <template v-for="(item, idx) in tagList">
                            <el-table-column
                                v-if="idx <= 10 && idx > 5"
                                :key="(item, idx)"
                                align="center"
                                :prop="item.name"
                            >
                                <template slot="header" :slot-scope="scope">
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        :content="item.title"
                                        placement="top"
                                    >
                                        <span>{{item.zh}}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="留存">
                        <template v-for="(item, idx) in tagList">
                            <el-table-column
                                v-if="idx <= 15 && idx > 10"
                                :key="(item, idx)"
                                align="center"
                                :prop="item.name"
                            >
                                <template slot="header" :slot-scope="scope">
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        :content="item.title"
                                        placement="top"
                                    >
                                        <span>{{item.zh}}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="活跃度">
                        <template v-for="(item, idx) in tagList">
                            <el-table-column
                                v-if="idx <= 20 && idx > 15"
                                :key="(item, idx)"
                                align="center"
                                :prop="item.name"
                            >
                                <template slot="header" :slot-scope="scope">
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        :content="item.title"
                                        placement="top"
                                    >
                                        <span>{{item.zh}}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="新增用户数据">
                        <template v-for="(item, idx) in tagList">
                            <el-table-column
                                v-if="idx <= 27 && idx > 20"
                                :key="(item, idx)"
                                align="center"
                                :prop="item.name"
                            >
                                <template slot="header" :slot-scope="scope">
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        :content="item.title"
                                        placement="top"
                                    >
                                        <span>{{item.zh}}</span>
                                    </el-tooltip>
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
import { dateRange } from '@/components/dateRange'
export default {
    name: 'playTrack',
    components: { dateRange },
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
            tagList: [
                { zh: '日期', name: 'collectdate', format: '', title: '' },
                {
                    zh: '日新增',
                    name: 'register_num',
                    format: '',
                    title: '统计当日，首次注册登录的新用户（ID 去重）'
                },
                {
                    zh: '手机账号',
                    name: 'register_phone_num',
                    format: '',
                    title:
                        '统计当日，首次注册登录的新用户（ID 去重）当中用手机号注册的用户数'
                },
                {
                    zh: '日登陆',
                    name: 'login_num',
                    format: '',
                    title: '统计当日，有发生登录行为一次以上的用户数，ID 去重'
                },
                {
                    zh: 'DAU',
                    name: 'dau',
                    format: '',
                    title:
                        '统计当日，除去当天新增用户后的有发生登录行为一次以上的用户数，ID 去重'
                },
                {
                    zh: '累积付费用户数',
                    name: 'acm_recharge_num',
                    format: '',
                    title: '统计当日，登录的用户当中有过付费行为的用户数'
                },
                {
                    zh: '日收入',
                    name: 'recharge_amount',
                    format: 'float',
                    title: '统计当日，所有玩家充值的总金额'
                },
                {
                    zh: '付费人数',
                    name: 'recharge_num',
                    format: '',
                    title: '统计当日，有成功付费的总人数'
                },
                {
                    zh: '付费渗透率',
                    name: 'pay_seep_rate',
                    format: 'percent',
                    title: '统计当日，付费人数/当天登录的用户数'
                },
                {
                    zh: 'arppu',
                    name: 'arppu',
                    format: 'float',
                    title: '统计当日，付费总额/付费用户数'
                },
                {
                    zh: 'arpu',
                    name: 'rarpu',
                    format: 'float',
                    title: '统计当日，付费总额/登录用户数'
                },
                {
                    zh: '30天回流人数',
                    name: 'return30',
                    format: '',
                    title: '统计当日，流失 30 天后又回来的用户'
                },
                {
                    zh: '新增次日留',
                    name: 'reg_remain2',
                    format: 'percent',
                    title:
                        '统计当日的新增用户中，在统计日的第 2 日时有过登录日志的用户占比'
                },
                {
                    zh: '新增7日留',
                    name: 'reg_remain7',
                    format: 'percent',
                    title:
                        '统计当日的新增用户中，在统计日的第 7 日时有过登录日志的用户占比'
                },
                {
                    zh: '登录次日留',
                    name: 'login_remain2',
                    format: 'percent',
                    title:
                        '统计当日的登录用户中，在统计日的第 2 日时有过登录日志的用户占比'
                },
                {
                    zh: '登陆7日留',
                    name: 'login_remain7',
                    format: 'percent',
                    title:
                        '统计当日的登录用户中，在统计日的第 7 日时有过登录日志的用户占比'
                },
                {
                    zh: '最高在线人数',
                    name: 'max_online_num',
                    format: '',
                    title: '统计当日，24 小时内同时在线最高达到的人数'
                },
                {
                    zh: '平均在线人数',
                    name: 'avg_online_num',
                    format: 'int',
                    title: '统计当日，24 小时每小时同时在线相加总和/24 小时'
                },
                {
                    zh: '玩牌人数',
                    name: 'play_num',
                    format: 'int',
                    title: '统计当日，有过玩牌行为的人数(ID去重)'
                },
                {
                    zh: '未玩牌人数',
                    name: 'not_play_num',
                    format: 'int',
                    title: '统计当日，登录了游戏但没有过玩牌行为的人数'
                },
                {
                    zh: '平均游戏时长(min)',
                    name: 'avg_game_min',
                    format: 'float',
                    title: '统计当日，玩牌用户的玩牌时间/玩牌人数'
                },
                {
                    zh: '新增日收入',
                    name: 'register_income',
                    format: 'float',
                    title: '统计当日，新增用户充值的总金额'
                },
                {
                    zh: '新增付费人数',
                    name: 'register_recharge_num',
                    format: '',
                    title: '统计当日，新增用户有成功付费的总人数'
                },
                {
                    zh: '新增付费渗透率',
                    name: 'reg_pay_seep_rate',
                    format: 'percent',
                    title: '统计当日，新增用户当中付费人数/当天新增用户数'
                },
                {
                    zh: '新增arppu',
                    name: 'reg_arppu',
                    format: 'float',
                    title: '统计当日，新增用户的付费总额/新增用户当中付费人数'
                },
                {
                    zh: '新增arpu',
                    name: 'reg_arpu',
                    format: 'float',
                    title: '统计当日，新增用户的付费总额/当天新增用户数'
                },
                {
                    zh: '新增玩牌人数',
                    name: 'register_play_num',
                    format: '',
                    title: '统计当日，新增用户当中有过玩牌行为的人数'
                },
                {
                    zh: '新增平均游戏时长(min)',
                    name: 'reg_avg_game_min',
                    format: 'float',
                    title:
                        '统计当日，新增用户当中有过玩牌行为的用户的玩牌时间/新增用户当中有过玩牌行为的玩牌人数'
                }
            ],
            // 导出所需表头
            tHeader: [],
            filterVal: [],
            currentTag: 1,
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
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        data: []
                    }
                ]
            },
            fuck: []
        }
    },
    created() {
        this.initChannel()
    },
    mounted() {
        this.getTableData()
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
            console.log(data)
            revoke('index.php?m=stat&p=getOverview', data).then(res => {
                if (res.code === 0) {
                    self.tagList = res.data.tableHead
                    let data = res.data.list
                    // 表格数据格式format
                    for (let i in data) {
                        for (let t in data[i]) {
                            // null 和 NaN数据处理
                            if (!data[i][t] || data[i][t] === 'NaN') {
                                data[i][t] = '0'
                            }
                            let index = self.tagList.findIndex(
                                idx => idx.name === t
                            )
                            // 数据格式百分比处理
                            if (self.tagList[index].format === 'percent') {
                                data[i][t] = Number(data[i][t]) * 100
                                data[i][t] =
                                    Math.floor(data[i][t] * 100) / 100 + '%'
                            }
                            // 浮点小数保留2位置（不四舍五入）
                            if (self.tagList[index].format === 'float') {
                                data[i][t] = Math.floor(data[i][t] * 100) / 100
                            }
                            if (self.tagList[index].format === 'int') {
                                // 千分位数据格式
                                const toDecimalMark = num =>
                                    num.toLocaleString('en-US')
                                data[i][t] = toDecimalMark(Number(data[i][t]))
                            }
                        }
                    }
                    self.tableData = data
                    self.loading = false
                    // 初始化echart
                    self.initEchart(self.currentTag)
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res,
                        duration: 3000
                    })
                }
            })
        },
        // 初始化echart
        initEchart(Num) {
            let self = this
            let myChart = echarts.init(document.getElementById('myChart'))
            let xAxis = []
            // 处理echart选项
            for (let xAxisItem in self.tableData) {
                xAxis.push(self.tableData[xAxisItem]['collectdate'])
            }
            self.xAxis = xAxis.reverse()
            let echartItem = self.tagList[self.currentTag]['name']
            let echartName = self.tagList[self.currentTag]['zh']
            let series = []
            for (let seriesItem in self.tableData) {
                let item = self.tableData[seriesItem][echartItem]
                let idx = self.tagList.findIndex(tt => tt.name === echartItem)
                if (self.tagList[idx].format === 'percent') {
                    item = item.replace('%', '')
                }
                item = Number(item)
                series.push(item)
            }
            self.series = series.reverse()
            self.echartOption.series[0].name = echartName
            let idx = self.tagList.findIndex(tt => tt.name === echartItem)
            if (self.tagList[idx].format === 'percent') {
                self.echartOption.yAxis[0].axisLabel.formatter = '{value}%'
            } else {
                self.echartOption.yAxis[0].axisLabel.formatter = '{value}'
            }
            self.echartOption.xAxis[0].data = self.xAxis
            self.echartOption.series[0].data = self.series
            myChart.setOption(self.echartOption)
        },
        // 切换tags
        changeTag(Num) {
            this.currentTag = Num
            this.initEchart(Num)
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
