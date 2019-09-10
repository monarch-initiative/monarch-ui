<template>
  <div class="monarch-view container-fluid">
    <h2 class="page-title">Text Annotator</h2>
    <div>
      <section class="section">
        <div class="container">
          <div class="columns">
            <div class="column is-8 is-offset-2">
              <div class="stepper-box">
                <div class="top">
                  <div class="divider-line"/>
                  <div class="steps-wrapper">
                    <div ref="step1" class="step">
                      <div class="icon">
                        <i class="fa fa-file-text fa-fw"/>
                      </div>
                      <div class="step-title">
                        <h4>Data</h4>
                        <h5 class="step-subtitle">Enter a phrase, piece of text or abstract</h5>
                      </div>
                    </div>
                    <div ref="step2" :class="['step', (resultsStep) ? '' : 'deactivated']">
                      <div class="icon">
                        <i class="fa fa-check fa-fw"/>
                      </div>
                      <div class="step-title">
                        <h4>Results</h4>
                        <h5 class="step-subtitle">Your annotated results</h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="content">
                  <div v-if="!resultsStep" class="step1">

                    <b-link @click="populateExample">
                      <i class="fa fa-arrow-circle-down" aria-hidden="true"/> Try example
                    </b-link>
                    <br>
                    <b-form-textarea
                      id="textarea"
                      v-model="form.message"
                      :class="['textarea', ($v.form.message.$error) ? 'is-danger' : '']"
                      placeholder="Enter something..."
                      rows="12"
                      max-rows="6"
                    />
                    <br>
                    <b-form-checkbox
                      id="checkbox-1"
                      v-model="longestOnly"
                      name="checkbox-1"
                      value="true"
                      unchecked-value="false"
                    >
                      Always use longest match.
                    </b-form-checkbox>
                  </div>
                  <div v-if="resultsStep" class="step2">
                    <div ref="step2text" class="step2" v-html="annotatedText"/>
                  </div>
                  <div v-if="showSpinner" class="spinner">
                    <b-spinner type="grow" label="Spinning"/>
                  </div>
                  <div v-if="errorAnnotating" class="error">
                    <h4>Sorry, looks like we couldn't process that text. If you think this is an error,
                    please open a ticket <a href="https://github.com/monarch-initiative/helpdesk/issues" target="__blank"> here</a> and we can address it right way.</h4>
                  </div>
                </div>
                <div :class="['bottom', (!annotatedText) ? 'only-submit' : '']">
                  <b-button
                    v-if="annotatedText"
                    ref="backButton"
                    :disabled="!validForm"
                    class="stepper-button back"
                    @click="back">
                    <i class="fa fa-caret-left fa-fw"/>Back
                  </b-button>
                  <b-button
                    v-if="!resultsStep"
                    ref="submitButton"
                    :disabled="!validForm"
                    class="stepper-button submit"
                    @click="annotateText">
                    Submit<i class="fa fa-caret-right fa-fw"/>
                  </b-button>
                  <b-button
                    v-if="annotatedText"
                    ref="analyzePhenotypes"
                    :to="{ name: 'analyze-phenotypes', params: { phenotypes: phenotypes } }"
                    :disabled="!validForm"
                    class="stepper-button submit">
                    Analyze Phenotypes<i class="fa fa-caret-right fa-fw"/>
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import * as biolink from '@/api/BioLink';


