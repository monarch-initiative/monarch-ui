<template>
  <div class="container-fluid evidence-section py-0">
    <div class="summary">
      Summary ({{
        evidence.evidence_types.length +
        evidence.publications.length +
        evidence.provided_by.length
      }})
    </div>

    <template v-if="nodeId !== subjectId">
      <i class="fa fa-fw fa-share-alt neighbors" />
      <span v-if="cardType.includes('ortholog')" class="subclass-of">
        {{ subjectLabel }} is an ortholog of {{ nodeLabel }}
      </span>
      <span v-else class="subclass-of">
        {{ subjectLabel }} is a subclass of {{ nodeLabel }}
      </span>
    </template>

    <template v-if="evidence.evidence_types.length">
      <div>
        <b-button
          v-b-toggle="'collapse-1' + evidence.id"
          size="small"
          class="btn btn-xs px-1 py-0 m-0 summary-btn"
          variant="light"
        >
          <span class="when-opened">&blacktriangledown;&nbsp;</span>
          <span class="when-closed">&blacktriangleright;&nbsp;</span>
          <i class="fa fa-fw fa-flask text-info" />
          Evidence Codes ({{ evidence.evidence_types.length }})
        </b-button>
        <b-collapse :id="'collapse-1' + evidence.id">
          <div
            v-for="(support, index) in evidence.evidence_types"
            :key="index"
            class="row"
          >
            <a :href="support.url" target="_blank" rel="noopener noreferrer">
              {{ support.label }}&nbsp;
            </a>
          </div>
        </b-collapse>
      </div>
    </template>

    <template v-if="evidence.publications.length">
      <div>
        <b-button
          v-b-toggle="'collapse-2' + evidence.id"
          size="small"
          class="btn btn-xs px-1 py-0 m-0 summary-btn"
          variant="light"
        >
          <span class="when-opened">&blacktriangledown;&nbsp;</span>
          <span class="when-closed">&blacktriangleright;&nbsp;</span>
          <i class="fa fa-fw fa-book text-info" />
          Publications ({{ evidence.publications.length }})
        </b-button>
        <b-collapse :id="'collapse-2' + evidence.id">
          <div
            v-for="(pub, index) in evidence.publications"
            :key="index"
            class="row"
          >
            <span v-if="pub.id.startsWith('PMID')">
              <a :href="pub.url" target="_blank" rel="noopener noreferrer">
                {{ pub.label }}
                <i class="fa fa-external-link" aria-hidden="true" />
              </a>
            </span>
            <span v-else>
              <router-link :to="pub.url">{{ pub.label }}</router-link>
            </span>
          </div>
        </b-collapse>
      </div>
    </template>

    <template v-if="evidence.provided_by.length">
      <div>
        <b-button
          v-b-toggle="'collapse-3' + evidence.id"
          size="small"
          class="btn btn-xs px-1 py-0 m-0 summary-btn"
          variant="light"
        >
          <span class="when-opened">&blacktriangledown;&nbsp;</span>
          <span class="when-closed">&blacktriangleright;&nbsp;</span>
          <i class="fa fa-fw fa-database text-info" />
          Sources ({{ evidence.provided_by.length }})
        </b-button>
        <b-collapse :id="'collapse-3' + evidence.id">
          <strong>{{ evidence.provided_by.join(", ") }}</strong>
        </b-collapse>
      </div>
    </template>

    <div v-if="evidenceError" class="border p-2 m-2">
      Error fetching evidence
      <!-- <div class="col-xs-12"> {{ evidenceError }} </div> -->
    </div>

    <div v-show="!evidenceFetched && !evidenceError" class="evidence-ajax-msg">
      <b-spinner class="loading-spinner" type="grow" label="Spinning" />
      <span>&nbsp;&nbsp;Fetching Evidence</span>
    </div>

    <div v-show="evidenceFetched && !evidenceError">
      <div class="statements">
        Supporting Statements ({{ totalStatements }})
      </div>

      <div v-if="totalStatements > rowsPerPage">
        <b-pagination
          v-model="currentPage"
          :per-page="rowsPerPage"
          :total-rows="totalStatements"
          class="pag-width my-1"
          align="left"
          size="md"
        />
      </div>

      <b-table
        :items="rowsProvider"
        :fields="fields"
        :current-page="currentPage"
        :per-page="rowsPerPage"
        :no-provider-paging="noProviderPaging"
        responsive="true"
        class="table-sm"
      >
        <template v-slot:cell(subject)="data">
          <template v-if="data.item.subject.url">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <router-link
              :to="data.item.subject.url"
              v-html="$sanitizeText(data.item.subject.label)"
            />
          </template>
          <template v-else>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="$sanitizeText(data.item.subject.label)" />
          </template>
        </template>

        <template v-slot:cell(relation)="data">
          {{ data.item.relation.label }}
        </template>

        <template v-slot:cell(object)="data">
          <template v-if="data.item.object.url">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <router-link
              :to="data.item.object.url"
              v-html="$sanitizeText(data.item.object.label)"
            />
          </template>
          <template v-else>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="$sanitizeText(data.item.object.label)" />
          </template>
        </template>

        <template v-slot:cell(publications)="data">
          <template v-if="data.item.publications.length < 3">
            <div
              v-for="(pub, index) in data.item.publications"
              :key="index"
              class="row"
            >
              <span v-if="pub.id.startsWith('PMID')" class="nowrap">
                <a :href="pub.url" target="_blank" rel="noopener noreferrer">
                  {{ pub.label }}
                  <i class="fa fa-external-link" aria-hidden="true" />
                </a>
              </span>
              <span v-else class="nowrap">
                <router-link :to="pub.url">{{ pub.label }}</router-link>
              </span>
            </div>
          </template>
          <template v-else>
            <div
              v-for="(pub, index) in data.item.publications.slice(0, 2)"
              :key="index"
              class="row"
            >
              <span v-if="pub.id.startsWith('PMID')" class="nowrap">
                <a :href="pub.url" target="_blank" rel="noopener noreferrer">
                  {{ pub.label }}
                  <i class="fa fa-external-link" aria-hidden="true" />
                </a>
              </span>
              <span v-else class="nowrap">
                <router-link :to="pub.url">{{ pub.label }}</router-link>
              </span>
            </div>
            <div>
              <b-collapse
                :id="'collapse-pubs' + evidence.id + data.item.rowNum"
              >
                <div
                  v-for="(pub, index) in data.item.publications.slice(2)"
                  :key="index"
                  class="row final-row"
                >
                  <span v-if="pub.id.startsWith('PMID')" class="nowrap">
                    <a
                      :href="pub.url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ pub.label }}
                      <i class="fa fa-external-link" aria-hidden="true" />
                    </a>
                  </span>

                  <span v-else class="nowrap">
                    <router-link :to="pub.url">{{ pub.label }}</router-link>
                  </span>
                </div>
              </b-collapse>
              <b-button
                v-b-toggle="'collapse-pubs' + evidence.id + data.item.rowNum"
                size="sm"
                class="btn btn-xs px-1 py-0 m-0 pub-btn"
                variant="primary"
              >
                <span class="when-closed">more...</span>
                <span class="when-opened">less...</span>
              </b-button>
            </div>
          </template>
        </template>

        <template v-slot:cell(sources)="data">
          <div
            v-for="(source, index) in data.item.provided_by"
            :key="index"
            class="row"
          >
            {{ source }}
          </div>
        </template>

        <template v-slot:cell(references)="data">
          <div
            v-for="(reference, index) in data.item.references"
            :key="index"
            class="row final-row"
          >
            <span class="nowrap">
              <a
                :href="reference.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ reference.label }}
                <i class="fa fa-external-link" aria-hidden="true" />
              </a>
            </span>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { getEvidence } from "@/api/bio-link";
