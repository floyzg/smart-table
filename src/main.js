import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// API вместо прямых данных
const api = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  return processFormData(new FormData(sampleTable.container));
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  const state = collectState();
  let query = {};

  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  const { total, items } = await api.getRecords(query);

  updatePagination(total, query);
  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

sampleTable.container.style.setProperty("--columns", "1fr 1fr 1fr 1fr");

const applySorting = initSorting(
  Array.from(sampleTable.container.querySelectorAll('button[name="sort"]'))
);

const pageLabelTemplate = sampleTable.elements.pages.querySelector(
  "label.pagination-button"
);

const { applyPagination, updatePagination } = initPagination(
  {
    pages: sampleTable.elements.pages,
    fromRow: sampleTable.elements.fromRow,
    toRow: sampleTable.elements.toRow,
    totalRows: sampleTable.elements.totalRows,
  },
  () => pageLabelTemplate.cloneNode(true)
);

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.elements);

const applySearching = initSearching("search");

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.elements, {
    searchBySeller: indexes.sellers,
  });
}

init().then(render);