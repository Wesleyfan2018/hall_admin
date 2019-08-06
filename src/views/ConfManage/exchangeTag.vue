<template>
    <div class="app-containei">
         <div class="filter-container">
           <el-form :inline="false" class="demo-form-inline">
                <el-form label-position="right" label-width="120px" :model="selectData">
                    <el-form-item label="兑换商城tag配置"></el-form-item>
                    <el-form-item label="开放状态">
                      <el-radio v-model="selectData.is_open" label="1" key="1">开放</el-radio>
                      <el-radio v-model="selectData.is_open" label="0" key="0">关闭</el-radio>
                    </el-form-item>
                    <el-form-item label="url:">
                        <el-input class="form-input"  v-model="selectData.url"></el-input>
                    </el-form-item>
                    <el-form-item label="record:">
                        <el-input class="form-input"  v-model="selectData.record"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" class="demo-form-inline" label-width="120px"  v-for="(item,i) of tags" v-model="tags[i]" :key="i">
                  <el-form-item label="名称:">
                      <el-input class="form-input-min"  v-model="tags[i]['name']"></el-input>
                  </el-form-item>
                  <el-form-item label="图标:">
                      <el-input class="form-input-max"  v-model="tags[i]['icon']"></el-input>
                  </el-form-item>
                   <el-image style="width: 48px; height: 48px" :src="tags[i]['icon']"  :alt="tags[i]['icon']"></el-image>
                  <el-form-item label="状态">
                    <el-select v-model="tags[i]['state']" placeholder="请选择" class="form-input-min" >
                      <el-option
                        v-for="item in stateOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" v-if='i==0' style="margin-left:6px;">
                    <i class="el-icon-circle-plus-outline" label-position="right" @click="addTag();" ></i>
                  </el-form-item>
                  <el-form-item label="" style="margin-left:5px;">
                    <i class="el-icon-remove-outline" label-position="right" @click="reTag(i);" ></i>
                  </el-form-item>
                </el-form>
                  <el-form :inline="true" class="demo-form-inline" label-width="120px" style="margin-left:70px;">
                        <el-button type="success" @click="confirEdit">更新</el-button>
                        <el-button type="success" >发布申请</el-button>
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
            tags: [{ 'add': true, 'name': '', 'icon': '', 'state': 2 }],
            id: 0,
            stateOption: [{ 'label': '开启', 'value': 1 }, { 'label': '暂未开放', 'value': 2 }, { 'label': '敬请期待', 'value': 3 }],
            selectData: {
                url: '',
                record: '',
                is_open: '0',
                items: [],
            },
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        addTag() {
            this.tags.push({ 'name': '', 'icon': '', 'state': 2 });
        },
        reTag(i) {
            this.tags.splice(i, 1);
        },
        CheckValid() {
            if (this.selectData.url === '') {
                this.$message.error('url不能为空！');
                return false;
            }
            if (this.selectData.record === '') {
                this.$message.error('record不能为空！');
                return false;
            }
            if (this.selectData.is_open === '') {
                this.$message.error('开放状态必选！');
                return false;
            }

            for (let i = 0; i < this.tags.length; i++) {
                if (this.tags[i].name === '') {
                    this.$message.error('tag名称不能为空');
                    return false;
                }
                if (this.tags[i].icon === '') {
                    this.$message.error('tag图标不能为空');
                    return false;
                }
            }



            return true;
        },
        confirEdit() {
            // 检测默认值
            if (this.CheckValid() === false) {
                return false;
            }
            this.selectData.items = [];
            this.tags.forEach((item, index, array) => {
                this.selectData.items.push({ 'name': item.name, 'state': item.state, 'icon_url': item.icon, 'icon_x': 0, 'icon_y': 0, 'page_id': index + 1 });
            });
            let data = {
                'id': this.id,
                'value': JSON.stringify(this.selectData)
            };
            console.log(data);
            revoke('/hall-admin-new/index.php?m=exchangetag&p=save', data).then(res => {
                if (res.code === 0) {
                    this.editVisble = false;
                    this.$message({
                        message: '编辑成功！',
                        type: 'success'
                    });
                    this.load();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
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