from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .serial import write_bytes, read_bytes
from django.http import StreamingHttpResponse

params = [0, 0, 0.00, 0.00, 0.00]

# Create your views here.
def home(request):
	template = loader.get_template('home.html')
	return HttpResponse(template.render())

def direct_param(request):
	params[0] = float(request.GET.get('direct'))
	write_bytes(str(params).strip('[]'))
	return HttpResponse("direct saved")

def desired_param(request):
	params[1] = float(request.GET.get('desired'))
	write_bytes(str(params).strip('[]'))
	return HttpResponse("desired saved")

def kp_param(request):
	params[2] = float(request.GET.get('kp'))
	write_bytes(str(params).strip('[]'))
	return HttpResponse("kp saved")

def kd_param(request):
	params[3] = float(request.GET.get('kd'))
	write_bytes(str(params).strip('[]'))
	return HttpResponse("kd saved")

def ki_param(request):
	params[4] = float(request.GET.get('ki'))
	write_bytes(str(params).strip('[]'))
	return HttpResponse("ki saved")

# def serial_data(request):
# 	while True:
# 		data = read_bytes()
# 		print(data)


def serial_data(request):
    def stream():
        while True:
            data = read_bytes()
            yield f"data: {data}\n\n"

    response = StreamingHttpResponse(stream(), content_type="text/event-stream")
    return response