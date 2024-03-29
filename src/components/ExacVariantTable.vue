<template>
  <div
    v-if="showTable"
    id="vue-exac"
    class="col-xs-12 col-md-10 col-lg-9 table-responsive"
  >
    <h2 class="p-2">ExAC Population Frequencies</h2>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Population</th>
          <th>Allele Count</th>
          <th>Allele Number</th>
          <th>Number of Homozygotes</th>
          <th>Allele Frequency</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">South Asian</th>
          <td>{{ rowData.sas.aC }}</td>
          <td>{{ rowData.sas.aN }}</td>
          <td>{{ rowData.sas.hom }}</td>
          <td>{{ rowData.sas.aF }}</td>
        </tr>
        <tr>
          <th scope="row">Other</th>
          <td>{{ rowData.oth.aC }}</td>
          <td>{{ rowData.oth.aN }}</td>
          <td>{{ rowData.oth.hom }}</td>
          <td>{{ rowData.oth.aF }}</td>
        </tr>
        <tr>
          <th scope="row">Latino</th>
          <td>{{ rowData.amr.aC }}</td>
          <td>{{ rowData.amr.aN }}</td>
          <td>{{ rowData.amr.hom }}</td>
          <td>{{ rowData.amr.aF }}</td>
        </tr>
        <tr>
          <th scope="row">European (Non-Finnish)</th>
          <td>{{ rowData.nfe.aC }}</td>
          <td>{{ rowData.nfe.aN }}</td>
          <td>{{ rowData.nfe.hom }}</td>
          <td>{{ rowData.nfe.aF }}</td>
        </tr>
        <tr>
          <th scope="row">African</th>
          <td>{{ rowData.afr.aC }}</td>
          <td>{{ rowData.afr.aN }}</td>
          <td>{{ rowData.afr.hom }}</td>
          <td>{{ rowData.afr.aF }}</td>
        </tr>
        <tr>
          <th scope="row">East Asian</th>
          <td>{{ rowData.eas.aC }}</td>
          <td>{{ rowData.eas.aN }}</td>
          <td>{{ rowData.eas.hom }}</td>
          <td>{{ rowData.eas.aF }}</td>
        </tr>
        <tr>
          <th scope="row">European (Finnish)</th>
          <td>{{ rowData.fin.aC }}</td>
          <td>{{ rowData.fin.aN }}</td>
          <td>{{ rowData.fin.hom }}</td>
          <td>{{ rowData.fin.aF }}</td>
        </tr>
        <tr style="border-top: solid black 2px">
          <th scope="row">Total</th>
          <td>
            {{ rowData.tot.aC }}
          </td>
          <td>
            {{ rowData.tot.aN }}
          </td>
          <td>
            {{ rowData.tot.hom }}
          </td>
          <td>
            {{ rowData.tot.aF }}
          </td>
        </tr>
      </tbody>
    </table>
    <div id="exac-link">
      <a :href="exacID" target="_blank" class="glyphicon glyphicon-link" />
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  props: {
    nodeId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rowData: "",
      exacID: "",
      showTable: false,
      curieMap: {
        ClinVarVariant: "clinvar.variant_id",
        dbSNP: "dbsnp.rsid",
      },
    };
  },
  computed: {
    nodePrefix() {
      const splitId = this.nodeId.split(":");
      return {
        prefix: splitId[0],
        identifier: splitId[1],
      };
    },
  },
  mounted() {
    if (this.nodePrefix.prefix in this.curieMap) {
      this.hitMyVariant();
    }
  },
  methods: {
    buildRowData(prefixes, alleleCounts, alleleNumbers, homozygotes) {
      const rowData = {};
      let aCTotal = 0;
      let aNTotal = 0;
      let homTotal = 0;

      prefixes.forEach((prefix) => {
        const aC = alleleCounts[`ac_${prefix}`];
        const aN = alleleNumbers[`an_${prefix}`];
        const hom = homozygotes[`hom_${prefix}`];
        aCTotal += aC;
        aNTotal += aN;
        homTotal += hom;

        const element = {
          aC,
          aN,
          hom,
          aF: this.singleAlleleFrequency(aC, aN),
        };
        rowData[prefix] = element;
      });
      rowData.tot = {
        aC: aCTotal,
        aN: aNTotal,
        hom: homTotal,
        aF: this.round(aCTotal / aNTotal, 4),
      };
      return rowData;
    },
    singleAlleleFrequency(count, number) {
      return this.round(count / number, 7);
    },
    round(value, decimals) {
      let returnValue = "";
      if (value < 1) {
        returnValue = value.toPrecision(2);
      } else {
        returnValue = Number(
          Math.round(`${value}e${decimals}`) + `e-${decimals}`
        );
      }
      return returnValue;
    },
    hitMyVariant() {
      const baseURL = "https://myvariant.info/v1/query";
      axios
        .get(baseURL, {
          params: {
            q: `${this.curieMap[this.nodePrefix.prefix]}:${
              this.nodePrefix.identifier
            }`,
            fields: "exac",
          },
        })
        .then((resp) => {
          if (resp.data.total === 1) {
            const exacData = resp.data.hits[0].exac;
            if (exacData) {
              const alleleCounts = exacData.ac;
              const alleleNumbers = exacData.an;
              const homozygotes = exacData.hom;
              const exacURL = "https://exac.broadinstitute.org/variant/";
              const exacIDParams = [
                exacData.chrom,
                exacData.pos,
                exacData.ref,
                exacData.alt,
              ].join("-");
              this.exacID = `${exacURL}${exacIDParams}`;
              const prefixes = [
                "sas",
                "oth",
                "amr",
                "nfe",
                "afr",
                "eas",
                "fin",
              ];
              this.rowData = this.buildRowData(
                prefixes,
                alleleCounts,
                alleleNumbers,
                homozygotes
              );
              this.showTable = true;
            }
          }
        })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(err);
        });
    },
  },
};
</script>
<style>
#vue-exac {
  border-radius: 10px;
  border: solid darkgray 1px;
}
#exac-link {
  text-align: right;
  margin-bottom: 10px;
}
</style>
