function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("API実行")
    .addItem("商品登録実行", "bulkCreateProducts")
    .addItem("画像登録実行", "registerProductImages")
    .addItem("商品一括更新", "bulkUpdateProducts")
    .addItem("品番マスタ更新", "fetchUpdatedItemData")
    .addItem("商品情報取得", "fetchProductDetailsFromSpreadsheet")
    .addItem("在庫数取得", "fetchAndWriteStockDetails")
    .addToUi();
}
