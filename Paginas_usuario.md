# 🧩 Especificação: Páginas de Perfil do Usuário – OrganizeKids

Este documento descreve como devem ser construídas as **páginas de perfil** para cada papel do app: **Pais/Responsáveis**, **Adolescentes** e **Crianças**.  
O objetivo é manter uma base visual e estrutural comum, mas com **recursos específicos para cada público**.

---

## 🌐 Estrutura Geral

Cada conta tem uma rota `/perfil`, que renderiza automaticamente a variante certa conforme o `role` (`PARENT`, `TEEN`, `CHILD`).

Componentes base reutilizáveis:
- `ProfileHeader` → avatar, nome, badges, botão “Editar Perfil”
- `AccountCard` → dados da conta (email, id, data criação)
- `PreferencesCard` → tema, idioma, notificações
- Área dinâmica de conteúdo (depende do papel)

Layout recomendado:

---

## 🧑‍🎓 A) Perfil do Adolescente (modo “rede social”)

**Objetivo:** dar autonomia e um visual social e motivador.  
**Tom:** leve, moderno e personalizável.

### Seções principais
- **Bio e interesses** – texto curto (até 140 chars) + chips de tags
- **Metas e Rotinas**
  - Rotina de hoje (tarefas concluídas / pendentes)
  - Média de rotinas concluídas (7 e 30 dias)
  - Botões: *Criar meta* / *Ver calendário*
- **Conquistas e Pontos**
  - Cards de medalhas + barra de progresso
  - Saldo de pontos + histórico de recompensas
- **Privacidade**
  - Mostrar/ocultar nome real
  - Quem pode ver progresso (responsáveis / suporte)
- **Responsáveis vinculados**
  - Lista de responsáveis (nome + e-mail)
  - Botão *Solicitar novo vínculo* (QR ou código)

### Edições permitidas
- Nome, foto, bio, tema, idioma
- Alterar e-mail/senha
- Solicitar/desvincular responsável

### Interface
- Estilo rede social (feed mini, cards dinâmicos)
- Cores personalizáveis (tema selecionado)
- Feedbacks por conquistas e progresso

---

## 👩‍👧 B) Perfil dos Pais/Responsáveis (hub de gerenciamento)

**Objetivo:** gerenciar as contas das crianças e acompanhar progresso.  
**Tom:** painel de controle com visual limpo e organizado.

### Seções principais
- **Minhas crianças vinculadas**
  - Lista de perfis (avatar, nome, idade, status)
  - Botão *Adicionar criança* (convite QR ou código)
- **Painel de progresso**
  - Resumo diário (tarefas feitas/pendentes)
  - Tendência semanal
  - Alertas de inatividade (“2 dias sem concluir rotina”)
- **Gestão de tarefas**
  - Criar, editar ou excluir tarefas por criança
  - Configurar recompensas (pontos, prêmios)
- **Controles parentais**
  - Permissões do app infantil (chat, timer, limites)
  - Horários de uso
- **Comunicação**
  - Mensagens curtas (“Post-it” de incentivo)
  - Notificações push/e-mail
- **Conta do responsável**
  - E-mail principal
  - Adicionar co-responsável (outro pai/mãe/tutor)

### Edições permitidas
- Nome, foto, tema, idioma
- Gerenciar crianças vinculadas (criar, pausar, remover)
- Ajustar permissões e notificações

### Interface
- Cards de progresso + gráficos simples
- Navegação lateral com ícones (Crianças / Tarefas / Configurações)
- Foco em legibilidade e hierarquia de informação

---

## 🧒 C) Perfil da Criança (simples, lúdico e seguro)

**Objetivo:** tornar o uso divertido e intuitivo, sem dados sensíveis.  
**Tom:** colorido, gamificado, com elementos grandes.

### Seções principais
- **Avatar personalizado**
  - Editor com adesivos, molduras e cores
- **Meu dia**
  - Lista de tarefas do dia (botões grandes “Feito”)
  - Feedback visual e sonoro ao concluir tarefa
- **Conquistas**
  - Medalhas grandes com progressão simples
- **Conta (somente leitura)**
  - Nome/apelido
  - E-mail do responsável (texto fixo: “Se precisar de ajuda, chame seu responsável.”)

### Edições permitidas
- Trocar avatar (apenas via editor infantil)
- Alterar sons do app
- Nenhuma configuração sensível (sem e-mail, senha ou privacidade)

### Interface
- Layout com elementos grandes e animações suaves
- Modo paisagem opcional (tablets)
- Botões coloridos e acessíveis

---

## ⚙️ Permissões Resumidas

| Recurso                  | Criança | Adolescente | Pai/Resp. |
|---------------------------|---------|--------------|------------|
| Editar nome/foto          | ✔ (limitado) | ✔ | ✔ |
| Alterar e-mail/senha      | ✖ | ✔ | ✔ |
| Bio/interesses            | ✖ | ✔ | ✖ |
| Criar tarefas             | ✖ | ✔ (suas metas) | ✔ (para filhos) |
| Gerir crianças vinculadas | ✖ | ✖ | ✔ |
| Ver progresso             | ✔ (próprio) | ✔ (próprio) | ✔ (dos filhos) |
| Tema e idioma             | simples | completo | completo |

---

## 🧱 Sugestão de Estrutura React

/perfil
├─ ProfileLayout.tsx
├─ ProfileHeader.tsx
├─ AccountCard.tsx
├─ PreferencesCard.tsx
├─ AdolescentProfileArea.tsx
├─ ParentProfileArea.tsx
├─ ChildProfileArea.tsx
└─ components/
├─ AvatarUploader.tsx
├─ EditableField.tsx
├─ TaskList.tsx
├─ AchievementsGrid.tsx
├─ QRCodeDialog.tsx
└─ ParentalControlsPanel.tsx


---

## ✅ Critérios de Aceite
- Renderização condicional correta por tipo de usuário.  
- Edições e restrições respeitam as permissões.  
- Crianças nunca exibem e-mail próprio.  
- Dados salvos com sucesso via API `/api/profile` e `/api/children`.  
- Interface responsiva e acessível.

---

> ⚡ **Resumo rápido para devs**
> - Cada perfil é uma variação do mesmo layout base.  
> - Foco: simplicidade no infantil, personalização no adolescente, gestão completa no dos pais.  
> - Reaproveitar componentes, estilizar com Tailwind, garantir acessibilidade e segurança.
