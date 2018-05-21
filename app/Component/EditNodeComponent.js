import React from 'react';

import IconSelectorComponent from './IconSelectorComponent';
import GlobalVariable from '../../Common/GlobalVariable';
import GlobalConstant from '../../Common/GlobalConstant';
import GlobalFunction from '../../Common/GlobalFunction';
import {D3ForceSimulation} from './D3ForceSimulation';

import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover/Popover';
import Avatar from 'material-ui/Avatar';
import Menu from 'material-ui/Menu';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';

import ContentAdd from 'material-ui/svg-icons/content/add';
import Clear from 'material-ui/svg-icons/content/clear';

export default class EditNodeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iconMenu: {
                open: false,
                anchorEl: null
            },
            captionMenu: {
                open: false,
                anchorEl: null
            },
            levelMenu: {
                level: [],
                open: false,
                anchorEl: null
            },
        }
    }

    isError = false;

    setCaption = function (propertyName){
        if (propertyName != D3ForceSimulation.getNodeStyle(this.props.chipName).caption){
            GlobalFunction.SendAjax(
                (result)=>{
                    this.setState(function(prevState, props) {
                        D3ForceSimulation.setStyle(GlobalConstant.mode.node, this.props.chipName, 'caption', propertyName);
                        return prevState;
                    }.bind(this))
                },
                (error)=>{this.props.onMessage(error.message, 0)},
                "/setStyle?style=",
                {
                    mode: GlobalConstant.mode.node,
                    label: this.props.chipName,
                    property: 'caption',
                    value: propertyName
                }
            );
        }
    }.bind(this)

    setPropertyForSize = function (property){
        if (property != D3ForceSimulation.getNodeStyle(this.props.chipName).size_property){
            GlobalFunction.SendAjax(
                (result)=>{
                    this.setState(function(prevState, props) {
                        D3ForceSimulation.setStyle(GlobalConstant.mode.node, this.props.chipName, 'size_property', property);
                        return prevState;
                    }.bind(this));
                },
                (error)=>{this.props.onMessage(error.message, 0)},
                "/setStyle?style=",
                {
                    mode: GlobalConstant.mode.node,
                    label: this.props.chipName,
                    property: 'size_property',
                    value: property
                }
            );
        }
    }.bind(this)

    checkSubmitForLevelForSize = function(){
        for (let i=0; i<this.state.levelMenu.level.length; i++){
            if (i%2 == 0){
                for (let j=i+2; j<this.state.levelMenu.level.length; j+=2){
                    if (this.state.levelMenu.level[i] == this.state.levelMenu.level[j]){
                        return -1;
                    }
                }
            }else{
                if (isNaN(Number(this.state.levelMenu.level[i]))){
                    return -2;
                }
            }
        }
        return 0;
    }

    setLevelForSize = function (){    
        if (!GlobalFunction.ArrayEquals(this.state.levelMenu.level, D3ForceSimulation.getNodeStyle(this.props.chipName).size_level)){
            switch (this.checkSubmitForLevelForSize()){
                case -1:
                    this.isError = true;
                    this.props.onMessage('There is same level key', 0);
                    break;
                case -2:
                    this.isError = true;
                    this.props.onMessage('There is invalid level value', 0);
                    break;
                default:
                    GlobalFunction.SendAjax(
                        (result)=>{
                            this.setState(function(prevState, props) {
                                D3ForceSimulation.setStyle(GlobalConstant.mode.node, this.props.chipName, 'size_level', this.state.levelMenu.level);
                                prevState.levelMenu.open = false;
                                return prevState;
                            }.bind(this));
                        },
                        (error)=>{this.props.onMessage(error.message, 0)},
                        "/setStyle?style=",
                        {
                            mode: GlobalConstant.mode.node,
                            label: this.props.chipName,
                            property: 'size_level',
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

    componentDidMount()
    {
        this.setState(function(prevState, props) {
            prevState.levelMenu.level = [...D3ForceSimulation.getNodeStyle(this.props.chipName).size_level];
            return prevState;
        })

    }

    componentWillReceiveProps(newProps)
    {
        if (this.isError)
            return;

        this.setState(function(prevState, props) {
            prevState.levelMenu.level = [...D3ForceSimulation.getNodeStyle(newProps.chipName).size_level];
            return prevState;
        })
    }

    render() {
        let __name = typeof this.props.chipName === 'undefined' ? '' : this.props.chipName;

        let __propertyItem = [];
        if (this.props.data.hasOwnProperty(__name)){
            for (let key in this.props.data[__name].propertiesList){
                __propertyItem.push(
                    <MenuItem 
                        primaryText={key} 
                        onClick={function(event, value) {
                                this.setCaption(key)
                        }.bind(this)}
                    />
                );
            }
        }

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
                    <TextField 
                        id={'value2'}
                        style={{width:'80px', height:'32px'}}
                        inputStyle={{fontSize: '12px'}}
                        onChange={(event, newValue) =>{
                            this.setState(function(prevState, props) {
                                prevState.levelMenu.level[i+1] = newValue;
                                return prevState;
                            })
                        }}
                        errorText={isNaN(Number(this.state.levelMenu.level[i+1])) ? "It's not number" : ''}
                        errorStyle={{fontSize: '10px', lineHeight:'0px'}}
                        value={this.state.levelMenu.level[i+1]}
                    /> 
                    
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

        let __datasource = ['<connect number>'].concat(GlobalVariable.propertyList);

        return (
            <div style={{
                height: '32px',
                display: 'flex', 
                flexDirection: 'row', 
                flex:'0 0 auto',
                alignItems:'center',
                borderTop:'1px solid #e8e8e8'}}>
                <Chip 
                    className="labelChip" 
                    labelStyle={{fontSize: '12px'}}
                >
                    <Avatar src={D3ForceSimulation.getNodeStyle(__name).icon} 
                        style={{
                            width:'23px', 
                            height:'23px', 
                            marginLeft:'6px', 
                            borderRadius:'0%', 
                            backgroundColor:'#00000000'}} 
                    />
                    {__name}
                </Chip>
                
                <span>Icon:</span>
                <IconButton 
                    onClick={function(event) {
                        event.preventDefault();
                        const __target = event.currentTarget;
                        this.setState(function(prevState, props) {
                            prevState.iconMenu.open = true;
                            prevState.iconMenu.anchorEl = __target;
                            return prevState;
                        });
                    }.bind(this)}>

                    <img src={D3ForceSimulation.getNodeStyle(__name).icon} width='24px' height='24px' />
                </IconButton>

                <span>Caption:</span>
                <Chip 
                    className="edgeChip" 
                    style={{border:'1px solid #a1a1a1'}}
                    //backgroundColor='#a1a1a100'
                    labelStyle={{fontSize: '12px'}}
                    onClick={function(event) {
                        const __target = event.currentTarget;
                        this.setState(function(prevState, props) {
                            prevState.captionMenu.open = true;
                            prevState.captionMenu.anchorEl = __target;
                            return prevState;
                        });
                    }.bind(this)}
                >
                    {D3ForceSimulation.getNodeStyle(__name).caption}
                </Chip>

                <span style={{marginLeft:'12px'}}>Size: [</span>
                <AutoComplete
                    // errorStyle={{fontSize: '10px', lineHeight:'0px'}}
                    // errorText={GlobalFunction.CheckName(this.state.labels[i])}
                    anchorOrigin={{horizontal:"left", vertical:"top"}}
                    targetOrigin={{horizontal:"left", vertical:"bottom"}}
                    searchText={D3ForceSimulation.getNodeStyle(this.props.chipName).size_property}
                    onUpdateInput={(value)=>this.setPropertyForSize(value)}
                    onNewRequest={(value)=>this.setPropertyForSize(value)}
                    dataSource={__datasource}
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

{/* //////////////////////////////////
//      Popover
////////////////////////////////// */}
                <Popover
                    open={this.state.levelMenu.open}
                    anchorEl={this.state.levelMenu.anchorEl}
                    anchorOrigin={{horizontal:"right", vertical:"top"}}
                    targetOrigin={{horizontal:"left", vertical:"bottom"}}
                    style={{width:'300px'}}
                    onRequestClose={this.setLevelForSize}
                >
                    <div style={{width:'300px', maxHeight:'300px', overflowX:'hidden'}}>
                        {__levelItem}
                        <IconButton
                            onClick={()=>{
                                this.setState(function(prevState, props) {
                                    prevState.levelMenu.level.push("");
                                    prevState.levelMenu.level.push('50');
                                    return prevState;
                                });
                            }}
                        >
                            <ContentAdd/>
                        </IconButton>
                    </div>
                </Popover>

                <Popover
                    open={this.state.captionMenu.open}
                    anchorEl={this.state.captionMenu.anchorEl}
                    anchorOrigin={{horizontal:"right", vertical:"top"}}
                    targetOrigin={{horizontal:"left", vertical:"bottom"}}
                    onRequestClose={function() {
                        this.setState(function(prevState, props) {
                            prevState.captionMenu.open = false;
                            return prevState;
                        });
                    }.bind(this)}
                >
                    <Menu desktop={true} maxHeight={300}>
                        {__propertyItem}
                    </Menu>
                </Popover>

                <Popover
                    open={this.state.iconMenu.open}
                    anchorEl={this.state.iconMenu.anchorEl}
                    anchorOrigin={{horizontal:"right", vertical:"top"}}
                    targetOrigin={{horizontal:"left", vertical:"bottom"}}
                    onRequestClose={function() {
                        this.setState(function(prevState, props) {
                            prevState.iconMenu.open = false;
                            return prevState;
                        });
                    }.bind(this)}
                >
                    <IconSelectorComponent
                        icon={D3ForceSimulation.getNodeStyle(__name).icon}
                        onMessage={this.props.onMessage}
                        onChange={(icon) => {
                            if (icon != D3ForceSimulation.getNodeStyle(this.props.chipName).icon){
                                GlobalFunction.SendAjax(
                                    (result)=>{
                                        D3ForceSimulation.setStyle(GlobalConstant.mode.node, this.props.chipName, 'icon', icon);
                                        this.props.onChange();
                                    },
                                    (error)=>{this.props.onMessage(error.message, 0)},
                                    "/setStyle?style=",
                                    {
                                        mode: GlobalConstant.mode.node,
                                        label: this.props.chipName,
                                        property: 'icon',
                                        value: icon
                                    }
                                );
                            }
                        }}
                    />
                </Popover>
            </div>
        )
    }
}