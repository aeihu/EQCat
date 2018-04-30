import React from 'react';
import ReactDOM from 'react-dom';
import CardComponent from './CardComponent';
import {D3ForceSimulation} from './D3ForceSimulation';
import EditStyleComponent from './EditStyleComponent';
import GlobalConstant from '../../Common/GlobalConstant';
import GlobalFunction from '../../Common/GlobalFunction';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Clear from 'material-ui/svg-icons/content/clear';
import NotificationDoNotDisturb from 'material-ui/svg-icons/notification/do-not-disturb';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import ActionToll from 'material-ui/svg-icons/action/toll';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import ImagePhotoLibrary from 'material-ui/svg-icons/image/photo-library';
import ImageControlPoint from 'material-ui/svg-icons/image/control-point';
import ActionDone from 'material-ui/svg-icons/action/done';
import ImageFilter from 'material-ui/svg-icons/image/filter';
import SocialShare from 'material-ui/svg-icons/social/share';
import ContentRemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import ActionVisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import ImageEdit from 'material-ui/svg-icons/image/edit';
import EditorDialogComponent from './EditorDialogComponent';
import AutoComplete from 'material-ui/AutoComplete';
import ImagePanoramaFishEye from 'material-ui/svg-icons/image/panorama-fish-eye';
import CommunicationCallMade from 'material-ui/svg-icons/communication/call-made';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import NotificationPriorityHigh from 'material-ui/svg-icons/notification/priority-high';

import Popover from 'material-ui/Popover/Popover';
import { SketchPicker } from 'react-color';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/internal/Tooltip';

export default class GraphForDataComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialog:{
                data: {},
                open: false,
                mode: -1
            },
            showCard: this.showCard,
            showMenu: this.showMenu,
            selectNode: this.selectNode,
            selectEdge: this.selectEdge,
            fillRelationshipTypeToAuto: this.fillRelationshipTypeToAuto,
            menu: {
                open: false,
                x: 0,
                y: 0,
                anchorEl: null
            },
            tooltip:{
                showedImage: false,
                relationshipType: '',
                selected:{
                    nodes:[],
                    edges:[],
                    nodesEl: null,
                    edgesEl: null,
                    nodesOpen: false,
                    edgesOpen: false,
                },
            }
        };
    }

    cards = {
        nodes:[
            //{data:xxx , x:xxx, y:xxx}
        ],
        edges:[],
    }

    styleEditor = {
        mode: -1
    }

    fillRelationshipTypeToAuto = function(value){
        this.setState(function(prevState, props) {
            prevState.tooltip.relationshipType = value;
            return prevState;
        })
    }.bind(this)

    showMenu = function(event) {
        // This prevents ghost click.
        event.preventDefault();
        
        if (!D3ForceSimulation.removeConncetLine()){
            let __x = event.clientX;
            let __y = event.clientY;
    
            this.setState(function(prevState, props) {
                prevState.menu = {
                    open: true,
                    x: __x,
                    y: __y,
                    anchorEl: document.getElementById('menuInDisplayContent')
                };
                return prevState;
            });
        }
    }.bind(this)

    selectNode = function(d, isUnselect){
        this.setState(function(prevState, props) {
            for (let i=0; i<prevState.tooltip.selected.nodes.length; i++){
                if (d.id == prevState.tooltip.selected.nodes[i].id){
                    if (isUnselect){
                        prevState.tooltip.selected.nodes.splice(i, 1);
                    }
                    return prevState;
                }
            }

            prevState.tooltip.selected.nodes.push(d);
            return prevState;
        });
    }.bind(this);
    
    selectEdge = function(d, isUnselect){
        this.setState(function(prevState, props) {
            for (let i=0; i<prevState.tooltip.selected.edges.length; i++){
                if (d.id == prevState.tooltip.selected.edges[i].id){
                    if (isUnselect){
                        prevState.tooltip.selected.edges.splice(i, 1);
                    }
                    return prevState;
                }
            }

            prevState.tooltip.selected.edges.push(d);
            return prevState;
        });
    }.bind(this);

    showCard = function(d, para) {
        let __mode = para.mode == GlobalConstant.mode.node ? 'nodes' : 'edges';
        for (let index in this.cards[__mode]){
            if (this.cards[__mode][index].data.id == d.id){
                return;
            }
        }

        this.setState(function(prevState, props) {
            this.cards[__mode].push({data:d, x:para.x, y:para.y});
            return prevState;
        });
    }.bind(this);

    hideCard = function(id, mode) {
        let __mode = mode == GlobalConstant.mode.node ? 'nodes' : 'edges';
        for (let index in this.cards[__mode]){
            if (this.cards[__mode][index].data.id == id){
                this.setState(function(prevState, props) {
                    this.cards[__mode].splice(index, 1);
                    return prevState;
                });
            }
        }
    }.bind(this)
