// Reels data - 5 videos (reduced from 10)
var reelsData = [
    {
        id: 1,
        username: "carguy86",
        userInitial: "🚗",
        caption: "The Demon! #black #bmw",
        music: "Original Sound - Carguy86",
        likes: "125k",
        comments: "19k",
        shares: 923,
        videoUrl: "video1.mp4"
    },
    {
        id: 2,
        username: "neafeas",
        userInitial: "N",
        caption: "😂🤌 #dance",
        music: "Original Audio - neafeas",
        likes: "18.4M",
        comments: "101k",
        shares: "3.8M",
        videoUrl: "video2.mp4"
    },
    {
        id: 3,
        username: "potential_edit",
        userInitial: "P",
        caption: "The Elephant 🐘 #Defender",
        music: "Original Audio - Potential_Edit",
        likes: 21,
        comments: 0,
        shares: 1,
        videoUrl: "video3.mp4"
    },
    {
        id: 4,
        username: "potential_Edit",
        userInitial: "P",
        caption: "Only eyes I fell for... #bmw #bmweyes #reel #haledil #insta #viral #edit #cars #car",
        music: "Original Audio - Potential_Edit",
        likes: 11,
        comments: 0,
        shares: 0,
        videoUrl: "video4.mp4"
    },
    {
        id: 5,
        username: "tatya_bichchoo",
        userInitial: "🧸",
        caption: "😂😂😂 tatya bichchhoo funny dance!",
        music: "Original Audio - tatya_bichchoo",
        likes: 11200,
        comments: 398,
        shares: 92,
        videoUrl: "video5.mp4"
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
                // Load reels immediately
                loadReels();
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

        // Setup video - DO NOT AUTO-PLAY HERE
        var video = document.getElementById('video-' + reel.id);
        if (video) {
            // Set initial volume but DON'T play
            updateVideoVolume(video);
            
            // PRELOAD but don't play
            video.preload = "auto";
            
            if (i === currentReelIndex) {
                reelItem.style.transform = 'translateY(0)';
                reelItem.style.opacity = '1';
                reelItem.style.display = 'block';
                reelItem.classList.add('active');
                
                // Only load the current video, don't auto-play
                video.load();
            } else {
                reelItem.style.transform = 'translateY(0)';
                reelItem.style.opacity = '0';
                reelItem.style.display = 'none';
                // Don't load other videos yet
                video.preload = "none";
            }
            reelItem.style.transition = 'none';
        }
    }

    setupScrolling();
    createPauseOverlay();
    
    // Auto-play only the current video after a short delay
    setTimeout(function() {
        playCurrentVideo();
    }, 100);
}

// Play only the current video
function playCurrentVideo() {
    var currentReel = reelsData[currentReelIndex];
    if (!currentReel) return;
    
    var video = document.getElementById('video-' + currentReel.id);
    if (video) {
        // Ensure it's muted if sound is disabled
        updateVideoVolume(video);
        
        // Try to play with error handling
        var playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(function(error) {
                console.log('Auto-play prevented for video', currentReel.id);
                // User interaction required - we'll play on first click
            });
        }
    }
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
        updateVideoVolume(nextVideo);
        
        // Load the video if it hasn't been loaded yet
        if (nextVideo.readyState < 3) {
            nextVideo.load();
        }
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
