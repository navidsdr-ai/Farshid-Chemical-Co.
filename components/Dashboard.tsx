
import React, { useMemo } from 'react';
import { QCRecord, QCStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';
import { Activity, CheckCircle, XCircle, AlertTriangle, FileText, Beaker } from 'lucide-react';

interface DashboardProps {
  records: QCRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  
  const stats = useMemo(() => {
    return {
      total: records.length,
      approved: records.filter(r => r.status === QCStatus.APPROVED).length,
      rejected: records.filter(r => r.status === QCStatus.REJECTED).length,
      conditional: records.filter(r => r.status === QCStatus.CONDITIONAL || r.status === QCStatus.PENDING).length
    };
  }, [records]);

  // Chart 1: Density Trend (Relevant for almost all chemicals mentioned)
  const densityData = useMemo(() => {
    return records
      .filter(r => r.parameters.some(p => p.name.includes('Density')))
      .map(r => {
        const densityParam = r.parameters.find(p => p.name.includes('Density'));
        const val = typeof densityParam?.value === 'number' ? densityParam.value : parseFloat(densityParam?.value as string || '0');
        
        return {
          batch: r.batchNumber.split('-').pop() || r.batchNumber, // Shorten batch no
          density: isNaN(val) ? 0 : val,
          name: r.productName
        }
      })
      .filter(d => d.density > 0)
      .slice(-10);
  }, [records]);

  // Chart 2: Purity/Percentage Trend (Looking for specific purity fields)
  const purityData = useMemo(() => {
        return records
          .filter(r => r.parameters.some(p => p.name.includes('Purity') || p.name.includes('GC') || p.unit === '%'))
          .map(r => {
             // Try to find the "main" purity parameter
             const purityParam = r.parameters.find(p => 
                p.name.includes('Purity') || 
                p.name === 'GC - Normal Hexane' || 
                p.name === 'GC - Cyclohexane' ||
                (p.unit === '%' && typeof p.value === 'number' && p.value > 90) // Assumption for high purity chemicals
             );

             let val = 0;
             if (purityParam) {
                val = typeof purityParam.value === 'number' ? purityParam.value : parseFloat(purityParam.value as string);
             }

             return {
                batch: r.batchNumber.split('-').pop() || r.batchNumber,
                purity: isNaN(val) ? 0 : val,
                paramName: purityParam?.name || 'Purity'
             };
          })
          .filter(d => d.purity > 0)
          .slice(-10);
      }, [records]);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">کل آزمایش‌ها</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Activity size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">تایید شده</p>
            <h3 className="text-3xl font-bold text-teal-600 mt-1">{stats.approved}</h3>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">مردود</p>
            <h3 className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</h3>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <XCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">مشروط / در انتظار</p>
            <h3 className="text-3xl font-bold text-amber-500 mt-1">{stats.conditional}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Density Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Beaker size={20} className="text-teal-500"/>
            روند تغییرات دانسیته (Density)
          </h3>
          <div className="h-64 ltr" dir="ltr"> 
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={densityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="batch" tick={{fontSize: 12}} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="density" fill="#0d9488" radius={[4, 4, 0, 0]} name="Density (g/cm3)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Purity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Activity size={20} className="text-indigo-500"/>
            روند خلوص محصولات (Purity %)
          </h3>
          <div className="h-64 ltr" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={purityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="batch" tick={{fontSize: 12}} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis domain={['dataMin - 1', 100]} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="purity" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} name="Purity %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="bg-blue-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-900/20">
          <div>
              <h2 className="text-2xl font-bold mb-2">اتوماسیون آزمایشگاه شیمیایی فرشید</h2>
              <p className="text-blue-200 text-sm leading-relaxed max-w-2xl">
                  پشتیبانی کامل از تست‌های ASTM D86، GC، دانسیته و جذب (UV). گزارشات خود را دقیق وارد کنید تا نمودارهای روند کیفی به‌روزرسانی شوند.
              </p>
          </div>
          <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
             <FileText size={48} className="text-blue-200" />
          </div>
      </div>
    </div>
  );
};
