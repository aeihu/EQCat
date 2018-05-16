import * as d3 from 'd3';
import GlobalConstant from '../../Common/GlobalConstant';
import GlobalFunction from '../../Common/GlobalFunction';
import GlobalVariable from '../../Common/GlobalVariable';

export const D3ForceSimulation = {};

D3ForceSimulation.simulation = null;
D3ForceSimulation.svg = null;
D3ForceSimulation.x = 0;
D3ForceSimulation.y = 0;
D3ForceSimulation.zoom = 1;
D3ForceSimulation.tx = 1920;
D3ForceSimulation.ty = 1080;
D3ForceSimulation.showedImage = false;

D3ForceSimulation.connectMode = -1;
D3ForceSimulation.conncetLine = null;

D3ForceSimulation.NEStyles = {
    nodes: {
        // icon: 'icons/default/node.svg',
        // size: {
        //     property: 'name',
        //     level: [
        //     ],
        // },
        // caption: '<id>'
    },
    edges: {
        //xx:{
        //  color:'#000000',
        //}
    },
};

let menuFlag = true;

function getStyles(props) {
    GlobalFunction.SendAjax(
        (result)=>{
            D3ForceSimulation.NEStyles = result.styles;},
        (error)=>{props.onMessage(error.message, 0)},
        "/getStyles"
    );
}

D3ForceSimulation.create = function(el, props, state) {
    this.svg = d3.select("#displayContent")
        .append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .call(d3.drag()
                .on("start", function (){
                    D3ForceSimulation.tx = d3.event.x;
                    D3ForceSimulation.ty = d3.event.y;
                })
                .on("drag", function (){
                    D3ForceSimulation.svg.attr("transform", 
                        'translate(' + (D3ForceSimulation.x - (D3ForceSimulation.tx - d3.event.x)) + ',' 
                        + (D3ForceSimulation.y - (D3ForceSimulation.ty - d3.event.y)) + ')'+
                        'scale(' + D3ForceSimulation.zoom + ')')
                })
                .on("end", function (){
                    D3ForceSimulation.x = D3ForceSimulation.x - (D3ForceSimulation.tx - d3.event.x);
                    D3ForceSimulation.y = D3ForceSimulation.y - (D3ForceSimulation.ty - d3.event.y);
                }))
        .on("mousemove", function(d){
            if (D3ForceSimulation.connectMode >= 0){
                //D3ForceSimulation.conncetLine = D3ForceSimulation.svg.select('#conncet_line');
                if (D3ForceSimulation.conncetLine !=null ){
                    if (!D3ForceSimulation.conncetLine.empty()){
                        let __x = d3.mouse(this)[0] - D3ForceSimulation.x;
                        let __y = d3.mouse(this)[1] - D3ForceSimulation.y;
                        
                        if (D3ForceSimulation.conncetLine.attr('id') == 'conncet_line'){
                            __x = __x + (__x < D3ForceSimulation.conncetLine.attr('x1') ? 8 : -8);
                            D3ForceSimulation.conncetLine
                                .attr('x2', __x)
                                .attr('y2', __y);
                        }else{
                            moveExistEdge(D3ForceSimulation.conncetLine, __x, __y);
                        }
                    }
                }
            }
        })
        .on("contextmenu", function(data, index) {
            if (menuFlag){
                d3.event.preventDefault();
                state.showMenu(d3.event);
            }else{
                menuFlag = true;
            }
        })
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
    
    this.svg.append("g")
        .attr('id', "layer_edges");
    this.svg.append("g")
        .attr('id', "layer_nodes");

    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(220))
        .force("charge", d3.forceManyBody().strength(1))
        .force("collide", d3.forceCollide().radius(100))
        .force("center", d3.forceCenter(300, 300));

    getStyles(props);
};

D3ForceSimulation.zoomRestore = function(){
    D3ForceSimulation.zoom = 1;
    D3ForceSimulation.svg
        .transition().duration(185)
        .attr("transform", 
        'translate(' + D3ForceSimulation.x + ',' + D3ForceSimulation.y + ')'+
        'scale(' + D3ForceSimulation.zoom + ')')
}

D3ForceSimulation.zoomIn = function(){
    D3ForceSimulation.zoom += 0.15;
    D3ForceSimulation.svg
        .transition().duration(185)
        .attr("transform", 
        'translate(' + D3ForceSimulation.x + ',' + D3ForceSimulation.y + ')'+
        'scale(' + D3ForceSimulation.zoom + ')')
}

