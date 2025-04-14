import { ALPHABET } from './item.js';

async function fetchAllAlphabet() {
  ALPHABET.slice(0, -1).map((alphabet, index) => console.log(alphabet, ALPHABET[index + 1]));
}

fetchAllAlphabet();