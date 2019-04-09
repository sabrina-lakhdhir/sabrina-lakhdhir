const width = 1500;
const height = 1140;
const margin = 20;

const charSize = 10;

var parentCounter = 0;
var childCounter = 0;
var babyCounter = 0;

/*
Remaining TODO:
- figure out how to pile gender circles so tooltips can be accessed on either
    - NOTE: female tooltips do not show when there are more males than females in a department
- buttons for multiple years of data - MAYBE
- zoom in on a faculty
 */

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
        addParentLabels(data, container);
        renderChildCircles(nodes);
    });


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
                } else if (d.data.name === "Cumming School of Medicine") {
                    return "Green";
                } else if (d.data.name === "Haskayne School of Business") {
                    return "RoyalBlue";
                } else if (d.data.name === "Kinesiology") {
                    return "YellowGreen";
                } else if (d.data.name === "Law") {
                    return "AntiqueWhite";
                } else if (d.data.name === "Nursing") {
                    return "RebeccaPurple";
                } else if (d.data.name === "Schulich School of Engineering") {
                    return "DarkOrange";
                } else if (d.data.name === "Science") {
                    return "Gold";
                } else if (d.data.name === "Social Work") {
                    return "DarkKhaki";
                } else if (d.data.name === "Veterinary Medicine") {
                    return "DarkGray";
                } else if (d.data.name === "Werklund School of Education") {
                    return "DeepSkyBlue";
                }
            }
        })
        .style("opacity", 1);
}

/*
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

    leaves
        .on("click", function(nodes) {
            console.log("Click");
            onClick(nodes);
        });

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



