import type { Product } from "@/types/product";

const category = (name: string) => name as Product["category"];

const towelModels = [
  ["alasca","Alasca"],["cibele","Cibele"],["cristal","Cristal"],["verona","Verona"],["bella","Bella"],["melina","Melina"],
  ["marilu","Marilu"],["bianca","Bianca"],["serena","Serena"],["muriel","Muriel"],["zoe","Zoe"],["naomi","Naomi"],
  ["karise","Karise"],["alice","Alice"],["prisma","Prisma"],["topazio","Topázio"],["mavie","Mavie"],["azure","Azure"],
  ["loreta","Loreta"],["iris","Íris"],["helena","Helena"],["lenita","Lenita"],["sandy","Sandy"],["veneza","Veneza"]
] as const;

const towelProducts: Product[] = towelModels.map(([slug,name]) => ({id:`collection-toalha-${slug}`,name:`Toalha ${name}`,description:"Jogo de toalhas bordadas em algodão, com toque aveludado e aplique de renda em guipir.",price:400,wholesalePrice:286,image:`/products/toalhas/${slug}.png`,url:`/produto/toalha-${slug}`,category:category("Toalhas"),rating:5}));

const childModels = [["ursa-rosa","Ursa Rosa"],["fadinha","Fadinha"],["urso-azul","Urso Azul"],["safari","Safari"]] as const;
const childProducts: Product[] = childModels.map(([slug,name]) => ({id:`collection-infantil-${slug}`,name:`Kit Bebê ${name}`,description:"Kit infantil em micropercal 200 fios, com opções de conjunto completo, jogo de lençol e edredom.",price:378,wholesalePrice:270,image:`/products/infantil/${slug}.png`,url:`/produto/infantil-${slug}`,category:"Infantil",rating:5}));

const embroideredBathRefs = ["1010","1020","1030","1040","1050","1060","1070","1080","1090","2000","2010","2020","2030","2040","2050","2060"];
const printedBathRefs = ["010","020","030","040","050","060","070","080","090","100","110","120","130","140","150","160"];
const bathProducts: Product[] = [
  ...embroideredBathRefs.map((reference): Product => ({id:`collection-banheiro-bordado-${reference}`,name:`Banheiro Bordado Ref. ${reference}`,description:"Jogo de banheiro bordado com base antiderrapante, lavável à máquina e disponível também em peças avulsas.",price:221,wholesalePrice:158,image:`/products/banheiro/bordado-${reference}.png`,url:`/produto/banheiro-bordado-${reference}`,category:category("Banheiro"),rating:5})),
  ...printedBathRefs.map((reference): Product => ({id:`collection-banheiro-estampado-${reference}`,name:`Banheiro Estampado Ref. ${reference}`,description:"Jogo de banheiro estampado com três peças e base antiderrapante.",price:179,wholesalePrice:128,image:`/products/banheiro/estampado-${reference}.png`,url:`/produto/banheiro-estampado-${reference}`,category:category("Banheiro"),rating:5}))
];

const curtainModels = [
  ["valeria", "Valéria", 1209, 864], ["acacia", "Acácia", 1047, 748], ["celina", "Celina", 956, 683],
  ["giovana", "Giovana", 1337, 955], ["marina", "Marina", 1101, 787], ["eliana", "Eliana", 1101, 787],
  ["flavia", "Flávia", 1101, 787], ["lilian", "Lilian", 1386, 990], ["debora", "Débora", 1115, 797],
  ["yolanda", "Yolanda", 994, 710],
] as const;
const curtainProducts: Product[] = curtainModels.map(([slug, name, price, wholesalePrice]) => ({
  id: `collection-cortina-${slug}`, name: `Cortina ${name}`,
  description: "Cortina sob medida em três opções, com varão ou trilho suíço conforme o modelo.",
  price, wholesalePrice, image: `/products/cortinas/${slug}.png`, url: `/produto/cortina-${slug}`,
  category: category("Cortinas"), rating: 5,
}));

