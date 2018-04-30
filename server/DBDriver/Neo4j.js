const neo4j = require('neo4j-driver').v1;
import { Base64 } from 'js-base64';

export default class Neo4j
{
    _driver = null;
    _labels = [];
    _relationshipTypes = [];
    _propertyKeys = [];

    constructor(bolt, username, password)
    {
        //console.log('error');
        this._driver = neo4j.driver(bolt, neo4j.auth.basic(username, password), {maxTransactionRetryTime: 30000});
        this.getLabels();
        this.getRelationshipTypes();
        this.getPropertyKeys();
    }

    ifIntegerThenToNumberOrString(val)
    {
        if (neo4j.isInt(val))
            return neo4j.integer.inSafeRange(val) ? val.toNumber() : val.toString()
     
        return val;
    }

    arrayToJson(val)
    {
        //////////////
        //////////////
        //////////////
        return __result;
    }

    propertiesToJson(val)
    {
        let __result = {};
        for (let key in val) {
            if (val[key].constructor == Array){
                let __array = [];
                val[key].forEach(function (v, k) {
                    __array.push(this.ifIntegerThenToNumberOrString(v));
                }.bind(this));

                __result[key] = __array;
            }
            else
                __result[key] = this.ifIntegerThenToNumberOrString(val[key]);
        }

        return __result;
    }

    close()
    {
        if (this._driver != null)
            this._driver.close();
    }

    getLabels()
    {
        if (this._driver == null){
            res.send('error');
        }
        else{
            let __session = this._driver.session();
            __session.run('call db.labels()')
                .then(function (result) {
                    this._labels = [];
                    result.records.forEach(function (value, key, record) {
                        this._labels.push(value.get('label'));
                    }.bind(this))
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                    __session.close();
                });
        }
    }

    getPropertyKeys()
    {
        if (this._driver == null){
            res.send('error');
        }
        else{
            let __session = this._driver.session();
            __session.run('call db.propertyKeys()')
                .then(function (result) {
                    this._propertyKeys = [];
                    result.records.forEach(function (value, key, record) {
                        this._propertyKeys.push(value.get('propertyKey'));
                    }.bind(this))
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                    __session.close();
                });
        }
    }

    getRelationshipTypes()
    {
        if (this._driver == null){
            res.send('error');
        }
        else{
            let __session = this._driver.session();
            __session.run('call db.relationshipTypes()')
                .then(function (result) {
                    this._relationshipTypes = [];
                    result.records.forEach(function (value, key, record) {
                        this._relationshipTypes.push(value.get('relationshipType'));
                    }.bind(this))
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                    __session.close();
                });
        }
    }

    addSingleNode(node, res)
    {
        let __statement = 'create (n';
        for (let i=0; i<node.labels.length; i++){
            __statement += ':' + node.labels[i];
        }

        __statement += '{';
        let __index = 0;
        for (let key in node.properties){
            if (__index > 0){
                __statement += ',';
            }
            __index++;
            __statement += key + ':{' + key + '}';
        }

        __statement += '}) return n';
        console.log(__statement);
        this.runStatement(__statement, node.properties, res);
    }

    mergeSingleNode(node, res)
    {
        //MATCH (n)  WHERE id(n) = 1 set n.bor=1986  return n
        let __statement = 'Match (n) where id(n)=' + node.id;
        let __index = 0;
        for (let key in node.properties.merge){
            __statement += __index == 0 ? ' set ' : ', ';
            __statement += 'n.' + key + '={' + key + '}';
            __index++;
        }

        for (let i=0; i<node.labels.merge.length; i++){
            if (i == 0){
                __statement += __index == 0 ? ' set n' : ', n';
            }
            __statement += ':' + node.labels.merge[i];
            __index++;
        }

        __index = 0;
        for (let i=0; i<node.properties.remove.length; i++){
            __statement += __index == 0 ? ' remove ' : ', '
            __statement += 'n.' + node.properties.remove[i];
            __index++;
        }

        for (let i=0; i<node.labels.remove.length; i++){
            if (i == 0){
                __statement += __index == 0 ? ' remove n' : ', n';
            }
            __statement += ':' + node.labels.remove[i];
            __index++;
        }

        __statement += ' return n';
        console.log(__statement);
        this.runStatement(__statement, node.properties.merge, res);
    }
    
