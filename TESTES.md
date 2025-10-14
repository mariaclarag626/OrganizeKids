# 🧪 PLANO DE TESTES - OrganizeKids
**Data:** 13 de outubro de 2025
**Sprint:** MANHÃ + TARDE + NOITE (7 features)

---

## 1️⃣ TESTES DE AUTENTICAÇÃO

### ✅ Teste 1.1: Signup Novo Usuário
- [ ] Acessar http://localhost:3000/signup
- [ ] Preencher: nome, email novo, senha
- [ ] Verificar redirecionamento para /who-is-using?fromSignup=true
- [ ] Verificar que localStorage tem user_email
- [ ] Verificar que tela mostra 3 opções sem verificação

### ✅ Teste 1.2: Seleção de Tipo (Teenagers)
- [ ] Clicar em "Teenagers"
- [ ] Verificar redirecionamento para /dashboard/teenagers
- [ ] Verificar que localStorage tem user_type="teenagers"
- [ ] Verificar que dashboard carrega corretamente

### ✅ Teste 1.3: Seleção de Tipo (Parents)
- [ ] Criar nova conta
- [ ] Clicar em "Parents"
- [ ] Verificar redirecionamento para /dashboard/parents
- [ ] Verificar que localStorage tem user_type="parents"

### ✅ Teste 1.4: Seleção de Tipo (Kids)
- [ ] Criar nova conta
- [ ] Clicar em "Kids"
- [ ] Verificar redirecionamento para /dashboard/kids
- [ ] Verificar que localStorage tem user_type="kids"
- [ ] **CRÍTICO**: Verificar que não vai para /dashboard/child (bug antigo)

### ✅ Teste 1.5: Login Existente
- [ ] Acessar /login
- [ ] Logar com conta existente
- [ ] Verificar que vai direto para dashboard correto (sem passar por /who-is-using)

---

## 2️⃣ TESTES DE DASHBOARD TEENAGERS

### 📅 Teste 2.1: Calendário
- [ ] Acessar dashboard teenagers
- [ ] Tab "Overview" - verificar calendário na seção
- [ ] Verificar grid de 35 dias visível
- [ ] Verificar mês atual mostrado (outubro 2025)
- [ ] Verificar dias com indicadores coloridos (tarefas)
- [ ] Verificar legenda (Tarefa Pendente 🟡, Tarefa Concluída 🟢, Meta do Dia 🔵, Evento Importante 🔴)
- [ ] Clicar em "Próximo" - verificar mudança de mês
- [ ] Clicar em "Anterior" - verificar volta ao mês anterior
- [ ] Verificar que dia atual tem borda dourada

### ⏱️ Teste 2.2: Pomodoro Timer
- [ ] Verificar widget no header (roxo/rosa gradient)
- [ ] Verificar que mostra "25:00"
- [ ] Clicar no widget - verificar que modal abre
- [ ] Verificar circular progress (SVG)
- [ ] Clicar "▶️ Iniciar" - verificar countdown começando
- [ ] Verificar que tempo diminui (25:00 → 24:59 → 24:58...)
- [ ] Verificar progresso circular atualizando
- [ ] Clicar "⏸ Pausar" - verificar que para
- [ ] Clicar "▶️ Continuar" - verificar que retoma
- [ ] Clicar "🔄 Reiniciar" - verificar que volta para 25:00
- [ ] Fechar modal - verificar que timer continua rodando
- [ ] Reabrir modal - verificar que mostra tempo correto
- [ ] **Aguardar 25min** (ou reduzir tempo em code) - verificar alert de completado
- [ ] Verificar que muda para modo "Intervalo" (5min)

### 📚 Teste 2.3: Tarefas Escolares
- [ ] Clicar na tab "Tarefas Escolares"
- [ ] Verificar 5 botões de filtro: "Todos", "Matemática", "Português", "História", "Química", "Inglês"
- [ ] Clicar em "Matemática" - verificar que mostra só tarefas de matemática
- [ ] Clicar em "Português" - verificar filtro
- [ ] Clicar em "Todos" - verificar que mostra todas as 5 tarefas
- [ ] Verificar cards com gradient por matéria
- [ ] Verificar ícones por tipo: 📝 Dever, 📖 Teste, 🎯 Projeto, 📚 Leitura
- [ ] Clicar checkbox de uma tarefa - verificar que vai para "Concluídas"
- [ ] Verificar seção "Tarefas Concluídas" com tarefa riscada
- [ ] Clicar checkbox novamente - verificar que volta para pendentes

### 🔔 Teste 2.4: Notificações
- [ ] Clicar na tab "Notificações"
- [ ] Verificar componente NotificationSettings carregando
- [ ] Verificar status de permissão:
  - Se "Não configurado" → ver botão amarelo "Ativar Notificações"
  - Se "Ativadas" → ver status verde
  - Se "Bloqueadas" → ver status vermelho com instruções
- [ ] Clicar "Ativar Notificações" - verificar popup do navegador
- [ ] Clicar "Permitir" no navegador
- [ ] Verificar que status muda para "Ativadas" (verde)
- [ ] Clicar "Testar Notificação" - verificar notificação do sistema aparece
- [ ] Verificar 4 toggles de lembretes:
  - Tarefas pendentes (1h antes)
  - Rotina matinal (7:00)
  - Rotina noturna (20:00)
  - Conquistas
- [ ] Ativar/desativar toggles - verificar animação

---

## 3️⃣ TESTES DE DASHBOARD PARENTS

