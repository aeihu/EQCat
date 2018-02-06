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

const styles = {
	radioButton: {
		marginTop: 16,
	},
};

	/**
	 * Dialog content can be scrollable.
	 */
export default class EditorDialogsComponent extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
			template: {},
			labelList: [],
			open: true,
			searchText: '',
			snackOpen: false,
			labels: [],
			properties:[
                //{key:1,type:'String',value:'1'}
            ]
		};
    }

	// handleOpen = () => {
	//   this.setState({open: true});
	// };

	handleUpdateInput = (searchText) => {
		this.setState(function(prevState, props) {
            prevState.searchText = searchText;
            return prevState;
        });
	};

	handleNewRequest = () => {
		this.setState(function(prevState, props) {
            prevState.searchText = '';
            return prevState;
        });
	};

	handleAddLabel = () => {
		console.log(this.refs.iconbtn.props.value);
        for (let i = 0; i < this.state.labels.length; i++){
			if (this.state.labels[i] == this.state.searchText){
				this.handleClick();
				return;
			}
		}

		this.setState(function(prevState, props) {
            prevState.labels.push(prevState.searchText);
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

	// getTemplate = function() {
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
            this.PropertiesElement.splice(index, 4);
            return prevState;
        });
	}
	
	handleOnRequestChange = (value, index) => {
		console.log(value);
		console.log(index);
		// this.setState({
		//   	openMenu: value,
		// });
	}

	render() {
		console.log('render');
		const __actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={this.handleClose}
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
				labelStyle={{fontSize: '12px'}}
				onRequestDelete={() => this.delLabel(i)}
                >
                    {this.state.labels[i]}
                </Chip>);
		}
		
		let __propertiesElement = [];
        for (let i = 0; i < this.state.properties.length; i++){
            console.log(i);
            __propertiesElement.push(
                <div style={{display: 'flex', flexDirection: 'row'}} >
                    <AutoComplete
                        ref={'key' + i}
                        searchText={this.state.properties[i].key}
                        // onUpdateInput={this.handleUpdateInput}
                        // onNewRequest={this.handleNewRequest}
                        dataSource={[1,2,3,4,5]}
                        // filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
                        // openOnFocus={false}
                        // maxSearchResults={6}
                    />
                    <strong style={{margin: '4px'}} >{':'}</strong>
                    {this.state.properties[i].type == 'Number' ? 
                        <TextField 
                            ref={'value' + i}
                            hintText="Number" 
                            onChange={function (event, newValue) {
                                //if (typeof newValue ==='number'&& isFinite(newValue))
                            }}
                        /> : 
                        this.state.properties[i].type == 'Boolean' ?
                            <Toggle
								ref={'value' + i}
								labelPosition="right"
                                label=""
                                onToggle={this.handleToggle}
                                defaultToggled={true}
                            /> :
                            this.state.properties[i].type == 'List' ?
                                <div /> :
                                <TextField ref={'value' + i} hintText="String" value={this.state.properties[i].value} />}
                    
                    <IconMenu
                        ref={'iconbtn' + i}
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
                        //value={this.state.properties[i].type}
                    >
                        <MenuItem value="String" primaryText="String" />
                        <MenuItem value="Number" primaryText="Number" />
                        <MenuItem value="Boolean" primaryText="Boolean" />
                        <MenuItem value="List" primaryText="List" />
                    </IconMenu>
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
				<div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
					{__labelChip}
				</div>
				<div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', borderTop:'1px solid #e8e8e8', alignItems: 'flex-end'}} >
					<AutoComplete
						floatingLabelText="Label"
						searchText={this.state.searchText}
						onUpdateInput={this.handleUpdateInput}
						onNewRequest={this.handleNewRequest}
						dataSource={this.state.labelList}
						filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
						openOnFocus={false}
						maxSearchResults={6}
					/>
				</div>
				<h3>Properties</h3>
				<div style={{display: 'flex', flexDirection: 'column', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
					{__propertiesElement}
					<FlatButton
						label="Cancel"
						primary={true}
						onClick={this.addProperty}
					/>
				</div>
			</Dialog>
		);
	}
}