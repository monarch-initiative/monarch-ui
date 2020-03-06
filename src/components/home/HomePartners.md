<div class="home-page-section partners-section">

##### The **Monarch Initiative** is a collaboration between:
<br>
<div class="collab-wrapper">
    <div class="row">
        <div class="col-sm-4 offset-xl-3 col-xl-2 collab">
            <a href="https:oregonstate.edu/" target="__blank">
              <img src="../../assets/img/osu.png" alt="osu">
            </a>
        </div>
        <div class="col-sm-4 col-xl-2 collab">
            <a href="https://www.jax.org/" target="__blank">
                <img src="../../assets/img/jackson.png" alt="jax">
            </a>
        </div>
        <div class="col-sm-4 col-xl-2 collab">
            <a href="https://www.lbl.gov/" target="__blank">
                <img src="../../assets/img/lbnl.jpeg" alt="lbl">
            </a>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-4 offset-xl-3 col-xl-2 collab">
           <a href="https://www.ohsu.edu/" target="__blank">
                <img src="../../assets/img/ohsu.jpg" alt="ohsu">
           </a>
        </div>
        <div class="col-sm-4 col-xl-2 collab">
            <a href="http://www.smd.qmul.ac.uk" target="__blank">
                <img src="../../assets/img/qmul.png" alt="qmul">
            </a> 
        </div>
        <div class="col-sm-4 col-xl-2 collab">
            <a href="https://www.ebi.ac.uk/" target="__blank">
               <img src="../../assets/img/ebi.png" alt="ebi">
            </a>
        </div>     
    </div>
    <div class="row">
        <div class="col-sm-4 offset-xl-4 col-xl-2 collab">
           <a href="https://ada.com/" target="__blank">
                <img src="../../assets/img/ada.png" alt="ada">
            </a>
        </div>
        <div class=" col-sm-4 col-xl-2 collab">
            <a href="https://renci.org/" target="__blank">
                <img src="../../assets/img/renci.png" alt="renci">
            </a>
        </div>
    </div>
</div>
<p>
Monarch is supported generously by a NIH Office of the Director Grant #5R24OD011883, as well as by NIH-UDP: 
HHSN268201350036C, HHSN268201400093P, NCI/Leidos #15X143. We are grateful to the many 
<a href="/about/data-sources">original sources of our data</a> for allowing Monarch to integrate them in this way. 
For more information, see <a href="/about/licensing">About Monarch Licensing</a>.
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
        margin-top: 50px;
        .collab:last-child {
            margin-top:-30px;
        }
    }
    
    .row:nth-child(2) .collab:nth-child(2), .row:nth-child(2) .collab:last-child  {
        margin-top: 50px;
    }
    
    .row:nth-child(2) .collab:first-child  {
        margin-top: 15px;
        max-height: 150px;
    }
    
   }
    
  p {
    text-align: center;
    font-size: 1rem;
    line-height: 1.2rem;
  }
}
</style>
