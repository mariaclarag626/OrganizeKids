# 🌐 GUIA DE TESTES MANUAIS NO NAVEGADOR
**Data:** 13 de outubro de 2025  
**URL Base:** http://localhost:3000  
**Navegador:** Chrome/Firefox/Safari (qualquer)

---

## 📋 CHECKLIST INTERATIVO

### ✅ SETUP INICIAL
- [ ] Abrir http://localhost:3000 no navegador
- [ ] Abrir DevTools (F12) → Console para ver logs
- [ ] Verificar que não há erros em vermelho no console

---

## 🔐 PARTE 1: AUTENTICAÇÃO (15 min)

### 1️⃣ Teste de Signup (Novo Usuário)
```
URL: http://localhost:3000/signup
```

**Passos:**
1. [ ] Preencher Nome: `Teste Maria`
2. [ ] Preencher Email: `teste1@organizekids.com` (ou qualquer email único)
3. [ ] Preencher Senha: `senha123`
4. [ ] Clicar em "Create Account"
5. [ ] **VERIFICAR:** Redireciona para `/who-is-using?fromSignup=true`
6. [ ] **VERIFICAR:** Vê 3 opções: Teenagers, Parents, Kids
7. [ ] Abrir DevTools → Application → Local Storage
8. [ ] **VERIFICAR:** Tem `user_email = teste1@organizekids.com`

### 2️⃣ Teste de Seleção - TEENAGERS
1. [ ] Clicar no card **"Teenagers"**
2. [ ] **VERIFICAR:** Redireciona para `/dashboard/teenagers`
3. [ ] **VERIFICAR:** Local Storage agora tem `user_type = teenagers`
4. [ ] **VERIFICAR:** Dashboard carrega com header "Bem-vindo"
5. [ ] **VERIFICAR:** Vê 6 tabs: Overview, Tarefas, Metas, Carteira, Stats, Notificações

### 3️⃣ Teste de Logout e Login
1. [ ] Fazer logout (se houver botão) ou limpar localStorage
2. [ ] Ir para http://localhost:3000/login
3. [ ] Fazer login com `teste1@organizekids.com` / `senha123`
4. [ ] **VERIFICAR:** Vai direto para `/dashboard/teenagers` (sem passar por /who-is-using)

### 4️⃣ Teste de Seleção - PARENTS
1. [ ] Limpar localStorage ou usar navegador anônimo
2. [ ] Criar nova conta: `teste2@organizekids.com`
3. [ ] Selecionar **"Parents"**
4. [ ] **VERIFICAR:** Vai para `/dashboard/parents`
5. [ ] **VERIFICAR:** Vê dashboard diferente (tabs: Visão Geral, Tarefas, Rotinas, etc)

### 5️⃣ Teste de Seleção - KIDS
1. [ ] Criar nova conta: `teste3@organizekids.com`
2. [ ] Selecionar **"Kids"**
3. [ ] **VERIFICAR:** Vai para `/dashboard/kids` (NÃO `/dashboard/child` ← bug antigo)
4. [ ] **VERIFICAR:** Dashboard kids carrega

---

## 👨‍🎓 PARTE 2: DASHBOARD TEENAGERS (30 min)

**Login como teenager para estes testes**

### 📅 6️⃣ Teste do Calendário
```
Tab: Overview → Seção de Calendário
```

1. [ ] **VERIFICAR:** Vê header com mês atual: "outubro 2025"
2. [ ] **VERIFICAR:** Grid de 35 dias (5 linhas × 7 colunas)
3. [ ] **VERIFICAR:** Dia atual (13) tem borda dourada
4. [ ] **VERIFICAR:** Alguns dias têm bolinhas coloridas (indicators)
5. [ ] **VERIFICAR:** Legenda abaixo:
   - 🟡 Tarefa Pendente
   - 🟢 Tarefa Concluída
   - 🔵 Meta do Dia
   - 🔴 Evento Importante
6. [ ] Clicar botão "Próximo" (→)
7. [ ] **VERIFICAR:** Muda para "novembro 2025"
8. [ ] Clicar botão "Anterior" (←)
9. [ ] **VERIFICAR:** Volta para "outubro 2025"

**Screenshots para guardar:**
- [ ] Screenshot do calendário completo

### ⏱️ 7️⃣ Teste do Pomodoro Timer
```
Header → Widget roxo/rosa com relógio
```

