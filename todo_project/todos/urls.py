from django.urls import path, include
from .views import home
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet

router = DefaultRouter()
router.register('todos', TodoViewSet)

urlpatterns = [
    path('', home),              # 👈 YOUR UI PAGE
    path('api/', include(router.urls)),  # 👈 API
]