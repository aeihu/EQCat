import React from 'react';
import GlobalFunction from '../../Common/GlobalFunction';
import GlobalVariable from '../../Common/GlobalVariable';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import {D3ForceSimulation} from './D3ForceSimulation';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import FileFolder from 'material-ui/svg-icons/file/folder';
import AvPlayCircleFilled from 'material-ui/svg-icons/av/play-circle-filled';
import ActionCode from 'material-ui/svg-icons/action/code';
import ContentRemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ImageEdit from 'material-ui/svg-icons/image/edit';

export default class FavoritesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataForDrag:{
                dir:"", 
                index:-1
            },
            favorites:{}
        }
    }

    onDrag = function (event){
        console.log('document.body.drop')
        // e.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();

        if (event.target.id.indexOf(']^[') >= 0){
			try{
                let __tgr = event.target.id.split("]^[");
                let __data = JSON.parse(event.dataTransfer.getData("textDrag"));
                if (__tgr[1] == 'folder'){
                    if (__data.dir != __tgr[0]){
                        GlobalFunction.SendAjax(
                            (result)=>{
                                this.setState(function(prevState, props) {
                                    let __key = prevState.favorites[__data.dir][__data.index];
                                    let __val = prevState.favorites[__data.dir][__data.index+1];
                                    prevState.favorites[__data.dir].splice(__data.index, 2);
                                    prevState.favorites[__tgr[0]].push(__key);
                                    prevState.favorites[__tgr[0]].push(__val);
                                    prevState.dataForDrag.dir = '';
                                    prevState.dataForDrag.index = -1;
                                    return prevState;
                                })},
                            (error)=>{this.props.onMessage(error.message, 0)},
                            "/moveFavorites?data=",
                            {oldDir: __data.dir, oldIndex:__data.index, newDir:__tgr[0], newIndex:-1}
                        );
                    }else{
                        this.setState(function(prevState, props) {
                            prevState.dataForDrag.dir = '';
                            prevState.dataForDrag.index = -1;
                            return prevState;
                        });
                    }
                }else{
                    let __index = Number(__tgr[1]);
                    if (!isNaN(__index)){
                        if (__data.dir != __tgr[0] || __data.index != __index){
                            GlobalFunction.SendAjax(
                                (result)=>{
                                    this.setState(function(prevState, props) {
                                        let __key = prevState.favorites[__data.dir][__data.index];
                                        let __val = prevState.favorites[__data.dir][__data.index+1];
                                        prevState.favorites[__data.dir].splice(__data.index, 2);
                                        
                                        if (__data.dir != __tgr[0]){
                                            prevState.favorites[__tgr[0]].splice(__index+2, 0, __val);
                                            prevState.favorites[__tgr[0]].splice(__index+2, 0, __key);
                                        }else{
                                            prevState.favorites[__tgr[0]].splice(__index, 0, __val);
                                            prevState.favorites[__tgr[0]].splice(__index, 0, __key);
                                        }
            
                                        prevState.dataForDrag.dir = '';
                                        prevState.dataForDrag.index = -1;
                                        return prevState;
                                    })},
                                (error)=>{this.props.onMessage(error.message, 0)},
                                "/moveFavorites?data=",
                                {oldDir: __data.dir, oldIndex:__data.index, newDir:__tgr[0], newIndex:__index}
                            );
                        }else{
                            this.setState(function(prevState, props) {
                                prevState.dataForDrag.dir = '';
                                prevState.dataForDrag.index = -1;
                                return prevState;
                            });
                        }
                    }
                }
            }catch (err){
				console.log(err.name + ': ' + err.message);
			}
        }
    }.bind(this)

    componentWillReceiveProps(newProps)
    {
        if (newProps.flag.hasOwnProperty('statement')){
            this.setState(function(prevState, props) {
                console.log('add favorites')
                if (!prevState.favorites.hasOwnProperty('default')){
                    prevState.favorites['default'] = [];
                }

                prevState.favorites['default'].push(newProps.flag.statement);
                prevState.favorites['default'].push(newProps.flag.statement);
                return prevState;
            });
        }
    }

    componentWillUnmount(){
        document.body.removeEventListener('drop', this.onDrag, true);
    }

    componentDidMount()
    {
        GlobalFunction.SendAjax(
            (result)=>{
                this.setState(function(prevState, props) {
                    prevState.favorites = {...result.favorites};
                    return prevState;
                })},
            (error)=>{this.props.onMessage(error.message, 0)},
            "/getFavorites"
        );

        document.body.addEventListener('drop', this.onDrag, true);
    }
    
    render() {
        let __default = [];
        let __scripts = [];

        for (let key in this.state.favorites){
            let __scr = [];
            for (let i=0; i<this.state.favorites[key].length; i+=2){
                __scr.push(
                    <ListItem
                        key={'scr_'+ key + i}
                        draggable="true"
                        leftIcon={<AvPlayCircleFilled />}
                        onClick={()=>this.props.onSetCypher(this.state.favorites[key][i+1])}
                        style={{
                            backgroundColor: this.state.dataForDrag.dir != key || this.state.dataForDrag.index != i ? '#00000000' : 'SkyBlue'
                        }}
                        innerDivStyle={{
                            fontSize: '14px',
                            lineHeight: '18px',
                        }}
                        primaryText={<div 
                            style={{
                                fontSize: '12px',
                                lineHeight: '16px',
                                color:'rgba(0, 0, 0, 0.54)'
                            }}>
                            {this.state.favorites[key][i+1]}</div>}
                        rightIconButton={
                            <div>
                                <IconButton 
                                    style={{
                                        top:'10px',
                                        padding:'0px',
                                        width: '24px',
                                        height: '24px'
                                    }}
                                    onClick={()=>{console.log('sssssssss')}}
                                >
                                    <ImageEdit style={{
                                        height: '24px',
                                        width: '24px',}}
                                    />
                                </IconButton>
                                <IconButton 
                                    style={{
                                        top:'10px',
                                        padding:'0px',
                                        width: '24px',
                                        height: '24px'
                                    }}
                                    onClick={()=>{
                                        GlobalFunction.SendAjax(
                                            (result)=>{
                                                this.setState(function(prevState, props) {
                                                    prevState.favorites[key].splice(i, 2);
                                                    return prevState;
                                                })
                                            },
                                            (error)=>{this.props.onMessage(error.message, 0)},
                                            "/removeFavorites?data=",
                                            {key:key, index:i}
                                        );
                                    }}
                                >
                                    <ActionDelete style={{
                                            height: '24px',
                                            width: '24px',}} 
                                    />
                                </IconButton>
                            </div>
                        }
                    >
                        <div draggable={true}
                            id={key+']^['+i}
                            onDragStart={function (event){
                                event.dataTransfer.setData("textDrag", JSON.stringify({dir:key, index:i}));
                            }}
                            onDragExit={function (event){
                                event.preventDefault();
                                this.setState(function(prevState, props) {
                                    prevState.dataForDrag.dir = '';
                                    prevState.dataForDrag.index = -1;
                                    return prevState;
                                })
                            }.bind(this)}
                            onDragOver={function (event){
                                event.preventDefault();
                                if (this.state.dataForDrag.dir != key || this.state.dataForDrag.index != i){
                                    this.setState(function(prevState, props) {
                                        prevState.dataForDrag.dir = key;
                                        prevState.dataForDrag.index = i;
                                        return prevState;
                                    })
                                }
                            }.bind(this)}
                        >
                            {this.state.favorites[key][i]}
                        </div>
                    </ListItem>
                );
            }

            if (key == 'default'){
                __default = __scr;
            }else{
                __scripts.push(
                    <ListItem
                        key={'dir_'+key}
                        style={{
                            backgroundColor: this.state.dataForDrag.dir != key ? '#00000000' : 'SkyBlue'
                        }}
                        leftIcon={<FileFolder />}
                        primaryText={
                            <div
                                id={key+']^[folder'}
                                onDragExit={function (event){
                                    event.preventDefault();
                                    this.setState(function(prevState, props) {
                                        prevState.dataForDrag.dir = '';
                                        prevState.dataForDrag.index = -1;
                                        return prevState;
                                    })
                                }.bind(this)}
                                onDragOver={function (event){
                                    event.preventDefault();
                                    if (this.state.dataForDrag.dir != key){
                                        this.setState(function(prevState, props) {
                                            prevState.dataForDrag.dir = key;
                                            return prevState;
                                        })
                                    }
                                }.bind(this)}
                            >
                                {key}
                            </div>}
                        primaryTogglesNestedList={true}
                        nestedItems={__scr}
                    />
                );
            }
        }

        return (
            <div style={{
                height:'100%',
                display: 'flex', 
                flexDirection: 'column',
                overflowY: 'auto',
                marginLeft: '5px'}}
            >
                <h3>Favorites</h3>
                <h4 style={{borderBottom: '1px solid #ddd',}}>Saved Scripts</h4>
                <List>
                    {__default}
                    {__scripts}
                </List>
            </div>
        );
    }
}