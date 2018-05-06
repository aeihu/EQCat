import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Paper from 'material-ui/Paper';

export default class TooltipComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        return (
            <Paper style={{height: '100%', display: 'flex', flexDirection: 'row'}}>
                <div style={{height: '100%', display: 'flex', flexDirection: 'column', flex:'0 0 auto', borderRight: '1px solid #ddd'}} >
                    <IconButton 
                        //tooltip="Favorites"
                        style={this.state.open ? {borderBottom: '1px solid #ddd', backgroundColor: 'YellowGreen'} : {borderBottom: '1px solid #ddd'}}
                        hoveredStyle={{backgroundColor:'SkyBlue'}}
                        onClick={function() {
                            this.setState(function(prevState, props) {
                                prevState.open = !prevState.open;
                                return prevState;
                            })
                        }.bind(this)}
                    >
                        <ActionGrade />
                    </IconButton>
                    <IconButton 
                        //tooltip="Favorites"
                        style={{borderBottom: '1px solid #ddd'}}
                        hoveredStyle={{backgroundColor:'SkyBlue'}}
                        onClick={function() {
                            this.setState(function(prevState, props) {
                                prevState.open = !prevState.open;
                                return prevState;
                            })
                        }.bind(this)}
                    >
                        <ActionGrade />
                    </IconButton>
                </div>
                <div style={{zIndex: 1, position:"relative"}} class={this.state.open ? 'tooltip tooltip_open' : 'tooltip'} >
                    {/* <Drawer 
                        open={this.state.open} 
                        width={400}
                    >
                        <MenuItem>Menu Item</MenuItem>
                        <MenuItem>Menu Item 2</MenuItem>
                    </Drawer> */}
                </div>
            </Paper>
        );
    }
}