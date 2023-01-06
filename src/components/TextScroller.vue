<template>
  <pre ref="scroller" class="body text-wrap" v-html="html"></pre>
</template>

<script>
export default {
  props: {
    html: String,
    followText: {
      default: true,
      type: Boolean,
    },
  },
  methods: {
    scrollToElement() {
    //   const [el] = this.$refs.scroller;
      this.$parent.$parent.scrollIntoView({ behavior: "smooth" });
    },
  },
  updated() {
    if (this.followText) {
      this.scrollToElement();
    }
  },
};
</script>
<style scoped lang="scss">
.body {
  text-align: left;
  background: black;
  height: calc(100% - 42px);
  font-size: 0.9em;
  line-height: 1.2em;
  color: #7afb4c;
  padding: 8px;
  overflow-y: scroll;
}
</style>
