# TitanSketch

A sophisticated web application that generates high-quality anime-style artwork using AWS Bedrock's Titan Image Generator. This project combines modern web technologies with AI capabilities to create unique, customizable anime illustrations based on text descriptions.

## 🌟 Features

- **Text-to-Image Generation**: Transform textual descriptions into anime-style artwork
- **Customizable Art Styles**: Adjust parameters like line sharpness, color vibrancy, and eye size
- **Quick Tags**: Easily enhance prompts with predefined artistic elements
- **Real-time Preview**: Watch your artwork come to life with animated loading states
- **Generation History**: Keep track of your previous creations
- **Interactive UI**: Modern, responsive interface with smooth animations

## 🛠️ Technical Stack

- **Backend**: Python with Flask
- **AI Service**: AWS Bedrock (Titan Image Generator)
- **Frontend**: HTML5, CSS3, JavaScript
- **Animations**: Anime.js
- **Styling**: Custom CSS with modern design principles

## 📋 Prerequisites

- Python 3.x
- AWS Account with Bedrock access
- AWS credentials configured

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/titansketch.git
cd titansketch
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the project root with:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
```

## 💻 Usage

1. Start the Flask server:
```bash
python TitanImageGeneration.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

3. Enter a description of your desired artwork
4. Adjust style parameters as needed
5. Click "Generate Art" and watch your creation come to life!

## 🎨 Customization Options

- **Line Sharpness**: Control the definition of line art (0-100)
- **Color Vibrancy**: Adjust color intensity and saturation
- **Eye Size**: Modify anime character eye proportions
- **Art Styles**: Choose from various preset artistic styles

## 🏗️ Project Structure

```
├── TitanImageGeneration.py    # Main Flask application
├── static/
│   ├── css/                  # Styling
│   ├── js/                   # Frontend logic
│   └── images/               # Generated artwork
├── templates/                # HTML templates
└── requirements.txt         # Python dependencies
```

## 🔒 Security

- AWS credentials are managed securely through environment variables
- Input validation for all user-provided data
- Secure file handling for generated images

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- AWS Bedrock for providing the AI image generation capabilities
- Anime.js for smooth animations
- The open-source community for inspiration and resources

---

Made with ❤️ by Mahamad Suhail