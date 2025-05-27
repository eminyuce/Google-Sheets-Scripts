function readFromSQLServerAndWriteToSheet() {
  const server = '';
  const database = '';
  const user = 'yuce';
  const password = '';
  const storedProc = "{CALL GetProductsByCategory(?)}"; // Ensure `?` is present

  const conn = Jdbc.getConnection(`jdbc:sqlserver://${server};databaseName=${database}`, user, password);

  const stmt = conn.prepareCall(storedProc);
  stmt.setInt(1, 1021); // set parameter
  const rs = stmt.executeQuery();

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products") || 
                SpreadsheetApp.getActiveSpreadsheet().insertSheet("Products");

  // Clear existing contents
  sheet.clearContents();

  const meta = rs.getMetaData();
  const colCount = meta.getColumnCount();

  // Write headers
  let headers = [];
  for (let i = 1; i <= colCount; i++) {
    headers.push(meta.getColumnName(i));
  }
  sheet.appendRow(headers);

  // Write rows
  while (rs.next()) {
    let row = [];
    for (let i = 1; i <= colCount; i++) {
      row.push(rs.getString(i));
    }
    sheet.appendRow(row);
  }

  rs.close();
  stmt.close();
  conn.close();
}
