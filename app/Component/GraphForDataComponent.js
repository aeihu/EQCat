import React from 'react';
import ReactDOM from 'react-dom';
import CardComponent from './CardComponent';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import {D3ForceSimulation} from './D3ForceSimulation';

export default class GraphForDataComponent extends React.Component {
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

        let __nodeChip = [];
        for (let key in this.props.data.count.nodes){
            __nodeChip.push(<Chip 
                className="NodeLabelChip" 
                labelStyle={{fontSize: '12px'}}
                style={{margin: 4, height:'20px', alignItems:'center'}}>
                    {key + '(' + this.props.data.count.nodes[key] + ')'}
                </Chip>);
        }

        let __edgeChip = [];
        for (let key in this.props.data.count.edges){
            __edgeChip.push(<Chip 
                className="NodeLabelChip" 
                labelStyle={{fontSize: '12px'}}
                style={{borderRadius: '2px',margin: 4, height:'20px', alignItems:'center'}}>
                    {key + '(' + this.props.data.count.edges[key] + ')'}
                </Chip>);
        }

        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width:'100%'}}>
                <div id="displayContent" style={{backgroundColor: '#EEEEEE', width:'100%', flex:'1 1 auto'}}>
                    {__cardElements}
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', flex:'0 0 auto'}} >
                    {/* <FlatButton label={this.props.data.statement} labelPosition="before" containerElement="label" /> */}
                    <FlatButton label='AA' labelPosition="before" containerElement="label" style={{alignSelf: 'flex-end'}} onClick={D3ForceSimulation.showOrHideImage} />
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