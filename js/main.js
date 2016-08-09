var pinarray;
var pinarraydata;
var pinarraylength;

function getarray(){
  $.ajax({
      type: 'POST',
      url: 'php/getarray.php',
      data: 'id=testdata',
      dataType: 'json',
      cache: false,
      success: function(pinarraydata) {
        console.log("array successfully read");
        pinarray = pinarraydata;
        pinarraylength = pinarray[0].length;
        create();
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
      $('#'+divname1).css('background-color', 'green');
    }
    else {
      $('#'+divname1).css('background-color', 'red');
    }
    //create TXT on changediv
    var para = document.createElement("p");
    var node = document.createTextNode("change");
    para.appendChild(node);
    divchange.appendChild(para);
  }
  detectchanges();
}

function changejson (relaytochange, name, pin, method){
	console.log(relaytochange+name+pin);
	//run php script on server
        $.ajax({
            type: 'POST',
            url: 'php/change.php',
            data: {pin: relaytochange, name: name, gpiopin: pin, method: method},
            cache: false,
            success: function(test) {
              console.log("changes successfully written");
            },
        });
}

function opensettings(){
	$('#opensettings').click(function(){
		var info = document.createElement("p");
		var infotxt = document.createTextNode("select the relay which info you want to change");
		info.appendChild(infotxt);

		var f = document.createElement("form");
		f.setAttribute('method',"post");
		f.setAttribute('action',"");

		var select = document.createElement("select");
		select.setAttribute('name',"relayname");
		select.setAttribute('size',pinarraylength);
		select.setAttribute('id',"relayselection");

		for (var i = 0; i < pinarraylength; i++) {
			var option = document.createElement("option");
			option.setAttribute('value',i);
			var txt = document.createTextNode(i);
			option.appendChild(txt);
			select.appendChild(option);
		}
		f.appendChild(select);

		var submitdiv = document.createElement("div");
		submitdiv.setAttribute('id',"openmore");
		submitdiv.setAttribute('class',"button");
		var txt = document.createTextNode("click");
		submitdiv.appendChild(txt);

    var addrelaydiv = document.createElement("div");
		addrelaydiv.setAttribute('id',"addrelaydiv");
		addrelaydiv.setAttribute('class',"button");
    var txt = document.createTextNode("add relay");
		addrelaydiv.appendChild(txt);

		var div2 = document.getElementById("settings");
		div2.appendChild(info);
		div2.appendChild(f);
    div2.appendChild(addrelaydiv);
		div2.appendChild(submitdiv);

    function relayoptions(relaytochange, method){
      if (method == 1) {
        var name = "set the relay name";
        var gpiopin = 0;
      }
      else if (method == 0) {
        var name = pinarray[0][relaytochange][0];
        var gpiopin = pinarray[0][relaytochange][1];
      }

      $('#openmore').remove();

      var f2 = document.createElement("form");
      f2.setAttribute('method',"post");
      f2.setAttribute('action',"");

      var i1info = document.createElement("p");
      var i1infotxt = document.createTextNode("Relayname");
      i1info.appendChild(i1infotxt);

      var i1 = document.createElement("input");
      i1.setAttribute('type',"text");
      i1.setAttribute('name',"relayname");
      i1.setAttribute('value',name);
      i1.setAttribute('id',"relayname");
      f2.appendChild(i1info);
      f2.appendChild(i1);

      var i2info = document.createElement("p");
      var i2infotxt = document.createTextNode("Gpiopin");
      i2info.appendChild(i2infotxt);

      var i2 = document.createElement("input");
      i2.setAttribute('type',"number");
      i2.setAttribute('name',"gpiopin");
      i2.setAttribute('value',gpiopin);
      i2.setAttribute('id',"gpiopin");
      f2.appendChild(i2info);
      f2.appendChild(i2);

      div2.appendChild(f2);

      var removerelaydiv = document.createElement("div");
      removerelaydiv.setAttribute('id',"removerelaydiv");
      removerelaydiv.setAttribute('class',"button");
      var txt = document.createTextNode("remove relay");
      removerelaydiv.appendChild(txt);

      div2.appendChild(removerelaydiv);


      var submitdiv = document.createElement("div");
      submitdiv.setAttribute('id',"changesettings");
      submitdiv.setAttribute('class',"button");
      var txt = document.createTextNode("click");
      submitdiv.appendChild(txt);

      div2.appendChild(submitdiv);

      $('#removerelaydiv').click(function(){
        var relayname = $('#relayname').val();
        var gpiopin = $('#gpiopin').val();
        changejson(relaytochange, relayname, gpiopin, 2);
        location.reload();
      });

      $('#changesettings').click(function(){
        var relayname = $('#relayname').val();
        var gpiopin = $('#gpiopin').val();
        changejson(relaytochange, relayname, gpiopin, 1);
        location.reload();
      });
    }

    $('#addrelaydiv').click(function(){
      relayoptions(pinarraylength, 1);
    });

		$('#openmore').click(function(){
			$('#relayselection option').each(function() {
			if($(this).is(':selected')){
				var relaytochange = document.getElementById("relayselection").value;
        relayoptions(relaytochange, 0);
			}
		});
		});
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
        //getarray();
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
            data: {'pin': pinid},
            cache: false,
            success: function(test) {
              console.log("changes successfully written");
            },
        });
        window.setTimeout(clear,500);
    });
  }
}

function test(){

}

function clear(){
  for (var i = 0; i < pinarraylength; i++) {
    var divid2 = '#pindiv'+i;
    $(divid2).remove();
  }
  getarray();
}

$( document ).ready( getarray );
$(document).ready(test);
$(document).ready(opensettings);
