import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class AlertDialogComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
		const __actions = [
			<FlatButton
				label="OK"
				primary={true}
				keyboardFocused={true}
				onClick={this.props.onAction}
			/>,
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={this.props.onRequestClose}
			/>,
		];

		return (
			<Dialog
				title={this.props.title}
				actions={__actions}
				modal={true}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose}
				autoScrollBodyContent={true}
			>
                <span 
                    dangerouslySetInnerHTML={{
                        __html: this.props.message
                    }}
                />  
			</Dialog>
		);
	}
}