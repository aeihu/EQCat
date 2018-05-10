const log4js = require('log4js');

log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        neo4j: { 
            type: 'dateFile', 
            filename: 'logs/neo4j', 
            pattern: '.yyyy-MM.csv' ,
            layout: {
                type: 'pattern',
                pattern: '"%d","%p","%c","%X{statementType}","%m","%X{parameters}"'
            }
        },
        general: { 
            type: 'dateFile', 
            filename: 'logs/general.log', 
            pattern: '.yyyy-MM' ,
        }
    },
    categories: {
        default: { appenders: [ 'out', 'general' ], level: 'info' },
        neo4j: { appenders: [ 'out', 'neo4j' ], level: 'info' },
    }
});

const logger = log4js.getLogger();

module.exports = { 
    log4js:log4js, 
    logger: logger,
};