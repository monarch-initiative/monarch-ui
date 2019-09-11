import axios from 'axios';
import {labelToId, isTaxonCardType, isSubjectCardType} from '../lib/TaxonMap';

// TIP: Example of a domain-specific (as opposed to a generic loadJSON)
// service function. This set of domain-specific services will pretty much
// correspond to the set of needed services for the Monarch UI application, and may
// not necessarily be the same set of functions needed by a generic client
// of Monarch's services/data. In other words, we can add convenience/aggregation
// services here that may not make sense for general-purpose use. Our goal
// with this BioLink API module is to isolate the UI from the service layer, and only secondarily,
// to create a general-purpose service layer, which is more what BioLink promises
// to be.
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

const productionServers = [
  'monarchinitiative.org'
];

const defaultApiServer =
  (productionServers.indexOf(window.location.hostname) >= 0) ? 'production' : 'development';

const apiServer = (new URLSearchParams(document.location.search.substring(1))).get('api') || defaultApiServer;
console.log('apiServer', window.location.hostname, apiServer);

const serverConfiguration = servers[apiServer];
const biolink = serverConfiguration.biolink_url;
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


/**
  Get node info to support Node.vue
 */

export async function getNode(nodeId, nodeType) {
  let bioentityUrl = `${biolink}bioentity/${nodeType}/${nodeId}`;
  // console.log('getNodeSummary', nodeId, nodeType, bioentityUrl);

  if (nodeType === 'function') {
    bioentityUrl = `${biolink}bioentity/${nodeId}`;
  }
  // else if (nodeType === 'variant') {
  //   bioentityUrl = `${biolink}bioentity/gene/${nodeId}`;
  // }

  const params = {
    fetch_objects: false,
    unselect_evidence: true,
    exclude_automatic_assertions: true,
    use_compact_associations: false,
    get_association_counts: true,
    rows: 1
  };

  //
  // There should be no need for a separate API call to get the uri field.
  // the /bioentity/ endpoints should return uri when appropriate.
  // Until then, we parallelize a call to identifier/prefixes/expand to get a uri,
  // which is really stupid.
  // Once BL's bioentity/ endpoint returns uri, we can delete this hack.
  //

  const getIdentifierUrl = `${biolink}identifier/prefixes/expand/${nodeId}`;

  //
  // Temporary hack until BL gets taxon-faceted association counts built in.
  //
  const useAssociationTypeKey = false;
  const subjectKey = useAssociationTypeKey ? 'association_type' : 'subject_category';
  const objectKey = useAssociationTypeKey ? 'association_type' : 'object_category';

  const nodeSummary = axios.all(
    [
      axios.get(bioentityUrl, { params }),
      axios.get(getIdentifierUrl),
    ]
  ).then(
    axios.spread(
      function response(bioentityResp, getIdentifierResp) {
        const bioentityResponseData = bioentityResp.data;

        if (!bioentityResponseData.xrefs) {
          bioentityResponseData.xrefs = [
          ];
        }

        if (!bioentityResponseData.description) {
          bioentityResponseData.description = '';
        }

        bioentityResponseData.type = nodeType;
        bioentityResponseData.uri = getIdentifierResp.data;
        return bioentityResponseData;
      }
    )
  );

  return nodeSummary;
}


