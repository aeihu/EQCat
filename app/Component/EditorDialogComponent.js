import React from 'react';
import Upload from 'rc-upload';
import { Base64 } from 'js-base64';

import {D3ForceSimulation} from './D3ForceSimulation';
import GlobalVariable from '../../Common/GlobalVariable';
import GlobalConstant from '../../Common/GlobalConstant';
import GlobalFunction from '../../Common/GlobalFunction';
import EditorConvertToHTML from './EditorConvertToHTML';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import {GridList, GridTile} from 'material-ui/GridList';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';

import Clear from 'material-ui/svg-icons/content/clear';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import ImageLooksOne from 'material-ui/svg-icons/image/looks-one';
import ContentFontDownload from 'material-ui/svg-icons/content/font-download';
import SocialPoll from 'material-ui/svg-icons/social/poll';
import ToggleCheckBox from 'material-ui/svg-icons/toggle/check-box';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default class EditorDialogComponent extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
			progress: false,
			labelForTemplate: '',

			memo: {
				SelectIdx: 0,
				key: GlobalConstant.memoOfProperty,
				value: [],
				type: 'listString'
			},
			images: [],
			labels: [],
			type:'',    // edge
			properties:[
                //{key:1,type:'String',value:'1', oldType'String', oldValue:'1'}
			],
		};
	}

	isCheckError = false;
	checkSubmit = function(mode){
		if (mode == GlobalConstant.mode.edge){
			if (GlobalFunction.CheckName(this.state.type) != ''){
				return -1;
			}
		}else{
			for (let i=0; i<this.state.labels.length; i++){
				if (GlobalFunction.CheckName(this.state.labels[i]) != ''){
					return -2;
				}

				for (let j=i+1; j<this.state.labels.length; j++){
					if (this.state.labels[i] == this.state.labels[j]){
						return -3;
					}
				}
			}
		}

		for (let i=0; i<this.state.properties.length; i++){
			if (GlobalFunction.CheckName(this.state.properties[i].key) != ''){
				return -4;
			}
			
			for (let j=i+1; j<this.state.properties.length; j++){
				if (this.state.properties[i].key == this.state.properties[j].key){
					return -5;
				}
			}

			if (this.state.properties[i].type == 'number'){
				if (isNaN(this.state.properties[i].value)){
					return -6;
				}
			}else if (this.state.properties[i].type == 'listNumber'){
				for (let j=0; j<this.state.properties[j].value.length; j++){
					if (isNaN(this.state.properties[i].value[j])){
						return -6;
					}
				}
			}
		}

		return 0;
	}.bind(this)

	closeDialog = function(){
		this.props.onRequestClose();
		this.isCheckError = false;
	}.bind(this)
	
	updateInputForLabel = (searchText, index) => {
		this.setState(function(prevState, props) {
			if (props.mode != GlobalConstant.mode.edge){
				if (prevState.labelForTemplate == prevState.labels[index]){
					prevState.labelForTemplate = '';
				}
				prevState.labels[index] = searchText;
			}else{
				if (prevState.labelForTemplate == prevState.type){
					prevState.labelForTemplate = '';
				}
				prevState.type = searchText;
			}

            return prevState;
        });
	};

	newRequestForLabel = (value, index) => {
		this.setState(function(prevState, props) {
			if (props.mode != GlobalConstant.mode.edge){
				if (prevState.labelForTemplate == prevState.labels[index]){
					prevState.labelForTemplate = '';
				}
				prevState.labels[index] = value;
			}else{
				if (prevState.labelForTemplate == prevState.type){
					prevState.labelForTemplate = '';
				}
				prevState.type = value;
			}
			
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

	setProperties = (labelName) => {
		let __json = this.props.mode == GlobalConstant.mode.edge ? GlobalVariable.templateList.edges : GlobalVariable.templateList.nodes;
		if (__json.hasOwnProperty(labelName)){
			this.setState(function(prevState, props) {
				let __isHas = false;
				for (let key in __json[labelName]){
					__isHas = false;
					for (let i = 0; i < prevState.properties.length; i++){
						if (prevState.properties[i].key == key){
							__isHas = true;
							break;
						}
					}
					
					if (!__isHas){
						let __val = '';
						switch (__json[labelName][key]){
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
							type : __json[labelName][key],
							value : __val
						});
					}
				}
				
				return prevState;
			});
		}
	}

	addLabel = () => {
		this.setState(function(prevState, props) {
            prevState.labels.push('');
            return prevState;
        });
	};


	addMemo = () => {
		this.setState(function(prevState, props) {
            prevState.memo.value.push('');
            prevState.memo.value.push('');
			console.log(prevState.memo.value)
            return prevState;
        });
	};

	addNode = function() {
		let __node = {
			labels:[],
			properties:{}
		};
		
		/////////////////////////////////////////////
		//			add properties
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
			__node.properties[__key] = __val;
		}

		/////////////////////////////////////////////
		//			add labels
		/////////////////////////////////////////////

		__node.labels = [...this.state.labels];

		GlobalFunction.SendAjax(
			(result)=>{
                GlobalVariable.flagForGetLTP = true;
				this.props.onChangeData(result.records);
				this.props.onMessage('Add node is success', 1);
				this.closeDialog();
			},
			(error)=>{
				this.isCheckError = true;
				this.props.onMessage(error.message, 0)
			},
			"/addNode?node=",
			__node
		);
	}.bind(this)
	
	arrangePropertiesForMerge = function(){
		let __result = {
			merge:{},
			remove:[],
		}

		let __prevData = {...this.props.data.properties};

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
							__result.merge[__key] = __val;
						}
						break;
					default:
						if (__prevData[__key] != __val){
							__result.merge[__key] = __val;
						}
						break;
				}
				
				delete __prevData[__key];
			}else{
				__result.merge[__key] = __val;
			}
		}

		for (let key in __prevData){
			__result.remove.push(key);
		}

		return __result;
	}

	mergeEdge = function(){
		let __edge;
		let __hasChanged = false;
		
		if (this.props.data.type == this.state.type){
			__edge = {
				id: this.props.data.id,
				properties:{
					merge:{},
					remove:[],
				}
			};

			/////////////////////////////////////////////
			//			merge properties
			/////////////////////////////////////////////
			__edge.properties = this.arrangePropertiesForMerge();

			__hasChanged = Object.keys(__edge.properties.merge).length > 0 ||
				__edge.properties.remove.length > 0
		}else{
			__edge = {
				id: this.props.data.id,
				source: this.props.data.source.id,
				target: this.props.data.target.id,
				type: this.state.type,
				properties:{}
			};

			for (let i=0; i<this.state.properties.length; i++){
				let __key = this.state.properties[i].key;
				let __val = this.state.properties[i].value;

				switch (this.state.properties[i].type){
					case 'number':
						__edge.properties[__key] = Number(__val);
						break;
					case 'listNumber':{
						let __listNumber = [];
						for (let i=0; i<__val.length; i++){
							__listNumber.push(Number(__val[i]));
						}
						__edge.properties[__key] = __listNumber;
						break;
					}
					default:
						__edge.properties[__key] = __val;
						break;
				}
			}

			__hasChanged = true;
		}
		
		if (__hasChanged){
			GlobalFunction.SendAjax(
				(result)=>{
					GlobalVariable.flagForGetLTP = true;
					this.props.onChangeData(result.records, this.props.data.id);
					this.props.onMessage('Merge edge is success', 1);
					this.closeDialog();
				},
				(error)=>{
					this.isCheckError = true;
					this.props.onMessage(error.message, 0)
				},
				"/mergeEdge?edge=",
				__edge
			);
		}else{
			this.props.onMessage('Merge node is success', 1);
			this.closeDialog();
		}
	}.bind(this)

	mergeNode = function() {
		let __node = {
			id: this.props.data.id,
			labels:{
				merge: [...this.state.labels],
				remove:[],
			},
			properties:{
				//merge:{},
				//remove:[],
			}
		};
		
		/////////////////////////////////////////////
		//			merge properties
		/////////////////////////////////////////////
		__node.properties = this.arrangePropertiesForMerge();

		/////////////////////////////////////////////
		//			merge labels
		/////////////////////////////////////////////

		let __prevData = [...this.props.data.labels];
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

		if (__node.labels.merge.length > 0 ||
			__node.labels.remove.length > 0 ||
			Object.keys(__node.properties.merge).length > 0 ||
			__node.properties.remove.length > 0)
		{
			GlobalFunction.SendAjax(
				(result)=>{
					GlobalVariable.flagForGetLTP = true;
					this.props.onChangeData(result.records);
					this.props.onMessage('Merge node is success', 1);
					this.closeDialog();
				},
				(error)=>{
					this.isCheckError = true;
					this.props.onMessage(error.message, 0)
				},
				"/mergeNode?node=",
				__node
			);
		}else{
			this.props.onMessage('Merge node is success', 1);
			this.closeDialog();
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

    setTemplate = function () {
		this.isCheckError = true;
		let __name;
		let __mode;
		if (this.props.mode == GlobalConstant.mode.edge){
			if (this.state.type.trim() == ''){
				this.props.onMessage('"Relationship Type" field is empty.', 0)
				return
			}
			__name = this.state.type;
			__mode = 'edges';
		}else{
			if (this.state.labelForTemplate.trim() == ''){
				this.props.onMessage('"Select Label" field is empty.', 0)
				return
			}
			__name = this.state.labelForTemplate;
			__mode = 'nodes';
		}
		
		let __json = {};
		let __flag = GlobalVariable.templateList[__mode].hasOwnProperty(__name);
		let __needSend = false;
		
		for (let i=0; i<this.state.properties.length; i++){
			if (this.state.properties[i].key == GlobalConstant.imagesOfProperty || 
				this.state.properties[i].key == GlobalConstant.memoOfProperty ||
				this.state.properties[i].key.trim() == ''){
				continue;
			}

			if (__flag && !__needSend){
				if (GlobalVariable.templateList[__mode][__name].hasOwnProperty(this.state.properties[i].key)){
					if (GlobalVariable.templateList[__mode][__name][this.state.properties[i].key] != this.state.properties[i].type){
						console.log(1)
						__needSend = true;
					}
				}else{
					console.log(2)
					__needSend = true;
				}
			}else{
				console.log(3)
				__needSend = true;
			}

			__json[this.state.properties[i].key] = this.state.properties[i].type;
		}

		if (!__needSend){
			if (Object.keys(__json).length != Object.keys(GlobalVariable.templateList[__mode][__name]).length){
				console.log(4)
				__needSend = true;
			}
		}

		if (__needSend){
			GlobalFunction.SendAjax(
				(result)=>{
					GlobalVariable.templateList[__mode][__name] = __json;
					this.props.onMessage(__name + "'s Template has been saved.", 1)
				},
				(error)=>{this.props.onMessage(error.message, 0)},
				"/setTemplate?template=",
				{key:__name, value:__json, mode:__mode}
			);
		}else{
			this.props.onMessage(__name + "'s Template has been saved.", 1)
		}
	}.bind(this)

    componentWillMount()
    {
		GlobalFunction.GetLTP();
    }
	
    componentWillReceiveProps(newProps)
    {
		if (this.isCheckError){
			return;
		}

        GlobalFunction.GetLTP();
		GlobalFunction.GetLTP();
		if (newProps.mode == -1){
			this.setState(function(prevState, props) {
				prevState.labels = [];
				prevState.properties=[];
				prevState.images = [];
				prevState.labelForTemplate = '';
				prevState.memo = {
					SelectIdx: 0,
					key: GlobalConstant.memoOfProperty,
					value: [],
					type: 'listString'
				};
				
				prevState.properties.push(prevState.memo);
				prevState.properties.push({
					key: GlobalConstant.imagesOfProperty,
					value: prevState.images,
					type: 'listString'
				});
				return prevState;
			});
		}else{
			this.setState(function(prevState, props) {
				if (props.mode != GlobalConstant.mode.edge){
					prevState.labels = [...newProps.data.labels];
					prevState.labelForTemplate = '';
				}else{
					prevState.type = newProps.data.type;
				}
				
				//{key:1,type:'String',value:'1'}
				prevState.properties=[];
				prevState.images = [];
				prevState.memo = {
					SelectIdx: 0,
					key: GlobalConstant.memoOfProperty,
					value: [],
					type: 'listString'
				};

				for (let key in newProps.data.properties){
					switch (key){
						case GlobalConstant.imagesOfProperty:
							prevState.images = [...newProps.data.properties[key]];
							break;
						case GlobalConstant.memoOfProperty:
							prevState.memo.value = [...newProps.data.properties[key]];
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
								type: __type,
								oldType: __type,
								oldValue: typeof newProps.data.properties[key] == 'object' ? 
									[...newProps.data.properties[key]]
									:
									newProps.data.properties[key]
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
				label="Submit"
				primary={true}
				//keyboardFocused={true}
				onClick={()=>{
					let __result = this.checkSubmit(this.props.mode);
					this.isCheckError = true;
					switch(__result){
						case -1:
							this.props.onMessage('There is invalid type', 0);
							break;
						case -2:
							this.props.onMessage('There is invalid label', 0);
							break;
						case -3:
							this.props.onMessage('There is same label', 0);
							break;
						case -4:
							this.props.onMessage('There is invalid property key', 0);
							break;
						case -5:
							this.props.onMessage('There is same property key', 0);
							break;
						case -6:
							this.props.onMessage('There is invalid property value', 0);
							break;
						default:
							this.isCheckError = false;
							switch(this.props.mode){
								case GlobalConstant.mode.edge:
									this.mergeEdge();
									break;
								case GlobalConstant.mode.node:
									this.mergeNode();
									break;
								default:
									this.addNode();
									break;
							}
							break;
					}
				}}
			/>,
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={this.closeDialog}
			/>,
		];
		
		let __memos = [];
		for (let i = 0; i < this.state.memo.value.length; i+=2){
			__memos.push(
				<div
					style={{
					display: 'flex',
					alignItems: 'center',
					paddingRight: '8px',
					borderRadius: '30px',
					backgroundColor: 'Gainsboro',
					margin: '3px',
					height: '25px',
					border: this.state.memo.SelectIdx == i ? '2px solid tomato' : '2px solid Gainsboro'
				}}>
					<Avatar
						style={{
							cursor: 'pointer',
							width: '28px',
							height: '28px',
							marginLeft: '-1px',
							marginRight: '6px',
							backgroundColor: 'royalblue'
						}}
						onClick={function(event) {
							this.setState(function(prevState, props) {
								prevState.memo.SelectIdx = i;
								return prevState;
							});
						}.bind(this)}
					>
						{i / 2}
					</Avatar>
					<TextField
						style={{width:'80px', height:'32px'}}
						inputStyle={{fontSize: '12px'}}
						onChange={(event, newValue) => {
							this.setState(function(prevState, props) {
								prevState.memo.value[i] = newValue;
								return prevState;
							})
						}}
						value={this.state.memo.value[i]}
						style={{width:'85px',height:'32px'}} 
						textFieldStyle={{width:'85px',height:'32px'}} 
					/>
					<IconButton 
						tooltip="Delete Memo"
						style={{
							padding:'0px',
							width: '24px',
							height: '24px'
						}}
						onClick={function(event) {
							this.setState(function(prevState, props) {
								prevState.memo.value.splice(i, 2);
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
			)
		}
		
		let __chips = [];
		if (this.props.mode != GlobalConstant.mode.edge){
			for (let i = 0; i < this.state.labels.length; i++){
				__chips.push(
					<div
						style={{
						display: 'flex',
						alignItems: 'center',
						paddingRight: '8px',
						borderRadius: '30px',
						backgroundColor: 'Gainsboro',
						margin: '3px',
						height: '25px',
						border: GlobalVariable.templateList['nodes'].hasOwnProperty(this.state.labels[i]) ? '2px solid tomato' : '2px solid Gainsboro'
					}}>
						{GlobalVariable.templateList['nodes'].hasOwnProperty(this.state.labels[i]) ?
							<IconButton 
								tooltip="Set Properties"
								style={{
									marginLeft: '-1px',
									marginRight: '6px',
									backgroundColor: 'tomato',
									borderRadius: '50%',
									padding: '0px',
									width: '28px',
									height: '28px'
								}}
								onClick={()=>{this.setProperties(this.state.labels[i])}}
							>
								<img src={D3ForceSimulation.getNodeStyle(this.state.labels[i]).icon} 
									width='28px'
									height='28px'
								/>
							</IconButton>
							:
							<Avatar
								src={D3ForceSimulation.getNodeStyle(this.state.labels[i]).icon}
								style={{
									width: '28px',
									height: '28px',
									marginLeft: '-1px',
									marginRight: '6px',
									backgroundColor: '#00000000'
								}}
							/>
						}
						<AutoComplete
							errorStyle={{fontSize: '10px', lineHeight:'0px'}}
							errorText={GlobalFunction.CheckName(this.state.labels[i])}
							searchText={this.state.labels[i]}
							onUpdateInput={(searchText)=>this.updateInputForLabel(searchText, i)}
							onNewRequest={(value)=>this.newRequestForLabel(value, i)}
							dataSource={GlobalVariable.labelList}
							filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
							openOnFocus={false}
							maxSearchResults={6}
							style={{width:'85px',height:'32px'}} 
							textFieldStyle={{width:'85px',height:'32px'}} 
							inputStyle={{fontSize: '12px'}}
						/>
						<IconButton 
							tooltip="Delete Label"
							style={{
								padding:'0px',
								width: '24px',
								height: '24px'
							}}
							onClick={function(event) {
								this.setState(function(prevState, props) {
									if (prevState.labelForTemplate == prevState.labels[i]){
										prevState.labelForTemplate = '';
									}

									prevState.labels.splice(i, 1);
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
				)
			}
		}else{
			__chips.push(
				<div
					style={{
					display: 'flex',
					alignItems: 'center',
					paddingRight: '8px',
					borderRadius: '3px',
					backgroundColor: 'Gainsboro',
					margin: '3px',
					height: '25px',
					border: GlobalVariable.templateList['edges'].hasOwnProperty(this.state.type) ? '2px solid tomato' : '2px solid Gainsboro'
				}}>
					{GlobalVariable.templateList['edges'].hasOwnProperty(this.state.type) ?
						<IconButton 
							tooltip="Set Properties"
							style={{
								marginLeft: '6px',
								marginRight: '6px',
								backgroundColor:D3ForceSimulation.getEdgeStyle(this.state.type).color,
								//borderRadius: '50%',
								padding: '0px',
								width: '18px',
								height: '18px'
							}}
							onClick={()=>{this.setProperties(this.state.type)}}
						/>
						:
						<Avatar
							className='edgeAvatar'
							style={{
								marginRight:'6px', 
								backgroundColor:D3ForceSimulation.getEdgeStyle(this.state.type).color
							}} 
						/>
					}
					<AutoComplete
						errorStyle={{fontSize: '10px', lineHeight:'0px'}}s
						errorText={GlobalFunction.CheckName(this.state.type)}
						searchText={this.state.type}
						onUpdateInput={this.updateInputForLabel}
						onNewRequest={this.newRequestForLabel}
						dataSource={GlobalVariable.relationshipTypeList}
						filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
						openOnFocus={false}
						maxSearchResults={6}
						style={{width:'85px',height:'32px'}} 
						textFieldStyle={{width:'85px',height:'32px'}} 
						inputStyle={{fontSize: '12px'}}
					/>
				</div>);
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
					flexWrap: 'wrap',}} 
				>
					<AutoComplete
						errorStyle={{fontSize: '10px', lineHeight:'0px'}}
						errorText={GlobalFunction.CheckName(this.state.properties[i].key)}
						hintText='Key'
						searchText={this.state.properties[i].key}
						onUpdateInput={(searchText) => this.updateInputForPropertyKey(searchText, i)}
						onNewRequest={(chosenRequest) => this.newRequestForPropertyKey(chosenRequest, i)}
						dataSource={GlobalVariable.propertyList}
						filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
						style={{height:'48px'}}
						maxSearchResults={6}
					/>
					<strong style={{margin: '4px'}} >{':'}</strong>
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
								width:'600px',
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
											backgroundColor={
												this.state.properties[i].type == 'listBoolean' ?
													'SeaGreen'
													:
													this.state.properties[i].type == 'listString' ?
														'Tomato'
														:
														'MediumVioletRed'
											}
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
											tooltip="Delete Item"
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
									tooltip="Add Item"
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
									<ContentAdd />
								</IconButton>
							</div>
							:
							<TextField 
								id={this.state.properties[i].key}
								style={{width:'332px'}} 
								errorStyle={{fontSize: '10px', lineHeight:'0px'}}
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
                        iconButtonElement={
							<IconButton>
								{this.state.properties[i].type == 'boolean' ?
									<ToggleCheckBox />
									:
									this.state.properties[i].type == 'string' ?
										<ContentFontDownload />
										:
										this.state.properties[i].type == 'number' ?
											<ImageLooksOne />
											:
											<SocialPoll />
								}
							</IconButton>}
                        onChange={function(event, value) {
								this.setState(function(prevState, props) {
									let __newValue;
									switch (value)
									{
										case 'object':
											//__newValue = [];
											break;
										case 'string':
										case 'number':
											__newValue = '';
											break;
										case 'boolean':
											__newValue = true;
											break;
									}
									prevState.properties[i].value = prevState.properties[i].hasOwnProperty('oldType') ?
											prevState.properties[i].oldType == value ? this.state.properties[i].oldValue : __newValue
											:
											__newValue;
									prevState.properties[i].type = value;
									return prevState;
								});
							}.bind(this)
						}
                    >
						<MenuItem value="string" primaryText="String" leftIcon={<ContentFontDownload />} />
						<MenuItem value="number" primaryText="Number" leftIcon={<ImageLooksOne />} />
						<MenuItem value="boolean" primaryText="Boolean" leftIcon={<ToggleCheckBox />} />
						<MenuItem 
							leftIcon={<SocialPoll />}
							rightIcon={<ArrowDropRight />}
							primaryText="List" 
							menuItems={[
								<MenuItem 
									leftIcon={<ContentFontDownload />}
									primaryText="String" 
									onClick={function(event, value) {
											this.setState(function(prevState, props) {
												prevState.properties[i].type = "listString";
												prevState.properties[i].value = prevState.properties[i].hasOwnProperty('oldType') ?
														prevState.properties[i].oldType == "listString" ? [...this.state.properties[i].oldValue] : []
														:
														[];
												return prevState;
											});
										}.bind(this)}
								/>,
								<MenuItem 
									leftIcon={<ImageLooksOne />}
									primaryText="Number" 
									onClick={function(event, value) {
											this.setState(function(prevState, props) {
												prevState.properties[i].type = "listNumber";
												prevState.properties[i].value = prevState.properties[i].hasOwnProperty('oldType') ?
														prevState.properties[i].oldType == "listNumber" ? [...this.state.properties[i].oldValue] : []
														:
														[];
												return prevState;
											});
										}.bind(this)}
								/>,
								<MenuItem 
									leftIcon={<ToggleCheckBox />}
									primaryText="Boolean" 
									onClick={function(event, value) {
											this.setState(function(prevState, props) {
												console.log(value);
												prevState.properties[i].type = "listBoolean";
												prevState.properties[i].value = prevState.properties[i].hasOwnProperty('oldType') ?
														prevState.properties[i].oldType == "listBoolean" ? [...this.state.properties[i].oldValue] : []
														:
														[];
												return prevState;
											});
										}.bind(this)}
								/>,
							  ]}
						/>
                    </IconMenu>
					<IconButton 
						tooltip="Delete Property"
						onClick={() => this.delProperty(i)}
					>
						<Clear />
					</IconButton>
                </div>
            );
		}
		
		return (
			<Dialog
				title={this.props.mode == -1 ? "New Node" : this.props.mode == GlobalConstant.mode.node ? "Edit Node" : "Edit Relationship"}
				actions={__actions}
				modal={true}
				open={this.props.open}
				onRequestClose={this.closeDialog}
				autoScrollBodyContent={true}
				paperProps={{style: {width: '870px'}}}
			>
				<h2>{this.props.mode != GlobalConstant.mode.edge ? 'Labels' : 'Type'}</h2>
				<div style={{flexWrap: 'wrap', display: 'flex', flexDirection: 'row', flex:'0 0 auto'}} >
					{__chips}
					{this.props.mode != GlobalConstant.mode.edge ?
						<IconButton 
							tooltip="Add Label"
							style={{
								padding:'0px',
								width: '25px',
								height: '25px',
								marginRight: '5px'
							}}
							onClick={this.addLabel}
						>
							<ContentAdd />
						</IconButton>
						:
						''}
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
								style={{
									//width: '280px'
									minWidth: '150px'
								}}
								actionIcon={
									<div>
										{index > 0 ?
											<IconButton 
												onClick={function(event) {
													this.setState(function(prevState, props) {
														let __tmp = prevState.images[0];
														prevState.images[0] = prevState.images[index];
														prevState.images[index] = __tmp;
														return prevState;
													});
												}.bind(this)}
											>
												<StarBorder color="rgb(0, 188, 212)" />
											</IconButton>
											:
											''
										}
										<IconButton 
											onClick={function(event) {
												this.setState(function(prevState, props) {
													prevState.images.splice(index, 1);
													return prevState;
												});
											}.bind(this)}
										>
											<Clear color="rgb(0, 188, 212)" />
										</IconButton>
									</div>}
								titleStyle={{color: 'rgb(0, 188, 212)',}}
								titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
							>
								<img src={tile} />
							</GridTile>
						))}
						<GridTile
							key='upload'
						>
							<Upload
								action='/upload_image'
								accept="image/*"
								multiple={true}
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
									let __b = true;
									this.setState(function(prevState, props) {
										let __json = JSON.parse(Base64.decode(file));
										let __filename = 'images/' + __json.filename;
										for (let i=0; i<prevState.images.length; i++){
											if (prevState.images[i] == __filename){
												__b = false;
												break;
											}
										}
			
										if (__b){
											prevState.images.push(__filename);
										}
									    prevState.progress = false;
     									return prevState;
									})

									if (!__b){
										this.isCheckError = true;
										this.props.onMessage('This image has been upload', 0);
									}
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
										tooltip="Add Image"
										iconStyle={{
											width:'150px',
											opacity:0.4
										}}
										style={{
											width:'170px',
											height:'170px'
										}}
										tooltipStyles={{
											top:'142px',
											left:'55px'
										}}
										//tooltip="Add Icon"
									>
										<img src={GlobalConstant.addImageIcon} />
									</IconButton>
								}
							</Upload>
						</GridTile>
					</GridList>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
					<h2>Properties</h2>
					{__propertiesElement}
					<div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent:'space-between'}}>
						<RaisedButton
							onClick={this.addProperty}
							label="Add Property"
							style={{margin: 12}}
							primary={true}
						/>
						<div style={{display: 'flex', alignItems: 'flex-end', flexDirection: 'row'}}>
							{this.props.mode != GlobalConstant.mode.edge ?
								<SelectField
									hintText="Select Label"
									value={this.state.labelForTemplate}
									style={{width: 150,}}
									onChange={(event, index, value)=>{
										this.setState(function(prevState, props) {
											prevState.labelForTemplate = value;
											return prevState;
										})
									}}
								>
									{this.state.labels.map((item, index)=>(
										<MenuItem value={item} primaryText={item} />
									))}
								</SelectField>
								:
								''}
							<RaisedButton
								onClick={this.setTemplate}
								label="Save Template"
								style={{margin: 12}}
								primary={true}
							/>
						</div>
					</div>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', flex:'0 0 auto', borderTop:'1px solid #e8e8e8'}} >
					<h2>Memo</h2>
					<div style={{flexWrap: 'wrap', display: 'flex', flexDirection: 'row', flex:'0 0 auto'}} >
						{__memos}
						<IconButton 
							tooltip="Add Memo"
							style={{
								padding:'0px',
								width: '25px',
								height: '25px',
								marginRight: '5px'
							}}
							onClick={this.addMemo}
							tooltipPosition={this.state.memo.value.length > 0 ? "bottom-center" : "top-center"}
						>
							<ContentAdd />
						</IconButton>
					</div>
					{this.state.memo.value.length > 0 ?
						<EditorConvertToHTML 
							index={this.state.memo.SelectIdx}
							data={this.state.memo.value[this.state.memo.SelectIdx+1]}
							onChange={(context, index)=>{
								this.setState(function(prevState, props) {
									prevState.memo.value[index+1] = context;
									return prevState;
								})
							}}
						/>
						:
						""
					}
				</div>
			</Dialog>
		);
	}
}