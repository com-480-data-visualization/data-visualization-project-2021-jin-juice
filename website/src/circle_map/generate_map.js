import * as d3 from "d3";
import * as topojson from "topojson-client";


function generate_map(map, pointsGroup, w,  path, geodata) {
    // Create the scale mapping the number of videos uploaded to the length of the spike
    let circle_radius = d3.scaleSqrt().domain([0, 2000]).range([0, 100]);
    map.selectAll("*").remove();
    // Formatting method for the text
    let format = d3.format(",.0f")

    // Color used to fill the map and write the legend text
    let map_fill_color = "#5470cc"

    // Legend data has values [0, 5, 10, 15, 20, ..., 2000]
    // I take values, 10, 25, 50, 100
    const radius_ticks = circle_radius.ticks(400)
    const legend_data = radius_ticks
        .slice(1, 2)
        .concat(radius_ticks.slice(5, 6))
        .concat(radius_ticks.slice(10, 11))
        .concat(radius_ticks.slice(20, 21)).reverse()

    // Create the legend
    const legend = map.append("g")
        .attr("fill", map_fill_color)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g")
        .data(legend_data)
        .join("g")
        .attr("transform", (d, i) => `translate(${1100 - (i + 1) * 60}, 590)`);

    // Add the circles above the legend
    legend.append("circle")
        .attr("fill", "red")
        .attr("fill-opacity", 0.3)
        .attr("stroke", "red")
        .attr("transform", (d, i) => `translate(0, -50)`)
        .attr("r", d => circle_radius(d));

    // Add the text below the legend
    legend.append("text")
        .attr("dy", "1.3em")
        .style('fill', 'white')
        .text(circle_radius.tickFormat(4));

    // Add a background color
    map.append("g")
        .selectAll("path")
        .data(topojson.feature(geodata, geodata.objects.nation).features)
        .enter().append("path")
            .attr("fill", map_fill_color)
            .attr("d", path)

    // Add the state outlines
    map.append("path")
        .datum(topojson.mesh(geodata, geodata.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "#08184B")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

        var mapNode = map.node();
        var x =  mapNode.getBoundingClientRect().width
        map.attr("transform", `translate(${(w-x)/2},0)`)
        pointsGroup.attr("transform", `translate(${(w-x)/2},0)`)
}

export default generate_map;
