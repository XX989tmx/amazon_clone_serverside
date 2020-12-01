function getPagination(currentPage, totalItems, perPage) {
  const nextPage = +currentPage + 1;
  const previousPage = +currentPage - 1;
  const hasNextPage = perPage * +currentPage < totalItems;
  const hasPreviousPage = +currentPage > 1;
  const lastPage = Math.ceil(totalItems / perPage);

  const pagination = {
    currentPage: +currentPage,
    perPage: perPage,
    totalItems: totalItems,
    nextPage: nextPage,
    previousPage: previousPage,
    hasNextPage: hasNextPage,
    hasPreviousPage: hasPreviousPage,
    lastPage: lastPage,
  };
  return pagination;
};
exports.getPagination = getPagination;
