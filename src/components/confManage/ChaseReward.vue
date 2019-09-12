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
                <li><input type='text' class="awardType"  value=""/></li>
                <li><input type='text' class="awardMoneyType"  value=""/></li>
                <li><input type='text' class="awardItemID"  value="" /></li>
                <li><input type='text' class="awardCount"  value="" /></li>
            </ul>
        </template>
        <template v-if="formType==='add' && levelCount2===0">
            <p class="form-no-data">请添加关卡数量</p>
        </template>
        <!-- 编辑 -->
        <template v-if="(formType==='edit' || formType==='info') && formObj && formObj.length>0">
            <ul class="tbody addType" v-for="(item,index) in formObj" :key="item.id">
                <li>{{index}}</li>
                <li><input type='text' class="awardType" v-model="item.awardType" :readonly="inputReadOnly"/></li>
                <li><input type='text' class="awardMoneyType"  v-model="item.awardMoneyType" :readonly="inputReadOnly"/></li>
                <li><input type='text' class="awardItemID"  v-model="item.awardItemID" :readonly="inputReadOnly"/></li>
                <li><input type='text' class="awardCount"  v-model="item.awardCount" :readonly="inputReadOnly"/></li>
            </ul>
        </template>
    </div>
</template>

<script>
import { getClassValue } from "@/utils/common.js";
export default {
    props: ['levelCount2','formType','formObj'],
    data () {
        return {            
            inputReadOnly:false, // formType = 'info'时使用
        }
    },
    created () {        
        this.inputReadOnly = this.formType==='info'?true:false;//输入框是否只读
        this._formObj = this.formObj;
    },
    methods: {
        // formType = 'add' 时，表单提交
        addSubmitEve(){
            let _formObj1 = [];
            let for_length = Number(this.levelCount2);  //关卡数量
            for(let i=0;i<for_length;i++){
                _formObj1[i] = {
                    awardType:getClassValue('awardType',i),
                    awardMoneyType:getClassValue('awardMoneyType',i),
                    awardItemID:getClassValue('awardItemID',i),
                    awardCount:getClassValue('awardCount',i)
                }
            }
            // console.log(_formObj);  
            this.$emit('submitEve',_formObj1);

        },
        submitEve(){
            if(this.formType==='add'){
                this.addSubmitEve();
            }
            else if(this.formType==='edit'){
                this.$emit('submitEve',this._formObj);
            }
        }
    }
}
</script>
