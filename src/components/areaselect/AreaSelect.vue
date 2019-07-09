<template>
    <div>
        <div class="area-select" @click="fuck2">
            <div class="area-select-input">
                <el-tag v-show="areaVal.length > 0" size="small" closable type="info" @close="fuck">{{options[areaVal[0]]}}</el-tag>
                <el-tag v-show="areaVal.length > 1" size="small" type="info">+{{areaVal.length - 1}}</el-tag>
            </div>
            <div class="el-input el-input--suffix is-focus">
                <input type="text" readonly="readonly" placeholder="" class="el-input__inner" style="height: 40px;">
            </div>
        </div>
        <el-dialog title="选择地区" :visible.sync="aeraVisble" width="40%">
            <el-transfer
                style="width:90%;margin:0 5%;"
                filterable
                filter-placeholder="请输入地区名"
                v-model="areaVal"
                :data="areaData">
            </el-transfer>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="aeraVisble = false">关 闭</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Areaselect',
    props: ['areaList'],
    data() {
        return {
            areaData: [],
            areaVal: [],
            options: {
                51: '四川省',
                5101: '成都市',
                510107: '武侯区',
                510104: '锦江区',
                510105: '青羊区',
                510106: '金牛区',
                510108: '成华区',
                510112: '龙泉驿区',
                510115: '温江区',
                510114: '新都区',
                510113: '青白江区',
                510116: '双流区',
                510117: '郫都区',
                510181: '都江堰市',
                510182: '彭州市',
                510183: '邛崃市',
                510184: '崇州市',
                512081: '简阳市',
                510121: '金堂县',
                510129: '大邑县',
                510131: '蒲江县',
                510132: '新津县',
                5103: '自贡市',
                510302: '自流井区',
                510303: '贡井区',
                510304: '大安区',
                510311: '沿滩区',
                510321: '荣县',
                510322: '富顺区',
                5104: '攀枝花市',
                5105: '泸州市',
                5106: '德阳市',
                5107: '绵阳市',
                5108: '广元市',
                5109: '遂宁市',
                5110: '内江市',
                511001: '市辖区',
                511002: '市中区',
                511011: '东兴区',
                511024: '威远县',
                511025: '资中县',
                511028: '隆昌市',
                5111: '乐山市',
                5113: '南充市',
                5114: '眉山市',
                5115: '宜宾市',
                5116: '广安市',
                5117: '达州市',
                5118: '雅安市',
                5119: '巴中市',
                5120: '资阳市',
                52: '贵州省',
                5201: '贵阳市',
                5202: '六盘水市',
                5203: '遵义市',
                5204: '安顺市',
                5222: '铜仁地区',
                5223: '黔西南州',
                5224: '毕节地区',
                5226: '黔东南苗族侗族自治州',
                5227: '黔南布依族苗族自治州',
                34: '安徽省',
                3401: '合肥市',
                340101: '市辖区',
                340102: '瑶海区',
                340103: '庐阳区',
                340104: '蜀山区',
                340111: '包河区',
                340121: '长丰县',
                340122: '肥东县',
                340123: '肥西县',
                3402: '芜湖市',
                3403: '蚌埠市',
                340301: '市辖区',
                340302: '龙子湖区',
                340303: '蚌山区',
                340304: '禹会区',
                340311: '淮上区',
                340321: '怀远县',
                340322: '五河县',
                340323: '固镇县',
                3404: '淮南市',
                3405: '马鞍山市',
                3406: '淮北市',
                3407: '铜陵市',
                3408: '安庆市',
                3410: '黄山市',
                3411: '滁州市',
                3412: '阜阳市',
                341201: '市辖区',
                341202: '颍州区',
                341203: '颍东区',
                341204: '颍泉区',
                341221: '临泉县',
                341222: '太和县',
                341225: '阜南县',
                341226: '颍上县',
                341282: '界首市',
                3413: '宿州市',
                3414: '巢湖市',
                3415: '六安市',
                3416: '亳州市',
                3417: '池州市',
                3418: '宣城市'
            },
            aeraVisble: false,
            areaValue: []
        };
    },
    created() {
        this.getAreaOption();
    },
    methods: {
        getAreaOption() {
            let data = [];
            for (let i in this.options) {
                data.push({
                    label: this.options[i],
                    key: i
                });
            }
            this.areaData = data;
        },
        // 地区选择
        fuck() {
            this.areaVal.splice(0, 1);
        },
        fuck2() {
            this.aeraVisble = true;
        },
        closeDialog() {
            this.aeraVisble = false;
        }
    },
    watch: {
        areaVal(val) {
            this.areaValue = val;
            this.$emit('areaValue', this.areaValue);
        }
    }
};
</script>

<style lang="scss" scoped>
.area-select {
    display:inline-block;
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
</style>

