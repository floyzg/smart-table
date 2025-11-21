import { createComparison, rules } from "../lib/compare.js";

// #4.3 — настроить компаратор
const filteringComparator = createComparison(
  [
    "skipNonExistentSourceFields",
    "skipEmptyTargetValues",
    "failOnEmptySource",
    "arrayAsRange",
  ],
  [
    // Включающее сравнение только для некоторых полей
    (key, sourceValue, targetValue) => {
      if (
        ["date", "customer"].includes(key) &&
        typeof sourceValue === "string" &&
        typeof targetValue === "string"
      ) {
        return {
          result: sourceValue.toLowerCase().includes(targetValue.toLowerCase()),
        };
      }
      return { continue: true };
    },
    rules.exactEquality(),
  ]
);

export function initFiltering(elements, indexes) {
  // #4.1 — заполнить выпадающие списки опциями
  const sellerSelect = elements.searchBySeller;
  if (sellerSelect && indexes && indexes.sellers) {
    const options = Object.values(indexes.sellers)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        return opt;
      });
    sellerSelect.append(...options);
  }

  return (data, state, action) => {
    // #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      if (field && elements) {
        // найти соответствующий input/select по имени
        const input =
          elements[`searchBy${field[0].toUpperCase()}${field.slice(1)}`];
        if (input) {
          input.value = "";
        }
      }
    }

    // #4.5 — отфильтровать данные используя компаратор
    const target = {
      // поля с такими же именами в данных
      date: state.date || "",
      customer: state.customer || "",
      seller: state.seller || "",
      total: [
        state.totalFrom === "" || state.totalFrom === undefined
          ? ""
          : Number(state.totalFrom),
        state.totalTo === "" || state.totalTo === undefined
          ? ""
          : Number(state.totalTo),
      ],
    };

    return data.filter((item) => filteringComparator(item, target));
  };
}
