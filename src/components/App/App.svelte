<script lang="ts">
  import { csvParse } from 'd3-dsv';
  import { RawVictora14DayRow } from '../../global.d';
  import Chart from '../Chart/Chart.svelte';
  import { promiseSpy, toDate } from '../../utils';
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
    {#if now < new Date(2020, 8, 28).getTime()}
      <p>
        The next step on <strong>Melbourne's</strong> roadmap to easing restrictions will happen <strong>after September
          28</strong>, if the 14-day average is <strong>between 30 and 50</strong>.
      </p>
    {:else}
      <p>
        The next step on <strong>Melbourne's</strong> roadmap to easing restrictions can happen <strong>after October 26</strong>,
        if the 14-day state-wide average is <strong>less than five</strong> and there are fewer than <strong>5 cases
          from unknown sources</strong> in the past 14 days.
      </p>
    {/if}
  {:else}
    <p>
      The next step on <strong>regional Victoria's</strong> roadmap to easing restrictions will happen <strong>after 23
        November</strong> if there have been <strong>no new cases for 14 days</strong>, across Victoria.
    </p>
  {/if}

  {#await dataPromise}
    <p>Loading...</p>
  {:then data}
    <Chart {region} {data} />
  {/await}
  <div class="notes">
    <p>Source: Department of Health and Human Services, Victoria</p>
  </div>
</div>
