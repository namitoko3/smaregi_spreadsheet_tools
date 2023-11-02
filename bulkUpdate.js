function getUpdateProductsFromSpreadsheet() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("商品一括更新");
  const data = sheet.getDataRange().getValues();
  const headers = data[1]; // 2行目のデータをヘッダーとして取得
  const products = [];

  for (let i = 2; i < data.length; i++) {
    // 3行目からデータを取得
    const row = data[i];
    const product = {
      productId: String(parseInt(row[1], 10)), // B3セルの内容を整数に変換してから文字列型として取得
    };

    for (let j = 2; j < headers.length; j++) {
      const key = headers[j];
      product[key] = row[j];
    }

    products.push(product);
  }

  return products;
}

function clearSpreadsheetFromRowUpdate(rowNumber) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("商品一括更新");
  sheet.deleteRows(rowNumber, sheet.getLastRow() - rowNumber + 1);
}

function bulkUpdateProducts() {
  getAccessToken(); // アクセストークンを取得
  const accessToken = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_APP_ACCESS_TOKEN"
  );
  const contractId = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_CONTRACT_ID_RUN"
  );
  const url = `https://api.smaregi.jp/${contractId}/pos/products/bulk`; // APIエンドポイント
  const products = getUpdateProductsFromSpreadsheet();
  const callbackUrl = "https://hooks.slack.com/services/******"; // コールバックURL
  const options = {
    method: "PATCH", // PATCHメソッドに変更
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({ products: products, callbackUrl: callbackUrl }),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  console.log(responseCode);
  console.log(responseBody);

  if (responseCode === 202) {
    sendToSlack("商品の一括更新が成功しました。");
    clearSpreadsheetFromRowUpdate(3);
  } else {
    const data = JSON.parse(responseBody);
    sendToSlack("商品の一括更新に失敗しました：" + data.message);
  }
}
