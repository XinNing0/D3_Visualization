import * as d3 from 'd3';

export const addDragBehavior = (node) => {
    node.call(
        d3.drag()
            .on('start', function (event, d) {
                d3.select(this).raise().attr('stroke', 'black');  // Highlight on drag start
            })
            .on('drag', function (event, d) {
                d.x = event.x;
                d.y = event.y;
                d3.select(this).attr('transform', `translate(${d.x},${d.y})`);  // Move the bubble
            })
            .on('end', function (event, d) {
                d3.select(this).attr('stroke', null);  // Remove highlight on drag end
            })
    );
};