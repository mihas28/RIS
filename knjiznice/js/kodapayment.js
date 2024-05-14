
var uporabnikId = null; 
var planet = null;
var steviloLjudi = null;
var podatkiRezervacija = null;

function onLoad()
{
  let urlParams = new URLSearchParams(window.location.search);
  uporabnikId = urlParams.get('uporabnikId');
  planet = urlParams.get('planet');
  steviloLjudi = urlParams.get('steviloLjudi');
  podatkiRezervacija = urlParams.get('podatkiRezervacija');

  if (uporabnikId == null || planet == null || steviloLjudi == null || podatkiRezervacija == null)
    window.location.href = "index.html";

  var skupniZnesek = parseInt(steviloLjudi) * 50;

  document.getElementById("stLjudi").innerHTML = steviloLjudi;
  document.getElementById("koncniznesek").innerHTML = skupniZnesek;

}

function posredujPodatkeBancnemuSistemu()
{
	kartica = document.getElementById("stevilkaKartice").value;
	koda = document.getElementById("varnostnaKoda").value;
	pogoj = false;

	//---> _SIM
	// pretvarjamo se, da se tu povečemo na zunanji bančni sistem, za preverbo
	if (kartica == "123456789" && koda == "0000")
		pogoj = true;
	//////////////////////////////////////
	//_SIM <---
	
  var misijaId = podatkiRezervacija[0];

  //preveri status plačila
  
	if (pogoj)
	{//zapiši novo rezervacijo
  		$.getJSON('http://89.142.198.157/index.php?action=insertNewReservation&id_user='+uporabnikId+'&id_mission='+misijaId+'&number='+steviloLjudi, function(data) {
	      alert("Uspešno ste rezervirali misijo!");
	      window.location.href = "dashboard.html?id="+uporabnikId;
    	});
	}
	else
	{
		alert("Napaka pri transakciji, rezervacija neuspešna!");
		window.location.href = "dashboard.html?id="+uporabnikId;
	}
}

function nazaj()
{
	window.location.href = "dashboard.html?id="+uporabnikId;
}