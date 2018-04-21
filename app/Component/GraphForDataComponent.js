import React from 'react';
import ReactDOM from 'react-dom';
import CardComponent from './CardComponent';
import {D3ForceSimulation} from './D3ForceSimulation';
import EditStyleComponent from './EditStyleComponent';
import GlobalConstant from '../Common/GlobalConstant';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Clear from 'material-ui/svg-icons/content/clear';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import ImagePhotoLibrary from 'material-ui/svg-icons/image/photo-library';
import ImageControlPoint from 'material-ui/svg-icons/image/control-point';
import ImageFilter from 'material-ui/svg-icons/image/filter';
import SocialShare from 'material-ui/svg-icons/social/share';
import ContentRemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
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
            selectNode: this.selectNode,
            selectEdge: this.selectEdge,
            menu: {
                open: false,
                x: 0,
                y: 0,
                anchorEl: null
            },
            tooltip:{
                connectMode: false,
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

    updateFlag = true;
    cards = {
        nodes:[
            //{data:xxx , x:xxx, y:xxx}
        ],
        edges:[],
    }

    handleClick = function(event) {
        // This prevents ghost click.
        event.preventDefault();
            
        let __x = event.clientX;
        let __y = event.clientY;

        this.updateFlag = false;
        this.setState(function(prevState, props) {
            prevState.menu = {
                open: true,
                x: __x,
                y: __y,
                anchorEl: document.getElementById('menuInDisplayContent')
            };
            return prevState;
        });
    }.bind(this)

    selectNode = function(d){
        this.updateFlag = false;
        this.setState(function(prevState, props) {
            for (let i=0; i<prevState.tooltip.selected.nodes.length; i++){
                if (d.id == prevState.tooltip.selected.nodes[i].id){
                    prevState.tooltip.selected.nodes.splice(i, 1);
                    return prevState;
                }
            }

            prevState.tooltip.selected.nodes.push(d);
            return prevState;
        });
    }.bind(this);
    
    selectEdge = function(d){
        this.updateFlag = false;
        this.setState(function(prevState, props) {
            for (let i=0; i<prevState.tooltip.selected.edges.length; i++){
                if (d.id == prevState.tooltip.selected.edges[i].id){
                    prevState.tooltip.selected.edges.splice(i, 1);
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

        this.updateFlag = false;
        this.setState(function(prevState, props) {
            this.cards[__mode].push({data:d, x:para.x, y:para.y});
            return prevState;
        });
    }.bind(this);

    hideCard = function(id, mode) {
        let __mode = mode == GlobalConstant.mode.node ? 'nodes' : 'edges';
        for (let index in this.cards[__mode]){
            if (this.cards[__mode][index].data.id == id){
                this.updateFlag = false;
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

    deleteNodes = function(nodes){
        let __nodes = [];
        for (let i=0; i<nodes.length; i++){
            __nodes.push(nodes[i].id);
        }

        if (__nodes.length > 0){
            let xmlhttp = new XMLHttpRequest()
            
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState==4 && xmlhttp.status==200){
                    console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
                    let __nodes = JSON.parse(xmlhttp.responseText);
                    console.log('ssssssssssssssssssssssssssssssssssssssss')
                    
                    this.updateFlag = true;
                    this.props.onDeleteNode(__nodes);
                    this.updateFlag = false;
                    this.setState(function(prevState, props) {
                        let __b = false;
                        for (let i=0; i<nodes.length; i++){
                            for (let j=prevState.tooltip.selected.nodes.length-1; j>=0; j--){
                                if (prevState.tooltip.selected.nodes[j].id == nodes[i].id){
                                    for (let k=prevState.tooltip.selected.edges.length-1; k>=0; k--){
                                        __b = false;
                                        for (let l=nodes[i].sourceEdges.length-1; l>=0; l--){
                                            if (nodes[i].sourceEdges[l].id == prevState.tooltip.selected.edges[k]){
                                                prevState.tooltip.selected.edges.splice(k, 1);
                                                __b = true;
                                                break;
                                            }
                                        }

                                        if (__b){
                                            continue;
                                        }

                                        for (let l=nodes[i].targetEdges.length-1; l>=0; l--){
                                            if (nodes[i].targetEdges[l].id == prevState.tooltip.selected.edges[k]){
                                                prevState.tooltip.selected.edges.splice(k, 1);
                                                break;
                                            }
                                        }
                                    }

                                    prevState.tooltip.selected.nodes.splice(j, 1);
                                    break;
                                }
                            }
                        }

                        prevState.tooltip.selected.nodesOpen = prevState.tooltip.selected.nodes.length > 0;
                        return prevState;
                    });
                }
            }.bind(this)
            
			xmlhttp.open("GET", '/deleteNode?nodes="' + Base64.encodeURI(JSON.stringify(__nodes)) + '"', true);
            xmlhttp.send();
        }
    }.bind(this)

    deleteEdges = function(edges){
		let __edges = [];
		for (let i=0; i<edges.length; i++){
            __edges.push(edges[i].id);
		}

		if (__edges.length > 0){
			let xmlhttp = new XMLHttpRequest()
			
			xmlhttp.onreadystatechange = function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
					let __json = JSON.parse(xmlhttp.responseText);
					console.log('ssssssssssssssssssssssssssssssssssssssss')
                    console.log(__edges)
                    
                    this.updateFlag = true;
                    this.props.onDeleteEdge(__edges);
                    this.updateFlag = false;
                    this.setState(function(prevState, props) {
                        for (let i=0; i<__edges.length; i++){
                            for (let j=prevState.tooltip.selected.edges.length-1; j>=0; j--){
                                if (prevState.tooltip.selected.edges[j].id == __edges[i]){
                                    prevState.tooltip.selected.edges.splice(j, 1);
                                    break;
                                }
                            }
                        }

                        prevState.tooltip.selected.edgesOpen = prevState.tooltip.selected.edges.length > 0;
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
        this.updateFlag = true;
    }

    componentDidUpdate()
    {
        console.log('bb');

        if(this.updateFlag){
            let el = ReactDOM.findDOMNode();
            D3ForceSimulation.update(el, this.props, this.state);
        }
    }

    componentWillUnmount()
    {
        console.log('cc');
        // var el = ReactDOM.findDOMNode();
        // D3ForceSimulation.destroy(el);
    }

    showDialog = function(data, mode){
        this.setState(function(prevState, props) {
            this.updateFlag = false;
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
                        this.updateFlag = false;
                        this.setState(function(prevState, props) {
                            prevState.dialog.open = false;
                            return prevState;
                    })}.bind(this)}
                    onMessage={this.props.onMessage}
                />
                <div style={{display: 'flex', flexDirection: 'row', flex:'1 1 auto', width:'100%'}}>
                    <div id="displayContent" 
                        style={{backgroundColor: 'Gainsboro', width:'100%', flex:'1 1 auto'}} 
                        onContextMenu={this.handleClick}>
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
                                this.updateFlag = false;
                                this.setState(function(prevState, props) {
                                    prevState.menu.open = false;
                                    return prevState;
                                });
                            }.bind(this)}
                            // animated={false}
                        >
                            <Menu desktop={true}>
                                <MenuItem primaryText="Preview" leftIcon={<RemoveRedEye />} />
                                <MenuItem primaryText="Share" leftIcon={<PersonAdd />} />
                                <MenuItem primaryText="Get links" leftIcon={<ContentLink />} />
                                <Divider />
                                <MenuItem primaryText="Make a copy" leftIcon={<ContentCopy />} />
                                <MenuItem primaryText="Download" leftIcon={<Download />} />
                                <Divider />
                                <MenuItem primaryText="Remove" leftIcon={<Delete />} />
                            </Menu>
                        </Popover>
                        {this.state.tooltip.connectMode ?
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
                                        searchText={this.state.tooltip.relationshipType}
                                        onUpdateInput={(searchText)=>{
                                            this.updateFlag = false;
                                            this.setState(function(prevState, props) {
                                                prevState.tooltip.relationshipType = searchText;
                                                return prevState;
                                            });
                                        }}
                                        onNewRequest={(value)=>{
                                            this.updateFlag = false;
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
                            style={this.state.tooltip.connectMode ? {backgroundColor:'YellowGreen', borderBottom: '1px solid #ddd'} : {borderBottom: '1px solid #ddd'}}
                            hoveredStyle={{backgroundColor:'SkyBlue'}}
                            onClick={() => {this.setState(function(prevState, props) {
                                this.updateFlag = false;
                                D3ForceSimulation.changeConnectMode();
                                prevState.tooltip.connectMode = D3ForceSimulation.connectMode;
                                return prevState;
                            })}}
                        >
                            <SocialShare />
                        </IconButton>
                        <IconButton 
                            tooltip="Show Image"
                            style={this.state.tooltip.showedImage ? {backgroundColor:'YellowGreen', borderBottom: '1px solid #ddd'} : {borderBottom: '1px solid #ddd'}}
                            hoveredStyle={{backgroundColor:'SkyBlue'}}
                            onClick={() => {this.setState(function(prevState, props) {
                                this.updateFlag = false;
                                D3ForceSimulation.showOrHideImage();
                                prevState.tooltip.showedImage = D3ForceSimulation.showedImage;
                                return prevState;
                            })}}
                        >
                            <ImageFilter />
                        </IconButton>
                        <IconButton 
                            style={{borderBottom: '1px solid #ddd',}}
                            hoveredStyle={{backgroundColor:'SkyBlue'}}
                            tooltip="New Node"
                            onClick={function() {this.showDialog({}, -1)}.bind(this)}
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
                                    this.updateFlag = false;
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
                                    this.updateFlag = false;
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
                            tooltip="Delete"
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
                                this.updateFlag = false;
                                this.setState(function(prevState, props) {
                                    prevState.tooltip.selected.nodesOpen = false;
                                    return prevState;
                                });
                            }.bind(this)}
                        >
                            <Menu desktop={true}>
                                <IconButton 
                                    style={{
                                        padding:'0px',
                                        width: '24px',
                                        height: '24px'
                                    }}
                                    iconStyle={{fill:'rgba(0, 0, 0, 0.4)'}}
                                    onClick={() =>{
                                        this.updateFlag = false;
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
                                            style={{
                                                width:'23px', 
                                                height:'23px', 
                                                marginLeft:'6px', 
                                                borderRadius:'0%', 
                                                backgroundColor:'#00000000'}} 
                                        />
                                        <span 
                                            onClick={()=>D3ForceSimulation.ScreenMoveTo(node)}
                                            style={{fontSize: '12px', marginRight: '10px', cursor:'pointer'}}
                                        >
                                            {node.labels[0] + ' {id:'+ node.id + ', ' + 
                                                    D3ForceSimulation.getNodeStyle(node.labels[0]).caption + ':' +
                                                    node.properties[D3ForceSimulation.getNodeStyle(node.labels[0]).caption]+'}'}
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
                                            onClick={()=>this.deleteNodes([node])}
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
                                                this.updateFlag = false;
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
                                this.updateFlag = false;
                                this.setState(function(prevState, props) {
                                    prevState.tooltip.selected.edgesOpen = false;
                                    return prevState;
                                });
                            }.bind(this)}
                        >
                            <Menu desktop={true}>
                                <IconButton 
                                    style={{
                                        padding:'0px',
                                        width: '24px',
                                        height: '24px'
                                    }}
                                    iconStyle={{fill:'rgba(0, 0, 0, 0.4)'}}
                                    onClick={() =>{
                                        this.updateFlag = false;
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
                                        <span 
                                            onClick={()=>{D3ForceSimulation.ScreenMoveTo(edge);}}
                                            style={{fontSize: '12px', marginRight: '10px', cursor:'pointer'}}
                                        >
                                            {edge.type + ' {id:'+ edge.id +'}'}
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
                                            onClick={()=>this.deleteEdges([edge])}
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
                                                this.updateFlag = false;
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
                    onIconChange={this.setIconInBar}
                    onCaptionChange={this.setCaptionInBar}
                    onSizeChange={this.setSizeInBar}
                    onChange={this.setColorInBar}
                />
            </div>
        )
    }
}