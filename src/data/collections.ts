export type PriceTriple = readonly [number, number, number];
export type CollectionOption = {
  id: string; group: "Cobre Leito" | "Jogo de Lençol" | "Jogo de Toalha" | "Kit Infantil" | "Jogo de Banheiro" | "Cortina" | "Toalha de Mesa" | "Tapete de Cozinha" | "Kit de Almofadas";
  packageLabel: string; size: string; customerPrice: number; resellerPrice: number; details: string[]; variant?: string;
};
export type Collection = {
  slug: string; name: string; page: number; image: string; color: string;
  coverFabric: string; sheetFabric: string; options: CollectionOption[]; extraImages?: string[]; priceOnRequest?: boolean; imagePosition?: string;
};

const sizes = ["Casal", "Queen", "Super King"] as const;
const coverMeasures = ["1 cobre-leito 2,40 × 2,50 m", "1 cobre-leito 2,80 × 2,60 m", "1 cobre-leito 3,30 × 2,70 m"];
const sheetDetails = [
  ["1 lençol de cima 2,50 × 2,20 m", "1 lençol de baixo com elástico para colchão até 1,40 × 1,90 × 0,30 m", "2 fronhas 70 × 50 cm"],
  ["1 lençol de cima 2,75 × 2,50 m", "1 lençol de baixo com elástico para colchão até 1,60 × 2,00 × 0,35 m", "2 fronhas 70 × 50 cm"],
  ["1 lençol de cima 2,90 × 2,80 m", "1 lençol de baixo com elástico para colchão até 1,93 × 2,03 × 0,40 m", "2 fronhas 70 × 50 cm"],
];

function options(config: {
  coverPieces: number; coverCustomer: PriceTriple; coverReseller: PriceTriple; coverExtra: string[];
  reducedCustomer?: PriceTriple; reducedReseller?: PriceTriple;
  sheetCustomer: PriceTriple; sheetReseller: PriceTriple;
  includeTowel?: boolean;
}): CollectionOption[] {
  const result: CollectionOption[] = [];
  sizes.forEach((size, index) => result.push({ id: `cobre-${config.coverPieces}-${index}`, group: "Cobre Leito", packageLabel: `${config.coverPieces} peças`, size, customerPrice: config.coverCustomer[index], resellerPrice: config.coverReseller[index], details: [coverMeasures[index], ...config.coverExtra] }));
  if (config.reducedCustomer && config.reducedReseller) sizes.forEach((size, index) => result.push({ id: `cobre-3-${index}`, group: "Cobre Leito", packageLabel: "3 peças", size, customerPrice: config.reducedCustomer![index], resellerPrice: config.reducedReseller![index], details: [coverMeasures[index], "2 porta-travesseiros 50 × 70 cm"] }));
  sizes.forEach((size, index) => result.push({ id: `lencol-4-${index}`, group: "Jogo de Lençol", packageLabel: "4 peças", size, customerPrice: config.sheetCustomer[index], resellerPrice: config.sheetReseller[index], details: sheetDetails[index] }));
  if (config.includeTowel !== false) result.push({ id: "toalha-4", group: "Jogo de Toalha", packageLabel: "4 peças", size: "Único", customerPrice: 400, resellerPrice: 286, details: ["2 toalhas de banho 70 cm × 1,40 m", "2 toalhas de rosto 50 × 80 cm", "100% algodão"] });
  return result;
}

const lowCover = { coverCustomer: [692,747,800] as const, coverReseller: [494,533,572] as const, reducedCustomer: [546,592,646] as const, reducedReseller: [390,423,462] as const };
const highCover = { coverCustomer: [765,819,892] as const, coverReseller: [546,585,637] as const, reducedCustomer: [655,710,765] as const, reducedReseller: [468,507,546] as const };
const sheetCotton = { sheetCustomer: [602,637,692] as const, sheetReseller: [430,455,494] as const };
const sheetBlend = { sheetCustomer: [455,497,528] as const, sheetReseller: [325,355,377] as const };

const printedOptions = (): CollectionOption[] => [
  ...options({coverPieces:3,coverCustomer:[528,564,619],coverReseller:[377,403,442],sheetCustomer:[294,315,336],sheetReseller:[210,225,240],coverExtra:["2 porta-travesseiros 50 × 70 cm"],includeTowel:false}),
  ...sizes.map((size,index) => ({id:`lencol-3-${index}`,group:"Jogo de Lençol" as const,packageLabel:"3 peças",size,customerPrice:[186,208,245][index],resellerPrice:[133,148,175][index],details:[sheetDetails[index][1],"2 fronhas 70 × 50 cm"]})),
  {id:"cobre-solteiro-2",group:"Cobre Leito",packageLabel:"2 peças",size:"Solteiro",customerPrice:437,resellerPrice:312,details:["1 cobre-leito 1,85 × 2,40 m","1 porta-travesseiro 50 × 70 cm"]},
  {id:"lencol-solteiro-3",group:"Jogo de Lençol",packageLabel:"3 peças",size:"Solteiro",customerPrice:175,resellerPrice:125,details:["1 lençol de baixo com elástico para colchão até 0,90 × 1,90 × 0,30 m","1 fronha 70 × 50 cm","1 peça complementar conforme lista oficial"]},
  {id:"lencol-solteiro-2",group:"Jogo de Lençol",packageLabel:"2 peças",size:"Solteiro",customerPrice:133,resellerPrice:95,details:["1 lençol de baixo com elástico para colchão até 0,90 × 1,90 × 0,30 m","1 fronha 70 × 50 cm"]}
];

