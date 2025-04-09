const NRROWS = 10;

var ROW = '<tr><td>Sample text</td><td><i class="CHECKCROSSBASIC"></i></td><td><i class="CHECKCROSSPRO"></i></td></tr>';

function addRow(text, basicOption, proOption) {

    var basicClass = basicOption ? "fa fa-check" : "fa fa-remove";
    var proClass = proOption ? "fa fa-check" : "fa fa-remove";
    
    var newRow = ROW
        .replace("Sample text", text)
        .replace("CHECKCROSSBASIC", basicClass)
        .replace("CHECKCROSSPRO", proClass);
    
    document.getElementById("myTable").innerHTML += newRow;
}