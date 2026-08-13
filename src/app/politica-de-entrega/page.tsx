import type { Metadata } from "next";
import InstitutionalPage from "@/components/store/InstitutionalPage";
import { talitaDeliveryCities } from "@/data/deliveryCities";

export const metadata: Metadata = { title: "Política de Entrega" };

export default function Page() {
  return <InstitutionalPage title="Política de Entrega" intro="Entregamos em Chapecó e nas cidades que fazem parte da rota própria Talita Vitória." sections={[
    { title: "Rota própria", text: "No cadastro e no carrinho, as cidades atendidas pela rota própria são identificadas. A data e o período de entrega são combinados pela consultora após a confirmação do pedido." },
    { title: "Cidades atendidas", text: talitaDeliveryCities.join(", ") + "." },
    { title: "Demais cidades", text: "Para cidades fora da rota convencional, a entrega fica sob consulta. Frete, prazo e possibilidade de envio serão avaliados antes da confirmação." },
    { title: "Disponibilidade e prazo", text: "Os produtos são sujeitos à disponibilidade. O prazo de entrega começa a ser definido somente depois da confirmação do pedido e da forma de pagamento." },
    { title: "Recebimento", text: "Confira os itens no recebimento. Caso observe qualquer divergência, comunique a consultora o quanto antes para que possamos orientar o atendimento." },
  ]} />;
}
