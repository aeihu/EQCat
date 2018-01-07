import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TooltipComponent from './Component/TooltipComponent';
import VisualizationComponent from './Component/VisualizationComponent'

//const dns = require('dns');
// var neo4j = new Neo4j('bolt://localhost', 'neo4j', 'neo4j');
// neo4j.runStatement('MATCH (n) RETURN n LIMIT 25');

const App = () => (
  <MuiThemeProvider>
    <div id="tooltip">
      <TooltipComponent />
    </div>
    <VisualizationComponent width='100%' height='99%' />
    <CypherCodeMirror />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);