from django import forms
from django.forms import ModelForm
from .models import Images

class ImageForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Form configuration is optional. You can change the default.
        self.fields['image'].widget.attrs.update({
            'data-aspectratio_w':16, #aspect ratio of width (Default : 1)
            'data-aspectratio_h':9, #aspect ratio of height (Default : 1)
            'data-mincropWidth' : 300, #minimum crop width
            'data-mincropHeight' : 300, #minimum crop height
            'data-maxcropWidth' : 600, #maximum crop width
            'data-maxcropHeight' :600, #maximum crop height
            'data-cropRestrict':"true", #minimum and maximum  work only when cropRestrict true
            'data-mincontainerwidth' : 300, #minimum width of image container
            'data-mincontainerheight' : 300,#minimum height of image container
            'data-filesize' : 0.5, #. 1 mb 2mb if the file size reach config file size it will be compress
            'data-fileresolution' : 0.7, #.0.7 medium resolution
            'data-fillcolor' : '#fff', #color of the cropped image background
            'data-maxmainimagewidth' : 2000, #uploaded image maximum width height take accordingily
            'data-compress':"true", # compress yes:No (Default : true)
            'data-orginal_extension':"false", # (Default : false)  if .png no chnage in png file otherwise convert jpg


        })

    class Meta:
        model       = Images
        fields      = "__all__"
    def clean(self, *args, **kwargs):
        self.cleaned_data = super().clean(*args, **kwargs)