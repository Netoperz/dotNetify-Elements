import React from 'react';
import { PropTypes } from 'prop-types';
import { ContextTypes } from './VMContext';
import VMProperty from './_internal/VMProperty';
import VMInput from './_internal/VMInput';
import * as utils from './utils';

export default class Element extends React.Component {

   static contextTypes = ContextTypes;

   static propTypes = {
      id: PropTypes.string.isRequired
   }

   get id() { return this.vmProperty.props.id; }
   get value() { return this.vmProperty.props.value; }

   get attrs() {
      // Returns element attributes defined in the back-end.  Any same attribute given 
      // as the element's property will trump it.
      const { attrs } = this.vmProperty.props;
      if (typeof attrs == "Array")
         return attrs.map(attr => this.props.hasOwnProperty(attr) ? this.props.attr : attr);
      return attrs;
   }

   get nonAttrProps() {
      // Returns element properties that are not also back-end attributes.
      const { attrs } = this.vmProperty.props;
      if (typeof attrs == "Array")
         return typeof this.props == "Array" && this.props.filter(prop => !this.attrs.hasOwnProperty(prop));
      return this.props;
   }

   get isVMProperty() {
      // Returns whether this component is associated with a back-end view model property.
      return this.context.vmContext && this.context.vmContext.getState().hasOwnProperty(this.props.id);
   }

   get vmInput() {
      // Returns the object that provides data from the back-end view model, and manages input validation
      // and sending back of data to the back-end.
      if (this.isVMProperty) {
         this._vmInput = this._vmInput || new VMInput(this.context.vmContext, this.props.id);
         return this._vmInput;
      }

      return {
         // Fallback is this component isn't associated with a back-end view model.
         props: { id: this.props.id, value: this.props.value, attrs: this.props.attrs || {} },
         dispatch: value => this.props.onChange ? this.props.onChange(value) : null,
         onValidated: handler => this.props.onValidated ? this.props.onValidator(handler) : null,
         initMask: _ => this.props.initMask ? this.props.initMask() : null
      };
   }
   get vmProperty() {
      // Returns the object that provides data from the back-end view model.
      if (this.isVMProperty) {
         this._vmProperty = this._vmProperty || new VMProperty(this.context.vmContext, this.props.id);
         return this._vmProperty;
      }

      return {
         // Fallback is this component isn't associated with a back-end view model.         
         props: { id: this.props.id, value: this.props.value, attrs: this.props.attrs || {} }
      };
   }

   resolveComponents(componentType) {
      return utils.resolveComponents(componentType, this.props);
   }

   render() {
      return this.vmProperty.value;
   }
}  