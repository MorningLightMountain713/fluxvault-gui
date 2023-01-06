<template>
  <v-container @click="selected = -1">
    <v-container class="pa-0" ref="container" style="position: relative">
      <v-img v-if="device" ref="target" src="@/assets/qfx5200-32c-front.jpeg"></v-img>
      <v-hover v-if="device" v-for="transceiver in transceivers" v-slot="{ hover }">
        <v-card
          :elevation="hover ? 12 : 2"
          @click.stop="colorize(transceiver.id, $event)"
          class="transceiver d-block"
          :style="[
            selected === transceiver.id
              ? { border: '2px dashed greenyellow' }
              : { border: 'none' },
            {
              transform: 'translate(-50%, -50%) scale(' + currentScale + ')',
              left: transceiver.left + '%',
              top: transceiver.top + '%',
            },
          ]"
        >
          <div
            v-if="transData['0/0/' + transceiver.id]"
            class="populated"
            :style="[
              transceiverSpeed(transceiver.id) === '100g'
                ? { backgroundColor: '#eb34db' }
                : { backgroundColor: 'yellow' },
            ]"
          ></div>
        </v-card>
      </v-hover>
    </v-container>
    <v-row class="pt-5">
      <v-col cols="4">
        <v-card v-if="device">
          <v-img height="300" src="@/assets/LR4.jpg">
            <v-card-title>Transceiver data</v-card-title>
          </v-img>
          <v-card-text class="text--primary">Type: {{ filterData() }}</v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-row>
          <v-col>
            <v-card v-if="device">
              <v-card-title>Legend</v-card-title>
              <v-card-text>Pink=100g, Yellow=10g</v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="end" style="height: 150px">
          <v-col>
            <v-btn @click="device = 'mod-p-1'">GET mod-p-1</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { data } from "@/devices"; // yaml

