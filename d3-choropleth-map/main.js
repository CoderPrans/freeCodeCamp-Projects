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

(async function() {
  let countyData = await fetchCountyData();
  console.log(Object.keys(countyData.objects.counties));

  svg
    .selectAll('path')
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('data-fips', d => d.id);

  svg
    .append('path')
    .datum(
      topojson.mesh(countyData, countyData.objects.states, (a, b) => a !== b),
    )
    .attr('class', 'states')
    .attr('d', d3.geoPath());
})();
