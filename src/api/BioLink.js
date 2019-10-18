import axios from 'axios';
import { labelToId, isTaxonCardType } from '../lib/TaxonMap';

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
      // axios.get(golrUrl1, {}),
      // axios.get(golrUrl2, {}),
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

  return {
    sources: [

      {
        sourceDisplayName: "Mouse Genome Informatics",
        sourceDescription: "MGI is the international database resource for the laboratory mouse, providing integrated genetic, genomic, and biological data to facilitate the study of human health and disease.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "We list genotype-phenotype associations and asserted disease-models. We use MGI identifiers as " +
            "the main hook into mouse data. Additionally, we utilize the Mouse Phenotype Ontology (MP) in our " +
            "cross-species ontology, to link all mouse phenotype annotations from various sources, which is developed by MGI.",
        vocabulary: "ECO, MA, MP, SO"
      },
      {
        sourceDisplayName: "Zebrafish Information Network",
        sourceDescription: "The Zebrafish Information Resource is the community database resource for the laboratory " +
            "use of zebrafish which develops and supports integrated zebrafish genetic, genomic and developmental " +
            "information, maintains the definitive reference data sets of zebrafish research information toward " +
            "facilitation of the use of zebrafish as a model for human biology.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "",
        vocabulary: "We integrate the curated genotype-phenotype data, including experimentally derived fish " +
            "(such as via application of morpholinos), and links to the literature as evidence."
      },
      {
        sourceDisplayName: "WormBase database of nematode biology",
        sourceDescription: "WormBase is an international consortium dedicated to providing the research community with accurate, current, accessible information concerning the genetics, genomics and biology of C. elegans and related nematodes.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "Wormbase curates variant (allele)-phenotype associations. The variants are both genetic (intrinsic) and induced through application of reagents such as RNAi (extrinsic). We list the variant-phenotype associations. Some data is pulled from WormBase directly, other data is routed via WormMine.",
        vocabulary: "WBbt, WBls, WBPhenotype"
      },
      {
        sourceDisplayName: "FlyBase",
        sourceDescription: "FlyBase is the model organism database providing integrated genetic, genomic, phenomic, and biological data for Drosophila melanogaster.",
        sourceVersion: "-",
        monarchReleaseDate: "March 04, 2019",
        monarchUsage: "We integrate the genotype-phenotype associations.",
        vocabulary: "FBbt, FBcv, FBdv"
      },
      {
        sourceDisplayName: "International Mouse Phenotyping Consortium",
        sourceDescription: "The International Mouse Phenotyping Consortium (IMPC) is generating a knockout mouse strain for every protein coding gene by using the embryonic stem cell resource generated by the International Knockout Mouse Consortium (IKMC). Systematic broad-based phenotyping is performed by each IMPC center using standardized procedures found within the International Mouse Phenotyping Resource of Standardised Screens (IMPReSS) resource. Gene-to-phenotype associations are made by a versioned statistical analysis.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "We use the allele-phenotype associations recorded by the consortium. In addition, we map their allele+zygosity+background to MGI genotype identifiers. Where they do not map to MGI genotype identifiers, we create temporary identifiers for navigation purposes.",
        vocabulary: "MP"
      },
      {
        sourceDisplayName: "Mouse Phenome Database",
        sourceDescription: "The Mouse Phenome Database is a collaborative standardized collection of measured data on laboratory mouse strains, and includes: baseline phenotype data sets, studies of drug, diet, disease and aging effect, protocols, projects, and publications, and SNP, variation and gene expression studies. MPD collects data for classical inbred strains, other fixed-genotype strains, derived lines and populations that are openly acquirable (strain panel examples). Strains can be from JAX-Mice or from any other vendor that's a recognized breeding source.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "genotype (strain)-phenotype association",
        vocabulary: "MP"
      },
      {
        sourceDisplayName: "Online Mendelian Inheritance in Animals",
        sourceDescription: "Online Mendelian Inheritance in Animals (OMIA) is a catalogue/compendium of inherited disorders, other (single-locus) traits, and genes in 215 (non-model) animal species.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "gene-disease association",
        vocabulary: "OMIA, OMIM"
      },
      {
        sourceDisplayName: "ClinVar",
        sourceDescription: "ClinVar archives and aggregates information about relationships among variation and human health. ClinVar collects reports of variants found in patient samples, assertions made regarding their clinical significance, information about the submitter, and other supporting data.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "disease-gene association, variant-disease association, variant definitions",
        vocabulary: "UMLS"
      },
      {
        sourceDisplayName: "Online Mendelian Inheritance in Man",
        sourceDescription: "OMIM is a comprehensive, authoritative compendium of human genes and genetic phenotypes with full-text, referenced overviews that contains information on all known mendelian disorders and over 12,000 genes. OMIM focuses on the relationship between phenotype and genotype.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "We use curated disease-gene, disease-locus, and variant-disease associations, together with their annotated references. Most OMIM diseases are further curated by the HPO group. Most OMIM diseases are integrated into the Disease Ontology.",
        vocabulary: "OMIM"
      },
      {
        sourceDisplayName: "ORPHANET",
        sourceDescription: "Orphanet provides reference information on rare diseases and orphan drugs to help improve the diagnosis, care and treatment of patients with rare diseases.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "We use the Orphanet disease-gene associations.",
        vocabulary: "ORPHA"
      },
      {
        sourceDisplayName: "PANTHER",
        sourceDescription: "The PANTHER (Protein ANalysis THrough Evolutionary Relationships) Classification System was designed to classify proteins (and their genes) according to evolutionary family/subfamily, molecular function, biological process, and pathway. The PANTHER Classifications are the result of human curation as well as sophisticated bioinformatics algorithms",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "We currently utilize the 12 RefGenome species, as well as HUGO HCOP species, to seed the orthology calls. Species currently include: arabidopsis, budding yeast, chicken, chimp, dog, fission yeast, fruitfly, green lizard, horse, human, macaque, mouse, opossum, pig, platypus, rat, slime mold, worms, zebrafish. We use the orthology calls to populate the orthologs tabs for genes, as well as to infer disease-model associations via homology.",
        vocabulary: "RO"
      },
      {
        sourceDisplayName: "Coriell Institute for Medical Research",
        sourceDescription: "The Coriell Cell Repositories provide essential research reagents to the scientific community by establishing, verifying, maintaining, and distributing cell cultures and DNA derived from cell cultures. These collections, supported by funds from the National Institutes of Health (NIH) and several foundations, are extensively utilized by research scientists around the world. NINDS and NIGMS cell line catalog. NIGMS samples represent a variety of disease states, chromosomal abnormalities, apparently healthy individuals and many distinct human populations. NINDS samples are drawn from subjects with cerebrovascular disease, epilepsy, motor neuron disease, Parkinsonism and Tourette Syndrome, as well as controls.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "We link pertinent cell lines to any diseases for which they are asserted models.",
        vocabulary: "OMIM"
      },
      {
        sourceDisplayName: "Comparative Toxicogenomics Database",
        sourceDescription: "CTD promotes understanding about the effects of environmental chemicals on human health by integrating data from curated scientific literature to describe chemical interactions with genes and proteins, and associations between diseases and chemicals, and diseases and genes/proteins.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "We integrate the asserted (curated) disease-gene associations, and their evidence.",
        vocabulary: "MESH, OMIM"
      },
      {
        sourceDisplayName: "Human Phenotype Ontology",
        sourceDescription: "A curated database of human hereditary syndromes from OMIM, Orphanet, and DECIPHER mapped to classes of the human phenotype ontology. Various meta-attributes such as frequency, references and negations are associated with each annotation. These are presently limited to rare mendelian diseases.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "We use the HPO disease-phenotype annotations as the primary atomic description of a disease, and list them on the disease pages, together with their references. The Human Phenotype Ontology is integrated into our cross-species phenotype ontology.",
        vocabulary: "ECO, HPO"
      },
      {
        sourceDisplayName: "Kyoto Encyclopedia of Genes and Genomes",
        sourceDescription: "KEGG is an integrated database resource consisting of the seventeen main databases including systems, genomic, chemical, and health information.",
        sourceVersion: "-",
        monarchReleaseDate: "March 04, 2019",
        monarchUsage: "We list disease-gene associations, and gene-pathway associations. We utilize the KEGG Ortholog (KO) gene-pathway associations, and infer a specific-organisms' participation in that pathway based on the gene-KO links.",
        vocabulary: "MESH, OMIM"
      },
      {
        sourceDisplayName: "MyGene",
        sourceDescription: "MyGene.info provides a simple-to-use REST web services to query/retrieve gene annotation data.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "We use mygene.info's REST-services to fetch and display curated RefSeq gene descriptions.",
        vocabulary: ""
      },
      {
        sourceDisplayName: "National Center for Biotechnology Information",
        sourceDescription: "Gene integrates information from a wide range of species, and includes nomenclature, Reference Sequences (RefSeqs), maps, pathways, variations, phenotypes, and links to genome-, phenotype-, and locus-specific resources worldwide. Taxon lists the taxinomic organization of organisms. Pub2Gene serves links between genes and pubmed identifiers where they are mentioned.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "We use NCBIGene ids and symbols as the primary identifier and label for human genes in our system and NCBITaxon identifiers and scientific name for species-specific labeling. For any given gene, we also list the annotated pmids from Pub2Gene.",
        vocabulary: ""
      },
      {
        sourceDisplayName: "BioGRID",
        sourceDescription: "BioGRID is an curated gene and protein interaction repository with for major model organism species.",
        sourceVersion: "-",
        monarchReleaseDate: "Feburary 23, 2019",
        monarchUsage: "Monarch indicates gene-gene/protein-protein interactions on gene pages. We also use many of the id mappings to resolve ids in our own site.",
        vocabulary: "MI"
      },
      {
        sourceDisplayName: "GWAS Catalog",
        sourceDescription: "The NHGRI-EBI Catalog of published genome-wide association studies.",
        sourceVersion: "-",
        monarchReleaseDate: "March 12, 2019",
        monarchUsage: "Monarch links the variants recorded here to the curated EFO-classes",
        vocabulary: "RO, EFO, ECO"
      },
      {
        sourceDisplayName: "AnimalQTLdb",
        sourceDescription: "The Animal Quantitative Trait Loci (QTL) database (Animal QTLdb) is designed to house publicly all available QTL and single-nucleotide polymorphism/gene association data on livestock animal species.",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Monarch uses the QTL genetic maps and their computed genomic locations to create associations between the QTLs and their traits. The traits come in their internal Animal Trait ontology vocabulary, which they further map to [Vertebrate Trait](http://bioportal.bioontology.org/ontologies/VT), Product Trait, and Clinical Measurement Ontology vocabularies.",
        vocabulary: "RO, ECO"
      },
      {
        sourceDisplayName: "Ensembl database of automatically annotated genomic data",
        sourceDescription: "Ensembl is a genome browser for vertebrate genomes that supports research in comparative genomics, evolution, sequence variation and transcriptional regulation.",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Monarch obtains equivalencies between Ensembl gene IDs and NCBI gene IDs",
        vocabulary: ""
      },
      {
        sourceDisplayName: "Gene Ontology Database",
        sourceDescription: "The GO defines concepts/classes used to describe gene function, and relationships between these concepts.",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Monarch processes gene-process/function/subcellular/location associations.",
        vocabulary: "RO"
      },
      {
        sourceDisplayName: "Gene Reviews",
        sourceDescription: "GeneReviews, an international point-of-care resource for busy clinicians, provides clinically relevant and medically actionable information for inherited conditions in a standardized journal-style format, covering diagnosis, management, and genetic counseling for patients and their families.",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Monarch processes the GeneReviews mappings to OMIM, plus inspect the GeneReviews (html) books to pull the clinical descriptions in order to populate the definitions of the terms in the ontology. We define the GeneReviews items as classes that are either grouping classes over OMIM disease ids (gene ids are filtered out), or are made as subclasses of DOID:4 (generic disease).",
        vocabulary: ""
      },
      {
        sourceDisplayName: "HUGO Gene Nomenclature Committee",
        sourceDescription: "A curated online repository of HGNC-approved gene nomenclature, gene families and associated resources.",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Monarch creates equivalences between HGNC identifiers and ENSEMBL and NCBIGene. We also add the links to cytogenic locations for the gene features.",
        vocabulary: ""
      },
      {
        sourceDisplayName: "Mutant Mouse Resource and Research Centers",
        sourceDescription: "A repository of mouse stocks and ES cell line collections serving the world-wide genetics and biomedical research community for the benefit of human health.",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Centers A repository of mouse stocks and ES cell line collections serving the world-wide genetics and biomedical research community for the benefit of human health.\tMonarch processes the Mutant Mouse Resource and Research Center strain data, which includes: strains and their mutant alleles, phenotypes of the alleles, and descriptions of the research uses of the strains.",
        vocabulary: "MP"
      },
      {
        sourceDisplayName: "Reactome - a curated knowledgebase of biological pathways",
        sourceDescription: "A repository of mouse stocks and ES cell line collections serving the world-wide genetics and biomedical research community for the benefit of human health.",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Monarch processes ensembl gene to pathway associations",
        vocabulary: "RO"
      },
      {
        sourceDisplayName: "Undiagnosed Diseases Program (UDP)",
        sourceDescription: "The National Institutes of Health (NIH) Undiagnosed Diseases Program (UDP) is part of the Undiagnosed Disease Network (UDN), an NIH Common Fund initiative that focuses on the most puzzling medical cases referred to the NIH Clinical Center in Bethesda, Maryland.",
        sourceVersion: "-",
        monarchReleaseDate: "March 16, 2018",
        monarchUsage: "Monarch stores phenotypes for each case and variants of interest",
        vocabulary: "RO"
      },
      {
        sourceDisplayName: "Gene expression data in animals",
        sourceDescription: "Bgee is a database to retrieve and compare gene expression patterns in multiple animal species",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Monarch stores the top 20 ranked tissues where a gene is over expressed based on differential expression measures across evidence lines",
        vocabulary: "Uberon"
      },
      {
        sourceDisplayName: "STRING",
        sourceDescription: "STRING is a database of known and predicted protein-protein interactions.",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Monarch stores protein protein interactions with a confidence >.7",
        vocabulary: "RO"
      },
      {
        sourceDisplayName: "Rat Genome Database",
        sourceDescription: "The Rat Genome Database (RGD)is the premier site for genetic, genomic, phenotype, and disease data generated from rat research",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Monarch stores gene to phenotype associations",
        vocabulary: "MP, RO, RGD References, RGD genes"
      },
      {
        sourceDisplayName: "Saccharomyces Genome Database",
        sourceDescription: "The Saccharomyces Genome Database (SGD) provides comprehensive integrated biological information for the budding yeast Saccharomyces cerevisiae along with search and analysis tools to explore these data, enabling the discovery of functional relationships between sequence and gene products in fungi and higher organisms.",
        sourceVersion: "-",
        monarchReleaseDate: "February 23, 2019",
        monarchUsage: "Monarch stores gene to phenotype associations and gene function data",
        vocabulary: "APO, RO"
      }
    ]
  };
}

export async function getSearchResults(query, start, rows, categories, taxa) {
  const bioentityUrl = `${biolink}search/entity/${query}`;
  const params = new URLSearchParams();
  params.append('start', start);
  params.append('rows', rows);
  params.append('highlight_class', 'hilite');
  params.append('boost_q', 'category:genotype^-10');
  params.append('boost_q', 'category:variant^-35');
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
  let url = `${baseUrl}${urlExtension}`;
  const useTaxonRestriction = taxons && taxons.length > 0 && isTaxonCardType(cardType);

  // Use monarch solr until amigo-ontobio connection is ready
  if (cardType === 'function') {
    url = `${biolink}association/type/gene_function`;
    params.subject = nodeId;
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
