<template>
  <div>
    <el-dialog
      :before-close="reset"
      :title="isShow.isAdd?'添加商品规格':'编辑商品规格'"
      :visible.sync="isShow.dialogShow"
      center
    >
      <el-form :model="specsForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="specsname" label="规格名称：" :label-width="formLabelWidth">
          <el-input v-model="specsForm.specsname"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          v-for="(item, index) in specsArr"
          label="规格属性:"
          :key="index"
        >
          <el-input style="width:70%" v-model="item.value"></el-input>
          <el-button v-if="index==0" @click="addSpecs(item)" type="primary">新增规格属性</el-button>
          <el-button v-else @click="delSpecs(item)">删除</el-button>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch
            v-model="specsForm.status"
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
import { getSpecsAdd, getSpecsInfo, getSpecsEdit } from "../../util/axios";
export default {
  data() {
    return {
      specsArr: [
        {
          value: "",
        },
      ], //规格属性
      editId: 0,
      changePage: 1,
      formLabelWidth: "120px", //lable宽度
      specsForm: {
        specsname: "", //商品规格名称
        attrs: "", //商品规格属性值
        status: 1,
      },
      rules: {
        specsname: [
          //代表加红色星标
          { required: true, message: "请输入商品规格名称", trigger: "blur" },
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
    //获取角色列表
    this.getRoleListAction();
    console.log(this.isShow, "父组件传递的内容");
  },
  computed: {
    ...mapGetters(["get_RoleList"]),
  },
  props: ["isShow"],
  methods: {
    //添加规格属性
    addSpecs(item) {
      //判断
      if (this.specsArr.length <= 6) {
        this.specsArr.push({
          value: "",
        });
      } else {
        this.$message.warning("最多只能添加6个");
      }
    },
    //删除规格属性
    delSpecs(item) {
      let index = this.specsArr.indexOf(item);
      if (index !== -1) {
        this.specsArr.splice(index, 1);
      }
    },
    reset() {
      //清空表单信息
      this.specsForm = {
        specsname: "", //商品规格名称
        attrs: "", //商品规格属性值
        status: 1,
      };
      this.specsArr = [
        {
          value: "",
        },
      ];
      //子组件去修改父组件的弹框状态
      this.$emit("closeDialog", false);
    },
    //触发菜单列表的调取
    ...mapActions(["getRoleListAction", "getSpecsListAction"]),
    //点击弹框获取一条数据
    update(id, changePage) {
      this.editId = id;
      this.changePage = changePage;
      getSpecsInfo({ id }).then((res) => {
        if (res.code === 200) {
          console.log(res, "一条数据");
          this.specsForm = res.list[0];
          //数据二次转化==规格属性
          this.specsForm.attrs.map((item, index) => {
            console.log(item, "每一项");
            if (index == 0) {
              this.specsArr[0].value = item;
            } else {
              this.specsArr.push({
                value: item,
              });
            }
          });
        }
      });
    },
    //添加表单事件
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //调取接口
          // let arr = this.specsArr.map(item=>{
          //   return item.value
          // })
          let arr = this.specsArr.map((item) => item.value);
          this.specsForm.attrs = arr ? arr.join(",") : "";
          //是否调取新增事件还是编辑事件
          if (this.isShow.isAdd) {
            //调取添加接口
            getSpecsAdd(this.specsForm).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                //关闭弹框并清空
                this.reset();
                //重新调取列表
                //添加成功之后有两个要重新获取，第一个列表，第二个是分页
                /*                 两种方式：
                一、把list中getCount这个方法 重新封装一下
                二、list中这个方法 通过ref传到index中,在打开弹框的时候，把它传值给add，在add中用props接收，this.isShow就有值 */
                this.isShow.getCount();
                // this.getSpecsListAction({
                //   size:2,
                //   page:1
                // });
              }
            });
          } else {
            //id用户编号，必填项  对数据进行编辑
            this.specsForm.id = this.editId;
            // //调取添加接口
            getSpecsEdit(this.specsForm).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                //关闭弹框并清空
                this.reset();
                //重新调取列表
                this.getSpecsListAction({
                  size: 2,
                  page: this.changePage,
                });
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
