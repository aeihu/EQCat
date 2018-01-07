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

    handle = () => {
        var xmlhttp = new XMLHttpRequest()

        //alert('1');
        xmlhttp.onreadystatechange=function()
        {
            // alert('asdasd');
            // alert(xmlhttp.readyState);
            // alert(xmlhttp.status);
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                alert(xmlhttp.responseText);
            }
        }

        //alert('2');
        xmlhttp.open("GET","/example/d",true);
        xmlhttp.send();
        //alert('3');
    }

    render() {
        return (
            <div>
                <div style={{zIndex: 2, position:"relative"}}>
                    <RaisedButton
                        label="A"
                        onClick={this.handle}
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