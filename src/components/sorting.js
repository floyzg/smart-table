import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      const btn = action;
      const colField = btn.dataset.field;

      const nextOrder = sortMap[btn.dataset.value || "none"] || "none";
      btn.dataset.value = nextOrder;

      field = colField;
      order = nextOrder;

      columns
        .filter((el) => el !== btn)
        .forEach((el) => (el.dataset.value = "none"));
    } else {
      const active = columns.find((el) => (el.dataset.value || "none") !== "none");
      if (active) {
        field = active.dataset.field;
        order = active.dataset.value;
      }
    }

    const sort = field && order !== "none" ? `${field}:${order}` : null;
    return sort ? Object.assign({}, query, { sort }) : query;
  };
}