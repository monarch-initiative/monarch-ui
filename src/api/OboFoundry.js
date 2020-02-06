import axios from 'axios';
import yaml from 'js-yaml';

// Functions to retrieve license info from OBO Foundry http://obofoundry.org

export default async function getOntologyLicenseInfo() {
  const ontologyYamlUrl = 'http://obofoundry.org/registry/ontologies.yml';
  const ontologyResp = await axios.get(ontologyYamlUrl);

  let ontologyLicenseInfo = null;
  try {
    ontologyLicenseInfo = await yaml.safeLoad(ontologyResp.data, 'utf8');
  } catch (e) {
    console.log('ontology license info yaml.safeLoad ERROR', e);
  }
  return ontologyLicenseInfo;
}

