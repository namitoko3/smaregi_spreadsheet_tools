// スプレッドシートから商品IDを取得する関数
function getProductIdsFromSpreadsheet() {
  // 対象のシートを取得
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("在庫数取得");
  const data = sheet.getDataRange().getValues();
  return data.slice(2).map((row) => String(row[2])); // C列の商品IDを取得
}

// 商品IDを使用してスマレジAPIから在庫情報を取得する関数
function fetchStockDetails(productId, accessToken) {
  // accessTokenを引数として追加
  // スクリプトプロパティから契約IDを取得
  const contractId = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_CONTRACT_ID_RUN"
  );

  // 商品IDを使用して在庫情報を取得するURLを作成
  const apiUrl = `https://api.smaregi.jp/${contractId}/pos/stock?product_id=${productId}&fields=storeId,stockAmount`;
  const apiOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  console.log("Request URL: " + apiUrl);

  // APIからのレスポンスを取得
  const apiResponse = UrlFetchApp.fetch(apiUrl, apiOptions);
  const responseText = apiResponse.getContentText();
  console.log(`Response for Product ID: ${productId}: ${responseText}`);

  return JSON.parse(responseText);
}

function writeStockDetailsToSpreadsheet(productId, stockDetails) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("在庫数取得");
  const productIds = getProductIdsFromSpreadsheet();
  const rowIndex = productIds.indexOf(productId) + 3;
  const storeIds = sheet
    .getRange(2, 4, 1, sheet.getLastColumn() - 3)
    .getValues()[0]
    .map(String); // D2~O2の店舗IDを取得し、文字列として扱う

  stockDetails.forEach((detail) => {
    const storeId = detail.storeId;
    const columnIndex = storeIds.indexOf(storeId) + 4; // 店舗IDに対応する列を特定
    if (columnIndex !== 3) {
      // C列のインデックスは3なので、C列への書き込みをスキップ
      sheet.getRange(rowIndex, columnIndex).setValue(detail.stockAmount);
    }
  });
}

// 商品IDを取得して、それに基づいて在庫情報を取得し、スプレッドシートに書き込むメイン関数
function fetchAndWriteStockDetails() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("在庫数取得");

  // D3:Oのエリアをクリア
  sheet.getRange("D3:Z").clearContent();

  // アクセストークンを取得
  getAccessToken();
  const accessToken = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_APP_ACCESS_TOKEN"
  );

  const productIds = getProductIdsFromSpreadsheet();
  for (const productId of productIds) {
    const stockDetails = fetchStockDetails(productId, accessToken); // accessTokenを引数として渡す
    writeStockDetailsToSpreadsheet(productId, stockDetails);
  }
}
