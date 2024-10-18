import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import {addDragBehavior} from "../utils/dragBehavior";

const BubbleChart = ({ data }) => {
    const svgRef = useRef();
    const [hoverInfo, setHoverInfo] = useState(null); // For storing the hover details

    const width = 1000;  // Define width here
    const height = 800;  // Define height here

    useEffect(() => {
        if (!data || data.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous SVG content

        const bubble = d3.pack()
            .size([width, height])
            .padding(1.5);

        const root = d3.hierarchy({ children: data })
            .sum(d => d.value);  // Use the "value" field to determine bubble size

        const nodes = bubble(root).leaves();

        const node = svg.selectAll('g')
            .data(nodes)
            .enter().append('g')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .style('cursor', 'pointer');  // Makes bubbles look clickable

        // Add bubbles
        node.append('circle')
            .attr('r', d => d.r)
            .attr('fill', 'lightblue')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .attr('fill', '#ff6347') // Change color on hover
                    .attr('stroke-width', 2); // Increase border thickness

                // Update the hover info with more details
                setHoverInfo({
                    label: d.data.label, // Gene ID or label
                    value: d.data.value, // Expression value or size
                });
            })
            .on('mouseout', function () {
                d3.select(this)
                    .attr('fill', 'lightblue') // Revert color on mouseout
                    .attr('stroke-width', 1);  // Revert stroke width
                setHoverInfo(null);  // Clear hover info when mouse leaves
            })
            .on('click', function (event, d) {
                alert(`Clicked on ${d.data.label} with value: ${d.data.value}`);
            });

        // Add labels
        node.append('text')
            .attr('dy', '0.3em')
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .text(d => d.data.label);  // Display the "label" field (e.g., data type)

        // Apply drag behavior
        addDragBehavior(node);  // Call the drag behavior function

    }, [data, width, height]);

    return (
        <div>
            <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Hover Info Display */}
                {hoverInfo && (
                    <text
                        x={1000 - 10}  // Use a hard-coded value for width instead of variable to avoid scope issue
                        y={30}  // Adjust Y position
                        textAnchor="end"  // Align text to the right
                        fontSize="14"
                        fill="black"
                    >
                        {`Gene: ${hoverInfo.label}, Value: ${hoverInfo.value}`}
                    </text>
                )}
            </svg>

            {/* You can add more detailed explanations outside the SVG */}
            {hoverInfo && (
                <div style={{ textAlign: 'left', marginTop: '10px' }}>
                    <h4>Gene Information</h4>
                    <p><strong>Gene:</strong> {hoverInfo.label}</p>
                    <p><strong>Expression Value:</strong> {hoverInfo.value}</p>
                </div>
            )}
        </div>
    );
};

export default BubbleChart;
