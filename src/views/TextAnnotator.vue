<template>
    <div class="container-fluid">
        <h4>Text Annotator</h4>
        <div>
            <b-tabs content-class="mt-3" fill>
                <b-tab title="First" active><p>I'm the first tab</p></b-tab>
                <b-tab title="Second"><p>I'm the second tab</p></b-tab>
                <b-tab title="Very, very long title"><p>I'm the tab with the very, very long title</p></b-tab>
                <b-tab title="Disabled" disabled><p>I'm a disabled tab!</p></b-tab>
            </b-tabs>
        </div>
    </div>
</template>
<script>
    import axios from 'axios/index';

    export default {
        props: {
        },
        data() {
            return {
                exacGene: '',
                showGeneExac: false,
                curieMap: {
                    'HGNC': 'hgnc',
                    'OMIM': 'mim',
                    'ENSEMBL': 'ensembl.gene',
                    'NCBIGene': 'entrezgene'
                }
            };
        },
        computed: {
        },
        mounted() {
        },
        methods: {
        }
    };
</script>
<style>
</style>
