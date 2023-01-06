<template>
  <v-card flat tile height="449" class="d-flex flex-column">
    <confirm ref="confirm"></confirm>
    <v-card-text
      v-if="!path"
      class="grow d-flex justify-center align-center grey--text"
      >Select a folder or a file</v-card-text
    >
    <v-card-text
      v-else-if="isFile"
      class="grow d-flex justify-center align-center"
      >File: {{ path }}</v-card-text
    >
    <v-card-text v-else-if="dirs.length || files.length">
      <v-list-item-group>
        <draggable
          class="overflow-y-auto"
          style="height: 400px"
          :v-model="items"
          group="files"
        >
          <div
            v-for="item in items"
            :key="item.basename"
            class="pl-0 v-list-item"
          >
            <v-list-item v-if="item.type == 'dir'">
              <v-list-item-avatar class="ma-0">
                <v-icon>mdi-folder-outline</v-icon>
              </v-list-item-avatar>
              <v-list-item-content class="py-2">
                <v-list-item-title v-text="item.basename"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon v-if="false">
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-list-item v-else>
              <v-list-item-avatar class="ma-0">
                <v-icon>{{
                  icons[item.extension.toLowerCase()] || icons["other"]
                }}</v-icon>
              </v-list-item-avatar>

              <v-list-item-content class="py-2">
                <v-list-item-title v-text="item.basename"></v-list-item-title>
                <v-list-item-subtitle>{{
                  formatBytes(item.size)
                }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon v-if="false">
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </div>
        </draggable>
      </v-list-item-group>
    </v-card-text>
    <v-card-text
      v-else-if="filter"
      class="d-flex justify-center align-center grey--text py-5"
      >No files or folders found</v-card-text
    >
    <v-card-text
      v-else
      class="grow d-flex justify-center align-center grey--text py-5"
      >The folder is empty</v-card-text
    >
  </v-card>
</template>

<script>
import { formatBytes } from "./util";
import Confirm from "./Confirm.vue";
import draggable from "vuedraggable";

export default {
  props: {
    icons: Object,
    storage: String,
    path: String,
    endpoints: Object,
    axios: Function,
    refreshPending: Boolean,
  },
  components: {
    Confirm,
    draggable,
  },
  data() {
    return {
      items: [],
      filter: "",
    };
  },
  computed: {
    dirs() {
      return this.items.filter(
        (item) => item.type === "dir" && item.basename.includes(this.filter)
      );
    },
    files() {
      return this.items.filter(
        (item) => item.type === "file" && item.basename.includes(this.filter)
      );
    },
    isDir() {
      return this.path[this.path.length - 1] === "/";
    },
    isFile() {
      return !this.isDir;
    },
  },
  methods: {
    formatBytes,
    changePath(path) {
      this.$emit("path-changed", path);
    },
    async load() {
      this.$emit("loading", true);
      if (this.isDir) {
        let url = this.endpoints.list.url
          .replace(new RegExp("{storage}", "g"), this.storage)
          .replace(new RegExp("{path}", "g"), this.path);

        let config = {
          url,
          method: this.endpoints.list.method || "get",
        };

        let response = await this.axios.request(config);
        this.items = response.data;
      } else {
        // TODO: load file
      }
      this.$emit("loading", false);
    },
    async deleteItem(item) {
      let confirmed = await this.$refs.confirm.open(
        "Delete",
        `Are you sure<br>you want to delete this ${
          item.type === "dir" ? "folder" : "file"
        }?<br><em>${item.basename}</em>`
      );

      if (confirmed) {
        this.$emit("loading", true);
        let url = this.endpoints.delete.url
          .replace(new RegExp("{storage}", "g"), this.storage)
          .replace(new RegExp("{path}", "g"), item.path);

        let config = {
          url,
          method: this.endpoints.delete.method || "post",
        };

        await this.axios.request(config);
        this.$emit("file-deleted");
        this.$emit("loading", false);
      }
    },
  },
  watch: {
    async path() {
      this.items = [];
      await this.load();
    },
    async refreshPending() {
      if (this.refreshPending) {
        await this.load();
        this.$emit("refreshed");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  height: 100%;
}
</style>
