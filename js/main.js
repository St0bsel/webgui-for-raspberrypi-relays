var pinarray;
var tmp;
var pinarray2;
var pinarraydata;
var pinarraylength;

var switcharray;
var switcharraylength;

function getarray(callback){
  $.ajax({
      type: 'POST',
      url: 'php/getarray.php',
      data: 'id=testdata',
      dataType: 'json',
      cache: false,
      success: function(pinarraydata) {
        console.log("array successfully read");
        pinarray = pinarraydata;
        pinarraylength = pinarraydata[0].length;
        switcharraylength = pinarraydata[1].length;
        callback();
      },
  });
};

function create(){

  for (var i = 0; i < pinarraylength; i++) {

    var name = pinarray[0][i][0];
    var status = pinarray[0][i][2];
    var divname = 'pindiv'+i;
    var divname1 = i;
    var pinid = i;

    if (status == 0) {
      var statustxt = 'off';
      var statustxtbutton = 'on';
    }
    else {
      var statustxt = 'on';
      var statustxtbutton = 'off';
    }

    //create div
    var div = document.createElement("div");
    var element = document.getElementById("div1");
    div.setAttribute('id',divname);
    div.setAttribute('class',"pindiv");
    element.appendChild(div);

    var div1 = document.getElementById(divname);

    //create TXT
    var para = document.createElement("p");
    var node = document.createTextNode(name+' is '+statustxt);
    para.appendChild(node);
    div1.appendChild(para);

    //creat div which is used for changing
    var divchange = document.createElement("div");
    var elementchange = document.getElementById(divname);
    divchange.setAttribute('id',divname1);
    divchange.setAttribute('class',"changepindiv");
    elementchange.appendChild(divchange);
    if (status == 1) {
      $('#'+divname1).css('background-color', '#1FB163');
    }
    else {
      $('#'+divname1).css('background-color', '#FA5A2C');
    }
    //create TXT on changediv
    var para = document.createElement("p");
    var node = document.createTextNode("change");
    para.appendChild(node);
    divchange.appendChild(para);
  }
  detectchanges();
}

function changejson (relaytochange, name, pin, relay, method){
	console.log(relaytochange+name+pin+relay);
	//run php script on server
        $.ajax({
            type: 'POST',
            url: 'php/change.php',
            data: {change: relaytochange, name: name, gpiopin: pin, relay: relay, method: method},
            cache: false,
            success: function(test) {
              console.log("changes successfully: "+test);
            },
        });
}




function detectchanges(){
	$('#runboot').click(function(){
		$.ajax({
				type: 'POST',
				url: 'php/boot.php',
				cache: false,
				success: function(test) {
				  console.log("boot.php successfully run");
				},
        });
	});

  for (var i = 0; i < pinarraylength; i++) {
    var divid = '#'+i;
    $(divid).click(function(){
        var pinid = $(this).attr('id');
        var pinstatus = pinarray[0][pinid][2];
        //set pinstatus to oposit
        if (pinstatus == 1) {
          pinarray[0][pinid][2] == 0;
        }
        else {
          pinarray[0][pinid][2] == 1;
        }

        //run php script on server
        $.ajax({
            type: 'POST',
            url: 'php/change.php',
            data: {change: pinid, method: 0},
            cache: false,
            success: function(test) {
              console.log("changes successfully written");
            },
        });
        window.setTimeout(clear,100);
    });
  }
}


/*
var opensettings = ; //divid which is used to open the settings
var selectform = ; //formid from form whith selection
var settingsdiv = ; //div which shows up on click

var datalength = ; //count of switches or relays

var input1id = ; //id of the first input filed
var input2id = ; //id of the seccond input field
var input3id =;
var arraypos = ; //0 = relay / 1 = switches
var submitsettings = ; //id of the submittsettinggsdiv
var removebutton = ; //button which should remove the thing
*/
function showsettings(opensettings, selectform, settingsdiv, datalength, input1id, input2id, input3id, arraypos, submitsettings, removebutton){
  var settingsstatus = 0;
  $(opensettings).click(function(){
    if (settingsstatus == 0) {
      settingsstatus = 1;
      $(settingsdiv).css("display", "block");
      $(opensettings+" p").text('close');

      var select = document.getElementById(selectform);
      for (var i = 0; i < datalength; i++) {
  			var option = document.createElement("option");
  			option.setAttribute('value',i);
  			var txt = document.createTextNode(i);
  			option.appendChild(txt);
  			select.appendChild(option);
  		}

      $("#"+selectform).on('change', function(){
        console.log("selectform changed");
        var change = $('#'+selectform).val();
        console.log(change);
        var name = pinarray[arraypos][change][0];
        var gpio = pinarray[arraypos][change][1];
        var relay = pinarray[arraypos][change][2];

        $("#"+input1id).val(name);
        $("#"+input2id).val(gpio);

        if (input3id != 0) {
          $("#"+input3id).val(relay);
        }

        $(submitsettings).click(function(){
          console.log("submit");
          var name = $('#'+input1id).val();
          var gpio = $('#'+input2id).val();
          if (input3id != 0) {
            var relay = $('#'+input3id).val();
            var method = 3;
          }
          else {
            var relay = 0;
            var method = 1;
          }
          changejson(change, name, gpio, relay, method);
          location.reload();
        });

        $(removebutton).click(function(){
          if (input3id != 0) {
            var method = 4;
          }
          else {
            var method = 2;
          }
          changejson(change, 0, 0, 0, method);

          location.reload();
        });

      });
    }
    else if (settingsstatus == 1) {
      settingsstatus = 2;
      $(settingsdiv).css("display", "none");
      $(opensettings+" p").text('open');
    }
    else if (settingsstatus == 2) {
      settingsstatus = 1;
      $(settingsdiv).css("display", "block");
      $(opensettings+" p").text('close');
    }
  });
}

function clear(){
  for (var i = 0; i < pinarraylength; i++) {
    var divid2 = '#pindiv'+i;
    $(divid2).remove();
  }
  getarray(function(){
    create();
  });
}

function refresh() {
  var refreshtime = document.getElementById("refreshtime").value;
  clear();
  setTimeout(refresh, refreshtime);
}

$(document).ready(function(){
  getarray(function(){
    var opensettings = "#openrelaysettings"; //divid which is used to open the settings
    var selectform = "relayselection"; //formid from form whith selection
    var settingsdiv = "#relaysettings"; //div which shows up on click

    var datalength = pinarraylength; //count of switches or relays

    var input1id = "relayname"; //id of the first input filed
    var input2id = "relaygpio"; //id of the seccond input field
    var input3id = 0;
    var arraypos = 0; //0 = relay / 1 = switches
    var submitsettings = "#submitrelaysettings";
    var removebutton = "#removerelay";
    showsettings(opensettings, selectform, settingsdiv, datalength, input1id, input2id, input3id, arraypos, submitsettings, removebutton);


    var opensettings = "#openswitchsettings"; //divid which is used to open the settings
    var selectform = "switchselection"; //formid from form whith selection
    var settingsdiv = "#switchsettings"; //div which shows up on click

    var datalength = switcharraylength; //count of switches or relays

    var input1id = "switchname"; //id of the first input filed
    var input2id = "switchgpio"; //id of the seccond input field
    var input3id = "switchrelay";
    var arraypos = 1; //0 = relay / 1 = switches
    var submitsettings = "#submitswitchsettings";
    var removebutton = "#removeswitch";
    showsettings(opensettings, selectform, settingsdiv, datalength, input1id, input2id, input3id, arraypos, submitsettings, removebutton);

    create();
    refresh();
  });
});
