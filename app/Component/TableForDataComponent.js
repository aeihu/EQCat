import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import React from 'react';

export default class TableForDataComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let __headerNameElements=[];
        
        for (let i = 0; i < this.props.data.columns.length; i++){
            if (__headerNameElements.length < 1)
                __headerNameElements.push(<TableRowColumn style={{width: '15px'}}>ID</TableRowColumn>);
            
            __headerNameElements.push(<TableRowColumn>{this.props.data.columns[i]}</TableRowColumn>);
        }

        return (
            <Table
                style={{height:'85%'}}
                fixedHeader={true}
                fixedFooter={false}
            >
                <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                    // enableSelectAll={this.state.enableSelectAll}
                >
                    <TableRow>
                        {__headerNameElements}
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}
                    // deselectOnClickaway={this.state.deselectOnClickaway}
                    // showRowHover={this.state.showRowHover}
                    stripedRows={true}
                >
                    {this.props.data.rows.map( (row, index) => (
                        <TableRow key={index} hoverable={true}>
                            <TableRowColumn style={{width: '15px'}}>{index+1}</TableRowColumn>
                            {
                                this.props.data.rows[index].map( (row, index) => (
                                    <TableRowColumn><pre style={{whiteSpace: 'pre-wrap'}}>
                                        {row}
                                    </pre></TableRowColumn>
                                ))
                            }
                        </TableRow> 
                    ))}
                </TableBody>
            </Table>
        )
    }
}