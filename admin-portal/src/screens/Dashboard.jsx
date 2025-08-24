export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Revenue" value="$12,430" delta="↑ 8%"/>
        <Card title="Orders" value="1,245" delta="↑ 3%"/>
        <Card title="Customers" value="8,902" delta="↑ 5%"/>
        <Card title="Refunds" value="12" delta="↓ 1%"/>
      </div>
    </div>
  )
}

function Card({ title, value, delta }) {
  return (
    <div className="card p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-2xl font-semibold">{value}</div>
        <div className="badge">{delta}</div>
      </div>
    </div>
  )
}