1. [ ] **VERIFICAR:** Widget no header mostra "25:00"
2. [ ] **VERIFICAR:** Gradient roxo → rosa
3. [ ] Clicar no widget
4. [ ] **VERIFICAR:** Modal abre no centro da tela
5. [ ] **VERIFICAR:** Título: "Timer Pomodoro"
6. [ ] **VERIFICAR:** Progress circle (SVG circular)
7. [ ] **VERIFICAR:** Texto grande "25:00"
8. [ ] **VERIFICAR:** Modo: "Trabalho (25min)"
9. [ ] Clicar botão **"▶️ Iniciar"**
10. [ ] **VERIFICAR:** Timer começa countdown (25:00 → 24:59 → 24:58...)
11. [ ] **VERIFICAR:** Círculo de progresso vai diminuindo (animação smooth)
12. [ ] **VERIFICAR:** Botão muda para "⏸ Pausar"
13. [ ] Aguardar ~5 segundos
14. [ ] Clicar **"⏸ Pausar"**
15. [ ] **VERIFICAR:** Timer para (ex: em 24:54)
16. [ ] Clicar **"▶️ Continuar"**
17. [ ] **VERIFICAR:** Timer retoma de onde parou
18. [ ] Clicar **"🔄 Reiniciar"**
19. [ ] **VERIFICAR:** Volta para 25:00
20. [ ] Clicar fora do modal (background escuro)
21. [ ] **VERIFICAR:** Modal fecha
22. [ ] Iniciar timer novamente
23. [ ] Fechar modal
24. [ ] **VERIFICAR:** Timer continua rodando (widget atualiza)

**TESTE COMPLETO (Opcional - 25 min):**
- [ ] Deixar timer rodar 25 minutos completos
- [ ] **VERIFICAR:** Alert/notificação quando terminar
- [ ] **VERIFICAR:** Muda automaticamente para "Intervalo (5min)"

**Screenshots:**
- [ ] Modal do Pomodoro com timer rodando
- [ ] Progress circle em ~50%

### 📚 8️⃣ Teste de Tarefas Escolares
```
Tab: Tarefas Escolares (ou School Tasks)
```

1. [ ] Clicar na tab "Tarefas Escolares"
2. [ ] **VERIFICAR:** 6 botões de filtro no topo:
   - Todos
   - 📐 Matemática (gradient laranja/vermelho)
   - 📖 Português (gradient azul/roxo)
   - 🏛️ História (gradient âmbar)
   - 🧪 Química (gradient verde)
   - 🌍 Inglês (gradient azul)
3. [ ] **VERIFICAR:** 5 tarefas mostradas (filtro "Todos" ativo)
4. [ ] Clicar em **"📐 Matemática"**
5. [ ] **VERIFICAR:** Mostra apenas 1 tarefa: "Exercícios de Álgebra"
6. [ ] **VERIFICAR:** Ícone 📝 (Dever de Casa)
7. [ ] Clicar em **"📖 Português"**
8. [ ] **VERIFICAR:** Mostra 2 tarefas: "Leitura de Machado" e "Redação Dissertativa"
9. [ ] **VERIFICAR:** Ícones: 📚 (Leitura) e 📝 (Dever)
10. [ ] Clicar em **"Todos"**
11. [ ] **VERIFICAR:** Volta a mostrar todas as 5 tarefas
12. [ ] Clicar no **checkbox** de uma tarefa
13. [ ] **VERIFICAR:** Tarefa vai para seção "Tarefas Concluídas" (abaixo)
14. [ ] **VERIFICAR:** Título fica riscado (line-through)
15. [ ] **VERIFICAR:** Card fica com opacidade 60%
16. [ ] Clicar novamente no checkbox
17. [ ] **VERIFICAR:** Tarefa volta para "Tarefas Pendentes"

**Verificar todas as tarefas:**
- [ ] Matemática - Exercícios de Álgebra (📝 Dever)
- [ ] Português - Leitura de Machado (📚 Leitura)
- [ ] Português - Redação Dissertativa (📝 Dever)
- [ ] História - Pesquisa sobre Brasil Colônia (🎯 Projeto)
- [ ] Química - Estudar Tabela Periódica (📖 Teste)

**Screenshots:**
- [ ] Filtro "Todos" com 5 tarefas
- [ ] Filtro por matéria (ex: Português)
- [ ] Tarefa concluída (riscada)

