<template>
  <v-app class="ma-0 pa-0">
    <MainComp/>
  </v-app>
</template>
<script>
// @ is an alias to /src
import MainComp from '@/components/MainComp.vue'

export default {
  name: 'Home',
  components: {
    MainComp
  }
}
</script>
