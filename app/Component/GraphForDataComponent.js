import React from 'react';
import ReactDOM from 'react-dom';
import CardComponent from './CardComponent';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import {D3ForceSimulation} from './D3ForceSimulation';
import EditorDialogsComponent from './EditorDialogsComponent';

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
import { SketchPicker    } from 'react-color';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
    paper: {
      display: 'inline-block',
      float: 'left',
      margin: '16px 32px 16px 0',
    },
    rightIcon: {
      textAlign: 'center',
      lineHeight: '24px',
    },
  };

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
            },//nodeAndEdge
            barOfNE:{
                mode: 1, // 0:empty 1:node 2:edge
                name: '',
                colorPicker: {
                    open: false,
                    color: '#ffffff',
                    anchorEl: null
                }
            }
        };

        this.getStyles();
    }

    NEStyles = {
        nodes: {
            //xx:{
            //  image:'a.png',
            //  size:'50',
            //}
        },
        edge: {},
    }

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

        this.setState(function(prevState, props) {
            prevState.menu = {
                open: true,
                x: __x,
                y: __y,
                anchorEl: document.getElementById('menuInDisplayContent')
            };
            return prevState;
        });
    }.bind(this);

    showCard = function(d) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == d.id){
                return;
            }
        }

        this.setState(function(prevState, props) {
            console.log(d);
            prevState.cards.push(d);
            return prevState;
        });
    }.bind(this);

    hideCard = function(id) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == id){
                this.setState(function(prevState, props) {
                    prevState.cards.splice(index, 1);
                    return prevState;
                });
            }
        }
    }.bind(this);

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
        let el = ReactDOM.findDOMNode();
        D3ForceSimulation.update(el, this.props, this.state, this.NEStyles);
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
            console.log(key);
            if (!this.NEStyles.nodes.hasOwnProperty(key)){
                this.NEStyles.nodes[key] = {
                    image: "icons/ic_add_to_queue_24px.svg",
                    size: 50
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

                            let __val = this.NEStyles.nodes.hasOwnProperty(key) ? 
                                    {
                                        mode: 1, // 0:empty 1:node 2:edge
                                        name: key,
                                        colorPicker: {
                                            open: false,
                                            color: this.NEStyles.nodes[key].color,
                                            anchorEl: null
                                    }}
                                :
                                    {
                                        mode: 1, // 0:empty 1:node 2:edge
                                        name: key,
                                        colorPicker: {
                                            open: false,
                                            color: '#ffffff',
                                            anchorEl: null
                                    }};

                            this.setState(function(prevState, props) {
                                //////////////////////////
                                // if hasOwnProperty
                                //////////////////////////
                                prevState.barOfNE = __val;
                                
                                return prevState;
                            });
                        }
                    }.bind(this) 
                    :
                    null}
                >
                    {key + '(' + this.props.data.count.nodes[key] + ')'}
                </Chip>);
        }

        let __edgeChip = [];
        for (let key in this.props.data.count.edges){
            __edgeChip.push(<Chip 
                className="edgeChip" 
                labelStyle={{fontSize: '12px'}}
                >
                    {key + '(' + this.props.data.count.edges[key] + ')'}
                </Chip>);
        }

        console.log(this.state.menu.x + 'px : ' + this.state.menu.y + 'px')
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width:'100%'}} >
                <EditorDialogsComponent />
                <div id="displayContent" 
                    style={{backgroundColor: '#EEEEEE', width:'100%', flex:'1 1 auto'}} 
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
                    <div id="footer" 
                        style={{
                            display: 'flex', 
                            flexDirection: 'row', 
                            flex:'0 0 auto',
                            alignItems:'center',
                            borderTop:'1px solid #e8e8e8'}}>
                        <Chip 
                            className="labelChip" 
                            labelStyle={{fontSize: '12px'}}
                            >
                                {this.state.barOfNE.name}
                        </Chip>
                        <span>Color:</span>
						<RaisedButton
							onClick={function(event) {
                                event.preventDefault();
                                const __target = event.currentTarget;
                                this.setState(function(prevState, props) {
                                    prevState.barOfNE.colorPicker.open = true;
                                    prevState.barOfNE.colorPicker.anchorEl = __target;
                                    return prevState;
                                });
                            }.bind(this)}
                            //label="Add Property"
                            backgroundColor={this.state.barOfNE.colorPicker.color}
							style={{width:'15px', height: '20px', margin: '12px'}}
							//primary={true}
						/>
                        
                        <Popover
                            open={this.state.barOfNE.colorPicker.open}
                            anchorEl={this.state.barOfNE.colorPicker.anchorEl}
                            anchorOrigin={{horizontal:"left", vertical:"top"}}
                            targetOrigin={{horizontal:"left", vertical:"bottom"}}
                            onRequestClose={function() {
                                this.setState(function(prevState, props) {
                                    prevState.barOfNE.colorPicker.open = false;
                                    return prevState;
                                });
                            }.bind(this)}
                            // animated={false}
                        >
                            <SketchPicker
                                color={this.state.barOfNE.colorPicker.color}
                                onChange={function({hex}){
                                    this.setState(function(prevState, props) {
                                        this.NEStyles.nodes[prevState.barOfNE.name].color = hex;
                                        prevState.barOfNE.colorPicker.color = hex;
                                        return prevState;
                                    }.bind(this));
                                }.bind(this)}
                            />
                        </Popover>
                        
                        <span>Size:</span>
                        <TextField 
                            id={'value1'}
                            //onChange={}
                            //errorText={this.state.properties[i].type == 'Number' ? isNaN(this.state.properties[i].value) ? "It's not number" : '' : ''}
                            //value={this.state.properties[i].value}
                        />
                    </div>
                : <div></div>}
                
            </div>
        )
    }
}