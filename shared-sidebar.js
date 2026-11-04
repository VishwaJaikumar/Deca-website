// shared-sidebar.js - Universal sidebar component with admin login

// Admin state management
window.adminState = {
    isLoggedIn: false,
    // DEMO ONLY: this check runs in the browser, so it is NOT real security.
    // Set your own value here before deploying. For real protection, use Firebase
    // Authentication and Firestore security rules instead.
    password: 'decaadmin989'
};

document.addEventListener('DOMContentLoaded', () => {
    // Only add sidebar if it doesn't already exist (to avoid duplicates)
    if (!document.querySelector('.sidebar')) {
        // Create sidebar HTML
        const sidebarHTML = `
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <a href="index.html" class="logo-link">
                        <img src="logo.png" alt="Logo" class="sidebar-logo">
                    </a>
                    <button class="toggle-btn">
                        <i class="fas fa-bars"></i>
                    </button>
                    <button class="toggle-btn-collapsed">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
                <nav class="sidebar-nav">
                    <!-- Admin Login Section -->
                    <div class="nav-item admin-section" id="adminSection">
                        <div class="nav-link" id="adminNavLink">
                            <i class="fas fa-user-shield"></i>
                            <span id="adminText">Admin Login</span>
                            <i class="fas fa-chevron-down arrow" id="adminArrow"></i>
                        </div>
                        <div class="dropdown-content" id="adminDropdown">
                            <div class="admin-login-form" id="adminLoginForm">
                                <input type="password" id="adminPasswordInput" placeholder="Enter admin password" style="width: 90%; padding: 8px; margin: 5px; border-radius: 4px; border: 1px solid #ddd;">
                                <button id="adminLoginBtn" style="width: 90%; padding: 8px; margin: 5px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">Login</button>
                            </div>
                            <div class="admin-menu" id="adminMenu" style="display: none;">
                                <a href="admin-points.html">Manage Points</a>
                                <a href="add-member.html">Add Member</a>
                                <a href="manage-members.html">Manage Members</a>
                                <button id="adminLogoutBtn" style="width: 90%; padding: 8px; margin: 5px; background: #ea4335; color: white; border: none; border-radius: 4px; cursor: pointer;">Logout</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="nav-item">
                        <div class="nav-link">
                            <i class="fas fa-users"></i>
                            <span>Members</span>
                            <i class="fas fa-chevron-down arrow"></i>
                        </div>
                        <div class="dropdown-content">
                            <a href="view-members.html">View Members</a>
                        </div>
                    </div>
                    <div class="nav-item">
                        <div class="nav-link">
                            <i class="fas fa-star"></i>
                            <span>Points</span>
                            <i class="fas fa-chevron-down arrow"></i>
                        </div>
                        <div class="dropdown-content">
                            <a href="point-tracker.html">Point Tracker</a>
                            <a href="points-history.html">History</a>
                        </div>
                    </div>
                    <div class="nav-item">
                        <div class="nav-link">
                            <i class="fas fa-clock"></i>
                            <span>Minutes Tracker</span>
                            <i class="fas fa-chevron-down arrow"></i>
                        </div>
                        <div class="dropdown-content">
                            <a href="minutes-track.html">Track Time</a>
                            <a href="minutes-view.html">View Log</a>
                        </div>
                    </div>
                    <div class="nav-item">
                        <div class="nav-link">
                            <i class="fas fa-user-check"></i>
                            <span>Attendance</span>
                            <i class="fas fa-chevron-down arrow"></i>
                        </div>
                        <div class="dropdown-content">
                            <a href="attendance-records.html">Attendance log</a>
                            <a href="attendance-checkin.html">Mark Attendance</a>
                        </div>
                    </div>
                </nav>
            </div>
        `;

        // Insert sidebar at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

        // Add content wrapper class to main content
        const mainContent = document.querySelector('main') || document.querySelector('.content');
        if (mainContent && !mainContent.classList.contains('content')) {
            mainContent.classList.add('content');
        }
        initializeSidebar();
    }
});

