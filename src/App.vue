<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
  /* chrome和safari */
  html::-webkit-scrollbar {
    display: none;
  }
  
  html {
    /* FireFox */
    scrollbar-width: none;
    /* IE */
    -ms-overflow-style: none;
  }
</style>
