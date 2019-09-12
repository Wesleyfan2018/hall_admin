// 基本信息存储
const base = {
    state: {
        envList: [
            {
                game: 9999,
                gameName: '红幺鸡麻将',
                list: [
                    {
                        env: 1,
                        label: '测试服'
                    },
                    {
                        env: 2,
                        label: '体验服'
                    },
                    {
                        env: 3,
                        label: '预发布服'
                    },
                    {
                        env: 4,
                        label: '正式服'
                    },
                ]
            },
            {
                game: 10000,
                gameName: '微信小游戏',
                list: [
                    {
                        env: 1,
                        label: '测试服'
                    },
                    {
                        env: 2,
                        label: '体验服'
                    },
                    {
                        env: 3,
                        label: '预发布服'
                    },
                    {
                        env: 4,
                        label: '正式服'
                    },
                ]
            },
            {
                game: 10001,
                gameName: '大圣游戏大厅',
                list: [
                    {
                        env: 1,
                        label: '测试服'
                    },
                    {
                        env: 2,
                        label: '体验服'
                    },
                    {
                        env: 3,
                        label: '预发布服'
                    },
                    {
                        env: 4,
                        label: '正式服'
                    },
                ]
            }
        ]
    },
    getters: {
        GetEnvConf: (state, getters) => (gameid = 0) => {
            for (let i in state.envList) {
                if (String(state.envList[i].game) === String(gameid)) {
                    return state.envList[i];
                }
            }
        }
    }
};

export default base;
