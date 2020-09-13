<script lang="ts">
  import { line } from 'd3-shape';
  import { max, maxIndex } from 'd3-array';
  import { scaleLinear, scaleUtc } from 'd3-scale';
  import { niceDate } from '../../utils';
  import { milestones, Milestone } from '../../constants';
  import { Region, DataRow, Victoria14DayRow } from '../../global.d';
  import * as dayjs from 'dayjs';

  export let data: Victoria14DayRow[];
  export let region: Region = 'metro';

  const isMilestone = (obj: unknown) => {
    if (typeof obj === 'object') {
      const { date, colour, targetColour, value } = obj;
      if (
        date instanceof Date &&
        typeof colour === 'string' &&
        typeof targetColour === 'string' &&
        typeof value === 'number'
      ) {
        return true;
      }
    }

    return false;
  };

  let chartSeries: DataRow[];
  let chartData: DataRow[];
  let peak: DataRow;
  let last: DataRow;

  let height = 250;
  let width = 360;

  $: chartSeries = data.map(d => ({
    date: dayjs(d.date).toDate(),
    value: d[region]
  }));

  $: now = dayjs(chartSeries[chartSeries.length - 1].date);
  $: xDomain = [now.subtract(20, 'day').toDate(), new Date(2020, 9, 30)];
  $: xTicks = [
    { value: now.subtract(20, 'day').toDate(), label: '20 days' },
    { value: now.subtract(7, 'day').toDate(), label: '7 days' }
  ];
  const yTicks = [0, 100, 200];
  const margin = {
    bottom: 60,
    top: 10,
    left: 25,
    right: 15
  };

  $: chartData = chartSeries.slice(-25);
  $: console.log('chartData :>> ', chartData);
  $: yScale =
    chartData &&
    scaleLinear()
      .domain([0, max<DataRow, number>(chartData, d => d.value) + 25])
      .nice()
      .range([height - margin.bottom, margin.top]);

  $: xScale = scaleUtc()
    .domain(xDomain)
    .range([margin.left, width - margin.right]);

  $: linePath = line<{ date: Date; value: number }>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value));

  $: peak = chartSeries && chartSeries[maxIndex<DataRow>(chartSeries, d => d.value)];

  $: last = chartSeries && chartSeries[chartSeries.length - 1];
</script>

<style lang="scss">
  .container {
    position: relative;
    font-family: ABCSans;
  }
  svg {
    display: block;
    font-family: ABCSans;
  }
  path {
    fill: none;
    stroke: #000;
    stroke-width: 2px;
    stroke-linecap: round;
  }

  .label {
    font-size: 0.6875rem;
  }

  .now-label {
    color: #57676b;
    position: absolute;
    display: block;
    max-width: 8em;
    text-align: center;
    transform: translate(-50%, -100%);
    font-size: 0.6875rem;
    font-weight: bold;
    > strong {
      line-height: 0.8;
      color: #000;
      text-transform: uppercase;
      font-weight: bold;
    }
    :nth-child(2) {
      font-size: 3em;
      display: block;
      margin-bottom: 0.3em;
    }
  }

  .tick > line {
    stroke: #4e6e74;
    opacity: 0.3;
    stroke-width: 1;
  }

  .tick.milestone,
  .tick > text {
    font-size: 0.6875rem;
    fill: #57686b;
    font-weight: bold;
  }

  .tick-0 > line {
    opacity: 1;
  }

  .tick-0 > text {
    display: none;
  }

  .x-axis .tick text {
    font-weight: normal;
  }
  .x-axis .tick line {
    color: #4e6e74;
    opacity: 1;
  }

  .peak-label {
    position: absolute;
    font-weight: bold;
    display: block;
    max-width: 10em;
    top: 0;
    left: 0;
  }

  .updated {
    position: absolute;
    top: 0;
    right: 0;
    color: #57676b;
    font-size: 0.6875rem;
    strong {
      font-weight: bold;
      display: block;
    }
  }

  .x-tick-label.milestone {
    font-size: 0.6875rem;
    .value {
      font-weight: bold;
    }
  }
