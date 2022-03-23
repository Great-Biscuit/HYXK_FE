<template>
  <el-card>
    {{postVo.post.title}}
  </el-card>
</template>

<script>

export default {
  name: 'PostIntro',
  props: [
    'postVo'
  ],
  components: {
    
  },
  data () {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
.el-card {
  width: 100%;
  padding: 0;
}
.el-card >>> .el-card__body {
  padding: 0;
  height: 100%;
}

</style>
