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
                                    <div class="divider-line"></div>
                                    <div class="steps-wrapper">
                                        <div ref="step1" class="step">
                                            <div class="icon">
                                                <i class="fa fa-file-text fa-fw"></i>
                                            </div>
                                            <div class="step-title">
                                                <h4>Data</h4>
                                                <h5 class="step-subtitle">Enter a phrase, piece of text or abstract</h5>
                                            </div>
                                        </div>
                                        <div ref="step2" :class="['step', (resultsStep) ? '' : 'deactivated']">
                                            <div class="icon">
                                                <i class="fa fa-check fa-fw"></i>
                                            </div>
                                            <div class="step-title">
                                                <h4>Results</h4>
                                                <h5 class="step-subtitle">Your annotated results</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="content">
                                        <b-form-textarea
                                                id="textarea"
                                                v-model="form.message"
                                                placeholder="Enter something..."
                                                rows="3"
                                                max-rows="6"
                                                v-if="!annotatedText"
                                                :class="['textarea', ($v.form.message.$error) ? 'is-danger' : '']"
                                        >
                                        </b-form-textarea>

                                </div>
                                {{annotatedText}}
                                <div :class="['bottom', (!annotatedText) ? 'only-submit' : '']">
                                    <b-button ref="backButton" v-if="annotatedText" @click="back" :disabled="!validForm" class="stepper-button back">
                                        <i class="fa fa-caret-left fa-fw"></i>Back
                                    </b-button>
                                    <b-button ref="submitButton" @click="annotateText" :disabled="!validForm" class="stepper-button submit">
                                        Submit<i class="fa fa-caret-right fa-fw"></i>
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
    import axios from 'axios/index';
    import HorizontalStepper from 'vue-stepper';
    import { validationMixin } from 'vuelidate'
    import { required } from 'vuelidate/lib/validators'

    export default {
        components: {
            HorizontalStepper
        },
        props: {
        },
        mixins: [validationMixin],
        data() {
            return {
                validForm: true,
                form: {
                    message: ""
                },
                annotatedText: "",
                resultsStep: false
            };
        },
        watch: {
            $v: {
                handler: function (val) {
                    if(!this.$v.$invalid) {
                        this.validForm = true;
                    } else {
                        this.validForm = false;
                    }
                },
                deep: true
            },
            validForm: function(valid){
                if(valid){
                    // We want to allow submission
                    this.$refs.submitButton.attributes
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
        computed: {
        },
        mounted() {
            if(!this.$v.$invalid) {
                this.validForm = true;
            } else {
                this.validForm = false;
            }
        },
        methods: {
            // Executed when @completed-step event is triggered
            completeStep(payload) {
                this.demoSteps.forEach((step) => {
                    if (step.name === payload.name) {
                        step.completed = true;
                    }
                })
            },
            // Executed when @active-step event is triggered
            isStepActive(payload) {
                this.demoSteps.forEach((step) => {
                    if (step.name === payload.name) {
                        if(step.completed === true) {
                            step.completed = false;
                        }
                    }
                })
            },
            // Executed when @stepper-finished event is triggered
            alert(payload) {
                alert('end')
            },

            back() {
                // Want to go back to the text area.
                // Reset Annotated Text.
                // Reset the validator
                // Empty the form field?
                this.annotatedText = '';
                this.resultsStep = false;
            },

            annotateText(){
                this.resultsStep = true;
                // Call some endpoint and wait for a response. If, then return then
                this.annotatedText = "OMG ANNOTATED TEXT";
                //
                console.log(this.annotatedText);
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
            margin: 3.5rem 0;

            .hidden {
                display: none;
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
