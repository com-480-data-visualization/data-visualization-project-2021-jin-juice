import classnames from "classnames";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { useEffect, useRef } from "react";
import useResizable from "../hooks/useResizable";

const ChoroplethCountyMap = ({ className, geodata, loc }) => {
  const svgRef = useRef();
  const rootRef = useRef();
  const dimmensions = useResizable(rootRef);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!dimmensions || !geodata || !loc) return;
    const w = dimmensions.width;
    const h = dimmensions.height;

    //Define path generator
    var path = d3.geoPath();

    function ready(error, geodata, countyData) {
      // Create the viewbox
      svg.attr("viewBox", [0, 0, w, h ]);

      // Load and parse the data
      var data = countyData.video_counts;
      var counts = new Map(
        data.map((obj) => [obj.fips.toString().padStart(5, "0"), obj.count])
      );

      // Create the color scale
      var color = d3.scaleSequentialLog([1, 1500], d3.interpolateReds);

      // Create the map and add the data to it
      svg
        .append("g")
        .selectAll("path")
        .data(topojson.feature(geodata, geodata.objects.counties).features)
        .join("path")
        .attr("fill", (d) => color(counts.has(d.id) ? counts.get(d.id) : 0))
        .attr("stroke", (d) => color(counts.has(d.id) ? counts.get(d.id) : 0))
        .attr("stroke-linejoin", "round")
        .attr("d", path)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000").raise(); })
        .on("mouseout", function() { d3.select(this).attr("stroke", (d) => color(counts.has(d.id) ? counts.get(d.id) : 0)).lower(); })
        .append("title")
        .text(
          (d) =>
            `${d.properties.name}: ${
              counts.has(d.id) ? counts.get(d.id) : 0
            } videos`
        );

      // Add the outlines for the state
      svg
        .append("path")
        .datum(
          topojson.mesh(geodata, geodata.objects.states, (a, b) => a !== b)
        )
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("d", path);

      var map = svg.select('g').node();
      var x =  map.getBoundingClientRect().width
      svg.selectAll('path').attr("transform", `translate(${(w-x)/2},0)`)

    }
    ready(null, geodata, loc);
  }, [dimmensions, geodata, loc]);

  return (
    <div className={classnames(className, "h-screen-4/5 w-full")} ref={rootRef}>
      <svg className={classnames("")} ref={svgRef}></svg>
    </div>
  );
};

export default ChoroplethCountyMap;
