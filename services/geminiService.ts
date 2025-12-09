
import { GoogleGenAI } from "@google/genai";
import { QCRecord, CATEGORY_LABELS } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeQCRecord = async (record: QCRecord): Promise<string> => {
  try {
    const prompt = `
      شما مدیر ارشد کنترل کیفیت شرکت "شیمیایی فرشید شهرضا" هستید.
      وظیفه شما بررسی گزارش آزمایشگاه زیر و ارائه یک تحلیل کوتاه، فنی و تخصصی به زبان فارسی است.

      اطلاعات گزارش:
      محصول/ماده: ${record.productName}
      دسته بندی: ${CATEGORY_LABELS[record.category]}
      شماره بچ/کد: ${record.batchNumber}
      تاریخ: ${new Date(record.date).toLocaleDateString('fa-IR')}
      تکنسین: ${record.technician}
      
      نتایج آزمایش:
      ${record.parameters.map(p => `- ${p.name}: ${p.value} ${p.unit} (محدوده استاندارد: ${p.min || '?'} - ${p.max || '?'})`).join('\n')}
      
      وضعیت فعلی: ${record.status}
      یادداشت تکنسین: ${record.notes || 'ندارد'}
      
      نکات برای تحلیل:
      1. اگر آزمایش شامل ASTM D86 (تقطیر) است، به نقاط جوش ابتدایی (IBP)، میانی (50%) و انتهایی (FBP) دقت کنید و در مورد فراریت نمونه نظر دهید.
      2. اگر آزمایش GC است، خلوص مواد (هگزان، بنزن و...) را با دقت بررسی کنید. وجود ناخالصی بالا باید هشدار داده شود.
      3. پارامترهای دانسیته، ویسکوزیته و نقطه اشتعال را در نظر بگیرید.
      4. یک متن رسمی برای درج در سیستم اتوماسیون پیشنهاد دهید.
      
      پاسخ را به صورت متن ساده و بدون فرمت مارک‌داون پیچیده بنویسید. لحن باید کاملاً اداری و صنعتی باشد.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "خطا در دریافت تحلیل از هوش مصنوعی.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "متاسفانه ارتباط با هوش مصنوعی برقرار نشد. لطفاً کلید API را بررسی کنید.";
  }
};
