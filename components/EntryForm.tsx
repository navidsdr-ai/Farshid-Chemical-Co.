
import React, { useState } from 'react';
import { QCRecord, QCStatus, QCParameter, RecordCategory, CATEGORY_LABELS, ReportPurpose, REPORT_PURPOSE_LABELS } from '../types';
import { Plus, Trash2, Save, Wand2, Truck, User, Building2 } from 'lucide-react';

interface EntryFormProps {
  onSave: (record: QCRecord) => void;
  onCancel: () => void;
}

// Define specific templates based on user request
const TEST_TEMPLATES = {
  'EMPTY': { label: 'خالی (دستی)', params: [] },
  'DISTILLATION': { 
    label: 'تقطیر اتمسفریک (ASTM D86)', 
    params: [
      { name: 'ASTM D86 - IBP', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 5%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 10%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 20%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 30%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 40%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 50%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 60%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 70%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 80%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 90%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - 95%', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'ASTM D86 - FBP', value: 0, unit: '°C', method: 'ASTM D86' },
      { name: 'Recovery', value: 0, unit: 'vol%', method: 'ASTM D86' },
      { name: 'Residue', value: 0, unit: 'vol%', method: 'ASTM D86' },
      { name: 'Loss', value: 0, unit: 'vol%', method: 'ASTM D86' },
    ]
  },
  'GC_ANALYSIS': {
    label: 'آنالیز GC (هگزان/بنزن)',
    params: [
      { name: 'GC - Normal Hexane', value: 0, unit: '%', method: 'ASTM D611 / GC', min: 0, max: 100 },
      { name: 'GC - Cyclohexane', value: 0, unit: '%', method: 'ASTM D611 / GC', min: 0, max: 100 },
      { name: 'GC - Benzene', value: 0, unit: '%', method: 'ASTM D611 / GC', min: 0, max: 100 },
      { name: 'Density @ 15°C', value: 0, unit: 'g/cm3', method: 'ASTM D4052' },
    ]
  },
  'IMPURITIES_COMPLEMENTARY': {
    label: 'تست‌های تکمیلی (دکتر تست، سولفور، برم...)',
    params: [
      { name: 'Doctor Test (Mercaptans)', value: 'Negative', unit: '-', method: 'ASTM D4952' },
      { name: 'Reaction w/ Methyl Orange', value: 'Neutral', unit: '-', method: 'ISIRI Method' },
      { name: 'Total Sulfur', value: 0, unit: 'ppm', method: 'ASTM D5453' },
      { name: 'Water Content', value: 0, unit: 'ppm', method: 'ASTM D6304' },
      { name: 'Bromine Index', value: 0, unit: 'mg/100g', method: 'ASTM D2710' },
    ]
  },
  'ABSORBANCE': {
    label: 'تست جذب (UV)',
    params: [
      { name: 'Absorbance @ 240nm', value: 0, unit: 'Abs', method: 'Spectrophotometry' },
      { name: 'Absorbance @ 280nm', value: 0, unit: 'Abs', method: 'Spectrophotometry' },
    ]
  },
  'GENERAL_PHYSICAL': {
    label: 'خواص فیزیکی عمومی',
    params: [
      { name: 'Density @ 15°C', value: 0, unit: 'g/cm3', method: 'ASTM D4052' },
      { name: 'Viscosity', value: 0, unit: 'cP', method: 'ASTM D445' },
      { name: 'Flash Point', value: 0, unit: '°C', method: 'ASTM D93' },
      { name: 'Pour Point', value: 0, unit: '°C', method: 'ASTM D97' },
    ]
  },
  'ACID_BASE': {
    label: 'خلوص اسید/سود/اولئوم',
    params: [
      { name: 'Acid Purity', value: 0, unit: '%', method: 'Titration' },
      { name: 'Liquid Caustic Soda Purity', value: 0, unit: '%', method: 'Titration' },
      { name: 'Oleum Purity', value: 0, unit: '%', method: 'Titration' },
      { name: 'Density', value: 0, unit: 'g/cm3', method: 'ASTM D1298' },
    ]
  }
};

export const EntryForm: React.FC<EntryFormProps> = ({ onSave, onCancel }) => {
  const [batchNumber, setBatchNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<RecordCategory>('FINAL_PRODUCT');
  const [technician, setTechnician] = useState('');
  const [status, setStatus] = useState<QCStatus>(QCStatus.PENDING);
  const [notes, setNotes] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('EMPTY');
  
  // New State fields
  const [reportPurpose, setReportPurpose] = useState<ReportPurpose>(ReportPurpose.STANDARD);
  const [customerName, setCustomerName] = useState('');
  const [truckNumber, setTruckNumber] = useState('');
  const [driverName, setDriverName] = useState('');

  const [parameters, setParameters] = useState<QCParameter[]>([
    { name: 'Density @ 15°C', value: 0, unit: 'g/cm3', method: 'ASTM D4052', min: 0, max: 2 },
  ]);

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    // @ts-ignore
    const template = TEST_TEMPLATES[templateKey];
    if (template && template.params.length > 0) {
      // Clone params to avoid reference issues
      setParameters(template.params.map((p: any) => ({ ...p })));
    }
  };

  const handleParamChange = (index: number, field: keyof QCParameter, value: any) => {
    const newParams = [...parameters];
    // @ts-ignore
    newParams[index] = { ...newParams[index], [field]: value };
    setParameters(newParams);
  };

  const addParameter = () => {
    setParameters([...parameters, { name: '', value: 0, unit: '', method: '' }]);
  };

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: QCRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      batchNumber,
      productName,
      category,
      technician,
      status,
      notes,
      parameters,
      reportPurpose,
      customerName: reportPurpose !== ReportPurpose.STANDARD ? customerName : undefined,
      truckNumber: reportPurpose === ReportPurpose.DELIVERY ? truckNumber : undefined,
      driverName: reportPurpose === ReportPurpose.DELIVERY ? driverName : undefined,
    };
    onSave(newRecord);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
      <div className="bg-slate-50 border-b border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800">ثبت گزارش آنالیز جدید</h2>
        <p className="text-slate-500 text-sm mt-1">اطلاعات نمونه و نتایج تست‌ها را وارد کنید.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">نام محصول / ماده</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              placeholder="مثال: نرمال هگزان"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">دسته بندی</label>
            <select 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value as RecordCategory)}
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">شماره بچ (Batch No)</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              placeholder="Example: HEX-1403-01"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">نام تکنسین</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              placeholder="نام و نام خانوادگی"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">وضعیت نهایی</label>
            <select 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value as QCStatus)}
            >
              <option value={QCStatus.PENDING}>در انتظار بررسی</option>
              <option value={QCStatus.APPROVED}>تایید شده (Approved)</option>
              <option value={QCStatus.REJECTED}>مردود (Rejected)</option>
              <option value={QCStatus.CONDITIONAL}>مشروط (Conditional)</option>
            </select>
          </div>
        </div>

        {/* Report Purpose & Customer Info Section */}
        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
           <h3 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
              <Building2 size={18} />
              اطلاعات نوع گزارش و مشتری
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">نوع گزارش</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                  value={reportPurpose}
                  onChange={(e) => setReportPurpose(e.target.value as ReportPurpose)}
                >
                   {Object.entries(REPORT_PURPOSE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Conditional Inputs */}
              {(reportPurpose === ReportPurpose.CUSTOMER_SAMPLE || reportPurpose === ReportPurpose.DELIVERY) && (
                 <div className="space-y-2 animate-fade-in">
                    <label className="text-sm font-medium text-slate-700">نام مشتری</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="نام شرکت یا شخص..."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                 </div>
              )}

              {reportPurpose === ReportPurpose.DELIVERY && (
                <>
                   <div className="space-y-2 animate-fade-in">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1"><Truck size={14}/> شماره پلاک کامیون</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="مثال: ۱۲ع۳۴۵ ایران ۱۳"
                        value={truckNumber}
                        onChange={(e) => setTruckNumber(e.target.value)}
                      />
                   </div>
                   <div className="space-y-2 animate-fade-in">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1"><User size={14}/> نام راننده</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="نام راننده..."
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                      />
                   </div>
                </>
              )}
           </div>
        </div>

        {/* Parameters Section */}
        <div>
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 border-b border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-slate-800">نتایج آزمایش</h3>
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                    <Wand2 size={16} className="text-indigo-600"/>
                    <label className="text-xs font-medium text-indigo-700">قالب آماده:</label>
                    <select 
                        className="text-sm bg-transparent border-none focus:ring-0 text-indigo-900 font-bold cursor-pointer outline-none"
                        value={selectedTemplate}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                    >
                        {Object.entries(TEST_TEMPLATES).map(([key, template]) => (
                            <option key={key} value={key}>{template.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button 
              type="button" 
              onClick={addParameter}
              className="text-sm flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium px-3 py-1 bg-teal-50 rounded-lg transition-colors"
            >
              <Plus size={16} /> افزودن پارامتر دستی
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {parameters.map((param, index) => (
              <div key={index} className="flex flex-col xl:flex-row gap-3 items-end xl:items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-full xl:flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">نام پارامتر</label>
                  <input 
                    type="text" 
                    placeholder="مثال: Viscosity"
                    className="w-full px-3 py-2 bg-white rounded-md border border-slate-200 text-sm focus:border-teal-500 outline-none font-medium text-slate-700"
                    value={param.name}
                    onChange={(e) => handleParamChange(index, 'name', e.target.value)}
                  />
                </div>
                
                <div className="w-full xl:w-40">
                  <label className="text-xs text-slate-500 mb-1 block">روش تست (Method)</label>
                  <input 
                    type="text" 
                    placeholder="ASTM D..."
                    className="w-full px-3 py-2 bg-white rounded-md border border-slate-200 text-sm focus:border-teal-500 outline-none text-left"
                    value={param.method || ''}
                    onChange={(e) => handleParamChange(index, 'method', e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div className="w-full xl:w-32">
                  <label className="text-xs text-slate-500 mb-1 block">مقدار (Value)</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-white rounded-md border border-slate-200 text-sm focus:border-teal-500 outline-none text-left font-mono"
                    value={param.value}
                    onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                    dir="ltr"
                    placeholder="عدد یا متن"
                  />
                </div>

                <div className="w-full xl:w-24">
                  <label className="text-xs text-slate-500 mb-1 block">واحد</label>
                  <input 
                    type="text" 
                    placeholder="-"
                    className="w-full px-3 py-2 bg-white rounded-md border border-slate-200 text-sm focus:border-teal-500 outline-none text-center"
                    value={param.unit}
                    onChange={(e) => handleParamChange(index, 'unit', e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div className="w-full xl:w-24">
                  <label className="text-xs text-slate-500 mb-1 block">حداقل</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white rounded-md border border-slate-200 text-sm focus:border-teal-500 outline-none text-center font-mono"
                    value={param.min || ''}
                    onChange={(e) => handleParamChange(index, 'min', parseFloat(e.target.value))}
                    dir="ltr"
                  />
                </div>
                
                <div className="w-full xl:w-24">
                  <label className="text-xs text-slate-500 mb-1 block">حداکثر</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white rounded-md border border-slate-200 text-sm focus:border-teal-500 outline-none text-center font-mono"
                    value={param.max || ''}
                    onChange={(e) => handleParamChange(index, 'max', parseFloat(e.target.value))}
                    dir="ltr"
                  />
                </div>

                <div className="flex items-center justify-end xl:w-auto mt-2 xl:mt-0">
                    <button 
                      type="button" 
                      onClick={() => removeParameter(index)}
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">یادداشت‌های تکمیلی</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              placeholder="توضیحات مربوط به نمونه، شرایط تست یا مشاهدات..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
          >
            انصراف
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-medium shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Save size={18} />
            ذخیره گزارش
          </button>
        </div>
      </form>
    </div>
  );
};
