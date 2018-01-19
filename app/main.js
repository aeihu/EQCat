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
                records:[],
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
                console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
                let __json = JSON.parse(xmlhttp.responseText);
                let __nodes = [];
                let __edges = [];
                __json.forEach(function (v, k) {
                    for (let key in v) {
                        if (v[key].hasOwnProperty("id") 
                            && v[key].hasOwnProperty("labels") 
                            && v[key].hasOwnProperty("properties")){
                            
                            let __b = true;
                            for (let i = 0; i < __nodes.length; i++){
                                if (__nodes[i].id == v[key].id){
                                    __b = false;
                                    break;
                                }
                            }

                            if (__b)
                                __nodes.push(v[key]);
                        }else if (v[key].hasOwnProperty("name") 
                            && v[key].hasOwnProperty("type") 
                            && v[key].hasOwnProperty("properties")
                            && v[key].hasOwnProperty("source")
                            && v[key].hasOwnProperty("target")){

                            // let __b = true;
                            // for (let i = 0; i < __edges.length; i++){
                            //     if (__edges[i].name == v[key].name){
                            //         __b = false;
                            //         break;
                            //     }
                            // }

                            // if (__b)
                                __edges.push(v[key]);
                        }
                    }
                }.bind(this));

                this.setState(function(prevState, props) {
                    return {
                        data: {
                            records: __json,
                            nodes: __nodes,
                            edges : __edges
                        }
                    }
                });
            }
        }.bind(this)

        xmlhttp.open("GET","/example?cypher=" + statement, true);
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