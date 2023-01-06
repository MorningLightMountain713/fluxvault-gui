<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 400,
    },
    left: {
      type: Number,
      default: 200,
    },
    top: {
      type: Number,
      default: 200,
    },
    noStyle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      windowRef: null,
      windowLoaded: false,
    };
  },
  watch: {
    open(newOpen) {
      if (newOpen) {
        this.openPortal();
      }
    },
  },
  mounted() {
    if (this.open) {
      console.log("mount");
      console.log("portal mounted");
      this.openPortal();
    }
    // window.addEventListener('beforeunload', this.closePortal)
  },
  beforeDestroy() {
    console.log("portal destryoed");
    this.closePortal();
    // window.removeEventListener('beforeunload', this.closePortal)
  },
  methods: {
    handleResize() {
      let w = this.windowRef.innerWidth;
      let h = this.windowRef.innerHeight;
      let data = { width: w, height: h };
      this.$emit("resize", data);
    },
    openPortal() {
      console.log("opening window");
      if (this.windowRef) return;

      const { width, height, left, top } = this;

      // Open a nonexistent page to replace the content later
      const windowPath =
        window.location.origin + window.location.pathname + "_window";
      this.windowRef = window.open(
        windowPath,
        "",
        `width=${width},height=${height},left=${left},top=${top}`
      );
      this.windowRef.addEventListener("unload", this.closePortal);
      this.windowRef.addEventListener("resize", this.handleResize);
      this.windowRef.addEventListener("load", () => {
        console.log("window loaded");
        this.windowLoaded = true;

        // Clear any existing content
        this.windowRef.document.body.innerHTML = "";

        this.windowRef.document.title = document.title;

        // Move the component into the window
        const app = document.createElement("div");
        app.id = "app";
        app.appendChild(this.$el);
        this.windowRef.document.body.appendChild(app);
        this.$emit("update:open", true);
        this.$emit("opened", this.windowRef);

        // Clone style nodes
        if (!this.noStyle) {
          for (const el of document.head.querySelectorAll(
            "style, link[rel=stylesheet]"
          )) {
            const clone = el.cloneNode(true);
            this.windowRef.document.head.appendChild(clone);
          }
        }
      });
    },
    closePortal() {
      if (!this.windowRef) return;
      if (!this.windowLoaded) return;
      console.log("closing portal");
      this.windowLoaded = false;
      this.windowRef.close();
      this.windowRef = null;
      this.$emit("update:open", false);
      this.$emit("closed");
    },
  },
};
</script>
