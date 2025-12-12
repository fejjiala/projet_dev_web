// ===== MODAL FUNCTIONS =====
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animation d'entrée
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// ===== FONCTIONS POUR LA MODAL D'IMAGES =====
function openImageModal(src, caption) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    
    if (modal && modalImg && captionText) {
        // Afficher l'indicateur de chargement
        modal.innerHTML = `
            <span class="close-modal" onclick="closeImageModal()">&times;</span>
            <div class="loading-indicator">
                <span>⏳</span> Chargement de l'image...
            </div>
        `;
        modal.style.display = 'block';
        modal.style.opacity = '0';
        
        // Animation d'entrée
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // Précharger l'image
        const img = new Image();
        img.onload = function() {
            // Remplacer avec l'image chargée
            modal.innerHTML = `
                <span class="close-modal" onclick="closeImageModal()">&times;</span>
                <img class="modal-image-content" id="modalImage" src="${src}" alt="${caption}">
                <div id="caption" class="modal-caption">${caption}</div>
            `;
        };
        
        img.onerror = function() {
            modal.innerHTML = `
                <span class="close-modal" onclick="closeImageModal()">&times;</span>
                <div class="loading-indicator" style="color: #FF6B6B;">
                    <span>❌</span> Impossible de charger l'image
                </div>
            `;
        };
        
        img.src = src;
        
        // Empêcher le défilement de la page
        document.body.style.overflow = 'hidden';
        
        // Notification
        showNotification(`Image "${caption}" agrandie`, 'info');
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Fermer la modal de connexion en cliquant en dehors
window.addEventListener('click', function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
    
    const imageModal = document.getElementById('imageModal');
    const modalContent = document.querySelector('.modal-image-content');
    
    if (imageModal && imageModal.style.display === 'block' && 
        event.target === imageModal) {
        closeImageModal();
    }
});

// Fermer la modal avec la touche Échap
document.addEventListener('keydown', function(e) {
    const loginModal = document.getElementById('loginModal');
    const imageModal = document.getElementById('imageModal');
    
    if (e.key === 'Escape') {
        if (loginModal && loginModal.style.display === 'block') {
            closeLoginModal();
        }
        if (imageModal && imageModal.style.display === 'block') {
            closeImageModal();
        }
    }
});

// ===== FORMULAIRE DE CONNEXION =====
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return false;
    }
    
    // Simulation de connexion
    const submitBtn = event.target.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<span>Connexion...</span>';
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = 'Se connecter';
        
        showNotification('Connexion réussie !', 'success');
        closeLoginModal();
        document.getElementById('loginForm').reset();
    }, 1500);
    
    return false;
}

// ===== FUNCTION SHOWSIGNUP =====
function showSignup() {
    closeLoginModal();
    
    setTimeout(() => {
        const formSection = document.getElementById('formulaire-inscription');
        if (formSection) {
            // Calculer l'offset pour le header fixe
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = formSection.offsetTop - headerHeight - 20;
            
            // Défilement fluide
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }, 300);
}

// ===== GESTION DES COULEURS =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'affichage de couleur
    updateColorDisplay();
    
    // Écouteurs d'événements
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        colorPicker.addEventListener('input', updateColorDisplay);
    }
    
    const colorInput = document.getElementById('colorInput');
    if (colorInput) {
        colorInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validateColorInput();
            }
        });
    }
    
    // Initialiser la navigation par défilement
    setupScrollNavigation();
});

function updateColorDisplay() {
    const colorPicker = document.getElementById('colorPicker');
    const colorDisplay = document.getElementById('selectedColorDisplay');
    
    if (colorPicker && colorDisplay) {
        const color = colorPicker.value;
        colorDisplay.style.backgroundColor = color;
        colorDisplay.style.boxShadow = `0 8px 20px ${color}80`;
        
        // Mettre à jour le champ texte
        document.getElementById('colorInput').value = color.toUpperCase();
    }
}

function validateColorInput() {
    const colorInput = document.getElementById('colorInput');
    const color = colorInput.value.trim();
    
    if (isValidHexColor(color)) {
        // Mettre à jour le sélecteur de couleur
        document.getElementById('colorPicker').value = color;
        updateColorDisplay();
        
        showNotification('Couleur valide !', 'success');
        
        // Animation de validation
        colorInput.style.borderColor = '#4ECDC4';
        setTimeout(() => {
            colorInput.style.borderColor = '';
        }, 2000);
    } else {
        showNotification('Format invalide. Utilisez #RRGGBB (ex: #FF0000)', 'error');
        colorInput.style.borderColor = '#FF6B6B';
        setTimeout(() => {
            colorInput.style.borderColor = '';
        }, 2000);
    }
}

function isValidHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// ===== GÉNÉRATION DE PALETTE =====
function generatePalette() {
    const baseColor = document.getElementById('colorPicker').value;
    const skinTone = document.getElementById('skinToneSelect').value;
    
    // Afficher la section des résultats
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    // Animation d'apparition
    resultsSection.style.animation = 'fadeInUp 0.8s ease-out';
    
    // Mettre à jour la couleur de base
    const baseColorDisplay = document.getElementById('baseColorDisplay');
    const baseColorText = document.getElementById('baseColorText');
    
    if (baseColorDisplay) {
        baseColorDisplay.style.backgroundColor = baseColor;
        baseColorDisplay.style.boxShadow = `0 8px 20px ${baseColor}80`;
        baseColorDisplay.innerHTML = `<span class="color-code">${baseColor.toUpperCase()}</span>`;
    }
    
    if (baseColorText) {
        baseColorText.textContent = baseColor.toUpperCase();
    }
    
    // Générer une palette harmonieuse
    const palette = generateHarmoniousColors(baseColor, skinTone);
    displayPalette(palette);
    
    // Générer l'analyse
    generateColorAnalysis(baseColor, skinTone);
    
    // Afficher les conseils d'utilisation
    displayUsageTips(palette);
    
    // Scroller vers les résultats
    resultsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Notification
    showNotification('Palette générée avec succès !', 'success');
}

function generateHarmoniousColors(baseColor, skinTone) {
    // Convertir hex en RGB
    const rgb = hexToRgb(baseColor);
    
    // Ajustements selon la teinte de peau
    const adjustments = {
        'très_clair': { r: 20, g: 20, b: 20 },
        'clair': { r: 10, g: 10, b: 10 },
        'moyen': { r: 0, g: 0, b: 0 },
        'foncé': { r: -10, g: -10, b: -10 },
        'très_foncé': { r: -20, g: -20, b: -20 }
    };
    
    const adj = adjustments[skinTone] || { r: 0, g: 0, b: 0 };
    
    // Générer une palette harmonieuse
    const colors = [
        baseColor,
        lightenColor(rgb, 30 + adj.r),
        darkenColor(rgb, 30 + adj.r),
        complementColor(rgb),
        analogousColor(rgb, 30),
        analogousColor(rgb, -30)
    ];
    
    return colors;
}

function hexToRgb(hex) {
    // Supprimer le # si présent
    hex = hex.replace('#', '');
    
    // Convertir en valeurs RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function lightenColor(rgb, amount = 30) {
    const r = Math.min(255, rgb.r + amount);
    const g = Math.min(255, rgb.g + amount);
    const b = Math.min(255, rgb.b + amount);
    return rgbToHex(r, g, b);
}

function darkenColor(rgb, amount = 30) {
    const r = Math.max(0, rgb.r - amount);
    const g = Math.max(0, rgb.g - amount);
    const b = Math.max(0, rgb.b - amount);
    return rgbToHex(r, g, b);
}

