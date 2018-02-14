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
            }
        };
    }

    handleRequestClose = () => {
        this.setState({
            menu: {open: false},
        });
      };

    handleClick = function(event) {
        // This prevents ghost click.
        event.preventDefault();
        let __x = event.clientX;
        let __y = event.clientY;
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        const __currentTarget = event.currentTarget;
        this.setState(function(prevState, props) {
            prevState.menu = {
                open: true,
                x: __x,
                y: __y,
            };
            prevState.anchorEl = event.currentTarget;
            return prevState;
        });
    }.bind(this);

    showCard = function(d) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == d.id){
                return;
            }
        }

        this.setState(function(prevState, props) {
            console.log(d);
            prevState.cards.push(d);
            return prevState;
        });
    }.bind(this);

    
    hideCard = function(id) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == id){
                this.setState(function(prevState, props) {
                    prevState.cards.splice(index, 1);
                    return prevState;
                });
            }
        }
    }.bind(this);

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
        D3ForceSimulation.update(el, this.props, this.state);
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
            __nodeChip.push(<Chip 
                className="labelChip" 
                labelStyle={{fontSize: '12px'}}
                >
                    {key + '(' + this.props.data.count.nodes[key] + ')'}
                </Chip>);
        }

        let __edgeChip = [];
        for (let key in this.props.data.count.edges){
            __edgeChip.push(<Chip 
                className="labelChip" 
                labelStyle={{fontSize: '12px'}}
                >
                    {key + '(' + this.props.data.count.edges[key] + ')'}
                </Chip>);
        }

        console.log(this.state.menu.x + 'px : ' + this.state.menu.y + 'px')
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width:'100%'}} >
                <EditorDialogsComponent />
                <div id="displayContent" style={{backgroundColor: '#EEEEEE', width:'100%', flex:'1 1 auto'}} onContextMenu={this.handleClick}>
                    {__cardElements}
                    <Paper style={{
                        left:this.state.menu.x + 'px', 
                        top: this.state.menu.y + 'px', 
                        width:'192px'}}
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
                    </Paper>
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
                <div id="footer" style={{backgroundColor: '#FFA500', clear: 'both', textAlign:'center', flex:'0 0 auto'}}>
                adad
                </div>
            </div>
        )
    }
}