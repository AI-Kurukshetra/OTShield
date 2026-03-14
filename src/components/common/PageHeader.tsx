"use client";

import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
  titleExtra?: React.ReactNode;
}

export const PageHeader = ({ title, description, actions, titleExtra }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-100">{title}</h1>
          {titleExtra}
        </div>
        <p className="text-sm text-zinc-500 font-medium">{description}</p>
      </div>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </div>
  );
};
