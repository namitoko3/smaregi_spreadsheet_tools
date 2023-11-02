function registerProductImages() {
  getAccessToken(); // アクセストークンを取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("画像登録");
  var lastRow = sheet.getLastRow();
  var dataRange = sheet.getRange(3, 2, lastRow - 2, 2); // 3行目から最終行までのB列とC列を取得
  var data = dataRange.getValues();

  var accessToken = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_APP_ACCESS_TOKEN"
  ); // アクセストークンを取得
  var contractId = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_CONTRACT_ID_RUN"
  ); // 契約IDを取得

  for (var i = 0; i < data.length; i++) {
    var productId = data[i][0];
    var imageUrl = data[i][1];

    // APIリクエストの設定
    var url =
      "https://api.smaregi.jp/" +
      contractId +
      "/pos/products/" +
      productId +
      "/image";
    var options = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken, // 取得したアクセストークンを使用
        "Content-Type": "application/json",
      },
      payload: JSON.stringify({
        imageUrl: imageUrl,
      }),
    };

    console.log(url);

    // APIリクエストを送信
    UrlFetchApp.fetch(url, options);
  }

  // 全ての処理が完了したことを通知するメッセージボックスを表示
  var ui = SpreadsheetApp.getUi();
  ui.alert("処理が完了しました。");
}
