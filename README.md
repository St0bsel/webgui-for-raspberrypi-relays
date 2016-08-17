# WEBGUI for relays on the Raspberry Pi
HTML5 Webgui to change relay status.

# Installation
1.  clone the full repository to a directory on your webserver
2.  make the php/data.json wirteable for the webserver user
3.  access the webserver on your browser
4.  change the Parameters to your needs (switches and relays)
5.  the script "php/switches.php" needs to run on server to detect changes with switches. Start this automaticly with your server
6.  also you need to run "php/boot.php" after every start of the server. (This can be also done over the web gui)
