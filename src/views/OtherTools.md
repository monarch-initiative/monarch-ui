<div class="container-fluid monarch-view other-tools">

<h2 class="page-title">Other Resources from Monarch Initiative</h2>
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
</div>

<style lang="scss">
@import "~@/style/variables";

.other-tools .card { 
    padding: 15px;
    border: 5px solid $monarch-bg-color;
    margin-bottom: 15px;
}

</style>

