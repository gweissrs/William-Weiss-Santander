# DECISIONS.md — Decisões Técnicas

Registro das principais decisões de arquitetura, design e implementação do projeto William Weiss Landing Page.

---

## 1. JavaScript Vanilla — sem frameworks

**Decisão:** não usar React, Vue ou qualquer framework JavaScript.

**Motivo:** o projeto é uma landing page estática com interações simples — accordion de FAQ, scroll reveal, menu mobile e efeito tilt. Adicionar um framework criaria overhead desnecessário de bundle, configuração de build e complexidade de manutenção para uma entrega que o browser resolve nativamente com ~200 linhas de JS.

**Resultado:** zero dependências de runtime, carregamento instantâneo, sem etapa de build.

---

## 2. CSS Puro com variáveis — sem preprocessadores

**Decisão:** não usar Sass, Less ou Tailwind. Todo o CSS é escrito com variáveis nativas (`--var`).

**Motivo:** CSS custom properties modernas eliminam a principal vantagem do Sass para projetos desse porte. O sistema de design completo — cores, tipografia, espaçamentos, sombras — fica centralizado em `:root` e é alterável em um único lugar. Tailwind adicionaria classes utilitárias no HTML que prejudicariam a legibilidade e o versionamento.

**Resultado:** CSS legível, sem build step, com sistema de design coerente e fácil de manter.

---

## 3. Cormorant Garamond + Manrope

**Decisão:** Cormorant Garamond para títulos editoriais, Manrope para todo o corpo e UI.

**Motivo:** o briefing pedia estética de private banking. Cormorant Garamond traz autoridade editorial e sofisticação tipográfica típica de relatórios financeiros e marcas de luxo — especialmente em peso 600/700 com itálico. Manrope complementa com leitura limpa em tamanhos menores, sem a ilegibilidade que serifas têm em corpo de texto digital. A combinação evita os clichês de Inter/Roboto que dominam o mercado de fintechs genéricas.

**Resultado:** hierarquia tipográfica clara, personalidade visual distinta, leitura confortável em todos os tamanhos.

---

## 4. mix-blend-mode para logos com fundo preto

**Decisão:** usar `mix-blend-mode: multiply` em fundos claros e `mix-blend-mode: screen` em fundos escuros para as logos, em vez de editar os arquivos originais.

**Motivo:** as logos fornecidas pelo cliente tinham fundo preto sem canal alpha transparente. Editar os arquivos originais quebraria o vínculo com os assets do cliente e criaria versões paralelas difíceis de manter. O `mix-blend-mode` resolve o problema diretamente no CSS, sem tocar nos arquivos, e funciona em qualquer fundo — claro ou escuro — com uma única propriedade.

**Resultado:** logos integradas corretamente em todos os contextos sem dependência de edição de imagem.

---

## 5. IntersectionObserver para animações de reveal

**Decisão:** usar a API nativa `IntersectionObserver` para as animações de entrada dos elementos.

**Motivo:** a alternativa tradicional seria ouvir o evento `scroll` e calcular posições com `getBoundingClientRect()` a cada frame — custoso e causador de jank. `IntersectionObserver` é assíncrono, roda fora da thread principal e é nativo em todos os browsers modernos. Após a animação, o observer é desconectado (`unobserve`) e o `will-change` é liberado, evitando consumo desnecessário de GPU.

**Resultado:** animações suaves sem impacto na performance de scroll.

---

## 6. defer no script

**Decisão:** carregar o script com atributo `defer`.

**Motivo:** scripts bloqueiam o parsing do HTML por padrão. Com `defer`, o browser baixa o script em paralelo e só executa após o HTML ser completamente parseado — eliminando bloqueio de renderização sem perder a ordem de execução.

**Resultado:** First Contentful Paint mais rápido, página visível antes do JS estar pronto.

---

## 7. Lazy loading nas imagens below-the-fold

**Decisão:** `loading="lazy" decoding="async"` em todas as imagens exceto as duas acima do fold (navbar e hero).

**Motivo:** imagens são o maior custo de carregamento em páginas com conteúdo visual. Carregar todas de uma vez penaliza o LCP (Largest Contentful Paint) e desperdiça banda do usuário em imagens que ele pode nunca ver. As imagens críticas (logo na navbar e avatar no hero card) ficam sem lazy para não atrasar o primeiro render.

**Resultado:** carregamento inicial mais leve, melhor score no Google PageSpeed.

---

## 8. Estrutura de pastas assets/

**Decisão:** separar todos os recursos estáticos em `assets/css/`, `assets/js/`, `assets/images/` e `assets/favicon/`.

**Motivo:** colocar todos os arquivos na raiz funciona, mas não escala e não comunica intenção. A separação por tipo de asset segue convenção de mercado, facilita onboarding de novos desenvolvedores e permite configurar regras de cache diferenciadas por tipo de arquivo no servidor.

**Resultado:** estrutura legível, profissional e escalável.

---

## 9. Sem build step — deploy direto de arquivos estáticos

**Decisão:** o projeto não tem etapa de build. O que está no repositório é exatamente o que vai para produção.

**Motivo:** para uma landing page sem componentes dinâmicos, adicionar Webpack, Vite ou qualquer bundler seria over-engineering. O custo de manutenção do toolchain superaria qualquer benefício. Deploy em qualquer CDN ou hospedagem estática (Netlify, GitHub Pages, Vercel) é feito com arrastar e soltar.

**Resultado:** zero configuração de build, deploy em minutos, sem dependências de desenvolvimento obrigatórias.

---

*Documento mantido por: William Weiss / Desenvolvimento*