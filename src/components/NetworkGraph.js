import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

const NetworkGraph = () => {
    const svgRef = useRef();

    // Memoize the nodes and links to avoid reinitialization
    const nodes = useMemo(() => [
        { id: 'Protein1' }, { id: 'Protein2' }, { id: 'Protein3' },
        { id: 'Protein4' }, { id: 'Protein5' }
    ], []);

    const links = useMemo(() => [
        { source: 'Protein1', target: 'Protein2' },
        { source: 'Protein1', target: 'Protein3' },
        { source: 'Protein2', target: 'Protein4' },
        { source: 'Protein3', target: 'Protein5' }
    ], []);

    useEffect(() => {
        const width = 600;
        const height = 400;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .style("stroke", "#aaa");

        const node = svg.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("fill", "steelblue");

        const label = svg.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .text(d => d.id)
            .attr("x", 15)
            .attr("y", 5);

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            label
                .attr("x", d => d.x + 10)
                .attr("y", d => d.y);
        });
    }, [nodes, links]);

    return (
        <div>
            <h2>Protein Interaction Network</h2>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default NetworkGraph;
