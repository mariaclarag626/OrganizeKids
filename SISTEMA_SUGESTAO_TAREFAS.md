# 💡 Sistema de Sugestão de Tarefas

## 🎯 Visão Geral

Agora as crianças podem **sugerir tarefas** que gostariam de fazer! Os pais avaliam e podem aprovar, recusar ou ajustar os pontos.

---

## ✨ Como Funciona (Para Crianças)

### 1. Acessar Sugestão
- Entre no Dashboard Kids
- Vá na aba **"Tarefas"**
- Clique no botão **"💡 Sugerir Tarefa"**

### 2. Preencher Formulário
**Campos:**
- **Nome da Tarefa*** (obrigatório, máx 50 caracteres)
  - Ex: "Organizar meu armário"
  - Ex: "Lavar o carro"
  
- **Descrição** (opcional, máx 200 caracteres)
  - O que você vai fazer
  - Detalhes da tarefa
  
- **Pontos Sugeridos** (5 a 50 pontos)
  - Use os botões + e − para ajustar
  - Pais podem mudar ao aprovar

### 3. Enviar
- Clique em **"Enviar Sugestão"**
- Mensagem de confirmação aparece
- Aguarde aprovação dos pais

---

## 👨‍👩‍👧 Como Funciona (Para Pais)

### Dashboard dos Pais (Em Desenvolvimento)
Os pais verão uma seção **"Sugestões Pendentes"** com:

```
┌─────────────────────────────────────────────────────┐
│ 💡 Sugestões de Tarefas (3 pendentes)              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Organizar meu armário                              │
│ Sugerido por: Maria Clara                          │
│ Pontos sugeridos: 15                                │
│                                                     │
│ [Aprovar] [Ajustar Pontos] [Recusar]              │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Lavar o carro                                       │
│ Sugerido por: João Pedro                           │
│ Pontos sugeridos: 25                                │
│                                                     │
│ [Aprovar] [Ajustar Pontos] [Recusar]              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Ações dos Pais:

#### ✅ Aprovar
- Tarefa vira tarefa normal
- Criança pode realizar
- Usa pontos sugeridos (ou ajustados)

#### 📝 Ajustar Pontos
- Manter tarefa mas mudar pontuação
- Ex: Criança sugeriu 50, pai ajusta para 20
- Explica motivo do ajuste

#### ❌ Recusar
- Tarefa não é criada
- Pode adicionar motivo
- Ex: "Já fizemos essa semana"

---

## 🗄️ Estrutura no Banco de Dados

### Tabela: `task_suggestions`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único da sugestão |
| `household_id` | UUID | Família da criança |
| `suggested_by` | UUID | ID da criança que sugeriu |
| `title` | VARCHAR(255) | Nome da tarefa |
| `description` | TEXT | Descrição (opcional) |
| `points_suggested` | INTEGER | Pontos que a criança sugeriu |
| `status` | VARCHAR(50) | 'pending', 'approved', 'rejected' |
| `reviewed_by` | UUID | Pai/mãe que avaliou |
| `review_notes` | TEXT | Motivo da decisão |
| `points_approved` | INTEGER | Pontos finais (se aprovado) |
| `created_at` | TIMESTAMP | Quando foi sugerida |
| `reviewed_at` | TIMESTAMP | Quando foi avaliada |

### Status da Sugestão:
- **pending**: Aguardando avaliação dos pais
- **approved**: Aprovada, virou tarefa
- **rejected**: Recusada pelos pais

---

## 📡 API Endpoints

### POST `/api/tasks/suggest`
Criar nova sugestão de tarefa

**Body:**
```json
{
  "householdId": "uuid-da-familia",
  "userId": "uuid-da-crianca",
  "title": "Organizar meu armário",
  "description": "Dobrar roupas e organizar por cores",
  "pointsSuggested": 15
}
```

**Response:**
```json
{
  "success": true,
  "suggestion": { /* dados da sugestão */ },
  "message": "Sugestão enviada com sucesso!"
}
```

### GET `/api/tasks/suggest?householdId=xxx&status=pending`
Listar sugestões de uma família

**Response:**
```json
{
  "suggestions": [
    {
      "id": "uuid",
      "title": "Organizar meu armário",
      "suggestedBy": { "name": "Maria Clara" },
      "pointsSuggested": 15,
      "status": "pending",
      "createdAt": "2025-10-12T10:30:00Z"
    }
  ]
}
```

---

## 🎨 Interface do Modal

### Design Limpo e Natural
- ✅ Fundo branco com bordas arredondadas
- ✅ Título claro: "Sugerir Tarefa"
- ✅ Texto explicativo: "Sugira uma tarefa que você gostaria de fazer!"
- ✅ Campos organizados verticalmente
- ✅ Botões + e − para ajustar pontos
- ✅ Validação antes de enviar

### Campos do Formulário:
```
┌─────────────────────────────────────────┐
│  💡 Sugerir Tarefa                   ✕  │
├─────────────────────────────────────────┤
│                                         │
│ Sugira uma tarefa que você gostaria    │
│ de fazer! Seus pais vão avaliar.       │
│                                         │
│ Nome da Tarefa *                        │
│ ┌─────────────────────────────────────┐ │
│ │ Ex: Organizar meu armário           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Descrição (opcional)                    │
│ ┌─────────────────────────────────────┐ │
│ │ O que você vai fazer?               │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Pontos Sugeridos                        │
│      [−]      15      [+]               │
│              pontos                     │
│ Seus pais podem ajustar os pontos      │
│                                         │
│ [Cancelar]  [Enviar Sugestão]          │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 Fluxo Completo

