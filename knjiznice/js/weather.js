let najHladni = [];
let najTopli = [];
let datumi = [];
let podatkiVsi;

function izpisiVrednost() {
    let izbrano = document.getElementById("izpis").value;
    if (izbrano!="...")
    {
        $("#divVpis").html("");
        let visinaCanvas = document.getElementsByTagName("canvas");
        let visinaBesedili = document.getElementById("visina");
        let visina;
        if (visinaCanvas[0].offsetHeight-visinaBesedili.offsetHeight>0)
            visina = visinaCanvas[0].offsetHeight-visinaBesedili.offsetHeight+30;
        else
            visina = visinaBesedili.offsetHeight-visinaCanvas[0].offsetHeight+30;

        $("#divVpis").append(
            "<div id='visina1' style='float: left;'>" +
            "<h1>Datum: "+datumi[izbrano]+"</h1>" +
            "<h4>sol: "+podatkiVsi.sols[izbrano].sol+"</h4>" +
            "<h4>letni čas: "+podatkiVsi.sols[izbrano].season+"</h4>" +
            "<h4>najmanjša dnevna temperatura: "+podatkiVsi.sols[izbrano].min_temp+" °C</h4>" +
            "<h4>največja dnevna temperatura: "+podatkiVsi.sols[izbrano].max_temp+" °C</h4>" +
            "<h4>zračni pritisk: "+podatkiVsi.sols[izbrano].pressure+" Pa</h4>" +
            "<h4>sončni vzhod: "+podatkiVsi.sols[izbrano].sunrise+"</h4>" +
            "<h4>sončni zahod: "+podatkiVsi.sols[izbrano].sunset+"</h4>" +
            "</div>" +
            "<img src='knjiznice/css/mars.jpg' style='width: 20%; float: right; margin: 20px;'>"
        );
        document.getElementById("divVpis").style = "margin-top: "+visina+"px; border-radius: 5px; padding: 5px; height: "+document.getElementById("visina1").offsetHeight+"px;";
    }
    else
        $("#divVpis").css({"visibility": "hidden"});
}

$(document).ready(function () {
    $.ajax({
        url: "https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json",
        type: "GET",
        success: function (podatki) {
            podatkiVsi = podatki;
            for (let i = 0; i < podatki.sols.length; i++) {
                datumi.push(podatki.sols[i].terrestrial_date.substring(8,10) + ". " + podatki.sols[i].terrestrial_date.substring(5,7) + ". " + podatki.sols[i].terrestrial_date.substring(0,4));
                najHladni.push({x: new Date(datumi[i].substring(7,12), ((datumi[i].substring(5,6) == 0) ? datumi[i].substring(6,6) : datumi[i].substring(5,6))-1, ((datumi[i].substring(0,1) == 0) ?  datumi[i].substring(1,2) : datumi[i].substring(0,2))), y: podatki.sols[i].min_temp});
                najTopli.push({x: new Date(datumi[i].substring(7,12), ((datumi[i].substring(5,6) == 0) ? datumi[i].substring(6,6) : datumi[i].substring(5,6))-1, ((datumi[i].substring(0,1) == 0) ?  datumi[i].substring(1,2) : datumi[i].substring(0,2))), y: podatki.sols[i].max_temp});
                $("#izpis").append(
                    "<option value='"+i+"'>"+datumi[i]+"</option>"
                );
            }

            let chart = new CanvasJS.Chart("graf", {
                zoomEnabled: true,
                title:{
                    text: "Vreme na marsu",
                    fontColor: "#000066",
                },
                subtitles: [{
                    text: "med " + datumi[0] + " in " + datumi[podatki.sols.length-1],
                    fontColor: "#003366",
                    fontSize: "20",
                }],
                axisY:[{
                    title: "Temperatura v °C",
                    fontSize: "20",
                    includeZero: true,
                }],
                axisX:{
                    valueFormatString: "D. M",
                },
                data: [{
                    type: "line",
                    name: "Najtoplejša dnevna izmerjena temperatura",
                    color: "#FFA500",
                    showInLegend: true,
                    axisYIndex: 1,
                    dataPoints: najTopli,
                },
                    {
                        type: "line",
                        name: "Najhladnejša dnevna izmerjena temperatura",
                        markerType: "square",
                        color: "#00468b",
                        axisYIndex: 0,
                        showInLegend: true,
                        dataPoints: najHladni,
                    },
                ]
            });
            chart.render();
        },
        error: function (err) {
            console.log("napaka");
            alert("Napaka");
        },
    });
});