D3ForceSimulation.zoomOut = function(){
    if (D3ForceSimulation.zoom < 0.15){
        return;
    }

    D3ForceSimulation.zoom -= 0.15;
    D3ForceSimulation.svg
        .transition().duration(185)
        .attr("transform", 
        'translate(' + D3ForceSimulation.x + ',' + D3ForceSimulation.y + ')'+
        'scale(' + D3ForceSimulation.zoom + ')')
}

D3ForceSimulation.dragstarted = function (d) {
    if (D3ForceSimulation.connectMode < 0){
        if (!d3.event.active) {
            D3ForceSimulation.simulation.alphaTarget(0.3).restart();
        }
        
        d.fx = d.x;
        d.fy = d.y;
    }
}

D3ForceSimulation.dragged = function (d) {
    if (D3ForceSimulation.connectMode < 0){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
}

D3ForceSimulation.dragended = function (d) {
    if (D3ForceSimulation.connectMode < 0){
        if (!d3.event.active) {
            D3ForceSimulation.simulation.alphaTarget(0);
        }

        d.fx = null;
        d.fy = null;
    }
}

function isPreviewImageInNode(d){
    return d.properties.hasOwnProperty(GlobalConstant.imagesOfProperty) ?
        d.properties[GlobalConstant.imagesOfProperty].length > 0 ?
            true
            :
            false
        :false;
}

function setIcon(d) { 
    if (d.labels.length > 0){
        return D3ForceSimulation.getNodeStyle(d.labels[0]).icon ;
    }

    return GlobalConstant.defaultIcon; 
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
        if (D3ForceSimulation.getNodeStyle(d.labels[0]).caption != '<id>'){
            return d.properties[D3ForceSimulation.getNodeStyle(d.labels[0]).caption];
        }
    }

    return d.id; 
}

function setNodeSize(d) {
    if (d.labels.length < 1){
        d.size = 50;
    }else{
        let __property = D3ForceSimulation.getNodeStyle(d.labels[0]).size_property;
        let __level = D3ForceSimulation.getNodeStyle(d.labels[0]).size_level;
        if (__level.length == 0){
            d.size = 50;
        }else{
            if (__property == '<connect number>'){
                let __connectNumber = (d.hasOwnProperty('sourceEdges') ? d.sourceEdges.length : 0) + (d.hasOwnProperty('targetEdges') ? d.targetEdges.length : 0)
                for (let i=0; i<__level.length; i+=2){
                    if (i == __level.length - 2){
                        d.size = Number(__level[i+1]);
                    }else{
                        if (!isNaN(Number(__level[i]))){
                            if (__connectNumber <= Number(__level[i])){
                                d.size = Number(__level[i+1]);
                                break;
                            }
                        }
                    }
                }
            }else{
                if (d.properties.hasOwnProperty(__property)){
                    for (let i=0; i<__level.length; i+=2){
                        if (!isNaN(Number(__level[i])) && typeof d.properties[__property] == "number"){
                            if (d.properties[__property] <= Number(__level[i]) || i == __level.length - 2){
                                d.size = Number(__level[i+1]);
                                break;
                            }
                        }else{
                            if (d.properties[__property] == __level[i] || i == __level.length - 2){
                                d.size = Number(__level[i+1]);
                                break;
                            }
                        }
                    }
                }else{
                    d.size = __level[1];
                }
            }
        }
    }

    let __offset = -d.size * 0.5;

    D3ForceSimulation.svg.select('#node_image_id_'+d.id)
        .attr("transform", 'translate(' + __offset  + ',' + __offset + ')')
        .attr('height', d.size)
        .attr('width', d.size);
}

function setNodeTextOffset(d) { 
    return d.size * 0.5 + 10;
}

function setEdgeColor(d) { 
    return D3ForceSimulation.getEdgeStyle(d.type).color;
}