const embroideredSheetOptions = (): CollectionOption[] => [
  ...sizes.map((size,index) => ({id:`lencol-4-${index}`,group:"Jogo de Lençol" as const,packageLabel:"4 peças",size,customerPrice:[455,497,528][index],resellerPrice:[325,355,377][index],details:sheetDetails[index]})),
  ...sizes.map((size,index) => ({id:`lencol-3-${index}`,group:"Jogo de Lençol" as const,packageLabel:"3 peças",size,customerPrice:[302,316,334][index],resellerPrice:[216,226,239][index],details:[sheetDetails[index][1],"2 fronhas bordadas 70 × 50 cm"]})),
  {id:"lencol-solteiro-3",group:"Jogo de Lençol",packageLabel:"3 peças",size:"Solteiro",customerPrice:328,resellerPrice:234,details:["1 lençol de cima 2,45 × 1,60 m","1 lençol de baixo com elástico para colchão até 0,90 × 1,90 × 0,30 m","1 fronha bordada 70 × 50 cm"]},
  {id:"fronhas-2",group:"Jogo de Lençol",packageLabel:"2 peças",size:"Par de fronhas",customerPrice:116,resellerPrice:83,details:["2 fronhas bordadas 70 × 50 cm"]}
];

const sheetModels = [
  {slug:"lencol-ref-610",name:"Lençol Ref. 610",page:45,image:"/products/lencois/ref-610.png"},
  {slug:"lencol-azurre",name:"Lençol Azurre",page:45,image:"/products/lencois/azurre.png"},
  {slug:"lencol-ref-630",name:"Lençol Ref. 630",page:45,image:"/products/lencois/ref-630.png"},
  {slug:"lencol-ref-640",name:"Lençol Ref. 640",page:45,image:"/products/lencois/ref-640.png"},
  {slug:"lencol-loreta",name:"Lençol Loreta",page:45,image:"/products/lencois/loreta.png"},
  {slug:"lencol-serena",name:"Lençol Serena",page:46,image:"/products/lencois/serena.png"},
  {slug:"lencol-karise",name:"Lençol Karise",page:46,image:"/products/lencois/karise.png"},
  {slug:"lencol-ref-680",name:"Lençol Ref. 680",page:46,image:"/products/lencois/ref-680.png"},
  {slug:"lencol-ref-690",name:"Lençol Ref. 690",page:46,image:"/products/lencois/ref-690.png"},
  {slug:"lencol-ref-700",name:"Lençol Ref. 700",page:46,image:"/products/lencois/ref-700.png"},
  {slug:"lencol-ref-710",name:"Lençol Ref. 710",page:46,image:"/products/lencois/ref-710.png"}
];

const towelModels = [
  ["alasca","Alasca",47],["cibele","Cibele",47],["cristal","Cristal",47],["verona","Verona",47],["bella","Bella",47],["melina","Melina",47],
  ["marilu","Marilu",48],["bianca","Bianca",48],["serena","Serena",48],["muriel","Muriel",48],["zoe","Zoe",48],["naomi","Naomi",48],
  ["karise","Karise",49],["alice","Alice",49],["prisma","Prisma",49],["topazio","Topázio",49],["mavie","Mavie",49],["azure","Azure",49],
  ["loreta","Loreta",50],["iris","Íris",50],["helena","Helena",50],["lenita","Lenita",50],["sandy","Sandy",50],["veneza","Veneza",50]
] as const;

const towelOptions = (): CollectionOption[] => [
  {id:"toalha-4",group:"Jogo de Toalha",packageLabel:"4 peças",size:"Jogo completo",customerPrice:400,resellerPrice:286,details:["2 toalhas de banho 70 cm × 1,40 m","2 toalhas de rosto 50 × 80 cm","100% algodão, 380 g/m²","Toque aveludado e aplique de renda em guipir"]},
  {id:"toalha-2",group:"Jogo de Toalha",packageLabel:"2 peças",size:"Jogo",customerPrice:200,resellerPrice:143,details:["1 toalha de banho 70 cm × 1,40 m","1 toalha de rosto 50 × 80 cm","100% algodão, 380 g/m²","Toque aveludado e aplique de renda em guipir"]},
  {id:"toalha-banho-1",group:"Jogo de Toalha",packageLabel:"1 peça",size:"Banho",customerPrice:138,resellerPrice:99,details:["1 toalha de banho 70 cm × 1,40 m","100% algodão, 380 g/m²","Toque aveludado e aplique de renda em guipir"]},
  {id:"toalha-rosto-1",group:"Jogo de Toalha",packageLabel:"1 peça",size:"Rosto",customerPrice:69,resellerPrice:49,details:["1 toalha de rosto 50 × 80 cm","100% algodão, 380 g/m²","Toque aveludado e aplique de renda em guipir"]}
];

const childModels = [["ursa-rosa","Ursa Rosa",84],["fadinha","Fadinha",84],["urso-azul","Urso Azul",85],["safari","Safari",85]] as const;
const childOptions = (): CollectionOption[] => [
  {id:"kit-7",group:"Kit Infantil",packageLabel:"7 peças",size:"Kit completo",customerPrice:378,resellerPrice:270,details:["1 edredom 1,40 × 1,00 m","1 cabeceira 60 × 40 cm","2 laterais 1,30 × 30 cm","1 lençol com elástico para colchão 1,30 × 0,70 m","1 fronha 38 × 28 cm","1 travesseiro 38 × 28 cm"]},
  {id:"lencol-2",group:"Kit Infantil",packageLabel:"2 peças",size:"Jogo de lençol",customerPrice:98,resellerPrice:70,details:["1 lençol com elástico para colchão 1,30 × 0,70 m","1 fronha 38 × 28 cm"]},
  {id:"edredom-1",group:"Kit Infantil",packageLabel:"1 peça",size:"Edredom",customerPrice:182,resellerPrice:130,details:["1 edredom 1,40 × 1,00 m"]}
];