    preDeleteNodes(nodes, res){
        let __statement = 'Match (n)-[r]-(m) where ';
        
        for (let i=0; i<nodes.length; i++){
            if (i > 0){
                __statement += ' or '
            }

            __statement += 'id(n)=' + nodes[i];
        }
        __statement += ' return DISTINCT n,r,m';
        console.log(__statement);
        this.runStatement(__statement, {}, res);
    }

    deleteNodes(nodes, res){
        let __statement = 'Match (n) where ';
        
        for (let i=0; i<nodes.length; i++){
            if (i > 0){
                __statement += ' or '
            }

            __statement += 'id(n)=' + nodes[i];
        }
        __statement += ' detach delete n return n';
        console.log(__statement);
        this.runStatement(__statement, {}, res);
    }
    
    addSingleEdge(edge, res)
    {
        let __statement = '';
        if (edge.hasOwnProperty('target')){
            __statement = 'match (s),(t)' +
                ' where id(s)=' + edge.source + ' and id(t)=' + edge.target +
                ' create (s)-[r:' + edge.type + ']->(t) return DISTINCT r';
        }
        console.log(__statement);
        this.runStatement(__statement, {}, res);
    }

    directSingleEdge(edge, res){
        // MATCH (n1)-[r1:foo]->(n2),(n6)
        // WHERE n1.id = 1 AND n2.id = 2 and n6.id = 6
        // CREATE (n2)-[r2:foo]->(n6)
        // SET r2=r1
        // DELETE r1
        let __statement = edge.connectMode == 1 ? 'MATCH ()-[r1]->(n1),' : 'MATCH (n1)-[r1]->(),';
        __statement += '(n2) where id(r1)=' + edge.edge + ' and id(n2)=' + edge.node + ' ';
        __statement += edge.connectMode == 1 ? 'CREATE (n2)-[r:' + edge.type + ']->(n1)' : 'CREATE (n1)-[r:' + edge.type + ']->(n2)';
        __statement += ' SET r=r1 DELETE r1 return DISTINCT r';

        console.log(__statement);
        this.runStatement(__statement, {}, res);
    }

    mergeSingleEdge(edge, res)
    {
        let __statement = '';
        let __index = 0;
        if (edge.hasOwnProperty('target')){
            //match (n),(m),()-[r]-() where id(n)=0 and id(m)=3 and id(r)=1046 merge (n)-[rr:vss]-(m) delete r return DISTINCT rr
            __statement = 'match (s),(t),()-[r]-()' +
                ' where id(s)=' + edge.source + ' and id(t)=' + edge.target + ' and id(r)=' + edge.id +
                ' merge (s)-[nr:' + edge.type + ' {';
                
            for (let key in edge.properties){
                if (__index > 0){
                    __statement += ',';
                }
                __index++;
                __statement += key + ':{' + key + '}';
            }

            __statement += '}]->(t) delete r return DISTINCT nr';
        }else{
            //match ()-[r]-() where id(r)=4 set r.type=1 return DISTINCT r
            __statement = 'Match ()-[r]-() where id(r)=' + edge.id;
            for (let key in edge.properties.merge){
                __statement += __index == 0 ? ' set ' : ', ';
                __statement += 'r.' + key + '={' + key + '}';
                __index++;
            }

            __index = 0;
            for (let i=0; i<edge.properties.remove.length; i++){
                __statement += __index == 0 ? ' remove ' : ', '
                __statement += 'r.' + edge.properties.remove[i];
                __index++;
            }

            __statement += ' return DISTINCT r';
        }
        console.log(__statement);
        this.runStatement(__statement, edge.hasOwnProperty('target') ? edge.properties : edge.properties.merge, res);
    }
    
