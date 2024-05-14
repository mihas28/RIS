var id = null;

function vrniPodatkeMisije()
{
  let urlParams = new URLSearchParams(window.location.search);
  id = urlParams.get('id');
  
  if (id == null)
  {
    window.location.href = "index.html";
    return;
  }

  $.getJSON('http://89.142.198.157/index.php?action=getUsernameById&upoime_id='+id, function(data) {
      napolniVsi(data[0].admin);
      
      if (data[0].admin == 'T')
      {
        document.querySelector(".hidden").style.display = "block";
        document.querySelector(".hidden1").style.display = "block";
        napolniAdmin();
      }
  });
}

function napolniVsi(role)
{
  let r = "user";
  if (role == 'T')
    r = "admin";
  
  $.getJSON('http://89.142.198.157/index.php?action=getInfoUsernameById&izpisUporabnika='+id, function(data) {
      document.getElementById("upoime").innerHTML = data[0].upoime;
      document.getElementById("imeupo").innerHTML = data[0].Ime;
      document.getElementById("priimekupo").innerHTML = data[0].Priimek;
      document.getElementById("datumrojstva").innerHTML = data[0].Datum_rojstva;
      document.getElementById("naslovupo").innerHTML = data[0].Naslov;
      document.getElementById("role").innerHTML = r;
  });

  //generiraj vstopnice
  $.getJSON('http://89.142.198.157/index.php?action=getReservationsId&id='+id, function(data) {

      for (var i = 0; i < data.length; i++) {
        document.getElementById('tabelaRezervacija').insertAdjacentHTML('beforeend','<tr><td>'+data[i].ID_rezervacije+'</td><td>'+data[i].stevilomest+'</td><td>'+data[i].Datum+'</td><td>'+data[i].Ime_planeta+'</td><td><img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data='+data[i].ID_rezervacije+'" class="img-fluid" alt="QR Koda z vstopnicami"></td></tr>');
      }
  });
}

function napolniAdmin()
{
  return;
}

function prikaziRazporozljiveTermine()
{
  var izbranaMoznost = document.getElementById("izbiraPlaneta").value;
  if (izbranaMoznost == "luna")
  {
    document.getElementById('izbiraDatuma').innerHTML = "<option value='brez'>...</option>";
    $.getJSON('http://89.142.198.157/index.php?action=getMissionsMoon', function(data) {
      for (var i = 0; i < data.length; i++) {
        var vrednost = data[i].ID_misije+" "+data[i].Datum+" "+data[i].Razporozljiva;
        var vrednost = vrednost.replace(/ /g, "~");
        document.getElementById('izbiraDatuma').insertAdjacentHTML('beforeend','<option value='+vrednost+'>'+data[i].Datum+'</select>');
      }
    });
  }
  else if (izbranaMoznost == "mars") {
    document.getElementById('izbiraDatuma').innerHTML = "<option value='brez'>...</option>";
    $.getJSON('http://89.142.198.157/index.php?action=getMissionsMars', function(data) {
      for (var i = 0; i < data.length; i++) {
        var vrednost = data[i].ID_misije+" "+data[i].Datum+" "+data[i].Razporozljiva;
        var vrednost = vrednost.replace(/ /g, "~");
        document.getElementById('izbiraDatuma').insertAdjacentHTML('beforeend','<option value='+vrednost+'>'+data[i].Datum+'</select>');
      }
    });
  }
  else
  {
    document.getElementById('izbiraDatuma').innerHTML = "<option value='brez'>...</option>";
  }
}

function rezervirajTermin()
{
  var planet = document.getElementById("izbiraPlaneta").value;
  var steviloLjudi = document.getElementById("izbiraStevilaLjudi").value;
  var razporozljiveRezervacije = document.getElementById("izbiraDatuma").value;
  var podatkiRezervacija = razporozljiveRezervacije.split("~");

  //preveri ustreznost
  if (planet == "brez" || steviloLjudi == "brez" || razporozljiveRezervacije == "brez")
  {
    alert("Vnesi prosim vse podatke!");
    return;
  }

  //preveri ustreznost
  if (parseInt(podatkiRezervacija[3])-steviloLjudi < 0)
  {
    alert("Premalo prostih mest na ti misiji\nSkupno število prostih mest: "+podatkiRezervacija[3]+"\nVi ste hoteli rezervirat še "+steviloLjudi+" prostih mest");
    return;
  }

  window.location.href = "payment.html?uporabnikId="+id+"&planet="+planet+"&steviloLjudi="+steviloLjudi+"&podatkiRezervacija="+podatkiRezervacija;
}