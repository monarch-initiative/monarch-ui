<div class="home-page-section about-monarch-section">
  <div class="about-block">
    <h3>Connecting phenotypes to genotypes across species</h3>
    <div class="description">
      Semantic-based integrative data analytics.<br /><br />
      <router-link to="/about/monarch">
        <b-button squared class="about-btn"
          >Learn More<i class="fa fa-caret-right"></i>
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
        background: #cce34c;
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
