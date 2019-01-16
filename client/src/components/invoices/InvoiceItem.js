import React from 'react';
import Autocomplete from 'react-autocomplete';

export default function InvoiceItem({
  invoiceItem,
  index,
  onAddNewItem,
  lastItem,
  products,
  onBarcodeInput,
  onAutocompleteSelect,
  onInvoiceItemChange,
  onRemoveItem,
  onBarcodeBlur
}) {
  return (
    <tr>
      <th scope="row">{index + 1}</th>
      <td>
        <Autocomplete
          inputProps={{
            pattern: '[0-9]*',
            'data-index': index,
            onBlur: e => {
              onBarcodeBlur(e);
            }
          }}
          value={invoiceItem.barcode}
          getItemValue={item => item.barcode.toString()}
          shouldItemRender={(item, value) => {
            return (
              item.barcode
                .toString()
                .toLowerCase()
                .indexOf(value.toString().toLowerCase()) > -1
            );
          }}
          items={products}
          renderItem={(item, isHighlighted) => {
            item.index = index;
            return (
              <div
                key={item.productID}
                style={{
                  background: isHighlighted ? 'lightgray' : 'white'
                }}
              >
                {item.barcode}
              </div>
            );
          }}
          onChange={onBarcodeInput}
          onSelect={onAutocompleteSelect}
        />
      </td>
      <td>{invoiceItem.name}</td>
      <td style={{ width: '20%' }}>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Units:</span>
          </div>
          <input
            type="text"
            className="form-control"
            pattern="[0-9]*"
            aria-label="Units"
            name={`quantity.${index}`}
            value={invoiceItem.quantity}
            onChange={onInvoiceItemChange}
          />
        </div>
      </td>
      <td style={{ width: '20%' }}>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">€</span>
          </div>
          <input
            type="text"
            className="form-control"
            aria-label="Price Per Unit"
            name={`pricePerUnit.${index}`}
            pattern="[0-9.]*"
            value={invoiceItem.pricePerUnit}
            onChange={onInvoiceItemChange}
          />{' '}
          {lastItem && (
            <button
              onClick={onAddNewItem}
              className="float-right"
              style={{ borderWidth: 0, padding: 0, background: 'none' }}
            >
              <i className="fas fa-2x fa-plus-square" />
            </button>
          )}
          {!lastItem && (
            <button
              onClick={onRemoveItem}
              className="float-right"
              style={{ borderWidth: 0, padding: 0, background: 'none' }}
              data-index={index}
            >
              <i className="fas fa-2x fa-trash-alt" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
