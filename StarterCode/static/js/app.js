function genplotly(id) {

    d3.json("samples.json").then((data)=> {
        console.log(data)

        var samplefil = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samplefil);


        var topsample = samplefil.sample_values.slice(0, 10).reverse();

        var topotu = (samplefil.otu_ids.slice(0, 10)).reverse();

        var otuid = topotu.map(d => "OTU" + d)

        var toplabels = samplefil.otu_labels.slice(0, 10)
        
        // creating bar_trace
        
        var bar_trace = {
            x: topsample,
            y: otuid,
            text: toplabels,
            type: 'bar',
            orientation: 'h',
        };

        var bar_data = [bar_trace];

        var layout = {
            title: "Top Ten Samples",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
        Plotly.newPlot("bar", bar_data, layout);


        var trace2 = {
            x: samplefil,
            y: topsample,
            mode: "markers",
            marker:{
                size: values,
                color: ids
            }
        }
        var layout2 = {
            xaxis:{title: "OTU ID"},
            height: 500,
            width:800
        };

        var data2 = [trace2]

        Plotly.newPlot("bubble", data2, layout2)
        });

};

function getData(id) {
    d3.json("samples.json").then((data)=> {
        
        var metadata = data.metadata;
        console.log(metadata)

        // filter metadata by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        // Use d3.select  to selct demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        // Emptying table for new data
        demographicInfo.html("");

        // Appending the data into the empty table
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

//Func. for the change event
function optionChanged(id) {
    genplotly(id);
    getData(id);
}

// Func. for data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // Reading the data
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // append id data to dropdown
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        //Displaying plots
        genplotly(data.names[0]);
        getData(data.names[0]);
    });
}

init();