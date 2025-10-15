# Generated migration for INSA Cyber Talent updates

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('yearbook', '0002_alumnihighlight_my_story_and_more'),
    ]

    operations = [
        # Rename PresidentMessage to DirectorGeneralMessage
        migrations.RenameModel(
            old_name='PresidentMessage',
            new_name='DirectorGeneralMessage',
        ),
        
        # Create CyberTalentDirectorMessage model
        migrations.CreateModel(
            name='CyberTalentDirectorMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Bishaw Beyene', max_length=100)),
                ('photo', models.ImageField(upload_to='leadership/')),
                ('speech', models.TextField()),
                ('position', models.CharField(default='INSA Cyber Talent Director', max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Cyber Talent Director Message',
                'verbose_name_plural': 'Cyber Talent Director Messages',
            },
        ),
        
        # Rename AlumniHighlight to TraineeSuccessStory
        migrations.RenameModel(
            old_name='AlumniHighlight',
            new_name='TraineeSuccessStory',
        ),
        
        # Add new fields to TraineeSuccessStory
        migrations.AddField(
            model_name='traineesuccessstory',
            name='project_showcase',
            field=models.TextField(blank=True, help_text='Key projects completed during training', null=True),
        ),
        migrations.AddField(
            model_name='traineesuccessstory',
            name='skills_acquired',
            field=models.TextField(blank=True, help_text='Technical skills gained', null=True),
        ),
        
        # Rename AboutASTU to AboutINSA
        migrations.RenameModel(
            old_name='AboutASTU',
            new_name='AboutINSA',
        ),
        
        # Update AboutINSA fields
        migrations.AlterField(
            model_name='aboutinsa',
            name='established_year',
            field=models.PositiveIntegerField(default=2024),
        ),
        migrations.RenameField(
            model_name='aboutinsa',
            old_name='student_count',
            new_name='trainee_count',
        ),
        migrations.AlterField(
            model_name='aboutinsa',
            name='trainee_count',
            field=models.PositiveIntegerField(default=500),
        ),
        
        # Update verbose names
        migrations.AlterModelOptions(
            name='aboutinsa',
            options={'verbose_name': 'About INSA Cyber Talent', 'verbose_name_plural': 'About INSA Cyber Talent'},
        ),
        migrations.AlterModelOptions(
            name='directorgeneralmessage',
            options={'verbose_name': 'Director General Message', 'verbose_name_plural': 'Director General Messages'},
        ),
        migrations.AlterModelOptions(
            name='traineesuccessstory',
            options={'ordering': ['-graduation_year'], 'verbose_name': 'Trainee Success Story', 'verbose_name_plural': 'Trainee Success Stories'},
        ),
        
        # Update related names
        migrations.AlterField(
            model_name='traineesuccessstory',
            name='department',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trainees', to='yearbook.department'),
        ),
        migrations.RenameField(
            model_name='profileimage',
            old_name='alumni',
            new_name='trainee',
        ),
        migrations.AlterField(
            model_name='profileimage',
            name='trainee',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='profile_images', to='yearbook.traineesuccessstory'),
        ),
    ]
