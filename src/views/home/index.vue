<template>
    <div class="">
        home
        <div @click="dele()">kkkkkkk</div>
    </div>
</template>

<script>
import ajax from '@/utils/ajax';
import { mapActions } from 'vuex';
import { initPage } from '@/api/initializePage';
export default {
    data() {
        return {
            username: 'admin',
            password: '111111',
            loading: false,
            passwordType: 'password'
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let url = '/kk/index';
            let data = {
                kk: 'kk'
            };
            console.log(888);
            initPage(url, data).then(res => {
                if (res) {
                    console.log(321);
                }
            });
        },
        dele() {
            console.log(store.state.user);
            ajax.post('kk/kkk').then(res => {
                if (res.code === 0) {
                    console.log(321);
                }
            });
        }

    }
};
</script>
