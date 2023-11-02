function fetchProductDetailsFromSpreadsheet() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("商品情報取得");
  const data = sheet.getDataRange().getValues();
  const headers = data[1]; // 2行目のデータをヘッダーとして取得
  const contractId = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_CONTRACT_ID_RUN"
  ); // スクリプトのプロパティから契約IDを取得
  const accessToken = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_APP_ACCESS_TOKEN"
  ); // スクリプトのプロパティからアクセストークンを取得
  const baseEndpoint =
    "https://api.smaregi.jp/" + contractId + "/pos/products/";

  for (let i = 2; i < data.length; i++) {
    // 3行目からデータを取得
    const productId = String(parseInt(data[i][1], 10)); // B3セルの内容を整数に変換してから文字列型として取得
    const endpoint = baseEndpoint + productId;
    const options = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    const response = UrlFetchApp.fetch(endpoint, options);
    const product = JSON.parse(response.getContentText());
    console.log(product);

    for (let j = 2; j < headers.length; j++) {
      const key = headers[j]; // C2, D2, E2...の項目のパラメータ名
      if (product[key]) {
        sheet.getRange(i + 1, j + 1).setValue(product[key]);
      }
    }
  }
}
