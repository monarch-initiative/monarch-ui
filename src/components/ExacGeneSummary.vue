<template>
  <div v-show="showGeneExac" id="exacGene" class="container-fluid">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Constraint from ExAC</th>
          <th>Expected no. variants</th>
          <th>Observed no. variants</th>
          <th>Constraint Metric</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Synonymous</th>
          <td>{{ exacGene.exp_syn }}</td>
          <td>{{ exacGene.n_syn }}</td>
          <td>z = {{ exacGene.syn_z }}</td>
        </tr>
        <tr>
          <th scope="row">Missense</th>
          <td>{{ exacGene.exp_mis }}</td>
          <td>{{ exacGene.n_mis }}</td>
          <td>z = {{ exacGene.mis_z }}</td>
        </tr>
        <tr>
          <th scope="row">LoF</th>
          <td>{{ exacGene.exp_lof }}</td>
          <td>{{ exacGene.n_lof }}</td>
          <td>pLI = {{ exacGene.p_li }}</td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <div id="mgi-link" class="col-9">
        [Retrieved from
        <a :href="exacGene.link" target="_blank"> MyGene.info </a>
        ]
      </div>
      <div id="exac-link" class="col-3">
        <a
          target="_blank"
          href="http://exac.broadinstitute.org/"
          class="fa fa-link"
        />
      </div>
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
      exacGene: "",
      showGeneExac: false,
      curieMap: {
        HGNC: "hgnc",
        OMIM: "mim",
        ENSEMBL: "ensembl.gene",
        NCBIGene: "entrezgene",
      },
    };
  },
  computed: {
    nodePrefix() {
      const splitID = this.nodeId.split(":");
      return {
        prefix: splitID[0],
        identifier: splitID[1],
      };
    },
  },
  mounted() {
    if (this.nodePrefix.prefix in this.curieMap) {
      this.hitMyGene();
    } else {
      this.$emit("show-exac", false);
    }
  },
  methods: {
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
    hitMyGene() {
      const baseURL = "https://mygene.info/v3/query/";
      const mgCurie = `${this.curieMap[this.nodePrefix.prefix]}:${
        this.nodePrefix.identifier
      }`;
      axios
        .get(baseURL, {
          params: {
            q: mgCurie,
            fields: "exac",
          },
        })
        .then((resp) => {
          const hits = resp.data.hits[0];
          if (hits && hits.exac) {
            this.showGeneExac = true;
            this.$emit("show-exac", true);
            this.exacGene = {
              exp_syn: this.round(hits.exac.all.exp_syn, 1),
              n_syn: this.round(hits.exac.all.n_syn, 1),
              syn_z: this.round(hits.exac.all.n_syn, 1),
              exp_mis: this.round(hits.exac.all.exp_mis, 1),
              n_mis: this.round(hits.exac.all.n_mis, 1),
              mis_z: this.round(hits.exac.all.mis_z, 2),
              exp_lof: this.round(hits.exac.all.exp_lof, 1),
              n_lof: this.round(hits.exac.all.n_lof, 1),
              p_li: this.round(hits.exac.all.p_li, 1),
              link: resp.request.responseURL,
            };
          } else {
            this.$emit("show-exac", false);
          }
        })
        .catch(() => {
          // eslint-disable-next-line
          this.$emit("show-exac", false);
          // console.log('mygene.info error', err.message);
        });
    },
  },
};
</script>
<style>
#mgi-link {
  text-align: left;
  margin-bottom: 4px;
}

#exac-link {
  text-align: right;
  margin-bottom: 4px;
}
</style>
