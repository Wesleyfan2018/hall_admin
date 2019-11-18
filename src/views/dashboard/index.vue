<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="box-card" :inline="true">
                    <div slot="header" class="clearfix">
                        <span>访问历史</span>
                    </div>
                    <el-tag
                        class="history_tags"
                        v-show="visiHistory.length > 0"
                        v-for="item in visiHistory"
                        :key="item.pathName"
                        effect="dark"
                        @click="quikeRouter(item)"
                    >{{ item.value }}</el-tag>
                    <div class="text-center gray">
                        <span v-show="visiHistory.length === 0">暂无访问历史记录</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import router from '@/router'
export default {
    data() {
        return {}
    },
    computed: {
        ...mapState({
            menuList: state => state.tagsview.menuList,
            cachedViews: state => state.tagsview.cachedViews,
            visiHistory: state => state.tagsview.visiHistory,
            tagsList: state => state.tagsview.tagsList,
            tagIndex: state => state.tagsview.tagIndex,
            activeMenuItem: state => state.tagsview.activeMenuItem
        })
    },
    // created() {
    //     this.visiHistory.length = 0;
    //     this.setVisiHistory(this.visiHistory);
    // },
    methods: {
        ...mapActions([
            'setTagsList',
            'setTagsIndex',
            'setActiveMenuItem',
            'setVisiHistory'
        ]),
        quikeRouter(obj) {
            if (
                this.tagsList.findIndex(item => item.path === obj.path) === -1
            ) {
                this.tagsList.push(obj)
                this.setTagsList(this.tagsList)
                let tagIndex = this.tagsList.length - 1
                this.setTagsIndex(tagIndex)
            } else {
                let tagIndex = this.tagsList
                    .map(item => item.path)
                    .indexOf(obj.path)
                this.setTagsIndex(tagIndex)
            }
            let menuIndex = Number
            let itemIndex = Number
            if (obj.path === '/') {
                return '0'
            }
            for (let i in this.menuList) {
                if (
                    this.menuList[i].menuItem.findIndex(
                        item => item.path === obj.path
                    ) !== -1
                ) {
                    menuIndex = i
                    itemIndex = this.menuList[i].menuItem
                        .map(item => item.path)
                        .indexOf(obj.path)
                }
            }
            let activeIndex = menuIndex + '-' + itemIndex
            this.setActiveMenuItem(activeIndex)
            router.push({
                path: obj.path
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.text {
    font-size: 14px;
}
.history_tags {
    margin: 5px !important;
}

.item {
    margin-bottom: 18px;
}
.gray {
    color: rgb(191, 203, 217);
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
}
.clearfix:after {
    clear: both;
}

.box-card {
    width: 480px;
}
</style>