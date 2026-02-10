document.addEventListener('DOMContentLoaded', () => {
  const prises = [
    { country: 'Польша', europe: 2.0, to: 10.0 },
    { country: 'Австрия', europe: 2.0, to: 15.0 },
    { country: 'Бельгия', europe: 2.0, to: 20.0 },
    { country: 'Хорватия', europe: 2.0, to: 20.0 },
    { country: 'Чехия', europe: 2.0, to: 15.0 },
    { country: 'Дания', europe: 2.0, to: 20.0 },
    { country: 'Эстония', europe: 2.0, to: 20.0 },
    { country: 'Финляндия', europe: 2.0, to: 30.0 },
    { country: 'Франция', europe: 2.0, to: 20.0 },
    { country: 'Испания', europe: 2.0, to: 30.0 },
    { country: 'Нидерланды', europe: 2.0, to: 20.0 },
    { country: 'Ирландия', europe: 2.0, to: 30.0 },
    { country: 'Литва', europe: 2.0, to: 15.0 },
    { country: 'Люксембург', europe: 2.0, to: 20.0 },
    { country: 'Латвия', europe: 2.0, to: 15.0 },
    { country: 'Германия', europe: 2.0, to: 15.0 },
    { country: 'Португалия', europe: 2.0, to: 30.0 },
    { country: 'Словакия', europe: 2.0, to: 15.0 },
    { country: 'Словения', europe: 2.0, to: 20.0 },
    { country: 'Швеция', europe: 2.0, to: 25.0 },
    { country: 'Венгрия', europe: 2.0, to: 15.0 },
    { country: 'Греция', europe: 0.0, to: 0.0 },
    { country: 'Италия', europe: 2.0, to: 20.0 },
    { country: 'Украина', europe: 2.0, to: 0.0 },
    { country: 'Беларусь', europe: 3.0, to: 20.0 },
  ];

  const calculator = document.querySelector('.calculator--wrapper');
  const form = document.createElement('form');
  form.classList.add('form');

  const actions = document.createElement('div');
  actions.classList.add('action');

  const buttonAddBox = document.createElement('button');
  buttonAddBox.type = 'button';
  buttonAddBox.textContent = 'Add Box';
  buttonAddBox.classList.add('button', 'secondary');
  buttonAddBox.addEventListener('click', () => {
    const box = createBox();
    form.insertBefore(box, actions);
  });

  const countryField = document.createElement('fieldset');
  countryField.classList.add('input-wrapper');

  const countryLabel = document.createElement('label');
  countryLabel.textContent = 'Страна:';
  countryLabel.htmlFor = 'country-select';

  const countrySelect = document.createElement('select');
  countrySelect.id = 'country-select';
  countrySelect.required = true;

  prises.forEach((p) => {
    const option = document.createElement('option');
    option.value = p.country;
    option.textContent = p.country;
    countrySelect.append(option);
  });

  const desc = document.createElement('p');
  desc.textContent =
    'При смене страны обязательно сменить значения веса или габаритов для пересчета стоимости.';

  countryField.append(countryLabel, countrySelect, desc);

  actions.append(buttonAddBox);

  const firstBox = createBox();
  form.append(countryField, firstBox, actions);
  calculator.append(form);

  function createBox() {
    const wrapper = document.createElement('fieldset');
    wrapper.classList.add('input-wrapper', 'box');

    const legend = document.createElement('legend');
    legend.textContent = 'Коробка';

    const length = createInput('Длина(см)');
    const width = createInput('Ширина(см)');
    const height = createInput('Высота(см)');
    const weight = createInput('Вес(кг)', true);

    const total = createInput('Расч. вес');
    total.input.readOnly = true;

    const cost = createInput('Цена(€)');
    cost.input.readOnly = true;

    const recalc = () => {
      const l = +length.input.value || 0;
      const w = +width.input.value || 0;
      const h = +height.input.value || 0;
      const wt = +weight.input.value || 10;

      // Расчет контрольного веса
      const volumeWeight = Math.ceil((l * w * h) / 5000);
      const totalWeight = Math.max(Math.max(Math.ceil(wt), volumeWeight), 10);
      total.input.value = totalWeight || '';

      // Берем выбранную страну
      const countryName = document.querySelector('#country-select').value;
      const tariff = prises.find(
        (p) => p.country.toLowerCase() === countryName.toLowerCase(),
      );

      if (tariff) {
        const toGreece = 1.7;
        const europe = tariff.europe;
        const profit = 1;
        const georgia = 0;
        const transaction = 0;

        const totalCost =
          tariff.to +
          totalWeight * (toGreece + europe + profit) +
          georgia +
          transaction;

        cost.input.value = totalCost.toFixed(2);
      } else {
        cost.input.value = '';
      }
    };

    [length, width, height, weight].forEach((f) =>
      f.input.addEventListener('input', recalc),
    );

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete box';
    deleteBtn.classList.add('button', 'secondary');
    deleteBtn.addEventListener('click', () => wrapper.remove());

    const desc = document.createElement('p');
    desc.classList.add('item');
    desc.textContent =
      'Мин. вес - 10 кг. Округление до целого кг в большую сторону. Учитывается наибольший вес - физический или объемный, вычисляемый по формуле: длина × ширина × высота ÷ 5000.';

    wrapper.append(
      legend,
      length.box,
      width.box,
      height.box,
      weight.box,
      total.box,
      cost.box,
      deleteBtn,
      desc,
    );

    return wrapper;
  }

  function createInput(labelText, isWeight = false) {
    const box = document.createElement('div');

    const id = 'id-' + crypto.randomUUID();

    const label = document.createElement('label');
    label.textContent = labelText;
    label.htmlFor = id;

    const input = document.createElement('input');
    input.type = 'number';
    input.id = id;
    if (isWeight) {
      input.setAttribute('data-role', 'weight');
      input.setAttribute('min', 10);
      input.setAttribute('step', 1);
      input.value = 10;
    }

    box.append(label, input);
    return { box, input };
  }
});

