import axios from 'axios';
import us from 'underscore';
import * as bbopgraph from 'bbop-graph';
import getStaticSourceData from './StaticSourceData';
import * as bbopgraphUtil from './BBOPGraphUtil';
import { labelToId, isTaxonCardType, isSubjectCardType } from '../lib/TaxonMap';

// Example of a domain-specific (as opposed to a generic loadJSON)
// service function. This set of domain-specific services will pretty much
// correspond to the set of needed services for the Monarch UI application, and may
// not necessarily be the same set of functions needed by a generic client
// of Monarch's services/data. In other words, we can add convenience/aggregation
// services here that may not make sense for general-purpose use. Our goal
// with this BioLink API module is to isolate the UI from the service layer,
// and only secondarily, to create a general-purpose service layer.
//


const servers = {
  development: {
    'type': 'development',
    'app_base': 'https://monarchinitiative.org',
    'scigraph_url': 'https://scigraph-ontology-dev.monarchinitiative.org/scigraph/',
    'scigraph_data_url': 'https://scigraph-data-dev.monarchinitiative.org/scigraph/',
    'golr_url': 'https://solr-dev.monarchinitiative.org/solr/golr/',
    'search_url': 'https://solr-dev.monarchinitiative.org/solr/search/',
    'owlsim_services_url': 'https://beta.monarchinitiative.org/owlsim',
    'analytics_id': '',
    'biolink_url': 'https://api-dev.monarchinitiative.org/api/',
  },

  beta: {
    'type': 'beta',
    'app_base': 'https://beta.monarchinitiative.org',
    'scigraph_url': 'https://scigraph-ontology-dev.monarchinitiative.org/scigraph/',
    'scigraph_data_url': 'https://scigraph-data-dev.monarchinitiative.org/scigraph/',
    'golr_url': 'https://solr.monarchinitiative.org/solr/golr/',
    'search_url': 'https://solr.monarchinitiative.org/solr/search/',
    'owlsim_services_url': 'https://beta.monarchinitiative.org/owlsim',
    'analytics_id': '',
    'biolink_url': 'https://api-dev.monarchinitiative.org/api/'
  },

  production: {
    'type': 'production',
    'app_base': 'https://monarchinitiative.org',
    'scigraph_url': 'https://scigraph-ontology.monarchinitiative.org/scigraph/',
    'scigraph_data_url': 'https://scigraph-data.monarchinitiative.org/scigraph/',
    'golr_url': 'https://solr.monarchinitiative.org/solr/golr/',
    'search_url': 'https://solr.monarchinitiative.org/solr/search/',
    'owlsim_services_url': 'https://monarchinitiative.org/owlsim',
    'analytics_id': '',
    'biolink_url': 'https://api.monarchinitiative.org/api/',
  }

};

export const productionServers = [
  'monarchinitiative.org'
];

const defaultApiServer =
  (productionServers.includes(window.location.hostname)) ? 'production' : 'development';

const apiServer = (new URLSearchParams(document.location.search.substring(1))).get('api') || defaultApiServer;
// console.log('apiServer', window.location.hostname, apiServer);

const serverConfiguration = servers[apiServer];
export const biolink = serverConfiguration.biolink_url;
const scigraph = serverConfiguration.scigraph_url;

/**
  Lighter-weight BioLink node info. Used by LocalNav.vue
 */

export async function getNodeSummary(nodeId, nodeType) {
  const bioentityUrl = `${biolink}bioentity/${nodeType}/${nodeId}`;
  // console.log('getNodeSummary', nodeId, nodeType, bioentityUrl);

  const params = {
    fetch_objects: false,
    unselect_evidence: true,
    exclude_automatic_assertions: true,
    use_compact_associations: false,
    get_association_counts: false,
    rows: 0
  };

  const bioentityResp = await axios.get(bioentityUrl, { params });
  const nodeSummary = bioentityResp.data;
  nodeSummary.type = nodeType;

  return nodeSummary;
}

/*
  Return our envrionment
 */
export function getCurrentServerEnvironment() {
  return apiServer;
}

/**
 Get node info to support Node.vue
 */

