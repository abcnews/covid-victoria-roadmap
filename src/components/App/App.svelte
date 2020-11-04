<script lang="ts">
  import { csvParse } from 'd3-dsv';
  import { RawVictora14DayRow, Victoria14DayRow, RawDailyCountCases } from '../../global.d';
  import Chart from '../Chart/Chart.svelte';
  import { ma, toDate } from '../../utils';
  import dayjs from 'dayjs';

  let now: number;
  try {
    const dateqs = new URLSearchParams(location.search).get('date');
    if (dateqs) {
      now = +dayjs(dateqs, 'YYYY-MM-DD');
    } else {
      throw new Error();
    }
  } catch (e) {
    now = Date.now();
  }

  let height: number = 300;

  $: setTimeout(() => window.parent.postMessage({ sentinel: 'amp', type: 'embed-size', height }, '*'), 0);
  let region: 'metro' | 'regional' = 'metro';

  const SHEET = 'https://covid-sheets-mirror.web.app/api?sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk';
  const DATA_URL = SHEET + '&range=Vic%2014%20day%20average!A:E';
  const DATA_URL_STATE_WIDE = SHEET + '&range=Daily%20Count%20States!A:D';

  const dataPromise = fetch(DATA_URL)
    .then(res => res.text())
    // The 'null' argument here is to trick Typescript into letting us specify a type for the parsed data
    // The d3 typescript definitions are wrong, I think.
    .then(txt => csvParse<RawVictora14DayRow>(txt, null))
    .then(data =>
      data
        .map(d => ({
          date: toDate(d.Date),
          regional: +d['Regional Average'],
          metro: +d['Metro Average'],
          state: (+d['Metro Average'] * 14 + +d['Regional Average'] * 14) / 14,
          regionalUnknown: +d['Regional Unknown'],
          metroUnknown: +d['Metro Unknown']
        }))
        .sort((a, b) => +a.date - +b.date)
    );
</script>

<style lang="scss">
  :global(body, html) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

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
      content: '';
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

<div class="container" bind:clientHeight={height}>
  <h2 class="title">How is Victoria tracking to get out of lockdown?</h2>

  <p>
    <strong>Melbourne</strong>
    and
    <strong>regional Victoria</strong>
    can both move to the
    <strong>last step</strong>
    on the roadmap when there have been
    <strong>no new cases for 14 days</strong>, across Victoria.
  </p>

  {#await dataPromise}
    <p>Loading...</p>
  {:then data}
    <Chart {data} />
  {/await}
  <div class="notes">
    <p>
      Source: Department of Health and Human Services, Victoria. Numbers are plotted against the date they are
      announced.
    </p>
  </div>
</div>
