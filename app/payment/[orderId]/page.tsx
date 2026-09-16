'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function PaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = params.orderId as string;
  const bookId = searchParams.get('bookId');
  const amount = searchParams.get('amount');
  const name = searchParams.get('name');
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(false);

  const handleSimulatePayment = async () => {
    if (!orderId) {
      alert('ไม่พบรหัสคำสั่งซื้อ');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'PAID', 
          paid_at: new Date().toISOString() 
        })
        .eq('id', orderId);

      if (error) throw error;

      router.push(`/success?orderId=${orderId}&bookId=${bookId}&amount=${amount}&name=${encodeURIComponent(name || '')}&email=${encodeURIComponent(email || '')}`);
    } catch (err) {
      console.error('Payment update error:', err);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงิน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#1F2933]">
      {/* NAVBAR */}
      <nav className="border-b border-[#E7E2D9] bg-[#F7F5F0]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1F2933] text-white flex items-center justify-center">
              <span className="text-lg">E</span>
            </div>
            <div>
              <p className="font-semibold tracking-wide text-[#1F2933]">E-BOOK SHOP</p>
              <p className="text-[10px] tracking-[0.25em] text-gray-500">DIGITAL LIBRARY</p>
            </div>
          </Link>
          <div className="hidden sm:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1F2933] transition">หนังสือทั้งหมด</Link>
            <span className="text-[#1F2933] font-medium">Payment</span>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="max-w-xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-white border border-[#E8E4DD] rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgba(30,30,30,0.04)] text-center">
          
          <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium px-3 py-1 rounded-full mb-6">
            DEMO ONLY - จำลองการชำระเงิน
          </span>

          <h1 className="text-2xl md:text-3xl font-semibold text-[#18212B] mb-2">สแกน QR Code เพื่อชำระเงิน</h1>
          <p className="text-sm text-gray-500 mb-8">กรุณาตรวจสอบยอดเงินและยืนยันการชำระเงินผ่านระบบจำลอง</p>

          {/* QR Code Box */}
          <div className="bg-[#FAF9F7] border-2 border-dashed border-[#DDD9D1] rounded-2xl h-56 flex flex-col items-center justify-center text-gray-400 mb-8 p-6">
            <div className="w-28 h-28 bg-[#2F3A35] rounded-xl flex items-center justify-center text-white text-xs font-mono mb-3 shadow-inner">
              [ QR CODE ]
            </div>
            <p className="text-xs">PromptPay Mockup QR</p>
          </div>

          {/* Amount Box */}
          <div className="flex justify-between items-center bg-[#FAF9F7] border border-[#DDD9D1] p-4 rounded-2xl mb-8">
            <span className="text-sm text-gray-500">ยอดที่ต้องชำระสุทธิ:</span>
            <span className="text-[#18212B] font-bold text-2xl">฿{Number(amount || 0).toLocaleString()}</span>
          </div>

          <button
            onClick={handleSimulatePayment}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1F2933] text-white py-4 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-[#374151] hover:shadow-xl hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังยืนยันการชำระเงิน...
              </>
            ) : (
              <>
                จำลองชำระเงินสำเร็จ (Simulate Paid)
                <span className="text-base">→</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E7E2D9]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 tracking-wide">© 2026 E-BOOK SHOP</p>
          <p className="text-xs text-gray-400">A simple digital reading experience.</p>
        </div>
      </footer>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-[#1F2933] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">กำลังโหลดหน้าชำระเงิน...</p>
        </div>
      </main>
    }>
      <PaymentContent />
    </Suspense>
  );
}