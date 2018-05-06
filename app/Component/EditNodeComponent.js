import React from 'react';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover/Popover';
import IconSelectorComponent from './IconSelectorComponent';
import Avatar from 'material-ui/Avatar';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import GlobalConstant from '../../Common/GlobalConstant';
import {D3ForceSimulation} from './D3ForceSimulation';

export default class EditNodeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iconMenu: {
                open: false,
                anchorEl: null
            },
            captionAndSizeMenu: {
                mode: 0, //0:caption 1:Size
                open: false,
                anchorEl: null
            },
        }
    }
    
    setIcon = function (icon){
        if (icon != D3ForceSimulation.getNodeStyle(this.props.chipName).icon){
            D3ForceSimulation.setStyle(GlobalConstant.mode.node, this.props.chipName, 'icon', icon);
            this.props.onChange();
            this.props.onSendStyle({
                mode: GlobalConstant.mode.node,
                label: this.props.chipName,
                property: 'icon',
                value: icon
            })
        }
    }.bind(this)

    setCaption = function (propertyName){
        if (propertyName != D3ForceSimulation.getNodeStyle(this.props.chipName).caption){
            D3ForceSimulation.setStyle(GlobalConstant.mode.node, this.props.chipName, 'caption', propertyName);
            this.props.onSendStyle({
                mode: GlobalConstant.mode.node,
                label: this.props.chipName,
                property: 'caption',
                value: propertyName
            })
            this.setState(function(prevState, props) {
                return prevState;
            })
        }
    }.bind(this)

    setPropertyForSize = function (property){
        if (property != D3ForceSimulation.getNodeStyle(this.props.chipName).size.property){
            D3ForceSimulation.setStyle(GlobalConstant.mode.node, this.props.chipName, 'size_property', property);
            this.props.onSendStyle({
                mode: GlobalConstant.mode.node,
                label: this.props.chipName,
                property: 'size',///////////////////////////////////////////////////////////////////////////////////
                value: size
            })
    
            this.setState(function(prevState, props) {
                return prevState;
            });
        }
    }.bind(this)
    
    setLevelsForSize = function (levels){    
    if (!GlobalFunction.ArrayEquals(levels, D3ForceSimulation.getNodeStyle(this.props.chipName).size.levels.level)){
            D3ForceSimulation.setStyle(GlobalConstant.mode.node, this.props.chipName, 'size_property', property);
            this.props.onSendStyle({
                mode: GlobalConstant.mode.node,
                label: this.props.chipName,
                property: 'size',///////////////////////////////////////////////////////////////////////////////////
                value: size
            })
    
            this.setState(function(prevState, props) {
                return prevState;
            });
        }
    }.bind(this)

    render() {
        let __name = typeof this.props.chipName === 'undefined' ? '' : this.props.chipName;

        let __propertyItem = [];
        if (this.props.data.hasOwnProperty(__name)){
            for (let key in this.props.data[__name].propertiesList){
                __propertyItem.push(
                    <MenuItem 
                        primaryText={key} 
                        onClick={function(event, value) {
                            this.state.captionAndSizeMenu.mode == 0 ?
                                this.setCaption(key)
                                :
                                this.setPropertyForSize(key);
                        }.bind(this)}
                    />
                );
            }
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

                <span>Size:</span>
                <Chip 
                    className="edgeChip" 
                    style={{border:'1px solid #a1a1a1'}}
                    //backgroundColor='#a1a1a100'
                    labelStyle={{fontSize: '12px'}}
                    onClick={function(event) {
                        const __target = event.currentTarget;
                        this.setState(function(prevState, props) {
                            prevState.captionAndSizeMenu.mode = 1;
                            prevState.captionAndSizeMenu.open = true;
                            prevState.captionAndSizeMenu.anchorEl = __target;
                            return prevState;
                        });
                    }.bind(this)}
                >
                    {D3ForceSimulation.getNodeStyle(__name).size.property}
                </Chip>
                {/* <TextField 
                    id={'value1'}
                    style={{width:'50px', height:'32px'}}
                    inputStyle={{fontSize: '12px'}}
                    onChange={(event, newValue) =>this.setSize(newValue)}
                    errorText={isNaN(Number(this.size)) ? "It's not number" : ''}
                    value={this.size}
                /> */}

                <span style={{marginLeft:'12px'}}>Caption:</span>
                <Chip 
                    className="edgeChip" 
                    style={{border:'1px solid #a1a1a1'}}
                    //backgroundColor='#a1a1a100'
                    labelStyle={{fontSize: '12px'}}
                    onClick={function(event) {
                        const __target = event.currentTarget;
                        this.setState(function(prevState, props) {
                            prevState.captionAndSizeMenu.mode = 0;
                            prevState.captionAndSizeMenu.open = true;
                            prevState.captionAndSizeMenu.anchorEl = __target;
                            return prevState;
                        });
                    }.bind(this)}
                >
                    {D3ForceSimulation.getNodeStyle(__name).caption}
                </Chip>

                <Popover
                    open={this.state.captionAndSizeMenu.open}
                    anchorEl={this.state.captionAndSizeMenu.anchorEl}
                    anchorOrigin={{horizontal:"right", vertical:"top"}}
                    targetOrigin={{horizontal:"left", vertical:"bottom"}}
                    onRequestClose={function() {
                        this.setState(function(prevState, props) {
                            prevState.captionAndSizeMenu.open = false;
                            return prevState;
                        });
                    }.bind(this)}
                >
                    <Menu desktop={true}>
                        {__propertyItem}
                        {this.state.captionAndSizeMenu.mode == 1 ?
                            <MenuItem 
                                primaryText='<connect number>'
                                onClick={function(event, value) {
                                    this.setPropertyForSize(key);
                                }.bind(this)}
                            />
                        :''}
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
                        onChange={this.setIcon}
                    />
                </Popover>
            </div>
        )
    }
}