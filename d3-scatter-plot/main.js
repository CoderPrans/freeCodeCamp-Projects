let url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

let w = 1000,
  h = 550,
  padding = 50;

function fetchData() {
  return fetch(url)
    .then(res =>
      res.json().then(data => {
        let changedData = [];
        data.forEach(d => {
          let time = d.Time.split(':');
          d.Time = new Date(1970, 0, 1, 0, time[0], time[1]);
          changedData.push(d);
        });
        return changedData;
      }),
    )
    .catch(err => console.log(err));
}

(async function() {
  let dataset = await fetchData();
  console.log(dataset);

  let timeFormat = d3.timeFormat('%M:%S');

  let xScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, d => d.Year), d3.max(dataset, d => d.Year)])
    .range([padding, w - padding]);

  let yScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, d => d.Time))
    .range([padding, h - padding]);

  const svg = d3
    .select('#plot')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  let tooltip = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0)
    .style('z-index', '10')
    .style('bacground', '#000');

  svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.Year))
    .attr('cy', d => yScale(d.Time))
    .attr('r', 8)
    .attr('fill', d => (d.Doping.length ? '#e04' : '#0e4'))
    .attr('fill-opacity', 0.7)
    .attr('stroke', 'black')
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => {
      return d.Time.toISOString();
    })
    .attr('class', 'dot')
    .on('mouseover', d => {
      tooltip
        .attr('data-year', d.Year)
        .html(
          `${d.Name}: ${d.Nationality} + <br />
          Year: ${d.Year}, Time: ${timeFormat(d.Time)}
          ${d.Doping ? `<br/><br/>${d.Doping}` : ''}
        `,
        )
        .style('top', d3.event.pageY - 30 + 'px')
        .style('left', d3.event.pageX + 10 + 'px')
        .style('font-size', 12)
        .style('background', 'lightblue')
        .style('padding', '13px')
        .style('border-radius', '5px')
        .style('opacity', 0.9);
    })
    .on('mouseout', () => tooltip.style('opacity', 0));

  let yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

  svg
    .append('g')
    .attr('transform', `translate(0, ${h - padding})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  svg
    .append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);

  let legend = svg.append('g').attr('id', 'legend');

  legend
    .append('rect')
    .attr('x', 800)
    .attr('y', 100)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', '#e04')
    .attr('fill-opacity', 0.7);

  legend
    .append('text')
    .attr('x', 830)
    .attr('y', 115)
    .text('Doping Allegations');

  legend
    .append('rect')
    .attr('x', 800)
    .attr('y', 130)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', '#0e4')
    .attr('fill-opacity', 0.7);

  legend
    .append('text')
    .attr('x', 830)
    .attr('y', 145)
    .text('No Doping Allegations');
})();
