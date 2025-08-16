// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');

    // Hide preloader after page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('fade-out');
            // Enable scrolling after preloader disappears
            document.body.style.overflow = 'auto';
        }, 1000);
    });

    // Disable scrolling while preloader is active
    document.body.style.overflow = 'hidden';
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle-checkbox');

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply the saved theme or use the preferred color scheme
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    // Toggle theme when the checkbox is clicked
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll behavior
    const header = document.querySelector('header');

    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // Active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('header').offsetHeight;

            if (window.scrollY >= sectionTop - headerHeight - 100) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Initialize skill progress bars
    function initSkillBars() {
        const progressBars = document.querySelectorAll('.progress-bar');

        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }

    // Initialize skill bars when they come into view
    function checkSkillBars() {
        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const sectionPosition = skillsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (sectionPosition < screenPosition) {
            initSkillBars();
            window.removeEventListener('scroll', checkSkillBars);
        }
    }

    window.addEventListener('scroll', checkSkillBars);
    checkSkillBars(); // Check on initial load

    // Skills tabs functionality
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillCategories = document.querySelectorAll('.skill-category');

    if (skillTabs.length > 0) {
        skillTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Update active tab
                skillTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Get the tab data
                const tabData = this.getAttribute('data-tab');

                // Hide all skill categories
                skillCategories.forEach(category => {
                    category.style.display = 'none';
                });

                // Show the selected category
                const selectedCategory = document.querySelector(`.skill-category h3:contains('${tabData.charAt(0).toUpperCase() + tabData.slice(1)}')`);
                if (selectedCategory) {
                    selectedCategory.closest('.skill-category').style.display = 'block';

                    // Reinitialize skill bars for the visible category
                    const progressBars = selectedCategory.closest('.skill-category').querySelectorAll('.progress-bar');
                    progressBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 50);
                    });
                } else {
                    // If no matching category, show the first one
                    skillCategories[0].style.display = 'block';
                }
            });
        });

        // Add contains selector for jQuery-like functionality
        Element.prototype.matches = Element.prototype.matches || Element.prototype.msMatchesSelector;

        Element.prototype.closest = Element.prototype.closest || function(selector) {
            let el = this;
            while (el) {
                if (el.matches(selector)) {
                    return el;
                }
                el = el.parentElement;
            }
            return null;
        };

        // Add :contains selector functionality
        document.querySelectorAll = document.querySelectorAll || function(selector) {
            return Array.from(document.querySelectorAll(selector));
        };

        // Custom contains selector
        HTMLElement.prototype.contains = function(text) {
            return this.textContent.includes(text);
        };
    }

    // Enhanced Project filtering with animations
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const projectsGrid = document.querySelector('.projects-grid');

    // Add animation styles for filtering
    const filterAnimationStyle = document.createElement('style');
    filterAnimationStyle.textContent = `
        .projects-grid {
            transition: height 0.5s ease;
        }
        .project-item {
            transition: all 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .project-item.hidden {
            opacity: 0;
            transform: scale(0.8);
            pointer-events: none;
        }
        .project-item.visible {
            opacity: 1;
            transform: scale(1);
        }
        .filter-btn {
            position: relative;
            overflow: hidden;
        }
        .filter-btn::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background-color: var(--primary-color);
            transition: width 0.3s ease;
        }
        .filter-btn:hover::after,
        .filter-btn.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(filterAnimationStyle);

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button with animation
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Add a slight delay between items for cascade effect
            let delay = 0;

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    setTimeout(() => {
                        item.classList.remove('hidden');
                        item.classList.add('visible');
                    }, delay);
                    delay += 100; // Increment delay for cascade effect
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('visible');
                }
            });

            // Adjust grid height after filtering
            setTimeout(() => {
                let visibleItems = document.querySelectorAll('.project-item:not(.hidden)');
                if (visibleItems.length === 0) {
                    projectsGrid.style.height = '0px';
                } else {
                    projectsGrid.style.height = 'auto';
                }
            }, 500);
        });
    });

    // Initialize all projects as visible
    projectItems.forEach(item => {
        item.classList.add('visible');
    });

    // Form validation and submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Simple validation
            if (name === '' || email === '' || subject === '' || message === '') {
                alert('Please fill in all fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // If validation passes, you would typically send the form data to a server
            // For this example, we'll just show a success message
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.style.display = 'block';
            setTimeout(() => {
                scrollTopBtn.style.opacity = '1';
            }, 10);
        } else {
            scrollTopBtn.style.opacity = '0';
            setTimeout(() => {
                scrollTopBtn.style.display = 'none';
            }, 300);
        }
    });

    // Add scroll to top button styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            display: none;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .scroll-top-btn:hover {
            background-color: #27ae60;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
    `;
    document.head.appendChild(style);

    // Add animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.skill-item, .project-item, .contact-item');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;

            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .skill-item, .project-item, .contact-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
    `;
    document.head.appendChild(animationStyle);

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
});
