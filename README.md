# 🛍️ Product Description Generator using Groq API & Google Sheets

This Google Apps Script reads product names from a Google Sheet and generates structured product descriptions in Turkish using the [Groq LLM API](https://console.groq.com/). The generated descriptions, bullet points, and keywords are written back to the sheet in adjacent columns.

---

## 📋 Features

- ✅ Automatically generates Turkish product descriptions
- ✅ Ensures compliance with Turkish Food Codex labeling standards
- ✅ Structured JSON output with:
  - Bullet points (what it is, traditional use, benefits, usage)
  - Detailed product description (100–150 words)
  - Product keywords (comma-separated)
- ✅ Avoids misleading claims and overstatements
- ✅ Logs all actions for traceability and debugging

---

## 🗂️ Project Structure

| Column | Description                      |
|--------|----------------------------------|
| A      | Stock Code (Optional)            |
| B      | Product Name                     |
| C      | Bullets (generated output)       |
| D      | Description (generated output)   |
| E      | Keywords (generated output)      |

---

## 🚀 How It Works

1. Loops through each row of the Google Sheet (starting from row 2).
2. If the product name exists and bullet points are empty:
   - Builds a structured prompt.
   - Sends it to the Groq LLM API.
   - Parses and writes the generated JSON to columns C, D, and E.
3. Adds logging and error handling to assist with debugging.

---

## 🔧 Configuration

### Replace the following constants:
```javascript
const GROQ_API_KEY = 'YOUR_GROQ_API_KEY';
const spreadsheetId = 'YOUR_SPREADSHEET_ID';
const sheetName = 'Sheet1';
````

---

## 🧠 Prompt Format

The prompt guides the model to return only valid JSON with this format:

```json
{
  "productName": "Example",
  "bullets": [
    "Türkçe yanıt 1",
    "Türkçe yanıt 2",
    "Türkçe yanıt 3",
    "Türkçe yanıt 4"
  ],
  "description": "Türkçe açıklama (100-150 kelime).",
  "product_keywords": "anahtar1,anahtar2"
}
```

> All text must be in **Turkish** and free from bold claims like “100% natural”, “healing”, etc.

---

## 🛠️ Setup Guide

1. **Open Google Sheets** and create a sheet with columns:

   * A: Stock Code
   * B: Product Name
   * C: Bullets (Leave empty)
   * D: Description (Leave empty)
   * E: Keywords (Leave empty)

2. **Open Extensions → Apps Script** and paste the full script.

3. Replace the `GROQ_API_KEY` and `spreadsheetId`.

4. Click ▶️ **Run** the `generateProductDescriptionsByGroq` function.

---

## 📜 Logging & Debugging

* Console and response logs are available via **View → Logs (Ctrl+Enter)**.
* If Groq API fails, an error message will be logged with the row number.
* Includes:

  * HTTP response code
  * API response body
  * Cleaned JSON content

---

## 📎 Dependencies

This project relies solely on:

* [Google Apps Script](https://developers.google.com/apps-script)
* [Groq LLM Chat Completion API](https://console.groq.com/)

---
 
