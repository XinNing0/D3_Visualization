import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';

const TreeDiagram = () => {
    const svgRef = useRef();

    const data = useMemo(() => ({
        name: "Root",
        children: [
            {
                name: "Species1",
                children: [
                    { name: "Species1.1" },
                    { name: "Species1.2" }
                ]
            },
            {
                name: "Species2",
                children: [
                    { name: "Species2.1" },
                    { name: "Species2.2" }
                ]
            }
        ]
    }), []);

    useEffect(() => {
        const margin = { top: 20, right: 120, bottom: 20, left: 120 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const treeLayout = d3.tree().size([height, width]);
        const root = d3.hierarchy(data);

        treeLayout(root);

        svg.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", d => `
        M${d.y},${d.x}
        C${(d.parent.y + d.y) / 2},${d.x}
         ${(d.parent.y + d.y) / 2},${d.parent.x}
         ${d.parent.y},${d.parent.x}
      `)
            .style("fill", "none")
            .style("stroke", "#ccc");

        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.y},${d.x})`);

        node.append("circle")
            .attr("r", 5)
            .style("fill", "#fff")
            .style("stroke", "steelblue");

        node.append("text")
            .attr("dy", 3)
            .attr("x", d => d.children ? -8 : 8)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.name);
    }, [data]);

    return (
        <div>
            <h2>Phylogenetic Tree</h2>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default TreeDiagram;
