import React from 'react';
import GlobalVariable from '../../Common/GlobalVariable';
import GlobalFunction from '../../Common/GlobalFunction';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import {D3ForceSimulation} from './D3ForceSimulation';

export default class DBInfoComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    
    componentWillReceiveProps(newProps)
    {
        GlobalFunction.GetLTP();
    }

    componentWillMount()
    {
        GlobalFunction.GetLTP();
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
                <h3>Database Information</h3>
                <h4 style={{borderBottom: '1px solid #ddd',}}>Node Labels</h4>
                <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', flexWrap:'wrap'}}>
                    {GlobalVariable.labelList.map((item, index)=>(
                        <Chip 
                            className="labelChip" 
                            labelStyle={{fontSize: '12px'}}
                            onClick={()=>this.props.onSetCypher('MATCH (n:' + item + ') RETURN n')}
                        >
                            <Avatar src={D3ForceSimulation.getNodeStyle(item).icon} 
                                style={{
                                    width:'23px', 
                                    height:'23px', 
                                    marginLeft:'6px', 
                                    borderRadius:'0%', 
                                    backgroundColor:'#00000000'}} 
                            />
                            {item}
                        </Chip>
                    ))}
                </div>
                <h4 style={{borderBottom: '1px solid #ddd',}}>Relationship Types</h4>
                <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', flexWrap:'wrap'}}>
                    {GlobalVariable.relationshipTypeList.map((item, index)=>(
                        <Chip 
                            className="edgeChip" 
                            labelStyle={{fontSize: '12px'}}
                            onClick={()=>this.props.onSetCypher('MATCH p=()-[r:' + item + ']->() RETURN p')}
                        >
                            <Avatar
                                className='edgeAvatar'
                                style={{
                                    backgroundColor:D3ForceSimulation.getEdgeStyle(item).color
                                }}
                            />
                            {item}
                        </Chip>
                    ))}
                </div>
                <h4 style={{borderBottom: '1px solid #ddd',}}>Property Keys</h4>
                <div style={{display: 'flex', flexDirection: 'row', flex:'0 0 auto', flexWrap:'wrap'}}>
                    {GlobalVariable.propertyList.map((item, index)=>(
                        <Chip 
                            className="edgeChip" 
                            labelStyle={{fontSize: '12px'}}
                            onClick={()=>this.props.onSetCypher('MATCH (n) WHERE EXISTS(n.' + item + ') RETURN DISTINCT "node" as entity, '+
                                'n.' + item + ' AS ' + item + ' UNION ALL MATCH ()-[r]-() WHERE EXISTS(r.' + item + ') RETURN DISTINCT ' +
                                '"relationship" AS entity, r.' + item + ' AS ' + item)}
                        >
                            {item}
                        </Chip>
                    ))}
                </div>
            </div>
        );
    }
}