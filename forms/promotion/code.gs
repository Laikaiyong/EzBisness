function launchCampaign() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Live');
  var range = sheet.getActiveRange();
  var values = range.getValues();
  Logger.log(values);

  var confirm = Browser.msgBox(
    'Are you sure you want to launch the campaign ?',
    Browser.Buttons.YES_NO
  ); 
  if(confirm!='yes'){return};

  var event = CalendarApp.getDefaultCalendar().createEvent(values[0][0],
    new Date(values[0][2]),
    new Date(values[0][3]),
    { location: values[0][4], description: values[0][1] });
  Logger.log('Event ID: ' + event.getId());

  sheet.getRange(range.getRowIndex(), 1, 1, sheet.getMaxColumns()).setBackground("#00FF00");
}