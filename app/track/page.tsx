'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface OrderResult {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total_amount: number;
  created_at: string;
  book_id: string;
  books?: {
    title: string;
    author: string;
    cover_image: string | null;
  } | null;
}

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setOrder(null);
    setErrorMsg('');

    try {
      const searchTerm = query.trim();

      // 1. ค้นหาข้อมูลออเดอร์ก่อน (รองรับทั้งค้นหาด้วย Order ID แบบตรงๆ หรือ อีเมล)
      let { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${searchTerm},customer_email.ilike.%${searchTerm}%`)
        .maybeSingle();

      if (orderError) throw orderError;

      if (orderData) {
        // 2. ถ้าเจอออเดอร์ ให้ดึงข้อมูลหนังสือต่อโดยใช้ book_id
        let bookDetails = null;
        if (orderData.book_id) {
          const { data: bookData } = await supabase
            .from('books')
            .select('title, author, cover_image')
            .eq('id', orderData.book_id)
            .maybeSingle();
          
          bookDetails = bookData;
        }

        setOrder({
          ...orderData,
          books: bookDetails
        });
      } else {
        setOrder(null);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setErrorMsg('เกิดข้อผิดพลาดในการค้นหาข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#1F2933]">
      {/* NAVBAR */}
      <nav className="border-b border-[#E7E2D9] bg-[#F7F5F0]/95 backdrop-blur sticky top-0 z-50">
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
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1F2933] transition font-medium">หนังสือทั้งหมด</Link>
            <Link href="/track" className="text-[#1F2933] font-semibold transition">ติดตามสถานะคำสั่งซื้อ</Link>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="max-w-xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">Order Tracking</p>
          <h1 className="text-3xl font-semibold text-[#18212B]">ติดตามสถานะคำสั่งซื้อ</h1>
          <p className="text-sm text-gray-500 mt-2">กรอกหมายเลขคำสั่งซื้อ (Order ID) หรืออีเมลของคุณเพื่อตรวจสอบสถานะ</p>
        </div>

        {/* SEARCH FORM */}
        <div className="bg-white border border-[#E8E4DD] rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgba(30,30,30,0.04)] mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-[#27323A] mb-2">
                เลขคำสั่งซื้อ หรือ อีเมล
              </label>
              <input
                id="query"
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="เช่น เลข Order ID หรือ email@example.com"
                className="w-full px-4 py-3.5 bg-[#FAF9F7] border border-[#DDD9D1] rounded-xl text-sm text-[#1F2933] placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-[#1F2933]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1F2933] text-white py-4 rounded-xl text-sm font-medium transition hover:bg-[#374151] disabled:bg-gray-300"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  กำลังค้นหา...
                </>
              ) : (
                'ค้นหาคำสั่งซื้อ →'
              )}
            </button>
          </form>
        </div>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 text-center mb-6">
            {errorMsg}
          </div>
        )}

        {/* RESULT SECTION */}
        {searched && !loading && (
          <div>
            {order ? (
              <div className="bg-white border border-[#E8E4DD] rounded-3xl p-8 shadow-[0_10px_40px_rgba(30,30,30,0.04)] space-y-6">
                <div className="flex items-center justify-between border-b border-[#EEEAE3] pb-4">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="font-mono font-medium text-sm text-[#18212B]">{order.id}</p>
                  </div>
                  <div>
                    {order.status === 'PAID' ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full">
                        ✓ PAID (ชำระเงินแล้ว)
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full">
                        ⏳ PENDING (รอชำระเงิน)
                      </span>
                    )}
                  </div>
                </div>

                {/* BOOK DETAILS */}
                <div className="flex items-center gap-4 bg-[#FAF9F7] p-4 rounded-2xl border border-[#DDD9D1]">
                  {order.books?.cover_image ? (
                    <img 
                      src={order.books.cover_image} 
                      alt={order.books.title} 
                      className="w-16 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-500">ไม่มีรูป</div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">E-Book</p>
                    <h3 className="font-semibold text-[#18212B] text-base">{order.books?.title || 'ไม่พบชื่อหนังสือ'}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">โดย {order.books?.author || '-'}</p>
                  </div>
                </div>

                {/* CUSTOMER & PRICE */}
                <div className="space-y-2 text-sm text-gray-600 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ชื่อผู้ซื้อ:</span>
                    <span className="font-medium text-[#18212B]">{order.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">อีเมล:</span>
                    <span className="font-medium text-[#18212B]">{order.customer_email}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#EEEAE3] pt-3 mt-3">
                    <span className="text-gray-400">ยอดรวมสุทธิ:</span>
                    <span className="font-semibold text-lg text-[#18212B]">฿{Number(order.total_amount).toLocaleString()}</span>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                {order.status === 'PAID' ? (
                  <button
                    onClick={() => alert('จำลองการดาวน์โหลดไฟล์ E-book สำเร็จ!')}
                    className="w-full bg-[#1F2933] text-white py-3.5 rounded-xl text-sm font-medium transition hover:bg-[#374151]"
                  >
                    ดาวน์โหลด E-book อีกครั้ง →
                  </button>
                ) : (
                  <Link
                    href={`/payment/${order.id}?amount=${order.total_amount}&name=${encodeURIComponent(order.customer_name)}&email=${encodeURIComponent(order.customer_email)}`}
                    className="w-full flex items-center justify-center bg-amber-600 text-white py-3.5 rounded-xl text-sm font-medium transition hover:bg-amber-700"
                  >
                    ไปหน้าชำระเงินต่อ →
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white border border-[#E8E4DD] rounded-3xl p-8 text-center text-gray-500">
                <p className="text-sm">❌ ไม่พบข้อมูลคำสั่งซื้อจากคำค้นหานี้</p>
                <p className="text-xs text-gray-400 mt-1">โปรดตรวจสอบเลขคำสั่งซื้อหรืออีเมลใหม่อีกครั้ง</p>
              </div>
            )}
          </div>
        )}
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