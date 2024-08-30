const startBtn=document.querySelector("#start");
const audioTurn = new Audio("/static/ting.mp3");
let buffer=document.querySelector("#process");
let buffer2=document.querySelector("#result");
if(islogged){
    console.log(user);
    var anchor = document.querySelector(".history")
    anchor.className="nav-item dropdown"
    anchor.firstChild.nextSibling.className="nav-link dropdown-toggle"
}
//post request
// Function to get the CSRF token from the cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Your XMLHttpRequest code
function post(transcript,ans) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/history", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response);  // Resolve the Promise with the response
            } else if (xhr.readyState === 4) {
                reject(xhr.responseText);  // Reject the Promise with the error
            }
        };

        const data = JSON.stringify({
            history: transcript,
            answer:ans,
        });
        xhr.send(data);
    });
}

//strip emojis
const stripEmojis = (str) =>{
    return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,'').replace(/\s+/g, ' ').trim();
}
function gemini(API,transcript,islogged){
    if(startBtn.innerText=="start"){
        if(window.speechSynthesis.speaking){
        window.speechSynthesis.cancel();
        }
        buffer.style.display="none";
        buffer2.style.display="none";
        return ;
    }
    const API_KEY = API;
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        "model": "gemini-1.5-pro",
        "contents": [
        {
            "role": "user",
            "parts": [
            {
                "text": transcript+"<- generate answer within 50 words"
            }
            ]
        }
        ],
        "generationConfig": {
        "temperature": 1,
        "topK": 64,
        "topP": 0.95,
        "maxOutputTokens": 200,
        "responseMimeType": "text/plain"
        }
    })
    })
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        let answer=data.candidates[0].content.parts[0].text;
        answer=answer.replaceAll("*","");
        console.log('Response:', answer);
        buffer.style.display="none";
        startBtn.className="button";
        startBtn.style.top="0px";
        buffer2.style.display="block";
        document.querySelector("#alex").innerText=answer;
        
        //posting in history
        if(islogged){
            post(transcript,answer)
            .then(response => {
                console.log('Success:', response);
                // You can work with `response` here
                hist1=document.querySelector("#hist1")
                hist2=document.querySelector("#hist2")
                hist2.innerText=hist1.innerText
                hist1.innerText=response["history"]
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        
        //continue
        if(transcript.includes("code")){
            let mySubString = answer.substring( 
                answer.lastIndexOf("```")+1,answer.length-1
            );
            readOut(stripEmojis(mySubString));
        }
        else{
            readOut(stripEmojis(answer));
        }
        // Process the generated text from data.text

    })
    .catch(error => {
        console.error('Error:', error);
        readOut("I can't answer This right now.I am Sorry!")
        document.querySelector("#user").style['text-decoration']="line-through";
    });
}
//speech recognition setup
const SpeechRecognition=
window.SpeechRecognition||window.webkitSpeechRecognition;

const recognition=new SpeechRecognition();
//sr start
recognition.onstart=function (){
    readOut("");
    console.log("vr active");
};
//sr end
recognition.onend=function () {
    console.log("vr deactive");
    buffer.style.display="none";
    buffer2.style.display="none";
    if(startBtn.innerHTML=="Stop"){
        document.querySelector(".card").style.display="none";
        stop();
    }
};
//sr result
recognition.onresult=function(event){
    if(startBtn.innerText=="start"){
        if(window.speechSynthesis.speaking){
        window.speechSynthesis.cancel();
        }
        buffer.style.display="none";
        buffer2.style.display="none";
        return ;
    }
    let current=event.resultIndex;
    let transcript=event.results[current][0].transcript;
    console.log(transcript);
    transcript=transcript.toLowerCase();
    console.log(`my words ${transcript}`);
    document.querySelector("#user").innerText=transcript;
    if(transcript==="shutdown" || transcript===" shutdown" || transcript==="shut down" || transcript===" shut down"){
        toggle();
        return;
    }
    //<--gemini-->
    gemini(API,transcript,islogged);
}
recognition.onerror= (event)=>{
    console.error(event.error);
};
//sr continuos
recognition.continuous =true;
//sr start
function start(){
    recognition.start();
    startBtn.innerHTML="Stop";
}
//sr stop
function stop(){
    recognition.stop();
    readOut("Shutting OFF");
    startBtn.style.top="600px";
    startBtn.className="button up";
    startBtn.innerHTML="Start";
    buffer.style.display="none";
    buffer2.style.display="none";
}
function toggle(){
    if(startBtn.innerHTML=="Start"){
        audioTurn.play();
        buffer.style.display="block";
        startBtn.className="button down";
        start();
    }
    else if(startBtn.innerHTML=="Stop"){
        stop();
    }
};
startBtn.addEventListener("click",toggle);

//speak
function readOut(response){
    const voices = window.speechSynthesis.getVoices();
    const speech=new SpeechSynthesisUtterance()
    speech.voice=voices[7];
    if(window.speechSynthesis.speaking){
        window.speechSynthesis.cancel();
    }
    speech.text=response;
    speech.rate=1;
    speech.volume=1;
    window.speechSynthesis.speak(speech);
    console.log("speaking out"); 
}
