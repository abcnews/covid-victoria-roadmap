<script lang="ts">
  import { max, maxIndex } from 'd3-array';
  import { scaleLinear, scaleUtc } from 'd3-scale';
  import { niceDate, scaleGuard } from '../../utils';
  import { line as l } from 'd3-shape';
  import { milestones, Milestone } from '../../constants';
  import { Region, DataRow, Victoria14DayRow } from '../../global.d';
  import dayjs from 'dayjs';

  export let data: Victoria14DayRow[] = [];
  export let region: Region = 'metro';

  let chartSeries: DataRow[];
  let chartData: DataRow[];
  let peak: DataRow;
  let last: DataRow;

  let windowWidth = 360;
  let height = 250;
  $: width = windowWidth - 40;

  const margin = {
    bottom: 60,
    top: 10,
    left: 25,
    right: 85
  };

  $: chartSeries = data.map(d => ({
    date: dayjs(d.date).toDate(),
    region: d[region],
    state: d.state,
    unknown: d.regionalUnknown + d.metroUnknown
  }));

  $: chartData = chartSeries.slice(-21);
  $: peak = chartSeries && chartSeries[maxIndex<DataRow>(chartSeries, d => d.state)];
  $: last = chartSeries && chartSeries[chartSeries.length - 1];
  $: now = dayjs(last.date);

  // x-axis
  $: xDomain = [now.subtract(20, 'day').toDate(), now.add(1, 'day').toDate()];
  $: xRange = [margin.left, width - margin.right];
  $: xTicks = [
    { value: now.subtract(20, 'day').toDate(), label: '20 days', ago: true },
    { value: now.subtract(7, 'day').toDate(), label: '7 days', ago: true },
    { value: now.toDate(), label: niceDate(last.date, true), ago: false }
  ];
  $: xScale = scaleGuard(scaleUtc().domain(xDomain).range(xRange));

  // y-axis
  $: yDomain = [0, Math.max(2, max<DataRow, number>(chartData || [], d => d.unknown) || 0) * 1.25];
  $: yRange = [height - margin.bottom, margin.top];
  $: yTicks = [0, 100, 200];
  $: yScale = scaleGuard(scaleLinear().domain(yDomain).range(yRange));

  $: statePath = l<{ date: Date; state: number }>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.state));

  $: unknownsPath = l<{ date: Date; unknown: number }>()
    .x(d => xScale(d.date))
    .y(d => yScale(d.unknown));

  let visibleMilestones: Milestone[];
  $: visibleMilestones = milestones[region].filter(
    (d: Milestone) =>
      typeof d.date === 'undefined' ||
      (d.date.getTime() < xDomain[1].getTime() && d.date.getTime() > xDomain[0].getTime())
  );
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
    stroke-width: 2px;
    stroke-linecap: round;

    &.unknown {
      stroke: #000;
    }

    &.state {
      stroke: #999;
    }
  }

  .label {
    font-size: 0.6875rem;
  }

  .now-label {
    color: #57676b;
    position: absolute;
    display: flex;
    box-sizing: border-box;
    text-align: center;
    transform: translate(-1.5em, -100%);
    font-size: 0.75rem;
    font-weight: bold;
    > strong {
      line-height: 0.8;
      font-size: 0.6875rem;
      color: #000;
      text-transform: uppercase;
      font-weight: bold;
    }
    .number {
      font-size: 2.125rem;
      display: block;
      margin-bottom: 0.1em;
      font-weight: 800;
    }
    .label {
      box-sizing: border-box;
      width: 8em;
      text-align: left;
      padding-left: 5px;
      margin-top: -2px;
    }
  }

  .avg-label {
    position: absolute;
    font-size: 0.6875rem;
    color: #57676b;
    font-weight: bold;
    transform: translate(10px, -0.55rem);
    line-height: 1.1;
    span {
      display: block;
    }
    strong {
      font-size: 1rem;
      color: #000;
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
    max-width: 12em;
    top: 0;
    left: 0;
  }

  .updated {
    position: absolute;
    bottom: calc(60px - 1.1 * 2rem);
    right: 0;
    color: #57676b;
    font-size: 0.6875rem;
  }

  .x-tick-label.milestone {
    font-size: 0.6875rem;
    .value {
      font-weight: bold;
    }
  }
</style>

<svelte:window bind:innerWidth={windowWidth} />
<div class="container">
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
            {#if tick.ago}
              <tspan x={xScale(tick.value)} dy="1.1em">ago</tspan>
            {/if}
          </text>
        </g>
      {/each}
    </g>

    <!-- <path
      pathLength={100}
      class="region"
      d={regionPath(chartData)}
      stroke-dasharray="1 1 1 1 3 1 3 1 88"
      stroke="#ccc" />
    <circle r="3" cx={xScale(last.date)} cy={yScale(last.region)} /> -->

    <path
      pathLength={100}
      class={region === 'metro' ? 'state' : 'unknown'}
      d={statePath(chartData) || undefined}
      stroke-dasharray="1 1 1 1 3 1 3 1 88" />
    <circle r="3" cx={xScale(last.date)} cy={yScale(last.state)} />

    {#if region === 'metro'}
      <path
        pathLength={100}
        class="unknown"
        d={unknownsPath(chartData) || undefined}
        stroke-dasharray="1 1 1 1 3 1 3 1 88" />
      <circle r="3" cx={xScale(last.date)} cy={yScale(last.unknown)} />
    {/if}

    <line
      stroke="#000"
      x1={xScale(last.date)}
      x2={xScale(last.date)}
      y1={yScale(region === 'metro' ? last.unknown : last.state) - 35}
      y2={yScale(region === 'metro' ? last.unknown : last.state) - 10} />

    {#each visibleMilestones as milestone}
      {#if milestone.date}
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
          <tspan x={xScale(milestone.date)} dy="1.1em">{milestone.value > 0 ? '< ' : ''}{milestone.value} cases</tspan>
          <tspan x={xScale(milestone.date)} dy="1.1em">per day</tspan>
        </text>
      {:else}
        <line
          x1={xScale(last.date)}
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
  <span class="label peak-label">Peak state-wide average was {peak.state.toFixed(1)} on {niceDate(peak.date)}</span>
  {#if region === 'metro'}
    <span
      class="now-label"
      style={`top: ${yScale(Math.max(last.unknown, last.state)) - 35}px; left: ${xScale(last.date)}px`}>
      <strong class="number">{last.unknown.toFixed(0)}</strong>
      <span class="label">mystery cases in past 14 days</span>
    </span>

    <span style={`top: ${yScale(last.state)}px; left: ${xScale(last.date)}px`} class="avg-label">
      <span><strong class="number">{last.state.toFixed(1)}</strong> state-wide</span>
      <span>14-day average</span>
    </span>
  {:else}
    <span class="now-label" style={`top: ${yScale(last.state) - 35}px; left: ${xScale(last.date)}px`}>
      <strong class="number">{last.state.toFixed(1)}</strong>
      <span class="label">state-wide<br /> 14-day average</span>
    </span>
  {/if}
</div>
