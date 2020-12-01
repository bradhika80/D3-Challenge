
// set thr height and width for the chart
var svgWidth = 960;
var svgHeight = 500;

// set the margin
var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 150
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// set the x and y label selected
var xLabelSelected = "Poverty";
var yLabelSelected = "HealthCare";



// builds the dataset based on the selection
function GetDataset(data){
    var selectedXYData = [];

    switch (xLabelSelected)
     {
         case "Poverty" :
             xValue = data.poverty;
             break;
         
         case "Age" :
             xValue = data.age;
             break;
         
         case "Income" :
             xValue = data.income;
             break;
         
     }

      // select the attribute bases on the xLabelSelected value
      switch (yLabelSelected)
      {
          case "HealthCare" :
              yValue = data.healthcare;
              break;
          
          case "Smoke" :
              yValue = data.smoke;
              break;
          
          case "Obese" :
              yValue = data.obesity;
              break;
          
        }
    

      dataDict = { "x" : xValue,
                  "y" :yValue,
                  "tip" : data.state,
                  "text" : data.abbr}

      selectedXYData.push(dataDict);

      return (selectedXYData);
}

// function used for updating x-scale, y-scale var upon click on axis label
function XYScale(data, chosenXAxis, chosenYAxis) {
    // create scales


     // select the attribute bases on the xLabelSelected value
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) - 1, d3.max(selectedXYData, d => d[chosenXAxis])])
        .range([0, chartWidth]);
    
    // select the attribute bases on the xLabelSelected value
     var yLinearScale = d3.scaleLinear()
        .domain([(d3.min(data, d => d[chosenYAxis]) - 1), d3.max(selectedXYData, d => d[chosenYAxis])])
        .range([chartHeight, 0]);


  
    return xLinearScale, yLinearScale;
  
  }
  
  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis, newYScale, yAxis) 
  {
  
      // Step 3: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(newXScale);
      var leftAxis = d3.axisLeft(newYScale);

      // Step 4: transition xaxis
      // ==============================
      xAxis = xAxis.transition()
                    .duration(1000)
                    .call(bottomAxis);

      yAxis =  yAxis.transition()
                    .duration(1000)
                    .call(leftAxis);

      return xAxis, yAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));

      
  
    return circlesGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -80])
      .html(function(d) {
        return (`<h5>${d.state}</h5> <hr/> ${chosenXAxis} : ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}` `${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }


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

        var xValue;
        var yValue;

        // select the attribute bases on the xLabelSelected value
        switch (xLabelSelected)
        {
            case "Poverty" :
                xValue = data.poverty;
                break;
            
            case "Age" :
                xValue = data.age;
                break;
            
            case "Income" :
                xValue = data.income;
                break;
            
        }

        // select the attribute bases on the xLabelSelected value
        switch (yLabelSelected)
        {
            case "HealthCare" :
                yValue = data.healthcare;
                break;
            
            case "Smoke" :
                yValue = data.smoke;
                break;
            
            case "Obese" :
                yValue = data.obesity;
                break;
            
          }
      

        dataDict = { "x" : xValue,
                    "y" :yValue,
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
        var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

        var yAxis =  chartGroup.append("g")
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
        .offset([80, -80])
        .html(function(d) {
            return (`<h5>${d.tip}</h5> <hr/> ${xLabelSelected} : ${d.x}<br>${yLabelSelected}: ${d.y}`);
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

    
        // reference  :- https://www.dashingd3js.com/lessons/making-dynamic-scales-and-axes

        // Create axes labels

        // add y label for the healthcare

        var ylabelsGroup = chartGroup.append("g");
        
        var healthLabel = ylabelsGroup.append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 0 - margin.left + 100)
                        .attr("x", 0 - (chartHeight / 2))
                        .attr("dy", "1em")
                        .classed("active", true)
                        .classed("inactive", false)
                        .attr("value", "HealthCare")
                        .attr("class", "axisText")
                        .text("Lacks Healthcare (%)");

        
        // add y label for the Smoke
        var smokeLabel = ylabelsGroup.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 0 - margin.left + 70)
                            .attr("x", 0 - (chartHeight / 2))
                            .attr("dy", "1em")
                            .classed("inactive", true)
                            .classed("active", false)
                            .attr("class", "axisText")
                            .attr("value", "Smoke")
                            .text("Smoke (%)");

        // add y label for the Obese
        var obeseLabel = ylabelsGroup.append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 0 - margin.left + 40)
                        .attr("x", 0 - (chartHeight / 2))
                        .attr("dy", "1em")
                        .classed("inactive", true)
                        .classed("active", false)
                        .attr("value", "Obese")
                        .attr("class", "axisText")
                        .text("Obese (%)");

        
        // x axis labels event listener
        ylabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== yLabelSelected) {

                // replaces chosenXAxis with value
                yLabelSelected = value;

                
            
                // changes classes to change bold text
                switch (yLabelSelected)            
                {
                    case "HealthCare" :
                        healthLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        smokeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obeseLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;
                    case "Smoke" :
                        healthLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        obeseLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;
                    case "Obese" :
                        healthLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obeseLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        break;
                }
                console.log(yLabelSelected);
                 
            }
        });


        var xLabelsGroup = chartGroup.append("g");
    

        // add x label for the poverty
        var povertyLabel =  xLabelsGroup.append("text")
                            .attr("transform", `translate(${chartWidth / 2 }, ${chartHeight + margin.top + 30})`)
                            .attr("class", "axisText")
                            .attr("value", "Poverty") // value to grab for event listener
                            .classed("active", true)
                            .text("In Poverty (%)");

        // add x label for the Age Median
        var ageLabel = xLabelsGroup.append("text")
                            .attr("transform", `translate(${chartWidth / 2 }, ${chartHeight + margin.top + 55})`)
                            .attr("class", "axisText")
                            .attr("value", "Age") // value to grab for event listener
                            .classed("inactive", true)
                            .text("Age (Median)");

        // add x label for the House hold Median
        var incomeLabel = xLabelsGroup.append("text")
                            .attr("transform", `translate(${chartWidth / 2 }, ${chartHeight + margin.top + 80})`)
                            .attr("class", "axisText")
                            .attr("value", "Income") // value to grab for event listener
                            .classed("inactive", true)
                            .text("Household Income (Median)");

        
        xLabelsGroup.selectAll("text")
            .on("click", function() {
                // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== xLabelSelected) {

                // replaces chosenXAxis with value
                xLabelSelected = value;
              
                // updates x scale for new data
                xLinearScale, yLinearScale = XYScale(healthcareIndicators, xLabelSelected, yLabelSelected);

                // updates x axis with transition
                xAxis, yAxis = renderAxes(xLinearScale, xAxis, yLinearScale, yAxis );

                // updates circles with new x and y values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, xLabelSelected, yLinearScale, yLabelSelected);

                // updates tooltips with new info
                circlesGroup = updateToolTip(xLabelSelected, yLabelSelected, circlesGroup);
            
                // changes classes to change bold text
                switch (xLabelSelected)            
                {
                    case "Poverty" :
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;
                    case "Age" :
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);

                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        break;
                    case "Income" :
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        break;
                }
                console.log(xLabelSelected);
                //CreateChart();
            }
        });



    }).catch(function(error) {
        console.log(error);
    });

}

CreateChart();