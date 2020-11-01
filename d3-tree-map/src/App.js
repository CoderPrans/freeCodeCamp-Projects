import logo from './logo.svg';
import {useState, useEffect} from 'react';
import './App.css';
import * as d3 from 'd3';
import colors from './colors'

function Plot({data}) {
    let width = 1060;
    let height = 570;
    let root = d3.hierarchy(data).sum(d => d.value);
    let categories = data.children.map(d => d.name);
    useEffect(() => {
	let tooltip = d3.select('#tooltip')
	   d3.selectAll('.tile')
	   .on('mouseover', d => {
	       tooltip
		   .attr('data-value', d.target.dataset.value)
		   .html(`${d.target.dataset.name}<br/>${d.target.dataset.category}<br/>${d.target.dataset.value}`)
		   .style('top', d.screenY - 10 + 'px')
		   .style('left', d.screenX + 10 + 'px')
		   .style('background', '#f5f9cd')
		   .style('line-height', '1.5')
		   .style('border-radius', '5px')
		   .style('opacity', 0.9)
		   .style('font-size', '13px')
		   .style('padding', '15px')

	   }).on('mouseout', () => {tooltip.style('opacity', 0)});
    }, [])
  return (
    <div>
      <h1 id="title">Tree Map</h1>
      <h3 id="description">{data.name}</h3>
      <svg width={width} height={height}>
        <g transform="translate(0,0)">
          {d3
            .treemap()
            .size([width, height])
            .padding(2)(root) && (
            <>
		    {console.log(root.leaves())}
		{console.log(data)}
              {root.leaves().map(l => {
                if (l.data.name) {
                  return (
                    <>
                      <rect
		        className="tile"
		        key={l.value}
                        x={l.x0}
                        y={l.y0}
                        width={l.x1 - l.x0}
                        height={l.y1 - l.y0}
                      stroke={colors[l.data.category]}
		      data-name={l.data.name}
		      data-category={l.data.category}
		      data-value={l.value}
                        style={{
                          fill: colors[l.data.category],
                        }}>
                        {l.data.category}
                        {l.data.name}
                      </rect>
                      <text>
                        {l.data.name.split(/(?=[A-Z][^A-Z])/g).map((v, i) => (
                          <tspan
                            x={l.x0 + 5}
                            y={l.y0 + 15 + i * 10}
			    key={`${v}-${i}`}
			    fontSize="0.6em"
                            fill="white">
                            {v}
                          </tspan>
                        ))}
                      </text>
                    </>)}})}
		</>)

	  }
      </g></svg>
	<div id="tooltip"
      style={{position: 'absolute', opacity: 0, zIndex: 10}}></div>

	  <svg id="legend" width="750" height="700">
	  {categories.slice(0).map((c, i) => (
		  <>
		  <rect
	      className="legend-item"
	      width="20"
	      height="20"
	      x={i<5?30:(i<10?230:(i<15?430:630))}
	      y={i<5?(i+1)*30:(i<10?(i-4)*30:(i<15?(i-9)*30:(i-14)*30))}
	      style={{
		  fill: colors[c]
	      }}>
		  </rect>
		  <text
	      x={i<5?60:(i<10?260:(i<15?460:660))}
	      y={i<5?(i+1.5)*30:(i<10?(i-3.5)*30:(i<15?(i-8.5)*30:(i-13.5)*30))}
		  >{c}</text>
	      </>
	  ))}
      </svg>
      </div>)}

function fetchData(url) {
  return fetch(url)
    .then(res => res.json().then(data => data))
    .catch(err => console.log(err));
}

function App() {
  const [data, setData] = useState(null);
  const [url, setUrl] = useState('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json');

  const baseUrl =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map';
  const links = {
    movie: 'movie-data.json',
    kickstarter: 'kickstarter-funding-data.json',
    games: 'video-game-sales-data.json',
  };

  useEffect(() => {
    (async function() {
      setData(null);
      if (url.length) {
        const response = await fetchData(url);
        setData(response);
      }
    })();
  }, [url]);

  return (
    <div className="App">
      <header
        style={{
          flexDirection: 'row',
        }}
        className="App-header">
        <button onClick={() => setUrl(`${baseUrl}/${links.movie}`)}>
          Movie Data
        </button>
        <button onClick={() => setUrl(`${baseUrl}/${links.kickstarter}`)}>
          Kickstarter Data
        </button>
        <button onClick={() => setUrl(`${baseUrl}/${links.games}`)}>
          Video Game Data
        </button>
      </header>
      {data && <Plot data={data} />}
    </div>
  );
}

export default App;
