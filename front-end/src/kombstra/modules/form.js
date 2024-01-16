const form = document.getElementById('form_select_grid');
const formPara = form.querySelector('select#parameter');
const formPerc = form.querySelector('select#percentile');
const formRank = form.querySelector('input#eventRank');

for (let el of [formPara, formPerc, formRank]) {
  el.addEventListener('change', function() {
    form.dispatchEvent(new Event('submit'));
  });
}

export {formPara, formPerc, formRank, form};