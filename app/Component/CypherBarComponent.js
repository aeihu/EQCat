import React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/mode/cypher/cypher'
import 'codemirror/theme/solarized.css'

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Clear from 'material-ui/svg-icons/content/clear';

export default class CypherBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            height: 57
        }
    }

    componentWillReceiveProps(newProps)
    {
        if (newProps.flag.hasOwnProperty('text')){
            this.setState(function(prevState, props) {
                prevState.text = newProps.flag.text;
                return prevState;
            });
        }
    }

    render() {
        return (
            <Toolbar style={{width:"98%", 
                flex:'0 0 auto',
                height: this.state.height.toString() + 'px', 
                boxShadow: "0px 1px 5px #333333",
                margin:"10px"}}>
                <ToolbarGroup style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end'}}
                >
                    <div style={{alignSelf: 'auto',
                        borderRadius: '5px',
                        flexGrow: 2,
                        padding: '6px',
                        backgroundColor: '#FFFFFF'}}
                    >
                        <CodeMirror 
                            style={{padding:'5px'}}
                            value={this.state.text}
                            options={{
                                    mode: 'cypher',
                                    theme: 'solarized',
                                    smartIndent: true,
                                    showCursorWhenSelecting: true,
                                    lineNumbers: true
                            }}
                            onBeforeChange={(editor, data, value) => {
                                this.setState(function(prevState, props) {
                                    prevState.text = value;
                                    return prevState;
                                });
                            }}
                            onChange={(editor, data, value) => {
                                if (editor.lineCount() <= 6){
                                    editor.setSize('100%', (10 + 24 * editor.lineCount()).toString() +'px')
                                    this.setState(function(prevState, props) {
                                        prevState.height = 33 + 24 * editor.lineCount();
                                        return prevState;
                                    });
                                }
                            }}
                            editorDidConfigure={(editor) => {
                                console.log('hello world!');
                            }}
                            editorDidMount={(editor) => {
                                editor.setSize('100%','33px');
                            }}
                        />
                    </div>
                    <FloatingActionButton mini={true} style={{margin: 10}} 
                        onClick={
                            function(event){
                                this.props.runCypher(this.state.text);
                            }.bind(this)
                        } 
                    >
                        <AvPlayArrow />
                    </FloatingActionButton>
                    <FloatingActionButton mini={true} style={{margin: 10}}
                        onClick={
                            function(event){
                                this.props.saveCypher(this.state.text);
                            }.bind(this)
                        }>
                        <ActionGrade />
                    </FloatingActionButton>
                    <FloatingActionButton mini={true} style={{margin: 10}}
                        onClick={()=>this.setState(function(prevState, props) {
                                prevState.text = '';
                                return prevState;
                            })
                        }>
                        <Clear />
                    </FloatingActionButton>
                </ToolbarGroup>
            </Toolbar> 
        );
    }
}