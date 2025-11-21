import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // #5.1 — настроить компаратор
  // Глобальный поиск - date, customer, seller, total (как строка)
  const comparator = createComparison(
    ["skipNonExistentSourceFields"],
    [
      rules.searchMultipleFields(
        "search",
        ["date", "customer", "seller", "total"],
        false
      ),
    ]
  );

  return (data, state, action) => {
    // #5.2 — применить компаратор
    const term = (state.search || "").trim();
    if (!term) return data;
    const target = { search: term };
    return data.filter((item) => comparator(item, target));
  };
}
