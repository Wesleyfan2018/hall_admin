<template>
    <div>
        <div class="area-select" @click="select_area">
            <div class="area-select-input">
                <el-tag
                    v-show="areaValue.length > 0"
                    size="small"
                    closable
                    type="info"
                    @close="delete_tag"
                >{{showTag}}</el-tag>
                <el-tag v-show="areaValue.length > 1" size="small" type="info">.....</el-tag>
            </div>
            <div class="el-input el-input--suffix is-focus">
                <input
                    type="text"
                    readonly="readonly"
                    placeholder
                    class="el-input__inner"
                    style="height: 40px;"
                />
            </div>
        </div>
        <el-dialog title="选择地区" :visible.sync="aeraVisble" width="20%" :append-to-body="true">
            <el-form class="text-center">
                <el-form-item>
                    <el-input placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
                    <div v-show="isMultiple" class="aera_select_tree_box">
                        <el-tree
                            show-checkbox
                            class="filter-tree"
                            :data="data"
                            node-key="id"
                            :props="defaultProps"
                            :default-expand-all="false"
                            :filter-node-method="filterNode"
                            ref="tree_multiple"
                        ></el-tree>
                    </div>
                    <div v-show="!isMultiple" class="aera_select_tree_box">
                        <el-tree
                            class="filter-tree"
                            :data="data"
                            node-key="id"
                            @node-click="single_click"
                            :props="defaultProps"
                            :default-expand-all="false"
                            :filter-node-method="filterNode"
                            ref="tree_single"
                        ></el-tree>
                    </div>
                    <el-button v-show="isMultiple" type="success" @click="confirmSelect">确认</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { revoke } from '@/api/getApi'
export default {
    name: 'Areaselect',
    props: ['isMultiple', 'has_area', 'initArea', 'thatValue'],
    data() {
        return {
            aeraVisble: false,
            areaValue: [],
            filterText: '',
            data: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            selectTrees: [],
            showTag: '全国'
        }
    },
    created() {
        this.areaValue = this.initArea
        this.$emit('areaValue', this.areaValue)
        if (this.thatValue && this.thatValue.length === 0) {
            this.getOptions()
        } else {
            this.data = this.thatValue
            this.filter_data()
        }
    },
    methods: {
        getOptions() {
            let self = this
            let data = {}
            revoke('/index.php?m=config&p=area', data).then(res => {
                if (res.code === 0) {
                    self.data = res.data
                    self.filter_data()
                }
            })
        },
        // 是否包含区选项适配
        filter_data() {
            let self = this
            if (!self.has_area) {
                let dataChildren = self.data[0].children
                for (let i in dataChildren) {
                    for (let t in dataChildren[i].children) {
                        delete dataChildren[i].children[t].children
                    }
                }
            }
        },
        // 地区选择删除
        delete_tag() {
            this.areaValue.splice(0, 1)
        },
        // 弹框显示
        select_area() {
            this.aeraVisble = true
        },
        // 复选确认
        confirmSelect() {
            this.formatData()
            this.aeraVisble = false
        },
        // 单选点击
        single_click(data) {
            this.aeraVisble = false
            this.showTag = data.name
            this.areaValue.length = 0
            this.areaValue.push(data.id)
        },
        // 数据结构处理
        formatData() {
            this.areaValue = this.$refs.tree_multiple.getCheckedKeys()
            if (this.areaValue.length === 0) {
                return false
            }
            let showTagId = this.areaValue[0]
            let showTagIdStr = this.areaValue[0].toString()
            let showTagIdStr_prov = this.areaValue[0].toString().substring(0, 2)
            let showTagIdStr_city = this.areaValue[0].toString().substring(0, 4)
            if (showTagIdStr.length === 1) {
                let province_index = this.data.find(
                    item => item.id === showTagId
                )
                this.showTag = province_index.name
            } else if (showTagIdStr.length === 2) {
                let province_index = this.data[0].children.find(
                    item => item.id === showTagId
                )
                this.showTag = province_index.name
            } else if (showTagIdStr.length === 4) {
                let province_index = this.data[0].children.find(
                    item => item.id === Number(showTagIdStr_prov)
                )
                province_index = province_index.children
                let city_index = province_index.find(
                    item => item.id === showTagId
                )
                this.showTag = city_index.name
            } else {
                let province_index = this.data[0].children.find(
                    item => item.id === Number(showTagIdStr_prov)
                )
                province_index = province_index.children
                let city_index = province_index.find(
                    item => item.id === Number(showTagIdStr_city)
                )
                city_index = city_index.children
                let aera_index = city_index.find(item => item.id === showTagId)
                this.showTag = aera_index.name
            }
        },
        // 搜索
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        }
    },
    watch: {
        // 监听选项变化
        areaValue(val) {
            this.areaValue = val
            this.$emit('areaValue', this.areaValue)
        },
        // 监听搜索内容变化
        filterText(val) {
            if (this.isMultiple) {
                this.$refs.tree_multiple.filter(val)
            } else {
                this.$refs.tree_single.filter(val)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.area-select {
    display: inline-block;
    // positon:relative;
    width: 150px;
    .area-select-input {
        position: absolute;
        width: 100%;
        max-width: 185px;
        line-height: normal;
        white-space: normal;
        z-index: 1;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }
}
.aera_select_tree_box {
    margin: 10px auto;
    min-height: 150px;
    max-height: 250px;
    overflow: auto;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
}
</style>
