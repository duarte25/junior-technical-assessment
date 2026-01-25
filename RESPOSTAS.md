# 🧠 Reflexão Técnica - Projeto Gestão de estoque

Este documento detalha o processo de desenvolvimento, as escolhas arquiteturais e as melhorias implementadas durante a execução desta etapa do projeto.

---

## 1. O que foi feito

### 🔧 Debugging
* Identifiquei o erro na listagem de produtos causado por uma falha na relação do Prisma e tipagem no lado do servidor.
* Corrigi o endpoint para garantir o retorno correto do JSON.

### Implementações e Melhorias
* **Estoque:** Reconstruí do zero os repositórios e serviços de movimentação de estoque. Implementei a lógica onde o saldo do produto é atualizado atomicamente após cada movimentação (Input/Output).
* **Atomicidade com Prisma Transactions:** Implementei o uso de `$transaction` em todas as operações de estoque necessarias. Isso garante que a criação do registro de movimentação e a atualização do saldo do produto ocorram como uma única unidade de trabalho, evitando inconsistências no banco de dados em caso de falhas parciais.
* **Frontend:** Reativei as abas de estoque, criei modais de formulário com validação e melhorei a UX com feedback visual.
* **Filtros:** Adicionei busca por nome/SKU e filtros de categoria para facilitar a gestão de grandes inventários.
* **UI/UX:** Repaginei a interface com uma paleta de cores azul e branding da "Getão de estoque" para um aspecto mais profissional.
* **Dockerização Completa:** Estruturação do ambiente de desenvolvimento utilizando Docker e Docker Compose, garantindo que o banco de dados (PostgreSQL 17) e a aplicação (Next.js) rodem de forma isolada e replicável.
* **Pipeline do Prisma:** Implementação do `npx prisma generate` dentro do fluxo do Dockerfile para garantir que as tipagens do banco de dados estejam sempre atualizadas com a imagem.
* **Padronização de Ambiente:** Criação de arquivos `.env.example` e documentação de setup para facilitar o onboarding de novos desenvolvedores ou a implantação em novos servidores.
* **Infraestrutura de Banco:** Configuração de volumes persistentes para o PostgreSQL, garantindo que os dados não sejam perdidos ao reiniciar os containers.

---

## 2. O que poderia ser diferente?



* **Arquitetura Monolítica vs. Desacoplada:** Embora o Next.js facilite o desenvolvimento FullStack, em um cenário de escala, eu optaria por uma estrutura de **Monorepo**. Utilizaria o Next.js focado exclusivamente no Frontend e um **Express.js** isolado para a API.
    * **Motivo:** Isso permitiria maior controle de segurança, isolamento de processos e a possibilidade de escalar o Backend independentemente do Frontend.
* **Validação Centralizada:** Atualmente a validação está concentrada no frontend. O ideal seria a implementação de um esquema de validação (como Zod ou Joi) compartilhado ou duplicado no Backend para garantir a integridade dos dados, independentemente da origem da requisição.
* **Padrões de Projeto:** Para este teste, mantive a estrutura proposta, mas em projetos de maior complexidade, aplicaria **Clean Architecture**. Isso facilitaria a troca de provedores (como mudar o Prisma para outro ORM ou o banco SQL para NoSQL) sem afetar as regras de negócio.

---

## 3. Sugestões de próximos passos

1.  **Migração para Arquitetura em Camadas:** Refatorar os serviços atuais para seguir uma separação mais clara entre `Entities`, `Use Cases` e `Controllers`, facilitando testes unitários.
2.  **Segurança Avançada:** Implementação de Middlewares de autenticação e Rate Limit no nível da API para proteger o sistema contra ataques de força bruta ou excesso de requisições.
3.  **Implementação de testes:** Implementação de testes para validação caso aconteça um erro ou mudança no código não perdermos esse possível erro.
