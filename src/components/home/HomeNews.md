<div class="home-page-section news-section">
  <div class="row">
    <div class="col-sm offset-lg-1 col-lg-6">

<h5> News from <a href="https://medium.com/@MonarchInit" target="__blank">@MonarchInit</a></h5>
<i class="fas fa-newspaper"></i>
<div></div>
      <ul class="list-inline">
        <li
          v-for="(item, index) in newsItems"
          :key="index">
          <span class="news-date">{{ item.date }}</span>
          <a
            class="news-title"
            :href="item.url"
            target="_blank">
            {{ item.title }}
          </a>
        </li>
      </ul>
    </div>
    <div class="col-sm col-lg-4">

##### <i class="fa fa-twitter fa-fw"></i> Tweets from [@MonarchInit](https://twitter.com/MonarchInit)

<div></div>
      <a
        class="twitter-timeline"
        href="https://twitter.com/TheDoctorBud/lists/monarchinitiative1?ref_src=twsrc%5Etfw"
        data-preview=""
        data-chrome="noheader nofooter"
        data-height="350">
        @MonarchInit
      </a>
    </div>

  </div>
</div>


<style lang="scss">
@import "~@/style/variables";
@import "~@/style/home-page";

div.news-section {
  text-align: center;
  background: $home-section-light-bg;

  .news-date {
      width: fit-content;
      text-align: left;
      margin-right: 15px;
      display: block;
      font-style: italic;
  }
  
  ul {
    padding: 0 10px;
    text-align: left;
    margin-left: 5%;

    li {
      line-height: 1.3em;
      padding: 5px;
    }
  }
}
</style>


<script>
import getNewsItems from '@/api/News';

export default {
  data() {
    return {
      newsItems: [],
    };
  },
  async mounted() {
    this.newsItems = await getNewsItems();

    /* eslint-disable */
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t.widgets.load();
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f) {
        t._e.push(f);
      };
      return t;
    }(document, "script", "twitter-wjs"));
    /* eslint-enable */
  }
};
</script>
