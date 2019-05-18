<template>
  <div class="monarch-legacy">
    <div v-if="progressPath">
      <br>
      <br>
      <br>
      <div class="progress">
        <div
          class="progress-bar progress-bar-striped active"
          role="progressbar"
          aria-valuenow="40"
          aria-valuemin="0"
          aria-valuemax="100"
          style="width:100%;margin:auto;">Loading <b>{{ progressPath }}</b>
        </div>
      </div>
    </div>

    <!--     <div v-if="contentBody" v-bind:is="transformedBody" v-bind="$props">
    </div>
 -->

    <div
      v-if="contentBody"
      xv-bind="$props"
      v-html="contentBody"/>

  </div>
</template>

<script>

function loadPathContentAsync(path, done) {
  /* global XMLHttpRequest */
  const oReq = new XMLHttpRequest();

  let refinedPath = path;
  if (refinedPath.indexOf('/') === 0) {
    refinedPath = '/legacy' + refinedPath;
    refinedPath = `https://localhost:8080${refinedPath}`;
  }

  // const hashIndex = refinedPath.indexOf('#');
  // if (hashIndex >= 0) {
  //   refinedPath = refinedPath.slice(0, hashIndex) + '?stripme' + refinedPath.slice(hashIndex);
  // }
  // else {
  //   refinedPath += '?stripme';
  // }

  oReq.addEventListener('loadend', function load() {
    done(this.status, this.responseText, this.responseURL, refinedPath);
  });

  try {
    oReq.open('GET', refinedPath);
    oReq.send();
  }
  catch (e) {
    console.log('loadPathContentAsync exception', path, refinedPath, this, e);
  }
}

function updatePageLinks() {
  function findLinks() {
    return [].slice.call(document.querySelectorAll('[data-monarch-legacy]'));
  }

  function getLinkPath(link) {
    return link.pathname || link.getAttribute('href');
  }

  const self = this;

  findLinks().forEach((link) => {
    if (!link.hasListenerAttached) {
      // console.log('link:', link, getLinkPath(link));
      link.addEventListener('click', function click(e) {
        let location = getLinkPath(link);

        location = location
          .replace(/\/+$/, '')
          .replace(/^\/+/, '/');

        // console.log('click', location, self._destroyed);
        if (!self._destroyed) {
          e.preventDefault();
          self.push(location);
        }
      });
      link.hasListenerAttached = true;
    }
  });
}

// Copied from https://github.com/jashkenas/underscore/blob/e944e0275abb3e1f366417ba8facb5754a7ad273/underscore.js#L1458

const unescapeMap = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#x27;': '\'',
  '&#x60;': '`',
  '&#x2F;': '/'
};

