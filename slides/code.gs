/**
* @OnlyCurrentDoc
*
* The above comment directs Apps Script to limit the scope of file
* access for this add-on. It specifies that this add-on will only
* attempt to read or modify the files in which the add-on is used,
* and not all of the user's files. The authorization request message
* presented to users will reflect this limited scope.
*/
async function getNotionPageProperties() {
  const notionApiKey = PropertiesService.getScriptProperties().getProperty("NOTION_API_KEY");
  const databaseId = PropertiesService.getScriptProperties().getProperty("NOTION_DATABASE_ID");
  
  const url = `https://api.notion.com/v1/databases/${databaseId}/query`;
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${notionApiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true
  };
  
  try {
    const response = await UrlFetchApp.fetch(url, options);
    const pageData = JSON.parse(response.getContentText());
    
    // const imageUrl = pageData.properties.Image.files[0].external.url;
    // const tagText = pageData.properties.Tag.rich_text[0].plain_text;
    
    // Logger.log('Image URL: ' + imageUrl);
    // Logger.log('Tag: ' + tagText);
    
    // return {
    //   imageUrl: imageUrl,
    //   tag: tagText
    // };
    Logger.log(pageData);
    return pageData;
  } catch (error) {
    Logger.log('Error: ' + error);
    return null;
  }
}

async function onOpen() {
  var titles = await getNotionPageProperties();
  var ui = SlidesApp.getUi();
  ui.createMenu('Trademark')
    .addItem('Company logo', 'mergeLogo')
    .addItem('Shopee logo', 'mergeShopeeLogo')
    .addItem('Lazada logo', 'mergeLazadaLogo')
    .addToUi();
}


async function mergeLogo() {
  var templateId = SlidesApp.getActivePresentation().getId();
  var data = await getNotionPageProperties();

  //Logo url
  var logoUrl = data.results[1].properties.Image.files[0].file.url;

 // Create the request to replace shapes in the
 // presentation with the logo. Any shape with the text
 // {{logo_image}} in it will be replaced with the image.
 var mergeImageRequests = [{
   replaceAllShapesWithImage: {
     imageUrl: logoUrl,
     containsText: {
       text: data.results[1].properties.Tag.rich_text[0].text.content,
     }
   }
 }];

 // Send the request to merge the logo into the presentation
 Slides.Presentations.batchUpdate({
   requests: mergeImageRequests
 }, templateId);
}

async function mergeLazadaLogo() {
  var templateId = SlidesApp.getActivePresentation().getId();
  var data = await getNotionPageProperties();

  //Logo url
  var logoUrl = data.results[2].properties.Image.files[0].file.url;

 // Create the request to replace shapes in the
 // presentation with the logo. Any shape with the text
 // {{logo_image}} in it will be replaced with the image.
 var mergeImageRequests = [{
   replaceAllShapesWithImage: {
     imageUrl: logoUrl,
     containsText: {
       text: data.results[2].properties.Tag.rich_text[0].text.content,
     }
   }
 }];

 // Send the request to merge the logo into the presentation
 Slides.Presentations.batchUpdate({
   requests: mergeImageRequests
 }, templateId);
}

async function mergeShopeeLogo() {
  var templateId = SlidesApp.getActivePresentation().getId();
  var data = await getNotionPageProperties();

  //Logo url
  var logoUrl = data.results[0].properties.Image.files[0].file.url;

 // Create the request to replace shapes in the
 // presentation with the logo. Any shape with the text
 // {{logo_image}} in it will be replaced with the image.
 var mergeImageRequests = [{
   replaceAllShapesWithImage: {
     imageUrl: logoUrl,
     containsText: {
       text: data.results[0].properties.Tag.rich_text[0].text.content,
     }
   }
 }];

 // Send the request to merge the logo into the presentation
 Slides.Presentations.batchUpdate({
   requests: mergeImageRequests
 }, templateId);
}