<template>
  <v-card
    ><v-card-title>{{ address }}</v-card-title>
    <v-card-text v-for="(value, key, index) in data" :key="index"
      >{{ key }} {{ value }}</v-card-text
    >
  </v-card>
</template>
<script>
export default {
  props: {
    address: String,
    data: Object,
  },
  mounted() {
    console.log("In agent comp", this.data);
    console.log("Address", this.address);
  },
  data() {
    return {
      name: "",
    };
  },
};
</script>
