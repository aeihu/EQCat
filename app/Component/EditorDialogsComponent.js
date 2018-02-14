import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Add from 'material-ui/svg-icons/content/add';
import Clear from 'material-ui/svg-icons/content/clear';

	/**
	 * Dialog content can be scrollable.
	 */
export default class EditorDialogsComponent extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
			template: {},
			open: false,
			labelAutoComplete: '',
			labels: [],
			properties:[
                //{key:1,type:'String',value:'1'}
			],
		//======DataSource=======
			labelList: [],
			propertyList: [],
		};

		this.getTemplate();
	}
	
	updateInputForLabel = (searchText) => {
		this.setState(function(prevState, props) {
            prevState.labelAutoComplete = searchText;
            return prevState;
        });
	};

	newRequestForLabel = (value) => {
		this.setState(function(prevState, props) {
			console.log('newRequestForLabel');
            prevState.labelAutoComplete = value;
            return prevState;
        });
	};

	updateInputForPropertyKey = (searchText, index) => {
		this.setState(function(prevState, props) {
            prevState.properties[index].key = searchText;
            return prevState;
        });
	};

	newRequestForPropertyKey = (index, value) => {
		this.setState(function(prevState, props) {
            prevState.properties[index].key = value;
            return prevState;
        });
	};

	setPropertiesByLabel = (labelName) => {
		if (this.state.template.hasOwnProperty(labelName)){
			this.setState(function(prevState, props) {
				let __isHas = false;
				for (let key in prevState.template[labelName]){
					__isHas = false;
					for (let i = 0; i < prevState.properties.length; i++){
						if (prevState.properties[i].key == key){
							__isHas = true;
							break;
						}
					}
					
					if (!__isHas)
						prevState.properties.push({
							key : key,
							type : prevState.template[labelName][key],
							value : prevState.template[labelName][key] == 'Boolean' ? true :
								prevState.template[labelName][key] == 'List' ? [] : ''
						});
				}
				
				return prevState;
			});
		}
	}

	addLabel = () => {
        for (let i = 0; i < this.state.labels.length; i++){
			if (this.state.labels[i] == this.state.labelAutoComplete){
				return;
			}
		}

		this.setState(function(prevState, props) {
            prevState.labels.push(prevState.labelAutoComplete);
            return prevState;
        });
	};

	delLabel = (key) => {
		console.log(key);
        for (let i = 0; i < this.state.labels.length; i++){
            if (i == key){
                this.setState(function(prevState, props) {
                    prevState.labels.splice(i, 1);
                    return prevState;
				});
				break;
            }
		}
	};

	getTemplate = function() {
        let xmlhttp = new XMLHttpRequest()
        
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
				let __json = JSON.parse(xmlhttp.responseText);
				let __template = __json;
				let __labelList = [];
				for (let key in __json){
					__labelList.push(key);
				}

                this.setState(function(prevState, props) {
					prevState.template = __template;
					prevState.labelList = __labelList;
                    return prevState;
				});
            }
        }.bind(this)

        xmlhttp.open("GET", "/template", true);
        xmlhttp.send();
	}.bind(this)
	
	
	// setTemplate = function() {
    //     let xmlhttp = new XMLHttpRequest()
        
    //     xmlhttp.onreadystatechange = function(){
    //         if (xmlhttp.readyState==4 && xmlhttp.status==200){
    //             console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
	// 			let __template = JSON.parse(xmlhttp.responseText);
	// 			let __labelList = [];
	// 			for (let key in __template){
	// 				__labelList.push(key);
	// 			}

    //             this.setState(function(prevState, props) {
	// 				prevState.template = __template;
	// 				prevState.labelList = __labelList;
    //                 return prevState;
	// 			});
    //         }
    //     }.bind(this)

    //     xmlhttp.open("GET", "/template", true);
    //     xmlhttp.send();
	// }.bind(this)

	addProperty = function (){
        this.setState(function(prevState, props) {
            prevState.properties.push({key:'',type:'String', value:''});
            return prevState;
        }.bind(this));
    }.bind(this)

    delProperty = function (index) {
        this.setState(function(prevState, props) {
            prevState.properties.splice(index, 1);
            return prevState;
        });
	}

	render() {
		console.log('render');
		const __actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={() => this.setState(function(prevState, props) {
					prevState.open = false;
					return prevState;
				})}
			/>,
			<FlatButton
				label="Submit"
				primary={true}
				keyboardFocused={true}
				onClick={this.handleClose}
			/>,
		];

        let __labelChip = [];
        for (let i = 0; i < this.state.labels.length; i++){
			__labelChip.push(<Chip 
					key={i}
					className="labelChip"
					deleteIconStyle={{margin:'4px', height:'16px', width:'16px'}}
					style={this.state.template.hasOwnProperty(this.state.labels[i]) ? {border:'2px solid #a1a1ff'} : {}}
					labelStyle={{fontSize: '12px'}}
					onClick={this.state.template.hasOwnProperty(this.state.labels[i]) ? 
						() => this.setPropertiesByLabel(this.state.labels[i]) :
						null}
					onRequestDelete={() => this.delLabel(i)}
					>
						{this.state.labels[i]}
				</Chip>);
		}
		
		let __propertiesElement = [];
        for (let i = 0; i < this.state.properties.length; i++){
            console.log(i);
            __propertiesElement.push(
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                    <AutoComplete
						hintText='Key'
                        searchText={this.state.properties[i].key}
                        onUpdateInput={(searchText) => this.updateInputForPropertyKey(searchText, i)}
                        onNewRequest={(chosenRequest) => this.newRequestForPropertyKey(chosenRequest, i)}
                        dataSource={[1,2,3,4,5]}
                        filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
                        // openOnFocus={false}
                        maxSearchResults={6}
                    />
                    <strong style={{margin: '4px'}} >{':'}</strong>
                    {this.state.properties[i].type == 'Boolean' ?
						<Toggle
							labelPosition="right"
							label="Boolean"
							onToggle={this.handleToggle}
							defaultToggled={true}
							style={{width:'256px', }}
						/> :
						this.state.properties[i].type == 'List' ?
							<div /> :
							<TextField 
								id={'value' + i}
								hintText={'value[' + this.state.properties[i].type + ']'} 
								onChange={function (event, newValue) {
									this.setState(function(prevState, props) {
										this.state.properties[i].value = newValue;
										return prevState;
									});
								}.bind(this)}
								errorText={this.state.properties[i].type == 'Number' ? isNaN(this.state.properties[i].value) ? "It's not number" : '' : ''}
								value={this.state.properties[i].value}
							/>
					}
                    <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        onChange ={function(event, value) {
								this.setState(function(prevState, props) {
									console.log(value);
									console.log(i);
									prevState.properties[i].type = value;
									return prevState;
								});
							}.bind(this)
						}
                    >
                        <MenuItem value="String" primaryText="String" />
                        <MenuItem value="Number" primaryText="Number" />
                        <MenuItem value="Boolean" primaryText="Boolean" />
                        <MenuItem value="List" primaryText="List" />
                    </IconMenu>
					<IconButton onClick={() => this.delProperty(i)}><Clear /></IconButton>
                </div>
            );
        }

		return (
			<Dialog
				title="Scrollable Dialog"
				actions={__actions}
				modal={false}
				open={this.state.open}
				onRequestClose={function()
					{
						this.setState({open: false});
					}.bind(this)
				}
				autoScrollBodyContent={true}
			>
				<div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto'}} >
					{__labelChip}
				</div>
				<div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', alignItems: 'flex-end'}} >
					<AutoComplete
						floatingLabelText="Label"
						searchText={this.state.labelAutoComplete}
						onUpdateInput={this.updateInputForLabel}
						onNewRequest={this.newRequestForLabel}
						dataSource={this.state.labelList}
						filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
						openOnFocus={false}
						maxSearchResults={6}
					/>
					<RaisedButton
						onClick={this.addLabel}
						label="Add Label"
						style={{margin: 12}}
						primary={true}
					/>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
					<h3>Properties</h3>
					{__propertiesElement}
					<div>
						<RaisedButton
							onClick={this.addProperty}
							label="Add Property"
							//style={{margin: 12}}
							primary={true}
						/>
					</div>
				</div>
			</Dialog>
		);
	}
}