// Functions for escaping and unescaping strings to/from HTML interpolation.
function createEscaper(map) {
  function escaper(match) {
    return map[match];
  }
  // Regexes for identifying a key that needs to be escaped.
  const source = '(?:' + Object.keys(map).join('|') + ')';
  const testRegexp = RegExp(source);
  const replaceRegexp = RegExp(source, 'g');
  return function f(string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}
const unescape = createEscaper(unescapeMap);

/* eslint camelcase: 0 */

function setupLegacyMocks() {
  window.navbar_search_init = function navbar_search_init() {
    console.log('Mock navbar_search_init');
  };
  window.InitMonarchPage = function InitMonarchPage() {
    console.log('Mock InitMonarchPage');
  };
  window.InitTabs = function InitTabs() {
    console.log('Mock InitTabs');
  };
  window.InitTables = function InitTables() {
    console.log('Mock InitTables');
  };
  window.InitFacetFilters = function InitFacetFilters() {
    console.log('Mock InitFacetFilters');
  };
  window.makeGeneLandingGraph = function makeGeneLandingGraph() {
    console.log('Mock makeGeneLandingGraph');
  };
  window.makeGeneDiseaseLandingGraph = function makeGeneDiseaseLandingGraph() {
    console.log('Mock makeGeneDiseaseLandingGraph');
  };
  window.makeDiseaseLandingGraph = function makeDiseaseLandingGraph() {
    console.log('Mock makeDiseaseLandingGraph');
  };
  window.makePhenotypeLandingGraph = function makePhenotypeLandingGraph() {
    console.log('Mock makePhenotypeLandingGraph');
  };
  window.makeModelLandingGraph = function makeModelLandingGraph() {
    console.log('Mock makeModelLandingGraph');
  };
}

export default {
  name: 'Monarchlegacy',
  data() {
    return {
      contentScript: '',
      contentBody: '',
      progressTimer: null,
      progressPath: null,
      path: null
    };
  },
  computed: {
    transformedScript() {
      return {
        template: this.contentScript,
        props: this.$options.props
      };
    },
    transformedBody() {
      return {
        template: this.contentBody,
        props: this.$options.props
      };
    }
  },
  watch: {
    '$route': function $route(to, from) {
      // Only fetchData if the path is different.
      // hash changes are currently handled by monarch-tabs.js
      // within the loaded MonarchLegacy component.

      if (to.path !== this.path) {
        this.fetchData();
      }
    }
  },
  created() {
  },
  mounted() {
    this.fetchData();
    this.$on('legacyContentChanged', function legacyContentChanged(msg) {
      console.log('legacyContentChanged:', msg);
    });
    setupLegacyMocks();
  },
  destroy() {
  },
  methods: {
    fetchData() {
      const that = this;
      const path = that.$route.fullPath;
      this.path = that.$route.path;

      if (that.progressTimer) {
        console.log('leftover progressTimer');
      }
      else {
        that.progressPath = null;
        that.progressTimer = setTimeout(function timeout() {
          that.progressTimer = null;
          that.progressPath = path;
          that.contentBody = null;
        }, 500);
      }
      const scriptHeaderPrefix = '+++++++++++++++monarch-script';
      const scriptHeaderSuffix = '---------------monarch-script';
      loadPathContentAsync(this.path, function loaded(status, content, responseURL, originalURL) {
        if (status !== 200) { // (status === 504) || (status === 404)) {
          that.contentBody = `
            <br>
            <br>
            <br>
            <h3 class="text-center">
              Error accessing legacy server at
              <a
                href="${responseURL}"
                target="_blank">
                ${originalURL}
              </a>
            </h3>

            <h4 class="text-center">Response Code: ${status}</h4>
            <hr>

            <h4 class="text-center">
              <a
                href="/">
                Return to Home
              </a>
            </h4>
            `;

          that.$nextTick(function tick() {
            if (that.progressTimer) {
              clearTimeout(that.progressTimer);
              that.progressTimer = null;
            }
            that.progressPath = null;
          });
        }
        else {
          const scriptHeaderBegin = content.indexOf(scriptHeaderPrefix);
          const scriptHeaderEnd = content.indexOf(scriptHeaderSuffix);
          if (scriptHeaderBegin !== 0
              || scriptHeaderEnd <= 0) {
            console.log('Invalid script header', scriptHeaderBegin, scriptHeaderEnd, content.slice(0, 100));
          }
          else {
            // console.log('#content', content);
            that.contentScript = content.slice(
              scriptHeaderBegin + scriptHeaderPrefix.length,
              scriptHeaderEnd
            );
            that.contentBody = content.slice(
              scriptHeaderEnd + scriptHeaderSuffix.length
            );
            // that.contentBody = unescape(that.contentBody);

            that.$nextTick(function tick() {
              if (that.progressTimer) {
                clearTimeout(that.progressTimer);
                that.progressTimer = null;
              }
              that.progressPath = null;

              // The following .replace() is really supposed to strip
              // the http://domain.com prefix and leave the path behind.
              // It doesn't work in window.mngLocalServerMode and is probably
              // no longer relevant.
              responseURL = responseURL.replace(window.location.origin, '');
              responseURL = responseURL.replace(/\/legacy/g, '');
              if (!window.mngLocalServerMode && responseURL !== path) {
                console.log('path/responseURL', window.location.origin, path, responseURL);
                const hashIndex = path.indexOf('#');
                if (hashIndex >= 0) {
                  responseURL += path.slice(hashIndex);
                }

                // that.$router.replace(originalURL, function () {
                //   that.path = that.$route.path;
                // });
              }

              // console.log('that.contentScript', that.contentScript.slice(0, 50));
              if (that.contentScript) {
                /* eslint no-eval: 0 */
                eval(that.contentScript);
                updatePageLinks();
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style>
</style>
