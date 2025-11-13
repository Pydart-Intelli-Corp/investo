'use client';

import { DashboardPlans } from '@/components';

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-0">
        <DashboardPlans showHeader={false} />
      </div>
    </div>
  );
}