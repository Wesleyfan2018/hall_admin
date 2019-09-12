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
                <li><input type='text' class="upgradeScore"  value=""/></li>
                <li><input type='text' class="eliminateScore"  value=""/></li>
            </ul>
        </template>
        <template v-if="formType==='add' && levelCount2===0">
            <p class="form-no-data">请添加关卡数量</p>
        </template>
        <!-- 编辑 -->
        <template v-if="(formType==='edit' || formType==='info') && _formObj && _formObj.length>0">
            <ul class="tbody addType" v-for="(item,index) in _formObj" :key="item.id">
                <li>{{index}}</li>
                <li><input type='text' class="initScore" v-model="item.initScore" :readonly="inputReadOnly"/></li>
                <li><input type='text' class="upgradeScore"  v-model="item.upgradeScore" :readonly="inputReadOnly"/></li>
                <li><input type='text' class="eliminateScore"  v-model="item.eliminateScore" :readonly="inputReadOnly"/></li>
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
                    initScore:getClassValue('initScore',i),
                    upgradeScore:getClassValue('upgradeScore',i),
                    eliminateScore:getClassValue('eliminateScore',i)
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
