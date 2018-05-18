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
import { Carousel } from 'react-responsive-carousel';
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
import GlobalConstant from '../../Common/GlobalConstant';
import ImageEdit from 'material-ui/svg-icons/image/edit';

export default class CardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            card: {
                data: null,
                x: 0,
                y: 0,
            }
        }
    }

    componentWillMount()
    {
        this.setState(function(prevState, props) {
            console.log('componentDidMount11')
            this.state.card = props.data;
            return prevState;
        })
    }

    componentWillReceiveProps(newProps)
    {
        this.setState(function(prevState, props) {
            this.state.card = newProps.data;
            return prevState;
        })
    }

    setPosition = function(event, data){
        this.setState(function(prevState, props) {
            this.state.card.x = data.x;
            this.state.card.y = data.y;
            return prevState;
        })
    }.bind(this)

    render() {
        let __properties = [];
        for (let key in this.state.card.data.properties){
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
                        <span style={{lineHeight:'18px', fontSize: '14px', color:'LightSlateGray'}}>{key + ' :'}</span>
                        {typeof this.state.card.data.properties[key] == 'object' ?
                            <div style={{
                                width:'242px',
                                display: 'flex', 
                                flexWrap: 'wrap',
                                flexDirection: 'row', 
                                alignItems: 'center'}}
                            >
                                {this.state.card.data.properties[key].map((value, index) => (
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
                            <span style={{lineHeight:'20px', fontSize: '16px', color:'Black'}}>
                                {typeof this.state.card.data.properties[key] == 'boolean' ? 
                                    this.state.card.data.properties[key] ? '√' : '×'
                                    :
                                    typeof this.state.card.data.properties[key] == 'number' ?
                                        this.state.card.data.properties[key]
                                        :
                                        this.state.card.data.properties[key].toLowerCase().indexOf('http://') == 0 ||
                                        this.state.card.data.properties[key].toLowerCase().indexOf('https://') == 0 ?
                                            <a href={this.state.card.data.properties[key]} target="_blank">{this.state.card.data.properties[key]}</a>
                                            :
                                            this.state.card.data.properties[key]
                                }
                            </span>
                        }
                    </div>
                )
            }
        }

        let __chips = [];
        if (this.props.mode == GlobalConstant.mode.node){
            for (let i = 0; i <  this.state.card.data.labels.length; i++){
                __chips.push(
                    <Chip 
                        className="labelChip"
                        labelStyle={{fontSize: '12px'}}
                    >
                        <Avatar src={D3ForceSimulation.getNodeStyle(this.state.card.data.labels[i]).icon} 
                            className='labelAvatar'
                        />
                        {this.state.card.data.labels[i]}
                    </Chip>);
            }
        }else{
            __chips.push(
                <Chip 
                    className="edgeChip"
                    labelStyle={{fontSize: '12px'}}
                >
                    <Avatar
                        className='edgeAvatar'
                        style={{
                            backgroundColor:D3ForceSimulation.getEdgeStyle(this.state.card.data.type).color
                        }}
                    />
                    {this.state.card.data.type}
                </Chip>);
        }
    
        return (
            <Draggable 
                handle="strong" 
                bounds="parent" 
                position={{x: this.state.card.x, y: this.state.card.y}}
                onDrag={this.setPosition}
                onStop={this.setPosition}
                //defaultPosition={{x: this.props.x, y: this.props.y}}
            >
                <Paper style={{
                    position:"absolute", 
                    width:"553px"}} 
                    zDepth={1}
                >
                    <strong>
                        <AppBar 
                            title={this.props.mode == GlobalConstant.mode.node ? 'Node: ID' + this.state.card.data.id : 'Edge: ID' + this.state.card.data.id}
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
                                    this.props.onClose(this.state.card.data.id, this.props.mode);
                                }.bind(this)
                            }
                            onRightIconButtonClick={function(event){
                                    this.props.onShowDialog(this.state.card.data, this.props.mode);
                                }.bind(this)
                            }
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
                                {this.state.card.data.properties.hasOwnProperty(GlobalConstant.imagesOfProperty) ?
                                    this.state.card.data.properties[GlobalConstant.imagesOfProperty].length > 0 ?
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
                                                {this.state.card.data.properties[GlobalConstant.imagesOfProperty].map((img, index)=>(
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
                            
                            {this.state.card.data.properties.hasOwnProperty(GlobalConstant.memoOfProperty) ?
                                this.state.card.data.properties[GlobalConstant.memoOfProperty].trim() != '' ?
                                    <div 
                                        dangerouslySetInnerHTML={{
                                            __html: this.state.card.data.properties[GlobalConstant.memoOfProperty]
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