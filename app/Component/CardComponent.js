import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Draggable from 'react-draggable';
import * as d3 from 'd3';

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
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import GlobalConstant from '../Common/GlobalConstant';
import ImageEdit from 'material-ui/svg-icons/image/edit';

export default class CardComponent extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
            //mode: 0, // node:0  edge:1
			open: false
		};
    }

    render() {
        let __properties = [];
        for (let key in this.props.data.properties){
            if (key != GlobalConstant.memoOfProperty && key != GlobalConstant.imagesOfProperty){
                __properties.push(
                    <div style={{
                        float: 'inline-start',
                        display: 'flex', 
                        flexDirection: 'column', 
                        width:'242px',
                        borderBottom: '1px solid LightSlateGray',
                        borderBottomStyle: 'dotted',
                        margin: '6px 6px 6px 16px'
                        }}>
                        <span style={{fontSize: '14px', color:'LightSlateGray'}}>{key + ' :'}</span>
                        {typeof this.props.data.properties[key] == 'object' ?
                            <div style={{
                                width:'242px',
                                display: 'flex', 
                                flexWrap: 'wrap',
                                flexDirection: 'row', 
                                alignItems: 'center'}}
                            >
                                {this.props.data.properties[key].map((value, index) => (
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            paddingRight: '8px',
                                            borderRadius: '10px',
                                            backgroundColor: 'Gainsboro',
                                            margin: '3px 3px 1px 3px',
                                            height: '16px'
                                    }}>
                                        <Avatar
											backgroundColor={
												typeof value == 'boolean' ?
													'SeaGreen'
													:
													typeof value == 'string' ?
														'Tomato'
														:
														'MediumVioletRed'
											}
                                            size={16}
                                            style={{marginRight:'2px'}}
                                        >
                                            {index}
                                        </Avatar>
                                        {typeof value == 'boolean' ? 
                                            value ? '√' : '×'
                                            :
                                            value}
                                    </div>
                                ))}
                            </div>
                            :
                            <span style={{fontSize: '16px', color:'Black'}}>
                                {typeof this.props.data.properties[key] == 'boolean' ? 
                                    this.props.data.properties[key] ? '√' : '×'
                                    :
                                    this.props.data.properties[key]
                                }
                            </span>
                        }
                    </div>
                )
            }
        }

        let __chips = [];
        if (this.props.mode == GlobalConstant.mode.node){
            for (let i = 0; i <  this.props.data.labels.length; i++){
                __chips.push(
                    <Chip 
                        className="labelChip"
                        labelStyle={{fontSize: '12px'}}
                    >
                        <Avatar src={D3ForceSimulation.getNodeStyle(this.props.data.labels[i]).icon} 
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
        }else{
            __chips.push(
                <Chip 
                    className="edgeChip"
                    labelStyle={{fontSize: '12px'}}
                >
                    {this.props.data.type}
                </Chip>);
        }
    
        return (
            <Draggable handle="strong" bounds="parent" defaultPosition={{x: d3.event.pageX, y: d3.event.pageY}}>
                <Paper style={{
                    position:"absolute", 
                    width:"553px"}} 
                    zDepth={1}
                >
                    <EditorDialogsComponent
                        mode={this.props.mode}
                        isNew={false}
                        data={this.props.data}
                        open={this.state.open}
                        onChangeData={this.props.onMerge}
                        onRequestClose={()=> {this.setState(function(prevState, props) {
                            prevState.open = false;
                            return prevState;
                        })}}
                    />
                    <strong>
                        <AppBar 
                            title={this.props.mode == GlobalConstant.mode.node ? 'Node: ID' + this.props.data.id : 'Edge: ID' + this.props.data.id}
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
                            iconElementRight={
                                <IconButton 
                                    style={{
                                        padding:'0px',
                                        height: '24px',
                                        width: '24px',}}
                                >
                                    <ImageEdit style={{
                                        height: '24px',
                                        width: '24px',}}
                                    />
                                </IconButton>}
                            onLeftIconButtonClick={function(event){
                                    this.props.closeCard(this.props.data.id, this.props.mode);
                                }.bind(this)}
                            onRightIconButtonClick={()=> {this.setState(function(prevState, props) {
                                    prevState.open = true;
                                    return prevState;
                                    })}}
                            style={this.props.mode == GlobalConstant.mode.node ? {height:'26px'} : {height:'26px', backgroundColor:'DarkSalmon'}}
                            iconStyleLeft={{
                                marginTop: '0px',
                                height: '24px',
                                width: '24px',
                            }}
                            iconStyleRight={{
                                marginTop: '0px',
                                height: '24px',
                                width: '24px',
                            }}
                        />
                    </strong>
                    
                    <div style={{
                        display: 'flex', 
                        flexDirection: 'column'}}
                    >  
                        <div style={{
                            display: 'flex', 
                            flexWrap: 'wrap',
                            flexDirection: 'row'}}>   
                            {__chips}
                        </div>

                        <Divider />
                        <div style={{
                            display: 'flex', 
                            flexDirection: 'column',
                            overflowY: 'auto',
                            maxHeight: '450px',}}
                        >  
                            <div>
                                {this.props.data.properties.hasOwnProperty(GlobalConstant.imagesOfProperty) ?
                                    this.props.data.properties[GlobalConstant.imagesOfProperty].length > 0 ?
                                        <div 
                                            style={{
                                                width:'230px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                padding: '5px',
                                                margin: '6px 6px 6px 16px',
                                                float: 'inline-start'
                                            }}
                                        >
                                            <Carousel 
                                                showThumbs={false}
                                                //centerMode={true}
                                            >
                                                {this.props.data.properties[GlobalConstant.imagesOfProperty].map((img, index)=>(
                                                    <div>
                                                    <img src={img}  />
                                                    </div>
                                                ))}
                                            </Carousel>
                                        </div>
                                        :
                                        ''
                                    :
                                    ''
                                }     
                                {__properties}
                            </div>
                            
                            {this.props.data.properties.hasOwnProperty(GlobalConstant.memoOfProperty) ?
                                this.props.data.properties[GlobalConstant.memoOfProperty].trim() != '' ?
                                    <div 
                                        dangerouslySetInnerHTML={{
                                            __html: this.props.data.properties[GlobalConstant.memoOfProperty]
                                        }}
                                        style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            padding: '5px',
                                            margin: '6px',
                                        }}
                                    >  
                                    </div>
                                    :
                                    ''
                                :
                                ''
                            }
                        </div>
                    </div>
                </Paper>
            </Draggable>
        )
    }
}