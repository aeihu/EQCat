import * as d3 from 'd3';

export const D3ForceSimulation = {};

D3ForceSimulation.simulation = null;
D3ForceSimulation.svg = null;
D3ForceSimulation.x = 0;
D3ForceSimulation.y = 0;
D3ForceSimulation.tx = 1920;
D3ForceSimulation.ty = 1080;
D3ForceSimulation.showedImage = false;
D3ForceSimulation.NEStyles = {
    nodes: {
        //xx:{
        //  icon:'a.png',
        //  size:'50',
        //  caption:'name',
        //}
    },
    edges: {
        //xx:{
        //  color:'#000000',
        //}
    },
};

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
    
    this.svg.append("defs")
        .append('marker')
        .attr('id', "marker_arrow")
        .attr('markerWidth', 13)
        .attr('markerHeight',13)
        .attr('refX', 2)
        .attr('refY', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M2,2 L2,11 L10,6 L2,2')

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

function setIcon(d) { 
    if (d.labels.length > 0){
            return D3ForceSimulation.NEStyles.nodes[d.labels[0]].icon ;
    }

    return defaultIcon; 
    // if (d.labels.length > 1){
    //     let __d = D3ForceSimulation.svg.select('#node_image_id_' + d.id);
    //     setInterval(
    //         ()=>{
    //             __d.attr("xlink:href", function(data){
    //                 let __index = Math.floor((new Date()).valueOf() / 1000) % data.labels.length;
    //                 return styles.nodes[data.labels[__index]].icon;
    //             })
    //         }
    //     ,1000);
    // }

    // return d.labels.length > 0 ? styles.nodes[d.labels[0]].icon : ''; /////////////////////////////////////////
}

function setNodeText(d) { 
    if (d.labels.length > 0){
        if (D3ForceSimulation.NEStyles.nodes[d.labels[0]].caption != '<id>'){
            return d.properties.hasOwnProperty(D3ForceSimulation.NEStyles.nodes[d.labels[0]].caption) ? 
                d.properties[D3ForceSimulation.NEStyles.nodes[d.labels[0]].caption]
                : '';
        }
    }

    return d.id; 
}

function setNodeSize(d) { 
    d.size = d.labels.length > 0 ? D3ForceSimulation.NEStyles.nodes[d.labels[0]].size : 35;
    let __offset = -d.size / 2;

    D3ForceSimulation.svg.select('#node_image_id_'+d.id)
        .attr("transform", 'translate(' + __offset  + ',' + __offset + ')')
        .attr('height', d.size)
        .attr('width', d.size);
}

function setNodeTextOffset(d) { 
    if (d.labels.length > 0){
        return D3ForceSimulation.NEStyles.nodes[d.labels[0]].size / 2 + 10;
    }

    return -27.5;
}

function setEdgeColor(d) { 
    return D3ForceSimulation.NEStyles.edges[d.type].color;
}

function drawLine(d)
{
    let __x = d.source.x-d.target.x;
    let __y = d.source.y-d.target.y;
    let __sOffset = d.source.size * 0.5;
    let __tOffset = d.target.size * 0.5;
    let __jdDushu = Math.abs(Math.atan(__x/__y));
    let __sin = Math.sin(__jdDushu);
    let __cos = Math.cos(__jdDushu);

    let __sx = __jdDushu > 0.755 ? __sOffset : __sOffset * __sin;
    let __sy = __jdDushu <= 0.755 ? __sOffset : __sOffset * __cos;
    let __tx = __jdDushu > 0.755 ? __tOffset + 5 : __tOffset * __sin;
    let __ty = __jdDushu <= 0.755 ? __tOffset : __tOffset * __cos;

    d.sx = d.source.x + (__x > 0 ? -__sx : __sx);
    d.sy = d.source.y + (__y > 0 ? -__sy : __sy);
    d.tx = d.target.x + (__x > 0 ? __tx : -__tx);
    d.ty = d.target.y + (__y > 0 ? __ty : -__ty);

    d.psx = __x < 0 ? (d.source.x - __x * 0.333333) : (d.target.x + __x * 0.333333);
    d.psy = __x < 0 ? (d.source.y - __y * 0.333333) : (d.target.y + __y * 0.333333);
    d.ptx = __x < 0 ? d.tx : d.sx;
    d.pty = __x < 0 ? d.ty : d.sy;
}

D3ForceSimulation.setStyle = function(state, type, val) {
    switch (state.mode){
        case 1:
            if (!this.NEStyles.nodes.hasOwnProperty(state.name)){
                this.NEStyles.nodes[state.name] = {
                    icon: defaultIcon,
                    size: 50,
                    caption: 'name',
                }
            }

            let __node = this.svg.selectAll(".nodes")
                .filter(function(d, i){
                    for (let i=0; i<d.labels.length; i++){
                        if (d.labels[i] == state.name)
                            return true;
                    }    
                    return false;
                });
            
            if (!__node.empty()){
                switch (type){
                    case 'icon':
                        this.NEStyles.nodes[state.name].icon = val;
                        __node.select('image')
                            .attr("xlink:href", setIcon);
                        break;
                    case 'caption':
                        this.NEStyles.nodes[state.name].caption = val;
                        __node.select('text')
                            .text(setNodeText);
                        break;
                    case 'size':
                        this.NEStyles.nodes[state.name].size = val;
                        __node.select('.node_icon')
                            .each(setNodeSize);
                        
                        __node.select('text')
                            .attr("dy", setNodeTextOffset);
                        break;
                }
            }
            break;
        case 2:
            if (!this.NEStyles.edges.hasOwnProperty(state.name)){
                this.NEStyles.edges[state.name] = {
                    color: '#000000'
                }
            }
            
            let __link = this.svg.selectAll(".links")
                .filter(function(d, i){
                    return d.type == state.name;
                });
            
            if (!__link.empty()){
                switch (type){
                    case 'color':
                        this.NEStyles.edges[state.name].color = val;
                        __link.style('stroke', setEdgeColor)
                        break;
                    case 'size':
                        break;
                }
            }
            break;
    }
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
        .selectAll(".links")
        .data(__data.edges)
    
    let __link = __updataForLink
        .enter()
        .append("g")
        .attr("class", "links");
    
    __link.append("defs")
        .append("path")
        .attr("class", 'defs_path');

    __link.append("path")
        .attr("class", 'link_path')
        .style('marker-end', 'url(#marker_arrow)'); 
    
    __link.append("text")
        .style('font-size', '14px')
        .append('textPath');

    __updataForLink.exit().remove();

    let __updataForNode = this.svg
        .selectAll(".nodes")
        .data(__data.nodes)
        
    let __node = __updataForNode
        .enter()
        .append("g")
        .attr("class", 'nodes');
        
    __updataForNode.exit().remove();
 
    __node.append("image")
        .attr("class", 'node_icon')
        .attr("enabled", true);
            
    __node.append("text")
        .attr("text-anchor", "middle");

////////////////////// setStyle //////////////////////////////////

    __node = __node.merge(__updataForNode);   
    __link = __link.merge(__updataForLink); 

    __node
        .on("click", function(d){
            state.showCard(d);
        })
        .on("mouseover", function(d){
            d3.select(this)
                .attr('shadowed', 'selected');
            
            for (let i = 0; i < d.edges.length; i++){
                D3ForceSimulation.svg.select('#node_id_' + (d.edges[i].target.id == d.id ? d.edges[i].source.id : d.edges[i].target.id))
                    .attr('shadowed', 'adjacent');
                
                D3ForceSimulation.svg.select('#link_id_' + d.edges[i].id)
                    .attr('shadowed', true);
            }
        })
        .on("mouseout", function(d){
            d3.select(this)
                .attr('shadowed', '');

            for (let i = 0; i < d.edges.length; i++){
                D3ForceSimulation.svg.select('#node_id_' + (d.edges[i].target.id == d.id ? d.edges[i].source.id : d.edges[i].target.id))
                    .attr('shadowed', '');

                D3ForceSimulation.svg.select('#link_id_' + d.edges[i].id)
                    .attr('shadowed', false);
            }
        })
        .attr("id", function(d){return 'node_id_' + d.id})
        .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));

    let __imageInNode = __node.select(".node_icon")
        .attr("id", function(d){return 'node_image_id_' + d.id})
        .attr("xlink:href", setIcon)
        .each(setNodeSize);

    let __textInNode = __node.select("text")
        .attr("dy", setNodeTextOffset)
        .text(setNodeText);

    __link
        .style('stroke', setEdgeColor)
        .attr('id', function(d){ return 'link_id_' + d.id})
        .on("mouseover", function(d){
            D3ForceSimulation.svg.select('#link_id_' + d.id)
                .attr('shadowed', true);
        })
        .on("mouseout", function(d){
            D3ForceSimulation.svg.select('#link_id_' + d.id)
                .attr('shadowed', false);
        });


    let __defsInLink = __link.select('.defs_path')
        .attr('id', (d) => {return 'defs_path_id_'+ d.id});

    let __pathInLink = __link.select('.link_path')
        .attr('id', (d)=> {return 'link_path_id_'+ d.id});
    
    let __textpathInLink = __link.select('textPath')
        .attr('xlink:href', (d) => {return '#defs_path_id_'+ d.id})
        .text((d) => {return d.type;});
    
    function ticked() {
        __node
            .attr("transform", function(d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

        __link.each(drawLine);

        __pathInLink.attr("d", function(d) {return 'M' + d.sx + ',' + d.sy
                    +' L' + d.tx + ',' + d.ty});
        
        __defsInLink.attr("d", 
            (d) => {
                return 'M' + d.psx + ',' + d.psy
                    +' L' + d.ptx + ',' + d.pty});
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
