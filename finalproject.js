const width = 1500;
const height = 1140;
const margin = 20;

const charSize = 10;

var parentCounter = 0;
var childCounter = 0;
var babyCounter = 0;

setup();
/*
Remaining TODO:
- figure out how to pile gender circles so tooltips can be accessed on either
    - NOTE: female tooltips do not show when there are more males than females in a department
- buttons for multiple years of data - MAYBE
- zoom in on a faculty
 */

function setup() {
    d3.json("uofc.json")
    .then(function(source) {
        const data = getPackedData(source);
        const container = prepareContainer();

        const nodes = container
            .selectAll("g")
            .data(data).enter()
            .append("g")
            .attr("transform", function(d) {
                return `translate(${d.x},${d.y})`;
            });

        var svg = d3.select("body")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .on("zoom", function () {
                svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
            })
            .append("g");

        renderParentCircles(nodes);
        addLeafLabels(nodes);
        addParentLabels(data, container);
        renderChildCircles(nodes);
        //renderBabyCircles(nodes);
    });
}


function prepareContainer() {

    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    return svg
        .append("g")
        .attr("class", "circles")
        .attr("transform", `translate(${margin},${margin})`);
}

function getPackedData(source) {
    const stratify = d3.stratify()
        .parentId(function(d) {
            return d.family;
        })
        .id(function(d) {
            return d.name;
        });

    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    const pack = d3.pack()
        .size([chartWidth, chartHeight])
        .padding(3);

    const root = stratify(source)
        .sum(function(d) {
            return d.totalStudents;
        })
        .sort(function(a, b) {
            return b.totalStudents - a.totalStudents;
        });

    pack(root);
    return root.descendants();
}

function renderParentCircles(nodes) { // entire student body
        nodes.append("circle")
            .attr("id", function (d) {
                if (d.depth === 0) {
                    return "circle-" + d.id;
                }
            })
            .attr("r", function (d) {
                if (d.depth === 0) {
                    return d.r;
                }
            })
            .style("fill", function (d) {
                if (d.depth === 0) {
                    return "black";
                }
            })
            .on("click", function(nodes) {
                onClickParent(nodes);
            })
            .append("svg:title")
            .text(function(d) {
                return (d.id + " (" + d.value + ")");
            });
}

function renderChildCircles(nodes) { // faculties

    nodes.append("circle")
        .attr("id", function (d) {
            if (d.depth === 1) {
                return "circle-" + d.id;
            }
        })
        .attr("r", function (d) {
            if (d.depth === 1) {
                return d.r;
            }
        })
        .style("fill", function (d) {
            if (d.depth === 1) {
                if (d.data.name === "Arts") {
                    return "Red";
                }
                else if (d.data.name === "Cumming School of Medicine") {
                    return "Green";
                }
                else if (d.data.name === "Haskayne School of Business") {
                    return "RoyalBlue";
                }
                else if (d.data.name === "Kinesiology") {
                    return "YellowGreen";
                }
                else if (d.data.name === "Law") {
                    return "AntiqueWhite";
                }
                 else if (d.data.name === "Nursing") {
                    return "RebeccaPurple";
                }
                else if (d.data.name === "Schulich School of Engineering") {
                    return "DarkOrange";
                }
                else if (d.data.name === "Science") {
                    return "Gold";
                }
                else if (d.data.name === "Social Work") {
                    return "DarkKhaki";
                }
                else if (d.data.name === "Veterinary Medicine") {
                    return "DarkGray";
                }
                else if (d.data.name === "Werklund School of Education") {
                    return "DeepSkyBlue";
                }
            }
        })
        .style("opacity", 1)
        .on("click", function(d) {
            childCounter++;
            onClickChild(nodes);
        })
        .append("svg:title")
        .text(function(d) {
            return (d.id + " (" + d.value + ")");
        });
        //.on("click", function (d) {
        //    onClickChild(d);
        //    console.log("click");
        //    childCounter++;
        //});
}

