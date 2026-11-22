# Jonathan Mello | Barbeiro Profissional — Landing page

Site estático (HTML + CSS + JavaScript puro). Abra `index.html` ou publique a pasta em qualquer hospedagem (Vercel, Netlify, Hostinger etc.).

```
index.html        estrutura e textos
css/styles.css    visual (paleta Premium Dark, responsivo)
js/config.js      ⚙️ TODOS os dados editáveis
js/main.js        interações (menu, FAQ, galeria, botão fixo, mapa)
```

## 1. Link de agendamento (o mais importante)
Em `js/config.js`, troque:

```js
BOOKING_URL: "INSERIR_LINK_DO_APLICATIVO",
```

Os 15 botões de agendamento do site (header, hero, serviços, galeria, CTA final, rodapé e botão fixo do celular) passam a usar esse link.

- **Link universal (https):** o celular abre o app se estiver instalado; senão, abre a versão web/página de instalação.
- `BOOKING_URL_IOS` / `BOOKING_URL_ANDROID` (opcional): link específico para iPhone (App Store) e Android (Google Play).
- `APP_DEEP_LINK` (opcional): ex. `nomedoapp://agendar` — tenta abrir o app e, se não abrir em 1,5s, segue para o link acima.

**Configuração atual:** `BOOKING_URL` ainda não foi preenchido, então o site usa os links das lojas: no iPhone o botão abre a App Store, no Android abre a Google Play e no computador aparece uma janela com as duas opções. Se um dia existir um link web de agendamento, basta colocá-lo em `BOOKING_URL` (ele passa a valer no computador).

## 2. Outros dados (`js/config.js`)
| Campo | Onde aparece |
|---|---|
| `ADDRESS` | Localização, FAQ, rodapé, mapa e “Como chegar” |
| `HOURS` | Horários de funcionamento |
| `INSTAGRAM_URL` / `INSTAGRAM_HANDLE` | Rodapé |
| `WHATSAPP_NUMBER` / `WHATSAPP_DISPLAY` | Rodapé |
| `TESTIMONIALS` | Cards de avaliações (somente avaliações reais) |
| `HIDE_EMPTY_TESTIMONIALS` | `true` esconde a seção enquanto não houver avaliações |

Campos vazios aparecem como `[marcador]` no site.

## 3. Fotos
**Fotos reais** (pasta `img/`): hero, "Sobre", os 4 cards de serviços e as 6 fotos da galeria. As capturas originais ficam em `img/originais/`.
**Ainda ilustrativa** (Unsplash): a cadeira do CTA final. No `index.html`, procure pelos comentários `TROCAR FOTO` e substitua o `src` (e o `srcset`, quando houver) pelas fotos reais — por exemplo, salve em uma pasta `img/` e use `src="img/degrade.jpg"`. Atualize também o `alt` descrevendo a foto.
Dica: exporte em JPG/WebP com ~1600px (hero/CTA) e ~900px (cards/galeria).

## 4. Serviços
No `index.html`, cada serviço é um bloco `<article class="service">`. Duplique ou remova para ajustar a lista definitiva. Preços ficam no aplicativo.

### Ampliação por IA
As fotos de `img/` foram ampliadas 2× (3× nas duas menores) com Real-ESRGAN e misturadas ~50% com a foto original, para ganhar nitidez sem alterar rosto ou pele.
As versões antes da ampliação estão em `img/antes-ia/`. Quando houver os arquivos originais da câmera, prefira usá-los.
