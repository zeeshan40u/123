// Reels data - 10 videos
var reelsData = [
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
    },
    {
        id: 6,
        username: "comedy.king",
        userInitial: "C",
        caption: "When you try to be serious but life has other plans 😂 #Comedy #Funny",
        music: "Comedy Theme - comedy.king",
        likes: 21000,
        comments: 890,
        shares: 210,
        videoUrl: "reels/video6.mp4"
    },
    {
        id: 7,
        username: "gaming.pro",
        userInitial: "G",
        caption: "Epic gaming moments that you shouldn't miss! 🎮 #Gaming #Epic",
        music: "Game Soundtrack - gaming.pro",
        likes: 18700,
        comments: 654,
        shares: 145,
        videoUrl: "reels/video7.mp4"
    },
    {
        id: 8,
        username: "nature.lover",
        userInitial: "N",
        caption: "Peaceful moments in nature 🌿 Sometimes you just need to disconnect #Nature #Peace",
        music: "Nature Sounds - nature.lover",
        likes: 9500,
        comments: 187,
        shares: 42,
        videoUrl: "reels/video8.mp4"
    },
    {
        id: 9,
        username: "dance.queen",
        userInitial: "D",
        caption: "New dance routine that's taking over TikTok! 💃 #Dance #Viral",
        music: "Trending Beat - dance.queen",
        likes: 24500,
        comments: 1023,
        shares: 310,
        videoUrl: "reels/video9.mp4"
    },
    {
        id: 10,
        username: "fashion.icon",
        userInitial: "F",
        caption: "Style tips that will elevate your fashion game! 👗 #Fashion #Style",
        music: "Fashion Show - fashion.icon",
        likes: 13400,
        comments: 456,
        shares: 98,
        videoUrl: "reels/video10.mp4"
    }
];

// State management
var currentReelIndex = 0;
var likedReels = JSON.parse(localStorage.getItem('likedReels') || '{}');
var followedUsers = JSON.parse(localStorage.getItem('followedUsers') || '{}');
var isSoundEnabled = localStorage.getItem('soundEnabled') === 'true';
var touchStartY = 0;
var scrollThreshold = 5;
var currentScrollCount = 0;
var isAnimating = false;
var wheelTimeout;

// Update time
function updateTime() {
    var currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes().toString().padStart(2, '0');
        currentTimeElement.textContent = hours + ':' + minutes;
    }
}

// Enable sound from loading screen
function enableSound() {
    isSoundEnabled = true;
    localStorage.setItem('soundEnabled', 'true');
    hideLoadingScreen();
}

// Hide loading screen and show main app
function hideLoadingScreen() {
    var loadingScreen = document.getElementById('loadingScreen');
    var mainApp = document.getElementById('mainApp');
    
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(function() {
            loadingScreen.style.display = 'none';
            if (mainApp) {
                mainApp.style.display = 'block';
                setTimeout(function() {
                    loadReels();
                }, 100);
            }
        }, 300);
    }
}

// Update video volume based on sound setting
function updateVideoVolume(video) {
    if (video) {
        video.volume = isSoundEnabled ? 1.0 : 0.0;
        video.muted = !isSoundEnabled;
    }
}

