import axios from 'axios';

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

};

const defaultApiServer = 'development';
const apiServer = (new URLSearchParams(document.location.search.substring(1))).get('api') || defaultApiServer;
console.log('apiServer', apiServer);

const serverConfiguration = servers[apiServer];
const biolink = serverConfiguration.biolink_url;

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


/**
  Get node info to support Node.vue
 */

export async function getNode(nodeId, nodeType) {
  const bioentityUrl = `${biolink}bioentity/${nodeType}/${nodeId}`;
  // console.log('getNodeSummary', nodeId, nodeType, bioentityUrl);

  const params = {
    fetch_objects: true,
    unselect_evidence: false,
    exclude_automatic_assertions: false,
    use_compact_associations: false,
    get_association_counts: true,
    rows: 100
  };

  //
  // There should be no need for a separate API call to get the uri field.
  // the /bioentity/ endpoints should return uri when appropriate.
  // Until then, we parallelize a call to identifier/prefixes/expand to get a uri,
  // which is really stupid.
  // Once BL's bioentity/ endpoint returns uri, we can delete this hack.
  //

  const getIdentifierUrl = `${biolink}identifier/prefixes/expand/${nodeId}`;

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

        // TEMPORARY WORKAROUND when api-dev.m.org is broken and
        // when production does not yet support get_association_counts.
        // So the hack is to synthesize non-zero counts, and rely upon
        // /bioentity/disease/:id/genes (e.g.) to work properly when
        // the user asks for a paricular type of association (i.e., clicks
        // on a card in Node.vue)
        //
        //
        // bioentityResponseData.association_counts = {
        //   gene: 1,
        //   phenotype: 1,
        //   disease: 1,
        //   genotype: 1,
        //   variant: 1,
        // };

        // const counts = bioentityResponseData.association_counts;
        // const countsMap = {};
        // Object.keys(counts).forEach((key) => {
        //   let count = counts[key];
        //   if (key === nodeType && count > 0) {
        //     console.log('bad?', nodeType, nodeId, count);
        //     count = 0;
        //   }
        //   countsMap[key] = {
        //     facetCount: count,
        //     totalCount: count
        //   };
        // });

        // bioentityResponseData.counts = countsMap;
        // console.log('bioentityResponseData', nodeId, nodeType);
        // console.log(JSON.stringify(bioentityResponseData, null, 2));

        bioentityResponseData.type = nodeType;
        bioentityResponseData.uri = getIdentifierResp.data;
        return bioentityResponseData;
      }
    )
  );

  return nodeSummary;
}


export async function getNeighborhood(nodeId) {
  // const graphUrl = `${biolink}graph/node/${nodeId}`;
  const graphUrl = `${biolink}graph/edges/from/${nodeId}`;

  const graphResponse = await axios.get(graphUrl);
  const graphResponseData = graphResponse.data;

  // console.log('getNeighborhood', nodeId, graphUrl);
  // console.log(JSON.stringify(graphResponseData, null, 2));

  const nodeLabelMap = {};

  const equivalentClasses = [];
  const superclasses = [];
  const subclasses = [];

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
          superclasses.push(edge.obj);
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
      else {
        console.log('getNeighborhood unhandled edge type', nodeId, edge.pred);
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


function categoryKludge(category) {
  return category === 'phenotype' ? 'Phenotype' : category;
}

const categoriesAll = [
  'gene',
  'variant locus',
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
];

const categoriesSome = categoriesAll.slice(0, 5);


export async function getSearchResults(query, start, rows, categories, prefixes) {
  const bioentityUrl = `${biolink}search/entity/${query}`;
  const params = new URLSearchParams();
  params.append('start', start);
  params.append('rows', rows);
  params.append('fetch_objects', false);
  params.append('exclude_automatic_assertions', false);
  params.append('exclude_automatic_assertions', false);
  params.append('use_compact_associations', true);

  let categoriesLocal = categories;
  if (!categoriesLocal || categoriesLocal.length === 0) {
    categoriesLocal = categoriesAll;
  }

  categoriesLocal.forEach((elem) => {
    params.append('category', categoryKludge(elem));
  });

  const bioentityResp = await axios.get(bioentityUrl, { params });
  const data = bioentityResp.data;

  // Debug code to detect entries without categories.
  // data.docs.forEach((d) => {
  //   if (!d.category) {
  //     console.log('getSearchResults NO CATEGORY', d.id);
  //   }
  // });

  return data;
}


export async function getSearchTermSuggestions(term, categories, prefixes) {
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

  let categoriesLocal = categories;
  if (!categoriesLocal || categoriesLocal.length === 0) {
    categoriesLocal = categoriesAll;
  }

  categoriesLocal.forEach((elem) => {
    params.append('category', categoryKludge(elem));
  });

  if (categoriesLocal.indexOf('gene') >= 0) {
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


export async function getNodeAssociations(nodeType, nodeId, cardType, params) {
  const baseUrl = `${biolink}bioentity/`;
  const biolinkAnnotationSuffix = getBiolinkAnnotation(cardType);
  const urlExtension = `${nodeType}/${nodeId}/${biolinkAnnotationSuffix}`;
  const url = `${baseUrl}${urlExtension}`;

  const response = await axios.get(url, { params });
  // console.log('getNodeAssociations', nodeType, nodeId, cardType, url);
  // console.log(response.request.responseURL);
  response.data.associations.forEach((a) => {
    // const relation = a.relation.inverse
    //   ? `<- ${a.relation.label} <-`
    //   : `-> ${a.relation.label} ->`;
    // const line = `${a.subject.label}(${a.subject.id}) ${relation} ${a.object.label}(${a.object.id}) `;
    // console.log(line);
  });
  return response;

/*
      .then((resp) => {
        const responseData = resp;
        if (typeof responseData !== 'object') {
          reject(responseData);
        }
        else {
          // console.log('getNodeAssociations', nodeType, nodeId, cardType, url);
          // // console.log(JSON.stringify(responseData, null, 2));
          // responseData.data.associations.forEach((a) => {
          //   console.log('');
          //   console.log(a.subject.id + '/' + a.subject.label);
          //   console.log(a.relation.id + '/' + a.relation.label + '/' + a.relation.inverse);
          //   console.log(a.object.id + '/' + a.subject.object);
          //   // console.log(JSON.stringify(a.relation, null, 2));
          //   // console.log(JSON.stringify(a.object, null, 2));
          //   console.log('');
          // });
          resolve(responseData);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
*/
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


export function debugServerName() {
  return (serverConfiguration.app_base.length > 0)
    ? serverConfiguration.app_base
    : 'https://beta.monarchinitiative.org';
}