export default {
  computed: {
    transData() {
      return this.device ? data[this.device].hardware_profile.transceivers : {};
    },
  },
  mounted() {
    this.$nextTick(() => {
      console.log("mounted ");
      console.log(this.transData);
      this.imgCurrentWidth = this.$refs.container.getBoundingClientRect().width;
      this.currentScale = this.imgCurrentWidth / this.ogImgWidth;

      console.log(this.ogImgWidth);
      console.log(this.imgCurrentWidth);
      console.log(this.currentScale);

      window.addEventListener("resize", this.handleResize);
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  data() {
    return {
      device: "",
      selected: -1,
      ogImgWidth: 800,
      imgCurrentWidth: 0,
      currentScale: 0,
      crossHairsTop: 0,
      crossHairsLeft: 0,
      clientHeight: 0,
      clientWidth: 0,
      transceivers: [
        { id: 0, opacity: "0%", left: 18.270042194092827, top: 41.011485187558534 },
        { id: 1, opacity: "0%", left: 22.502172024326672, top: 41.011485187558534 },
        { id: 2, opacity: "0%", left: 26.84622067767159, top: 41.011485187558534 },
        { id: 3, opacity: "0%", left: 31.0783505079, top: 41.011485187558534 },
        { id: 4, opacity: "0%", left: 36.519114688128774, top: 41.011485187558534 },
        { id: 5, opacity: "0%", left: 40.845070422535215, top: 41.011485187558534 },
        { id: 6, opacity: "0%", left: 45.0772002528, top: 41.011485187558534 },
        { id: 7, opacity: "0%", left: 49.309330083, top: 41.011485187558534 },
        { id: 8, opacity: "0%", left: 54.82897384305835, top: 41.011485187558534 },
        { id: 9, opacity: "0%", left: 59.0611036733, top: 41.011485187558534 },
        { id: 10, opacity: "0%", left: 63.2932335035, top: 41.011485187558534 },
        { id: 11, opacity: "0%", left: 67.62753633337, top: 41.011485187558534 },
        { id: 12, opacity: "0%", left: 73.13974591651544, top: 41.011485187558534 },
        { id: 13, opacity: "0%", left: 77.3718757467, top: 41.011485187558534 },
        { id: 14, opacity: "0%", left: 81.604005577, top: 41.011485187558534 },
        { id: 15, opacity: "0%", left: 85.8361354072, top: 41.011485187558534 },
        { id: 16, opacity: "0%", left: 18.270042194092827, top: 62.419166755009016 },
        { id: 17, opacity: "0%", left: 22.502172024326672, top: 62.419166755009016 },
        { id: 18, opacity: "0%", left: 26.84622067767159, top: 62.419166755009016 },
        { id: 19, opacity: "0%", left: 31.0783505079, top: 62.419166755009016 },
        { id: 20, opacity: "0%", left: 36.519114688128774, top: 62.419166755009016 },
        { id: 21, opacity: "0%", left: 40.845070422535215, top: 62.419166755009016 },
        { id: 22, opacity: "0%", left: 45.0772002528, top: 62.419166755009016 },
        { id: 23, opacity: "0%", left: 49.309330083, top: 62.419166755009016 },
        { id: 24, opacity: "0%", left: 54.82897384305835, top: 62.419166755009016 },
        { id: 25, opacity: "0%", left: 59.0611036733, top: 62.419166755009016 },
        { id: 26, opacity: "0%", left: 63.2932335035, top: 62.419166755009016 },
        { id: 27, opacity: "0%", left: 67.62753633337, top: 62.419166755009016 },
        { id: 28, opacity: "0%", left: 73.13974591651544, top: 62.419166755009016 },
        { id: 29, opacity: "0%", left: 77.3718757467, top: 62.419166755009016 },
        { id: 30, opacity: "0%", left: 81.604005577, top: 62.419166755009016 },
        { id: 31, opacity: "0%", left: 85.8361354072, top: 62.419166755009016 },
      ],
      TRANSCEIVER_TYPES: {
        "QSFP+-4X10G-LR": {
          chassis_config_required: true,
          speed: "10g",
          interface_count: 4,
          prefix: "xe",
        },
        "QSFP-100GBASE-LR4": {
          speed: "100g",
          prefix: "et",
        },
        "QSFP28-100G-AOC-1M": {
          speed: "100g",
          prefix: "et",
        },
        "QSFP-100GBASE-SR4": {
          speed: "100g",
          prefix: "et",
        },
        "QSFP-100GBASE-LR4-T2": {
          speed: "100g",
          prefix: "et",
        },
        "SFP+-10G-LR": {
          speed: "10g",
          prefix: "xe",
        },
      },
    };
  },
  methods: {
    transceiverSpeed(id) {
      let transType = (this.transData["0/0/" + id] || {}).type;
      let speed;
      transType ? (speed = this.TRANSCEIVER_TYPES[transType].speed) : (speed = "");
      return speed;
    },
    filterData() {
      return (this.transData["0/0/" + this.selected] || {}).type;
    },
    drawDot(event) {
      let mouseX = event.clientX;
      let mouseY = event.clientY;
      let parentH = this.$refs.container.getBoundingClientRect().height;
      let parentW = this.$refs.container.getBoundingClientRect().width;
      let parentX = this.$refs.container.getBoundingClientRect().x;
      let parentY = this.$refs.container.getBoundingClientRect().y;
      let percentX = ((mouseX - parentX) / parentW) * 100;
      let percentY = ((mouseY - parentY) / parentH) * 100;

      this.transceivers.push({ left: percentX, top: percentY });
    },
    mouseMove(event) {
      this.crossHairsTop = event.clientY;
      this.crossHairsLeft =
        event.clientX - this.$refs.container.getBoundingClientRect().x;
    },
    handleResize() {
      this.clientHeight = window.innerHeight;
      this.clientWidth = window.innerWidth;

      this.$nextTick(() => {
        console.log("handle resize: ");
        console.log(this.ogImgWidth);
        console.log(this.imgCurrentWidth);
        console.log(this.currentScale);

        this.imgCurrentWidth = this.$refs.container.getBoundingClientRect().width;
        this.currentScale = this.imgCurrentWidth / this.ogImgWidth;
      });
    },
    getColor(i) {
      let target = this.layout.find((o) => o.id === i);
      return target.bgColor;
    },
    colorize(i, event) {
      this.selected = i;
      //   event.target.classList.toggle("selected");
      // console.log(window.clientWidth)
      //   this.transceivers.map((x) => {
      //     // console.log(x)
      //     if (x.id === i) {
      //       // x.bgColor = "red"
      //       x.opacity = "100%";
      //     } else {
      //       // x.bgColor = "grey"
      //       x.opacity = "0%";
      //     }
      //   });
      // console.log(event.target)
      // event.target.style.opacity = "100%"
      // let target = this.layout.find(o => o.i === i);
      // target.bgColor = "red";
    },
  },
};
</script>

<style scoped>
.transceiver {
  position: absolute;
  width: 32px;
  background-color: transparent;
  height: 16px;

  z-index: 77;
  /* border-rsadius: 50%; */
}

.populated {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  position: absolute;
  top: 5%;
  left: 85%;
  z-index: 999;
}

.transceiver.selected {
  border: 2px dashed greenyellow !important;
}

.crosshairs {
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 99;
}

.crosshairs.hidden {
  display: none;
}

.crosshairs::before,
.crosshairs::after {
  content: "";
  height: 100%;
  width: 100%;
  position: absolute;
  border: none !important;
}

.crosshairs::before {
  left: -100%;
  top: -100%;
  border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.crosshairs::after {
  left: 0px;
  top: 0px;
  border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.overlay {
  position: absolute;
  top: 86px;
  left: 0px;
  transform: translate(0, -10%);
  /* -ms-transform: translate(0, -10%); */
}

.wrapper {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.vue-grid-layout {
  background: #eee;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}

/* .vue-grid-item .resizing {
    opacity: 0.9;
} */

/* .vue-grid-item .static {
    background: #cce;
} */

/* .vue-grid-item .text {
    font-size: 20px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
} */

/* .vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
} */

/* .vue-grid-item .minMax {
    font-size: 12px;
} */

/* .vue-grid-item .add {
    cursor: pointer;
} */

/* .vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
} */
</style>
