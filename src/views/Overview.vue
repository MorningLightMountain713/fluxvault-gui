<template>
  <v-container fluid>
    <v-row align="center" style="height: 100vh">
      <v-col cols="6">
        <textarea v-if="currentFluxApplication != {}" rows="20" cols="85">
        {{ currentFluxApplication }}
        </textarea>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Agent from "@/components/Agent";
import { mapState } from "vuex";

export default {
  components: {
    Agent,
  },
  data() {
    return {};
  },
  computed: mapState(["currentFluxApplication"]),
  methods: {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
// * {
//     border: 1px solid black;
// }

// .vdr {
//   border: none;
// }
</style>
