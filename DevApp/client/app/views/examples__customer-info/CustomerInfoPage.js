import React from 'react';
import BasicInfoForm from './BasicInfoForm';
import AddressForm from './AddressForm';
import NewCustomerDialog from './NewCustomerDialog';
import { Button, DataGrid, Form, Frame, Panel, Tab, TabItem, VMContext, withTheme } from 'elements';

class CustomerInfoPage extends React.Component {
   state = { editable: false, edit: false, showDialog: false };

   handleSelect = value => this.setState({ editable: value ? true : false });
   toggleEdit = _ => this.setState({ edit: !this.state.edit });
   toggleDialog = _ => this.setState({ showDialog: !this.state.showDialog });

   render() {
      const { editable, edit, showDialog } = this.state;
      const canEdit = editable && !edit;
      return (
         <VMContext vm="CustomerInfoPage">
            <Frame>
               <h2>Customers</h2>
               <DataGrid id="Contacts" onSelect={this.handleSelect} disable={edit} />
               <Form plainText={!edit}>
                  <Panel>
                     {/* Toolbar */}
                     <Panel horizontal>
                        <Panel horizontal left>
                           <Button label="Edit" disable={!canEdit} onClick={this.toggleEdit} />
                           <Button label="Update" id="Submit" submit if={edit} onClick={this.toggleEdit} />
                           <Button label="Cancel" cancel secondary if={edit} onClick={this.toggleEdit} />
                        </Panel>
                        <Panel horizontal right>
                           <Button label="New Customer" onClick={this.toggleDialog} disable={edit} />
                        </Panel>
                     </Panel>
                     {/* Edit forms */}
                     <Tab>
                        <TabItem label="Basic Info">
                           <BasicInfoForm />
                        </TabItem>
                        <TabItem label="Address">
                           <AddressForm />
                        </TabItem>
                     </Tab>
                  </Panel>
               </Form>
            </Frame>
            <NewCustomerDialog open={showDialog} onClose={this.toggleDialog} />
         </VMContext>
      );
   }
}

export default withTheme(CustomerInfoPage);
