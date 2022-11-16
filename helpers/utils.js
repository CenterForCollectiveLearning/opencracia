export const shuffle = array => array.sort(() => 0.5 - Math.random());

export const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const roulette_wheel = (fitness, numberProposals) => {
  const total_fitness = fitness.reduce((pv, cv) => pv + cv, 0);
  const rel_fitness = [];
  fitness.array.forEach(f => {
    const p = f/total_fitness;
    rel_fitness.push(p);
  });
  var c = 0;
  var alternatives = [];
  for (let proposal_id = 1; proposal_id < rel_fitness.length; proposal_id++) {
    c = c + rel_fitness[i];
    if (Math.random() <= c)
      alternatives.push(proposal_id);
  }
  return alternatives;
};

export const chunks = (array, size) => {
  const dataChuncked = [];
  const j = array.length;

  for (let i = 0; i < j; i += size) {
    const temporary = array.slice(i, i + size);
    dataChuncked.push(temporary);
  }

  return dataChuncked;
};

export const combinations = (array, size) => {
  function p(t, i) {
    if (t.length === size) {
      result.push(t);
      return;
    }
    if (i + 1 > array.length) 
      return;
        
    p(t.concat(array[i]), i + 1);
    p(t, i + 1);
  }

  var result = [];
  p([], 0);
  return result;
};

