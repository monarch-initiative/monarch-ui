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
    'biolink_url': 'https://api-dev.monarchinitiative.org/api/',
    // 'biolink_url': 'https://api.monarchinitiative.org/api/',
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
    // 'biolink_url': 'https://api.monarchinitiative.org/api/',
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


const serverConfiguration = servers.production;
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
    // 'model',
    // BioLink Misssing endpoint... 'variant',
    // 'literature'
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
    // 'disease',
    'gene',
    'phenotype',
    // 'model',
    'genotype',
    // 'literature'
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

//
// This special-case for literature is a short-term (we hope) kludge that uses
// the BioLink endpoint /bioentity/:id/associations`, rather than the
// soon-to-be-written /literature/:id endpoint.
//

function idToType(nodeId) {
  let result = 'gene';

  if (nodeId.indexOf('MONDO:') === 0) {
    result = 'disease';
  }
  else if (nodeId.indexOf('HP:') === 0) {
    result = 'phenotype';
  }

  return result;
}

async function getLiteratureAssociationCounts(nodeId) {
  const associationsResultMap = {};

  const bioentityUrl = `${biolink}association/from/${nodeId}`;

  // https://api.monarchinitiative.org/api/association/from/PMID%3A11820800?graphize=false&unselect_evidence=true&start=0&rows=100&use_compact_associations=false

  // const bioentityUrl = `${biolink}bioentity/${nodeId}/associations`;
  console.log('getLiteratureAssociationCounts', nodeId, bioentityUrl);
  const bioentityParams = {
    fetch_objects: true,
    unselect_evidence: true,
    exclude_automatic_assertions: false,
    use_compact_associations: false,
    rows: 100,
    graphize: false
  };
  const bioentityResp = await axios.get(bioentityUrl, { params: bioentityParams });
  const associations = bioentityResp.data.associations;
  // https://api.monarchinitiative.org/api/bioentity/PMID%3A11751940/associations?rows=100&unselect_evidence=true&exclude_automatic_assertions=false&fetch_objects=true&use_compact_associations=false

  console.log('associations', associations);

  let geneCount = 0;
  let diseaseCount = 0;
  let phenotypeCount = 0;

  associations.forEach((a) => {
    const id = a.object.id;
    const type = idToType(id);
    console.log(id, type, a.object.label);
    if (type === 'disease') {
      diseaseCount += 1;
    }
    else if (type === 'phenotype') {
      phenotypeCount += 1;
    }
    else {
      geneCount += 1;
    }
  });

  associationsResultMap.gene = {
    facetCount: geneCount,
    totalCount: geneCount
  };
  associationsResultMap.disease = {
    facetCount: diseaseCount,
    totalCount: diseaseCount
  };
  associationsResultMap.phenotype = {
    facetCount: phenotypeCount,
    totalCount: phenotypeCount
  };

  return associationsResultMap;
}


async function getCountsForNode(nodeId, nodeType) {
  let result = null;
  const associationTypes = nodeAssociationTypes[nodeType];

  if (nodeType === 'literature') {
    result = await getLiteratureAssociationCounts(nodeId);
  }
  else if (associationTypes) {
    const promisesArray = associationTypes.map((a) => {
      const countPromise = getCounts(nodeId, nodeType, a);
      return countPromise;
    });

    const associationsResult = await Promise.all(promisesArray);

    result = {};
    associationTypes.forEach((a, index) => {
      const aResult = associationsResult[index].numFound;
      result[a] = {
        facetCount: aResult,
        totalCount: aResult
      };
    });
  }

  console.log('getCountsForNode', nodeId, nodeType, result);
  return result;
}


async function getCountsForNodeNew(nodeId, nodeType) {
  const bioentityUrl = `${biolink}bioentity/${nodeType}/${nodeId}`;
  console.log('getCountsForNodeNew', nodeId, nodeType);
  const bioentityParams = {
    fetch_objects: false,
    unselect_evidence: true,
    exclude_automatic_assertions: false,
    use_compact_associations: true,
    get_association_counts: true,
    rows: 1
  };
  const bioentityResp = await axios.get(bioentityUrl, { params: bioentityParams });
  const bioentityResponseData = bioentityResp.data;
  // console.log(bioentityResp.request.responseURL);
  // console.log(bioentityResponseData);

  return bioentityResponseData;
}

async function getURIForId(nodeId) {
  const blUrl = `${biolink}identifier/prefixes/expand/${nodeId}`;
  const blResp = await axios.get(blUrl);
  const uri = blResp.data;

  return uri;
}

