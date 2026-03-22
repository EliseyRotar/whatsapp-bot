import { getGroupLanguage } from '../../utils/language.js';

const triviaQuestions = {
    en: [
        {
            question: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            answer: 2
        },
        {
            question: 'How many continents are there?',
            options: ['5', '6', '7', '8'],
            answer: 2
        },
        {
            question: 'What is 2 + 2?',
            options: ['3', '4', '5', '22'],
            answer: 1
        },
        {
            question: 'Which planet is known as the Red Planet?',
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            answer: 1
        },
        {
            question: 'What is the largest ocean on Earth?',
            options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
            answer: 3
        },
        {
            question: 'How many days are in a leap year?',
            options: ['364', '365', '366', '367'],
            answer: 2
        },
        {
            question: 'What is the smallest prime number?',
            options: ['0', '1', '2', '3'],
            answer: 2
        },
        {
            question: 'Which programming language is known as the language of the web?',
            options: ['Python', 'JavaScript', 'Java', 'C++'],
            answer: 1
        },
        {
            question: 'What year did World War II end?',
            options: ['1943', '1944', '1945', '1946'],
            answer: 2
        },
        {
            question: 'How many sides does a hexagon have?',
            options: ['5', '6', '7', '8'],
            answer: 1
        },
        {
            question: 'What is the capital of Italy?',
            options: ['Milan', 'Rome', 'Venice', 'Florence'],
            answer: 1
        },
        {
            question: 'How many hours are in a day?',
            options: ['12', '20', '24', '48'],
            answer: 2
        },
        {
            question: 'What is the largest mammal in the world?',
            options: ['Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
            answer: 1
        },
        {
            question: 'Which element has the chemical symbol "O"?',
            options: ['Gold', 'Oxygen', 'Silver', 'Iron'],
            answer: 1
        },
        {
            question: 'How many players are on a soccer team?',
            options: ['9', '10', '11', '12'],
            answer: 2
        },
        {
            question: 'What is the speed of light?',
            options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'],
            answer: 0
        },
        {
            question: 'Who painted the Mona Lisa?',
            options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
            answer: 1
        },
        {
            question: 'What is the smallest country in the world?',
            options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
            answer: 1
        },
        {
            question: 'How many bones are in the human body?',
            options: ['186', '206', '226', '246'],
            answer: 1
        },
        {
            question: 'What is the tallest mountain in the world?',
            options: ['K2', 'Kilimanjaro', 'Mount Everest', 'Denali'],
            answer: 2
        },
        {
            question: 'Which planet is closest to the Sun?',
            options: ['Venus', 'Earth', 'Mercury', 'Mars'],
            answer: 2
        },
        {
            question: 'How many strings does a standard guitar have?',
            options: ['4', '5', '6', '7'],
            answer: 2
        },
        {
            question: 'What is the largest desert in the world?',
            options: ['Sahara', 'Arabian', 'Gobi', 'Antarctic'],
            answer: 3
        },
        {
            question: 'Who wrote "Romeo and Juliet"?',
            options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
            answer: 1
        },
        {
            question: 'What is the currency of Japan?',
            options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
            answer: 2
        },
        {
            question: 'How many colors are in a rainbow?',
            options: ['5', '6', '7', '8'],
            answer: 2
        },
        {
            question: 'What is the boiling point of water?',
            options: ['90°C', '100°C', '110°C', '120°C'],
            answer: 1
        },
        {
            question: 'Which animal is known as the "King of the Jungle"?',
            options: ['Tiger', 'Lion', 'Elephant', 'Gorilla'],
            answer: 1
        },
        {
            question: 'How many minutes are in an hour?',
            options: ['50', '60', '70', '80'],
            answer: 1
        },
        {
            question: 'What is the capital of Spain?',
            options: ['Barcelona', 'Madrid', 'Seville', 'Valencia'],
            answer: 1
        }
    ],
    it: [
        {
            question: 'Qual è la capitale della Francia?',
            options: ['Londra', 'Berlino', 'Parigi', 'Madrid'],
            answer: 2
        },
        {
            question: 'Quanti continenti ci sono?',
            options: ['5', '6', '7', '8'],
            answer: 2
        },
        {
            question: 'Quanto fa 2 + 2?',
            options: ['3', '4', '5', '22'],
            answer: 1
        },
        {
            question: 'Quale pianeta è conosciuto come il Pianeta Rosso?',
            options: ['Venere', 'Marte', 'Giove', 'Saturno'],
            answer: 1
        },
        {
            question: 'Qual è l\'oceano più grande della Terra?',
            options: ['Atlantico', 'Indiano', 'Artico', 'Pacifico'],
            answer: 3
        },
        {
            question: 'Quanti giorni ci sono in un anno bisestile?',
            options: ['364', '365', '366', '367'],
            answer: 2
        },
        {
            question: 'Qual è il numero primo più piccolo?',
            options: ['0', '1', '2', '3'],
            answer: 2
        },
        {
            question: 'Quale linguaggio di programmazione è conosciuto come il linguaggio del web?',
            options: ['Python', 'JavaScript', 'Java', 'C++'],
            answer: 1
        },
        {
            question: 'In che anno è finita la Seconda Guerra Mondiale?',
            options: ['1943', '1944', '1945', '1946'],
            answer: 2
        },
        {
            question: 'Quanti lati ha un esagono?',
            options: ['5', '6', '7', '8'],
            answer: 1
        },
        {
            question: 'Qual è la capitale dell\'Italia?',
            options: ['Milano', 'Roma', 'Venezia', 'Firenze'],
            answer: 1
        },
        {
            question: 'Quante ore ci sono in un giorno?',
            options: ['12', '20', '24', '48'],
            answer: 2
        },
        {
            question: 'Qual è il mammifero più grande del mondo?',
            options: ['Elefante', 'Balenottera azzurra', 'Giraffa', 'Orso polare'],
            answer: 1
        },
        {
            question: 'Quale elemento ha il simbolo chimico "O"?',
            options: ['Oro', 'Ossigeno', 'Argento', 'Ferro'],
            answer: 1
        },
        {
            question: 'Quanti giocatori ci sono in una squadra di calcio?',
            options: ['9', '10', '11', '12'],
            answer: 2
        },
        {
            question: 'Qual è la velocità della luce?',
            options: ['300.000 km/s', '150.000 km/s', '500.000 km/s', '100.000 km/s'],
            answer: 0
        },
        {
            question: 'Chi ha dipinto la Gioconda?',
            options: ['Michelangelo', 'Leonardo da Vinci', 'Raffaello', 'Donatello'],
            answer: 1
        },
        {
            question: 'Qual è il paese più piccolo del mondo?',
            options: ['Monaco', 'Città del Vaticano', 'San Marino', 'Liechtenstein'],
            answer: 1
        },
        {
            question: 'Quante ossa ci sono nel corpo umano?',
            options: ['186', '206', '226', '246'],
            answer: 1
        },
        {
            question: 'Qual è la montagna più alta del mondo?',
            options: ['K2', 'Kilimangiaro', 'Monte Everest', 'Denali'],
            answer: 2
        },
        {
            question: 'Quale pianeta è più vicino al Sole?',
            options: ['Venere', 'Terra', 'Mercurio', 'Marte'],
            answer: 2
        },
        {
            question: 'Quante corde ha una chitarra standard?',
            options: ['4', '5', '6', '7'],
            answer: 2
        },
        {
            question: 'Qual è il deserto più grande del mondo?',
            options: ['Sahara', 'Arabico', 'Gobi', 'Antartico'],
            answer: 3
        },
        {
            question: 'Chi ha scritto "Romeo e Giulietta"?',
            options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
            answer: 1
        },
        {
            question: 'Qual è la valuta del Giappone?',
            options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
            answer: 2
        },
        {
            question: 'Quanti colori ci sono in un arcobaleno?',
            options: ['5', '6', '7', '8'],
            answer: 2
        },
        {
            question: 'Qual è il punto di ebollizione dell\'acqua?',
            options: ['90°C', '100°C', '110°C', '120°C'],
            answer: 1
        },
        {
            question: 'Quale animale è conosciuto come il "Re della Giungla"?',
            options: ['Tigre', 'Leone', 'Elefante', 'Gorilla'],
            answer: 1
        },
        {
            question: 'Quanti minuti ci sono in un\'ora?',
            options: ['50', '60', '70', '80'],
            answer: 1
        },
        {
            question: 'Qual è la capitale della Spagna?',
            options: ['Barcellona', 'Madrid', 'Siviglia', 'Valencia'],
            answer: 1
        },
        {
            question: 'Chi ha inventato il telefono?',
            options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Guglielmo Marconi'],
            answer: 1
        },
        {
            question: 'Quanti pianeti ci sono nel sistema solare?',
            options: ['7', '8', '9', '10'],
            answer: 1
        },
        {
            question: 'Qual è il fiume più lungo del mondo?',
            options: ['Nilo', 'Amazzonia', 'Yangtze', 'Mississippi'],
            answer: 0
        },
        {
            question: 'In che anno è caduto il Muro di Berlino?',
            options: ['1987', '1988', '1989', '1990'],
            answer: 2
        },
        {
            question: 'Quanti denti ha un adulto?',
            options: ['28', '30', '32', '34'],
            answer: 2
        },
        {
            question: 'Qual è la lingua più parlata al mondo?',
            options: ['Inglese', 'Mandarino', 'Spagnolo', 'Hindi'],
            answer: 1
        },
        {
            question: 'Chi ha scritto "La Divina Commedia"?',
            options: ['Dante Alighieri', 'Petrarca', 'Boccaccio', 'Ariosto'],
            answer: 0
        },
        {
            question: 'Quanti secondi ci sono in un minuto?',
            options: ['50', '60', '70', '100'],
            answer: 1
        },
        {
            question: 'Qual è il metallo più prezioso?',
            options: ['Oro', 'Platino', 'Rodio', 'Argento'],
            answer: 2
        },
        {
            question: 'In che anno è iniziata la Prima Guerra Mondiale?',
            options: ['1912', '1913', '1914', '1915'],
            answer: 2
        }
    ],
    ru: [
        {
            question: 'Какая столица Франции?',
            options: ['Лондон', 'Берлин', 'Париж', 'Мадрид'],
            answer: 2
        },
        {
            question: 'Сколько континентов существует?',
            options: ['5', '6', '7', '8'],
            answer: 2
        },
        {
            question: 'Сколько будет 2 + 2?',
            options: ['3', '4', '5', '22'],
            answer: 1
        },
        {
            question: 'Какая планета известна как Красная планета?',
            options: ['Венера', 'Марс', 'Юпитер', 'Сатурн'],
            answer: 1
        },
        {
            question: 'Какой самый большой океан на Земле?',
            options: ['Атлантический', 'Индийский', 'Северный Ледовитый', 'Тихий'],
            answer: 3
        },
        {
            question: 'Сколько дней в високосном году?',
            options: ['364', '365', '366', '367'],
            answer: 2
        },
        {
            question: 'Какое самое маленькое простое число?',
            options: ['0', '1', '2', '3'],
            answer: 2
        },
        {
            question: 'Какой язык программирования известен как язык веба?',
            options: ['Python', 'JavaScript', 'Java', 'C++'],
            answer: 1
        },
        {
            question: 'В каком году закончилась Вторая мировая война?',
            options: ['1943', '1944', '1945', '1946'],
            answer: 2
        },
        {
            question: 'Сколько сторон у шестиугольника?',
            options: ['5', '6', '7', '8'],
            answer: 1
        },
        {
            question: 'Какая столица Италии?',
            options: ['Милан', 'Рим', 'Венеция', 'Флоренция'],
            answer: 1
        },
        {
            question: 'Сколько часов в сутках?',
            options: ['12', '20', '24', '48'],
            answer: 2
        },
        {
            question: 'Какое самое большое млекопитающее в мире?',
            options: ['Слон', 'Синий кит', 'Жираф', 'Белый медведь'],
            answer: 1
        },
        {
            question: 'Какой элемент имеет химический символ "O"?',
            options: ['Золото', 'Кислород', 'Серебро', 'Железо'],
            answer: 1
        },
        {
            question: 'Сколько игроков в футбольной команде?',
            options: ['9', '10', '11', '12'],
            answer: 2
        },
        {
            question: 'Какая скорость света?',
            options: ['300 000 км/с', '150 000 км/с', '500 000 км/с', '100 000 км/с'],
            answer: 0
        },
        {
            question: 'Кто нарисовал Мону Лизу?',
            options: ['Микеланджело', 'Леонардо да Винчи', 'Рафаэль', 'Донателло'],
            answer: 1
        },
        {
            question: 'Какая самая маленькая страна в мире?',
            options: ['Монако', 'Ватикан', 'Сан-Марино', 'Лихтенштейн'],
            answer: 1
        },
        {
            question: 'Сколько костей в человеческом теле?',
            options: ['186', '206', '226', '246'],
            answer: 1
        },
        {
            question: 'Какая самая высокая гора в мире?',
            options: ['К2', 'Килиманджаро', 'Эверест', 'Денали'],
            answer: 2
        },
        {
            question: 'Какая планета ближе всего к Солнцу?',
            options: ['Венера', 'Земля', 'Меркурий', 'Марс'],
            answer: 2
        },
        {
            question: 'Сколько струн у стандартной гитары?',
            options: ['4', '5', '6', '7'],
            answer: 2
        },
        {
            question: 'Какая самая большая пустыня в мире?',
            options: ['Сахара', 'Аравийская', 'Гоби', 'Антарктическая'],
            answer: 3
        },
        {
            question: 'Кто написал "Ромео и Джульетту"?',
            options: ['Чарльз Диккенс', 'Уильям Шекспир', 'Джейн Остин', 'Марк Твен'],
            answer: 1
        },
        {
            question: 'Какая валюта в Японии?',
            options: ['Юань', 'Вон', 'Иена', 'Ринггит'],
            answer: 2
        },
        {
            question: 'Сколько цветов в радуге?',
            options: ['5', '6', '7', '8'],
            answer: 2
        },
        {
            question: 'Какая температура кипения воды?',
            options: ['90°C', '100°C', '110°C', '120°C'],
            answer: 1
        },
        {
            question: 'Какое животное известно как "Царь зверей"?',
            options: ['Тигр', 'Лев', 'Слон', 'Горилла'],
            answer: 1
        },
        {
            question: 'Сколько минут в часе?',
            options: ['50', '60', '70', '80'],
            answer: 1
        },
        {
            question: 'Какая столица Испании?',
            options: ['Барселона', 'Мадрид', 'Севилья', 'Валенсия'],
            answer: 1
        },
        {
            question: 'Кто изобрел телефон?',
            options: ['Томас Эдисон', 'Александр Белл', 'Никола Тесла', 'Гульельмо Маркони'],
            answer: 1
        },
        {
            question: 'Сколько планет в Солнечной системе?',
            options: ['7', '8', '9', '10'],
            answer: 1
        },
        {
            question: 'Какая самая длинная река в мире?',
            options: ['Нил', 'Амазонка', 'Янцзы', 'Миссисипи'],
            answer: 0
        },
        {
            question: 'В каком году пала Берлинская стена?',
            options: ['1987', '1988', '1989', '1990'],
            answer: 2
        },
        {
            question: 'Сколько зубов у взрослого человека?',
            options: ['28', '30', '32', '34'],
            answer: 2
        },
        {
            question: 'Какой самый распространенный язык в мире?',
            options: ['Английский', 'Китайский', 'Испанский', 'Хинди'],
            answer: 1
        },
        {
            question: 'Кто написал "Войну и мир"?',
            options: ['Достоевский', 'Толстой', 'Чехов', 'Пушкин'],
            answer: 1
        },
        {
            question: 'Сколько секунд в минуте?',
            options: ['50', '60', '70', '100'],
            answer: 1
        },
        {
            question: 'Какой самый дорогой металл?',
            options: ['Золото', 'Платина', 'Родий', 'Серебро'],
            answer: 2
        },
        {
            question: 'В каком году началась Первая мировая война?',
            options: ['1912', '1913', '1914', '1915'],
            answer: 2
        }
    ],
    es: [
        {
            question: '¿Cuál es la capital de Francia?',
            options: ['Londres', 'Berlín', 'París', 'Madrid'],
            answer: 2
        },
        {
            question: '¿Cuántos continentes hay?',
            options: ['5', '6', '7', '8'],
            answer: 2
        },
        {
            question: '¿Cuánto es 2 + 2?',
            options: ['3', '4', '5', '22'],
            answer: 1
        },
        {
            question: '¿Qué planeta es conocido como el Planeta Rojo?',
            options: ['Venus', 'Marte', 'Júpiter', 'Saturno'],
            answer: 1
        },
        {
            question: '¿Cuál es el océano más grande de la Tierra?',
            options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
            answer: 3
        },
        {
            question: '¿Cuántos días tiene un año bisiesto?',
            options: ['364', '365', '366', '367'],
            answer: 2
        },
        {
            question: '¿Cuál es el número primo más pequeño?',
            options: ['0', '1', '2', '3'],
            answer: 2
        },
        {
            question: '¿Qué lenguaje de programación es conocido como el lenguaje de la web?',
            options: ['Python', 'JavaScript', 'Java', 'C++'],
            answer: 1
        },
        {
            question: '¿En qué año terminó la Segunda Guerra Mundial?',
            options: ['1943', '1944', '1945', '1946'],
            answer: 2
        },
        {
            question: '¿Cuántos lados tiene un hexágono?',
            options: ['5', '6', '7', '8'],
            answer: 1
        },
        {
            question: '¿Cuál es la capital de Italia?',
            options: ['Milán', 'Roma', 'Venecia', 'Florencia'],
            answer: 1
        },
        {
            question: '¿Cuántas horas tiene un día?',
            options: ['12', '20', '24', '48'],
            answer: 2
        },
        {
            question: '¿Cuál es el mamífero más grande del mundo?',
            options: ['Elefante', 'Ballena azul', 'Jirafa', 'Oso polar'],
            answer: 1
        },
        {
            question: '¿Qué elemento tiene el símbolo químico "O"?',
            options: ['Oro', 'Oxígeno', 'Plata', 'Hierro'],
            answer: 1
        },
        {
            question: '¿Cuántos jugadores hay en un equipo de fútbol?',
            options: ['9', '10', '11', '12'],
            answer: 2
        },
        {
            question: '¿Cuál es la velocidad de la luz?',
            options: ['300.000 km/s', '150.000 km/s', '500.000 km/s', '100.000 km/s'],
            answer: 0
        },
        {
            question: '¿Quién pintó la Mona Lisa?',
            options: ['Miguel Ángel', 'Leonardo da Vinci', 'Rafael', 'Donatello'],
            answer: 1
        },
        {
            question: '¿Cuál es el país más pequeño del mundo?',
            options: ['Mónaco', 'Ciudad del Vaticano', 'San Marino', 'Liechtenstein'],
            answer: 1
        },
        {
            question: '¿Cuántos huesos tiene el cuerpo humano?',
            options: ['186', '206', '226', '246'],
            answer: 1
        },
        {
            question: '¿Cuál es la montaña más alta del mundo?',
            options: ['K2', 'Kilimanjaro', 'Monte Everest', 'Denali'],
            answer: 2
        },
        {
            question: '¿Qué planeta está más cerca del Sol?',
            options: ['Venus', 'Tierra', 'Mercurio', 'Marte'],
            answer: 2
        },
        {
            question: '¿Cuántas cuerdas tiene una guitarra estándar?',
            options: ['4', '5', '6', '7'],
            answer: 2
        },
        {
            question: '¿Cuál es el desierto más grande del mundo?',
            options: ['Sahara', 'Arábigo', 'Gobi', 'Antártico'],
            answer: 3
        },
        {
            question: '¿Quién escribió "Romeo y Julieta"?',
            options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
            answer: 1
        },
        {
            question: '¿Cuál es la moneda de Japón?',
            options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
            answer: 2
        },
        {
            question: '¿Cuántos colores tiene un arcoíris?',
            options: ['5', '6', '7', '8'],
            answer: 2
        },
        {
            question: '¿Cuál es el punto de ebullición del agua?',
            options: ['90°C', '100°C', '110°C', '120°C'],
            answer: 1
        },
        {
            question: '¿Qué animal es conocido como el "Rey de la Selva"?',
            options: ['Tigre', 'León', 'Elefante', 'Gorila'],
            answer: 1
        },
        {
            question: '¿Cuántos minutos tiene una hora?',
            options: ['50', '60', '70', '80'],
            answer: 1
        },
        {
            question: '¿Cuál es la capital de España?',
            options: ['Barcelona', 'Madrid', 'Sevilla', 'Valencia'],
            answer: 1
        },
        {
            question: '¿Quién inventó el teléfono?',
            options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Guglielmo Marconi'],
            answer: 1
        },
        {
            question: '¿Cuántos planetas hay en el sistema solar?',
            options: ['7', '8', '9', '10'],
            answer: 1
        },
        {
            question: '¿Cuál es el río más largo del mundo?',
            options: ['Nilo', 'Amazonas', 'Yangtsé', 'Misisipi'],
            answer: 0
        },
        {
            question: '¿En qué año cayó el Muro de Berlín?',
            options: ['1987', '1988', '1989', '1990'],
            answer: 2
        },
        {
            question: '¿Cuántos dientes tiene un adulto?',
            options: ['28', '30', '32', '34'],
            answer: 2
        },
        {
            question: '¿Cuál es el idioma más hablado del mundo?',
            options: ['Inglés', 'Mandarín', 'Español', 'Hindi'],
            answer: 1
        },
        {
            question: '¿Quién escribió "Don Quijote de la Mancha"?',
            options: ['Miguel de Cervantes', 'Lope de Vega', 'Federico García Lorca', 'Gabriel García Márquez'],
            answer: 0
        },
        {
            question: '¿Cuántos segundos tiene un minuto?',
            options: ['50', '60', '70', '100'],
            answer: 1
        },
        {
            question: '¿Cuál es el metal más precioso?',
            options: ['Oro', 'Platino', 'Rodio', 'Plata'],
            answer: 2
        },
        {
            question: '¿En qué año comenzó la Primera Guerra Mundial?',
            options: ['1912', '1913', '1914', '1915'],
            answer: 2
        }
    ],
    pt: [
        {
            question: 'Qual é a capital da França?',
            options: ['Londres', 'Berlim', 'Paris', 'Madrid'],
            answer: 2
        },
        {
            question: 'Quantos continentes existem?',
            options: ['5', '6', '7', '8'],
            answer: 2
        },
        {
            question: 'Quanto é 2 + 2?',
            options: ['3', '4', '5', '22'],
            answer: 1
        },
        {
            question: 'Qual planeta é conhecido como o Planeta Vermelho?',
            options: ['Vênus', 'Marte', 'Júpiter', 'Saturno'],
            answer: 1
        },
        {
            question: 'Qual é o maior oceano da Terra?',
            options: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'],
            answer: 3
        },
        {
            question: 'Quantos dias tem um ano bissexto?',
            options: ['364', '365', '366', '367'],
            answer: 2
        },
        {
            question: 'Qual é o menor número primo?',
            options: ['0', '1', '2', '3'],
            answer: 2
        },
        {
            question: 'Qual linguagem de programação é conhecida como a linguagem da web?',
            options: ['Python', 'JavaScript', 'Java', 'C++'],
            answer: 1
        },
        {
            question: 'Em que ano terminou a Segunda Guerra Mundial?',
            options: ['1943', '1944', '1945', '1946'],
            answer: 2
        },
        {
            question: 'Quantos lados tem um hexágono?',
            options: ['5', '6', '7', '8'],
            answer: 1
        },
        {
            question: 'Qual é a capital da Itália?',
            options: ['Milão', 'Roma', 'Veneza', 'Florença'],
            answer: 1
        },
        {
            question: 'Quantas horas tem um dia?',
            options: ['12', '20', '24', '48'],
            answer: 2
        },
        {
            question: 'Qual é o maior mamífero do mundo?',
            options: ['Elefante', 'Baleia Azul', 'Girafa', 'Urso Polar'],
            answer: 1
        },
        {
            question: 'Qual elemento tem o símbolo químico "O"?',
            options: ['Ouro', 'Oxigênio', 'Prata', 'Ferro'],
            answer: 1
        },
        {
            question: 'Quantos jogadores tem um time de futebol?',
            options: ['9', '10', '11', '12'],
            answer: 2
        },
        {
            question: 'Qual é a velocidade da luz?',
            options: ['300.000 km/s', '150.000 km/s', '500.000 km/s', '100.000 km/s'],
            answer: 0
        },
        {
            question: 'Quem pintou a Mona Lisa?',
            options: ['Michelangelo', 'Leonardo da Vinci', 'Rafael', 'Donatello'],
            answer: 1
        },
        {
            question: 'Qual é o menor país do mundo?',
            options: ['Mônaco', 'Cidade do Vaticano', 'San Marino', 'Liechtenstein'],
            answer: 1
        },
        {
            question: 'Quantos ossos tem o corpo humano?',
            options: ['186', '206', '226', '246'],
            answer: 1
        },
        {
            question: 'Qual é a montanha mais alta do mundo?',
            options: ['K2', 'Kilimanjaro', 'Monte Everest', 'Denali'],
            answer: 2
        },
        {
            question: 'Qual planeta está mais próximo do Sol?',
            options: ['Vênus', 'Terra', 'Mercúrio', 'Marte'],
            answer: 2
        },
        {
            question: 'Quantas cordas tem um violão padrão?',
            options: ['4', '5', '6', '7'],
            answer: 2
        },
        {
            question: 'Qual é o maior deserto do mundo?',
            options: ['Saara', 'Arábico', 'Gobi', 'Antártico'],
            answer: 3
        },
        {
            question: 'Quem escreveu "Romeu e Julieta"?',
            options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
            answer: 1
        },
        {
            question: 'Qual é a moeda do Japão?',
            options: ['Yuan', 'Won', 'Iene', 'Ringgit'],
            answer: 2
        },
        {
            question: 'Quantas cores tem um arco-íris?',
            options: ['5', '6', '7', '8'],
            answer: 2
        },
        {
            question: 'Qual é o ponto de ebulição da água?',
            options: ['90°C', '100°C', '110°C', '120°C'],
            answer: 1
        },
        {
            question: 'Qual animal é conhecido como o "Rei da Selva"?',
            options: ['Tigre', 'Leão', 'Elefante', 'Gorila'],
            answer: 1
        },
        {
            question: 'Quantos minutos tem uma hora?',
            options: ['50', '60', '70', '80'],
            answer: 1
        },
        {
            question: 'Qual é a capital da Espanha?',
            options: ['Barcelona', 'Madrid', 'Sevilha', 'Valência'],
            answer: 1
        }
    ]
};

const activeTrivia = new Map();

const responses = {
    en: {
        invalidAnswer: 'Please answer with 1, 2, 3, or 4!',
        player: '👤 Player:',
        correct: '✅ Correct!\n\nThe answer was: {answer}\n\nPlay again with: .trivia',
        wrong: '❌ Wrong!\n\nThe correct answer was: {answer}\n\nTry again with: .trivia',
        title: '🧠 TRIVIA TIME!',
        answerWith: '\nAnswer with: .trivia <1-4>'
    },
    it: {
        invalidAnswer: 'Rispondi con 1, 2, 3 o 4!',
        player: '👤 Giocatore:',
        correct: '✅ Corretto!\n\nLa risposta era: {answer}\n\nGioca di nuovo con: .trivia',
        wrong: '❌ Sbagliato!\n\nLa risposta corretta era: {answer}\n\nRiprova con: .trivia',
        title: '🧠 TEMPO DI TRIVIA!',
        answerWith: '\nRispondi con: .trivia <1-4>'
    },
    ru: {
        invalidAnswer: 'Пожалуйста, ответьте 1, 2, 3 или 4!',
        player: '👤 Игрок:',
        correct: '✅ Правильно!\n\nОтвет был: {answer}\n\nИграйте снова: .trivia',
        wrong: '❌ Неправильно!\n\nПравильный ответ был: {answer}\n\nПопробуйте снова: .trivia',
        title: '🧠 ВРЕМЯ ВИКТОРИНЫ!',
        answerWith: '\nОтветьте: .trivia <1-4>'
    },
    es: {
        invalidAnswer: '¡Por favor responde con 1, 2, 3 o 4!',
        player: '👤 Jugador:',
        correct: '✅ ¡Correcto!\n\nLa respuesta era: {answer}\n\nJuega de nuevo con: .trivia',
        wrong: '❌ ¡Incorrecto!\n\nLa respuesta correcta era: {answer}\n\nIntenta de nuevo con: .trivia',
        title: '🧠 ¡HORA DE TRIVIA!',
        answerWith: '\nResponde con: .trivia <1-4>'
    },
    pt: {
        invalidAnswer: 'Por favor responda com 1, 2, 3 ou 4!',
        player: '👤 Jogador:',
        correct: '✅ Correto!\n\nA resposta era: {answer}\n\nJogue novamente com: .trivia',
        wrong: '❌ Errado!\n\nA resposta correta era: {answer}\n\nTente novamente com: .trivia',
        title: '🧠 HORA DO QUIZ!',
        answerWith: '\nResponda com: .trivia <1-4>'
    },
    ar: {
        invalidAnswer: 'رد بـ 1، 2، 3 أو 4!',
        player: '👤 اللاعب:',
        correct: '✅ صح!\n\nالإجابة كانت: {answer}\n\nالعب تاني بـ: .trivia',
        wrong: '❌ غلط!\n\nالإجابة الصح كانت: {answer}\n\nحاول تاني بـ: .trivia',
        title: '🧠 وقت الأسئلة!',
        answerWith: '\nرد بـ: .trivia <1-4>'
    },
    hi: {
        invalidAnswer: 'कृपया 1, 2, 3 या 4 के साथ उत्तर दें!',
        player: '👤 खिलाड़ी:',
        correct: '✅ सही!\n\nउत्तर था: {answer}\n\nफिर से खेलें: .trivia',
        wrong: '❌ गलत!\n\nसही उत्तर था: {answer}\n\nपुनः प्रयास करें: .trivia',
        title: '🧠 ट्रिविया समय!',
        answerWith: '\nउत्तर दें: .trivia <1-4>'
    },
    ng: {
        invalidAnswer: 'Abeg answer with 1, 2, 3, or 4!',
        player: '👤 Player:',
        correct: '✅ Correct o!\n\nThe answer na: {answer}\n\nPlay again: .trivia',
        wrong: '❌ E no correct!\n\nThe correct answer na: {answer}\n\nTry again: .trivia',
        title: '🧠 Trivia Time!',
        answerWith: '\nAnswer with: .trivia <1-4>'
    }
};

export default {
    name: 'trivia',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Answer a question
        if (activeTrivia.has(sender)) {
            const answer = parseInt(args[0]);
            
            if (isNaN(answer) || answer < 1 || answer > 4) {
                return await sock.sendMessage(from, { 
                    text: t.invalidAnswer
                });
            }
            
            const trivia = activeTrivia.get(sender);
            activeTrivia.delete(sender);
            
            if (answer - 1 === trivia.answer) {
                return await sock.sendMessage(from, { 
                    text: t.correct.replace('{answer}', trivia.options[trivia.answer])
                });
            } else {
                return await sock.sendMessage(from, { 
                    text: t.wrong.replace('{answer}', trivia.options[trivia.answer])
                });
            }
        }
        
        // Start new question
        const questions = triviaQuestions[lang] || triviaQuestions.en;
        const question = questions[Math.floor(Math.random() * questions.length)];
        activeTrivia.set(sender, question);
        
        let triviaText = `${t.title}\n${t.player} ${pushName}\n\n${question.question}\n\n`;
        question.options.forEach((option, index) => {
            triviaText += `${index + 1}. ${option}\n`;
        });
        triviaText += t.answerWith;
        
        await sock.sendMessage(from, { text: triviaText });
    }
};