function canUseSuperclassNode(nodeId, nodeType, superId) {
  let result = true;

  if (nodeType === 'disease') {
    result = nodeId !== 'MONDO:0000001'; // superId !== 'OBI:1110055' && superId !== 'BFO:0000016';
  }
  else if (nodeType === 'anatomy') {
    result = nodeId !== 'OBO:CARO_0000000';
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
];

export async function getNeighborhood(nodeId, nodeType) {
  // const graphUrl = `${biolink}graph/node/${nodeId}`;
  const graphUrl = `${biolink}graph/edges/from/${nodeId}`;
  const nodeLabelMap = {};
  const equivalentClasses = [];
  const superclasses = [];
  const subclasses = [];

  const params = {
    fetch_objects: false,
    get_association_counts: false,
    exclude_automatic_assertions: true,
    rows: 100
  };

  const graphResponse = await axios.get(graphUrl, { params });
  const graphResponseData = graphResponse.data;

  // console.log('getNeighborhood', nodeId, graphUrl);
  // console.log(JSON.stringify(graphResponseData, null, 2));

  if (graphResponseData.nodes) {
    graphResponseData.nodes.forEach((node) => {
      nodeLabelMap[node.id] = node.lbl;
    });
  }
  if (graphResponseData.edges) {
    graphResponseData.edges.forEach((edge) => {
      if (edge.pred === 'subClassOf') {
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
        }
        else {
          equivalentClasses.push(edge.sub);
        }
      }
      // else {
      //   console.log('getNeighborhood unhandled edge type', nodeId, edge.pred);
      //   console.log(JSON.stringify(edge, null, 2));
      // }
    });
  }
  if (neighborhoodTypes.indexOf(nodeType) === -1) {
    superclasses.length = 0;
    subclasses.length = 0;
  }

  return {
    nodeLabelMap,
    equivalentClasses,
    superclasses,
    subclasses
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
  const url = `${biolink}metadata/datasets`;
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

  const data = bioentityResp.data;

  return data;
}

export async function getSearchResults(query, start, rows, categories, taxa) {
  const bioentityUrl = `${biolink}search/entity/${query}`;
  const params = new URLSearchParams();
  params.append('start', start);
  params.append('rows', rows);
  params.append('fetch_objects', false);
  params.append('exclude_automatic_assertions', false);
  params.append('exclude_automatic_assertions', false);
  params.append('use_compact_associations', true);
  params.append('highlight_class', 'hilite');
  params.append('boost_q', 'category:genotype^-10');
  params.append('prefix', '-OMIA');

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

  if (prefixes && prefixes.length) {
    prefixes.forEach((elem) => {
      params.append('prefix', elem);
    });
  }
  params.append('prefix', '-OMIA');

  if (!category || category === 'all') {
    category = categoriesAll;
  }
  else {
    category = [category];
  }

  category.forEach((elem) => {
    params.append('category', elem);
  });

  if (category.indexOf('gene') >= 0) {
    params.append('boost_fx', 'pow(edges,0.334)');
  }

  const returnedPromise = new Promise((resolve, reject) => {
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

  return returnedPromise;
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
  else if (cardType === 'function') {
    result = cardType;
  }

  return result;
}


export async function getNodeAssociations(nodeType, nodeId, cardType, taxons, params) {
  const baseUrl = `${biolink}bioentity/`;
  const biolinkMappedCardType = getBiolinkAnnotation(cardType);
  const urlExtension = `${nodeType}/${nodeId}/${biolinkMappedCardType}`;
  const url = `${baseUrl}${urlExtension}`;


  if (isTaxonCardType(cardType)) {
    params.facet = true;
    params.facet_fields = "object_taxon";
    if(isSubjectCardType(cardType)){
      params.facet_fields = "subject_taxon";
    }

    if(taxons != null && taxons !== -1){
      params.taxon = taxons.length > 1 ? taxons.join(","): taxons[0];
    }
  }

  const response = await axios.get(url, { params });
  return response;
}


export async function getNodeLabelByCurie(curie) {
  const baseUrl = `${biolink}bioentity/${curie}`;
  const params = {
    fetch_objects: true,
    rows: 100
  };

  const returnedPromise = new Promise((resolve, reject) => {
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
  return returnedPromise;
}


export function comparePhenotypes(phenotypesList, geneList, species = 'all', mode = 'search') {
  const baseUrl = 'https://monarchinitiative.org/analyze/phenotypes.json?';
  const params = new URLSearchParams();
  const phenoCuries = phenotypesList.map(elem => elem.curie);
  params.append('input_items', phenoCuries);
  params.append('gene_items', geneList);
  params.append('target_species', species);
  params.append('mode', mode);
  const returnedPromise = new Promise((resolve, reject) => {
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
  return returnedPromise;
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


export function debugServerName() {
  return (serverConfiguration.app_base.length > 0)
    ? serverConfiguration.app_base
    : 'https://beta.monarchinitiative.org';
}
