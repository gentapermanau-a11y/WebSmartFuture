/**
 * TextAnimator: Kelas untuk menangani animasi teks berulang.
 * Menggunakan pendekatan Object-Oriented dan Asynchronous JavaScript.
 */
class TextAnimator {
  /**
   * @param {string} elementId - ID dari elemen HTML target.
   * @param {Array<string>} phrases - Kumpulan teks yang akan dianimasikan.
   * @param {Object} options - Pengaturan kecepatan dan jeda.
   */
  constructor(elementId, phrases, options = {}) {
    this.element = document.getElementById(elementId);
    this.phrases = phrases;
    this.loop = options.loop !== false; // Pastikan animasi selalu berulang
    this.typingSpeed = options.typingSpeed || 100;
    this.deletingSpeed = options.deletingSpeed || 50;
    this.pauseTime = options.pauseTime || 1500;
  }

  // Utility function: Mengubah setTimeout menjadi Promise agar kode tidak berbentuk "callback hell"
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async typeText(text) {
    for (let i = 0; i <= text.length; i++) {
      this.element.textContent = text.substring(0, i);
      await this.sleep(this.typingSpeed);
    }
  }

  async deleteText() {
    const text = this.element.textContent;
    for (let i = text.length; i >= 0; i--) {
      this.element.textContent = text.substring(0, i);
      await this.sleep(this.deletingSpeed);
    }
  }

  // Method utama untuk menjalankan animasi
  async start() {
    if (!this.element || this.phrases.length === 0) {
      console.error("Elemen tidak ditemukan atau teks kosong.");
      return;
    }

    // Menggunakan do-while loop agar animasi terus berulang sesuai konfigurasi
    do {
      for (const phrase of this.phrases) {
        await this.typeText(phrase);
        await this.sleep(this.pauseTime);
        await this.deleteText();
        await this.sleep(this.typingSpeed); // Jeda kecil sebelum kata berikutnya
      }
    } while (this.loop);
  }
}

// ==========================================
// CARA PENGGUNAAN (Inisialisasi)
// ==========================================

// Tunggu hingga seluruh elemen HTML (DOM) selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  const kumpulanTeks = [
    "Selamat Datang di Website Kami",
    "Jelajahi Koleksi Terbaik Sagala Aya",
    "Temukan Bacaan Favoritmu Hari Ini"
  ];

  const animator = new TextAnimator('animated-text', kumpulanTeks, {
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseTime: 2000,
    loop: true // Logika loop yang solid, tidak akan berhenti di tengah jalan
  });

  animator.start();
});