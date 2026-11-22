/* =========================================================
   JONATHAN MELLO | BARBEIRO PROFISSIONAL — CONFIGURAÇÃO CENTRAL
   ---------------------------------------------------------
   Edite APENAS este arquivo para atualizar os dados do site.
   Campos vazios ("") exibem um marcador [entre colchetes].
   Não preencha com informações que não sejam reais.
   ========================================================= */
window.SITE_CONFIG = {
  /* ---------- AGENDAMENTO (todos os botões usam este link) ----------
     Cole aqui o link do aplicativo. Se for um "link universal" (https),
     o celular abre o app quando ele estiver instalado e, caso contrário,
     abre a versão web / página de instalação automaticamente.
     Enquanto estiver como "INSERIR_...", o site usa os links das lojas
     abaixo: iPhone → App Store, Android → Google Play e, no computador,
     abre uma janela para o visitante escolher a loja. */
  BOOKING_URL: "INSERIR_LINK_DO_APLICATIVO",

  /* OPCIONAL — links específicos por sistema. Se preenchidos, quem
     estiver no iPhone/Android é enviado para o link correspondente
     (ex.: página do app na App Store / Google Play). Vazio = usa BOOKING_URL. */
  BOOKING_URL_IOS: "https://apps.apple.com/us/app/alex-mayk-barbearia/id6754763209",
  BOOKING_URL_ANDROID: "https://play.google.com/store/apps/details?id=alexmaykbarbearia.bestbarbers.app",

  /* OPCIONAL — deep link do app (ex.: "nomedoapp://agendar").
     Se preenchido, o site tenta abrir o app instalado e, se ele não
     abrir em ~1,5s, segue para o link acima (web ou loja). */
  APP_DEEP_LINK: "",

  /* ---------- REDES E CONTATO ---------- */
  INSTAGRAM_URL: "",        // ex.: "https://instagram.com/usuario"
  INSTAGRAM_HANDLE: "",     // ex.: "@usuario"
  WHATSAPP_NUMBER: "",      // só dígitos, com país e DDD. ex.: "5511999999999"
  WHATSAPP_DISPLAY: "",     // ex.: "(11) 99999-9999"
  WHATSAPP_MESSAGE: "Olá! Vim pelo site do Jonathan Mello, barbeiro profissional.",

  /* ---------- LOCALIZAÇÃO ---------- */
  ADDRESS: "",              // endereço completo. ex.: "Rua X, 123 - Bairro, Cidade - UF"
  /* Texto usado no mapa e no "Como chegar". Vazio = usa ADDRESS. */
  MAPS_QUERY: "",

  /* ---------- HORÁRIOS ----------
     Um item por linha. ex.: { days: "Terça a Sexta", time: "09h às 19h" } */
  HOURS: [
    { days: "", time: "" },
    { days: "", time: "" },
    { days: "", time: "" },
  ],

  /* ---------- AVALIAÇÕES DE CLIENTES ----------
     Somente avaliações REAIS. ex.:
     { name: "Nome do cliente", rating: 5, text: "Comentário..." }
     Enquanto a lista estiver vazia, o site mostra cards-modelo
     (ou esconde a seção, se HIDE_EMPTY_TESTIMONIALS = true). */
  TESTIMONIALS: [],
  HIDE_EMPTY_TESTIMONIALS: false,
};
