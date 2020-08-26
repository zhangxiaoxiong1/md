<template>
  <div>
    <el-dialog :before-close="reset" title="编辑会员" :visible.sync="isShow.dialogShow" center>
      <el-form :model="memberForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="phone" label="手机号:" :label-width="formLabelWidth">
          <el-input v-model="memberForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="nickname" label="昵称:" :label-width="formLabelWidth">
          <el-input v-model="memberForm.nickname"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码:" :label-width="formLabelWidth">
          <el-input v-model="memberForm.password"></el-input>
        </el-form-item>

        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch
            v-model="memberForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset">取 消</el-button>
        <el-button @click="add('ruleForm')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getMemberInfo, getMemberEdit } from "../../util/axios";
export default {
  props: ["isShow"],
  computed: {
    ...mapGetters(["get_MemberList"]),
  },
  data() {
    return {
      editId: 0,
      formLabelWidth: "120px", //lable宽度
      memberForm: {
        nickname: "", //昵称
        phone: "", //手机号
        password: "", //密码
        status: 1,
      },
      //表单验证（根据产品需求制定）
      rules: {
        nickname: [
          //代表加红色星标
          { required: true, message: "请输入会员名称", trigger: "blur" },
        ],
        phone: [
          //代表加红色星标
          { required: true, message: "请输入会员手机号", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //编辑事件
    update(uid) {
      //赋值 给调取编辑接口用
      this.editId = uid;
      //更改isAdd状态
      this.isAdd = false;
      getMemberInfo({ uid }).then((res) => {
        if (res.code == 200) {
          this.MemberForm = res.list;
        }
      });
    },
    //调取行动
    ...mapActions(["getMemberListAction"]),
    //关闭弹框事件
    //封装一个清空事件
    reset() {
      //方法一
      this.memberForm= {
        nickname: "", //昵称
        phone: "", //手机号
        password: "", //密码
        status: 1,
      },
      //子组件关闭弹框要去修改父组件dialogShow这个数据
      this.$emit("closeDialog", false);
    },
    //编辑表单事件
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //调取接口
          //id编号，必填项  对数据进行编辑
            this.memberForm.uid = this.editId;
            //调取添加接口
            getMemberEdit(this.memberForm).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                //关闭弹框并清空
                this.reset();
                //重新调取列表
                this.getMemberListAction();
              }
            });
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
