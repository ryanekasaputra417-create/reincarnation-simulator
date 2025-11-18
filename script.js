// --- DEKLARASI VARIABEL GLOBAL ---
let karakter = {};
let baseQiPerMeditasi = 10;
const ARTEFAK_WARISAN = ["Pedang Abadi", "Pil Fondasi Surga", "Manual Teknik Rahasia"];

// Tahapan Kultivasi yang Lebih Kompleks
const tahapKultivasi = [
    { nama: "Qi Condensation Level 1", qiMax: 100, bonusPemahaman: 0 },
    { nama: "Qi Condensation Level 2", qiMax: 200, bonusPemahaman: 1 },
    { nama: "Foundation Establishment", qiMax: 500, bonusPemahaman: 3 },
    { nama: "Golden Core", qiMax: 1000, bonusPemahaman: 5 },
    { nama: "Nascent Soul", qiMax: 2000, bonusPemahaman: 8 }
];

// --- FUNGSI UTILITY & UI ---

function updateUI() {
    const tahapSaatIni = tahapKultivasi[karakter.tahapIndex];
    document.getElementById('nama').textContent = karakter.nama;
    document.getElementById('tahap').textContent = tahapSaatIni.nama;
    document.getElementById('qi').textContent = karakter.qi;
    document.getElementById('qiMax').textContent = tahapSaatIni.qiMax;
    document.getElementById('akar').textContent = karakter.akarSpiritual;
    document.getElementById('karma').textContent = karakter.karma;
    
    // Update Stats Tambahan
    document.getElementById('pemahaman').textContent = karakter.stats.pemahaman;
    document.getElementById('keberuntungan').textContent = karakter.stats.keberuntungan;

    // Update Inventaris
    document.getElementById('inventaris').textContent = karakter.inventaris.length > 0 ? karakter.inventaris.join(', ') : 'Kosong';

    document.getElementById('aksi-panel').style.display = 'block';
}

function tampilkanNarasi(teks, opsi = []) {
    document.getElementById('narasi').innerHTML = `<p>${teks}</p>`;
    const opsiContainer = document.getElementById('opsi-container');
    opsiContainer.innerHTML = ''; 

    if (opsi.length === 0) {
        // Tombol Lanjutkan default
        const btnLanjut = document.createElement('button');
        btnLanjut.textContent = "Lanjutkan Kultivasi";
        btnLanjut.onclick = () => {
            tampilkanNarasi("Dunia terus berjalan...");
            updateUI(); 
        };
        opsiContainer.appendChild(btnLanjut);
    } else {
        // Tampilkan opsi dari event
        opsi.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt.teks;
            btn.onclick = opt.aksi;
            opsiContainer.appendChild(btn);
        });
    }
}

// --- FUNGSI INTI GAME ---

function cekLevelUp() {
    const tahapSaatIni = tahapKultivasi[karakter.tahapIndex];
    
    if (karakter.qi >= tahapSaatIni.qiMax) {
        if (karakter.tahapIndex < tahapKultivasi.length - 1) {
            karakter.tahapIndex++;
            karakter.qi = 0; 
            
            // Bonus stat dari naik tahap
            karakter.stats.pemahaman += tahapKultivasi[karakter.tahapIndex].bonusPemahaman;
            karakter.stats.keberuntungan += Math.floor(Math.random() * 2);

            tampilkanNarasi(`Selamat! Anda berhasil menembus ke tahap **${tahapKultivasi[karakter.tahapIndex].nama}**! Pemahaman Anda meningkat!`);
        } else {
            tampilkanNarasi("Anda telah mencapai Tahap Kultivasi Tertinggi di Alam Fana! Anda siap Ascend!");
            karakter.qi = tahapSaatIni.qiMax;
        }
    }
    updateUI();
}

function kultivasiAksi() {
    // Kecepatan kultivasi dipengaruhi oleh Pemahaman dan Akar Spiritual
    let bonusAkar = karakter.akarSpiritual.includes("Langit") ? 1.5 : 1.0;
    let bonusPemahaman = karakter.stats.pemahaman / 10;
    
    let qiDidapat = Math.floor(baseQiPerMeditasi * (1 + bonusAkar + bonusPemahaman));
    karakter.qi += qiDidapat;
    
    tampilkanNarasi(`Anda bermeditasi, menyerap **${qiDidapat}** Qi. Fokus Anda: ${karakter.stats.pemahaman}.`);
    cekLevelUp();
}

// --- FUNGSI REINKARNASI (Paling Kompleks) ---

