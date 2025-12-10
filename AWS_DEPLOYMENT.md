# 🚀 AWS Deployment - ViaSegura Frontend

Guia completo para configurar e usar o deployment automático via GitHub Actions para AWS ECR + EC2.

## 📋 Visão Geral

O workflow de deployment está configurado para:

- **Branch `staging`** → Deploy automático para EC2 Staging
- **Branch `main`** → Deploy automático para EC2 Production

### Fluxo de Deploy

```mermaid
graph LR
    A[Push para GitHub] --> B[GitHub Actions]
    B --> C[Build Docker Image]
    C --> D[Push para ECR]
    D --> E[SSH na EC2]
    E --> F[Pull Nova Imagem]
    F --> G[Update Container]
```

## 🔑 Configuração de Secrets

Antes de usar o deployment, você **DEVE** configurar os seguintes secrets no GitHub:

### Como Adicionar Secrets

1. Acesse: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`
2. Adicione cada secret abaixo:

### Secrets Necessários

#### 🔐 AWS Credentials

| Nome                    | Descrição                      | Exemplo                                    |
| ----------------------- | ------------------------------ | ------------------------------------------ |
| `AWS_ACCESS_KEY_ID`     | Access Key do IAM user         | `AKIAIOSFODNN7EXAMPLE`                     |
| `AWS_SECRET_ACCESS_KEY` | Secret Key do IAM user         | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION`            | Região AWS onde está o ECR/EC2 | `us-east-1` ou `sa-east-1`                 |

#### 📦 Amazon ECR

| Nome               | Descrição           | Exemplo                                     |
| ------------------ | ------------------- | ------------------------------------------- |
| `AWS_ECR_REGISTRY` | URL do registry ECR | `123456789.dkr.ecr.us-east-1.amazonaws.com` |

> **Como obter**: AWS Console → ECR → Repositories → `via-segura-frontend` → Copy URI (remova `/via-segura-frontend` do final)

#### 🖥️ EC2 Staging

| Nome                  | Descrição                  | Exemplo                                    |
| --------------------- | -------------------------- | ------------------------------------------ |
| `EC2_STAGING_HOST`    | IP ou DNS da EC2 staging   | `ec2-54-123-45-67.compute-1.amazonaws.com` |
| `EC2_STAGING_USER`    | Usuário SSH                | `ubuntu` ou `ec2-user`                     |
| `EC2_STAGING_SSH_KEY` | Chave privada SSH completa | `-----BEGIN RSA PRIVATE KEY-----\n...`     |

#### 🖥️ EC2 Production

| Nome               | Descrição                   | Exemplo                                    |
| ------------------ | --------------------------- | ------------------------------------------ |
| `EC2_PROD_HOST`    | IP ou DNS da EC2 production | `ec2-54-123-45-99.compute-1.amazonaws.com` |
| `EC2_PROD_USER`    | Usuário SSH                 | `ubuntu` ou `ec2-user`                     |
| `EC2_PROD_SSH_KEY` | Chave privada SSH completa  | `-----BEGIN RSA PRIVATE KEY-----\n...`     |

### 📝 Formato da Chave SSH

A chave SSH deve incluir o conteúdo completo do arquivo `.pem`:

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
... (todo o conteúdo) ...
-----END RSA PRIVATE KEY-----
```

## 🏗️ Estrutura na EC2

O workflow assume a seguinte estrutura na EC2:

```
/home/ubuntu/viasegura/
├── docker-compose.yml
└── .env (opcional)
```

### docker-compose.yml Esperado

O arquivo `docker-compose.yml` na EC2 deve ter um serviço chamado `app-frontend`:

```yaml
version: "3.8"

services:
  app-frontend:
    image: ${FRONTEND_IMAGE} # Será definido durante o deploy
    container_name: viasegura-frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped
    networks:
      - viasegura-network

  app-backend:
    # ... configuração do backend

  database:
    # ... configuração do banco

networks:
  viasegura-network:
    driver: bridge
