document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('a.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('text-ciano-tech');
                    if (link.getAttribute('data-nav-link') === entry.target.id) {
                        link.classList.add('text-ciano-tech');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));

    // Chart.js - Cases de Sucesso
    const ctx = document.getElementById('casesChart').getContext('2d');
    const chartData = {
        varejo: {
            labels: ['Otimização de Estoque', 'Previsão de Demanda', 'Eficiência Logística'],
            data: [40, 65, 30],
            title: 'Resultados no Setor de Varejo (%)'
        },
        saude: {
            labels: ['Redução de Readmissões', 'Otimização de Agendamentos', 'Prevenção de Doenças'],
            data: [25, 50, 45],
            title: 'Resultados no Setor de Saúde (%)'
        },
        industria: {
            labels: ['Manutenção Preditiva', 'Redução de Custos', 'Aumento de Produção'],
            data: [55, 35, 20],
            title: 'Resultados no Setor Industrial (%)'
        }
    };

    let casesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.varejo.labels,
            datasets: [{
                label: 'Melhoria Percentual',
                data: chartData.varejo.data,
                backgroundColor: '#00BFFF',
                borderColor: '#0A2A4E',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 100 }
            },
            plugins: {
                title: { display: true, text: chartData.varejo.title, font: { size: 16 } },
                legend: { display: false }
            }
        }
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-ciano-tech', 'text-white');
                btn.classList.add('bg-white', 'text-azul-corp');
            });
            
            button.classList.add('bg-ciano-tech', 'text-white');
            button.classList.remove('bg-white', 'text-azul-corp');
            
            const newData = chartData[filter];
            casesChart.data.labels = newData.labels;
            casesChart.data.datasets[0].data = newData.data;
            casesChart.options.plugins.title.text = newData.title;
            casesChart.update();
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/contact/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                formFeedback.innerHTML = `<p class="text-ciano-tech font-bold">${result.message}</p>`;
                contactForm.reset();
            } else {
                formFeedback.innerHTML = `<p class="text-red-400 font-bold">${result.message}</p>`;
            }
            setTimeout(() => { formFeedback.innerHTML = ''; }, 5000);
        })
        .catch(() => {
            formFeedback.innerHTML = `<p class="text-red-400 font-bold">Ocorreu um erro ao enviar. Tente novamente.</p>`;
            setTimeout(() => { formFeedback.innerHTML = ''; }, 5000);
        });
    });
});
