const fs = require('fs');
const { Command } = require('commander');

const program = new Command();

// Додаємо аргументи командного рядка
program
  .option('-i, --input <path>', 'path to input file', 'data.json')
  .option('-o, --output <path>', 'path to output file')
  .option('-d, --display', 'display results in console');

program.parse(process.argv);

// Отримуємо значення аргументів
const options = program.opts();

// Перевірка наявності вхідного файлу
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Читаємо файл
let data;
try {
  data = fs.readFileSync(options.input, 'utf-8');
} catch (err) {
  console.error('Cannot find input file:', err.message);
  process.exit(1);
}

// Парсимо JSON
let jsonData;
try {
  jsonData = JSON.parse(data);
} catch (err) {
  console.error('Error parsing JSON data:', err.message);
  process.exit(1);
}

// Фільтруємо дані
const filteredValues = jsonData.filter(item => item.ku === 13 && item.value > 5).map(item => item.value);

// Якщо немає жодного з необов'язкових параметрів, нічого не виводимо
if (!options.output && !options.display) {
  // Нічого не робимо
  process.exit(0);
}

// Якщо є результати, обробляємо їх
if (filteredValues.length > 0) {
  if (options.display) {
    console.log('Filtered values:');
    filteredValues.forEach(value => console.log(value));
  }

  if (options.output) {
    fs.writeFileSync(options.output, JSON.stringify(filteredValues, null, 2));
    console.log(`Results written to ${options.output}`);
  }
} else {
  // Якщо не знайдено жодного значення, можна вивести повідомлення
  if (options.display) {
    console.log('No values found matching the criteria.');
  }
  if (options.output) {
    console.log('No values found matching the criteria.');
  }
}
