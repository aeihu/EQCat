import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TooltipComponent from './Component/TooltipComponent';
import VisualizationComponent from './Component/VisualizationComponent'
import AlertDialogComponent from './Component/AlertDialogComponent'
import CypherBarComponent from './Component/CypherBarComponent'
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import GlobalConstant from '../Common/GlobalConstant';
import GlobalFunction from '../Common/GlobalFunction';

class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            alert:{
                open: false,
                title: '',
                message: '',
                action: null
            },
            snackbar:{
                open: false,
                message: '',
                color: 'rgba(245, 0, 0, 0.87)',
            },
            progress:{
                open: false,
            },
            data: {
                statement:'',
                records:[],
                graph: {
                    refreshType: -1,
                    nodes: [],
                    edges: [],
                    count: {
                        nodes: {
                            '*': {
                                total: 0,
                                propertiesList: {
                                    '<id>':1
                                }
                            }
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
        
        GlobalFunction.GetLTP();
		GlobalFunction.GetTemplate();
    }

    flagForTTC = {};
    flagForCBC = {};
    getFlagForSomeComponent = function(flag){
		if (Object.keys(flag).length > 0){
            let __result = {...flag};
            for (let key in flag){
                delete flag[key];
            }
            return __result;
        }
        return {};
    }

    saveCypher = function(statement){
        GlobalFunction.SendAjax(
            (result)=>{
                this.flagForTTC = {statement: statement};
                this.setState(function(prevState, props) {
                    prevState.data.graph.refreshType = -1;
                    return prevState;
                })
            },
            (error)=>{this.showSnackbar(error.message, 0);},
            "/addFavorites?cypher=",
            {statement: statement}
        )
    }.bind(this)

    setCypher = function(statement){
        this.flagForCBC = {text: statement};
		this.setState(function(prevState, props) {
            prevState.data.graph.refreshType = -1;
            return prevState;
        })
    }.bind(this)

    showAlert = function (title, message, action){
		this.setState(function(prevState, props) {
            prevState.data.graph.refreshType = -1;
            prevState.alert.open = true;
            prevState.alert.title = title;
            prevState.alert.message = message;
            prevState.alert.action = action;
			return prevState;
        })
    }.bind(this)

    hideAlert = function (){
		this.setState(function(prevState, props) {
            prevState.data.graph.refreshType = -1;
            prevState.alert.open = false;
			return prevState;
        })
    }.bind(this)

    showSnackbar = function(message, type){
		this.setState(function(prevState, props) {
			prevState.snackbar.open = true;
            prevState.snackbar.message = message;
            prevState.snackbar.color = type == 0 ? 'rgba(245, 0, 0, 0.87)' : 'rgba(106, 198, 255, 0.87)';
            prevState.data.graph.refreshType = -1;
			return prevState;
		})
    }.bind(this);
    
    countNodeForRunCypher = function(nodes, data, count){
        let __b = true;
        for (let i = 0; i < nodes.length; i++){
            if (nodes[i].id == data.id){
                __b = false;
                break;
            }
        }

        if (__b){
            nodes.push(data);

            for (let i = 0; i < data.labels.length; i++){
                let __label = data.labels[i];
                if (count.nodes.hasOwnProperty(__label)){
                    count.nodes[__label].total++;
                }else{
                    count.nodes[__label] = {
                        total:1, 
                        propertiesList: {
                            '<id>':1
                        }
                    };
                }
                
                for (let propertyName in data.properties){
                    if (propertyName != GlobalConstant.imagesOfProperty &&
                        propertyName != GlobalConstant.memoOfProperty){
                            count.nodes[__label].propertiesList[propertyName] = 
                                count.nodes[__label].propertiesList.hasOwnProperty(propertyName) ?
                                    count.nodes[__label].propertiesList[propertyName] + 1
                                    :
                                    1;
                    }
                }
                
                count.nodes['*'].total++;
            }
        }
    }

    countEdgeForRunCypher = function(edges, data){
        let __b = true;
        for (let i = 0; i < edges.length; i++){
            if (edges[i].id == data.id){
                __b = false;
                break;
            }
        }

        if (__b){
            edges.push(data);
        }
    }

    parseObj(obj, nodes, edges, count){
        if (typeof obj == 'object'){
            switch (obj.constructor){
                case Array:
                    for (let i=0; i<obj.length; i++){
                        this.parseObj(obj[i], nodes, edges, count);
                    }
                    break;
                default:
                    if (Object.keys(obj).length == 3
                        && obj.hasOwnProperty("id") 
                        && obj.hasOwnProperty("labels") 
                        && obj.hasOwnProperty("properties")){
                        this.countNodeForRunCypher(nodes, obj, count);
                    }else if (Object.keys(obj).length == 5
                        && obj.hasOwnProperty("id") 
                        && obj.hasOwnProperty("type") 
                        && obj.hasOwnProperty("properties")
                        && obj.hasOwnProperty("source")
                        && obj.hasOwnProperty("target")){
                        this.countEdgeForRunCypher(edges, obj);
                    }else if (Object.keys(obj).length == 2
                        && obj.hasOwnProperty("length") 
                        && obj.hasOwnProperty("segments")){
                        for (let i=0; i<obj.segments.length; i++){
                            for (let pro in obj.segments[i]){
                                switch (pro){
                                    case 'start':
                                    case 'end':
                                        this.countNodeForRunCypher(nodes, obj.segments[i][pro], count);
                                        break;
                                    case 'relationship':
                                        this.countEdgeForRunCypher(edges, obj.segments[i][pro]);
                                        break;
                                }
                            }
                        }
                    }else{
                        for (let key in obj){
                            this.parseObj(obj[key], nodes, edges, count);
                        }
                    }
                    break;
            }
        }
    }

    runCypher = function(statement) {
        if (statement.trim() == ''){
            this.showSnackbar('Cypher statement is expected to be a non-empty string', 0);
            return;
        }
        
        GlobalFunction.SendAjax(
            (result)=>{
                if (result.type.indexOf('w') >= 0){
                    GlobalVariable.flagForGetLTP = true;
                }

                let __nodes = [];
                let __edges = [];
                let __rows = [];
                let __columns = [];
                let __count = {
                    nodes: {
                        '*': {
                            total: 0,
                            propertiesList: {
                                '<id>': 1
                            }
                        }
                    },
                    edges: {
                        '*': 0
                    }
                };
                //console.log(result.records)
                let __isFirst = true;
                result.records.forEach(function (v, k) {
                    if (__isFirst){
                        for (let key in v)
                            __columns.push(key);
                        
                        __isFirst = false;
                    }

                    let __row = []
                    for (let key in v) {
                        this.parseObj(v[key], __nodes, __edges, __count);
                        __row.push(JSON.stringify(v[key], null, 2));
                    }

                    __rows.push(__row);
                }.bind(this));

                for (let i = __edges.length - 1; i >= 0; i--){
                    let __srcIdx = -1;
                    let __tgtIdx = -1;
                    for (let j = 0; j < __nodes.length; j++){
                        if (__srcIdx < 0){
                            if (__edges[i].source == __nodes[j].id){
                                __srcIdx = j;
                            }
                        } 
                        
                        if (__tgtIdx < 0){
                            if (__edges[i].target == __nodes[j].id){
                                __tgtIdx = j;
                            }
                        }

                        if (__srcIdx >= 0 && __tgtIdx >= 0){
                            break;
                        }
                    }

                    if (__srcIdx >= 0 && __tgtIdx >= 0){
                        if (!__nodes[__srcIdx].hasOwnProperty('sourceEdges'))
                            __nodes[__srcIdx]['sourceEdges'] = [];

                        __nodes[__srcIdx].sourceEdges.push(__edges[i]);
                        
                        if (!__nodes[__tgtIdx].hasOwnProperty('targetEdges'))
                            __nodes[__tgtIdx]['targetEdges'] = [];

                        __nodes[__tgtIdx].targetEdges.push(__edges[i]);
                            
                        if (__count.edges.hasOwnProperty(__edges[i].type))
                            __count.edges[__edges[i].type]++;
                        else
                            __count.edges[__edges[i].type] = 1;

                        __count.edges['*']++;
                    }else{
                        __edges.splice(i, 1);
                    }
                }

                this.setState(function(prevState, props) {
                    prevState.progress.open = false;
                    prevState.data.graph.refreshType = 0;
                    prevState.data.statement = statement;
                    prevState.data.records = result.records;
                    prevState.data.graph.nodes = __nodes;
                    prevState.data.graph.edges = __edges;
                    prevState.data.graph.count = __count;
                    prevState.data.table.rows = __rows;
                    prevState.data.table.columns = __columns;
                    return prevState;
                });
            },
            (error)=>{
                this.setState(function(prevState, props) {
                    prevState.progress.open = false;
                    prevState.data.graph.refreshType = -1;
                    return prevState;
                });
                this.showSnackbar(error.message, 0);
            },
            "/example?cypher=",
            { statement: statement }
        );

        this.setState(function(prevState, props) {
            prevState.data.graph.refreshType = -1;
            prevState.progress.open = true
            return prevState;
        });
    }.bind(this)

    addNode = function(node){
        if (node.length > 0){
            for (let keyName in node[0]){
                this.setState(function(prevState, props) {
                    let __countNode = prevState.data.graph.count.nodes;
                    let __label;

                    for (let j=0; j<node[0][keyName].labels.length; j++){
                        __label = node[0][keyName].labels[j];
                        
                        if (__countNode.hasOwnProperty(__label)){
                            __countNode[__label].total++;
                        }
                        else{
                            __countNode[__label] = {
                                total: 1, 
                                propertiesList: {
                                    '<id>': 1
                                }
                            }
                        }
                        __countNode['*'].total++;

                        for (let key in node[0][keyName].properties){
                            if (key != GlobalConstant.imagesOfProperty &&
                                key != GlobalConstant.memoOfProperty){
                                __countNode[__label].propertiesList[key] = 
                                    __countNode[__label].propertiesList.hasOwnProperty(key) ?
                                    __countNode[__label].propertiesList[key] + 1
                                    :
                                    1;
                            }
                        }
                    }

                    prevState.data.graph.nodes.push({
                        id: node[0][keyName].id,
                        labels: node[0][keyName].labels,
                        properties: node[0][keyName].properties
                    });

                    prevState.data.graph.refreshType = 1;
                    return prevState;
                });
            }
        }
    }.bind(this)

    mergeNode = function(node){
        if (node.length > 0){
            for (let keyName in node[0]){
                for (let i=0; i<this.state.data.graph.nodes.length; i++){
                    if (this.state.data.graph.nodes[i].id == node[0][keyName].id){
                        this.setState(function(prevState, props) {
                            let __countNode = prevState.data.graph.count.nodes;
                            let __label;
                            for (let j=0; j<prevState.data.graph.nodes[i].labels.length; j++){
                                __label = prevState.data.graph.nodes[i].labels[j];
                                __countNode['*'].total--;
                                if (__countNode[__label].total == 1){
                                    delete __countNode[__label];
                                }else{
                                    __countNode[__label].total--;
                                    for (let key in prevState.data.graph.nodes[i].properties){
                                        if (key != GlobalConstant.imagesOfProperty &&
                                            key != GlobalConstant.memoOfProperty){
                                            if (__countNode[__label].propertiesList[key] == 1){
                                                delete __countNode[__label].propertiesList[key];
                                            }else{
                                                __countNode[__label].propertiesList[key]--;
                                            }
                                        }
                                    }
                                }
                            }

                            for (let j=0; j<node[0][keyName].labels.length; j++){
                                __label = node[0][keyName].labels[j];
                                
                                if (__countNode.hasOwnProperty(__label)){
                                    __countNode[__label].total++;
                                }
                                else{
                                    __countNode[__label] = {
                                        total: 1, 
                                        propertiesList: {
                                            '<id>': 1
                                        }
                                    }
                                }
                                __countNode['*'].total++;

                                for (let key in node[0][keyName].properties){
                                    if (key != GlobalConstant.imagesOfProperty &&
                                        key != GlobalConstant.memoOfProperty){
                                        __countNode[__label].propertiesList[key] = 
                                            __countNode[__label].propertiesList.hasOwnProperty(key) ?
                                            __countNode[__label].propertiesList[key] + 1
                                            :
                                            1;
                                    }
                                }
                            }

                            prevState.data.graph.nodes[i].labels = node[0][keyName].labels;
                            prevState.data.graph.nodes[i].properties = node[0][keyName].properties;
                            prevState.data.graph.refreshType = 1;
                            return prevState;
                        });
                        break;
                    }
                }
            }
        }
    }.bind(this)

    deleteNodes = function(nodes){
        this.setState(function(prevState, props) {
            let prevNodeID = '';
            let __countNode = prevState.data.graph.count.nodes;
            let __countEdge = prevState.data.graph.count.edges;

            //////////////////////////////////
            //  delete nodes
            //////////////////////////////////
            nodes.map((node, index)=>{
                for (let i=prevState.data.graph.nodes.length-1; i>=0; i--){
                    if (prevState.data.graph.nodes[i].id == node.id){
                        let __label = '';
                        for (let j=0; j<prevState.data.graph.nodes[i].labels.length; j++){
                            __label = prevState.data.graph.nodes[i].labels[j];
                            __countNode['*'].total--;
                            
                            if (__countNode[__label].total == 1){
                                delete __countNode[__label];
                            }else{
                                __countNode[__label].total--;
                                for (let key in prevState.data.graph.nodes[i].properties){
                                    if (key != GlobalConstant.imagesOfProperty &&
                                        key != GlobalConstant.memoOfProperty){
                                        if (__countNode[__label].propertiesList[key] == 1){
                                            delete __countNode[__label].propertiesList[key];
                                        }else{
                                            __countNode[__label].propertiesList[key]--;
                                        }
                                    }
                                }
                            }
                        }
                        prevState.data.graph.nodes.splice(i, 1);
                        break;
                    }
                }
                
                for (let count=0; count<2; count++){
                    let __self = count == 0 ? 'sourceEdges' : 'targetEdges';
                    let __other = count == 0 ? 'targetEdges' : 'sourceEdges';
                    if (node.hasOwnProperty(__self)){
                        node[__self].map((edge, index)=>{
                            //////////////////////////////////
                            //  delete source and target edge in node
                            //////////////////////////////////
                            for (let i=0; i<prevState.data.graph.nodes.length; i++){
                                if (edge.target.id == prevState.data.graph.nodes[i].id){
                                    for (let j=0; j<prevState.data.graph.nodes[i][__other].length; j++){
                                        if (prevState.data.graph.nodes[i][__other][j].id == edge.id){
                                            prevState.data.graph.nodes[i][__other].splice(j, 1);
                                            break;
                                        }
                                    }
                                }
                            }
                            
                            //////////////////////////////////
                            //  delete edges
                            //////////////////////////////////
                            for (let i=prevState.data.graph.edges.length-1; i>=0; i--){
                                if (prevState.data.graph.edges[i].id == edge.id){
                                    prevState.data.graph.edges.splice(i, 1);
                                    
                                    if (__countEdge[edge.type] == 1){
                                        delete __countEdge[edge.type];
                                    }else{
                                        __countEdge[edge.type]--;
                                    }

                                    __countEdge['*']--;
                                    break;
                                }
                            }
                        })
                    }
                }
                
            });
            
            prevState.data.graph.refreshType = 2;
            return prevState;
        });
    }.bind(this)
    
    addEdge = function(edge){
        if (edge.length > 0){
            for (let keyName in edge[0]){
                this.setState(function(prevState, props) {
                    let __countEdge = prevState.data.graph.count.edges;
                    let __type = edge[0][keyName].type;
                    if (__countEdge.hasOwnProperty(__type)){
                        __countEdge[__type]++;
                    }
                    else{
                        __countEdge[__type] = 1;
                    }
                    __countEdge['*']++;

                    prevState.data.graph.count.edges = __countEdge;
                    prevState.data.graph.edges.push(edge[0][keyName]);
                    console.log(edge[0][keyName])
                    let __isSource = false;
                    let __isTarget = false;
                    for (let i=0; i<prevState.data.graph.nodes.length; i++){
                        if (!__isSource){
                            if (edge[0][keyName].source == prevState.data.graph.nodes[i].id){
                                __isSource = true;
                                if (!prevState.data.graph.nodes[i].hasOwnProperty('sourceEdges'))
                                    prevState.data.graph.nodes[i]['sourceEdges'] = [];

                                prevState.data.graph.nodes[i].sourceEdges.push(edge[0][keyName]);
                            }
                        } 
                        
                        if (!__isTarget){
                            if (edge[0][keyName].target == prevState.data.graph.nodes[i].id){
                                __isTarget = true;
                                if (!prevState.data.graph.nodes[i].hasOwnProperty('targetEdges'))
                                    prevState.data.graph.nodes[i]['targetEdges'] = [];

                                prevState.data.graph.nodes[i].targetEdges.push(edge[0][keyName]);
                            }
                        }

                        if (__isSource && __isTarget){
                            break;
                        }
                    }

                    prevState.data.graph.refreshType = 1;
                    return prevState;
                });
            }
        }
    }.bind(this)

    mergeEdge = function(edge, prevEdgeId){
        if (edge.length > 0){
            for (let keyName in edge[0]){
                for (let i=0; i<this.state.data.graph.edges.length; i++){
                    if (this.state.data.graph.edges[i].id == prevEdgeId){
                        this.setState(function(prevState, props) {
                            if (prevState.data.graph.edges[i].type != edge[0][keyName].type){
                                let __countEdge = prevState.data.graph.count.edges;
                                let __type = prevState.data.graph.edges[i].type;
                                
                                if (__countEdge[__type] == 1){
                                    delete __countEdge[__type];
                                }else{
                                    __countEdge[__type]--;
                                }

                                __type = edge[0][keyName].type;
                                if (__countEdge.hasOwnProperty(__type)){
                                    __countEdge[__type]++;
                                }
                                else{
                                    __countEdge[__type] = 1;
                                }

                                prevState.data.graph.count.edges = __countEdge;
                                prevState.data.graph.edges[i].type = edge[0][keyName].type;
                            }

                            let __key = prevState.data.graph.edges[i].source.id != edge[0][keyName].source ?
                                'source'
                                :
                                prevState.data.graph.edges[i].target.id != edge[0][keyName].target ? 
                                    'target'
                                    :
                                    '';

                            if (__key != ''){
                                let __new = false;
                                let __old = false;
                                let __str = __key + 'Edges';
                                let __tmp = null;
                                let __index = 0;
                                for (let j=0; j<prevState.data.graph.nodes.length; j++){
                                    if (!__new){
                                        if (edge[0][keyName][__key] == prevState.data.graph.nodes[j].id){
                                            if (!prevState.data.graph.nodes[j].hasOwnProperty(__str))
                                                prevState.data.graph.nodes[j][__str] = [];

                                            __index = j;
                                            __new = true;
                                        }
                                    }

                                    if (!__old){
                                        if (prevState.data.graph.edges[i][__key].id == prevState.data.graph.nodes[j].id){
                                            for (let idx=0; idx<prevState.data.graph.nodes[j][__str].length; idx++){
                                                if (prevState.data.graph.edges[i].id == prevState.data.graph.nodes[j][__str][idx].id){
                                                    __tmp = prevState.data.graph.nodes[j][__str][idx];
                                                    prevState.data.graph.nodes[j][__str].splice(idx, 1);
                                                    __old = true;
                                                }
                                            }
                                        }
                                    }

                                    if (__new && __old){
                                        break;
                                    }
                                }
                                prevState.data.graph.nodes[__index][__str].push(__tmp);
                                prevState.data.graph.edges[i][__key] = edge[0][keyName][__key];
                            }
                            
                            prevState.data.graph.edges[i].id = edge[0][keyName].id;
                            prevState.data.graph.edges[i].properties = edge[0][keyName].properties;
                            prevState.data.graph.refreshType = 1;
                            return prevState;
                        });
                        break;
                    }
                }
            }
        }
    }.bind(this)
    
    deleteEdges = function(edges){
        this.setState(function(prevState, props) {
            let __countEdge = prevState.data.graph.count.edges;
            for (let i=0; i<edges.length; i++){
                for (let j=prevState.data.graph.edges.length-1; j>=0; j--){
                    if (prevState.data.graph.edges[j].id == edges[i]){
                        //////////////////////////////////
                        //  delete source and target edge in node
                        //////////////////////////////////
                        let __source = true;
                        let __target = true;
                        for (let index=0; index<prevState.data.graph.nodes.length; index++){
                            if (__source){
                                if (prevState.data.graph.nodes[index].id == prevState.data.graph.edges[j].source.id){
                                    for (let idx=0; idx<prevState.data.graph.nodes[index].sourceEdges.length; idx++){
                                        if (prevState.data.graph.nodes[index].sourceEdges[idx].id == prevState.data.graph.edges[j].id){
                                            prevState.data.graph.nodes[index].sourceEdges.splice(idx, 1);
                                            __source = false;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (__target){
                                if (prevState.data.graph.nodes[index].id == prevState.data.graph.edges[j].target.id){
                                    for (let idx=0; idx<prevState.data.graph.nodes[index].targetEdges.length; idx++){
                                        if (prevState.data.graph.nodes[index].targetEdges[idx].id == prevState.data.graph.edges[j].id){
                                            prevState.data.graph.nodes[index].targetEdges.splice(idx, 1);
                                            __target = false;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (!__source && !__target){
                                break;
                            }
                        }

                        if (__countEdge[prevState.data.graph.edges[j].type] == 1){
                            delete __countEdge[prevState.data.graph.edges[j].type];
                        }else{
                            __countEdge[prevState.data.graph.edges[j].type]--;
                        }
                        __countEdge['*']--;
                        prevState.data.graph.edges.splice(j, 1);
                        break;
                    }
                }
            }
            prevState.data.graph.refreshType = 2;
            return prevState;
        });
    }.bind(this)

    render() {
        return (
            <MuiThemeProvider>
                <Dialog
                    open={this.state.progress.open}
                    modal={false}
                >
                    <CircularProgress size={80} thickness={5} />
                </Dialog>
                <AlertDialogComponent
                    open={this.state.alert.open}
                    title={this.state.alert.title}
                    message={this.state.alert.message}
                    onRequestClose={this.hideAlert}
                    onAction={this.state.alert.action}
                />
                <div style={{
                        display: 'flex',
                        flexDirection: 'column'}}>
                    <TooltipComponent 
                        flag={this.getFlagForSomeComponent(this.flagForTTC)}
                        onMessage={this.showSnackbar}
                        onSetCypher={this.setCypher}/>
                </div>
                <div id='mainpanel'>
                    <CypherBarComponent
                        runCypher={this.runCypher}
                        saveCypher={this.saveCypher}
                        flag={this.getFlagForSomeComponent(this.flagForCBC)}
                    />
                    <VisualizationComponent 
                        data={this.state.data} 
                        onAddNode={this.addNode}
                        onAddEdge={this.addEdge}
                        onMergeNode={this.mergeNode}
                        onMergeEdge={this.mergeEdge}
                        onDeleteNode={this.deleteNodes}
                        onDeleteEdge={this.deleteEdges}
                        onMessage={this.showSnackbar}
                        onAlert={this.showAlert}
                    />
                </div>
                
				<Snackbar
                    bodyStyle={{backgroundColor: this.state.snackbar.color}}
					open={this.state.snackbar.open}
					message={this.state.snackbar.message}
					autoHideDuration={4000}
					onRequestClose={()=>{ 
						this.setState(function(prevState, props) {
							prevState.snackbar.open = false;
                            prevState.data.graph.refreshType = -1;
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