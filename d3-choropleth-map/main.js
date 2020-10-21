const education_data_url =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

const county_data_url =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

let width = 960,
  height = 630;

const svg = d3
  .select('#map')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

function fetchCountyData() {
  return fetch(county_data_url)
    .then(res => res.json().then(data => data))
    .catch(err => console.log(err));
}

function fetchEducationData() {
  return fetch(education_data_url)
    .then(res => res.json().then(data => data))
    .catch(err => console.log(err));
}

(async function() {
  let countyData = await fetchCountyData();
  console.log(Object.keys(countyData.objects.counties));

  let educationData = await fetchEducationData();
  console.log(educationData[0]);

  let tooltip = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0)
    .style('z-index', '10');

  let colors = [
    '#c1e7ff',
    '#a7cfe9',
    '#8eb8d3',
    '#75a1be',
    '#5d8ba9',
    '#437594',
    '#296080',
    '#004c6d',
  ];

  let colorscale = d3
    .scaleLinear()
    .range(colors)
    .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8));

  svg
    .selectAll('path')
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('data-fips', d => d.id)
    .attr('data-education', d => {
      let res = educationData.filter(obj => obj.fips === d.id);
      return res[0] ? res[0].bachelorsOrHigher : '';
    })
    .style('fill', d => {
      colorscale(d.bachelorsOrHigher);
      let res = educationData.filter(obj => obj.fips === d.id);
      return res[0] ? colorscale(res[0].bachelorsOrHigher) : colors[0];
    })
    .on('mouseover', d => {
      let res = educationData.filter(obj => obj.fips === d.id);

      tooltip
        .attr('data-education', res[0].bachelorsOrHigher)
        .html(
          `
                           ${res[0].area_name}, ${res[0].state} ${res[0].bachelorsOrHigher}%
                                   `,
        )
        .style('top', d3.event.pageY - 50 + 'px')
        .style('left', d3.event.pageX + 20 + 'px')
        .style('font-size', '14px')
        .style('background', '#f5f9cd')
        .style('padding', '10px')
        .style('line-height', '1.5')
        .style('border-radius', '5px')
        .style('opacity', 0.9);
    })
    .on('mouseout', () => tooltip.style('opacity', 0));

  svg
    .append('path')
    .datum(
      topojson.mesh(countyData, countyData.objects.states, (a, b) => a !== b),
    )
    .attr('class', 'states')
    .attr('d', d3.geoPath());

  let linear = d3
    .scaleLinear()
    .domain([2.6, 75.1])
    .range(['#c1e7ff', '#004c6d']);

  svg
    .append('g')
    .attr('id', 'legend')
    .attr('transform', 'translate(480, 10)');

  let legendLinear = d3
    .legendColor()
    .shapeWidth(45)
    .cells([3, 12, 21, 30, 39, 48, 57, 66])
    .orient('horizontal')
    .scale(linear);
  svg.select('#legend').call(legendLinear);
})();
