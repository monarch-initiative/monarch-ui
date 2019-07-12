<div class="home-page-section partners-section">

##### The **Monarch Initiative** is a collaboration between:
<br>
<div class="collab-wrapper">
    <div class="row">
        <div class="col-sm-4 offset-xl-3 col-xl-2 collab">
            <a href="https:oregonstate.edu/" target="__blank">
              <img src="../assets/img/osu.png" alt="osu">
            </a>
        </div>
        <div class="col-sm-4 col-xl-2 collab">
            <a href="https://www.charite.de/en/" target="__blank">
                <img src="../assets/img/charite.png" alt="charite">
            </a>
        </div>
        <div class="col-sm-4 col-xl-2 collab">
            <a href="https://www.jax.org/" target="__blank">
                <img src="../assets/img/jackson.png" alt="jax">
            </a>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4 offset-xl-3 col-xl-2 collab">
            <a href="https://www.lbl.gov/" target="__blank">
                <img src="../assets/img/lbnl.jpeg" alt="lbl">
            </a>
        </div>
        <div class="col-sm-4 col-xl-2 collab">
                <a href="https://www.ohsu.edu/" target="__blank">
                    <img src="../assets/img/ohsu.jpg" alt="ohsu">
                </a>
        </div>
        <div class="col-sm-4 col-xl-2 collab">
            <a href="http://www.smd.qmul.ac.uk" target="__blank">
               <img src="../assets/img/qmul.png" alt="qmul">
            </a>
        </div>     
    </div>
    <div class="row">
        <div class="col-sm-4 offset-xl-3 col-xl-2 collab">
            <a href="https://renci.org/" target="__blank">
               <img src="../assets/img/renci.png" alt="renci">
            </a>
        </div>
        <div class="offset-sm-4 col-sm-4 offset-xl-2 col-xl-2 collab">
            <a href="http://www.sanger.ac.uk/" target="__blank">
               <img src="../assets/img/sanger.png" alt="sanger">
            </a>
        </div>
    </div>
</div>
<p>
Monarch is supported generously by a NIH Office of the Director Grant #5R24OD011883, as well as by NIH-UDP: 
HHSN268201350036C, HHSN268201400093P, NCI/Leidos #15X143. We are grateful to the many 
<a href="/sources">original sources of our data</a> for allowing Monarch to integrate them in this way. 
Except where forbidden by the original sources, this work is licensed under a Creative Commons Attribution 3.0 License.
</p>
</div>


<style lang="scss">
@import "~@/style/variables";
@import "~@/style/home-page";

div.partners-section {
  padding: 15px 15px;
  background: $home-section-light-bg;
  text-align: center;

  .collab-wrapper {
  
    .collab img {
      max-width: 200px;
    }
  
    .row:last-child {
     margin-bottom: 50px;
     @media only screen and (min-width: 768px){
        margin-top: -75px;
         .collab:first-child {
                     margin-top: -35px;
          }
     } 
    }
  }
  p {
    text-align: center;
    font-size: 1rem;
    line-height: 1.2rem;
  }
}
</style>
