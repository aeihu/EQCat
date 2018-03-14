

export default class IconSelectorComponent extends React.Component {

    render(){
        return (
            <div style={{
                display: 'flex', 
                flexDirection: 'row', 
                flexWrap: 'wrap',
                flex:'0 0 auto',
                width:'390px',
                alignItems:'center'}}>
                <IconButton>
                    <img src={this.icon} />
                </IconButton>
            </div>
        )
    }
}