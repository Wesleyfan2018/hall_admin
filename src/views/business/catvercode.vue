<template>
    <div class="app-containei">
            <el-form :inline="true" class="demo-form-inline">


              <el-form-item label="手机号：">
                  <el-input v-model="phone"  class="form-input"></el-input>
                </el-form-item>
                  <el-form-item>
                  <el-button class="filter-item" type="primary" icon="el-icon-search" @click="cat">查看</el-button>
                   </el-form-item>

                            <el-input type="textarea"  v-model="OutPut" :rows="6" placeholder=""  resize="vertical"></el-input>
            </el-form>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';

export default {
    data() {
        return {
            OutPut: '',
            phone: '',
        };
    },
    methods: {
        cat() {
            if (!this.phone) {
                this.$message.error('手机号不能为空！');
                return false;
            }
            let args = { phone: this.phone };
            let data = {
                callm: 'verifycode',
                callp: 'getCode',
                args: JSON.stringify(args),
            };

            revoke('/index.php?m=CallProxy&p=callCommon', data).then(res => {
                if (res.code === 0) {

                    this.OutPut = res.data.info;
                    if (this.OutPut.length === 0) {
                        this.OutPut = '该手机号无验证码数据！';
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },



    }
};
</script>