```

> **Importante**: O workflow define a variável `FRONTEND_IMAGE` automaticamente com a versão correta.

## 🚀 Como Usar

### Deploy para Staging

```bash
git checkout staging
git add .
git commit -m "feat: nova feature"
git push origin staging
```

O GitHub Actions irá automaticamente:

1. ✅ Build da imagem Docker
2. ✅ Push para ECR com tag `staging-latest`
3. ✅ Deploy na EC2 Staging

### Deploy para Production

```bash
git checkout main
git merge staging  # Ou crie um PR de staging → main
git push origin main
```

O GitHub Actions irá automaticamente:

1. ✅ Build da imagem Docker
2. ✅ Push para ECR com tag `production-latest`
3. ✅ Deploy na EC2 Production

## 📊 Monitoramento

### Ver Status do Deploy

1. Acesse: `Actions` no repositório GitHub
2. Clique no último workflow executado
3. Veja logs detalhados de cada step

### Verificar na EC2

Conecte via SSH e verifique:

```bash
# Ver containers rodando
docker ps

# Ver logs do frontend
docker logs viasegura-frontend

# Ver status do docker-compose
cd /home/ubuntu/viasegura
docker-compose ps

# Ver imagens disponíveis
docker images | grep via-segura-frontend
```

## 🔄 Versionamento de Imagens

Cada deploy cria **duas tags** no ECR:

1. **`<commit-sha>`** - Tag única do commit (ex: `abc1234567890`)
2. **`<environment>-latest`** - Sempre aponta para a última versão (ex: `staging-latest`)

Isso permite:

- ✅ Rastreabilidade completa (commit-sha)
- ✅ Facilidade de uso (environment-latest)
- ✅ Rollback rápido se necessário

## 🔙 Rollback Manual

Se precisar reverter para uma versão anterior:

```bash
# 1. Conectar na EC2
ssh -i sua-chave.pem ubuntu@ec2-instance.amazonaws.com

# 2. Navegar para diretório
cd /home/ubuntu/viasegura

# 3. Definir versão anterior (substitua pelo commit SHA)
export FRONTEND_IMAGE=123456789.dkr.ecr.us-east-1.amazonaws.com/via-segura-frontend:abc1234567890

# 4. Pull da imagem antiga
docker pull $FRONTEND_IMAGE

# 5. Atualizar container
docker-compose up -d app-frontend

# 6. Verificar
docker-compose ps
```

## 🛠️ Troubleshooting

### ❌ Erro: "No such file or directory: docker-compose.yml"

**Causa**: O caminho na EC2 está incorreto.

**Solução**: Edite o arquivo `.github/workflows/deploy.yml` e ajuste a linha:

```yaml
cd /home/ubuntu/viasegura || cd ~/viasegura || { echo "❌ Diretório não encontrado"; exit 1; }
```

### ❌ Erro: "Service 'app-frontend' not found"

**Causa**: Nome do serviço no docker-compose.yml está diferente.

**Solução**: Edite o arquivo `.github/workflows/deploy.yml` e ajuste:

```yaml
docker-compose up -d app-frontend # Altere para o nome correto
```

### ❌ Erro: "Permission denied (publickey)"

**Causa**: Chave SSH incorreta ou permissões.

**Soluções**:

1. Verifique se a chave SSH no secret está completa (incluindo `-----BEGIN/END-----`)
2. Verifique se está usando o usuário correto (`ubuntu` vs `ec2-user`)
3. Verifique no AWS Console se a chave SSH associada à EC2 é a mesma

### ❌ Erro: "denied: User: ... is not authorized to perform: ecr:GetAuthorizationToken"

**Causa**: IAM user não tem permissões ECR.

**Solução**: Adicione a policy `AmazonEC2ContainerRegistryPowerUser` ao IAM user.

### ❌ Container não atualiza mesmo com deploy bem-sucedido

**Causa**: Docker pode estar usando imagem em cache.

**Solução**:

```bash
# SSH na EC2
cd /home/ubuntu/viasegura

# Forçar pull e recreate
docker-compose pull app-frontend
docker-compose up -d --force-recreate app-frontend
```

## 🔒 Segurança

### Permissões IAM Recomendadas

O IAM user precisa de:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    }
  ]
}
```

### Security Group da EC2

Certifique-se que:

- ✅ Port 22 (SSH) está aberto para GitHub Actions IPs
- ✅ Port 3000 (aplicação) está aberto conforme necessário

## 📞 Suporte DevOps

Se encontrar problemas, contate o time de DevOps com:

1. Link do workflow que falhou (GitHub Actions)
2. Logs completos do erro
3. Ambiente afetado (staging/production)
4. Commit SHA do deploy
