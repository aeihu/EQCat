import React from 'react';
import EditEdgeComponent from './EditEdgeComponent';
import EditNodeComponent from './EditNodeComponent';
import {D3ForceSimulation} from './D3ForceSimulation';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';

const defaultIcon = 'icons/default/ic_add_to_queue_24px.svg';

export default class EditStyleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 0, // 0:empty 1:node 2:edge
            name: '',
        }
    }  

    setIconInBar = function (icon){
        D3ForceSimulation.setStyle(this.state, 'icon', icon);
        this.setState(function(prevState, props) {
            return prevState;
        });
    }.bind(this)

    setColorInBar = function (hex){
        D3ForceSimulation.setStyle(this.state, 'color', hex);
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

    render() {
        let __nodeChip = [];
        for (let key in this.props.data.nodes){
            if (!D3ForceSimulation.NEStyles.nodes.hasOwnProperty(key) && key!='*'){
                D3ForceSimulation.NEStyles.nodes[key] = {
                    icon: defaultIcon,
                    size: 50,
                    caption: this.props.data.nodes[key].propertiesList.length > 1 ? 
                        this.props.data.nodes[key].propertiesList[1] :
                        this.props.data.nodes[key].propertiesList[0]
                };
            }

            //////////////////////////////////////////////
            __nodeChip.push(<Chip 
                className="labelChip" 
                labelStyle={{fontSize: '12px'}}
                onClick={key != '*' ? 
                    function(){
                        if (this.state.mode != 1
                            || this.state.name != key){

                            this.setState(function(prevState, props) {
                                prevState.mode = 1; // 0:empty 1:node 2:edge
                                prevState.name = key;
                                
                                return prevState;
                            });
                        }
                    }.bind(this) 
                    :
                    null}
                >
                    {key != '*' ?
                        <Avatar src={D3ForceSimulation.NEStyles.nodes[key].icon} 
                            style={
                                {
                                    width:'23px', 
                                    height:'23px', 
                                    marginLeft:'6px', 
                                    borderRadius:'0%', 
                                    backgroundColor:'#00000000'}} />
                        : ''
                    }
                    {key + '(' + this.props.data.nodes[key].total + ')'}
                </Chip>);
        }

        let __edgeChip = [];
        for (let key in this.props.data.edges){
            if (!D3ForceSimulation.NEStyles.edges.hasOwnProperty(key) && key!='*'){
                D3ForceSimulation.NEStyles.edges[key] = {
                    color: '#000000'
                };
            }
            //////////////////////////////////////////////

            __edgeChip.push(<Chip 
                className="edgeChip" 
                labelStyle={{fontSize: '12px'}}
                onClick={key != '*' ? 
                    function(){
                        if (this.state.mode != 2
                            || this.state.name != key){

                            this.setState(function(prevState, props) {
                                prevState.mode = 2; // 0:empty 1:node 2:edge
                                prevState.name = key;
                                
                                return prevState;
                            });
                        }
                    }.bind(this) 
                    :
                    null}
                >
                    {key + '(' + this.props.data.edges[key] + ')'}
                </Chip>);
        }
        
        return (
            <div style={{display: 'flex', flexDirection: 'column', width:'100%'}} >
                <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', flex:'0 0 auto'}} >
                    {/* <FlatButton label={this.props.data.statement} labelPosition="before" containerElement="label" /> */}
                    <FlatButton label='AA' labelPosition="before" containerElement="label" style={{alignSelf: 'flex-end'}} onClick={D3ForceSimulation.showOrHideImage} />
                    <FlatButton label='BB' labelPosition="before" containerElement="label" style={{alignSelf: 'flex-end'}} onClick={D3ForceSimulation.showOrHideImage} />
                </div>
                <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
                    {__nodeChip}
                </div>
                <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
                    {__edgeChip}
                </div>
                {this.state.mode == 1 ? ///////////////////  editMode  /////////////////////////
                    <EditNodeComponent 
                        size={D3ForceSimulation.NEStyles.nodes[this.state.name].size}
                        caption={D3ForceSimulation.NEStyles.nodes[this.state.name].caption}
                        icon={D3ForceSimulation.NEStyles.nodes[this.state.name].icon}
                        data={this.props.data.nodes} 
                        chipName={this.state.name} 
                        onIconChange={this.setIconInBar}
                        onCaptionChange={this.setCaptionInBar}
                        onSizeChange={this.setSizeInBar} />
                : this.state.mode == 2 ?
                    <EditEdgeComponent 
                        color={D3ForceSimulation.NEStyles.edges[this.state.name].color}
                        data={this.props.data.edges} 
                        chipName={this.state.name} 
                        onChange={this.setColorInBar} />
                :
                    <div></div>}
            </div>
        )
    }
}