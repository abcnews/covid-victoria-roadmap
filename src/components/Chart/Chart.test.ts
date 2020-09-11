import { render } from '@testing-library/svelte'
import Chart from './Chart.svelte';

describe('Chart', () => {
  it('renders a snapshot', () => {
    const { container } = render(Chart);

    expect(container).toMatchSnapshot();
  });
});
