<template>
  <div
    id="genomeFeature"
    class="container-fluid">

    <svg
      id="genome-feature"
      width="80%"/>

    <div class="row">
      <div
        class="col-11">
        &nbsp;
      </div>
      <div
        id="jbrowse-link"
        class="col-1">
        <a
          :href="mygeneData.externalURL"
          target="_blank"
          rel="noopener noreferrer"
          class="fa fa-link"/>
      </div>
    </div>
  </div>
</template>


<script>
import { scaleLinear } from 'd3-scale';
import { axisTop } from 'd3-axis';
import { select } from 'd3-selection';

function countIsoforms(data) {
  let isoformCount = 0;
  // gene level
  /* eslint-disable */

  for (let i in data) {
    let feature = data[i];
    feature.children.forEach(function (geneChild) {
      // isoform level
      if (geneChild.type == 'mRNA') {
        isoformCount += 1;
      }
    });
  }
  return isoformCount;
  /* eslint-enable */
}

function findRange(data) {
  let fmin = -1;
  let fmax = -1;

  /* eslint-disable */
  for (let d in data) {
    if (fmin < 0 || data[d].fmin < fmin) {
      fmin = data[d].fmin;
    }
    if (fmax < 0 || data[d].fmax > fmax) {
      fmax = data[d].fmax;
    }
  }

  return {
    fmin: fmin,
    fmax: fmax
  };

  /* eslint-enable */
}


