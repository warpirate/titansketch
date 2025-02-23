import boto3
import json
import base64
import os
from datetime import datetime
from flask import Flask, request, render_template, jsonify
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ArtGenerator:
    """A class that generates anime-style art using AWS Bedrock's Titan Image Generator.
    
    This class handles the connection to AWS Bedrock service and provides methods
    to generate art based on text descriptions and style parameters. It also manages
    the history of generated images.
    """
    
    def __init__(self):
        """Initialize the ArtGenerator with AWS Bedrock client.
        
        Establishes a connection to AWS Bedrock using credentials from environment
        variables. Raises an exception if initialization fails.
        """
        try:
            # Create AWS session using environment variables
            session = boto3.Session(
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                region_name=os.getenv('AWS_REGION', 'ap-south-1')  # Default to ap-south-1 if not specified
            )
            # Initialize Bedrock client for image generation
            self.bedrock = session.client(service_name="bedrock-runtime")
            logger.info(" Bedrock client is awake and ready to create magic!")
        except Exception as e:
            logger.error(f"Error initializing Bedrock client: {str(e)}")
            raise

    def generate_art(self, description, style=None, line_sharpness=50, color_vibrancy=50, eye_size=50):
        """Generate anime-style art based on text description and style parameters.
        
        Args:
            description (str): The main text description of the desired image
            style (str, optional): Specific art style to apply. Defaults to None.
            line_sharpness (int, optional): Controls the sharpness of line art (0-100). Defaults to 50.
            color_vibrancy (int, optional): Controls color intensity (0-100). Defaults to 50.
            eye_size (int, optional): Controls the size of anime eyes (0-100). Defaults to 50.
            
        Returns:
            tuple: (image_path, prompt) if successful, (None, None) if failed
        """
        try:
            # Construct the image generation prompt by combining all style parameters
            style_prompt = f" in {style} style" if style and style != "random" else ""
            eye_size_prompt = f" with {'large' if eye_size > 75 else 'medium' if eye_size > 25 else 'small'} anime eyes"
            color_prompt = f", {'vibrant' if color_vibrancy > 75 else 'balanced' if color_vibrancy > 25 else 'muted'} colors"
            line_prompt = f", {'sharp' if line_sharpness > 75 else 'medium' if line_sharpness > 25 else 'soft'} line art"
            
            final_prompt = f"{description}{style_prompt}{eye_size_prompt}{color_prompt}{line_prompt}"
            logger.info(f"Generated prompt: {final_prompt}")
            
            # Configure the image generation parameters
            payload = {
                "textToImageParams": {
                    "text": final_prompt
                },
                "taskType": "TEXT_IMAGE",
                "imageGenerationConfig": {
                    "cfgScale": 8.0,  # Controls how closely the image follows the prompt
                    "seed": int(line_sharpness * color_vibrancy * eye_size) % 100000,  # Use settings as seed for reproducibility
                    "quality": "standard",
                    "width": 1024,
                    "height": 1024,
                    "numberOfImages": 1
                }
            }
            
            body = json.dumps(payload)
            logger.info("Sending request to Bedrock")
            
            # Call AWS Bedrock API to generate the image
            response = self.bedrock.invoke_model(
                body=body,
                modelId="amazon.titan-image-generator-v1",
                accept="application/json",
                contentType="application/json"
            )
            
            response_body = json.loads(response.get('body').read())
            
            # Process the generated image and save it
            if 'images' in response_body:
                image_data = base64.b64decode(response_body['images'][0])
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f'static/images/generated_{timestamp}.png'
                
                # Ensure the images directory exists
                os.makedirs('static/images', exist_ok=True)
                
                # Save the generated image
                with open(filename, 'wb') as f:
                    f.write(image_data)
                
                # Update generation history
                self.save_to_history(filename, final_prompt)
                
                return filename, final_prompt
            else:
                logger.warning("No images in response")
                return None, None
                
        except Exception as e:
            logger.error(f"Error generating art: {str(e)}")
            return None, None

    def save_to_history(self, image_path, prompt):
        try:
            history_file = 'static/history.json'
            history = []
            
            if os.path.exists(history_file):
                with open(history_file, 'r') as f:
                    history = json.load(f)
            
            history.insert(0, {
                'image_path': image_path,
                'prompt': prompt,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })
            
            # Keep only last 10 items
            history = history[:10]
            
            with open(history_file, 'w') as f:
                json.dump(history, f)
                
        except Exception as e:
            logger.error(f"Error saving to history: {str(e)}")

app = Flask(__name__)
generator = ArtGenerator()

@app.route('/')
def index():
    # Load history
    history = []
    history_file = 'static/history.json'
    if os.path.exists(history_file):
        with open(history_file, 'r') as f:
            history = json.load(f)
    return render_template('index.html', history=history)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.form
        description = data.get('description', '')
        style = data.get('style', 'random')
        line_sharpness = float(data.get('lineSharpness', 50))
        color_vibrancy = float(data.get('colorVibrancy', 50))
        eye_size = float(data.get('eyeSize', 50))
        
        if not description:
            return jsonify({'error': 'Please provide a description'}), 400
            
        image_path, prompt = generator.generate_art(
            description, style, line_sharpness, color_vibrancy, eye_size
        )
        
        if image_path:
            return jsonify({
                'success': True,
                'image_url': f'/{image_path}',
                'prompt': prompt
            })
        else:
            return jsonify({'error': 'Failed to generate image'}), 500
            
    except Exception as e:
        logger.error(f"Error in generate route: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Ensure the images directory exists
    os.makedirs('static/images', exist_ok=True)
    app.run(debug=True)