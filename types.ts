
export enum QCStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  CONDITIONAL = 'CONDITIONAL'
}

export type RecordCategory = 'RAW_MATERIAL' | 'FINAL_PRODUCT' | 'INTERMEDIATE';

export const CATEGORY_LABELS: Record<RecordCategory, string> = {
  'RAW_MATERIAL': 'مواد اولیه',
  'FINAL_PRODUCT': 'محصول نهایی',
  'INTERMEDIATE': 'محصول میانی'
};

export enum ReportPurpose {
  STANDARD = 'STANDARD',
  CUSTOMER_SAMPLE = 'CUSTOMER_SAMPLE',
  DELIVERY = 'DELIVERY'
}

export const REPORT_PURPOSE_LABELS: Record<ReportPurpose, string> = {
  'STANDARD': 'ارسال به استاندارد',
  'CUSTOMER_SAMPLE': 'ارسال نمونه به مشتری',
  'DELIVERY': 'مجوز خروج / بارگیری'
};

export interface QCParameter {
  name: string;
  value: number | string; // Changed to allow "Negative", "Positive" etc.
  unit: string;
  method?: string; // New field for Test Method (e.g., ASTM D86)
  min?: number;
  max?: number;
}

export interface QCRecord {
  id: string;
  batchNumber: string;
  productName: string;
  category: RecordCategory;
  date: string; // ISO String
  technician: string;
  parameters: QCParameter[];
  status: QCStatus;
  notes?: string;
  aiAnalysis?: string;
  
  // New fields for classification
  reportPurpose: ReportPurpose;
  customerName?: string;
  truckNumber?: string;
  driverName?: string;
}

export type ViewState = 'DASHBOARD' | 'NEW_ENTRY' | 'REPORTS';

// Initial data reflecting the user's specific chemical industry context
export const INITIAL_RECORDS: QCRecord[] = [
  {
    id: '1',
    batchNumber: 'HEX-1403-88',
    productName: 'Normal Hexane',
    category: 'FINAL_PRODUCT',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    technician: 'علی رضایی',
    status: QCStatus.APPROVED,
    reportPurpose: ReportPurpose.DELIVERY,
    customerName: 'صنایع شیمیایی اصفهان',
    truckNumber: '۱۲ع۴۵۶ ایران ۱۳',
    driverName: 'محسن احمدی',
    parameters: [
      { name: 'GC - Normal Hexane', value: 98.5, unit: '%', method: 'ASTM D611', min: 98.0, max: 100 },
      { name: 'GC - Benzene', value: 0.01, unit: '%', method: 'ASTM D611', min: 0, max: 0.05 },
      { name: 'Density @ 15°C', value: 0.659, unit: 'g/cm3', method: 'ASTM D4052', min: 0.655, max: 0.665 },
      { name: 'Doctor Test', value: 'Negative', unit: '-', method: 'ASTM D4952' },
      { name: 'Total Sulfur', value: 2, unit: 'ppm', method: 'ASTM D5453' }
    ],
    notes: 'خلوص بسیار مطلوب. بنزن در حد ناچیز. سولفور و دکتر تست مطابق استاندارد.'
  },
  {
    id: '2',
    batchNumber: 'SOL-D86-09',
    productName: 'Special Solvent 402',
    category: 'INTERMEDIATE',
    date: new Date(Date.now() - 86400000).toISOString(),
    technician: 'سارا محمدی',
    status: QCStatus.CONDITIONAL,
    reportPurpose: ReportPurpose.CUSTOMER_SAMPLE,
    customerName: 'بازرگانی اتحاد',
    parameters: [
      { name: 'Flash Point', value: 38, unit: '°C', method: 'ASTM D93', min: 38, max: 60 },
      { name: 'ASTM D86 - IBP', value: 152, unit: '°C', method: 'ASTM D86', min: 150, max: 160 },
      { name: 'ASTM D86 - 50%', value: 175, unit: '°C', method: 'ASTM D86', min: 170, max: 180 },
      { name: 'ASTM D86 - FBP', value: 205, unit: '°C', method: 'ASTM D86', min: 195, max: 205 },
      { name: 'Density @ 15°C', value: 0.785, unit: 'g/cm3', method: 'ASTM D4052', min: 0.775, max: 0.795 },
      { name: 'Water Content', value: 50, unit: 'ppm', method: 'ASTM D6304' }
    ],
    notes: 'نقطه اشتعال روی مرز پایین استاندارد است. نیاز به بررسی مجدد.'
  },
  {
    id: '3',
    batchNumber: 'ACID-908',
    productName: 'Sulfuric Acid',
    category: 'RAW_MATERIAL',
    date: new Date().toISOString(),
    technician: 'محمد کاظمی',
    status: QCStatus.APPROVED,
    reportPurpose: ReportPurpose.STANDARD,
    parameters: [
      { name: 'Acid Purity', value: 98.2, unit: '%', method: 'Titration', min: 98, max: 99 },
      { name: 'Density', value: 1.84, unit: 'g/cm3', method: 'ASTM D1298', min: 1.83, max: 1.85 },
      { name: 'Methyl Orange Reaction', value: 'Acidic', unit: '-', method: 'ISIRI 222' }
    ],
    notes: 'ورودی تانکر شماره 2'
  }
];
