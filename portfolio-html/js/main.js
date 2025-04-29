document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Setup guide stage navigation
    const setupStages = document.querySelectorAll('.setup-stage');
    const progressStages = document.querySelectorAll('.progress-stage');
    const continueButtons = document.querySelectorAll('.btn-step-complete');
    
    // Initialize - show only first stage
    if (setupStages.length > 0) {
        setupStages.forEach((stage, index) => {
            if (index > 0) {
                stage.style.display = 'none';
            }
        });
    }
    
    // Handle continue buttons
    if (continueButtons.length > 0) {
        continueButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetStage = this.dataset.next;
                const currentStage = this.closest('.setup-stage').id;
                const currentIndex = parseInt(currentStage.split('-')[1]);
                
                // Hide current stage
                document.getElementById(currentStage).style.display = 'none';
                
                // Show target stage
                document.getElementById(targetStage).style.display = 'block';
                
                // Update progress indicators
                updateProgress(currentIndex + 1);
                
                // Scroll to top of new stage
                window.scrollTo({
                    top: document.getElementById(targetStage).offsetTop - 100,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // Progress tracker
    function updateProgress(activeStage) {
        if (progressStages.length > 0) {
            progressStages.forEach((stage, index) => {
                const stageNum = index + 1;
                
                // Reset classes
                stage.classList.remove('active', 'completed');
                
                // Mark completed stages
                if (stageNum < activeStage) {
                    stage.classList.add('completed');
                }
                
                // Mark active stage
                if (stageNum === activeStage) {
                    stage.classList.add('active');
                }
            });
        }
    }
    
    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    
    if (sidebarLinks.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Only handle internal links
                if (!targetId.startsWith('#')) return;
                
                e.preventDefault();
                
                // If it's a stage link, make sure that stage is visible
                if (targetId.includes('stage')) {
                    const stageNumber = parseInt(targetId.split('-')[1]);
                    
                    // Show the correct stage
                    setupStages.forEach((stage, index) => {
                        stage.style.display = index + 1 === stageNumber ? 'block' : 'none';
                    });
                    
                    // Update progress
                    updateProgress(stageNumber);
                }
                
                // Smooth scroll to target
                const target = document.querySelector(targetId);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Handle smooth scrolling for all anchor links
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    
    if (allAnchorLinks.length > 0) {
        allAnchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Skip empty anchors
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                
                if (target) {
                    e.preventDefault();
                    
                    // Check if target is in a hidden stage (on setup page)
                    const parentStage = target.closest('.setup-stage');
                    if (parentStage && parentStage.style.display === 'none') {
                        // Show the correct stage
                        setupStages.forEach(stage => {
                            stage.style.display = stage === parentStage ? 'block' : 'none';
                        });
                        
                        // Update progress
                        const stageNumber = parseInt(parentStage.id.split('-')[1]);
                        updateProgress(stageNumber);
                    }
                    
                    // Scroll to target
                    window.scrollTo({
                        top: target.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                    }
                }
            });
        });
    }
    
    // Add animations on scroll for homepage elements
    const animatedElements = document.querySelectorAll('.benefit-card, .step');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        
        // Add CSS for animations
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .benefit-card, .step {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .benefit-card.animate, .step.animate {
                opacity: 1;
                transform: translateY(0);
            }
            
            .benefit-card:nth-child(2), .step:nth-child(2) {
                transition-delay: 0.2s;
            }
            
            .benefit-card:nth-child(3), .step:nth-child(3) {
                transition-delay: 0.4s;
            }
            
            .step:nth-child(4) {
                transition-delay: 0.6s;
            }
        `;
        document.head.appendChild(animationStyle);
    }
    
    // Add setup stage animation
    const setupStepsAnimation = document.createElement('style');
    setupStepsAnimation.textContent = `
        .setup-step {
            opacity: 0;
            transform: translateY(15px);
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .setup-step:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .setup-step:nth-child(3) {
            animation-delay: 0.4s;
        }
    `;
    document.head.appendChild(setupStepsAnimation);
}); 