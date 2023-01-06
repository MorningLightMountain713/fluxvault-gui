<template>
  <v-btn :color="color" @click="toggle()"> {{ title }} </v-btn>
</template>
<script>
export default {
  props: {
    title: String,
    active: Boolean,
  },
  data() {
    return {
      color: "green",
      isActive: this.active,
    };
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive;
      this.isActive ? (this.color = "green") : (this.color = "none");
      this.$emit("toggle")
    },
  },
};
</script>
