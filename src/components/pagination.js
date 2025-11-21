import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  // #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
  const renderPageBtn = (pageNumber, currentPage) => {
    const el = createPage();
    const input = el.querySelector('input[name="page"]');
    const span = el.querySelector("span");
    if (input) input.value = String(pageNumber);
    if (span) span.textContent = String(pageNumber);
    if (input) input.checked = pageNumber === currentPage;
    return el;
  };

  return (data, state, action) => {
    // #2.1 — посчитать количество страниц, объявить переменные и константы
    const rowsPerPage = Number(state.rowsPerPage || 10) || 10;
    const total = data.length;
    const maxPage = Math.max(1, Math.ceil(total / rowsPerPage));
    let currentPage = Number(state.page || 1) || 1;
    currentPage = Math.min(Math.max(1, currentPage), maxPage);

    // #2.6 — обработать действия
    if (action && action.name) {
      switch (action.name) {
        case "first":
          currentPage = 1;
          break;
        case "prev":
          currentPage = Math.max(1, currentPage - 1);
          break;
        case "next":
          currentPage = Math.min(maxPage, currentPage + 1);
          break;
        case "last":
          currentPage = maxPage;
          break;
        default:
          break;
      }
    }

    // #2.4 — получить список видимых страниц и вывести их
    const visible = getPages(currentPage, maxPage, 5);
    const pageButtons = visible.map((n) => renderPageBtn(n, currentPage));
    pages.replaceChildren(...pageButtons);

    // #2.5 — обновить статус пагинации
    const firstIndex = total === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const lastIndex = Math.min(total, currentPage * rowsPerPage);
    fromRow.textContent = String(firstIndex);
    toRow.textContent = String(lastIndex);
    totalRows.textContent = String(total);

    // #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
    const skip = (currentPage - 1) * rowsPerPage;
    return data.slice(skip, skip + rowsPerPage);
  };
};
