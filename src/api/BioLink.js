import axios from 'axios';
import { isTaxonCardType } from '../lib/TaxonMap';

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

const defaultApiServer = 'production';
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
  const golrUrl1 =
`${serverConfiguration.golr_url}select/?q=*%3A*&facet=true&fq=subject_closure:%22${nodeId}%22&rows=0&wt=json&facet.mincount=1&indent=on&facet.sort=count&facet.pivot=${objectKey},object_taxon`;
  const golrUrl2 =
`${serverConfiguration.golr_url}select/?q=*%3A*&facet=true&fq=object_closure:%22${nodeId}%22&rows=0&wt=json&facet.mincount=1&indent=on&facet.sort=count&facet.pivot=${subjectKey},subject_taxon`;

  const nodeSummary = axios.all(
    [
      axios.get(bioentityUrl, { params }),
      axios.get(getIdentifierUrl),
      axios.get(golrUrl1, {}),
      axios.get(golrUrl2, {}),
    ]
  ).then(
    axios.spread(
      function response(bioentityResp, getIdentifierResp, golrResponse1, golrResponse2) {
        // console.log('bioentityResp');
        // console.log(JSON.stringify(bioentityResp.data, null, 2));
        // console.log('golrResponse1');
        // console.log(JSON.stringify(golrResponse1.data, null, 2));
        // console.log('golrResponse2');
        // console.log(JSON.stringify(golrResponse2.data, null, 2));
        const taxonCounts = {};

        const objectTaxonCounts = golrResponse1.data.facet_counts.facet_pivot[`${objectKey},object_taxon`];
        objectTaxonCounts.forEach((facet) => {
          let facetName = facet.value.replace(`${nodeType}_`, '');
          //
          // Temporary hack until BL gets taxon-faceted association counts built in.
          // Presumably, BL will return facet names like 'anatomy', so that the following
          // mappings are not necessary.
          //
          if (facetName === 'anatomical entity') {
            facetName = 'anatomy';
          }
          else if (facetName === 'biological process') {
            facetName = 'function';
          }
          else if (facetName === 'homology') {
            facetName = 'homolog';
          }

          taxonCounts[facetName] = {
            total: facet.count,
            taxons: {},
          };
          if (facet.pivot) {
            facet.pivot.forEach((taxonInfo) => {
              taxonCounts[facetName].taxons[taxonInfo.value] = taxonInfo.count;
            });
          }
        });

        const subjectTaxonCounts = golrResponse2.data.facet_counts.facet_pivot[`${subjectKey},subject_taxon`];
        subjectTaxonCounts.forEach((facet) => {
          const facetName = facet.value.replace(`_${nodeType}`, '');
          taxonCounts[facetName] = {
            total: facet.count,
            taxons: {},
          };
          if (facet.pivot) {
            facet.pivot.forEach((taxonInfo) => {
              taxonCounts[facetName].taxons[taxonInfo.value] = taxonInfo.count;
            });
          }
        });

        const bioentityResponseData = bioentityResp.data;

        if (!bioentityResponseData.xrefs) {
          bioentityResponseData.xrefs = [
          ];
        }

        if (!bioentityResponseData.description) {
          bioentityResponseData.description = '';
        }

        bioentityResponseData.type = nodeType;
        bioentityResponseData.taxonCounts = taxonCounts;
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
      else {
        console.log('getNeighborhood unhandled edge type', nodeId, edge.pred);
        console.log(JSON.stringify(edge, null, 2));
      }
    });
  }
  if (nodeType === 'gene' || nodeType === 'variant') {
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
    params.append('category', elem);
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
    params.append('category', elem);
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


export async function getNodeAssociations(nodeType, nodeId, cardType, taxons, params) {
  const baseUrl = `${biolink}bioentity/`;
  const biolinkMappedCardType = getBiolinkAnnotation(cardType);
  const urlExtension = `${nodeType}/${nodeId}/${biolinkMappedCardType}`;
  const url = `${baseUrl}${urlExtension}`;
  const useTaxonRestriction = taxons && taxons.length > 0 && isTaxonCardType(cardType);

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
