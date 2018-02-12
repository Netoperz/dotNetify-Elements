
import React from 'react';
import { PropTypes } from 'prop-types';
import dotnetify from 'dotnetify';
import * as utils from './utils';

export const ContextTypes = Object.assign({}, {
    vmContext: PropTypes.object,
    theme: PropTypes.object
});

export class VMContext extends React.Component {

    static childContextTypes = ContextTypes;

    constructor(props) {
        super(props);
        if (props.vm) {
            this.removeOrphan(props.vm);
            this.vm = dotnetify.react.connect(props.vm, this);
        }
        this.onceHandlers = [];
    }

    componentWillUnmount() {
        this.vm.$destroy();
        this.onceHandlers = [];
    }

    componentWillUpdate(props, state) {
        // If something inside this view model context wishes to be notified on changed, then run the check here.
        // Right now this only supports handing notification at most once, just to keep it simple.
        if (this.onceHandlers.length > 0) {
            const changedProps = this.onceHandlers.filter(o => state.hasOwnProperty(o.propId) && state[o.propId] !== o.value);
            this.onceHandlers = this.onceHandlers.filter(o => !changedProps.includes(o));
            changedProps.forEach(o => o.handler(state[o.propId]));
        }
    }

    getChildContext() {
        return {
            ...this.context,
            vmContext: {
                vmId: this.props.vm,
                vm: this.vm,
                getStates: _ => this.state,
                getState: id => (this.state && this.state[id]) || undefined,
                setState: state => this.setState(state),
                dispatchState: state => this.vm.$dispatch(state),
                getPropAttributes: propId => utils.toCamelCase((this.state && this.state[propId + "__attr"]) || {}),
                getPropValidations: propId => (this.state && this.state[propId + "__validation"] || []).map(v => utils.toCamelCase(v)),
                once: (propId, oldValue) => new Promise(resolve => this.onceHandlers.push({ propId: propId, handler: newValue => resolve(newValue), value: oldValue }))
            }
        };
    }

    render() {
        return this.state ? <div>{this.props.children}</div> : null;
    }

    removeOrphan(vmId) {
        // Clear any existing connection to the same view model.
        dotnetify.react.getViewModels()
            .filter(vm => vm.$vmId === vmId)
            .forEach(vm => vm.$destroy());
    }
}
