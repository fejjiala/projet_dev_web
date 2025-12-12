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

// Fermer la modal en cliquant en dehors
window.addEventListener('click', function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }


});

// Fermer avec la touche Échap
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLoginModal();
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
            
            // Mise en surbrillance
            formSection.style.animation = 'none';
            setTimeout(() => {
                formSection.style.animation = 'pulseHighlight 2s ease-in-out';
            }, 10);
            
            // Ajout de la classe pour le style de surbrillance
            formSection.classList.add('highlighted');
            setTimeout(() => {
                formSection.classList.remove('highlighted');
            }, 2000);
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
    const color = colorInput.value;
    
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
        showNotification('Format invalide. Utilisez #RRGGBB', 'error');
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
    const skinTone = document.querySelector('select[name="couleur_peau"]').value;
    
    // Afficher la section des résultats
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    // Animation d'apparition
    resultsSection.style.animation = 'fadeInUp 0.8s ease-out';
    
    // Mettre à jour la couleur de base
    document.getElementById('baseColorDisplay').style.backgroundColor = baseColor;
    document.getElementById('baseColorText').textContent = baseColor.toUpperCase();
    
    // Générer une palette harmonieuse
    const palette = generateHarmoniousColors(baseColor, skinTone);
    displayPalette(palette);
    
    // Générer l'analyse
    generateColorAnalysis(baseColor, skinTone);
    
    // AFFICHER LES CONSEILS D'UTILISATION
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
    return [
        baseColor,
        lightenColor(rgb, 30 + adj.r),
        darkenColor(rgb, 30 + adj.r),
        complementColor(rgb),
        analogousColor(rgb, 30),
        triadicColor(rgb, 120)
    ];
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
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
    // Simuler un décalage de teinte
    return rgbToHex(
        (rgb.r + degree) % 256,
        (rgb.g + degree) % 256,
        (rgb.b + degree) % 256
    );
}

function triadicColor(rgb, degree = 120) {
    return rgbToHex(
        (rgb.r + degree) % 256,
        (rgb.g + degree) % 256,
        (rgb.b + degree) % 256
    );
}

function displayPalette(colors) {
    const paletteDisplay = document.getElementById('paletteDisplay');
    paletteDisplay.innerHTML = '';
    
    colors.forEach((color, index) => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        colorBox.style.background = `linear-gradient(135deg, ${color}, ${lightenColor(hexToRgb(color), 20)})`;
        colorBox.style.boxShadow = `0 8px 20px ${color}80`;
        colorBox.setAttribute('data-color', color);
        colorBox.setAttribute('title', `Cliquer pour copier: ${color}`);
        
        // Ajouter le code couleur
        const colorCode = document.createElement('span');
        colorCode.className = 'color-code';
        colorCode.textContent = color;
        colorCode.style.color = getContrastColor(color);
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
    
    analysisText.textContent = analyses[skinTone] || 'Couleur bien choisie !';
    
    // Conseils dynamiques
    const tipsList = [
        '💡 Idéal pour les tenues de jour comme de soirée',
        '👔 Parfait avec des accessoires en or ou en cuivre',
        '🎨 Associez avec du blanc cassé pour un look frais',
        '✨ Ajoutez une touche de noir pour plus de sophistication'
    ];
    
    tips.innerHTML = tipsList.map(tip => `<p>${tip}</p>`).join('');
}

// ===== FONCTION POUR AFFICHER LES CONSEILS D'UTILISATION =====
function displayUsageTips(palette) {
    const usageTips = document.getElementById('usageTips');
    
    if (!usageTips) {
        console.error("L'élément usageTips n'a pas été trouvé dans le DOM");
        return;
    }
    
    // Créer le contenu HTML des conseils
    const tipsHTML = `
        <div class="tips-content">
            <div class="tip-item">
                <h4><strong>👕 Pour vos vêtements</strong></h4>
                <p>Utilisez la couleur de base pour un haut (chemise, t-shirt) et les couleurs 1 et 2 pour le bas (pantalon, jupe). La couleur 3 peut servir pour les accessoires.</p>
            </div>
            
            <div class="tip-item">
                <h4><strong>🏠 Pour votre déco</strong></h4>
                <p>Peignez un mur avec la couleur de base. Utilisez la couleur 1 pour les meubles et la couleur 2 pour les textiles (rideaux, coussins).</p>
            </div>
            
            <div class="tip-item">
                <h4><strong>🎨 Pour vos designs</strong></h4>
                <p>Utilisez la couleur de base pour l'arrière-plan. La couleur 1 pour le texte principal et la couleur 2 pour les boutons et liens.</p>
            </div>
            
            <div class="tip-item">
                <h4><strong>📱 Pour vos interfaces</strong></h4>
                <p>La couleur de base pour le header, la couleur 1 pour les boutons d'action, la couleur 2 pour les bordures et séparateurs.</p>
            </div>
        </div>
    `;
    
    // Injecter le HTML dans l'élément
    usageTips.innerHTML = tipsHTML;
    
    // Ajouter des styles si nécessaire
    addUsageTipsStyles();
}

// ===== FONCTIONS D'ACTION =====
function savePalette() {
    showNotification('Palette sauvegardée dans vos favoris !', 'success');
    // Ici vous pourriez ajouter du code pour sauvegarder dans localStorage
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
            
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calculer la position avec offset pour le header fixe
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    
                    let targetPosition;
                    
                    // Cas spécial pour le footer
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
                    
                    // Mettre en surbrillance la section cible
                    highlightTargetSection(targetElement);
                }
            }
        });
    });
}

function highlightTargetSection(element) {
    // Ajouter une classe de surbrillance
    element.classList.add('highlighted');
    
    // Retirer la classe après l'animation
    setTimeout(() => {
        element.classList.remove('highlighted');
    }, 1500);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
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
                document.body.removeChild(notification);
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

// ===== AJOUT DES STYLES POUR LES CONSEILS =====
function addUsageTipsStyles() {
    // Vérifier si les styles sont déjà présents
    if (document.querySelector('#usage-tips-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'usage-tips-styles';
    styleElement.textContent = `
        .tips-content {
            margin-top: 1.5rem;
        }
        
        .tip-item {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            border-left: 4px solid #4ECDC4;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .tip-item h4 {
            color: #1A1A2E;
            margin-bottom: 0.75rem;
            font-size: 1.1rem;
        }
        
        .tip-item p {
            color: #6c757d;
            line-height: 1.6;
            margin: 0;
        }
        
        /* Styles pour les notifications */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 350px;
            border-left: 4px solid;
        }
        
        .notification-success {
            border-left-color: #4ECDC4;
        }
        
        .notification-error {
            border-left-color: #FF6B6B;
        }
        
        .notification-warning {
            border-left-color: #FFE66D;
        }
        
        .notification-info {
            border-left-color: #45B7D1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-icon {
            font-size: 1.2rem;
        }
        
        .notification-message {
            font-weight: 500;
            color: #1A1A2E;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// ===== STYLES INITIAUX =====
// Ajouter les styles au chargement
addUsageTipsStyles();