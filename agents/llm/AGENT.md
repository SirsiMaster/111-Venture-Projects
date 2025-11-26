# LLM Agent
## Legacy - AI/Intelligence Domain

**Agent ID:** `llm`
**Status:** Active
**Owner:** Claude (Stack Leader)

---

## ⚠️ PRE-FLIGHT CHECKLIST (MUST COMPLETE BEFORE CODING)

Before making ANY changes in the LLM domain, verify:

1. **[ ] Read WARP.md** - Understand governance rules
2. **[ ] Check ALL other agents** - LLM depends on all domains
3. **[ ] Review current status** - Check "Implemented" section below
4. **[ ] Verify Vertex AI status** - API enabled? Quota available?
5. **[ ] Check knowledge base** - Is content up to date?
6. **[ ] Verify guardrails** - Safety filters in place?
7. **[ ] Check token costs** - Will this increase API spend significantly?

**Cross-Agent Context Requirements:**
- Auth Agent: User role, preferences, history
- Estate Agent: Phase, assets, deadlines, state
- Vault Agent: Document content for analysis
- Compliance Agent: State-specific rules, templates
- Notify Agent: Pending notifications, sent letters

**CRITICAL: All responses must include legal disclaimer. Never provide legal advice.**

---

## Mission
Provide intelligent, context-aware guidance through the estate settlement process using Vertex AI/Claude, including process recommendations, document analysis, Q&A support, and workflow optimization.

---

## Domain Ownership

### Firestore Collections
```
/conversations/{conversationId}
  - userId: string
  - estateId: string (optional)
  - context: {
      phase: string
      state: string
      recentActions: array
    }
  - messages: [{
      role: 'user' | 'assistant' | 'system'
      content: string
      timestamp: timestamp
      tokens: number
    }]
  - createdAt: timestamp
  - updatedAt: timestamp

/knowledge-base/{articleId}
  - category: 'process' | 'legal' | 'financial' | 'faq'
  - state: string (optional, for state-specific)
  - title: string
  - content: string
  - embedding: vector (for semantic search)
  - tags: [string]
  - sources: [string]
  - createdAt: timestamp
  - updatedAt: timestamp

/recommendations/{recommendationId}
  - userId: string
  - estateId: string
  - type: 'next_action' | 'document_needed' | 'deadline_warning' | 'optimization'
  - title: string
  - description: string
  - priority: 'high' | 'medium' | 'low'
  - actionUrl: string (deep link)
  - dismissed: boolean
  - completedAt: timestamp (optional)
  - createdAt: timestamp
```

### Firebase Services
- Vertex AI (Gemini models for generation)
- Claude API (fallback/comparison)
- Cloud Functions: `generateResponse`, `analyzeDocument`, `generateRecommendations`
- Vector Search (knowledge base retrieval)

### UI Components
```
/public/assistant/
  ├── chat.html             # Chat interface
  └── recommendations.html  # Smart suggestions

/public/components/llm/
  ├── chat-widget.js
  ├── chat-message.js
  ├── recommendation-card.js
  ├── typing-indicator.js
  └── context-panel.js
```

### Functions
```
/functions/src/llm/
  ├── generateResponse.ts    # Main chat handler
  ├── analyzeDocument.ts     # Document Q&A
  ├── generateRecommendations.ts
  ├── buildContext.ts        # Context assembly
  ├── searchKnowledge.ts     # RAG retrieval
  └── index.ts
```

---

## Patterns & Standards

### System Prompt (Core)
```
You are Legacy Assistant, an AI guide helping users navigate estate 
settlement. You provide clear, empathetic guidance while always 
reminding users that you are not providing legal advice.

Current context:
- User role: {{user.role}}
- Estate phase: {{estate.phase}}
- Estate state: {{estate.state}}
- Recent actions: {{context.recentActions}}

Guidelines:
1. Be empathetic - users are often grieving
2. Be clear and actionable
3. Always include relevant disclaimers
4. Reference state-specific rules when applicable
5. Suggest next steps proactively
```

### Context Assembly
For each request, build context from:
1. User profile (role, preferences)
2. Estate state (phase, assets, documents)
3. Recent activity (last 10 actions)
4. Relevant knowledge base articles (RAG)
5. State-specific rules
6. Current deadlines

### RAG Pipeline
1. User query → Generate embedding
2. Search knowledge base (cosine similarity)
3. Retrieve top 5 relevant articles
4. Include in context window
5. Generate response with citations

### Response Format
```json
{
  "response": "string (main answer)",
  "citations": [{ "title": "string", "articleId": "string" }],
  "nextActions": [{ "title": "string", "url": "string" }],
  "disclaimer": "string (legal disclaimer)"
}
```

### Document Analysis
When user asks about uploaded document:
1. Retrieve document from Vault
2. Extract OCR text
3. Build document-specific context
4. Answer questions about content
5. Suggest related actions

### Recommendation Engine
Trigger recommendations based on:
- Phase transitions
- Approaching deadlines
- Missing documents
- Incomplete tasks
- Optimization opportunities

### Token Management
- Max context: 8K tokens (Gemini 1.5 Flash)
- Max response: 1K tokens
- Conversation history: Last 10 messages
- Knowledge retrieval: 5 articles max

### Safety & Guardrails
- No legal advice (always disclaim)
- No financial advice (always disclaim)
- No PII in logs
- Block harmful requests
- Escalate to human support when uncertain

---

## Integration Points

### Depends On
- Auth Agent (user context)
- Estate Agent (estate state, phase)
- Vault Agent (document content)
- Compliance Agent (state rules, knowledge)

### Depended On By
- All agents (recommendations surface everywhere)

---

## Knowledge Base Categories

### Process Knowledge
- Estate settlement overview
- Phase-by-phase guides
- Common pitfalls
- Timeline expectations

### Legal Knowledge (per state)
- Probate process
- Executor duties
- Heir rights
- Court procedures

### Financial Knowledge
- Asset valuation
- Tax implications
- Account handling
- Insurance claims

### FAQ
- Common questions
- Troubleshooting
- Platform usage

---

## Testing Requirements
- Unit: Context assembly, embedding generation
- Integration: Full RAG pipeline
- Quality: Response relevance scoring
- Safety: Guardrail testing

---

## Current Status

### Implemented
- [ ] Vertex AI integration
- [ ] Knowledge base schema
- [ ] Conversation schema
- [ ] RAG pipeline
- [ ] Chat UI
- [ ] Recommendation engine
- [ ] Document analysis
- [ ] Context builder
- [ ] Knowledge base content (6 states)

### Blockers
- Vertex AI API access required
- Knowledge base content needs creation

### Next Actions
1. Enable Vertex AI in GCP console
2. Create knowledge base schema
3. Build initial knowledge content
4. Implement RAG retrieval
5. Build chat UI

---

## Changelog
| Date | Change |
|------|--------|
| 2025-11-26 | Agent created |
