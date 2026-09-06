from rest_framework import serializers
from ...models import CategoryMenu, FoodMenu, Orders, Table, TableOrders, Payment
from rest_framework.validators import UniqueTogetherValidator
class CategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    photo = serializers.ImageField(required=True)
    class Meta:
        model = CategoryMenu
        fields = ['name','photo','updated_at']
        

class DisplayCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryMenu
        fields = '__all__'
    

class FoodSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    food_img = serializers.ImageField(required=True)
    
    class Meta:
        model = FoodMenu
        fields = ['name','category','price','food_img','updated_at','is_active']
        read_only_fields = ['updated_at']
        validators = [
            UniqueTogetherValidator(
                queryset=FoodMenu.objects.all(),
                fields=['name','category'],
                message="This food already exists in the selected category."
            )
        ]


class DisplayFoodSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    category_id = serializers.IntegerField(source="category.id", read_only=True)
    class Meta:
        model = FoodMenu
        fields = ['id','name','category','food_img','category_id',
                  'price','created_at','updated_at',"is_active"]


class FoodOrderSerializer(serializers.ModelSerializer):
    food = serializers.PrimaryKeyRelatedField(queryset=FoodMenu.objects.all())
    qty = serializers.IntegerField(required=True)
    class Meta:
        model = Orders
        fields = ['food','qty']

class DisplayFoodOrderSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source="food.name")
    price = serializers.DecimalField(max_digits=10, decimal_places=2,source="food.price",read_only=True)
    class Meta:
        model = Orders
        fields = ['id','food_name','price','qty']

class TableSerializer(serializers.ModelSerializer):

    
    class Meta:
        model = Table
        fields = '__all__'

class TableOrderSerializer(serializers.ModelSerializer):
    orders = FoodOrderSerializer(many=True)
    class Meta:
        model = TableOrders
        fields = ['table', 'orders', 'order_status', 'updated_at']
        read_only_fields = ['order_status', 'updated_at']

class DispalyTableOrderSerializer(serializers.ModelSerializer):
    orders = DisplayFoodOrderSerializer(many=True)
    table = serializers.StringRelatedField()
    class Meta:
        model = TableOrders
        fields = ['id','orders','table','order_status','payment_status','created_at']

class UpdateOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableOrders
        fields = ['order_status']
class UpdatePaymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableOrders
        fields = ['payment_status']

class SavePaymentSerializer(serializers.ModelSerializer):
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    amount_received = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    class Meta:
        model = Payment
        fields = ['table_order','cashier','total_amount','amount_received']

class DisplayPaymentSerializer(serializers.ModelSerializer):
    table_order = DispalyTableOrderSerializer(read_only=True)
    cashier = serializers.CharField(source="cashier.username", read_only=True)
    class Meta:
        model = Payment
        fields = ['id','table_order','cashier','total_amount','amount_received','change_given','created_at']



