'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface CheckoutBook {
  title: string;
  price: number;
  author: string;
  cover_image: string | null;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get('bookId');

  const [book, setBook] = useState<CheckoutBook | null>(null);
  const [bookError, setBookError] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) {
        setBookError(true);
        return;
      }

      const { data, error } = await supabase
        .from('books')
        .select('title, price, author, cover_image')
        .eq('id', bookId)
        .single();

      if (error || !data) {
        setBookError(true);
        return;
      }

      setBook(data);
    };

    loadBook();
  }, [bookId]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!book || !bookId) return;

    setLoading(true);
    setOrderError('');

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        book_id: bookId,
        customer_name: name,
        customer_email: email,
        status: 'PENDING',
        total_amount: book.price,
      })
      .select('id')
      .single();

    if (error || !order) {
      console.error('Order creation error details:', JSON.stringify(error, null, 2));
      setOrderError(`สร้างคำสั่งซื้อไม่สำเร็จ: ${error?.message || 'Unknown error'}`);
      setLoading(false);
      return;
    }

    router.push(`/payment/${order.id}?bookId=${bookId}&amount=${book.price}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
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
            <span className="text-[#1F2933] font-medium">Checkout</span>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-16">
        <Link
          href={bookId ? `/books/${bookId}` : '/'}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1F2933] transition mb-8"
        >
          <span>←</span>
          กลับไปหน้ารายละเอียด
        </Link>

        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">Secure Checkout</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#18212B]">ยืนยันคำสั่งซื้อ</h1>
          <p className="text-gray-500 mt-3">ตรวจสอบรายละเอียดและกรอกข้อมูลสำหรับการสั่งซื้อ E-book</p>
        </div>

        {/* CHECKOUT CARD */}
        <div className="bg-white border border-[#E8E4DD] rounded-3xl shadow-[0_10px_40px_rgba(30,30,30,0.04)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            
            {/* ORDER SUMMARY */}
            <div className="lg:col-span-2 bg-[#F1EEE8] p-7 md:p-10">
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-6">Order Summary</p>

              {book ? (
                <div>
                  <div className="h-64 md:h-72 rounded-2xl bg-[#E4E0D8] flex items-center justify-center overflow-hidden mb-7 border border-[#DDD8CE]">
                    {book.cover_image ? (
                      <img 
                        src={book.cover_image} 
                        alt={book.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs">ไม่มีรูปปก</div>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">Selected E-book</p>
                    <h2 className="text-xl md:text-2xl font-semibold text-[#18212B] leading-snug">{book.title}</h2>
                    <p className="text-sm text-gray-500 mt-2">โดย {book.author}</p>
                  </div>

                  <div className="border-t border-[#DDD8CE] mt-7 pt-6 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-3xl font-semibold text-[#18212B] mt-1">฿{Number(book.price).toLocaleString()}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">THB</span>
                  </div>
                </div>
              ) : (
                <div className="min-h-[350px] flex items-center justify-center text-center">
                  <div>
                    <div className="w-10 h-10 border-2 border-gray-300 border-t-[#1F2933] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500">
                      {bookError ? 'ไม่พบข้อมูลหนังสือเล่มนี้' : 'กำลังโหลดข้อมูลหนังสือ...'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CUSTOMER FORM */}
            <div className="lg:col-span-3 p-7 md:p-10">
              <div className="mb-8">
                <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">Customer Information</p>
                <h2 className="text-2xl font-semibold text-[#18212B]">ข้อมูลผู้ซื้อ</h2>
              </div>

              {orderError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                  {orderError}
                </div>
              )}

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#27323A] mb-2">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="กรอกชื่อ-นามสกุลของคุณ"
                    className="w-full px-4 py-3.5 bg-[#FAF9F7] border border-[#DDD9D1] rounded-xl text-sm text-[#1F2933] placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-[#1F2933] focus:ring-2 focus:ring-[#1F2933]/5"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#27323A] mb-2">
                    อีเมล
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3.5 bg-[#FAF9F7] border border-[#DDD9D1] rounded-xl text-sm text-[#1F2933] placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-[#1F2933] focus:ring-2 focus:ring-[#1F2933]/5"
                  />
                  <div className="flex items-start gap-2 mt-3 text-xs text-gray-400 leading-relaxed">
                    <span className="mt-0.5">ⓘ</span>
                    <p>ใช้อีเมลนี้สำหรับรับข้อมูลคำสั่งซื้อ และลิงก์ดาวน์โหลด E-book หลังชำระเงินสำเร็จ</p>
                  </div>
                </div>

                <div className="border-t border-[#EEEAE3] pt-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sm text-gray-500">สถานะคำสั่งซื้อเริ่มต้น</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      PENDING
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !book}
                    className="w-full flex items-center justify-center gap-3 bg-[#1F2933] text-white py-4 px-6 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-[#374151] hover:shadow-xl hover:-translate-y-0.5 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังสร้างคำสั่งซื้อ...
                      </>
                    ) : (
                      <>
                        สร้างคำสั่งซื้อ
                        <span className="text-base">→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-7 pt-6 border-t border-[#EEEAE3] flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>🔒</span>
                <span>ข้อมูลของคุณจะถูกใช้สำหรับคำสั่งซื้อนี้เท่านั้น</span>
              </div>
            </div>

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

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-gray-300 border-t-[#1F2933] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}