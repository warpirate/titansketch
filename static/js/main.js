// Initialize anime.js library for animations
const anime = window.anime;

// Get references to DOM elements for UI interaction
const description = document.getElementById('description');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const generatedImage = document.getElementById('generatedImage');
const loadingSpinner = document.getElementById('loadingSpinner');
const generatedPrompt = document.getElementById('generatedPrompt');
const historyGallery = document.getElementById('historyGallery');

// Track selected art style
let selectedStyle = null;

// Set up style button event listeners
document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons and add to selected
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedStyle = this.dataset.style;
    });
});

// Handle quick tag selection for prompt enhancement
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function() {
        const tagText = this.dataset.tag;
        const currentText = description.value;
        // Append tag with comma separator if needed
        description.value = currentText + (currentText ? ', ' : '') + tagText;
        
        // Add click animation effect
        this.classList.add('tag-clicked');
        setTimeout(() => this.classList.remove('tag-clicked'), 200);
    });
});

// Handle image generation process
generateBtn.addEventListener('click', async function() {
    // Validate input
    if (!description.value.trim()) {
        alert('Please enter a description first!');
        return;
    }

    // Update UI to show loading state
    loadingSpinner.classList.remove('hidden');
    generatedImage.classList.add('hidden');
    generateBtn.disabled = true;
    downloadBtn.disabled = true;

    // Prepare form data with all parameters
    const formData = new FormData();
    formData.append('description', description.value);
    formData.append('style', selectedStyle || 'random');
    formData.append('lineSharpness', document.getElementById('lineSharpness').value);
    formData.append('colorVibrancy', document.getElementById('colorVibrancy').value);
    formData.append('eyeSize', document.getElementById('eyeSize').value);

    try {
        // Send request to backend
        const response = await fetch('/generate', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Update UI with generated image
            generatedImage.src = data.image_url;
            generatedImage.onload = function() {
                loadingSpinner.classList.add('hidden');
                generatedImage.classList.remove('hidden');
                downloadBtn.disabled = false;
                
                // Add visual effects
                addSparkleEffect();
            };

            // Display the prompt used for generation
            generatedPrompt.textContent = data.prompt;
            generatedPrompt.classList.add('show');

            // Add to history gallery
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <img src="${data.image_url}" alt="Generated Art">
                <div class="history-prompt">${data.prompt}</div>
            `;
            historyGallery.insertBefore(historyItem, historyGallery.firstChild);
        } else {
            throw new Error(data.error || 'Failed to generate image');
        }
    } catch (error) {
        alert(error.message);
        loadingSpinner.classList.add('hidden');
    } finally {
        generateBtn.disabled = false;
    }
});

// Handle image download functionality
downloadBtn.addEventListener('click', function() {
    if (generatedImage.src) {
        const link = document.createElement('a');
        link.href = generatedImage.src;
        link.download = 'anime-art.png';
        link.click();
    }
});

// Add visual sparkle effect to generated images
function addSparkleEffect() {
    const container = document.querySelector('.image-container');
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        // Randomize sparkle position
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 3000);
    }
}

// Handle form submission and loading state
document.getElementById('artForm').addEventListener('submit', function(e) {
    showLoading();
});

// Display loading overlay with animations
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
    
    // Animate progress bar
    anime({
        targets: '.progress-fill',
        width: '100%',
        duration: 2000,
        easing: 'easeInOutQuad',
        loop: true
    });

    // Animate loading mascot
    anime({
        targets: '.mascot-loader',
        rotate: '1turn',
        duration: 1000,
        easing: 'easeInOutQuad',
        loop: true
    });
}

// Hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'none';
}

// Handle art style selection
function selectStyle(style) {
    // Update hidden input and visual selection
    document.getElementById('style').value = style;
    
    const options = document.querySelectorAll('.style-option');
    options.forEach(option => {
        option.classList.remove('active');
        if (option.textContent.includes(style)) {
            option.classList.add('active');
        }
    });

    // Add visual feedback
    addSparkleEffect(event.currentTarget);
}

// Add sparkle animation to clicked elements
function addSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    element.appendChild(sparkle);

    // Animate sparkle effect
    anime({
        targets: sparkle,
        scale: [0, 1],
        opacity: [1, 0],
        duration: 800,
        easing: 'easeOutExpo',
        complete: function() {
            sparkle.remove();
        }
    });
}

// Handle tag appending to prompt
function appendToPrompt(tag) {
    const textarea = document.getElementById('description');
    const currentText = textarea.value;
    const separator = currentText.length > 0 ? ', ' : '';
    textarea.value = currentText + separator + tag;
    
    // Animate clicked tag
    const clickedTag = event.target;
    anime({
        targets: clickedTag,
        scale: [1, 1.2, 1],
        duration: 300,
        easing: 'easeInOutQuad'
    });
}

// Handle resolution button selection
document.querySelectorAll('.resolution-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.resolution-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Initialize and manage history gallery
function initHistoryGallery() {
    const gallery = document.getElementById('historyGallery');
    if (!gallery) return;

    // Add hover animations to gallery items
    const items = gallery.querySelectorAll('.gallery-item');
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            anime({
                targets: item,
                scale: 1.1,
                duration: 300,
                easing: 'easeOutExpo'
            });
        });

        item.addEventListener('mouseleave', () => {
            anime({
                targets: item,
                scale: 1,
                duration: 300,
                easing: 'easeOutExpo'
            });
        });
    });
}

// Add glow effect to image frame
function addFrameGlowEffect() {
    const frame = document.querySelector('.image-frame');
    if (!frame) return;

    // Animate frame glow
    anime({
        targets: '.frame-effect',
        opacity: [0.5, 1],
        duration: 1500,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutQuad'
    });
}

// Initialize all components on page load
document.addEventListener('DOMContentLoaded', function() {
    initHistoryGallery();
    addFrameGlowEffect();
});

// Handle successful image generation
function handleSuccessfulGeneration() {
    hideLoading();
    
    // Add success animation
    anime({
        targets: '.image-frame',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo'
    });

    // Show celebration effect
    createConfetti();
}

// Create confetti celebration effect
function createConfetti() {
    const colors = ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff'];
    const confettiCount = 50;
    
    // Create and animate confetti particles
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        document.body.appendChild(confetti);

        anime({
            targets: confetti,
            top: '100vh',
            rotate: Math.random() * 360,
            duration: Math.random() * 1500 + 1000,
            easing: 'easeOutExpo',
            complete: function() {
                confetti.remove();
            }
        });
    }
}
