# Divisi Semesta — Cute Voxel 3D (Production Test 01)

Source code proyek **Remotion + Three.js / React Three Fiber** untuk Windows. Tidak memerlukan aset 3D eksternal: model Niko, ruang kontrol gravitasi, tuas, kristal, dan properti dibuat dari geometri kubus di kode.

**Prototipe:** 15 detik, vertikal 1080 × 1920, 60 FPS, 900 frames. Tanpa narasi, teks layar, ataupun soundtrack (animation test).

## Persyaratan
- Windows 10/11
- Node.js LTS + npm, VS Code
- Browser Chrome/Chromium, GPU yang dapat menjalankan WebGL

## Instalasi
Ekstrak ZIP, buka folder proyek melalui VS Code, kemudian jalankan PowerShell pada folder tersebut:

```powershell
node --version
npm --version
npm install
npm run dev
```

Remotion Studio akan membuka preview. Pilih komposisi **NikoGravityTest**, tekan Play atau scrub timeline.

## Render
```powershell
npm run render
```

Hasil di `out/niko-gravity-test.mp4`. Jika render berat, ubah sementara `width`/`height`/`fps` di `src/root.tsx` menjadi `540`/`960`/`30`, dan sesuaikan `durationInFrames` menjadi `450`. Untuk mengembalikan 15 detik 60 FPS, gunakan pengaturan semula.

**Alternatif render 720 × 1280** tanpa mengubah source:
```powershell
npx remotion render src/index.ts NikoGravityTest out/test-720.mp4 --width 720 --height 1280 --concurrency 1
```

## Timeline 15 detik
- 0–3 detik: kamera dolly mendekati ruang kontrol.
- 3–7 detik: Niko berjalan mendekati konsol.
- 7–10 detik: Niko memeriksa panel; tuas darurat turun.
- 10–15 detik: kristal bereaksi, kubus melayang, Niko terkejut.

## File penting
- `src/scene.tsx`: objek voxel, rig tubuh sederhana, gerakan, kamera, lingkungan.
- `src/root.tsx`: resolusi, FPS, dan durasi.
- `src/index.ts`: entry point Remotion.
- `remotion.config.ts`: konfigurasi renderer WebGL ANGLE.
- `reference/`: 3 referensi visual yang disepakati (hanya panduan, bukan model 3D).

## Batasan versi awal
- Ini prototipe procedural voxel, **bukan** rekonstruksi akurat satu-banding-satu concept art atau render video siap publikasi.
- Rig menggunakan pivot antarbagian tubuh, bukan armature Blender. Ekspresi sederhana.
- Tidak ada lip sync/VO pada demo karena ini adalah *animation motion test* 15 detik.
- Preview dan render perlu diuji pada Windows milik Anda; pengujian runtime di lingkungan pengembangan pembuat dapat berbeda karena GPU/Chromium dan ketersediaan paket npm.

## Referensi dokumentasi
- https://www.remotion.dev/docs/three
- https://www.remotion.dev/docs/three-canvas
- https://www.remotion.dev/docs/render
