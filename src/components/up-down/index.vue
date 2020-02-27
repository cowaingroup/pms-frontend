<template>
  <div class="number-btn">
    <el-input v-model="itemTargetNum" @change="handleChange(index, ind,itemNum)" width="150px;"></el-input>
    <el-button class="add" @click="numberHanlde(itemTargetNum, index, ind,itemNum, 'add')">
      <i class="el-icon-arrow-up"></i>
    </el-button>
    <el-button class="sub" :disabled="itemTargetNum === 0" @click="numberHanlde(itemTargetNum, index, ind,itemNum, 'sub')">
      <i class="el-icon-arrow-down"></i>
    </el-button>
  </div>
</template>

<script>
    export default {
      name: "index",
      props:['list','index','ind','itemNum'],
      data () {
        return {
          itemTargetNum: 0,
        }
      },
      methods:{
        // 设置收货数量
        handleChange (index, ind, itemNum) {
          let total = 0
          console.log(this.list)
          this.list.map(item => {
            total += parseInt(item.itemTargetNum)
          })
          console.log(total)
          console.log(itemNum)
          if (total > itemNum) {
            this.$nextTick(() => {
              this.itemTargetNum = itemNum - this.itemTargetNum
            })
          }
        },
        numberHanlde (value, index, ind, itemNum, type) {
          let total = 0
          this.dataList[index].list.map(item => {
            total += parseInt(item.itemTargetNum)
          })
          if (type === 'add') {
            if (total >= itemNum) {
              this.$message({message: '收货数量不能大于应入库数量！', type: 'warning'})
            } else {
              this.dataList[index].list[ind].itemTargetNum = this.dataList[index].list[ind].itemTargetNum + 1
            }
          } else if (type === 'sub') {
            if (value > 0) {
              this.dataList[index].list[ind].itemTargetNum = this.dataList[index].list[ind].itemTargetNum - 1
            }
          }
        },
      }
    }
</script>

<style lang="scss">
  .number-btn {
    position: relative;
    .el-button--medium{
      padding: 1px 20px
    }
    .add {
      position: absolute;
      right: 0;
      top: 0;
      border-radius: 4px 4px 0 0;
    }
    .sub {
      position: absolute;
      right: 0;
      bottom: 0;
      border-radius: 0 0 4px 4px;
    }
  }
</style>
