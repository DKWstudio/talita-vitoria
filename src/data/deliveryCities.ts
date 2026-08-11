export const talitaDeliveryCities = [
  "Modelo", "Serra Alta", "Sul Brasil", "Bom Jesus do Oeste", "Tigrinhos", "Maravilha", "Saltinho", "Irati", "Jardinópolis", "União do Oeste", "Pinhalzinho", "Águas Frias", "Nova Erechim", "Saudades", "Cunhataí", "Cunha Porã", "Coronel Freitas", "Nova Itaberaba", "Cordilheira Alta", "Chapecó", "Guatambu", "Caxambu do Sul", "Planalto Alegre", "Águas de Chapecó", "São Carlos", "Palmitos", "Caibi", "Riqueza", "Mondaí", "Iporã do Oeste", "Iraceminha", "Descanso", "Flor do Sertão", "São Miguel da Boa Vista", "São Miguel do Oeste", "Barra Bonita", "Romelândia", "Santa Terezinha do Progresso", "São Bernardino", "Formosa do Sul", "Santiago do Sul", "Quilombo", "Marema", "Lajeado Grande", "Entre Rios", "Ipuaçu", "Xaxim", "São Domingos", "Coronel Martins", "Galvão", "Novo Horizonte", "São Lourenço do Oeste", "Campo Erê", "Anchieta",
] as const;

export function hasTalitaDelivery(city: string) {
  return talitaDeliveryCities.some((item) => item.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase());
}
