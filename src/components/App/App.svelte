<script lang="ts">
  import { csvParse } from 'd3-dsv';
  import { RawVictora14DayRow } from '../../global.d';
  import { historicData } from '../../constants';
  import Chart from '../Chart/Chart.svelte';
  import { toDate } from '../../utils';
  import dayjs from 'dayjs';

  let height: number = 300;

  $: setTimeout(() => window.parent.postMessage({ sentinel: 'amp', type: 'embed-size', height }, '*'), 0);
  let region: 'metro' | 'regional' = 'metro';

  const DATA_URL =
    'https://covid-sheets-mirror.web.app/api?sheet=1nUUU5zPRPlhAXM_-8R7lsMnAkK4jaebvIL5agAaKoXk&range=Vic%2014%20day%20average!A:C';

  const dataPromise = fetch(DATA_URL)
    .then(res => res.text())
    .then(txt => csvParse<RawVictora14DayRow>(txt, null))
    .then(data =>
      data
        .map(d => ({
          date: toDate(d.Date),
          regional: +d['Regional Average'],
          metro: +d['Metro Average']
        }))
        .concat(
          historicData.map(d => ({
            ...d,
            date: dayjs(d.date, 'YYYY-MM-DD').toDate()
          }))
        )
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
  <div class="tabs">
    <button class="tab {region === 'metro' ? 'active' : ''}" on:click={() => (region = 'metro')}>Vic. metro</button>
    <button class="tab {region === 'regional' ? 'active' : ''}" on:click={() => (region = 'regional')}>Vic. regional</button>
  </div>

  {#if region === 'metro'}
    <p>
      The next step on <strong>Melbourne's</strong> roadmap to easing restrictions will happen <strong>after September
        28</strong>, if the 14-day average is <strong>between 30 and 50</strong>.
    </p>
  {:else}
    <p>
      The next step on <strong>regional Victoria's</strong> roadmap to easing restrictions will happen when the 14-day average
      of new cases is <strong>below 5</strong> and there were <strong>no new cases with an unknown source</strong>.
    </p>
  {/if}

  {#await dataPromise}
    <p>Loading...</p>
  {:then data}
    <Chart {region} {data} />
  {/await}
  <div class="notes">
    <p>
      Caveat info info info sources etc. Chamomile is known worldwide to be a calming sleep aid, a remedy to ease an
      upset stomach, and for its wonderful .
    </p>
  </div>
</div>
