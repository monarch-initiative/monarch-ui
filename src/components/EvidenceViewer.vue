<template>
  <div class="container-fluid evidence-section py-0">
    <div class="summary">Summary</div>

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
          <i class="fa fa-fw fa-flask text-info"/>
          Evidence Codes ({{evidence.evidence_types.length}})
        </b-button>
        <b-collapse :id="'collapse-1' + evidence.id">
          <div
            v-for="(support, index) in evidence.evidence_types"
            :key="index"
            class="row"
          >
            <a
              :href="support.url"
              target="_blank"
              rel="noopener noreferrer"
            >
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
          <i class="fa fa-fw fa-book text-info"/>
          Publications ({{evidence.publications.length}})
        </b-button>
        <b-collapse :id="'collapse-2' + evidence.id">
          <div
            v-for="(support, index) in evidence.publications"
            :key="index"
            class="row"
          >
            <router-link :to="support.url">{{ support.label }}</router-link>
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
          <i class="fa fa-fw fa-database text-info"/>
          Sources ({{evidence.provided_by.length}})
        </b-button>
        <b-collapse :id="'collapse-3' + evidence.id">
          <div
            v-for="(support, index) in evidence.provided_by"
            :key="index"
            class="row"
          >
            <a
              :href="support.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ support.label }}&nbsp;
              <img
                v-if="support.icon"
                :src="support.icon"
                class="source-icon">
            </a>
          </div>
        </b-collapse>
      </div>
    </template>
    <div class="statements">Supporting Statements</div>

    <div v-if="evidenceError" class="border p-2 m-2">
      Error fetching evidence
      <!-- <div class="col-xs-12"> {{ evidenceError }} </div> -->
    </div>

    <div v-show="!evidenceFetched && !evidenceError" class="evidence-ajax-msg">
      <b-spinner
        class="loading-spinner"
        type="grow"
        label="Spinning"
      />
      <span>&nbsp;&nbsp;Fetching Evidence</span>
    </div>

    <div v-show="evidenceFetched && !evidenceError">

      <b-table
        :items="rowsProvider"
        :fields="fields"
        :current-page="currentPage"
        :per-page="rowsPerPage"
        :no-provider-paging="noProviderPaging"
        responsive="true"
        class="table-sm"
      >
        <template v-slot:subject="data">
          <template v-if="data.item.subject.url">
            <router-link
              :to="data.item.subject.url"
              v-html="$sanitizeText(data.item.subject.label)"/>
          </template>
          <template v-else>
            {{ data.item.subject.label }}
          </template>
        </template>

        <template v-slot:relation="data">
            {{ data.item.relation.label }}
        </template>

        <template v-slot:object="data">
          <template v-if="data.item.object.url">
            <router-link
              :to="data.item.object.url"
              v-html="$sanitizeText(data.item.object.label)"/>
          </template>
          <template v-else>
            {{ data.item.object.label }}
          </template>
        </template>
      </b-table>
      <div
        v-if="totalStatements > rowsPerPage">
        <b-pagination
          v-model="currentPage"
          :per-page="rowsPerPage"
          :total-rows="totalStatements"
          class="pag-width my-1"
          align="center"
          size="md"
        />
      </div>
    </div>
  </div>
</template>

<script>
import us from 'underscore';
import { getEvidence } from '@/api/BioLink';
import { processPublications } from '@/api/Utils';
import sourceToImage from '../lib/sources';

export default {
  components: {},
  props: [
    'evidence',
    'evidenceCache'
  ],
  data () {
    return {
      currentPage: 1,
      rowsPerPage: 10,
      totalStatements: 0,
      noProviderPaging: true,
      evidenceFetched: false,
      evidenceError: false,
      rows: [],
      fields: [
        {
          key: 'subject',
          label: 'Subject',
          class: 'assoc-subject',
        },
        {
          key: 'relation',
          label: 'Relation',
          class: 'relation-column-width',
        },
        {
          key: 'object',
          label: 'Object',
          class: 'assoc-object',
        }
      ]
    }
  },
  methods: {

    async fetchEvidence() {
      const that = this;

      if (!(that.evidence.id in that.evidenceCache) && !that.evidenceFetched) {
        that.evidenceError = false;
        try {
          const associationsResponse = await getEvidence(that.evidence.id);

          if (!associationsResponse.data
            || !associationsResponse.data.associations) {
            throw new Error('getEvidence() returned no data');
          }
          that.evidenceFetched = true;
          that.evidenceCache[that.evidence.id] = associationsResponse.data.associations;
          // Sends data back to the parent component AssocTable
          that.$emit('evidenceCache', that.evidenceCache);

        } catch (err) {
          that.evidenceError = err;
          console.log('BioLink Error', err);
        }
      } else {
        that.evidenceError = false;
        that.evidenceFetched = true;
      }
      that.processEvidence(that.evidenceCache[that.evidence.id]);
    },

    rowsProvider(ctx, callback) {
      this.fetchEvidence().then(() => {
        callback(this.rows);
      }).catch((error) => {
        callback([]);
      });
    },

    processEvidence(evidenceTable) {
      evidenceTable.forEach((evi) => {
        // Clean subject and object records
        evi.subject.label = evi.subject.label || evi.subject.id;
        evi.subject.url =
          evi.subject.id.startsWith("BNODE") ? null : `/${evi.subject.id}`;

        evi.object.label = evi.object.label || evi.object.id;
        evi.object.url =
          evi.object.id.startsWith("BNODE") ? null : `/${evi.object.id}`;

        evi.publications = processPublications(evi.publications);

        // remove _?slim
        evi.provided_by = us.uniq(
          evi.provided_by.map(db => db.replace(/_?slim/, ""))
        );
      });

      this.totalStatements = evidenceTable.length;
      this.rows = evidenceTable;
    }
  }
}

</script>

<style lang="scss">

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

  .collapsed > .when-opened,
  :not(.collapsed) > .when-closed {
    display: none;
  }

  .statements {
    font-weight: bold;
    padding-top: 10px;
    padding-bottom: 5px;
  }

  .evidence-ajax-msg > span {
    vertical-align: middle;
  }
}

</style>
