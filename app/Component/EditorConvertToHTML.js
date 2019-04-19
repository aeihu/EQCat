import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class EditorConvertToHTML extends Component {
    
    constructor(props) {
        super(props);
        
        this.isRef = true;
    }

    flag = false;
    isRef = false;

    onEditorStateChange = function (editorState){
        this.setState({
            editorState,
        });
        this.flag = true;
    }.bind(this);

    componentWillReceiveProps(newProps)
    {
        this.isRef = true;
    }

    render() {
        if (this.isRef){
            this.isRef = false;
            let __contentBlock = htmlToDraft(this.props.data);
            let editorState;
            if (__contentBlock) {
                let __contentState = ContentState.createFromBlockArray(__contentBlock.contentBlocks);
                editorState = EditorState.createWithContent(__contentState);
                this.state = {
                    editorState,
                };
            }
        }
        const { editorState } = this.state;
        return (
            <div style={{
                border: "1px solid rgb(224, 224, 224)",
            }}>
                <Editor
                    editorState={editorState}                        
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={this.onEditorStateChange}
                    onBlur={(event, editorState) => {
                        if (this.flag){
                            this.flag = false;
                            this.props.onChange(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())), this.props.index);
                        }
                    }}
                    //onContentStateChange={this.onEditorChange}
                />
            </div>
        );
    }
}