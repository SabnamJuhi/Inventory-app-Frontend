import React from "react";

export default function InvoiceTable({ items, onRowChange, onRemove }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle">
        <thead className="table-secondary">
          <tr>
            <th style={{width: "40%"}}>Item Name</th>
            <th style={{width: "12%"}}>Quantity</th>
            <th style={{width: "18%"}}>Per Unit Price</th>
            <th style={{width: "18%"}}>Total Price</th>
            <th style={{width: "12%"}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={idx}>
              <td>
                <input className="form-control" value={it.item_name || ""} onChange={(e) => onRowChange(idx, { item_name: e.target.value })} />
              </td>
              <td>
                <input type="number" className="form-control" value={it.quantity} onChange={(e) => onRowChange(idx, { quantity: Number(e.target.value) })} />
              </td>
              <td>
                <input type="number" className="form-control" value={it.per_unit_price} onChange={(e) => onRowChange(idx, { per_unit_price: Number(e.target.value) })} />
              </td>
              <td className="text-end pe-3">{(Number(it.total_price) || 0).toFixed(2)}</td>
              <td className="text-center">
                <button className="btn btn-sm btn-danger" onClick={() => onRemove(idx, it.id)}>Delete</button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}