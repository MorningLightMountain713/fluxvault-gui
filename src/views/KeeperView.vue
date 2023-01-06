<template>
  <v-container>
    <v-row>
      <v-col>
        <v-theme-provider light>
          <file-browser
            @change="handlePathChange"
            class="pt-5"
            storages="local"
            :axiosConfig="{
              baseURL: 'http://localhost:8081',
            }" /></v-theme-provider
      ></v-col>
      <v-col>
        <v-theme-provider light>
          <v-card
            ><v-card-title>Loadout</v-card-title><v-divider></v-divider>
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
                  @click.prevent
                  class="pl-0 v-list-item"
                >
                  <v-list-item v-if="item.type == 'dir'">
                    <v-list-item-avatar class="ma-0">
                      <v-icon>mdi-folder-outline</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="py-2">
                      <v-list-item-title
                        v-text="item.basename"
                      ></v-list-item-title>
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
                      <v-list-item-title
                        v-text="item.basename"
                      ></v-list-item-title>
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
            </v-list-item-group></v-card
          >
        </v-theme-provider>
      </v-col></v-row
    ></v-container
  >
</template>

<script>
import FileBrowser from "@/components/vuetify-file-browser";
import { formatBytes } from "@/components/vuetify-file-browser/src/util";
import draggable from "vuedraggable";

export default {
  components: {
    FileBrowser,
    draggable,
  },
  data() {
    return {
      icons: {
        zip: "mdi-folder-zip-outline",
        rar: "mdi-folder-zip-outline",
        htm: "mdi-language-html5",
        html: "mdi-language-html5",
        js: "mdi-nodejs",
        json: "mdi-json",
        md: "mdi-markdown",
        pdf: "mdi-file-pdf",
        png: "mdi-file-image",
        jpg: "mdi-file-image",
        jpeg: "mdi-file-image",
        mp4: "mdi-filmstrip",
        mkv: "mdi-filmstrip",
        avi: "mdi-filmstrip",
        wmv: "mdi-filmstrip",
        mov: "mdi-filmstrip",
        txt: "mdi-file-document-outline",
        xls: "mdi-file-excel",
        other: "mdi-file-outline",
      },
      path: "",
      items: [],
    };
  },
  methods: {
    formatBytes,
    handlePathChange(path) {
      console.log("we be pathin", path);
      this.path = path;
    },
  },
};
</script>
<style lang="scss" scoped>
// * {
//   border: 1px solid black;
// }
</style>