export default {
  components: {
  },
  mixins: [validationMixin],
  props: {
  },
  data() {
    return {
      validForm: true,
      form: {
        message: ''
      },
      annotatedText: '',
      resultsStep: false,
      dataStep: true,
      errorAnnotating: false,
      showSpinner: false,
      longestOnly: false,
      phenotypes: ''

    };
  },
  computed: {
  },
  watch: {
    $v: {
      handler(val) {
        if (!this.$v.$invalid) {
          this.validForm = true;
        }
        else {
          this.validForm = false;
        }
      },
      deep: true
    },
    annotatedText(val) {
      if (val) {
        const componentref = this;
        this.$nextTick(() => {
          this.storePhenotypes();
          Array.from(this.$refs.step2text.children).forEach((child) => {
            child.addEventListener('mouseenter', (elem) => {
              // If a popover container doesnt exist, create append and show,
              // otherwise just show.
              const annotation = elem.target;
              const rect = annotation.getBoundingClientRect();
              const left = rect.left + window.scrollX;
              if (annotation.children.length === 0) {
                const popover = componentref.buildPopover('Annotation', annotation.getAttribute('data-sciGraph'));
                popover.setAttribute('style', 'left:' + left + 'px !important;');
                annotation.appendChild(popover);
              }
              else {
                const popover = annotation.children[0];
                popover.classList.remove('hide-popover');
                popover.classList.add('show-popover');
              }
            }, false);

            child.addEventListener('mouseleave', (elem) => {
              const annotation = elem.target;
              const popover = annotation.children[0];
              popover.classList.remove('show-popover');
              popover.classList.add('hide-popover');
            }, false);
          });
        });
      }
    }
  },
  validations: {
    form: {
      message: {
        required
      }
    }
  },
  mounted() {
    if (!this.$v.$invalid) {
      this.validForm = true;
    }
    else {
      this.validForm = false;
    }
  },
  methods: {
    back() {
      this.annotatedText = '';
      this.resultsStep = false;
      this.errorAnnotating = false;
    },

    populateExample() {
      this.form.message = 'Lewis (1978) found 7 affected males and 5 affected females in 3 consecutive generations of a Caucasian kindred. As in the X-linked Nettleship-Falls form of ocular albinism (300500), the patients showed reduced visual acuity, photophobia, nystagmus, translucent irides, strabismus, hypermetropic refractive errors, and albinotic fundus with foveal hypoplasia. The skin lesions showed macromelanosomes as in X-linked ocular albinism. Deafness, which was accompanied by vestibular hypofunction, lentigines even in unexposed areas, optic nerve dysplasia, and dominant inheritance distinguished this form of ocular albinism. (In the LEOPARD syndrome (151100) vestibular function is normal.)\n' +
                    '\n' +
                    'Bard (1978) described a kindred that was atypical of Waardenburg syndrome (see 193510) in several ways. Although the nasal root was prominent, one affected person had dystopia of the inner canthi or lower puncta. The face in some showed striking freckling of pale skin. Symptomatic vestibular disturbance was another unusual feature. Lewis (1989) expressed the opinion that the family reported by Bard (1978) as an instance of Waardenburg syndrome in fact had this disorder. Lewis (1989) had also been told of 2 other small families with the syndrome. Goldberg (1966) described a Waardenburg syndrome family with apparent ocular albinism.\n' +
                    '\n' +
                    'Morell et al. (1997) presented an update of the clinical findings in the family of Bard (1978). The deafness was sensorineural and congenital. Heterochromia iridis was a prominent feature in 1 sibship in which both segmental iris bicolor and complete heterochromia occurred. Most of the affected individuals showed transillumination defects of the iris. Hypopigmentation of the fundus was mild in some, moderate in others, and severe in yet others. Almost all affected individuals had strabismus and visual acuity defects. One individual with a prominent white forelock, characteristic of Waardenburg syndrome, was pictured.';
    },

    async annotateText() {
      this.dataStep = false;
      this.resultsStep = true;
      this.showSpinner = true;
      const at = await biolink.annotateText(this.form.message, this.longestOnly);
      this.showSpinner = false;
      if (at.status !== 200) {
        this.errorAnnotating = true;
      }
      else {
        // Call some endpoint and wait for a response. If, then return then
        this.annotatedText = at.data;
      }

    },

    buildPopover(title, data) {
      // build the raw html popover..
      const popoverContainer = document.createElement('div');
      popoverContainer.setAttribute('class', 'popover show-popover');
      const header = document.createElement('h5');
      header.innerHTML = title;
      header.setAttribute('class', 'popover-header');
      const body = document.createElement('div');
      body.setAttribute('class', 'popover-body');

      const annotations = data.split('|');
      annotations.forEach((annotation) => {
        let finalBuiltAnnotation = '';
        annotation = annotation.split(',');
        finalBuiltAnnotation += '<div class=\'annotation\'><span class=\'ontology-id\'>' + annotation[1] + '</span>';
        finalBuiltAnnotation += annotation[0] + '</div>';
        body.innerHTML += finalBuiltAnnotation;
      });

      popoverContainer.appendChild(header);
      popoverContainer.appendChild(body);
      return popoverContainer;
    },

    storePhenotypes() {
      // get all span annotations
      const phenotypes = [];
      const allAnnotations = document.getElementsByClassName('sciCrunchAnnotation');
      Array.from(allAnnotations).forEach((annotation) => {
        const data = annotation.getAttribute('data-sciGraph');
        if (data.includes('HP:')) {
          // REGEX for the phenotype
          const phenotype = data.match(/HP:[0-9]{7}/)[0];
          phenotypes.push(phenotype);
        }
      });
      this.phenotypes = [...new Set(phenotypes)].join(',');
    }
  }
};
</script>
<style lang="scss">
    @import "~@/style/variables";
    .stepper-box {
        box-shadow: none !important;
        min-height: 200px;

        .content {
            overflow: hidden;
            margin: 5rem 0 3.5rem 0;
            min-height: 200px;

            .sciCrunchAnnotation{
                text-decoration: underline;;
                font-weight: bold;
                color: #39a5dc;
                cursor: pointer;
            }
            .popover {
                max-width: 450px !important;
                top: unset !important;

                .annotation {
                    font-weight: bold;
                }
                .ontology-id {
                    font-size: 12px;
                    color: gray;
                    margin-right: 5px;
                }
            }

            .show-popover {
                display: block;
            }

            .hide-popover {
                display: none;
            }

            .step1 {
                text-align: justify;
            }

            .hidden {
                display: none;
            }

            .spinner {
                text-align: center;
                margin-top: 50px;
                .spinner-grow {
                    animation: spinner-grow .80s linear infinite;
                    color: $monarch-bg-color;
                }
            }
            .error{
                text-align: center;
            }
        }
        .bottom {
            position: relative;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            padding: 2rem;
            border-top: 1px solid #cccccc;
            justify-content: space-between;
            &.only-submit {
                justify-content: flex-end;
            }

            .stepper-button {
                &.back {

                }
                background-color: $monarch-bg-color;
                &.deactivated {
                    background-color: #cccccc !important;
                    cursor: not-allowed !important;
                }
            }
        }
        .top {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: relative;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;

            .divider-line {
                border-bottom: 1px solid #cccccc;
                height: 2px;
                position: absolute;
                width: 40%;
            }

            .steps-wrapper {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
                position: relative;
                width: 95%;
                left: 0;
                padding: 2% 4%;

                .step {
                    position: relative;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-orient: vertical;
                    -webkit-box-direction: normal;
                    -ms-flex-direction: column;
                    flex-direction: column;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    text-align: center;
                    width: 50%;

                    &.deactivated {
                        .icon i {
                            background-color: #bbbbbb !important;
                        }

                        .step-title {
                            opacity: .35;
                        }
                    }

                    .icon {
                        margin-bottom: 1rem;
                        padding: 0 1rem;
                        background-color: white;

                        i {
                            background-color: $monarch-bg-color;
                            color: #fff;
                            border-radius: 100rem;
                            padding: 1rem;
                            font-weight: normal;
                            font-style: normal;
                            font-size: 28px;
                            line-height: 1;
                            letter-spacing: normal;
                            text-transform: none;
                            display: inline-block;
                            white-space: nowrap;
                            word-wrap: normal;
                            direction: ltr;
                            height: 60px;
                            width: 60px;
                        }
                    }

                    .step-title {
                        position: absolute;
                        top: 90%;
                        width: 100%;

                        .step-subtitle {
                            font-weight: lighter;
                            margin: 0;
                            color: #555555;
                        }
                    }
                }
            }
        }

    }
</style>
