<template>
    <div class="app-containei">
         <div class="filter-container">
           <el-form :inline="false" class="demo-form-inline">
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="发布日志"></el-form-item>
                     <el-table :data="tableData" style="width: 100%">
                        <el-table-column prop="date" label="发布时间" width="180"></el-table-column>
                        <el-table-column prop="name" label="发布人" width="180"></el-table-column>
                        <el-table-column prop="address" label="配置"></el-table-column>
                     </el-table>
                </el-form>

            </el-form>
        </div>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';
export default {
    name: 'actor',
    data() {
        return {
            tableData: [{
                date: '2019-08-02',
                name: '王小虎',
                address: '..'
            }, {
                date: '2019-08-04',
                name: '王小虎',
                address: '..'
            }, {
                date: '2019-08-01',
                name: '王小虎',
                address: '..'
            }, {
                date: '2019-05-03',
                name: '王小虎',
                address: '..'
            }],

        };
    },
    mounted() {
        this.load();
    },
    methods: {
        load() {
            let data = {};
            revoke('/hall-admin-new/index.php?m=exchangetag&p=get', data).then(res => {
                if (res.code === 0) {
                    let jsArr = JSON.parse(res.data.info.value);
                    this.selectData = jsArr;
                    if (jsArr.items.length > 0) {
                        this.tags = [];
                        jsArr.items.forEach((item, index, array) => {
                            this.tags.push({ 'name': item.name, 'icon': item.icon_url, 'state': item.state });
                        });
                    }
                    this.id = res.data.info.id;
                }
            });
        },
    }
};
</script>

<style lang="scss" scoped>
.text-right {
    float: right;
}
.pagination {
    margin: 20px 0;
}
.nav-select {
    width: 100px;margin: 0 5px 10px 0;
}
.nav-input {
    width: 150px;margin: 0 5px 10px 0;
}
.dialog-form {
    margin: 20px;
}
.form-input {
    width:350px!important;
}
.form-input-max {
    width:450px!important;
}
.form-input-min {
  width: 100px!important;
}
</style>