# Repo initialized using this quickstart guide:

- https://github.com/docker/awesome-compose/tree/master/official-documentation-samples/django/

Adjustments to commands from above tutorial:

- `docker-compose up web --build`

- `docker-compose run web bash`

- `django-admin startproject dantrum .`

## DRF initialization following this DRF tutorial:

- https://www.django-rest-framework.org/tutorial/1-serialization/

To start Docker container:

- `docker-compose up`

To enter virtual environment:

- `source venv/bin/activate`

## Social Auth through this package:

- `https://github.com/python-social-auth/social-app-django`

## Deployment (Appliku / production)

After deploying, set environment variables in Appliku (see [`.env.example`](.env.example)), then redeploy:

```bash
ALLOWED_HOSTS=dantrum.com,www.dantrum.com,dantrum.applikuapp.com
CSRF_TRUSTED_ORIGINS=https://dantrum.com,https://www.dantrum.com,https://dantrum.applikuapp.com
CORS_ALLOWED_ORIGINS=https://dantrum.com,https://www.dantrum.com,https://dantrum.applikuapp.com
DJANGO_ENV=production
```

Appliku forwards `X-Forwarded-Host: dantrum.applikuapp.com`; that hostname must be in `ALLOWED_HOSTS` or Django returns 400 `DisallowedHost` on API requests.

`scripts/docker-entrypoint.prod.sh` sets `DJANGO_ENV=production` when unset. Settings also append the production hosts and HTTPS origins when `DJANGO_ENV` is not `development`, as a safety net on the next deploy.