const GULU_GMAIL = "guluguluyeston@gmail.com";

const GULU_SPREADSHEET_ID =
  "1dbDQ_I5HKXkvZ9ZERWIcbE_zqTTBPCre9cEc9u3qVBg";
const GULU_SHEET_NAME = "Live";
const GULU_EMAIL = "Email Address";
const GULU_NAME = "Your Name";
const GULU_PHONE =
  "Phone Number";
const GULU_DELIVERY_ADD =
  "Delivery Address";
const GULU_CHOCOLATE_CHIP = "Order Item [Chocolate Chip]";
const GULU_MARSHMALLOW = "Order Item [Marshmallow]";
const GULU_CHOCOLATE_BROWNIES = "Order Item [Chocolate Brownies]";
const GULU_ORDER_ID = "ORDER ID";
const GULU_TIMESTAMP = "Timestamp";
const GULU_PARCEL_EMAIL = "tp059040@mail.apu.edu.my";

async function onFormSubmit(e) {
  //e is a form submit event from Google Forms, use nameValuePairs to get the responses
  var itemResponses = await e.namedValues;
  var email = itemResponses[GULU_EMAIL][0];
  var name = itemResponses[GULU_NAME][0];
  var deliveryAddress = itemResponses[GULU_DELIVERY_ADD][0];
  var phone = itemResponses[GULU_PHONE][0];
  var orderItemName = (itemResponses[GULU_CHOCOLATE_CHIP][0] != 0) ? "Chocolate Chip" : (itemResponses[GULU_MARSHMALLOW][0] != 0) ? "Marshmallow" : "Chocolate Brownie";
  var orderItemQuantity = (itemResponses[GULU_CHOCOLATE_CHIP][0] != 0) ? itemResponses[GULU_CHOCOLATE_CHIP][0] : (itemResponses[GULU_MARSHMALLOW][0] != 0) ? itemResponses[GULU_MARSHMALLOW][0] : itemResponses[GULU_CHOCOLATE_BROWNIES][0];
  var timestamp = itemResponses[GULU_TIMESTAMP][0];

  var d = new Date();
  var n = d.getTime();

  var orderId = "ID-" + n.toString();


  var emailSubject =`GULUGULU Cookie House | Thank you for ordering!`;
  var message = await createThankYouEmailBody(email, name, deliveryAddress, phone, orderItemName, orderItemQuantity);

  GmailApp.sendEmail(email, emailSubject, message, {
    from: GULU_GMAIL,
    name: "GULUGULU Cookie House",
    htmlBody: message,
  });

  var jntEmailSubject = `GULUGULU Cookie House | Order delivery request`;
  var jntMessage = await createParcelEmailBody(email, name, deliveryAddress, phone, orderItemName, orderItemQuantity);
  var map = Maps.newStaticMap().addMarker(deliveryAddress);
  console.log(map);

  GmailApp.sendEmail(GULU_PARCEL_EMAIL, jntEmailSubject,  jntMessage, {
    from: GULU_GMAIL,
    name: "GULUGULU Cookie House",
    htmlBody: jntMessage,
    attachments:[map]
  });

  await postToNotion(orderId, timestamp, email, name, deliveryAddress, phone, orderItemName, orderItemQuantity);
}

async function postToNotion(orderId, timestamp, email, name, deliveryAddress, phone, orderItemName, orderItemQuantity) {
  var notionToken = PropertiesService.getScriptProperties().getProperty("NOTION_API_KEY"); 
  var notionDatabaseId = PropertiesService.getScriptProperties().getProperty("NOTION_DB_ID"); 

  Logger.log("in postToNotion");

  var payload = {
    parent: { database_id: notionDatabaseId },
    properties: {
      'Order ID': {
        title: [
          {
            text: {
              content: orderId
            }
          }
        ]
      },
      'Timestamp': {
        date: {
          start: convertTimestamp(timestamp)
        }
      },
      'Email': {
        email: email
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
      'Delivery Address': {
        rich_text: [
          {
            text: {
              content: deliveryAddress
            }
          }
        ]
      },
      'Phone': {
        phone_number: phone
      },
      'Item Name': {
        select: {
          name: orderItemName
        }
      },
      'Quantity': {
        number: parseInt(orderItemQuantity)
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


async function createThankYouEmailBody(email, name, deliveryAddress, phone, orderItemName, orderItemQuantity) {
  const template = HtmlService.createTemplateFromFile("thankyou"); // filename is thankyou.html

  template.CUSTOMER_EMAIL = email;
  template.CUSTOMER_NAME = name;
  template.CUSTOMER_DELIVERY_ADDRESS = deliveryAddress;
  template.CUSTOMER_PHONE = phone;
  template.CUSTOMER_ORDER_ITEM_NAME = orderItemName;
  template.CUSTOMER_ORDER_ITEM_QUANTITY = orderItemQuantity

  const htmlMessage = template.evaluate().getContent();

  return htmlMessage;
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

async function createParcelEmailBody(email, name, deliveryAddress, phone, orderItemName, orderItemQuantity) {
  const template = HtmlService.createTemplateFromFile("parcel"); // filename is parcel.html

  template.CUSTOMER_EMAIL = email;
  template.CUSTOMER_NAME = name;
  template.CUSTOMER_DELIVERY_ADDRESS = deliveryAddress;
  template.CUSTOMER_PHONE = phone;
  template.CUSTOMER_ORDER_ITEM_NAME = orderItemName;
  template.CUSTOMER_ORDER_ITEM_QUANTITY = orderItemQuantity

  const htmlMessage = template.evaluate().getContent();

  return htmlMessage;
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