import React from 'react';
import ReactDOM from 'react-dom';
import CardComponent from './CardComponent';
import {D3ForceSimulation} from './D3ForceSimulation';
import PropTypes from 'prop-types';

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
            // return {
            //     data: prevState.data,
            //     cards: prevState.cards
            // }
        });
    }.bind(this);

    
    hideCard = function(id) {
        for (let index in this.state.cards){
            if (this.state.cards[index].id == id){
                this.setState(function(prevState, props) {
                    prevState.cards.splice(index, 1);
                    return prevState;
                    // return {
                    //     data: prevState.data,
                    //     cards: prevState.cards
                    // }
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
        // var el = ReactDOM.findDOMNode();
        // D3ForceSimulation.update(el, this.state, this.dispatcher);
    }

    componentWillUnmount()
    {
        console.log('cc');
        // var el = ReactDOM.findDOMNode();
        // D3ForceSimulation.destroy(el);
    }

    render() {
        var elements=[];

        for (let i = 0; i < this.state.cards.length; i++){
            elements.push(<CardComponent nodeData={this.state.cards[i]} closeCard={this.hideCard} />);
        }

        return (
            <div id="visualization">
                {elements}
            </div>
        )
    }
}