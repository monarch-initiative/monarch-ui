<div class="home-page-section news-section">
  <div class="row">
    <div class="col-sm">

##### News from [@MonarchInit](https://medium.com/@MonarchInit)

<div></div>
      <ul class="list-inline">
        <li
          v-for="(item, index) in newsItems"
          :key="index">
          <small>{{ item.date }}</small>
          <a
            :href="item.url"
            target="_blank">
            {{ item.title }}
          </a>
        </li>
      </ul>
    </div>
    <div class="col-sm">

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

  ul {
    padding: 0 10px;
    text-align: left;

    li {
      line-height: 1.3em;
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