export async function getNode(nodeId, nodeType) {
  let bioentityUrl = `${biolink}bioentity/${nodeType}/${nodeId}`;
  if (nodeType === 'function') {
    bioentityUrl = `${biolink}bioentity/${nodeId}`;
  }

  const params = {
    fetch_objects: false,
    unselect_evidence: true,
    exclude_automatic_assertions: true,
    use_compact_associations: false,
    get_association_counts: true,
    rows: 1
  };

  const nodeSummary = axios.get(bioentityUrl, { params })
    .then((bioentityResp) => {
      const bioentityResponseData = bioentityResp.data;

      if (!bioentityResponseData.xrefs) {
        bioentityResponseData.xrefs = [];
      }

      if (!bioentityResponseData.description) {
        bioentityResponseData.description = '';
      }

      bioentityResponseData.type = nodeType;
      // TODO rename uri to iri downstream
      // are we even using this anymore?
      bioentityResponseData.uri = bioentityResponseData.iri;
      return bioentityResponseData;
    });

  return nodeSummary;
}

/**
 Get basic node info when node type is unknown
 */
export async function getBasicNode(nodeId) {
  const bioentityUrl = `${biolink}bioentity/${nodeId}`;

  return new Promise((resolve, reject) => {
    axios.get(bioentityUrl)
      .then((resp) => {
        const responseData = resp.data;
        if (typeof responseData !== 'object') {
          reject(responseData);
        } else {
          resolve(responseData);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function canUseSuperclassNode(nodeId, nodeType, superId) {
  let result = true;

  if (nodeType === 'disease') {
    result = nodeId !== 'MONDO:0000001'; // superId !== 'OBI:1110055' && superId !== 'BFO:0000016';
  } else if (nodeType === 'anatomy') {
    result = nodeId !== 'UBERON:0001062';
  } else if (nodeType === 'phenotype') {
    result = nodeId !== 'UPHENO:0001001';
  } else if (nodeType === 'function') {
    result = nodeId !== 'GO:0003674';
  } else if (nodeType === 'pathway') {
    result = nodeId !== 'GO:0008150';
  }
  return result;
}

const neighborhoodTypes = [
  'disease',
  'phenotype',
  'anatomy',
  'function'
];

export async function getNeighborhood(nodeId, nodeType) {
  // KS - This function is becoming a bit unwieldy
  // and looks an awful lot like
  // https://github.com/monarch-initiative/monarch-app/
  // blob/master/lib/monarch/api.js#L2459
  const graphUrl = `${biolink}graph/edges/from/${nodeId}`;
  const nodeMap = {};
  const equivalentClasses = [];
  const superclasses = [];
  const subclasses = [];
  let xrefs = [];
  const synonyms = {};
  const synonymMap = {
    'Exact Synonym': 'http://www.geneontology.org/formats/oboInOwl#hasExactSynonym',
    'Narrow Synonym': 'http://www.geneontology.org/formats/oboInOwl#hasNarrowSynonym',
    'Broad Synonym': 'http://www.geneontology.org/formats/oboInOwl#hasBroadSynonym',
    'Related Synonym': 'http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym'
  };

  const xrefProp = 'http://www.geneontology.org/formats/oboInOwl#hasDbXref';

  const internalId = new RegExp(/MONDO|:?MONARCH|PHENOTYPE$/);

  const params = new URLSearchParams();

  if (neighborhoodTypes.includes(nodeType)) {
    params.append('relationship_type', 'equivalentClass');
    params.append('relationship_type', 'subClassOf');
    params.append('relationship_type', 'BFO:0000050');
  } else {
    params.append('relationship_type', 'equivalentClass');
  }

  const graphResponse = await axios.get(graphUrl, { params });
  const graphResponseData = graphResponse.data;

  // console.log('getNeighborhood', nodeId, graphUrl);
  // console.log(JSON.stringify(graphResponseData, null, 2));

  if (graphResponseData.nodes) {
    graphResponseData.nodes.forEach((node) => {
      if (!(xrefProp in node.meta)) {
        node.meta[xrefProp] = [];
      }
      nodeMap[node.id] = node;

    });
  }
  xrefs = nodeMap[nodeId].meta[xrefProp]
    .map((elem) => {
      if (elem.startsWith('Orphanet')) {
        elem = elem.replace('Orphanet', 'ORPHA');
      } else if (/^OMIMPS:\d/.test(elem)) {
        elem = elem.replace('PS:', 'PS:PS');
      }
      return elem;
    });

  Object.keys(synonymMap).forEach((key) => {
    if (synonymMap[key] in nodeMap[nodeId].meta) {
      synonyms[key] = nodeMap[nodeId].meta[synonymMap[key]]
        .map(syn => syn.replace(',', ''));
    } else {
      synonyms[key] = [];
    }
  });

  if (!internalId.test(nodeId)) {
    // Unless we own the Id (Mondo/Monarch), the IDs
    // themselves represent an external source, eg
    // HGNC:123 should link to HGNC
    xrefs = xrefs.concat([nodeId]);
  }

  if (graphResponseData.edges) {
    graphResponseData.edges.forEach((edge) => {
      // subClassOf|part of closure
      if (edge.pred === 'subClassOf' || edge.pred === 'BFO:0000050') {
        if (edge.sub === nodeId) {
          // console.log('Superclass Edge', edge.sub, edge.pred, edge.obj);
          if (canUseSuperclassNode(nodeId, nodeType, edge.obj)) {
            superclasses.push(edge.obj);
          }
        } else if (edge.obj === nodeId) {
          // console.log('Subclass Edge', edge.sub, edge.pred, edge.obj);

          // remove hacks around subclassing UPHENO:0001001 by filtering
          // anything but monarch.owl
          if (nodeId === 'UPHENO:0001001'
               && 'isDefinedBy' in edge.meta
               && !edge.meta.isDefinedBy.includes('http://purl.obolibrary.org/obo/upheno/monarch.owl')
          ) {
            return;
          }
          subclasses.push(edge.sub);
        } else {
          // console.log('Unexpected edge', nodeId, edge.sub, edge.pred, edge.obj);
        }
      } else if (edge.pred === 'equivalentClass') {
        // console.log('Equiv Edge', edge.sub, edge.pred, edge.obj);
        if (edge.sub === nodeId) {
          equivalentClasses.push(edge.obj);
          // Clean up OBO:NS_1234 curies
          const newXref = edge.obj.replace('OBO:', '').replace('_', ':');
          xrefs = xrefs.concat([newXref], nodeMap[edge.obj].meta[xrefProp]);

          Object.keys(synonyms).forEach((key) => {
            if (synonymMap[key] in nodeMap[edge.obj].meta) {
              synonyms[key] = synonyms[key]
                .concat(
                  nodeMap[edge.obj].meta[synonymMap[key]]
                    .map(syn => syn.replace(',', ''))
                );
            }
          });

        } else {
          // TO DO DRY this off
          equivalentClasses.push(edge.sub);
          const newXref = edge.sub.replace('OBO:', '').replace('_', ':');
          xrefs = xrefs.concat([newXref], nodeMap[edge.sub].meta[xrefProp]);

          Object.keys(synonyms).forEach((key) => {
            if (synonymMap[key] in nodeMap[edge.sub].meta) {
              synonyms[key] = synonyms[key]
                .concat(
                  nodeMap[edge.sub].meta[synonymMap[key]]
                    .map(syn => syn.replace(',', ''))
                );
            }
          });

        }
      }
      // else {
      //   console.log('getNeighborhood unhandled edge type', nodeId, edge.pred);
      //   console.log(JSON.stringify(edge, null, 2));
      // }
    });
    // Uniquify xrefs and synonyms
    xrefs = us.uniq(xrefs);

    Object.keys(synonyms).forEach((key) => {
      synonyms[key] = us.uniq(synonyms[key]);
    });
  }

  return {
    nodeMap,
    equivalentClasses,
    superclasses,
    subclasses,
    xrefs,
    synonyms
  };
}

const categoriesAll = [
  'gene',
  'variant',
  'genotype',
  'phenotype',
  'disease',
  'goterm',
  'pathway',
  'anatomy',
  'substance',
  'individual',
  'case',
  'publication',
  'model',
  'anatomical entity',
];


function pruneUnusableCategories(data) {
  const categoryCounts = data.facet_counts.category;
  Object.keys(categoryCounts).forEach((key) => {
    if (categoriesAll.indexOf(key) === -1) {
      delete categoryCounts[key];
    }
  });
}


export async function getSources() {
  // Dataset metadata pulled from scigraph follow this schema:
  // https://www.w3.org/TR/2015/NOTE-hcls-dataset-20150514/Figure1.png
  // and are emitted by Biolink-API as BBOP graph json
  // https://berkeleybop.github.io/bbop-graph/doc/index.html

  // get dynamic data from biolink-api and put in BBOP graph
  const dynamicSourceDataGraph = new bbopgraph.graph(); // eslint-disable-line new-cap
  try {
    const url = `${biolink}metadata/datasets`;
    const params = new URLSearchParams();
    const dynamicSourceData = await axios.get(url, { params });
    dynamicSourceDataGraph.load_base_json(dynamicSourceData.data);
  } catch (error) {
    // console.log('Error calling biolink-api dataset metadata endpoint: ' + error);
  }

  // make object for view that is populated with summary and version IRIs from Biolink-api, and blank attributes
  // for each source. All dynamic items are findable from summary and version IRIs per HCLS schema.
  let sourceData = us.chain(dynamicSourceDataGraph.all_edges())
    .filter(function fn(edge) {
      return edge._predicate_id === 'dc:isVersionOf';
    })
    .map(function fn(edge) {
      return { '_version_iri': edge._subject_id, '_summary_iri': edge._object_id };
    })
    .map(bbopgraphUtil.populateSourceTemplate)
    .value();

  // put things from dynamic data into sourceData
  bbopgraphUtil.populateIngestDate(sourceData, dynamicSourceDataGraph);
  bbopgraphUtil.populateRdfDownloadUrl(sourceData, dynamicSourceDataGraph);
  bbopgraphUtil.populateSourceFiles(sourceData, dynamicSourceDataGraph);

  // We still need static data for some things, e.g. source display name, text descriptions of each source,
  // and usage, since these aren't in Scigraph (and possibly shouldn't be). Any item in staticSourceData will overwrite
  // item from dynamic data, to allow us to override stuff from db using static data
  const staticSourceData = getStaticSourceData();
  sourceData = bbopgraphUtil.mergeStaticData(sourceData, staticSourceData);

  return sourceData;
}

export async function getSearchResults(query, start, rows, categories, taxa) {
  const bioentityUrl = `${biolink}search/entity/${query}`;
  const params = new URLSearchParams();
  params.append('start', start);
  params.append('rows', rows);
  params.append('highlight_class', 'hilite');
  params.append('boost_q', 'category:genotype^-10');
  params.append('boost_q', 'category:variant^-35');
  params.append('boost_q', 'category:publication^-10');
  params.append('prefix', '-OMIA');
  params.append('min_match', '67%');


  let categoriesLocal = categories;
  if (!categoriesLocal || categoriesLocal.length === 0) {
    categoriesLocal = categoriesAll;
  }

  categoriesLocal.forEach((elem) => {
    params.append('category', elem);
  });

  if (taxa && taxa.length > 0) {
    taxa.forEach((elem) => {
      const taxonId = elem.startsWith('NCBITaxon') ? elem : labelToId(elem);
      params.append('taxon', taxonId);
    });
  }

  const bioentityResp = await axios.get(bioentityUrl, { params });
  pruneUnusableCategories(bioentityResp.data);
  return bioentityResp.data;
}


export async function getSearchTermSuggestions(term, category, prefixes, filters) {
  const baseUrl = `${biolink}search/entity/autocomplete/`;
  const urlExtension = `${baseUrl}${term}`;
  const params = new URLSearchParams();
  params.append('rows', 10);
  params.append('start', 0);
  params.append('highlight_class', 'hilite');
  params.append('boost_q', 'category:genotype^-10');
  params.append('boost_q', 'category:variant^-35');
  params.append('boost_q', 'category:publication^-10');
  params.append('prefix', '-OMIA');
  params.append('min_match', '50%');
  params.append('boost_fx', 'pow(edges,0.1)');

  if (prefixes && prefixes.length) {
    prefixes.forEach((elem) => {
      params.append('prefix', elem);
    });
  }

  if (!category || category === 'all') {
    category = categoriesAll;
  } else if (!Array.isArray(category)) {
    category = [category];
  }

  category.forEach((elem) => {
    params.append('category', elem);
  });

  if (category.length === 1) {
    if (category[0] === 'gene') {
      params.append('boost_fx', 'pow(edges,0.334)');
    }
    if (category[0] === 'variant' || category[0] === 'genotype') {
      params.append('minimal_tokenizer', true);
    }
  }

  if (filters) {
    filters.forEach((elem) => {
      params.append('fq', filters);
    });
  }

  return new Promise((resolve, reject) => {
    axios.get(urlExtension, { params })
      .then((resp) => {
        const responseData = resp.data;
        if (typeof responseData !== 'object') {
          reject(responseData);
        } else {
          resolve(responseData);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getBiolinkAnnotation(cardType) {
  let result = `${cardType}s`;
  if (cardType === 'anatomy') {
    result = 'expression/anatomy';
  } else if (cardType === 'ortholog-phenotype') {
    result = 'ortholog/phenotypes';
  } else if (cardType === 'ortholog-disease') {
    result = 'ortholog/diseases';
  } else if (cardType === 'causal-disease' || cardType === 'correlated-disease') {
    result = 'diseases';
  } else if (cardType === 'causal-gene' || cardType === 'correlated-gene') {
    result = 'genes';
  } else if (cardType === 'function') {
    result = cardType;
  }

  return result;
}

export async function getNodeAssociations(nodeType, nodeId, cardType, taxons, parms) {
  const baseUrl = `${biolink}bioentity/`;
  const biolinkMappedCardType = getBiolinkAnnotation(cardType);
  const urlExtension = `${nodeType}/${nodeId}/${biolinkMappedCardType}`;
  let url = `${baseUrl}${urlExtension}`;
  const useTaxonRestriction = taxons && taxons.length > 0 && isTaxonCardType(cardType);
  if (useTaxonRestriction) {
    parms.start = 0;
    parms.rows = 10000;
  }

  const params = new URLSearchParams();
  Object.keys(parms).forEach(function fcnAppend(key) {
    params.append(key, parms[key]);
  });
  params.append('unselect_evidence', true);

  // Use monarch solr until amigo-ontobio connection is ready
  if (cardType === 'function') {
    url = `${biolink}association/type/gene_function`;
    params.append('subject', nodeId);
  }

  if (cardType.startsWith('causal')) {
    params.append('association_type', 'causal');
  } else if (cardType.startsWith('correlated')) {
    params.append('association_type', 'non_causal');
  }

  if (isTaxonCardType(cardType)) {
    params.append('facet', true);
    if (isSubjectCardType(cardType)) {
      params.append('facet_fields', 'subject_taxon');
    } else {
      params.append('facet_fields', 'object_taxon');
    }

    if (taxons != null && taxons !== -1) {
      if (taxons.length > 1) {
        taxons.forEach((elem) => {
          params.append('taxon', elem);
        });
      } else {
        params.append('taxon', taxons[0]);
      }

      params.append('direct_taxon', true);
    }

  }

  const response = await axios.get(url, { params });

  if (useTaxonRestriction) {
    response.data.associations = response.data.associations.filter((d) => {
      const subjTaxon = d.subject.taxon;
      const objTaxon = d.object.taxon;
      let result = false;
      if (subjTaxon.id !== null && taxons.indexOf(subjTaxon.id) >= 0) {
        result = true;
      }
      if (objTaxon.id !== null && taxons.indexOf(objTaxon.id) >= 0) {
        result = true;
      }
      return result;
    });
    response.data.numFound = response.data.associations.length;
  }
  return response;
}

// TODO figure out if we still need this (see AnalyzePhenotypes.vue)
export async function getNodeLabelByCurie(curie) {
  const baseUrl = `${biolink}bioentity/${curie}`;
  const params = {
    fetch_objects: true,
    rows: 100
  };

  return new Promise((resolve, reject) => {
    axios.get(baseUrl, { params })
      .then((resp) => {
        const responseData = resp;
        if (typeof responseData !== 'object') {
          reject(responseData);
        } else {
          resolve(responseData);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function comparePhenotypes(sourceList, compareList, mode) {
  let comparePromise;
  if (mode === 'search') {
    const baseUrl = `${biolink}sim/search`;
    const params = new URLSearchParams();
    sourceList.forEach(item => params.append('id', item.id));
    if (compareList.length === 1) {
      params.append('taxon', compareList[0].groupId);
      comparePromise = new Promise((resolve, reject) => {
        axios.get(baseUrl, { params })
          .then((resp) => {
            const responseData = resp;
            if (typeof responseData !== 'object') {
              reject(responseData);
            } else {
              resolve(responseData);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
    if (compareList.length > 1) {
      const requestList = [];
      compareList.forEach((item) => {
        params.append('taxon', item.groupId);
        requestList.push(axios.get(baseUrl + '?' + params.toString()));
        params.delete('taxon');
      });
      comparePromise = new Promise((resolve, reject) => {
        axios.all(requestList).then(axios.spread((...responses) => {
          const responseData = {
            data: {
              matches: []
            }
          };
          responses.forEach((currentItem) => {
            responseData.data.matches.push(currentItem.data.matches);
          });
          responseData.data.matches = responseData.data.matches.flat();
          if (typeof responseData !== 'object') {
            reject(responseData);
          } else {
            resolve(responseData);
          }
        })).catch((err) => {
          reject(err);
        });
      });
    }
  } else {
    const baseUrl = `${biolink}sim/compare`;
    const isAllPhenotypes = compareList.filter(item => item.includes('HP:'));
    const featureSet = isAllPhenotypes.length > 0;
    sourceList = sourceList.map(source => source.id);
    const postBody = {
      'is_feature_set': featureSet,
      'reference_ids': sourceList,
      'query_ids': compareList
    };
    comparePromise = new Promise((resolve, reject) => {
      axios.post(baseUrl, postBody)
        .then((resp) => {
          const responseData = resp;
          if (typeof responseData !== 'object') {
            reject(responseData);
          } else {
            resolve(responseData);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  return comparePromise;
}

export async function annotateText(queryText, longestOnly = true) {
  const baseUrl = `${biolink}nlp/annotate/`;

  const params = new URLSearchParams();
  params.append('content', queryText);
  params.append('longestOnly', longestOnly);

  return new Promise((resolve, reject) => {
    axios.post(baseUrl, params, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((resp) => {
      const responseData = resp;
      if (typeof responseData !== 'object') {
        reject(responseData);
      } else {
        resolve(responseData);
      }
    })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getEvidence(evidenceId, nodeType) {
  const biolinkUrl = `${biolink}evidence/graph/${evidenceId}/table`;

  const params = {};

  if (nodeType === 'publication') {
    params.is_publication = true;
  }

  return new Promise((resolve, reject) => {
    axios.get(biolinkUrl, { params })
      .then((resp) => {
        const responseData = resp;
        if (typeof responseData !== 'object') {
          reject(responseData);
        } else {
          resolve(responseData);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getPhenotypeCategories(diseaseId) {
  const biolinkUrl = `${biolink}bioentity/disease/${diseaseId}/phenotypes`;
  const params = new URLSearchParams();
  params.append('rows', 0);
  params.append('facet', true);
  params.append('unselect_evidence', false);
  params.append('exclude_automatic_assertions', false);
  params.append('fetch_objects', false);
  params.append('use_compact_associations', false);
  params.append('direct', false);
  params.append('direct_taxon', false);
  const response = await axios.get(biolinkUrl, { params });
  if (response.data.facet_counts.closure_bin) {
    return response.data.facet_counts.closure_bin;
  }
  return {};
}
