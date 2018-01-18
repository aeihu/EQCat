const neo4j = require('neo4j-driver').v1;

export default class Neo4j
{
    _driver = null;
    constructor(bolt, username, password)
    {
        //console.log('error');
        this._driver = neo4j.driver(bolt, neo4j.auth.basic(username, password), {maxTransactionRetryTime: 30000});
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

    runStatement(statement, res)
    {
        if (this._driver == null){
            res.send('error');
        }
        else{
            let __session = this._driver.session();

            __session
                .run(statement)
                .then(function (result) {
                    let __result = [];
                    result.records.forEach(function (value, key, record) {
                        console.log(value);
                        
                        let __record = {};
                        for (let i = 0; i < value.length; i++){
                            if (typeof value.get(value.keys[i]) == 'object'){
                                switch (value.get(value.keys[i]).constructor){
                                    case neo4j.types.Relationship:
                                        __record[value.keys[i]] = { 
                                            name: this.ifIntegerThenToNumberOrString(value.get(value.keys[i]).identity).toString(),
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
                            console.log('ssaaaaaaaaaaaaaaaaaaa');
                            console.log(typeof value.get(value.keys[i]));
                            console.log(value.get(value.keys[i]));
                        }

                        __result.push(__record)
                    }.bind(this));

                    console.log(__result);
                    res.jsonp(__result);
                    __session.close();
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                    res.send('error');
                    __session.close();
                });
        }
    }
}