function complementColor(rgb) {
    return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

function analogousColor(rgb, degree = 30) {
    // Convertir RGB en HSL pour une rotation de teinte plus précise
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = (hsl.h + degree) % 360;
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatique
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatique
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function displayPalette(colors) {
    const paletteDisplay = document.getElementById('paletteDisplay');
    paletteDisplay.innerHTML = '';
    
    colors.forEach((color, index) => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        colorBox.style.boxShadow = `0 8px 20px ${color}80`;
        colorBox.setAttribute('data-color', color);
        colorBox.setAttribute('title', `Cliquer pour copier: ${color}`);
        
        // Ajouter le code couleur
        const colorCode = document.createElement('span');
        colorCode.className = 'color-code';
        colorCode.textContent = color;
        colorBox.appendChild(colorCode);
        
        // Événement de clic pour copier
        colorBox.addEventListener('click', function() {
            copyToClipboard(color);
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        paletteDisplay.appendChild(colorBox);
    });
}

function getContrastColor(hexColor) {
    const rgb = hexToRgb(hexColor);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(`Couleur ${text} copiée !`, 'success');
    }).catch(err => {
        console.error('Erreur:', err);
        // Fallback pour anciens navigateurs
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification(`Couleur ${text} copiée !`, 'success');
    });
}

function generateColorAnalysis(color, skinTone) {
    const analysisText = document.getElementById('colorAnalysisText');
    const tips = document.getElementById('colorTips');
    
    const analyses = {
        'très_clair': 'Cette couleur crée un magnifique contraste avec les teints très clairs, illuminant votre visage.',
        'clair': 'Parfaite pour les teints clairs ! Elle ajoute de la chaleur et de la vitalité.',
        'moyen': 'Excellente harmonie avec les teints moyens. Naturel et équilibré.',
        'foncé': 'Superbe sur les teints foncés. Elle met en valeur votre éclat naturel.',
        'très_foncé': 'Contraste élégant et sophistiqué pour les teints très foncés.'
    };
    
    if (analysisText) {
        analysisText.textContent = analyses[skinTone] || 'Couleur bien choisie !';
    }
    
    // Conseils dynamiques
    const tipsList = [
        '💡 Idéal pour les tenues de jour comme de soirée',
        '👔 Parfait avec des accessoires en or ou en cuivre',
        '🎨 Associez avec du blanc cassé pour un look frais',
        '✨ Ajoutez une touche de noir pour plus de sophistication'
    ];
    
    if (tips) {
        tips.innerHTML = tipsList.map(tip => `<p>${tip}</p>`).join('');
    }
}

function displayUsageTips(palette) {
    const usageTips = document.getElementById('usageTips');
    
    if (!usageTips) {
        console.error("L'élément usageTips n'a pas été trouvé dans le DOM");
        return;
    }
    
    const tipsHTML = `
        <div class="tips-grid">
            <div class="tip-card">
                <h4>👕 Vêtements</h4>
                <p>Utilisez la couleur principale pour un haut et les tons secondaires pour le bas et les accessoires.</p>
            </div>
            <div class="tip-card">
                <h4>🏠 Décoration</h4>
                <p>La couleur principale pour les murs, les tons clairs pour les meubles et les tons foncés pour les accents.</p>
            </div>
            <div class="tip-card">
                <h4>🎨 Design</h4>
                <p>Utilisez la palette pour créer des interfaces harmonieuses et attractives.</p>
            </div>
            <div class="tip-card">
                <h4>💼 Professionnel</h4>
                <p>Idéal pour des présentations et documents qui attirent l'attention de manière subtile.</p>
            </div>
        </div>
    `;
    
    usageTips.innerHTML = tipsHTML;
}

// ===== FONCTIONS D'ACTION =====
function savePalette() {
    showNotification('Palette sauvegardée dans vos favoris !', 'success');
    // Ici vous pourriez ajouter du code pour sauvegarder dans localStorage
    localStorage.setItem('vibrant_last_palette', JSON.stringify({
        colors: Array.from(document.querySelectorAll('.color-box')).map(box => box.getAttribute('data-color')),
        date: new Date().toISOString()
    }));
}

function resetPalette() {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('colorPicker').value = '#d2b48c';
    updateColorDisplay();
    
    showNotification('Nouvelle palette prête !', 'info');
}

function exportPalette() {
    const palette = Array.from(document.querySelectorAll('.color-box'))
        .map(box => box.getAttribute('data-color'));
    
    const exportData = {
        palette: palette,
        baseColor: document.getElementById('colorPicker').value,
        generatedAt: new Date().toISOString(),
        project: 'VIBRANT'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `palette-vibrant-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Palette exportée au format JSON !', 'success');
}

// ===== NAVIGATION PAR DÉFILEMENT =====
function setupScrollNavigation() {
    const scrollLinks = document.querySelectorAll('.scroll-link');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calculer la position avec offset pour le header fixe
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    
                    let targetPosition;
                    
                    if (targetId === '#contact-footer') {
                        targetPosition = document.body.scrollHeight - window.innerHeight;
                    } else {
                        targetPosition = targetElement.offsetTop - headerHeight - 20;
                    }
                    
                    // Défilement fluide
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
    updateColorDisplay();
    setupScrollNavigation();
});