const embroideredBathModels = [
  ["1010",51],["1020",51],["1030",51],["1040",51],["1050",52],["1060",52],["1070",52],["1080",52],["1090",52],["2000",52],
  ["2010",53],["2020",53],["2030",53],["2040",53],["2050",53],["2060",53]
] as const;
const printedBathModels = [
  ["010",54],["020",54],["030",54],["040",54],["050",55],["060",55],["070",55],["080",55],["090",55],["100",55],
  ["110",56],["120",56],["130",56],["140",56],["150",56],["160",56]
] as const;
const bathCatalogImages = [51,52,53,54,55,56].map((page) => `/products/banheiro-page-${page}-catalogo.png`);
const embroideredBathOptions = (): CollectionOption[] => [
  {id:"banheiro-3",group:"Jogo de Banheiro",packageLabel:"3 peças",size:"Jogo completo",customerPrice:221,resellerPrice:158,details:["1 tampa de vaso 44 × 50 cm","1 tapete meia-lua 54 × 46 cm, formato irregular","1 tapete retangular 84 × 54 cm"]},
  {id:"tampa-1",group:"Jogo de Banheiro",packageLabel:"1 peça",size:"Tampa de vaso",customerPrice:65,resellerPrice:46,details:["1 tampa de vaso 44 × 50 cm"]},
  {id:"meia-lua-1",group:"Jogo de Banheiro",packageLabel:"1 peça",size:"Tapete meia-lua",customerPrice:92,resellerPrice:66,details:["1 tapete meia-lua 54 × 46 cm, formato irregular"]},
  {id:"retangular-1",group:"Jogo de Banheiro",packageLabel:"1 peça",size:"Tapete retangular",customerPrice:92,resellerPrice:66,details:["1 tapete retangular 84 × 54 cm"]}
];
const printedBathOptions = (): CollectionOption[] => [{id:"banheiro-3",group:"Jogo de Banheiro",packageLabel:"3 peças",size:"Jogo completo",customerPrice:179,resellerPrice:128,details:["1 tampa de vaso 44 × 50 cm","1 tapete meia-lua 54 × 46 cm, formato irregular","1 tapete retangular 84 × 54 cm","Modelo vendido somente com as 3 peças"]}];

const curtainSizes = ["2,00 × 2,60 m", "3,00 × 2,60 m", "2,00 × 2,00 m"] as const;
const curtainDetails = [
  ["Cortina 2,00 × 2,60 m", "Indicada para varão de até 2,00 m de largura"],
  ["Cortina 3,00 × 2,60 m", "Indicada para varão de até 3,00 m de largura"],
  ["Cortina 2,00 × 2,00 m", "Indicada para varão de até 2,00 m de largura"],
];
const curtainOptions = (customer: PriceTriple, reseller: PriceTriple): CollectionOption[] => curtainSizes.map((size, index) => ({
  id: `cortina-${index}`, group: "Cortina", packageLabel: "1 peça", size,
  customerPrice: customer[index], resellerPrice: reseller[index],
  details: [...curtainDetails[index], "100% poliéster", "Opção para varão e trilho suíço"],
}));
const curtainModels = [
  ["valeria", "Valéria", 66, "Cinza e bege", "Cortina com xale em tela", [1209,1526,1176], [864,1090,840]],
  ["acacia", "Acácia", 67, "Única", "Cortina voil bordado com forro", [1047,1265,1019], [748,904,728]],
  ["celina", "Celina", 68, "Cinza e bege", "Blecaute 100% de vedação", [956,1365,891], [683,975,637]],
  ["giovana", "Giovana", 69, "Única", "Cortina voil bordado com forro", [1337,1701,1310], [955,1215,936]],
  ["marina", "Marina", 70, "Única", "Cortina voil com forro", [1101,1528,1073], [787,1092,767]],
  ["eliana", "Eliana", 71, "Única", "Cortina linho bordado com forro", [1101,1528,1073], [787,1092,767]],
  ["flavia", "Flávia", 72, "Única", "Cortina linho bordado com forro", [1101,1528,1073], [787,1092,767]],
  ["lilian", "Lilian", 73, "Única", "Cortina voil bordado com forro", [1386,1783,1383], [990,1274,988]],
  ["debora", "Débora", 74, "Única", "Cortina voil bordado com forro", [1115,1528,1070], [797,1092,767]],
  ["yolanda", "Yolanda", 75, "Branco e cinza", "Cortina voil bordado com forro", [994,1419,956], [710,1014,683]],
] as const;

