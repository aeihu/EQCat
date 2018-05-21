import React from 'react';
import { SketchPicker } from 'react-color';

import {D3ForceSimulation} from './D3ForceSimulation';
import GlobalVariable from '../../Common/GlobalVariable';
import GlobalConstant from '../../Common/GlobalConstant';
import GlobalFunction from '../../Common/GlobalFunction';

import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover/Popover';
import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import ContentAdd from 'material-ui/svg-icons/content/add';
import Clear from 'material-ui/svg-icons/content/clear';

export default class EditEdgeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            levelMenu: {
                property: '',
                level: [],
                open: false,
                anchorEl: null
            },
            colorPicker: {
                open: false,
                anchorEl: null
            },
        }
    }

    isError = false;
    
    checkSubmitForLevelForStroke = function(){
        for (let i=0; i<this.state.levelMenu.level.length; i+=2){
            if (i%2 == 0){
                for (let j=i+2; j<this.state.levelMenu.level.length; j+=2){
                    if (this.state.levelMenu.level[i] == this.state.levelMenu.level[j]){
                        return -1;
                    }
                }
            }
        }
        return 0;
    }

    setLevelForStroke = function (){    
        if (!GlobalFunction.ArrayEquals(this.state.levelMenu.level, D3ForceSimulation.getEdgeStyle(this.props.chipName).stroke_level)){
            switch (this.checkSubmitForLevelForStroke()){
                case -1:
                    this.isError = true;
                    this.props.onMessage('There is same level key', 0);
                    break;
                default:
                    GlobalFunction.SendAjax(
                        (result)=>{
                            this.setState(function(prevState, props) {
                                D3ForceSimulation.setStyle(GlobalConstant.mode.edge, this.props.chipName, 'stroke_level', this.state.levelMenu.level);
                                prevState.levelMenu.open = false;
                                return prevState;
                            }.bind(this));
                        },
                        (error)=>{this.props.onMessage(error.message, 0)},
                        "/setStyle?style=",
                        {
                            mode: GlobalConstant.mode.edge,
                            type: this.props.chipName,
                            property: 'stroke_level',
                            value: this.state.levelMenu.level
                        }
                    );
                    break;

            }
        }else{
            this.setState(function(prevState, props) {
                prevState.levelMenu.open = false;
                return prevState;
            }.bind(this));
        }
    }.bind(this)

    setPropertyForStroke = function(property){
        if (property != D3ForceSimulation.getEdgeStyle(this.props.chipName).stroke_property){
            GlobalFunction.SendAjax(
                (result)=>{
                    this.setState(function(prevState, props) {
                        D3ForceSimulation.setStyle(GlobalConstant.mode.edge, this.props.chipName, 'stroke_property', property);
                        return prevState;
                    }.bind(this));
                },
                (error)=>{this.props.onMessage(error.message, 0)},
                "/setStyle?style=",
                {
                    mode: GlobalConstant.mode.edge,
                    type: this.props.chipName,
                    property: 'stroke_property',
                    value: property
                }
            );
        }
    }.bind(this)

    componentDidMount()
    {
        this.setState(function(prevState, props) {
            prevState.levelMenu.level = [...D3ForceSimulation.getEdgeStyle(this.props.chipName).stroke_level];
            return prevState;
        })
    }

    componentWillReceiveProps(newProps)
    {
        if (this.isError)
            return;

        this.setState(function(prevState, props) {
            prevState.levelMenu.level = [...D3ForceSimulation.getEdgeStyle(newProps.chipName).stroke_level];
            return prevState;
        })
    }

    render() {
        let __name = typeof this.props.chipName === 'undefined' ? '' : this.props.chipName;

        let __levelItem = [];
        for (let i = 0; i < this.state.levelMenu.level.length; i+=2){
            __levelItem.push(
				<div style={{
					display: 'flex', 
					flexDirection: 'row', 
					alignItems: 'center',
					flexWrap: 'wrap',
                    marginLeft: '10px'}} 
				>
                    <Avatar
                        backgroundColor='Tomato'
                        size={16}
                        style={{marginRight:'2px'}}
                    >
                        {i * 0.5}
                    </Avatar>
                    <TextField 
                        id={'value1'}
                        style={{width:'80px', height:'32px'}}
                        inputStyle={{fontSize: '12px'}}
                        onChange={(event, newValue) => {
                            this.setState(function(prevState, props) {
                                prevState.levelMenu.level[i] = newValue;
                                return prevState;
                            })
                        }}
                        //errorText={value[0].tr ? "It's not number" : ''}
						errorStyle={{fontSize: '10px', lineHeight:'0px'}}
                        value={this.state.levelMenu.level[i]}
                    /> 
                    :
                    <IconMenu
                        anchorOrigin={{horizontal:"left", vertical:"top"}}
                        targetOrigin={{horizontal:"left", vertical:"bottom"}}
                        iconButtonElement={
                            <svg xmlns="http://www.w3.org/2000/svg"  width="120px" height="32px">
                                <g fill="none" stroke="black" stroke-width="3">
                                    <path stroke-dasharray={this.state.levelMenu.level[i+1]} d="M5 17 l115 0" />>
                                </g>
                            </svg>
                        }
                        onChange={(event, value) => {
                            this.setState(function(prevState, props) {
                                prevState.levelMenu.level[i+1] = value;
                                return prevState;
                            })
                        }}
                    >
                        <MenuItem value="0" primaryText="" >
                            <svg xmlns="http://www.w3.org/2000/svg"  width="120px" height="32px">
                                <g fill="none" stroke="black" stroke-width="3">
                                    <path stroke-dasharray="0" d="M5 17 l115 0" />>
                                </g>
                            </svg>
                        </MenuItem>
                        <MenuItem value="20,5" primaryText="" >
                            <svg xmlns="http://www.w3.org/2000/svg"  width="120px" height="32px">
                                <g fill="none" stroke="black" stroke-width="3">
                                    <path stroke-dasharray="20,5" d="M5 17 l115 0" />>
                                </g>
                            </svg>
                        </MenuItem>
                        <MenuItem value="25,5,5,5" primaryText="" >
                            <svg xmlns="http://www.w3.org/2000/svg"  width="120px" height="32px">
                                <g fill="none" stroke="black" stroke-width="3">
                                    <path stroke-dasharray="20,5,5,5" d="M5 17 l115 0" />>
                                </g>
                            </svg>
                        </MenuItem>
                        <MenuItem value="20,5,2,5,2,5,2,5" primaryText="" >
                            <svg xmlns="http://www.w3.org/2000/svg"  width="120px" height="32px">
                                <g fill="none" stroke="black" stroke-width="3">
                                    <path stroke-dasharray="20,5,5,5,5,5,5,5" d="M5 17 l115 0" />>
                                </g>
                            </svg>
                        </MenuItem>
                        <MenuItem value="2,5" primaryText="" >
                            <svg xmlns="http://www.w3.org/2000/svg"  width="120px" height="32px">
                                <g fill="none" stroke="black" stroke-width="3">
                                    <path stroke-dasharray="2,5" d="M5 17 l115 0" />>
                                </g>
                            </svg>
                        </MenuItem>
                    </IconMenu>
                    
                    <IconButton 
                        style={{
                            top:'4px',
                            padding:'0px',
                            width: '24px',
                            height: '24px'
                        }}
                        onClick={function(event) {
                            this.setState(function(prevState, props) {
                                prevState.levelMenu.level.splice(i, 2);
                                return prevState;
                            });
                        }.bind(this)}
                    >
                        <Clear
                            style={{
                                height: '24px',
                                width: '24px',}} 
                        />
                    </IconButton>
                </div>
            );
        }

        return (
            <div style={{
                height: '32px',
                display: 'flex', 
                flexDirection: 'row', 
                flex:'0 0 auto',
                alignItems:'center',
                borderTop:'1px solid #e8e8e8'}}>
                <Chip 
                    className="edgeChip" 
                    labelStyle={{fontSize: '12px'}}
                >
                    <Avatar
                        className='edgeAvatar'
                        style={{
                            backgroundColor:D3ForceSimulation.getEdgeStyle(__name).color
                        }}
                    />
                    {__name}
                </Chip>
                
                <span>Color:</span>
                <RaisedButton
                    onClick={function(event) {
                        event.preventDefault();
                        const __target = event.currentTarget;
                        this.setState(function(prevState, props) {
                            prevState.colorPicker.open = true;
                            prevState.colorPicker.anchorEl = __target;
                            return prevState;
                        });
                    }.bind(this)}
                    backgroundColor={D3ForceSimulation.getEdgeStyle(__name).color}
                    style={{width:'15px', height: '20px', margin: '12px'}}
                />

                <span style={{marginLeft:'12px'}}>Stroke: [</span>
                <AutoComplete
                    // errorStyle={{fontSize: '10px', lineHeight:'0px'}}
                    // errorText={GlobalFunction.CheckName(this.state.labels[i])}
                    anchorOrigin={{horizontal:"left", vertical:"top"}}
                    targetOrigin={{horizontal:"left", vertical:"bottom"}}
                    searchText={D3ForceSimulation.getEdgeStyle(this.props.chipName).stroke_property}
                    onUpdateInput={this.setPropertyForStroke}
                    onNewRequest={this.setPropertyForStroke}
                    dataSource={GlobalVariable.propertyList}
                    filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
                    openOnFocus={false}
                    maxSearchResults={6}
                    style={{width:'105px',height:'32px'}} 
                    textFieldStyle={{width:'105px',height:'32px'}} 
                    inputStyle={{fontSize: '12px'}}
                />
                <span> : </span>
                <Chip 
                    className="edgeChip" 
                    style={{border:'1px solid #a1a1a1'}}
                    //backgroundColor='#a1a1a100'
                    labelStyle={{fontSize: '12px'}}
                    onClick={function(event) {
                        const __target = event.currentTarget;
                        this.setState(function(prevState, props) {
                            this.isError = false;
                            prevState.levelMenu.open = true;
                            prevState.levelMenu.anchorEl = __target;
                            return prevState;
                        });
                    }.bind(this)}
                >
                    LEVEL
                </Chip>
                <span> ]</span>

                <Popover
                    open={this.state.colorPicker.open}
                    anchorEl={this.state.colorPicker.anchorEl}
                    anchorOrigin={{horizontal:"left", vertical:"top"}}
                    targetOrigin={{horizontal:"left", vertical:"bottom"}}
                    onRequestClose={function() {
                        this.setState(function(prevState, props) {
                            prevState.colorPicker.open = false;
                            return prevState;
                        });
                    }.bind(this)}
                    // animated={false}
                >
                    <SketchPicker
                        color={D3ForceSimulation.getEdgeStyle(__name).color}
                        onChange={({hex}) => {
                            if (D3ForceSimulation.getEdgeStyle(this.props.chipName).color != hex){
                                GlobalFunction.SendAjax(
                                    (result)=>{
                                        D3ForceSimulation.setStyle(GlobalConstant.mode.edge, this.props.chipName, 'color', hex);
                                        this.props.onChange();
                                    },
                                    (error)=>{this.props.onMessage(error.message, 0)},
                                    "/setStyle?style=",
                                    {
                                        mode: GlobalConstant.mode.edge,
                                        type: this.props.chipName,
                                        property: 'color',
                                        value: hex
                                    }
                                );
                            }
                        }}
                    />
                </Popover>
                
                <Popover
                    open={this.state.levelMenu.open}
                    anchorEl={this.state.levelMenu.anchorEl}
                    anchorOrigin={{horizontal:"right", vertical:"top"}}
                    targetOrigin={{horizontal:"left", vertical:"bottom"}}
                    style={{width:'300px'}}
                    onRequestClose={this.setLevelForStroke}
                >
                    <div style={{width:'300px', maxHeight:'300px', overflowX:'hidden'}}>
                        {__levelItem}
                        <IconButton
                            onClick={()=>{
                                this.setState(function(prevState, props) {
                                    prevState.levelMenu.level.push("");
                                    prevState.levelMenu.level.push('0');
                                    return prevState;
                                });
                            }}
                        >
                            <ContentAdd/>
                        </IconButton>
                    </div>
                </Popover>
            </div>
        );
    }
}