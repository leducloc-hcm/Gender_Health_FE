import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState
} from '@tanstack/react-table'
import React from 'react'

import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { Filter, Search, FileText } from 'lucide-react'

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
}

export default function ResultDataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility
  })

  return (
    <div className='space-y-6'>
      {/* Search and Filters */}
      <div className='flex items-center justify-between space-x-4'>
        <div className='relative bg-white flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            placeholder='Search by test name, customer, or ID...'
            value={(table.getColumn('customerInfo')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('customerInfo')?.setFilterValue(event.target.value)}
            className='pl-10 border-gray-300'
          />
        </div>

        <Badge variant='outline' className='flex items-center space-x-1 py-1 bg-white'>
          <Filter className='h-3 w-3' />
          <span>{table.getFilteredRowModel().rows.length} results</span>
        </Badge>
      </div>

      <div className=' rounded-lg min-h-[690px]'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='bg-gray-50'>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='font-semibold text-gray-700'>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className='hover:bg-gray-50 transition-colors'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-32 text-center'>
                  <div className='flex flex-col items-center justify-center space-y-2'>
                    <FileText className='h-8 w-8 text-gray-400' />
                    <p className='text-gray-500'>No report ready tests found</p>
                    <p className='text-sm text-gray-400'>Tests will appear here when reports are ready</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-end'>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className='hover:bg-gray-50'
          >
            Previous
          </Button>

          <div className='flex items-center space-x-1'>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <Button
                key={i}
                variant={table.getState().pagination.pageIndex === i ? 'default' : 'outline'}
                size='sm'
                onClick={() => table.setPageIndex(i)}
                className='w-8 h-8 p-0'
              >
                {i + 1}
              </Button>
            )).slice(
              Math.max(0, table.getState().pagination.pageIndex - 2),
              Math.min(table.getPageCount(), table.getState().pagination.pageIndex + 3)
            )}
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className='hover:bg-gray-50'
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
