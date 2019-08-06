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
                        <img src="../../assets/image/avatar_male.png" :alt="dataInfo.avatar" />
                        <!--:src="dataInfo.avatar || female_img" -->
                        <el-button size="small" type="primary">重置头像</el-button>
                    </div>
                </el-col>
                <el-col :span="8" class="column-2">
                    <el-row :span="3">
                        <dl>
                            <dt>昵称:</dt>
                            <dd>{{dataInfo.nickname || 'user-Lily'}}</dd>
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
                            <dd></dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>注册设备:</dt>
                            <dd>{{dataInfo.device}}</dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>所属地区:</dt>
                            <dd></dd>
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
                            <dd></dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>上次登录IP:</dt>
                            <dd></dd>
                            <dd></dd>
                        </dl>
                    </el-row>
                    <el-row :span="4">
                        <dl>
                            <dt>上次登录设备:</dt>
                            <dd></dd>
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
                            <dd>{{dataInfo.phone}}</dd>
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
                            <dt>设备码:</dt>
                            <dd>{{dataInfo.imei}}</dd>
                        </dl>
                    </el-row>
                </el-col>
            </el-row>
        </div>

        <div class="userinfo-global history-info">
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
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    name: 'actor',
    data() {
        return {
            filterUid: '6851998443',
            filterType: 1,
            sex: { '1': '女', '2': '男' },
            status: { '1': '正常', '2': '冻结' },
            type: { '1': '普通玩家', '2': '机器人', '3': 'QA' },
            dataInfo: [],
            filterTypes: [
                { type: 1, name: '显示id' },
                { type: 2, name: 'playid' },
                { type: 3, name: '手机号' },
                { type: 4, name: 'guid' }
            ]
        };
    },
    methods: {
        find() {
            let args = {};
            args['type'] = this.filterType;
            args['value'] = this.filterUid;
            let data = {
                callm: 'users',
                callp: 'getInfo',
                args: JSON.stringify(args)
            };
            revoke('/hall-admin-new/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {
                    this.dataInfo = res.data.info;
                }
            });
        }
    }
};
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
