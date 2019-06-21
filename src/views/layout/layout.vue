<template>
    <div>
        <div class="app-wrapper">
            <navbar />
        </div>
    </div>
</template>
<script>
import ajax from '@/utils/ajax';
import { Navbar } from './components';
import { mapMutations } from 'vuex';
import { setEncData, getEncData, getRequestApi, setBaseApi } from '@/utils/auth';
// import { constants } from 'crypto';
export default {
    name: 'Layout',
    components: {
        Navbar
    },
    data() {
        return {
            dataInfo: null
        };
    },
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

<style lang="scss">
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>