    deleteEdges(edges, res){
        //match ()-[r]-() where id(r)=514 delete r return r
        let __statement = 'match ()-[r]-() where ';
        for (let i=0; i<edges.length; i++){
            if (i > 0){
                __statement += ' or '
            }

            __statement += 'id(r)=' + edges[i];
        }
        __statement += ' delete r';
        console.log(__statement);
        this.runStatement(__statement, {}, res);
    }

    deleteNodesAndEdges(json, res){
        //OPTIONAL match (n) where id(n)=435 OPTIONAL match ()-[r]-() where id(r)=1185 detach delete n,r return DISTINCT n,r
        let __statement = 'OPTIONAL match (n) where ';
        
        for (let i=0; i<json.nodes.length; i++){
            if (i > 0){
                __statement += ' or '
            }

            __statement += 'id(n)=' + json.nodes[i];
        }

        __statement += ' OPTIONAL match ()-[r]-() where '

        for (let i=0; i<json.edges.length; i++){
            if (i > 0){
                __statement += ' or '
            }

            __statement += 'id(r)=' + json.edges[i];
        }

        __statement += ' detach delete n,r return DISTINCT n,r';

        console.log(__statement);
        this.runStatement(__statement, {}, res);
    }

    runStatement(statement, param, res)
    {
        if (this._driver == null){
            res.send('error');
        }
        else{
            let __session = this._driver.session();

            __session
                .run(statement, param)
                .then(function (result) {
                    let __result = [];
                    //console.log(result);
                    console.log(result.summary.counters);
                    console.log(result.summary.updateStatistics);
                    result.records.forEach(function (value, key, record) {
                        let __record = {};
                        for (let i = 0; i < value.length; i++){
                            if (typeof value.get(value.keys[i]) == 'object'){
                                switch (value.get(value.keys[i]).constructor){
                                    case neo4j.types.Relationship:
                                        __record[value.keys[i]] = { 
                                            id: this.ifIntegerThenToNumberOrString(value.get(value.keys[i]).identity).toString(),
                                            type: value.get(value.keys[i]).type,
                                            source: this.ifIntegerThenToNumberOrString(value.get(value.keys[i]).start).toString(),
                                            target: this.ifIntegerThenToNumberOrString(value.get(value.keys[i]).end).toString(),
                                            properties: this.propertiesToJson(value.get(value.keys[i]).properties)
                                        };
                                    break;
                                    case neo4j.types.Node:
                                        __record[value.keys[i]] = { 
                                            id: this.ifIntegerThenToNumberOrString(value.get(value.keys[i]).identity).toString(),
                                            labels: value.get(value.keys[i]).labels,
                                            properties: this.propertiesToJson(value.get(value.keys[i]).properties)
                                        };
                                    break;
                                    case Array:
                                        if (value.get(value.keys[i]).length > 0){
                                            if (neo4j.isInt(value.get(value.keys[i])[0])){
                                                // /__record[value.keys[i]] = this.arrayToJson(value.get(value.keys[i]));
                                                ////////


                                                
                                                continue;
                                            }
                                        }

                                        __record[value.keys[i]] = value.get(value.keys[i]);
                                    break;
                                    default:
                                        __record[value.keys[i]] = this.ifIntegerThenToNumberOrString(value.get(value.keys[i]));
                                    break;
                                }
                            }
                            else{
                                __record[value.keys[i]] = value.get(value.keys[i]);
                            }
                        }

                        __result.push(__record)
                    }.bind(this));

                    console.log(__result);
                    res.send(Base64.encodeURI(JSON.stringify(__result)));
                    __session.close();
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                    res.send(Base64.encodeURI(JSON.stringify(error)));
                    __session.close();
                });
        }
    }
}