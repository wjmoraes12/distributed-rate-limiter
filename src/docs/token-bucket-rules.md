# Token Bucket Algorithm

## Objetivo

O Token Bucket é um algoritmo de Rate Limiting utilizado para controlar
a quantidade de requisições permitidas para um determinado cliente.

Cada cliente possui um Bucket próprio contendo uma quantidade limitada
de tokens.

Cada requisição consome um token.

Quando todos os tokens forem consumidos, novas requisições deverão ser
bloqueadas até que um novo token seja recarregado.

---

# Bucket

Um Bucket representa o estado de um cliente dentro do algoritmo.

## Estado

Todo Bucket possui obrigatoriamente:

- capacity
- tokens
- updatedAt

Onde:

capacity:
Quantidade máxima de tokens permitida.

tokens:
Quantidade atual disponível.

updatedAt:
Horário da última atualização do bucket.

---

# Regras de Negócio

## R001 — Capacidade Máxima

Todo Bucket possui capacidade máxima de 5 tokens.

Valor esperado:

capacity = 5

---

## R002 — Criação

Todo Bucket criado inicia completamente cheio.

Valor esperado:

tokens = capacity

---

## R003 — Consumo

Cada requisição permitida consome exatamente um token.

Exemplo

Antes

tokens = 5

Depois

tokens = 4

---

## R004 — Reabastecimento

A cada 100ms um novo token deve ser adicionado ao Bucket.

O número de tokens adicionados depende do tempo decorrido.

Exemplo

Tempo passado:

300ms

Resultado esperado:

+3 tokens

---

## R005 — Capacidade

Em nenhuma hipótese o Bucket poderá ultrapassar sua capacidade máxima.

Exemplo

capacity = 5

tokens = 5

Passam 10 minutos

Resultado esperado

tokens = 5

---

## R006 — Limite Inferior

O Bucket nunca poderá possuir quantidade negativa de tokens.

Resultado esperado

tokens >= 0

---

## R007 — Retry After

Quando o Bucket estiver vazio deverá ser informado ao cliente
quanto tempo resta até que um novo token seja disponibilizado.

Exemplo

retryAfter = 85ms

---

## R008 — Reset

O Reset restaura completamente o Bucket.

Resultado esperado

tokens = capacity

updatedAt = horário atual

---

# Happy Path

## H001

Criar Bucket

Resultado esperado

tokens = 5

---

## H002

Consumir um token

Resultado esperado

tokens = 4

---

## H003

Consumir dois tokens

Resultado esperado

tokens = 3

---

## H004

Consumir cinco tokens

Resultado esperado

tokens = 0

---

## H005

Esperar 100ms

Resultado esperado

tokens = 1

---

## H006

Esperar 300ms

Resultado esperado

tokens = 3

---

## H007

Resetar Bucket

Resultado esperado

tokens = 5

---

# Boundary Cases

## B001

Esperar 99ms

Resultado esperado

tokens = 0

---

## B002

Esperar exatamente 100ms

Resultado esperado

tokens = 1

---

## B003

Esperar 101ms

Resultado esperado

tokens = 1

---

## B004

Esperar 250ms

Resultado esperado

tokens = 2

---

## B005

Esperar 499ms

Resultado esperado

tokens = 4

---

## B006

Esperar 500ms

Resultado esperado

tokens = 5

---

## B007

Esperar 5 minutos

Resultado esperado

tokens = 5

---

# Invalid Cases

## I001

Consumir um Bucket vazio.

Resultado esperado

Request bloqueada.

---

## I002

Consumir novamente após o Bucket vazio.

Resultado esperado

Request continua bloqueada.

---

## I003

Consumir infinitamente.

Resultado esperado

tokens nunca fica negativo.

---

## I004

Resetar Bucket inexistente.

Resultado esperado

BucketNotFoundException.

---

## I005

Buscar Bucket inexistente.

Resultado esperado

BucketNotFoundException.

---

## I006

Deletar Bucket inexistente.

Resultado esperado

BucketNotFoundException.

---

# Invariantes

As propriedades abaixo devem permanecer verdadeiras durante toda a
execução do algoritmo.

## INV001

tokens >= 0

---

## INV002

tokens <= capacity

---

## INV003

capacity = 5

---

## INV004

updatedAt nunca pode diminuir.

---

## INV005

retryAfter >= 0

---

## INV006

Cada chamada de consume() reduz exatamente um token.

---

## INV007

Reset sempre restaura o Bucket para o estado inicial.

---

## INV008

O algoritmo nunca cria mais de um Bucket para a mesma chave.

---

# Matriz de Casos de Teste

| ID | Regra | Cenário | Resultado Esperado |
|----|--------|----------|-------------------|
| T001 | R002 | Criar Bucket | 5 Tokens |
| T002 | R003 | Consumir uma vez | 4 Tokens |
| T003 | R003 | Consumir duas vezes | 3 Tokens |
| T004 | R003 | Consumir cinco vezes | 0 Tokens |
| T005 | R006 | Consumir sexta vez | Continua em 0 |
| T006 | R004 | Esperar 99ms | Continua em 0 |
| T007 | R004 | Esperar 100ms | 1 Token |
| T008 | R004 | Esperar 250ms | 2 Tokens |
| T009 | R004 | Esperar 500ms | 5 Tokens |
| T010 | R005 | Esperar 5 minutos | Continua em 5 |
| T011 | R008 | Reset Bucket | 5 Tokens |
| T012 | R007 | Bucket vazio | RetryAfter correto |
| T013 | INV001 | Consumir infinitamente | Tokens nunca negativos |
| T014 | INV002 | Esperar infinitamente | Nunca ultrapassa 5 |
| T015 | INV004 | Atualizar Bucket | updatedAt sempre crescente |

---

# Fluxo do Algoritmo

Request

↓

Localizar Bucket

↓

Bucket existe?

├── Não

│      Criar Bucket

│

└── Sim

↓

Reabastecer Tokens

↓

Possui Tokens?

├── Não

│      Calcular RetryAfter

│      Retornar 429

│

└── Sim

↓

Consumir Token

↓

Salvar Bucket

↓

Retornar Sucesso