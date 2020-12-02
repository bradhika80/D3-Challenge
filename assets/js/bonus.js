
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
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


// function used for updating x-scale, y-scale var upon click on axis label
function XYScale(data, chosenAxis, axisType) {
    // create scales based on the axis type
   
    switch(axisType) {
        case "xAxis":
            var linearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[chosenAxis]), d3.max(data, d => d[chosenAxis])])
            .range([0, chartWidth]);
          break;
        case "yAxis":  
            var linearScale = d3.scaleLinear()
            .domain([(d3.min(data, d => d[chosenAxis])), d3.max(data, d => d[chosenAxis])])
            .range([chartHeight, 0]);

            break;
      }

    return linearScale;  
  }
  
  // function used for updating xAxis var upon click on axis label
  function renderAxes(newScale, selAxis,axisType) 
  {  
      // Step 3: Create axis functions
      // ==============================

      switch(axisType) {
        case "xAxis":
          var axis = d3.axisBottom(newScale);
          break;
        case "yAxis":  
          var axis = d3.axisLeft(newScale);
          break;
      }

      // Step 4: transition xaxis
      // ==============================
        selAxis.transition()
                    .duration(1000)
                    .call(axis);

      return selAxis;
    }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newScale, chosenAxis, axisType) {
  
    switch(axisType) {
        case "xAxis":
            circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newScale(d[chosenAxis]))
          break;
        case "yAxis":  
            circlesGroup.transition()
            .duration(1000)
            .attr("cy", d => newScale(d[chosenAxis]))
          break;
      }      
  
    return circlesGroup;
  }
  
  // function for updating circles text 
  function renderCircleTextLabels(circleTextGroup, newScale, chosenAxis, axisType) {

    switch(axisType) {
        case "xAxis":
            circleTextGroup.transition()
                    .duration(1000)
                    .attr("x", d => newScale(d[chosenAxis]))
                    .attr("cx", "-0.75em")
                    .attr("cy", "0.25em")
            break;
        case "yAxis":  
        circleTextGroup.transition()
                .duration(1000)
                .attr("y", d => newScale(d[chosenAxis]))
                .attr("cx", "-0.75em")
                .attr("cy", "0.25em")
            break;
      }        
    return circleTextGroup;
  }
  

  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) {
        return (`<h5>${d.state}</h5> <hr/> ${chosenXAxis} : ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`);
      });
     console.log(toolTip);
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

  d3.csv("/assets/data/data.csv").then(function(healthcareIndicators) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthcareIndicators.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    
    });

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#bonus")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthcareIndicators, d => d[chosenXAxis]) - 1, d3.max(healthcareIndicators, d =>d[chosenXAxis])])
    .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
    .domain([(d3.min(healthcareIndicators, d => d[chosenYAxis]) - 1), d3.max(healthcareIndicators, d => d[chosenYAxis])])
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
    .data(healthcareIndicators)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", ".5")
    .attr("stroke", "white");  

    circleTextGroup = chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "8px")
    .selectAll("tspan")
    .data(healthcareIndicators)
    .enter()
    .append("tspan")
    .attr("x", d =>  xLinearScale(d[chosenXAxis]))
    .attr("y", d =>  yLinearScale(d[chosenYAxis]))
    .text(function(d) {
        return d.abbr
    });

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
        return (`<h5>${d.state}</h5> <hr/> ${chosenXAxis} : ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`);
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

    // create y labels group
    var ylabelsGroup = chartGroup.append("g");

     // add y label for the healthcare
    var healthLabel = ylabelsGroup.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left + 100)
                    .attr("x", 0 - (chartHeight / 2))
                    .attr("dy", "1em")
                    .classed("active", true)
                    .classed("inactive", false)
                    .attr("value", "healthcare")
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
                        .attr("value", "smokes")
                        .text("Smoke (%)");

    // add y label for the Obese
    var obeseLabel = ylabelsGroup.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left + 40)
                    .attr("x", 0 - (chartHeight / 2))
                    .attr("dy", "1em")
                    .classed("inactive", true)
                    .classed("active", false)
                    .attr("value", "obesity")
                    .attr("class", "axisText")
                    .text("Obese (%)");

    
    // x axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
            console.log(value);

            // replaces chosenYAxis with value
            chosenYAxis = value;

            // updates y scale for new data
            yLinearScale = XYScale(healthcareIndicators, chosenYAxis, "yAxis");
 
            // updates y axis with transition
            yAxis = renderAxes(yLinearScale, yAxis,"yAxis" );
 
            // updates circles with new y values
            circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis, "yAxis");
 
            // update the circle text with text values
            chartTextGroup = renderCircleTextLabels(circleTextGroup, yLinearScale, chosenYAxis, "yAxis");

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        
            // changes classes to change bold text
            switch (chosenYAxis)            
            {
                case "healthcare" :
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
                case "smokes" :
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
                case "obesity" :
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
                
        }
    });


    // build labels for x-axis
    var xLabelsGroup = chartGroup.append("g");

    // add x label for the poverty
    var povertyLabel =  xLabelsGroup.append("text")
                        .attr("transform", `translate(${chartWidth / 2 }, ${chartHeight + margin.top + 30})`)
                        .attr("class", "axisText")
                        .attr("value", "poverty") // value to grab for event listener
                        .classed("active", true)
                        .text("In Poverty (%)");

    // add x label for the Age Median
    var ageLabel = xLabelsGroup.append("text")
                        .attr("transform", `translate(${chartWidth / 2 }, ${chartHeight + margin.top + 55})`)
                        .attr("class", "axisText")
                        .attr("value", "age") // value to grab for event listener
                        .classed("inactive", true)
                        .text("Age (Median)");

    // add x label for the House hold Median
    var incomeLabel = xLabelsGroup.append("text")
                        .attr("transform", `translate(${chartWidth / 2 }, ${chartHeight + margin.top + 80})`)
                        .attr("class", "axisText")
                        .attr("value", "income") // value to grab for event listener
                        .classed("inactive", true)
                        .text("Household Income (Median)");

    // add the on click event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
        var value = d3.select(this).attr("value");
        // if value is selected differently, then replot the chart
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;
            
            // updates x scale for new data
            xLinearScale = XYScale(healthcareIndicators, chosenXAxis, "xAxis");

            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis,"xAxis" );

            // updates circles with new x and y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, "xAxis");

            // update the circle text with text values
            chartTextGroup = renderCircleTextLabels(circleTextGroup, xLinearScale, chosenXAxis, "xAxis");

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        
            // changes classes to change bold text
            switch (chosenXAxis)            
            {
                case "poverty" :
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
                case "age" :
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
                case "income" :
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
        }
    });



    }).catch(function(error) {
        console.log(error);
    });


