# AGIA Store - Ecommerce Product Chatbot

AGIA Store adalah aplikasi ecommerce berbasis katalog produk yang dilengkapi
asisten AI. Pengunjung dapat mencari produk, membuka detail produk, dan bertanya
kepada chatbot mengenai katalog. Administrator dapat mengelola produk serta
melihat rekap percakapan chatbot melalui dashboard terproteksi.

Project ini dibuat sebagai technical test Junior Fullstack Developer dengan
fokus pada implementasi fullstack end-to-end, integrasi AI yang grounded,
keamanan data, serta pengalaman pengguna yang responsif.

## Tech Stack

- Next.js 15 App Router dan React 19
- TypeScript
- Tailwind CSS 4 dan shadcn/ui
- Supabase Database, Auth, SSR, dan Row Level Security
- Google Gemini melalui `@google/genai`
- Zod untuk validasi request dan form
- Lucide React untuk icon

## Fitur yang Selesai

### Katalog Publik

- Daftar produk responsif dengan tampilan card.
- Detail produk pada `/products/[id]`.
- Pencarian berdasarkan nama dan deskripsi.
- Filter berdasarkan kategori menggunakan URL Search Params.
- URL pencarian dapat disimpan dan dibagikan.
- Metadata halaman dinamis untuk pencarian katalog.
- Default image ketika produk tidak memiliki gambar.
- Loading state, empty state, error state, dan not-found page.
- Implementasi utama menggunakan React Server Components.

### Admin

- Login administrator menggunakan Supabase Auth.
- Otorisasi berbasis `app_metadata.role = admin`.
- Dashboard dengan sidebar responsif.
- CRUD produk.
- Rekap percakapan chatbot.
- Jumlah pesan dan tanggal aktivitas terakhir.
- Pencarian berdasarkan judul, session ID, atau isi pesan.
- Pagination daftar percakapan.
- Detail transcript percakapan.
- Reusable data table dan pagination component.
- Loading state untuk halaman produk dan percakapan.

### Chatbot Ecommerce

- Floating chat widget responsif.
- Open/close widget, auto-scroll, loading, dan typing indicator.
- API route `POST /api/chat`.
- Integrasi Google Gemini menggunakan server-side API key.
- Produk diambil dari Supabase dan diranking sebelum dikirim ke Gemini.
- Gemini hanya diperbolehkan menjawab berdasarkan data katalog yang diberikan.
- Fallback deterministik ketika informasi tidak ditemukan.
- Dukungan intent produk termahal, termurah, dan stok terbanyak.
- Link detail produk menggunakan ID terstruktur dari API, bukan URL buatan AI.
- Riwayat user dan assistant disimpan di Supabase.
- Percakapan lanjutan menggunakan riwayat pesan terbaru sebagai konteks.

## Fitur Bonus

- Guest conversation menggunakan session cookie `HttpOnly` selama 30 hari.
- Conversation dan message persistence.
- Relasi antara percakapan dan produk yang direkomendasikan.
- Admin conversation dashboard.
- Row Level Security lengkap untuk katalog dan data percakapan.
- Server-only Supabase secret client untuk penyimpanan chat guest.
- Proteksi terhadap instruksi yang disisipkan melalui deskripsi produk.
- Sanitasi respons AI dan rendering link internal tanpa
  `dangerouslySetInnerHTML`.

## Alur Chatbot

1. Pengguna mengirim pesan melalui floating widget.
2. API membaca atau membuat guest session dari cookie.
3. Conversation dibuat atau dilanjutkan berdasarkan `session_id`.
4. Pesan pengguna disimpan ke Supabase.
5. Produk katalog diambil dan diranking secara deterministik.
6. Riwayat terbaru dan produk relevan dikirim sebagai context Gemini.
7. Jawaban AI disimpan sebagai message assistant.
8. API mengembalikan jawaban dan referensi produk terstruktur ke widget.

Jika produk relevan tidak ditemukan, Gemini tidak dipanggil dan API
mengembalikan:

> Maaf saya tidak menemukan informasi tersebut pada katalog produk.

## Cara Setup

### Prasyarat

- Node.js 20 atau lebih baru
- npm
- Project Supabase
- Gemini API key

### 1. Clone dan install dependency

```bash
git clone <repository-url>
cd chatbot-agia
npm install
```

