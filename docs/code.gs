/**
* @OnlyCurrentDoc
*
* The above comment directs Apps Script to limit the scope of file
* access for this add-on. It specifies that this add-on will only
* attempt to read or modify the files in which the add-on is used,
* and not all of the user's files. The authorization request message
* presented to users will reflect this limited scope.
*/

/**
* Creates a menu entry in the Google Docs UI when the document is
* opened.
*
*/
function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu('AI')
    .addItem('Sentiment Analysis', 'markSentiment')
    .addItem('Translate', 'translateText')
    .addItem('Summarize', 'summarizeText')
    .addItem('Generate Text', 'generateText')
    .addToUi();
}
/**
* Gets the user-selected text and highlights it based on sentiment
* with green for positive sentiment, red for negative, and yellow
* for neutral.
*
*/
function markSentiment() {
  var POSITIVE_COLOR = '#00ff00';  //  Colors for sentiments
  var NEGATIVE_COLOR = '#ff0000';
  var NEUTRAL_COLOR = '#ffff00';
  var NEGATIVE_CUTOFF = -0.2;   //  Thresholds for sentiments
  var POSITIVE_CUTOFF = 0.2;

  var selection = DocumentApp.getActiveDocument().getSelection();
  if (!selection) {
    DocumentApp.getUi().alert('Please select text for action');
    return;
  }
  var string = getSelectedText();

  var sentiment = retrieveSentiment(string);

  //  Select the appropriate color
  var color = NEUTRAL_COLOR;
  if (sentiment <= NEGATIVE_CUTOFF) {
    color = NEGATIVE_COLOR;
  }
  if (sentiment >= POSITIVE_CUTOFF) {
    color = POSITIVE_COLOR;
  }

  //  Highlight the text
  var elements = selection.getSelectedElements();
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].isPartial()) {
      var element = elements[i].getElement().editAsText();
      var startIndex = elements[i].getStartOffset();
      var endIndex = elements[i].getEndOffsetInclusive();
      element.setBackgroundColor(startIndex, endIndex, color);

    } else {
      var element = elements[i].getElement().editAsText();
      foundText = elements[i].getElement().editAsText();
      foundText.setBackgroundColor(color);
    }
  }
}

function summarizeText() {
  var geminiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  var apiEndpoint =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key='
    + geminiKey;
  var body = DocumentApp.getActiveDocument().getBody();
  var selection = DocumentApp.getActiveDocument().getSelection();

  if (!selection) {
    DocumentApp.getUi().alert('Please select text for action');
    return;
  }

  var string = getSelectedText();

  var nlData = {
    contents: [{
      parts: [{
        text: "Summarize the following texts: " + string
      }]
    }]
  };

  //  Package all of the options and the data together for the call
  var nlOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(nlData)
  };

  //  And make the call
  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);

  var data = JSON.parse(response);

  var generatedText = data.candidates[0].content.parts[0].text;
  var matchPosition = body.findText(string);
  var textElement = matchPosition.getElement();
  var parent = textElement.getParent();
  parent.appendText("\n" + generatedText);
}


function generateText() {
  var geminiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  var apiEndpoint =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key='
    + geminiKey;
  var body = DocumentApp.getActiveDocument().getBody();
  var selection = DocumentApp.getActiveDocument().getSelection();

  if (!selection) {
    DocumentApp.getUi().alert('Please select text for action');
    return;
  }

  var string = getSelectedText();

  var nlData = {
    contents: [{
      parts: [{
        text: string
      }]
    }]
  };

  //  Package all of the options and the data together for the call
  var nlOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(nlData)
  };

  //  And make the call
  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);

  var data = JSON.parse(response);

  var generatedText = data.candidates[0].content.parts[0].text;
  var matchPosition = body.findText(string);
  var textElement = matchPosition.getElement();
  var parent = textElement.getParent();
  parent.appendText("\n" + generatedText);
}

function translateText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  var body = DocumentApp.getActiveDocument().getBody();

  if (!selection) {
    DocumentApp.getUi().alert('Please select text for action');
    return;
  }

  var string = getSelectedText();
  var oriLanguage = detectLanguage(string);

  var translatedText = LanguageApp.translate(string, oriLanguage, 'en');
  var matchPosition = body.findText(string);
  var textElement = matchPosition.getElement();
  var parent = textElement.getParent();
  parent.appendText("\nEnglish:" + translatedText);
}


/**
 * Returns a string with the contents of the selected text.
 * If no text is selected, returns an empty string.
 */
function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  var string = "";
  if (selection) {
    var elements = selection.getSelectedElements();

    for (var i = 0; i < elements.length; i++) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive() + 1;
        var text = element.getText().substring(startIndex, endIndex);
        string = string + text;

      } else {
        var element = elements[i].getElement();
        // Only translate elements that can be edited as text; skip
        // images and other non-text elements.
        if (element.editAsText) {
          string = string + element.asText().getText();
        }
      }
    }
  }
  return string;
}


function retrieveSentiment(line) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("GCP_API_KEY");
  var apiEndpoint =
    'https://language.googleapis.com/v1/documents:analyzeSentiment?key='
    + apiKey;

  //  Create a structure with the text, its language, its type,
  //  and its encoding
  var docDetails = {
    language: 'en-us',
    type: 'PLAIN_TEXT',
    content: line
  };

  var nlData = {
    document: docDetails,
    encodingType: 'UTF8'
  };

  //  Package all of the options and the data together for the call
  var nlOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(nlData)
  };

  //  And make the call
  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);

  var data = JSON.parse(response);

  var sentiment = 0.0;
  //  Ensure all pieces were in the returned value
  if (data && data.documentSentiment
    && data.documentSentiment.score) {
    sentiment = data.documentSentiment.score;
  }

  return sentiment;
}

function detectLanguage(text) {
  var dlApi = PropertiesService.getScriptProperties().getProperty("DL_API_KEY");
  var payload = {
    "q": text
  };

  var options = {
    "method": "post",
    "payload": payload,
    "headers": {
      "Authorization": "Bearer " + dlApi
    }
  };

  var url = "https://ws.detectlanguage.com/0.2/detect";
  var response = UrlFetchApp.fetch(url, options);
  var data = JSON.parse(response);

  return data.data.detections[0].language;
}