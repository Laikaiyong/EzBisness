const GULU_TIMESTAMP = "Timestamp";
const GULU_FEEDBACK_TYPE = "Feedback Type";
const GULU_FEEDBACK = "Feedback";
const GULU_SUGGESTIONS = "Suggestions for improvement";
const GULU_EXPERIENCE = "Overall Experience";
const GULU_NAME = "Name";
const GULU_EMAIL = "Email";
const GULU_MEDIA = "Media Relevant to Feedback";

function onFormSubmit(e) {
  var itemResponses = e.namedValues;
  var timestamp = convertTimestamp(itemResponses[GULU_TIMESTAMP][0]);
  var feedbackType = itemResponses[GULU_FEEDBACK_TYPE][0];
  var feedback = itemResponses[GULU_FEEDBACK][0];
  var suggestions = itemResponses[GULU_SUGGESTIONS][0];
  var experience = itemResponses[GULU_EXPERIENCE][0];
  var name = itemResponses[GULU_NAME][0];
  var email = itemResponses[GULU_EMAIL][0];
  var mediaLink = itemResponses[GULU_MEDIA][0];

  Logger.log("Timestamp: " + timestamp);
  Logger.log("Feedback Type: " + feedbackType);
  Logger.log("Feedback: " + feedback);
  Logger.log("Suggestions: " + suggestions);
  Logger.log("Experience: " + experience);
  Logger.log("Name: " + name);
  Logger.log("Email: " + email);
  Logger.log("Media: " + mediaLink);

  postFeedbackToNotion(timestamp, feedbackType, feedback, suggestions, experience, name, email, mediaLink);
}

function convertTimestamp(timestamp) {
  // Split the date and time
  var parts = timestamp.split(' ');
  var datePart = parts[0];
  var timePart = parts[1];

  // Split the date into month, day, and year
  var dateParts = datePart.split('/');
  var month = dateParts[0];
  var day = dateParts[1];
  var year = dateParts[2];

  // Split the time into hour, minute, and second
  var timeParts = timePart.split(':');
  var hour = timeParts[0];
  var minute = timeParts[1];
  var second = timeParts[2];

  // Pad single digit month, day, hour, and minute with leading zeros
  if (month.length === 1) {
    month = '0' + month;
  }
  if (day.length === 1) {
    day = '0' + day;
  }
  if (hour.length === 1) {
    hour = '0' + hour;
  }
  if (minute.length === 1) {
    minute = '0' + minute;
  }
  if (second.length === 1) {
    second = '0' + second;
  }

  // Construct the new timestamp in ISO 8601 format
  var newTimestamp = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second;

  return newTimestamp;
}

function postFeedbackToNotion(timestamp, feedbackType, feedback, suggestions, experience, name, email, mediaLink) {
  var notionToken = PropertiesService.getScriptProperties().getProperty("NOTION_API_KEY");
  var notionDatabaseId = 'f35abdce397d4c4fa63035ac8277a399';

  var payload = {
    parent: { database_id: notionDatabaseId },
    properties: {
      'Timestamp': {
        title: [
          {
            text: {
              content: timestamp
            }
          }
        ]
      },
      'Feedback Type': {
        select: {
          name: feedbackType
        }
      },
      'Feedback': {
        rich_text: [
          {
            text: {
              content: feedback
            }
          }
        ]
      },
      'Suggestion for improvement': {
        rich_text: [
          {
            text: {
              content: suggestions
            }
          }
        ]
      },
      'Overall Experience': {
        number: parseInt(experience)
      },
      'Name': {
        rich_text: [
          {
            text: {
              content: name
            }
          }
        ]
      },
      'Email': {
        email: email
      },
      'Media': {
        url: mediaLink
      }
    }
  };

  var options = {
    muteHttpExceptions: true,
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + notionToken,
      'Notion-Version': '2022-06-28'
    },
    payload: JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch('https://api.notion.com/v1/pages', options);
  Logger.log(response.getContentText());
}



function GEMINI(range, prompt) {
  prompt = `For the range of cells ${range}, ${prompt}`

  return genAiSummary(prompt);
}


function genAiSummary(prompt) {
  const data = {
    "contents": [{
      "parts": [{
        "text": prompt
      }]
    }],
    "generationConfig": {
      "temperature": 0.2,
      "topK": 1,
      "topP": 1,
      "maxOutputTokens": 2048,
      "stopSequences": []
    },
  }

  var geminiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  var apiEndpoint =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key='
    + geminiKey;

  var nlOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(data)
  };

  //  And make the call
  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);

  var getData = JSON.parse(response);

    var generatedText = getData.candidates[0].content.parts[0].text;

    return generatedText
}
