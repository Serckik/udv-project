from django import forms

class GoalForm(forms.Form):
    name = forms.CharField(label='Название цели', widget=forms.Textarea())

class ChatForm(forms.Form):
    message = forms.CharField(label='Написать сообщение', widget=forms.Textarea())