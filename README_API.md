# 📡 Documentação da API - Gestão de Estoque

Esta API provê endpoints para o gerenciamento de produtos, categorias e movimentações de estoque.

## 🛠 Tecnologias
- **Stack:** Next.js (Route Handlers)
- **ORM:** Prisma
- **Mensageria:** RabbitMQ (Processamento de Vouchers/Notificações)

## 📌 Endpoints Principais

### 📦 Produtos
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/produtos` | Lista todos os produtos |
| `POST` | `/api/produtos` | Cria um novo produto |
| `PUT` | `/api/produtos/[id]` | Atualiza um produto existente |
| `DELETE` | `/api/produtos/[id]` | Remove um produto |

#### Exemplo de Request (POST `/api/produtos`)
```json
{
  "sku": "AJA",
  "nome": "Teclado Mecânico",
  "categoria_id": "uuid-da-categoria",
  "estoque_minimo": 0,
  "marca": "AJAX"
}
```

### 📦 Categorias
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/categorias` | Lista todas as categorias |
| `POST` | `/api/categorias` | Cria uma nova categoria |
| `PUT` | `/api/categorias/[id]` | Atualiza uma categoria existente |
| `DELETE` | `/api/categorias/[id]` | Remove uma categoria |

#### Exemplo de Request (POST `/api/categorias`)
```json
{
  "nome": "Teclado",
  "descricao": "Sobre o teclado"
}
```

### 📦 Estoque
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/estoque` | Lista todo o estoque |
| `POST` | `/api/estoque/movimentacoes` | Cria uma nova movimentação (entrada/saída) |
| `GET` | `/api/estoque/movimentacoes/:id` | Histórico de movimentação de um produto específico |
| `PUT` | `/api/estoque/movimentacoes/:id` | Atualiza uma movimentação |
| `DELETE` | `/api/estoque/movimentacoes/:i` | Remove uma movimentação |

#### Exemplo de Request (POST `/api/estoque/movimentacoes`)
```json
{
  "produto_id": "uuid-do-produto",
  "tipo": "entrada",
  "quantidade": 500
}
```