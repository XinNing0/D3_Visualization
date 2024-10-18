import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TimeSeriesChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define the x and y scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.days)])  // Based on days_to_last_follow_up
            .range([0, width]);

        // Instead of unique IDs, we use an index for the Y-axis
        const yScale = d3.scaleLinear()
            .domain([0, data.length])  // Number of data points
            .range([0, height]);

        // Define the axes
        const xAxis = d3.axisBottom(xScale).ticks(10);
        const yAxis = d3.axisLeft(yScale).ticks(10);

        // Append the x-axis
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        // Append the y-axis
        svg.append("g")
            .call(yAxis);

        // Add circles for each data point (scatter plot)
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.days))
            .attr("cy", (d, i) => yScale(i))  // Use index instead of patient IDs
            .attr("r", 5)
            .attr("fill", "blue")
            .on("mouseover", (event, d) => {
                // Show tooltip with demographic info
                svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xScale(d.days) + 10)
                    .attr("y", yScale(data.indexOf(d)))
                    .text(`Gender: ${d.gender}, Days: ${d.days}`);
            })
            .on("mouseout", () => svg.select("#tooltip").remove());

    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default TimeSeriesChart;
