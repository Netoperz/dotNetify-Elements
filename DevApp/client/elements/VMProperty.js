import React from 'react';

export default class VMProperty {

   constructor(vmContext, propId) {
      this.vmContext = vmContext;
      this.propId = propId;
   }

   get vm() {
      return this.vmContext.vm;
   }

   get id() {
      return `${this.vmContext.vmId}.${this.propId}`;
   }

   get value() {
      return this.vmContext.getState(this.propId);
   }

   set value(value) {
      this.vmContext.setState({ [this.propId]: value });
   }

   get props() {
       return {
           id: this.id,
           value: this.value,
           attrs: this.vmContext.getPropAttributes(this.propId)
       }
   }
}