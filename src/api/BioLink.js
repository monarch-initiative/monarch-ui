import axios from 'axios';
import us from 'underscore';
import { labelToId, isTaxonCardType } from '../lib/TaxonMap';
import getSourceInfo from './Sources'

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

};

const productionServers = [
  // 'localhost',
  'monarchinitiative.org',
];

const defaultApiServer =
  (productionServers.indexOf(window.location.hostname) >= 0) ? 'production' : 'development';

const apiServer = (new URLSearchParams(document.location.search.substring(1))).get('api') || defaultApiServer;
console.log('apiServer', window.location.hostname, apiServer);

const serverConfiguration = servers[apiServer];
const biolink = serverConfiguration.biolink_url;
const scigraph = serverConfiguration.scigraph_url;

/**
 Lighter-weight BL node info. Used by LocalNav.vue
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
export function getCurrentServerEnvironment(){
  return apiServer;
}


/**
 Get node info to support Node.vue
 */

export async function getNode(nodeId, nodeType) {
  let bioentityUrl = `${biolink}bioentity/${nodeType}/${nodeId}`;
  // console.log('getNodeSummary', nodeId, nodeType, bioentityUrl);

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

  const nodeSummary = axios.get(bioentityUrl, {params})
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
        }
        else {
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
  }
  else if (nodeType === 'anatomy') {
    result = nodeId !== 'UBERON:0001062';
  }
  else if (nodeType === 'phenotype') {
    result = nodeId !== 'UPHENO:0001001';
  }
  else if (nodeType === 'function') {
    result = nodeId !== 'GO:0003674';
  }
  else if (nodeType === 'pathway') {
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
  // const graphUrl = `${biolink}graph/node/${nodeId}`;
  const graphUrl = `${biolink}graph/edges/from/${nodeId}`;
  const nodeLabelMap = {};
  const xrefMap = {};
  const equivalentClasses = [];
  const superclasses = [];
  const subclasses = [];
  let xrefs = [];
  const xrefProp = "http://www.geneontology.org/formats/oboInOwl#hasDbXref";

  let params = {};

  if (!neighborhoodTypes.includes(nodeType)) {
    params.relationship_type = 'equivalentClass'
  }

  const graphResponse = await axios.get(graphUrl, { params });
  const graphResponseData = graphResponse.data;

  // console.log('getNeighborhood', nodeId, graphUrl);
  // console.log(JSON.stringify(graphResponseData, null, 2));

  if (graphResponseData.nodes) {
    graphResponseData.nodes.forEach((node) => {
      nodeLabelMap[node.id] = node.lbl;
      if (xrefProp in node.meta) {
        xrefMap[node.id] = node.meta[xrefProp];
      } else {
        xrefMap[node.id] = [];
      }
    });
  }

  xrefs = xrefMap[nodeId];

  if (nodeType !== 'disease') {
    // Unless we're on a disease page (Mondo), the IDs
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
        }
        else if (edge.obj === nodeId) {
          // console.log('Subclass Edge', edge.sub, edge.pred, edge.obj);
          subclasses.push(edge.sub);
        }
        else {
          // console.log('Unexpected edge', nodeId, edge.sub, edge.pred, edge.obj);
        }
      }
      else if (edge.pred === 'equivalentClass') {
        // console.log('Equiv Edge', edge.sub, edge.pred, edge.obj);
        if (edge.sub === nodeId) {
          // console.log('Skip duplicate equiv class', nodeId, edge.sub, edge.obj);
          equivalentClasses.push(edge.obj);
          xrefs = xrefs.concat([edge.obj], xrefMap[edge.obj]);
        }
        else {
          equivalentClasses.push(edge.sub);
          xrefs = xrefs.concat([edge.sub], xrefMap[edge.sub]);
        }
      }
      // else {
      //   console.log('getNeighborhood unhandled edge type', nodeId, edge.pred);
      //   console.log(JSON.stringify(edge, null, 2));
      // }
    });
    xrefs = us.uniq(xrefs);
  }

  return {
    nodeLabelMap,
    equivalentClasses,
    superclasses,
    subclasses,
    xrefs
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
  /*const url = `${biolink}metadata/datasets`;
  const params = new URLSearchParams();

  const bioentityResp = await axios.get(url, { params });

  // remove this after we get this stuff from the API
  for (let i = 0; i < bioentityResp.data.length; i++) {
    let sourceDisplayName = bioentityResp.data[i].id.split(/[:.]+/)[1];
    sourceDisplayName = sourceDisplayName.charAt(0).toUpperCase() + sourceDisplayName.slice(1);
    bioentityResp.data[i].sourceDisplayName = sourceDisplayName;
    bioentityResp.data[i].ttlUrl = 'https://data.monarchinitiative.org/ttl/' + bioentityResp.data[i].id.split(':')[1];
    bioentityResp.data[i].sourceVersion = bioentityResp.data[i].meta.version[0];
    bioentityResp.data[i].monarchDataReleaseDate = '2019-02-22';
  }

  const data = bioentityResp.data;*/

  return getSourceInfo();
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


export async function getSearchTermSuggestions(term, category, prefixes) {
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
  params.append('min_match', '67%');

  if (prefixes && prefixes.length) {
    prefixes.forEach((elem) => {
      params.append('prefix', elem);
    });
  }

  if (!category || category === 'all') {
    category = categoriesAll;
  }
  else {
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

  return new Promise((resolve, reject) => {
    axios.get(urlExtension, { params })
      .then((resp) => {
        const responseData = resp.data;
        if (typeof responseData !== 'object') {
          reject(responseData);
        }
        else {
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
  }
  else if (cardType === 'ortholog-phenotype') {
    result = 'ortholog/phenotypes';
  }
  else if (cardType === 'ortholog-disease') {
    result = 'ortholog/diseases';
  }
  else if (cardType === 'causal-disease' || cardType === 'noncausal-disease') {
    result = 'diseases';
  }
  else if (cardType === 'causal-gene' || cardType === 'noncausal-gene') {
    result = 'genes';
  }
  else if (cardType === 'function') {
    result = cardType;
  }

  return result;
}


export async function getNodeAssociations(nodeType, nodeId, cardType, taxons, params) {
  const baseUrl = `${biolink}bioentity/`;
  const biolinkMappedCardType = getBiolinkAnnotation(cardType);
  const urlExtension = `${nodeType}/${nodeId}/${biolinkMappedCardType}`;
  let url = `${baseUrl}${urlExtension}`;
  const useTaxonRestriction = taxons && taxons.length > 0 && isTaxonCardType(cardType);

  // Use monarch solr until amigo-ontobio connection is ready
  if (cardType === 'function') {
    url = `${biolink}association/type/gene_function`;
    params.subject = nodeId;
  }

  if (cardType.startsWith('causal')) {
    params.association_type = 'causal';
  } else if (cardType.startsWith('noncausal')) {
    params.association_type = 'non_causal';
  }

  if (useTaxonRestriction) {
    // console.log('getNodeAssociations', nodeType, nodeId, cardType);
    // console.log(JSON.stringify(params, null, 2));
    // console.log(JSON.stringify(taxons, null, 2));
    params.start = 0;
    params.rows = 10000;
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
        }
        else {
          resolve(responseData);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}


export function comparePhenotypes(phenotypesList, geneList, species = 'all', mode = 'search') {
  // WARNING this is about to be deprecated, replace with biolink compare
  const baseUrl = 'https://monarchinitiative.org/analyze/phenotypes.json?';
  const params = new URLSearchParams();
  const phenoCuries = phenotypesList.map(elem => elem.curie);
  params.append('input_items', phenoCuries);
  params.append('gene_items', geneList);
  params.append('target_species', species);
  params.append('mode', mode);
  return new Promise((resolve, reject) => {
    axios.get(baseUrl, { params })
      .then((resp) => {
        const responseData = resp;
        if (typeof responseData !== 'object') {
          reject(responseData);
        }
        else {
          resolve(responseData);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function annotateText(queryText, longestOnly) {
  const baseUrl = `${scigraph}annotations`;

  const params = new URLSearchParams();
  params.append('content', queryText);
  return new Promise((resolve, reject) => {
    axios.post(baseUrl, params, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then((resp) => {
      const responseData = resp;
      if (typeof responseData !== 'object') {
        reject(responseData);
      }
      else {
        resolve(responseData);
      }
    })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getEvidence(evidenceId) {
  const biolinkUrl = `${biolink}evidence/graph/${evidenceId}/table`;

  return new Promise((resolve, reject) => {
    axios.get(biolinkUrl)
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
