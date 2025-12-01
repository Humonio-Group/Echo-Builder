# GitHub Actions CI/CD Configuration

Ce workflow GitHub Actions est l'équivalent du fichier `.gitlab-ci.backup.yml` original.

## Secrets requis

Pour que le workflow fonctionne correctement, vous devez configurer les secrets suivants dans les paramètres de votre repository GitHub (Settings > Secrets and variables > Actions):

### Secrets généraux
- `NPM_TOKEN`: Token d'authentification pour le registry npm

### Secrets d'environnement (.env)
- `ENV_FILE_STAGING`: Contenu complet du fichier .env pour l'environnement staging
- `ENV_FILE_DEMO`: Contenu complet du fichier .env pour l'environnement demo
- `ENV_FILE_PRODUCTION`: Contenu complet du fichier .env pour l'environnement production

**Comment créer ces secrets:**
1. Copiez le contenu de votre fichier `.env` local pour chaque environnement
2. Allez dans Settings > Secrets and variables > Actions
3. Créez un nouveau secret (par ex. `ENV_FILE_STAGING`)
4. Collez tout le contenu du fichier .env dans la valeur du secret

### Secrets SSH/Déploiement
- `SSH_USER`: Nom d'utilisateur SSH pour la connexion aux serveurs
- `SSH_PORT`: Port SSH pour la connexion (généralement 22)

### Secrets Staging/Demo
- `STAGING_HOST`: Hôte pour staging et demo (staging-srv.qigu.app)
- `SSH_PKEY_STAGING`: Clé privée SSH pour staging et demo (format PEM)

### Secrets Production
- `PROD_HOST`: Hôte pour production (prod.qigu.app)
- `SSH_PKEY_PROD`: Clé privée SSH pour production (format PEM)

## Différences principales avec GitLab CI

### 1. Structure
- **GitLab CI**: Utilise `stages` avec des jobs regroupés par stage
- **GitHub Actions**: Utilise `jobs` avec des dépendances explicites via `needs`

### 2. Déclencheurs
- **GitLab CI**: `only: [staging]`
- **GitHub Actions**: `if: github.ref == 'refs/heads/staging'`

### 3. Artifacts
- **GitLab CI**: Artifacts automatiquement disponibles entre stages
- **GitHub Actions**: Nécessite `upload-artifact` et `download-artifact`

### 4. Cache
- **GitLab CI**: Cache manuel via `cache.paths`
- **GitHub Actions**: Cache automatique via `actions/setup-node` avec `cache: 'npm'`

### 5. Image Docker
- **GitLab CI**: Spécifie l'image Docker directement (`image: node:14-alpine`)
- **GitHub Actions**: Utilise `runs-on: ubuntu-latest` avec `actions/setup-node`

### 6. Environnements
GitHub Actions utilise la fonctionnalité `environment` qui permet:
- Protection des déploiements (approbations requises)
- URLs d'environnement visibles dans l'interface GitHub
- Historique des déploiements par environnement

## Branches déclenchées

- **staging**: Build et déploiement vers l'environnement staging
- **demo**: Build et déploiement vers l'environnement demo
- **master**: Build et déploiement vers l'environnement production

## Sécurité

Le workflow inclut plusieurs mesures de sécurité:
1. Les fichiers `.env` sont créés dynamiquement et ne sont jamais commités dans le repository
2. Les clés SSH sont nettoyées après utilisation (`if: always()`)
3. Les secrets ne sont jamais exposés dans les logs
4. Utilisation de `ssh-keyscan` pour vérifier les hôtes SSH
5. Permissions SSH appropriées (400 pour les clés, 700 pour ~/.ssh)

## Commandes de build

Tous les environnements utilisent la même commande: `yarn build`

Les fichiers `.env` spécifiques à chaque environnement sont automatiquement créés avant le build à partir des secrets GitHub.

## Déploiement

Le processus de déploiement utilise rsync sur SSH:
1. Création d'un répertoire temporaire sur le serveur
2. Copie des fichiers via rsync
3. Remplacement atomique du répertoire de production

Cela garantit un déploiement sans interruption de service.
