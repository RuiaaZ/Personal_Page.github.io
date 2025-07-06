
let audio;
let playPauseBtn;
let musicPlayerInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.querySelector('.nav-links');
    const hobbyBtns = document.querySelectorAll('.hobby-btn');
    const hobbySections = document.querySelectorAll('.hobby-section');

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function initPages() {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById('home').classList.add('active');
        scrollToTop();
    }
    initPages();

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetPage = this.getAttribute('data-page');

            // 停止音乐播放
            if (audio && !audio.paused) {
                audio.pause();
                audio.currentTime = 0;
                if (playPauseBtn) {
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            }

            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPage) {
                    setTimeout(() => {
                        page.classList.add('active');
                        scrollToTop();
                    }, 10);
                }
            });

            if (targetPage === 'skills') {
                animateSkillBars();
            }

            if (targetPage === 'hobbies' && !musicPlayerInitialized) {
                initMusicPlayer();
                musicPlayerInitialized = true;
            }

            navLinksContainer.classList.remove('active');
        });
    });

    mobileMenuBtn.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
    });

    hobbyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const hobby = this.getAttribute('data-hobby');
            hobbyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            hobbySections.forEach(section => {
                section.classList.remove('active');
                if (section.id === hobby) {
                    section.classList.add('active');
                }
            });

            if (hobby === 'music' && !musicPlayerInitialized) {
                initMusicPlayer();
                musicPlayerInitialized = true;
            }
        });
    });

    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    }

    function initMusicPlayer() {
        audio = new Audio();
        playPauseBtn = document.querySelector('.play-pause-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const progress = document.getElementById('progress');
        const progressContainer = document.querySelector('.progress-container');
        const currentTimeEl = document.getElementById('current-time');
        const durationEl = document.getElementById('duration');
        const volumeProgress = document.getElementById('volume-progress');
        const volumeSlider = document.querySelector('.volume-slider');
        const playlistItems = document.querySelectorAll('.playlist-item');
        const currentSongEl = document.getElementById('current-song');
        const currentArtistEl = document.getElementById('current-artist');

        let currentSongIndex = 0;

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }

        function loadSong(index) {
            const song = playlistItems[index];
            const src = song.getAttribute('data-src');
            const title = song.querySelector('h4').textContent;
            const artist = song.querySelector('p').textContent;

            audio.src = src;
            currentSongEl.textContent = title;
            currentArtistEl.textContent = artist;
            playlistItems.forEach(item => item.classList.remove('active'));
            song.classList.add('active');
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            audio.addEventListener('loadedmetadata', () => {
                durationEl.textContent = formatTime(audio.duration);
                currentTimeEl.textContent = "0:00";
            });
        }

        function playPauseSong() {
            if (audio.paused) {
                audio.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }

        function prevSong() {
            currentSongIndex = (currentSongIndex - 1 + playlistItems.length) % playlistItems.length;
            loadSong(currentSongIndex);
        }

        function nextSong() {
            currentSongIndex = (currentSongIndex + 1) % playlistItems.length;
            loadSong(currentSongIndex);
        }

        function updateProgress(e) {
            const { duration, currentTime } = e.srcElement;
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(currentTime);
            durationEl.textContent = formatTime(duration);
        }

        function setProgress(e) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            audio.currentTime = (clickX / width) * duration;
        }

        function setVolume(e) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const volume = clickX / width;
            audio.volume = volume;
            volumeProgress.style.width = `${volume * 100}%`;
        }

        playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
            });
        });

        playPauseBtn.addEventListener('click', playPauseSong);
        prevBtn.addEventListener('click', prevSong);
        nextBtn.addEventListener('click', nextSong);
        audio.addEventListener('timeupdate', updateProgress);
        progressContainer.addEventListener('click', setProgress);
        volumeSlider.addEventListener('click', setVolume);
        audio.addEventListener('ended', nextSong);

        loadSong(0);
    }
});
