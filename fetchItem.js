function fetchItemData() {
  // スクリプトプロパティから必要な情報を取得
  const contractId = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_CONTRACT_ID_RUN"
  );

  // アクセストークンを取得
  getAccessToken();
  const accessToken = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_APP_ACCESS_TOKEN"
  );

  // 商品マスタのデータを取得
  let page = 1;
  const limit = 200; // 一度に取得するアイテム数
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("POS商品ID変換マスタ");
  while (true) {
    const apiUrl = `https://api.smaregi.jp/${contractId}/pos/products?limit=${limit}&page=${page}&fields=productId,productCode`;
    const apiOptions = {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const apiResponse = UrlFetchApp.fetch(apiUrl, apiOptions);
    const items = JSON.parse(apiResponse.getContentText());
    if (items.length === 0) {
      break; // アイテムがなければループを終了
    }
    console.log(items);
    // Googleスプレッドシートに書き込む
    items.forEach((item, index) => {
      const row = (page - 1) * limit + index + 1;
      sheet.getRange(row, 1).setValue(item.productCode);
      sheet.getRange(row, 2).setValue(item.productId);
    });
    page++;
  }
}
