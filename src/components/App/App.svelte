<script lang="ts">
  import { csvParse } from "d3-dsv";
  import { RawVictora14DayRow } from "../../global.d";
  import { historicData } from "../../constants";
  import Chart from "../Chart/Chart.svelte";
  import { toDate } from "../../utils";
  import * as dayjs from "dayjs";
  export let projectName: string;

  let region: "metro" | "regional" = "metro";

  const DATA_URL =
    "https://covid-sheets-mirror.web.app/api?sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Vic%2014%20day%20average!A:C";

  const dataPromise = fetch(DATA_URL)
    .then((res) => res.text())
    .then((txt) => csvParse<RawVictora14DayRow>(txt, null))
    .then((data) =>
      data
        .map((d) => ({
          date: toDate(d.Date),
          regional: +d["Regional Average"],
          metro: +d["Metro Average"],
        }))
        .concat(
          historicData.map((d) => ({
            ...d,
            date: dayjs(d.date, "YYYY-MM-DD").toDate(),
          }))
        )
        .sort((a, b) => +a.date - +b.date)
    );
</script>

<style lang="scss">
  .container {
    background-color: #e3ebed;
    padding: 20px;
    font-size: 1rem;
    font-family: ABCSans;
  }
  .title {
    font-size: 1.125rem;
    margin-top: 0;
  }
  .notes {
    font-size: 0.6875rem;
    color: #57686b;
  }

  .tabs {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 1rem;
  }

  .tab {
    display: block;
    background: #cad9dd;
    border: none;
    height: 38px;
    width: 50%;
    display: block;
    font-size: 0.875rem;
    font-weight: bold;
    position: relative;
    overflow: visible;
    &:before {
      content: "";
      background-color: #01cfff;
      position: absolute;
      bottom: 100%;
      left: 0;
      height: 0;
      width: 100%;
      transition: height 0.2s;
    }

    &.active {
      &:before {
        height: 4px;
      }
      background: rgba(255, 255, 255, 0.6);
    }
  }
</style>

<div class="container">
  <h2 class="title">How is Victoria tracking to get out of lockdown?</h2>
  <p>
    The Victorian Government has pinned its relaxation of lockdown to the 14 day
    average of new COVID-19 cases getting below certain levels. Premier Dan
    Andrews says that if this rate goes down faster than expected they will
    adjust the time frame.
  </p>
  <div class="tabs">
    <button
      class="tab {region === 'metro' ? 'active' : ''}"
      on:click={() => (region = 'metro')}>Vic. metro</button>
    <button
      class="tab {region === 'regional' ? 'active' : ''}"
      on:click={() => (region = 'regional')}>Vic. regional</button>
  </div>
  {#await dataPromise}
    <p>Loading...</p>
  {:then data}
    <Chart {region} {data} />
  {/await}
  <div class="notes">
    <p>
      Caveat info info info sources etc. Chamomile is known worldwide to be a
      calming sleep aid, a remedy to ease an upset stomach, and for its
      wonderful .
    </p>
  </div>
</div>
