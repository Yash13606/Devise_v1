import React from "react";
import { Activity, AlertTriangle, EyeOff, CheckCircle } from "lucide-react";
import { useStats } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export function BoardExposureSummary() {
  const { data: stats, isLoading, isError } = useStats();

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden w-full mb-6">
      <div className="bg-gray-50/80 border-b border-gray-100 p-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h3 className="font-bold text-brand-dark text-lg flex items-center gap-2">
          <Activity className="text-brand-orange" size={20} />
          AI Exposure Summary — Real-Time Board Report
        </h3>
        <div className="text-xs font-bold text-brand-gray uppercase tracking-widest bg-white border border-gray-200 px-3 py-1.5 rounded-full w-fit">
          Executive View
        </div>
      </div>
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* AI Tools In Use */}
          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center shadow-soft">
            {isLoading ? (
              <Skeleton className="h-10 w-24 mb-2 rounded-lg" />
            ) : isError ? (
              <div className="text-2xl font-bold text-red-500 mb-1">Error</div>
            ) : (
              <div className="text-5xl font-extrabold text-brand-dark mb-1 tracking-tight">
                {stats?.uniqueTools || 0}
              </div>
            )}
            <div className="text-sm font-bold text-brand-gray uppercase tracking-widest mt-1">AI tools in use</div>
          </div>

          {/* Without Audit Trail */}
          <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 flex flex-col justify-center shadow-soft relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <EyeOff size={100} />
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-24 mb-2 rounded-lg" />
            ) : isError ? (
              <div className="text-2xl font-bold text-red-500 mb-1">Error</div>
            ) : (
              <div className="text-5xl font-extrabold text-red-600 mb-1 flex items-center gap-3 tracking-tight relative z-10">
                {stats?.unapprovedCount || 0}
                <EyeOff size={28} className="text-red-400" />
              </div>
            )}
            <div className="text-sm font-bold text-red-700/80 uppercase tracking-widest mt-1 relative z-10">Without audit trail</div>
          </div>

          {/* Regulatory Flags */}
          <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100 flex flex-col justify-center shadow-soft relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <AlertTriangle size={100} />
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-24 mb-2 rounded-lg" />
            ) : isError ? (
              <div className="text-2xl font-bold text-red-500 mb-1">Error</div>
            ) : (
              <div className="text-5xl font-extrabold text-brand-orange mb-1 flex items-center gap-3 tracking-tight relative z-10">
                {stats?.highRiskCount || 0}
                <AlertTriangle size={28} className="text-orange-400" />
              </div>
            )}
            <div className="text-sm font-bold text-orange-700/80 uppercase tracking-widest mt-1 relative z-10">Regulatory flags</div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-brand-dark bg-green-50 border border-green-100 w-fit px-5 py-2.5 rounded-xl mx-auto shadow-sm">
          <CheckCircle size={18} className="text-green-500" />
          Generated automatically. Updated in real time. Audit-ready.
        </div>
      </div>
    </div>
  );
}
