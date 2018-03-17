import React from 'react';
import ReactDOM from 'react-dom';
import CardComponent from './CardComponent';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import {D3ForceSimulation} from './D3ForceSimulation';
import EditorDialogsComponent from './EditorDialogsComponent';
import EditEdgeComponent from './EditEdgeComponent';
import EditNodeComponent from './EditNodeComponent';

import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import FontIcon from 'material-ui/FontIcon';

import Popover from 'material-ui/Popover/Popover';
import { SketchPicker } from 'react-color';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

const defaultIcon = 'icons/default/ic_add_to_queue_24px.svg';

export default class GraphForDataComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards:[],
            showCard: this.showCard,
            menu: {
                open: false,
                x: 0,
                y: 0,
                anchorEl: null
            },
            barOfNE:{
                mode: 0, // 0:empty 1:node 2:edge
                name: '',
            }
        };

        //this.getStyles();
    }

    NEStyles = {
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
    }

    updateFlag = true;

    checkStyleOfNode = function (label){
        if (!this.NEStyles.nodes.hasOwnProperty(label)){
            this.NEStyles.nodes[label] = {
                icon: defaultIcon,
                size: 50,
                caption: 'name',
            }
        }
    }

    checkStyleOfEdge = function (label){
        if (!this.NEStyles.edges.hasOwnProperty(label)){
            this.NEStyles.edges[label] = {
                color: '#000000'
            }
        }
    }

    setIconInBar = function (label, icon){
        this.checkStyleOfEdge(label);
        this.NEStyles.nodes[label].icon = icon;
        D3ForceSimulation.setStyle(this.props, this.state, this.NEStyles, 'icon');
    }.bind(this)

    setColorInBar = function (label, hex){
        this.checkStyleOfEdge(label);
        this.NEStyles.edges[label].color = hex;
        D3ForceSimulation.setStyle(this.props, this.state, this.NEStyles, 'color');
    }.bind(this)

    setCaptionInBar = function (label, propertyName){
        this.checkStyleOfNode(label);
        this.NEStyles.nodes[label].caption = propertyName;
        D3ForceSimulation.setStyle(this.props, this.state, this.NEStyles, 'caption');
    }.bind(this)

    setSizeInBar = function (label, size){
        if (!isNaN(Number(size))){
            size = Number(size);
            this.checkStyleOfNode(label);
            this.NEStyles.nodes[label].size = size;

            D3ForceSimulation.setStyle(this.props, this.state, this.NEStyles, 'size');
        }
    }.bind(this)

    getStyles = function() {
        let xmlhttp = new XMLHttpRequest()
        
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
				let __json = JSON.parse(xmlhttp.responseText);
				
                this.NEStyles = __json.styles;
            }
        }.bind(this)

        xmlhttp.open("GET", "/style", true);
        xmlhttp.send();
	}.bind(this)

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

    showCard = function(d) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == d.id){
                return;
            }
        }

        this.updateFlag = false;
        this.setState(function(prevState, props) {
            prevState.cards.push(d);
            return prevState;
        });
    }.bind(this);

    hideCard = function(id) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == id){
                this.updateFlag = false;
                this.setState(function(prevState, props) {
                    prevState.cards.splice(index, 1);
                    return prevState;
                });
            }
        }
    }.bind(this)

    componentDidMount()
    {
        console.log('aa');
        let el = ReactDOM.findDOMNode();
        D3ForceSimulation.create(el, 
            this.props, 
            this.state);
    }

    componentDidUpdate()
    {
        console.log('bb');

        if(this.updateFlag){
            let el = ReactDOM.findDOMNode();
            D3ForceSimulation.update(el, this.props, this.state, this.NEStyles);
        }
    }

    componentWillUnmount()
    {
        console.log('cc');
        // var el = ReactDOM.findDOMNode();
        // D3ForceSimulation.destroy(el);
    }

    render() {
        let __cardElements=[];
        for (let i = 0; i < this.state.cards.length; i++){
            __cardElements.push(<CardComponent nodeData={this.state.cards[i]} closeCard={this.hideCard} />);
        }

        let __nodeChip = [];
        for (let key in this.props.data.count.nodes){
            if (!this.NEStyles.nodes.hasOwnProperty(key) && key!='*'){
                this.NEStyles.nodes[key] = {
                    icon: defaultIcon,
                    size: 50,
                    caption: this.props.data.count.nodes[key].propertiesList.length > 1 ? 
                        this.props.data.count.nodes[key].propertiesList[1] :
                        this.props.data.count.nodes[key].propertiesList[0]
                };
            }

            //////////////////////////////////////////////
            __nodeChip.push(<Chip 
                className="labelChip" 
                labelStyle={{fontSize: '12px'}}
                onClick={key != '*' ? 
                    function(){
                        if (this.state.barOfNE.mode != 1
                            || this.state.barOfNE.name != key){

                            this.updateFlag = false;
                            this.setState(function(prevState, props) {
                                prevState.barOfNE.mode = 1; // 0:empty 1:node 2:edge
                                prevState.barOfNE.name = key;
                                
                                return prevState;
                            });
                        }
                    }.bind(this) 
                    :
                    null}
                >
                    {key != '*' ?
                        <Avatar src={defaultIcon} style={{width:'25px', height:'25px', marginLeft:'6px', borderRadius:'0%', backgroundColor:'#00000000'}} />
                        : ''
                    }
                    {key + '(' + this.props.data.count.nodes[key].total + ')'}
                </Chip>);
        }

        let __edgeChip = [];
        for (let key in this.props.data.count.edges){
            if (!this.NEStyles.edges.hasOwnProperty(key) && key!='*'){
                this.NEStyles.edges[key] = {
                    color: '#000000'
                };
            }
            //////////////////////////////////////////////

            __edgeChip.push(<Chip 
                className="edgeChip" 
                labelStyle={{fontSize: '12px'}}
                onClick={key != '*' ? 
                    function(){
                        if (this.state.barOfNE.mode != 2
                            || this.state.barOfNE.name != key){

                            this.updateFlag = false;
                            this.setState(function(prevState, props) {
                                prevState.barOfNE.mode = 2; // 0:empty 1:node 2:edge
                                prevState.barOfNE.name = key;
                                
                                return prevState;
                            });
                        }
                    }.bind(this) 
                    :
                    null}
                >
                    {key + '(' + this.props.data.count.edges[key] + ')'}
                </Chip>);
        }
        
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width:'100%'}} >
                <EditorDialogsComponent />
                <div id="displayContent" 
                    style={{backgroundColor: '#EEEEEE', width:'100%', flex:'1 1 auto'}} 
                    onClick={() => {
                        if (this.state.barOfNE.mode !=0){
                            this.updateFlag = false;
                            this.setState(function(prevState, props) {
                                prevState.barOfNE.mode = 0;
                                return prevState;
                            });
                        }
                    }}
                    onContextMenu={this.handleClick}>
                    {/* {__menu} */}
                    <div id='menuInDisplayContent' 
                        style={{
                            left:this.state.menu.x + 'px', 
                            top: this.state.menu.y + 'px', 
                            position: 'fixed'}} />
                    
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
                        }}
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
                    {__cardElements}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', flex:'0 0 auto'}} >
                    {/* <FlatButton label={this.props.data.statement} labelPosition="before" containerElement="label" /> */}
                    <FlatButton label='AA' labelPosition="before" containerElement="label" style={{alignSelf: 'flex-end'}} onClick={D3ForceSimulation.showOrHideImage} />
                    <FlatButton label='BB' labelPosition="before" containerElement="label" style={{alignSelf: 'flex-end'}} onClick={D3ForceSimulation.showOrHideImage} />
                </div>
                <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
                    {__nodeChip}
                </div>
                <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
                    {__edgeChip}
                </div>
                {this.state.barOfNE.mode == 1 ? ///////////////////  editMode  /////////////////////////
                    <EditNodeComponent 
                        size={this.NEStyles.nodes[this.state.barOfNE.name].size}
                        caption={this.NEStyles.nodes[this.state.barOfNE.name].caption}
                        icon={this.NEStyles.nodes[this.state.barOfNE.name].icon}
                        data={this.props.data.count.nodes} 
                        chipName={this.state.barOfNE.name} 
                        onIconChange={this.setIconInBar}
                        onCaptionChange={this.setCaptionInBar}
                        onSizeChange={this.setSizeInBar} />
                : this.state.barOfNE.mode == 2 ?
                    <EditEdgeComponent 
                        color={this.NEStyles.edges[this.state.barOfNE.name].color}
                        data={this.props.data.count.edges} 
                        chipName={this.state.barOfNE.name} 
                        onChange={this.setColorInBar} />
                :
                    <div></div>}
            </div>
        )
    }
}