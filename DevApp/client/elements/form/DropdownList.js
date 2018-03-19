import React from 'react';
import { PropTypes } from 'prop-types';
import { FieldPanel } from '../layout/FieldPanel';
import Element from '../Element';
import * as utils from '../utils';

const PlainTextComponent = props => props.children;

export class DropdownList extends Element {

    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        horizontal: PropTypes.bool,
        plainText: PropTypes.bool,
        prefix: PropTypes.any,
        suffix: PropTypes.any,
    }

    static componentTypes = {
        Container: FieldPanel,
        InputComponent: undefined,
        InputGroupComponent: undefined,
        PlainTextComponent
    }

    handleChange = (event) => {
       let value = event.target.value;
       value = this.valueType == "number" ? parseInt(value) : value;
       this.vmInput.dispatch(value);
    }

    render() {
        const [Container, Input, InputGroup, PlainText] = utils.resolveComponents(DropdownList, this.props);
        const { id, value, attrs } = this.vmInput.props;
        this.valueType = typeof value;

        const options = (attrs.options || options || []).map(opt => utils.toCamelCase(opt));
        const listOptions = options.map(opt => <option key={opt.key} value={opt.key}>{opt.value}</option>);
        let { label, plainText, prefix, suffix, horizontal, ...props } = this.props;
        label = label || attrs.label;
        prefix = prefix || attrs.prefix;
        suffix = suffix || attrs.suffix;
        plainText = utils.bool(plainText, attrs.plainText);

        const selected = options.filter(opt => opt.key == value).shift();
        const plainTextValue = selected ? selected.value : "";

        return (
            <Container id={id} label={label} horizontal={horizontal} plainText={plainText}>
                {plainText ? <PlainText>{plainTextValue}</PlainText> :
                    <InputGroup prefix={prefix} suffix={suffix}>
                        <Input
                            id={id}
                            type="select"
                            value={value}
                            prefix={prefix}
                            suffix={suffix}
                            onChange={this.handleChange}
                        >
                            {listOptions}
                        </Input>
                    </InputGroup>
                }
            </Container>
        )
    }
}