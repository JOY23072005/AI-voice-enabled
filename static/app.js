const startBtn = document.querySelector("#start");
const audioTurn = new Audio("/static/ting.mp3");
const buffer = document.querySelector("#process");
const buffer2 = document.querySelector("#result");
const userTextDisplay = document.querySelector("#user");
const alexTextDisplay = document.querySelector("#alex");


let isStopped = true;
let isSpeaking = false;
let isListeningMode = false;

if (islogged) {
    console.log(user);
    const anchor = document.querySelector(".history");
    if (anchor) {
        anchor.className = "nav-item dropdown";
        if (anchor.firstChild && anchor.firstChild.nextSibling) {
            anchor.firstChild.nextSibling.className = "nav-link dropdown-toggle";
        }
    }
}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function post(transcript, ans) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/history", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        reject("Failed to parse history response JSON");
                    }
                } else {
                    reject(xhr.responseText);
                }
            }
        };

        xhr.send(JSON.stringify({ history: transcript, answer: ans }));
    });
}


const stripEmojis = (str) => {
    return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').replace(/\s+/g, ' ').trim();
};


function gemini(transcript, islogged) {
    if (userTextDisplay) userTextDisplay.style['text-decoration'] = "none";

    fetch('/api/gemini/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') 
        },
        body: JSON.stringify({ "transcript": transcript })
    })
    .then(async response => {
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return response.json();
    })
    .then(data => {
        let answer = data.candidates[0].content.parts[0].text;
        answer = answer.replaceAll("*", "");
        console.log('Response:', answer);
        
        if (!isStopped) {
            
            if (buffer) buffer.classList.remove("is-visible");
            if (buffer2) buffer2.classList.add("is-visible"); 
            
            startBtn.className = "button down"; 
            startBtn.innerHTML = "Stop"; 
            isStopped = false;       
            isListeningMode = true;  
            
            
            if (alexTextDisplay) alexTextDisplay.innerText = answer;
            
            if (islogged) {
                post(transcript, answer)
                .then(response => {
                    let hist1 = document.querySelector("#hist1");
                    let hist2 = document.querySelector("#hist2");
                    if (hist1 && hist2) {
                        hist2.innerText = hist1.innerText;
                        hist1.innerText = response["history"];
                    }
                })
                .catch(error => console.error(error));
            }
            
            if (transcript.includes("code")) {
                let lastIndex = answer.lastIndexOf("```");
                let mySubString = lastIndex !== -1 ? answer.substring(lastIndex + 3, answer.length - 1) : answer;
                readOut(stripEmojis(mySubString));
            } else {
                readOut(stripEmojis(answer));
            }
        }
    })
    .catch(error => {
        console.error('Core Logic Fallback Routing Error:', error);
        
        startBtn.className = "button up";
        startBtn.innerHTML = "Start";
        isListeningMode = false;
        if (buffer) buffer.classList.remove("is-visible");
        
        readOut("I can't answer this right now. I am sorry!");
        if (userTextDisplay) userTextDisplay.style['text-decoration'] = "line-through";
    });
}


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;

recognition.onstart = function () {
    console.log("Speech recognition active loop started.");
};

recognition.onend = function () {
    console.log("Speech recognition baseline loop disconnected.");
    
    
    
    if (!isStopped && isListeningMode && !isSpeaking) {
        try { recognition.start(); } catch (e) { console.warn("Recognition start skipped: ", e.message); }
    }
};

