<template>
    <div>
        <router-view></router-view>
        <ul v-if="dataInfo">
            <li v-for="(info, i) in dataInfo.project" :key="info[i]">
                <label>{{info.pname}}</label>
                <ul>
                    <li
                        v-for="(envs, j) in info.envs"
                        :key="envs[j]"
                        @click="changeEnvs(envs.api, i, j)"
                    >{{envs.ename}}</li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
import ajax from '@/utils/ajax';
import { mapMutations } from 'vuex';
import { setEncData, getEncData, getRequestApi, setBaseApi } from '@/utils/auth';
// import { constants } from 'crypto';
export default {
    data() {
        return {
            dataInfo: null
        };
    },
    components: {},
    mounted() {
        this.init();
    },
    methods: {
        ...mapMutations({
            changeBaseApi: 'SET_BASEAPI'
        }),
        init() {
            this.dataInfo = getEncData('loginInfo');
            console.log(this.dataInfo);
        },
        // 切换环境
        changeEnvs(envs, i, j) {
            let url = getRequestApi();
            this.changeBaseApi(envs);
            setBaseApi(envs);
            this.$set(this.dataInfo.project[i].envs[j], 'selected', 1);
            setEncData('loginInfo', this.dataInfo);
            ajax.post(url).then(res => {

            });
            // setStorageData("baseApi", envs);

        }
    }
};
</script>
