import React from 'react';
import { PropTypes } from 'prop-types';
import { FormGroup, Label, Input } from 'reactstrap';
import { ContextTypes } from '../../VMContext';

export class Checkbox extends React.Component {

    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        let value = event.target.checked;
        this.context.setState({ [this.props.id]: value });
        this.context.dispatchState({ [this.props.id]: value });
    }

    render() {
        let _Label = this.props.checkLabelComponent || Label;

        let vmId = this.context.vmId;
        let props = this.props;
        let value = this.context.getState(props.id) || false;
        let attrs = this.context.getPropAttributes(props.id);
        let label = attrs.label || props.label;
        return (
            <FormGroup check>
                <_Label check>
                    <Input type="checkbox" name={`${vmId}.${props.id}`} checked={value} onChange={this.handleChange} />
                    {label}
                </_Label>
            </FormGroup>
        )
    }
};

Checkbox.contextTypes = ContextTypes;

Checkbox.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
};