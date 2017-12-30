import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Draggable from 'react-draggable';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

export default class CardComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let __cardTitle = [];
        for (var key in this.props.nodeData){
            if (key != 'name' && 
                key != 'id' && 
                key != 'pics' && 
                key != 'vx' && 
                key != 'vy' && 
                key != 'x' && 
                key != 'y' && 
                key != 'memo' && 
                key != 'index' && 
                this.props.nodeData[key] != null ){
                __cardTitle.push(<TextField disabled={true} floatingLabelText={key} defaultValue={this.props.nodeData[key]} />);
            }
        }
    
        return (
            <Draggable defaultPosition={{x: this.props.nodeData.x, y: this.props.nodeData.y}}>
                <Card style={{position:"absolute", width:"30%"}}>
                    <AppBar 
                        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                        onLeftIconButtonClick={function(event){this.props.closeCard(this.props.nodeData.id)}.bind(this)}
                    />
                    <CardHeader
                        title={this.props.nodeData.name}
                        subtitle={this.props.nodeData.id != null ? 'ID: ' + this.props.nodeData.id : null}
                        avatar={this.props.nodeData.avatar}
                        actAsExpander={true}
                    >
                        <Chip>
                            Text Chip
                        </Chip>
                        <Chip>
                            Text Chip
                        </Chip>

                    </CardHeader>
                {/* <CardMedia
                    overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
                >
                    <img src="images/nature-600-337.jpg" alt="" />
                </CardMedia>  */}
                    <CardTitle title="Card title">
                        {__cardTitle}
                    </CardTitle>
                    <Divider />
                    <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                    <CardActions>
                        <FlatButton label="Action1" />
                        <FlatButton label="Action2" />
                    </CardActions>
                </Card>
            </Draggable>
        )
    }
}