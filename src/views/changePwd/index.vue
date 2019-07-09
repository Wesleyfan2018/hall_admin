<template>
    <div class="mainbox">
        <el-row>
            <el-card shadow="always" class="box-card">
                <div class="text item">
                    <label for="userName">用户名</label>
                    <el-input
                        id="userName"
                        v-model="username"
                        :disabled="true">
                        </el-input>
                </div>
                <div class="text item">
                    <label for="role">角色</label>
                    <el-input
                        id="role"
                        v-model="role"
                        :disabled="true">
                        </el-input>
                </div>
                <div class="text item">
                    <label for="oldpwd">旧密码</label>
                    <el-input
                        id="oldpwd"
                        show-password
                        v-model="oldpwd">
                        </el-input>
                </div>
                <div class="text item">
                    <label for="newpwd">新密码</label>
                    <el-input
                        id="newpwd"
                        show-password
                        v-model="newpwd">
                        </el-input>
                </div>
                <div class="text item">
                    <el-button type="success" style="margin:0 auto;" @click="changePwd">确认修改</el-button>
                </div>
            </el-card>
        </el-row>
    </div>
</template>

<script>
import { revoke } from '@/api/getApi';
import { getStorageData } from '@/utils/auth';
import { setInterval } from 'timers';
export default {
    name: 'changePwd',
    data() {
        return {
            username: '',
            role: '',
            oldpwd: '',
            newpwd: ''
        };
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
            let userInfoStr = JSON.parse(getStorageData('userInfo'));
            this.username = userInfoStr.name;
            this.role = userInfoStr.role;
        },
        changePwd() {
            let data = {
                oldPwd: this.oldpwd,
                newPwd: this.newpwd
            };
            revoke('/hall-admin-new/index.php?m=user&p=changePwd', data).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: '密码修改成功！',
                        type: 'success'
                    });
                    setInterval(function() {
                        window.location.reload();
                    }, 500);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        goBack() {
            window.history.back();
        }
    }
};
</script>

<style lang="scss" scoped>
.header {
    padding: 20px 30px;
    font-size: 22px;
}
.mainbox {
    width: 100%;
    padding-top: 50px;
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    .text {
        display: inline-flex;
        align-items: center;
        width: 80%;
        margin: 0 10%;
        font-size: 16px;
        label {
            text-align: left;
            width: 90px;
            margin: 0 10px;
            line-height: 40px;
        }
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 480px;
    }
}
</style>

