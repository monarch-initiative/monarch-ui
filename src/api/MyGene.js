/* eslint import/prefer-default-export: 0 */

import axios from 'axios';

// http://docs.mygene.info/en/latest/doc/data.html#species
function getSpeciesFromTaxId(taxid) {
  switch (taxid) {
    case 9606:
      return 'Homo sapiens';
    case 10090:
      return 'Mus musculus';
    case 10116:
      return 'Rattus norvegicus';
    case 7227:
      return 'Drosophila melanogaster';
    case 6239:
      return 'Caenorhabditis elegans';
    case 7955:
      return 'Danio rerio';
    // unsupported
    // case 3702:
    //     return 'Arabidopsis thaliana';
    // case 8364:
    //     return 'Xenopus tropicalis';
    // case 9823:
    //     return 'Sus scrofa';
    default:
      return null;
  }
}

export async function getGeneDescription(geneId) {
  const mygeneURL = 'https://mygene.info/v3/query';

  // http://docs.mygene.info/en/latest/doc/data.html#species
  // http://docs.mygene.info/en/latest/doc/query_service.html#available-fields
  let formattedId = '';
  let speciesParam = 'all';

  if (geneId.match(/^NCBIGene/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, '$1');
  }
  else if (geneId.match(/^OMIM/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'mim:$1');
    speciesParam = 9606;
  }
  else if (geneId.match(/^MGI/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'mgi:MGI\\\\:$1');
    speciesParam = 10090;
  }
  else if (geneId.match(/^FlyBase/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'flybase:$1');
    speciesParam = 7227;
  }
  else if (geneId.match(/^Wormbase/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'wormbase:$1');
    speciesParam = 6239;
  }
  else if (geneId.match(/^ZFIN/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'zfin:$1');
    speciesParam = 7955;
  }
  else if (geneId.match(/^RGD/)) {
    formattedId = geneId.replace(/\S+:(\d+)/, 'rgd:$1');
    speciesParam = 10116;
  }
  else {
    formattedId = geneId;
  }

  const mygeneParams = {
    q: formattedId,
    fields: 'summary,genomic_pos,name,symbol,taxid',
    species: speciesParam,
  };

  const mygeneResponse = await axios.get(mygeneURL, { params: mygeneParams });

  // console.log('mygeneResponse', mygeneResponse);

  const result = mygeneResponse.data;

  if (result.hits.length > 0 && result.hits[0].genomic_pos) {
    const hit = result.hits[0];
    // console.log('hit', hit);

    const symbol = hit.symbol;
    const locationObj = hit.genomic_pos;
    let taxid = hit.taxid;
    if (locationObj) {
      // sometimes data is not on the genomic position
      if (!taxid) {
        taxid = locationObj.taxid;
      }
      // use this mapping: http://docs.mygene.info/en/latest/doc/data.html#species
      const thisSpecies = getSpeciesFromTaxId(taxid);
      if (!thisSpecies) {
        console.log('Species not found from mygene.info.  Not showing genome features.');
      }
      else {
        const defaultTrackName = 'All Genes'; // this is the generic track name
        const locationString = locationObj.chr + ':' + locationObj.start + '..' + locationObj.end;
        const apolloServerPrefix = 'https://agr-apollo.berkeleybop.io/apollo/';
        const externalUrl = 'http://jbrowse.alliancegenome.org/jbrowse/index.html?data=data/' + encodeURI(thisSpecies) + '&loc=' + encodeURI(locationString);
        const trackDataPrefix = apolloServerPrefix + 'track/' + encodeURI(thisSpecies) + '/' + defaultTrackName + '/' + encodeURI(locationString) + '.json';
        const trackDataWithHighlightURL = trackDataPrefix + '?name=' + symbol;

        // console.log('trackDataWithHighlight', trackDataWithHighlightURL);
        const trackResponse = await axios.get(trackDataWithHighlightURL);
        // console.log('trackResponse', trackResponse.data);

        result.trackResponse = trackResponse.data;
        result.externalURL = externalUrl;
      }
    }
  }
  else {
    console.log('getGeneDescription() no genomic_pos found.');
  }

  return result;
}


