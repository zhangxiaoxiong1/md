<template>
  <div>
    <el-dialog
      :before-close="reset"
      :title="isShow.isAdd?'添加限时秒杀':'编辑限时秒杀'"
      :visible.sync="isShow.dialogShow"
      center
    >
      <el-form :model="seckForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="title" label="活动名称：" :label-width="formLabelWidth">
          <el-input v-model="seckForm.title"></el-input>
        </el-form-item>
        <el-form-item label="活动期限：" :label-width="formLabelWidth">
          <el-date-picker
            v-model="timer"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="first_cateid" label="一级分类：" :label-width="formLabelWidth">
          <el-select v-model="seckForm.first_cateid" @change="changeFristId()">
            <option value label disabled>---请选择---</option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in get_CateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="second_cateid" label="二级分类：" :label-width="formLabelWidth">
          <el-select v-model="seckForm.second_cateid" @change="changeGoods()">
            <option value label="请选择" disabled></option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in secondCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsid" label="商品：" :label-width="formLabelWidth">
          <el-select v-model="seckForm.goodsid">
            <option value label="请选择" disabled></option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in goodsArr"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch
            v-model="seckForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset">取 消</el-button>
        <el-button type="primary" @click="add('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
//引入接口
import {
  getGoodsList,
  getSeckAdd,
  getSeckInfo,
  getSeckEdit,
} from "../../util/axios";
export default {
  data() {
    return {
      timer: "",
      editId: 0,
      formLabelWidth: "120px", //lable宽度
      seckForm: {
        title: "", //限时秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: 1,
      },
      secondCate: [], //二级分类
      goodsArr: [], //商品数组
      rules: {
        title: [
          //代表加红色星标
          { required: true, message: "请输入限时秒杀名称", trigger: "blur" },
          //验证字符数
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    //获取限时秒杀列表
    this.getCateListAction();
  },
  computed: {
    ...mapGetters(["get_CateList"]),
  },
  props: ["isShow"],
  methods: {
    //选择一级分类触发事件
    changeFristId(n) {
      //超找你选择的id在数组中匹配出的索引下标
      let index = this.get_CateList.findIndex(
        (item) => item.id == this.seckForm.first_cateid
      );
      this.secondCate = this.get_CateList[index].children;
      //如果参数n 不是true 清空双向数据绑定（切断的是一级和二级还有三级的联动）
      if (!n) {
        this.seckForm.second_cateid = "";
        this.seckForm.goodsid = "";
      }
    },
    //选择二级之联动渲染渲染商品列表
    changeGoods(n) {
      getGoodsList({
        fid: this.seckForm.first_cateid,
        sid: this.seckForm.second_cateid,
      }).then((res) => {
        if (res.code === 200) {
          this.goodsArr = res.list;
        }
      });
      //如果参数n 不是true 清空双向数据绑定(切断的是二级和三级的联动)
      if (!n) {
        this.seckForm.goodsid = "";
      }
    },
    reset() {
      //清空表单信息
      this.seckForm = {
        title: "", //限时秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: 1,
      };
      //重置日期插件
      this.timer = [];
      //子组件去修改父组件的弹框状态
      this.$emit("closeDialog", false);
    },
    //触发菜单列表的调取
    ...mapActions(["getCateListAction", "getSeckListAction"]),
    //点击弹框获取一条数据
    update(id) {
      this.editId = id;
      getSeckInfo({ id }).then((res) => {
        if (res.code === 200) {
          console.log(res, "一条数据");
          this.seckForm = res.list;
          //对图片进行二次转化
          this.timer = [
            new Date(parseFloat(this.seckForm.begintime)),
            new Date(parseFloat(this.seckForm.endtime)),
          ];
          this.changeFristId(true);
          this.changeGoods(true);
        }
      });
    },
    //添加表单事件
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //调取接口
          //后端接收的参数是时间戳
          //参数二次转化
          //开始时间
          this.seckForm.begintime = new Date(this.timer[0]).getTime();
          //结束时间
          this.seckForm.endtime = new Date(this.timer[1]).getTime();
          //是否调取新增事件还是编辑事件
          if (this.isShow.isAdd) {
            //调取添加接口
            getSeckAdd(this.seckForm).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                //关闭弹框并清空
                this.reset();
                //重新调取列表
                this.getSeckListAction();
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            //id编号，必填项  对数据进行编辑
            this.seckForm.id = this.editId
            // //调取添加接口
            getSeckEdit(this.seckForm).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                //关闭弹框并清空
                this.reset();
                //重新调取列表
                this.getSeckListAction();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style  lang="" scoped>
</style>
