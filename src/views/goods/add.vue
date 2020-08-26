<template>
  <div>
    <el-dialog
      :before-close="reset"
      :title="isShow.isAdd?'添加商品管理':'编辑商品管理'"
      :visible.sync="isShow.dialogShow"
      center
      @opened="createEditor"
      width="64%"
    >
      <el-form :model="goodsForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="first_cateid" label="一级分类：" :label-width="formLabelWidth">
          <el-select v-model="goodsForm.first_cateid" @change="changeFristId()">
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
          <el-select v-model="goodsForm.second_cateid">
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
        <el-form-item prop="goodsname" label="商品名称：" :label-width="formLabelWidth">
          <el-input v-model="goodsForm.goodsname"></el-input>
        </el-form-item>
        <el-form-item prop="price" label="商品价格：" :label-width="formLabelWidth">
          <el-input v-model="goodsForm.price"></el-input>
        </el-form-item>
        <el-form-item prop="market_price" label="市场价格：" :label-width="formLabelWidth">
          <el-input v-model="goodsForm.market_price"></el-input>
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
        <el-form-item prop="specsid" label="商品规格：" :label-width="formLabelWidth">
          <el-select v-model="goodsForm.specsid" @change="changeSpecsId()">
            <option value label="请选择" disabled></option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in get_SpecsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="specsattr" label="规格属性：" :label-width="formLabelWidth">
          <!-- multiple 是否多选 -->
          <el-select v-model="goodsForm.specsattr" multiple>
            <option value label="请选择" disabled></option>
            <!-- 动态数据 -->
            <el-option v-for="item in specsAttrs" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" :label-width="formLabelWidth">
          <el-radio v-model="goodsForm.isnew" :label="1">是</el-radio>
          <el-radio v-model="goodsForm.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖" :label-width="formLabelWidth">
          <el-radio v-model="goodsForm.ishot" :label="1">是</el-radio>
          <el-radio v-model="goodsForm.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch
            v-model="goodsForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <div id="editor"></div>
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
//引入富文本编辑器
import E from "wangeditor";
import { mapGetters, mapActions } from "vuex";
//引入接口
import { getGoodsAdd, getGoodsInfo, getGoodsEdit } from "../../util/axios";
export default {
  data() {
    return {
      editor: null, //富文本标识
      secondCate: [], //二级分类
      specsAttrs: [], //规格属性
      //图片的一些配置
      imgUrl: "", //长传图片的地址
      fileList: [], //文件上传列表数组
      dialogVisible: false, //是否打开图片弹框
      dialogImageUrl: "", //图片地址
      editId: 0,
      changePage: 1,
      formLabelWidth: "120px", //lable宽度
      goodsForm: {
        first_cateid: "", //一级分类编号
        second_cateid: "", //二级分类编号
        goodsname: "", //商品名称
        price: "", //商品价格
        market_price: "", //市场价格
        img: "", //商品图片（文件）
        description: "", //商品描述
        specsid: "", //商品管理编号
        specsattr: "", //商品管理属性
        isnew: 1, //是否新品     1-是 2-否
        ishot: 1, //是否热卖推荐 1-是 2-否
        status: 1, //1正常2禁用
      },
      rules: {
        first_cateid: [
          //代表加红色星标
          { required: true, message: "请选择一级分类", trigger: "change" },
        ],
        second_cateid: [
          //代表加红色星标
          { required: true, message: "请选择二级分类", trigger: "change" },
        ],
        goodsname: [
          //代表加红色星标
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        price: [
          //代表加红色星标
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        market_price: [
          //代表加红色星标
          { required: true, message: "请输入市场价格", trigger: "blur" },
        ],
        specsid: [
          //代表加红色星标
          { required: true, message: "请选择商品规格", trigger: "change" },
        ],
        specsattr: [
          //代表加红色星标
          { required: true, message: "请选择规格属性", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    //获取分类列表
    this.getCateListAction();
    //获取规格列表
    this.getSpecsListAction();
  },
  computed: {
    ...mapGetters(["get_CateList", "get_SpecsList"]),
  },
  props: ["isShow"],
  methods: {
    //创建富文本编辑器
    createEditor() {
      //创建打开富文本编辑器
      //实例化
      this.editor = new E("#editor");
      console.log(this.editor, "实例化结果");
      //创建
      this.editor.create();
      //描述信息赋值
      this.editor.txt.html(this.goodsForm.description);
    },
    //选择一级分类触发事件
    changeFristId(n) {
      console.log(n, "888");
      //  let index = this.get_CateList.findIndex((item)=>{
      //     console.log(item,'item111')
      //     return item.id == n
      //   })
      //超找你选择的id在数组中匹配出的索引下标
      let index = this.get_CateList.findIndex(
        (item) => item.id == this.goodsForm.first_cateid
      );
      this.secondCate = this.get_CateList[index].children;
      //如果参数n 不是true 清空双向数据绑定
      if (!n) {
        this.goodsForm.second_cateid = "";
      }
    },
    //选择规格触发规格属性
    changeSpecsId(n) {
      let index = this.get_SpecsList.findIndex(
        (item) => item.id == this.goodsForm.specsid
      );
      this.specsAttrs = this.get_SpecsList[index].attrs;
      console.log(this.specsAttrs, "规格属性");
      if (!n) {
        this.goodsForm.specsattr = [];
      }
    },
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
      this.goodsForm = {
        first_cateid: "", //一级分类编号
        second_cateid: "", //二级分类编号
        goodsname: "", //商品名称
        price: "", //商品价格
        market_price: "", //市场价格
        img: "", //商品图片（文件）
        description: "", //商品描述
        specsid: "", //商品管理编号
        specsattr: "", //商品管理属性
        isnew: 1, //是否新品     1-是 2-否
        ishot: 1, //是否热卖推荐 1-是 2-否
        status: 1, //1正常2禁用
      };
      this.specsArr = [
        {
          value: "",
        },
      ];
      //清空富文本编辑器
      this.editor.txt.html("");
      //重置文件上传列表
      this.fileList = [];
      //子组件去修改父组件的弹框状态
      this.$emit("closeDialog", false);
    },
    //触发列表的调取
    ...mapActions([
      "getCateListAction",
      "getSpecsListAction",
      "getGoodsListAction",
    ]),
    //点击弹框获取一条数据
    update(id, changePage) {
      this.editId = id;
      this.changePage = changePage;
      getGoodsInfo({ id }).then((res) => {
        if (res.code === 200) {
          console.log(res, "一条数据");
          this.goodsForm = res.list;
          this.goodsForm.specsattr = this.goodsForm.specsattr
            ? this.goodsForm.specsattr.split(",")
            : [];
          //对图片进行二次转化
          this.fileList = this.goodsForm.img
            ? [{ url: `${this.uploadHttp}${this.goodsForm.img}` }]
            : [];
          //数据二次转化 电泳一级的change事件。不让二级置空
          this.changeFristId(true);
          this.changeSpecsId(true);
        }
      });
    },
    //添加表单事件
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //调取接口
          //后端要的格式'1,2,3' '[1,2,3]'
          this.goodsForm.specsattr = this.goodsForm.specsattr
            ? this.goodsForm.specsattr.join(",")
            : [];
          //商品描述
          this.goodsForm.description = this.editor.txt.html();
          //调用FormData
          let data = this.goodsForm;
          let file = new FormData();
          for (let i in data) {
            file.append(i, data[i]);
          }
          //是否调取新增事件还是编辑事件
          if (this.isShow.isAdd) {
            //整理imgUrl
            file.append("img", this.imgUrl);
            //调取添加接口
            getGoodsAdd(file).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                //关闭弹框并清空
                this.reset();
                //重新调取列表
                this.isShow.getCount();
              }
            });
          } else {
            //id用户编号，必填项  对数据进行编辑
            file.append('id',this.editId)
            // //调取添加接口
            getGoodsEdit(file).then((res) => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                //关闭弹框并清空
                this.reset();
                //重新调取列表
                this.getGoodsListAction({
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