const tableclothModels = ["Flor do Campo", "Pêra", "Colher", "Aurora", "Prata", "Limão", "Alecrim", "Turquesa", "Amora", "Xadrez", "Laço"] as const;
const tableclothSizes = ["2,20 × 1,40 m · 6 cadeiras", "2,50 × 1,40 m · 8 cadeiras", "3,20 × 1,40 m", "1,40 × 1,40 m · quadrada", "1,40 × 1,40 m · redonda"] as const;
const tableclothCustomer = [125, 161, 200, 105, 105] as const;
const tableclothReseller = [89, 115, 143, 75, 75] as const;
const tableclothOptions = (): CollectionOption[] => tableclothModels.flatMap((variant) => tableclothSizes.map((size, index) => ({
  id: `mesa-${variant.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")}-${index}`,
  group: "Toalha de Mesa" as const, packageLabel: "1 peça", size, variant,
  customerPrice: tableclothCustomer[index], resellerPrice: tableclothReseller[index],
  details: ["Toalha de mesa estampada", "Tecido Oxford 100% poliéster", "Estampa sublimática"],
})));
const printedKitchenModels = ["Naturalle", "Erva", "Expresso", "Trama", "Colher", "Plátano", "Pimenta", "Listrado", "Cassi", "Perça", "Trigo", "Abelha", "Prata", "Madeira", "Atenas", "Bon Appetit", "Prestige", "Nancy", "Pêssego"] as const;
const embroideredKitchenModels = ["Rubi", "Lana", "Tomate", "Avelã", "Flor", "Elise", "Isla", "Melancia"] as const;
const tableclothReferences = [["flor-do-campo","Flor do Campo",76],["pera","Pêra",76],["colher","Colher",76],["aurora","Aurora",76],["prata","Prata",76],["limao","Limão",77],["alecrim","Alecrim",77],["turquesa","Turquesa",77],["amora","Amora",77],["xadrez","Xadrez",77],["laco","Laço",77]] as const;
const printedKitchenReferences = [["naturalle","Naturalle",78],["erva","Erva",78],["expresso","Expresso",79],["trama","Trama",79],["colher-tapete","Colher",79],["platano","Plátano",79],["pimenta","Pimenta",79],["listrado","Listrado",79],["cassi","Cassi",80],["perca","Perça",80],["trigo","Trigo",80],["abelha","Abelha",80],["prata-tapete","Prata",80],["madeira","Madeira",81],["atenas","Atenas",81],["bon-appetit","Bon Appetit",81],["prestige","Prestige",81],["nancy","Nancy",81],["pessego","Pêssego",81]] as const;
const embroideredKitchenReferences = [["rubi","Rubi",82],["lana","Lana",82],["tomate","Tomate",83],["avela","Avelã",83],["flor-tapete","Flor",83],["elise","Elise",83],["isla","Isla",83],["melancia","Melancia",83]] as const;
const pillowReferences = [["palmeira","Palmeira",57,"Estampada"],["coqueiro","Coqueiro",57,"Estampada"],["petunia","Petúnia",58,"Estampada"],["nature","Nature",58,"Estampada"],["requinte","Requinte",58,"Estampada"],["royale","Royale",58,"Estampada"],["georgia","Georgia",59,"Estampada"],["pena","Pena",59,"Estampada"],["provence","Provence",59,"Estampada"],["mandala","Mandala",59,"Estampada"],["bellagio","Bellagio",60,"Estampada"],["village","Village",60,"Estampada"],["encanto","Encanto",60,"Estampada"],["paraty","Paraty",60,"Estampada"],["caminare","Caminare",61,"Estampada"],["silvestre","Silvestre",61,"Estampada"],["harmonia","Harmonia",61,"Estampada"],["erica","Érica",61,"Estampada"],["catena","Catena",62,"Bordada"],["torino","Torino",62,"Bordada"],["lira","Lira",62,"Bordada"],["mabel","Mabel",62,"Bordada"],["serenite","Serenite",63,"Bordada"],["deliz","Deliz",63,"Bordada"],["velluto","Velluto",63,"Bordada"],["cordelli","Cordelli",63,"Bordada"],["damier","Damier",64,"Bordada"],["olimpia","Olimpia",64,"Bordada"],["brisa","Brisa",64,"Bordada"],["pilar","Pilar",64,"Bordada"]] as const;
const pillowOptions = (): CollectionOption[] => [
  {id:"kit-4-com-refil",group:"Kit de Almofadas",packageLabel:"4 peças",size:"Com enchimento",customerPrice:392,resellerPrice:280,details:["4 capas de almofada 48 × 48 cm","4 refis 48 × 48 cm","Fibra siliconizada 100% poliéster, com enchimento removível"]},
  {id:"almofada-1-com-refil",group:"Kit de Almofadas",packageLabel:"1 peça",size:"Com enchimento",customerPrice:100,resellerPrice:72,details:["1 capa de almofada 48 × 48 cm","1 refil 48 × 48 cm","Fibra siliconizada 100% poliéster, com enchimento removível"]},
  {id:"almofada-1-sem-refil",group:"Kit de Almofadas",packageLabel:"1 peça",size:"Sem enchimento",customerPrice:71,resellerPrice:51,details:["1 capa de almofada 48 × 48 cm"]},
  {id:"kit-4-sem-refil",group:"Kit de Almofadas",packageLabel:"4 peças",size:"Sem enchimento",customerPrice:280,resellerPrice:200,details:["4 capas de almofada 48 × 48 cm"]},
];
const kitchenMatOptions = (models: readonly string[], customerPrice: number, resellerPrice: number): CollectionOption[] => models.map((variant) => ({
  id: `tapete-${variant.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/\\s+/g, "-")}`,
  group: "Tapete de Cozinha", packageLabel: "3 peças", size: "Jogo completo", variant,
  customerPrice, resellerPrice,
  details: ["1 tapete 0,50 × 1,55 m", "2 tapetes 0,50 × 0,80 m", "Base antiderrapante", "Lavável à máquina"],
}));

