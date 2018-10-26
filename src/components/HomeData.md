<div class="home-page-section data-section">
  <div class="row">
    <div class="col-sm">
      <router-link
        to="/analytics"
        class="btn btn-link"
        role="button">
        <img
          style="max-height:35px;"
          src="@/assets/img/icon-diseases.png"
          alt="disease">
      </router-link>
      <span class="network-name"><br><b>218,313</b><br>Disease-Phenotype Associations</span>
    </div>
    <div class="col-sm">
      <router-link
        to="/analytics"
        class="btn btn-link"
        role="button">
        <img
          style="max-height:35px;"
          src="@/assets/img/icon-genes.png"
          alt="disease">
      </router-link>
      <span class="network-name"><br><b>793,526</b><br>Gene-Phenotype Associations</span>
    </div>
    <div class="col-sm">
      <router-link
        to="/analytics"
        class="btn btn-link"
        role="button">
        <img
          style="max-height:35px;"
          src="@/assets/img/icon-models.png"
          alt="disease">
      </router-link>
      <span class="network-name"><br><b>20,870</b><br>Model Associations</span>
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
}
</style>
