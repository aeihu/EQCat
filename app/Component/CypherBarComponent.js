import React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import 'codemirror/addon/lint/lint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/mode/cypher/cypher'
import 'codemirror/theme/solarized.css'

export default class CypherBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            height: 57
        }
        //width:"98%", 
    }

    render() {
        return (
            <Toolbar style={{width:"98%", 
                flex:'0 0 auto',
                height: this.state.height.toString() + 'px', 
                boxShadow: "0px 1px 5px #333333",
                margin:"10px"}}>
                <ToolbarGroup>
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
                                return {
                                    text: value,
                                    height: prevState.height
                                }
                            });
                        }}
                        onChange={(editor, data, value) => {
                            console.log(editor.lineCount());
                            if (editor.lineCount() <= 6){
                                editor.setSize('1000px', (10 + 24 * editor.lineCount()).toString() +'px')
                                this.setState(function(prevState, props) {
                                    return {
                                        text: prevState.text,
                                        height: 33 + 24 * editor.lineCount()
                                    }
                                });
                            }
                        }}
                        editorDidConfigure={(editor) => {
                            console.log('hello world!');
                        }}
                        editorDidMount={(editor) => {
                            editor.setSize('1000px','33px');
                        }}
                    />
                    <FloatingActionButton mini={true} style={{marginRight: 20}} 
                        onClick={
                            function(event){
                                this.props.runCypher(this.state.text);
                            }.bind(this)
                        } 
                    />
                    <FloatingActionButton mini={true} style={{marginRight: 20}}/>
                </ToolbarGroup>
            </Toolbar> 
        );
    }
}