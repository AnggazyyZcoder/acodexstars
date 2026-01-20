// script.js

// Global Variables
let jsonBinData = null;
const JSONBIN_ID = "696ee3ea43b1c97be93beadc";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`;

// DOM Elements
let loadingScreen, welcomePopup, closePopupBtn, mobileMenuBtn, mobileNav, closeMobileNavBtn;
let groupsContainer, leaderboardContainer, featuresContainer;
let groupsLoading, leaderboardLoading, featuresLoading;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    loadingScreen = document.getElementById('loading-screen');
    welcomePopup = document.getElementById('welcome-popup');
    closePopupBtn = document.getElementById('close-popup');
    mobileMenuBtn = document.getElementById('mobile-menu-btn');
    mobileNav = document.getElementById('mobile-nav');
    closeMobileNavBtn = document.querySelector('.close-mobile-nav');
    
    groupsContainer = document.getElementById('groups-container');
    leaderboardContainer = document.getElementById('leaderboard-container');
    featuresContainer = document.getElementById('features-container');
    
    groupsLoading = document.getElementById('groups-loading');
    leaderboardLoading = document.getElementById('leaderboard-loading');
    featuresLoading = document.getElementById('features-loading');
    
    // Initialize event listeners
    initEventListeners();
    
    // Start loading sequence
    startLoadingSequence();
    
    // Initialize scroll animations
    initScrollAnimations();
});

// Initialize all event listeners
function initEventListeners() {
    // Close popup button
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function() {
            closeWelcomePopup();
        });
    }
    
    // Mobile menu button
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.add('open');
        });
    }
    
    // Close mobile nav button
    if (closeMobileNavBtn) {
        closeMobileNavBtn.addEventListener('click', function() {
            mobileNav.classList.remove('open');
        });
    }
    
    // Close mobile nav when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-content a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('open');
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileNav.classList.contains('open') && 
            !mobileNav.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            mobileNav.classList.remove('open');
        }
    });
}

// Start loading sequence
function startLoadingSequence() {
    // Simulate 5 seconds loading time
    setTimeout(() => {
        // Hide loading screen
        loadingScreen.style.opacity = '0';
        
        // After transition, remove loading screen and show popup
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            
            // Show welcome popup after a short delay
            setTimeout(() => {
                welcomePopup.style.display = 'block';
            }, 500);
        }, 800);
        
        // Fetch data from JSONBin
        fetchDataFromJsonBin();
        
        // Initialize animations
        initFadeInAnimations();
    }, 5000);
}

// Close welcome popup
function closeWelcomePopup() {
    welcomePopup.style.animation = 'popupAppear 0.5s ease-out reverse';
    welcomePopup.style.opacity = '0';
    
    setTimeout(() => {
        welcomePopup.style.display = 'none';
    }, 500);
}

// Fetch data from JSONBin
async function fetchDataFromJsonBin() {
    try {
        // Show loading states
        groupsLoading.style.display = 'flex';
        leaderboardLoading.style.display = 'flex';
        featuresLoading.style.display = 'flex';
        
        // Hide containers initially
        groupsContainer.innerHTML = '';
        leaderboardContainer.innerHTML = '';
        featuresContainer.innerHTML = '';
        
        // Fetch data from JSONBin
        const response = await fetch(JSONBIN_URL, {
            headers: {
                'X-Master-Key': '$2a$10$EG.QfA7ThwjokzPkTJ4hKuO6pCKkBd6wjKDK2LzLvR/pFm0OE6nVm' // This is a sample key, replace with actual key
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        jsonBinData = data.record;
        
        // Render data
        renderGroupsData();
        renderLeaderboardData();
        renderTopFeaturesData();
        
    } catch (error) {
        console.error('Error fetching data from JSONBin:', error);
        
        // Show error messages
        groupsLoading.innerHTML = '<p>Gagal memuat data grup. Coba lagi nanti.</p>';
        leaderboardLoading.innerHTML = '<p>Gagal memuat data leaderboard. Coba lagi nanti.</p>';
        featuresLoading.innerHTML = '<p>Gagal memuat data fitur. Coba lagi nanti.</p>';
        
        // Use sample data as fallback
        jsonBinData = {
            totalCommands: {
                listsewa: 1
            },
            topFeatures: [
                "listsewa",
                "sticker",
                "download"
            ],
            topUsers: [
                {
                    name: "anggazyycy",
                    number: "6288804148639",
                    used: 156
                },
                {
                    name: "indra",
                    number: "6281234567890",
                    used: 89
                },
                {
                    name: "sari",
                    number: "6289876543210",
                    used: 67
                },
                {
                    name: "budi",
                    number: "6281112233445",
                    used: 45
                },
                {
                    name: "riri",
                    number: "6285556667778",
                    used: 32
                }
            ],
            listSewa: [
                {
                    id: "120363392678266997@g.us",
                    name: "JEET LADIES",
                    expired: "♾️ Permanent",
                    addedBy: "0"
                },
                {
                    id: "120363392678266998@g.us",
                    name: "DEVILX GROUP",
                    expired: "2025-12-31",
                    addedBy: "anggazyycy"
                },
                {
                    id: "120363392678266999@g.us",
                    name: "STARS COMMUNITY",
                    expired: "2025-11-15",
                    addedBy: "admin"
                },
                {
                    id: "120363392678267000@g.us",
                    name: "BOT TESTERS",
                    expired: "♾️ Permanent",
                    addedBy: "anggazyycy"
                }
            ]
        };
        
        // Render with fallback data
        renderGroupsData();
        renderLeaderboardData();
        renderTopFeaturesData();
    }
}

// Render groups data
function renderGroupsData() {
    if (!jsonBinData || !jsonBinData.listSewa) return;
    
    // Hide loading
    groupsLoading.style.display = 'none';
    
    // Clear container
    groupsContainer.innerHTML = '';
    
    // Create group cards
    jsonBinData.listSewa.forEach((group, index) => {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card fade-in';
        groupCard.style.animationDelay = `${index * 0.1}s`;
        
        // Get first letter for avatar
        const firstLetter = group.name.charAt(0).toUpperCase();
        
        groupCard.innerHTML = `
            <div class="group-header">
                <div class="group-avatar">${firstLetter}</div>
                <div class="group-info">
                    <h3>${group.name}</h3>
                    <p>ID: ${group.id.substring(0, 15)}...</p>
                </div>
            </div>
            <div class="group-details">
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">${group.expired === "♾️ Permanent" ? "Aktif" : "Sewa"}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Expired</span>
                    <span class="detail-value">${group.expired}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Added By</span>
                    <span class="detail-value">${group.addedBy === "0" ? "System" : group.addedBy}</span>
                </div>
            </div>
        `;
        
        groupsContainer.appendChild(groupCard);
    });
}

// Render leaderboard data
function renderLeaderboardData() {
    if (!jsonBinData || !jsonBinData.topUsers) return;
    
    // Hide loading
    leaderboardLoading.style.display = 'none';
    
    // Clear container
    leaderboardContainer.innerHTML = '';
    
    // Find max used value for percentage calculation
    const maxUsed = Math.max(...jsonBinData.topUsers.map(user => user.used));
    
    // Create user cards
    jsonBinData.topUsers.forEach((user, index) => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card fade-in';
        userCard.style.animationDelay = `${index * 0.1}s`;
        
        // Get first letter for avatar
        const firstLetter = user.name.charAt(0).toUpperCase();
        
        // Medal based on rank
        let medalHTML = '';
        if (index === 0) {
            medalHTML = '<div class="medal gold">🥇</div>';
        } else if (index === 1) {
            medalHTML = '<div class="medal silver">🥈</div>';
        } else if (index === 2) {
            medalHTML = '<div class="medal bronze">🥉</div>';
        }
        
        // Calculate percentage for progress bar
        const percentage = (user.used / maxUsed) * 100;
        
        userCard.innerHTML = `
            ${medalHTML}
            <div class="user-header">
                <div class="user-avatar">${firstLetter}</div>
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>${user.number}</p>
                </div>
            </div>
            <div class="user-stats">
                <div class="stat-bar">
                    <div class="stat-progress" style="width: ${percentage}%"></div>
                </div>
                <div class="stat-value">
                    <span>Fitur Digunakan</span>
                    <span>${user.used} kali</span>
                </div>
            </div>
        `;
        
        leaderboardContainer.appendChild(userCard);
    });
}

// Render top features data
function renderTopFeaturesData() {
    if (!jsonBinData || !jsonBinData.topFeatures) return;
    
    // Hide loading
    featuresLoading.style.display = 'none';
    
    // Clear container
    featuresContainer.innerHTML = '';
    
    // Feature descriptions mapping
    const featureDescriptions = {
        "listsewa": "Menampilkan daftar grup yang menyewa bot",
        "sticker": "Membuat stiker dari gambar atau video",
        "download": "Mendownload video dari berbagai platform",
        "ai": "Fitur kecerdasan buatan untuk chat",
        "game": "Berbagai permainan seru dalam bot",
        "music": "Mendownload dan memutar musik",
        "news": "Menampilkan berita terkini",
        "weather": "Informasi cuaca terkini"
    };
    
    // Create feature items
    jsonBinData.topFeatures.forEach((feature, index) => {
        // Use sample features if we don't have enough
        const featureName = feature || ["Sticker Maker", "Downloader", "AI Chat"][index] || `Fitur ${index + 1}`;
        const featureDesc = featureDescriptions[feature] || "Fitur populer DeviLx Stars";
        
        const featureItem = document.createElement('div');
        featureItem.className = 'feature-item fade-in';
        featureItem.style.animationDelay = `${index * 0.1}s`;
        
        featureItem.innerHTML = `
            <div class="feature-rank">${index + 1}</div>
            <div class="feature-content">
                <h4>${featureName}</h4>
                <p>${featureDesc}</p>
            </div>
        `;
        
        featuresContainer.appendChild(featureItem);
    });
}

// Initialize fade-in animations
function initFadeInAnimations() {
    // Add fade-in class to all sections after loading
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Close mobile nav on resize to desktop
    if (window.innerWidth > 768 && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
    }
});