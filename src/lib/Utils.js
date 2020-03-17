import us from 'underscore';
import sanitizeHTML from 'sanitize-html';
import xrefs from '@/lib/conf/xrefs';


/**
 * Processes a list of publications and returns a list
 * of objects with the properties id, label, and url
 *
 * MONDO pubs filtered out, see
 * https://github.com/monarch-initiative/dipper/issues/718
 */
export function processPublications(publications) {
  return publications
    .filter(pub => !pub.id.startsWith('MONDO'))
    .map((pub) => {
      let url = '';
      if (pub.id.startsWith('PMID')) {
        const reference = pub.id.split(':')[1];
        url = `http://www.ncbi.nlm.nih.gov/pubmed/${reference}`;
      } else {
        url = `/publication/${pub.id}`;
      }
      return {
        id: pub.id,
        label: pub.label || pub.id,
        url
      };
    });
}

/**
 * Processes a list of source IRIs and returns
 * a label, eg
 * 'https://archive.monarchinitiative.org/#orphanet' -> 'orphanet'
 *
 */
export function processSources(sources) {
  sources = us.uniq(sources.map(db => db.replace(/_?slim/, '')));
  return sources.map(db => db
    .split('/')
    .pop()
    .replace('#', '')
    .split('.')[0]
    .toLowerCase()
    // monarch data boutique curated from OMIA data
    .replace('monarch', 'omia'));
}

/**
 * Returns a url as a string or null for the external source
 * given a source, curie, and label,
 *
 * uses the json object in @/lib/conf/xrefs.js
 *
 * @param source:  lower case source name
 * @param curie: curie formatted identifier (eg FOO:123)
 * @param label: label for curie
 */
export function getXrefUrl(source, curie, label) {
  let url = null;
  let [prefix, reference] = curie.split(':');
  // OMIM:1234.123 -> OMIM:1234#123
  if (prefix === 'OMIM') {
    reference = reference.replace('.', '#');
  }
  if (source in xrefs && prefix in xrefs[source]) {
    url = xrefs[source][prefix];
    url = url.replace('[reference]', reference);
    url = url.replace('[label]', label);
  }
  return url;
}

export function sanitizeText(dirty) {
  const result = sanitizeHTML(dirty, {
    allowedTags: sanitizeHTML.defaults.allowedTags.concat(['img', 'sup'])
  });

  return result;
}

export function sanitizeNodeLabel(dirty) {
  // See https://github.com/monarch-initiative/monarch-ui/issues/108
  // as a background for the below hack
  const tagRegex = new RegExp('<(.*?)>', 'g');
  return dirty.replace(tagRegex, '<sup>$1</sup>');
}
