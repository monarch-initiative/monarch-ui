// Functions to deal with BBOP graph json, retrieved from biolink-api
// https://berkeleybop.github.io/bbop-graph/doc/index.html

import us from 'underscore';

export function mergeStaticData(sourceData, staticSourceData) {
  sourceData = us.map(sourceData, function (sourceDatum) {
    if (staticSourceData.hasOwnProperty(sourceDatum._summary_iri)) {
      const staticDatum = staticSourceData[sourceDatum._summary_iri];
      return Object.assign({}, sourceDatum, staticDatum);
    }
    return sourceDatum;

  });
  return sourceData;
}

export function populateSourceFiles(sourceData, graph) {
  for (let i = 0; i < sourceData.length; i++) {
    const sources = _subjectPredicate2Objects(sourceData[i]._version_iri, 'dcterms:source', graph);
    sourceData[i].sourceFiles = us.chain(sources)
      .map(function (source) {
        const node = graph.get_node(source);
        let retVal = 'Unknown';
        if (node._metadata.hasOwnProperty('http://purl.org/pav/retrievedOn')) {
          retVal = node._metadata['http://purl.org/pav/retrievedOn'][0];
        }
        return { 'fileUrl': source, 'retrievedOn': retVal };
      })
      .value();
  }
}

export function populateIngestDate(sourceData, graph) {
  for (let i = 0; i < sourceData.length; i++) {
    sourceData[i].ingestDate =
            graph.get_node(sourceData[i]._version_iri)._metadata['http://purl.org/dc/terms/created'][0];
  }
}

export function populateRdfDownloadUrl(sourceData, graph) {
  for (let i = 0; i < sourceData.length; i++) {
    const distribution_iri = _versionIRI2distributionIRI(sourceData[i]._version_iri, graph);
    const downloadUrls = _subjectPredicate2Object(distribution_iri, 'dcterms:downloadURL', graph);
    sourceData[i].rdfDownloadUrl = downloadUrls.replace('MonarchArchive:', 'https://archive.monarchinitiative.org/');
  }
}

export function _versionIRI2distributionIRI(version_iri, graph) {
  return _subjectPredicate2Object(version_iri, 'dcat:Distribution', graph);
}

export function _subjectPredicate2Objects(subject_iri, predicate, graph) {
  const edges = graph.get_edges_by_subject(subject_iri);
  const object_iri = us.chain(edges)
    .filter(function (edge) {
      return edge._predicate_id == predicate;
    })
    .pluck('_object_id')
    .value();
  return object_iri;
}

export function _subjectPredicate2Object(subject_iri, predicate, graph) {
  return us.chain(_subjectPredicate2Objects(subject_iri, predicate, graph))
    .first()
    .value();
}
