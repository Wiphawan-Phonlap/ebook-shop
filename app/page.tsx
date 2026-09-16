'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_image: string | null;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from('books').select('*');
      if (!error && data) {
        setBooks(data);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

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
            <Link href="/track" className="hover:text-[#1F2933] transition font-medium">ติดตามสถานะคำสั่งซื้อ</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#E7E2D9] pb-6 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 font-semibold">Featured Collection</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#18212B]">หนังสือแนะนำ</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#1F2933] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">กำลังโหลดชั้นหนังสือ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="bg-white border border-[#E8E4DD] rounded-3xl p-6 flex flex-col justify-between shadow-[0_10px_30px_rgba(30,30,30,0.03)] hover:shadow-[0_20px_40px_rgba(30,30,30,0.06)] transition-all duration-300"
              >
                <div>
                  {/* BOOK COVER IMAGE */}
                  <div className="w-full h-80 bg-[#FAF9F7] rounded-2xl mb-6 overflow-hidden border border-[#EBE7DF] flex items-center justify-center relative group">
                    {book.cover_image ? (
                      <img 
                        src={book.cover_image} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="text-center p-6 text-gray-400 text-xs">ไม่มีรูปปก</div>
                    )}
                  </div>

                  <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1 font-medium">Digital Edition</p>
                  <h2 className="text-xl font-semibold text-[#18212B] mb-2 line-clamp-1">{book.title}</h2>
                  <p className="text-xs text-gray-500 mb-3">โดย {book.author}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-6 leading-relaxed">{book.description}</p>
                </div>

                <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Price</span>
                    <span className="text-lg font-semibold text-[#18212B]">฿{book.price}</span>
                  </div>
                  <Link
                    href={`/books/${book.id}`}
                    className="bg-[#1F2933] text-white text-xs font-medium px-5 py-3 rounded-xl hover:bg-[#374151] transition shadow-md"
                  >
                    ดูรายละเอียด →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E7E2D9] mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 tracking-wide">© 2026 E-BOOK SHOP</p>
          <p className="text-xs text-gray-400">A simple digital reading experience.</p>
        </div>
      </footer>
    </main>
  );
}