
import React, { useState, useMemo } from 'react';
import { QCRecord, QCStatus, CATEGORY_LABELS, RecordCategory, REPORT_PURPOSE_LABELS, ReportPurpose } from '../types';
import { Search, Filter, Eye, Sparkles, ChevronDown, ChevronUp, FileText, Tag, Printer, Truck, User, Building2, Briefcase } from 'lucide-react';
import { analyzeQCRecord } from '../services/geminiService';
import { FarshidLogo } from './Logo';

interface ReportListProps {
  records: QCRecord[];
}

export const ReportList: React.FC<ReportListProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPurpose, setFilterPurpose] = useState<string>('ALL');
  const [filterCustomer, setFilterCustomer] = useState<string>('ALL');
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<Record<string, string>>({});

  // Extract unique customer names
  const uniqueCustomers = useMemo(() => {
    return Array.from(new Set(records.map(r => r.customerName).filter(Boolean))) as string[];
  }, [records]);

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.customerName && r.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || r.category === filterCategory;
    const matchesPurpose = filterPurpose === 'ALL' || (r.reportPurpose || ReportPurpose.STANDARD) === filterPurpose;
    const matchesCustomer = filterCustomer === 'ALL' || r.customerName === filterCustomer;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPurpose && matchesCustomer;
  });

  const getStatusColor = (status: QCStatus) => {
    switch(status) {
      case QCStatus.APPROVED: return 'bg-teal-100 text-teal-700 border-teal-200';
      case QCStatus.REJECTED: return 'bg-red-100 text-red-700 border-red-200';
      case QCStatus.CONDITIONAL: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (status: QCStatus) => {
     switch(status) {
      case QCStatus.APPROVED: return 'تایید شده';
      case QCStatus.REJECTED: return 'مردود';
      case QCStatus.CONDITIONAL: return 'مشروط';
      default: return 'در انتظار';
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAIAnalysis = async (e: React.MouseEvent, record: QCRecord) => {
    e.stopPropagation();
    if (aiAnalysisResult[record.id]) return; // Already analyzed

    setAnalyzingId(record.id);
    const result = await analyzeQCRecord(record);
    setAiAnalysisResult(prev => ({ ...prev, [record.id]: result }));
    setAnalyzingId(null);
    setExpandedId(record.id); // Auto expand to show result
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="relative w-full xl:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="جستجو..."
            className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 w-full xl:w-auto flex-1">
           {/* Report Purpose Filter */}
           <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-slate-500 hidden lg:block shrink-0" />
            <select 
              className="px-2 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-teal-500 outline-none cursor-pointer w-full text-sm"
              value={filterPurpose}
              onChange={(e) => setFilterPurpose(e.target.value)}
            >
              <option value="ALL">همه انواع گزارش</option>
              {Object.entries(REPORT_PURPOSE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Customer Filter */}
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-slate-500 hidden lg:block shrink-0" />
            <select 
              className="px-2 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-teal-500 outline-none cursor-pointer w-full text-sm"
              value={filterCustomer}
              onChange={(e) => setFilterCustomer(e.target.value)}
            >
              <option value="ALL">همه مشتریان</option>
              {uniqueCustomers.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Tag size={18} className="text-slate-500 hidden lg:block shrink-0" />
            <select 
              className="px-2 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-teal-500 outline-none cursor-pointer w-full text-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="ALL">همه دسته‌ها</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-500 hidden lg:block shrink-0" />
            <select 
              className="px-2 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-teal-500 outline-none cursor-pointer w-full text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">همه وضعیت‌ها</option>
              <option value={QCStatus.APPROVED}>تایید شده</option>
              <option value={QCStatus.REJECTED}>مردود</option>
              <option value={QCStatus.CONDITIONAL}>مشروط</option>
              <option value={QCStatus.PENDING}>در انتظار</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
            <p className="text-slate-400">هیچ گزارشی یافت نشد.</p>
          </div>
        ) : (
          filteredRecords.map(record => (
            <div key={record.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
              <div 
                className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => toggleExpand(record.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(record.status).replace('text-', 'bg-opacity-20 ')}`}>
                     <FileText size={20} className={getStatusColor(record.status).split(' ')[1]} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{record.productName}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                        {CATEGORY_LABELS[record.category]}
                      </span>
                      {record.reportPurpose && record.reportPurpose !== ReportPurpose.STANDARD && (
                         <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                             <Briefcase size={10} />
                             {REPORT_PURPOSE_LABELS[record.reportPurpose]}
                         </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-slate-500 font-mono">{record.batchNumber} | {new Date(record.date).toLocaleDateString('fa-IR')}</p>
                        {record.customerName && (
                            <span className="text-xs text-slate-600 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1">
                                <User size={10} /> {record.customerName}
                            </span>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                   <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                    {getStatusText(record.status)}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => handleAIAnalysis(e, record)}
                        disabled={analyzingId === record.id}
                        className={`
                            px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors
                            ${aiAnalysisResult[record.id] 
                                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-600 border border-transparent hover:border-purple-200'
                            }
                        `}
                    >
                        <Sparkles size={14} className={analyzingId === record.id ? "animate-spin" : ""} />
                        {analyzingId === record.id ? 'در حال تحلیل...' : (aiAnalysisResult[record.id] ? 'تحلیل شد' : 'تحلیل هوشمند')}
                    </button>
                    
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                        {expandedId === record.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details - Formal Report View */}
              {expandedId === record.id && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-4xl mx-auto print-area">
                        
                        {/* Report Letterhead */}
                        <div className="flex flex-col md:flex-row items-center justify-between border-b-2 border-slate-800 pb-6 mb-8 gap-6">
                            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
                                 <div className="w-20 h-20 shrink-0">
                                     <FarshidLogo className="w-full h-full text-slate-800" />
                                 </div>
                                 <div className="text-center md:text-right">
                                    <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">شیمیایی فرشید شهرضا</h2>
                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Farshid Shahreza Chemical Co.</p>
                                    <p className="text-xs text-slate-400 font-medium mt-1">واحد کنترل کیفیت - Quality Control Dept.</p>
                                 </div>
                            </div>
                            
                            <div className="text-center md:text-left text-xs text-slate-500 space-y-1.5 font-mono bg-slate-50 p-3 rounded-lg border border-slate-100 w-full md:w-auto">
                                <p className="flex justify-between md:justify-start gap-4"><span>شماره گزارش:</span> <span className="font-bold text-slate-700">{record.id}</span></p>
                                <p className="flex justify-between md:justify-start gap-4"><span>شماره بچ:</span> <span className="font-bold text-slate-700">{record.batchNumber}</span></p>
                                <p className="flex justify-between md:justify-start gap-4"><span>تاریخ:</span> <span className="font-bold text-slate-700">{new Date(record.date).toLocaleDateString('fa-IR')}</span></p>
                                {record.reportPurpose && (
                                     <p className="flex justify-between md:justify-start gap-4 border-t border-slate-200 pt-1 mt-1">
                                         <span>نوع:</span> 
                                         <span className="font-bold text-blue-700">{REPORT_PURPOSE_LABELS[record.reportPurpose]}</span>
                                     </p>
                                )}
                            </div>
                        </div>

                        {/* Customer & Logistics Info (If available) */}
                        {(record.customerName || record.truckNumber || record.driverName) && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {record.customerName && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">نام مشتری / گیرنده</p>
                                        <p className="font-bold text-slate-800 flex items-center gap-2">
                                            <Building2 size={16} className="text-slate-400" />
                                            {record.customerName}
                                        </p>
                                    </div>
                                )}
                                {record.driverName && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">نام راننده</p>
                                        <p className="font-bold text-slate-800 flex items-center gap-2">
                                            <User size={16} className="text-slate-400" />
                                            {record.driverName}
                                        </p>
                                    </div>
                                )}
                                {record.truckNumber && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">شماره پلاک</p>
                                        <p className="font-bold text-slate-800 flex items-center gap-2">
                                            <Truck size={16} className="text-slate-400" />
                                            {record.truckNumber}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Report Body */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Parameters Table */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
                                    نتایج آنالیز
                                </h3>
                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-right">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3">پارامتر</th>
                                                <th className="px-4 py-3 text-center">روش تست</th>
                                                <th className="px-4 py-3 text-center">مقدار</th>
                                                <th className="px-4 py-3 text-center">واحد</th>
                                                <th className="px-4 py-3 text-center">استاندارد</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {record.parameters.map((p, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-2.5 font-medium text-slate-700">{p.name}</td>
                                                    <td className="px-4 py-2.5 text-slate-500 text-xs text-center" dir="ltr">{p.method || '-'}</td>
                                                    <td className="px-4 py-2.5 text-slate-900 font-bold text-center" dir="ltr">{p.value}</td>
                                                    <td className="px-4 py-2.5 text-slate-500 text-center">{p.unit}</td>
                                                    <td className="px-4 py-2.5 text-slate-400 text-xs text-center" dir="ltr">{p.min || '-'} / {p.max || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Info & Analysis */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                                        مشخصات و توضیحات
                                    </h3>
                                    
                                    <div className="bg-slate-50 rounded-xl p-5 space-y-4 border border-slate-100">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">نام محصول</p>
                                                <p className="font-bold text-slate-800">{record.productName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">نام تکنسین</p>
                                                <p className="font-bold text-slate-800">{record.technician}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">دسته‌بندی</p>
                                                <p className="font-bold text-slate-800">{CATEGORY_LABELS[record.category]}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">وضعیت نهایی</p>
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(record.status)}`}>
                                                    {getStatusText(record.status)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {record.notes && (
                                            <div className="pt-4 border-t border-slate-200">
                                                <p className="text-xs text-slate-500 mb-1">یادداشت تکنسین:</p>
                                                <p className="text-sm text-slate-700 leading-relaxed italic">"{record.notes}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {aiAnalysisResult[record.id] && (
                                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 animate-fade-in relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-400"></div>
                                        <h4 className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-2">
                                            <Sparkles size={16} />
                                            تحلیل هوشمند (AI Analysis)
                                        </h4>
                                        <p className="text-sm text-purple-900 leading-relaxed whitespace-pre-wrap text-justify">
                                            {aiAnalysisResult[record.id]}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Signature Area */}
                        <div className="mt-12 pt-8 border-t-2 border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="h-16 mb-2 border-b border-dashed border-slate-300"></div>
                                <p className="text-xs text-slate-500">امضاء تکنسین آزمایشگاه</p>
                            </div>
                            <div className="text-center">
                                <div className="h-16 mb-2 border-b border-dashed border-slate-300"></div>
                                <p className="text-xs text-slate-500">امضاء مدیر کنترل کیفیت</p>
                            </div>
                            {/* Only show "Receiver Signature" if it is a delivery or customer report */}
                            {(record.reportPurpose === ReportPurpose.DELIVERY || record.reportPurpose === ReportPurpose.CUSTOMER_SAMPLE) && (
                                <div className="text-center">
                                    <div className="h-16 mb-2 border-b border-dashed border-slate-300"></div>
                                    <p className="text-xs text-slate-500">امضاء تحویل گیرنده / راننده</p>
                                </div>
                            )}
                            
                            <div className="text-center hidden md:block no-print">
                                <div className="h-16 mb-2 flex items-end justify-center pb-2">
                                     <button 
                                        onClick={() => window.print()}
                                        className="text-teal-600 flex items-center gap-1 text-sm font-bold hover:bg-teal-50 px-3 py-1 rounded-lg transition-colors"
                                     >
                                        <Printer size={16} /> چاپ گزارش
                                     </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