function setEdgeStroke(d) { 
    let __property = D3ForceSimulation.getEdgeStyle(d.type).stroke_property;
    let __level = D3ForceSimulation.getEdgeStyle(d.type).stroke_level;

    if (__level.length == 0){
        return '0'
    }else{
        if (d.properties.hasOwnProperty(__property)){
            for (let i=0; i<__level.length; i+=2){
                if (!isNaN(Number(__level[i])) && typeof d.properties[__property] == "number"){
                    if (d.properties[__property] <= Number(__level[i]) || i == __level.length - 2){
                        return __level[i+1]
                    }
                }else{
                    if (d.properties[__property] == __level[i] || i == __level.length - 2){
                        return __level[i+1]
                    }
                }
            }
        }else{
            return __level[1];
        }
    }
}

function moveExistEdge(selection, x, y){
    let __def = selection.select('.defs_path')
    let __path = selection.select('.link_path')

    __path.attr("d", 
        function(d) {
            computeForExistEdge(d, x, y)
            return 'M' + d.sx + ',' + d.sy +' L' + d.tx + ',' + d.ty
        }
    );
    
    __def.attr("d", 
        (d) => {
            return 'M' + d.psx + ',' + d.psy +' L' + d.ptx + ',' + d.pty
        }
    );
}

function computeForExistEdge(d, x, y){
    let __x;

    switch (D3ForceSimulation.connectMode){
        case 1:{
            __x = x-d.target.x;
            let __tR = d.target.size * 0.5 + 10;
            
            x = x + (x < d.target.x ? 8 : -8);
            let __jdDushu = GlobalFunction.MathAngle(d.target.x, d.target.y, x, y);
            let __sin = Math.sin(__jdDushu);
            let __cos = Math.cos(__jdDushu);
        
            d.sx = x;
            d.sy = y;
            d.tx = d.target.x + __tR * __cos;
            d.ty = d.target.y + __tR * __sin;
            break;
        }
        case 2:{
            __x = d.source.x-x;
            let __sR = d.source.size * 0.5 + 5;
            
            x = x + (x < d.source.x ? 8 : -8);
            let __jdDushu = GlobalFunction.MathAngle(x, y, d.source.x, d.source.y);
            let __sin = Math.sin(__jdDushu);
            let __cos = Math.cos(__jdDushu);
        
            d.sx = d.source.x - __sR * __cos;
            d.sy = d.source.y - __sR * __sin;
            d.tx = x;
            d.ty = y;
            break;
        }
    }

    if (__x < 0){
        d.psx = d.sx;
        d.psy = d.sy;
        d.ptx = d.tx;
        d.pty = d.ty;
    }else{
        d.psx = d.tx;
        d.psy = d.ty;
        d.ptx = d.sx;
        d.pty = d.sy;
    }
}

function drawEdge(selection)
{
    let __def = selection.select('.defs_path')
    let __path = selection.select('.link_path')
    
    __path.attr("d", 
        function(d) {
            computeForEdge(d);
            return d.source.id == d.target.id ? 
                'M' + d.sx + ',' + d.sy +' C'+ d.fx + ',' + d.fy + ' ' + d.fx1 + ',' + d.fy1 + ' ' + d.tx + ',' + d.ty
                :
                d.floor == 0 ?
                    'M' + d.sx + ',' + d.sy +' L' + d.tx + ',' + d.ty
                    :
                    'M' + d.sx + ',' + d.sy +' Q'+ d.fx + ',' + d.fy + ' ' + d.tx + ',' + d.ty
        });

    __def.attr("d", 
        (d) => {
            return d.source.id == d.target.id ? 
                d.floor < 0 ?
                    'M' + d.psx + ',' + d.psy +' C'+ d.fx + ',' + d.fy + ' ' + d.fx1 + ',' + d.fy1 + ' ' + d.ptx + ',' + d.pty
                    :
                    'M' + d.psx + ',' + d.psy +' C'+ d.fx1 + ',' + d.fy1 + ' ' + d.fx + ',' + d.fy + ' ' + d.ptx + ',' + d.pty
                :
                d.floor == 0 ?
                    'M' + d.psx + ',' + d.psy +' L' + d.ptx + ',' + d.pty
                    :
                    'M' + d.psx + ',' + d.psy +' Q'+ d.fx + ',' + d.fy + ' ' + d.ptx + ',' + d.pty
        });
}

