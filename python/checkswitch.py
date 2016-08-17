import  RPi.GPIO as GPIO
import time
import json
import os

relay = 5
pinswitch = 16
jsonfile = '/var/www/html/php/data.json'

GPIO.setmode(GPIO.BCM)
GPIO.setup(pinswitch, GPIO.IN,pull_up_down=GPIO.PUD_UP)

status = 0

while True:
    inputValue = GPIO.input(pinswitch)
    print(inputValue)
