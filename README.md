# 📊 Sistema de Controle de Contas

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech](https://img.shields.io/badge/tech-HTML%2FCSS%2FJS-green)

Sistema web frontend para controle financeiro pessoal de despesas e receitas, com suporte a parcelamento, filtros avançados e persistência local via LocalStorage.

---

## 🚀 Início Rápido

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Servidor HTTP local (opcional, mas recomendado para ES Modules)

### Executando

**VS Code Live Server**
1. Instale a extensão "Live Server"
2. Clique com botão direito em `login.html` → "Open with Live Server"

**Opção 2: Node.js http-server**
```bash
npx http-server -p 8000
```

**Opção 3: Abrir direto (pode ter limitações CORS)**
Dê duplo clique em `login.html`

---

## ✨ Funcionalidades

### 🔐 Autenticação (Simulada)
- Tela de login com validação visual
- Redirecionamento automático se não autenticado
- Logout com confirmação

### 💰 Despesas
- Cadastro com **nome, descrição, categoria, valor, data de vencimento**
- **Parcelamento** automático (até 50 parcelas)
- Status: **Pendente / Pago** com data de pagamento
- Edição e exclusão de parcelas individuais
- Filtros: **por mês atual, período personalizado, nome**
- Resumo: Total geral, Total pago, Pendente

### 💵 Receitas
- Cadastro com **nome, descrição, categoria, valor, data**
- Mesmos filtros das despesas
- Resumo: Total de receitas

### 📊 Dashboard
- **Cards de resumo** atualizados em tempo real:
  - Total Geral (despesas)
  - Total Pago
  - Pendente
  - Total de Receitas
  - **Saldo** (Receitas - Despesas)
- Abas para alternar entre Despesas e Receitas

### 🏷️ Categorias
- Autocomplete com sugestões
- Criação automática de novas categorias
- Tipos: `EXPENSES` (despesas) e `RECEIPT` (receitas)

### 💾 Persistência
- **LocalStorage** (padrão) - funciona offline
- Arquitetura preparada para **API REST** (Strategy Pattern)

---

## 🏗️ Arquitetura

### Padrões Utilizados
| Padrão | Onde | Descrição |
|--------|------|-----------|
| **MVC Adaptado** | Controllers + UI + Services | Separação de responsabilidades |
| **Strategy Pattern** | `Service` class | Troca entre LocalStorage e API |
| **Module Pattern (ESM)** | Todos arquivos JS | Encapsulamento e dependências explícitas |
| **Event Delegation** | UI components | Performance em listas dinâmicas |
| **Single Responsibility** | Cada módulo | Uma responsabilidade por arquivo |

### Fluxo de Dados

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│   UI/HTML   │───▶│  Controllers │───▶│    Service     │
│  (Events)   │     │ (Orchestrate)│     │  (Strategy)    │
└─────────────┘     └──────────────┘     └───────┬────────┘
                                                 │
                        ┌──────────────┐         │
                        │ LocalStorage │◀───────┤
                        │   / API      │         │
                        └──────────────┘         │
                                                 ▼
                        ┌──────────────┐    ┌─────────────┐
                        │    Core      │◀──│  Data Model │
                        │ (Business)   │    │  (Pure JS)  │
                        └──────────────┘    └─────────────┘
```

### Camadas

| Camada | Responsabilidade | Arquivos |
|--------|------------------|----------|
| **Presentation** | DOM, eventos, renderização | `ui/*.js`, `main.html`, `login.html` |
| **Control** | Orquestração, validação, fluxo | `controllers/*.js` |
| **Service** | Abstração de persistência | `services/*.js` |
| **Domain/Core** | Regras de negócio puras | `core/*.js` |
| **Utils** | Helpers reutilizáveis | `utils/*.js` |
| **Config** | Configurações globais | `config/config.js` |
| **Data** | Seeds/constantes iniciais | `data/*.js` |

---

## 📁 Estrutura Detalhada

```
.
├── login.html                 # Página de login (entry point)
├── main.html                  # Dashboard principal
├── README.md                  # Esta documentação
├── ARCHITECTURE.md            # Documentação técnica detalhada
├── API.md                     # Documentação da camada de serviços
├── CHANGELOG.md               # Histórico de versões
├── CONTRIBUTING.md            # Guia de contribuição
├── css/
│   ├── login.css              # Estilos login
│   └── style.css              # Estilos dashboard
├── js/
│   ├── main.js                # Bootstrap dashboard
│   ├── loginMain.js           # Bootstrap login
│   ├── config/
│   │   └── config.js          # VARIABLE_CONNECTION = "api" | "localStorage"
│   ├── core/                  # 🎯 Regras de negócio (sem side effects)
│   │   ├── categoriesCore.js  # Lógica de categorias
│   │   ├── expensesCore.js    # Modelos/formulários despesas
│   │   ├── paymentCore.js     # Lógica de parcelamento/pagamento
│   │   └── receiptCore.js     # Modelos/formulários receitas
│   ├── controllers/           # 🎮 Orquestradores
│   │   ├── categoriesController.js
│   │   ├── expensesController.js
│   │   ├── loginController.js
│   │   ├── paymentController.js
│   │   ├── receiptController.js
│   │   └── searchController.js
│   ├── services/              # 💾 Camada de dados
│   │   ├── apiService.js      # Implementação API (futuro)
│   │   ├── localStoregeService.js  # Implementação LocalStorage
│   │   └── service.js         # Facade + Strategy selector
│   ├── ui/                    # 🎨 Componentes visuais
│   │   ├── categoriesUi.js    # Autocomplete categorias
│   │   ├── expensesUi.js      # Lista/render despesas
│   │   ├── feedback.js        # Toast messages + loading
│   │   ├── formUi.js          # Modal formulário (CRUD)
│   │   ├── loginUi.js         # Login interactions
│   │   ├── mainUi.js          # Auth check + logout
│   │   ├── modal.js           # Modal genérico
│   │   ├── paymentUi.js       # Toggle status visual
│   │   ├── receiptUi.js       # Lista/render receitas
│   │   ├── sumary.js          # Cards de resumo (totais)
│   │   └── tablesUi.js        # Tabelas/estrutura
│   ├── utils/                 # 🔧 Helpers
│   │   ├── date.js            # Formatação/períodos datas
│   │   ├── localstoregeTests.js # Debug/seed helpers
│   │   └── money.js           # Formatação moeda BRL
│   ├── data/                  # 🌱 Seeds iniciais
│   │   ├── category.js        # Categorias padrão
│   │   └── expenses.js        # Despesas de exemplo
│   └── libs/                  # 📦 Libs de terceiros (wrapped)
│       └── flatpickr.js       # Date picker config
└── assets/
    ├── accounting.png         # Favicon
    ├── accounting_24px.png
    ├── accounting_64px.png    # Logo login
    ├── accounting_128px.png
    └── background.jpeg        # Background login
```

---

## ⚙️ Configuração

### Trocar Persistência (LocalStorage ↔ API)

Edite `js/config/config.js`:

```javascript
// "api" para backend REST | "localStorage" para armazenamento local
export const VARIABLE_CONNECTION = "localStorage";
```

> **Nota**: A implementação `ApiService` em `js/services/apiService.js` é um stub. Para usar API real, implemente os métodos seguindo a mesma interface de `LocalStorageService`.

---

## 🧪 Testes e Debug

### Resetar LocalStorage
No dashboard, clique no botão cinza **"Reset LocalStorege"** ou execute no console:

```javascript
localStorage.clear();
location.reload();
```

### Ver dados salvos
```javascript
// Ver todas as despesas
JSON.parse(localStorage.getItem("expenses"))

// Ver categorias
JSON.parse(localStorage.getItem("categories"))

// Ver token de auth
localStorage.getItem("token")
```

### Seed de dados de exemplo
Os dados iniciais estão em `js/data/expenses.js` e `js/data/category.js`. São carregados automaticamente na primeira execução.

---

## 🛠️ Desenvolvimento

### Adicionar Nova Funcionalidade

1. **Core** - Crie `js/core/novaFuncionalidadeCore.js` com lógica pura
2. **Service** - Adicione métodos em `LocalStorageService` (e `ApiService`)
3. **Controller** - Crie `js/controllers/novaFuncionalidadeController.js`
4. **UI** - Crie `js/ui/novaFuncionalidadeUi.js` para renderização
5. **Integração** - Importe e inicialize em `main.js`

### Convenções de Código

| Item | Padrão |
|------|--------|
| Módulos | ES Modules (`import`/`export`) |
| Nomes arquivos | `camelCase.js` |
| Classes | `PascalCase` |
| Funções/Variáveis | `camelCase` |
| Constantes | `UPPER_SNAKE_CASE` |
| Seletores DOM | `kebab-case` (HTML) / `camelCase` (JS) |
| Comentários | JSDoc para funções públicas |

### Linting sugerido
```bash
# ESLint com config padrão
npx eslint js/
```

---

## 📦 Build e Deploy

### Produção (Estático)
Como é um projeto **pure frontend** sem build step:

1. **GitHub Pages**: Push para branch `gh-pages` ou configure nas settings
2. **Netlify/Vercel**: Conecte o repositório, deploy automático
3. **Servidor próprio**: Copie arquivos para `/var/www/html` (nginx/apache)

### Variáveis de Ambiente
Não há variáveis de ambiente sensíveis (tudo client-side).
Para API futura, use `.env` e um bundler (Vite, Webpack).

---

## 🗺️ Roadmap

### v1.1 - Melhorias UX
- [ ] Confirmação antes de excluir (já tem no delete individual)
- [ ] Edição em lote de parcelas
- [ ] Exportar CSV/PDF
- [ ] Gráficos (Chart.js)

### v1.2 - Backend Real
- [ ] API REST (Node/Express ou Python/FastAPI)
- [ ] Autenticação JWT real
- [ ] Multi-usuário
- [ ] Migração LocalStorage → Banco

### v2.0 - Recursos Avançados
- [ ] Recorrência automática (assinaturas)
- [ ] Metas/orçamento por categoria
- [ ] Compartilhamento familiar
- [ ] PWA (offline-first)

---

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

Resumo:
1. Fork o projeto
2. Crie branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra Pull Request

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) (criar se necessário).

---

## 👨‍💻 Autor

Desenvolvido como projeto de estudo/portfólio de **arquitetura frontend modular** com JavaScript vanilla.

---

> **Dica**: Para entender o código, comece lendo `main.js` (bootstrap), depois `services/service.js` (estratégia), e então os controllers de interesse.