function computeForEdge(d)
{
    if (d.source.id == d.target.id){
        let __r = d.source.size * 0.5 + 1;
        
        if (d.floor < 0){
            d.sx = d.source.x - __r;
            d.sy = d.source.y;
            d.tx = d.target.x - 5;
            d.ty = d.target.y - __r;
            d.fx = d.sx - (Math.abs(d.floor) + 40);
            d.fy = d.source.y;
            d.fx1 = d.source.x;
            d.fy1 = d.sy - (Math.abs(d.floor) + 40);
            
            d.psx = d.sx;
            d.psy = d.sy;
            d.ptx = d.tx;
            d.pty = d.ty;
        }else{
            d.sx = d.source.x + __r;
            d.sy = d.source.y;
            d.tx = d.target.x + 5;
            d.ty = d.target.y - __r;
            d.fx = d.sx + (Math.abs(d.floor) + 40);
            d.fy = d.source.y;
            d.fx1 = d.source.x;
            d.fy1 = d.sy - (Math.abs(d.floor) + 40);
            
            d.psx = d.tx;
            d.psy = d.ty;
            d.ptx = d.sx;
            d.pty = d.sy;
        }
    }else{
        let __x = d.source.x-d.target.x;
        let __y = d.source.y-d.target.y;
        let __sR = d.source.size * 0.5 + 5;
        let __tR = d.target.size * 0.5 + 10;
        
        let __jdDushu = GlobalFunction.MathAngle(d.target.x, d.target.y, d.source.x, d.source.y);
        let __sin = Math.sin(__jdDushu);
        let __cos = Math.cos(__jdDushu);
    
        if (d.floor != 0){
            //1.5578977136721246
            // let lcx = __x * 0.5 + d.target.x;
            // let lcy = __y * 0.5 + d.target.y;
            d.fx = (__x * 0.5 + d.target.x) - d.floor * Math.cos(__jdDushu + 1.5689874350398076);
            d.fy = (__y * 0.5 + d.target.y) - d.floor * Math.sin(__jdDushu + 1.5689874350398076);
    
            //0.08726646
            // __sin = Math.sin(__jdDushu + 0.08726646 * d.floor * 0.05);
            // __cos = Math.cos(__jdDushu + 0.08726646 * d.floor * 0.05);
            d.sx = d.source.x - __sR * Math.cos(__jdDushu + 0.2596263 * d.floor * 0.05);
            d.sy = d.source.y - __sR * Math.sin(__jdDushu + 0.2596263 * d.floor * 0.05);
            d.tx = d.target.x + __tR * Math.cos(__jdDushu + 0.2596263 * d.floor * -0.05);
            d.ty = d.target.y + __tR * Math.sin(__jdDushu + 0.2596263 * d.floor * -0.05);
        }else{
            d.sx = d.source.x - __sR * __cos;
            d.sy = d.source.y - __sR * __sin;
            d.tx = d.target.x + __tR * __cos;
            d.ty = d.target.y + __tR * __sin;
        }
    
        if (__x < 0){
            d.psx = d.sx;
            d.psy = d.sy;
            d.ptx = d.tx;
            d.pty = d.ty;
        }else{
            d.psx = d.tx;
            d.psy = d.ty;
            d.ptx = d.sx;
            d.pty = d.sy;
        }
    }
}

D3ForceSimulation.getNodeStyle = function(label){
    if (!this.NEStyles.nodes.hasOwnProperty(label)){
        this.NEStyles.nodes[label] = GlobalConstant.defaultNodeStyle();
    }

    return this.NEStyles.nodes[label];
}

D3ForceSimulation.getEdgeStyle = function(type){
    if (!this.NEStyles.edges.hasOwnProperty(type)){
        this.NEStyles.edges[type] = GlobalConstant.defaultEdgeStyle();
    }

    return this.NEStyles.edges[type];
}