### 🔔 9️⃣ Teste de Notificações
```
Tab: Notificações (ícone 🔔)
```

1. [ ] Clicar na tab **"Notificações"**
2. [ ] **VERIFICAR:** Componente "Configurações de Notificações" carrega
3. [ ] **VERIFICAR:** Status de permissão mostrado:
   - **Se amarelo:** "⚠️ Não configurado" → botão "Ativar Notificações"
   - **Se verde:** "✅ Notificações Ativadas"
   - **Se vermelho:** "❌ Notificações Bloqueadas" → instruções

**Caso 1: Permissão não configurada (amarelo)**
4. [ ] Clicar em **"Ativar Notificações"**
5. [ ] **VERIFICAR:** Popup do navegador aparece pedindo permissão
6. [ ] Clicar **"Permitir"** no popup
7. [ ] **VERIFICAR:** Status muda para verde "✅ Notificações Ativadas"
8. [ ] Clicar em **"Testar Notificação"**
9. [ ] **VERIFICAR:** Notificação do sistema aparece:
   - Título: "🎯 OrganizeKids"
   - Mensagem: "Sistema de notificações funcionando!"

**Caso 2: Permissão bloqueada (vermelho)**
10. [ ] Se bloqueado, seguir instruções na tela
11. [ ] Ir nas configurações do navegador → Notificações
12. [ ] Permitir para localhost:3000

**Teste dos Toggles:**
13. [ ] **VERIFICAR:** 4 toggles disponíveis:
    - ⏰ Tarefas pendentes (lembrete 1h antes)
    - 🌅 Rotina matinal (7:00)
    - 🌙 Rotina noturna (20:00)
    - 🏆 Conquistas
14. [ ] Clicar em cada toggle
15. [ ] **VERIFICAR:** Animação smooth (azul → cinza, cinza → azul)
16. [ ] **VERIFICAR:** Checkmark ✓ aparece quando ativado

**Screenshots:**
- [ ] Status "Ativadas" (verde)
- [ ] Notificação do sistema (quando testar)
- [ ] Toggles ativados

---

## 👨‍👩‍👧 PARTE 3: DASHBOARD PARENTS (30 min)

**Login como parent para estes testes**

### 🌅 1️⃣0️⃣ Teste de Rotinas - Templates Matinais
```
Tab: Rotinas
```

1. [ ] Ir para tab **"Rotinas"**
2. [ ] **VERIFICAR:** Seção "Templates de Rotinas"
3. [ ] **VERIFICAR:** 3 cards de rotinas matinais:
   - 🌅 **Rotina Escolar Completa** (9 tarefas)
   - ☀️ **Manhã de Fim de Semana** (6 tarefas)
   - 🧼 **Higiene Matinal** (6 tarefas)
4. [ ] Hover sobre cada card
5. [ ] **VERIFICAR:** Scale effect (aumenta levemente)
6. [ ] Clicar em **"Adicionar"** na "Rotina Escolar Completa"
7. [ ] **VERIFICAR:** Toast de sucesso aparece: "Rotina adicionada!"
8. [ ] **VERIFICAR:** Rotina aparece em "Minhas Rotinas" (seção acima)

**Verificar conteúdo da rotina:**
9. [ ] **VERIFICAR:** Título: "Rotina Escolar Completa"
10. [ ] **VERIFICAR:** 9 itens numerados (1., 2., 3...):
    1. Acordar no horário (6:30)
    2. Fazer a cama
    3. Escovar os dentes
    4. Tomar banho
    5. Vestir uniforme
    6. Tomar café da manhã
    7. Arrumar mochila
    8. Conferir material escolar
    9. Ir para a escola
11. [ ] **VERIFICAR:** Progress circle no canto (0% - azul)
12. [ ] **VERIFICAR:** Botões: "🔄 Resetar" e "🗑️ Excluir"

### 🌙 1️⃣1️⃣ Teste de Rotinas - Templates Noturnos
```
Mesma tab, scroll para baixo
```

1. [ ] Scroll para templates noturnos
2. [ ] **VERIFICAR:** 3 cards de rotinas noturnas:
   - 🌙 **Preparar para Dormir** (9 tarefas)
   - 📚 **Rotina de Lição de Casa** (7 tarefas)
   - 🧘 **Fim de Dia Relaxante** (8 tarefas)
