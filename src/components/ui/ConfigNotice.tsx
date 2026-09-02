'use client';

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfigNoticeProps {
  enabled: boolean;
}

/**
 * Shown when the app is running with placeholder/missing Supabase credentials.
 * Empty at the top of the page this way the dashboard still renders instead of
 * hanging on unreachable database calls.
 */
export const ConfigNotice: React.FC<ConfigNoticeProps> = ({ enabled }) => {
  const [dismissed, setDismissed] = useState(false);

  if (enabled || dismissed) return null;

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800 leading-snug">
          <span className="font-bold">Database not configured.</span> Set your real Supabase credentials in{' '}
          <code className="px-1 py-0.5 bg-white rounded border border-amber-200 font-mono text-[11px]">
            .env.local
          </code>{' '}
          (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY), run the migrations,
          then restart the dev server. Your profile form and audits will only work once this is done.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="ml-auto text-amber-500 hover:text-amber-800 p-1 rounded hover:bg-amber-100 transition cursor-pointer"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};