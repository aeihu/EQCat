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
import {D3ForceSimulation} from './D3ForceSimulation';
import Avatar from 'material-ui/Avatar';
import AddBox from 'material-ui/svg-icons/content/add-box';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import {GridList, GridTile} from 'material-ui/GridList';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Checkbox from 'material-ui/Checkbox';
import Upload from 'rc-upload';
import CircularProgress from 'material-ui/CircularProgress';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import GlobalConstant from '../Common/GlobalConstant';
import GlobalFunction from '../Common/GlobalFunction';

export default class EditorDialogsComponent extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
			progress: false,
			templates: {},
			labelAutoComplete: '',

			memo: {},
			images: [],
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

	newRequestForPropertyKey = (value, index) => {
		this.setState(function(prevState, props) {
            prevState.properties[index].key = value;
            return prevState;
        });
	};

	setPropertiesByLabel = (labelName) => {
		if (this.state.templates.hasOwnProperty(labelName)){
			this.setState(function(prevState, props) {
				let __isHas = false;
				for (let key in prevState.templates[labelName]){
					__isHas = false;
					for (let i = 0; i < prevState.properties.length; i++){
						if (prevState.properties[i].key == key){
							__isHas = true;
							break;
						}
					}
					
					if (!__isHas){
						let __val = '';
						switch (prevState.templates[labelName][key]){
							case 'boolean':
								__val = true;
								break;
							case 'string':
							case 'number':
								__val = '';
								break;
							default:
								__val = [];
								break;
						}
						prevState.properties.push({
							key : key,
							type : prevState.templates[labelName][key],
							value : __val
						});
					}
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
				
                this.setState(function(prevState, props) {
					prevState.templates = __json.templates;
					prevState.labelList = __json.labels;
					prevState.propertyList = __json.propertyKeys;
                    return prevState;
				});
            }
        }.bind(this)

        xmlhttp.open("GET", "/template", true);
        xmlhttp.send();
	}.bind(this)
	
	
	mergeNode = function() {
		let __node = {
			id: this.props.data.id,
			labels:{
				merge: [...this.state.labels],
				remove:[],
			},
			properties:{
				merge:{},
				remove:[],
			}
		};

		let __prevData = {...this.props.data.properties};
		console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
		console.log(this.props.data.properties)
		console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
		console.log(__prevData)
		
		/////////////////////////////////////////////
		//			merge properties
		/////////////////////////////////////////////

		for (let i=0; i<this.state.properties.length; i++){
			let __key = this.state.properties[i].key;
			let __val = this.state.properties[i].value;

			switch (this.state.properties[i].type){
				case 'number':
					__val = Number(__val);
					break;
				case 'listNumber':{
					let __listNumber = [];
					for (let i=0; i<__val.length; i++){
						__listNumber.push(Number(__val[i]));
					}
					__val = __listNumber;
					break;
				}
			}

			if (__prevData.hasOwnProperty(__key)){
				switch (this.state.properties[i].type){
					case 'listString':
					case 'listNumber':
					case 'listBoolean':
						if(!GlobalFunction.ArrayEquals(__val, __prevData[__key])){
							__node.properties.merge[__key] = __val;
						}
						break;
					default:
						if (__prevData[__key] != __val){
							__node.properties.merge[__key] = __val;
						}
						break;
				}
				
				delete __prevData[__key];
			}else{
				__node.properties.merge[__key] = __val;
			}
		}

		for (let key in __prevData){
			__node.properties.remove.push(key);
		}

		/////////////////////////////////////////////
		//			merge labels
		/////////////////////////////////////////////

		__prevData = [...this.props.data.labels];
		let __isRemove = true;
		for (let i=0; i<__prevData.length; i++){
			__isRemove = true;
			for (let j=0; j<__node.labels.merge.length; j++){
				if (__node.labels.merge[j] == __prevData[i]){
					__node.labels.merge.splice(j, 1);
					__isRemove = false;
					break;
				}
			}

			if (__isRemove){
				__node.labels.remove.push(__prevData[i]);
			}
		}
		console.log(__node.labels.merge)
		console.log(__node.labels.remove)

		if (__node.labels.merge.length > 0 ||
			__node.labels.remove.length > 0 ||
			Object.keys(__node.properties.merge).length > 0 ||
			__node.properties.remove.length > 0)
		{
			let xmlhttp = new XMLHttpRequest()
			
			xmlhttp.onreadystatechange = function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
					let __node = JSON.parse(xmlhttp.responseText);
					console.log('ssssssssssssssssssssssssssssssssssssssss')
					console.log(__node)
					this.props.onMergeNode(__node);
				}
			}.bind(this)

			xmlhttp.open("GET", "/mergeNode?node=" + JSON.stringify(__node), true);
			xmlhttp.send();
		}
	}.bind(this)

	addProperty = function (){
        this.setState(function(prevState, props) {
            prevState.properties.push({key:'',type:'string', value:''});
            return prevState;
        }.bind(this));
    }.bind(this)

    delProperty = function (index) {
        this.setState(function(prevState, props) {
            prevState.properties.splice(index, 1);
            return prevState;
        });
	}
	
    componentWillReceiveProps(newProps)
    {
		if (newProps.data != null){
			this.setState(function(prevState, props) {
				prevState.labels = [...newProps.data.labels];
				
				//{key:1,type:'String',value:'1'}
				prevState.properties=[];
				prevState.images = [];
				prevState.memo = {
					key: GlobalConstant.memoOfProperty,
					value: '',
					type: 'string'
				};

				for (let key in newProps.data.properties){
					switch (key){
						case GlobalConstant.imagesOfProperty:
							prevState.images = [...newProps.data.properties[key]];
							break;
						case GlobalConstant.memoOfProperty:
							prevState.memo.value = newProps.data.properties[key];
							console.log('prevState.memo.value');
							console.log(newProps.data.properties[key]);
							break;
						default:{
							let __type = typeof newProps.data.properties[key];
							if (__type == 'object'){
								__type = "listString";
								if (newProps.data.properties[key].length > 0){
									switch (typeof newProps.data.properties[key][0]){
										case 'string':
											__type = "listString";
											break;
										case 'number':
											__type = "listNumber";
											break;
										case 'boolean':
											__type = "listBoolean";
											break;
									}
								}
							}

							prevState.properties.push({
								key: key,
								value: typeof newProps.data.properties[key] == 'object' ? 
									[...newProps.data.properties[key]]
									:
									newProps.data.properties[key],
								type: __type
							});
						}
					}
				}

				prevState.properties.push(prevState.memo);
				prevState.properties.push({
					key: GlobalConstant.imagesOfProperty,
					value: prevState.images,
					type: 'listString'
				});
				
				return prevState;
			});
		}
	}
	
	render() {
		const __actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={this.props.onRequestClose}
			/>,
			<FlatButton
				label="Submit"
				primary={true}
				keyboardFocused={true}
				onClick={this.mergeNode}
			/>,
		];

        let __labelChip = [];
        for (let i = 0; i < this.state.labels.length; i++){
			__labelChip.push(<Chip 
					key={i}
					className="labelChip"
					deleteIconStyle={{margin:'4px', height:'16px', width:'16px'}}
					style={this.state.templates.hasOwnProperty(this.state.labels[i]) ? {border:'2px solid #a1a1ff'} : {}}
					labelStyle={{fontSize: '12px'}}
					onClick={this.state.templates.hasOwnProperty(this.state.labels[i]) ? 
						() => this.setPropertiesByLabel(this.state.labels[i]) :
						null}
					onRequestDelete={() => this.delLabel(i)}
					>
						{D3ForceSimulation.NEStyles.nodes.hasOwnProperty(this.state.labels[i]) ?
							<Avatar src={D3ForceSimulation.NEStyles.nodes[this.state.labels[i]].icon} 
								style={
									{
										width:'23px', 
										height:'23px', 
										marginLeft:'6px', 
										borderRadius:'0%', 
										backgroundColor:'#00000000'}} 
							/>
							:
							''
						}
						{this.state.labels[i]}
				</Chip>);
		}
		
		let __propertiesElement = [];
        for (let i = 0; i < this.state.properties.length; i++){
			if (this.state.properties[i].key == GlobalConstant.imagesOfProperty || 
				this.state.properties[i].key == GlobalConstant.memoOfProperty)
				continue;

            __propertiesElement.push(
				<div style={{
					display: 'flex', 
					flexDirection: 'row', 
					alignItems: 'flex-end',
					flexWrap: 'wrap',}} >
					<div>
						<AutoComplete
							hintText='Key'
							searchText={this.state.properties[i].key}
							onUpdateInput={(searchText) => this.updateInputForPropertyKey(searchText, i)}
							onNewRequest={(chosenRequest) => this.newRequestForPropertyKey(chosenRequest, i)}
							dataSource={this.state.propertyList}
							filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
							// openOnFocus={false}
							maxSearchResults={6}
						/>
						<strong style={{margin: '4px'}} >{':'}</strong>
					</div>
                    {this.state.properties[i].type == 'boolean' ?
						<Checkbox
							label=""
							style={{width:'256px', }}
							  checked={this.state.properties[i].value}
							  onCheck={function(event, isInputChecked){
								this.setState(function(prevState, props) {
									this.state.properties[i].value = isInputChecked;
									return prevState;
								})
							}.bind(this)}
						/>
						:
						this.state.properties[i].type == 'listString' || 
						this.state.properties[i].type == 'listNumber' || 
						this.state.properties[i].type == 'listBoolean' ?
							<div style={{
								borderBottom: '1px solid rgb(224, 224, 224)',
								marginBottom: '10px',
								paddingBottom: '3px',
								width:'525px',
								display: 'flex', 
								flexWrap: 'wrap',
								flexDirection: 'row', 
								alignItems: 'center'}}>
								{this.state.properties[i].value.map((value, index) => (
									<div
										style={{
										display: 'flex',
										alignItems: 'center',
										paddingRight: '8px',
										borderRadius: '10px',
										backgroundColor: 'Gainsboro',
										margin: '3px',
										height: '25px'
									}}>
										<Avatar
											backgroundColor='Tomato'
											size={25}
											style={{marginRight:'2px'}}
										>
											{index}
										</Avatar>
										{this.state.properties[i].type == 'listBoolean' ?
											<Checkbox
												label=""
												style={{width:'40px', }}
          										checked={this.state.properties[i].value[index]}
          										onCheck={function(event, isInputChecked){
													this.setState(function(prevState, props) {
														this.state.properties[i].value[index] = isInputChecked;
														return prevState;
													})
												}.bind(this)}
											/>
											:
											<TextField 
												id={this.state.properties[i].key + index}
												underlineStyle={{borderColor:'Gainsboro'}}
												inputStyle={{fontSize: '12px'}}
												hintStyle={{fontSize: '12px', lineHeight: '10px'}}
												hintText={this.state.properties[i].type == 'listString' ? 'String' : 'Number'} 
												floatingLabelStyle={{fontSize: '12px'}}
												floatingLabelShrinkStyle={{fontSize: '12px'}}
												floatingLabelFocusStyle={{fontSize: '12px'}}
												style={{width:'85px',height:'32px'}} 
												errorStyle={{fontSize: '10px', lineHeight:'0px'}}
												errorText={this.state.properties[i].type == 'listNumber' ? 
													isNaN(this.state.properties[i].value[index]) ? 
														"It's not number" : '' : ''}
												onChange={function (event, newValue) {
													this.setState(function(prevState, props) {
														this.state.properties[i].value[index] = newValue;
														return prevState;
													});
												}.bind(this)}
												value={this.state.properties[i].value[index]}
											/>
										}
										<IconButton 
											style={{
												padding:'0px',
												width: '24px',
												height: '24px'
											}}
											onClick={function(event) {
												this.setState(function(prevState, props) {
													prevState.properties[i].value.splice(index, 1);
													return prevState;
												});
											}.bind(this)}
										>
											<Clear
												style={{
													height: '24px',
													width: '24px',}} 
											/>
										</IconButton>
									</div>
								))}
								
								<IconButton 
									style={{
										padding:'0px',
										width: '25px',
										height: '25px',
										marginRight: '5px'
									}}
									onClick={function(event) {
										this.setState(function(prevState, props) {
											prevState.properties[i].value.push(
												prevState.properties[i].type == 'listBoolean' ? 
												true : '');
											return prevState;
										});
										console.log(this.state.properties[i].value)
									}.bind(this)}
								>
									<AddBox />
								</IconButton>
								<IconMenu
									iconButtonElement={
										<IconButton 
											style={{
												padding:'0px',
												width: '25px',
												height: '25px'
											}}
										>
											<MoreVertIcon />
										</IconButton>}
									onChange ={function(event, value) {
											this.setState(function(prevState, props) {
												prevState.properties[i].value = [];
												return prevState;
											});
										}.bind(this)
									}
								>
									<MenuItem value="string" primaryText="String" />
									<MenuItem value="number" primaryText="Number" />
									<MenuItem value="boolean" primaryText="Boolean" />
								</IconMenu>
							</div>
							:
							<TextField 
								id={this.state.properties[i].key}
								hintText={'Value[' + this.state.properties[i].type + ']'} 
								onChange={function (event, newValue) {
									this.setState(function(prevState, props) {
										this.state.properties[i].value = newValue;
										return prevState;
									});
								}.bind(this)}
								errorText={this.state.properties[i].type == 'number' ? isNaN(this.state.properties[i].value) ? "It's not number" : '' : ''}
								value={this.state.properties[i].value}
							/>
					}
                    <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        onChange={function(event, value) {
								this.setState(function(prevState, props) {
									console.log(value);
									prevState.properties[i].type = value;
									switch (prevState.properties[i].type)
									{
										case 'object':
											prevState.properties[i].value = [];
											break;
										case 'string':
										case 'number':
											prevState.properties[i].value = '';
											break;
										case 'boolean':
											prevState.properties[i].value = true;
											break;
									}
									return prevState;
								});
							}.bind(this)
						}
                    >
                        <MenuItem value="string" primaryText="String" />
                        <MenuItem value="number" primaryText="Number" />
                        <MenuItem value="boolean" primaryText="Boolean" />
						<MenuItem 
							rightIcon={<ArrowDropRight />}
							primaryText="List" 
							menuItems={[
								<MenuItem 
									primaryText="String" 
									onClick={function(event, value) {
											this.setState(function(prevState, props) {
												console.log(value);
												prevState.properties[i].type = "listString";
												prevState.properties[i].value = [];
												return prevState;
											});
										}.bind(this)}
								/>,
								<MenuItem 
									primaryText="Number" 
									onClick={function(event, value) {
											this.setState(function(prevState, props) {
												console.log(value);
												prevState.properties[i].type = "listNumber";
												prevState.properties[i].value = [];
												return prevState;
											});
										}.bind(this)}
								/>,
								<MenuItem 
									primaryText="Boolean" 
									onClick={function(event, value) {
											this.setState(function(prevState, props) {
												console.log(value);
												prevState.properties[i].type = "listBoolean";
												prevState.properties[i].value = [];
												return prevState;
											});
										}.bind(this)}
								/>,
							  ]}
						/>
                    </IconMenu>
					<IconButton onClick={() => this.delProperty(i)}><Clear /></IconButton>
                </div>
            );
		}
		
		return (
			<Dialog
				title="Edit Node"
				actions={__actions}
				modal={false}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose}
				autoScrollBodyContent={true}
			>
				<h2>Labels</h2>
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
					<h2>Images</h2>
					<GridList 
						style={{
							display: 'flex',
							flexWrap: 'nowrap',
							overflowX: 'auto',
							marginBottom: 12
						}}
						cols={2.2}
					>
						{this.state.images.map((tile, index) => (
							<GridTile
								key={tile}
								title={(index + 1) + ' / ' + this.state.images.length}
								style={{width: '280px'}}
								actionIcon={
									<IconButton 
										onClick={function(event) {
											this.setState(function(prevState, props) {
												prevState.images.splice(index, 1);
												return prevState;
											});
										}.bind(this)}
									>
										<Clear color="rgb(0, 188, 212)" />
									</IconButton>}
								titleStyle={{color: 'rgb(0, 188, 212)',}}
								titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
							>
								<img src={tile} />
							</GridTile>
						))}
						<GridTile
							key='tile'
							title='tile.title'
							actionIcon={<IconButton><Clear color="rgb(0, 188, 212)"/></IconButton>}
							titleStyle={{color: 'rgb(0, 188, 212)',}}
							titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
						>
							<Upload
								action='/upload_image'
								accept="image/*"
								beforeUpload={(file) => {
									console.log('beforeUpload', file.name);
									this.setState(function(prevState, props) {
										prevState.progress = true;
										return prevState;
									})
								}}
								onStart={(file) => {
								console.log('onStart', file.name);
								// this.refs.inner.abort(file);
								}}
								onSuccess={(file) => {
									console.log('onSuccess', file);
									this.setState(function(prevState, props) {
										prevState.images.push('/images/'+file);
									    prevState.progress = false;
     									return prevState;
									})
								}}
								onProgress={(step, file) => {
									console.log('onProgress', Math.round(step.percent), file.name);
								}}
								onError={(err) => {
									console.log('onError', err);
									this.setState(function(prevState, props) {
										prevState.progress = false;
										return prevState;
									})
								}}
							>
								{this.state.progress ? 
									<CircularProgress/>
									:
									<IconButton
										onClick={()=>{console.log('upload')}}
										//tooltip="Add Icon"
									>
										<AddBox/>
									</IconButton>
								}
							</Upload>
						</GridTile>
					</GridList>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
					<h2>Properties</h2>
					{__propertiesElement}
					<div>
						<RaisedButton
							onClick={this.addProperty}
							label="Add Property"
							style={{margin: 12}}
							primary={true}
						/>
					</div>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
					<h2>Memo</h2>
					<ReactQuill 
						style={{marginBottom: 12}}
						value={this.state.memo.value}
                  		onChange={(value)=>{
							this.setState(function(prevState, props) {
								prevState.memo.value = value;
								return prevState;
							})
						  }}
					/>
				</div>
			</Dialog>
		);
	}
}