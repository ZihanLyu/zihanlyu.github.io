const NRROWS = 2;
const FEATURES = ["Mary", "Alice"];
const BASIC = ["fa fa-check", "fa fa-remove"];
const PRO = ["fa fa-remove", "fa fa-check"];

function addAll(NRROWS, FEATURES, BASIC, PRO) {
    const table = document.getElementById("myTable");
    for (var i = 0; i < NRROWS; i++) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${FEATURES[i]}</td>
            <td><i class="${BASIC[i]}"></i></td>
            <td><i class="${PRO[i]}"></i></td>
        `;
        table.appendChild(row);
    }
}