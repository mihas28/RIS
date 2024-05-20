
<?php header('Access-Control-Allow-Origin: *'); ?>

<?php
// Podatki za povezavo z bazo podatkov
$servername = "localhost"; // Lahko je tudi IP naslov, če baza gostuje drugje
$username = "root";
$password = "";
$database = "FRI";

// Funkcija za preverjanje pravilnosti prijave
function preveriPrijavo($uporabnik, $geslo) {
    global $pdo;
    $sql = "SELECT * FROM UporabniskaImena WHERE upoime = ? AND upogeslo = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$uporabnik, $geslo]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

try {
    // Povezovanje z bazo podatkov preko PDO
    $pdo = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    // Nastavitev načina, kako PDO obdela napake (npr. nastavitev na izjeme)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Preverjanje pravilnosti prijave
    if(isset($_GET['action']) && $_GET['action'] == 'login') {
        if(isset($_GET['username']) && isset($_GET['password'])) {
            $uporabnik = $_GET['username'];
            $geslo = $_GET['password'];
            $rezultat = preveriPrijavo($uporabnik, $geslo);
            if($rezultat) {
                echo json_encode(array("status" => "success", "user_id" => $rezultat['ID_upoimena'], "admin" => $rezultat['admin']));
            } else {
                echo json_encode(array("status" => "error", "message" => "Neveljavno uporabniško ime ali geslo."));
            }
            exit;
        } else {
            echo json_encode(array("status" => "error", "message" => "Manjkajo parametri uporabniško ime in/ali geslo."));
            exit;
        }
    }

    // Funkcija za dodajanje v tabelo
    function dodajVtabelo($tabela, $podatki) {
        global $pdo;
        $stolpci = implode(", ", array_keys($podatki));
        $values = ":" . implode(", :", array_keys($podatki));
        $sql = "INSERT INTO $tabela ($stolpci) VALUES ($values)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($podatki);
        echo json_encode(array("status" => "success", "message" => "Podatki so bili uspešno dodani v tabelo $tabela."));
    }

    function preberiIzTabelePoId($tabela, $idName, $id) {
        global $pdo;
        $sql = "SELECT * FROM $tabela WHERE $idName = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $rezultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rezultati);
    }

    function pridobivsemisijeLuna(){
      global $pdo;
        $sql = "SELECT Misije.ID_misije, Misije.Datum, Misije.Razporozljiva FROM Misije, Planet WHERE Misije.ID_planeta = Planet.ID_planeta AND Planet.Ime_planeta = 'Luna'";
        $stmt = $pdo->prepare($sql);
	      $stmt->execute();
        $rezultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rezultati);
    }
    
    function pridobivsemisijeMars(){
      global $pdo;
        $sql = "SELECT Misije.ID_misije, Misije.Datum, Misije.Razporozljiva FROM Misije, Planet WHERE Misije.ID_planeta = Planet.ID_planeta AND Planet.Ime_planeta = 'Mars'";
        $stmt = $pdo->prepare($sql);
	      $stmt->execute();
        $rezultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rezultati);
    }

    function preberiIzTabeleUpoIme($id) {
        global $pdo;
        $sql = "SELECT upoime, admin FROM UporabniskaImena WHERE ID_upoimena = ?";
        $stmt = $pdo->prepare($sql);
	$stmt->execute([$id]);
        $rezultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rezultati);
    }

    function preberiIzTabele($tabela) {
        global $pdo;
        $sql = "SELECT * FROM $tabela";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $rezultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $rezultati;
    }

    function izpisUpoNaId($id) {
        global $pdo;
        $sql = "SELECT UporabniskaImena.upoime, Uporabniki.Ime, Uporabniki.Priimek, Uporabniki.Datum_rojstva, Uporabniki.Naslov FROM Uporabniki, UporabniskaImena WHERE UporabniskaImena.ID_upoimena = ? AND UporabniskaImena.ID_uporabnika = Uporabniki.ID_uporabnika";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $rezultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rezultati);
    }
    
    function vstaviNovoRezervacijo($username_id, $mission_id, $number) {
        global $pdo;
        $sql = "INSERT INTO Rezervacija (ID_upoimena, ID_misije, stevilomest)  VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$username_id, $mission_id, $number]);
        $rezultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rezultati);
    }

    function izpisVseRezrvacije($id) {
        global $pdo;
        $sql = "SELECT ID_rezervacije, stevilomest, Datum, Ime_planeta FROM Rezervacija, Misije, Planet WHERE Rezervacija.ID_misije = Misije.ID_misije AND Misije.ID_planeta = Planet.ID_planeta AND Rezervacija.ID_upoimena = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $rezultati = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rezultati);
    }

    // Obdelava različnih akcij
    if(isset($_GET['action'])) {
        $action = $_GET['action'];
        switch($action) {
            case 'getAllData':
                $allData = array();
                $allData['Missions'] = preberiIzTabele('Misije');
                $allData['Planets'] = preberiIzTabele('Planet');
                $allData['Reservations'] = preberiIzTabele('Rezervacija');
                $allData['Users'] = preberiIzTabele('Uporabniki');
                echo json_encode($allData);
                break;
            case 'getInfoUsernameById':
                if(isset($_GET['izpisUporabnika'])) {
                    $username_id = $_GET['izpisUporabnika'];
                    izpisUpoNaId($username_id);
                } else {
                    echo json_encode(array("status" => "error", "message" => "Manjka parameter upoid_id."));
                }
                break;
	        case 'getReservationsId':
                if(isset($_GET['id'])) {
                    $username_id = $_GET['id'];
                    izpisVseRezrvacije($username_id);
                } else {
                    echo json_encode(array("status" => "error", "message" => "Manjka parameter upoid_id."));
                }
                break;
                
         case 'insertNewReservation':
                if(isset($_GET['id_user']) && isset($_GET['id_mission']) && isset($_GET['number'])) {
                    $username_id = $_GET['id_user'];
                    $mission_id = $_GET['id_mission'];
                    $number = $_GET['number'];
                    vstaviNovoRezervacijo($username_id, $mission_id, $number);
                } else {
                    echo json_encode(array("status" => "error", "message" => "Manjka parameter upoid_id."));
                }
                break;
                
             case 'getMissionsMoon':
                pridobivsemisijeLuna();
                break;
             case 'getMissionsMars':
                pridobivsemisijeMars();
                break;
            case 'getUsernameById':
                if(isset($_GET['upoime_id'])) {
                    $username_id = $_GET['upoime_id'];
                    preberiIzTabeleUpoIme($username_id);
                } else {
                    echo json_encode(array("status" => "error", "message" => "Manjka parameter upoid_id."));
                }
                break;
            case 'getMissionById':
                if(isset($_GET['mission_id'])) {
                    $mission_id = $_GET['mission_id'];
                    preberiIzTabelePoId('Misije', 'ID_misije', $mission_id);
                } else {
                    echo json_encode(array("status" => "error", "message" => "Manjka parameter mission_id."));
                }
                break;
            case 'getPlanetById':
                if(isset($_GET['planet_id'])) {
                    $planet_id = $_GET['planet_id'];
                    preberiIzTabelePoId('Planet', 'ID_planeta', $planet_id);
                } else {
                    echo json_encode(array("status" => "error", "message" => "Manjka parameter planet_id."));
                }
                break;
            case 'getReservationById':
                if(isset($_GET['reservation_id'])) {
                    $reservation_id = $_GET['reservation_id'];
                    preberiIzTabelePoId('Rezervacija', 'ID_rezervacije', $reservation_id);
                } else {
                    echo json_encode(array("status" => "error", "message" => "Manjka parameter reservation_id."));
                }
                break;
            case 'getUserById':
                if(isset($_GET['user_id'])) {
                    $user_id = $_GET['user_id'];
                    preberiIzTabelePoId('Uporabniki', 'ID_uporabnika' , $user_id);
                } else {
                    echo json_encode(array("status" => "error", "message" => "Manjka parameter user_id."));
                }
                break;
            default:
                echo json_encode(array("status" => "error", "message" => "Neveljavna akcija."));
                break;
        }
    } else {
        echo json_encode(array("status" => "error", "message" => "Manjkajoča akcija."));
    }

} catch(PDOException $e) {
    // V primeru napake pri povezovanju z bazo podatkov ali izvajanju poizvedbe
    echo json_encode(array("status" => "error", "message" => "Napaka: " . $e->getMessage()));
}
?>


