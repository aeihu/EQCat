import React from 'react';
import GlobalConstant from '../../Common/GlobalConstant';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import {D3ForceSimulation} from './D3ForceSimulation';

export default class FavoritesComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{
                height:'100%',
                display: 'flex', 
                flexDirection: 'column',
                overflowY: 'auto',
                marginLeft: '5px'}}
            >
            <h3>Favorites</h3>
            <h4 style={{borderBottom: '1px solid #ddd',}}>Saved Scripts</h4>
            </div>
        );
    }
}