3. [ ] Clicar em **"Adicionar"** em "Preparar para Dormir"
4. [ ] **VERIFICAR:** Toast de sucesso
5. [ ] **VERIFICAR:** Aparece em "Minhas Rotinas"

**Verificar conteúdo:**
6. [ ] **VERIFICAR:** 9 tarefas:
    1. Jantar em família
    2. Guardar brinquedos
    3. Tomar banho
    4. Vestir pijama
    5. Escovar os dentes
    6. Preparar uniforme do dia seguinte
    7. Ler um livro
    8. Conversar sobre o dia
    9. Dormir no horário (21:00)

### ✅ 1️⃣2️⃣ Teste do Checklist Interativo
```
Usar rotina "Rotina Escolar Completa" adicionada
```

1. [ ] Clicar no **checkbox** do item 1 ("Acordar no horário")
2. [ ] **VERIFICAR:** Item fica verde com ✓
3. [ ] **VERIFICAR:** Número muda de azul para verde
4. [ ] **VERIFICAR:** Progress circle atualiza: 11% (1/9)
5. [ ] Clicar checkboxes dos itens 2, 3, 4
6. [ ] **VERIFICAR:** Progress aumenta: 22%, 33%, 44%
7. [ ] **VERIFICAR:** Cor do círculo continua azul
8. [ ] Completar TODOS os 9 itens
9. [ ] **VERIFICAR:** Progress circle = 100%
10. [ ] **VERIFICAR:** Círculo muda de azul para VERDE
11. [ ] **VERIFICAR:** Mensagem aparece: "🎉 Rotina Completa! Parabéns!"
12. [ ] **VERIFICAR:** Fundo verde na mensagem de celebração
13. [ ] Hover sobre mensagem
14. [ ] **VERIFICAR:** Scale effect

**Animações:**
15. [ ] **VERIFICAR:** Progress circle anima smooth (stroke-dashoffset)
16. [ ] **VERIFICAR:** Checkboxes têm transition

### 🔄 1️⃣3️⃣ Teste de Reset e Delete
```
Mesma rotina completa
```

1. [ ] Clicar no botão **"🔄 Resetar"**
2. [ ] **VERIFICAR:** Todos os checkboxes voltam desmarcados
3. [ ] **VERIFICAR:** Items voltam para azul
4. [ ] **VERIFICAR:** Progress circle volta para 0%
5. [ ] **VERIFICAR:** Mensagem de celebração some
6. [ ] Marcar alguns itens novamente (ex: 3 itens)
7. [ ] Clicar em **"🗑️ Excluir"**
8. [ ] **VERIFICAR:** Toast: "Rotina excluída"
9. [ ] **VERIFICAR:** Rotina é removida de "Minhas Rotinas"

### 🆕 1️⃣4️⃣ Teste de Múltiplas Rotinas
```
Adicionar várias rotinas
```

1. [ ] Adicionar "Rotina Escolar Completa"
2. [ ] Adicionar "Manhã de Fim de Semana"
3. [ ] Adicionar "Preparar para Dormir"
4. [ ] **VERIFICAR:** 3 rotinas em "Minhas Rotinas"
5. [ ] Completar itens da rotina 1
6. [ ] **VERIFICAR:** Rotinas 2 e 3 não são afetadas
7. [ ] Marcar itens de diferentes rotinas
8. [ ] **VERIFICAR:** Cada rotina tem seu próprio progresso independente

**Screenshots:**
- [ ] 3 rotinas ativas ao mesmo tempo
- [ ] Progress circles com valores diferentes
- [ ] Rotina 100% completa com celebração

---

## 🔗 PARTE 4: TESTES DE INTEGRAÇÃO (15 min)

### 1️⃣5️⃣ Navegação Entre Dashboards
1. [ ] Login como teenager
2. [ ] Navegar por todas as 6 tabs
3. [ ] **VERIFICAR:** Todas funcionam
4. [ ] Logout
5. [ ] Login como parent
6. [ ] **VERIFICAR:** Dashboard completamente diferente
7. [ ] **VERIFICAR:** Sem dados cruzados

### 1️⃣6️⃣ Teste de Persistência
1. [ ] Marcar algumas tarefas como concluídas
2. [ ] Iniciar Pomodoro
3. [ ] Apertar **F5** (refresh)
4. [ ] **VERIFICAR:** Ainda está logado
5. [ ] **LIMITAÇÃO CONHECIDA:** Dados mockados não persistem (esperado)

