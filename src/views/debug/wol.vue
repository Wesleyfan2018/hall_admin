<template>
    <div class="app-containei">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="远程开机">
                </el-form-item>

                 <el-table :data="hosts" style="width: 100%" >
                  <el-table-column  label="主机">
                        <template slot-scope="scope">
                            {{scope.row.name}}({{scope.row.ip}})
                        </template>
                  </el-table-column>

                  <el-table-column  prop="mac" label="mac地址">

                  </el-table-column>


                       <el-table-column  label="操作">
                          <template slot-scope="scope">
                        <el-button type="success" style="margin: 8px 0px 0px 0px" size="small" @click="wake(scope.row)">唤醒</el-button>
                     </template>
                  </el-table-column>
                </el-table>

            </el-form>
    </div>
</template>
<script>
import { revoke } from '@/api/getApi';

export default {
    data() {
        return {
            hosts: [{ 'mac': '48:4D:7E:C9:E4:05', 'ip': '192.168.6.221', 'name': '石山' }],
        };
    },
    methods: {
        wake(row) {
            let data = {
                mac: row.mac,
                ip: row.ip,
            };
            revoke('/index.php?m=debug&p=wake', data).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: '唤醒成功!',
                        type: 'success'
                    });
                } else {
                    this.$message.error(res.msg);
                }


            });
        },
    },

};
</script>