export async function getNodeSummary(nodeId, nodeType) {
  const bioentityUrl = `${biolink}bioentity/${nodeType}/${nodeId}`;
  console.log('getNodeSummary', nodeId, nodeType, bioentityUrl);

  const bioentityParams = {
    fetch_objects: true,
    unselect_evidence: false,
    exclude_automatic_assertions: false,
    use_compact_associations: false,
    rows: 100
  };
  const bioentityResp = await axios.get(bioentityUrl, { params: bioentityParams });
  const bioentityResponseData = bioentityResp.data;

  // console.log('getNodeSummary bioentityUrl', nodeId, nodeType);
  // console.log(JSON.stringify(bioentityResponseData, null, 2));

  if (!bioentityResponseData.xrefs) {
    bioentityResponseData.xrefs = [
      {
        'url': '',
        'label': 'BioLink:FIXME/xrefs',
        'blank': false
      }
    ];
  }

  if (!bioentityResponseData.description) {
    bioentityResponseData.description = '';
  }

  const graphUrl = `${biolink}graph/node/${nodeId}`;
  const graphResponse = await axios.get(graphUrl);
  // console.log('getNodeSummary graphUrl', nodeId, nodeType, graphUrl);
  const graphResponseData = graphResponse.data;
  // console.log(JSON.stringify(graphResponseData, null, 2));
  bioentityResponseData.edges = graphResponseData.edges;
  bioentityResponseData.nodes = graphResponseData.nodes;
  // console.log(bioentityResponseData.edges);
  // console.log(bioentityResponseData.nodes);

  // const assUrl = `${biolink}bioentity/${nodeId}/associations`;

  const countsMap = await getCountsForNode(nodeId, nodeType);

  bioentityResponseData.counts = countsMap;
  // console.log('countsMap', nodeId, nodeType);
  // console.log(JSON.stringify(countsMap, null, 2));

  // When BioLink's /bioentity/{nodeId}/{nodeType}?get_association_counts=true
  // eventually works, we'll use the following.
  // const countsMapNew = await getCountsForNodeNew(nodeId, nodeType);
  // console.log('countsMapNew', countsMapNew);

  if (nodeType === 'disease') {
    bioentityResponseData.inheritance = 'BioLinkFIXME';
    bioentityResponseData.modifiers = 'BioLinkFIXME';
  }

  const uri = await getURIForId(nodeId);
  bioentityResponseData.uri = uri;
  // console.log('bioentityResponseData', nodeId, nodeType);
  // console.log(JSON.stringify(bioentityResponseData, null, 2));

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
      else {
        console.log('getNeighborhoodFromResponse', nodeId, edge.pred);
        console.log(JSON.stringify(edge, null, 2));
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


//
// This special-case for literature is a short-term (we hope) kludge that uses
// the BioLink endpoint /bioentity/:id/associations`, rather than the
// soon-to-be-written /literature/:id endpoint.
//
//
async function getLiteratureAssociations(nodeId, cardType) {
  const bioentityUrl = `${biolink}association/from/${nodeId}`;

  // https://api.monarchinitiative.org/api/association/from/PMID%3A11820800?graphize=false&unselect_evidence=true&start=0&rows=100&use_compact_associations=false

  // const bioentityUrl = `${biolink}bioentity/${nodeId}/associations`;
  console.log('getLiteratureAssociationCounts', nodeId, bioentityUrl);
  const bioentityParams = {
    fetch_objects: true,
    unselect_evidence: true,
    exclude_automatic_assertions: false,
    use_compact_associations: false,
    rows: 100,
    graphize: false
  };
  const bioentityResp = await axios.get(bioentityUrl, { params: bioentityParams });
  const associations = bioentityResp.data.associations;
  // https://api.monarchinitiative.org/api/bioentity/PMID%3A11751940/associations?rows=100&unselect_evidence=true&exclude_automatic_assertions=false&fetch_objects=true&use_compact_associations=false

  console.log('getLiteratureAssociations', associations);

  const filtered = associations.filter(a => idToType(a.object.id) === cardType);

  return {
    data: {
      numFound: filtered.length,
      associations: filtered
    }
  };
}

export async function getNodeAssociations(nodeType, nodeId, cardType, params) {
  if (nodeType === 'literature') {
    const litAssociations = await getLiteratureAssociations(nodeId, cardType);
    console.log('getNodeAssociations lit', nodeType, nodeId, cardType, litAssociations);
    return litAssociations;
  }

  const baseUrl = `${biolink}bioentity/`;
  const biolinkAnnotationSuffix = getBiolinkAnnotation(cardType);
  const urlExtension = `${nodeType}/${nodeId}/${biolinkAnnotationSuffix}`;
  const url = `${baseUrl}${urlExtension}`;

  console.log('getNodeAssociations', nodeType, nodeId, cardType, url);

  return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then((resp) => {
        const responseData = resp;
        if (typeof responseData !== 'object') {
          reject(responseData);
        }
        else {
          // console.log('getNodeAssociations', nodeType, nodeId, cardType, url);
          // console.log(JSON.stringify(responseData, null, 2));
          resolve(responseData);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getNodeLabelByCurie(curie) {
  const baseUrl = `${biolink}bioentity/${curie}`;
  const params = {
    fetch_objects: true,
    rows: 100
  };
  console.log('getNodeLabelByCurie', curie);
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
    : 'https://monarchinitiative.org';
}
