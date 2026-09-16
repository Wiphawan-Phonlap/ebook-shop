import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: PageProps) {
  // ดึงค่า id จาก URL
  const { id } = await params;

  // ดึงข้อมูลหนังสือจาก Supabase
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !book) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#1F2933]">
      {/* Navbar */}
      <nav className="border-b border-[#E7E2D9] bg-[#F7F5F0]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1F2933] text-white flex items-center justify-center">
              <span className="text-lg">E</span>
            </div>
            <div>
              <p className="font-semibold tracking-wide text-[#1F2933]">
                E-BOOK SHOP
              </p>
              <p className="text-[10px] tracking-[0.25em] text-gray-500">
                DIGITAL LIBRARY
              </p>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1F2933] transition">
              หนังสือทั้งหมด
            </Link>
            <Link href="/checkout" className="hover:text-[#1F2933] transition">
              Checkout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1F2933] transition"
          >
            <span>←</span>
            กลับสู่หน้าหนังสือทั้งหมด
          </Link>
        </div>

        {/* Product */}
        <div className="bg-white border border-[#E8E4DD] rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(30,30,30,0.04)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* ================= COVER ================= */}
            <div className="bg-[#EDEAE4] min-h-[430px] md:min-h-[520px] flex items-center justify-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute w-72 h-72 rounded-full bg-[#DCD7CD] blur-3xl opacity-70" />
              <div className="absolute top-10 right-10 w-24 h-24 rounded-full border border-[#D4CEC2]" />
              <div className="absolute bottom-10 left-10 w-16 h-16 rounded-full border border-[#D4CEC2]" />

              {/* Book cover */}
              <div className="relative w-52 h-72 md:w-60 md:h-80 rounded-sm shadow-[15px_20px_35px_rgba(0,0,0,0.20)] overflow-hidden bg-[#2F3A35] flex items-center justify-center">
                {book.cover_image ? (
                  <img
                    src={book.cover_image}
                    alt={`ปกหนังสือ ${book.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8 text-gray-300">
                    <p className="text-[10px] tracking-[0.35em] mb-5">E-BOOK</p>
                    <p className="text-xs">ไม่มีรูปปก</p>
                  </div>
                )}
              </div>
            </div>

            {/* ================= DETAILS ================= */}
            <div className="p-7 md:p-10 lg:p-14 flex flex-col">
              <div className="mb-8">
                <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-4">
                  Digital Edition
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-[#18212B]">
                  {book.title}
                </h1>
                <p className="mt-3 text-gray-500">โดย {book.author}</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#EEEAE3] mb-8" />

              {/* Description */}
              <div className="flex-grow">
                <h2 className="text-sm font-semibold tracking-wide text-[#18212B] mb-4">
                  รายละเอียดหนังสือ
                </h2>
                <p className="text-gray-500 leading-8 text-sm md:text-base">
                  {book.description}
                </p>
              </div>

              {/* Information */}
              <div className="mt-10 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#F7F5F0] p-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Format
                  </p>
                  <p className="text-sm font-medium text-[#27323A] mt-1">
                    Digital E-book
                  </p>
                </div>

                <div className="rounded-xl bg-[#F7F5F0] p-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    Delivery
                  </p>
                  <p className="text-sm font-medium text-[#27323A] mt-1">
                    Instant Access
                  </p>
                </div>
              </div>

              {/* Price + Button */}
              <div className="mt-8 pt-7 border-t border-[#EEEAE3]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400">
                      Price
                    </p>
                    <p className="text-3xl font-semibold text-[#18212B] mt-1">
                      ฿{Number(book.price).toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/checkout?bookId=${book.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1F2933] text-white px-7 py-4 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-[#374151] hover:shadow-xl hover:-translate-y-0.5"
                  >
                    ซื้อทันที
                    <span className="text-base">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E7E2D9]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 tracking-wide">
            © 2026 E-BOOK SHOP
          </p>
          <p className="text-xs text-gray-400">
            A simple digital reading experience.
          </p>
        </div>
      </footer>
    </main>
  );
}