<template>
    <div class="tags-view">
        <div class="tag-group">
            <el-tag
                v-for="(item, idx) in tagsList"
                ref="item.value"
                :key="(item, idx)"
                :closable="idx !== 0"
                size="medium"
                @click="handleClick(idx, item.path)"
                @close="handleClose(idx)"
                :effect="idx === tagIndex ? 'dark' : 'plain'">
                {{ item.value }}
            </el-tag>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import router from '@/router';
export default {
    name: 'TagsView',
    data() {
        return {
        };
    },
    computed: {
        ...mapState({
            menuList: state => state.tagsview.menuList,
            cachedViews: state => state.tagsview.cachedViews,
            tagsList: state => state.tagsview.tagsList,
            tagIndex: state => state.tagsview.tagIndex,
            activeMenuItem: state => state.tagsview.activeMenuItem
        })
    },
    methods: {
        ...mapActions([
            'setTagsList',
            'setTagsIndex',
            'setActiveMenuItem'
        ]),
        handleClose(num) {
            if (num === this.tagIndex) {
                this.setTagsIndex(this.tagsList.length - 2);
                this.tagsList.splice(num, 1);
                this.cachedViews.splice(num, 1);
                this.setTagsList(this.tagsList);
                router.push({
                    path: this.tagsList[this.tagIndex].path
                });
            } else {
                this.tagsList.splice(num, 1);
                this.cachedViews.splice(num, 1);
                this.setTagsList(this.tagsList);
                if (num < this.tagIndex) {
                    let indexNum = this.tagIndex - 1;
                    this.setTagsIndex(indexNum);
                }
            }
        },
        handleClick(num, str) {
            this.setTagsIndex(num);
            let index = this.activeItem(str);
            this.setActiveMenuItem(index);
            router.push({
                path: str
            });
        },
        // 更改menuItem打开的index
        activeItem(str) {
            let menuIndex = Number;
            let itemIndex = Number;
            if (str === '/') {
                return '0';
            }
            for (let i in this.menuList) {
                if (this.menuList[i].menuItem.findIndex(item => item.path === str) !== -1) {
                    menuIndex = i;
                    itemIndex = this.menuList[i].menuItem.map(item => item.path).indexOf(str);
                }
            }
            let activeIndex = menuIndex + '-' + itemIndex;
            return activeIndex;
        },
    }
};
</script>
<style lang="scss">
.tags-view {
    height:34px;padding:3px 20px;-webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);line-height: 34px;background-color: #f8f8f8;
}
.el-tag {
    margin: 0 5px;
    cursor: pointer;
}
</style>
