import React from 'react';
import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover/Popover';
import { SketchPicker } from 'react-color';
import GlobalConstant from '../../Common/GlobalConstant';
import {D3ForceSimulation} from './D3ForceSimulation';

export default class EditEdgeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iconMenu: {
                open: false,
                anchorEl: null
            },
            colorPicker: {
                open: false,
                anchorEl: null
            },
        }
    }

    setColor = function (hex){
        if (D3ForceSimulation.getEdgeStyle(this.props.chipName).color != hex){
            D3ForceSimulation.setStyle(GlobalConstant.mode.edge, this.props.chipName, 'color', hex);
            this.props.onChange();
            this.props.onSendStyle({
                mode: GlobalConstant.mode.edge,
                type: this.props.chipName,
                property: 'color',
                value: hex
            })
        }
    }.bind(this)

    render() {
        let __name = typeof this.props.chipName === 'undefined' ? '' : this.props.chipName;

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

                <span>width:</span>
                <Chip 
                    className="edgeChip" 
                    style={{border:'1px solid #a1a1a1'}}
                    //backgroundColor='#a1a1a100'
                    labelStyle={{fontSize: '12px'}}
                    onClick={function(event) {
                        const __target = event.currentTarget;
                        this.setState(function(prevState, props) {
                            prevState.captionAndSizeMenu.open = true;
                            prevState.captionAndSizeMenu.anchorEl = __target;
                            return prevState;
                        });
                    }.bind(this)}
                >
                    {D3ForceSimulation.geEdgeStyle(__name).width.property}
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
                        onChange={({hex}) => this.setColor(hex)}
                    />
                </Popover>
            </div>
        );
    }
}