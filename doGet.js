function doGet(e) {
  // Step 1: Open the spreadsheet by ID and Sheet Name
  const sheet = SpreadsheetApp.openById("1sT_IOfKtGRfhEjiurtivc5D80cnZZdGBfRkAySsmd9g").getSheetByName("Sheet1");

  // Step 2: Read query parameter
  const country =  e.parameter.country;

  // Step 3: Get all sheet data
  const values = sheet.getDataRange().getValues(); // includes header

  // Step 4: Convert rows to JSON using headers
  const headers = values[0];
  let data = values.slice(1).map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });

  // Step 5: Apply country filter if provided
  if (country && country.trim() !== '') {
    const target = country.trim().toLowerCase();
    data = data.filter(row => 
      String(row.Country).toLowerCase() === target
    );
  }

  // Step 6: Return JSON response
  return ContentService.createTextOutput(JSON.stringify(data))
                       .setMimeType(ContentService.MimeType.JSON);
}
