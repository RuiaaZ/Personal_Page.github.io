document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-link');
            const pages = document.querySelectorAll('.page');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navLinksContainer = document.querySelector('.nav-links');
            const hobbyBtns = document.querySelectorAll('.hobby-btn');
            const hobbySections = document.querySelectorAll('.hobby-section');
            
            // 确保每个页面从顶部开始
            function scrollToTop() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            
            // 初始化页面显示
            function initPages() {
                pages.forEach(page => page.classList.remove('active'));
                document.getElementById('home').classList.add('active');
                scrollToTop();
            }
            
            initPages();
            
            // 页面切换
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetPage = this.getAttribute('data-page');
                    
                    // 更新活动导航链接
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 显示目标页面
                    pages.forEach(page => {
                        page.classList.remove('active');
                        if (page.id === targetPage) {
                            setTimeout(() => {
                                page.classList.add('active');
                                scrollToTop(); // 确保从页面顶部开始
                            }, 10);
                        }
                    });
                    
                    // 关闭移动菜单
                    navLinksContainer.classList.remove('active');
                    
                    // 如果是技能页面，初始化进度条动画
                    if(targetPage === 'skills') {
                        animateSkillBars();
                    }
                    
                    // 如果是兴趣爱好页面，初始化音乐播放器
                    if(targetPage === 'hobbies') {
                        initMusicPlayer();
                    }
                });
            });
            
            // 移动菜单切换
            mobileMenuBtn.addEventListener('click', function() {
                navLinksContainer.classList.toggle('active');
            });
            
            // 兴趣爱好切换
            hobbyBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const hobby = this.getAttribute('data-hobby');
                    
                    // 更新活动按钮
                    hobbyBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 显示目标爱好区域
                    hobbySections.forEach(section => {
                        section.classList.remove('active');
                        if (section.id === hobby) {
                            section.classList.add('active');
                        }
                    });
                    
                    // 如果是音乐部分，初始化播放器
                    if(hobby === 'music') {
                        initMusicPlayer();
                    }
                });
            });
            
            // 技能条动画
            function animateSkillBars() {
                const skillBars = document.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                });
            }
            
            // 音乐播放器功能
            function initMusicPlayer() {
				function formatTime(time) {
				    const minutes = Math.floor(time / 60);
				    const seconds = Math.floor(time % 60);
				    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
				}
				
                const audio = new Audio();
                const playPauseBtn = document.querySelector('.play-pause-btn');
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
                
                // 加载歌曲
                function loadSong(index) {
                    const song = playlistItems[index];
                    const src = song.getAttribute('data-src');
                    const title = song.querySelector('h4').textContent;
                    const artist = song.querySelector('p').textContent;
                    
                    audio.src = src;
                    currentSongEl.textContent = title;
                    currentArtistEl.textContent = artist;
                    
                    // 更新活动播放列表项
                    playlistItems.forEach(item => item.classList.remove('active'));
                    song.classList.add('active');
                    
                    // 播放歌曲
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
					
					// 歌曲加载完后显示总时长
					audio.addEventListener('loadedmetadata', () => {
					    durationEl.textContent = formatTime(audio.duration);
					    currentTimeEl.textContent = "0:00"; // 每次切歌初始化
					});
                }
                
                // 播放/暂停
                function playPauseSong() {
                    if (audio.paused) {
                        audio.play();
                        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    } else {
                        audio.pause();
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }
                
                // 上一曲
                function prevSong() {
                    currentSongIndex--;
                    if (currentSongIndex < 0) {
                        currentSongIndex = playlistItems.length - 1;
                    }
                    loadSong(currentSongIndex);
                }
                
                // 下一曲
                function nextSong() {
                    currentSongIndex++;
                    if (currentSongIndex > playlistItems.length - 1) {
                        currentSongIndex = 0;
                    }
                    loadSong(currentSongIndex);
                }
                
                // 更新进度条
                function updateProgress(e) {
                    const { duration, currentTime } = e.srcElement;
                    const progressPercent = (currentTime / duration) * 100;
                    progress.style.width = `${progressPercent}%`;
                    
                    // 更新时间显示
                        currentTimeEl.textContent = formatTime(currentTime);
                        durationEl.textContent = formatTime(duration); // 实时刷新右边总时长
                }
                
                // 设置进度
                function setProgress(e) {
                    const width = this.clientWidth;
                    const clickX = e.offsetX;
                    const duration = audio.duration;
                    
                    audio.currentTime = (clickX / width) * duration;
                }
                
                // 设置音量
                function setVolume(e) {
                    const width = this.clientWidth;
                    const clickX = e.offsetX;
                    const volume = clickX / width;
                    
                    audio.volume = volume;
                    volumeProgress.style.width = `${volume * 100}%`;
                }
                
                // 点击播放列表项
                playlistItems.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        currentSongIndex = index;
                        loadSong(currentSongIndex);
                    });
                });
                
                // 事件监听器
                playPauseBtn.addEventListener('click', playPauseSong);
                prevBtn.addEventListener('click', prevSong);
                nextBtn.addEventListener('click', nextSong);
                audio.addEventListener('timeupdate', updateProgress);
                progressContainer.addEventListener('click', setProgress);
                volumeSlider.addEventListener('click', setVolume);
                audio.addEventListener('ended', nextSong);
                
                // 初始化第一首歌
                loadSong(0);
            }
            
            // 表单提交
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fas fa-check"></i> 发送成功';
                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            contactForm.reset();
                        }, 2000);
                    }, 1500);
                });
            }
            
            // 页面加载时初始化
            if(document.getElementById('skills').classList.contains('active')) {
                animateSkillBars();
            }
            
            if(document.getElementById('hobbies').classList.contains('active')) {
                initMusicPlayer();
            }
        });