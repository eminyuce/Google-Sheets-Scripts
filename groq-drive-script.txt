const GROQ_API_KEY = '';
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

const spreadsheetId = '1rt7kSlzS0FHDmmfhGLwkNsTWWzZiTBZ_J6MYsudommk';
const sheetName = 'Sheet1';
 
function isEmpty(value) {
  return value === null || value === undefined || value.toString().trim() === '';
}
function generateProductDescriptionsByGroq() {
 

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  console.info("App is started to process SheetName:"+sheetName);

  for (let i = 1; i < data.length; i++) {
    const stockCode = data[i][0];
    const productName = data[i][1];
    const bulletsCell = data[i][2];
    const descriptionCell = data[i][3];

   

    if (productName && isEmpty(bulletsCell)) {
      console.info(i+")Processing ProductName:"+productName);
      const prompt = buildStructuredPrompt(productName);

      try {
        const jsonResponse = callGroqAPI(prompt);
        console.info(jsonResponse);
        const parsed = JSON.parse(jsonResponse);

        const bullets = parsed.bullets.join('\n');
        const description = parsed.description;
        const productKeywords = parsed.product_keywords;

        sheet.getRange(i + 1, 3).setValue(bullets);         // C column
        sheet.getRange(i + 1, 4).setValue(description);     // D column
        sheet.getRange(i + 1, 5).setValue(productKeywords);     // E column

        Utilities.sleep(2000); // Avoid hitting rate limits
      } catch (err) {
        Logger.log(`Error at row ${i + 1}: ${err}`);
      }
    }else{
       console.info(i+")Processed is DONE for ProductName:"+productName);
    }
  }
}

function buildStructuredPrompt(productName) {
  return `
You are a helpful assistant that ONLY outputs JSON.
The following product name is a food or personal care product containing natural or organic ingredients. Create a simple and informative description in accordance with Turkish Food Codex and labeling regulations.

Your task is to generate a JSON object containing:
1.  "productName": The name of the product.
2.  "bullets": An array of four strings answering the following, in order:
    a. What is the product?
    b. What is it traditionally used for?
    c. What are its general supportive effects on the body?
    d. How should it be used?
3.  "description": A single string containing a detailed explanation of 100-150 words, combining the information from the bullet points into a coherent paragraph.
4.  "product_keywords" : Generate a random keywords of the product separated with comma

Constraints for the content:
-   Avoid sentences containing medical or definitive claims.
-   Refrain from using bold expressions such as "100% natural," "healing," or "miracle."
-   All text MUST be in Turkish.

Product Name: ${productName}

Respond ONLY with a valid JSON object structured exactly as shown below. Do NOT include any other text, explanations, or markdown before or after the JSON object.

{
  "productName": "${productName}",
  "bullets": [
    "Türkçe yanıt 1",
    "Türkçe yanıt 2",
    "Türkçe yanıt 3",
    "Türkçe yanıt 4"
  ],
  "description": "Türkçe açıklama (100-150 kelime).",
  "product_keywords": "key2,key2"
}
`.trim();
}

function callGroqAPI(prompt) {
  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: "Türkçe bir e-ticaret ürün açıklaması uzmanısın. Yalnızca geçerli JSON döndür." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 800
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + GROQ_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true, // So we can check response even if not 200
  };

  let response;
  try {
    response = UrlFetchApp.fetch(GROQ_API_URL, options);
  } catch (e) {
    Logger.log("Network error or fetch failed: " + e);
    throw e; // Rethrow if you want to handle upstream
  }

  const responseCode = response.getResponseCode();
  Logger.log("API Response HTTP status: " + responseCode);

  const responseText = response.getContentText();
  Logger.log("API Response body: " + responseText);

  if (responseCode !== 200) {
    throw new Error("API call failed with HTTP status " + responseCode);
  }

  const parsedResponse = JSON.parse(responseText);

  const assistantContent = parsedResponse.choices[0].message.content;
  const cleaned = assistantContent.replace(/```json|```/g, "").trim();

  Logger.log("Cleaned assistant content: " + cleaned);

  return cleaned;
}

