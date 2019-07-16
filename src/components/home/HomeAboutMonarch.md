<div class="home-page-section about-monarch-section">
    <div class="about-block">
       <h3> Connecting phenotypes to genotypes across species </h3>
       <!-- <div class="data-section">
          <div class="row">
            <div class="col-sm">
              <router-link
                to="/analytics"
                class="btn btn-link"
                role="button">
                <img
                  class="icon"
                  src="@/assets/img/monarch-ui-icon_ANATOMY.png"
                  alt="disease">
              </router-link>
              <span class="network-name">
                  <p class="amount">218,313</p>
                  <p class="text">Disease-Phenotype Associations</p>
              </span>
            </div>
            <div class="col-sm">
              <router-link
                to="/analytics"
                class="btn btn-link"
                role="button">
                <img
                  class="icon"
                  src="@/assets/img/monarch-ui-icon_GENE.png"
                  alt="disease">
              </router-link>
              <span class="network-name">
              <p class="amount">793,526</p>
              <p class="text">Gene-Phenotype Associations</p>
            </div>
            <div class="col-sm">
              <router-link
                to="/analytics"
                class="btn btn-link"
                role="button">
                <img
                  class="icon"
                  src="@/assets/img/monarch-ui-icon_MODEL.png"
                  alt="disease">
              </router-link>
              <span class="network-name">
              <p class="amount">20,870</p>
              <p class="text">Model Associations</p>
            </div>
          </div>
        </div> -->
        <div class="description">
            Semantic-based integrative data analytics.<br><br>
            <router-link to="/about/monarch">
                <b-button squared class="about-btn">Learn More<i class="fa fa-caret-right"></i>
                </b-button>
            </router-link>
        </div>
    </div>
</div>


<style lang="scss">
@import "~@/style/variables";
@import "~@/style/home-page";

div.about-monarch-section {
  padding: 15px;
  background-image: url("../../assets/img/network.jpg");
  color: white;
  text-align: center;
  height: 250px;
  
  .data-section {
    .icon {
      max-height: 50px;
    }
    
    .network-name {
      .amount {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 0;
      }
      
      .text {
          font-size: 18px;
      }
    }
  }
  
  .about-block {
    margin-top: 50px;
    .about-btn {
        color: black;
        background: #CCE34C;
    }
  }
    
  .description {
    font-style: italic;
    
    .fa-caret-right {
        margin-left: 15px;
    }
  }
}
</style>
