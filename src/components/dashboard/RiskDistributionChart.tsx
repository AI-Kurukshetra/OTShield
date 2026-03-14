'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CyberCard } from '../UI';

const RISK_DATA = [
  { name: 'Low', value: 45, color: '#00ff94' },
  { name: 'Medium', value: 25, color: '#ffb800' },
  { name: 'High', value: 15, color: '#ff7a00' },
  { name: 'Critical', value: 5, color: '#ff0055' },
];

export const RiskDistributionChart = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <CyberCard
      title="Risk Distribution"
      subtitle="Asset vulnerability levels"
      className="lg:col-span-1"
    >
      <div className="mt-4 h-[300px] min-w-0 w-full">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
            <PieChart>
              <Pie
                data={RISK_DATA}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {RISK_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                }}
                itemStyle={{ color: '#f4f4f5' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse rounded-2xl border border-brand-border/30 bg-white/[0.03]" />
        )}
        <div className="flex justify-center gap-6 mt-4">
          {RISK_DATA.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CyberCard>
  );
};
