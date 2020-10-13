// 1) Use D3 library to read in samples.json
var jsonFile = "samples.json"

// Construct function to build charts
function buildCharts(sampleId) {
    d3.json(jsonFile).then(function (data) {
        var chartData = data.samples;
        var results = chartData.filter(x => x.id == sampleId);
        console.log(results);
        var result1 = results[0];

        //grab values to build plots
        var ids = result1.otu_ids;
        var sample_values = result1.sample_values;
        var otu_labels =  result1.otu_labels;

        // 2) create bar chart for top 10
        // Define top 10
        var topTenOtuID = ids.slice(0,10).reverse();
        var topTenOtu = sample_values.slice(0,10).reverse();

        // Trace for data
        var trace1 = {
            x: topTenOtu,
            y: topTenOtuID,
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };

        // data
        var data = [trace1];

        // layout
        var layout = {
            title: "Top 10 OTU's",
        };

        Plotly.newPlot("bar", data, layout);

        // 3) Bubble Chart
        bubble_data = [{
            x: ids,
            y: sample_values,
            marker: {
                color: ids,
                size: sample_values
            },
            mode: 'markers'
        }];
        // plot chart
        Plotly.newPlot("bubble", bubble_data)
    });
};

// 4) Create inital plot (sample metadata?)
function init() {
            var dropDownMenu = d3.selectAll("#selDataset");
            d3.json("samples.json").then((data)=> {
                var sampleNames = data.names;
                sampleNames.forEach((x) => {
                    dropDownMenu.append("option").text(x).property("value", x)
                })
                var firstId = sampleNames[0];
                buildCharts(firstId)
            })
        } init();

// 5) Display each key-value pair from the metadata JSON object somewhere on the page
function optionChanged(SampleId) {
    buildcharts(SampleId);
  // # builddemographic(Sample1);
  }


// create the function to get the necessary data
function getDemoInfo(id) {
    // read the json file to get data
        d3.json(jsonFile).then((data)=> {
    // get the metadata info for the demographic panel
            var metadata = data.metadata;
    
          // filter meta data info by id
           var result = metadata.filter(meta => meta.id.toString() === id)[0];
          // select demographic panel to put data
           var demographicInfo = d3.select("#sample-metadata");
            
         // empty the demographic info panel each time before getting new id info
           demographicInfo.html("");
    
         // grab the necessary demographic data data for the id and append the info to the panel
            Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
            });
        });
    }
    // create the function for the change event
    function optionChanged(id) {
        buildCharts(id);
        getDemoInfo(id);
    }