/*
function fetchGeneDescription(geneId) {
    //https://mygene.info/v2/query?q=6469&fields=summary
    const spinnerArgs = {
        id: 'my-gene-spinner',
        class: 'progress progress-striped active',
        style: 'width: 3em;display:inline-block; margin:0;'
    };
    const spinner = MonarchCommon.makeSpinnerDiv(spinnerArgs);
    jQuery('#mygene-container').show();
    jQuery('#mygene-container .node-description').append(spinner.to_string());

    const serviceURL = 'https://mygene.info/v3/query';
    let formattedId = '';
    // http://docs.mygene.info/en/latest/doc/data.html#species
    //Format, see http://docs.mygene.info/en/latest/doc/query_service.html#available-fields
    var speciesParam = 'all';

    if (geneId.match(/^NCBIGene/)) {
        formattedId = geneId.replace(/\S+:(\d+)/, '$1');
    } else if (geneId.match(/^OMIM/)) {
        formattedId = geneId.replace(/\S+:(\d+)/, 'mim:$1');
        speciesParam = 9606
    } else if (geneId.match(/^MGI/)) {
        formattedId = geneId.replace(/\S+:(\d+)/, 'mgi:MGI\\\\:$1');
        speciesParam = 10090
    } else if (geneId.match(/^FlyBase/)) {
        formattedId = geneId.replace(/\S+:(\d+)/, 'flybase:$1');
        speciesParam = 7227
    } else if (geneId.match(/^Wormbase/)) {
        formattedId = geneId.replace(/\S+:(\d+)/, 'wormbase:$1');
        speciesParam = 6239
    } else if (geneId.match(/^ZFIN/)) {
        formattedId = geneId.replace(/\S+:(\d+)/, 'zfin:$1');
        speciesParam = 7955
    } else if (geneId.match(/^RGD/)) {
        formattedId = geneId.replace(/\S+:(\d+)/, 'rgd:$1');
        speciesParam = 10116
    } else {
        formattedId = geneId
    }
    const params = {
        q: formattedId,
        fields: 'summary,genomic_pos,name,symbol,taxid',
        species: speciesParam
    };

    jQuery.ajax({
        url: serviceURL,
        dataType: 'json',
        data: params,
        error() {
            console.log('fetchGeneDescription. Error fetching info from mygene');
            jQuery('#mygene-container').hide();
            jQuery('#' + spinner.get_id()).remove();
        },
        success(data) {
            jQuery('#' + spinner.get_id()).remove();
            if (data.hits.length > 0 && 'genomic_pos' in data.hits[0]) {
                let hit = data.hits[0];
                let symbol = hit.symbol;
                let locationObj = hit.genomic_pos;
                let taxid = hit.taxid ;
                if (locationObj) {
                    // sometimes data is not on the genomic position
                    if(!taxid){
                        taxid = locationObj.taxid;
                    }
                    // use this mapping: http://docs.mygene.info/en/latest/doc/data.html#species
                    let thisSpecies = getSpeciesFromTaxId(taxid);
                    if(!thisSpecies){
                        console.log('Species not found from mygene.info.  Not showing genome features.');
                        hideGeneDescription(spinner);
                        return ;
                    }

                    let defaultTrackName = 'All Genes'; // this is the generic track name
                    let locationString = locationObj.chr + ':' + locationObj.start + '..' + locationObj.end;
                    let apolloServerPrefix = 'https://agr-apollo.berkeleybop.io/apollo/';
                    let externalUrl = 'http://jbrowse.alliancegenome.org/jbrowse/index.html?data=data/'+encodeURI(thisSpecies) + '&loc='+encodeURI(locationString);
                    let trackDataPrefix = apolloServerPrefix + 'track/' + encodeURI(thisSpecies) + '/' + defaultTrackName + '/' + encodeURI(locationString) + '.json';
                    let trackDataWithHighlight = trackDataPrefix + '?name=' + symbol;


                    jQuery.ajax({
                        url: trackDataWithHighlight,
                        dataType: 'json',
                        error() {
                            console.log('Failed to fetch the genome feature data');
                        },
                        success(data) {
                            // http://jbrowse.alliancegenome.org/jbrowse/index.html?data=data%2FDanio rerio&tracks=All Genes&highlight=&lookupSymbol=sox9b
                            let svgDataElt =
                                '<svg id="genome-feature" width="80%">' +
                                +'</svg>';
                            jQuery('#mygene-feature').append(svgDataElt);


                            let dataRange = findRange(data);
                            let view_start = dataRange.fmin;
                            let view_end = dataRange.fmax;
                            let exon_height = 10; // will be white / transparent
                            let cds_height = 10; // will be colored in
                            let isoform_height = 40; // height for each isoform
                            let isoform_view_height = 20; // height for each isoform
                            let isoform_title_height = 0; // height for each isoform
                            let utr_height = 10 ; // this is the height of the isoform running all of the way through
                            let transcript_backbone_height = 4; // this is the height of the isoform running all of the way through
                            let arrow_height = 20;
                            let arrow_width = 10;
                            let arrow_points = '0,0 0,' + arrow_height + ' ' + arrow_width + ',' + arrow_width;
                            let sortWeight = {
                                'exon': 100
                                , 'UTR': 200
                                , 'five_prime_UTR': 200
                                , 'three_prime_UTR': 200
                                , 'CDS': 1000
                            };

                            let calculatedHeight = '600px';
                            let numberIsoforms = countIsoforms(data);
                            if (numberIsoforms > this.MAX_ISOFORMS) {
                                calculatedHeight = (this.MAX_ISOFORMS + 2) * isoform_height;
                            }
                            else {
                                calculatedHeight = (numberIsoforms + 1) * isoform_height;
                            }
                            let margin = {top: 8, right: 30, bottom: 30, left: 40},
                                width = 960 - margin.left - margin.right,
                                height = calculatedHeight - margin.top - margin.bottom;

                            // MEAT here
                            let x = scaleLinear()
                                .domain([view_start, view_end])
                                .range([0, width]);

                            let tickFormat = x.tickFormat(5, '.2s');

                            let xAxis = axisTop(x)
                                .ticks(10, 's')
                                .tickSize(8)
                                .tickFormat(tickFormat);

                            let viewer = select('#genome-feature')
                                .attr('width', width + margin.left + margin.right)
                                .attr('height', height + margin.top + margin.bottom)
                                .append('a')
                                .attr('xlink:href', externalUrl)
                                .append('g')
                                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                            let isoform_count = 0;
                            let MAX_ISOFORMS = 10;
                            for (let i in data) {

                                let feature = data[i];
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


                            if (isoform_count == 0) {
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
                    });
                }
            }
            else {
                hideGeneDescription(spinner);
            }

            if (data.hits.length > 0 && 'summary' in data.hits[0]) {
                var hit = data.hits[0];
                var summary = hit.summary;
                var summaryElt = "<span>" + summary + ' [Retrieved from ' +
                    '<a href="' +
                    serviceURL + '?q=' + formattedId + '&fields=summary&species=all' +
                    '">Mygene.info</a>]</span>';
                jQuery('#mygene-description').append(summaryElt);

            }
            else {
                console.log('fetchGeneDescription. No Summary fetching info from mygene');
                jQuery('#mygene-description').hide();
                jQuery('#' + spinner.get_id()).remove();
            }
        }
    });
}
*/
