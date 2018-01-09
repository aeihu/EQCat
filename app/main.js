import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TooltipComponent from './Component/TooltipComponent';
import VisualizationComponent from './Component/VisualizationComponent'
import CypherBarComponent from './Component/CypherBarComponent'

class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            data: {
                nodes: [
                    //{id:"0", name : "0", age:12},
                ],
                edges : [
                    //{source:"0", target:"1"},
                ]
            }
        };
    }
    
    runCypher = function(statement) {
        var xmlhttp = new XMLHttpRequest()
        
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                this.setState(function(prevState, props) {
                    return {
                        data: xmlhttp.responseText
                    }
                });
            }
        }.bind(this)

        xmlhttp.open("GET","/example/d?cypher=" + statement, true);
        xmlhttp.send();
    }.bind(this)

    render() {
        return (
            <MuiThemeProvider>
                <div id="tooltip">
                    <TooltipComponent />
                </div>
                <div id='mainpanel'>
                    <CypherBarComponent runCypher={this.runCypher} />
                    <VisualizationComponent width='100%' height='99%' data={this.state.data} />
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);