function renderBabyCircles(nodes) { // departments
    let artColorScale = d3.scaleQuantile()
        .domain([0, 49])
        .range(["#ffe6e6", "#ffcccc", "#ffb3b3", "#ff9999", "#ff8080", "#ff6666", "ff4d4d"]);
    let medColorScale = d3.scaleQuantile()
        .domain([0, 31])
        .range(["#e6ffe6", "#ccffcc", "#b3ffb3", "#99ff99", "80ff80", "#00e600", "#00cc00"]);
    let businessColorScale = d3.scaleQuantile()
        .domain([0, 19])
        .range(["#e9eefc", "#d3dcf8", "#bdcbf5", "#a7b9f1", "#91a8ee", "#7b97ea", "#6585e7"]);
    let kinesColorScale = d3.scaleQuantile()
        .domain([0, 7])
        .range(["#f5faea", "#ebf5d6", "#e1f0c1", "#d6ebad", "#cce698", "#c2e184", "#b8dc6f"]);
    let lawColorScale = d3.scaleQuantile()
        .domain([0, 1])
        .range(["#ffffff", "#fcf4e8"]);
    let nursingColorScale = d3.scaleQuantile()
        .domain([0, 2])
        .range(["#f2ecf9", "#e6d9f2", "#d9c6ec", "#ccb3e6", "#bf9fdf", "#b38cd9", "#a679d2"]);
    let enggColorScale = d3.scaleQuantile()
        .domain([0, 9])
        .range(["#fff4e6", "#ff38cc", "#ffddb3", "#ffd199", "#ffc680", "#ffba66", "#ffaf4d"]);
    let scienceColorScale = d3.scaleQuantile()
        .domain([0, 23])
        .range(["#fffbe6", "#fff7cc", "#fff4b3", "#fff099", "#ffec80", "#ffe866", "#ffe44d"]);
    let socialColorScale = d3.scaleQuantile()
        .domain([0, 4])
        .range(["#f7f6ed", "#efeedc", "#e7e5ca", "#dfddb9", "#d7d4a7"]);
    let vetColorScale = d3.scaleQuantile()
        .domain([0, 1])
        .range(["#f2f2f2", "#e6e6e6", "#d9d9d9", "#cccccc", "#bfbfbf"]);
    let edColorScale = d3.scaleQuantile()
        .domain([0, 19])
        .range(["#e6f9ff", "#ccf2ff", "#b3ecff", "#99e6ff", "#80dfff", "#66d9ff", "#4dd2ff"]);

    nodes.append("circle")
        .attr("id", function (d) {
            //console.log(d.data.family);
            //console.log(d);
            if (d.depth === 2) {
                return "circle-" + d.id;
            }
        })
        .attr("r", function (d) {
            if (d.depth === 2) {
                return d.r;
            }
        })
        .style("fill", function (d) {
            if (d.depth === 2) {
                if (d.data.family === "Arts") {
                    return artColorScale(d.r);
                }
                else if (d.data.family === "Cumming School of Medicine") {
                    return medColorScale(d.r);
                }
                else if (d.data.family === "Haskayne School of Business") {
                    return businessColorScale(d.r);
                }
                else if (d.data.family === "Kinesiology") {
                    return kinesColorScale(d.r);
                }
                else if (d.data.family === "Law") {
                    return lawColorScale(d.r);
                }
                else if (d.data.family === "Nursing") {
                    return nursingColorScale(d.r);
                }
                else if (d.data.family === "Schulich School of Engineering") {
                    return enggColorScale(d.r);
                }
                else if (d.data.family === "Science") {
                    return scienceColorScale(d.r);
                }
                else if (d.data.family === "Social Work") {
                    return socialColorScale(d.r);
                }
                else if (d.data.family === "Veterinary Medicine") {
                    return vetColorScale(d.r);
                }
                else if (d.data.family === "Werklund School of Education") {
                    return edColorScale(d.r);
                }
            }
        })
        .style("opacity", 1)
        .on("click", function(d) {
            babyCounter++;
            onClickBaby(nodes);
        })
        .on("mouseover", function(d) {
            console.log("animate");
            grow(d.r);
        })
        .append("svg:title")
        .text(function(d) {
            return (d.id + " (" + d.value + ")");
        });

}
function renderFemaleCircles(nodes) { // departmental gender breakdown
    nodes.append("circle")
        .attr("id", function (d) {
            if (d.data.female !== 0) {
                return "circle-" + d.id;
            }

        })
        .attr("r", function (d) {
            if (d.data.female !== 0) {
                //console.log(d.id, d.r);
                return d.data.female / d.r * 4;
            }
        })
        .style("fill", function (d) {
            if (d.data.female !== 0) {
                return "lightpink";
            }
        })
        .style("opacity", 0.5)
        .style("stroke-width", 1)
        //.transform("translate", "translate(0, 5)")
        .append("svg:title")
        .text(function(d) {
            return (d.data.name + "\nMale (" + d.data.male + "), " + "Female (" + d.data.female + ")");
        })
        .on("click", function(d) {
            //console.log(d.data.name);
        });
}