export const collections: Collection[] = [
  { slug:"karise", name:"Karise", page:5, image:"/products/karise-catalogo.png", color:"Creme e branco", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"180 fios — 80% algodão e 20% poliéster", options:options({...highCover,...sheetBlend,coverPieces:5,coverExtra:["2 porta-travesseiros 50 × 70 cm","2 almofadas 35 × 55 cm"]}) },
  { slug:"eloa", name:"Eloá", page:6, image:"/products/eloa-catalogo.png", color:"Rosê", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"200 fios — 100% algodão", options:options({coverCustomer:[728,783,837],coverReseller:[520,559,598],...sheetCotton,coverPieces:6,coverExtra:["4 porta-travesseiros 50 × 70 cm","1 almofada 35 × 55 cm"]}) },
  { slug:"serena", name:"Serena", page:7, image:"/products/serena-catalogo.png", color:"Creme", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"180 fios — 80% algodão e 20% poliéster", options:options({...highCover,...sheetBlend,coverPieces:5,coverExtra:["2 porta-travesseiros 50 × 70 cm","2 almofadas 35 × 55 cm"]}) },
  { slug:"marcela", name:"Marcela", page:8, image:"/products/marcela-catalogo.png", color:"Creme com verde menta", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"200 fios — 100% algodão", options:options({...highCover,...sheetCotton,coverPieces:5,coverExtra:["4 porta-travesseiros 50 × 70 cm"]}) },
  { slug:"capri", name:"Capri", page:9, image:"/products/capri-catalogo.png", color:"Cinza", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"200 fios — 100% algodão", options:options({...lowCover,...sheetCotton,coverPieces:5,coverExtra:["2 porta-travesseiros 50 × 70 cm","2 almofadas 35 × 55 cm"]}) },
  { slug:"barroco", name:"Barroco", page:10, image:"/products/barroco-catalogo.png", color:"Bege", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"200 fios — 100% algodão", options:options({...lowCover,...sheetCotton,coverPieces:5,coverExtra:["2 porta-travesseiros 50 × 70 cm","2 almofadas 35 × 55 cm"]}) },
  { slug:"azurre", name:"Azurre", page:11, image:"/products/azurre-catalogo.png", color:"Bege", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"180 fios — 80% algodão e 20% poliéster", options:options({...lowCover,...sheetCotton,coverPieces:4,coverExtra:["2 porta-travesseiros 50 × 70 cm","1 almofada 35 × 65 cm"]}) },
  { slug:"prisma", name:"Prisma", page:12, image:"/products/prisma-catalogo.png", color:"Verde menta", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Conforme página 12 do catálogo", options:options({...lowCover,...sheetCotton,coverPieces:5,coverExtra:["4 porta-travesseiros 50 × 70 cm"]}) },
  { slug:"mavie", name:"Mavie", page:13, image:"/products/mavie-catalogo.png", color:"Bege e rosê", coverFabric:"Micropercal 200 fios — 100% poliéster (120 g)", sheetFabric:"180 fios — 80% algodão e 20% poliéster", options:options({...lowCover,...sheetBlend,coverPieces:5,coverExtra:["4 porta-travesseiros 50 × 70 cm"]}) },
  { slug:"loreta", name:"Loreta", page:14, image:"/products/loreta-catalogo.png", color:"Creme", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"180 fios — 80% algodão e 20% poliéster", options:options({...highCover,...sheetBlend,coverPieces:5,coverExtra:["4 porta-travesseiros 50 × 70 cm"]}) },
  { slug:"melina", name:"Melina", page:15, image:"/products/melina-catalogo.png", color:"Branco e creme", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"200 fios — 100% algodão", options:options({...highCover,...sheetCotton,coverPieces:5,coverExtra:["4 porta-travesseiros 50 × 70 cm"]}) },
  { slug:"topazio", name:"Topázio", page:16, image:"/products/topazio-catalogo.png", color:"Creme off", coverFabric:"Percal 200 fios — 100% algodão; enchimento 100% poliéster", sheetFabric:"Percal 200 fios — 100% algodão", options:options({coverPieces:5,coverCustomer:[946,1101,1055],coverReseller:[676,715,754],reducedCustomer:[800,855,910],reducedReseller:[572,611,650],...sheetCotton,coverExtra:["2 porta-travesseiros 50 × 70 cm","2 almofadas 35 × 55 cm"]}) },
  { slug:"paris", name:"Paris", page:17, image:"/products/paris-catalogo.png", color:"Creme", coverFabric:"Percal 200 fios — 100% algodão; enchimento 100% poliéster", sheetFabric:"Percal 200 fios — 100% algodão", options:options({coverPieces:5,coverCustomer:[946,1101,1055],coverReseller:[676,715,754],reducedCustomer:[800,855,910],reducedReseller:[572,611,650],...sheetCotton,coverExtra:["2 porta-travesseiros 50 × 70 cm","2 almofadas 35 × 55 cm"]}) },
  { slug:"jamaica", name:"Jamaica", page:18, image:"/products/jamaica-catalogo.png", color:"Creme", coverFabric:"Percal 200 fios — 100% algodão; enchimento 100% poliéster", sheetFabric:"Percal 200 fios — 100% algodão", options:options({coverPieces:5,coverCustomer:[946,1101,1055],coverReseller:[676,715,754],reducedCustomer:[800,855,910],reducedReseller:[572,611,650],...sheetCotton,coverExtra:["2 porta-travesseiros 50 × 70 cm","2 almofadas 35 × 55 cm"]}) },
  { slug:"valencia", name:"Valência", page:19, image:"/products/valencia-catalogo.png", color:"Creme, rosê e cinza", coverFabric:"Percal 400 fios — 100% algodão; enchimento manta 120 g", sheetFabric:"Percal 400 fios — 100% algodão", options:options({coverPieces:3,coverCustomer:[1073,1128,1183],coverReseller:[767,806,845],sheetCustomer:[847,902,956],sheetReseller:[605,644,683],coverExtra:["2 porta-travesseiros 50 × 70 cm"],includeTowel:false}) },
  { slug:"orquidea", name:"Orquídea", page:20, image:"/products/orquidea-catalogo.png", color:"Creme", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Percal 200 fios — 100% algodão", options:options({coverPieces:5,coverCustomer:[819,865,901],coverReseller:[585,618,644],reducedCustomer:[618,673,710],reducedReseller:[442,481,507],...sheetCotton,coverExtra:["2 porta-travesseiros 50 × 70 cm","2 almofadas 35 × 55 cm"]}) },
  { slug:"barcelona", name:"Barcelona", page:21, image:"/products/barcelona-catalogo.png", color:"Cinza e creme", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Percal 200 fios — 100% algodão", options:options({coverPieces:5,coverCustomer:[714,765,819],coverReseller:[510,546,585],reducedCustomer:[602,655,714],reducedReseller:[430,468,510],...sheetCotton,coverExtra:["2 porta-travesseiros 50 × 70 cm","2 almofadas 35 × 55 cm"]}) },
  { slug:"zoe", name:"Zoe", page:22, image:"/products/zoe-catalogo.png", color:"Creme e bege", coverFabric:"Micropercal 180 fios — 100% poliéster (95 g); enchimento 100% poliéster", sheetFabric:"Percal 200 fios — 100% algodão", options:options({coverPieces:3,coverCustomer:[655,710,765],coverReseller:[468,507,546],...sheetCotton,coverExtra:["2 porta-travesseiros 50 × 70 cm"]}) },
  { slug:"amelia", name:"Amélia", page:23, image:"/products/amelia-catalogo.png", color:"Creme", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Percal 200 fios — 100% algodão", options:options({coverPieces:3,coverCustomer:[655,710,765],coverReseller:[468,507,546],...sheetCotton,coverExtra:["2 porta-travesseiros 50 × 70 cm"]}) },
  { slug:"maria", name:"Maria", page:24, image:"/products/maria-catalogo.png", extraImages:["/products/maria-cores-catalogo.png"], color:"Chumbo, verde, rosê, creme e bege", coverFabric:"Micropercal 180 fios — 100% poliéster (95 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster", options:[
    ...options({coverPieces:3,coverCustomer:[366,406,448],coverReseller:[262,290,320],sheetCustomer:[294,315,336],sheetReseller:[210,225,240],coverExtra:["2 porta-travesseiros 50 × 70 cm"],includeTowel:false}),
    ...sizes.map((size,index) => ({id:`lencol-3-${index}`,group:"Jogo de Lençol" as const,packageLabel:"3 peças",size,customerPrice:[210,231,259][index],resellerPrice:[150,165,185][index],details:[sheetDetails[index][1],"2 fronhas 70 × 50 cm"]})),
    {id:"cobre-solteiro-2",group:"Cobre Leito",packageLabel:"2 peças",size:"Solteiro",customerPrice:294,resellerPrice:210,details:["1 cobre-leito solteiro","1 porta-travesseiro"]},
    {id:"lencol-solteiro-3",group:"Jogo de Lençol",packageLabel:"3 peças",size:"Solteiro",customerPrice:175,resellerPrice:125,details:["Jogo de lençol solteiro com 3 peças"]},
    {id:"lencol-solteiro-2",group:"Jogo de Lençol",packageLabel:"2 peças",size:"Solteiro",customerPrice:133,resellerPrice:95,details:["Jogo de lençol solteiro com 2 peças"]}
  ] },
  { slug:"carol", name:"Carol", page:26, image:"/products/carol-catalogo.png", color:"Cinza e bege", coverFabric:"Micropercal 200 fios — 100% poliéster (120 g)", sheetFabric:"180 fios — 80% algodão e 20% poliéster", options:options({coverPieces:3,coverCustomer:[420,434,455],coverReseller:[300,310,325],sheetCustomer:[420,434,455],sheetReseller:[300,310,325],coverExtra:["2 porta-travesseiros 50 × 70 cm"],includeTowel:false}) },
  { slug:"america", name:"América", page:27, image:"/products/america-catalogo.png", color:"Bege, rosa e cinza", coverFabric:"Flannel — 100% poliéster; enchimento manta 100 g", sheetFabric:"Flannel — 100% poliéster", priceOnRequest:true, options:options({coverPieces:5,coverCustomer:[0,0,0],coverReseller:[0,0,0],sheetCustomer:[0,0,0],sheetReseller:[0,0,0],coverExtra:["2 porta-travesseiros 50 × 70 cm","2 almofadas 35 × 55 cm"],includeTowel:false}) },
  { slug:"malha", name:"Malha", page:28, image:"/products/malha-catalogo.png", extraImages:["/products/malha-referencias-catalogo.png"], color:"Estampas e cores sortidas", coverFabric:"Malha — 100% algodão; enchimento 100% poliéster", sheetFabric:"Malha — 100% algodão", options:[
    {id:"cobre-3-0",group:"Cobre Leito",packageLabel:"3 peças",size:"Casal",customerPrice:700,resellerPrice:500,details:["1 cobre-leito 2,40 × 2,40 m","2 porta-travesseiros 50 × 70 cm"]},
    {id:"cobre-3-1",group:"Cobre Leito",packageLabel:"3 peças",size:"Queen",customerPrice:728,resellerPrice:520,details:["1 cobre-leito 2,70 × 2,55 m","2 porta-travesseiros 50 × 70 cm"]},
    {id:"cobre-3-2",group:"Cobre Leito",packageLabel:"3 peças",size:"Super King",customerPrice:791,resellerPrice:565,details:["1 cobre-leito 3,15 × 2,70 m","2 porta-travesseiros 50 × 70 cm"]},
    {id:"cobre-solteiro-2",group:"Cobre Leito",packageLabel:"2 peças",size:"Solteiro",customerPrice:537,resellerPrice:384,details:["1 cobre-leito 1,85 × 2,40 m","1 porta-travesseiro 50 × 70 cm"]},
    ...sizes.flatMap((size,index) => [{id:`lencol-4-${index}`,group:"Jogo de Lençol" as const,packageLabel:"4 peças",size,customerPrice:[455,497,546][index],resellerPrice:[325,355,390][index],details:sheetDetails[index]},{id:`lencol-3-${index}`,group:"Jogo de Lençol" as const,packageLabel:"3 peças",size,customerPrice:[273,294,350][index],resellerPrice:[195,210,250][index],details:[sheetDetails[index][1],"2 fronhas 70 × 50 cm"]}]),
    {id:"lencol-solteiro-3",group:"Jogo de Lençol",packageLabel:"3 peças",size:"Solteiro",customerPrice:287,resellerPrice:205,details:["Jogo de lençol solteiro em malha com 3 peças"]},
    {id:"lencol-solteiro-2",group:"Jogo de Lençol",packageLabel:"2 peças",size:"Solteiro",customerPrice:209,resellerPrice:149,details:["1 lençol de baixo com elástico","1 fronha 70 × 50 cm"]}
  ] },
  { slug:"tulipa", name:"Tulipa", page:30, image:"/products/tulipa-catalogo.png", color:"Única", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster, liso e sem bordado", options:printedOptions() },
  { slug:"tropical", name:"Tropical", page:31, image:"/products/tropical-catalogo.png", color:"Única", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster, liso e sem bordado", options:printedOptions() },
  { slug:"pietra", name:"Pietra", page:32, image:"/products/pietra-catalogo.png", color:"Única", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster, liso e sem bordado", options:printedOptions() },
  { slug:"rosy", name:"Rosy", page:33, image:"/products/rosy-catalogo.png", color:"Única", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster, liso e sem bordado", options:printedOptions() },
  { slug:"montana", name:"Montana", page:34, image:"/products/montana-catalogo.png", color:"Única", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster, liso e sem bordado", options:printedOptions() },
  { slug:"paula", name:"Paula", page:35, image:"/products/paula-catalogo.png", color:"Única", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster, liso e sem bordado", options:printedOptions() },
  { slug:"londres", name:"Londres", page:36, image:"/products/londres-catalogo.png", color:"Única", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster, liso e sem bordado", options:printedOptions() },
  { slug:"ancora", name:"Âncora", page:37, image:"/products/ancora-catalogo.png", color:"Única", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster, liso e sem bordado", options:printedOptions() },
  { slug:"oceano", name:"Oceano", page:38, image:"/products/oceano-catalogo.png", color:"Única", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster, liso e sem bordado", options:printedOptions() },
  { slug:"canil", name:"Canil", page:39, image:"/products/canil-catalogo.png", color:"Azul e rosa", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster, liso e sem bordado", options:printedOptions() },
  { slug:"bale", name:"Balé", page:40, image:"/products/bale-catalogo.png", color:"Única", coverFabric:"Hipercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Micropercal 180 fios — 100% poliéster", options:[
    ...options({coverPieces:4,coverCustomer:[564,619,673],coverReseller:[403,442,481],sheetCustomer:[210,231,259],sheetReseller:[150,165,185],coverExtra:["2 porta-travesseiros 50 × 70 cm","1 almofada 45 × 45 cm"],includeTowel:false}).filter(option => option.group === "Cobre Leito" || option.packageLabel === "4 peças").map(option => option.group === "Jogo de Lençol" ? {...option,packageLabel:"3 peças",details:[option.details[1],"2 fronhas 70 × 50 cm"]} : option),
    {id:"cobre-solteiro-3",group:"Cobre Leito",packageLabel:"3 peças",size:"Solteiro",customerPrice:436,resellerPrice:312,details:["1 cobre-leito 1,85 × 2,40 m","1 porta-travesseiro 50 × 70 cm","1 almofada 45 × 45 cm"]}
  ] },
  { slug:"estela", name:"Estela", page:41, image:"/products/estela-catalogo.png", color:"Única", coverFabric:"Micropercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Não disponível nesta linha", options:[
    ...sizes.map((size,index) => ({id:`cobre-6-${index}`,group:"Cobre Leito" as const,packageLabel:"6 peças",size,customerPrice:[527,582,637][index],resellerPrice:[377,416,455][index],details:[coverMeasures[index],"4 porta-travesseiros 50 × 70 cm","1 almofada 45 × 45 cm"]})),
    {id:"cobre-solteiro-4",group:"Cobre Leito",packageLabel:"4 peças",size:"Solteiro",customerPrice:437,resellerPrice:312,details:["1 cobre-leito 1,85 × 2,40 m","2 porta-travesseiros 50 × 70 cm","1 almofada 45 × 45 cm"]}
  ] },
  { slug:"escocia", name:"Escócia", page:42, image:"/products/escocia-catalogo.png", color:"Única", coverFabric:"Micropercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Não disponível nesta linha", options:[...sizes.map((size,index) => ({id:`cobre-5-${index}`,group:"Cobre Leito" as const,packageLabel:"5 peças",size,customerPrice:[527,564,619][index],resellerPrice:[377,403,442][index],details:[coverMeasures[index],"4 porta-travesseiros 50 × 70 cm"]})),{id:"cobre-solteiro-3",group:"Cobre Leito",packageLabel:"3 peças",size:"Solteiro",customerPrice:328,resellerPrice:234,details:["1 cobre-leito 1,85 × 2,40 m","2 porta-travesseiros 50 × 70 cm"]}] },
  { slug:"celeiro", name:"Celeiro", page:43, image:"/products/celeiro-catalogo.png", color:"Única", coverFabric:"Micropercal 200 fios — 100% poliéster (120 g)", sheetFabric:"Não disponível nesta linha", options:[...sizes.map((size,index) => ({id:`cobre-5-${index}`,group:"Cobre Leito" as const,packageLabel:"5 peças",size,customerPrice:[527,564,619][index],resellerPrice:[377,403,442][index],details:[coverMeasures[index],"4 porta-travesseiros 50 × 70 cm"]})),{id:"cobre-solteiro-3",group:"Cobre Leito",packageLabel:"3 peças",size:"Solteiro",customerPrice:328,resellerPrice:234,details:["1 cobre-leito 1,85 × 2,40 m","2 porta-travesseiros 50 × 70 cm"]}] },
  { slug:"luiza", name:"Luiza", page:44, image:"/products/luiza-catalogo.png", color:"Verde, caramelo, rosa e creme com vermelho", coverFabric:"Microfibra — 100% poliéster", sheetFabric:"Não disponível nesta linha", options:[...sizes.map((size,index) => ({id:`colcha-5-${index}`,group:"Cobre Leito" as const,packageLabel:"5 peças",size,customerPrice:[527,564,619][index],resellerPrice:[377,403,442][index],details:[`1 colcha ${coverMeasures[index].replace("1 cobre-leito ","")}`,"2 porta-travesseiros 50 × 70 cm","2 almofadas"]})),...sizes.map((size,index) => ({id:`colcha-3-${index}`,group:"Cobre Leito" as const,packageLabel:"3 peças",size,customerPrice:[455,497,528][index],resellerPrice:[325,355,377][index],details:[`1 colcha ${coverMeasures[index].replace("1 cobre-leito ","")}`,"2 porta-travesseiros 50 × 70 cm"]}))] },
  ...sheetModels.map((model): Collection => ({slug:model.slug,name:model.name,page:model.page,image:model.image,extraImages:["/products/lencois-bordados-catalogo.png","/products/lencois-bordados-modelos-catalogo.png"],color:"Conforme o modelo selecionado",coverFabric:"Não se aplica",sheetFabric:"180 fios — 80% algodão e 20% poliéster",options:embroideredSheetOptions()})),
  ...towelModels.map(([slug,name,page]): Collection => ({slug:`toalha-${slug}`,name:`Toalha ${name}`,page,image:`/products/toalhas/${slug}.png`,extraImages:[47,48,49,50].map((catalogPage) => `/products/toalhas-page-${catalogPage}-catalogo.png`),color:"Conforme o modelo",coverFabric:"Não se aplica",sheetFabric:"100% algodão, 380 g/m², toque aveludado e aplique de renda em guipir",options:towelOptions()})),
  ...childModels.map(([slug,name,page]): Collection => ({slug:`infantil-${slug}`,name:`Kit Bebê ${name}`,page,image:`/products/infantil/${slug}.png`,extraImages:["/products/infantil-page-84-catalogo.png","/products/infantil-page-85-catalogo.png"],color:"Conforme o modelo",coverFabric:"Micropercal 200 fios — 100% poliéster; enchimento 100% poliéster",sheetFabric:"Micropercal 200 fios — 100% poliéster",options:childOptions()})),
  ...embroideredBathModels.map(([reference,page]): Collection => ({slug:`banheiro-bordado-${reference}`,name:`Banheiro Bordado Ref. ${reference}`,page,image:`/products/banheiro/bordado-${reference}.png`,extraImages:bathCatalogImages,color:"Conforme a referência",coverFabric:"Tecido superior em veludo 100% poliéster; base 100% poliéster antiderrapante",sheetFabric:"Não se aplica",options:embroideredBathOptions()})),
  ...printedBathModels.map(([reference,page]): Collection => ({slug:`banheiro-estampado-${reference}`,name:`Banheiro Estampado Ref. ${reference}`,page,image:`/products/banheiro/estampado-${reference}.png`,extraImages:bathCatalogImages,color:"Conforme a referência",coverFabric:"Tecido superior em veludo 100% poliéster; base 100% poliéster antiderrapante",sheetFabric:"Não se aplica",options:printedBathOptions()})),
  ...curtainModels.map(([slug,name,page,color,fabric,customer,reseller]): Collection => ({slug:`cortina-${slug}`,name:`Cortina ${name}`,page,image:`/products/cortinas/${slug}.png`,extraImages:[`/products/cortinas/page-${page}-catalogo.png`],color,coverFabric:fabric,sheetFabric:"Não se aplica",options:curtainOptions(customer,reseller)})),
  ...tableclothReferences.map(([slug,name,page]): Collection => ({slug:`cozinha-mesa-${slug}`,name:`Toalha de Mesa ${name}`,page,image:`/products/cozinha/referencias/${slug}.png`,extraImages:[`/products/cozinha/page-${page}-catalogo.png`],color:"Conforme o modelo",coverFabric:"Oxford 100% poliéster",sheetFabric:"Não se aplica",options:tableclothOptions().filter((option) => option.variant === name)})),
  ...printedKitchenReferences.map(([slug,name,page]): Collection => ({slug:`cozinha-tapete-estampado-${slug}`,name:`Tapete Cozinha ${name}`,page,image:`/products/cozinha/referencias/${slug}.png`,extraImages:[`/products/cozinha/page-${page}-catalogo.png`],color:"Conforme o modelo",coverFabric:"Veludo 100% poliéster; base 100% poliéster antiderrapante",sheetFabric:"Não se aplica",options:kitchenMatOptions([name],265,189)})),
  ...embroideredKitchenReferences.map(([slug,name,page]): Collection => ({slug:`cozinha-tapete-bordado-${slug}`,name:`Tapete Cozinha ${name}`,page,image:`/products/cozinha/referencias/${slug}.png`,extraImages:[`/products/cozinha/page-${page}-catalogo.png`],color:"Conforme o modelo",coverFabric:"Veludo 100% poliéster; base 100% poliéster antiderrapante",sheetFabric:"Não se aplica",options:kitchenMatOptions([name],291,208)})),
  ...pillowReferences.map(([slug,name,page,type]): Collection => ({slug:`almofada-${slug}`,name:`Almofada ${name}`,page,image:`/products/almofadas/${slug}.png`,extraImages:[`/products/almofadas/page-${page}-catalogo.png`],color:"Conforme o modelo",coverFabric:`Almofada ${type.toLowerCase()} em linho e veludo 100% poliéster`,sheetFabric:"Não se aplica",options:pillowOptions()})),
];

export function getCollection(slug: string) { return collections.find((collection) => collection.slug === slug); }
