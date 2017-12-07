import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TooltipComponent from './TooltipComponent';

const App = () => (
  <MuiThemeProvider>
    <div id="tooltip">
        <TooltipComponent />
    </div>
    <div id="visualization">
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(
    <App />,
  document.getElementById('app')
);
