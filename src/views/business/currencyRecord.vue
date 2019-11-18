<template>
    <div class="app-containei">
        <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="时间：">
                    <date-range @selectDate="selectDate" :initDate="initDate" :setRange="setRange"></date-range>
                </el-form-item>

                <el-form-item label="选择货币：">
                    <el-select v-model="currType" placeholder="请选择">
                        <el-option
                            v-for="(item, index) in currTypeMap"
                            :key="index"
                            :label="item"
                            :value="index"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label>
                    <el-select v-model="filterType" placeholder="请选择">
                        <el-option
                            v-for="item in filterTypes"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label>
                    <el-input v-model="filterUid" class="form-input"></el-input>
                </el-form-item>

                <el-form-item label="选择场景：">
                    <el-select v-model="sceneType" placeholder="请选择">
                        <el-option
                            v-for="item in sceneMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="showGameLvel" label="选择玩法：">
                    <el-select v-model="gameId" placeholder="请选择">
                        <el-option
                            v-for="(item, index) in gameLevelMap"
                            :key="index"
                            :label="item.name"
                            :value="index"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="showGameLvel" label="选择场次：">
                    <el-select v-model="levelId" placeholder="请选择">
                        <el-option
                            v-for="(item, index) in levelMap"
                            :key="index"
                            :label="item"
                            :value="index"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button
                        class="filter-item"
                        type="primary"
                        icon="el-icon-search"
                        @click="find"
                    ></el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData">
                <el-table-column align="center" label="货币名称" prop="currName"></el-table-column>
                <el-table-column align="center" label="行为" prop="actionName"></el-table-column>
                <el-table-column align="center" label="游戏" prop="gameName"></el-table-column>
                <el-table-column align="center" label="场次" prop="levelName"></el-table-column>
                <el-table-column align="center" label="操作前" prop="beforeBalance"></el-table-column>
                <el-table-column align="center" label="操作后" prop="afterBalance"></el-table-column>
                <el-table-column align="center" label="变化数量" prop="amount"></el-table-column>
                <el-table-column align="center" label="创建时间" prop="tradeTime"></el-table-column>
                <el-table-column align="center" label="状态" prop="statusName"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi'
import { dateRange } from '@/components/dateRange'
export default {
    name: 'actor',
    components: { dateRange },
    data() {
        return {
            // 日期插件
            initDate: new Date(),
            setRange: 2,
            startDate: '',
            endDate: '',
            tableData: [],
            gameLevelMap: { 0: { name: '全部', level: [] } },
            levelMap: { 0: '全部' },
            filterTypes: [
                { type: 1, name: '显示id' },
                { type: 2, name: 'playid' },
                { type: 3, name: '手机号' },
                { type: 4, name: 'guid' }
            ],
            // 货币类型:
            currType: '0',
            currTypeMap: { 0: '全部', 1: '金币', 2: '元宝（钻石）', 3: '房卡' },
            // 场景类型:
            sceneType: '',
            sceneMap: [
                { label: '全部', value: '' },
                { label: '大厅', value: '0' },
                { label: '游戏中', value: '1' }
            ],
            showGameLvel: false,
            gameId: '0',
            levelId: '0',
            statusMap: { 0: '失败', 1: '成功' },
            // 玩家
            filterUid: '',
            filterType: 1,
            // 分页
            totalPage: 0,
            pageSize: 25,
            currentPage: 1
        }
    },
    watch: {
        sceneType: function(newLevelNum, oldLevelNum) {
            this.showGameLvel = newLevelNum == 1 ? true : false
        },
        gameId: function(newGame, oldLevelNum) {
            if (newGame) {
                this.levelMap = Object.assign(
                    {},
                    this.levelMap,
                    this.gameLevelMap[newGame]['level']
                )
            }
        }
    },
    mounted() {
        this.getGameLevelMap()
    },
    methods: {
        getGameLevelMap() {
            let data = {
                callm: 'config',
                callp: 'getGameLevelMap',
                args: JSON.stringify({ showAll: 1 })
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.gameLevelMap = Object.assign(
                        {},
                        this.gameLevelMap,
                        res.data
                    )
                }
            })
        },
        getTableList(args) {
            if (this.filterUid == '') {
                this.$message('请输入玩家信息', '信息', {})
                return
            }
            args['startDate'] = this.startDate
            args['endDate'] = this.endDate
            args['type'] = this.filterType
            args['value'] = this.filterUid
            args['currType'] = this.currType
            args['sceneType'] = this.sceneType
            args['gameId'] = this.gameId
            args['levelId'] = this.levelId

            let data = {
                callm: 'currencyRecord',
                callp: 'getList',
                args: JSON.stringify(args)
            }

            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    let retData = res.data.list
                    let currFunc = res.data.currFunc
                    // 表格数据格式format
                    for (let i in retData) {
                        let gameID = retData[i]['gameId']
                        let levelID = retData[i]['level']
                        retData[i]['currName'] = this.currTypeMap[
                            retData[i]['currencyType']
                        ]
                        retData[i]['actionName'] =
                            currFunc[retData[i]['funcId']]
                        retData[i]['statusName'] = this.statusMap[
                            retData[i]['status']
                        ]
                        retData[i]['gameName'] =
                            gameID == 0 ? '' : this.gameLevelMap[gameID]['name']
                        retData[i]['levelName'] =
                            gameID == 0
                                ? ''
                                : this.gameLevelMap[gameID]['level'][
                                      retData[i]['level']
                                  ]
                    }
                    this.tableData = retData
                } else {
                    this.$message(res.msg, '信息', {})
                    return
                }
            })
        },
        // 日期选项
        selectDate(value) {
            this.startDate = value[0]
            this.endDate = value[1]
        },
        // 查找
        find() {
            this.currentPage = 1
            let data = {
                page: this.currentPage,
                pageNum: this.pageSize
            }
            this.getTableList(data)
        }
    }
}
</script>

<style lang="scss" scoped>
.text-right {
    float: right;
}
.pagination {
    margin: 20px 0;
}
.nav-select {
    width: 100px;
    margin: 0 5px 10px 0;
}
.nav-input {
    width: 150px;
    margin: 0 5px 10px 0;
}
.dialog-form {
    margin: 20px;
}
.form-input {
    width: 200px !important;
}
</style>
<style lang="scss">
.el-dialog__header {
    padding: 20px 20px 10px;
    background-color: #f0f2f5;
}
.el-dialog__footer {
    padding: 10px 20px 20px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #f0f2f5;
}

/*保留换行*/
.el-table .cell {
    white-space: pre-line;
}
.a-hover:hover {
    cursor: pointer;
    text-decoration: solid;
    color: #409eff;
}
</style>
