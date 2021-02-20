function sendEmails(mail_template='content',
                    subject='') {

  // get the active spreadsheet and data in it
  var id = SpreadsheetApp.getActiveSpreadsheet().getId();
  var sheet = SpreadsheetApp.openById(id).getActiveSheet();
  var data = sheet.getDataRange().getValues();

  // iterate through the data, starting at index 1
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var email = row[0];
    var name = row[1];

    // check remaining email quota
    // console.log(MailApp.getRemainingDailyQuota())

    // check if we can send an email
    if (MailApp.getRemainingDailyQuota() > 0) {

      // populate the template
      var template = HtmlService.createTemplateFromFile(mail_template);
      template.name = name;
      template.email = email;
      var message = template.evaluate().getContent();

      // declare file to attach here
      var file = DriveApp.getFileById('');

      GmailApp.sendEmail(
        email, subject, '', {
          htmlBody: message,
          // add attachment to email as PDF
          attachments: [file.getAs(MimeType.PDF)],
          // add sender name
          name: ''
          }
      );
    }
  }
}

function doGet(e) {
  var method = e.parameter['method'];
  switch (method) {
    case 'track':
      var email = e.parameter['email'];
      updateEmailStatus(email);
    default:
      break;
  }
}

function updateEmailStatus(emailToTrack) {

  // get the active spreadsheet and data in it
  var id = SpreadsheetApp.getActiveSpreadsheet().getId();
  var sheet = SpreadsheetApp.openById(id).getActiveSheet();
  var data = sheet.getDataRange().getValues();

  // get headers
  var headers = data[0];
  var emailOpened = headers.indexOf('status') + 1;

  // declare the variable for the correct row number
  var currentRow = 2;

  // iterate through the data, starting at index 1
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var email = row[0];

    if (emailToTrack === email) {
      // update the value in sheet
      sheet.getRange(currentRow, emailOpened).setValue('opened');
      break;
    }
    currentRow++;
  }
}
