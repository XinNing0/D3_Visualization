import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AgeHistogram = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data) {
            const ages = data.map(d => d.diagnoses[0].age_at_diagnosis / 365.25); // Convert from days to years

            const margin = { top: 20, right: 30, bottom: 40, left: 40 };
            const width = 400 - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;

            const svg = d3.select(svgRef.current)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear()
                .domain([0, d3.max(ages)])
                .range([0, width]);

            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x));

            const histogram = d3.histogram()
                .value(d => d)
                .domain(x.domain())
                .thresholds(x.ticks(10));

            const bins = histogram(ages);

            const y = d3.scaleLinear()
                .domain([0, d3.max(bins, d => d.length)])
                .range([height, 0]);

            svg.append('g')
                .call(d3.axisLeft(y));

            svg.selectAll('rect')
                .data(bins)
                .enter()
                .append('rect')
                .attr('x', 1)
                .attr('transform', d => `translate(${x(d.x0)},${y(d.length)})`)
                .attr('width', d => x(d.x1) - x(d.x0) - 1)
                .attr('height', d => height - y(d.length))
                .attr('fill', '#69b3a2');
        }
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default AgeHistogram;
