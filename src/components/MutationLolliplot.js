import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
//import './MutationLolliplot.css';

const MutationLolliplot = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 800;
        const height = 200;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.location)])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.impact)])
            .range([height - margin.bottom, margin.top]);

        // Create "lollipops"
        svg.selectAll("line")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", d => xScale(d.location))
            .attr("x2", d => xScale(d.location))
            .attr("y1", height - margin.bottom)
            .attr("y2", d => yScale(d.impact))
            .attr("stroke", "gray");

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.location))
            .attr("cy", d => yScale(d.impact))
            .attr("r", d => d.impact * 0.5)
            .attr("fill", "steelblue");

        // X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        // Y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

    }, [data]);

    return (
        <div className="mutation-lolliplot">
            <h2>Mutation Lolliplot</h2>
            <svg ref={svgRef} width={800} height={200}></svg>
        </div>
    );
};

export default MutationLolliplot;