recognition.onresult = function(event) {
    if (isStopped || isSpeaking) {
        console.log("Input drop gate triggered. Loopback prevented.");
        return;
    }

    let current = event.resultIndex;
    let result = event.results[current];
    
    if (result.isFinal) {
        let transcript = result[0].transcript;
        transcript = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
        
        if (userTextDisplay) userTextDisplay.innerText = transcript;

        
        if (transcript.includes("shutdown") || 
            transcript.includes("shut down") || 
            transcript.includes("goodbye") || 
            transcript.includes("good bye") || 
            transcript.includes("exit")) {
            
            readOut("Goodbye! Closing voice assistant interface.");
            toggle(); 
            return;
        }

        
        if (transcript.startsWith("open ") || transcript.includes("launch")) {
            let processedUrl = null;
            let targetAppName = "";

            if (transcript.includes("youtube")) {
                processedUrl = "https://www.youtube.com";
                targetAppName = "YouTube";
            } else if (transcript.includes("spotify")) {
                processedUrl = "https://open.spotify.com";
                targetAppName = "Spotify";
            } else if (transcript.includes("netflix")) {
                processedUrl = "https://www.netflix.com";
                targetAppName = "Netflix";
            } else if (transcript.includes("hotstar")) {
                processedUrl = "https://www.hotstar.com";
                targetAppName = "Disney Plus Hotstar";
            } else if (transcript.includes("google")) {
                processedUrl = "https://www.google.com";
                targetAppName = "Google Search Engine";
            }

            
            if (processedUrl) {
                readOut(`Opening ${targetAppName} right now.`);
                window.open(processedUrl, '_blank'); 
                
                if (alexTextDisplay) {
                    alexTextDisplay.innerText = `System action triggered successfully: Launched ${targetAppName}.`;
                }
                return; 
            }
        }
        gemini(transcript, islogged);
    }
};

recognition.onerror = (event) => {
    console.error("Speech Recognition Engine Exception:", event.error);
    
    if (event.error === 'network') {
        readOut("Speech recognition network error. Ensure browser dependencies are available.");
        isStopped = true;
        isListeningMode = false;
        try { recognition.stop(); } catch(e) {}
        
        startBtn.className = "button up";
        startBtn.innerHTML = "Start";
        if (buffer) buffer.classList.remove("is-visible");
        if (buffer2) buffer2.classList.remove("is-visible");
    }
};


function startVoiceAssistant() {
    isStopped = false;
    isListeningMode = true;
    startBtn.innerHTML = "Stop";
    startBtn.className = "button down";
    
    if (buffer2) buffer2.classList.remove("is-visible");
    if (buffer) buffer.classList.add("is-visible");
    
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    audioTurn.play();
    try { recognition.start(); } catch (e) { console.error(e); }
}

function stopVoiceAssistant() {
    isStopped = true;
    isListeningMode = false;
    startBtn.innerHTML = "Start";
    startBtn.className = "button up";
    
    if (buffer) buffer.classList.remove("is-visible");
    if (buffer2) buffer2.classList.remove("is-visible");
    
    try { recognition.stop(); } catch (e) { console.error(e); }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    readOut("a huh");
}

function toggle() {
    if (isStopped) {
        startVoiceAssistant();
    } else {
        stopVoiceAssistant();
    }
}

startBtn.addEventListener("click", toggle);


function readOut(response) {
    if (!window.speechSynthesis) return;

    
    isSpeaking = true;
    try { recognition.stop(); } catch(e) {}

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance();
    speech.text = response;
    speech.rate = 1.0;
    speech.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(voice => voice.name.includes("Natural") && voice.lang.startsWith("en")) || 
                        voices.find(voice => voice.name.includes("Google") && voice.lang.startsWith("en")) || 
                        voices.find(voice => voice.lang.startsWith("en"));

    if (selectedVoice) speech.voice = selectedVoice;

    
    speech.onend = function() {
        console.log("Speech playback completed cleanly.");
        isSpeaking = false;
        
        
        if (!isStopped && isListeningMode) {
            try { recognition.start(); } catch(e) { console.log("Mic restart skipped:", e.message); }
        }
    };

    speech.onerror = function() {
        isSpeaking = false;
        if (!isStopped && isListeningMode) {
            try { recognition.start(); } catch(e) {}
        }
    };

    window.speechSynthesis.speak(speech);
}


if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}