const kitchenProducts: Product[] = [
  ...[["flor-do-campo","Flor do Campo",76],["pera","Pêra",76],["colher","Colher",76],["aurora","Aurora",76],["prata","Prata",76],["limao","Limão",77],["alecrim","Alecrim",77],["turquesa","Turquesa",77],["amora","Amora",77],["xadrez","Xadrez",77],["laco","Laço",77]].map(([slug,name]) => ({id:`cozinha-mesa-${slug}`,name:`Toalha de Mesa ${name}`,description:"Toalha estampada em Oxford 100% poliéster.",price:125,wholesalePrice:89,image:`/products/cozinha/referencias/${slug}.png`,url:`/produto/cozinha-mesa-${slug}`,category:category("Cozinha"),rating:5})),
  ...[["naturalle","Naturalle"],["erva","Erva"],["expresso","Expresso"],["trama","Trama"],["colher-tapete","Colher"],["platano","Plátano"],["pimenta","Pimenta"],["listrado","Listrado"],["cassi","Cassi"],["perca","Perça"],["trigo","Trigo"],["abelha","Abelha"],["prata-tapete","Prata"],["madeira","Madeira"],["atenas","Atenas"],["bon-appetit","Bon Appetit"],["prestige","Prestige"],["nancy","Nancy"],["pessego","Pêssego"]].map(([slug,name]) => ({id:`cozinha-tapete-estampado-${slug}`,name:`Tapete Cozinha ${name}`,description:"Jogo estampado com três tapetes e base antiderrapante.",price:265,wholesalePrice:189,image:`/products/cozinha/referencias/${slug}.png`,url:`/produto/cozinha-tapete-estampado-${slug}`,category:category("Cozinha"),rating:5})),
  ...[["rubi","Rubi"],["lana","Lana"],["tomate","Tomate"],["avela","Avelã"],["flor-tapete","Flor"],["elise","Elise"],["isla","Isla"],["melancia","Melancia"]].map(([slug,name]) => ({id:`cozinha-tapete-bordado-${slug}`,name:`Tapete Cozinha ${name}`,description:"Jogo bordado com três tapetes e base antiderrapante.",price:291,wholesalePrice:208,image:`/products/cozinha/referencias/${slug}.png`,url:`/produto/cozinha-tapete-bordado-${slug}`,category:category("Cozinha"),rating:5})),
];

const pillowProducts: Product[] = [
  ["palmeira","Palmeira"],["coqueiro","Coqueiro"],["petunia","Petúnia"],["nature","Nature"],["requinte","Requinte"],["royale","Royale"],["georgia","Georgia"],["pena","Pena"],["provence","Provence"],["mandala","Mandala"],["bellagio","Bellagio"],["village","Village"],["encanto","Encanto"],["paraty","Paraty"],["caminare","Caminare"],["silvestre","Silvestre"],["harmonia","Harmonia"],["erica","Érica"],["catena","Catena"],["torino","Torino"],["lira","Lira"],["mabel","Mabel"],["serenite","Serenite"],["deliz","Deliz"],["velluto","Velluto"],["cordelli","Cordelli"],["damier","Damier"],["olimpia","Olimpia"],["brisa","Brisa"],["pilar","Pilar"]].map(([slug,name]) => ({id:`almofada-${slug}`,name:`Almofada ${name}`,description:"Kit de almofadas para sofá, em linho e veludo, com enchimento removível.",price:392,wholesalePrice:280,image:`/products/almofadas/${slug}.png`,url:`/produto/almofada-${slug}`,category:category("Almofadas"),rating:5}));

