import React from 'react';
import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover/Popover';
import { SketchPicker } from 'react-color';

export default class EditEdgeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colorPicker: {
                open: false,
                anchorEl: null
            },
        }
    }
    
    color = '#000000';

    componentWillMount()
    {
        this.color = this.props.color;
    }

    componentWillReceiveProps(newProps)
    {
        this.color = newProps.color;
    }

    render() {
        let __name = typeof this.props.chipName === 'undefined' ? '' : this.props.chipName;

        return (
            <div style={{
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
                    backgroundColor={this.color}
                    style={{width:'15px', height: '20px', margin: '12px'}}
                />

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
                        color={this.color}
                        onChange={({hex}) => 
                            {
                                this.color = hex;
                                
                                typeof this.props.onChange === 'function' ?
                                    this.props.onChange(hex)
                                    :
                                    {}

                                this.setState(function(prevState, props) {
                                    return prevState;
                                });
                            }
                        }
                    />
                </Popover>
            </div>
        );
    }
}