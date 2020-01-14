var results = document.querySelector('#results');

var add = document.createElement("div");
add.innerText = "Dear VFF, please add 3 to 5...  " + vff.calc.add(3,5);
results.appendChild(add);

var sub = document.createElement("div");
sub.innerText = "Dear VFF, please subtract 3 from 5...  " + vff.calc.subtract(5,3);
results.appendChild(sub);

var mul = document.createElement("div");
mul.innerText = "Dear VFF, please multiply 3 by 5...  " + vff.calc.multiply(3,5);
results.appendChild(mul);

var div = document.createElement("div");
div.innerText = "Dear VFF, please divide 3 by 5...  " + vff.calc.divide(3,5);
results.appendChild(div);
