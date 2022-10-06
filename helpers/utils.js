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
  var proposals = [];
  for (let proposal_id = 1; proposal_id < rel_fitness.length; proposal_id++) {
    c = c + rel_fitness[i];
    if (Math.random() <= c)
      proposals.push(proposal_id);
  }
  return proposals;
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

export const candidates = [
  {id: 1, name: "Emmanuel Macron", shortname: "Macron", photo: "/candidates/macron-min.jpeg"},
  {id: 2, name: "Eric Zemmour", shortname: "Zemmour", photo: "/candidates/zemmour-min.jpeg"},
  {id: 3, name: "Nicolas Dupont-Aignan", shortname: "Dupont-Aignan", photo: "/candidates/dupont-min.jpeg"},
  {id: 4, name: "Valerie Pecresse", shortname: "Pecresse", photo: "/candidates/pecresse-min.jpeg"},
  {id: 5, name: "Marine Le Pen", shortname: "Le Pen", photo: "/candidates/le-pen-min.jpeg"},
  {id: 6, name: "Anne Hidalgo", shortname: "Hidalgo", photo: "/candidates/hidalgo-min.jpeg"},
  {id: 7, name: "Yannick Jadot", shortname: "Jadot", photo: "/candidates/jadot-min.jpeg"},
  {id: 8, name: "Jean-Luc Mélenchon", shortname: "Mélenchon", photo: "/candidates/melenchon-min.jpeg"},
  {id: 9, name: "Fabien Roussel", shortname: "Roussel", photo: "/candidates/roussel-min.jpeg"},
  {id: 10, name: "Philippe Poutou", shortname: "Poutou", photo: "/candidates/poutou-min.jpeg"},
  {id: 11, name: "Nathalie Arthaud", shortname: "Arthaud", photo: "/candidates/arthaud.jpg"},
  {id: 12, name: "Jean Lassalle", shortname: "Lassalle", photo: "/candidates/lassalle-min.jpeg"}
];

export const shareText = "🟦🟦⬜⬜🟥🟥\n🟦🟦⬜⬜🟥🟥\n🟦🟦⬜⬜🟥🟥\n🟦🟦⬜⬜🟥🟥\nJ'ai participé à monprogramme2022.org";

