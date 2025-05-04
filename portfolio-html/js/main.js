// Modern Portfolio Guide JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const header = document.querySelector('.site-header');
    const progressBar = document.getElementById('readingProgress');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const progressStages = document.querySelectorAll('.progress-stage');
    const setupStages = document.querySelectorAll('.setup-stage');
    const stageButtons = document.querySelectorAll('.btn-step-complete');
    const scrollThreshold = 50;

    // Performance optimization: Use passive listeners for scroll events
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update reading progress in the same scroll handler to reduce listeners
        if (progressBar) {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }, { passive: true });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    // Progress navigation - initialize if exists
    if (progressStages.length > 0) {
        updateStageProgress();
    }

    // Handle stage buttons
    stageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const nextStage = button.getAttribute('data-next');
            if (nextStage) {
                const targetElement = document.getElementById(nextStage);
                if (targetElement) {
                    const offset = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });
                    
                    // Update progress
                    updateStageProgress(nextStage);
                }
            }
        });
    });

    function updateStageProgress(currentStage) {
        // Get stage number from ID if provided
        let currentStageNum = 1;
        if (currentStage) {
            const match = currentStage.match(/stage-(\d+)/);
            if (match && match[1]) {
                currentStageNum = parseInt(match[1]);
            }
        } else {
            // Check for hash in URL
            const hash = window.location.hash;
            if (hash) {
                const match = hash.match(/stage-(\d+)/);
                if (match && match[1]) {
                    currentStageNum = parseInt(match[1]);
                }
            }
        }

        // Update progress stages
        progressStages.forEach((stage, index) => {
            const stageNum = index + 1;
            if (stageNum < currentStageNum) {
                stage.classList.add('completed');
                stage.classList.remove('active');
            } else if (stageNum === currentStageNum) {
                stage.classList.add('active');
                stage.classList.remove('completed');
            } else {
                stage.classList.remove('active', 'completed');
            }
        });
    }

    // Performance optimization: Create a single IntersectionObserver for all animations
    const animateOnScroll = () => {
        const elementsToAnimate = document.querySelectorAll('.setup-step, .step, .resource-card, .image-highlight');
        
        // Initialize the animation styles once
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .will-animate {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            .animated {
                opacity: 1;
                transform: translateY(0);
            }
            .step.will-animate {
                transform: translateY(30px);
                transition-delay: calc(var(--animation-order, 0) * 0.1s);
            }
            .resource-card.will-animate {
                transition-delay: calc(var(--animation-order, 0) * 0.1s);
            }
        `;
        document.head.appendChild(styleSheet);
        
        // Set animation order for elements that need staggered animation
        document.querySelectorAll('.step').forEach((step, index) => {
            step.style.setProperty('--animation-order', index + 1);
        });
        
        document.querySelectorAll('.resource-card').forEach((card, index) => {
            card.style.setProperty('--animation-order', index + 1);
        });
        
        // Create a single observer for all elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Add animation class and observe each element
        elementsToAnimate.forEach(element => {
            element.classList.add('will-animate');
            observer.observe(element);
        });
    };
    
    // Initialize animations
    animateOnScroll();

    // Smooth scroll for anchor links - delegate to parent
    document.body.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: targetPosition - headerHeight - 20,
                behavior: 'smooth'
            });
            
            // Update URL without scrolling
            history.pushState(null, null, targetId);
        }
    });

    // Sidebar navigation - use event delegation
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            // Remove active class from all links
            sidebar.querySelectorAll('a').forEach(a => a.classList.remove('current'));
            // Add active class to clicked link
            link.classList.add('current');
        });
    }

    // Optimized code highlighting with memoization
    const enhanceCodeBlocks = () => {
        const codeBlocks = document.querySelectorAll('pre code');
        
        // Syntax highlighting patterns
        const patterns = [
            // Keywords - using word boundaries for accuracy
            {
                pattern: /\b(const|let|var|function|return|import|export|from|if|else|for|while|switch|case|break|continue|default|class|extends|new|this|super|try|catch|finally|throw|async|await|typeof|instanceof|in|of|as|interface|type|enum)\b/g,
                replacement: '<span class="keyword">$1</span>'
            },
            // Functions/methods
            {
                pattern: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
                replacement: '<span class="function">$1</span>('
            },
            // Strings - handle escaped quotes properly
            {
                pattern: /(['"`])((?:\\.|[^\\])*?)\1/g,
                replacement: '<span class="string">$1$2$1</span>'
            },
            // Comments - single line
            {
                pattern: /(\/\/.*)/g,
                replacement: '<span class="comment">$1</span>'
            },
            // Comments - multi line (with non-greedy matching)
            {
                pattern: /(\/\*[\s\S]*?\*\/)/g,
                replacement: '<span class="comment">$1</span>'
            }
        ];
        
        codeBlocks.forEach(block => {
            let content = block.innerHTML;
            
            // Apply each pattern
            patterns.forEach(({ pattern, replacement }) => {
                content = content.replace(pattern, replacement);
            });
                
            block.innerHTML = content;
        });
    };
    
    // Initialize code highlighting
    enhanceCodeBlocks();
}); 