import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TooltipComponent from './Component/TooltipComponent';
import VisualizationComponent from './Component/VisualizationComponent'

const App = () => (
  <MuiThemeProvider>
    <div id="tooltip">
      <TooltipComponent />
    </div>
    <VisualizationComponent width='100%' height='99%' />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);