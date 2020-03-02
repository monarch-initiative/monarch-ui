<div class="container-fluid monarch-view other-tools px-5">

<h2 class="page-title">Other Resources from the Monarch Initiative</h2>
    <div class="card">
        <h4>Exomiser</h4>
        <p>
                <a href="http://monarch-exomiser-web-dev.monarchinitiative.org/exomiser">Exomiser</a>
                is a Java program that functionally annotates variants
                from whole-exome sequencing data starting from a VCF file (version 4) and a set 
                of phenotypes encoded using the <a href="https://hpo.jax.org/app/">Human Phenotype 
                Ontology</a>. The functional annotation of variants is based on Jannovar and uses UCSC
                KnownGene or RefSeq transcript definitions and hg19 or hg38 genomic coordinates. Variants 
                are prioritized according to user-defined criteria on variant frequency, pathogenicity, 
                quality, inheritance pattern, and model organism phenotype data. Predicted pathogenicity data is extracted
                from the dbNSFP resource. Cross-species phenotype comparisons are
                powered by the OWLSim algorithm and use human, mouse, 
                and fish phenotypes. Exomiser is available for download <a href="https://github.com/exomiser/Exomiser"> 
                here</a>. A paper describing 
                Exomiser is available <a href="http://genome.cshlp.org/content/24/2/340.long">here</a>.
        </p>
    </div>
    <div class="card">
            <h4>LIRICAL</h4>
            <p>
                <a href="https://lirical.readthedocs.io/en/latest/">LIRICAL</a>
                is Java software that provides prioritization of candidate diseases using a likelihood 
                ratio statistical framework. LIRICAL takes as input a set of phenotypic abnormalities
                encoded using the <a href="https://hpo.jax.org/app/">Human Phenotype Ontology</a> 
                and, optionally, a set of genome variant calls from a VCF file. For each candidate 
                disease, the likelihood ratio for each phenotype and genotype input by the user is
                calculated. A ranked list of candidate diseases is output, along with posterior
                probabilities and likelihood ratios for each phenotype and genotype, as well as a
                post-test probability for each candidate disease.
            </p>
    </div>
    <div class="card">
        <h4>PhenIX</h4>
        <p>
          Phenotypic Interpretation of eXomes
          is a pipeline for prioritizing candidate genes in exomes or NGS panels with
          comprehensive coverage of human Mendelian disease genes. It ranks genes
          based on predicted variant pathogenicity as well as phenotypic similarity
          of diseases associated with the genes harboring these variants to the
          phenotypic profile of the individual being investigated. PhenIX requires
          a VCF file mapped to hg19/Gchr37, as well as a list of HPO terms representing
          the phenotype observed in the patient. PhenIX is no longer under active development, and 
          most of its functionality has been merged into Exomiser.
        </p>
    </div>
    <div class="card">
            <h4>ExomeWalker</h4>
            <p>
              ExomeWalker is a computational method to prioritize a set of candidates
              in exome sequencing projects that aim to identify novel Mendelian
              disease genes. This approach involves filtering a Variant Call Format
              (VCF) file according to a number of user-definable criteria.<br>
              Genes are prioritized according to a variant score (predicted pathogenicity,
              rarity, pattern of variants compatible with the assumed mode of
              inheritance) and to their vicinity to other genes that belong to the
              same phenotypic disease family within a protein protein interaction
              (PPI) network, using the Random-Walk method as described in
              <a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2427257/">Köhler</a>
              et al. (2008) to determine similarity within the PPI network on the basis
              of the global characteristics of the network. ExomeWalker is no longer under
              active development, and most of its functionality has been merged into Exomiser.
            </p>
    </div>
    <div class="card">
            <h4>HIPPO</h4>
            <p>
            Do you often search for a phenotype, a gene symbol or a disease in Pubmed and try to find out other relevant 
            biomedical entities in the same context? If that’s you then the Monarch <a href="http://hippo.monarchinitiative.org/">
            Hippo</a> can help you to do it in a few clicks. A tutorial is available <a href="http://hippo.monarchinitiative.org/#/tutorial">
            here</a>.
            </p>
    </div>
    <div class="card">
            <h4>Phenogrid</h4>
            <p><a href="https://github.com/monarch-initiative/phenogrid">Phenogrid</a> is a Javascript component that
            visualizes semantic similarity calculations provided by OWLSim,
            as provided through APIs from the Monarch Initiative. Given an input list of phenotypes and parameters 
            specified in config/phenogrid_config.js indicating desired source of matching models (humans, model
            organisms, etc.), the phenogrid will call the Monarch API to get OWLSim results and render them in your web
            browser in data visualization.</p>
    </div>
    <div class="card">
            <h4>Dipper</h4>
            <p><a href="https://github.com/monarch-initiative/dipper">Dipper</a> is a Python package to generate RDF 
            triples from common scientific resources. Dipper includes subpackages and modules to create graphical models
            of this data. Data generated from this pipeline can be used in a variety of ways downstream. We recommend
            loading the data into a triple store or graph database that is optimized for use with ontologies, such as
            BlazeGraph. We also maintain SciGraph, an application that loads RDF and OWL into Neo4J. Smaller files can
            be loaded into an ontology editor like Protege.</p>
    </div>
    <div class="card">
            <h4>HPO Case Annotator</h4>
            <p>
            <a href="https://github.com/monarch-initiative/HpoCaseAnnotator">The HPO Case Annotator (HCA)</a> GUI is a
            Java app created with aim to make the biocuration of published pathogenic human variants easier.
            </p>
    </div></div>

<style lang="scss">
@import "~@/style/variables";

.other-tools .card { 
    padding: 15px;
    border: 5px solid $monarch-bg-color;
    margin-bottom: 15px;
}

</style>

