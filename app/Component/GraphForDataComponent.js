import React from 'react';
import ReactDOM from 'react-dom';
import CardComponent from './CardComponent';
import {D3ForceSimulation} from './D3ForceSimulation';
import EditStyleComponent from './EditStyleComponent';
import GlobalConstant from '../Common/GlobalConstant';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import ImagePhotoLibrary from 'material-ui/svg-icons/image/photo-library';
import ImageControlPoint from 'material-ui/svg-icons/image/control-point';
import ImageFilter from 'material-ui/svg-icons/image/filter';
import SocialShare from 'material-ui/svg-icons/social/share';
import ContentRemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import ImageEdit from 'material-ui/svg-icons/image/edit';
import EditorDialogsComponent from './EditorDialogsComponent';
import AutoComplete from 'material-ui/AutoComplete';

import Popover from 'material-ui/Popover/Popover';
import { SketchPicker } from 'react-color';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/internal/Tooltip';

export default class GraphForDataComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            cards:{
                nodes:[],
                edges:[],
            },
            showCard: this.showCard,
            menu: {
                open: false,
                x: 0,
                y: 0,
                anchorEl: null
            },
            tooltip:{
                connectMode: false,
                showedImage: false,
                relationshipType: ''
            }
        };
    }

    updateFlag = true;

    handleClick = function(event) {
        // This prevents ghost click.
        event.preventDefault();
            
        let __x = event.clientX;
        let __y = event.clientY;

        this.updateFlag = false;
        this.setState(function(prevState, props) {
            prevState.menu = {
                open: true,
                x: __x,
                y: __y,
                anchorEl: document.getElementById('menuInDisplayContent')
            };
            return prevState;
        });
    }.bind(this)

    showCard = function(d, mode) {
        let __mode = mode == 0 ? 'nodes' : 'edges';
        for (let index in this.state.cards[__mode]){
            if (this.state.cards[__mode][index].id == d.id){
                return;
            }
        }

        this.updateFlag = false;
        this.setState(function(prevState, props) {
            prevState.cards[__mode].push(d);
            return prevState;
        });
    }.bind(this);

    hideCard = function(id, mode) {
        let __mode = mode == 0 ? 'nodes' : 'edges';
        for (let index in this.state.cards[__mode]){
            if (this.state.cards[__mode][index].id == id){
                this.updateFlag = false;
                this.setState(function(prevState, props) {
                    prevState.cards[__mode].splice(index, 1);
                    return prevState;
                });
            }
        }
    }.bind(this)

    componentDidMount()
    {
        console.log('aa');
        let el = ReactDOM.findDOMNode();
        D3ForceSimulation.create(el, 
            this.props, 
            this.state);
    }

    componentWillReceiveProps(newProps)
    {
        this.updateFlag = true;
    }

    componentDidUpdate()
    {
        console.log('bb');

        if(this.updateFlag){
            let el = ReactDOM.findDOMNode();
            D3ForceSimulation.update(el, this.props, this.state);
        }
    }

    componentWillUnmount()
    {
        console.log('cc');
        // var el = ReactDOM.findDOMNode();
        // D3ForceSimulation.destroy(el);
    }

    render() {
        let __cardElements=[];
        for (let key in this.state.cards){
            for (let i = 0; i < this.state.cards[key].length; i++){
                __cardElements.push(
                    key == 'nodes' ?
                        <CardComponent 
                            mode={0} // node:0  edge:1
                            data={this.state.cards[key][i]} 
                            closeCard={this.hideCard} 
                            onMerge={this.props.onMergeNode}
                        />
                        :
                        <CardComponent 
                            mode={1} // node:0  edge:1
                            data={this.state.cards[key][i]} 
                            closeCard={this.hideCard} 
                            onMerge={this.props.onMergeEdge}
                        />
                );
            }
        }
        
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width:'100%'}} >
                <EditorDialogsComponent 
                    mode={0}
                    isNew={true}
                    open={this.state.open}
                    onChangeData={this.props.onAddNode}
                    onRequestClose={()=> {this.setState(function(prevState, props) {
                        prevState.open = false;
                        return prevState;
                    })}}
                />
                <div style={{display: 'flex', flexDirection: 'row', flex:'1 1 auto', width:'100%'}}>
                    <div id="displayContent" 
                        style={{backgroundColor: '#EEEEEE', width:'100%', flex:'1 1 auto'}} 
                        onContextMenu={this.handleClick}>
                        {__cardElements}
                        <div id='menuInDisplayContent' 
                            style={{
                                left:this.state.menu.x + 'px', 
                                top: this.state.menu.y + 'px', 
                                position: 'fixed'}} 
                        />
                        <Popover
                            open={this.state.menu.open}
                            anchorEl={this.state.menu.anchorEl}
                            anchorOrigin={{horizontal:"left",vertical:"bottom"}}
                            targetOrigin={{horizontal:"left",vertical:"top"}}
                            onRequestClose={function () {
                                this.updateFlag = false;
                                this.setState(function(prevState, props) {
                                    prevState.menu.open = false;
                                    return prevState;
                                });
                            }.bind(this)}
                            // animated={false}
                        >
                            <Menu desktop={true}>
                                <MenuItem primaryText="Preview" leftIcon={<RemoveRedEye />} />
                                <MenuItem primaryText="Share" leftIcon={<PersonAdd />} />
                                <MenuItem primaryText="Get links" leftIcon={<ContentLink />} />
                                <Divider />
                                <MenuItem primaryText="Make a copy" leftIcon={<ContentCopy />} />
                                <MenuItem primaryText="Download" leftIcon={<Download />} />
                                <Divider />
                                <MenuItem primaryText="Remove" leftIcon={<Delete />} />
                            </Menu>
                        </Popover>
                        {this.state.tooltip.connectMode ?
                            <div id='talkBubble' style={{right:'60px', top:'3px'}} >
                                <div
                                    style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingRight: '8px',
                                    borderRadius: '3px',
                                    backgroundColor: 'Gainsboro',
                                    margin: '3px',
                                    height: '34px'
                                }}>
                                    <AutoComplete
                                        hintText="Relationship Type"
                                        searchText={this.state.tooltip.relationshipType}
                                        onUpdateInput={(searchText)=>{
                                            this.setState(function(prevState, props) {
                                                prevState.tooltip.relationshipType = searchText;
                                                return prevState;
                                            });
                                        }}
                                        onNewRequest={(value)=>{
                                            this.setState(function(prevState, props) {
                                                prevState.tooltip.relationshipType = value;
                                                return prevState;
                                            });
                                        }}
                                        dataSource={GlobalConstant.relationshipTypeList}
                                        filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
                                        openOnFocus={false}
                                        maxSearchResults={6}
                                        style={{width:'190px'}} 
                                        textFieldStyle={{width:'190px'}} 
                                        //inputStyle={{fontSize: '12px'}}
                                    />
                                </div>
                            </div>
                            :
                            ''
                        }
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', flex:'0 0 auto', justifyContent:'space-between'}} >
                        <div style={{display: 'flex', flexDirection: 'column', flex:'0 0 auto'}} >
                            <IconButton 
                                style={this.state.tooltip.connectMode ? {backgroundColor:'YellowGreen', borderBottom: '1px solid #ddd'} : {borderBottom: '1px solid #ddd'}}
                                hoveredStyle={{backgroundColor:'SkyBlue'}}
                                onClick={() => {this.setState(function(prevState, props) {
                                    this.updateFlag = false;
                                    D3ForceSimulation.changeConnectMode();
                                    prevState.tooltip.connectMode = D3ForceSimulation.connectMode;
                                    return prevState;
                                })}}
                            >
                                <SocialShare />
                            </IconButton>
                            <IconButton 
                                style={this.state.tooltip.showedImage ? {backgroundColor:'YellowGreen', borderBottom: '1px solid #ddd'} : {borderBottom: '1px solid #ddd'}}
                                hoveredStyle={{backgroundColor:'SkyBlue'}}
                                onClick={() => {this.setState(function(prevState, props) {
                                    this.updateFlag = false;
                                    D3ForceSimulation.showOrHideImage();
                                    prevState.tooltip.showedImage = D3ForceSimulation.showedImage;
                                    return prevState;
                                })}}
                            >
                                <ImageFilter />
                            </IconButton>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', flex:'0 0 auto'}} >
                            <IconButton 
                                style={{borderTop: '1px solid #ddd',}}
                                hoveredStyle={{backgroundColor:'SkyBlue'}}
                                //onMouseOver={()=>{console.log('phi')}}
                                onClick={()=> {this.setState(function(prevState, props) {
                                    prevState.open = true;
                                    return prevState;
                                })}}
                            >
                                <ImageControlPoint />
                            </IconButton>
                            <IconButton 
                                style={{borderTop: '1px solid #ddd',}}
                                hoveredStyle={{backgroundColor:'SkyBlue'}}
                                onClick={D3ForceSimulation.showOrHideImage}>
                                <ImageEdit />
                            </IconButton>
                            <IconButton 
                                style={{borderTop: '1px solid #ddd',}}
                                hoveredStyle={{backgroundColor:'SkyBlue'}}
                                onClick={D3ForceSimulation.showOrHideImage}>
                                <ContentRemoveCircleOutline />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <EditStyleComponent 
                    data={this.props.data.count}
                    onIconChange={this.setIconInBar}
                    onCaptionChange={this.setCaptionInBar}
                    onSizeChange={this.setSizeInBar}
                    onChange={this.setColorInBar}
                />
            </div>
        )
    }
}