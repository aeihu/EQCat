import React from 'react';
import * as d3 from 'd3';

export default class VisualizationComponent extends React.Component {
    constructor(props) {
        super(props);
        // alert(d3);

    }

    componentDidMount()
    {
        var svg = d3.select("#visualization")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

             alert('111');
            var nodes = [
                {name : "0", age:12},
                {name : "1", age:12},
                {name : "2", age:12},
                {name : "3", age:12},
                {name : "4", age:12},
                {name : "5", age:12},
                {name : "6", age:12},
                {name : "7", age:12}
            ];
    
            var edges = [
                {source:0, target:1},
                {source:0, target:2},
                {source:0, target:3},
                {source:1, target:4},
                {source:2, target:5},
                {source:3, target:6}
            ];
    
            //var simulation = d3.forceSimulation(nodes);
    
            // var simulation = d3.forceSimulation()
            //     .force("link", d3.forceLink().id(function(d) { return d.id; }))
            //     .force("charge", d3.forceManyBody())
            //     .force("center", d3.forceCenter(width / 2, height / 2));
    
            //     function dragstarted(d) {
            //         if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            //         d.fx = d.x;
            //         d.fy = d.y;
            //     }
    
            //     function dragged(d) {
            //         d.fx = d3.event.x;
            //         d.fy = d3.event.y;
            //     }
    
            //     function dragended(d) {
            //         if (!d3.event.active) simulation.alphaTarget(0);
            //         d.fx = null;
            //         d.fy = null;
            //     }
    
            
            // var node = svg//.append("g")
            //     .selectAll("g")
            //     .data(nodes)
            //     .enter()
            //     .append("g")
            //     .attr("class", "nodes")
            //     .call(d3.drag()
            //             .on("start", dragstarted)
            //             .on("drag", dragged)
            //             .on("end", dragended));
                        
          
            // node.append("circle")
            //     .attr("r", 5);
            //     //.attr("fill", function(d) { return color(d.group); });
    
                        
            // node.append("text")
            //     .attr("dy", "-0.050000000000000044em")
            //     .attr("text-anchor", "middle")
            //     .text(function(d) { 
            //         return d.name; });
    }


    render() {
        return (
            <h1>asd</h1>
        )
    }
}