import React from 'react';
import ReactDOM from 'react-dom';
import CardComponent from './CardComponent';
import {D3ForceSimulation} from './D3ForceSimulation';
import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import FlatButton from 'material-ui/FlatButton';
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
  
export default class VisualizationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards:[],
            showCard: this.showCard
        };

    }

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
        
        let __headerNameElements=[];
        
        for (let i = 0; i < this.props.data.colName.length; i++){
            if (__headerNameElements.length < 1)
                __headerNameElements.push(<TableRowColumn style={{width: '15px'}}>ID</TableRowColumn>);
            
            __headerNameElements.push(<TableRowColumn>{this.props.data.colName[i]}</TableRowColumn>);
        }

        let __nodeChip = [];
        for (let key in this.props.data.count.nodes){
            __nodeChip.push(<Chip style={{margin: 4}}>{key + '(' + this.props.data.count.nodes[key] + ')'}</Chip>);
        }

        let __edgeChip = [];
        for (let key in this.props.data.count.edges){
            __edgeChip.push(<Chip style={{margin: 4}}>{key + '(' + this.props.data.count.edges[key] + ')'}</Chip>);
        }

        return (
            <Tabs 
                style={{width:'98%', 
                    boxShadow: "0px 1px 5px #333333", 
                    margin:"10px", 
                    flex:'1 1 auto',
                    display: 'flex',
                    flexDirection: 'column'}}
                contentContainerStyle={{flex:'1 1 auto'}}
                tabTemplateStyle={{display: 'flex', flexDirection: 'column', height: '100%', width:'100%'}}
            >
                <Tab
                    // icon={<FontIcon className="material-icons">phone</FontIcon>}
                    label="Graph"
                >
                    <div id="displayContent" style={{backgroundColor: '#EEEEEE', width:'100%', flex:'1 1 auto'}}>
                        {__cardElements}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto'}} >
                        <FlatButton label={this.props.data.statement} labelPosition="before" containerElement="label" />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto'}} >
                        {__nodeChip}
                        {__edgeChip}
                    </div>
                    <div id="footer" style={{backgroundColor: '#FFA500', clear: 'both', textAlign:'center', flex:'0 0 auto'}}>
                    adad
                    </div>
                </Tab>
                <Tab
                    // icon={<FontIcon className="material-icons">favorite</FontIcon>}
                    label="Table"
                >
                    <Table
                        style={{height:'85%'}}
                        fixedHeader={true}
                        fixedFooter={false}
                    >
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                            // enableSelectAll={this.state.enableSelectAll}
                        >
                            <TableRow>
                                {__headerNameElements}
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                            // deselectOnClickaway={this.state.deselectOnClickaway}
                            // showRowHover={this.state.showRowHover}
                            stripedRows={true}
                        >
                            {this.props.data.table.map( (row, index) => (
                                <TableRow key={index} hoverable={true}>
                                    <TableRowColumn style={{width: '15px'}}>{index+1}</TableRowColumn>
                                    {
                                        this.props.data.table[index].map( (row, index) => (
                                            <TableRowColumn><pre style={{whiteSpace: 'pre-wrap'}}>
                                                {row}
                                            </pre></TableRowColumn>
                                        ))
                                    }
                                </TableRow> 
                            ))}
                        </TableBody>
                        {/* <TableFooter
                            adjustForCheckbox={this.state.showCheckboxes}
                        >
                            <TableRow>
                            <TableRowColumn>ID</TableRowColumn>
                            <TableRowColumn>Name</TableRowColumn>
                            <TableRowColumn>Status</TableRowColumn>
                            </TableRow>
                            <TableRow>
                            <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                                Super Footer
                            </TableRowColumn>
                            </TableRow>
                        </TableFooter> */}
                    </Table>
                </Tab>
            </Tabs>
        )
    }
}