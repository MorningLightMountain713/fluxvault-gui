<template>
  <v-row style="height: 100%" no-gutters>
    <v-col class="ma-0 pa-0" align="center">
      <v-container
        fluid
        ref="dragParent"
        style="height: 100%"
        class="pa-0 ma-0"
      >
        <console
          v-for="terminal in terminals"
          :initialZ="900 + terminal.id"
          :key="terminal.id"
          @closeConsole="closeConsole(terminal.id)"
          :host="terminal.host"
        />
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import Console from "@/components/Console.vue";
import Agent from "@/components/Agent.vue";
import {
  addEventListener,
  removeEventListener,
  sendEvent,
} from "@/plugins/socketio";

export default {
  name: "AgentsView",
  components: {
    Console,
    Agent,
  },
  data() {
    return {
      //   terminals: [],
    };
  },
  computed: {
    terminals() {
      return this.$store.getters.terminals;
    },
    agent() {
      return this.$store.getters.getAgentById(this.selectedAgent);
    },
  },
  methods: {
    closeConsole(id) {
      //   this.terminals.forEach((terminal, index) => {
      //     if (terminal.id == id) {
      //       sendEvent("terminal_closed", { host: terminal.host });
      //       this.terminals.splice(index, 1);

      //       // toDo: raise break
      //     }
      //   });
      this.$store.dispatch("removeTerminal", id);
    },
    releaseFocus(ref) {
      this.$refs[ref].blur();
    },
  },
};
</script>
