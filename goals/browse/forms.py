from django import forms

class GoalForm(forms.Form):
    owner = forms.CharField()