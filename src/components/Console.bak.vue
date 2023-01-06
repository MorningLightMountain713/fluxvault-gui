<template>
  <vue-window-portal
    @opened="handleOpen"
    @resize="handleResize"
    :width="w"
    :height="h"
    style="height: 100vh"
    open
    :pass="pass"
  >
    <vue-draggable-resizable
      ref="vdr"
      :active.sync="isTerminalActive"
      @dragstop="
        isTerminalActive = false;
        updateTerminal();
      "
      @resizestop="isTerminalActive = false"
      @dragging="onDrag"
      @resizing="onResize"
      :draggable="isDraggable"
      :resizable="isDraggable"
      :z="z"
      :x="x"
      :y="y"
      :w="w"
      :h="h"
      :parent="true"
      :min-width="200"
      :min-height="200"
      :max-width="5000"
      :max-height="5000"
    >
      <div class="terminal space shadow">
        <div
          v-if="showMenu"
          fluid
          @dblclick="handleDoubleClick()"
          style="display: flex"
          class="top"
        >
          <div class="btns">
            <span @click="closeConsole" class="circle red"></span>
            <span class="circle yellow"></span>
            <span class="circle green"></span>
          </div>
          <div class="title">Terminal: {{ currentTopic }}</div>
          <v-btn icon color="primary" @click="handleWindow"
            ><v-icon>mdi-arrow-right-top-bold</v-icon></v-btn
          >
        </div>
        <div class="xterm-container">
          <div id="termo" class="blah" ref="xterm"></div>
        </div>
      </div>
    </vue-draggable-resizable>
  </vue-window-portal>
</template>

<script>
import "xterm/css/xterm.css";
import {
  addEventListener,
  removeEventListener,
  sendEvent,
} from "@/plugins/socketio";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import { Unicode11Addon } from "xterm-addon-unicode11";
import VueDraggableResizable from "vue-draggable-resizable";
import VueWindowPortal from "@/components/VueWindowPortal.vue";

