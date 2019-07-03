<template>
    <div>
        <div class="app-wrapper">
            <navbar />
            <el-row class="mainBox">
                <div class="card text-center" v-for="(i, t) in proList" :key="(i, t)">
                    <div class="cardItem" @click="toSuit(i.projectId)" :style="{ 'background-image': 'url('+ i.imgUrl +')'}" >
                        <div class="cardTitle opaciity">{{i.title}}</div>
                    </div>
                </div>
                <div class="card text-center">
                    <div class="cardItemEnd">
                        <div class="cardTitle opaciity">添加新项目</div>
                    </div>
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>
import { removeStorageData } from '@/utils/auth';
import router from '@/router';
import { mapActions } from 'vuex';
import { Navbar } from '../layout/components';
export default {
    components: {
        Navbar
    },
    data() {
        return {
            username: 'admin',
            password: '111111',
            loading: false,
            kk: 'img.png',
            passwordType: 'password',
            proList: [
                { title: '中控中心', projectId: 1, imgUrl: require('../../assets/image/bigData.png') },
                { title: '数据中心', projectId: 2, imgUrl: require('../../assets/image/bigData2.png') },
                { title: '配置中心', projectId: 3, imgUrl: require('../../assets/image/bigData3.png') },
                { title: '助手中心', projectId: 4, imgUrl: require('../../assets/image/bigData4.png') }
            ]
        };
    },
    methods: {
        ...mapActions([
            'setTagsList',
            'setTagsIndex',
            'setActiveMenuItem'
        ]),
        toSuit(str) {
            removeStorageData('tagsList');
            removeStorageData('tagIndex');
            removeStorageData('activeMenuItem');
            this.setTagsList([{ value: '首页', path: '/', pathName: '/' }]);
            this.setTagsIndex(0);
            this.setActiveMenuItem('0');
            router.push({
                path: '/'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background: url('../../assets/image/loginbg_01.jpg');
}
.iconStyle { font-size: 100px!important; }
.text-center{ text-align:center; }
.opaciity {
    filter:alpha(opacity=50);           /*IE滤镜，透明度50%*/
    -moz-opacity:0.5;                   /*支持旧版本的 Mozilla 浏览器*/
    -khtml-opacity: 0.5;                /*支持旧版本的Safari(1.*)*/
    opacity: 0.5;                       /*支持大多数浏览器,Firefox、Safari、Opera 等*/
}
.mainBox {
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
    top: 30%;
    left: 50%;
    width: 846px;
    margin-left: -423px;
    margin-top: -159.6px;
    border-radius:10px;
    // border: 1.5px solid #d9e1e8;
}
.card {
    width: 240px;height: 145px;margin: 20px;background: #FFF;line-height:145px;border-radius:5px;
}
.cardItem {
    display:flex;flex-direction: column-reverse;width:100%;height:100%;
    background-repeat: no-repeat;background-position: center center;
    background-size: 40% 65%;
}
.cardItemEnd {
    display:flex;flex-direction: column-reverse;width:100%;height:100%;
    background-image:url("../../assets/image/plusIcon.png");
    background-repeat: no-repeat;background-position: center center;
}
.cardTitle {
    display: none;
}
.card:hover {
    .cardTitle {
    width:100%;height:30px;line-height:30px;background: rgba(34, 24, 219, 0.4);border-radius: 0 0 5px 5px;font-size: 16px;display: block;
}
}
</style>
