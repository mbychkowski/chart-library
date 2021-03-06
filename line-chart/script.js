var dataset,
    xScale,
    yScale,
    xAxis,
    yAxis,
    line;

var svgWidth = 800, svgHeight = 300;
var padding = 40;

var rowConverter = function(d) {
    
    return {
        // make new data object for each year + month
        date: new Date(+d.year, (+d.month - 1)),
        average: d.average,
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
            .range([padding, svgWidth]);

        yScale = d3.scaleLinear()
            .domain([
                0,
                d3.max(dataset, function(d) { return d.average; })
            ])
            .range([svgHeight - padding, 0]);
        
        // define axes
        xAxis = d3.axisBottom(xScale).ticks(10);
        yAxis = d3.axisLeft(yScale).ticks(6);

        line = d3.line()
            .defined(function(d) { return d.average >= 0 && d.average <= 350; })
            .x(function(d) { return xScale(d.date); })
            .y(function(d) { return yScale(d.average); });
        
        dangerLine = d3.line()
            .defined(function(d) { return d.average >= 350; })
            .x(function(d) { return xScale(d.date); })
            .y(function(d) { return yScale(d.average); });

        var svg = d3.select('body')
            .append('svg')  
            .attr('width', svgWidth)
            .attr('height', svgHeight);
        
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${svgHeight - padding})`)
            .call(xAxis);
        
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(${padding}, 0)`)
            .call(yAxis);

        svg.append('path')
            .datum(dataset)
            .attr('class', 'line')
            .attr('d', line);

        svg.append('path')
            .datum(dataset)
            .attr('class', 'line danger')
            .attr('d', dangerLine);

        svg.append('line')
            .attr('class', 'line threshold')
            .attr('x1', padding)
            .attr('x2', svgWidth)
            .attr('y1', yScale(350))
            .attr('y2', yScale(350));

        svg.append('text')
            .attr('class', 'dangerLabel')
            .attr('x', padding + 20)
            .attr('y', yScale(350) - 7)
            .text('350 ppm "safe" level');
});
