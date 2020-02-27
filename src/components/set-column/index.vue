<template>
  <div class="set-column">
    <i class="el-icon-setting site-sidebar-icon" v-popover:popover></i>
    <el-popover
      ref="popover"
      placement="bottom"
      title=""
      width="70"
      v-model="visible"
      trigger="click">
      <template>
        <el-checkbox-group v-model="column">
          <el-checkbox class="popover" v-for="(item, index) in columnData" :key="index" :label="item.name" name="type"></el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" size="mini" @click="setColumn">确定</el-button>
        <el-button type="primary" size="mini" @click="setClear">重置</el-button>
      </template>
    </el-popover>
  </div>
</template>

<script>
    export default {
      name: "index",
      props: {
        columnList: {
          type: Array,
        }
      },
      data() {
        return {
          column: [],
          columnData: this.columnList,
          visible: false
        }
      },
      created() {
        this.columnList.map(item => {
          this.column.push(item.name)
        })
        this.setColumn()
      },
      methods: {
        setColumn() {
          this.visible = false
          this.$emit('setCol', this.column)
        },
        setClear() {
          this.column = []
        }
      }
    }
</script>
<style>

</style>
<style lang="scss" scoped>
.set-column{
  position: absolute;
  top: 15px;
  right: 10px;
  z-index: 100;
  .site-sidebar-icon {
    font-size: 20px;
    color: #7ea1ca;
    font-weight: bold;
    cursor: pointer;
  }
}
.popover {
  margin-bottom: 10px;
  margin-left: 0;
  width: 150px;
}
</style>
