import classnames from "classnames";
import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import useResizable from "../hooks/useResizable";
import {kFormatter} from '../helpers'

const SentimentTimeSeries = ({ data = [], margin = {} }) => {
  const svgRef = useRef();
  const rootRef = useRef();
  const [prevItems, setPrevItems] = useState([]);
  const dimmensions = useResizable(rootRef);

  useEffect(() => {

    if (!dimmensions || data.length == 0 || !data) return;
    const width = dimmensions.width;
    const height = dimmensions.height;

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data[0].items, (d) => d.date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data[0].items, (d) => d.value),
        d3.max(data[0].items, (d) => d.value),
      ])
      .range([height, 0]);

    // Create root container where we will append all other chart elements.
    const svgEl = d3.select(svgRef.current);
    svgEl.attr("viewBox", [0, 0, width+margin.left+margin.right, height+margin.top+margin.bottom]);
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements.
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X grid lines with labels
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d3.timeFormat("%b %y"))
      .tickSize(-height + margin.bottom);

    const xAxisGroup = svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
    xAxisGroup.select(".domain").remove();
    xAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
    xAxisGroup
      .selectAll("text")
      .attr("color", "white")
      .attr("font-size", "0.75rem")
      .attr("font-weight", "bold")
      .attr("y", 15);

    // Add Y grid lines with labels.
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-width)
      .tickFormat((val) => `${kFormatter(val)}`);

    const yAxisGroup = svg.append("g").call(yAxis);
    yAxisGroup.select(".domain").remove();
    yAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
    yAxisGroup
      .selectAll("text")
      .attr("color", "white")
      .attr("font-size", "0.75rem")
      .attr("font-weight", "bold");

    // Draw the lines.
    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value));

    const lines = svg
      .selectAll(".line")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 3)
      .attr("d", (d) => line(d.items))
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "orange");
      })
      .on("mouseout", function (d) {
        d3.select(this).attr("stroke", (d) => d.color);
      })
      .datum(function (d) {
        return d;
      })
      .text(function (d) {
        return d.value;
      });

    // Use stroke-dashoffset for transition.
    lines
      .each((d, i, nodes) => {
        const element = nodes[i];
        const length = element.getTotalLength();
        if (!prevItems.includes(d.name)) {
          d3.select(element)
            .attr("stroke-dasharray", `${length},${length}`)
            .attr("stroke-dashoffset", length)
            .transition()
            .duration(750)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
        }
      })
      .append("title")
      .text(function (d) {
        return d.name;
      });

    setPrevItems(data.map(({ name }) => name));
  }, [data, dimmensions]);

  return (
  <div className="h-screen-50 w-full pb-10" ref={rootRef}>
      <svg ref={svgRef}/>
  </div>)
};

export default SentimentTimeSeries;
