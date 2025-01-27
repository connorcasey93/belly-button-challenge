// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metaarray = metadata.filter(sampobj => sampobj.id == sample);
    let metaresult = metaarray[0];
    // Use d3 to select the panel with id of `#sample-metadata`

    let panel = d3.select("#sample-metadata");
  

 // Use `.html("") to clear any existing metadata
    panel.html("");

// Inside a loop, you will need to use d3 to append new
// tags for each key-value in the filtered metadata.
    for (key in metaresult) {
      panel.append("h6").text(`${key.toUpperCase()}: ${metaresult[key]}`);
    } ;
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number

    let samplearray = samples.filter(sampobj => sampobj.id == sample);
    let sampleresult = samplearray[0];
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleresult.otu_ids;
    let otu_labels = sampleresult.otu_labels;
    let sample_values = sampleresult.sample_values;
    // Build a Bubble Chart
    let bubblelayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"},
    };

    let bubbledata = [{
      x: otu_ids,
      y: sample_values,
      text : otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids

      }
    }];

    // Render the Bubble Chart
    Plotly.newPlot("bubble",bubbledata,bubblelayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Don't forget to slice and reverse the input data appropriately
    let yticks = otu_ids.slice(0, 10).map(otu_ids => `OTU ${otu_ids}`).reverse();
    let bardata = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // Build a Bar Chart     
    const barlayout = {
      title: {
        text: "Top 10 Bacteria Cultures Found",
        x: 0.05 
      },
      margin: { t: 30, l: 60 },
      xaxis: { 
        title: "Number of Bacteria", 
        automargin: true, 
       
  },
      yaxis: { 
        automargin: true // Enable automatic margin adjustment for the labels
    },
      
  };
    
  // Render the Bar Chart
    Plotly.newPlot("bar", bardata, barlayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i=0;i<names.length;i++){
      dropdown.append("option").text(names[i]).property("value",names[i]);
    };

    // Get the first sample from the list
    let firstsample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstsample);
    buildCharts(firstsample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
