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
                //alert(this.state.cards[index].id)
                return;
            }
        }

        this.setState(function(prevState, props) {
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
        var el = ReactDOM.findDOMNode();
        D3ForceSimulation.create(el, 
            this.props, 
            this.state);
    }

    componentDidUpdate()
    {
        // var el = ReactDOM.findDOMNode();
        // D3ForceSimulation.update(el, this.state, this.dispatcher);
    }

    componentWillUnmount()
    {
        alert("3");
        // var el = ReactDOM.findDOMNode();
        // D3ForceSimulation.destroy(el);
    }

    render() {
        var elements=[];

        this.state.cards.map(function(v,k) { 
            elements.push(<CardComponent nodeData={v} closeCard={this.hideCard} />);
        }.bind(this));

        return (
            <div id="visualization">
                {elements}
            </div>
        )
    }
}

// VisualizationComponent.propTypes = {
//     showed: PropTypes.func
// };