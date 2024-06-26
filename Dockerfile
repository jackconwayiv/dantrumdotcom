# syntax=docker/dockerfile:1
FROM node:21 AS frontend
WORKDIR /code

COPY frontend/ frontend-build/
WORKDIR /code/frontend-build/
RUN yarn install
RUN GENERATE_SOURCEMAP=false yarn build

# Using 3.11 for now because 3.12 breaks things
FROM python:3.11-slim-bullseye

ARG YOUR_ENV
ENV YOUR_ENV=${YOUR_ENV}
ENV PYTHONUNBUFFERED=1

# System deps:
RUN apt-get update && apt-get install -y gcc musl-dev python3-dev libffi-dev cargo rustc postgresql-client libpq-dev
RUN pip install "poetry==1.7.1"

# Copy only requirements to cache them in docker layer
WORKDIR /code
COPY poetry.lock pyproject.toml /scripts/ /code/

# Install Python dependencies
RUN poetry config virtualenvs.create false
RUN if [ "$YOUR_ENV" = "production" ]; then poetry install --no-dev --no-interaction --no-ansi; else poetry install --no-interaction --no-ansi; fi

COPY --from=frontend /code/frontend-build/dist/ /code/frontend/dist

COPY . /code

CMD ./scripts/docker-entrypoint.sh



