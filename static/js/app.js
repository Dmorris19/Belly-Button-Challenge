let globalData;

// Fetch the JSON data and initialize the dashboard
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function(data) {
  globalData = data;
  init();
});

// Initialize the dashboard
function init() {
  let dropdownMenu = d3.select("#selDataset");
  globalData.names.forEach((name) => {
    dropdownMenu.append("option").text(name).property("value", name);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = globalData.names[0];
  buildCharts(firstSample);
  displayMetadata(firstSample);
}

// Function to build the charts
function buildCharts(sample) {
  // Filter the data for the object with the desired sample number
  const sampleData = globalData.samples.filter(obj => obj.id === sample)[0];
  const otu_ids = sampleData.otu_ids;
  const otu_labels = sampleData.otu_labels;
  const sample_values = sampleData.sample_values;

  // Build Bar Chart
  let barData = [{
    x: sample_values.slice(0, 10).reverse(),
    y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
    text: otu_labels.slice(0, 10).reverse(),
    type: 'bar',
    orientation: 'h'
  }];

  let barLayout = {
    title: 'Top 10 OTUs Found in Individual',
    margin: { t: 30, l: 150 }
  };

  Plotly.newPlot('bar', barData, barLayout);

  // Build Bubble Chart
  let bubbleData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: 'Earth'
    }
  }];

  let bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    hovermode: 'closest',
    xaxis: { title: 'OTU ID' }
  };

  Plotly.newPlot('bubble', bubbleData, bubbleLayout);
}

// Function to display the sample metadata
function displayMetadata(sample) {
  let metadata = globalData.metadata.filter(obj => obj.id.toString() === sample)[0];
  let panel = d3.select("#sample-metadata");
  panel.html(""); // Clear any existing metadata
  Object.entries(metadata).forEach(([key, value]) => {
    panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
}

// Function to handle change event when a new sample is selected
function optionChanged(newSample) {
  buildCharts(newSample);
  displayMetadata(newSample);
}
