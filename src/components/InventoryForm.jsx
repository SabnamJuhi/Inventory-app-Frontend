import { useState, useEffect } from "react";

export default function InventoryForm({ onSubmit, oldData }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  useEffect(() => {
    if (oldData) {
      setItemName(oldData.item_name);
      setQuantity(oldData.quantity);
      setUnitPrice(oldData.price_per_unit);
    }
  }, [oldData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const total_price = quantity * unitPrice;

    onSubmit({
      item_name: itemName,
      quantity,
      price_per_unit: unitPrice,
      total_price,
    });

    setItemName("");
    setQuantity("");
    setUnitPrice("");
  };

  return (
    <form className="p-4 bg-white shadow rounded" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Add Inventory Item</h2>

      <input
        className="w-full border p-2 mb-2 rounded"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />

      <input
        type="number"
        className="w-full border p-2 mb-2 rounded"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />

      <input
        type="number"
        className="w-full border p-2 mb-2 rounded"
        placeholder="Per Unit Price"
        value={unitPrice}
        onChange={(e) => setUnitPrice(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded mt-3"
      >
        {oldData ? "Update Item" : "Add Item"}
      </button>
    </form>
  );
}