function initializeSidebar() {
    // Get all nav items
    const navItems = document.querySelectorAll('.nav-item');
    const toggleBtn = document.querySelector('.toggle-btn');
    const toggleBtnCollapsed = document.querySelector('.toggle-btn-collapsed');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
   
    // Initialize admin functionality
    initializeAdminLogin();
    
    // Handle dropdown toggles
    navItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');
        navLink.addEventListener('click', () => {
            // Don't allow dropdowns in collapsed mode
            if (sidebar.classList.contains('collapsed')) {
                return;
            }
            
            // Close other dropdowns
            navItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
           
            // Toggle current dropdown
            item.classList.toggle('active');
        });
    });
   
    // Handle sidebar toggle
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('expanded');
        });
    }
    
    // Handle collapsed sidebar toggle
    if (toggleBtnCollapsed) {
        toggleBtnCollapsed.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('expanded');
        });
    }
   
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item')) {
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Highlight current page in navigation
    highlightCurrentPage();
    
    // Update admin UI state
    updateAdminUI();
}

function initializeAdminLogin() {
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    
    // Check if already logged in (from sessionStorage)
    const savedLoginState = sessionStorage.getItem('adminLoggedIn');
    if (savedLoginState === 'true') {
        window.adminState.isLoggedIn = true;
        updateAdminUI();
    }
    
    // Handle admin login
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            const password = adminPasswordInput.value.trim();
            if (password === window.adminState.password) {
                window.adminState.isLoggedIn = true;
                sessionStorage.setItem('adminLoggedIn', 'true');
                updateAdminUI();
                adminPasswordInput.value = '';
                showMessage('Admin login successful!', 'success');
            } else {
                showMessage('Incorrect admin password!', 'error');
                adminPasswordInput.value = '';
            }
        });
    }
    
    // Handle admin logout
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            window.adminState.isLoggedIn = false;
            sessionStorage.removeItem('adminLoggedIn');
            updateAdminUI();
            showMessage('Admin logged out successfully!', 'success');
        });
    }
    
    // Handle Enter key in password field
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                adminLoginBtn.click();
            }
        });
    }
}

function updateAdminUI() {
    const adminText = document.getElementById('adminText');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminMenu = document.getElementById('adminMenu');
    const adminArrow = document.getElementById('adminArrow');
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    
    if (window.adminState.isLoggedIn) {
        // Update admin section
        adminText.textContent = 'Admin Panel';
        adminText.style.color = '#34a853';
        adminLoginForm.style.display = 'none';
        adminMenu.style.display = 'block';
        
        // Show admin-only menu items
        adminOnlyItems.forEach(item => {
            item.style.display = 'block';
        });
        
        // Add admin indicator
        if (!document.querySelector('.admin-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'admin-indicator';
            indicator.innerHTML = ' <i class="fas fa-shield-alt" style="color: #34a853; margin-left: 5px;"></i>';
            adminText.appendChild(indicator);
        }
    } else {
        // Reset admin section
        adminText.textContent = 'Admin Login';
        adminText.style.color = '';
        adminLoginForm.style.display = 'block';
        adminMenu.style.display = 'none';
        
        // Hide admin-only menu items
        adminOnlyItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // Remove admin indicator
        const indicator = document.querySelector('.admin-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
}

function showMessage(text, type) {
    // Create or update message element
    let messageEl = document.querySelector('.admin-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'admin-message';
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 9999;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(messageEl);
    }
    
    messageEl.textContent = text;
    messageEl.style.display = 'block';
    
    if (type === 'success') {
        messageEl.style.background = '#e8f5e8';
        messageEl.style.color = '#2e7d32';
        messageEl.style.border = '2px solid #4caf50';
    } else if (type === 'error') {
        messageEl.style.background = '#ffebee';
        messageEl.style.color = '#c62828';
        messageEl.style.border = '2px solid #f44336';
    }
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.dropdown-content a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Export admin state for other pages to use
window.isAdminLoggedIn = () => window.adminState.isLoggedIn;