////////////////////////////////////////////
//
////////////////////////////////////////////
    nodeToStrForMessage = function(node, isHtml){
        let __labels = '';
        for (let i=0; i<node.labels.length; i++){
            __labels += ':'+node.labels[i];
        }

        let __property = ''
        if (node.labels.length > 0){
            let __caption = D3ForceSimulation.getNodeStyle(node.labels[0]).caption;
            if (__caption != '<id>'){
                if (node.properties.hasOwnProperty(__caption)){
                    __property = ', ' + __caption + ':' + node.properties[__caption]
                }else{
                    for (let key in node.properties){
                        __property = ', ' + key + ':' + node.properties[key]
                        break;
                    }
                }
            }
        }

        return isHtml ? '<i><b>(</b>'+ __labels + ' {id:' + node.id + __property + '}<b>)</b></i>'
            : '(' + __labels + ' {id:' + node.id + __property + '})';
    }

    edgeToStrForMessage = function(edge, isHtml){
        return isHtml ? '<i><b>[</b>:'+ edge.type+' {id:'+edge.id+'}<b>]</b></i>'
            : '[:'+ edge.type + ' {id:' + edge.id + '}]';
    }

    preDeleteNodesAndEdges = function(nodes, edges){
        if (nodes.length > 0){
            if (edges.length < 1){
                this.preDeleteNodes(nodes);
            }else{
                this.setState(function(prevState, props) {
                    let xmlhttp = new XMLHttpRequest()
                    
                    xmlhttp.onreadystatechange = function(){
                        if (xmlhttp.readyState==4 && xmlhttp.status==200){
                            console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
                            let __edges = [...edges];
                            let __json = JSON.parse(Base64.decode(xmlhttp.responseText));
                            
                            console.log('__json')
                            console.log(__json)
                            let __count = 0;
                            let __message = '';
                            let __source;
                            let __target;
                            let __tmpEdgeIDs = [];
                            let __isContinue = false;
                            
                            for (let i=0; i<nodes.length; i++){
                                __message += '<br/>&emsp;<b>'+i+':</b>&emsp;' + this.nodeToStrForMessage(nodes[i], true);
                            }

                            __message += '<br/><br/><b>Edges:</b>'
                            for (let i=0; i<__json.length; i++){
                                if (__json[i].r.source == __json[i].n.id){
                                    __source = __json[i].n;
                                    __target = __json[i].m;
                                }else{
                                    __source = __json[i].m;
                                    __target = __json[i].n;
                                }
                            
                                for (let j=0; j<__tmpEdgeIDs.length; j++){
                                    if (__tmpEdgeIDs[j] == __json[i].r.id){
                                        __isContinue = true;
                                        break;
                                    }
                                }

                                if (__isContinue){
                                    __isContinue = false;
                                    continue;
                                }
                                
                                __tmpEdgeIDs.push(__json[i].r.id);
                                __message += '<br/>&emsp;<b>'+__count+':</b>&emsp;'+
                                    this.nodeToStrForMessage(__source, true)+
                                    '-'+
                                    this.edgeToStrForMessage(__json[i].r, true)+
                                    '->'+
                                    this.nodeToStrForMessage(__target, true);

                                for (let j=__edges.length-1; j>=0; j--){
                                    if (__edges[j].id == __json[i].r.id){
                                        __edges.splice(j, 1);
                                    }
                                }
                                __count++;
                            }
                            
                            for (let i=0; i<__edges.length; i++){
                                __message += '<br/>&emsp;<b>'+(i+__count)+':</b>&emsp;'+
                                    this.nodeToStrForMessage(__edges[i].source, true)+
                                    '-'+
                                    this.edgeToStrForMessage(__edges[i], true)+
                                    '->'+
                                    this.nodeToStrForMessage(__edges[i].target, true);
                            }
                            
                            __message = 'You will delete ' + nodes.length + ' nodes and ' + (__count + __edges.length) + ' edges:<br/><b>Nodes:</b>' + __message;
                            this.props.onAlert('Delete Nodes And Relationships', 
                                __message, 
                                __edges.length < 1 ? 
                                    ()=>this.deleteNodes(nodes)
                                    :
                                    ()=>this.deleteNodesAndEdges(nodes, __edges));
                        }
                    }.bind(this)
                    
                    let __nodes = [];
                    for (let i=0; i<nodes.length; i++){
                        __nodes.push(nodes[i].id);
                    }
                    xmlhttp.open("GET", '/preDeleteNode?nodes="' + Base64.encodeURI(JSON.stringify(__nodes)) + '"', true);
                    xmlhttp.send();
                    
                    prevState.menu.open = false;
                    return prevState;
                })
            }
        }else{
            this.perDeleteEdges(edges);
        }
    }

    deleteNodesAndEdges = function(nodes, edges){
		let __json = {
            nodes:[],
            edges:[],
        };

		for (let i=0; i<edges.length; i++){
            D3ForceSimulation.Unselect(edges[i]);
            __json.edges.push(edges[i].id);
        }
        
		for (let i=0; i<nodes.length; i++){
            D3ForceSimulation.Unselect(nodes[i]);
            __json.nodes.push(nodes[i].id);
        }
        
        if (__json.nodes.length > 0 || 
            __json.edges.length > 0){
            let xmlhttp = new XMLHttpRequest()
            
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
                    let __result = JSON.parse(Base64.decode(xmlhttp.responseText));
                    console.log('ssssssssssssssssssssssssssssssssssssssss')
                    
                    this.props.onDeleteNode(nodes);
                    this.props.onDeleteEdge(__json.edges);
                    this.setState(function(prevState, props) {
                        prevState.tooltip.selected.nodes = [];
                        prevState.tooltip.selected.edges = [];
                        return prevState;
                    });
                }
            }.bind(this)
            
            console.log(__json)
			xmlhttp.open("GET", '/deleteNE?NE="' + Base64.encodeURI(JSON.stringify(__json)) + '"', true);
            xmlhttp.send();
        }
    }.bind(this)

    preDeleteNodes = function(nodes){
        if (nodes.length > 0){
            this.setState(function(prevState, props) {
                let __nodes = [];
                for (let i=0; i<nodes.length; i++){
                    __nodes.push(nodes[i].id);
                }
                
                let xmlhttp = new XMLHttpRequest()
                
                xmlhttp.onreadystatechange = function(){
                    if (xmlhttp.readyState==4 && xmlhttp.status==200){
                        console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
                        let __json = JSON.parse(Base64.decode(xmlhttp.responseText));
                        let __message = '';
                        let __source;
                        let __target;
                        let __tmpEdgeIDs = [];
                        let __isContinue = false;
                        let __count = 0;
                        
                        for (let i=0; i<nodes.length; i++){
                            __message += '<br/>&emsp;<b>'+i+':</b>&emsp;' + this.nodeToStrForMessage(nodes[i], true);
                        }

                        __message += '<br/><br/><b>Edges:</b>'
                        for (let i=0; i<__json.length; i++){
                            for (let j=0; j<__tmpEdgeIDs.length; j++){
                                if (__tmpEdgeIDs[j] == __json[i].r.id){
                                    __isContinue = true;
                                    break;
                                }
                            }

                            if (__isContinue){
                                __isContinue = false;
                                continue;
                            }

                            __tmpEdgeIDs.push(__json[i].r.id);
                            if (__json[i].r.source == __json[i].n.id){
                                __source = __json[i].n;
                                __target = __json[i].m;
                            }else{
                                __source = __json[i].m;
                                __target = __json[i].n;
                            }
                            
                            __message += '<br/>&emsp;<b>'+__count+':</b>&emsp;'+
	                            this.nodeToStrForMessage(__source, true)+
	                            '-'+
	                            this.edgeToStrForMessage(__json[i].r, true)+
	                            '->'+
                                this.nodeToStrForMessage(__target, true);
                            
                            __count++;
                        }
                        
                        __message = 'You will delete ' + nodes.length + ' nodes and ' + __count + ' edges:<br/><b>Nodes:</b>' + __message;
                        this.props.onAlert('Delete Nodes', __message, ()=>this.deleteNodes(nodes))
                    }
                }.bind(this)
                
                xmlhttp.open("GET", '/preDeleteNode?nodes="' + Base64.encodeURI(JSON.stringify(__nodes)) + '"', true);
                xmlhttp.send();

                prevState.menu.open = false;
                prevState.tooltip.selected.nodesOpen = false;
                return prevState;
            })
        }
    }

    deleteNodes = function(nodes){
        let __nodes = [];
        for (let i=0; i<nodes.length; i++){
            D3ForceSimulation.Unselect(nodes[i]);
            __nodes.push(nodes[i].id);
        }
        
        if (__nodes.length > 0){
            let xmlhttp = new XMLHttpRequest()
            
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
                    let __result = JSON.parse(Base64.decode(xmlhttp.responseText));
                    console.log('ssssssssssssssssssssssssssssssssssssssss')
                    
                    this.props.onDeleteNode(nodes);
                    this.setState(function(prevState, props) {
                        let __b = false;
                        for (let i=0; i<nodes.length; i++){
                            for (let j=prevState.tooltip.selected.nodes.length-1; j>=0; j--){
                                if (prevState.tooltip.selected.nodes[j].id == nodes[i].id){
                                    for (let k=prevState.tooltip.selected.edges.length-1; k>=0; k--){
                                        __b = false;
                                        if (nodes[i].hasOwnProperty('sourceEdges')){
                                            for (let l=nodes[i].sourceEdges.length-1; l>=0; l--){
                                                if (nodes[i].sourceEdges[l].id == prevState.tooltip.selected.edges[k]){
                                                    prevState.tooltip.selected.edges.splice(k, 1);
                                                    __b = true;
                                                    break;
                                                }
                                            }
                                        }

                                        if (__b){
                                            continue;
                                        }

                                        if (nodes[i].hasOwnProperty('targetEdges')){
                                            for (let l=nodes[i].targetEdges.length-1; l>=0; l--){
                                                if (nodes[i].targetEdges[l].id == prevState.tooltip.selected.edges[k]){
                                                    prevState.tooltip.selected.edges.splice(k, 1);
                                                    break;
                                                }
                                            }
                                        }
                                    }

                                    prevState.tooltip.selected.nodes.splice(j, 1);
                                    break;
                                }
                            }
                        }

                        prevState.tooltip.selected.nodesOpen = prevState.tooltip.selected.nodesOpen ? prevState.tooltip.selected.nodes.length > 0 : false;
                        return prevState;
                    });
                }
            }.bind(this)
            
			xmlhttp.open("GET", '/deleteNode?nodes="' + Base64.encodeURI(JSON.stringify(__nodes)) + '"', true);
            xmlhttp.send();
        }
    }.bind(this)

    perDeleteEdges = function(edges){
        if (edges.length > 0){
            this.setState(function(prevState, props) {
                let __edges = [];
                let __message = 'You will delete '+edges.length+' edges:<br/>';
                for (let i=0; i<edges.length; i++){
                    __edges.push(edges[i].id);
                    
                    __message += '<br/>&emsp;<b>'+i+':</b>&emsp;'+
                        this.nodeToStrForMessage(edges[i].source, true)+
                        '-'+
                        this.edgeToStrForMessage(edges[i], true)+
                        '->'+
                        this.nodeToStrForMessage(edges[i].target, true);
                }

                prevState.menu.open = false;
                prevState.tooltip.selected.edgesOpen = false;
                this.props.onAlert('Delete Relationships', __message, ()=>this.deleteEdges(edges))
                return prevState;
            })
        }
    }

    deleteEdges = function(edges){
		let __edges = [];
		for (let i=0; i<edges.length; i++){
            D3ForceSimulation.Unselect(edges[i]);
            __edges.push(edges[i].id);
		}

		if (__edges.length > 0){
			let xmlhttp = new XMLHttpRequest()
			
			xmlhttp.onreadystatechange = function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
					let __json = JSON.parse(Base64.decode(xmlhttp.responseText));
					console.log('ssssssssssssssssssssssssssssssssssssssss')
                    console.log(__edges)
                    
                    this.props.onDeleteEdge(__edges);
                    this.setState(function(prevState, props) {
                        for (let i=0; i<__edges.length; i++){
                            for (let j=prevState.tooltip.selected.edges.length-1; j>=0; j--){
                                if (prevState.tooltip.selected.edges[j].id == __edges[i]){
                                    prevState.tooltip.selected.edges.splice(j, 1);
                                    break;
                                }
                            }
                        }

                        prevState.tooltip.selected.edgesOpen = prevState.tooltip.selected.edgesOpen ? prevState.tooltip.selected.edges.length > 0 : false;
                        return prevState;
                    });
				}
            }.bind(this)
            
			xmlhttp.open("GET", '/deleteEdge?edges="' + Base64.encodeURI(JSON.stringify(__edges)) + '"', true);
			xmlhttp.send();
		}
    }.bind(this)
