import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const GenderPieChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data) {
            const genderCount = d3.rollup(
                data.map(d => d.demographic.gender),
                v => v.length,
                d => d
            );

            const width = 300;
            const height = 300;
            const radius = Math.min(width, height) / 2;

            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);

            const color = d3.scaleOrdinal()
                .domain([...genderCount.keys()])
                .range(d3.schemeSet2);

            const pie = d3.pie()
                .value(d => d[1]);

            const dataReady = pie([...genderCount.entries()]);

            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            svg.selectAll('path')
                .data(dataReady)
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', d => color(d.data[0]));

            svg.selectAll('text')
                .data(dataReady)
                .enter()
                .append('text')
                .text(d => `${d.data[0]} (${d.data[1]})`)
                .attr('transform', d => `translate(${arc.centroid(d)})`)
                .style('text-anchor', 'middle')
                .style('font-size', 12);
        }
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default GenderPieChart;
