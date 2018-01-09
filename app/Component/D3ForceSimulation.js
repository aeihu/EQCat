import * as d3 from 'd3';

export const D3ForceSimulation = {};

D3ForceSimulation.simulation = null;
D3ForceSimulation.svg = null;

D3ForceSimulation.create = function(el, props, state) {
    this.svg = d3.select("#visualization")
        .append("svg")
        .attr("width", props.width)
        .attr("height", props.height)
        // .style("position", "absolute")
        // .style("z-index", 0);

    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(300, 300));

    this.update(el, props, state);
};

D3ForceSimulation.dragstarted = function dragstarted(d) {
    if (!d3.event.active) 
        this.simulation.alphaTarget(0.3).restart();

    d.fx = d.x;
    d.fy = d.y;
}.bind(this)

D3ForceSimulation.dragged = function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}.bind(this)

D3ForceSimulation.dragended = function dragended(d) {
    if (!d3.event.active) 
        this.simulation.alphaTarget(0);

    d.fx = null;
    d.fy = null;
}.bind(this)

D3ForceSimulation.update = function(el, props, state) {
    // Re-compute the scales, and render the data points
    // var scales = this._scales(el, state.domain);
    this._drawNodesAndEdges(el, props, state);
  };

D3ForceSimulation._drawNodesAndEdges = function(el, props, state){
    let __data = props.data
    let link = this.svg.append("g")
        .selectAll("line")
        .data(__data.edges)
        .enter().append("line")
        .attr("class", "links");

    let node = this.svg//.append("g")
        .selectAll("g")
        .data(__data.nodes)
        .enter()
        .append("g")
        // .on("click", function(d){
        //     //state.showCard(d);
        //     console.log('dsadsa');
        // })
        .attr("class", "nodes")
        .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));
            

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
              
    this.simulation
        .nodes(__data.nodes)
        .on("tick", ticked);
        
    this.simulation
        .force("link")
        .links(__data.edges);

// var svg = d3.select(el).append('svg')
//     .attr('class', 'd3')
//     .attr('width', props.width)
//     .attr('height', props.height);

// svg.append('g')
//     .attr('class', 'd3-points');
}

  
  D3ForceSimulation.destroy = function(el) {
    // Any clean-up would go here
    // in this example there is nothing to do
  };
