function getAccessToken() {
  const contractId = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_CONTRACT_ID_RUN"
  );
  const scope =
    PropertiesService.getScriptProperties().getProperty("SMAREGI_APP_SCOPE"); // スクリプトプロパティからスコープを取得
  const clientId = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_APP_CLIENT_ID"
  );
  const secret =
    PropertiesService.getScriptProperties().getProperty("SMAREGI_APP_SECRET");

  const grantType = "client_credentials";
  const url = "https://id.smaregi.jp/app/" + contractId + "/token";
  const headers = {
    Authorization:
      "Basic " +
      Utilities.base64Encode(clientId + ":" + secret, Utilities.Charset.UTF_8),
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const payload = {
    grant_type: grantType,
    scope: scope,
  };
  const options = {
    method: "post",
    headers: headers,
    payload: payload,
    muteHttpExceptions: true,
  };
  try {
    let resStr = UrlFetchApp.fetch(url, options).getContentText();
    if (resStr.length === 0) {
      throw new Error("受信データがありませんでした。");
    }
    let resJson = JSON.parse(resStr);
    Logger.log(resStr);

    PropertiesService.getScriptProperties().setProperties({
      SMAREGI_APP_ACCESS_TOKEN: resJson.access_token,
    });
  } catch (e) {
    Logger.log("エラー：" + e);
    throw new Error(e);
  }
}
