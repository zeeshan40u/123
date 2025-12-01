// Reels data
const reelsData = [
    {
        id: 1,
        username: "adventure.seeker",
        userInitial: "A",
        caption: "Chasing sunsets and making memories ✨ #Travel #Adventure",
        music: "Original Sound - adventure.seeker",
        likes: 12500,
        comments: 342,
        shares: 89,
        videoUrl: "reels/video1.mp4"
    },
    {
        id: 2,
        username: "tech.guru",
        userInitial: "T",
        caption: "The future is here! New tech innovations that will blow your mind 🤯 #Tech #Innovation",
        music: "Future Sound - tech.guru",
        likes: 8900,
        comments: 210,
        shares: 45,
        videoUrl: "reels/video2.mp4"
    },
    {
        id: 3,
        username: "fitness.motivation",
        userInitial: "F",
        caption: "Morning workout routine that will change your day! 💪 #Fitness #Motivation",
        music: "Workout Mix - fitness.motivation",
        likes: 15600,
        comments: 512,
        shares: 120,
        videoUrl: "reels/video3.mp4"
    },
    {
        id: 4,
        username: "food.explorer",
        userInitial: "F",
        caption: "Trying the spiciest noodles in town! 🌶️ Can you handle it? #Food #Challenge",
        music: "Spicy Beat - food.explorer",
        likes: 9800,
        comments: 289,
        shares: 67,
        videoUrl: "reels/video4.mp4"
    },
    {
        id: 5,
        username: "art.daily",
        userInitial: "A",
        caption: "From sketch to masterpiece 🎨 The creative process is magical! #Art #Creative",
        music: "Artistic Vibes - art.daily",
        likes: 11200,
        comments: 398,
        shares: 92,
        videoUrl: "reels/video5.mp4"
    }
];

// State
let currentReelIndex = 0;
let likedReels = JSON.parse(localStorage.getItem('likedReels') || '{}');
let isMuted = true;
let isMusicEnabled = false;

// Update time
function updateTime() {
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        currentTimeElement.textContent = `${hours}:${minutes}`;
    }
}

// Load reels
function loadReels() {
    const reelsContainer = document.getElementById('reelsContainer');
    if (!reelsContainer) return;

    reelsContainer.innerHTML = '';

    reelsData.forEach((reel, index) => {
        const reelItem = document.createElement('div');
        reelItem.className = 'reel-item';
        reelItem.id = `reel-${reel.id}`;
        
        reelItem.innerHTML = `
            <video class="reel-video" id="video-${reel.id}" playsinline webkit-playsinline preload="metadata" muted loop>
                <source src="${reel.videoUrl}" type="video/mp4">
            </video>
            
            <button class="play-pause-btn" onclick="togglePlayPause(${reel.id})">▶️</button>
            
            <button class="music-btn" onclick="toggleMusic()">${isMusicEnabled ? '🎵' : '🔇'}</button>
            
            <button class="volume-btn" onclick="toggleMute(${reel.id})">${isMuted ? '🔇' : '🔊'}</button>
            
            <div class="video-controls">
                <div class="reel-info">
                    <div class="reel-user">
                        <div class="user-avatar">${reel.userInitial}</div>
                        <div class="user-info">
                            <h4>${reel.username}</h4>
                            <p onclick="followUser('${reel.username}')">Follow</p>
                        </div>
                    </div>
                    <div class="reel-caption">${reel.caption}</div>
                    <div class="reel-music">
                        <span>🎵</span>
                        <span>${reel.music}</span>
                    </div>
                </div>
                
                <div class="control-buttons">
                    <div>
                        <button class="control-btn ${likedReels[reel.id] ? 'liked' : ''}" onclick="toggleLike(${reel.id})">
                            ${likedReels[reel.id] ? '❤️' : '🤍'}
                        </button>
                        <div class="count" id="like-count-${reel.id}">${formatNumber(reel.likes)}</div>
                    </div>
                    
                    <div>
                        <button class="control-btn" onclick="openComments(${reel.id})">
                            💬
                        </button>
                        <div class="count">${formatNumber(reel.comments)}</div>
                    </div>
                    
                    <div>
                        <button class="control-btn" onclick="shareReel(${reel.id})">
                            📤
                        </button>
                        <div class="count">${formatNumber(reel.shares)}</div>
                    </div>
                </div>
            </div>
        `;

        reelsContainer.appendChild(reelItem);
        
        // Setup video event listeners
        const video = document.getElementById(`video-${reel.id}`);
        if (video) {
            video.addEventListener('play', () => {
                const playBtn = reelItem.querySelector('.play-pause-btn');
                if (playBtn) playBtn.textContent = '⏸️';
            });
            
            video.addEventListener('pause', () => {
                const playBtn = reelItem.querySelector('.play-pause-btn');
                if (playBtn) playBtn.textContent = '▶️';
            });
        }
    });

    // Start first video
    setTimeout(() => {
        const firstVideo = document.getElementById('video-1');
        if (firstVideo) {
            firstVideo.play().catch(e => console.log('Auto-play prevented'));
        }
    }, 1000);
}

