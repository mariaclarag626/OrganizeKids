# 🎮 OrganizeKids - Sistema Gamificado de Tarefas Familiares

## 📋 Visão Geral

**OrganizeKids** é uma plataforma web gamificada que transforma tarefas domésticas em uma aventura divertida para crianças, com sistema de pontos, rankings, conquistas e recompensas!

## ✨ Funcionalidades Implementadas

### 🧒 **Dashboard Kids** (100% Completo)

#### Interface Visual
- ✅ Background gradient animado (roxo → rosa → azul)
- ✅ 20 estrelas flutuantes com animação
- ✅ Glassmorphism (efeito vidro fosco)
- ✅ Animações suaves em todos os elementos
- ✅ Design responsivo (mobile-first)

#### Sistema de Tarefas
- ✅ Visualização de tarefas do dia
- ✅ Cards coloridos com ícones personalizados
- ✅ Botão "Completar Tarefa" com feedback visual
- ✅ Animação de confete ao completar (50 partículas!)
- ✅ Mensagens de celebração aleatórias
- ✅ Efeito de estrelas em explosão
- ✅ Tarefas completadas ficam riscadas
- ✅ Atualização automática de pontos

#### Sistema de Pontos
- ✅ Display grande no header
- ✅ Estrela pulsante
- ✅ Atualização em tempo real
- ✅ Histórico de pontos ganhos/gastos

#### Ranking Familiar
- ✅ Top 3 com medalhas 🥇🥈🥉
- ✅ Destaque visual do usuário atual
- ✅ Avatares personalizados
- ✅ Atualização dinâmica
- ✅ Sempre visível no topo

#### Loja de Recompensas
- ✅ Grid de prêmios
- ✅ 8 recompensas pré-cadastradas:
  - 🎮 30 min de videogame (50 pts)
  - 🎬 Escolher o filme (30 pts)
  - 🍕 Pizza no jantar (100 pts)
  - 🌙 Dormir mais tarde (80 pts)
  - 🍦 Sorvete especial (40 pts)
  - 🎡 Passeio no parque (150 pts)
  - 🎁 Brinquedo novo (300 pts)
  - 🏠 Amigo para dormir (200 pts)
- ✅ Indicador de pontos necessários
- ✅ Botão bloqueado quando sem pontos
- ✅ Sistema de aprovação pelos pais
- ✅ Feedback visual de resgate

#### Sistema de Conquistas
- ✅ 15 conquistas únicas:
  
  **Tarefas:**
  - 🌟 Primeira Tarefa (1 tarefa)
  - 💪 Trabalhador (10 tarefas)
  - 👑 Mestre das Tarefas (50 tarefas)
  - 🏆 Lendário (100 tarefas)
  
  **Sequências:**
  - 🔥 Sequência de 3 dias
  - 🔥 Sequência de 7 dias
  - 🔥 Sequência de 30 dias
  
  **Pontos:**
  - ⭐ Colecionador (100 pontos)
  - 💎 Acumulador (500 pontos)
  - 💰 Milionário (1000 pontos)
  
  **Especiais:**
  - 🌅 Madrugador (tarefa antes das 8h)
  - 🦉 Coruja da Noite (tarefa após 20h)
  - ✨ Semana Perfeita
  - 🤝 Ajudante
  - ⚡ Raio Veloz (5 tarefas em 1 dia)

- ✅ Barra de progresso para conquistas bloqueadas
- ✅ Animação bounce para desbloqueadas
- ✅ Efeito grayscale para bloqueadas

#### Avatar Personaliz

ável
- ✅ 12 opções de avatar:
  - Crianças: 👧 👦 🧒 👶
  - Heróis: 🦸‍♀️ 🦸‍♂️
  - Mágicos: 🧙‍♀️ 🧙‍♂️
  - Fadas: 🧚‍♀️ 🧚‍♂️
  - Especiais: 🦄 🐉
- ✅ Preview grande
- ✅ Seleção visual
- ✅ Salvamento no banco

### 🔌 **APIs REST** (100% Completo)

#### `/api/tasks`
- **GET**: Buscar tarefas do usuário
  - Query params: `userId`, `householdId`
  - Retorna: tasks[], points{}
- **POST**: Completar tarefa
  - Body: `{ action: 'complete', taskId, userId }`
  - Atualiza: tarefa → completa, pontos → incrementa

#### `/api/ranking`
- **GET**: Ranking da família
  - Query params: `householdId`, `userId`
  - Retorna: ranking[] ordenado por pontos

#### `/api/rewards`
- **GET**: Recompensas disponíveis
  - Query params: `householdId`
  - Retorna: rewards[] ativos
- **POST**: Resgatar recompensa
  - Body: `{ action: 'redeem', rewardId, userId, householdId }`
  - Deduz pontos e cria redemption

#### `/api/achievements`
- **GET**: Conquistas e progresso
  - Query params: `userId`
  - Retorna: achievements[] com progress
- **POST**: Desbloquear/atualizar
  - Body: `{ action: 'unlock'|'updateProgress', userId, achievementCode, progress }`

#### `/api/avatar`
- **GET**: Customização do avatar
  - Query params: `userId`
- **POST**: Salvar customização
  - Body: `{ userId, ...customizations }`

#### `/api/seed/all`
- **POST**: Popular banco completo
  - Cria: família, pais, 3 filhos, tarefas, recompensas, conquistas
  - Retorna: credenciais de acesso

### 📊 **Banco de Dados** (PostgreSQL + Drizzle ORM)

