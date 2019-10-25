import xrefs from "@/lib/conf/xrefs";

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
      return {
        id: pub.id,
        label: pub.label || pub.id,
        url: `/publication/${pub.id}`
      }
    });
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
  const [prefix, reference] = curie.split(":");
  if (source in xrefs && prefix in xrefs[source]) {
    url = xrefs[source][prefix];
    url = url.replace("[reference]", reference);
    url = url.replace("[label]", label);

    // OMIM:1234.123 -> OMIM:1234#123
    if (prefix === 'OMIM') {
      url = url.replace(".", "#");
    }
  }
  return url;
}