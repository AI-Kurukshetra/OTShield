"use client";

import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Plus, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';
import { Asset, MOCK_ASSETS } from '../types';
import { RiskBadge, ProtocolBadge, StatusIndicator, CyberCard } from './UI';
import { PageHeader } from './common/PageHeader';
import { SearchInput } from './common/SearchInput';
import { PrimaryButton } from './common/Button';
import { cn } from '@/src/lib/utils';
import { getSeverityStyles } from '@/src/lib/severity';

const columnHelper = createColumnHelper<Asset>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Device Name',
    cell: info => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-100 tracking-tight">{info.getValue()}</span>
        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">ID: {info.row.original.id.slice(0, 8)}</span>
      </div>
    ),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: info => (
      <div className="px-2.5 py-1 rounded-lg bg-zinc-800/50 border border-zinc-700/50 inline-block">
        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('protocol', {
    header: 'Protocol',
    cell: info => <ProtocolBadge protocol={info.getValue()} />,
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    cell: info => (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-zinc-400">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('riskScore', {
    header: 'Risk Profile',
    cell: info => {
      const score = info.getValue();
      let level: any = 'Low';
      if (score > 80) level = 'Critical';
      else if (score > 60) level = 'High';
      else if (score > 30) level = 'Medium';
      
      return (
        <div className="flex items-center gap-4 min-w-[140px]">
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full rounded-full", getSeverityStyles(level).bar)}
            />
          </div>
          <RiskBadge level={level} />
        </div>
      );
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <StatusIndicator status={info.getValue()} />,
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => (
      <button className="p-2 text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all">
        <MoreVertical className="w-4 h-4" />
      </button>
    ),
  }),
];

import { motion } from 'motion/react';

export const Assets = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data: MOCK_ASSETS,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-10">
      <PageHeader
        title="Asset Inventory"
        description="Manage and monitor all industrial control systems and devices."
        actions={
          <div className="flex items-center gap-4">
            <SearchInput
              placeholder="Search assets..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64"
            />
            <PrimaryButton icon={Plus}>Add Asset</PrimaryButton>
          </div>
        }
      />

      <CyberCard className="p-0 overflow-hidden border-brand-border/30">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-brand-border/50 bg-white/5">
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id} 
                      className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] cursor-pointer hover:text-zinc-300 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && (
                          header.column.getIsSorted() === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-5 border-t border-brand-border/30 flex items-center justify-between bg-white/[0.01]">
          <p className="text-xs text-zinc-500 font-medium">
            Showing <span className="text-zinc-300 font-bold">{table.getRowModel().rows.length}</span> of <span className="text-zinc-300 font-bold">{MOCK_ASSETS.length}</span> assets
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </CyberCard>
    </div>
  );
};
