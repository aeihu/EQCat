import React from 'react';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover/Popover';
import IconSelectorComponent from './IconSelectorComponent';

export default class EditEdgeComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            iconMenu: {
                open: false,
                anchorEl: null
            },
        }

    }

    size = 50;
    icon = '';
    caption = '';

    setIcon = function (label, icon){
        this.icon = icon;
        this.props.onIconChange(label, icon);
        this.setState(function(prevState, props) {
            return prevState;
        });
    }.bind(this)

    componentWillMount()
    {
        this.size = this.props.size;
        this.icon = this.props.icon;
        this.caption = this.props.caption;
    }

    componentWillReceiveProps(newProps)
    {
        this.size = newProps.size;
        this.icon = newProps.icon;
        this.caption = newProps.caption;
    }

    render() {
        let __name = typeof this.props.chipName === 'undefined' ? '' : this.props.chipName;

        let __captionChip = [];
        if (this.props.data.hasOwnProperty(__name)){
            for (let i = 0; i < this.props.data[__name].propertiesList.length; i++){
                let __propertyName = this.props.data[__name].propertiesList[i];

                __captionChip.push(<Chip 
                    className="edgeChip" 
                    style={{border:'1px solid #a1a1a1'}}
                    backgroundColor={this.caption == __propertyName ? 
                            '#a1a1a1' 
                            : 
                            '#a1a1a100'}
                    labelStyle={{fontSize: '12px'}}
                    onClick={this.caption == __propertyName ?
                            null
                            :
                            () => {
                                this.caption = __propertyName;
                                typeof this.props.onSizeChange === 'function' ?
                                    this.props.onCaptionChange(__name, __propertyName)
                                    :
                                    {}

                                this.setState(function(prevState, props) {
                                    return prevState;
                                });
                            }
                        }
                    >
                        {this.props.data[__name].propertiesList[i]}
                    </Chip>
                );
            }
        }

        return (
            <div style={{
                display: 'flex', 
                flexDirection: 'row', 
                flex:'0 0 auto',
                alignItems:'center',
                borderTop:'1px solid #e8e8e8'}}>
                <Chip 
                    className="labelChip" 
                    labelStyle={{fontSize: '12px'}}
                >
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

                    <img src={this.icon} width='24px' height='24px' />
                </IconButton>

                <span>Size:</span>
                <TextField 
                    id={'value1'}
                    style={{width:'85px'}}
                    onChange={(event, newValue) =>
                        {
                            this.size = newValue;
                            typeof this.props.onSizeChange === 'function' ?
                                this.props.onSizeChange(__name, newValue)
                                :
                                {}

                            this.setState(function(prevState, props) {
                                return prevState;
                            });
                        }}
                    errorText={isNaN(Number(this.size)) ? "It's not number" : ''}
                    value={this.size}
                />

                <span>Caption:</span>
                {__captionChip}

                <Popover
                    open={this.state.iconMenu.open}
                    anchorEl={this.state.iconMenu.anchorEl}
                    anchorOrigin={{horizontal:"left", vertical:"top"}}
                    targetOrigin={{horizontal:"left", vertical:"bottom"}}
                    onRequestClose={function() {
                        this.setState(function(prevState, props) {
                            prevState.iconMenu.open = false;
                            return prevState;
                        });
                    }.bind(this)}
                >
                    <IconSelectorComponent
                        icon={this.icon}
                        onChange={(icon) => this.setIcon(__name, icon)}
                    />
                </Popover>
            </div>
        )
    }
}