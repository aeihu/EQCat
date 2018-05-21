import React from 'react';
import DBInfoComponent from './DBInfoComponent';
import FavoritesComponent from './FavoritesComponent';

import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

import ActionGrade from 'material-ui/svg-icons/action/grade';
import DeviceStorage from 'material-ui/svg-icons/device/storage';

export default class TooltipComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 0,
            open: false
        };
    }

    render() {
        let __page = [];
        if (this.state.open){
            switch (this.state.type){
                case 0:
                    __page.push(<DBInfoComponent 
                        onMessage={this.props.onMessage}
                        onSetCypher={this.props.onSetCypher} />);
                    break;
                case 1:
                    __page.push(<FavoritesComponent 
                        flag={this.props.flag}
                        onMessage={this.props.onMessage}
                        onSetCypher={this.props.onSetCypher} />);
                    break;
            }
        }
        
        return (
            <Paper style={{height: '100%', display: 'flex', flexDirection: 'row'}}>
                <div style={{height: '100%', display: 'flex', flexDirection: 'column', flex:'0 0 auto', borderRight: '1px solid #ddd'}} >
                    <IconButton 
                        //tooltip="Favorites"
                        style={this.state.open && this.state.type == 0 ? 
                            {borderBottom: '1px solid #ddd', backgroundColor: 'YellowGreen'} 
                            : 
                            {borderBottom: '1px solid #ddd'}}
                        hoveredStyle={{backgroundColor:'SkyBlue'}}
                        onClick={function() {
                            this.setState(function(prevState, props) {
                                if (prevState.open){
                                    if (prevState.type == 0){
                                        prevState.open = false;
                                    }else{
                                        prevState.type = 0;
                                    }
                                }else{
                                    prevState.open = true;
                                    prevState.type = 0;
                                }
                                return prevState;
                            })
                        }.bind(this)}
                    >
                        <DeviceStorage />
                    </IconButton>
                    <IconButton 
                        //tooltip="Favorites"
                        style={this.state.open && this.state.type == 1 ? 
                            {borderBottom: '1px solid #ddd', backgroundColor: 'YellowGreen'} 
                            : 
                            {borderBottom: '1px solid #ddd'}}
                        hoveredStyle={{backgroundColor:'SkyBlue'}}
                        onClick={function() {
                            this.setState(function(prevState, props) {
                                if (prevState.open){
                                    if (prevState.type == 1){
                                        prevState.open = false;
                                    }else{
                                        prevState.type = 1;
                                    }
                                }else{
                                    prevState.open = true;
                                    prevState.type = 1;
                                }
                                return prevState;
                            })
                        }.bind(this)}
                    >
                        <ActionGrade />
                    </IconButton>
                </div>
                <div style={{zIndex: 1, position:"relative"}} class={this.state.open ? 'tooltip tooltip_open' : 'tooltip'} >
                    {__page}
                </div>
            </Paper>
        );
    }
}