from rest_framework import serializers
from users.models import UserModel


class CreateUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    contact_number = serializers.CharField(required=True)
    role = serializers.ChoiceField(choices=UserModel.ROLE_CHOICES)

    class Meta:
        model = UserModel
        fields = ['first_name','last_name','email','contact_number',
                  'username','password','role']

class DisplayUserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)
    class Meta:
        model = UserModel
        fields = ['id','first_name','last_name','email','contact_number',
                  'username','password','role','role_display']
