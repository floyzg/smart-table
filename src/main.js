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

// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  return {
    ...state,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let result = [...data]; // копируем для последующего изменения
  // использование: поиск - фильтрация - сортировка - пагинация
  result = searching(result, state, action);
  result = filtering(result, state, action);
  result = sorting(result, state, action);
  result = pagination(result, state, action);

  sampleTable.render(result);
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

// Рендер: поиск, заголовок, фильтры, пагинацию
sampleTable.container.style.setProperty("--columns", "1fr 1fr 1fr 1fr");

const sorting = initSorting(
  Array.from(sampleTable.container.querySelectorAll('button[name="sort"]'))
);

const pageLabelTemplate = sampleTable.elements.pages.querySelector(
  "label.pagination-button"
);
const pagination = initPagination(
  {
    pages: sampleTable.elements.pages,
    fromRow: sampleTable.elements.fromRow,
    toRow: sampleTable.elements.toRow,
    totalRows: sampleTable.elements.totalRows,
  },
  () => pageLabelTemplate.cloneNode(true)
);

const filtering = initFiltering(sampleTable.elements, indexes);
const searching = initSearching(sampleTable.elements.search);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

render();
