import React, { useState, useEffect } from 'react';
import { ViewState, QCRecord, INITIAL_RECORDS } from './types';
import { Dashboard } from './components/Dashboard';
import { EntryForm } from './components/EntryForm';
import { ReportList } from './components/ReportList';
import { LayoutDashboard, PlusCircle, List, Menu, X, Download } from 'lucide-react';
import { FarshidLogo } from './components/Logo';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [records, setRecords] = useState<QCRecord[]>(INITIAL_RECORDS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setInstallPrompt(null);
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  };

  const handleSaveRecord = (newRecord: QCRecord) => {
    setRecords([newRecord, ...records]);
    setCurrentView('REPORTS');
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        currentView === view 
          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-72 bg-white border-l border-slate-200 flex-col p-6 z-10 shadow-lg md:shadow-none">
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="w-12 h-16 shrink-0">
             <FarshidLogo className="w-full h-full drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-tight">شیمیایی فرشید</h1>
            <p className="text-xs text-slate-400 font-medium">آزمایشگاه کنترل کیفیت</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem view="DASHBOARD" icon={LayoutDashboard} label="داشبورد" />
          <NavItem view="NEW_ENTRY" icon={PlusCircle} label="ثبت آنالیز جدید" />
          <NavItem view="REPORTS" icon={List} label="گزارش‌ها و آرشیو" />
        </nav>

        <div className="mt-auto space-y-4">
           {installPrompt && (
             <button
               onClick={handleInstallClick}
               className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm font-medium"
             >
               <Download size={16} />
               نصب نرم‌افزار
             </button>
           )}

           <div className="pt-6 border-t border-slate-100">
             <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                     MA
                 </div>
                 <div>
                     <p className="text-sm font-bold text-slate-700">مدیر کنترل کیفیت</p>
                     <p className="text-xs text-slate-400">lab@farshidchem.ir</p>
                 </div>
             </div>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
            <div className="w-8 h-10">
               <FarshidLogo className="w-full h-full" />
            </div>
            <h1 className="font-bold text-slate-800">شیمیایی فرشید</h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
            {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-800/50 z-10 md:hidden" onClick={() => setMobileMenuOpen(false)}>
              <div className="absolute right-0 top-16 bottom-0 w-64 bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <nav className="space-y-2">
                    <NavItem view="DASHBOARD" icon={LayoutDashboard} label="داشبورد" />
                    <NavItem view="NEW_ENTRY" icon={PlusCircle} label="ثبت آنالیز جدید" />
                    <NavItem view="REPORTS" icon={List} label="گزارش‌ها و آرشیو" />
                    
                    {installPrompt && (
                      <button
                        onClick={handleInstallClick}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-blue-600 bg-blue-50 hover:bg-blue-100 mt-4"
                      >
                        <Download size={20} />
                        <span className="font-medium">نصب نرم‌افزار</span>
                      </button>
                    )}
                </nav>
              </div>
          </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full pt-20 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
            <header className="mb-8 hidden md:block">
                <h2 className="text-2xl font-bold text-slate-800">
                    {currentView === 'DASHBOARD' && 'نمای کلی آزمایشگاه'}
                    {currentView === 'NEW_ENTRY' && 'ورود اطلاعات'}
                    {currentView === 'REPORTS' && 'لیست گزارش‌ها'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    {currentView === 'DASHBOARD' && 'خلاصه وضعیت کنترل کیفی و روندهای تولید.'}
                    {currentView === 'NEW_ENTRY' && 'ثبت دقیق پارامترهای شیمیایی و فیزیکی محصولات.'}
                    {currentView === 'REPORTS' && 'جستجو، فیلتر و تحلیل هوشمند سوابق تولید.'}
                </p>
            </header>

            {currentView === 'DASHBOARD' && <Dashboard records={records} />}
            {currentView === 'NEW_ENTRY' && <EntryForm onSave={handleSaveRecord} onCancel={() => setCurrentView('DASHBOARD')} />}
            {currentView === 'REPORTS' && <ReportList records={records} />}
        </div>
      </main>

    </div>
  );
};

export default App;