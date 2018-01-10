const neo4j = require('neo4j-driver').v1;

export default class Neo4j
{
    _driver = null;
    constructor(bolt, username, password)
    {
        //console.log('error');
        this._driver = neo4j.driver(bolt, neo4j.auth.basic(username, password), {maxTransactionRetryTime: 30000});
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
                        //console.log(value);

                        for (let i = 0; i < value.length; i++){
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
                    });

                    res.jsonp(result.records[0]);
                    __session.close();
                })
                .catch(function (error) {
                    console.log(error);
                    res.send('error');
                    __session.close();
                });
        }
    }
}