### Passo a Passo:

1. **Criança Sugere**
   ```
   Maria Clara entra no dashboard
   → Clica "Sugerir Tarefa"
   → Preenche: "Organizar meu armário", 15 pontos
   → Envia
   ```

2. **Salvo no Banco**
   ```
   Status: pending
   Aguardando revisão
   ```

3. **Pai Avalia** (Dashboard dos Pais)
   ```
   Pai vê sugestão
   → Decide aprovar com 15 pontos
   → Clica "Aprovar"
   ```

4. **Tarefa Criada**
   ```
   Nova tarefa aparece no Dashboard Kids
   Maria Clara pode realizar
   Ganha 15 pontos ao completar
   ```

---

## 💡 Benefícios do Sistema

### Para as Crianças:
- ✅ **Proatividade**: Podem sugerir o que querem fazer
- ✅ **Participação**: Sentem-se ouvidas e valorizadas
- ✅ **Responsabilidade**: Aprendem a avaliar dificuldade vs pontos
- ✅ **Engajamento**: Mais motivadas a realizar tarefas

### Para os Pais:
- ✅ **Controle**: Aprovam ou recusam cada sugestão
- ✅ **Flexibilidade**: Podem ajustar pontuação
- ✅ **Insights**: Veem o que as crianças querem fazer
- ✅ **Educação**: Oportunidade de ensinar sobre valor do trabalho

### Para a Família:
- ✅ **Comunicação**: Mais diálogo sobre responsabilidades
- ✅ **Transparência**: Sistema claro e justo
- ✅ **Colaboração**: Todos participam da organização
- ✅ **Motivação**: Crianças mais engajadas

---

## 🚀 Status de Implementação

### ✅ Concluído:
- [x] Modal de sugestão no Dashboard Kids
- [x] Formulário com validação
- [x] Botões + e − para ajustar pontos
- [x] Tabela `task_suggestions` no banco
- [x] API POST `/api/tasks/suggest`
- [x] API GET para listar sugestões
- [x] Integração com o dashboard

### 🔜 Próximos Passos:
- [ ] Dashboard dos Pais
- [ ] Interface de aprovação/recusa
- [ ] Sistema de ajuste de pontos
- [ ] Notificações para pais (nova sugestão)
- [ ] Notificações para crianças (aprovada/recusada)
- [ ] Histórico de sugestões
- [ ] Estatísticas (% aprovação, etc)

---

## 🧪 Como Testar

### Teste Básico:
1. Abra: `http://localhost:3000/dashboard/kids`
2. Clique em **"💡 Sugerir Tarefa"**
3. Preencha:
   - Título: "Lavar a louça"
   - Descrição: "Lavar, secar e guardar"
   - Pontos: 20
4. Clique **"Enviar Sugestão"**
5. Veja mensagem de confirmação

### Verificar no Console:
```javascript
// A API será chamada e retornará:
{
  success: true,
  suggestion: { /* dados salvos */ },
  message: "Sugestão enviada com sucesso!"
}
```

---

## 💭 Ideias Futuras

### Gamificação:
- 🏆 **Conquista**: "Sugeriu 10 tarefas"
- ⭐ **Bônus**: +5 pontos se pais aprovarem sem ajuste
- 📊 **Taxa de Aprovação**: Ver % de sugestões aprovadas

### Inteligência:
- 💡 Sugerir pontos baseado em tarefas similares
- 📈 Histórico: "Você já sugeriu isso 3x"
- 🎯 Recomendar tarefas que pais costumam aprovar

### Comunicação:
- 💬 Pais podem adicionar comentários
- 📧 Email quando sugestão for avaliada
- 🔔 Notificações push no app

---

**Implementado com ❤️ para promover responsabilidade e participação infantil!**
