import React from 'react';
import ReactDOM from 'react-dom';
import CardComponent from './CardComponent';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import {D3ForceSimulation} from './D3ForceSimulation';
import EditorDialogsComponent from './EditorDialogsComponent';

import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import FontIcon from 'material-ui/FontIcon';

import Popover from 'material-ui/Popover/Popover';
import { SketchPicker    } from 'react-color';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

const style = {
    paper: {
      display: 'inline-block',
      float: 'left',
      margin: '16px 32px 16px 0',
    },
    rightIcon: {
      textAlign: 'center',
      lineHeight: '24px',
    },
};

const defaultIcon = 'icons/ic_add_to_queue_24px.svg';

export default class GraphForDataComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards:[],
            showCard: this.showCard,
            menu: {
                open: false,
                x: 0,
                y: 0,
                anchorEl: null
            },//nodeAndEdge
            barOfNE:{
                mode: 1, // 0:empty 1:node 2:edge
                name: '',
                node: {
                    size: 50,
                    caption: 'name',
                    image: defaultIcon
                },
                edge:{
                    colorPicker: {
                        open: false,
                        color: '#000000',
                        anchorEl: null
                    }
                }
            }
        };

        //this.getStyles();
    }

    NEStyles = {
        nodes: {
            //xx:{
            //  image:'a.png',
            //  size:'50',
            //  caption:'name',
            //}
        },
        edges: {
            //xx:{
            //  color:'#000000',
            //}
        },
    }

    updateFlag = {
        mode: 1, // 0: no update  1: data update  2: style update
        detail: ''
    }

    checkStyleOfNode = function (label){
        if (!this.NEStyles.nodes.hasOwnProperty(label)){
            this.NEStyles.nodes[label] = {
                image: defaultIcon,
                size: 50,
                caption: 'name',
            }
        }
    }

    checkStyleOfEdge = function (label){
        if (!this.NEStyles.edges.hasOwnProperty(label)){
            this.NEStyles.edges[label] = {
                color: '#000000'
            }
        }
    }

    setColorInBar = function (label, {hex}){
        this.checkStyleOfEdge(label);

        this.NEStyles.edges[label].color = hex;
        this.updateFlag = {
            mode: 2, // 0: no update  1: data update  2: style update
            detail: 'color'
        };

        this.setState(function(prevState, props) {
            prevState.barOfNE.edge.colorPicker.color = hex;
            return prevState;
        })
    }

    setCaptionInBar = function (label, propertyName){
        this.checkStyleOfNode(label);

        this.NEStyles.nodes[label].caption = propertyName;
        this.updateFlag = {
            mode: 2, // 0: no update  1: data update  2: style update
            detail: 'caption'
        };
        this.setState(function(prevState, props) {
            prevState.barOfNE.node.caption = propertyName;
            return prevState;
        });
    }

    setSizeInBar = function (label, size){
        if (isNaN(Number(size))){
            this.updateFlag = {
                mode: 0, // 0: no update  1: data update  2: style update
                detail: 'size'
            };
        }else{
            size = Number(size);
            this.checkStyleOfNode(label);
            this.NEStyles.nodes[label].size = size;

            this.updateFlag = {
                mode: 2, // 0: no update  1: data update  2: style update
                detail: 'size'
            };
        }

        this.setState(function(prevState, props) {
            prevState.barOfNE.node.size = size;
            return prevState;
        });
    }.bind(this)


    getStyles = function() {
        let xmlhttp = new XMLHttpRequest()
        
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
				let __json = JSON.parse(xmlhttp.responseText);
				
                this.NEStyles = __json.styles;
            }
        }.bind(this)

        xmlhttp.open("GET", "/style", true);
        xmlhttp.send();
	}.bind(this)

    handleClick = function(event) {
        // This prevents ghost click.
        event.preventDefault();
            
        let __x = event.clientX;
        let __y = event.clientY;

        this.setState(function(prevState, props) {
            this.updateFlag = {
                mode: 0, // 0: no update  1: data update  2: style update
                detail: ''
            };
            prevState.menu = {
                open: true,
                x: __x,
                y: __y,
                anchorEl: document.getElementById('menuInDisplayContent')
            };
            return prevState;
        });
    }.bind(this)

    showCard = function(d) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == d.id){
                return;
            }
        }

        this.updateFlag = {
            mode: 0, // 0: no update  1: data update  2: style update
            detail: ''
        };
        this.setState(function(prevState, props) {
            console.log(d);
            prevState.cards.push(d);
            return prevState;
        });
    }.bind(this);

    hideCard = function(id) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == id){
                this.updateFlag = {
                    mode: 0, // 0: no update  1: data update  2: style update
                    detail: ''
                };
                this.setState(function(prevState, props) {
                    prevState.cards.splice(index, 1);
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

    componentDidUpdate()
    {
        console.log('bb');
        let el = ReactDOM.findDOMNode();

        switch(this.updateFlag.mode){
            case 1:
                D3ForceSimulation.update(el, this.props, this.state, this.NEStyles);
                break;
            case 2:
                D3ForceSimulation.setStyle(el, this.props, this.state, this.NEStyles, this.updateFlag.detail);
                break;
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
        for (let i = 0; i < this.state.cards.length; i++){
            __cardElements.push(<CardComponent nodeData={this.state.cards[i]} closeCard={this.hideCard} />);
        }

        let __nodeChip = [];
        for (let key in this.props.data.count.nodes){
            if (!this.NEStyles.nodes.hasOwnProperty(key) && key!='*'){
                this.NEStyles.nodes[key] = {
                    image: defaultIcon,
                    size: 50,
                    caption: this.props.data.count.nodes[key].propertiesList.length > 1 ? 
                        this.props.data.count.nodes[key].propertiesList[1] :
                        this.props.data.count.nodes[key].propertiesList[0]
                };
            }

            //////////////////////////////////////////////
            __nodeChip.push(<Chip 
                className="labelChip" 
                labelStyle={{fontSize: '12px'}}
                onClick={key != '*' ? 
                    function(){
                        if (this.state.barOfNE.mode != 1
                            || this.state.barOfNE.name != key){

                            let __val = this.NEStyles.nodes.hasOwnProperty(key) ? 
                                    {
                                        image: this.NEStyles.nodes[key].image,
                                        size: this.NEStyles.nodes[key].size,
                                        caption: this.NEStyles.nodes[key].caption
                                    }
                                :
                                    {
                                        image: defaultIcon,
                                        size:50,
                                        caption: '<id>'
                                    };

                            this.updateFlag = {
                                mode: 0, // 0: no update  1: data update  2: style update
                                detail: ''
                            };
                            this.setState(function(prevState, props) {
                                prevState.barOfNE.mode = 1; // 0:empty 1:node 2:edge
                                prevState.barOfNE.name = key;
                                prevState.barOfNE.node = __val;
                                
                                return prevState;
                            });
                        }
                    }.bind(this) 
                    :
                    null}
                >
                    {key != '*' ?
                        <Avatar src={defaultIcon} style={{width:'25px', height:'25px', marginLeft:'6px', borderRadius:'0%', backgroundColor:'#00000000'}} />
                        : ''
                    }
                    {key + '(' + this.props.data.count.nodes[key].total + ')'}
                </Chip>);
        }

        let __edgeChip = [];
        for (let key in this.props.data.count.edges){
            if (!this.NEStyles.edges.hasOwnProperty(key) && key!='*'){
                this.NEStyles.edges[key] = {
                    color: '#000000',
                    size: 5
                };
            }

            //////////////////////////////////////////////

            __edgeChip.push(<Chip 
                className="edgeChip" 
                labelStyle={{fontSize: '12px'}}
                onClick={key != '*' ? 
                    function(){
                        if (this.state.barOfNE.mode != 2
                            || this.state.barOfNE.name != key){

                            let __val = this.NEStyles.edges.hasOwnProperty(key) ? 
                                    {
                                        size: this.NEStyles.edges[key].size,
                                        colorPicker: {
                                            open: false,
                                            color: this.NEStyles.edges[key].color,
                                            anchorEl: null
                                        }
                                    }
                                :
                                    {
                                        size: 5,
                                        colorPicker: {
                                            open: false,
                                            color: '#000000',
                                            anchorEl: null
                                        }
                                    };

                            this.updateFlag = {
                                mode: 0, // 0: no update  1: data update  2: style update
                                detail: ''
                            };
                            this.setState(function(prevState, props) {
                                prevState.barOfNE.mode = 2; // 0:empty 1:node 2:edge
                                prevState.barOfNE.name = key;
                                prevState.barOfNE.edge = __val;
                                
                                return prevState;
                            });
                        }
                    }.bind(this) 
                    :
                    null}
                >
                    {key + '(' + this.props.data.count.edges[key] + ')'}
                </Chip>);
        }

        let __captionChip = [];
        if (this.state.barOfNE.mode == 1 && this.props.data.count.nodes.hasOwnProperty(this.state.barOfNE.name)){
            let __captionInBar = this.state.barOfNE.node.caption;

            for (let i = 0; i < this.props.data.count.nodes[this.state.barOfNE.name].propertiesList.length; i++){
                let __propertyName = this.props.data.count.nodes[this.state.barOfNE.name].propertiesList[i];

                __captionChip.push(<Chip 
                    className="edgeChip" 
                    style={{border:'1px solid #a1a1a1'}}
                    backgroundColor={__captionInBar == __propertyName ? 
                            '#a1a1a1' 
                            : 
                            '#a1a1a100'}
                    labelStyle={{fontSize: '12px'}}
                    onClick={__captionInBar == __propertyName ?
                            null
                            :
                            () => this.setCaptionInBar(this.state.barOfNE.name, __propertyName)
                        }
                    >
                        {this.props.data.count.nodes[this.state.barOfNE.name].propertiesList[i]}
                    </Chip>
                );
            }
        }
        
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width:'100%'}} >
                <EditorDialogsComponent />
                <div id="displayContent" 
                    style={{backgroundColor: '#EEEEEE', width:'100%', flex:'1 1 auto'}} 
                    onClick={() => {
                        if (this.state.barOfNE.mode !=0){
                            this.setState(function(prevState, props) {
                                prevState.barOfNE.mode = 0;
                                return prevState;
                            });
                        }
                    }}
                    onContextMenu={this.handleClick}>
                    {/* {__menu} */}
                    <div id='menuInDisplayContent' 
                        style={{
                            left:this.state.menu.x + 'px', 
                            top: this.state.menu.y + 'px', 
                            position: 'fixed'}} />
                    
                    <Popover
                        open={this.state.menu.open}
                        anchorEl={this.state.menu.anchorEl}
                        anchorOrigin={{horizontal:"left",vertical:"bottom"}}
                        targetOrigin={{horizontal:"left",vertical:"top"}}
                        onRequestClose={function () {
                            this.updateFlag = {
                                mode: 0, // 0: no update  1: data update  2: style update
                                detail: ''
                            };
                            this.setState(function(prevState, props) {
                                prevState.menu.open = false;
                                return prevState;
                            });
                        }}
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
                    {__cardElements}
                </div>
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
                {this.state.barOfNE.mode == 1 ? ///////////////////  editMode  /////////////////////////
                    <div style={{
                            display: 'flex', 
                            flexDirection: 'row', 
                            flex:'0 0 auto',
                            alignItems:'center',
                            borderTop:'1px solid #e8e8e8'}}>
                        <Chip 
                            className="labelChip" 
                            labelStyle={{fontSize: '12px'}}
                            >
                                {this.state.barOfNE.name}
                        </Chip>
                        
                        <span>Icon:</span>
                        <IconButton
                            // iconStyle={styles.largeIcon}
                            // style={styles.large}
                            >
                            <img src={defaultIcon} />
                        </IconButton>

                        <span>Size:</span>
                        <TextField 
                            id={'value1'}
                            style={{width:'85px'}}
                            onChange={(event, newValue) => this.setSizeInBar(this.state.barOfNE.name, newValue)}
                            errorText={isNaN(Number(this.state.barOfNE.node.size)) ? "It's not number" : ''}
                            value={this.state.barOfNE.node.size}
                        />

                        <span>Caption:</span>
                        {__captionChip}
                    </div>
                : this.state.barOfNE.mode == 2 ?
                    <div style={{
                            display: 'flex', 
                            flexDirection: 'row', 
                            flex:'0 0 auto',
                            alignItems:'center',
                            borderTop:'1px solid #e8e8e8'}}>
                        <Chip 
                            className="edgeChip" 
                            labelStyle={{fontSize: '12px'}}
                            >
                                {this.state.barOfNE.name}
                        </Chip>
                        
                        <span>Color:</span>
						<RaisedButton
							onClick={function(event) {
                                event.preventDefault();
                                const __target = event.currentTarget;
                                this.setState(function(prevState, props) {
                                    prevState.barOfNE.edge.colorPicker.open = true;
                                    prevState.barOfNE.edge.colorPicker.anchorEl = __target;
                                    return prevState;
                                });
                            }.bind(this)}
                            //label="Add Property"
                            backgroundColor={this.state.barOfNE.edge.colorPicker.color}
							style={{width:'15px', height: '20px', margin: '12px'}}
							//primary={true}
						/>

                        <Popover
                            open={this.state.barOfNE.edge.colorPicker.open}
                            anchorEl={this.state.barOfNE.edge.colorPicker.anchorEl}
                            anchorOrigin={{horizontal:"left", vertical:"top"}}
                            targetOrigin={{horizontal:"left", vertical:"bottom"}}
                            onRequestClose={function() {
                                this.setState(function(prevState, props) {
                                    prevState.barOfNE.edge.colorPicker.open = false;
                                    return prevState;
                                });
                            }.bind(this)}
                            // animated={false}
                        >
                            <SketchPicker
                                color={this.state.barOfNE.edge.colorPicker.color}
                                onChange={({hex}) => this.setColorInBar(this.state.barOfNE.name, {hex})}
                            />
                        </Popover>
                    </div>
                :
                    <div></div>}
            </div>
        )
    }
}