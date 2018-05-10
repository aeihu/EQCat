import React from 'react';
import AddBox from 'material-ui/svg-icons/content/add-box';
import IconButton from 'material-ui/IconButton';
import Upload from 'rc-upload';
import CircularProgress from 'material-ui/CircularProgress';

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
        let xmlhttp = new XMLHttpRequest()
        
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
				let __json = JSON.parse(Base64.decode(xmlhttp.responseText));
                if (__json.hasOwnProperty('error')){
                    this.props.onMessage(__json.message, 0);
                }else{
                    this.setState(function(prevState, props) {
                        prevState.icons = __json.icons;
                        prevState.progress = false;
                        return prevState;
                    });
                }
            }
        }.bind(this)

        xmlhttp.open("Get", "/icon", true);
        xmlhttp.send();
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
                        this.getIconList();
                        // this.setState(function(prevState, props) {
                        //     prevState.progress = false;
                        //     return prevState;
                        // })
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
                        <IconButton
                            onClick={()=>{console.log('upload')}}
                            //tooltip="Add Icon"
                        >
                            <AddBox/>
                        </IconButton>
                    }
                </Upload>
            </div>
        )
    }
}