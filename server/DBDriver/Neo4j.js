const neo4j = require('neo4j-driver').v1;

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
        this.runStatement(__statement, node.properties.merge, res);
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
    
    deleteNode(node, res){
        let __statement = 'Match (n) where id(n)=' + node.id + ' delete n';
        console.log(__statement);
        this.runStatement(__statement, node.properties.merge, res);
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
                    res.jsonp(__result);
                    __session.close();
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                    res.jsonp(error);
                    __session.close();
                });
        }
    }
}