import React from 'react';
import Upload from 'rc-upload';
import GlobalFunction from '../../Common/GlobalFunction';

import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';

import AddBox from 'material-ui/svg-icons/content/add-box';

export default class IconSelectorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            icons: [],
            progress: false
        }
    }

    icon = '';

    componentDidMount()
    {
        this.getIconList();
    }

    componentWillMount()
    {
        this.icon = this.props.icon;
    }

    componentWillReceiveProps(newProps)
    {
        this.icon = newProps.icon;
    }

    getIconList = function()
    {
        GlobalFunction.SendAjax(
            (result)=>{
                this.setState(function(prevState, props) {
                    prevState.icons = result.icons;
                    prevState.progress = false;
                    return prevState;
                });
            },
            (error)=>{props.onMessage(error.message, 0)},
            "/icon"
        );
    }.bind(this)

    render(){
        let __iconList = [];

        for (let i=0; i<this.state.icons.length; i++){
            __iconList.push(
                <IconButton 
                    hoveredStyle={{backgroundColor:'SkyBlue'}}
                    onClick={function(event) {
                        this.icon = this.state.icons[i];
                        this.props.onChange(this.icon);
                    }.bind(this)}>
                    <img src={this.state.icons[i]} width='24px' height='24px' />
                </IconButton>
            )
        }

        return (
            <div style={{
                display: 'flex', 
                flexDirection: 'row', 
                flexWrap: 'wrap',
                flex:'0 0 auto',
                width: __iconList.length < 8 ? ((__iconList.length + 1) * 48) + 'px' : '384px',//'390px',
                alignItems:'center'}}>
                {__iconList}
                
                <Upload
                    action='/upload_icon'
                    accept=".svg, .png"
                    beforeUpload={(file) => {
                        console.log('beforeUpload', file.name);
                        this.setState(function(prevState, props) {
                            prevState.progress = true;
                            return prevState;
                        })
                    }}
                    onStart={(file) => {
                        console.log('onStart', file.name);
                    // this.refs.inner.abort(file);
                    }}
                    onSuccess={(file) => {
                        console.log('onSuccess', file);
                        let __b = true;
                        this.setState(function(prevState, props) {
                            let __json = JSON.parse(Base64.decode(file));
                            let __filename = 'icons/' + __json.filename;
                            for (let i=0; i<prevState.icons.length; i++){
                                if (prevState.icons[i] == __filename){
                                    __b = false;
                                    break;
                                }
                            }

                            if (__b){
                                prevState.icons.push(__filename);
                            }

                            prevState.progress = false;
                            return prevState;
                        })

                        if (!__b){
                            this.props.onMessage('This icon has been upload', 0);
                        }
                    }}
                    onProgress={(step, file) => {
                        console.log('onProgress', Math.round(step.percent), file.name);
                    }}
                    onError={(err) => {
                        console.log('onError', err);
                        this.setState(function(prevState, props) {
                            prevState.progress = false;
                            return prevState;
                        })
                    }}
                >
                    {this.state.progress ? 
                        <CircularProgress/>
                        :
                        <IconButton onClick={()=>{console.log('upload')}}>
                            <AddBox/>
                        </IconButton>
                    }
                </Upload>
            </div>
        )
    }
}