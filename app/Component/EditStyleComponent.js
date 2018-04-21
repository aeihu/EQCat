import React from 'react';
import EditEdgeComponent from './EditEdgeComponent';
import EditNodeComponent from './EditNodeComponent';
import {D3ForceSimulation} from './D3ForceSimulation';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import GlobalConstant from '../Common/GlobalConstant';

export default class EditStyleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parameter: {},
            name: '',
        }
    }  

    setIconInBar = function (icon){
        D3ForceSimulation.setStyle(this.state, 'icon', icon);
        this.props.onChange();
    }.bind(this)

    setColorInBar = function (hex){
        D3ForceSimulation.setStyle(this.state, 'color', hex);
        this.props.onChange();
    }.bind(this)

    setCaptionInBar = function (propertyName){
        D3ForceSimulation.setStyle(this.state, 'caption', propertyName);
    }.bind(this)

    setSizeInBar = function (size){
        if (!isNaN(Number(size))){
            size = Number(size);
            D3ForceSimulation.setStyle(this.state, 'size', size);
        }
    }.bind(this)

    // getStyles = function() {
    //     let xmlhttp = new XMLHttpRequest()
        
    //     xmlhttp.onreadystatechange = function(){
    //         if (xmlhttp.readyState==4 && xmlhttp.status==200){
    //             console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
	// 			let __json = JSON.parse(xmlhttp.responseText);
				
    //             this.NEStyles = __json.styles;
    //         }
    //     }.bind(this)

    //     xmlhttp.open("GET", "/style", true);
    //     xmlhttp.send();
    // }.bind(this)

    componentWillMount()
    {
        this.setState(function(prevState, props) {
            this.state.parameter = props.parameter;
            return prevState;
        })
    }

    render() {
        let __nodeChip = [];
        for (let key in this.props.data.nodes){
            if (key != '*'){
                let __keys = Object.keys(this.props.data.nodes[key].propertiesList);
                D3ForceSimulation.getNodeStyle(key).caption = __keys.length > 1 ? __keys[1] : __keys[0];
            }

            //////////////////////////////////////////////
            if (this.props.data.nodes[key].total > 0 || key == '*'){
                __nodeChip.push(<Chip 
                    className="labelChip" 
                    labelStyle={{fontSize: '12px'}}
                    onClick={key != '*' ? 
                        function(){
                            if (this.state.parameter.mode != GlobalConstant.mode.node
                                || this.state.name != key){

                                this.setState(function(prevState, props) {
                                    prevState.parameter.mode = GlobalConstant.mode.node;
                                    prevState.name = key;
                                    
                                    return prevState;
                                });
                            }
                        }.bind(this) 
                        :
                        null}
                    >
                        {key != '*' ?
                            <Avatar src={D3ForceSimulation.getNodeStyle(key).icon} 
                                style={{
                                        width:'23px', 
                                        height:'23px', 
                                        marginLeft:'6px', 
                                        borderRadius:'0%', 
                                        backgroundColor:'#00000000'
                                }} 
                            />
                            : ''
                        }
                        {key + '(' + this.props.data.nodes[key].total + ')'}
                    </Chip>);
            }
        }

        let __edgeChip = [];
        for (let key in this.props.data.edges){
            if (this.props.data.edges[key] > 0 || key == '*'){
                __edgeChip.push(<Chip 
                    className="edgeChip" 
                    labelStyle={{fontSize: '12px'}}
                    onClick={key != '*' ? 
                        function(){
                            if (this.state.parameter.mode != GlobalConstant.mode.edge
                                || this.state.name != key){

                                this.setState(function(prevState, props) {
                                    prevState.parameter.mode = GlobalConstant.mode.edge; // 0:empty 1:node 2:edge
                                    prevState.name = key;
                                    
                                    return prevState;
                                });
                            }
                        }.bind(this) 
                        :
                        null}
                    >
                        {key != '*' ?
                            <Avatar
                                style={{
                                    width:'18px', 
                                    height:'18px', 
                                    marginLeft:'6px', 
                                    borderRadius:'0%', 
                                    backgroundColor:D3ForceSimulation.getEdgeStyle(key).color
                                }}
                            />
                            : ''
                        }
                        {key + '(' + this.props.data.edges[key] + ')'}
                    </Chip>);
            }
        }
        
        return (
            <div style={{display: 'flex', flexDirection: 'column', width:'100%'}} >
                <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
                    {__nodeChip}
                </div>
                <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
                    {__edgeChip}
                </div>
                {this.state.parameter.mode == GlobalConstant.mode.node ? ///////////////////  editMode  /////////////////////////
                    <EditNodeComponent 
                        size={D3ForceSimulation.getNodeStyle(this.state.name).size}
                        caption={D3ForceSimulation.getNodeStyle(this.state.name).caption}
                        icon={D3ForceSimulation.getNodeStyle(this.state.name).icon}
                        data={this.props.data.nodes} 
                        chipName={this.state.name} 
                        onIconChange={this.setIconInBar}
                        onCaptionChange={this.setCaptionInBar}
                        onSizeChange={this.setSizeInBar} />
                : this.state.parameter.mode == GlobalConstant.mode.edge ?
                    <EditEdgeComponent 
                        color={D3ForceSimulation.getEdgeStyle(this.state.name).color}
                        data={this.props.data.edges} 
                        chipName={this.state.name} 
                        onChange={this.setColorInBar} />
                :
                    <div></div>}
            </div>
        )
    }
}