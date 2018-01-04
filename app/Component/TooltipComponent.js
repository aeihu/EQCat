import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

export default class TooltipComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
      }

    handleToggle = () => this.setState({open: !this.state.open});

    render() {
        return (
            <div>
                <div style={{zIndex: 2, position:"relative"}}>
                    <RaisedButton
                        label="A"
                        // onClick={this.handleToggle}
                        href="example/d"
                    >
                    </RaisedButton>
                </div>
                <div style={{zIndex: 1, position:"relative"}}>
                    <Drawer 
                        open={this.state.open} 
                        width={400}
                    >
                        <MenuItem>Menu Item</MenuItem>
                        <MenuItem>Menu Item 2</MenuItem>
                    </Drawer>
                </div>
            </div>
        );
    }
}