////////////////////////////////////////////
//
////////////////////////////////////////////

    changeConnectMode = function(){
        this.setState(function(prevState, props) {
            D3ForceSimulation.changeConnectMode();
            prevState.menu.open = false;
            return prevState;
        })
    }.bind(this)

    showOrHideImage = function() {
        this.setState(function(prevState, props) {
            D3ForceSimulation.showOrHideImage();
            prevState.tooltip.showedImage = D3ForceSimulation.showedImage;
            prevState.menu.open = false;
            return prevState;
        })
    }.bind(this)

    unselectAll = function() {
        this.setState(function(prevState, props) {
            for (let key in prevState.tooltip.selected){
                switch (key){
                    case 'nodes':
                    case 'edges':
                        for (let i=prevState.tooltip.selected[key].length-1; i>=0; i--){
                            D3ForceSimulation.Unselect(prevState.tooltip.selected[key][i]);
                            prevState.tooltip.selected[key].splice(i, 1);
                        }
                        break;
                }
            }
            prevState.menu.open = false;
            return prevState;
        });
    }

    componentDidMount()
    {
        console.log('aa');
        let el = ReactDOM.findDOMNode();
        D3ForceSimulation.create(el, 
            this.props, 
            this.state);
    }

    componentWillReceiveProps(newProps)
    {
        if (newProps.data.refreshType >= 0){
            switch (newProps.data.refreshType){
                case 0:
                    this.cards = {
                        nodes:[
                            //{data:xxx , x:xxx, y:xxx}
                        ],
                        edges:[],
                    }

                    this.unselectAll();
                    break;
                case 2:
                    break;
            }

            let el = ReactDOM.findDOMNode();
            D3ForceSimulation.update(el, this.props, this.state);
        }

        this.styleEditor.mode = -1;
    }

    componentDidUpdate()
    {
        console.log('bb');

        //     let el = ReactDOM.findDOMNode();
        //     D3ForceSimulation.update(el, this.props, this.state);
    }

    componentWillUnmount()
    {
        console.log('cc');
        // var el = ReactDOM.findDOMNode();
        // D3ForceSimulation.destroy(el);
    }

    showDialog = function(data, mode){
        this.setState(function(prevState, props) {
            prevState.dialog.open = true;
            prevState.dialog.mode = mode;
            prevState.dialog.data = data;
            return prevState;
        })
    }.bind(this)

    render() {
        let __cardElements = [];
        for (let key in this.cards){
            for (let i = 0; i < this.cards[key].length; i++){
                __cardElements.push(
                    <CardComponent 
                        mode={key == 'nodes' ? GlobalConstant.mode.node : GlobalConstant.mode.edge}
                        data={this.cards[key][i]} 
                        onClose={this.hideCard} 
                        onShowDialog={this.showDialog}
                    />
                );
            }
        }
        
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width:'100%'}} >
                <EditorDialogComponent 
                    mode={this.state.dialog.mode}
                    open={this.state.dialog.open}
                    data={this.state.dialog.data}
                    onChangeData={this.state.dialog.mode < 0 ? 
                        this.props.onAddNode 
                        : 
                        this.state.dialog.mode == GlobalConstant.mode.node ?
                            this.props.onMergeNode 
                            : 
                            this.props.onMergeEdge
                        }
                    onRequestClose={function () {
                        this.setState(function(prevState, props) {
                            prevState.dialog.open = false;
                            return prevState;
                    })}.bind(this)}
                    onMessage={this.props.onMessage}
                />
                <div style={{display: 'flex', flexDirection: 'row', flex:'1 1 auto', width:'100%'}}>
                    <div id="displayContent" 
                        style={{backgroundColor: 'Gainsboro', width:'100%', flex:'1 1 auto'}} 
                        onClick={function () {
                            if (this.styleEditor.mode != -1){
                                this.setState(function(prevState, props) {
                                    this.styleEditor.mode = -1;
                                    return prevState;
                                })
                            }
                        }.bind(this)}
                    >
                        {__cardElements}
                        <div id='menuInDisplayContent' 
                            style={{
                                left:this.state.menu.x + 'px', 
                                top: this.state.menu.y + 'px', 
                                position: 'fixed'}} 
                        />
                        <Popover
                            open={this.state.menu.open}
                            anchorEl={this.state.menu.anchorEl}
                            anchorOrigin={{horizontal:"left",vertical:"bottom"}}
                            targetOrigin={{horizontal:"left",vertical:"top"}}
                            onRequestClose={function () {
                                this.setState(function(prevState, props) {
                                    prevState.menu.open = false;
                                    return prevState;
                                });
                            }.bind(this)}
                            // animated={false}
                        >
                            <Menu desktop={true}
                                onChange={
                                    function(event, value) {
                                        switch (value){
                                            case 'Show Views':{
                                                this.setState(function(prevState, props) {
                                                    prevState.menu.open = false;
                                                    return prevState;
                                                })

                                                let __count = 0;
                                                this.state.tooltip.selected.nodes.map((node, index)=>{
                                                    this.showCard(node, {mode: GlobalConstant.mode.node, x: index * 30, y: index * 30})
                                                    __count++;
                                                })

                                                this.state.tooltip.selected.edges.map((edge, index)=>{
                                                    this.showCard(edge, {mode: GlobalConstant.mode.edge, x: __count * 30, y: __count * 30})
                                                    __count++;
                                                })
                                                break;
                                            }
                                            case 'Hide Views':
                                                this.setState(function(prevState, props) {
                                                    this.cards = {
                                                        nodes:[],
                                                        edges:[],
                                                    };
                                                    prevState.menu.open = false;
                                                    return prevState;
                                                });
                                                break;
                                            case 'New Node':
                                                this.setState(function(prevState, props) {
                                                    prevState.menu.open = false;
                                                    return prevState;
                                                })
                                                this.showDialog({}, -1)
                                                break;
                                            case 'Connect Mode':
                                                this.changeConnectMode();
                                                break;
                                            case 'Show Image':
                                                this.showOrHideImage();
                                                break;
                                            case 'Select All':
                                                D3ForceSimulation.SelectAll(this.state)
                                                this.setState(function(prevState, props) {
                                                    prevState.menu.open = false;
                                                    return prevState;
                                                })
                                                break;
                                            case 'Unselect All':
                                                this.unselectAll();
                                                break;
                                            case 'Delete':
                                                this.preDeleteNodesAndEdges([...this.state.tooltip.selected.nodes], [...this.state.tooltip.selected.edges])
                                                break;
                                        }
                                    }.bind(this)
                                }
                            >
                                <MenuItem value="New Node" primaryText="New Node" leftIcon={<ImageControlPoint />} />
                                <Divider />
                                <MenuItem 
                                    value="Connect Mode" 
                                    primaryText="Connect Mode" 
                                    leftIcon={<SocialShare />} 
                                    rightIcon={D3ForceSimulation.connectMode >= 0 ? <ActionDone /> : ''} />
                                <MenuItem 
                                    value="Show Image" 
                                    primaryText="Show Image" 
                                    leftIcon={<ImageFilter />}
                                    rightIcon={this.state.tooltip.showedImage ? <ActionDone /> : ''} />
                                <Divider />
                                <MenuItem value="Show Views" primaryText="Show Views" leftIcon={<RemoveRedEye />} />
                                <MenuItem value="Hide Views" primaryText="Hide Views" leftIcon={<ActionVisibilityOff />} />
                                <MenuItem value="Select All" primaryText="Select All" leftIcon={<ActionToll />} />
                                <MenuItem value="Unselect All" primaryText="Unselect All" leftIcon={<NotificationDoNotDisturb />} />
                                <Divider />
                                <MenuItem value="Delete" primaryText="Delete" leftIcon={<Delete />} />
                            </Menu>
                        </Popover>
                        {D3ForceSimulation.connectMode >= 0 ?
                            <div id='talkBubble' style={{right:'60px', top:'3px'}} >
                                <div
                                    style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingRight: '8px',
                                    borderRadius: '3px',
                                    backgroundColor: 'Gainsboro',
                                    margin: '3px',
                                    height: '34px'
                                }}>
                                    <AutoComplete
                                        hintText="Relationship Type"
										errorStyle={{fontSize: '10px', lineHeight:'0px'}}
                                        searchText={this.state.tooltip.relationshipType}
                                        onUpdateInput={(searchText)=>{
                                            this.setState(function(prevState, props) {
                                                prevState.tooltip.relationshipType = searchText;
                                                return prevState;
                                            });
                                        }}
                                        onNewRequest={(value)=>{
                                            this.setState(function(prevState, props) {
                                                prevState.tooltip.relationshipType = value;
                                                return prevState;
                                            });
                                        }}
                                        dataSource={GlobalConstant.relationshipTypeList}
                                        filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
                                        openOnFocus={false}
                                        maxSearchResults={6}
                                        style={{width:'190px'}} 
                                        textFieldStyle={{width:'190px'}} 
                                        errorText={GlobalFunction.CheckName(this.state.tooltip.relationshipType)}
                                        //inputStyle={{fontSize: '12px'}}
                                    />
                                </div>
                            </div>
                            :
                            ''
                        }
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', flex:'0 0 auto'}} >
                        <IconButton 
                            tooltip="Connect Mode"
                            style={D3ForceSimulation.connectMode >= 0 ? {backgroundColor:'YellowGreen', borderBottom: '1px solid #ddd'} : {borderBottom: '1px solid #ddd'}}
                            hoveredStyle={{backgroundColor:'SkyBlue'}}
                            onClick={this.changeConnectMode}
                        >
                            <SocialShare />
                        </IconButton>
                        <IconButton 
                            tooltip="Show Image"
                            style={this.state.tooltip.showedImage ? {backgroundColor:'YellowGreen', borderBottom: '1px solid #ddd'} : {borderBottom: '1px solid #ddd'}}
                            hoveredStyle={{backgroundColor:'SkyBlue'}}
                            onClick={this.showOrHideImage}
                        >
                            <ImageFilter />
                        </IconButton>
                        <IconButton 
                            style={{borderBottom: '1px solid #ddd',}}
                            hoveredStyle={{backgroundColor:'SkyBlue'}}
                            tooltip="New Node"
                            onClick={function() {
                                D3ForceSimulation.removeConncetLine();
                                this.showDialog({}, -1);
                            }.bind(this)}
                        >
                            <ImageControlPoint />
                        </IconButton>
                        <IconButton 
                            tooltip="Nodes"
                            id='iconButton_selectedNodes'
                            style={{borderBottom: '1px solid #ddd',}}
                            hoveredStyle={{backgroundColor:'SkyBlue'}}
                            onClick={()=>{
                                if (this.state.tooltip.selected.nodes.length > 0){
                                    D3ForceSimulation.removeConncetLine();
                                    this.setState(function(prevState, props) {
                                        prevState.tooltip.selected.nodesOpen = true;
                                        prevState.tooltip.selected.nodesEl = document.getElementById('iconButton_selectedNodes');
                                        return prevState;
                                    });
                                }
                            }}>
                            <ImagePanoramaFishEye />
                        </IconButton>
                        <IconButton 
                            id='iconButton_selectedEdges'
                            style={{borderBottom: '1px solid #ddd',}}
                            tooltip="Relationships"
                            hoveredStyle={{backgroundColor:'SkyBlue'}}
                            onClick={()=>{
                                if (this.state.tooltip.selected.edges.length > 0){
                                    D3ForceSimulation.removeConncetLine();
                                    this.setState(function(prevState, props) {
                                        prevState.tooltip.selected.edgesOpen = true;
                                        prevState.tooltip.selected.edgesEl = document.getElementById('iconButton_selectedEdges');
                                        return prevState;
                                    });
                                }
                            }}>
                            <CommunicationCallMade />
                        </IconButton>
                        <IconButton 
                            tooltip="Info"
                            style={{borderBottom: '1px solid #ddd',}}
                            hoveredStyle={{backgroundColor:'SkyBlue'}}
                            onClick={()=>{console.log(this.props.data)}}>
                            <NotificationPriorityHigh />
                        </IconButton>
                        
                        {/* /////////////////////////////////////////
                        //  selected nodes
                        ///////////////////////////////////////// */}
                        <Popover
                            open={this.state.tooltip.selected.nodesOpen}
                            anchorEl={this.state.tooltip.selected.nodesEl}
                            anchorOrigin={{horizontal:"left",vertical:"center"}}
                            targetOrigin={{horizontal:"right",vertical:"top"}}
                            onRequestClose={function () {
                                this.setState(function(prevState, props) {
                                    prevState.tooltip.selected.nodesOpen = false;
                                    return prevState;
                                });
                            }.bind(this)}
                        >
                            <Menu desktop={true}>
                                {/* /////////////////////// Remove all and Delete all ///////////////////////// */}
                                <IconButton 
                                    style={{
                                        padding:'0px',
                                        width: '24px',
                                        height: '24px'
                                    }}
                                    iconStyle={{fill:'rgba(0, 0, 0, 0.4)'}}
                                    onClick={() =>{
                                        this.setState(function(prevState, props) {
                                            for (let i=prevState.tooltip.selected.nodes.length-1; i>=0; i--){
                                                D3ForceSimulation.Unselect(prevState.tooltip.selected.nodes[i]);
                                                prevState.tooltip.selected.nodes.splice(i, 1);
                                            }
                                            prevState.tooltip.selected.nodesOpen = false;
                                            return prevState;
                                        });
                                    }}
                                >
                                    <ActionDelete />
                                </IconButton>
                                {this.state.tooltip.selected.nodes.map((node, index)=>(
                                    <div
                                        style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingRight: '8px',
                                        borderRadius: '10px',
                                        backgroundColor: 'Gainsboro',
                                        margin: '3px',
                                        height: '20px'
                                    }}>
                                        <Avatar src={D3ForceSimulation.getNodeStyle(node.labels[0]).icon} 
                                            className='labelAvatar'
                                        />
                                        <span 
                                            onClick={()=>D3ForceSimulation.ScreenMoveTo(node)}
                                            style={{fontSize: '12px', marginRight: '10px', cursor:'pointer'}}
                                        >
                                            {this.nodeToStrForMessage(node, false)}
                                        </span>
                                        
                                        <IconButton 
                                            style={{
                                                padding:'0px',
                                                width: '24px',
                                                height: '24px'
                                            }}
                                            iconStyle={{fill:'rgba(0, 0, 0, 0.4)'}}
                                            onClick={()=>this.showCard(node, {mode: GlobalConstant.mode.node, x: index * 30, y: index * 30})}
                                        >
                                            <RemoveRedEye />
                                        </IconButton>
                                        <IconButton 
                                            style={{
                                                padding:'0px',
                                                width: '24px',
                                                height: '24px'
                                            }}
                                            iconStyle={{fill:'rgba(0, 0, 0, 0.4)'}}
                                            onClick={()=>this.preDeleteNodes([node])}
                                        >
                                            <ContentRemoveCircleOutline />
                                        </IconButton>
                                        <IconButton 
                                            style={{
                                                padding:'0px',
                                                width: '24px',
                                                height: '24px'
                                            }}
                                            iconStyle={{fill:'rgba(0, 0, 0, 0.4)'}}
                                            onClick={() =>{
                                                this.setState(function(prevState, props) {
                                                    for (let i=0; i<prevState.tooltip.selected.nodes.length; i++){
                                                        if (prevState.tooltip.selected.nodes[i].id == node.id){
                                                            prevState.tooltip.selected.nodes.splice(i, 1);
                                                            break;
                                                        }
                                                    }
                                                    D3ForceSimulation.Unselect(node);
                                                    prevState.tooltip.selected.nodesOpen = prevState.tooltip.selected.nodes.length > 0;
                                                    return prevState;
                                                });
                                            }}
                                        >
                                            <Clear style={{height: '24px', width: '24px',}} />
                                        </IconButton>
                                    </div>
                                ))}
                            </Menu>
                        </Popover>

                        {/* /////////////////////////////////////////
                        //  selected edges
                        ///////////////////////////////////////// */}
                        <Popover
                            open={this.state.tooltip.selected.edgesOpen}
                            anchorEl={this.state.tooltip.selected.edgesEl}
                            anchorOrigin={{horizontal:"left",vertical:"center"}}
                            targetOrigin={{horizontal:"right",vertical:"top"}}
                            onRequestClose={function () {
                                this.setState(function(prevState, props) {
                                    prevState.tooltip.selected.edgesOpen = false;
                                    return prevState;
                                });
                            }.bind(this)}
                        >
                            <Menu desktop={true}>
                                {/* /////////////////////// Remove all and Delete all ///////////////////////// */}
                                <IconButton 
                                    style={{
                                        padding:'0px',
                                        width: '24px',
                                        height: '24px'
                                    }}
                                    iconStyle={{fill:'rgba(0, 0, 0, 0.4)'}}
                                    onClick={() =>{
                                        this.setState(function(prevState, props) {
                                            for (let i=prevState.tooltip.selected.edges.length-1; i>=0; i--){
                                                D3ForceSimulation.Unselect(prevState.tooltip.selected.edges[i]);
                                                prevState.tooltip.selected.edges.splice(i, 1);
                                            }
                                            prevState.tooltip.selected.edgesOpen = false;
                                            return prevState;
                                        });
                                    }}
                                >
                                    <ActionDelete />
                                </IconButton>
                                {/* //////////////////////////////////////////////// */}
                                {this.state.tooltip.selected.edges.map((edge, index)=>(
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            paddingRight: '8px',
                                            borderRadius: '3px',
                                            backgroundColor: 'Gainsboro',
                                            margin: '3px',
                                            height: '20px'
                                    }}>
                                        <Avatar 
                                            className='edgeAvatar'
                                            style={{
                                                marginRight:'6px', 
                                                backgroundColor:D3ForceSimulation.getEdgeStyle(edge.type).color
                                            }}
                                        />
                                        <span 
                                            onClick={()=>{D3ForceSimulation.ScreenMoveTo(edge);}}
                                            style={{fontSize: '12px', marginRight: '10px', cursor:'pointer'}}
                                        >
                                            {this.edgeToStrForMessage(edge, false)}
                                        </span>

                                        <IconButton 
                                            style={{
                                                padding:'0px',
                                                width: '24px',
                                                height: '24px'
                                            }}
                                            iconStyle={{fill:'rgba(0, 0, 0, 0.4)'}}
                                            onClick={()=>this.showCard(edge, {mode: GlobalConstant.mode.edge, x: index * 30, y: index * 30})}
                                        >
                                            <RemoveRedEye />
                                        </IconButton>
                                        <IconButton 
                                            style={{
                                                padding:'0px',
                                                width: '24px',
                                                height: '24px'
                                            }}
                                            iconStyle={{fill:'rgba(0, 0, 0, 0.4)'}}
                                            onClick={()=>this.perDeleteEdges([edge])}
                                        >
                                            <ContentRemoveCircleOutline />
                                        </IconButton>
                                        <IconButton 
                                            style={{
                                                padding:'0px',
                                                width: '24px',
                                                height: '24px'
                                            }}
                                            iconStyle={{fill:'rgba(0, 0, 0, 0.4)'}}
                                            onClick={() =>{
                                                this.setState(function(prevState, props) {
                                                    for (let i=0; i<prevState.tooltip.selected.edges.length; i++){
                                                        if (prevState.tooltip.selected.edges[i].id == edge.id){
                                                            prevState.tooltip.selected.edges.splice(i, 1);
                                                            break;
                                                        }
                                                    }
                                                    D3ForceSimulation.Unselect(edge);
                                                    prevState.tooltip.selected.edgesOpen = prevState.tooltip.selected.edges.length > 0;
                                                    return prevState;
                                                });
                                            }}
                                        >
                                            <Clear style={{height: '24px', width: '24px',}} />
                                        </IconButton>
                                    </div>
                                ))}
                            </Menu>
                        </Popover>

                        {/* /////////////////////////////////////////
                        //  Badge nodes
                        ///////////////////////////////////////// */}
                        {this.state.tooltip.selected.nodes.length > 0 ?
                            <div
                                style={{
                                    position: 'absolute',
                                    padding: '0 2px 0 2px',
                                    borderRadius: '5px',
                                    backgroundColor: 'tomato',
                                    height: '13px',
                                    fontSize: '12px',
                                    textAlign: 'center',
                                    top: '147px',
                                    right: '1px',
                                    color: 'beige',
                                    fontFamily: 'Roboto, sans-serif'
                                }}>
                                {this.state.tooltip.selected.nodes.length}
                            </div>
                            :
                            ''
                        }

                        {/* /////////////////////////////////////////
                        //  Badge edges
                        ///////////////////////////////////////// */}
                        {this.state.tooltip.selected.edges.length > 0 ?
                            <div
                                style={{
                                    position: 'absolute',
                                    padding: '0 2px 0 2px',
                                    borderRadius: '5px',
                                    backgroundColor: 'tomato',
                                    height: '13px',
                                    fontSize: '12px',
                                    textAlign: 'center',
                                    top: '195px',
                                    right: '1px',
                                    color: 'beige',
                                    fontFamily: 'Roboto, sans-serif'
                                }}>
                                {this.state.tooltip.selected.edges.length}
                            </div>
                            :
                            ''
                        }
                    </div>
                </div>
                <EditStyleComponent 
                    data={this.props.data.count}
                    parameter={this.styleEditor}
                    onChange={function(){
                        this.setState(function(prevState, props) {
                            return prevState;
                        });
                    }.bind(this)}
                />
            </div>
        )
    }
}