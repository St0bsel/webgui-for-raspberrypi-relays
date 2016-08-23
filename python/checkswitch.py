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
    with open(jsonfile) as data_file:
        data = json.load(data_file)


    pin = str(data[0][relay][1])
    inputValue = GPIO.input(pinswitch)

    if (inputValue == status):
        if (data[0][relay][2] == 1):
            data[0][relay][2] = 0
	    os.system('gpio -g write '+ pin +' 0')
            print("status changed")
        else:
            data[0][relay][2] = 1
	    os.system('gpio -g write '+ pin +' 1')
            print("status changed")
        if (status == 0):
            status = 1
        elif(status == 1):
            status = 0
        with open(jsonfile, 'wb') as outfile:
            json.dump(data, outfile)
    time.sleep(0.3)
