"use client";

import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { CyberCard } from '../UI';

const ACTIVITY_DATA = [
  { time: '00:00', value: 120 },
  { time: '04:00', value: 80 },
  { time: '08:00', value: 450 },
  { time: '12:00', value: 620 },
  { time: '16:00', value: 580 },
  { time: '20:00', value: 320 },
  { time: '23:59', value: 150 },
];

export const NetworkActivityChart = () => {
  return (
    <CyberCard title="Network Activity" subtitle="Events per hour (last 24h)" className="lg:col-span-2">
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ACTIVITY_DATA}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#52525b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
              itemStyle={{ color: '#f4f4f5' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00f0ff"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CyberCard>
  );
};
