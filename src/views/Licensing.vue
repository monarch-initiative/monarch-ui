<template>
<div class="container-fluid monarch-view monarch-licensing offset-1 col-10">
    <h2 class="page-title">About Licensing</h2>
    <p>The Monarch App is comprised of multiple different components: interface, data, ontologies, software and algorithms.
    It is therefore not possible to provide everything under a unified license. The specific components and their licensing information are below.</p>
    <h4>Interface</h4>
    <ul>
    <li><a href="https://github.com/monarch-initiative/monarch-app/">The Monarch-App: </a>
    <a href="https://github.com/monarch-initiative/monarch-app/blob/master/LICENSE.txt">BSD 3 License</a></li>
    </ul>
    <h4>Algorithms</h4>
    <ul>
    <li><a href="https://monarch-exomiser-web-dev.monarchinitiative.org/exomiser/">Exomiser</a>:
    <a href="http://opensource.org/licenses/AGPL-3.0"> GNU Affero General Public License, version 3</a></li>
    <li><a href="https://github.com/owlcollab/owltools/">OwlSim</a>:
    <a href="https://github.com/owlcollab/owltools/blob/master/LICENSE.txt">BSD 3 License</a></li>
    <li><a href="https://github.com/TheJacksonLaboratory/LIRICAL">LIRICAL</a>:
    <a href="https://github.com/TheJacksonLaboratory/LIRICAL/blob/master/LICENSE">License information</a></li>
    </ul>
    <h4>Semantic tools and workflows</h4>
    <ul>
    <li><a href="https://github.com/monarch-initiative/dipper">Dipper</a>:
    <a href="https://github.com/monarch-initiative/dipper/blob/master/LICENSE.txt">BSD 3 License</a></li>
    <li><a href="https://github.com/SciGraph/SciGraph/">SciGraph</a>:
    <a href="https://github.com/SciGraph/SciGraph/blob/master/LICENSE">Apache License 2.0</a>
    </li>
    <li><a href="https://github.com/biolink/ontobio">OntoBio</a>:
    <a href="https://github.com/biolink/ontobio/blob/master/LICENSE">BSD 3 License</a>
    </li>
    </ul>
    <h4>Core Ontologies</h4>
        <ul v-for="ontology in ontologyLicenseInfo.ontologies">
            <li v-if="['ecto', 'geno', 'hp', 'maxo', 'mondo', 'sepio', 'upheno'].includes(ontology.id)">
                <a v-if="ontology.homepage" :href="ontology.homepage" target="_blank">{{ontology.title}}</a>
                <span v-else>{{ontology.title}}</span>
                :
                <a v-if="ontology.license" :href="ontology.license.url" target="_blank">
                    <img :src="ontology.license.logo" height="15">
                </a>
                <span v-else>No license info</span>
            </li>
        </ul>

    <h4>Key Ontologies</h4>
        <ul v-for="ontology in ontologyLicenseInfo.ontologies">
            <li v-if="['bfo', 'caro', 'chebi', 'cl', 'clo', 'dc', 'eco', 'ero', 'faldo', 'fao', 'fbbt', 'foaf', 'go',
            'hsapdv', 'iao', 'mpath', 'nbo', 'ncbitaxon', 'ncit', 'oba', 'oban', 'pato', 'pco', 'po', 'pw', 'ro', 'so',
            'stato', 'uberon', 'vt', 'wbbt', 'xco', 'zfa'].includes(ontology.id)">
                <a v-if="ontology.homepage" :href="ontology.homepage" target="_blank">{{ontology.title}}</a>
                <a v-else>{{ontology.title}}</a>
                :
                <a v-if="ontology.license" :href="ontology.license.url" target="_blank">
                    <img :src="ontology.license.logo" height="15">
                </a>
            </li>
        </ul>

    <h4>Other Standards</h4>
    <ul>
    <li><a href="https://github.com/phenopackets/phenopacket-schema">Phenopackets</a>:
    <a href="https://github.com/phenopackets/phenopacket-schema/blob/master/LICENSE">BSD 3 License</a>
    </li>
    <li><a href="https://github.com/biolink/biolink-api">BioLink-api</a>:
        <a href="https://github.com/biolink/biolink-api/blob/master/LICENSE">BSD 3 License</a></li>
    <li><a href="https://github.com/biolink/biolink-model">BioLink-model</a>:
        <a href="https://github.com/biolink/biolink-model/blob/master/LICENSE">Creative Commons Zero v1.0 Universal License</a></li>
    </ul>
    <h4>Data</h4>
    <p>Data are derived from multiple sources (see <a href="/about/data-sources">here</a>), each with its own license. We
    have described this licensing challenge extensively on <a href="reusabledata.org">reusabledata.org</a> and our
    <a href="https://doi.org/10.1371/journal.pone.0213090">2018 PlosOne publication</a>. Many of the specific data
    resources we use in Monarch have been evaluated according to our reusabledata.org rubric; see the corpus of
    evaluations <a href="http://reusabledata.org/#our-sources-data">here</a>.</p>
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
