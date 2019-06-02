<template>
  <div
    id="reactome-wrapper"
    class="reactome-wrapper">
    <div
      v-if="reactomeId"
      id="reactome-div"
      class="row"/>

    <div
      v-else>
      <h6>No Reactome ID</h6>
    </div>
  </div>
</template>

<script>

let vueInstance = null;

// https://reactome.org/dev/diagram/js#reuse-diagram-widget

// https://stackoverflow.com/a/49331651/5667222

const reactomeScriptId = 'reactome-script';
const reactomeWrapperId = 'reactome-wrapper';
const reactomeDivId = 'reactome-div';
const reactomeLibraryURL = 'https://reactome.org/DiagramJs/diagram/diagram.nocache.js';

/* global Reactome */

// This function is automatically called when the widget code is ready to be used
window.onReactomeDiagramReady = function onReactomeDiagramReady() {
  vueInstance.buildDiagram();
  vueInstance.loadDiagram();
};


export default {
  props: {
    reactomeId: {
      type: String,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      reactomeLoaded: false,
      diagram: null,
      width: null,
      height: null,
    };
  },

  mounted() {
    vueInstance = this;
    this.fit();

    if (document.getElementById(reactomeScriptId)) {
      if (!this.diagram) {
        this.buildDiagram();
      }
      this.loadDiagram();
    }
    else {
      const scriptTag = document.createElement('script');
      scriptTag.src = reactomeLibraryURL;
      scriptTag.id = reactomeScriptId;
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    }

    window.addEventListener('resize', this.handleResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    vueInstance = null;
  },

  methods: {
    fit() {
      const wrapper = document.getElementById(reactomeWrapperId);
      if (wrapper) {
        this.width = wrapper.clientWidth;
        this.height = window.innerHeight - 150;
      }
      else {
        console.log('fit() no wrapper', reactomeWrapperId, this.diagram);
        this.width = 50;
        this.height = 50;
      }
    },

    handleResize() {
      this.fit();
      if (this.diagram) {
        this.diagram.resize(this.width, this.height);
      }
    },

    buildDiagram() {
      /* eslint-disable */
      const reactomeDiv = document.getElementById(reactomeDivId);
      this.fit();
      this.diagram = Reactome.Diagram.create({
        'placeHolder' : reactomeDivId,
        'width' : this.width,
        'height' : this.height,
      });

      // //Adding different listeners

      // this.diagram.onDiagramLoaded((loaded) => {
      //   console.log('onDiagramLoaded', loaded);
      // });

      // diagram.onObjectHovered(function (hovered){
      //   console.info('Hovered ', hovered);
      // });

      // diagram.onObjectSelected(function (selected){
      //   console.info('Selected ', selected);
      // });
    },

    loadDiagram() {
      this.diagram.loadDiagram(this.reactomeId);
    },
  }
};
</script>

<style lang="scss">
@import "~@/style/variables";

.reactome-wrapper {
  margin: 0;
  padding: 0;
  width: 100%;
  xheight: 100%;
}

#reactome-div {
  margin: 0;
  padding: 0;
}

</style>
