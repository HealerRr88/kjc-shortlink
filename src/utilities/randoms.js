export const randomString = (length, type = 0) => {
  var result = '';
  var characters = '';
  if (type === 0) {
    characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  }
  else if (type === 1) {
    characters = 'abcdefghijklmnopqrstuvwxyz';
  }
  else if (type === 2) {
    characters = '0123456789';
  }
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

export const randomIntegers = (min, max, loop = 1) => {
  let array = [];
  while (array.length < loop) {
    let number = Math.floor(Math.random() * (max - min + 1)) + min
    if (!array.find(x => x === number)) {
      array.push(number);
    }
  }
  return array;
}

export const randomInterger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}