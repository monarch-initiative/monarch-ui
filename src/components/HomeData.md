<div class="home-page-section data-section">
  <div class="row">
    <div class="col-sm">
      <router-link
        to="/analytics"
        class="btn btn-link"
        role="button">
        <img
          class="icon"
          src="@/assets/img/icon-diseases.png"
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
          src="@/assets/img/icon-genes.png"
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
          src="@/assets/img/icon-models.png"
          alt="disease">
      </router-link>
      <span class="network-name">
      <p class="amount">20,870</p>
      <p class="text">Model Associations</p>
    </div>
  </div>
</div>


<style lang="scss">
@import "~@/style/variables";
@import "~@/style/home-page";

.data-section {
  padding-top: 50px;
  padding-bottom: 50px;
  background: $home-section-dark-bg;
  text-align: center;
  
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
</style>
