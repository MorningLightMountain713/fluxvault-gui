<template>
  <vue-draggable-resizable @dragging="onDrag" :resizable="false" :z="1000" class="ma-0 pa-0" :parent="true" :w="137"
    :h="36">
    <v-btn :color="scrollColor" @click="toggleScroll()"> AutoScroll </v-btn>
  </vue-draggable-resizable>
</template>
<script>
import VueDraggableResizable from "vue-draggable-resizable";

export default {
  data() {
    return {
      dragging: false,
      followScroll: true,
      scrollColor: "green",
    };
  },
  methods: {
    onDrag() {
      this.dragging = true;
    },
    toggleScroll() {
      if (!this.dragging) {
        this.followScroll = !this.followScroll;
        this.followScroll ? (this.scrollColor = "green") : (this.scrollColor = "none");
        this.$emit("toggled");
      }
      this.dragging = false;
    },
  },
};
</script>
<style scoped lang="scss">
.vdr {
  border: none;
}
</style>
