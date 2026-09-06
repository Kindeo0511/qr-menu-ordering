from django.db import models
from ordering_admin import settings
# Create your models here.
class CategoryMenu(models.Model):
    name = models.CharField(max_length=100,unique=True, blank=True)
    photo = models.ImageField(upload_to="category_images", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['-id']
    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        try:
            old = CategoryMenu.objects.get(pk=self.pk)
            if old.photo and old.photo != self.photo:
                old.photo.delete(save=False)
            
        except CategoryMenu.DoesNotExist:
            pass
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.photo:
            self.photo.delete(save=False)
        super().delete(*args, **kwargs)

class FoodMenu(models.Model):
    category = models.ForeignKey(CategoryMenu, related_name='food_category', on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    food_img = models.ImageField(upload_to="images", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Menu'
        verbose_name_plural = 'Menus'
        ordering =['id']

    def __str__(self):
        return f'{self.name}'
        
    def save(self, *args, **kwargs):
        try:
            old = FoodMenu.objects.get(pk=self.pk)
            if old.food_img and old.food_img != self.food_img:
                old.food_img.delete(save=False)
         
        except FoodMenu.DoesNotExist:
            pass
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.food_img:
            self.food_img.delete(save=False)
        super().delete(*args, **kwargs)

class Table(models.Model):
    STATUS_CHOICES = [
        ("Available","Available"),
        ("Occupied", "Occupied"),
        ("Needs-Cleaning","Needs-Cleaning")
    ]
    table_number = models.PositiveIntegerField(unique=True)
    qr_data = models.CharField(max_length=255, blank=True)
    qr_image_url = models.ImageField(upload_to="qr_images", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Available")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Table'
        verbose_name_plural = 'Tables'
        ordering = ['-id']
    def __str__(self):
        return f'Table Number: {self.table_number}'

    
    def save(self, *args, **kwargs):
        try:
            old = Table.objects.get(pk=self.pk)
            if old.qr_image_url and old.qr_image_url != self.qr_image_url:
                old.qr_image_url.delete(save=False)
            
        except Table.DoesNotExist:
            pass
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        if self.qr_image_url:
            self.qr_image_url.delete(save=False)
        super().delete(*args, **kwargs)

class TableOrders(models.Model):
    ORDER_STATUS = [
        ("Pending", "Pending"),
        ("Preparing", "Preparing"),
        ("Ready","Ready"),
        ("Served", "Served")
   
    ]
    PAYMENT_STATUS = [
        ("Unpaid","Unpaid"),
        ("Paid",'Paid')
    ]
    
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS, default="Pending")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="Unpaid")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        verbose_name = 'Table Order'
        verbose_name_plural = 'Table Orders'
        ordering = ['-id']
    def __str__(self):
        return f"Table {self.table} - {self.order_status}"

class Orders(models.Model):
    table_order = models.ForeignKey(TableOrders, on_delete=models.CASCADE, related_name="orders")
    food = models.ForeignKey(FoodMenu, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.food.name} x {self.qty}"

class Payment(models.Model):
    table_order = models.OneToOneField(TableOrders, on_delete=models.CASCADE)
    cashier = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="payments",null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    amount_received = models.DecimalField(max_digits=10, decimal_places=2)
    change_given = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-id']
        
    def save(self, *args, **kwargs):
            self.change_given = self.amount_received - self.total_amount
            super().save(*args, **kwargs)
