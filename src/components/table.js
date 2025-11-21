import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // #1.2 — вывести дополнительные шаблоны до и после таблицы
  // Вставляем дополнительные шаблоны внутрь формы (до контейнера строк и после него)
  const appendTemplateBeforeRows = (templateId) => {
    const tpl = cloneTemplate(templateId);
    Object.assign(root.elements, tpl.elements);
    // вставить перед контейнером строк
    root.elements.rows.before(tpl.container);
  };

  const appendTemplateAfterRows = (templateId) => {
    const tpl = cloneTemplate(templateId);
    Object.assign(root.elements, tpl.elements);
    // вставить после контейнера строк
    root.elements.rows.after(tpl.container);
  };

  Array.isArray(before) && before.forEach(appendTemplateBeforeRows);
  Array.isArray(after) && after.forEach(appendTemplateAfterRows);

  // #1.3 — обработать события и вызвать onAction()
  root.container.addEventListener('submit', (e) => {
    e.preventDefault();
    onAction(typeof e.submitter !== 'undefined' ? e.submitter : undefined);
  });
  // любые изменения в инпутах/селектах
  root.container.addEventListener('input', () => onAction());
  root.container.addEventListener('change', () => onAction());
  // reset для кнопки сброса
  root.container.addEventListener('reset', () => {
    // дать браузеру очистить значения
    setTimeout(() => onAction(), 0);
  });

  const render = (data) => {
    // #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      if (row.elements.date)
        row.elements.date.textContent = String(item.date ?? "");
      if (row.elements.customer)
        row.elements.customer.textContent = String(item.customer ?? "");
      if (row.elements.seller)
        row.elements.seller.textContent = String(item.seller ?? "");
      if (row.elements.total)
        row.elements.total.textContent = String(item.total ?? "");
      return row.container;
    });
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