// Load ALL reels at once but only show current one
function loadReels() {
    var reelsContainer = document.getElementById('reelsContainer');
    if (!reelsContainer) return;

    reelsContainer.innerHTML = '';

    for (var i = 0; i < reelsData.length; i++) {
        var reel = reelsData[i];
        var reelItem = document.createElement('div');
        reelItem.className = 'reel-item';
        reelItem.id = 'reel-' + reel.id;
        
        // Check if user is followed
        var isFollowing = followedUsers[reel.username];
        
        reelItem.innerHTML = '\
            <video class="reel-video" id="video-' + reel.id + '" playsinline webkit-playsinline preload="metadata" muted loop>\
                <source src="' + reel.videoUrl + '" type="video/mp4">\
            </video>\
            \
            <div class="reel-bottom-overlay">\
                <!-- Left side: User info, caption, music -->\
                <div class="reel-left-info">\
                    <div class="reel-user-info">\
                        <div class="user-avatar">' + reel.userInitial + '</div>\
                        <div class="user-details">\
                            <h4>' + reel.username + '</h4>\
                            <button class="follow-btn ' + (isFollowing ? 'following' : '') + '" \
                                    onclick="toggleFollow(\'' + reel.username + '\', ' + reel.id + ')">\
                                ' + (isFollowing ? 'Following' : 'Follow') + '\
                            </button>\
                        </div>\
                    </div>\
                    <div class="reel-caption">' + reel.caption + '</div>\
                    <div class="reel-music">\
                        <span>🎵</span>\
                        <span>' + reel.music + '</span>\
                    </div>\
                </div>\
                \
                <!-- Right side: Action buttons -->\
                <div class="reel-right-actions">\
                    <div class="action-button">\
                        <button class="action-btn ' + (likedReels[reel.id] ? 'liked' : '') + '" onclick="toggleLike(' + reel.id + ')">\
                            ' + (likedReels[reel.id] ? '❤️' : '🤍') + '\
                        </button>\
                        <div class="action-count" id="like-count-' + reel.id + '">' + formatNumber(reel.likes) + '</div>\
                    </div>\
                    \
                    <div class="action-button">\
                        <button class="action-btn" onclick="openComments(' + reel.id + ')">\
                            💬\
                        </button>\
                        <div class="action-count">' + formatNumber(reel.comments) + '</div>\
                    </div>\
                    \
                    <div class="action-button">\
                        <button class="action-btn" onclick="shareReel(' + reel.id + ')">\
                            📤\
                        </button>\
                        <div class="action-count">' + formatNumber(reel.shares) + '</div>\
                    </div>\
                </div>\
            </div>\
        ';

        reelsContainer.appendChild(reelItem);

        // Setup video
        var video = document.getElementById('video-' + reel.id);
        if (video) {
            // Set initial volume
            updateVideoVolume(video);
            
            if (i === currentReelIndex) {
                reelItem.style.transform = 'translateY(0)';
                reelItem.style.opacity = '1';
                reelItem.style.display = 'block';
                reelItem.classList.add('active');
                
                // Auto-play only the current video
                setTimeout(function() {
                    video.play().catch(function(e) {
                        console.log('Auto-play prevented for video', reel.id);
                    });
                }, 500);
            } else {
                reelItem.style.transform = 'translateY(0)';
                reelItem.style.opacity = '0';
                reelItem.style.display = 'none';
            }
            reelItem.style.transition = 'none';
        }
    }

    setupScrolling();
    createPauseOverlay();
}

// Format numbers
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Setup scrolling with animation
function setupScrolling() {
    var reelsContainer = document.getElementById('reelsContainer');
    if (!reelsContainer) return;
    
    var touchStartTime = 0;
    var isDragging = false;
    var dragDistance = 0;
    
    // Reset wheel counter on idle
    function resetWheelCounter() {
        currentScrollCount = 0;
    }
    
    // Handle touch for mobile
    reelsContainer.addEventListener('touchstart', function(e) {
        if (isAnimating) return;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isDragging = true;
        dragDistance = 0;
    }, { passive: true });
    
    reelsContainer.addEventListener('touchmove', function(e) {
        if (!isDragging || isAnimating) return;
        
        var touchCurrentY = e.touches[0].clientY;
        dragDistance = touchStartY - touchCurrentY;
    }, { passive: true });
    
    reelsContainer.addEventListener('touchend', function(e) {
        if (!isDragging || isAnimating) return;
        
        var touchEndY = e.changedTouches[0].clientY;
        var diff = touchStartY - touchEndY;
        var timeDiff = Date.now() - touchStartTime;
        var velocity = Math.abs(diff) / timeDiff;
        
        // Trigger on quick swipes OR significant drags
        if ((Math.abs(diff) > 80 && timeDiff < 300) || // Quick swipe
            (Math.abs(diff) > 150 && velocity > 0.2)) { // Slow but long drag
            isDragging = false;
            
            // Determine direction
            var direction = diff > 0 ? 'down' : 'up';
            
            // Animate and change video
            animateScrollTransition(direction);
        } else {
            // Not enough movement, reset
            isDragging = false;
        }
    }, { passive: true });
    
    // Handle mouse wheel
    reelsContainer.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (isAnimating) return;
        
        // Clear previous timeout
        if (wheelTimeout) clearTimeout(wheelTimeout);
        
        // Increment counter
        currentScrollCount++;
        
        // Set timeout to reset counter
        wheelTimeout = setTimeout(resetWheelCounter, 500);
        
        // Check if threshold reached
        if (currentScrollCount >= scrollThreshold) {
            currentScrollCount = 0;
            
            // Determine direction
            var direction = e.deltaY > 0 ? 'down' : 'up';
            
            // Animate and change video
            animateScrollTransition(direction);
        }
    }, { passive: false });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isAnimating) return;
        
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            animateScrollTransition('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            animateScrollTransition('down');
        } else if (e.key === ' ') {
            e.preventDefault();
            togglePlayPause();
        }
    });
}

