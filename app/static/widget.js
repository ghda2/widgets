(function() {
    'use strict';

    // Detecta o domínio base do script
    const currentScript = document.currentScript || document.querySelector('script[src*="widget.js"]');
    const scriptSrc = currentScript ? currentScript.src : window.location.origin + '/widget.js';
    const baseUrl = scriptSrc.replace('/widget.js', '');

    console.log('Loading chat widget from:', baseUrl);

    // Carrega o HTML do widget via iframe ou fetch
    fetch(baseUrl + '/widget-html')
        .then(response => response.text())
        .then(html => {
            // Cria um container para o widget
            const container = document.createElement('div');
            container.id = 'nexr-widget-container';
            container.innerHTML = html;
            document.body.appendChild(container);
            
            console.log('Chat widget loaded successfully');
        })
        .catch(error => {
            console.error('Error loading chat widget:', error);
        });

})();