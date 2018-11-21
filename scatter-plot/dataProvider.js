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

export { dataset };