D3ForceSimulation.setStyle = function(mode, name, type, val) {
    switch (mode){
        case GlobalConstant.mode.node:
            if (!this.NEStyles.nodes.hasOwnProperty(name)){
                this.NEStyles.nodes[name] = GlobalConstant.defaultNodeStyle();
            }

            let __node = this.svg.selectAll(".nodes")
                .filter(function(d, i){
                    for (let index=0; index<d.labels.length; index++){
                        if (d.labels[index] == name)
                            return true;
                    }    
                    return false;
                });
            
            if (!__node.empty()){
                switch (type){
                    case 'icon':
                        this.NEStyles.nodes[name].icon = val;
                        __node.select('.node_icon')
                            .attr("xlink:href", setIcon);
                        break;
                    case 'caption':
                        this.NEStyles.nodes[name].caption = val;
                        __node.select('text')
                            .text(setNodeText);
                        break;
                    case 'size_property':
                        this.NEStyles.nodes[name].size_property = val;
                        __node.select('.node_icon')
                            .each(setNodeSize);
                        
                        __node.select('text')
                            .attr("dy", setNodeTextOffset);
                        break;
                    case 'size_level':
                        this.NEStyles.nodes[name].size_level = [...val];
                        __node.select('.node_icon')
                            .each(setNodeSize);
                        
                        __node.select('text')
                            .attr("dy", setNodeTextOffset);
                        break;
                }
            }
            break;
        case GlobalConstant.mode.edge:
            if (!this.NEStyles.edges.hasOwnProperty(name)){
                this.NEStyles.edges[name] =  GlobalConstant.defaultEdgeStyle();
            }
            
            let __link = this.svg.selectAll(".links")
                .filter(function(d, i){
                    return d.type == name;
                });
            
            if (!__link.empty()){
                switch (type){
                    case 'color':
                        this.NEStyles.edges[name].color = val;
                        __link.style('stroke', setEdgeColor)
                        break;
                    case 'stroke_property':
                        this.NEStyles.edges[name].stroke_property = val;
                        __link.select('.link_path').style('stroke-dasharray', setEdgeStroke)
                        break;
                    case 'stroke_level':
                        this.NEStyles.edges[name].stroke_level = [...val];
                        __link.select('.link_path').style('stroke-dasharray', setEdgeStroke)
                        break;
                }
            }
            break;
    }
}

D3ForceSimulation.ScreenMoveTo = function(d){
    let __el;
    if (d.hasOwnProperty('ptx')){
        D3ForceSimulation.x = 650 - (d.psx + (d.ptx - d.psx) / 2);
        D3ForceSimulation.y = 300 - (d.psy + (d.pty - d.psy) / 2);
        __el = D3ForceSimulation.svg.select('#link_id_' + d.id);
        __el.select('text')
            .transition().duration(85)
            .style('font-size', '24px')
            .transition().duration(85)
            .style('font-size', '14px')
    }else{
        D3ForceSimulation.x = 650 - d.x;
        D3ForceSimulation.y = 300 - d.y;
        __el = D3ForceSimulation.svg.select('#node_id_' + d.id);
        __el.select('#node_image_id_'+d.id)
            .transition().duration(85)
            .attr('width', d.size + 20)
            .attr('height', d.size + 20)
            .attr('transform','translate(' + -(d.size / 2 + 10) + ','+ -(d.size / 2 + 10) +')')
            .transition().duration(85)
            .attr('width', d.size)
            .attr('height', d.size)
            .attr('transform','translate(' + -(d.size / 2) + ','+ -(d.size / 2 ) +')')
    }

    D3ForceSimulation.svg
        .transition().duration(185)
        .attr("transform", 
        'translate(' + D3ForceSimulation.x + ',' + D3ForceSimulation.y + ')'+
        'scale(' + D3ForceSimulation.zoom + ')')
}

D3ForceSimulation.update = function(el, props, state) {
    // Re-compute the scales, and render the data points
    // var scales = this._scales(el, state.domain);
    console.log('========== update data ==========');
    this._drawNodesAndEdges(el, props, state);
};

D3ForceSimulation.Unselect = function(d){
    d.selected = false;
    if (d.hasOwnProperty('ptx')){
        D3ForceSimulation.svg.select('#defs_path_id_' + d.id)
            .attr('shadowed', d.selected)
            .attr('class', 'defs_path');
    }else{
        D3ForceSimulation.svg.select('#node_id_' + d.id).attr('class', 'nodes');
    }
}

D3ForceSimulation.SelectAll = function(state){
    this.svg
        .selectAll(".nodes")
        .each(function(d){
            d['selected'] = true;
            state.selectNode(d, false);
        })
        .attr('shadowed', '')
        .attr('class', 'nodes nodes_selected');

    this.svg
        .selectAll(".links")
        .each(function(d){
            d['selected'] = true;
            state.selectEdge(d, false);
        })
        .select('.defs_path')
        .attr('class', 'defs_path defs_path_selected');
}

