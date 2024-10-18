import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Heatmap = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data) {
            // Prepare the data for the heatmap
            const heatmapData = data.map(d => ({
                age: d.diagnoses[0].age_at_diagnosis / 365.25, // Convert age to years
                survival: d.diagnoses[0].days_to_death || d.diagnoses[0].days_to_last_follow_up, // Survival in days
                status: d.diagnoses[0].vital_status // Vital status (Alive/Dead)
            }));

            // Filter out entries with null or undefined values for survival and age
            const filteredData = heatmapData.filter(d => d.age && d.survival);

            const margin = { top: 50, right: 30, bottom: 60, left: 80 };
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3.select(svgRef.current)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // BIN the survival time into 1-year bins (365.25 days per year)
            const xBinned = d3.bin()
                .domain([0, d3.max(filteredData, d => d.survival)])
                .thresholds(d3.range(0, d3.max(filteredData, d => d.survival), 365.25)) // 1-year bins
                (filteredData.map(d => d.survival));

            // BIN the age into 5-year bins
            const yBinned = d3.bin()
                .domain([0, d3.max(filteredData, d => d.age)])
                .thresholds(d3.range(0, d3.max(filteredData, d => d.age), 5)) // 5-year bins
                (filteredData.map(d => d.age));

            // Define the X and Y scales based on binned data
            const x = d3.scaleBand()
                .range([0, width])
                .domain(xBinned.map((d, i) => i)) // Indexes for binned survival
                .padding(0.05);

            const y = d3.scaleBand()
                .range([height, 0])
                .domain(yBinned.map((d, i) => i)) // Indexes for binned age
                .padding(0.05);

            // Define the color scale (map survival times to colors)
            const colorScale = d3.scaleSequential()
                .interpolator(d3.interpolateBlues)
                .domain([0, d3.max(filteredData, d => d.survival)]);

            // Clear previous SVG content before re-rendering
            svg.selectAll('*').remove();

            // Add the X axis (binned survival)
            svg.append('g')
                .style('font-size', 12)
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickFormat((d, i) => `${Math.round(xBinned[i].x0 / 365.25)}-${Math.round(xBinned[i].x1 / 365.25)} yrs`)) // Use bin ranges for labels
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('transform', 'rotate(-45)');

            // Add the Y axis (binned age)
            svg.append('g')
                .style('font-size', 12)
                .call(d3.axisLeft(y).tickFormat((d, i) => `${Math.round(yBinned[i].x0)}-${Math.round(yBinned[i].x1)} yrs`)); // Use bin ranges for labels

            // Add the squares
            svg.selectAll()
                .data(filteredData, d => d.survival + ':' + d.age)
                .enter()
                .append('rect')
                .attr('x', d => x(Math.floor(d.survival / 365.25))) // Use binned survival index
                .attr('y', d => y(Math.floor(d.age / 5))) // Use binned age index
                .attr('width', x.bandwidth())
                .attr('height', y.bandwidth())
                .style('fill', d => colorScale(d.survival))
                .style('stroke', 'black')
                .on('mouseover', function (event, d) {
                    // Add tooltip on hover
                    d3.select(this).style('fill', '#ff6347'); // Highlight the hovered cell

                    // Create a tooltip group
                    const tooltipGroup = svg.append('g')
                        .attr('id', 'tooltip')
                        .attr('transform', `translate(${width - 200}, -30)`);

                    // Add Age text
                    tooltipGroup.append('text')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('fill', 'black')
                        .style('font-size', '10px')
                        .text(`Age: ${Math.round(d.age)} years`); // Clarify that age is in years

                    // Add Survival text on a new line with spacing
                    tooltipGroup.append('text')
                        .attr('x', 0)
                        .attr('y', 20) // Add more spacing to separate the lines
                        .attr('fill', 'black')
                        .style('font-size', '12px')
                        .text(`Survival: ${Math.round(d.survival / 365.25)} years`); // Clarify that survival is in years
                })
                .on('mouseout', function () {
                    // Remove tooltip when not hovering
                    d3.select(this).style('fill', d => colorScale(d.survival));
                    d3.select('#tooltip').remove();
                });

            // Add the title
            // svg.append('text')
            //     .attr('x', width / 2)
            //     .attr('y', -10)
            //     .attr('text-anchor', 'middle')
            //     .style('font-size', '15px')
            //     .text('Age at Diagnosis vs Survival Heatmap (Binned)');
        }
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default Heatmap;
