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
            let session = this._driver.session();

            session
                .run(statement)
                .then(function (result) {
                    result.records.forEach(function (record) {
                        console.log(record);
                    });

                    session.close();
                    //console.log('dsadsadsadsa');
                    return result;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}