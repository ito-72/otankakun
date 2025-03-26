// main.js

let allItems = []; // 取得した全データを保持

// HTML要素の参照
const displayItemSelect = document.getElementById("item-select");
const saleToggle = document.getElementById("sale-toggle");

// 表示欄のIDとスプレッド対応キーのマッピング
const fieldMap = {
  "item-name": "itemName",
  "content-amount": "content",
  "unit": "unit",
  "count": "count",
  "price-before-tax": "priceBeforeTax",
  "price-taxed": "priceTaxed",
  "unit-price": "unitPrice",
  "unit-of-unit-price": "unitOfUnitPrice",
  "store": "store",
};

// ✅ ステップ① ページ読み込み時にデータ取得
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/fetchData", { method: "POST" });
    const data = await response.json();
    allItems = data;

    populateItemSelect(); // ステップ② 商品一覧を生成
    updateDisplay();      // 初期表示

    // イベントリスナー登録（選択 or セール切り替え）
    displayItemSelect.addEventListener("change", updateDisplay);
    saleToggle.addEventListener("change", updateDisplay);

  } catch (error) {
    console.error("データ取得エラー:", error);
  }
});

// ✅ ステップ② 商品一覧を select に追加
function populateItemSelect() {
  const uniqueItems = [...new Set(allItems.map(item => item.itemName))];
  displayItemSelect.innerHTML = '<option value="">-- 項目を選択 --</option>';
  uniqueItems.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    displayItemSelect.appendChild(option);
  });
}

// ✅ ステップ③ 表示欄を更新（最新の1件を選ぶ）
function updateDisplay() {
  const selectedItem = displayItemSelect.value;
  const saleOnly = saleToggle.checked;

  // 選択された項目に該当する行だけを抽出
  let filtered = allItems.filter(item => item.itemName === selectedItem);
  if (saleOnly) {
    filtered = filtered.filter(item => item.sale === "○"); // ← セール記号は ○ で受けてる
  }

  const latest = filtered[filtered.length - 1]; // 一番下の行を使う（最新）

  // 表示欄に反映
  if (latest) {
    for (const [id, key] of Object.entries(fieldMap)) {
      document.getElementById(id).textContent = latest[key] ?? "--";
    }
  } else {
    // データがないときは空欄
    for (const id of Object.keys(fieldMap)) {
      document.getElementById(id).textContent = "--";
    }
  }
}
