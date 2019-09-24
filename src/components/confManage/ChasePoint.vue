<template>
    <!-- 关卡积分 -->
    <div :class="{'form-global gkjf':true,'add':formType==='add','edit':formType==='edit','info':formType==='info'}" border="1" cellpadding="0" cellspacing="0">
        <ul class="theader">
            <li>关卡序号</li>
            <li>初始积分</li>
            <li>晋级积分</li>
            <li>淘汰积分</li>
        </ul>
        <!-- 新增 -->
        <template v-if="formType==='add' && levelCount2>0">
            <ul class="tbody addType" v-for="i in levelCount2" :key="i">
                <li>{{i}}</li>
                <li><input type='text' class="initScore" value=""/></li>
                <li><input type='text' class="upgradeScore" value=""/></li>
                <li><input type='text' class="eliminateScore" value=""/></li>
            </ul>
        </template>
        <template v-if="formType==='add' && levelCount2===0">
            <p class="form-no-data">请添加关卡数量</p>
        </template>
        <!-- 编辑 -->
        <template v-if="(formType==='edit' || formType==='info') && thatFormObj && thatFormObj.length>0">
            <ul class="tbody addType" v-for="(item,index) in thatFormObj" :key="item.id">
                <li>{{index+1}}</li>
                <li><input type='text' class="initScore" v-model="item.initScore" :disabled="inputReadOnly" /></li>
                <li><input type='text' class="upgradeScore" v-model="item.upgradeScore" :disabled="inputReadOnly" /></li>
                <li><input type='text' class="eliminateScore" v-model="item.eliminateScore" :disabled="inputReadOnly" /></li>
            </ul>
        </template>
    </div>
</template>

<script>
import { getClassValue } from '@/utils/common.js';
export default {
    props: ['levelCount2', 'formType', 'formObj'],
    data() {
        return {
            inputReadOnly: false, // formType = 'info'时使用
            thatFormObj: [],
        };
    },
    created() {
        this.thatFormObj = this.formObj;
        this.formTypeEve();
    },
    updated() {
        console.log(this.formType);
    },
    watch: {
        formType: function(newVal) {
            this.formTypeEve();
        },
        levelCount2(newVal, oldVal) {
            if (oldVal > newVal) {
                this.thatFormObj.pop();
            } else {
                let item = {
                    "eliminateScore": 0,
                    "initScore": 0,
                    "upgradeScore": 0
                };
                this.thatFormObj.push(item);
            }
        }
    },
    methods: {
        // formType change监听
        formTypeEve() {
            this.inputReadOnly = this.formType === 'info' ? true : false;// 输入框是否只读
            this.thatFormObj = this.formObj;
        },
        // formType = 'add' 时，表单提交
        addSubmitEve() {
            let thatFormObj1 = [];
            let for_length = Number(this.levelCount2);  // 关卡数量
            for (let i = 0; i < for_length; i++) {
                let initScore = getClassValue('initScore', i);
                let upgradeScore = getClassValue('upgradeScore', i);
                let eliminateScore = getClassValue('eliminateScore', i);
                if (initScore === '') {
                    this.$message.error('初始积分不能为空！');
                    return false;
                }
                if (upgradeScore === '') {
                    this.$message.error('晋级积分不能为空！');
                    return false;
                }
                if (eliminateScore === '') {
                    this.$message.error('淘汰积分不能为空！');
                    return false;
                }

                thatFormObj1[i] = {
                    initScore: initScore,
                    upgradeScore: upgradeScore,
                    eliminateScore: eliminateScore
                };
            }
            this.$emit('submitEve', thatFormObj1);
        },
        submitEve() {
            if (this.formType === 'add') {
                this.addSubmitEve();
            } else if (this.formType === 'edit') {
                this.$emit('submitEve', this.thatFormObj);
            }
        }
    }
};
</script>
