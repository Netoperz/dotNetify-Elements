import React from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';
import { ContextTypes } from '../VMContext';
import * as utils from '../utils';

const Container = styled.div`
   display: flex;
   flex: 1;
   width: 100%;
   ${props => props.theme.DataGrid.Container}
`;

export class DataGrid extends React.Component {

   static contextTypes = ContextTypes;

   static componentTypes = {
      Container,
      DataGridComponent: undefined
   }

   constructor(props) {
      super(props);
      this.state = { height: 400, selectedKeys: [] };
      this.attrs = {};
   }

   get vmProperty() {
      return utils.getVMProperty(this);
   }

   get canSelect() {
      return ["Single", "Multiple"].includes(this.attrs.selectMode);
   }

   get isMultiselect() {
      return this.attrs.selectMode === "Multiple";
   }

   componentWillUnmount() {
      window.removeEventListener("resize", this.updateHeight);
   }

   componentDidMount() {
      this.updateHeight();
      window.addEventListener("resize", this.updateHeight);
   }

   componentDidUpdate() {
      this.updateHeight();
   }

   mapColumns(children, columns) {
      return columns.map(col => {
         col = utils.toCamelCase(col);
         col.width = utils.toPixel(col.width);

         const [gridColumns, rest] = utils.filterChildren(children, child => child.type == GridColumn && child.props.id === col.key);
         const gridCol = gridColumns.shift();
         if (gridCol) {
            const { width, formatter, columnChildren } = gridCol.props;
            col.width = utils.toPixel(width || col.width);
            col.formatter = formatter || (columnChildren ? React.Children.only(columnChildren) : null);
         }

         return col;
      })
   }

   configureSelectBy = _ => {
      return this.attrs.rowKey ? { keys: { rowKey: this.attrs.rowKey, values: this.state.selectedKeys } } : { indexes: this.state.selectedKeys };
   }

   updateHeight = _ => {
      if (this.elem && this.state.height != this.elem.offsetHeight)
         this.setState({ height: this.elem.offsetHeight });
   }

   handleRowClick = (idx, row) => {
      if (!row || !this.canSelect)
         return;

      const selectedKey = this.attrs.rowKey ? row[this.attrs.rowKey] : idx;
      if (!this.state.selectedKeys.includes(selectedKey)) {
         const selectedKeys = this.isMultiselect ? [selectedKey, ...this.state.selectedKeys] : [selectedKey];
         this.vmProperty.dispatch(this.isMultiselect ? selectedKeys : selectedKey, this.attrs.selectedKeyProperty);
         this.setState({ selectedKeys: selectedKeys });
      }
   }

   handleRowsSelected = rows => {
      rows.map(row => this.handleRowClick(row.rowIdx, row.row))
   }

   handleRowsDeselected = rows => {
      const deselectedKeys = rows.map(row => this.attrs.rowKey ? row.row[this.attrs.rowKey] : row.rowIdx);
      const selectedKeys = this.state.selectedKeys.filter(key => !deselectedKeys.includes(key));
      this.vmProperty.dispatch(this.isMultiselect ? selectedKeys : selectedKeys.shift(), this.attrs.selectedKeyProperty);
      this.setState({ selectedKeys: selectedKeys });
   }

   render() {
      const [Container, _DataGrid] = utils.resolveComponents(DataGrid, this.props);
      const { children, ...props } = this.props;
      const { id, value, attrs } = this.vmProperty.props;
      const rowGetter = idx => value[idx];

      const { rowKey, columns, selectedKeyProperty, canSelect } = attrs;
      this.attrs = attrs;

      return (
         <Container innerRef={elem => this.elem = elem}>
            <_DataGrid id={id}
               columns={this.mapColumns(children, columns)}
               rowGetter={rowGetter}
               rowsCount={value.length}
               minHeight={this.state.height}
               onRowClick={this.handleRowClick}
               rowSelection={{
                  showCheckbox: this.isMultiselect,
                  onRowsSelected: this.handleRowsSelected,
                  onRowsDeselected: this.handleRowsDeselected,
                  selectBy: this.configureSelectBy()
               }}
               {...props}
            />
         </Container>
      );
   }
}

export class GridColumn extends React.Component {

   static propTypes = {
      id: PropTypes.string.isRequired,
      width: PropTypes.string,
      formatter: PropTypes.func,
      children: PropTypes.node
   }
   render() {
      return this.props.children;
   }
}