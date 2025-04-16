document.addEventListener('DOMContentLoaded', function() {
    const welcomeContainer = document.querySelector('.welcome-container');
    const avatar = document.querySelector('.welcome-avatar');
    const username = document.querySelector('.username');
    
    welcomeContainer.style.opacity = '0';
    welcomeContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        welcomeContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        welcomeContainer.style.opacity = '1';
        welcomeContainer.style.transform = 'translateY(0)';
    }, 100);
    
    if (avatar) {
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 15px rgba(248, 112, 112, 0.7)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        avatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    }
    
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to logout?')) {
                e.preventDefault();
            }
        });
    }
});