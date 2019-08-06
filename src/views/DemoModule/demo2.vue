<template>
    <div>
        <div style="width:50%;float:left;text-align:center;height:20px;line-height:20px;color: rgb(191, 203, 217);">老代码</div>
        <div style="width:50%;float:left;text-align:center;height:20px;line-height:20px;color: rgb(191, 203, 217);">新代码</div>
        <vue-code-diff :old-string="oldStr" :new-string="newStr" outputFormat="side-by-side" :context="10" />
    </div>
</template>

<script>
import vueCodeDiff from 'vue-code-diff';
export default {
    components: { vueCodeDiff },
    data() {
        return {
            oldStr: 'old \n 123',
            newStr: 'new \n 123'
        };
    },
    created() {
        this.oldStr = "array (\n'id' => 1,\n'name' => '微信红包',\n'icon' => 'https://download-hall-cdn.stevengame.com/hall/production/common/exchange/redbag.png',\n'isOpen' => 1,\n'sort' => 1,\n)";
        this.newStr = "array (\n'id' => 2,\n'name' => '嘎嘎红包',\n'icon' => 'https://download-hall-cdn.stevengame.com/hall/production/common/exchange/redbag.png',\n'isOpen' => 1,\n'sort' => 1,\n)";
    }
};
</script>
