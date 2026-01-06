document.addEventListener('DOMContentLoaded', () => {
   
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    

    const moodSelector = document.getElementById('mood-selector');
    const saveButton = document.getElementById('save-mood-btn');
    const moodMessage = document.getElementById('mood-message');

    const getMoodData = () => {
        const data = localStorage.getItem('teenThriveMoods');
        return data ? JSON.parse(data) : {};
    };

    const saveMoodData = (date, score) => {
        const moods = getMoodData();
        moods[date] = score;
        localStorage.setItem('teenThriveMoods', JSON.stringify(moods));
    };

    
    saveButton.addEventListener('click', () => {
        const moodScore = parseInt(moodSelector.value);
        const today = new Date().toISOString().split('T')[0]; 
        saveMoodData(today, moodScore);
        moodMessage.textContent = `Mood hari ini (${today}) telah dicatat! (${moodSelector.options[moodSelector.selectedIndex].text})`;

        
        renderMoodChart();
    });

    

    let moodChartInstance = null; 

    const renderMoodChart = () => {
        const moods = getMoodData();
        const MAX_DAYS = 7;
        const labels = [];
        const dataScores = [];

        
        for (let i = MAX_DAYS - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const displayLabel = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

            labels.push(displayLabel);
            dataScores.push(moods[dateStr] || 3); 
        }

        const ctx = document.getElementById('moodChart').getContext('2d');


        if (moodChartInstance) {
            moodChartInstance.destroy();
        }

        moodChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skor Mood Harian (1-5)',
                    data: dataScores,
                    borderColor: '#0077b6', 
                    backgroundColor: 'rgba(0, 119, 182, 0.2)', 
                    tension: 0.4, 
                    fill: true,
                    pointRadius: 6,
                    pointBackgroundColor: '#0096c7'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 1,
                        max: 5,
                        stepSize: 1,
                        title: {
                            display: true,
                            text: 'Skor Mood'
                        },
                        
                        ticks: {
                            callback: function(value, index, ticks) {
                                const moodMap = {
                                    1: 'Terrible 😭', 
                                    2: 'Bad 😟', 
                                    3: 'Okay 👌', 
                                    4: 'Good 👍', 
                                    5: 'Awesome! 🤩'
                                };
                                return moodMap[value];
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    };

    
    renderMoodChart();
});


    

    const diaryEntry = document.getElementById('diary-entry');
    const saveDiaryBtn = document.getElementById('save-diary-btn');
    const diaryList = document.getElementById('diary-list');
    const diaryStatus = document.getElementById('diary-status');

    
    const getDiaryEntries = () => {
        const data = localStorage.getItem('teenThriveDiary');
        return data ? JSON.parse(data) : [];
    };

    
    saveDiaryBtn.addEventListener('click', () => {
        const entryText = diaryEntry.value.trim();
        if (entryText === "") {
            diaryStatus.textContent = "Jurnal tidak boleh kosong!";
            diaryStatus.style.color = '#ff4b4b';
            return;
        }

        const today = new Date();
        const formattedDate = today.toLocaleDateString('id-ID', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });

       
        const newEntry = {
            date: formattedDate,
            entry: entryText
        };

        const existingEntries = getDiaryEntries();
        
      
        existingEntries.unshift(newEntry); 

        localStorage.setItem('teenThriveDiary', JSON.stringify(existingEntries));
        
        diaryEntry.value = ""; 
        diaryStatus.textContent = `Jurnal (${formattedDate}) berhasil disimpan!`;
        diaryStatus.style.color = '#0077b6';

        renderDiaryList();
    });
    
    const renderDiaryList = () => {
        const entries = getDiaryEntries();
        diaryList.innerHTML = ''; 

        if (entries.length === 0) {
            diaryList.innerHTML = '<li>Belum ada entri jurnal yang tersimpan. Mulai tulis sekarang!</li>';
            return;
        }

        entries.slice(0, 5).forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="diary-date">${item.date}</span> ${item.entry.substring(0, 150)}...`;
            diaryList.appendChild(li);
        });
    };

    renderDiaryList(); 



function register() {
    // 1. Cari elemen SAAT tombol diklik (Lebih aman)
    var x = document.getElementById("loginForm");
    var y = document.getElementById("register");
    var z = document.getElementById("btn");
    var title = document.getElementById("form-title");

    // 2. Cek apakah elemen ada?
    if (x && y && z && title) {
        x.style.left = "-400px";
        y.style.left = "50px";
        z.style.left = "110px";
        title.innerHTML = "Form Registrasi"; 
    } else {
        console.error("Elemen tidak ditemukan! Cek ID di HTML.");
    }
}

function login() {
    // 1. Cari elemen SAAT tombol diklik
    var x = document.getElementById("loginForm");
    var y = document.getElementById("register");
    var z = document.getElementById("btn");
    var title = document.getElementById("form-title");

    // 2. Cek apakah elemen ada?
    if (x && y && z && title) {
        x.style.left = "50px";   
        y.style.left = "450px";  
        z.style.left = "0";      
        title.innerHTML = "Form Login"; 
    } else {
        console.error("Elemen tidak ditemukan! Cek ID di HTML.");
    }
}


function prosesLogin(event) {
    // 1. Cegah reload
    event.preventDefault();

    // 2. Tampilkan SweetAlert khusus Login
    Swal.fire({
        title: 'Login Berhasil!',               // Judul beda
        text: 'Selamat datang kembali!',        // Pesan beda
        icon: 'success',
        confirmButtonText: 'Masuk ke Dashboard',
        confirmButtonColor: '#3085d6',
    }).then((result) => {
        if (result.isConfirmed) {
            // 3. Arahkan ke halaman utama
            window.location.href = "index.html"; 
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    const myContactForm = document.getElementById('contactForm');

    if (myContactForm) {
        
        myContactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Cegah refresh

            // Cari Modal Success Contact
            // Pastikan ID modal di HTML Contact Us adalah 'successModal'
            var contactModalElement = document.getElementById('successModal');
            
            if (contactModalElement) {
                var modalContact = new bootstrap.Modal(contactModalElement);
                modalContact.show();
                
                // Reset form setelah submit
                myContactForm.reset();
            } else {
                console.warn("Modal Contact tidak ditemukan di HTML.");
            }
        });
    }

});
// File: script.js

// File: script.js

function prosesRegistrasi(event) {
    // 1. Mencegah form reload halaman (WAJIB)
    event.preventDefault();

    // Cek di console apakah fungsi terpanggil
    console.log("Fungsi registrasi berjalan...");

    // 2. Tampilkan SweetAlert
    Swal.fire({
        title: 'Registrasi Berhasil!',
        text: 'Selamat datang di Mind Space.',
        icon: 'success',
        confirmButtonText: 'Lanjut ke Beranda',
        confirmButtonColor: '#3085d6',
    }).then((result) => {
        if (result.isConfirmed) {
            // Aksi setelah user klik tombol OK di popup
            
            // Opsi A: Jika ingin reload halaman agar form bersih
            window.location.href = "index.html"; 

            // Opsi B: Jika ingin pindah ke tampilan login (panggil fungsi login Anda)
            // login();
        }
    });
}