function registerProductsAndUpdateAttributes() {
  getAccessToken(); // アクセストークンを取得

  const productsData = getProductsFromSpreadsheet();

  productsData.forEach((productData) => {
    const productInfo = {
      categoryId: productData.categoryId,
      productName: productData.productName,
      price: productData.price,
      description: productData.description,
      size: productData.size,
    };

    const registeredProduct = registerProduct(productInfo);

    if (registeredProduct && registeredProduct.productId) {
      const productId = registeredProduct.productId;
      updateProductAttributes(productId, productData.attributeItems);
    }
  });
}

function registerProduct(product) {
  const accessToken = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_APP_ACCESS_TOKEN"
  );
  const contractId = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_CONTRACT_ID_RUN"
  );
  const url = `https://api.smaregi.jp/${contractId}/pos/products`;

  const options = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify(product),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseBody = JSON.parse(response.getContentText());

  if (response.getResponseCode() === 200) {
    return responseBody;
  } else {
    console.error("Failed to register product. Response:", responseBody);
    return null;
  }
}

function updateProductAttributes(productId, attributeItems) {
  const accessToken = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_APP_ACCESS_TOKEN"
  );
  const contractId = PropertiesService.getScriptProperties().getProperty(
    "SMAREGI_CONTRACT_ID_RUN"
  );
  const url = `https://api.smaregi.jp/${contractId}/pos/products/${productId}`;

  const data = {
    attributeItems: attributeItems,
  };
  console.log(attributeItems);

  const options = {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify(data),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = JSON.parse(response.getContentText());
  console.log(responseBody);

  if (responseCode !== 200) {
    console.error(
      "Failed to update product attributes. Response code:",
      responseCode,
      "Response body:",
      responseBody
    );
  } else {
    console.log(
      "Product attributes updated successfully for productId:",
      productId
    );
  }
}

function getProductsFromSpreadsheet() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("商品登録");
  const data = sheet.getDataRange().getValues();
  const headers = data[1]; // 2行目をヘッダーとして取得
  const products = [];

  for (let i = 3; i < data.length; i++) {
    // 4行目からデータを取得
    const row = data[i];
    const product = {};

    headers.forEach((header, index) => {
      if (header.startsWith("no")) {
        if (!product.attributeItems) {
          product.attributeItems = [];
        }
        const no = header.replace("no", "");
        product.attributeItems.push({
          no: no,
          code: String(row[index]),
        });
      } else {
        product[header] = row[index];
      }
    });

    products.push(product);
  }

  return products;
}
