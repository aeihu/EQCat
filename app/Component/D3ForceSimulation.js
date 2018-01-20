import * as d3 from 'd3';

export const D3ForceSimulation = {};

D3ForceSimulation.simulation = null;
D3ForceSimulation.svg = null;
D3ForceSimulation.x = 0;
D3ForceSimulation.y = 0;
D3ForceSimulation.tx = 1920;
D3ForceSimulation.ty = 1080;

D3ForceSimulation.create = function(el, props, state) {
    this.svg = d3.select("#visualization")
        .append("svg")
        .attr("width", props.width)
        .attr("height", props.height)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .call(d3.drag()
                .on("start", function (){
                    console.log('dragstarted');
                    D3ForceSimulation.tx = d3.event.x;
                    D3ForceSimulation.ty = d3.event.y;
                })
                .on("drag", function (){
                    console.log('dragged');
                    D3ForceSimulation.svg.attr("transform", 
                        'translate(' + (D3ForceSimulation.x - (D3ForceSimulation.tx - d3.event.x)) + ',' 
                        + (D3ForceSimulation.y - (D3ForceSimulation.ty - d3.event.y)) + ')')
                })
                .on("end", function (){
                    D3ForceSimulation.x = D3ForceSimulation.x - (D3ForceSimulation.tx - d3.event.x);
                    D3ForceSimulation.y = D3ForceSimulation.y - (D3ForceSimulation.ty - d3.event.y);
                }))
        .append("g");
        // .style("position", "absolute")
        // .style("z-index", 0);

    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(0.5))
        .force("charge", d3.forceManyBody().strength(-5200))
        // /.force("collide", d3.forceCollide().strength())
        .force("center", d3.forceCenter(300, 300));

    //this.update(el, props, state);
};

D3ForceSimulation.dragstarted = function dragstarted(d) {
    if (!d3.event.active) {
        D3ForceSimulation.simulation.alphaTarget(0.3).restart();
    }

    d.fx = d.x;
    d.fy = d.y;
}

D3ForceSimulation.dragged = function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

D3ForceSimulation.dragended = function dragended(d) {
    if (!d3.event.active) {
        D3ForceSimulation.simulation.alphaTarget(0);
    }

    d.fx = null;
    d.fy = null;
}

D3ForceSimulation.update = function(el, props, state) {
    // Re-compute the scales, and render the data points
    // var scales = this._scales(el, state.domain);
    this._drawNodesAndEdges(el, props, state);
};

D3ForceSimulation._drawNodesAndEdges = function(el, props, state){
    let __data = props.data
    console.log('/////////////////////////');
    console.log(__data);

    let __updataForLink = this.svg
        .selectAll("line")
        .data(__data.edges)
    
    let __link = __updataForLink
        .enter()
        .append("line")
        .attr("class", "links");

    __updataForLink.exit().remove();

    let __updataForNode = this.svg
        .selectAll(".nodes")
        .data(__data.nodes)
        
    let __node = __updataForNode
        .enter()
        .append("g")
        .on("click", function(d){
            state.showCard(d);
        })
        .attr("class", "nodes")
        .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));
        
    __updataForNode.exit().remove();
 
    __node.append("image")
        .attr("xlink:href", "https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png")
        .attr("style", "opacity:0.9")
        .attr("height", "100")
        .attr("width", "100");

    __node.append("circle")
        .attr("r", 1)
        //.attr("transform", "translate(-50 -50)");
            
    __node.append("text")
        .attr("dy", "-0.050000000000000044em")
        .attr("text-anchor", "middle")
        .text(function(d) { 
            return d.properties.name; });

    __node = __node.merge(__updataForNode);   
    __link = __link.merge(__updataForLink); 
    
    function ticked() {
        __link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        __node
            .attr("transform", function(d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });
    }
    
    this.simulation
        .nodes(__data.nodes)
        .on("tick", ticked);
        
    this.simulation
        .force("link")
        .links(__data.edges);

    this.simulation.restart();
}

  
  D3ForceSimulation.destroy = function(el) {
    // Any clean-up would go here
    // in this example there is nothing to do
  };
