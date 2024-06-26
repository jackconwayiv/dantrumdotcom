# Generated by Django 3.2.25 on 2024-06-04 23:32

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='album',
            old_name='album_date',
            new_name='date',
        ),
        migrations.AddField(
            model_name='user',
            name='nickname',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='album',
            name='link_url',
            field=models.CharField(max_length=4000),
        ),
        migrations.AlterField(
            model_name='album',
            name='thumbnail_url',
            field=models.CharField(max_length=4000),
        ),
        migrations.CreateModel(
            name='Quote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('date', models.DateField(default=datetime.date.today)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owned_quotes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
