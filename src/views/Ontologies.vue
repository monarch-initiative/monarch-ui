<template>
    <div class="container-fluid monarch-view monarch-ontologies offset-1 col-10">
        <h2 class="page-title">About Ontologies</h2>
        <h4>Ontologies maintained by Monarch</h4>
        <ul>
            <div v-for="ontology in ontologyLicenseInfo.ontologies">
                <li v-if="['ecto', 'geno', 'hp', 'maxo', 'mondo', 'sepio', 'upheno'].includes(ontology.id)">
                    <a v-if="ontology.homepage" :href="ontology.homepage" target="_blank">{{ontology.title}}</a>
                    <span v-else>{{ontology.title}}</span>
                    :
                    <a v-if="ontology.license" :href="ontology.license.url" target="_blank">
                        {{ontology.license.label}} License
                    </a>
                    <span v-else>No license info</span>
                </li>
            </div>
        </ul>

        <h4>Ontologies used by Monarch</h4>
        <ul>
            <div v-for="ontology in ontologyLicenseInfo.ontologies">
                <li v-if="['bfo', 'caro', 'chebi', 'cl', 'clo', 'dc', 'eco', 'ero', 'faldo', 'fao', 'fbbt', 'foaf', 'go',
            'hsapdv', 'iao', 'mpath', 'nbo', 'ncbitaxon', 'ncit', 'oba', 'oban', 'pato', 'pco', 'po', 'pw', 'ro', 'so',
            'stato', 'uberon', 'vt', 'wbbt', 'xco', 'zfa'].includes(ontology.id)">
                    <a v-if="ontology.homepage" :href="ontology.homepage" target="_blank">{{ontology.title}}</a>
                    <a v-else>{{ontology.title}}</a>
                    :
                    <a v-if="ontology.license" :href="ontology.license.url" target="_blank">
                        {{ontology.license.label}} License
                    </a>
                </li>
            </div>
        </ul>
    </div>
</template>

<script>
  import getOntologyLicenseInfo from "../api/OboFoundry";

  export default {
    data() {
      return {
        ontologyLicenseInfo: [],
        coreOntologies: [],
        keyOntologies: []
      };
    },
    async mounted() {
      this.ontologyLicenseInfo = (await getOntologyLicenseInfo());
    },
  };
</script>
