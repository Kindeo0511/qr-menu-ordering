from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class UserModel(AbstractUser):

    ROLE_CHOICES = {
        "AD":"Admin",
        "ST":"Staff",
        "CA":"Cashier"
    }
    role = models.CharField(max_length=2, choices=ROLE_CHOICES, blank=True)
    contact_number = models.CharField(max_length=11, blank=True)
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering =['-id']
    def __str__(self):
        return f'{self.get_full_name()}'




    

