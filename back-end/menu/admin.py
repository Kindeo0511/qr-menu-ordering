from io import BytesIO

import qrcode
from django import forms
from django.conf import settings
from django.contrib import admin
from django.core.files.base import ContentFile
from django.db.models import Max

from .models import Table
from .lib.service.table_service import update_qr_table  
from .lib.service.payment_service import process_payment 
from .models import *
# Register your models here.

class CategoyAdmin(admin.ModelAdmin):
    model = CategoryMenu
    search_fields = ["name"]
    fieldsets = [
        ("Category Name",{"fields":["name"]}),
        ("Image",{"fields":["photo"]}),
    ]
        
    list_display = ["name","photo","created_at","updated_at"]


class FoodAdmin(admin.ModelAdmin):
    model = FoodMenu
    search_fields = ["name"]
    list_filter = ["category"]
    fieldsets = [
        ("Food Information",{"fields":["name","price","food_img"]}),
        ("Category",{"fields":["category"]}),

    ]
    list_display = ["name","category","price","food_img","price","is_active","created_at","updated_at"]

class TableAddForm(forms.ModelForm):
    table_count = forms.IntegerField(
        min_value=1,
        initial=1,
        label="How many tables to create",
    )

    class Meta:
        model = Table
        fields = []  


class TableChangeForm(forms.ModelForm):
    class Meta:
        model = Table
        fields = ["table_number"]


class TableAdmin(admin.ModelAdmin):
    search_fields = ["table_number"]
    list_filter = ["status"]
    list_display = ["table_number", "qr_data", "qr_image_url", "status", "created_at"]

    def get_form(self, request, obj=None, **kwargs):
        kwargs["form"] = TableAddForm if obj is None else TableChangeForm
        return super().get_form(request, obj, **kwargs)

    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return [("Create Tables", {"fields": ["table_count"]})]
        return [("Set Table Number", {"fields": ["table_number"]})]

    def save_model(self, request, obj, form, change):
        if not change:
            count = form.cleaned_data["table_count"]

            max_number = Table.objects.aggregate(Max("table_number"))["table_number__max"]
            start_number = (max_number or 0) + 1

            base_url = settings.QR_BASE_URL.rstrip("/")

            created_tables = []
            for i in range(count):
                table_number = start_number + i
                qr_payload = f"{base_url}/menu/{table_number}/"

                qr = qrcode.QRCode()
                qr.add_data(qr_payload)
                qr.make(fit=True)
                img = qr.make_image()

                buffer = BytesIO()
                img.save(buffer, format="PNG")

                if i == 0:
                
                    table = obj
                    table.table_number = table_number
                else:
                    table = Table(table_number=table_number)

                table.qr_data = qr_payload
                table.qr_image_url.save(
                    f"qr_{table_number}.png",
                    ContentFile(buffer.getvalue()),
                    save=False,
                )
                table.save()
                created_tables.append(table)

            self._created_count = count  

        else:
            if "table_number" in form.changed_data:

                old_table = Table.objects.get(pk=obj.pk)
                new_data = {"table_number": obj.table_number}
                update_qr_table(old_table, new_data)    
            else:
                obj.save()

class OrderInline(admin.TabularInline):
    model = Orders
    extra = 1
    fields = ["food", "qty"]

class TableOrdersAdmin(admin.ModelAdmin):
    model = TableOrders
    list_filter = ["table", "order_status", "payment_status"]
    list_display = ["table", "order_status", "payment_status", "created_at", "updated_at"]
    inlines = [OrderInline]
    fieldsets = [
        ("Table", {"fields": ["table"]}),
        ("Set Order Status", {"fields": ["order_status"]}),
        ("Set Payment Status", {"fields": ["payment_status"]}),
    ]
   
class PaymentAdmin(admin.ModelAdmin):
    model = Payment
    list_display = ["table_order","cashier","total_amount","amount_received","change_given","created_at"]
    fieldsets = [
        ("Select Table Order",{"fields":["table_order"]}),
        ("Select Cashier",{"fields":["cashier"]}),
        ("Payment",{"fields":["total_amount","amount_received","change_given"]}),
    ]
    def has_change_permission(self, request, obj=None):
        return False
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change:
            process_payment(obj)

admin.site.register(CategoryMenu,CategoyAdmin)
admin.site.register(FoodMenu, FoodAdmin)
admin.site.register(Table, TableAdmin)
admin.site.register(TableOrders,TableOrdersAdmin)
admin.site.register(Payment,PaymentAdmin)
