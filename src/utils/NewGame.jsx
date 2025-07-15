import historyDates from '../data/historyDates.json';

export function getRandomPuzzle() {
  const randomIndex = Math.floor(Math.random() * historyDates.length);
  const selected = historyDates[randomIndex];

  const digits = [
    selected.d1,
    selected.d2,
    selected.m1,
    selected.m2,
    selected.y1,
    selected.y2,
  ];

  const puzzle = {
    digits,
    fullDate: selected.fullDate,
    description: selected.description,
  };

  console.log("Selected puzzle from historyDates.json:", puzzle);
  return puzzle;
}