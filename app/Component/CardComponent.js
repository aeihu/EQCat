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
import Paper from 'material-ui/Paper';
import {D3ForceSimulation} from './D3ForceSimulation';
import Avatar from 'material-ui/Avatar';
import EditorDialogsComponent from './EditorDialogsComponent';

export default class CardComponent extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
			open: false
		};
    }

    render() {
        let __cardTitle = [];
        for (let key in this.props.data.properties){
            if (key != 'memo' && key != 'images'){
                __cardTitle.push(
                    <div style={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        width:'220px',
                        borderBottom: '1px solid LightSlateGray',
                        borderBottomStyle: 'dotted',
                        margin: '6px 6px 6px 16px'
                        }}>
                        <span style={{fontSize: '14px', color:'LightSlateGray'}}>{key + ' :'}</span>
                        <span style={{fontSize: '16px', color:'Black'}}>{this.props.data.properties[key]}</span>
                    </div>
                )
            }
        }

        let __cardChip = [];
        for (let i = 0; i <  this.props.data.labels.length; i++){
            __cardChip.push(
                <Chip 
                    className="labelChip"
                    labelStyle={{fontSize: '12px'}}
                >
                    <Avatar src={D3ForceSimulation.NEStyles.nodes[this.props.data.labels[i]].icon} 
                        style={
                            {
                                width:'23px', 
                                height:'23px', 
                                marginLeft:'6px', 
                                borderRadius:'0%', 
                                backgroundColor:'#00000000'}} 
                    />
                    {this.props.data.labels[i]}
                </Chip>);
        }
    
        return (
            <Draggable handle="strong" bounds="parent" defaultPosition={{x: this.props.data.x, y: -this.props.data.y}}>
                <Paper style={{
                    position:"absolute", 
                    width:"30%"}} 
                    zDepth={1}
                >
                    <EditorDialogsComponent
                        data={this.props.data}
                        open={this.state.open}
                        onRequestClose={()=> {this.setState(function(prevState, props) {
                            prevState.open = false;
                            return prevState;
                        })}}
                    />
                    <strong>
                        <AppBar 
                            title={this.props.data.id != null ? 'Node: ID' + this.props.data.id : ''}
                            titleStyle={{lineHeight:'24px', height:'26px'}}
                            iconElementLeft={
                                <IconButton 
                                    style={{
                                        padding:'0px',
                                        height: '24px',
                                        width: '24px',}}
                                >
                                    <NavigationClose style={{
                                        height: '24px',
                                        width: '24px',}}
                                    />
                                </IconButton>}
                            onLeftIconButtonClick={function(event){this.props.closeCard(this.props.data.id)}.bind(this)}
                            style={{height:'26px'}}
                            iconStyleLeft={{
                                marginTop: '0px',
                                height: '24px',
                                width: '24px',
                            }}
                        />
                    </strong>
                    <div style={{
                        display: 'flex', 
                        flexWrap: 'wrap',
                        flexDirection: 'row'}}>        
                        {__cardChip}
                    </div>

                    <Divider />
                    <div style={{
                        display: 'flex', 
                        //alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        flexDirection: 'row'}}
                    >  
                        {__cardTitle}
                    </div>
                    {this.props.data.properties.hasOwnProperty('images') ?
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-around',
                        }}>
                            <GridList style={{
                                display: 'flex',
                                flexWrap: 'nowrap',
                                overflowX: 'auto',}} 
                                cols={2.2}
                            >
                                {this.props.data.properties['images'].forEach((value)=>(
                                    <GridTile key={value}>
                                        <img src={value} />
                                    </GridTile>
                                ))}
                            </GridList>
                        </div>
                        :
                        ''
                     }
                    <Divider />
                        <RaisedButton
                            onClick={()=> {this.setState(function(prevState, props) {
                                prevState.open = true;
                                return prevState;
                            })}}
                            label="Github Link"
                        />
                </Paper>
            </Draggable>
        )
    }
}