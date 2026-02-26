document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a skill item, animate the progress bar
                if (entry.target.classList.contains('skill-item')) {
                    const bar = entry.target.querySelector('.progress-bar');
                    if (bar) {
                        bar.style.width = bar.dataset.width;
                    }
                }
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    reveals.forEach(el => revealObserver.observe(el));

    // Form Submission Handling (Formspree AJAX)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerText;
            const formData = new FormData(contactForm);

            btn.innerText = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString(),
                });

                if (response.ok) {
                    btn.innerText = 'Message Sent!';
                    btn.style.background = '#00c853';
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.errors ? errorData.errors.map(err => err.message).join(', ') : 'Form submission failed');
                }
            } catch (error) {
                btn.innerText = 'Error!';
                btn.style.background = '#ff5252';
                console.error('Submission Error:', error);

                // ユーザーに詳細なエラー内容をアラートで表示
                alert('送信に失敗しました。\n理由: ' + error.message + '\n\n【重要】\nNetlify FormsはNetlifyにデプロイされた環境でのみ動作します。ローカル(file://)環境では送信できません。');
            } finally {
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    // Dynamic Header Background on Scroll
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '15px 5%';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            nav.style.padding = '20px 5%';
            nav.style.boxShadow = 'none';
        }
    });

    // Hero title typing effect (simple)
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        heroTitle.style.borderRight = '2px solid var(--accent)';
        heroTitle.style.whiteSpace = 'nowrap';
        heroTitle.style.overflow = 'hidden';
        heroTitle.style.width = '0';
        heroTitle.style.animation = 'typing 2s steps(40, end) forwards';

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes typing {
                from { width: 0 }
                to { width: 100% }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            heroTitle.style.borderRight = 'none';
        }, 2100);
    }
});
