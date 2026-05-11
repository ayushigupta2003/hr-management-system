export function DataTable({ columns, rows, getRowId }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-card">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead>
          <tr className="bg-slate-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.length === 0 ? (
            <tr>
              <td
                className="px-5 py-12 text-center text-sm text-slate-400"
                colSpan={columns.length}
              >
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowId(row)}
                className="transition-colors hover:bg-slate-50/70"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-slate-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
