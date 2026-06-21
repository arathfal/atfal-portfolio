# Aradea — Portfolio & Admin

Portfolio Next.js 15 dengan website publik dan dashboard admin berbasis
hostname dalam satu deployment Vercel.

## Fitur

- Home/About dengan hero, CTA, intro, dan tech stack.
- Halaman Projects berbasis database dengan card responsif.
- Career timeline untuk pengalaman kerja dan pendidikan.
- Public read-only API untuk projects dan career.
- Dashboard CRUD pada `admin.aradea-atfal.my.id`.
- Session cookie custom dan signed upload Cloudinary untuk thumbnail project
  serta logo company/institution opsional.
- SQLite untuk development dan Neon PostgreSQL untuk production.
- Dark mode dengan preferensi tersimpan.
- Animasi reveal yang menghormati reduced-motion.
- Metadata SEO, Open Graph, loading state, error boundary, dan empty state.

## Persyaratan

- Node.js 20 atau lebih baru.
- pnpm 10 atau lebih baru.

## Menjalankan Project

1. Install dependency:

   ```bash
   pnpm install
   ```

2. Salin environment variable:

   ```bash
   cp .env.example .env
   ```

3. Isi environment variable admin dan Cloudinary pada `.env`, lalu generate
   Prisma Client:

   ```bash
   pnpm prisma:generate
   ```

4. Terapkan migration SQLite:

   ```bash
   pnpm prisma:migrate --name init
   ```

5. Isi database dengan data contoh:

   ```bash
   pnpm seed
   ```

6. Jalankan development server:

   ```bash
   pnpm dev
   ```

Buka:

- Publik: [http://localhost:3000](http://localhost:3000)
- Admin: [http://admin.localhost:3000](http://admin.localhost:3000)

## Script

```bash
pnpm dev
pnpm build
pnpm build:local
pnpm start
pnpm lint
pnpm seed
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:migrate:prod
pnpm prisma:validate
```

## Struktur Utama

```text
src/app/
├── (public)/
├── admin/
└── api/
prisma/
├── sqlite/
├── postgresql/
└── seed.ts
```

## Neon Production

`DATABASE_URL` harus memakai Neon pooled connection dan
`DIRECT_DATABASE_URL` memakai direct connection. Migration tidak dijalankan
otomatis saat build:

```bash
pnpm prisma:migrate:prod
pnpm build
```

Jika database Neon sudah memiliki tabel, baseline migration terlebih dahulu
sebelum menjalankan `migrate deploy`.

## Vercel dan Domain

```bash
vercel link --project aradea-atfal
vercel domains add aradea-atfal.my.id
vercel domains add admin.aradea-atfal.my.id
vercel domains inspect aradea-atfal.my.id
vercel domains inspect admin.aradea-atfal.my.id
```

Dengan konfigurasi domain saat ini, Vercel meminta record berikut pada
provider DNS:

```text
A  @      76.76.21.21
A  admin  76.76.21.21
```

Hapus record A/AAAA/CNAME lain yang konflik pada host yang sama, lalu tunggu
Vercel menerbitkan sertifikat HTTPS.

Cloudinary upload preset wajib bertipe signed, mengizinkan folder dinamis
`portfolio/projects` dan `portfolio/career`, serta membatasi format ke
JPG/JPEG/PNG/WebP dan ukuran maksimum 2 MB. Career tanpa logo akan memakai
placeholder inisial.

Sebelum dipublikasikan, ganti nama, email, tautan sosial, URL demo/repository,
dan data seed dengan informasi asli.
