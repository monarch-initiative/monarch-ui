<div
  class="container-fluid monarch-view monarch-team-view">
  <div class="content">

# Monarch People and their Institutions

<div></div>
    <div class="card p-3 bg-light">
      <h3>
        Participating Institutions
      </h3>
      <div class="teamtoc">
        <dl>
          <!-- https://vuejs.org/v2/guide/list.html#v-for-on-a-lt-template-gt -->
          <template
            v-for="institution in institutions">
            <dt><a v-bind:href="'#' + institution.id">{{ institution.name }}</a></dt>
            <dd>
              {{ institution.peopleNames.join(', ') }}
            </dd>
          </template>
        </dl>
      </div>
    </div>
    <div
      v-for="institution in institutions"
      v-bind:id="institution.id"
      class="institution-target">
      <h3>
        <a
          v-bind:href="institution.website"
          target="_blank"
          rel="noreferrer">
          <img
            class="teamlogo"
            v-bind:src="institution.logo">
          {{institution.name}}
        </a>
      </h3>
      <div
        v-for="member in institution.people"
        class="teammember">
        <template
          v-if="member.alumni">
          <div class="teammember">
            <div class="membername">{{ member.name }} (alumni {{ member.title }})</div>
          </div>
        </template>
        <template
          v-else="!member.alumni">
          <div class="memberhead">
            <div class="membername">{{ member.name }}</div>
            <div class="membertitle">{{ member.title }}</div>
          </div>
          <img
            class="memberpicture"
            v-bind:src="member.picture"/>
          <div class="clear"></div>
          <div class="memberbio">
            {{ member.bio }}
          </div>
          <!--
          <div class="membercontact">
            {{#email}}
            <a title="email" href="mailto:{{email}}" target="_blank"><img class="contactlogo" src="/image/logo-email.png" /></a> {{/email}} {{#website}}
            <a title="website" href="{{{website}}}" target="_blank"><img class="contactlogo" src="/image/logo-website.png" /></a> {{/website}} {{#twitter}}
            <a title="twitter" href="{{{twitter}}}" target="_blank"><img class="contactlogo" src="/image/logo-twitter.png" /></a> {{/twitter}} {{#facebook}}
            <a title="facebook" href="{{{facebook}}}" target="_blank"><img class="contactlogo" src="/image/logo-facebook.png" /></a> {{/facebook}}
          </div>
          -->
        </template>
      </div>
  </div>
  <team-footer></team-footer>
</div>


<style lang="scss">
@import "~@/style/variables";

.container-fluid.monarch-view.monarch-team-view {
  h1, h2, h3, h4, h5, h6 {
    clear:both;
  }

  figure {
    display:table;

    img {
      padding:15px;
    }
  }

  .right {
    float:right;
  }

  .left {
    float:left;
  }

  .center {
    margin-left:auto;
    margin-right:auto;
    vertical-align:middle;
    text-align:center;
  }

  .bottomright {
    float:right;
    position:relative;
    bottom:0;
    right:0;
  }

  figcaption {
    text-align:justify;
    font-size:12px;
    word-wrap:normal;
    display:table-caption;
    caption-side: bottom;
    padding: 0 10px 5px;
    line-height: 16px;
  }

  table {
    margin: auto;
    text-align: center;
    td a img {
      max-width: 120px;
      margin: 5px;
    }

    @media(min-width:$grid-float-breakpoint) {
      td a img {
        max-width: 200px;
      }
    }
  }

  .institution-target {
    padding-top: $navbar-height + 10px;
  }
  .team {
      padding: 0;
  }
  .team h3 {
      padding: 0;
  }
  img.teamlogo {
      display: inline-block;
      height: 50px;
      position: relative;
      top: -15px;
      float: right;
  }
  .teammember {
      border-top: #428bca solid 1px;
      padding: 10px 0px;
  }
  .membername {
      font-weight: 500;
      font-size: 16px;
  }
  .membertitle {
      font-style: italic;
      margin-bottom: 5px;
  }
  .memberbio {
      display: inline-block;
      line-height: 24px;
      font-weight: 200;
      font-family: Helvetica, Arial, sans-serif;
  }
  .memberhead {
      float: left;
  }
  .memberpicture {
      padding-left: 1em;
      max-height: 45px;
      height: auto;
  }
  .contactlogo {
      padding-right: 0.5em;
      max-height: 20px;
      height: auto;
  }
}

</style>


<script>
import getTeam from '@/api/Team';

export default {
  components: {
    'team-footer': require('@/components/Footer.md').default,
  },
  data() {
    return {
      institutions: [],
    };
  },
  async mounted() {
    this.institutions = (await getTeam()).institutions;
    console.log('institutions', this.institutions);
  }
};
</script>
