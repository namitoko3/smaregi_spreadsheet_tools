function toUTCISOString(date) {
  // 日本時間をUTCに変換
  const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return utcDate.toISOString().replace(/\.[0-9]{3}/, "");
}

function fetchUpdatedItemData() {
  const contractId = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_CONTRACT_ID_RUN"
  );
  getAccessToken();
  const accessToken = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_APP_ACCESS_TOKEN"
  );
  const now = new Date();
  const yesterday = new Date(now.getTime() - 2 * 2 * 60 * 60 * 1000);
  const fromDateTime = toUTCISOString(yesterday);
  const toDateTime = toUTCISOString(now);

  const limit = 100;
  let page = 1;
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("POS商品ID変換マスタ");
  let lastRow = sheet.getLastRow();

  const dataRange = sheet.getRange(1, 1, lastRow, 3);
  const dataValues = dataRange.getValues();
  const dataMap = new Map();
  const updatedValues = [];
  const addedValues = [];

  dataValues.forEach((row, index) => {
    dataMap.set(String(row[0]), index); // 商品コードを文字列として保存
  });

  while (true) {
    const apiUrl = `https://api.smaregi.jp/${contractId}/pos/products?limit=${limit}&page=${page}&fields=productId,productCode,productName&upd_date_time-from=${fromDateTime}&upd_date_time-to=${toDateTime}`;
    const apiOptions = {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      muteHttpExceptions: true,
    };
    const apiResponse = UrlFetchApp.fetch(apiUrl, apiOptions);
    const items = JSON.parse(apiResponse.getContentText());

    if (items.length === 0) {
      break;
    }

    items.forEach((item) => {
      const index = dataMap.get(String(item.productCode)); // 商品コードを文字列として検索
      if (index !== undefined) {
        updatedValues.push({
          row: index + 1,
          values: [item.productCode, item.productId, item.productName],
        });
      } else {
        addedValues.push([item.productCode, item.productId, item.productName]);
        lastRow++;
      }
    });

    if (items.length < limit) {
      break;
    }

    page++;
  }

  // 更新する行ごとに書き込み
  updatedValues.forEach((update) => {
    sheet.getRange(update.row, 1, 1, 3).setValues([update.values]);
  });

  // 一括で追加
  if (addedValues.length > 0) {
    sheet
      .getRange(lastRow + 1 - addedValues.length, 1, addedValues.length, 3)
      .setValues(addedValues);
  }

  console.log(`Updated items: ${updatedValues.length}`);
  console.log(`Added items: ${addedValues.length}`);
}
