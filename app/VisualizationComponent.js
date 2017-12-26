import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import CardComponent from './CardComponent';
import {D3ForceSimulation} from './D3ForceSimulation';
//var D3ForceSimulation = require('./D3ForceSimulation');

export default class VisualizationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                nodes: [
                    {id:"0", name : "0", age:12},
                    {id:"1", name : "1", age:12},
                    {id:"2", name : "2", age:12},
                    {id:"3", name : "3", age:12},
                    {id:"4", name : "4", age:12},
                    {id:"5", name : "5", age:12},
                    {id:"6", name : "6", age:12},
                    {id:"7", name : "7", age:12}
                ],
                edges : [
                    {source:"0", target:"1"},
                    {source:"0", target:"2"},
                    {source:"0", target:"3"},
                    {source:"1", target:"4"},
                    {source:"2", target:"5"},
                    {source:"3", target:"6"}
                ]
            },
            cards:[]
        };

    }

    dispatcher = null;

    asdasd()
    {
        return 'hello';
    }
    showTooltip(d) {
        alert(this.asdasd());
    }

    componentDidMount()
    {
        var el = ReactDOM.findDOMNode();
        var dispatcher = D3ForceSimulation.create(el, 
            { width: '100%', height: '99%'}, 
            this.state);

        dispatcher.on('node:click', this.showTooltip);
        this.dispatcher = dispatcher;
    }

    componentDidUpdate()
    {
        alert("2");
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
        // var elements=[];

        // this.infoList.map(function(v,k) { 
        //     elements.push(<h1>hello</h1>);
        // });
        //var Elements = document.getElementById("visualization");
        //alert(Elements);
        return (
            <div id="visualization">
            </div>
        )
    }
}