</style>

<div class="container" bind:clientWidth={width}>
  <svg {width} {height}>
    <!-- y axis -->
    <g class="axis y-axis">
      {#each yTicks as tick}
        <g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
          <line x1={margin.left} x2="97%" />
          <text y="4" x={margin.left - 3} text-anchor="end">{tick}</text>
        </g>
      {/each}
    </g>

    <!-- x axis -->
    <g class="axis x-axis">
      {#each xTicks as tick}
        <g class="tick tick-{tick}">
          <line y1={yScale(0) + 5} y2={yScale(0)} x1={xScale(tick.value)} x2={xScale(tick.value)} />
          <text y={yScale(0) + 20} x={xScale(tick.value)} text-anchor="middle">
            <tspan x={xScale(tick.value)}>{tick.label}</tspan>
            <tspan x={xScale(tick.value)} dy="1.1em">ago</tspan>
          </text>
        </g>
      {/each}
    </g>

    <path d={linePath(chartData)} stroke-dasharray="3 3 3 3 3 3 8 3 8 3 500" />
    <circle r="2" cx={xScale(last.date)} cy={yScale(last.value)} />
    <line
      stroke="#000"
      x1={xScale(last.date)}
      x2={xScale(last.date)}
      y1={yScale(last.value * 1.8)}
      y2={yScale(0) + 5} />

    {#each milestones[region] as milestone}
      {#if isMilestone(milestone) && milestone.date}
        <line
          x1={xScale(milestone.date)}
          x2={xScale(milestone.date)}
          y1={yScale(0) + 5}
          y2={yScale(milestone.value)}
          stroke={milestone.colour || '#000'}
          stroke-dasharray="2 2" />
        <line
          x1={xScale(milestone.date)}
          x2={xScale(xDomain[0])}
          y1={yScale(milestone.value)}
          y2={yScale(milestone.value)}
          stroke={milestone.colour || '#000'}
          stroke-dasharray="2 2" />
        <circle
          fill="none"
          stroke={milestone.targetColour || '#000'}
          stroke-width="2"
          r={3.5}
          cx={xScale(milestone.date)}
          cy={yScale(milestone.value)} />
        <text
          class="x-tick-label milestone"
          style={`fill:${milestone.colour || '#000'};`}
          y={yScale(0) + 20}
          x={xScale(milestone.date)}
          text-anchor="middle">
          <tspan class="value" x={xScale(milestone.date)}>{niceDate(milestone.date)}</tspan>
          <tspan x={xScale(milestone.date)} dy="1.1em">&lt; {milestone.value} cases</tspan>
          <tspan x={xScale(milestone.date)} dy="1.1em">per day</tspan>
        </text>
      {:else}
        <line
          x1={xScale(xDomain[1])}
          x2={xScale(xDomain[0])}
          y1={yScale(milestone.value)}
          y2={yScale(milestone.value)}
          stroke={milestone.colour || '#000'}
          stroke-dasharray="2 2" />
      {/if}
      <text
        class="tick milestone"
        style={`fill:${milestone.colour || '#000'};`}
        y={yScale(milestone.value) + 4}
        x={margin.left - 3}
        text-anchor="end">
        {milestone.value}
      </text>
    {/each}
  </svg>
  <span class="label peak-label">Peak was {niceDate(peak.date)} at {peak.value.toFixed(1)} new cases</span>
  <span class="now-label" style={`top: ${yScale(last.value * 1.8) - 10}px; left: ${xScale(last.date)}px`}>
    <strong>Latest:</strong>
    <strong>{last.value.toFixed(1)}</strong> new cases avg. over 14 days
  </span>
  <span class="updated">Last updated: <strong>{niceDate(last.date, true)}</strong></span>
</div>
