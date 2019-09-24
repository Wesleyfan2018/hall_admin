<template>
    <!-- 关卡奖励 -->
    <div :class="{'form-global gkjf':true,'add':formType==='add','edit':formType==='edit','info':formType==='info'}" border="1" cellpadding="0" cellspacing="0">
        <ul class="theader">
            <li>关卡序号</li>
            <li>类型</li>
            <li>数量</li>
            <li>类型</li>
            <li>数量</li>
        </ul>
        <!-- 新增 -->
        <template v-if="formType==='add' && levelCount2>0">
            <ul class="tbody addType" v-for="i in levelCount2" :key="i">
                <li>{{i}}</li>
                <li>
                    <!-- <input type='text' class="awardType" value=""/> -->
                    <el-select v-model="currTypeArr[i]" class="form-input-min" @change="changeEve($event, i, 'currType')">
                        <el-option
                            v-for="item in currencyMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li><input type='text' class="awardMoneyType" value=""/></li>
                <li>
                    <el-select v-model="toolsArr[i]" disabled @change="changeEve($event, i, 'toolType')">
                        <el-option
                            v-for="item in toolsMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li><input type='text' class="awardCount" value="0" :disabled="true" /></li>
            </ul>
        </template>
        <template v-if="formType==='add' && levelCount2===0">
            <p class="form-no-data">请添加关卡数量</p>
        </template>
        <!-- 编辑 -->
        <template v-if="(formType==='edit' || formType==='info') && thatFormObj && thatFormObj.length>0">
            <ul class="tbody addType" v-for="(item,index) in thatFormObj" :key="item.id">
                <li>{{index+1}}</li>
                <li>
                    <!-- <input type='text' class="awardType" v-model="item.awardType" :readonly="inputReadOnly"/> -->

                    <el-select :disabled="allLocked" v-model="currTypeArr[index]" class="form-input-min" :readonly="inputReadOnly" @change="changeEve($event, index, 'currType')">
                        <el-option
                            v-for="item in currencyMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li><input :disabled="allLocked" type='text' class="awardCount" v-model="item.awardCount" :readonly="inputReadOnly"/></li>
                <li>
                    <el-select v-model="toolsArr[index]" disabled class="form-input-min" :readonly="inputReadOnly" @change="changeEve($event, index, 'toolType')">
                        <el-option
                            v-for="item in toolsMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li><input :disabled="allLocked" type='text' class="" value="" :readonly="inputReadOnly"/></li>
            </ul>
        </template>
    </div>
</template>

<script>
import { getClassValue } from '@/utils/common.js';
export default {
    props: ['levelCount2', 'formType', 'formObj', 'allLocked'],
    data() {
        return {
            inputDisabled: true,
            inputReadOnly: false, // formType = 'info'时使用
            // 货币类型
            currencyMap: [{ label: '金豆', value: 1 }, { label: '红包券', value: 5 }],
            currTypeArr: [], // 货币类型
            // 道具奖励
            toolsMap: [{ label: '玫瑰花', value: 1 }, { label: '啤酒', value: 2 }],
            toolsArr: [], // 道具类型
            thatFormObj: [] // 替代值
        };
    },
    mounted() {
        // 初始化赋值
        this.thatFormObj = this.formObj;
        for(let i in this.thatFormObj) {
            this.currTypeArr.push(this.thatFormObj[i].awardMoneyType);
            this.toolsArr.push(this.thatFormObj[i].awardItemID);
        }
    },
    watch: {
        formType: function(newVal) {
            this.inputReadOnly = this.formType === 'info' ? true : false;// 输入框是否只读
            this.thatFormObj = this.formObj;
        },
        levelCount2(newVal, oldVal) {
            if (oldVal > newVal) {
                this.thatFormObj.pop();
            } else {
                let item = {
                    "awardCount": 0,
                    "awardMoneyType": '',
                    "awardType": '',
                    "awardItemID": ''
                };
                this.thatFormObj.push(item);
            }
        }
    },
    methods: {
        changeEve(val, index, field) {
            if (field === 'currType') {
                this.currTypeArr[index] = val;
            } else if (field === 'toolType') {
                this.toolsArr[index] = val;
            }
        },
        // formType = 'add' 时，表单提交
        addSubmitEve() {
            let thatFormObj1 = [];
            let for_length = Number(this.levelCount2);  // 关卡数量
            for (let i = 0; i < for_length; i++) {
                let awardMoneyType = this.currTypeArr[i + 1];
                let awardCount = getClassValue('awardMoneyType', i);
                if (awardMoneyType === undefined) {
                    this.$message.error('请选择奖励类型！');
                    return false;
                }
                if (awardCount === '') {
                    this.$message.error('奖励数量不能为空！');
                    return false;
                }

                thatFormObj1[i] = {
                    awardType: 1,
                    awardMoneyType: awardMoneyType,
                    awardItemID: '',
                    awardCount: awardCount
                };
            }
            // console.log(thatFormObj);
            this.$emit('submitEve', thatFormObj1);

        },
        submitEve() {
            if (this.formType === 'add') {
                this.addSubmitEve();
            }
            else if (this.formType === 'edit') {
                this.$emit('submitEve', this.thatFormObj);
            }
        }
    }
};
</script>
<style scoped>
.form-input-min >>> .el-input__suffix {
    right: 20px;
}
</style>