// Format numbers
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Toggle play/pause
function togglePlayPause(reelId) {
    const video = document.getElementById(`video-${reelId}`);
    if (!video) return;

    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

// Toggle mute
function toggleMute(reelId) {
    const video = document.getElementById(`video-${reelId}`);
    if (!video) return;

    video.muted = !video.muted;
    isMuted = video.muted;
    
    const volumeBtn = document.querySelector(`#reel-${reelId} .volume-btn`);
    if (volumeBtn) {
        volumeBtn.textContent = video.muted ? '🔇' : '🔊';
    }
}

// Toggle music
function toggleMusic() {
    isMusicEnabled = !isMusicEnabled;
    
    // Update all videos volume
    reelsData.forEach(reel => {
        const video = document.getElementById(`video-${reel.id}`);
        if (video) {
            video.volume = isMusicEnabled ? 1.0 : 0.0;
        }
        
        // Update music button
        const musicBtn = document.querySelector(`#reel-${reel.id} .music-btn`);
        if (musicBtn) {
            musicBtn.textContent = isMusicEnabled ? '🎵' : '🔇';
        }
    });
}

// Toggle like
function toggleLike(reelId) {
    likedReels[reelId] = !likedReels[reelId];
    
    const reel = reelsData.find(r => r.id === reelId);
    const likeCount = document.getElementById(`like-count-${reelId}`);
    
    if (likedReels[reelId]) {
        reel.likes += 1;
    } else {
        reel.likes -= 1;
    }
    
    if (likeCount) {
        likeCount.textContent = formatNumber(reel.likes);
    }
    
    localStorage.setItem('likedReels', JSON.stringify(likedReels));
    
    // Update button state
    const likeBtn = document.querySelector(`#reel-${reelId} .control-btn`);
    if (likeBtn) {
        if (likedReels[reelId]) {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '❤️';
        } else {
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '🤍';
        }
    }
}

// Open comments
function openComments(reelId) {
    const modal = document.getElementById('commentModal');
    const commentsList = document.getElementById('commentsList');
    
    if (modal && commentsList) {
        commentsList.innerHTML = `
            <div class="comment-item">
                <div class="comment-avatar">A</div>
                <div class="comment-content">
                    <div class="comment-author">user1</div>
                    <div class="comment-text">This is amazing! 🔥</div>
                </div>
            </div>
            <div class="comment-item">
                <div class="comment-avatar">B</div>
                <div class="comment-content">
                    <div class="comment-author">user2</div>
                    <div class="comment-text">Love this content! ❤️</div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }
}

// Close comments
function closeComments() {
    const modal = document.getElementById('commentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Post comment
function postComment() {
    const commentInput = document.getElementById('commentInput');
    const commentsList = document.getElementById('commentsList');
    
    if (commentInput && commentInput.value.trim() && commentsList) {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-avatar">Y</div>
            <div class="comment-content">
                <div class="comment-author">you</div>
                <div class="comment-text">${commentInput.value}</div>
            </div>
        `;
        
        commentsList.appendChild(commentItem);
        commentInput.value = '';
    }
}

// Share reel
function shareReel(reelId) {
    const reel = reelsData.find(r => r.id === reelId);
    if (reel) {
        reel.shares += 1;
        alert(`Sharing reel by ${reel.username}`);
    }
}

// Follow user
function followUser(username) {
    alert(`Following ${username}`);
}

// Navigation functions
function openProfile() {
    window.location.href = '../profile/profile.html';
}

function openChats() {
    window.location.href = '../chats/chats.html';
}

// Check login status
function checkLoginStatus() {
    if (localStorage.getItem('instashan_logged_in') !== 'true') {
        window.location.href = '../index.html';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 60000);
    checkLoginStatus();
    loadReels();
    
    // Add scroll snapping
    const reelsContainer = document.getElementById('reelsContainer');
    if (reelsContainer) {
        let isScrolling = false;
        
        reelsContainer.addEventListener('scroll', function() {
            if (!isScrolling) {
                isScrolling = true;
                
                setTimeout(() => {
                    const scrollTop = reelsContainer.scrollTop;
                    const itemHeight = reelsContainer.scrollHeight / reelsData.length;
                    currentReelIndex = Math.round(scrollTop / itemHeight);
                    
                    // Pause all videos
                    reelsData.forEach(reel => {
                        const video = document.getElementById(`video-${reel.id}`);
                        if (video) video.pause();
                    });
                    
                    // Play current video
                    const currentVideo = document.getElementById(`video-${reelsData[currentReelIndex].id}`);
                    if (currentVideo) {
                        currentVideo.play().catch(e => console.log('Play prevented'));
                    }
                    
                    isScrolling = false;
                }, 100);
            }
        });
    }
    
    // Handle comment input
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                postComment();
            }
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('commentModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeComments();
            }
        });
    }
});