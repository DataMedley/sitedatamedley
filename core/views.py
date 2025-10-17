from django.shortcuts import render
from django.http import JsonResponse
import json
from django.core.mail import send_mail
from django.conf import settings

def index_view(request):
    context = {'active_page': 'index'}
    return render(request, 'core/index.html', context)

def solucoes_view(request):
    context = {'active_page': 'solucoes'}
    return render(request, 'core/solucoes.html', context)

def contact_form_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            message = data.get('message')

            # Lógica de envio de e-mail
            send_mail(
                f'Contato de {name} pelo Site',
                f'Nome: {name}\nEmail: {email}\n\nMensagem:\n{message}',
                settings.EMAIL_HOST_USER, # Remetente
                ['destinatario@datamedley.com.br'], # Substitua pelo e-mail que receberá a mensagem
                fail_silently=False,
            )
            
            return JsonResponse({'status': 'success', 'message': 'Mensagem recebida com sucesso!'})
        except Exception as e:
            print(f"Erro ao enviar e-mail: {e}")
            return JsonResponse({'status': 'error', 'message': 'Ocorreu um erro ao enviar a mensagem.'}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Método não permitido.'}, status=405)
