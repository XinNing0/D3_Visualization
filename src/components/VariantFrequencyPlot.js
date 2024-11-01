// src/components/VariantFrequencyPlot/VariantFrequencyPlot.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
//import './VariantFrequencyPlot.css';

const VariantFrequencyPlot = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.variantType))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.frequency)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.variantType))
            .attr("y", d => yScale(d.frequency))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(d.frequency))
            .attr("fill", "teal");

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
        <div className="variant-frequency-plot">
            <h2>Variant Frequency Plot</h2>
            <svg ref={svgRef} width={800} height={400}></svg>
        </div>
    );
};

export default VariantFrequencyPlot;
