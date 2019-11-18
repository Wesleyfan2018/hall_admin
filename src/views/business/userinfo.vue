<template>
    <div class="app-containei userinfo-wrap">
        <el-form :inline="true" class="demo-form-inline">
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
            <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="find"></el-button>
            </el-form-item>
            <el-form-item label="历史查询:">
                <el-select v-model="selectLogKey" placeholder="请选择" @change="selectedLog($event)">
                    <el-option
                        v-for="item in logData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <div class="userinfo-global userinfo-base">
            <el-row>
                <el-col :span="24">
                    <h3>基本信息</h3>
                </el-col>
            </el-row>
            <el-row justify="center">
                <el-col :span="8" class="col-header">
                    <div class="user-header">
                        <img v-if="head" :src="dataInfo.avatar" :alt="dataInfo.avatar" />
                        <img
                            v-if="headmale"
                            src="../../assets/image/avatar_male.png"
                            :alt="dataInfo.avatar"
                        />
                        <img
                            v-if="headfemale"
                            src="../../assets/image/farmers_female.png"
                            :alt="dataInfo.avatar"
                        />
                        <!--:src="dataInfo.avatar || female_img" -->
                        <el-button size="small" type="primary">重置头像</el-button>
                    </div>
                </el-col>
                <el-col :span="8" class="column-2">
                    <el-row :span="3">
                        <dl>
                            <dt>昵称:</dt>
                            <dd>{{dataInfo.nickname || ''}}</dd>
                            <dd>
                                <el-button size="small" class="edit-btn">修改</el-button>
                            </dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>注册时间:</dt>
                            <dd>{{dataInfo.createTime}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>注册IP:</dt>
                            <dd>{{firstLogin.ip}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>注册设备:</dt>
                            <dd>{{firstLogin.loginDevice}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="5">
                        <dl>
                            <dt>注册设备码:</dt>
                            <dd>{{firstLogin.deviceCode}}</dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>注册渠道:</dt>
                            <dd>{{ channelData[dataInfo.channelID] && channelData[dataInfo.channelID].name}}({{dataInfo.channelID}})</dd>
                        </dl>
                    </el-row>
                    <el-row :span="6">
                        <dl>
                            <dt>注册版本:</dt>
                            <dd>{{dataInfo.version}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>所属地区:</dt>
                            <dd>{{dataInfo.areastr}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>实名信息:</dt>
                            <dd>{{dataInfo.name}}-{{dataInfo.idCard}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    <el-row :span="1">
                        <dl>
                            <dt>性别:</dt>
                            <dd>{{sex[dataInfo.gender]}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>上次登录时间:</dt>
                            <dd>{{lastLogin.collectTime}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>上次登录IP:</dt>
                            <dd>{{lastLogin.ip}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>上次登录设备:</dt>
                            <dd>{{lastLogin.loginDevice}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>上次登录设备码:</dt>
                            <dd>{{lastLogin.deviceCode}}</dd>
                        </dl>
                    </el-row>

                    <el-row :span="4">
                        <dl>
                            <dt>上次登录渠道:</dt>
                            <dd>{{channelData[lastLogin.channelId] && channelData[lastLogin.channelId].name}}({{lastLogin.channelId}})</dd>
                        </dl>
                    </el-row>

                    <el-row :span="6">
                        <dl>
                            <dt>上次登录版本:</dt>
                            <dd>{{lastLogin.version}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>类型:</dt>
                            <dd>{{type[dataInfo.type]}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>状态:</dt>
                            <dd>{{status[dataInfo.status]}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                </el-col>
            </el-row>
        </div>

        <div class="userinfo-global account-info">
            <el-row>
                <el-col :span="24">
                    <h3>账号信息</h3>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-row :span="2">
                        <dl>
                            <dt>显示ID:</dt>
                            <dd>{{dataInfo.showUID}}</dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>手机号:</dt>
                            <dd>{{dataInfo.phone_info}}</dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>携带金豆:</dt>
                            <dd>{{currency.coins}}</dd>
                        </dl>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    <el-row :span="2">
                        <dl>
                            <dt>playID:</dt>
                            <dd>{{dataInfo.playerID}}</dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>微信号:</dt>
                            <dd>{{dataInfo.wxName}}-{{dataInfo.wxOpenId}}</dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>保险箱金豆:</dt>
                            <dd>{{packsack.gold}}</dd>
                        </dl>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    <el-row :span="2">
                        <dl>
                            <dt>guid:</dt>
                            <dd>{{dataInfo.accountID}}</dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>零钱:</dt>
                            <dd>{{currency.ingots}}</dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>红包券:</dt>
                            <dd>{{redticket.total}}</dd>
                        </dl>
                    </el-row>
                </el-col>
            </el-row>
        </div>

        <!-- <div class="userinfo-global history-info">
            <el-row>
                <el-col :span="24">
                    <h3>历史数据</h3>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-row :span="2">
                        <dl>
                            <dt>第一次充值金额:</dt>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>历史充值时间:</dt>
                            <dd></dd>
                        </dl>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    <el-row :span="2">
                        <dl>
                            <dt>第一次充值时间:</dt>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>上一次充值时间:</dt>
                            <dd></dd>
                        </dl>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    <el-row :span="2">
                        <dl>
                            <dt>第一次玩牌:</dt>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="2">
                        <dl>
                            <dt>上一次玩牌:</dt>
                            <dd></dd>
                        </dl>
                    </el-row>
                </el-col>
            </el-row>
        </div>-->
    </div>
</template>
<script>
import { revoke } from '@/api/getApi'
export default {
    name: 'actor',
    data() {
        return {
            filterUid: '',
            filterType: 1,
            areaData: {},
            channelData: {},
            selectLogKey: '',
            sex: { '1': '男', '2': '女' },
            headmale: true,
            head: false,
            headfemale: false,
            status: { '1': '正常', '2': '冻结' },
            type: { '1': '普通玩家', '2': '机器人', '3': 'QA' },
            dataInfo: [], // 基本信息
            filterTypes: [
                { type: 1, name: '显示id' },
                { type: 2, name: 'playid' },
                { type: 3, name: '手机号' },
                { type: 4, name: 'guid' }
            ],
            logData: [],
            firstLogin: [],
            lastLogin: [],
            packsack: { gold: 0 }, // 保险箱信息
            currency: { coins: 0 }, // 货币表信息
            redticket: { total: 0 } // 红包券信息
        }
    },
    created() {
        this.loadArea()
        this.loadChannel()
        this.loadLog()
    },
    activated() {
        if (this.$route.params.filterType) {
            this.filterType = this.$route.params.filterType
        }
        if (this.$route.params.filterUid) {
            this.filterUid = this.$route.params.filterUid
        }
        if (this.$route.params.filterUid || this.$route.params.filterType) {
            this.find()
        }
    },
    methods: {
        find() {
            let args = {}
            args['type'] = this.filterType
            args['value'] = this.filterUid
            let data = {
                callm: 'users',
                callp: 'getInfo',
                args: JSON.stringify(args)
            }
            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    // 处理头像
                    this.dataInfo = res.data.info
                    if (
                        this.dataInfo.length === 0 ||
                        !this.dataInfo.hasOwnProperty('id')
                    ) {
                        this.$message('无此用户', '信息', {})
                        return
                    }
                    if (!isNaN(this.dataInfo.avatar)) {
                        if (this.dataInfo.gender === '2') {
                            this.headfemale = true
                            this.headmale = false
                        }
                        if (this.dataInfo.gender === '1') {
                            this.headmale = true
                            this.headfemale = false
                        }
                        this.head = false
                    } else {
                        this.head = true
                        this.headmale = false
                        this.headfemale = false
                    }

                    // 处理地址区域
                    this.dataInfo.areastr =
                        this.getAreaName(this.dataInfo.provinceID) +
                        '-' +
                        this.getAreaName(this.dataInfo.cityID) +
                        '-' +
                        this.getAreaName(this.dataInfo.areaID)
                    this.packsack = res.data.packsack
                    this.currency = res.data.currency
                    this.redticket = res.data.redticket
                    this.firstLogin = res.data.firstLogin
                    this.lastLogin = res.data.lastLogin
                    this.loadLog() // 加载历史记录
                } else {
                    this.$alert(res.msg, '信息', {})
                }
            })
        },
        // 查询区域名字
        getAreaName(key) {
            if (key.length === 2) {
                if (this.areaData.hasOwnProperty(key)) {
                    return this.areaData[key]['name']
                }
            } else if (key.length === 4) {
                let pid = key.substring(0, 2)
                if (
                    this.areaData.hasOwnProperty(pid) &&
                    this.areaData[pid]['children'].hasOwnProperty(key)
                ) {
                    return this.areaData[pid]['children'][key]['name']
                }
            } else if (key.length === 6) {
                let pid = key.substring(0, 2)
                let cid = key.substring(0, 4)
                if (
                    this.areaData.hasOwnProperty(pid) &&
                    this.areaData[pid]['children'].hasOwnProperty(cid)
                ) {
                    for (let j in this.areaData[pid]['children'][cid][
                        'children'
                    ]) {
                        if (
                            String(
                                this.areaData[pid]['children'][cid]['children'][
                                    j
                                ]['id']
                            ) === key
                        ) {
                            return this.areaData[pid]['children'][cid][
                                'children'
                            ][j]['name']
                        }
                    }
                }
            }
            return ''
        },
        loadArea() {
            let data = { key: 1 } // 保留key
            revoke('/index.php?m=config&p=area', data).then(res => {
                if (res.code === 0) {
                    this.areaData = res.data
                }
            })
        },
        loadChannel() {
            let data = { key: 1 } // 保留key
            revoke('/index.php?m=config&p=channel', data).then(res => {
                if (res.code === 0) {
                    this.channelData = res.data ? res.data : []
                }
            })
        },
        loadLog() {
            let data = { key: 1 } // 保留key
            revoke('/index.php?m=UserInfo&p=logs', data).then(res => {
                if (res.code === 0) {
                    this.logData = res.data
                }
            })
        },
        // 回调
        selectedLog(value) {
            let temp = value.split('_')
            this.filterType = parseInt(temp[0], 10)
            this.filterUid = String(temp[1])
        }
    }
}
</script>

<style lang="scss">
.userinfo-wrap {
    margin-bottom: 100px;
    .demo-form-inline {
        .el-form-item {
            margin-bottom: 0;
        }
    }
    .userinfo-global {
        > .el-row:nth-of-type(1) {
            h3 {
                margin-top: 40px;
                color: #555;
            }
        }
        > .el-row:nth-of-type(2) {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 5px 40px;
            .el-col {
                // border-left: 1px solid #ccc;
                dl {
                    display: flex;
                    flex-direction: row;
                    margin: 0;
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    dt {
                        width: auto;
                        min-width: 70px;
                        max-width: 110px;
                        color: #888;
                    }
                    dd {
                        margin-left: 20px;
                        color: #555;
                        // flex: 1;
                    }
                }
            }
            .edit-btn {
                color: #409eff;
            }
        }
    }
    /* 基本信息 */
    .userinfo-base {
        > .el-row:nth-of-type(2) {
            // padding-left: 0;
        }
        .col-header {
            .user-header {
                width: 100%;
                margin-left: -20px;
                text-align: center;

                img {
                    width: 120px;
                    height: 120px;
                    margin-top: 40px;
                    border-radius: 100%;
                }
                .el-button {
                    display: block;
                    margin: auto;
                    margin-top: 20px;
                }
            }
        }
    }
}
</style>
