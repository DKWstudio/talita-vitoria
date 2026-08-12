"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, X } from "lucide-react";
import { hasTalitaDelivery } from "@/data/deliveryCities";
import { createPublicSupabaseClient } from "@/lib/supabase/client";

type Props = {
  supabase: ReturnType<typeof createPublicSupabaseClient>;
  onClose: () => void;
  initialRegister?: boolean;
};

export default function AuthModalV3({ supabase, onClose, initialRegister = false }: Props) {
  const [register, setRegister] = useState(initialRegister);
  const [purpose, setPurpose] = useState("comprar");
  const [showPassword, setShowPassword] = useState(false);
  const [cep, setCep] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({ logradouro: "", bairro: "", cidade: "" });
  const [message, setMessage] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);

  const lookupCep = async () => {
    const code = cep.replace(/\D/g, "");
    if (code.length !== 8) return;

    setLoadingCep(true);
    setMessage("");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${code}/json/`);
      const data = await response.json();
      if (data.erro) {
        setMessage("CEP não encontrado. Confira os números ou preencha o endereço manualmente.");
      } else {
        setAddress({
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
        });
      }
    } catch {
      setMessage("Não foi possível consultar o CEP agora. Você pode preencher o endereço manualmente.");
    } finally {
      setLoadingCep(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || submitting) return;

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    setSubmitting(true);
    setMessage("");

    try {
      if (!register) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          const reason = `${error.code || ""} ${error.message || ""}`.toLowerCase();
          setMessage(
            reason.includes("email_not_confirmed") || reason.includes("email not confirmed")
              ? "Seu cadastro ainda aguarda a confirmação do e-mail. Abra a mensagem enviada pelo Supabase, confirme o acesso e tente novamente."
              : "E-mail ou senha inválidos. Se não lembra a senha, use “Esqueci minha senha”.",
          );
          return;
        }
        onClose();
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            ...Object.fromEntries(form.entries()),
            tipo_cadastro: purpose === "revender" ? "revendedor" : "cliente",
          },
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setConfirmationEmail(email);
    } finally {
      setSubmitting(false);
    }
  };

  const recoverPassword = async () => {
    if (!supabase) return;
    const email = window.prompt("Informe seu e-mail cadastrado:");
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setMessage(error ? error.message : "Enviamos um link de recuperação para seu e-mail.");
  };

  const resendConfirmation = async () => {
    if (!supabase) return;
    const email = window.prompt("Informe o e-mail que você cadastrou:");
    if (!email) return;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setMessage(error ? error.message : "Enviamos uma nova confirmação. Abra o e-mail mais recente e clique no link.");
  };

  const ownDelivery = address.cidade && hasTalitaDelivery(address.cidade);

  if (confirmationEmail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="flex justify-end"><button aria-label="Fechar" onClick={onClose}><X /></button></div>
          <CheckCircle2 className="mx-auto mt-1 h-14 w-14 text-emerald-600" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#A95765]">Cadastro enviado!</h2>
          <div className="mt-5 rounded-2xl bg-[#fff5ec] p-4 text-left text-sm leading-relaxed text-stone-700">
            <Mail className="mb-2 h-5 w-5 text-[#A95765]" />
            <p>Enviamos uma mensagem de confirmação para <strong>{confirmationEmail}</strong>.</p>
            <p className="mt-2">Para liberar seu acesso, abra o e-mail e clique no botão de confirmação. Depois, volte à vitrine e entre com seu e-mail e senha.</p>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-stone-500">Não encontrou? Confira as pastas de spam, lixo eletrônico e promoções.</p>
          <button onClick={onClose} className="mt-6 w-full rounded-xl bg-[#A95765] py-3 font-bold text-white">Entendi</button>
        </section>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <header className="flex justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#A95765]">{register ? "Crie sua conta" : "Que bom ter você aqui"}</h2>
            <p className="text-sm text-stone-500">{register ? "Cadastre-se para comprar ou revender." : "Entre para continuar."}</p>
          </div>
          <button aria-label="Fechar" onClick={onClose}><X /></button>
        </header>

        <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
          {register && <>
            <input name="nome_completo" required placeholder="Nome completo" className="field sm:col-span-2" />
            <input name="telefone" required placeholder="Telefone / WhatsApp" className="field sm:col-span-2" />
            <label className="text-sm font-bold sm:col-span-2">Como deseja usar a vitrine?
              <select name="intencao" value={purpose} onChange={(event) => setPurpose(event.target.value)} className="field mt-1 w-full">
                <option value="comprar">Quero comprar produtos</option>
                <option value="revender">Quero revender Bordados Vitória</option>
              </select>
            </label>
            <input name="cep" value={cep} onChange={(event) => setCep(event.target.value)} onBlur={lookupCep} required placeholder="CEP" className="field" />
            <span className="self-center text-xs text-stone-500">{loadingCep ? "Buscando endereço…" : "Digite o CEP para preencher a cidade"}</span>
            <input name="logradouro" value={address.logradouro} onChange={(event) => setAddress({ ...address, logradouro: event.target.value })} required placeholder="Logradouro" className="field" />
            <input name="numero" required placeholder="Número" className="field" />
            <input name="bairro" value={address.bairro} onChange={(event) => setAddress({ ...address, bairro: event.target.value })} required placeholder="Bairro" className="field" />
            <input name="cidade" value={address.cidade} onChange={(event) => setAddress({ ...address, cidade: event.target.value })} required placeholder="Cidade" className="field" />
            {address.cidade && <p className={`rounded-xl p-3 text-xs leading-relaxed sm:col-span-2 ${ownDelivery ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
              {ownDelivery ? <><b>Entrega própria disponível:</b> {address.cidade} faz parte da rota convencional Talita Vitória.</> : <><b>Entrega sob consulta:</b> {address.cidade} não faz parte da rota convencional. Frete, prazo e possibilidade de envio serão negociados com a consultora.</>}
            </p>}
            {purpose === "revender" && <>
              <div className="rounded-xl bg-[#fff5ec] p-4 text-xs leading-relaxed text-stone-700 sm:col-span-2">
                <p className="font-bold text-[#A95765]">Seja uma revendedora Bordados Vitória</p>
                <p className="mt-2">Nossa empresa trabalha com vendas por catálogo. Você recebe um catálogo, uma lista de custo e uma sugestão de venda com margem de até 40%. O lucro é definido por você ao formar seu preço — não trabalhamos com comissão.</p>
                <p className="mt-2">Pedidos a partir de R$ 1.600,00 têm entrega sem frete. A partir de R$ 600,00 há faturamento, com taxa de frete. Para pagamento em dinheiro, concedemos 10% de desconto sobre o total. Em vendas a prazo, o pagamento pode ser feito no cartão ou cheque, mediante análise.</p>
                <p className="mt-2">Após a aprovação, você será incluída em nosso grupo de WhatsApp, com novidades de produtos, conteúdos frequentes e promoções. Eu, Talita, serei sua representante responsável pelo atendimento, suporte e orientação nessa nova etapa.</p>
                <p className="mt-2">A Bordados Vitória é uma empresa familiar, com mais de 40 anos de experiência em enxovais para cama, mesa e banho. A qualidade, o carinho no acabamento e o reconhecimento da marca em diversos estados ajudam você a apresentar produtos de confiança ao seu público.</p>
                <p className="mt-2">Para concluir sua análise cadastral, solicitaremos foto da identidade frente e verso, CPF ou CNPJ e comprovante de endereço por canal seguro.</p>
              </div>
              <label className="flex gap-2 text-xs sm:col-span-2"><input required type="checkbox" name="aceite_condicoes" />Li e aceito as condições comerciais para revenda.</label>
            </>}
          </>}
          <input name="email" type="email" required placeholder="E-mail" className="field sm:col-span-2" />
          <div className="relative sm:col-span-2">
            <input name="password" type={showPassword ? "text" : "password"} required minLength={8} pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}" title="Mínimo 8 caracteres, uma letra maiúscula e um símbolo." placeholder={register ? "Senha forte" : "Senha"} className="field w-full pr-14" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-xs font-bold text-[#A95765]">{showPassword ? "Ocultar" : "Ver"}</button>
          </div>
          {register && <><p className="text-xs text-stone-500 sm:col-span-2">Use ao menos 8 caracteres, uma letra maiúscula e um símbolo.</p><p className="text-center text-[11px] text-stone-500 sm:col-span-2">Ao continuar, você concorda com a <a href="/politica-de-privacidade" target="_blank" className="font-bold text-[#A95765] underline">Política de Privacidade</a>.</p></>}
          <button disabled={submitting} className="rounded-xl bg-[#A95765] py-3 font-bold text-white disabled:opacity-60 sm:col-span-2">{submitting ? "Aguarde…" : register ? "Criar cadastro" : "Entrar"}</button>
          {message && <p className="text-sm text-[#A95765] sm:col-span-2">{message}</p>}
        </form>
        {!register && <div className="mt-4 grid gap-2 sm:grid-cols-2"><button onClick={recoverPassword} className="text-sm font-bold text-[#A95765]">Esqueci minha senha</button><button onClick={resendConfirmation} className="text-sm font-bold text-[#A95765]">Reenviar confirmação</button></div>}
        <button onClick={() => { setRegister(!register); setMessage(""); }} className="mt-3 w-full text-sm font-bold text-[#A95765]">{register ? "Já tenho cadastro" : "Ainda não tenho cadastro"}</button>
      </section>
    </div>
  );
}
