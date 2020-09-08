let url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

let w = 1300,
  h = 730,
  padding = 70;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function fetchData() {
  return fetch(url)
    .then(res => res.json().then(data => data))
    .catch(err => console.log(err));
}

(async function() {
  let dataset = await fetchData();
  let datav = dataset.monthlyVariance;
  console.log(dataset);

  const svg = d3
    .select('#map')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  const x = d3
    .scaleBand()
    .range([padding, w - padding / 2])
    .domain(datav.map(d => d.year));
  // .padding(0.01);
  const xaxis = d3
    .axisBottom(x)
    .tickValues(x.domain().filter(y => y % 10 === 0));
  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${h - 1.5 * padding} )`)
    .call(xaxis);

  const y = d3
    .scaleBand()
    .range([padding / 2, h - 1.5 * padding])
    .domain(months);
  // .padding(0.01);
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(d3.axisLeft(y));

  let lowest_variance = Math.min(...datav.map(d => d.variance));
  let highest_variance = Math.max(...datav.map(d => d.variance));
  let mid_variance = (lowest_variance + highest_variance) / 2;
  let mid1 = (lowest_variance + mid_variance) / 2;
  let mid2 = (highest_variance - mid_variance) / 2;
  let mid1_5 = (mid1 + mid2) / 2;

  let values = [
    lowest_variance,
    mid1,
    mid1_5,
    mid_variance,
    mid2,
    highest_variance,
  ];
  let colors = ['#5779fe', '#139588', '#8cc24c', 'yellow', 'orangered', 'red'];

  let colorScale = d3
    .scaleLinear()
    .range(colors)
    .domain(values);

  let tooltip = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0)
    .style('z-index', '10')
    .style('bacground', '#000');

  svg
    .selectAll()
    .data(datav)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('x', d => x(d.year))
    .attr('y', d => y(months[d.month - 1]))
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .attr('data-month', d => d.month - 1)
    .attr('data-year', d => d.year)
    .attr('data-temp', d => dataset.baseTemperature + d.variance)
    .style('fill', d => colorScale(d.variance))
    .on('mouseover', d => {
      tooltip
        .attr('data-year', d.year)
        .html(
          `${months[d.month - 1]}, ${d.year} <br />
           Temperature: ${`${dataset.baseTemperature + d.variance}`.slice(
             0,
             4,
           )}  &#8451; <br /> 
           Variance: ${`${d.variance}`.slice(0, 4)} &#8451; 
        `,
        )
        .style('top', d3.event.pageY - 30 + 'px')
        .style('left', d3.event.pageX + 10 + 'px')
        .style('font-size', 12)
        .style('background', 'white')
        .style('padding', '13px')
        .style('line-height', '1.5')
        .style('border-radius', '5px')
        .style('opacity', 0.9);
    })
    .on('mouseout', () => tooltip.style('opacity', 0));

  let legend = svg
    .append('g')
    .attr('id', 'legend')
    .attr('x', padding)
    .attr('y', h - padding / 1.2);

  legend
    .selectAll()
    .data(colors)
    .enter()
    .append('rect')
    .attr('id', 'legend')
    .attr('x', (_, i) => padding + i * 40)
    .attr('y', h - padding / 1.2)
    .attr('width', 40)
    .attr('height', 30)
    .style('fill', d => d);
})();
