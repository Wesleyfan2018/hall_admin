<template>
    <div class="app-containei userinfo-wrap">
        <el-form :inline="false" class="demo-form-inline">
            <el-form-item label="尺寸:">
                <el-select v-model="size" placeholder="请选择">
                    <el-option
                        v-for="item in sizeType"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="内容:">
                 <el-input type="textarea"  v-model="text" placeholder="内容" :rows="3" resize="vertical"></el-input>
            </el-form-item>
            <el-form-item style="margin: 25px 0px 0px 0px">
                <el-button class="filter-item" type="primary" @click="gen">生成二维码</el-button>
            </el-form-item>
        </el-form>
     <div class="userinfo-global userinfo-base" style="margin: 25px 0px 0px 0px">
        <img  ref="imgShow" :src="qrimg">
    </div>

    </div>

</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    name: 'actor',
    data() {
        return {
            size: '100',
            text: '',
            qrimg: '',
            sizeType: [{ 'name': '100*100', 'type': '100' }, { 'name': '200*200', 'type': '200' }, { 'name': '400*400', 'type': '400' }]


        };
    },
    methods: {
        gen() {
            let data = {
                size: this.size,
                text: escape(this.text),
            };
            revoke('/index.php?m=qrcode&p=gen', data).then(res => {
                if (res.code === 0) {
                    console.log(res);
                    this.qrimg = 'data:image/png;base64,' + res.data.img;
                } else {
                    this.$alert(res.data.msg, '信息', { });
                }
            });
        },
    }
};
</script>

