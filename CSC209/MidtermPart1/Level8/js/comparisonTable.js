const NRROWS = 2;
const FEATURES = ["Mary","Alice"];
const BASIC = ["fa fa-check","fa fa-remove"];
const PRO = ["fa fa-remove","fa fa-check"];


var ROW = '<tr><td>Sample text</td><td><i class="CHECKCROSSBASIC"></i></td><td><i class="CHECKCROSSPRO"></i></td></tr>';

function addAll(NRROWS, FEATURES, BASIC, PRO){
    for (var i = 0; i < NRROWS; i++) {
        // var basicClass = basicOption ? "fa fa-check" : "fa fa-remove";
        // var proClass = proOption ? "fa fa-check" : "fa fa-remove";
        
        var newRow = ROW
            .replace("Sample text", FEATURES[i])
            .replace("CHECKCROSSBASIC", BASIC[i])
            .replace("CHECKCROSSPRO", PRO[i]);
        
        document.getElementById("myTable").innerHTML += newRow;
      }
}