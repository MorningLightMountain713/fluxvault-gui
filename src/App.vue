<template>
  <v-app>
    <!-- <v-app-bar dark app></v-app-bar> -->
    <v-app-bar clipped-left rounded app>
      <v-row justify="center">
        <v-col cols="3">
          <v-select
            prepend-icon="mdi-database-search"
            class="pt-5"
            v-model="selectedAgent"
            :items="agents"
            label="Agent"
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            class="pt-5"
            v-model="fluxApplication"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            hide-no-data
            hide-details
            hide-selected
            item-text="name"
            item-value="API"
            label="Flux application"
            placeholder="Start typing to Search"
            prepend-icon="mdi-database-search"
            return-object
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-tooltip bottom open-delay="500">
        <template v-slot:activator="{ on }">
          <v-btn icon :disabled="disableTerminalButton" @click="newTerminal">
            <v-icon v-on="on"> mdi-console </v-icon>
          </v-btn>
        </template>
        <span>Start a new console for selected agent</span>
      </v-tooltip></v-app-bar
    >
    <v-navigation-drawer
      :width="225"
      :key="navBarUnpinned"
      :expand-on-hover="navBarUnpinned"
      clipped
      permanent
      app
    >
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://runonflux.io/images/Group-10175.svg"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">
              <span class="font-weight-bold">Fluxvault</span>
            </v-list-item-title>
          </v-list-item-content>
          <v-btn icon @click="navBarUnpinned = !navBarUnpinned">
            <v-icon v-if="!navBarUnpinned">mdi-pin</v-icon>
            <v-icon v-else>mdi-pin-outline</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider></v-divider>
        <div v-for="(route, i) in routes" :key="i">
          <v-list-item v-if="!route.subLinks" :to="route.path">
            <v-list-item-action>
              <v-icon>{{ route.meta.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title v-text="route.name" />
          </v-list-item>

          <v-list-group
            :prepend-icon="route.meta.icon"
            @click.prevent
            v-else
            :key="route.name"
            no-action
            v-model="expandAgents"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="route.name" />
              </v-list-item-content>
            </template>

            <v-list-item
              class="px-8"
              v-for="sublink in route.subLinks"
              :to="sublink.to"
              :key="sublink.name"
            >
              <v-list-item-action>
                <v-icon>mdi-laptop</v-icon>
              </v-list-item-action>
              <v-list-item-title v-text="sublink.name" />
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-main style="height: 100vh; background: white">
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-main>
  </v-app>
</template>
<script>
import {
  addEventListener,
  removeEventListener,
  sendEvent,
} from "@/plugins/socketio";

export default {
  data() {
    return {
      groupDisabled: true,
      descriptionLimit: 60,
      selectedAgent: "",
      entries: [],
      isLoading: false,
      fluxApplication: null,
      expandAgents: false,
      search: null,
      navBarUnpinned: false,
    };
  },
  mounted() {
    // this.addTopic("network_state", this.loadAgentsIntoState);
  },
  computed: {
    targets() {
      return this.$store.state.targets;
    },
    disableTerminalButton() {
      return (
        this.selectedAgentsTerminals > 0 ||
        this.$store.state.route.name !== "Terminal"
      );
    },
    selectedAgentsTerminals() {
      let count = 0;
      this.$store.getters.terminals.forEach((terminal) => {
        if (this.selectedAgent == terminal.host) {
          count++;
        }
      });
      return count;
    },
    // selectedAgent() {
    //   return this.$store.getters.currentAgent;
    // },
    agents() {
      const agents = this.$store.state.agents;
      return Object.keys(agents);
    },
    routes() {
      const active = this.$router.options.routes.filter(
        (route) => !route.meta || !route.meta.hidden
      );
      active.forEach((route) => {
        if (route.name == "Agents") {
          route.subLinks = [];
          for (const agent of this.agents) {
            route.subLinks.push({ name: agent, to: "/agents/" + agent });
          }
        }
      });
      return active;
    },
    items() {
      return this.entries.map((entry) => {
        const name =
          entry.name.length > this.descriptionLimit
            ? entry.name.slice(0, this.descriptionLimit) + "..."
            : entry.name;
        return Object.assign({}, entry, { name });
      });
    },
  },
  watch: {
    // expandAgents(val) {
    //   if (val) {
    //     console.log("route:", this.$route.path);
    //     if (!this.$route.path.includes("/agents")) {
    //       this.$router.push({ path: "/agents" }).catch((err) => {});
    //     }
    //     this.$nextTick(() => {
    //       // this.expandAgents = !this.expandAgents;
    //     });
    //   }
    // },
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return;
      // Items have already been requested
      if (this.isLoading) return;
      this.isLoading = true;
      // Lazily load input items
      fetch("https://api.runonflux.io/apps/globalappsspecifications")
        .then((res) => res.json())
        .then((res) => {
          const { data } = res;
          this.entries = data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
    targets(val) {
      if (val.length) {
        // this.$store.dispatch("fetchAgents", val);
      }
    },
    async fluxApplication(val) {
      console.log("val");
      console.log(val);
      console.log(val.name);
      const resp = await fetch(
        "https://api.runonflux.io/apps/location?appname=" + val.name
      );
      const { data } = await resp.json();
      this.$store.dispatch("updateTargets", data);

      console.log(data);
      this.$store.dispatch("setCurrentFluxApplication", val);
      this.$store.dispatch("streamNetworkUpdates");
    },
    selectedAgent(value) {
      if (value) {
        this.$store.dispatch("setCurrentAgent", value);
      }
    },
    // agents(value) {
    //   if (value.length > 0) {
    //     this.expandAgents = true;
    //   } else {
    //     this.expandAgents = true;
    //   }
    // },
    // $route(to, from) {
    //   this.expandAgents = to.path.includes("/agents");
    // },
  },
  methods: {
    // loadAgentsIntoState(message) {
    //   this.$store.dispatch("updateAgents", message.state);
    // },
    routeToParent() {
      console.log("routeToParent");
      console.log("route:", this.$route.path);
      if (!this.$route.path.includes("/agents")) {
        this.$router.push({ path: "/agents" }).catch((err) => {});
      }
      this.$nextTick(() => {
        this.expandAgents = !this.expandAgents;
      });
    },
    addTopic(topic, listener) {
      addEventListener({
        type: topic,
        callback: listener,
      });
    },
    blurHandler() {
      document.activeElement.blur();
    },
    newTerminal() {
      if (this.selectedAgent == "") {
        return;
      }
      //   this.terminals.push({
      //     id: this.terminals.length,
      //     host: this.selectedAgent,
      //   });
      this.$store.dispatch("addTerminal", {
        id: this.$store.getters.terminalCount,
        host: this.selectedAgent,
      });
    },
  },
};
</script>
<style lang="scss">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;

//   // -webkit-box-sizing: border-box;
//   /* Safari/Chrome, other WebKit */
//   -moz-box-sizing: border-box;
//   /* Firefox, other Gecko */
//   box-sizing: border-box;

//   // text-align: center;
// }

// nav {
//   padding: 10px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
