<template>
  <div>
    <el-dialog
      :before-close="reset"
      :title="isShow.isAdd?'添加轮播图':'编辑轮播图'"
      :visible.sync="isShow.dialogShow"
      center
    >
      <el-form :model="bannerForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="title" label="标题：" :label-width="formLabelWidth">
          <el-input v-model="bannerForm.title"></el-input>
        </el-form-item>
        <el-form-item prop="img" label="图片" :label-width="formLabelWidth">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-change="changeInfo"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch
            v-model="bannerForm.status"
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
import { mapActions } from "vuex";
//引入接口
import { getBannerAdd, getBannerInfo, getBannerEdit } from "../../util/axios";
export default {
  data() {
    return {
      //图片的一些配置
      imgUrl: "", //长传图片的地址
      fileList: [], //文件上传列表数组
      dialogVisible: false, //是否打开图片弹框
      dialogImageUrl: "", //图片地址
      editId: 0,
      formLabelWidth: "120px", //lable宽度
      bannerForm: {
        title: "", //轮播图名称
        img: "", //图片(文件，一般用于二级分类)
        status: 1,
      },
      rules: {
        title: [
          //代表加红色星标
          { required: true, message: "请输入轮播图标题", trigger: "blur" },
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
    //获取轮播图列表
    this.getBannerListAction();
  },
  props: ["isShow"],
  methods: {
    //图片移除时候的钩子函数
    handleRemove(file, fileList) {
      console.log(file, fileList, "移除触发的钩子函数");
    },
    //查看图片触发的钩子函数
    handlePreview(file) {
      console.log(file, "点击查看时候回调的钩子函数");
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //文件超出选择之后的提示
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    //当上传文件图片发生变化的时候触发的函数
    changeInfo(file) {
      console.log(file.raw, "文件详情");
      this.imgUrl = file.raw;
    },
    reset() {
      //清空表单信息
      this.bannerForm = {
        title: "", //轮播图名称
        img: "", //图片(文件，一般用于二级分类)
        status: 1,
      };
      //重置文件上传列表
      this.fileList = [];
      //移除表单验证信息
      this.$refs["ruleForm"].clearValidate(this.rules);
      //子组件去修改父组件的弹框状态
      this.$emit("closeDialog", false);
    },
    //触发菜单列表的调取
    ...mapActions(["getBannerListAction"]),
    //点击弹框获取一条数据
    update(id) {
      this.editId = id;
      getBannerInfo({ id }).then((res) => {
        if (res.code === 200) {
          this.bannerForm = res.list;
          //对图片进行二次转化
          this.fileList = this.bannerForm.img
            ? [{ url: `${this.uploadHttp}${this.bannerForm.img}` }]
            : [];
        }
      });
    },
    //添加表单事件
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = this.bannerForm;
          let file = new FormData();
          for (let i in data) {
            file.append(i, data[i]);
          }
          //转化
          file.append("img", this.imgUrl);
          //调取接口
          //是否调取新增事件还是编辑事件
          if (this.isShow.isAdd) {
            //调取添加接口
            getBannerAdd(file).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                //关闭弹框并清空
                this.reset();
                //重新调取列表
                this.getBannerListAction();
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            //id编号，必填项  对数据进行编辑
            file.append("id", this.editId);
            // //调取添加接口
            getBannerEdit(file).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                //关闭弹框并清空
                this.reset();
                //重新调取列表
                this.getBannerListAction();
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
