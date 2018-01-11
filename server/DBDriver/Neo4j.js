const neo4j = require('neo4j-driver').v1;

export default class Neo4j
{
    _driver = null;
    constructor(bolt, username, password)
    {
        //console.log('error');
        this._driver = neo4j.driver(bolt, neo4j.auth.basic(username, password), {maxTransactionRetryTime: 30000});
    }

    ifIntegerThenToNumberOrString (val){
        console.log(1);
        console.log(val.constructor);
        if (val.constructor == neo4j.types.Integer){
            console.log(2);
            return neo4j.integer.inSafeRange(val) ? val.toNumber() : val.toString()
        }
        
        console.log(3);
        return val;
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
                    let i = 0;
                    result.records.forEach(function (value, key, record) {
                        console.log("no" + i++);
                        console.log(value);
                        
                        let __result = [];
                        for (let i = 0; i < value.length; i++){
                            let __record = {};
                            if (typeof value.get(value.keys[i]) == 'object'){
                                switch (value.get(value.keys[i]).constructor){
                                    case neo4j.types.Relationship:
                                    break;
                                    case neo4j.types.Node:
                                        __record[value.keys[i]] = { 
                                            identity: this.ifIntegerThenToNumberOrString(value.get(value.keys[i]).identity),
                                            labels: value.get(value.keys[i]).labels,
                                        };
                                    break;
                                    default:
                                        __record[value.keys[i]] = this.ifIntegerThenToNumberOrString(value.get(value.keys[i]));
                                    break;
                                }
                                console.log('00000000000000000000000000000000');
                                console.log(__record);
                            }
                            else if (typeof value.get(value.keys[i]) == 'array'){
                                if (value.get(value.keys[i]).length > 0){
                                    if (value.get(value.keys[i][0]).constructor == neo4j.types.integer){
                                        let __array = [];
                                        value.get(value.keys[i]).forEach(function (v, k) {
                                            __array.push(this.ifIntegerThenToNumberOrString(v));
                                        })

                                        __record[value.keys[i]] = __array;
                                        continue;
                                    }
                                }
                                
                                __record[value.keys[i]] = value.get(value.keys[i]);
                            }
                            else{
                                __record[value.keys[i]] = value.get(value.keys[i]);
                            }

                            console.log(typeof value.get(value.keys[i]))
                            console.log(neo4j.types.Node)
                            console.log(value.get(value.keys[i]).constructor === neo4j.types.Relationship)
                            console.log(value.get(value.keys[i]) === neo4j.types.Relationship)
                            console.log(value.get(value.keys[i]).constructor == neo4j.types.Relationship)
                            console.log(value.get(value.keys[i]) == neo4j.types.Relationship)
                            console.log('==========================')
                        }
                        // for (let p in value.get('n').properties)
                        // {
                        //     console.log(p + ':' + value.get('n').properties[p]);
                        // }

                        //console.log(value.get('n').properties.released.toNumber());
                    }.bind(this));

                    res.jsonp(result.records[0]);
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