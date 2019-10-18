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
      <h3>BioLink Error</h3>
      <div class="col-xs-12">
        {{ evidenceError }}
      </div>
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
            {{ data.item.subject.label }}
        </template>

        <template v-slot:relation="data">
            {{ data.item.relation.label }}
        </template>

        <template v-slot:object="data">
            {{ data.item.object.label }}
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { getEvidence } from '@/api/BioLink';
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
      that.rows =  that.evidenceCache[that.evidence.id];
    },

    rowsProvider(ctx, callback) {
      this.fetchEvidence().then(() => {
        callback(this.rows);
      }).catch((error) => {
        callback([]);
      });
    }
  }
}

</script>

<style lang="scss">

.evidence-section {
    //max-height: 200px;
    //overflow-y: auto;

  .summary {
    font-weight: bold;
  }

  .summary-btn {
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
