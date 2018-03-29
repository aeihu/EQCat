import React from 'react';
import ReactDOM from 'react-dom';
import CardComponent from './CardComponent';
import {D3ForceSimulation} from './D3ForceSimulation';
import EditStyleComponent from './EditStyleComponent';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';

import Popover from 'material-ui/Popover/Popover';
import { SketchPicker } from 'react-color';

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

    showCard = function(d) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == d.id){
                return;
            }
        }

        this.updateFlag = false;
        this.setState(function(prevState, props) {
            prevState.cards.push(d);
            return prevState;
        });
    }.bind(this);

    hideCard = function(id) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == id){
                this.updateFlag = false;
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

    componentWillReceiveProps(newProps)
    {
        this.updateFlag = true;
        this.setState(function(prevState, props) {
            prevState.cards = [];
            return prevState;
        });
        // if(this.updateFlag){
        //     let el = ReactDOM.findDOMNode();
        //     D3ForceSimulation.update(el, this.props, this.state, this.NEStyles);
        // }
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
        for (let i = 0; i < this.state.cards.length; i++){
            __cardElements.push(
                <CardComponent 
                    data={this.state.cards[i]} 
                    closeCard={this.hideCard} 
                    onMergeNode={this.props.onMergeNode}
                />);
        }
        
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width:'100%'}} >
                <div id="displayContent" 
                    style={{backgroundColor: '#EEEEEE', width:'100%', flex:'1 1 auto'}} 
                    onContextMenu={this.handleClick}>
                    {/* {__menu} */}
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