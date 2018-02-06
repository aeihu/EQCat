import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TooltipComponent from './Component/TooltipComponent';
import VisualizationComponent from './Component/VisualizationComponent'
import CypherBarComponent from './Component/CypherBarComponent'
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            open: false,
            data: {
                statement:'',
                records:[],
                graph: {
                    nodes: [
                        //{id:"0", name : "0", age:12},
                    ],
                    edges: [
                        //{source:"0", target:"1"},
                    ],
                    count: {
                        nodes: {
                            '*': 0
                        },
                        edges: {
                            '*': 0
                        }
                    }
                },
                table:{
                    rows: [],
                    columns: [],
                }
            }
        };
    }

    handleClick = () => {
		this.setState(function(prevState, props) {
			prevState.snackOpen = true;
			return prevState;
		})
    };
    
    runCypher = function(statement) {
        let xmlhttp = new XMLHttpRequest()
        
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
                let __json = JSON.parse(xmlhttp.responseText);
                let __nodes = [];
                let __edges = [];
                let __rows = [];
                let __columns = [];
                let __count = {
                    nodes: {
                        '*': 0
                    },
                    edges: {
                        '*': 0
                    }
                };
                let __isFirst = true;
                __json.forEach(function (v, k) {
                    if (__isFirst){
                        for (let key in v)
                            __columns.push(key);
                        
                        __isFirst = false;
                    }

                    let __row = []
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

                            if (__b){
                                __nodes.push(v[key]);

                                for (let i = 0; i < v[key].labels.length; i++){
                                    if (__count.nodes.hasOwnProperty(v[key].labels[i]))
                                        __count.nodes[v[key].labels[i]]++;
                                    else
                                        __count.nodes[v[key].labels[i]] = 1;
                                    
                                    __count.nodes['*']++;
                                }
                            }
                            
                            __row.push(JSON.stringify(v[key].properties, null, 2));
                        }else if (v[key].hasOwnProperty("id") 
                            && v[key].hasOwnProperty("type") 
                            && v[key].hasOwnProperty("properties")
                            && v[key].hasOwnProperty("source")
                            && v[key].hasOwnProperty("target")){

                            let __b = true;
                            for (let i = 0; i < __edges.length; i++){
                                if (__edges[i].id == v[key].id){
                                    __b = false;
                                    break;
                                }
                            }

                            if (__b){
                                __edges.push(v[key]);
                            
                                if (__count.edges.hasOwnProperty(v[key].type))
                                    __count.edges[v[key].type]++;
                                else
                                    __count.edges[v[key].type] = 1;

                                __count.edges['*']++;
                            }

                            __row.push(JSON.stringify(v[key].properties, null, 2));
                        }else{
                            __row.push(v[key]);
                        }
                    }
                    console.log(__row);
                    __rows.push(__row);
                }.bind(this));

                this.setState(function(prevState, props) {
                    return {
                        open: false,
                        data: {
                            statement: statement,
                            records: __json,
                            graph: {
                                nodes: __nodes,
                                edges: __edges,
                                count: __count
                            },
                            table: {
                                rows: __rows,
                                columns: __columns
                            }
                        }
                    }
                });
            }
        }.bind(this)

        xmlhttp.open("GET","/example?cypher=" + statement, true);
        xmlhttp.send();

        this.setState(function(prevState, props) {
            return {
                open: true,
                data: prevState.data
            }
        });
    }.bind(this)

    render() {
        return (
            <MuiThemeProvider>
                <Dialog
                    open={this.state.open}
                    modal={false}
                >
                    <CircularProgress size={80} thickness={5} />
                </Dialog>
                <div id="tooltip">
                    <TooltipComponent />
                </div>
                <div id='mainpanel'>
                    <CypherBarComponent runCypher={this.runCypher} text={this.state.data.statement} />
                    <VisualizationComponent data={this.state.data} />
                </div>
                
				<Snackbar
					open={this.state.snackOpen}
					message="Event added to your calendar"
					autoHideDuration={4000}
					onRequestClose={()=>{ 
						this.setState(function(prevState, props) {
							prevState.snackOpen = false;
							return prevState;
						})}}
				/>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);