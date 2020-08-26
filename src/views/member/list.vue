<template>
  <div>
    <el-table :data="get_MemberList" border>
      <el-table-column prop="uid" label="会员编号" width="180"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="item">
          <el-tag v-if="item.row.status ==1" type="success">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="item">
          <el-button type="primary" @click="edit(item.row.id)" icon="el-icon-edit" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  mounted() {
    //页面一加载就获取会员列表
    this.getMemberListAction();
  },
  computed: {
    ...mapGetters(["get_MemberList"]),
  },
  methods: {
    //封装获取会员列表
    ...mapActions(["getMemberListAction"]),
    //获取当前数据的id
    edit(uid) {
      this.$emit("edit", {
        isAdd: false,
        uid,
      });
    },
  },
};
</script>

<style  lang="" scoped>
</style>
