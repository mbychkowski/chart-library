var dataset,
    xScale,
    yScale,
    xAxis,
    yAxis,
    area;

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
                d3.min(dataset, function(d) { if(d.average >= 0) return d.average; }),
                d3.max(dataset, function(d) { return d.average; })
            ])
            .range([svgHeight - padding, 0]);
        
        // define axes
        xAxis = d3.axisBottom(xScale).ticks(10);
        yAxis = d3.axisLeft(yScale).ticks(6);

        area = d3.area()
            .defined(function(d) { return d.average >= 0; })
            .x(function(d) { return xScale(d.date); })
            .y0(function() { return yScale.range()[0]})
            .y1(function(d) { return yScale(d.average); });
        
        dangerArea = d3.area()
            .defined(function(d) { return d.average >= 350; })
            .x(function(d) { return xScale(d.date); })
            .y0(function() { return yScale(350); })
            .y1(function(d) { return yScale(d.average); });

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
            .attr('class', 'area')
            .attr('d', area);

        svg.append('path')
            .datum(dataset)
            .attr('class', 'area danger')
            .attr('d', dangerArea);

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
