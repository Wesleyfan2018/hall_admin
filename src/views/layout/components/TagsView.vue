<template>
    <div style="height;34px;padding:3px 20px;-webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);">
        <div class="tag-group">
            <el-tag
                v-for="(item, idx) in items"
                ref="item.label"
                :key="(item, idx)"
                closable
                :type="item.type"
                size="medium"
                @click="handleClick(item.label)"
                @close="handleClose(item, idx)"
                effect="plain">
                {{ item.label }}
            </el-tag>
        </div>
    </div>
</template>
<script>

export default {
    name: 'TagsView',
    data() {
        return {
            items: [
                { type: '', label: '标签一' },
                { type: 'success', label: '标签二' },
                { type: 'info', label: '标签三' },
                { type: 'danger', label: '标签四' },
                { type: 'warning', label: '标签五' }
            ]
        };
    },
    methods: {
        handleClose(num) {
            this.items.splice(num, 1);
        },
        handleClick(str) {
            console.log(str);
        }
    }
};
</script>
<style lang="scss" scoped>
    is-actived {
        background-color: aquamarine;
    }
</style>

