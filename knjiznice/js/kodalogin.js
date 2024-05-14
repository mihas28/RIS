
function posredujPrijavnePodatke() {

    let uporabniskoime = $("#upoImeVnos").val();
    let geslo = $("#gesloVnos").val();

    //preveri uporabniško ime
    if (uporabniskoime != "" && geslo != "")
    {
        $.getJSON('http://89.142.198.157/index.php?action=login&username='+uporabniskoime+'&password='+geslo, function(data) {
          if (data.status == "success")
          {
            window.location.href = "dashboard.html?id=" + data.user_id;
          }
          else
            alert("Napačno uporabniško ime ali geslo");
      });
    }
    else
      alert("Vnesite Uporabniško ime in geslo!");
}

