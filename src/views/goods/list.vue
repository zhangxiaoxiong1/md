<template>
  <div>
    <el-table :data="get_GoodsList" border>
      <el-table-column  prop="id" label="商品编号"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称" ></el-table-column>
      <el-table-column prop="price" label="商品价格"></el-table-column>
      <el-table-column prop="market_price" label="市场价格" ></el-table-column>
      <el-table-column label="图片" width="220">
        <template slot-scope="item">
          <div>
            <img class="uploadImg" :src="item.row.img? uploadHttp+item.row.img : ''" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否新品">
        <template slot-scope="item">
          <el-tag v-if="item.row.isnew ==1" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否热卖">
        <template slot-scope="item">
          <el-tag v-if="item.row.ishot ==1" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="item">
          <el-tag v-if="item.row.status ==1" type="success">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="item">
          <el-button type="primary" @click="update(item.row.id)" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="del(item.row.id)" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页视图 
      background	是否为分页按钮添加背景色
      total	总条目数
      page-size	每页显示条目个数，支持 .sync 修饰符
      current-change	currentPage 改变时会触发
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageInfo.size"
      @current-change="getChange"
      @prev-click="prevInfo"
      @next-click="nextInfo"
    ></el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
//调用接口
import {
  getGoodsDel,
  getGoodsCount,
  getGoodsAdd,
  getGoodsEdit,
} from "../../util/axios";
export default {
  data() {
    return {
      total: 0, //总条数
      pageInfo: {
        //分页的信息
        size: 2, //查询条数
        page: 1, //页码数
      },
      changePage: 1,
    };
  },
  mounted() {
    //页面一加载调取总条数
    this.getCount();
    this.getGoodsListAction(this.pageInfo);
  },
  computed: {
    ...mapGetters(["get_GoodsList"]),
  },
  methods: {
    ...mapActions(["getGoodsListAction"]),
    //点击编辑按钮传id
    update(id) {
      this.$emit("update", {
        id,
        isAdd: false,
        changePage: this.changePage,
      });
    },
    //删除数据
    del(id) {
      this.$confirm("确定要删除该数据吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调取删除接口
          getGoodsDel({ id }).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              //重新调取列表接口
              this.getCount();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //获取总条数
    getCount() {
      console.log("被add调取111111");
      getGoodsCount().then((res) => {
        if (res.code === 200) {
          console.log(res, "总条数");
          this.total = res.list[0].total;
          //逻辑判断
          //首先判断数组是不是只有一条数据并且它并不是第一页，如果是 page页面--
          if (this.pageInfo.page != 1 && this.get_GoodsList.length == 1) {
            this.pageInfo.page--;
          }
          //重新调取列表
          this.getGoodsListAction(this.pageInfo);
        }
      });
    },
    //当页面发生变化的时候会调用当前方法
    getChange(n) {
      console.log(n, "当前的页面");
      this.pageInfo.page = n;
      this.changePage = n;
      //重新调取列表
      this.getGoodsListAction(this.pageInfo);
    },
    //上一页事件
    prevInfo(n) {
      console.log(n, "当前页");
      this.pageInfo.page = n;
      this.changePage = n;
      //重新调取列表
      this.getGoodsListAction(this.pageInfo);
    },
    //下一页事件
    nextInfo(n) {
      console.log(n, "当前页");
      this.pageInfo.page = n;
      this.changePage = n;
      //重新调取列表
      this.getGoodsListAction(this.pageInfo);
    },
  },
};

/* size 当天显示条数   page 页码

总数 18条数据  每页显示10 
页码2

第一次调取接口  size：10 
              page:1
后端返回前10条

点击第二页 
  size：10
  page：2
后端再返回十条，如果不够 都返回了 返回8条 */
</script>

<style  lang="" scoped>
.el-pagination {
  float: right;
  margin: 16px 0;
}
.uploadImg{
  width: 200px;
  height: 200px;
}
</style>


