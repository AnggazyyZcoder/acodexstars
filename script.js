// script.js

// JSONBin Configuration
const JSONBIN_ID = '696ef70dae596e708fe7e07b';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`;
const JSONBIN_HEADERS = {
    'X-Master-Key': '$2a$10$vdCuQ9boEVtImY7.HyV.zugysp6ffRZF3dON2oxRIMeBfeAuPUB/m'
};

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const welcomePopup = document.getElementById('welcomePopup');
const closePopupBtn = document.getElementById('closePopup');
const hamburgerMenu = document.getElementById('hamburgerMenu');
const quickActions = document.getElementById('quickActions');
const totalCommandsCount = document.getElementById('totalCommandsCount');
const totalGroupsCount = document.getElementById('totalGroupsCount');
const totalUsersCount = document.getElementById('totalUsersCount');
const groupsTableBody = document.getElementById('groupsTableBody');
const leaderboardContent = document.getElementById('leaderboardContent');
const topFeaturesList = document.getElementById('topFeaturesList');

// Data variables
let botData = {};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Start loading animation
    startLoadingAnimation();
    
    // Load data from JSONBin after loading screen
    setTimeout(() => {
        loadDataFromJSONBin();
    }, 500);
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize scroll animations
    initScrollAnimations();
});

// Start loading animation
function startLoadingAnimation() {
    // Animate loading text letters
    const loadingTextSpans = document.querySelectorAll('.loading-text span');
    loadingTextSpans.forEach((span, index) => {
        span.style.setProperty('--i', index);
    });
    
    // Hide loading screen after 5 seconds
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Show welcome popup after a short delay
        setTimeout(() => {
            welcomePopup.style.display = 'block';
        }, 300);
    }, 5000);
}

// Load data from JSONBin
async function loadDataFromJSONBin() {
    try {
        console.log('Fetching data from JSONBin...');
        
        // Fetch data from JSONBin
        const response = await fetch(JSONBIN_URL, {
            headers: JSONBIN_HEADERS
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        botData = result.record;
        
        console.log('Data loaded successfully:', botData);
        
        // Update UI with loaded data
        updateDashboardStats();
        updateGroupsTable();
        updateLeaderboard();
        updateTopFeatures();
        
    } catch (error) {
        console.error('Error loading data from JSONBin:', error);
        
        // Fallback to sample data if JSONBin fails
        botData = {
            totalCommands: {
                listsewa: 1
            },
            topFeatures: ["listsewa"],
            topUsers: [
                {
                    name: "anggazyycy",
                    number: "6288804148639",
                    used: 1
                }
            ],
            listSewa: [
                {
                    id: "120363392678266997@g.us",
                    name: "JEET LADIES",
                    expired: "♾️ Permanent",
                    addedBy: "0"
                }
            ]
        };
        
        // Update UI with fallback data
        updateDashboardStats();
        updateGroupsTable();
        updateLeaderboard();
        updateTopFeatures();
        
        // Show error notification
        showNotification('Using sample data. JSONBin connection failed.', 'error');
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    // Calculate total commands
    let totalCommands = 0;
    if (botData.totalCommands) {
        Object.values(botData.totalCommands).forEach(value => {
            totalCommands += value;
        });
    }
    totalCommandsCount.textContent = totalCommands.toLocaleString();
    
    // Update groups count
    const groupsCount = botData.listSewa ? botData.listSewa.length : 0;
    totalGroupsCount.textContent = groupsCount.toLocaleString();
    
    // Update users count
    const usersCount = botData.topUsers ? botData.topUsers.length : 0;
    totalUsersCount.textContent = usersCount.toLocaleString();
}

// Update groups table
function updateGroupsTable() {
    if (!botData.listSewa || botData.listSewa.length === 0) {
        groupsTableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px;">
                    <i class="fas fa-users-slash" style="font-size: 2rem; margin-bottom: 15px; display: block; color: var(--text-muted);"></i>
                    <p>No groups are currently renting DeviLx Stars</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let tableHTML = '';
    botData.listSewa.forEach(group => {
        tableHTML += `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-users" style="color: var(--primary-color);"></i>
                        <strong>${group.name}</strong>
                    </div>
                </td>
                <td>${group.id}</td>
                <td>
                    <span class="status-badge ${group.expired === '♾️ Permanent' ? 'permanent' : 'active'}">
                        ${group.expired}
                    </span>
                </td>
                <td>${group.addedBy}</td>
            </tr>
        `;
    });
    
    groupsTableBody.innerHTML = tableHTML;
    
    // Add CSS for status badges
    const style = document.createElement('style');
    style.textContent = `
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .status-badge.permanent {
            background: rgba(0, 200, 83, 0.2);
            color: #00C853;
            border: 1px solid rgba(0, 200, 83, 0.5);
        }
        .status-badge.active {
            background: rgba(33, 150, 243, 0.2);
            color: #2196F3;
            border: 1px solid rgba(33, 150, 243, 0.5);
        }
    `;
    document.head.appendChild(style);
}

// Update leaderboard
function updateLeaderboard() {
    if (!botData.topUsers || botData.topUsers.length === 0) {
        leaderboardContent.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-trophy" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No user data available</h3>
                <p>User statistics will appear here once users start using the bot</p>
            </div>
        `;
        return;
    }
    
    // Sort users by usage (highest first)
    const sortedUsers = [...botData.topUsers].sort((a, b) => b.used - a.used);
    
    let leaderboardHTML = '';
    sortedUsers.forEach((user, index) => {
        const rank = index + 1;
        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';
        
        // Get initials for avatar
        const initials = user.name.charAt(0).toUpperCase();
        
        leaderboardHTML += `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">#${rank}</div>
                <div class="leaderboard-user">
                    <div class="user-avatar" style="background: ${getRandomColor()};">${initials}</div>
                    <div class="user-info">
                        <h4>${user.name}</h4>
                        <p>${user.number}</p>
                    </div>
                </div>
                <div class="leaderboard-stats">
                    <div class="used-count">${user.used}</div>
                    <p>commands used</p>
                </div>
            </div>
        `;
    });
    
    leaderboardContent.innerHTML = leaderboardHTML;
}

