<script lang="ts">
  import { csvParse } from "d3-dsv";
  import { RawVictoriaLGADataRow } from "../../global.d";
  import { movingAverageByJurisdiction } from "../../utils";
  import Chart from "../Chart/Chart.svelte";
  export let projectName: string;

  const DATA_URL =
    "https://covid-sheets-mirror.web.app/api?sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Victorian%20LGAs!A:D";

  const dataPromise = fetch(DATA_URL)
    .then((res) => res.text())
    .then((txt) => csvParse<RawVictoriaLGADataRow>(txt, null));

  dataPromise.then((d) => console.table(d));
</script>

<style lang="scss">
  div {
    background-color: #e3ebed;
    padding: 20px;
  }
</style>

<div>
  <h1>{projectName}</h1>
  {#await dataPromise}
    <p>Loading...</p>
  {:then data}
    <Chart {data} />
  {/await}
</div>
