import * as d3 from "d3";


function update_datapoints(circle_svg, new_data) {

    // DAMN: https://groups.google.com/g/d3-js/c/fSgG9HE8kgE?pli=1

    // Create the scale mapping the number of videos uploaded to the length of the spike
    let circle_radius = d3.scaleSqrt().domain([0, 2000]).range([0, 100]);

    // Formatting method for the text
    let format = d3.format(",.0f")

    var circles = circle_svg
        .selectAll("circle")
        .data(new_data
            .filter(d => d.coord)
            .sort((a, b) => d3.ascending(a.coord[1], b.coord[1])
                        || d3.ascending(a.coord[0], b.coord[0])),
            d => d.id); // This last line is to not move points that are staying

    // Add new circles
    circles
        .enter()
        .append("circle")
        .attr("fill", "red")
        .attr("fill-opacity", 0.3)
        .attr("stroke", "red")
        .attr("transform", d => `translate(${d.coord})`)
        .transition()
        .duration(2000)
        .attr("r", d => circle_radius(d.videos));

    // Remove old circles
    circles
        .exit()
        .transition()
        .duration(2000)
        .attr("r", 0)
        .remove(); 

    // Update other circles
    circles
        .transition()
        .duration(2000)
        .attr("r", d => circle_radius(d.videos))
        .attr("transform", d => `translate(${d.coord})`);

    // Update titles for circles
    circle_svg
        .selectAll("circle")
        .join("circle")
        .append("title")
        .text(d => `${d.name}
                    ${format(d.videos)}`);

    // Update titles for circles
    circle_svg
        .selectAll("circle")
        .select("title")
        .text(d => `${d.name}
                    ${format(d.videos)}`);

                    

}

function update_datapoints_old(circle_svg, new_data) {

    // Create the scale mapping the number of videos uploaded to the length of the spike
    let circle_radius = d3.scaleSqrt().domain([0, 2000]).range([0, 100]);

    // Formatting method for the text
    let format = d3.format(",.0f")

    //update all circles to new positions
 
    var circles = circle_svg
        .selectAll("circle")
        .data(new_data
            .filter(d => d.coord)
            .sort((a, b) => d3.ascending(a.coord[1], b.coord[1])
                        || d3.ascending(a.coord[0], b.coord[0])));

    
    circles.exit()
        .transition()
        .duration(2000)
        .attr("r", 0)
        .remove();                 
    circles.enter()
        .append("circle")
        .attr("r", 0)
        .attr("transform", d => `translate(${d.coord})`);
    
    circles
        .attr("fill", "blue")
        .attr("fill-opacity", 0.3)
        .attr("stroke", "blue");
  
    circles
        .transition()
        .duration(2000)
        .attr("transform", d => `translate(${d.coord})`)
        .attr("r", d => circle_radius(d.videos));

    circles
        .select("title")
        .text(d => `${d.name}
                    ${format(d.videos)}`)
}

export default update_datapoints;