// Update top features
function updateTopFeatures() {
    if (!botData.topFeatures || botData.topFeatures.length === 0) {
        topFeaturesList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted); grid-column: 1 / -1;">
                <i class="fas fa-chart-bar" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No feature data available</h3>
                <p>Feature usage statistics will appear here</p>
            </div>
        `;
        return;
    }
    
    let featuresHTML = '';
    botData.topFeatures.forEach((feature, index) => {
        const rank = index + 1;
        
        featuresHTML += `
            <div class="feature-item-list">
                <div class="feature-rank">${rank}</div>
                <div class="feature-details">
                    <h4>${formatFeatureName(feature)}</h4>
                    <p>Most frequently used command</p>
                </div>
            </div>
        `;
    });
    
    topFeaturesList.innerHTML = featuresHTML;
}

// Initialize event listeners
function initEventListeners() {
    // Close welcome popup
    closePopupBtn.addEventListener('click', function() {
        welcomePopup.style.opacity = '0';
        welcomePopup.style.transform = 'translateX(120%)';
        
        setTimeout(() => {
            welcomePopup.style.display = 'none';
        }, 500);
    });
    
    // Toggle quick actions menu
    hamburgerMenu.addEventListener('click', function() {
        quickActions.classList.toggle('active');
    });
    
    // Close quick actions when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburgerMenu.contains(event.target) && !quickActions.contains(event.target)) {
            quickActions.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close quick actions if open
                quickActions.classList.remove('active');
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = function() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    // Check on load and scroll
    window.addEventListener('load', fadeInOnScroll);
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Initial check
    fadeInOnScroll();
}

// Helper function to format feature names
function formatFeatureName(feature) {
    // Convert camelCase or snake_case to readable format
    return feature
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^\w/, c => c.toUpperCase())
        .trim();
}

// Helper function to get random color for avatars
function getRandomColor() {
    const colors = [
        '#8A2BE2', '#6A0DAD', '#9B4DFF', '#7B1FA2', '#AB47BC',
        '#BA68C8', '#CE93D8', '#E1BEE7', '#F3E5F5'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            border-left: 4px solid var(--primary-color);
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: var(--shadow);
            z-index: 9999;
            transform: translateX(120%);
            animation: slideIn 0.5s ease forwards;
        }
        .notification.error {
            border-left-color: var(--danger-color);
        }
        .notification i {
            font-size: 1.2rem;
        }
        .notification.error i {
            color: var(--danger-color);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}

// Handle window resize
window.addEventListener('resize', function() {
    // Close quick actions on mobile when resizing
    if (window.innerWidth > 768) {
        quickActions.classList.remove('active');
    }
});