function reinkarnasi() {
    const karmaFinal = karakter.karma + (karakter.tahapIndex * 50); // Karma berdasarkan level kultivasi
    
    let akarBaru = "Akar Spiritual Biasa";
    let efekLahir = "";
    
    // Logika Reinkarnasi Berdasarkan Karma
    if (karmaFinal >= 300) {
        akarBaru = "Akar Spiritual Langit Murni (Sangat Langka)";
        efekLahir = "Kebaikan Abadi Anda membawa Anda ke Keluarga Abadi.";
    } else if (karmaFinal >= 100) {
        akarBaru = "Akar Spiritual Tingkat Tinggi";
        efekLahir = "Anda lahir dengan bakat yang menjanjikan.";
    } else if (karmaFinal <= -100) {
        akarBaru = "Akar Spiritual Cacat/Besi (Sangat Buruk)";
        efekLahir = "Kejahatan Anda menyebabkan Anda lahir di Alam Fana yang penuh penderitaan.";
    } else {
        efekLahir = "Anda terlahir kembali di kondisi yang biasa saja.";
    }
    
    // Transfer Warisan
    let warisanDibawa = karakter.inventaris.find(item => ARTEFAK_WARISAN.includes(item));
    if (warisanDibawa) {
        efekLahir += ` Warisan **${warisanDibawa}** dari kehidupan lalu tersimpan dalam ingatan Anda.`;
    }

    // Reset Karakter Baru
    karakter = {
        nama: `Aing Reborn ${Math.floor(Math.random() * 99) + 1}`,
        tahapIndex: 0,
        qi: 0,
        karma: 0,
        akarSpiritual: akarBaru,
        stats: {
            pemahaman: 5 + (akarBaru.includes("Langit") ? 5 : 0),
            keberuntungan: 5
        },
        inventaris: warisanDibawa ? [warisanDibawa] : []
    };

    tampilkanNarasi(`**Anda telah mati!** Total Karma: **${karmaFinal}**. ${efekLahir} Anda terlahir kembali!`);
    updateUI();
}

// --- SISTEM EVENT & GACHA (Monetisasi Simulasi) ---

function gachaWarisan() {
    tampilkanNarasi("Anda menggunakan **Kristal Roh Agung (KRA)** untuk membuka Peti Warisan Leluhur!");

    const peluang = Math.random();
    
    if (peluang < 0.1) {
        // Sangat Langka (10%)
        const artefak = ARTEFAK_WARISAN[Math.floor(Math.random() * ARTEFAK_WARISAN.length)];
        karakter.inventaris.push(artefak);
        tampilkanNarasi(`🎉 **FANTASTIS!** Anda mendapatkan Artefak Warisan **${artefak}**! Ini akan ikut dalam reinkarnasi Anda!`, [
            { teks: "Ambil Warisan", aksi: updateUI }
        ]);
    } else if (peluang < 0.4) {
        // Sedang (30%)
        karakter.qi += 200;
        tampilkanNarasi(`Anda mendapatkan 200 Qi Murni Instan!`);
    } else {
        // Biasa (60%)
        karakter.stats.keberuntungan += 1;
        tampilkanNarasi(`Anda mendapatkan Pil Keberuntungan kecil. Keberuntungan +1.`);
    }
    updateUI();
}

function eventAcak() {
    const chance = Math.random();

    if (chance < 0.3) {
        // Event Karma (Pilihan Moral)
        tampilkanNarasi("Seorang kultivator lemah dirampok oleh Bandit. Apa yang Anda lakukan?", [
            {
                teks: "Lindungi Kultivator & Hajar Bandit (+Karma, -Risiko)",
                aksi: () => {
                    karakter.karma += 25;
                    tampilkanNarasi("Anda menyelamatkan kultivator itu. Nama baik Anda menyebar.");
                    updateUI();
                }
            },
            {
                teks: "Gabung Bandit & Rampok Korban (-Karma, +Qi)",
                aksi: () => {
                    karakter.karma -= 20;
                    karakter.qi += 50;
                    tampilkanNarasi("Anda mengambil harta korban. Jalur iblis memberikan keuntungan cepat.");
                    updateUI();
                }
            }
        ]);
    } else if (chance < 0.6) {
        // Event Risiko & Reward (Dipengaruhi Keberuntungan)
        const risiko = 15 - karakter.stats.keberuntungan; // Keberuntungan mengurangi risiko
        if (Math.random() * 100 < risiko) {
            tampilkanNarasi("Anda memasuki Gua Misterius, tetapi jebakan kuno melukai Anda! Anda kehilangan 50 Qi.", [
                { teks: "Terima Nasib", aksi: () => { 
                    karakter.qi = Math.max(0, karakter.qi - 50); 
                    if (karakter.qi === 0) reinkarnasi(); // Mati jika Qi habis
                    updateUI(); 
                } }
            ]);
        } else {
            tampilkanNarasi("Anda memasuki Gua Misterius! Berkat Keberuntungan Anda, Anda menemukan Manual Rahasia!", [
                { teks: "Dapatkan Pemahaman", aksi: () => { 
                    karakter.stats.pemahaman += 2; 
                    tampilkanNarasi("Pemahaman Anda tentang Dao meningkat pesat!");
                    updateUI(); 
                } }
            ]);
        }
    } else {
        // Event Biasa
        tampilkanNarasi("Anda bertemu rekan kultivator yang menawarkan sesi meditasi ganda. Qi +50.");
        karakter.qi += 50;
        cekLevelUp();
    }
}

// --- INISIALISASI GAME ---

function mulaiGame() {
    // Inisialisasi Karakter Awal saat game pertama kali dibuka
    karakter = {
        nama: "Aing Sang Kultivator",
        tahapIndex: 0,
        qi: 50,
        karma: 0,
        akarSpiritual: "Akar Spiritual Biasa",
        stats: {
            pemahaman: 5,
            keberuntungan: 5
        },
        inventaris: []
    };

    tampilkanNarasi("Anda terlahir kembali di Alam Fana. Anda harus berkultivasi untuk mencapai keabadian. Hati-hati dengan Karma!");
    updateUI();
}

// Mulai Game saat halaman dimuat
mulaiGame();
