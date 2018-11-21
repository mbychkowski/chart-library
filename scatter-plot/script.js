// Start data generation
var dataset = [];
var numDataPoints = 1000;
var maxValue = Math.random() * 1000;

var svgWidth = 600, svgHeight = 400;
var padding = 40;

var randomGenerator = function () {
    for (var i = 0; i < numDataPoints; i++) {
        var newNumber1 = Math.floor(Math.random() * maxValue);
        var newNumber2 = Math.floor(Math.random() * maxValue);
        dataset.push([newNumber1, newNumber2]);
    } 
}

randomGenerator();
// End data generation

// define scales
var xScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, data => { return data[0]; })])
    .range([padding, svgWidth - padding * 2]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, data => { return data[1]; })])
    .range([svgHeight - padding, padding]);

var areaScale = d3.scaleSqrt()
    .domain([0, d3.max(dataset, data => { return data[1]; })])
    .range([3, 3]);

// define axes
var xAxis = d3.axisBottom(xScale).ticks(5);

var yAxis = d3.axisLeft(yScale).ticks(5);

// create svg
var svg = d3
    .select('body')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

svg.append('clipPath')
    .attr('id', 'chart-area')
    .append('rect')
    .attr('x', padding)
    .attr('y', padding)
    .attr('width', svgWidth - padding * 3)
    .attr('height', svgHeight - padding * 2);

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${ svgHeight - padding })`)
    .call(xAxis);

svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${ padding }, 0)`)
    .call(yAxis);

// base circle
var circle = svg.append('g')
    .attr('id', 'circles')
    .attr('clip-path', 'url(#chart-area)')
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle');

// locate circles
circle
    .attr('cx', data => {
        return xScale(data[0]);
    })
    .attr('cy', data => {
        return yScale(data[1]);
    })
    .attr('r', 2);
    
// animation
d3.select(this)
    .on('click', () => {
        
        dataset = [];
        xRange = Math.random() * 1000;
        yRange = Math.random() * 1000;
        randomGenerator();

        xScale.domain([0, d3.max(dataset, data => { return data[0]; })]);        
        yScale.domain([0, d3.max(dataset, data => { return data[1]; })]);

        svg.selectAll('circle')
            .data(dataset)
            .transition()
            .duration(1000)
            .on('start', function() {
                d3.select(this)
                    .attr('fill', 'magenta')
                    .attr('r', 7);
            })
            .attr('cx', function(data) {
                return xScale(data[0]);
            })
            .attr('cy', function(data) {
                return yScale(data[1]);
            })
            .transition()
            .duration(1000)
            .attr('fill', 'black')
            .attr('r', 2);
            // .on('end', function() {
            //     d3.select(this)
            //         .transition()
            //         .duration(1000)
            //         .attr('fill', 'black')
            //         .attr('r', 2);
            // });

        svg.select('.x.axis')
            .transition()
            .duration(1000)
            .call(xAxis);

        svg.select('.y.axis')
            .transition()
            .duration(1000)
            .call(yAxis);

    });