#### Tabelas Principais
- `users` - Usuários (pais/filhos)
- `households` - Famílias
- `household_members` - Membros das famílias
- `profiles` - Perfis dos usuários
- `tasks` - Tarefas
- `user_points` - Pontos por usuário/família
- `rewards` - Recompensas cadastradas
- `reward_redemptions` - Resgates
- `achievements` - Conquistas disponíveis
- `user_achievements` - Progresso do usuário
- `avatar_customizations` - Personalização de avatares

## 🚀 Como Usar

### 1. Configuração Inicial

```bash
# Instalar dependências
npm install

# Configurar .env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Push do schema para o banco
npm run db:push

# Iniciar servidor
npm run dev
```

### 2. Popular Banco de Dados

```bash
# Opção 1: Via API
curl -X POST http://localhost:3000/api/seed/all

# Opção 2: Via Drizzle Studio
npm run db:studio
# Acesse: https://local.drizzle.studio
```

### 3. Dados de Teste Criados

**Família Silva**
- 👨 Pai: pai@test.com / 123456
- 👧 Maria Clara: maria@test.com / 123456
- 👦 João Pedro: joao@test.com / 123456
- 🧒 Ana Julia: ana@test.com / 123456

### 4. Acessar Dashboard

```
http://localhost:3000/dashboard/kids
```

## 🎨 Design System

### Cores
- **Background**: `from-purple-400 via-pink-300 to-blue-400`
- **Primárias**: `purple-500`, `pink-500`, `blue-500`
- **Sucesso**: `green-400` → `blue-500`
- **Recompensas**: `purple-500` → `pink-500`
- **Pontos**: `yellow-400` → `orange-500`
- **Destaque**: `yellow-400` → `orange-500`

### Animações
- `confetti` - Confetes caindo
- `celebration` - Mensagem pop
- `burst` - Estrelas explodindo
- `float` - Estrelas flutuando
- `bounce` - Pulo do avatar
- `pulse` - Pulsação da estrela
- `scale-105` - Zoom no hover

### Componentes
- Cards: `bg-white/90 backdrop-blur-lg rounded-3xl`
- Botões: Gradients + `shadow-2xl`
- Bordas: `rounded-2xl`, `rounded-3xl`

## 📱 Componentes Modulares

```tsx
// Hook customizado para dados
import { useDashboardData, useCompleteTask, useRedeemReward } from './hooks'

// Componentes reutilizáveis
import { Confetti } from './components/Confetti'
import { TaskCard } from './components/TaskCard'
import { Ranking } from './components/Ranking'
import { DashboardHeader } from './components/DashboardHeader'
import { AnimatedBackground } from './components/AnimatedBackground'
```

## 🔐 Autenticação (NextAuth)

```tsx
// Providers configurados
- Credentials (email/senha)
- Google OAuth (preparado)
- Facebook OAuth (preparado)

// Proteção de rotas
middleware.ts - Redireciona não autenticados
```

## 📈 Próximos Passos

### Fase 1: Melhorias UX
- [ ] Adicionar sons reais
- [ ] Animações de loading
- [ ] Tutoriais interativos
- [ ] Modo escuro

### Fase 2: Dashboard dos Pais
- [ ] Criar/editar/deletar tarefas
- [ ] Aprovar recompensas
- [ ] Ver relatórios e gráficos
- [ ] Gerenciar membros da família
- [ ] Notificações

### Fase 3: Funcionalidades Avançadas
- [ ] Sistema de níveis
- [ ] Desafios especiais
- [ ] Badges customizados
- [ ] Chat familiar
- [ ] Histórico detalhado
- [ ] Exportar relatórios PDF

### Fase 4: Mobile & PWA
- [ ] App mobile nativo
- [ ] Push notifications
- [ ] Modo offline
- [ ] Widgets

## 🐛 Troubleshooting

### Banco não conecta
```bash
# Verificar .env
echo $DATABASE_URL

# Testar conexão
npm run db:studio
```

### Servidor não inicia
```bash
# Limpar cache
rm -rf .next
npm run dev
```

### Dados não aparecem
```bash
# Verificar se populou
npm run db:studio

# Repovoar
curl -X POST http://localhost:3000/api/seed/all?reset=true
```

## 📚 Documentação Técnica

### Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, styled-jsx
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: NextAuth.js v5 beta
- **State**: React Hooks + Zustand
- **Forms**: React Hook Form + Zod

### Estrutura de Pastas
```
/app
  /api                  # API Routes
    /tasks
    /rewards
    /achievements
    /ranking
    /avatar
    /seed
  /dashboard
    /kids               # Dashboard Kids
      /components       # Componentes reutilizáveis
      hooks.ts          # Custom hooks
      page.tsx          # Página principal
    /parents            # Dashboard Pais (TODO)
    /teenagers          # Dashboard Adolescentes (TODO)
  page.tsx              # Landing page
  /login                # Login
  /signup               # Cadastro

/src
  /db
    schema.ts           # Schema do banco
    index.ts            # Cliente Drizzle
  /lib
    utils.ts            # Utilitários
    i18n.ts             # Internacionalização
```

## 🎯 Status do Projeto

**Dia 1**: ✅ Autenticação e Landing Page
**Dia 2**: ✅ Dashboard Kids Funcional (100%)
**Dia 3**: 🚧 Dashboard dos Pais (Próximo)

## 🏆 Conquistas do Desenvolvedor

- ✅ Interface super lúdica e interativa
- ✅ 15 conquistas gamificadas
- ✅ Sistema completo de pontos e ranking
- ✅ APIs REST completas
- ✅ Banco de dados estruturado
- ✅ Componentes modulares e reutilizáveis
- ✅ Código TypeScript 100% tipado
- ✅ Animações suaves e profissionais

---

**Desenvolvido com 💜 e muita ✨ magia!**

🚀 **Status**: Pronto para arrasar!
