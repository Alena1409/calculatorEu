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
    { country: 'Болгария', europe: 1.6, to: 5.0 },
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

  // Добавляем слушатель на изменение страны
  countrySelect.addEventListener('change', recalculateAll);

  const desc = document.createElement('p');

  countryField.append(countryLabel, countrySelect);

  const countField = document.createElement('div');
  countField.classList.add('input-wrapper', 'calculations');

  // 1. Вес к оплате (сумма весов всех коробок)
  const weightAllBoxes = createInput('Вес к оплате (кг)');
  weightAllBoxes.input.readOnly = true;

  // 2. Расходы на доставку
  const priceDelivery = createInput('Расходы (€)');
  priceDelivery.input.readOnly = true;

  // 3. Оплата расходов за кг
  const priceOneKilo = createInput('Расходы за 1 кг (€)');
  priceOneKilo.input.readOnly = true;

  // 4. Рекомендуемая цена за кг
  const priceRecommend = createInput('Рек. цена за 1 кг (€)');
  priceRecommend.input.readOnly = true;

  const priceBlock = document.createElement('div');
  priceBlock.classList.add('price-block');

  // 5. Ваша цена за кг (свободное число)
  const priceAgentOneKilo = createInput('Ваша цена за 1 кг (€)');
  priceAgentOneKilo.input.addEventListener('input', recalculateAll);
  priceAgentOneKilo.box.classList.add('item2');

  // 6. Оплата с клиента
  const priceAgent = createInput('Оплата с клиента (€)');
  priceAgent.input.readOnly = true;

  // 7. Ваш доход
  const margin = createInput('Ваш чистый доход (€)');
  margin.input.readOnly = true;

  priceBlock.append(priceAgentOneKilo.box, priceAgent.box, margin.box);

  countField.append(
    weightAllBoxes.box,
    priceDelivery.box,
    priceOneKilo.box,
    priceRecommend.box,
    priceBlock

  );

  actions.append(buttonAddBox);

  const firstBox = createBox();
  form.append(countryField, countField, firstBox, actions);
  calculator.append(form);

  // Функция для пересчета всех итоговых полей
  function recalculateAll() {
    // Собираем все коробки
    const boxes = form.querySelectorAll('.box fieldset.box, fieldset.box');
    let totalWeight = 0;

    // Суммируем расчетный вес всех коробок
    boxes.forEach((box) => {
      const totalInput = box.querySelector('input[readonly]');
      if (totalInput && totalInput !== weightAllBoxes.input) {
        const weight = +totalInput.value || 0;
        totalWeight += weight;
      }
    });

    // 1. Вес к оплате
    weightAllBoxes.input.value = totalWeight || '';

    if (totalWeight === 0) {
      // Если нет веса, очищаем все поля
      priceDelivery.input.value = '';
      priceOneKilo.input.value = '';
      priceRecommend.input.value = '';
      priceAgent.input.value = '';
      margin.input.value = '';
      return;
    }

    // Получаем тариф для выбранной страны
    const countryName = countrySelect.value;
    const tariff = prises.find(
      (p) => p.country.toLowerCase() === countryName.toLowerCase(),
    );

    if (!tariff) {
      return;
    }

    const toGreece = 1.7;
    const europe = tariff.europe;
    const profit = 1;
    const georgia = 0;
    const transaction = 0;

    // 2. Расходы на доставку = tariff.to + totalWeight * (toGreece + europe + profit) + georgia + transaction
    const deliveryCost =
      tariff.to +
      totalWeight * (toGreece + europe + profit) +
      georgia +
      transaction;
    priceDelivery.input.value = deliveryCost.toFixed(2);

    // 3. Оплата расходов за кг = расходы на доставку / вес
    const costPerKg = deliveryCost / totalWeight;
    priceOneKilo.input.value = costPerKg.toFixed(2);

    // 4. Рекомендуемая цена за кг = расходы за кг + 2 евро
    const recommendedPrice = costPerKg + 2;
    priceRecommend.input.value = recommendedPrice.toFixed(2);

    // 5. Ваша цена за кг (вводит агент)
    const agentPricePerKg = +priceAgentOneKilo.input.value || 0;

    if (agentPricePerKg > 0) {
      // 6. Оплата с клиента = ваша цена за кг * вес всех коробок
      const clientPayment = agentPricePerKg * totalWeight;
      priceAgent.input.value = clientPayment.toFixed(2);

      // 7. Ваш доход = оплата с клиента - расходы на доставку
      const income = clientPayment - deliveryCost;
      margin.input.value = income.toFixed(2);
    } else {
      priceAgent.input.value = '';
      margin.input.value = '';
    }
  }

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

    const recalc = () => {
      const l = +length.input.value || 0;
      const w = +width.input.value || 0;
      const h = +height.input.value || 0;
      const wt = +weight.input.value || 10;

      // Расчет контрольного веса
      const volumeWeight = Math.ceil((l * w * h) / 5000);
      const totalWeight = Math.max(Math.max(Math.ceil(wt), volumeWeight), 10);
      total.input.value = totalWeight || '';

      // Пересчитываем общие поля
      recalculateAll();
    };

    [length, width, height, weight].forEach((f) =>
      f.input.addEventListener('input', recalc),
    );

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.classList.add('button', 'secondary');
    deleteBtn.addEventListener('click', () => {
      wrapper.remove();
      recalculateAll(); // Пересчитываем после удаления
    });

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

  // Делаем первый расчет при загрузке
  recalculateAll();
});
