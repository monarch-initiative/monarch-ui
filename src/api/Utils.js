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