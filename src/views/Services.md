<div class="container-fluid monarch-view services">
    <h2 class="page-title">Monarch Web Services</h2> 
    <div class="row architecture">
        <div class="col-6">
            <img class="services" src="../assets/img/Monarch-Architecture2.png"/>
        </div>
        <div class="col-6 text">
        <h5><strong>Architecture</strong></h5>
        <p>Structured and unstructured data sources are loaded into SciGraph via dipper (1) , 
        our data ingest pipeline. A variety of ontologies are processed in the Monarch Integration Layer 
        and are also loaded into SciGraph, resulting in a combined knowledge and data graph (2). Data is 
        disseminated via SciGraph Services, wrapped around by the BioLink API (3). This lightweight API 
        makes few assumptions, acting as a data access layer for all of Monarch’s Services. Users can 
        interrogate Monarch using our tools for text annotation, navigating the ontologies, and matching 
        phenotype profiles (4).</p>
        </div>
    </div>
    <div class="row biolink">
        <div class="offset-lg-1 col-10 banner">
        <img class="logo" src="../assets/img/biolink_logo_white.png"/>
        <div class="description">
            <h5>RESTful API</h5>
            An API providing access to information on biologically and biomedically relevant entities, and the relationships between them.
        </div>
        <b-button variant="outline-primary">Take Me There</b-button>
        </div>
    </div>
</div>
<style lang="scss">
@import "~@/style/variables";
img.services {
    max-height: 350px;
}
.architecture .text {
    margin-top: 50px;
}
.biolink {
    .banner {
        box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
        margin-top: 50px;
        padding: 25px;
        color: white;
        background-color: $monarch-bg-color;
        .logo {
            max-height: 175px;
            float: left;
        }
    }
}
</style>

