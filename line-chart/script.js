var rowConverter = function(d) {
    return {
        // make new data object for each year + month
        date: new Date(+d.year, (+d.month - 1)),
        average: parseFloat(d.average)
    }
}

//load data 
d3.csv('mauna_loa_co2_monthly_averages.csv', rowConverter, function(data) {

    var dataset = data;

    // print data to console as table for verification
    console.table(dataset, ['date', 'average']);
});

