import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  let pageCount = 1;

  const renderPageBtn = (pageNumber, currentPage) => {
    const el = createPage();
    const input = el.querySelector('input[name="page"]');
    const span = el.querySelector("span");

    if (input) input.value = String(pageNumber);
    if (span) span.textContent = String(pageNumber);
    if (input) input.checked = pageNumber === currentPage;

    return el;
  };

  const applyPagination = (query, state, action) => {
    const limit = Number(state.rowsPerPage || 10) || 10;
    let page = Number(state.page || 1) || 1;

    if (action && action.name) {
      switch (action.name) {
        case "first":
          page = 1;
          break;
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "last":
          page = pageCount;
          break;
        default:
          break;
      }
    }

    return Object.assign({}, query, { limit, page });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.max(1, Math.ceil(total / limit));

    const currentPage = Math.min(Math.max(1, Number(page || 1)), pageCount);

    // кнопки страниц
    const visible = getPages(currentPage, pageCount, 5);
    const pageButtons = visible.map((n) => renderPageBtn(n, currentPage));
    pages.replaceChildren(...pageButtons);

    // статус
    const firstIndex = total === 0 ? 0 : (currentPage - 1) * limit + 1;
    const lastIndex = Math.min(total, currentPage * limit);

    fromRow.textContent = String(firstIndex);
    toRow.textContent = String(lastIndex);
    totalRows.textContent = String(total);
  };

  return { applyPagination, updatePagination };
};
