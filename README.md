# Smaregi Spreadsheet Tools

## 概要

このプロジェクトは、Smaregi API を用いて、スマレジの業務をサポートするGoogle Apps Script（GAS）スクリプトです。

## 機能一覧

# 在庫数の取得 / getstocks.gs**: 
スプレッドシートから商品 ID を取得し、それに関連する在庫情報を API から取得してスプレッドシートに書き込みます。
# 商品画像の登録在庫数の取得 / productImg.gs**:
スマレジGUIには画像一括登録がありません。商品に関連する画像情報を FTP サーバー経由で取得し、通常の管理画面ではできない一括登録処理を行います。
# **商品一括更新 / bulkUpdate.gs**: 
スプレッドシートから取得した商品情報を用いて一括更新を行います。通常の管理画面は、不必要な項目が必須事項だったり、誤爆の危険が高いですが、このスクリプトでは必要な項目のみを更新することができます。
**開発中**

# **新規商品登録 / productNew.gs**: 
新規商品をスプレッドシートから登録します。 **開発中**
こちらが開発中な理由は、スマレジAPI経由での登録だと自動採番がを行わないためです。
そのためJANコードや、他のIDとの連携が必要になります。

# **商品 DB 同期 / reloadItem.gs**: 
最近更新された商品データを API から取得します。
ある種のマスタですね。

# **商品情報取得 / getProductInfo.gs**: 
スプレッドシートから商品情報を取得し、商品情報を API から取得します。
名称や値段が対象です。

# **ui.gs**:
 スプレッドシートに UI 要素を追加します。

# **accesstoken.gs**: 
Smaregi API のアクセストークンを取得します。
このgsではスクリプトプロパティを利用していますが、セキュリティ上の懸念を払拭したい場合はGASをGCPすることをおすすめします。

- **fetchItem.gs**: 商品データを API から取得してスプレッドシートに記入します。

## セットアップ

1. スプレッドシートを作成し、必要な形式でデータを入力します。
2. Google Apps Script エディタを開き、このリポジトリのスクリプトをコピーして貼り付けます。
3. スクリプトプロパティに Smaregi API のトークンやその他の設定を追加します。環境変数は安全のためスクリプトプロパティを使用してください。

## 使用方法
各スクリプトは、スプレッドシートのメニューから実行できます。または、Google Apps Script エディタから直接実行することも可能です。


## English Instruction Follows
==
description
This project is a Google Apps Script (GAS) script that supports Smaregi operations using the Smaregi API.

readme
# Smaregi Spreadsheet Tools

## Overview

This project is a Google Apps Script (GAS) script that supports Smaregi operations using the Smaregi API.

## Feature List

# Inventory Retrieval / getstocks.gs**: 
Retrieves product IDs from the spreadsheet and fetches the related inventory information from the API to write back into the spreadsheet.
# Product Image Registration / productImg.gs**:
There is no bulk image registration in the Smaregi GUI. This script fetches image information related to the products via FTP server and performs bulk registration, which is not possible through the usual management screen.
# Bulk Product Update / bulkUpdate.gs**: 
Performs bulk updates using product information retrieved from the spreadsheet. The normal management screen requires unnecessary fields and is prone to errors, but this script only updates the necessary fields.
**Under Development**

# New Product Registration / productNew.gs**: 
Registers new products from the spreadsheet. **Under Development**
The reason this is under development is because registration through the Smaregi API does not perform automatic numbering.
Therefore, it becomes necessary to coordinate with JAN codes or other IDs.

# Product DB Synchronization / reloadItem.gs**: 
Fetches recently updated product data from the API.
It's kind of a master data sync.

# Retrieving Product Information / getProductInfo.gs**: 
Retrieves product information from the spreadsheet and fetches product information from the API.
Targets include names and prices.

# **ui.gs**:
 Adds UI elements to the spreadsheet.

# **accesstoken.gs**: 
Retrieves the access token for the Smaregi API.
This gs uses script properties, but if you want to allay security concerns, it is recommended to link GAS with GCP.

- **fetchItem.gs**: Fetches product data from the API and enters it into the spreadsheet.

## Setup

1. Create a spreadsheet and input the necessary data in the required format.
2. Open the Google Apps Script editor and copy and paste the scripts from this repository.
3. Add Smaregi API token and other settings to the script properties. Please use script properties for environment variables for safety.

## Usage
Each script can be executed from the menu in the spreadsheet. They can also be run directly from the Google Apps Script editor.
