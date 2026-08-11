export type AliceOption = {
  id: string;
  group: "Cobre Leito" | "Jogo de Lençol" | "Jogo de Toalha";
  packageLabel: "5 peças" | "3 peças" | "4 peças";
  size: string;
  customerPrice: number;
  resellerPrice: number;
  details: string[];
  sourceNote: string;
};

const coverSizes = {
  Casal: "1 cobre-leito 2,40 × 2,50 m",
  Queen: "1 cobre-leito 2,80 × 2,60 m",
  "Super King": "1 cobre-leito 3,30 × 2,70 m",
};

export const aliceOptions: AliceOption[] = [
  ...[
    ["casal", "Casal", 765, 546],
    ["queen", "Queen", 819, 585],
    ["super-king", "Super King", 892, 637],
  ].map(([id, size, customerPrice, resellerPrice]) => ({
    id: `cobre-5-${id}`,
    group: "Cobre Leito" as const,
    packageLabel: "5 peças" as const,
    size: String(size),
    customerPrice: Number(customerPrice),
    resellerPrice: Number(resellerPrice),
    details: [coverSizes[size as keyof typeof coverSizes], "2 porta-travesseiros 50 × 70 cm", "2 almofadas"],
    sourceNote: "Composição confirmada pela revenda; medidas e valores cruzados com o catálogo e as listas 2026.",
  })),
  ...[
    ["casal", "Casal", 655, 468],
    ["queen", "Queen", 710, 507],
    ["super-king", "Super King", 765, 546],
  ].map(([id, size, customerPrice, resellerPrice]) => ({
    id: `cobre-3-${id}`,
    group: "Cobre Leito" as const,
    packageLabel: "3 peças" as const,
    size: String(size),
    customerPrice: Number(customerPrice),
    resellerPrice: Number(resellerPrice),
    details: [coverSizes[size as keyof typeof coverSizes], "2 porta-travesseiros 50 × 70 cm"],
    sourceNote: "Composição confirmada pela revenda; medidas e valores cruzados com o catálogo e as listas 2026.",
  })),
  {
    id: "lencol-4-casal", group: "Jogo de Lençol", packageLabel: "4 peças", size: "Casal", customerPrice: 355, resellerPrice: 254,
    details: ["1 lençol de cima 2,50 × 2,20 m", "1 lençol de baixo com elástico para colchão até 1,40 × 1,90 × 0,30 m", "2 fronhas 70 × 50 cm"], sourceNote: "Composição da página 04; disponibilidade e valores das listas 2026.",
  },
  {
    id: "lencol-4-queen", group: "Jogo de Lençol", packageLabel: "4 peças", size: "Queen", customerPrice: 392, resellerPrice: 280,
    details: ["1 lençol de cima 2,75 × 2,50 m", "1 lençol de baixo com elástico para colchão até 1,60 × 2,00 × 0,35 m", "2 fronhas 70 × 50 cm"], sourceNote: "Composição da página 04; disponibilidade e valores das listas 2026.",
  },
  {
    id: "lencol-4-super-king", group: "Jogo de Lençol", packageLabel: "4 peças", size: "Super King", customerPrice: 446, resellerPrice: 319,
    details: ["1 lençol de cima 2,90 × 2,80 m", "1 lençol de baixo com elástico para colchão até 1,93 × 2,03 × 0,40 m", "2 fronhas 70 × 50 cm"], sourceNote: "Composição da página 04; disponibilidade e valores das listas 2026.",
  },
  {
    id: "toalhas-4", group: "Jogo de Toalha", packageLabel: "4 peças", size: "Único", customerPrice: 400, resellerPrice: 286,
    details: ["2 toalhas de banho 70 cm × 1,40 m", "2 toalhas de rosto 50 × 80 cm", "Composição: 100% algodão"], sourceNote: "Composição da página 04; disponibilidade e valores das listas 2026.",
  },
];

export const aliceGroups = Array.from(new Set(aliceOptions.map((option) => option.group)));

export const aliceDetails = {
  id: "alice-cobre-leito",
  name: "Linha Alice",
  color: "Creme com rosê",
  image: "/products/alice-catalogo.png",
  material: "Hipercal 200 fios",
  composition: "100% poliéster (120 g)",
  filling: "100% poliéster",
  benefits: ["Fácil de lavar", "Secagem rápida", "Bordado delicado"],
};