### 🌅 Teste 3.1: Rotinas - Templates Matinais
- [ ] Login como parent
- [ ] Ir para tab "Rotinas"
- [ ] Verificar 3 cards de templates matinais:
  - **Rotina Escolar Completa** (9 tarefas)
  - **Manhã de Fim de Semana** (6 tarefas)
  - **Higiene Matinal** (6 tarefas)
- [ ] Clicar "Adicionar" em "Rotina Escolar Completa"
- [ ] Verificar toast de sucesso
- [ ] Verificar rotina aparece na seção "Minhas Rotinas"
- [ ] Verificar checklist com 9 itens numerados (1., 2., 3...)
- [ ] Verificar progress circle (0% - azul)

### 🌙 Teste 3.2: Rotinas - Templates Noturnos
- [ ] Verificar 3 cards de templates noturnos:
  - **Preparar para Dormir** (9 tarefas)
  - **Rotina de Lição de Casa** (7 tarefas)
  - **Fim de Dia Relaxante** (8 tarefas)
- [ ] Adicionar "Preparar para Dormir"
- [ ] Verificar aparece em "Minhas Rotinas"

### ✅ Teste 3.3: Rotinas - Checklist Interativo
- [ ] Na rotina adicionada, clicar checkbox do item 1
- [ ] Verificar que item fica verde com ✓
- [ ] Verificar que progress circle aumenta (11% = 1/9)
- [ ] Clicar mais checkboxes
- [ ] Verificar progresso atualizando (22%, 33%, etc)
- [ ] Completar todos os itens
- [ ] Verificar progress circle = 100% (verde)
- [ ] Verificar mensagem de celebração: "🎉 Rotina Completa!"
- [ ] Verificar fundo verde na mensagem

### 🔄 Teste 3.4: Rotinas - Reset e Delete
- [ ] Clicar botão "🔄 Resetar"
- [ ] Verificar todos checkboxes voltam para desmarcados
- [ ] Verificar progress circle volta para 0%
- [ ] Clicar botão "🗑️ Excluir"
- [ ] Verificar rotina é removida

### 🆕 Teste 3.5: Rotinas - Múltiplas
- [ ] Adicionar 3 rotinas diferentes
- [ ] Verificar todas aparecem em "Minhas Rotinas"
- [ ] Completar uma rotina
- [ ] Verificar que outras não são afetadas
- [ ] Verificar hover scale effect nos cards

---

## 4️⃣ TESTES DE INTEGRAÇÃO

### 🔗 Teste 4.1: Navegação Entre Dashboards
- [ ] Login como teenager
- [ ] Navegar pelas 6 tabs
- [ ] Logout
- [ ] Login como parent
- [ ] Verificar dashboard diferente
- [ ] Verificar que dados não cruzam

### 💾 Teste 4.2: Persistência (localStorage)
- [ ] Marcar tarefas como concluídas
- [ ] Iniciar Pomodoro
- [ ] Atualizar página (F5)
- [ ] Verificar que ainda está logado
- [ ] **LIMITAÇÃO**: Dados mockados não persistem (esperado)

### 📱 Teste 4.3: Responsividade
- [ ] Abrir DevTools (F12)
- [ ] Mudar para mobile view (375px)
- [ ] Verificar calendário adapta
- [ ] Verificar Pomodoro modal centralizado
- [ ] Verificar cards de rotinas stackeiam
- [ ] Testar em tablet (768px)

### 🎨 Teste 4.4: Visual & Animações
- [ ] Verificar tema espacial/galáxia consistente
- [ ] Verificar gradients (roxo/rosa, azul/roxo, etc)
- [ ] Hover nos cards - verificar scale
- [ ] Verificar circular progress smooth
- [ ] Verificar transitions nos toggles
- [ ] Verificar glassmorphism effects

---

## 5️⃣ TESTES DE ERROS

### ❌ Teste 5.1: Compilação
- [ ] `npm run build` - verificar sem erros TypeScript
- [ ] Verificar 0 erros de lint
- [ ] Verificar bundle size razoável

### 🐛 Teste 5.2: Console Errors
- [ ] Abrir console (F12)
- [ ] Navegar por todas as pages
- [ ] Verificar 0 errors no console
- [ ] Verificar warnings (podem ter alguns)

### 🔒 Teste 5.3: Segurança
- [ ] Tentar acessar /dashboard/teenagers sem login
- [ ] Verificar redirecionamento para /login
- [ ] Verificar que userType é obrigatório

---

## 📊 RESULTADOS ESPERADOS

### ✅ Critérios de Sucesso
- [ ] Todos os 7 features funcionando
- [ ] 0 erros de compilação
- [ ] 0 erros críticos no console
- [ ] Autenticação funciona 100%
- [ ] Calendário mostra 35 dias + indicators
- [ ] Pomodoro conta 25min → 5min
- [ ] School tasks filtram por matéria
- [ ] 6 templates de rotinas funcionam
- [ ] Notificações solicitam permissão
- [ ] Visual consistente (tema espacial)

### 🚧 Limitações Conhecidas
- [ ] Dados mockados (não persistem após refresh)
- [ ] Backend não integrado (próxima sprint)
- [ ] Sistema de aprovação dos pais (futuro)
- [ ] Notificações agendadas (precisam de service worker)

---

## 🎯 PRÓXIMOS PASSOS (Se testes OK)

1. **Commit Final** - Salvar todas as alterações
2. **Backend Integration** - Conectar APIs e banco de dados
3. **Parent Approval System** - Implementar aprovação de tarefas
4. **Service Worker** - Notificações agendadas
5. **Achievements System** - Sistema de conquistas completo

---

**ASSINATURA DOS TESTES:**
- Testador: GitHub Copilot 🤖
- Data: 13 de outubro de 2025
- Status: ⏳ AGUARDANDO EXECUÇÃO
