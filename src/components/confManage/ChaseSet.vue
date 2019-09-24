<template>
    <!-- 复活设置 -->
    <div :class="{'form-global gkjf':true,'add':formType==='add','edit':formType==='edit','info':formType==='info'}" border="1" cellpadding="0" cellspacing="0">
        <ul class="theader">
            <li>关卡序号</li>
            <li>是否可复活</li>
            <li>复活货币</li>
            <li>数量</li>
        </ul>
        <!-- 新增 -->
        <template v-if="formType==='add' && levelCount2>0">
            <ul class="tbody addType" v-for="i in levelCount2" :key="i">
                <li>{{i}}</li>
                <li>
                    <!-- <input type='text' class="enableRelive"  value=""/> -->
                    <el-select :disabled="allLocked" v-model="reliveTypeArr[i]" class="form-input-min" @change="changeEve($event,i,'reliveType')">
                        <el-option
                            v-for="item in reliveMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <!-- <input type='text' class="reliveMoneyType" value=""/> -->
                    <el-select :disabled="allLocked" v-model="currTypeArr[i]" class="form-input-min" @change="changeEve($event, i, 'currType')">
                        <el-option
                            v-for="item in currencyMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li><input :disabled="allLocked" type='text' class="reliveMoney" value="" /></li>
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
                    <el-select :disabled="allLocked" v-model="reliveTypeArr[index]" class="form-input-min" @change="changeEve($event, index, 'reliveType')">
                        <el-option
                            v-for="item in reliveMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <!-- <input type='text' class="reliveMoneyType" v-model="item.reliveMoneyType" :readonly="inputReadOnly"/> -->
                    <el-select :disabled="allLocked" v-model="currTypeArr[index]" class="form-input-min" :readonly="inputReadOnly" @change="changeEve($event, index, 'currType')">
                        <el-option
                            v-for="item in currencyMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li><input :disabled="allLocked" type='text' class="reliveMoney" v-model="item.reliveMoney" :readonly="inputReadOnly"/></li>
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
            inputReadOnly: false, // formType = 'info'时使用
            // 是否可复活
            reliveMap: [{ label: '可复活', value: 1 }, { label: '不可复活', value: 0 }],
            reliveTypeArr: [],
            // 货币类型
            currencyMap: [{ label: '金豆', value: 1 }, { label: '红包券', value: 5 }],
            currTypeArr: [],
            thatFormObj: []
        };
    },
    mounted() {
        // 初始化赋值
        this.thatFormObj = this.formObj;
        console.log(this.thatFormObj);
        for(let i in this.thatFormObj) {
            this.reliveTypeArr.push(this.thatFormObj[i].enableRelive);
            this.currTypeArr.push(this.thatFormObj[i].reliveMoneyType);
        }
    },
    watch: {
        formType: function(newVal) {
            this.inputReadOnly = this.formType === 'info' ? true : false;// 输入框是否只读
            this.thatFormObj = this.formObj;
            // this.reliveTypeArr = new Array(this.levelCount2);
            // this.currTypeArr = new Array(this.levelCount2);
        },
        levelCount2(newVal, oldVal) {
            if (oldVal > newVal) {
                this.thatFormObj.pop();
            } else {
                let item = {
                    "enableRelive": '',
                    "reliveMoney": 0,
                    "reliveMoneyType": ''
                };
                this.thatFormObj.push(item);
            }
        }
    },
    methods: {
        changeEve(val, index, field) {
            if (field === 'currType') {
                this.currTypeArr[index] = val;
            } else if (field === 'reliveType') {
                this.reliveTypeArr[index] = val;
            }
        },
        // formType = 'add' 时，表单提交
        addSubmitEve() {
            let thatFormObj1 = [];
            let for_length = Number(this.levelCount2);  // 关卡数量
            for (let i = 0; i < for_length; i++) {

                let enableRelive = this.reliveTypeArr[i + 1];
                let reliveMoneyType = this.currTypeArr[i + 1];
                let reliveMoney = getClassValue('reliveMoney', i);
                if (enableRelive === undefined) {
                    this.$message.error('请选择是否可复活！');
                    return false;
                }
                if (reliveMoneyType === undefined) {
                    this.$message.error('请选择复活货币！');
                    return false;
                }
                if (reliveMoney === '') {
                    this.$message.error('复活数量不能为空！');
                    return false;
                }

                thatFormObj1[i] = {
                    enableRelive: this.reliveTypeArr[i + 1],
                    reliveMoneyType: this.currTypeArr[i + 1],
                    reliveMoney: reliveMoney
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
    right: 25px;
}
</style>