function renderMaleCircles(nodes) { // departmental gender breakdown
    nodes.append("circle")
        .attr("id", function (d) {
            if (d.data.male !== 0) {
                return "circle-" + d.id;
            }
        })
        .attr("r", function (d) {
            if (d.data.male !== 0) {
                return d.data.male / d.r * 4;
            }
        })
        .style("fill", function (d) {
            if (d.data.male !== 0) {
                return "lightblue";
            }
        })
        .style("opacity", 0.5)
        .style("stroke-width", 1)
        //.transform("translate", "translate(10, 0)")
        .append("svg:title")
        .text(function(d) {
            return (d.data.name + "\nMale (" + d.data.male + "), " + "Female (" + d.data.female + ")");
        })
        .on("click", function(d) {
            //console.log(d.data.name);
        });
}

function addLeafLabels(nodes) {
    const leaves = nodes.filter(function(d) {
        return !d.children;
    });

    leaves
        .attr("class", "leaf")
        .append("clipPath")
        .attr("id", function(d) {
            return "clip-" + d.id;
        })
        .append("use")
        .attr("xlink:href", function(d) {
            return "#circle-" + d.id + "";
        });
    /*
    leaves
        .append("text")
        .attr("clip-path", function (d) {
            return "url(#clip-" + d.id + ")";
        })
        .attr("dy", function (d) {
            return d.r / 3;
        })
        .text(function (d) {
            return d.data.name;
        })
        .style("font-size", function (d) {
            return `${(d.r - 1)}px`;
        });
*/
}

function addParentLabels(data, container) {
    const startAngle = Math.PI * 0.1; // was 0.1
    const labelArc = d3.arc()
        .innerRadius(function (d) {
            return (d.r - 5);
        })
        .outerRadius(function (d) {
            return (d.r + 10); // was 10
        })
        .startAngle(startAngle + 17) // +17
        .endAngle(function (d) {
            const total = d.data.name.length;
            const step = charSize / d.r;
            return startAngle + (total * step); // added +10
        });

    const groupLabels = container
        .selectAll(".group")
        .data(data.filter(function (d) {
            return !!d.children;
        })).enter()
        .append("g")
        .attr("class", "group")
        .attr("transform", function (d) {
            return `translate(${d.x},${d.y})`;
        });
    groupLabels
        .append("path")
        .attr("class", "group-arc")
        .attr("id", function (d, i) {
            return `arc${i}`;
        })
        .attr("d", labelArc);
    groupLabels
        .append("text")
        .attr("class", "group-label")
        .attr("x", 5)
        .attr("dy", 7)
        .append("textPath")
        .attr("xlink:href", function (d, i) {
            return `#arc${i}`;
        })
        .text(function (d) {
            return d.data.name;
        });
}

function onClickParent(nodes) {
    console.log("parent click #", parentCounter);
    if (parentCounter % 2 === 0){ // first click
        renderParentCircles(nodes);
    }
    else { // second click - restore only faculties
        renderChildCircles(nodes);
    }
}

function onClickChild(nodes) {
    console.log("child click #", childCounter);
    if (childCounter % 2 === 0){ // second click - want to remove baby circles
        console.log("removing departments");
        renderParentCircles(nodes);
        renderChildCircles(nodes);
    }
    else { // first click - show department data
        console.log("drawing departments");
        renderBabyCircles(nodes);
    }
}

function onClickBaby(nodes) {
    console.log("baby click #", babyCounter);
    if (babyCounter % 2 === 0){ // second click - want to remove baby circles
        console.log("removing gender circles");
        renderParentCircles(nodes);
        renderChildCircles(nodes);
        renderBabyCircles(nodes);
    }
    else { // first click - show department data
        console.log("drawing gender circles");
        renderFemaleCircles(nodes);
        renderMaleCircles(nodes);
    }
}

