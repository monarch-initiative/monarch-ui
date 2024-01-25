<div class="container-fluid monarch-view services">
  <h2 class="page-title">Monarch Web Services</h2>
  <div class="row architecture">
    <div class="col-12 col-lg-6 offset-desktop-1 col-desktop-4 image">
      <img class="services" src="../assets/img/Monarch-Architecture2.png" />
    </div>
    <div class="col-12 col-lg-6 text">
      <h5><strong>Architecture</strong></h5>
      <p>
        Structured and unstructured data sources are loaded into SciGraph via
        dipper (1) , our data ingest pipeline. A variety of ontologies are
        processed in the Monarch Integration Layer and are also loaded into
        SciGraph, resulting in a combined knowledge and data graph (2). Data is
        disseminated via SciGraph Services, wrapped around by the BioLink API
        (3). This lightweight API makes few assumptions, acting as a data access
        layer for all of Monarch’s Services. Users can interrogate Monarch using
        our tools for text annotation, navigating the ontologies, and matching
        phenotype profiles (4).
      </p>
    </div>
  </div>
  <div class="row biolink">
    <div class="offset-1 col-10 offset-desktop-2 col-desktop-7 banner">
      <div class="logo-wrapper">
        <img
          class="logo"
          src="../assets/img/biolink_logo_white.png"
        /><br /><br />
        <b-button
          href="https://api-biolink.monarchinitiative.org/api/"
          target="_blank"
          class="documentation"
          variant="outline-light"
          >Documentation</b-button
        >
      </div>
      <div class="description">
        <p>
          An API providing access to biologically and biomedically relevant
          entities, and the relationships between them.
        </p>
        <span class="entities">
          <ul>
            <li>genes, gene products, proteins</li>
            <li>diseases, phenotypes, traits, and clinical measurements</li>
            <li>pathways, biological process</li>
            <li>substances: small molecules, drugs, chemical entities</li>
            <li>biological and molecular roles and activities</li>
            <li>
              genotypes, alleles, sequence variants; for plants, germplasms
            </li>
          </ul>
        </span>
        <span class="entities">
          <ul>
            <li>environmental contexts and exposures</li>
            <li>individual organisms: patients, cohorts, model organisms</li>
            <li>cell lines and cell types</li>
            <li>
              investigations: experiments, clinical trials, and 'natural
              experiments'
            </li>
            <li>genomic features, phylogenies</li>
            <li>publications, ontology terms, database metadata</li>
          </ul>
        </span>
      </div>
    </div>
  </div>
</div>
<style lang="scss">
  @import "~@/style/variables";
  .architecture {
    .image {
      text-align: center;
      img.services {
        height: auto;
        max-width: 650px;
        width: 100%;
      }
    }
    .text {
      margin-top: 50px;
    }
  }
  .biolink {
    .banner {
      box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
        0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
      margin-top: 50px;
      padding: 25px;
      color: white;
      border-radius: 0.5rem;
      background-color: $monarch-bg-color;
      display: block;
      @media screen and (min-width: 768px) {
        display: inline-flex;
      }
      .logo-wrapper {
        margin: 0 auto;
        text-align: center;
        @media (max-width: 991px) {
          display: block;
        }
        display: inline-block;
      }
      .logo {
        max-height: 175px;
      }
      .description {
        font-size: 1.2rem;
        float: right;
        display: block;
      }
      .entities {
        font-size: 1rem;
        float: left;
        ul {
          list-style-type: none;
        }
      }
      .documentation {
        color: white;
        margin: 0 0 15px 15px;
        &:hover {
          background-color: transparent !important;
          opacity: 0.8;
        }
      }
    }
  }
</style>
