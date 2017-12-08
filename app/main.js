import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TooltipComponent from './TooltipComponent';
import DialogExampleModal from './DialogExampleModal';
import VisualizationComponent from './VisualizationComponent'

const App = () => (
  <MuiThemeProvider>
    <div id="tooltip">
      <TooltipComponent />
    </div>
    <div id="visualization">
      <VisualizationComponent />
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);