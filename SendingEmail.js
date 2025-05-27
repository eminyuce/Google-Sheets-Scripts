function sendDailyReport() {
  const sheet = SpreadsheetApp.openById("1sT_IOfKtGRfhEjiurtivc5D80cnZZdGBfRkAySsmd9g").getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) return;

  const headers = data[0];

  const rows = data.slice(1).map((row, index) => ({
    rowColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",  // even/odd coloring
    cells: row
  }));

  const template = HtmlService.createHtmlOutputFromFile("email_template").getContent();
  const htmlBody = Mustache.render(template, { headers: headers, rows: rows });
  // Send email
 
  const recipient = getProperty('report.recipient');
  const subject = getProperty('report.subject');


   GmailApp.sendEmail(
    recipient,
      subject,
    "Please see the report below.",          // Plain text (required)
    { htmlBody: htmlBody }
  );

  Logger.log("Daily report sent.");
}
function getProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}


