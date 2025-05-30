import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
}

export default function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className='border rounded-md'>
      <table className='min-w-full table-auto border-collapse'>
        <thead className='bg-gray-100'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className='p-2 border'>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className='hover:bg-gray-50'>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='p-2 border'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
