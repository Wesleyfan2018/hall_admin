import { setStorageData, getStorageData } from '@/utils/auth';
// import router from '@/router';
const user = {
    state: {
        token: '',
        g: Number(getStorageData('g')) || 10000,
        e: Number(getStorageData('e')) || 1,
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_GAME: (state, g) => {
            state.g = g;
        },
        SET_ENV: (state, e) => {
            state.e = e;
        }
    },
    actions: {
        setGame({ commit }, g) {
            commit('SET_GAME', g);
            setStorageData('g', g);
        },
        setEnv({ commit }, e) {
            commit('SET_ENV', e);
            setStorageData('e', e);
        }
    }
};

export default user;