import {
  getXrefUrl,
  processSources,
  sanitizeNodeLabel,
  sanitizeText,
} from "@/lib/utils";
import sourceToLabel from "@/lib/sources";

export default {
  components: {},
  props: {
    evidence: {
      type: Object,
      required: true,
    },
    evidenceCache: {
      type: Object,
      required: true,
    },
    cardType: {
      type: String,
      required: true,
    },
    nodeId: {
      type: String,
      required: true,
    },
    nodeLabel: {
      type: String,
      required: false,
      default: null,
    },
    nodeType: {
      type: String,
      required: false,
      default: null,
    },
    subjectId: {
      type: String,
      required: false,
      default: null,
    },
    subjectLabel: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      currentPage: 1,
      rowsPerPage: 5,
      totalStatements: 0,
      noProviderPaging: true,
      evidenceFetched: false,
      evidenceError: false,
      rows: [],
      fields: [
        {
          key: "subject",
          label: "Subject",
          class: "subject",
        },
        {
          key: "relation",
          label: "Relation",
          class: "relation",
        },
        {
          key: "object",
          label: "Object",
          class: "object",
        },
        {
          key: "publications",
          label: "Publications",
          class: "publications",
        },
        {
          key: "sources",
          label: "Sources",
          class: "sources",
        },
        {
          key: "references",
          label: "References",
          class: "references",
        },
      ],
    };
  },
  methods: {
    async fetchEvidence() {
      const that = { ...this };

      if (!(that.evidence.id in that.evidenceCache) && !that.evidenceFetched) {
        that.evidenceError = false;
        try {
          const associationsResponse = await getEvidence(
            that.evidence.id,
            this.nodeType
          );

          if (
            !associationsResponse.data ||
            !associationsResponse.data.associations
          ) {
            throw new Error("getEvidence() returned no data");
          }
          that.evidenceFetched = true;
          that.evidenceCache[that.evidence.id] = that.processEvidence(
            associationsResponse.data.associations
          );

          // Sends data back to the parent component AssocTable
          that.$emit("evidenceCache", that.evidenceCache);
        } catch (err) {
          that.evidenceError = err;
        }
      } else {
        // console.log("getting evidence from cache");
        that.evidenceError = false;
        that.evidenceFetched = true;
      }
      that.rows = that.evidenceCache[that.evidence.id];
      that.totalStatements = that.rows.length;
    },

    rowsProvider(ctx, callback) {
      this.fetchEvidence()
        .then(() => {
          callback(this.rows);
        })
        .catch(() => {
          callback([]);
        });
    },

    processEvidence(evidenceTable) {
      let rowNum = 0;
      evidenceTable.forEach((evi) => {
        // Clean subject and object records and add local url

        [evi.subject, evi.object].forEach((node) => {
          node.label = node.label || node.id;

          if (node.label !== sanitizeText(node.label)) {
            node.label = sanitizeNodeLabel(node.label);
          }

          if (
            node.id.startsWith("BNODE") || // blank node
            node.id.startsWith("MONARCH") || // monarch association (likely)
            node.id === this.nodeId
          ) {
            node.url = null;
          } else {
            node.url = `/${node.id}`;
          }
        });

        evi.publications = evi.publications
          .filter((pub) => !pub.id.startsWith("MONDO"))
          .map((pub) => {
            let url = "";
            if (pub.id.startsWith("PMID")) {
              const reference = pub.id.split(":")[1];
              url = `http://www.ncbi.nlm.nih.gov/pubmed/${reference}`;
            } else {
              url = `/publication/${pub.id}`;
            }
            return {
              id: pub.id,
              label: pub.id,
              url,
            };
          });

        evi.provided_by = processSources(evi.provided_by);

        const subjects = [evi.subject.id].concat(evi.subject_eq);
        const objects = [evi.object.id].concat(evi.object_eq);

        evi.references = [];

        evi.provided_by.forEach((db) => {
          subjects.forEach((subject) => {
            const subjectUrl = getXrefUrl(db, subject, evi.subject.label);
            if (subjectUrl !== null) {
              // IMPC only has pages for genes and phenotypes
              if (
                db === "impc" &&
                subject.startsWith("MGI") &&
                evi.relation.id === "RO:0002200"
              ) {
                evi.references.push({
                  url: subjectUrl,
                  label: subject.replace("MGI:", "IMPC:"),
                });
              }
              if (db !== "impc") {
                evi.references.push({
                  url: subjectUrl,
                  label: subject,
                });
              }
            }
          });

          objects.forEach((object) => {
            const objectUrl = getXrefUrl(db, object, evi.object.label);
            if (objectUrl !== null) {
              if (
                db === "impc" &&
                object.startsWith("MGI") &&
                evi.relation.id === "GENO:0000408"
              ) {
                evi.references.push({
                  url: objectUrl,
                  label: object.replace("MGI:", "IMPC:"),
                });
              }
              if (db !== "impc") {
                evi.references.push({
                  url: objectUrl,
                  label: object,
                });
              }
            }
          });
        });

        evi.provided_by = evi.provided_by.map((db) => sourceToLabel(db));

        evi.rowNum = ++rowNum;
      });

      // Sort is browser dependent, redo in ontobio
      evidenceTable = evidenceTable.sort((a, b) =>
        b.provided_by.join().includes("OMIM") ||
        b.provided_by.join().includes("Orphanet")
          ? 1
          : -1
      );

      // Sort is browser dependent, redo in ontobio
      // Sorting by has phenotype seems to help the flow of statements,
      // but more testing needed, ideally these statements would be
      // grouped together o coupled with a graph view to disambiguate
      evidenceTable = evidenceTable.sort((a, b) =>
        a.relation.label !== "has phenotype" &&
        b.relation.label === "has phenotype"
          ? 1
          : -1
      );

      return evidenceTable;
    },
  },
};
</script>

<style lang="scss">
@import "~@/style/variables";

.evidence-section {
  //max-height: 200px;
  //overflow-y: auto;
  div {
    font-size: 0.9rem;
  }

  .summary {
    font-weight: bold;
  }

  .summary-btn {
    font-size: 0.9rem;
    background-color: inherit;
    border: none;
  }

  .summary-btn:hover {
    background-color: #ebedee;
    border: none;
  }

  .subclass-of {
    font-size: 0.9rem;
    vertical-align: middle;
    padding-bottom: 5px;
  }

  .collapsed > .when-opened,
  :not(.collapsed) > .when-closed {
    display: none;
  }

  .relation {
    font-size: 0.8rem;
  }

  .publications {
    font-size: 0.8rem;
  }

  .final-row {
    margin-right: 0 !important;
  }

  .statements {
    font-weight: bold;
    padding-top: 10px;
    padding-bottom: 5px;
  }

  .evidence-ajax-msg > span {
    vertical-align: middle;
  }

  .pub-btn {
    font-size: 0.8rem;
  }

  .nowrap {
    white-space: nowrap;
  }

  & .fa {
    &.neighbors {
      font-size: 1.4em;
      transform: rotate(90deg);
      color: $monarch-bg-color;
    }
  }
}
</style>
