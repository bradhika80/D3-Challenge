
// set thr height and width for the chart
var svgWidth = 960;
var svgHeight = 500;

// set the margin
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


function CreateChart()
{
    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#bonus")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    selectedXYData = []
    // Import Data
    d3.csv("/assets/data/data.csv").then(function(healthcareIndicators) {

        // Step 1: Parse Data/Cast as numbers
        // ==============================
        healthcareIndicators.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smoke = +data.smoke;

        xValues =[];
        yValues = [];
      

        dataDict = { "x" : data.poverty,
                            "y" :data.healthcare,
                            "tip" : data.state,
                            "text" : data.abbr}

        selectedXYData.push(dataDict);

        });

     console.log(selectedXYData);
        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(selectedXYData, d => d.x) - 1, d3.max(selectedXYData, d => d.x)])
        .range([0, chartWidth]);

        var yLinearScale = d3.scaleLinear()
        .domain([(d3.min(selectedXYData, d => d.y) - 1), d3.max(selectedXYData, d => d.y)])
        .range([chartHeight, 0]);

        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to the chart
        // ==============================
        chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

        chartGroup.append("g")
        .call(leftAxis);

        // Step 5: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
        .data(selectedXYData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.x))
        .attr("cy", d => yLinearScale(d.y))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("opacity", ".5")
        .attr("stroke", "white");  

        chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .selectAll("tspan")
        .data(selectedXYData)
        .enter()
        .append("tspan")
        .attr("x", d =>  xLinearScale(d.x))
        .attr("y", d =>  yLinearScale(d.y))
        .text(function(d) {
            return d.text
        });

        // Step 6: Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -70])
        .html(function(d) {
            return (`<h5>${d.tip}</h5> <hr/> Poverty : ${d.x}<br>Health Care: ${d.y}`);
        });

        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    

        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

        chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    }).catch(function(error) {
        console.log(error);
    });

}

CreateChart();