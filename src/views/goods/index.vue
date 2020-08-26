<template>
  <div>
    <el-bread></el-bread>
    <div>
      <el-button @click="openDialog" type="primary" size="mini" plain>添加</el-button>
    </div>
    <!-- table 表格渲染 -->
    <el-goods ref='elGoods' @update='update'></el-goods>
    <!-- 弹框的渲染 -->
    <v-add ref='vAdd' :isShow="sonStatus" @closeDialog="closeDialog"></v-add>
  </div>
</template>

<script>
import elBread from "../../components/elBread";
import elGoods from "./list";
import vAdd from "./add";
export default {
  data() {
    return {
      sonStatus: {
        isAdd: true, //是否是添加
        dialogShow: false, //控制对话框的显示隐藏
      },
    };
  },
  components: {
    elBread,
    elGoods,
    vAdd,
  },
  methods: {
    //打开弹框
    openDialog() {
      this.sonStatus.isAdd = true;
      this.sonStatus.dialogShow = true;
      this.sonStatus.getCount = this.$refs.elGoods.getCount
    },
    //关闭弹框
    //关闭弹框事件
    closeDialog(e) {
      this.sonStatus.dialogShow = e;
    },
    //update事件
    update(e){
      console.log(e,'页码')
        this.sonStatus.isAdd = e.isAdd
        this.sonStatus.dialogShow = true
        this.$refs.vAdd.update(e.id,e.changePage)
    }
  },
};
</script>

<style  lang="" scoped>
.el-button {
  margin-bottom: 15px;
}
</style>
