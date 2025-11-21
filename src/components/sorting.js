import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // #3.1 — запомнить выбранный режим сортировки
      const btn = action;
      const colField = btn.dataset.field;
      const nextOrder = sortMap[btn.dataset.value || "none"] || "none";
      btn.dataset.value = nextOrder;
      field = colField;
      order = nextOrder;

      // #3.2 — сбросить сортировки остальных колонок
      columns
        .filter((el) => el !== btn)
        .forEach((el) => (el.dataset.value = "none"));
    } else {
      // #3.3 — получить выбранный режим сортировки
      const active = columns.find(
        (el) => (el.dataset.value || "none") !== "none"
      );
      if (active) {
        field = active.dataset.field;
        order = active.dataset.value;
      }
    }

    return sortCollection(data, field, order);
  };
}
