from django.urls import path
from . import views

urlpatterns = [
	path('', views.home),
	path('serial', views.serial_data),

	path('pid/direct', views.direct_param),
	path('pid/desired', views.desired_param),
	path('pid/kp', views.kp_param),
	path('pid/kd', views.kd_param),
	path('pid/ki', views.ki_param),
]