### 2. Konfigurasi environment

Buat file `.env.local` pada root project dan isi variable pada bagian
[Environment Variable](#environment-variable).

### 3. Siapkan database Supabase

Jalankan file berikut secara berurutan melalui Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_chat_persistence.sql`
3. `supabase/migrations/003_complete_rls_policies.sql`

Jika Supabase CLI sudah dikonfigurasi untuk project, migration dapat diterapkan
dengan:

```bash
supabase db push
```

### 4. Buat administrator

Buat user melalui Supabase Authentication, kemudian tambahkan role admin ke
`app_metadata`. Contoh melalui SQL Editor:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"admin"}'::jsonb
where email = 'admin@example.com';
```

Role disimpan di `app_metadata`, bukan `user_metadata`, agar tidak dapat diubah
sendiri oleh pengguna.

### 5. Jalankan aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000`. Halaman admin tersedia pada `/login` dan
`/admin`.

### 6. Verifikasi project

```bash
npm run lint
npm run build
```

## Environment Variable

| Variable                        | Wajib | Keterangan                                                          |
| ------------------------------- | ----- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Ya    | URL project Supabase.                                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya    | Anon/publishable key untuk browser dan session Auth.                |
| `SUPABASE_SECRET_KEY`           | Ya\*  | Secret key format baru untuk operasi chat server.                   |
| `SUPABASE_SERVICE_ROLE_KEY`     | Ya\*  | Alternatif JWT `service_role` jika secret key baru tidak digunakan. |
| `GEMINI_API_KEY`                | Ya    | API key Gemini, hanya dibaca di server.                             |
| `GEMINI_MODEL`                  | Tidak | Model Gemini. Default: `gemini-2.5-flash`.                          |

`*` Gunakan salah satu dari `SUPABASE_SECRET_KEY` atau
`SUPABASE_SERVICE_ROLE_KEY`. Jangan mengisi variable tersebut dengan anon key
dan jangan menggunakan prefix `NEXT_PUBLIC_` untuk secret.

Contoh:

```env
NEXT_PUBLIC_SUPABASE_URL=https://project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-server-secret-key
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

## Struktur Folder

```text
app/
|-- admin/                    # Dashboard, produk, dan rekap percakapan
|-- api/chat/                 # Chat API route
|-- login/                    # Autentikasi administrator
|-- products/[id]/            # Detail produk publik
|-- services/                 # Gemini, conversation, message, dan query service
|-- layout.tsx                # Root layout dan floating chat widget
`-- page.tsx                  # Katalog, search, dan filter
components/
|-- admin/                    # Sidebar, data table, dan pagination
|-- chat/                     # Floating chat widget
|-- conversation/             # Conversation table
|-- product/                  # Card, grid, form, dan product table
`-- ui/                       # Primitive shadcn/ui
lib/
`-- supabase/                 # Browser, SSR, middleware, dan secret client
public/                       # Asset statis dan default product image
supabase/migrations/          # Schema, persistence, dan policy RLS
types/                        # Type domain aplikasi
validations/                  # Validasi form produk
middleware.ts                 # Refresh session Supabase
```

## Database Schema

### `products`

Menyimpan katalog produk:

- `id`, `name`, `description`, `price`
- `category`, `stock`, `image_url`
- `created_at`, `updated_at`

Tabel memiliki index kategori, nama, dan full-text search. Public dapat membaca
produk, sedangkan insert, update, dan delete hanya dapat dilakukan admin.

### `conversations`

Menyimpan satu conversation untuk setiap guest session:

- `id`
- `user_id` nullable untuk guest
- `session_id` unik
- `title`
- `created_at`, `updated_at`

`updated_at` diperbarui setiap kali message baru ditambahkan.

### `messages`

Menyimpan transcript percakapan:

- `id`, `conversation_id`
- `role`: `user` atau `assistant`
- `content`
- `metadata` JSONB untuk model, token usage, dan product ID
- `created_at`

### `conversation_products`

Tabel junction antara conversation dan produk yang pernah dijadikan context
atau rekomendasi. Kombinasi `conversation_id` dan `product_id` bersifat unik.

### Relasi

```text
auth.users 1 ---- n conversations
conversations 1 ---- n messages
conversations 1 ---- n conversation_products n ---- 1 products
```

### Row Level Security

- `products`: public read, admin write.
- `conversations`: owner read, admin read.
- `messages`: owner conversation read, admin read.
- `conversation_products`: mengikuti ownership conversation.
- Guest tidak memperoleh akses tabel chat secara langsung. Penyimpanan guest
  dilakukan oleh API server menggunakan Supabase secret key.

## AI Tools yang Digunakan

### OpenAI Codex

Codex digunakan sebagai development assistant untuk eksplorasi codebase,
implementasi bertahap, debugging, verifikasi TypeScript/ESLint, dan penyusunan
dokumentasi. Keputusan arsitektur dan hasil implementasi tetap ditinjau terhadap
kebutuhan technical test dan kondisi repository.

## Tradeoff Teknis

1. **Retrieval lexical, belum semantic search.** Produk dibaca maksimal 250 row
   dan diranking di application server. Pendekatan ini sederhana dan mudah
   diaudit untuk katalog kecil, tetapi perlu dipindahkan ke PostgreSQL full-text
   search atau vector search ketika katalog membesar.

2. **Context dibatasi pada riwayat terbaru.** Gemini menerima sejumlah pesan
   terakhir agar biaya dan latency terkendali. Percakapan sangat panjang belum
   memiliki automatic summarization.

3. **Satu conversation per guest browser session.** Pendekatan ini memudahkan
   continuity tanpa login, tetapi belum menyediakan fitur membuat beberapa chat
   terpisah dari perangkat yang sama.

4. **Service-role untuk guest persistence.** Guest tidak diberi policy database
   langsung sehingga transcript lebih aman. Konsekuensinya, semua operasi guest
   harus melalui API dan keamanan secret server menjadi kritis.

5. **Respons AI belum streaming.** Widget menampilkan typing indicator selama
   menunggu satu respons penuh. Implementasi lebih sederhana, tetapi perceived
   latency lebih tinggi dibanding Server-Sent Events atau streaming response.

6. **Riwayat belum di-hydrate ke widget setelah refresh.** Backend tetap
   melanjutkan context berdasarkan cookie dan database, tetapi transcript lama
   belum dimuat kembali ke state visual widget.

7. **Belum tersedia automated test suite.** Verifikasi saat ini mengandalkan
   ESLint, TypeScript, build, dan pengujian alur manual. Ini menjadi prioritas
   utama sebelum production release.

## Jawaban Technical Test

### 1. Mengapa memilih challenge ini?

Challenge ini dipilih karena mencakup spektrum fullstack yang lengkap dalam
satu domain yang mudah dipahami: katalog publik, admin CRUD, autentikasi,
database relational, keamanan row-level, dan integrasi generative AI.

### 2. Bagian tersulit?

Model harus menerima context yang cukup untuk menjawab
pertanyaan lanjutan, tetapi tidak boleh mengarang produk. Di sisi database,
guest memerlukan persistence tanpa memperoleh akses langsung ke seluruh tabel
conversation. Solusinya adalah retrieval deterministik, system instruction yang
ketat, referensi produk terstruktur, cookie session acak, dan penulisan database
melalui server secret client.

### 3. Jika ada tambahan satu hari?

Prioritas pertama adalah menambahkan unit test untuk ranking produk dan
sanitasi respons, integration test untuk API chat dan RLS.

### 4. Strategi scaling?

- Memindahkan retrieval dari memory ke PostgreSQL FTS atau `pgvector` melalui
  RPC top-k.
- Menambahkan index yang disesuaikan dengan pola query dan melakukan pagination
  pada transcript message.
- Menyimpan summary conversation agar prompt tidak tumbuh linear.
- Menggunakan Redis/Upstash untuk distributed rate limiting dan idempotency.
- Menggunakan streaming response serta timeout dan retry terbatas untuk Gemini.
- Menambahkan cache katalog dan invalidasi saat produk diperbarui.
- Memindahkan pekerjaan non-kritis seperti analytics dan summarization ke queue
  worker.
- Menambahkan structured logging, tracing, alerting, dan monitoring biaya token.
- Memisahkan service chatbot ketika traffic AI mulai memiliki kebutuhan scaling
  yang berbeda dari storefront dan admin dashboard.

## License

Project ini dibuat untuk keperluan technical test.
