#!/bin/bash

echo "Collect static files"
python manage.py collectstatic --noinput

echo "Apply database migrations"
python manage.py migrate

echo "Starting prod server"
gunicorn dantrum.wsgi:application --bind 0.0.0.0:8000 --workers 3 --log-level=info --capture-output