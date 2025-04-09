var ROW = '<tr><td>Sample text</td><td><i class="CHECKCROSSBASIC"></i></td><td><i class="CHECKCROSSPRO"></i></td></tr>';

function addRow(features, basic, pro) {

    var basicClass = basic ? "fa fa-check" : "fa fa-remove";
    var proClass = pro ? "fa fa-check" : "fa fa-remove";
    
    var newRow = ROW
        .replace("Sample text", features)
        .replace("CHECKCROSSBASIC", basicClass)
        .replace("CHECKCROSSPRO", proClass);
    
    document.getElementById("myTable").innerHTML += newRow;
}
