import axios from 'axios';

const servers = {
  development: {
    'type': 'development',
    'app_base': 'https://beta.monarchinitiative.org',
    'scigraph_url': 'https://scigraph-ontology-dev.monarchinitiative.org/scigraph/',
    'scigraph_data_url': 'https://scigraph-data-dev.monarchinitiative.org/scigraph/',
    'golr_url': 'https://solr.monarchinitiative.org/solr/golr/',
    'search_url': 'https://solr.monarchinitiative.org/solr/search/',
    'owlsim_services_url': 'https://beta.monarchinitiative.org/owlsim',
    'analytics_id': '',
    // 'biolink_url': 'https://api-dev.monarchinitiative.org/api/',
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

  cgrb: {
    'type': 'beta',
    'app_base': 'https://monarch-app-beta.cgrb.oregonstate.edu',
    'scigraph_url': 'https://monarch-scigraph-ontology-dev.cgrb.oregonstate.edu/scigraph/',
    'scigraph_data_url': 'https://monarch-scigraph-data-dev.cgrb.oregonstate.edu/scigraph/',
    'golr_url': 'https://monarch-solr6-dev.cgrb.oregonstate.edu/solr/golr/',
    'search_url': 'https://monarch-solr6-dev.cgrb.oregonstate.edu/solr/search/',
    'owlsim_services_url': 'https://monarch-app-beta.cgrb.oregonstate.edu/owlsim',
    'analytics_id': '',
    'biolink_url': 'https://api-dev.monarchinitiative.org/api/'
  }
};


const serverConfiguration = servers.development;
const biolink = serverConfiguration.biolink_url;

function getBiolinkAnnotation(cardType) {
  let result = `${cardType}s`;
  if (cardType === 'anatomy') {
    result = 'expression/anatomy';
  }
  else if (cardType === 'literature') {
    result = cardType;
  }
  else if (cardType === 'function') {
    result = cardType;
  }

  return result;
}

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

const nodeAssociationTypes = {
  anatomy: [
    'gene'
  ],

  disease: [
    'gene',
    'phenotype',
    'model',
    'variant',
    'genotype',
    'literature'
  ],

  function: [
    'gene'
  ],

  gene: [
    'disease',
    'phenotype',
    'model',
    'variant',
    'genotype',
    'literature'
  ],

  genotype: [
    'disease',
    'gene',
    'phenotype',
    'model',
    'variant',
    'literature'
  ],

  homolog: [
    'gene'
  ],

  interaction: [
    'gene'
  ],

  literature: [
    'disease'
  ],

  model: [
    'disease',
    'gene',
    'genotype',
    'phenotype',
    'variant',
    'literature'
  ],

  orthoPhenotype: [
    'gene'
  ],

  orthoDisease: [
    'gene'
  ],

  pathway: [
    'disease',
    'gene'
  ],

  phenotype: [
    'disease',
    'gene',
    'genotype',
    'variant',
    'literature'
  ],

  variant: [
    'disease',
    'gene',
    'phenotype',
    'model',
    'genotype',
    'literature'
  ]
};

async function getCounts(nodeId, nodeType, countType) {
  if (countType !== 'literature') {
    countType += 's';
  }
  const bioentityUrl = `${biolink}bioentity/${nodeType}/${nodeId}/${countType}`;
  // console.log('getCounts', nodeId, nodeType, countType);
  const bioentityParams = {
    fetch_objects: false,
    unselect_evidence: true,
    exclude_automatic_assertions: false,
    use_compact_associations: true,
    rows: 1
  };
  const bioentityResp = await axios.get(bioentityUrl, { params: bioentityParams });
  const bioentityResponseData = bioentityResp.data;
  // console.log(bioentityResp.request.responseURL);
  // console.log(bioentityResponseData);

  return bioentityResponseData;
}

async function getCountsForNode(nodeId, nodeType) {
  const associationTypes = nodeAssociationTypes[nodeType];

  if (associationTypes) {
    const promisesArray = associationTypes.map((a) => {
      const countPromise = getCounts(nodeId, nodeType, a);
      return countPromise;
    });

    const associationsResult = await Promise.all(promisesArray);

    const associationsResultMap = {};
    associationTypes.forEach((a, index) => {
      const aResult = associationsResult[index].numFound;
      associationsResultMap[a] = {
        facetCount: aResult,
        totalCount: aResult
      };
    });

    return associationsResultMap;
  }
  console.log('getCountsForNode', nodeId, nodeType, 'NO ASSOCIATIONS KNOWN');
  return null;
}

export async function getNodeSummary(nodeId, nodeType) {
  const bioentityUrl = `${biolink}bioentity/${nodeType}/${nodeId}`;
  // console.log('getNodeSummary bioentityUrl', nodeId, nodeType, bioentityUrl);
  const bioentityParams = {
    fetch_objects: true,
    unselect_evidence: false,
    exclude_automatic_assertions: false,
    use_compact_associations: false,
    rows: 100
  };
  const bioentityResp = await axios.get(bioentityUrl, { params: bioentityParams });
  const bioentityResponseData = bioentityResp.data;

  if (!bioentityResponseData.xrefs) {
    bioentityResponseData.xrefs = [
      {
        'url': '',
        'label': 'BioLink:FIXME/xrefs',
        'blank': false
      }
    ];
  }

  const graphUrl = `${biolink}graph/node/${nodeId}`;
  const graphResponse = await axios.get(graphUrl);
  // console.log('getNodeSummary graphUrl', nodeId, nodeType, graphUrl);
  const graphResponseData = graphResponse.data;
  // console.log(graphResponseData);
  bioentityResponseData.edges = graphResponseData.edges;
  bioentityResponseData.nodes = graphResponseData.nodes;
  // console.log(bioentityResponseData.edges);
  // console.log(bioentityResponseData.nodes);

  // const assUrl = `${biolink}bioentity/${nodeId}/associations`;

  const countsMap = await getCountsForNode(nodeId, nodeType);

  bioentityResponseData.counts = countsMap;

  return bioentityResponseData;
}

export function getNeighborhoodFromResponse(response) {
  const nodeId = response.id;

  const nodeLabelMap = {};

  const equivalentClasses = [];
  const superclasses = [];
  const subclasses = [];

  if (response.nodes) {
    response.nodes.forEach((node) => {
      nodeLabelMap[node.id] = node.lbl;
    });
  }
  if (response.edges) {
    response.edges.forEach((edge) => {
      if (edge.pred === 'subClassOf') {
        if (edge.sub === nodeId) {
          // console.log('Superclass Edge', edge.sub, edge.pred, edge.obj);
          superclasses.push(edge.obj);
        }
        else if (edge.obj === nodeId) {
          // console.log('Subclass Edge', edge.sub, edge.pred, edge.obj);
          subclasses.push(edge.sub);
        }
        else {
          // console.log('BAD', edge.sub, edge.pred, edge.obj);
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
    });
  }

  return {
    nodeLabelMap,
    equivalentClasses,
    superclasses,
    subclasses
  };
}


export async function getSearchResults(query, start, rows) {
  const bioentityUrl = `${biolink}search/entity/${query}`;
  const bioentityParams = {
    fetch_objects: false,
    unselect_evidence: true,
    exclude_automatic_assertions: false,
    use_compact_associations: true,
    rows,
    start,
  };
  const bioentityResp = await axios.get(bioentityUrl, { params: bioentityParams });
  const bioentityResponseData = bioentityResp.data;

  return bioentityResponseData;
}


export async function getSearchTermSuggestions(term, selected, prefixes = []) {
  const baseUrl = `${biolink}search/entity/autocomplete/`;
  const urlExtension = `${baseUrl}${term}`;
  const params = new URLSearchParams();
  params.append('rows', 10);
  params.append('start', 0);
  params.append('highlight_class', 'hilite');
  params.append('boost_q', 'category:genotype^-10');
  if (prefixes.length) {
    prefixes.forEach((elem) => {
      params.append('prefix', elem);
    });
  }
  if (selected.toString() === 'gene') {
    params.append('boost_fx', 'pow(edges,0.334)');
  }
  if (selected.length > 0) {
    selected.forEach((elem) => {
      params.append('category', elem);
    });
  }
  else {
    ['gene', 'variant locus', 'phenotype', 'genotype', 'disease']
      .forEach(elem => (params.append('category', elem)));
  }
  params.append('prefix', '-OMIA');
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


export function getNodeAssociations(nodeType, identifier, cardType, params) {
  const baseUrl = `${biolink}bioentity/`;
  const biolinkAnnotationSuffix = getBiolinkAnnotation(cardType);
  const urlExtension = `${nodeType}/${identifier}/${biolinkAnnotationSuffix}`;
  const url = `${baseUrl}${urlExtension}`;
  // console.log('getNodeAssociations', nodeType, identifier, cardType, url);

  const returnedPromise = new Promise((resolve, reject) => {
    axios.get(url, { params })
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

export function getNodeLabelByCurie(curie) {
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

export function debugServerName() {
  return (serverConfiguration.app_base.length > 0)
    ? serverConfiguration.app_base
    : 'https://beta.monarchinitiative.org';
}
