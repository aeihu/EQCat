import PropTypes from 'prop-types';
import {Tabs, Tab} from 'material-ui/Tabs';
import GraphForDataComponent from './GraphForDataComponent';
import TableForDataComponent from './TableForDataComponent';
import React from 'react';

export default class VisualizationComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Tabs 
                style={{width:'98%', 
                    boxShadow: "0px 1px 5px #333333", 
                    margin:"10px", 
                    flex:'1 1 auto',
                    display: 'flex',
                    flexDirection: 'column'}}
                contentContainerStyle={{flex:'1 1 auto'}}
                tabTemplateStyle={{height: '100%', width:'100%'}}
            >
                <Tab
                    // icon={<FontIcon className="material-icons">phone</FontIcon>}
                    label="Graph"
                >
                    <GraphForDataComponent data={this.props.data.graph} />
                </Tab>
                <Tab
                    // icon={<FontIcon className="material-icons">favorite</FontIcon>}
                    label="Table"
                >
                    <TableForDataComponent data={this.props.data.table} />  
                </Tab>
            </Tabs>
        )
    }
}