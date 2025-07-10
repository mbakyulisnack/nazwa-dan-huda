document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scroll for "Lihat Detail Acara" button
    document.querySelector('.btn-scroll').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Countdown Timer
    const countdownElement = document.getElementById('countdown');
    const weddingDate = new Date("February 14, 2026 09:00:00").getTime(); // Set your wedding date and time here

    const updateCountdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (countdownElement) {
            if (distance < 0) {
                clearInterval(updateCountdown);
                countdownElement.innerHTML = "Acara Telah Dimulai!";
            } else {
                countdownElement.innerHTML = `
                    <span>${days}<div>Hari</div></span>
                    <span>${hours}<div>Jam</div></span>
                    <span>${minutes}<div>Menit</div></span>
                    <span>${seconds}<div>Detik</div></span>
                `;
            }
        }
    }, 1000);

    // Dynamic Butterfly Animation
    const butterfliesContainer = document.getElementById('butterflies');
    const numberOfButterflies = 5;
    const butterflyImage = 'https://imgur.com/kS9E1S4.png'; // Link gambar kupu-kupu dari Imgur

    function createButterfly() {
        const butterfly = document.createElement('div');
        butterfly.classList.add('butterfly');
        butterfly.style.backgroundImage = `url('${butterflyImage}')`;

        const startX = Math.random() * window.innerWidth * 0.8 - window.innerWidth * 0.1;
        const startY = Math.random() * window.innerHeight * 0.2 + window.innerHeight * 0.2;
        const animationDelay = Math.random() * 10 + 's';
        const animationDuration = 15 + Math.random() * 10 + 's';

        butterfly.style.left = `${startX}px`;
        butterfly.style.top = `${startY}px`;
        butterfly.style.animationDelay = animationDelay;
        butterfly.style.animationDuration = animationDuration;
        
        butterfliesContainer.appendChild(butterfly);

        butterfly.addEventListener('animationend', () => {
            butterfly.remove();
            createButterfly();
        });
    }

    for (let i = 0; i < numberOfButterflies; i++) {
        createButterfly();
    }

    // Music Player Logic
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicControl = document.getElementById('musicControl');
    const musicIcon = musicControl.querySelector('.icon-music');
    const musicText = musicControl.querySelector('.music-text');

    let isPlaying = false;

    // Try to autoplay the music on first user interaction (e.g., any click on the body)
    document.body.addEventListener('click', function initialPlay() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                isPlaying = true;
                musicControl.classList.add('playing');
                musicIcon.classList.remove('fa-music', 'fa-play');
                musicIcon.classList.add('fa-pause');
                musicText.textContent = 'Pause Music';
                document.body.removeEventListener('click', initialPlay); // Remove listener after successful play
            }).catch(error => {
                console.warn('Autoplay prevented or failed on first click:', error);
                isPlaying = false;
                musicControl.classList.remove('playing');
                musicIcon.classList.remove('fa-pause', 'fa-music');
                musicIcon.classList.add('fa-play');
                musicText.textContent = 'Play Music';
            });
        }
    }, { once: true });

    // Toggle music on click of the control button
    musicControl.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent body click event from re-triggering initialPlay
        if (isPlaying) {
            backgroundMusic.pause();
            isPlaying = false;
            musicControl.classList.remove('playing');
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-play');
            musicText.textContent = 'Play Music';
        } else {
            backgroundMusic.play().then(() => {
                isPlaying = true;
                musicControl.classList.add('playing');
                musicIcon.classList.remove('fa-play');
                musicIcon.classList.add('fa-pause');
                musicText.textContent = 'Pause Music';
            }).catch(error => {
                console.error('Failed to play music on button click:', error);
                alert('Tidak bisa memutar musik. Browser Anda mungkin memblokir pemutaran otomatis.');
            });
        }
    });

    // Copy to Clipboard for Digital Gifts
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.dataset.text;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Disalin!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 1500); // Revert text after 1.5 seconds
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Gagal menyalin. Silakan salin secara manual: ' + textToCopy);
            });
        });
    });

    // Combined RSVP & Greeting Form Logic
    const combinedForm = document.getElementById('combined-form');
    const formStatus = document.getElementById('form-status');
    const ucapanList = document.getElementById('ucapan-list');

    // Load existing data from Local Storage
    let greetings = JSON.parse(localStorage.getItem('weddingGreetings')) || [];
    renderGreetings(); // Render greetings on load

    // Optionally load previous RSVP data to pre-fill the form
    let rsvpData = JSON.parse(localStorage.getItem('weddingRSVP')) || null;
    if (rsvpData) {
        document.getElementById('full-nama').value = rsvpData.nama || '';
        document.getElementById('kehadiran').value = rsvpData.kehadiran || '';
        document.getElementById('jumlah').value = rsvpData.jumlah || 1;
        document.getElementById('pesan').value = rsvpData.pesan || '';
        formStatus.textContent = `Anda telah mengkonfirmasi sebagai: ${rsvpData.kehadiran === 'hadir' ? 'Akan Hadir' : 'Tidak Dapat Hadir'} (${rsvpData.jumlah} orang). Terima kasih!`;
        formStatus.style.color = 'green';
    }

    combinedForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nama = document.getElementById('full-nama').value;
        const kehadiran = document.getElementById('kehadiran').value;
        const jumlah = document.getElementById('jumlah').value;
        const pesan = document.getElementById('pesan').value;

        if (nama && kehadiran && jumlah && pesan) {
            const newEntry = {
                nama: nama,
                kehadiran: kehadiran,
                jumlah: parseInt(jumlah),
                pesan: pesan,
                timestamp: new Date().toLocaleString()
            };

            // Save RSVP data separately (for pre-filling form on return visit)
            localStorage.setItem('weddingRSVP', JSON.stringify({
                nama: nama,
                kehadiran: kehadiran,
                jumlah: parseInt(jumlah),
                pesan: pesan
            }));

            // Add to greetings list
            greetings.unshift(newEntry); // Add to the beginning of the array
            localStorage.setItem('weddingGreetings', JSON.stringify(greetings)); // Save to Local Storage

            renderGreetings(); // Re-render the list

            formStatus.textContent = `Konfirmasi kehadiran dan ucapan Anda berhasil terkirim!`;
            formStatus.style.color = 'green';
            alert('Konfirmasi kehadiran dan ucapan Anda berhasil dikirim!');

            // Clear the form fields, except for name if you want to keep it
            // combinedForm.reset();
            // Or clear specific fields:
            document.getElementById('kehadiran').value = '';
            document.getElementById('jumlah').value = 1;
            document.getElementById('pesan').value = '';

            // For future SQL integration:
            // Here you would send `newEntry` to your backend server
            // fetch('/api/rsvp-greeting', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(newEntry)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     console.log('RSVP and greeting submitted to server:', data);
            //     // Update UI based on server response if needed
            // })
            // .catch(error => {
            //     console.error('Error submitting RSVP and greeting:', error);
            //     // alert('Gagal mengirim konfirmasi ke server. Mohon coba lagi.');
            // });

        } else {
            formStatus.textContent = 'Mohon lengkapi semua bidang yang wajib diisi.';
            formStatus.style.color = 'red';
        }
    });

    // Re-using renderGreetings for combined form data display
    function renderGreetings() {
        ucapanList.innerHTML = ''; // Clear current list
        if (greetings.length === 0) {
            ucapanList.innerHTML = '<p class="note">Belum ada ucapan. Jadilah yang pertama mengkonfirmasi kehadiran atau mengirim ucapan!</p>';
        } else {
            greetings.forEach(function(entry) {
                const ucapanItem = document.createElement('div');
                ucapanItem.classList.add('ucapan-item');
                // Displaying presence status along with greeting
                const kehadiranText = entry.kehadiran === 'hadir' ? 'Akan Hadir' : 'Tidak Dapat Hadir';
                ucapanItem.innerHTML = `
                    <strong>${entry.nama}</strong> <small>(${entry.timestamp}) - ${kehadiranText} (${entry.jumlah} orang)</small>
                    <p>${entry.pesan}</p>
                `;
                ucapanList.appendChild(ucapanItem);
            });
        }
    }
});