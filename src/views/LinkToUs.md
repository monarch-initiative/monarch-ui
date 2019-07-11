<div class="container-fluid monarch-view link-to-us">

<h2 class="page-title"> Link To The Monarch Initiative </h2>
<p>
   To link to Monarch, please refer to the following tables.
</p>
<div class="card">

#### Genes and Features
<table border="2">
	  <thead>
		<tr>
		<th> Organization </th>
		<th> URL </th>
		<th> Example </th>
		</tr>
	  </thead>
	  <tbody>
      		<tr>
      		  <td> NCBIGene <strong>(clique leader)</strong>*</td>
      		  <td> http://monarchinitiative.org/NCBIGene:## </td>
      		  <td> https://monarchinitiative.org/NCBIGene:6622 </td>
      		</tr>
      		<tr>
      		  <td> ENSEMBL </td>
      		  <td> http://monarchinitiative.org/ENSEMBL:## </td>
      		  <td> https://monarchinitiative.org/ENSEMBL:ENSG00000145335 </td>
      		</tr>
      		<tr>
      		  <td> HGNC: HUGO Gene Nomenclature Committee </td>
      		  <td> http://monarchinitiative.org/HGNC:## </td>
      		  <td> https://monarchinitiative.org/HGNC:11138 </td>
      		</tr>
      		<tr>
      		  <td> KEGG-hsa: Ksyoto Encyclopedia of Genes and Genomes - Human </td>
      		  <td> http://monarchinitiative.org/KEGG-hsa:## </td>
      		  <td> https://monarchinitiative.org/KEGG-hsa:6622 </td>
      		</tr>
      		<tr>
      		  <td> FlyBase </td>
      		  <td> https://monarchinitiative.org/FlyBase:FBgn## </td>
      		  <td> https://monarchinitiative.org/FlyBase:FBgn0036212 </td>
      		</tr>
      		<tr>
      		  <td> Xenbase </td>
      		  <td> https://monarchinitiative.org/Xenbase:XB-GENE-## </td>
      		  <td> https://monarchinitiative.org/Xenbase:XB-GENE-1014191 </td>
      		</tr>
      		<tr>
      		  <td> RGD: Rat Genome Database </td>
      		  <td> https://monarchinitiative.org/RGD:## </td>
      		  <td> https://monarchinitiative.org/RGD:3729 </td>
      		</tr>
      		<tr>
      		  <td> MGI: Mouse Genome Informatics </td>
      		  <td> https://monarchinitiative.org/MGI:## </td>
      		  <td> https://monarchinitiative.org/MGI:1277151 </td>
      		</tr>
      		<tr>
      		  <td> ZFIN: Zebrafish Information Network </td>
      		  <td> https://monarchinitiative.org/ZFIN:ZDB-GENE-## </td>
      		  <td> https://monarchinitiative.org/ZFIN:ZDB-GENE-980526-166 </td>
      		</tr>
      		<tr>
      		  <td> Wormbase </td>
      		  <td> https://monarchinitiative.org/WormBase:WBGene## </td>
      		  <td> https://monarchinitiative.org/WormBase:WBGene00000415 </td>
      		</tr>
      	  </tbody>
	</table>
</div>
<div class="card">

#### Disease
   <table border="2">
      <thead>
        <tr>
          <th> Organization </th>
          <th> URL </th>
          <th> Example </th>
        </tr>
      </thead>
      <tbody>
      	    <tr>
      		  <td>  OMIM: Online Mendelian Inheritance in Man <strong>(clique leader)</strong>*</td>
      		  <td> http://monarchinitiative.org/OMIM:## </td>
      		  <td> https://monarchinitiative.org/OMIM:602404 </td>
      	    </tr>
      	    <tr>
      		  <td> Orphanet: Rare Diseases and Orphan Drugs</td>
      		  <td> http://monarchinitiative.org/Orphanet:## </td>
      		  <td> https://monarchinitiative.org/Orphanet:2828 </td>
      	    </tr>
      	    <tr>
      		  <td> UMLS: Unified Medical Language System </td>
      		  <td> http://monarchinitiative.org/UMLS:## </td>
      		  <td> https://monarchinitiative.org/UMLS:CN202824 </td>
      	    </tr>
      	    <tr>
      		  <td> MESH: Medical Subject Headings </td>
      		  <td>http://monarchinitiative.org/MESH:## </td>
      		  <td>https://monarchinitiative.org/MESH:D010300 </td>
      	    </tr>
      	    <tr>
      		  <td> Disease Ontology ID </td>
      		  <td> http://monarchinitiative.org/DOID:## </td>
      		  <td> https://monarchinitiative.org/DOID:14330 </td>
      	    </tr>
      	  </tbody>
  </table>
</div>

<div class="card">

#### Phenotype
<table border="2">
    <thead>
        <tr>
          <th> Ontology </th>
          <th> URL </th>
          <th> Example </th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <td> HP: Human Phenotype Ontology </td>
          <td> http://monarchinitiative.org/HP:## </td>
          <td> https://monarchinitiative.org/HP:0400004 </td>
        </tr>
        <tr>
          <td> MP: Mammalian Phenotype Ontology </td>
          <td> http://monarchinitiative.org/MP:## </td>
          <td> https://monarchinitiative.org/MP:0003878 </td>
        </tr>
        <tr>
          <td> Uberpheno: phenotype ontology </td>
          <td> https://monarchinitiative.org/UPHENO:## </td>
          <td> https://monarchinitiative.org/UPHENO:0001001 </td>
        </tr>
        <tr>
          <td> UBERON: anatomy ontology </td>
          <td> http://monarchinitiative.org/UBERON:##PHENOTYPE</td>
          <td> https://monarchinitiative.org/UBERON:0001690PHENOTYPE</td>
        </tr>
    </tbody>
</table>
</div>

<style lang="scss">
@import "~@/style/variables";

.link-to-us {

    h2 {
        text-align: center;
    }
    & .card {
        background-color: $monarch-bg-color;
        color: white;
        padding: 10px;
        margin-bottom: 15px;
    }
    
    & table {
        color: black;
        border: 0;
        background-color: white;
        overflow-x: auto;
        
        & td, th {
            padding: 5px;
            width: 30%;
        }
    }
}

</style>

