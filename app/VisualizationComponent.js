import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import CardComponent from './CardComponent';

export default class VisualizationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [
                {id:"0", name : "0", age:12},
                {id:"1", name : "1", age:12},
                {id:"2", name : "2", age:12},
                {id:"3", name : "3", age:12},
                {id:"4", name : "4", age:12},
                {id:"5", name : "5", age:12},
                {id:"6", name : "6", age:12},
                {id:"7", name : "7", age:12}
            ],
            edges : [
                {source:"0", target:"1"},
                {source:"0", target:"2"},
                {source:"0", target:"3"},
                {source:"1", target:"4"},
                {source:"2", target:"5"},
                {source:"3", target:"6"}
            ]
        };

    }

    componentDidMount()
    {
        alert(el);
        var el = ReactDOM.findDOMNode(this);
        alert(el);
        // asd.map(function(v,k) { 
        //          alert(v);
        //      });
        var svg = d3.select("#visualization")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "99%");

            var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(300, 300));
                // .alphaDecay(0);
               // alert(simulation);
    
                function dragstarted(d) {
                    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }
    
                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }
    
                function dragended(d) {
                    if (!d3.event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }
    
                var link = svg.append("g")
                .selectAll("line")
                .data(this.state.edges)
                .enter().append("line")
                .attr("class", "links");
                //.attr("stroke-width", function(d) { return Math.sqrt(d.value); });

            var node = svg//.append("g")
                .selectAll("g")
                .data(this.state.nodes)
                .enter()
                .append("g")
                .on("click", function(d){
                    var vis = [122,2];
                    var v = d3.select("#visualization");
                    v.datum(vis);
                    alert(el);
                })
                .attr("class", "nodes")
                .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));
                        
          
            node.append("circle")
                .attr("r", 1);
               // .attr("fill", function(d) { return color(d.group); });
    
                        
            node.append("text")
                .attr("dy", "-0.050000000000000044em")
                .attr("text-anchor", "middle")
                .text(function(d) { 
                    return d.name; });

            function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
            
                node
                    .attr("transform", function(d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                });
            }
                          
            simulation
                .nodes(this.state.nodes)
                .on("tick", ticked);
                
            simulation
                .force("link")
                .links(this.state.edges);
    }


    render() {
        // var elements=[];

        // this.infoList.map(function(v,k) { 
        //     elements.push(<h1>hello</h1>);
        // });
        var Elements = document.getElementById("visualization");
        alert(Elements);
        return (
            <div id="visualization">
            </div>
        )
    }
}