// Animate scroll transition
function animateScrollTransition(direction) {
    if (isAnimating) return;
    isAnimating = true;
    
    var currentReel = document.getElementById('reel-' + reelsData[currentReelIndex].id);
    if (!currentReel) {
        isAnimating = false;
        return;
    }
    
    // Calculate new index with proper looping
    var newIndex;
    if (direction === 'down') {
        // Scroll down - next video
        newIndex = currentReelIndex + 1;
        if (newIndex >= reelsData.length) {
            newIndex = 0;
        }
    } else {
        // Scroll up - previous video
        newIndex = currentReelIndex - 1;
        if (newIndex < 0) {
            newIndex = reelsData.length - 1;
        }
    }
    
    // Get next reel and video
    var nextReel = document.getElementById('reel-' + reelsData[newIndex].id);
    var currentVideo = document.getElementById('video-' + reelsData[currentReelIndex].id);
    var nextVideo = document.getElementById('video-' + reelsData[newIndex].id);
    
    if (!nextReel) {
        isAnimating = false;
        return;
    }
    
    // Add transition classes
    currentReel.classList.add('transitioning');
    nextReel.classList.add('transitioning');
    
    // Pause current video
    if (currentVideo) {
        currentVideo.pause();
        currentVideo.muted = true;
    }
    
    // Prepare next video
    if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.volume = isSoundEnabled ? 1.0 : 0.0;
        nextVideo.muted = !isSoundEnabled;
    }
    
    // Show next reel but position it off-screen
    nextReel.style.display = 'block';
    nextReel.style.zIndex = '5';
    nextReel.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease';
    
    // Set initial positions
    if (direction === 'down') {
        nextReel.style.transform = 'translateY(100%)';
        currentReel.style.transform = 'translateY(0)';
    } else {
        nextReel.style.transform = 'translateY(-100%)';
        currentReel.style.transform = 'translateY(0)';
    }
    
    nextReel.style.opacity = '1';
    currentReel.style.opacity = '1';
    currentReel.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease';
    
    // Force reflow to ensure styles are applied before animation
    nextReel.offsetHeight;
    
    // Animate
    requestAnimationFrame(function() {
        if (direction === 'down') {
            currentReel.style.transform = 'translateY(-100%)';
            nextReel.style.transform = 'translateY(0)';
        } else {
            currentReel.style.transform = 'translateY(100%)';
            nextReel.style.transform = 'translateY(0)';
        }
        
        currentReel.style.opacity = '0.5';
        
        // After animation completes
        setTimeout(function() {
            // Hide current reel completely
            currentReel.style.display = 'none';
            currentReel.style.transform = 'translateY(0)';
            currentReel.style.opacity = '1';
            currentReel.style.transition = 'none';
            currentReel.style.zIndex = '1';
            currentReel.classList.remove('transitioning');
            currentReel.classList.remove('active');
            
            // Reset next reel styles
            nextReel.style.transform = 'translateY(0)';
            nextReel.style.opacity = '1';
            nextReel.style.transition = 'none';
            nextReel.style.zIndex = '2';
            nextReel.classList.remove('transitioning');
            nextReel.classList.add('active');
            
            // Hide all other reels
            for (var i = 0; i < reelsData.length; i++) {
                if (i !== newIndex) {
                    var reelElement = document.getElementById('reel-' + reelsData[i].id);
                    if (reelElement && reelElement !== nextReel) {
                        reelElement.style.display = 'none';
                        reelElement.style.zIndex = '1';
                        reelElement.classList.remove('active');
                    }
                }
            }
            
            // Update current index
            currentReelIndex = newIndex;
            
            // Play next video
            if (nextVideo) {
                nextVideo.play().catch(function(e) {
                    console.log('Play prevented for video', reelsData[currentReelIndex].id);
                });
            }
            
            // Reset animation flag
            setTimeout(function() {
                isAnimating = false;
            }, 100);
        }, 500);
    });
}

// Toggle play/pause on single tap
function togglePlayPause() {
    var currentVideo = document.getElementById('video-' + reelsData[currentReelIndex].id);
    var pauseOverlay = document.querySelector('.pause-overlay');
    
    if (currentVideo) {
        if (currentVideo.paused) {
            currentVideo.play();
            if (pauseOverlay) {
                pauseOverlay.classList.remove('show');
            }
        } else {
            currentVideo.pause();
            if (pauseOverlay) {
                pauseOverlay.classList.add('show');
                
                // Auto hide pause overlay after 1.5 seconds
                setTimeout(function() {
                    if (pauseOverlay) {
                        pauseOverlay.classList.remove('show');
                    }
                }, 1500);
            }
        }
    }
}

