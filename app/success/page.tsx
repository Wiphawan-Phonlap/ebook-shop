'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SuccessBook {
  title: string;
  fileUrl: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const bookId = searchParams.get('bookId');
  const email = searchParams.get('email') || 'example@email.com';
  const name = searchParams.get('name') || 'ผู้ซื้อทั่วไป';
  
  const [book, setBook] = useState<SuccessBook | null>(null);
  const [bookError, setBookError] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) {
        setBookError(true);
        return;
      }

      const { data, error } = await supabase
        .from('books')
        .select('title')
        .eq('id', bookId)
        .single();

      if (error || !data) {
        setBookError(true);
        return;
      }

      setBook({ title: data.title, fileUrl: '#' });
    };

    loadBook();
  }, [bookId]);

  if (!book) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-[#1F2933] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">
            {bookError ? 'ไม่พบข้อมูลหนังสือของคำสั่งซื้อนี้' : 'กำลังโหลดข้อมูลคำสั่งซื้อ...'}
          </p>
        </div>
      </main>
    );
  }

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
            <span className="text-[#1F2933] font-medium">Success</span>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="max-w-xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-white border border-[#E8E4DD] rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgba(30,30,30,0.04)] text-center">
          
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[#F0F5F2] text-[#2F3A35] rounded-full flex items-center justify-center mx-auto mb-5 text-2xl font-bold border border-[#D5E1D8]">
            ✓
          </div>

          <span className="inline-block bg-[#F0F5F2] text-[#2F3A35] border border-[#D5E1D8] text-xs font-semibold py-1 px-3 rounded-full uppercase tracking-wider mb-4">
            สถานะ: PAID (ชำระเงินสำเร็จ)
          </span>

          <h1 className="text-2xl md:text-3xl font-semibold text-[#18212B] mb-2">ขอบคุณสำหรับการสั่งซื้อ!</h1>
          <p className="text-sm text-gray-500 mb-8">
            เลขที่คำสั่งซื้อ: <span className="font-mono font-medium text-gray-700">{orderId || 'N/A'}</span>
          </p>

          {/* Details Box */}
          <div className="bg-[#FAF9F7] border border-[#DDD9D1] rounded-2xl p-5 text-left mb-6 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">หนังสือ:</span>
              <span className="font-medium text-[#18212B] text-right">{book.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ผู้รับ:</span>
              <span className="font-medium text-[#18212B]">{name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">อีเมลแจ้งเตือน:</span>
              <span className="font-medium text-[#1F2933]">{email}</span>
            </div>
          </div>

          {/* Mock Email Box */}
          <div className="bg-[#F4F6F8] border border-[#E2E8F0] rounded-2xl p-4 text-left mb-8 text-xs text-[#1E293B] space-y-1">
            <p className="font-semibold flex items-center gap-1.5 text-[#0F172A]">
              <span>✉️</span> จำลองการส่งอีเมลสำเร็จ:
            </p>
            <p className="text-gray-600 leading-relaxed">
              ระบบได้ส่งลิงก์ดาวน์โหลดชั่วคราว (Temporary Link) ไปยังอีเมล <span className="underline font-medium">{email}</span> เรียบร้อยแล้ว
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <a
              href={book.fileUrl}
              onClick={(e) => {
                e.preventDefault();
                alert('จำลองการดาวน์โหลดไฟล์ E-book สำเร็จ!');
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#1F2933] text-white py-4 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-[#374151] hover:shadow-xl hover:-translate-y-0.5"
            >
              ดาวน์โหลด E-book ตอนนี้ (Temporary Link)
              <span className="text-base">→</span>
            </a>

            <Link
              href="/"
              className="w-full flex items-center justify-center bg-[#FAF9F7] border border-[#DDD9D1] text-[#1F2933] py-4 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-[#F1EEE8]"
            >
              กลับสู่หน้าแรก (Home)
            </Link>
          </div>

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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-[#1F2933] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}