function drawIntoSVG(mygeneData) {
  const trackResponse = mygeneData.trackResponse;
  const hit = mygeneData.hits[0];

  /* eslint indent: 0 */
  /* eslint camelcase: 0 */
  /* eslint prefer-const: 0 */
  /* eslint guard-for-in: 0 */
  /* eslint no-plusplus: 0 */
  /* eslint space-in-parens: 0 */
  /* eslint eqeqeq: 0 */
  /* eslint func-names: 0 */
  /* eslint no-else-return: 0 */
  /* eslint no-loop-func: 0 */
  /* eslint no-restricted-syntax: 0 */

  const dataRange = findRange(trackResponse);
  const view_start = dataRange.fmin;
  const view_end = dataRange.fmax;
  const exon_height = 10; // will be white / transparent
  const cds_height = 10; // will be colored in
  const isoform_height = 40; // height for each isoform
  const isoform_view_height = 20; // height for each isoform
  const isoform_title_height = 0; // height for each isoform
  const utr_height = 10; // this is the height of the isoform running all of the way through
  const transcript_backbone_height = 4; // this is the height of the isoform running all of the way through
  const arrow_height = 20;
  const arrow_width = 10;
  const arrow_points = '0,0 0,' + arrow_height + ' ' + arrow_width + ',' + arrow_width;
  const sortWeight = {
    'exon': 100,
    'UTR': 200,
    'five_prime_UTR': 200,
    'three_prime_UTR': 200,
    'CDS': 1000,
  };

  let isoform_count = 0;
  let MAX_ISOFORMS = 10;

  let calculatedHeight = '600px';
  const numberIsoforms = countIsoforms(trackResponse);
  if (numberIsoforms > MAX_ISOFORMS) {
    calculatedHeight = (MAX_ISOFORMS + 2) * isoform_height;
  }
  else {
    calculatedHeight = (numberIsoforms + 1) * isoform_height;
  }
  const margin = {
    top: 8,
    right: 30,
    bottom: 30,
    left: 40
  };
  const width = 960 - margin.left - margin.right;
  const height = calculatedHeight - margin.top - margin.bottom;

  // MEAT here
  const x = scaleLinear()
    .domain([view_start, view_end])
    .range([0, width]);

  let tickFormat = x.tickFormat(5, '.2s');

  let xAxis = axisTop(x)
      .ticks(10, 's')
      .tickSize(8)
      .tickFormat(tickFormat);

  const externalUrl = hit.id;
  let viewer = select('#genome-feature')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('a')
      .attr('xlink:href', externalUrl)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  for (let i in trackResponse) {
      let feature = trackResponse[i];
      let featureChildren = feature.children;

      let selected = feature.selected;
      featureChildren = featureChildren.sort(function (a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return a - b;
      });

      featureChildren.forEach(function (featureChild) {
          let featureType = featureChild.type;
          if (featureType == 'mRNA') {
              if (isoform_count < MAX_ISOFORMS) {
                  isoform_count += 1;

                  viewer.append('polygon')
                      .attr('class', 'GF trans_arrow')
                      .attr('points', arrow_points)
                      .attr('transform', function () {
                          if (feature.strand > 0) {
                              return 'translate(' + Number(x(featureChild.fmax)) + ',' + Number((isoform_view_height / 2.0) - (arrow_height / 2.0) + (isoform_height * isoform_count) + isoform_title_height) + ')';
                          }
                          else {
                              return 'translate(' + Number(x(featureChild.fmin)) + ',' + Number((isoform_view_height / 2.0) + (arrow_height / 2.0) + (isoform_height * isoform_count) + isoform_title_height) + ') rotate(180)';
                          }
                      });

                  viewer.append('rect')
                      .attr('class', 'GF transcript_backbone')
                      .attr('x', x(featureChild.fmin))
                      .attr('y', isoform_height * isoform_count + isoform_title_height)
                      .attr('transform', 'translate(0,' + ( (isoform_view_height / 2.0) - (transcript_backbone_height / 2.0)) + ')')
                      .attr('height', transcript_backbone_height)
                      .attr('width', x(featureChild.fmax) - x(featureChild.fmin));

                  viewer.append('text')
                      .attr('class', 'GF transcriptLabel')
                      .attr('x', x(feature.fmin) + 30)
                      .attr('y', isoform_height * isoform_count + isoform_title_height)
                      .attr('fill', selected ? 'sandybrown' : 'gray')
                      .attr('opacity', selected ? 1 : 0.5)
                      .attr('height', isoform_title_height)
                      .text(featureChild.name);

                  // have to sort this so we draw the exons BEFORE the CDS
                  featureChild.children = featureChild.children.sort(function (a, b) {

                      let sortAValue = sortWeight[a.type];
                      let sortBValue = sortWeight[b.type];

                      if (typeof sortAValue == 'number' && typeof sortBValue == 'number') {
                          return sortAValue - sortBValue;
                      }
                      else {
                          // NOTE: type not found and weighted
                          return a.type - b.type;
                      }
                  });

                  featureChild.children.forEach(function (innerChild) {
                      let innerType = innerChild.type;
                      if (innerType == 'exon') {
                          viewer.append('rect')
                              .attr('class', 'GF exon')
                              .attr('x', x(innerChild.fmin))
                              .attr('y', isoform_height * isoform_count + isoform_title_height)
                              .attr('transform', 'translate(0,' + ( (isoform_view_height / 2.0) - (exon_height / 2.0)) + ')')
                              .attr('height', exon_height)
                              .attr('z-index', 10)
                              .attr('width', x(innerChild.fmax) - x(innerChild.fmin));
                      }
                      else if (innerType == 'CDS') {
                          viewer.append('rect')
                              .attr('class', 'GF CDS')
                              .attr('x', x(innerChild.fmin))
                              .attr('y', isoform_height * isoform_count + isoform_title_height)
                              .attr('transform', 'translate(0,' + ( (isoform_view_height / 2.0) - (cds_height / 2.0)) + ')')
                              .attr('z-index', 20)
                              .attr('height', cds_height)
                              .attr('width', x(innerChild.fmax) - x(innerChild.fmin));
                      }
                      else if (innerType == 'UTR' || innerType == 'five_prime_UTR' || innerType == 'three_prime_UTR') {
                          viewer.append('rect')
                              .attr('class', 'GF UTR')
                              .attr('x', x(innerChild.fmin))
                              .attr('y', isoform_height * isoform_count + isoform_title_height)
                              .attr('transform', 'translate(0,' + ( (isoform_view_height / 2.0) - (utr_height / 2.0)) + ')')
                              .attr('z-index', 20)
                              .attr('height', utr_height)
                              .attr('width', x(innerChild.fmax) - x(innerChild.fmin));
                      }
                  });
              }
              else if (isoform_count > MAX_ISOFORMS) {
                  ++isoform_count;
                  viewer.append('a')
                      .attr('class', 'GF transcriptLabel')
                      .attr('xlink:href', externalUrl)
                      // .attr('xlink:show', 'new')
                      .append('text')
                      .attr('x', x(feature.fmin) + 30)
                      .attr('y', isoform_height * isoform_count + isoform_title_height)
                      .attr('fill', 'red')
                      .attr('opacity', 1)
                      .attr('height', isoform_title_height)
                      .text('Maximum features displayed.  See full view for more.');
              }
          }
      });
  }


  if (isoform_count === 0) {
      viewer.append('text')
          .attr('x', 30)
          .attr('y', isoform_title_height + 10)
          .attr('fill', 'orange')
          .attr('opacity', 0.6)
          // .attr('height', isoform_title_height)
          .text('Overview of non-coding genome features unavailable at this time.');
  }
  else {
      viewer.append('g')
          .attr('class', 'GF axis')
          .attr('width', width)
          .attr('height', 20)
          .attr('transform', 'translate(0,20)')
          .call(xAxis);
  }
}

export default {
  props: {
    mygeneData: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
    };
  },
  mounted() {
    drawIntoSVG(this.mygeneData);
  },
  methods: {
  }
};
</script>
<style>
.GF.trans_arrow{
    fill: 'black'
}

.GF.exon{
    fill-opacity: 1.0;
    fill: white;
    stroke: black;
}

.GF.UTR{
    fill-opacity: 1.0;
    fill: white;
    stroke: black;
}

.GF.CDS{
    fill: #3E82BF;
    fill-opacity: 1.0;
}

.GF.axis{
    fill: #609C9C;
}

.GF.viewer{
    fill: gray;
}

.GF.gene{
    fill: blue;
}

.GF.geneLabel{
    stroke: 2px;
    color: black;
    font-style: italic;
}

.GF.transcriptLabel{
    stroke: 1px;
    color: black;
}

.GF.axis { font: 14px sans-serif; }

#genomeFeature {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;
}

</style>