// Create pause overlay element
function createPauseOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'pause-overlay';
    overlay.innerHTML = '<div class="pause-icon">⏸️</div>';
    
    var videoControls = document.createElement('div');
    videoControls.className = 'video-controls';
    videoControls.appendChild(overlay);
    
    var screen = document.querySelector('.screen');
    if (screen) {
        var existingControls = screen.querySelector('.video-controls');
        if (existingControls) {
            screen.removeChild(existingControls);
        }
        screen.appendChild(videoControls);
    }
    
    // Add click to toggle play/pause
    screen.addEventListener('click', function(e) {
        // Don't trigger if clicking on interactive elements
        if (e.target.closest('.action-btn') || 
            e.target.closest('.follow-btn') ||
            e.target.closest('.reel-bottom-overlay') ||
            e.target.closest('.bottom-nav')) {
            return;
        }
        
        togglePlayPause();
    });
}

// Toggle like
function toggleLike(reelId) {
    likedReels[reelId] = !likedReels[reelId];
    
    var reel = null;
    for (var i = 0; i < reelsData.length; i++) {
        if (reelsData[i].id === reelId) {
            reel = reelsData[i];
            break;
        }
    }
    
    var likeCount = document.getElementById('like-count-' + reelId);
    
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
    var likeBtn = document.querySelector('#reel-' + reelId + ' .action-btn');
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

// Toggle follow
function toggleFollow(username, reelId) {
    followedUsers[username] = !followedUsers[username];
    
    // Save to localStorage
    localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
    
    // Update button state
    var followBtn = document.querySelector('#reel-' + reelId + ' .follow-btn');
    if (followBtn) {
        if (followedUsers[username]) {
            followBtn.textContent = 'Following';
            followBtn.classList.add('following');
        } else {
            followBtn.textContent = 'Follow';
            followBtn.classList.remove('following');
        }
    }
}

// Open comments
function openComments(reelId) {
    var modal = document.getElementById('commentModal');
    var commentsList = document.getElementById('commentsList');
    
    if (modal && commentsList) {
        commentsList.innerHTML = '\
            <div class="comment-item">\
                <div class="comment-avatar">A</div>\
                <div class="comment-content">\
                    <div class="comment-author">user1</div>\
                    <div class="comment-text">This is amazing! 🔥</div>\
                </div>\
            </div>\
            <div class="comment-item">\
                <div class="comment-avatar">B</div>\
                <div class="comment-content">\
                    <div class="comment-author">user2</div>\
                    <div class="comment-text">Love this content! ❤️</div>\
                </div>\
            </div>\
        ';
        
        modal.style.display = 'block';
    }
}

// Close comments
function closeComments() {
    var modal = document.getElementById('commentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Post comment
function postComment() {
    var commentInput = document.getElementById('commentInput');
    var commentsList = document.getElementById('commentsList');
    
    if (commentInput && commentInput.value.trim() && commentsList) {
        var commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = '\
            <div class="comment-avatar">Y</div>\
            <div class="comment-content">\
                <div class="comment-author">you</div>\
                <div class="comment-text">' + commentInput.value + '</div>\
            </div>\
        ';
        
        commentsList.appendChild(commentItem);
        commentInput.value = '';
    }
}

// Share reel
function shareReel(reelId) {
    var reel = null;
    for (var i = 0; i < reelsData.length; i++) {
        if (reelsData[i].id === reelId) {
            reel = reelsData[i];
            break;
        }
    }
    
    if (reel) {
        reel.shares += 1;
        
        if (navigator.share) {
            navigator.share({
                title: 'Reel by ' + reel.username,
                text: reel.caption,
                url: window.location.href,
            });
        } else {
            alert('Sharing reel by ' + reel.username);
        }
    }
}

// Navigation functions
function openProfile() {
    window.location.href = 'https://projectsofkhan.github.io/Trail/apps/instashan/profile/profile.html';
}

function openChats() {
    window.location.href = 'https://projectsofkhan.github.io/Trail/apps/instashan/chats/chats.html';
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
    
    // Check if sound was previously enabled
    if (isSoundEnabled) {
        // Hide loading screen immediately if sound is already enabled
        setTimeout(hideLoadingScreen, 1000);
    } else {
        // Show loading screen with sound button
        var loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }
    
    // Handle comment input
    var commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                postComment();
            }
        });
    }
    
    // Close modal when clicking outside
    var modal = document.getElementById('commentModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeComments();
            }
        });
    }
});