### 1️⃣7️⃣ Teste de Responsividade
1. [ ] Abrir DevTools (F12)
2. [ ] Toggle device toolbar (Ctrl+Shift+M)
3. [ ] Testar em **Mobile** (375px):
   - [ ] Calendário adapta (menos dias por linha)
   - [ ] Pomodoro modal centralizado
   - [ ] Cards de rotinas stackeiam verticalmente
   - [ ] Tabs funcionam (scroll horizontal?)
4. [ ] Testar em **Tablet** (768px):
   - [ ] Layout intermediário
   - [ ] Tudo legível
5. [ ] Testar em **Desktop** (1920px):
   - [ ] Layout completo
   - [ ] Espaçamento adequado

### 1️⃣8️⃣ Teste Visual
1. [ ] **VERIFICAR:** Tema espacial/galáxia consistente em todas as páginas
2. [ ] **VERIFICAR:** Gradients funcionando:
   - Roxo → Rosa (Pomodoro)
   - Azul → Roxo (Cards)
   - Laranja → Vermelho (Matemática)
   - Verde (Química)
3. [ ] **VERIFICAR:** Hover effects (scale, brightness)
4. [ ] **VERIFICAR:** Glassmorphism (backdrop-blur)
5. [ ] **VERIFICAR:** Animations smooth (transitions)

---

## 🐛 PARTE 5: TESTES DE ERROS (10 min)

### 1️⃣9️⃣ Console Errors
1. [ ] Abrir Console (F12)
2. [ ] Navegar por TODAS as páginas
3. [ ] **VERIFICAR:** 0 errors em vermelho
4. [ ] **ACEITÁVEL:** Alguns warnings em amarelo

### 2️⃣0️⃣ Testes de Segurança
1. [ ] Fazer logout (limpar localStorage)
2. [ ] Tentar acessar: http://localhost:3000/dashboard/teenagers
3. [ ] **VERIFICAR:** Redireciona para /login (não deixa entrar)
4. [ ] Login
5. [ ] No localStorage, mudar `user_type` para "hacker"
6. [ ] Tentar acessar dashboards
7. [ ] **VERIFICAR:** Sistema lida corretamente

### 2️⃣1️⃣ Testes de Formulários
1. [ ] Signup sem preencher campos
2. [ ] **VERIFICAR:** Validação funciona
3. [ ] Login com senha errada
4. [ ] **VERIFICAR:** Mensagem de erro apropriada

---

## 📊 RELATÓRIO FINAL

### ✅ Checklist de Sucesso

**Autenticação (5 testes):**
- [ ] Signup funciona
- [ ] Seleção de tipo funciona (teenagers/parents/kids)
- [ ] Login funciona
- [ ] Redirecionamento correto
- [ ] Bug 'child' vs 'kids' resolvido

**Dashboard Teenagers (4 features):**
- [ ] Calendário 35 dias com indicators
- [ ] Pomodoro timer 25min/5min
- [ ] School tasks com filtros por matéria
- [ ] Notificações com permissões

**Dashboard Parents (1 feature):**
- [ ] Rotinas com 6 templates
- [ ] Checklist interativo
- [ ] Progress circle animado
- [ ] Reset e delete funcionam

**Integração:**
- [ ] Navegação entre dashboards
- [ ] Visual consistente
- [ ] Responsivo
- [ ] Sem erros críticos

---

## 🎯 RESULTADO ESPERADO

✅ **PASS:** 21/21 testes manuais  
✅ **PASS:** 22/23 testes automatizados (95%)  
✅ **TOTAL:** 43/44 testes (97.7% sucesso)

---

## 📝 PRÓXIMOS PASSOS

Se todos os testes passarem:

1. **Commit Final**
   ```bash
   git add .
   git commit -m "feat: Sprint MANHÃ+TARDE+NOITE completo - 7 features"
   ```

2. **Backend Integration**
   - Conectar APIs
   - Persistência real

3. **Parent Approval System**
   - Sistema de aprovação

4. **Production Deploy**
   - Build otimizado
   - Deploy em produção

---

**Testado por:** _________  
**Data:** 13/10/2025  
**Tempo total:** ~100 min  
**Status:** ⏳ AGUARDANDO
