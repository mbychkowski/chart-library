var dataset,
    xScale,
    yScale,
    line;

var svgWidth = 800, svgHeight = 300;
var padding = 40;

var rowConverter = function(d) {
    
    return {
        // make new data object for each year + month
        date: new Date(+d.year, (+d.month - 1)),
        average: parseFloat(d.average)
    }
}

//load data 
d3.csv('mauna_loa_co2_monthly_averages.csv', rowConverter)
    .then(function(dataset) {

    // print data to console as table for verification
    // console.table(dataset, ['date', 'average']);

    xScale = d3.scaleTime()
        .domain([
            d3.min(dataset, function(d) { return d.date; }),
            d3.max(dataset, function(d) { return d.date; })
        ])
        .range([0, svgWidth]);

    yScale = d3.scaleLinear()
        .domain([
            d3.min(0, d3.max(dataset, function(d) { return d.average; }))
        ])
        .range([svgHeight, 0]);

    line = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.average); });

    var svg = d3.select('body')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    svg.append('path')
        .datum(dataset)
        .attr('class', 'line')
        .attr('d', line);
});
