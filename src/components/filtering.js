export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      const select = elements[elementName];
      if (!select) return;

      // сохраняем первый option (пустой)
      const emptyOption = select.querySelector("option[value='']");

      // очищаем селект
      select.replaceChildren();

      // возвращаем пустой option первым
      if (emptyOption) {
        select.append(emptyOption);
      } else {
        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = "";
        select.append(empty);
      }

      // добавляем остальные варианты
      Object.values(indexes[elementName]).forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.append(option);
      });

      // гарантируем пустое значение по умолчанию
      select.value = "";
    });
  };

  const applyFiltering = (query, state, action) => {
    // очистка поля
    if (action?.name === "clear") {
      const field = action.dataset?.field;
      if (field && elements) {
        const input =
          elements[`searchBy${field[0].toUpperCase()}${field.slice(1)}`];
        if (input) input.value = "";
      }
    }

    const filter = {};

    const FILTER_FIELDS = ["seller", "customer", "date", "total", "from", "to"];

    FILTER_FIELDS.forEach((field) => {
      if (state[field]) {
        filter[`filter[${field}]`] = state[field];
      }
    });

    return Object.keys(filter).length ? { ...query, ...filter } : query;
  };

  return { updateIndexes, applyFiltering };
}
