export default function Products(){
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <div className="flex gap-2">
          <button className="btn btn-outline text-xs">Import CSV</button>
          <button className="btn btn-gradient text-xs">Add Product</button>
        </div>
      </header>
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3">
        <div className="text-sm text-neutral-500">Table: name, SKU, price, stock, status, actions (edit, archive).</div>
      </div>
    </div>
  );
}
