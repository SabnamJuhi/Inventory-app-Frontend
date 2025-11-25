import React, { useEffect, useState } from "react";
import { getCoupon } from "../api/couponService";
import {
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  deleteInvoiceItem
} from "../api/invoiceService";

import InvoiceTable from "../components/InvoiceTable";

export default function InvoicePage() {

  const [invoice, setInvoice] = useState({
    coupon_code: "",
    discount_percent: 0,
    items: [{ item_name: "", quantity: 1, per_unit_price: 0, total_price: 0 }]
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const addRow = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { item_name: "", quantity: 1, per_unit_price: 0, total_price: 0 }]
    }));
  };

  const updateRow = (index, changes) => {
    setInvoice(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...changes };

      // recalc
      const qty = +items[index].quantity || 0;
      const price = +items[index].per_unit_price || 0;
      items[index].total_price = +(qty * price).toFixed(2);

      return { ...prev, items };
    });
  };

  const removeRow = (index) => {
    setInvoice(prev => {
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: items.length ? items : [{ item_name: "", quantity: 1, per_unit_price: 0 }] };
    });
  };

  const fetchCouponApi = async (code) => {
    if (!code) return setInvoice(prev => ({ ...prev, discount_percent: 0 }));

    try {
      const res = await getCoupon(code);
      setInvoice(prev => ({ ...prev, discount_percent: res.data.discount_percent || 0 }));
    } catch {
      setInvoice(prev => ({ ...prev, discount_percent: 0 }));
    }
  };

  const computeTotals = () => {
    const total = invoice.items.reduce((sum, it) => sum + (Number(it.total_price) || 0), 0);
    const discount = Number(invoice.discount_percent) || 0;

    const discountAmount = +(total * (discount / 100)).toFixed(2);
    const payable = +(total - discountAmount).toFixed(2);

    return { total, discountAmount, payable };
  };

  const saveInvoiceApi = async () => {
    try {
      setLoading(true);
      const payload = {
        coupon_code: invoice.coupon_code || null,
        items: invoice.items.map(it => ({
          item_name: it.item_name,
          quantity: it.quantity,
          per_unit_price: it.per_unit_price
        }))
      };
      const res = await createInvoice(payload);
      setInvoice(res.data);
      setEditingId(res.data.id);
      alert("Invoice created");
    } catch (err) {
      alert("Error creating invoice");
    } finally {
      setLoading(false);
    }
  };

  const loadInvoiceApi = async (id) => {
    try {
      setLoading(true);
      const res = await getInvoice(id);
      setInvoice(res.data);
      setEditingId(res.data.id);
    } catch (err) {
      alert("Unable to load invoice");
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceApi = async () => {
    try {
      setLoading(true);
      const payload = {
        coupon_code: invoice.coupon_code,
        items: invoice.items
      };
      const res = await updateInvoice(editingId, payload);
      setInvoice(res.data);
      alert("Invoice updated");
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoiceApi = async () => {
    try {
      setLoading(true);
      await deleteInvoice(editingId);

      setInvoice({
        coupon_code: "",
        discount_percent: 0,
        items: [{ item_name: "", quantity: 1, per_unit_price: 0, total_price: 0 }]
      });

      setEditingId(null);
      alert("Invoice deleted");
    } catch {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteItemApi = async (itemId, index) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await deleteInvoiceItem(itemId);
      removeRow(index);
      alert("Item deleted");
    } catch {
      alert("Item delete failed");
    }
  };

  const { total, discountAmount, payable } = computeTotals();

  return (
    <div className="card shadow-sm">
      <div className="card-body">

        <h3 className="card-title mb-3">Create / Edit Invoice</h3>

        {/* Coupon + ID Load */}
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <label>Load Invoice</label>
            <div className="input-group">
              <input id="loadId" type="number" className="form-control" />
              <button onClick={() => loadInvoiceApi(document.getElementById("loadId").value)} className="btn btn-secondary">
                Load
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <label>Coupon Code</label>
            <input
              className="form-control"
              value={invoice.coupon_code}
              onChange={(e) => setInvoice(prev => ({ ...prev, coupon_code: e.target.value }))}
              onBlur={(e) => fetchCouponApi(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label>Discount %</label>
            <input readOnly className="form-control" value={invoice.discount_percent} />
          </div>
        </div>

        {/* Items Table */}
        <InvoiceTable
          items={invoice.items}
          onRowChange={updateRow}
          onRemove={(index, id) => id ? deleteItemApi(id, index) : removeRow(index)}
        />

        {/* Buttons */}
        <div className="mt-10 d-flex gap-10">
          <button onClick={addRow} className="btn btn-outline-primary">Add Row</button>

          {!editingId ? (
            <button className="btn btn-primary" onClick={saveInvoiceApi}>
              Save Invoice
            </button>
          ) : (
            <>
              <button className="btn btn-success" onClick={updateInvoiceApi}>Update</button>
              <button className="btn btn-danger" onClick={deleteInvoiceApi}>Delete</button>
            </>
          )}
        </div>

        {/* Totals */}
        <div className="mt-4 p-3 bg-light rounded">
          <div className="d-flex justify-content-between"><span>Total:</span><span>{total}</span></div>
          <div className="d-flex justify-content-between"><span>Discount:</span><span>-{discountAmount}</span></div>
          <div className="fw-bold fs-5 d-flex justify-content-between"><span>Payable:</span><span>{payable}</span></div>
        </div>

      </div>
    </div>
  );
}