D3ForceSimulation._drawNodesAndEdges = function(el, props, state){
    let __data = props.data
    console.log(__data);

    let __updataForNode = this.svg
        .select('#layer_nodes')
        .selectAll(".nodes")
        .data(__data.nodes)
        
    let __node = __updataForNode
        .enter()
        .append("g");
        //.attr("class", 'nodes');
        
    __updataForNode.exit().remove();

    __node.append("image")
        .attr("transform", 'translate(-50,-110)')
        .attr("class", 'node_previewImage');
        
    __node.append("image")
        .attr("class", 'node_icon')
        
    __node.append("text")
        .attr("text-anchor", "middle");

    let __updataForLink = this.svg
        .select('#layer_edges')
        .selectAll(".links")
        .data(__data.edges)
    
    let __link = __updataForLink
        .enter()
        .append("g");
        //.attr("class", "links");

    __link.append("path")
        .attr("class", 'defs_path')
        .style('stroke-width', '10')
        .style('fill', 'none');
    
    __link.append("path")
        .attr("class", 'link_path')
        .style('fill', 'none')
        .style('marker-end', 'url(#marker_arrow)'); 
        
    __link.append("text")
        .style('font-size', '14px')
        .attr('xml:space', 'preserve')
        .append('textPath');

    __updataForLink.exit().remove();

////////////////////// setStyle //////////////////////////////////
 
    __link = __link.merge(__updataForLink); 
    __node = __node.merge(__updataForNode);  

    __node
        .attr('class', function(d){ 
            if (!d.hasOwnProperty('selected')){
                d['selected'] = false;
            }

            return d.selected ? 'nodes nodes_selected' : 'nodes'
        })
        .on("dblclick", function(d){
            state.showCard(d, {mode: GlobalConstant.mode.node, x: d3.event.clientX-80, y: d3.event.clientY-100}); 
        })
        .on("click", function(d){
            if (D3ForceSimulation.connectMode >= 0){
                if (D3ForceSimulation.conncetLine == null){
                    D3ForceSimulation.conncetLine = D3ForceSimulation.svg.select('#conncet_line');
                }

                if (D3ForceSimulation.conncetLine.empty()){
                    D3ForceSimulation.conncetLine = D3ForceSimulation.svg
                        .append('line')
                        .attr('id', 'conncet_line')
                        .attr('x1', d.x)
                        .attr('y1', d.y)
                        .attr('x2', d.x)
                        .attr('y2', d.y)
                        .attr('source', d.id)
                        .style('marker-end', 'url(#marker_arrow)')
                        .style('stroke', 'rgb(0, 0, 0)');
                }else{
                    switch (D3ForceSimulation.connectMode){
                        case 0:{
                            let __message = GlobalFunction.CheckName(state.tooltip.relationshipType);
                            if (__message == ''){
                                GlobalFunction.SendAjax(
                                    (result)=>{
                                        GlobalVariable.flagForGetTemplate = true;
                                        props.onAddEdge(result.records);
                                        props.onMessage('Add edge is success', 1);
                                    },
                                    (error)=>{props.onMessage(error.message, 0)},
                                    "/addEdge?edge=",
                                    {
                                        source: D3ForceSimulation.conncetLine.attr('source'),
                                        target: d.id,
                                        type: state.tooltip.relationshipType
                                    }
                                );
                            }else{
                                props.onMessage(__message, 0);
                            }
                            
                            D3ForceSimulation.removeConncetLine();
                            break;
                        }
                        case 1:
                        case 2:{
                            let __message = GlobalFunction.CheckName(state.tooltip.relationshipType);
                            if (__message == ''){
                                let __edge = {
                                    connectMode: D3ForceSimulation.connectMode,
                                    node: d.id,
                                    edge: D3ForceSimulation.conncetLine.attr('id').substr(8),
                                    type: state.tooltip.relationshipType
                                }

                                GlobalFunction.SendAjax(
                                    (result)=>{
                                        GlobalVariable.flagForGetTemplate = true;
                                        props.onMergeEdge(result.records, __edge.edge);
                                        props.onMessage('Merge edge is success', 1);
                                    },
                                    (error)=>{props.onMessage(error.message, 0)},
                                    "/directEdge?edge=",
                                    __edge
                                );
                            }else{
                                props.onMessage(__message, 0);
                            }
                            
                            D3ForceSimulation.removeConncetLine();
                            break;
                        }
                    }
                }
            }else{
                if (d.hasOwnProperty('selected')){
                    d.selected = !d.selected;
                }
                else{
                    d.selected = true;
                }
    
                d3.select(this)
                    .attr('shadowed', d.selected ? '' : 'mouseover')
                    .attr('class', d.selected ? 'nodes nodes_selected' : 'nodes');
                
                state.selectNode(d, true);
            }
        })
        .on("mouseover", function(d){
            d3.select(this)
                .attr('shadowed', 'mouseover');
            
            if (d.hasOwnProperty('sourceEdges')){
                for (let i = 0; i < d.sourceEdges.length; i++){
                    D3ForceSimulation.svg.select('#node_id_' + d.sourceEdges[i].target.id)
                        .attr('shadowed', 'target');
                    
                    D3ForceSimulation.svg.select('#defs_path_id_' + d.sourceEdges[i].id)
                        .attr('shadowed', true);
                }
            }

            if (d.hasOwnProperty('targetEdges')){
                for (let i = 0; i < d.targetEdges.length; i++){
                    D3ForceSimulation.svg.select('#node_id_' + d.targetEdges[i].source.id)
                        .attr('shadowed', 'source');
                    
                    D3ForceSimulation.svg.select('#defs_path_id_' + d.targetEdges[i].id)
                        .attr('shadowed', true);
                }
            }
        })
        .on("mouseout", function(d){
            d3.select(this)
                .attr('shadowed', '');

            if (d.hasOwnProperty('sourceEdges')){
                for (let i = 0; i < d.sourceEdges.length; i++){
                    D3ForceSimulation.svg.select('#node_id_' + d.sourceEdges[i].target.id)
                        .attr('shadowed', '');

                    D3ForceSimulation.svg.select('#defs_path_id_' + d.sourceEdges[i].id)
                        .attr('shadowed', false);
                }
            }

            if (d.hasOwnProperty('targetEdges')){
                for (let i = 0; i < d.targetEdges.length; i++){
                    D3ForceSimulation.svg.select('#node_id_' + d.targetEdges[i].source.id)
                        .attr('shadowed', '');

                    D3ForceSimulation.svg.select('#defs_path_id_' + d.targetEdges[i].id)
                        .attr('shadowed', false);
                }
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

    let __previewImageInNode = __node.select(".node_previewImage")
        .attr("xlink:href", (d)=>{ return isPreviewImageInNode(d) ? d.properties[GlobalConstant.imagesOfProperty][0] : ''})
        .attr("height", D3ForceSimulation.showedImage ? (d)=>{ return isPreviewImageInNode(d) ? 100 : 0} : 0)
        .attr("width", D3ForceSimulation.showedImage ? (d)=>{ return isPreviewImageInNode(d) ? 100 : 0} : 0);

    let __tmplinks= {
        //12:34 : []
    };

    __link
        .style('stroke', setEdgeColor)
        .attr('id', function(d){ return 'link_id_' + d.id})
        .attr('class', function(d){ 
            let __sid = typeof d.source == 'object' ? d.source.id : d.source;
            let __tid = typeof d.target == 'object' ? d.target.id : d.target;
            let __b = __tid > __sid;
            d['STID'] = __b ? __sid + ':' + __tid : __tid + ':' + __sid;
            if (!__tmplinks.hasOwnProperty(d['STID'])){
                __tmplinks[d['STID']] = [];
            }

            __tmplinks[d['STID']].push({data: d, flag:__b});
            return 'links'
        })
        .on("contextmenu", function(d, i) {
            d3.event.preventDefault()
            if (D3ForceSimulation.connectMode >= 0){
                if (D3ForceSimulation.conncetLine == null || D3ForceSimulation.conncetLine.empty()){
                    D3ForceSimulation.conncetLine = D3ForceSimulation.svg.select('#link_id_'+d.id);
                    D3ForceSimulation.connectMode = 2;
                    moveExistEdge(D3ForceSimulation.conncetLine, d3.mouse(this)[0], d3.mouse(this)[1]);
                    state.fillRelationshipTypeToAuto(d.type);
                    menuFlag = false;
                }
            }
        })
        .on("click", function(d){
            if (D3ForceSimulation.connectMode >= 0){
                if (D3ForceSimulation.conncetLine == null || D3ForceSimulation.conncetLine.empty()){
                    D3ForceSimulation.conncetLine = D3ForceSimulation.svg.select('#link_id_'+d.id);
                    D3ForceSimulation.connectMode = 1;
                    
                    let __x = d3.mouse(this)[0]// - D3ForceSimulation.x;
                    let __y = d3.mouse(this)[1]// - D3ForceSimulation.y;
                    moveExistEdge(D3ForceSimulation.conncetLine, __x, __y);
                    state.fillRelationshipTypeToAuto(d.type);
                }
            }else{
                if (d.hasOwnProperty('selected')){
                    d.selected = !d.selected;
                }
                else{
                    d['selected'] = true;
                }
    
                D3ForceSimulation.svg.select('#defs_path_id_' + d.id)
                    .attr('shadowed', d.selected)
                    .attr('class', d.selected ? 'defs_path defs_path_selected' : 'defs_path');
                
                state.selectEdge(d, true);
            }
        })
        .on("dblclick", function(d){
            state.showCard(d, {mode: GlobalConstant.mode.edge, x: d3.event.clientX-80, y: d3.event.clientY-100}); 
        })
        .on("mouseover", function(d){
            D3ForceSimulation.svg.select('#defs_path_id_' + d.id)
                .attr('shadowed', true);
        })
        .on("mouseout", function(d){
            D3ForceSimulation.svg.select('#defs_path_id_' + d.id)
                .attr('shadowed', false);
        });

    for (let key in __tmplinks){
        if (__tmplinks[key].length > 1){
            let tmp = 1;
            for (let i=0; i<__tmplinks[key].length; i++){
                tmp = 1 + i;
                __tmplinks[key][i].data['floor'] = (__tmplinks[key][i].flag ? 1 : -1) * 20 * (tmp % 2 == 1 ? Math.ceil(tmp/2) : -Math.ceil(tmp/2));
            }
        }else{
            __tmplinks[key][0].data['floor'] = 0;
        }
    }

    let __defsInLink = __link.select('.defs_path')
        .attr('id', (d) => {return 'defs_path_id_'+ d.id})
        .attr('class', (d)=>{
            if (!d.hasOwnProperty('selected')){
                d['selected'] = false;
            }
            return d.selected ? 'defs_path defs_path_selected' : 'defs_path';
        })

    let __pathInLink = __link.select('.link_path')
        .attr('id', (d)=> {return 'link_path_id_'+ d.id})
        .style('stroke-dasharray', setEdgeStroke);
    
    let __textpathInLink = __link.select('textPath')
        .attr('xlink:href', (d) => {return '#defs_path_id_'+ d.id})
        .text((d) => {return '       ' + d.type;});
    
    function ticked() {
        __node
            .attr("transform", function(d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

        drawEdge(__link);
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
        .selectAll(".node_previewImage")
        .attr("height", D3ForceSimulation.showedImage ? (d)=>{ return isPreviewImageInNode(d) ? 100 : 0} : 0)
        .attr("width", D3ForceSimulation.showedImage ? (d)=>{ return isPreviewImageInNode(d) ? 100 : 0} : 0);
}

D3ForceSimulation.changeConnectMode = function(){
    D3ForceSimulation.removeConncetLine();
    D3ForceSimulation.connectMode = D3ForceSimulation.connectMode < 0 ? 0 : -1;
    console.log(D3ForceSimulation.connectMode)
}

D3ForceSimulation.removeConncetLine = function(){
    if (D3ForceSimulation.connectMode >= 0){
        if (D3ForceSimulation.conncetLine != null){
            if (!D3ForceSimulation.conncetLine.empty()){
                if (D3ForceSimulation.conncetLine.attr('id') == 'conncet_line'){
                    D3ForceSimulation.connectMode = 0;
                    D3ForceSimulation.conncetLine.remove();
                    D3ForceSimulation.conncetLine = null;
                    return true;
                }else{
                    drawEdge(D3ForceSimulation.conncetLine);
                    D3ForceSimulation.connectMode = 0;
                    D3ForceSimulation.conncetLine = null;
                    return true;
                }
            }
        }
    }
    return false;
}

D3ForceSimulation.destroy = function(el) {
    // Any clean-up would go here
    // in this example there is nothing to do
};
