export function sortStringTableList(listdata, sortOrder, sortParam) {
  let newSortedList = [...listdata];

  if (sortOrder === "ascend") {
    newSortedList.sort((a, b) => {
      return a[sortParam].localeCompare(b[sortParam]);
    });
    return newSortedList;
  } else {
    newSortedList.sort((a, b) => {
      return b[sortParam].localeCompare(a[sortParam]);
    });
    return newSortedList;
  }
}

export function sortNumbersTableList(listdata, sortOrder, sortParam) {
  let newSortedList = [...listdata];

  if (sortOrder === "ascend") {
    newSortedList.sort((a, b) => {
      return a[sortParam] - b[sortParam];
    });
    return newSortedList;
  } else {
    newSortedList.sort((a, b) => {
      return b[sortParam] - a[sortParam];
    });
    return newSortedList;
  }
}

export const editorTextToBeReplaceRegex = `/\\"([^"]*)\\"/g`;

export const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    setTimeout(() => {
      fn(args);
    }, delay);
  };
};
