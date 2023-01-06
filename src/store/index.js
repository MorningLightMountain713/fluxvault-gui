import Vue from 'vue'
import Vuex from 'vuex'
import {
  addEventListener,
  removeEventListener,
  sendEvent,
} from "@/plugins/socketio";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    agents: {},
    targets: [],
    currentAgent: "",
    currentFluxApplication: {},
    terminals: []
  },
  getters: {
    getAgentById: (state) => (id) => {
      console.log(state.agents[id])
      console.log(id)
      return state.agents[id]
    },
    currentAgent: (state) => {
      return state.currentAgent;
    },
    terminalCount: (state) => {
      return state.terminals.length
    },
    terminals: (state) => {
      return state.terminals
    }
  },
  mutations: {
    storeAgents(state, data) {
      state.agents = data
    },
    storeTargets(state, data) {
      state.targets = []
      data.map((target) => {
        const uri = new URL("http://" + target.ip);
        state.targets.push(uri.hostname)
      })
    },
    storeCurrentAgent(state, data) {
      state.currentAgent = data
    },
    storeCurrentFluxApplication(state, data) {
      state.currentFluxApplication = data
    },
    storeTerminal(state, terminal) {
      state.terminals.push(terminal)
    },
    deleteTerminal(state, index) {
      state.terminals.splice(index, 1)
    }
  },
  actions: {
    updateAgents({commit}, data) {
      commit("storeAgents", data)
    },
    updateTargets({commit}, data) {
      console.log("update targets")
      console.log(data)
      commit("storeTargets", data)
    },
    setCurrentAgent({commit}, data) {
      commit("storeCurrentAgent", data)
    },
    setCurrentFluxApplication({commit}, data) {
      commit("storeCurrentFluxApplication", data)
    },
    addTerminal({commit}, data) {
      commit("storeTerminal", data)
    },
    removeTerminal({commit, state}, id) {
      state.terminals.forEach((terminal, index) => {
        if (terminal.id == id) {
          sendEvent("terminal_closed", { host: terminal.host });
          commit("deleteTerminal", index)
        }
      });
    },
    // fetchAgents({commit}) {
    //   const callback = function(data) {
    //     commit("storeAgents", data)
    //     removeEventListener({type: "agent_fingerprints", listener: this});
    //   }
    //   addEventListener({type: "agent_fingerprints", callback: callback})
    //   console.log("requesting fingerprints")
    //   sendEvent({type: "fingerprint_agents", data:{}})
    // }
    streamNetworkUpdates({commit}) {
      const callback = function(data) {
        console.log('in callback')
        console.log(data.state)
        commit("storeAgents", data.state)
        // removeEventListener({type: "network_state", listener: this});
      };
      console.log("adding event listener for network events")
      addEventListener({type: "network_state", callback: callback})
    }
  },
  modules: {
  }
})
