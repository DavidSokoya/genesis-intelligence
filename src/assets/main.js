document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Initialize Lucide icons
    lucide.createIcons();

    // --- Mobile Menu Logic ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- Intersection Observer for animations ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    fadeInSections.forEach(section => sectionObserver.observe(section));

    // --- Active Nav Link Highlighting ---
    const allSections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('#main-nav .nav-link');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: "-50% 0px -50% 0px" });
    allSections.forEach(section => navObserver.observe(section));

    // --- Animated Stat Counters ---
    const counters = document.querySelectorAll('.stat-counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const speed = 200;
                const inc = target / speed;
                let count = 0;
                const animate = () => {
                    if (count < target) {
                        count += inc;
                        counter.innerText = Math.ceil(count);
                        setTimeout(animate, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                animate();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    // --- Testimonial Slider ---
    const testimonials = [
        { 
            quote: "We have been working with Genesis Intelligence for years and they have truly proven to be a leader in ethical AI. Highly recommended!", 
            name: "Sylvia Dlamini", 
            title: "CEO, Atacama Corp",
            image: "./src/assets/images/testimonial-1.jpg",
            rating: 5
        },
        { 
            quote: "Genesis Intelligence has transformed the way we do R&D. Great partnership and incredibly insightful team.", 
            name: "Saeed Al-Jamil", 
            title: "Director of R&D, Euclideon Inc.",
            image: "./src/assets/images/testimonial-2.jpg",
            rating: 5
        },
        { 
            quote: "As a manufacturing company, we rely on Genesis Intelligence to improve processes and drive growth. Impressive work!", 
            name: "Johnathan Chen", 
            title: "Operations Manager, Manufacturing Partner",
            image: "./src/assets/images/testimonial-3.jpg",
            rating: 5
        }
    ];
    let currentTestimonial = 0;
    let testimonialInterval;
    const slider = document.getElementById('testimonial-slider');
    const container = document.getElementById('testimonial-container');
    const pagination = document.getElementById('testimonial-pagination');

    function createTestimonialHTML(testimonial) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += `<svg class="w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-slate-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
        }

        return `
            <div class="testimonial-card absolute inset-0 bg-white p-8 rounded-xl shadow-lg transition-opacity duration-500 ease-in-out opacity-0 flex flex-col items-center text-center">
                <img src="${testimonial.image}" alt="Photo of ${testimonial.name}" class="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-md object-cover">
                <div class="flex mb-4">${stars}</div>
                <p class="text-xl italic text-slate-700 mb-6 flex-grow">"${testimonial.quote}"</p>
                <div>
                    <p class="font-bold text-slate-900">${testimonial.name}</p>
                    <p class="text-sm text-slate-500">${testimonial.title}</p>
                </div>
            </div>`;
    }

    function showTestimonial(index) {
        currentTestimonial = index;
        const t = testimonials[currentTestimonial];
        
        const currentElement = container.firstElementChild;
        if (currentElement) {
            currentElement.classList.add('opacity-0');
        }

        setTimeout(() => {
            container.innerHTML = createTestimonialHTML(t);
            setTimeout(() => {
                const newElement = container.firstElementChild;
                if (newElement) newElement.classList.remove('opacity-0');
            }, 50);
        }, 500);

        // Update pagination
        Array.from(pagination.children).forEach((dot, i) => {
            dot.classList.toggle('bg-red-500', i === currentTestimonial);
            dot.classList.toggle('bg-slate-300', i !== currentTestimonial);
        });
    }

    function next() { showTestimonial((currentTestimonial + 1) % testimonials.length); }
    function prev() { showTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length); }

    function startSlider() {
        testimonialInterval = setInterval(next, 7000);
    }
    function stopSlider() {
        clearInterval(testimonialInterval);
    }

    // Init Testimonial Slider
    if (slider) {
        testimonials.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('pagination-dot', 'w-3', 'h-3', 'rounded-full');
            dot.addEventListener('click', () => showTestimonial(i));
            pagination.appendChild(dot);
        });
        showTestimonial(0);
        startSlider();
        
        document.getElementById('next-testimonial').addEventListener('click', next);
        document.getElementById('prev-testimonial').addEventListener('click', prev);
        slider.addEventListener('mouseenter', stopSlider);
        slider.addEventListener('mouseleave', startSlider);

        let touchstartX = 0;
        let touchendX = 0;
        slider.addEventListener('touchstart', e => touchstartX = e.changedTouches[0].screenX, { passive: true });
        slider.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) next();
            if (touchendX > touchstartX) prev();
        }, { passive: true });
    }
    
    // --- Research Tabs Logic ---
    const researchTabs = document.querySelectorAll('.research-tab');
    const researchImages = document.querySelectorAll('.research-tab-image');
    researchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabIndex = tab.getAttribute('data-tab');
            researchTabs.forEach(t => {
                t.classList.remove('active', 'bg-red-600', 'text-white', 'shadow-lg');
                t.classList.add('bg-white', 'shadow-md');
            });
            tab.classList.add('active', 'bg-red-600', 'text-white', 'shadow-lg');
            tab.classList.remove('bg-white', 'shadow-md');
            researchImages.forEach(img => {
                if (img.id === `research-img-${tabIndex}`) {
                    img.classList.remove('opacity-0');
                } else {
                    img.classList.add('opacity-0');
                }
            });
        });
    });

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
                }
            });
            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = '0px';
            } else {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success-message');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
        });
    }

    // --- Back to Top Button Logic ---
    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        // Parallax effect for hero background
        const offset = window.pageYOffset;
        const heroBg = document.querySelector('.hero-background');
        if (heroBg) {
            heroBg.style.transform = `translateY(${offset * 0.3}px)`;
        }

        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
});
