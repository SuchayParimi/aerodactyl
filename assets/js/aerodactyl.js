var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var countries;
var countryNames;
// Fetch country information
function getCountries() {
	console.log("Hiding the talk button till data is loaded");
	document.getElementById("talkToAerodactyl").style.visibility = "hidden";
	document.getElementById("talktome").style.visibility = "hidden";
	var jsonData;
	fetch('/data/countries.json')
	    .then(function(response) { return response.json(); })
		.then(function(json) {
		    countries = json;
		    countryNames = Object.keys(countries);
			//console.log(JSON.stringify(countries));
			document.getElementById("talkToAerodactyl").style.visibility = "visible";
			document.getElementById("talktome").style.visibility = "visible";
    });
}
getCountries();

function getCountry(question) {
	var q = question.toUpperCase();
	var country = "unknown";
	for(var i = 0; i < countryNames.length; i++) {
		if(q.indexOf(countryNames[i]) >= 0) {
			country = countryNames[i];
			break;
		}
	}
	return country;
}

function getDetails(country) {
	if(country.indexOf("unknown") >= 0) {
		return "Contact Suchay for further assistance.";
	}
	return countries[country].capital;
}


// Begin - Greeting
    var greetingSpeech = window.speechSynthesis;
    var greetingVoices = [];
    greetingVoices = greetingSpeech.getVoices();
	var greetingMessage = new SpeechSynthesisUtterance("Hello! I am Suchay's pet, Aerodactyl. I can tell the names of Capital cities of Countries.");
	if(greetingVoices.length >= 5) {
	    greetingMessage.voice = greetingVoices[0];
	} else {
		greetingMessage.voice = greetingVoices[0];
	}
    greetingMessage.pitch = '1';
    greetingMessage.rate = '1';
    greetingSpeech.speak(greetingMessage);
// End - Greeting

var phrases = [
  'I love to sing because it is fun',
  'where are you going',
  'can I call you tomorrow',
  'why did you talk while I was talking',
  'she enjoys reading books and playing games',
  'where are you going',
  'have a great day',
  'she sells seashells on the seashore'
]

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('#resultParagraph');
var diagnosticPara = document.querySelector('#outputMessage');
var testBtn = document.querySelector('#talktome');
var chartOutput = document.querySelector('#chartOutput');

function randomPhrase() {
  var number = Math.floor(Math.random() * phrases.length);
  return number;
}

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'I am listening ...';
  var phrase = phrases[randomPhrase()];
  //phrasePara.textContent = phrase;
  resultPara.textContent = '';
  diagnosticPara.textContent = '';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-GB';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.start();

  recognition.onresult = function(event) {
    // Get the spoken command from the SpeechRecognitionResultList object
    var inputData = event.results[0][0].transcript;
	console.log('original input = ' + inputData);
	var speechResult = 'Please contact Suchay for further assistance.';
    
	var country = getCountry(inputData);
    speechResult = getDetails(country);

    // Begin - Speak out the received command
    var synth = window.speechSynthesis;
    var voices = [];
    voices = synth.getVoices();
	var utterThis = new SpeechSynthesisUtterance(speechResult);
	if(voices.length >= 5) {
	    utterThis.voice = voices[0];
	} else {
		utterThis.voice = voices[0];
	}
    utterThis.pitch = '1';
    utterThis.rate = '1';
    synth.speak(utterThis);
    // End - speak out

    //Begin - Show the relevant content to the user
	
	resultPara.textContent = inputData;
    diagnosticPara.textContent = speechResult;

    //End - Show the relevant content to the user

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Talk to me';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Talk to me';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }
}
testBtn.addEventListener('click', testSpeech);