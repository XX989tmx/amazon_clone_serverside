const { validationResult } = require("express-validator");

function sum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    const num = array[i];
    sum += num;
  }
  return sum;
}

function sort(arr, order) {
  let result;
  if (order === "1") {
    result = arr.sort((a, b) => a - b);
  } else if (order === "-1") {
    result = arr.sort((a, b) => b - a);
  } else {
    result = arr.sort((a, b) => a - b);
  }
  return result;
}

function sortLocale(arr) {
  return arr.sort((a, b) => a.localeCompare(b, "jp"));
}

function search(array, val) {
  let min = 0;
  let max = array.length - 1;

  while (min <= max) {
    let middle = Math.floor((min + max) / 2);
    let currentElement = array[middle];

    if (array[middle] < val) {
      min = middle + 1;
    } else if (array[middle] > val) {
      max = middle - 1;
    } else {
      return middle;
    }
  }

  return -1;
}

function checkInputValidationResult(req) {
  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    const error = new Error("Invalid inputs.");
    console.log(error);
    return next(error);
  }
}

exports.checkInputValidationResult = checkInputValidationResult;
