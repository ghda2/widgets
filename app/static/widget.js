(function() {
    'use strict';

    // Detecta o domínio base do script
    const currentScript = document.currentScript || document.querySelector('script[src*="widget.js"]');
    const scriptSrc = currentScript ? currentScript.src : window.location.origin + '/widget.js';
    const baseUrl = scriptSrc.replace('/widget.js', '');

    console.log('Loading chat widget from:', baseUrl);

    // Aguarda o DOM estar pronto
    function init() {
        // Carrega o HTML do widget
        fetch(baseUrl + '/widget-html')
            .then(response => response.text())
            .then(html => {
                // Cria um container temporário para processar o HTML
                const temp = document.createElement('div');
                temp.innerHTML = html;
                
                // Extrai apenas o conteúdo do body e script
                const bodyContent = temp.querySelector('body');
                if (bodyContent) {
                    // Adiciona os elementos HTML ao documento
                    const elements = bodyContent.querySelectorAll(':scope > *:not(script)');
                    elements.forEach(el => {
                        const clonedEl = el.cloneNode(true);
                        
                        // Corrige URLs de imagens para usar baseUrl
                        const imgs = clonedEl.querySelectorAll('img[src^="/"]');
                        imgs.forEach(img => {
                            img.src = baseUrl + img.getAttribute('src');
                        });
                        
                        document.body.appendChild(clonedEl);
                    });
                    
                    // Extrai e executa o script, injetando o baseUrl
                    const scripts = bodyContent.querySelectorAll('script');
                    scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        if (script.src) {
                            newScript.src = script.src;
                        } else {
                            // Injeta a variável baseUrl no script
                            newScript.textContent = `window.NEXR_WIDGET_BASE_URL = '${baseUrl}';\n` + script.textContent;
                        }
                        document.body.appendChild(newScript);
                    });
                    
                    // Extrai e adiciona o style do head
                    const styleContent = temp.querySelector('style');
                    if (styleContent) {
                        document.head.appendChild(styleContent.cloneNode(true));
                    }
                }
                
                console.log('Chat widget loaded successfully');
            })
            .catch(error => {
                console.error('Error loading chat widget:', error);
            });
    }

    // Inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();