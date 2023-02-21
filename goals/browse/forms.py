from django import forms

class GoalForm(forms.Form):
    name = forms.CharField()