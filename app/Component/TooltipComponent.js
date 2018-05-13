import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Paper from 'material-ui/Paper';
import DBInfoComponent from './DBInfoComponent';
import FavoritesComponent from './FavoritesComponent';

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
                    __page.push(<DBInfoComponent />);
                    break;
                case 1:
                    __page.push(<FavoritesComponent />);
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
                        <ActionGrade />
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