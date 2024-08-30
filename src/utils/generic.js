import dayjs from "dayjs";

export function sortStringTableList(listData, sortOrder, sortParam) {
  let newSortedList = [...listData];
  if (sortOrder === "ascend") {
    newSortedList = newSortedList.sort((a, b) => {
      return a[sortParam].localeCompare(b[sortParam]);
    });
  } else if (sortOrder === "descend") {
    newSortedList = newSortedList.sort((a, b) => {
      return b[sortParam].localeCompare(a[sortParam]);
    });
  }
  // console.log("sortedList", newSortedList);
  // debugger;
  return newSortedList;
}

export function sortByDateTableList(listData, sortOrder, sortParam) {
  let newSortedList = [...listData];

  if (sortOrder === "ascend") {
    newSortedList = newSortedList.sort((a, b) => {
      return dayjs(a[sortParam]) - dayjs(b[sortParam]);
    });
  } else if (sortOrder === "descend") {
    newSortedList = newSortedList.sort((a, b) => {
      return dayjs(b[sortParam]) - dayjs(a[sortParam]);
    });
  }
  // debugger;
  return newSortedList;
}

export function sortByNumberTableList(listData, sortOrder, sortParam) {
  let newSortedList = [...listData];

  if (sortOrder === "ascend") {
    newSortedList = newSortedList.sort((a, b) => {
      return a[sortParam] - b[sortParam];
    });
  } else if (sortOrder === "descend") {
    newSortedList = newSortedList.sort((a, b) => {
      return b[sortParam] - a[sortParam];
    });
  }
  // debugger;
  return newSortedList;
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

export const userColors = Object.freeze([
  "#fb7185",
  "#fdba74",
  "#d9f99d",
  "#a7f3d0",
  "#a5f3fc",
  "#a5b4fc",
  "#f0abfc",
]);

function hashStringToNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function getUserColor(username) {
  const hash = hashStringToNumber(username);
  const index = Math.abs(hash) % userColors.length;
  return userColors[index];
}
