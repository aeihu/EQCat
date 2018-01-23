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
        for (let key in this.props.nodeData.properties){
            __cardTitle.push(<TextField disabled={true} floatingLabelText={key} defaultValue={this.props.nodeData.properties[key]} />);
        }

        let __cardChip = [];
        for (let i = 0; i <  this.props.nodeData.labels.length; i++){
            __cardChip.push(<Chip style={{margin: 4}}>{this.props.nodeData.labels[i]}</Chip>);
        }
    
        return (
            // <Draggable defaultPosition={{x: this.props.nodeData.x, y: this.props.nodeData.y}}>
            <Draggable handle="strong" bounds="parent">
                <Card style={{position:"absolute", width:"30%"}}>
                    <strong>
                        <AppBar 
                            iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                            onLeftIconButtonClick={function(event){this.props.closeCard(this.props.nodeData.id)}.bind(this)}
                        />
                    </strong>
                    <CardHeader
                        title={this.props.nodeData.name}
                        subtitle={this.props.nodeData.id != null ? 'ID: ' + this.props.nodeData.id : null}
                        avatar={this.props.nodeData.avatar}
                        actAsExpander={true}
                    >               
                        <div style={{display: 'flex', flexWrap: 'wrap'}}>        
                            {__cardChip}
                        </div>
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