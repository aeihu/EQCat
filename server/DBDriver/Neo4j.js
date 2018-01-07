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

    runStatement(statement)
    {
        if (this._driver != null){
            let __session = this._driver.session();
            let __result = null; 

            __session
                .run(statement)
                .then(function (result) {
                    __result = result.records;
                    console.log("1");
                    console.log(__result);
                    let i = 0;
                    result.records.forEach(function (value, key, record) {
                        console.log("no" + i++);
                        console.log(value);
                        // for (let p in value.get('n').properties)
                        // {
                        //     console.log(p + ':' + value.get('n').properties[p]);
                        // }

                        //console.log(value.get('n').properties.released.toNumber());
                        console.log(key);
                    });

                    __session.close();
                })
                .catch(function (error) {
                    console.log(error);
                    __session.close();
                });

                console.log("2");
            console.log(__result);
            console.log(__result);
            return __result;
        }
        
        return null;
    }
}