import * as d3 from 'd3';

export const D3ForceSimulation = {};

D3ForceSimulation.simulation = null;
D3ForceSimulation.svg = null;
D3ForceSimulation.x = 0;
D3ForceSimulation.y = 0;
D3ForceSimulation.tx = 1920;
D3ForceSimulation.ty = 1080;
D3ForceSimulation.showedImage = false;

D3ForceSimulation.create = function(el, props, state) {
    this.svg = d3.select("#displayContent")
        .append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
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

D3ForceSimulation.setStyle = function(el, props, state, styles, detail) {
    switch (state.barOfNE.mode){
        case 1:
            //let __node = this.svg.selectAll(".node_"+state.barOfNE.name);
            let __node = this.svg.selectAll(".nodes")
                .filter(function(d, i){
                    for (let i=0; i<d.labels.length; i++){
                        if (d.labels[i] == state.barOfNE.name)
                            return true;
                    }    
                    return false;
                });
            
            if (!__node.empty()){
                switch (detail){
                    case 'caption':
                        __node.select('text')
                            .text((d) => this._setNodeText(d, styles));
                        break;
                    case 'size':
                        __node.select('.node_icon')
                            .attr("transform", (d) => this._setNodeOffset(d, styles))
                            .attr("height", (d) => this._setNodeSize(d, styles))
                            .attr("width", (d) => this._setNodeSize(d, styles));
                        
                        __node.select('text')
                            .attr("dy", (d) => this._setNodeTextOffset(d, styles));
                        break;
                }
            }
            break;
        case 2:
            break;
    }
}

D3ForceSimulation.update = function(el, props, state, styles) {
    // Re-compute the scales, and render the data points
    // var scales = this._scales(el, state.domain);
    this._drawNodesAndEdges(el, props, state, styles);
};

D3ForceSimulation._setNodeText = function(d, styles) { 
    if (d.labels.length > 0){
        if (styles.nodes[d.labels[0]].caption != '<id>'){
            return d.properties.hasOwnProperty(styles.nodes[d.labels[0]].caption) ? 
                d.properties[styles.nodes[d.labels[0]].caption]
                : '';
        }
    }

    return d.id; 
}

D3ForceSimulation._setNodeOffset = function(d, styles) { 
    if (d.labels.length > 0){
        let __offset = -styles.nodes[d.labels[0]].size / 2;
        return 'translate(' + __offset  + ',' + __offset + ')';
    }

    return -17.5;
}

D3ForceSimulation._setNodeSize = function(d, styles) { 
    return d.labels.length > 0 ? styles.nodes[d.labels[0]].size : 35;
}

D3ForceSimulation._setNodeTextOffset = function(d, styles) { 
    if (d.labels.length > 0){
        return styles.nodes[d.labels[0]].size / 2 + 10;
    }

    return -27.5;
}

D3ForceSimulation._drawNodesAndEdges = function(el, props, state, styles){
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
        .attr("class", 'nodes')
        // .attr("class", 
        //     function(d){
        //         let __result = 'nodes ';
        //         for (let i=0; i<d.labels.length; i++){
        //             __result += 'node_'+ d.labels[i] + ' ';
        //         }

        //         return __result;
        //     }
        // )
        .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));
        
    __updataForNode.exit().remove();
 
    __node.append("image")
        .attr("id", function(d){return 'node_image_id_' + d.id})
        .attr("class", 'node_icon')
        .attr("enabled", true)
        .attr("xlink:href", 
            function(d){ 
                if (d.labels.length > 1){
                    let __d = D3ForceSimulation.svg.select('#node_image_id_' + d.id);
                    setInterval(
                        ()=>{
                            __d.attr("xlink:href", function(data){
                                let __index = Math.floor((new Date()).valueOf() / 1000) % data.labels.length;
                                return styles.nodes[data.labels[__index]].image;
                            })
                        }
                    ,1000);
                }

                return d.labels.length > 0 ? styles.nodes[d.labels[0]].image : ''; /////////////////////////////////////////
            }
        )
        .attr("transform", (d) => this._setNodeOffset(d, styles))
        .attr("height", (d) => this._setNodeSize(d, styles))
        .attr("width", (d) => this._setNodeSize(d, styles));
            
    __node.append("text")
        .attr("dy", (d) => this._setNodeTextOffset(d, styles))
        .attr("text-anchor", "middle")
        .text((d) => this._setNodeText(d, styles));

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

D3ForceSimulation.showOrHideImage = function(){
    D3ForceSimulation.showedImage = !D3ForceSimulation.showedImage;
    D3ForceSimulation.svg
        .selectAll("image")
        .attr("enabled", D3ForceSimulation.showedImage);
}

  
D3ForceSimulation.destroy = function(el) {
    // Any clean-up would go here
    // in this example there is nothing to do
};
