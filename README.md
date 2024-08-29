# AI Voice Assistant Project

This project is a web-based AI voice assistant that interacts with users through voice commands. The project utilizes HTML, CSS, and JavaScript for the front-end, Django for the back-end, and integrates the SpeechRecognition API, SpeechSynthesisUtterance, and the Gemini API to provide voice interaction and responses.

## Features

- **AI Voice Assistant**: Users can interact with the assistant via voice commands. The assistant listens to the user's queries and provides voice responses.
- **User Authentication**: Includes a user login/signup system to keep track of user interactions.
- **User History**: The system stores the last 10 queries made by the user, which can be viewed on the `history.html` page.
- **Responsive Design**: The application is built with a responsive design, ensuring compatibility with various devices.

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - SpeechRecognition API
  - SpeechSynthesisUtterance API
  - Gemini API

- **Backend**:
  - Django (Python)
  - Django Templates for rendering pages

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. **Set up a virtual environment** (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Apply migrations**:
    ```bash
    python manage.py migrate
    ```

5. **Run the development server**:
    ```bash
    python manage.py runserver
    ```

6. **Access the application**:
   Open your browser and go to `http://127.0.0.1:8000`.

## Usage

- **Voice Interaction**: Speak to the assistant by clicking the microphone button on the `index.html` page. The assistant will process your speech and provide an answer.
- **User Authentication**: Log in or sign up to track your interaction history on the `login.html` page.
- **View History**: Check your last 10 interactions on the `history.html` page.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request. All contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- Thanks to the developers of Django, SpeechRecognition, and SpeechSynthesisUtterance for providing the tools that made this project possible.
