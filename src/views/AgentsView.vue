<template>
  <v-row>
    <v-col>
      <agent
        style="position: absolute"
        :address="selectedAgent"
        :data="agent"
      ></agent>
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
      terminals: [],
    };
  },
  computed: {
    agent() {
      return this.$store.getters.getAgentById(this.selectedAgent);
    },
    selectedAgent() {
      return this.$route.params.agent;
    },
    selectedAgentsTerminals() {
      let count = 0;
      this.terminals.forEach((terminal) => {
        if (this.selectedAgent == terminal.host) {
          count++;
        }
      });
      return count;
    },
  },
  mounted() {
    this.$store.dispatch("setCurrentAgent", this.selectedAgent);
  },
  watch: {
    selectedAgent(value) {
      if (value) {
        this.$store.dispatch("setCurrentAgent", value);
      }
    },
  },
  methods: {
    newTerminal() {
      if (this.selectedAgent == "") {
        return;
      }
      this.terminals.push({
        id: this.terminals.length,
        host: this.selectedAgent,
      });
    },
    closeConsole(id) {
      this.terminals.forEach((terminal, index) => {
        if (terminal.id == id) {
          sendEvent("terminal_closed", { host: terminal.host });
          this.terminals.splice(index, 1);

          // toDo: raise break
        }
      });
    },
    releaseFocus(ref) {
      this.$refs[ref].blur();
    },
  },
};
</script>
