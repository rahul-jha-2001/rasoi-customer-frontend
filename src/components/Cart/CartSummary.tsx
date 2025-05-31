// src/components/Cart/CartSummary.tsx

export default function CartSummary({ cart }) {
    return (
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">Summary</h3>
        <div className="space-y-1 text-sm">
          <p>Subtotal: ₹{cart.sub_total.toFixed(2)}</p>
          <p>Discount: ₹{cart.total_discount.toFixed(2)}</p>
          <p>Tax: ₹{cart.total_tax.toFixed(2)}</p>
          <p>Packaging: ₹{cart.packaging_cost.toFixed(2)}</p>
          <hr />
          <p className="font-semibold">Total: ₹{cart.final_amount.toFixed(2)}</p>
        </div>
      </div>
    );
  }
  