export default {
  components: {
    VueDraggableResizable,
    VueWindowPortal,
  },
  props: {
    z: Number,
    topic: String,
  },
  data() {
    return {
      listener: (message) => {
        // message.received = Date.now();
        this.writeln(message.output);
      },

      pass: true,
      inWindow: false,
      showMenu: true,
      isDraggable: true,
      isScrolling: this.followScroll,
      currentTopic: this.topic,
      fullscreen: false,
      isTerminalActive: false,
      ansi: undefined,
      content: "",
      clientWidth: 0,
      clientHeight: 0,
      // draggable
      x: 0,
      y: 0,
      w: 1000,
      h: 600,
      items: [
        {
          action: "mdi-cable-data",
          title: "Topics",
          active: false,
          items: [
            { title: "logs", active: true },
            { title: "config", active: false },
          ],
        },
        {
          action: "mdi-information",
          title: "Info",
          active: false,
          items: [{ title: "Blah" }, { title: "Stuff" }, { title: "Things" }],
        },
      ],
    };
  },
  computed: {
    snapTime() {
      if (this.x + this.w + 2 >= this.clientWidth) {
        return true;
      }
      return false;
    },
  },
  beforeMount() {},
  beforeUpdate() {},
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    this.$nextTick(() => {
      this.clientWidth = this.$parent.$refs.dragParent.clientWidth;
      this.clientHeight = this.$parent.$refs.dragParent.clientHeight;
      window.addEventListener("resize", this.handleResize);
    });
    this.$term = new Terminal({
      allowProposedApi: true,
      cursorBlink: true,
      macOptionIsMeta: true,
      scrollback: true,
    });

    this.$fitAddon = new FitAddon();
    this.$term.loadAddon(this.$fitAddon);
    this.$term.loadAddon(new WebLinksAddon());
    this.$term.loadAddon(new Unicode11Addon());
    this.$term.unicode.activeVersion = "11";
    // this.$term.open(this.$refs.xterm);
    // console.log("This element: " + this.$el);
    this.$term.open(document.getElementById("termo"));
    console.log(this.$term.cols, this.$term.rows);
    // this.$fitAddon.fit();
    // this.$term.resize("106", "32");

    this.$term.onTitleChange((title) => this.$emit("title-change", title));
    this.$term.onData((data) => {
      console.log(data);
    });
    this.focus();

    this.addTopic("pty_output");
  },
  methods: {
    fit() {
      this.$fitAddon.fit();
    },
    focus() {
      this.$term.focus();
    },
    blur() {
      this.$term.blur();
    },
    writeln(data) {
      this.$term.writeln(data);
    },
    handleOpen(window) {
      this.clientWidth = window.innerWidth;
      this.clientHeight = window.innerHeight;
      // we always take up 100% when in window
      this.$refs.vdr.parentWidth = 9999;
      this.$refs.vdr.parentHeight = 9999;
    },
    handleWindow() {
      //   const windowPath = window.location.origin + window.location.pathname + "_window";
      //   this.window = window.open(
      //     windowPath,
      //     "",
      //     `width=600,height=800,left=200,top=200}`
      //   );
      this.inWindow = true;
      this.x = 0;
      this.y = 0;
      //   console.log(this.$refs.vdr);

      this.isDraggable = false;
      this.showMenu = false;
      this.pass = false;
    },
    addTopic(topic) {
      // each console has exactly one listener. We need to keep a
      // reference to it so we can cancel topic listeners per console
      addEventListener({
        type: topic,
        callback: this.listener,
      });
    },
    removeTopic(topic) {
      removeEventListener({ type: topic, listener: this.listener });
    },
    closeConsole() {
      console.log("close console");
      this.$emit("closeConsole");
    },
    handleDoubleClick() {
      if (!this.fullscreen) {
        this.x = 0;
        this.y = 0;
        this.w = this.clientWidth;
        this.h = this.clientHeight;
        this.fullscreen = true;
      } else {
        this.w = 1000;
        this.h = 600;
        this.fullscreen = false;
      }
    },
    handleResize(event) {
      //   console.log(event);
      if (this.$parent.$refs.dragParent) {
        let oldWidth = this.clientWidth;
        let oldHeight = this.clientHeight;
        if (!this.inWindow) {
          this.clientWidth = this.$parent.$refs.dragParent.innerWidth;
          this.clientHeight = this.$parent.$refs.dragParent.innerHeight;
        } else {
          this.clientWidth = event.width;
          this.clientHeight = event.height;
        }

        // smaller x window
        if (this.inWindow) {
          this.w = this.clientWidth;
          this.h = this.clientHeight;
        } else {
          // ToDo: Fix, this should only fire if snapped on RH edge
          if (this.x + this.w > this.clientWidth) {
            this.x = this.x - (oldWidth - this.clientWidth);
          }
          // bigger x window
          else if (this.x + this.w < this.clientWidth) {
            this.x = this.x + (this.clientWidth - oldWidth);
          }
          // smaller y window
          if (this.y + this.h > this.clientHeight) {
            this.h = this.h - (oldHeight - this.clientHeight);
          }
          // bigger y window
          else if (this.y + this.h < this.clientHeight) {
            this.h = this.h + (this.clientHeight - oldHeight);
          }
        }
      }
    },
    updateTerminal() {
      if (this.snapTime) {
        let w = this.w;
        let h = this.h;

        // we need to set the width first then move on nexttick, otherwise it
        // doesn't work all the time
        this.w = 750;
        this.$nextTick(() => {
          this.x = this.clientWidth - this.w;
          this.y = 0;
          this.h = this.clientHeight;
        });
        // this.h = 800;
        // let deltaw = w - this.w
      }
    },
    onDrag(left, top) {
      this.x = left;
      this.y = top;
    },
    onResize(left, top, width, height) {
      console.log(left, top, width, height);
      this.x = left;
      this.y = top;
      this.w = width;
      this.h = height;
      this.fitToscreen();
    },
    deactivateTerminal() {
      this.isTerminalActive = false;
    },
    fitToscreen() {
      this.$fitAddon.fit();
      const dims = {
        host: "127.0.0.1",
        cols: this.$term.cols,
        rows: this.$term.rows,
      };
      console.log("sending new dimensions to server's pty", dims);
      sendEvent({ type: "resize", data: dims });
      // socket.emit("resize", dims);
    },
    debounce(func, wait_ms) {
      let timeout;
      return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait_ms);
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.terminal {
  height: 100%;
  border-radius: 5px 5px 0 0;
  //   position: relative;
  .top {
    width: 100%;
    background: #e8e6e8;
    color: black;
    padding: 5px;
    border-radius: 5px 5px 0 0;
  }
  .btns {
    position: absolute;
    top: 7px;
    left: 5px;
  }
  .circle {
    width: 12px;
    height: 12px;
    display: inline-block;
    border-radius: 15px;
    margin-left: 2px;
    border-width: 1px;
    border-style: solid;
  }
  .xterm-container {
    text-align: left;
    height: 100%;
    // background: black;
    // height: calc(100% - 42px);
    // font-size: 0.9em;
    // line-height: 1.2em;
    // color: #7afb4c;
    // padding: 8px;
    // overflow-y: scroll;
  }
  // .body_no_top {
  //   text-align: left;
  //   background: black;
  //   height: 100%;
  //   font-size: 0.9em;
  //   line-height: 1.2em;
  //   color: #7afb4c;
  //   padding: 8px;
  //   overflow-y: scroll;
  // }
}
.title {
  width: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  text-align: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.red {
  background: #ec6a5f;
  border-color: #d04e42;
}
.green {
  background: #64cc57;
  border-color: #4ea73b;
}
.yellow {
  background: #f5c04f;
  border-color: #d6a13d;
}
// .clear {
//   clear: both;
// }
// .space {
//   margin: 25px;
// }
.shadow {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
}
.vdr {
  border: none;
  //   position: relative;
}
// .text-wrap {
//   white-space: normal !important;
// }
// * {
//   border: 1px solid black;
// }
// .v-list-item--active {
//   background-color: red;
// }
/* Hide scrollbar for all */
</style>
