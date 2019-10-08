let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

let data = {}
let padding = 60;

d3.json(url)
  .then(res => {
    data.set = [...res.data]
    data.height = d3.max(data.set.map(d => d[1])) * 0.03;
    data.width = data.set.length*4;
    console.log(data)
    // TODO: scales 

    let xScale = d3.scaleLinear()
      .domain([d3.min(data.set, d => parseInt(d[0].slice(0, 4))), d3.max(data.set, d => parseInt(d[0].slice(0, 4)))])
      .range([padding, data.width+padding])

    //console.log(xScale(10))

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data.set, d => d[1])])
      .range([data.height+padding, padding])

    //console.log(d3.max(data.set, d => d[0]));

    let yAxis = d3.axisLeft(yScale).tickFormat(d3.format('d'));
    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

    let svg = d3.select('#chart').append('svg')
            // svg attributes
                .attr('width', data.width + 2*padding)
                .attr('height', data.height + 2*padding)
                .style('background', '#fafafa')
      // bar attributes
      svg.selectAll('rect')
              .data(data.set)
              .enter().append('rect')
              .attr('class', 'bar')
              //.style('fill', 'lightgreen')
              .attr('width', 4)
              .attr('height', d => d[1]*0.03)
              .attr('data-gdp', d => d[1])
              .attr('data-date', d => d[0])
              .attr('x', (_, i) => i*4+padding)
              //.attr('x', d => xScale(d[0]))
              //.attr('y', d => data.height+padding - d[1]*0.05)
              .attr('y', d => yScale(d[1]))
      // y Axis
      svg.append('g')
          .attr('id', 'x-axis')
          .attr('transform', `translate(${padding}, 0)`)
          .call(yAxis)
      // y Axis
      svg.append('g')
          .attr('id', 'y-axis')
          .attr('transform', `translate(0, ${data.height + padding})`)
          .call(xAxis)

    let rects = document.getElementsByTagName('rect')
    Array.from(rects)
      .forEach(rect => {
        rect.onmouseover = () => {
          console.log(`${rect.getAttribute('data-date')}, ${rect.getAttribute('data-gdp')}`)
        }
      })

  })
    .catch(err => console.log(err));

