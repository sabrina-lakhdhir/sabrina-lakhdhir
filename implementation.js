var visData;

window.onload = function(){
    loadData("U of C - combined data - tableau version.csv");
};

function loadData(path) {
    d3.csv(path).then(function(data) {
        visData = data;
        setupVis();
        setupVis2();
    })
}
const WIDTH = 10000;
const HEIGHT = 500;
const PAD = 10;
const MARGIN = 50;

// code modified from Scott Murray's example
// https://alignedleft.com/tutorials/d3/scales
function setupVis(){
    var x = 50;
    var y = 100;
    var i = 0; // to sort through the entire file
    var j = 0; // to store individual faculty info (for the numbers)
    var k = 0; // to store individual faculty info (for the labels)
    var facultyTotals = [11];
    var facultyNames = [];
    var facultyColors = ["Red", "Green", "MediumBlue", "LawnGreen", "Linen", "RebeccaPurple", "DarkOrange", "Yellow", "Beige", "DarkGray", "DeepSkyBlue"];

    // this loop collects data about the total student enrollment per faculty
    while (i < visData.length) {
        if (visData[i]["Faculty"] === "") {    // how do you do this

        }
        else {
            facultyTotals[j] = visData[i]["FacultyTotal"];
            facultyNames[j] = visData[i]["Faculty"];
            j++;
        }
        i++;
    }
    i = 0;
    while (i < facultyNames.length) {
        console.log(facultyNames[i]);
        console.log(facultyTotals[i]);
        console.log(facultyColors[i]);
        i++;
    }
             /*
    let xScale = d3.scaleLinear()
    // d.point[0] - finding x value of "point" in the data set
        .domain([0, d3.max(visData, function(d) {
            return d.Faculty;
        })])
        .range([MARGIN, WIDTH-MARGIN]);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(visData, function(d) {
            return d.Faculty;
        })])
        .range([MARGIN, HEIGHT-MARGIN]);
       */

    let svg = d3.select("#vis")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    j = -1;
    var h = -1;
    svg.selectAll("circle")
        .data(visData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            x = x + 80;
            return x
        })
        .attr("cy", y)
        .attr("r",function(d) {
            j++;
            return (facultyTotals[j] / 100);
        })
        .style("fill", function(d) {
            h++;
            return facultyColors[h];
        })
        .style("stroke", "none");


    x = 50;
    y = 130;
    k = -1;
    svg.selectAll("text")
        .data(visData)
        .enter()
        .append("text")
        .text(function(d) {
            k++;
            return facultyNames[k];
        })
        .attr("x", function(d) {
            x = x + 20;
            return x
        })
        .attr("y", y)
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .style("text-anchor", "end")
        .style("alignment-baseline", "left")
        .attr("transform", "rotate(-90 -10 10)");
}

function setupVis2(){
    var x = 50;
    var y = 100;
    /*
let xScale = d3.scaleLinear()
// d.point[0] - finding x value of "point" in the data set
.domain([0, d3.max(visData, function(d) {
   return d.Faculty;
})])
.range([MARGIN, WIDTH-MARGIN]);

let yScale = d3.scaleLinear()
.domain([0, d3.max(visData, function(d) {
   return d.Faculty;
})])
.range([MARGIN, HEIGHT-MARGIN]);
*/

    let svg = d3.select("#vis2")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    svg.selectAll("circle")
        .data(visData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            x = x + 20;
            return x
        })
        .attr("cy", y)
        .attr("r",function(d) {
            return (d.TotalStudents / 10);
        })
        .style("fill", "black")
        .style("stroke", "none");


    x = 50;
    y = 130;
    svg.selectAll("text")
        .data(visData)
        .enter()
        .append("text")
        .text(function(d) {
            return d["Major"];
        })
        .attr("x", function(d) {
            x = x + 20;
            return x
        })
        .attr("y", y)
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .style("text-anchor", "end")
        .style("alignment-baseline", "left")
        .attr("transform", "rotate(-90 -10 10)");
}