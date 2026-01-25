# 🛠 Guia de Uso e Configuração

Este guia descreve os passos necessários para colocar a aplicação de gestão em funcionamento utilizando Docker.

## 🌐 Acesso Online
A aplicação já está disponível em produção para visualização:
👉 [https://estoque.arandio.com.br/](https://estoque.arandio.com.br/)

## Pré-requisitos
* [Docker](https://www.docker.com/) instalado.
* [Docker Compose](https://docs.docker.com/compose/) instalado.

## Passo 1: Configuração do Ambiente
Antes de subir os containers, você precisa configurar as variáveis de ambiente.

1.  Na raiz do projeto, localize o arquivo `.env.example`.
2.  Crie uma cópia dele e renomeie para `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Certifique-se de que a `DATABASE_URL` no seu `.env` esteja apontando para o serviço de banco de dados do Docker:
    ```env
    DATABASE_URL="postgresql://postgres:postgres@db:5432/postgres"
    ```

## Passo 2: Executando com Docker
A. Com o Docker aberto, execute o comando abaixo na pasta raiz:

```bash
docker-compose up --build
```

B. Modo Background (Rodar em segundo plano): Caso queira liberar o terminal e deixar o sistema rodando silenciosamente, utilize a flag -d:

```bash
docker-compose up -d --build
```