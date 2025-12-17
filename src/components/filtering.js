export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      if (!elements[elementName]) return;

      elements[elementName].replaceChildren(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement("option");
          el.textContent = name;
          el.value = name;
          return el;
        })
      );
    });
  };

  const applyFiltering = (query, state, action) => {
    // очистка поля
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      if (field && elements) {
        const input =
          elements[`searchBy${field[0].toUpperCase()}${field.slice(1)}`];
        if (input) input.value = "";
      }
    }

    const filter = {};

    const FILTER_FIELDS = ["seller", "customer", "date", "total"];

    const applyFiltering = (query, state, action) => {
      const filter = {};

      FILTER_FIELDS.forEach((field) => {
        if (state[field]) {
          filter[`filter[${field}]`] = state[field];
        }
      });

      return Object.keys(filter).length ? { ...query, ...filter } : query;
    };
    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return { updateIndexes, applyFiltering };
}