// Seleção inicial conferida nas listas oficiais 2026 de cliente e revendedor.
export const talitaProducts: Product[] = [
  { id: "alice-cobre-leito", name: "Linha Alice", description: "Coleção Alice", price: 765, wholesalePrice: 546, image: "/products/alice-catalogo.png", url: "/produto/alice", category: "Cobre Leito", rating: 5, isDailyTip: true },
  { id: "collection-karise", name: "Linha Karise", description: "Coleção Karise", price: 765, wholesalePrice: 546, image: "/products/karise-catalogo.png", url: "/produto/karise", category: "Cobre Leito", rating: 5 },
  { id: "collection-eloa", name: "Linha Eloá", description: "Coleção Eloá", price: 728, wholesalePrice: 520, image: "/products/eloa-catalogo.png", url: "/produto/eloa", category: "Cobre Leito", rating: 5 },
  { id: "collection-serena", name: "Linha Serena", description: "Coleção Serena", price: 765, wholesalePrice: 546, image: "/products/serena-catalogo.png", url: "/produto/serena", category: "Cobre Leito", rating: 5 },
  { id: "collection-marcela", name: "Linha Marcela", description: "Coleção Marcela", price: 765, wholesalePrice: 546, image: "/products/marcela-catalogo.png", url: "/produto/marcela", category: "Cobre Leito", rating: 5 },
  { id: "collection-capri", name: "Linha Capri", description: "Coleção Capri", price: 692, wholesalePrice: 494, image: "/products/capri-catalogo.png", url: "/produto/capri", category: "Cobre Leito", rating: 5 },
  { id: "collection-barroco", name: "Linha Barroco", description: "Coleção Barroco", price: 692, wholesalePrice: 494, image: "/products/barroco-catalogo.png", url: "/produto/barroco", category: "Cobre Leito", rating: 5 },
  { id: "collection-azurre", name: "Linha Azurre", description: "Coleção Azurre", price: 692, wholesalePrice: 494, image: "/products/azurre-catalogo.png", url: "/produto/azurre", category: "Cobre Leito", rating: 5 },
  { id: "collection-prisma", name: "Linha Prisma", description: "Coleção Prisma", price: 692, wholesalePrice: 494, image: "/products/prisma-catalogo.png", url: "/produto/prisma", category: "Cobre Leito", rating: 5 },
  { id: "collection-mavie", name: "Linha Mavie", description: "Coleção Mavie", price: 692, wholesalePrice: 494, image: "/products/mavie-catalogo.png", url: "/produto/mavie", category: "Cobre Leito", rating: 5 },
  { id: "collection-loreta", name: "Linha Loreta", description: "Coleção Loreta", price: 765, wholesalePrice: 546, image: "/products/loreta-catalogo.png", url: "/produto/loreta", category: "Cobre Leito", rating: 5 },
  { id: "collection-melina", name: "Linha Melina", description: "Coleção Melina", price: 765, wholesalePrice: 546, image: "/products/melina-catalogo.png", url: "/produto/melina", category: "Cobre Leito", rating: 5 },
  { id: "collection-topazio", name: "Linha Topázio", description: "Coleção Topázio", price: 946, wholesalePrice: 676, image: "/products/topazio-catalogo.png", url: "/produto/topazio", category: "Cobre Leito", rating: 5 },
  { id: "collection-paris", name: "Linha Paris", description: "Coleção Paris", price: 946, wholesalePrice: 676, image: "/products/paris-catalogo.png", url: "/produto/paris", category: "Cobre Leito", rating: 5 },
  { id: "collection-jamaica", name: "Linha Jamaica", description: "Coleção Jamaica", price: 946, wholesalePrice: 676, image: "/products/jamaica-catalogo.png", url: "/produto/jamaica", category: "Cobre Leito", rating: 5 },
  { id: "collection-valencia", name: "Linha Valência", description: "Coleção Valência", price: 1073, wholesalePrice: 767, image: "/products/valencia-catalogo.png", url: "/produto/valencia", category: "Cobre Leito", rating: 5 },
  { id: "collection-orquidea", name: "Linha Orquídea", description: "Coleção Orquídea", price: 819, wholesalePrice: 585, image: "/products/orquidea-catalogo.png", url: "/produto/orquidea", category: "Cobre Leito", rating: 5 },
  { id: "collection-barcelona", name: "Linha Barcelona", description: "Coleção Barcelona", price: 714, wholesalePrice: 510, image: "/products/barcelona-catalogo.png", url: "/produto/barcelona", category: "Cobre Leito", rating: 5 },
  { id: "collection-zoe", name: "Linha Zoe", description: "Coleção Zoe", price: 655, wholesalePrice: 468, image: "/products/zoe-catalogo.png", url: "/produto/zoe", category: "Cobre Leito", rating: 5 },
  { id: "collection-amelia", name: "Linha Amélia", description: "Coleção Amélia", price: 655, wholesalePrice: 468, image: "/products/amelia-catalogo.png", url: "/produto/amelia", category: "Cobre Leito", rating: 5 },
  { id: "collection-maria", name: "Linha Maria", description: "Coleção Maria", price: 366, wholesalePrice: 262, image: "/products/maria-catalogo.png", url: "/produto/maria", category: "Cobre Leito", rating: 5 },
  { id: "collection-carol", name: "Linha Carol", description: "Coleção Carol", price: 420, wholesalePrice: 300, image: "/products/carol-catalogo.png", url: "/produto/carol", category: "Cobre Leito", rating: 5 },
  { id: "collection-america", name: "Linha América", description: "Valores sob consulta", price: 0, wholesalePrice: 0, image: "/products/america-catalogo.png", url: "/produto/america", category: "Cobre Leito", rating: 5 },
  { id: "collection-malha", name: "Linha Malha", description: "Coleção Malha", price: 700, wholesalePrice: 500, image: "/products/malha-catalogo.png", url: "/produto/malha", category: "Cobre Leito", rating: 5 },
  { id: "collection-tulipa", name: "Linha Tulipa", description: "Coleção Tulipa", price: 528, wholesalePrice: 377, image: "/products/tulipa-catalogo.png", url: "/produto/tulipa", category: "Cobre Leito", rating: 5 },
  { id: "collection-tropical", name: "Linha Tropical", description: "Coleção Tropical", price: 528, wholesalePrice: 377, image: "/products/tropical-catalogo.png", url: "/produto/tropical", category: "Cobre Leito", rating: 5 },
  { id: "collection-pietra", name: "Linha Pietra", description: "Coleção Pietra", price: 528, wholesalePrice: 377, image: "/products/pietra-catalogo.png", url: "/produto/pietra", category: "Cobre Leito", rating: 5 },
  { id: "collection-rosy", name: "Linha Rosy", description: "Coleção Rosy", price: 528, wholesalePrice: 377, image: "/products/rosy-catalogo.png", url: "/produto/rosy", category: "Cobre Leito", rating: 5 },
  { id: "collection-montana", name: "Linha Montana", description: "Coleção Montana", price: 528, wholesalePrice: 377, image: "/products/montana-catalogo.png", url: "/produto/montana", category: "Cobre Leito", rating: 5 },
  { id: "collection-paula", name: "Linha Paula", description: "Coleção Paula", price: 528, wholesalePrice: 377, image: "/products/paula-catalogo.png", url: "/produto/paula", category: "Cobre Leito", rating: 5 },
  { id: "collection-londres", name: "Linha Londres", description: "Coleção Londres", price: 528, wholesalePrice: 377, image: "/products/londres-catalogo.png", url: "/produto/londres", category: "Cobre Leito", rating: 5 },
  { id: "collection-ancora", name: "Linha Âncora", description: "Coleção Âncora", price: 528, wholesalePrice: 377, image: "/products/ancora-catalogo.png", url: "/produto/ancora", category: "Cobre Leito", rating: 5 },
  { id: "collection-oceano", name: "Linha Oceano", description: "Coleção Oceano", price: 528, wholesalePrice: 377, image: "/products/oceano-catalogo.png", url: "/produto/oceano", category: "Cobre Leito", rating: 5 },
  { id: "collection-canil", name: "Linha Canil", description: "Coleção Canil", price: 528, wholesalePrice: 377, image: "/products/canil-catalogo.png", url: "/produto/canil", category: "Cobre Leito", rating: 5 },
  { id: "collection-bale", name: "Linha Balé", description: "Coleção Balé", price: 564, wholesalePrice: 403, image: "/products/bale-catalogo.png", url: "/produto/bale", category: "Cobre Leito", rating: 5 },
  { id: "collection-estela", name: "Linha Estela", description: "Coleção Estela", price: 527, wholesalePrice: 377, image: "/products/estela-catalogo.png", url: "/produto/estela", category: "Cobre Leito", rating: 5 },
  { id: "collection-escocia", name: "Linha Escócia", description: "Coleção Escócia", price: 527, wholesalePrice: 377, image: "/products/escocia-catalogo.png", url: "/produto/escocia", category: "Cobre Leito", rating: 5 },
  { id: "collection-celeiro", name: "Linha Celeiro", description: "Coleção Celeiro", price: 527, wholesalePrice: 377, image: "/products/celeiro-catalogo.png", url: "/produto/celeiro", category: "Cobre Leito", rating: 5 },
  { id: "collection-luiza", name: "Linha Luiza", description: "Coleção Luiza", price: 527, wholesalePrice: 377, image: "/products/luiza-catalogo.png", url: "/produto/luiza", category: "Cobre Leito", rating: 5 },
  { id: "collection-lencol-ref-610", name: "Lençol Ref. 610", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/ref-610.png", url: "/produto/lencol-ref-610", category: category("Lençóis"), rating: 5 },
  { id: "collection-lencol-azurre", name: "Lençol Azurre", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/azurre.png", url: "/produto/lencol-azurre", category: category("Lençóis"), rating: 5 },
  { id: "collection-lencol-ref-630", name: "Lençol Ref. 630", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/ref-630.png", url: "/produto/lencol-ref-630", category: category("Lençóis"), rating: 5 },
  { id: "collection-lencol-ref-640", name: "Lençol Ref. 640", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/ref-640.png", url: "/produto/lencol-ref-640", category: category("Lençóis"), rating: 5 },
  { id: "collection-lencol-loreta", name: "Lençol Loreta", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/loreta.png", url: "/produto/lencol-loreta", category: category("Lençóis"), rating: 5 },
  { id: "collection-lencol-serena", name: "Lençol Serena", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/serena.png", url: "/produto/lencol-serena", category: category("Lençóis"), rating: 5 },
  { id: "collection-lencol-karise", name: "Lençol Karise", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/karise.png", url: "/produto/lencol-karise", category: category("Lençóis"), rating: 5 },
  { id: "collection-lencol-ref-680", name: "Lençol Ref. 680", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/ref-680.png", url: "/produto/lencol-ref-680", category: category("Lençóis"), rating: 5 },
  { id: "collection-lencol-ref-690", name: "Lençol Ref. 690", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/ref-690.png", url: "/produto/lencol-ref-690", category: category("Lençóis"), rating: 5 },
  { id: "collection-lencol-ref-700", name: "Lençol Ref. 700", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/ref-700.png", url: "/produto/lencol-ref-700", category: category("Lençóis"), rating: 5 },
  { id: "collection-lencol-ref-710", name: "Lençol Ref. 710", description: "Jogo de lençol bordado, disponível nas composições e tamanhos indicados no catálogo.", price: 455, wholesalePrice: 325, image: "/products/lencois/ref-710.png", url: "/produto/lencol-ref-710", category: category("Lençóis"), rating: 5 },
  ...towelProducts,
  ...childProducts,
  ...bathProducts,
  ...curtainProducts,
  ...kitchenProducts,
  ...pillowProducts,
];
