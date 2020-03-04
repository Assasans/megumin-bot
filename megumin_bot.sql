-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Мар 04 2020 г., 18:36
-- Версия сервера: 10.3.22-MariaDB-0+deb10u1
-- Версия PHP: 7.3.14-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `megumin_bot`
--

-- --------------------------------------------------------

--
-- Структура таблицы `args`
--

CREATE TABLE `args` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `value` text NOT NULL,
  `type` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `args`
--

INSERT INTO `args` (`id`, `name`, `value`, `type`) VALUES
(1, 'name', 'Мегумин', 'static'),
(2, 'age', '14', 'static'),
(3, 'nickname_username', 'this.member.nickname ? this.member.nickname : this.author.username', 'js'),
(4, 'username', 'this.author.username', 'js'),
(5, 'nickname', 'this.member.nickname ? this.member.nickname : null', 'js'),
(6, 'ping_ws', 'this.client.ws.ping', 'js');

-- --------------------------------------------------------

--
-- Структура таблицы `intents`
--

CREATE TABLE `intents` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `intents`
--

INSERT INTO `intents` (`id`, `name`) VALUES
(1, 'questions.yourname'),
(2, 'questions.whoyou'),
(3, 'questions.yourage'),
(4, 'questions.yourparents'),
(5, 'greetings.hello'),
(6, 'greetings.hello.morning'),
(7, 'greetings.goodbye'),
(8, 'greetings.hello.afternoon'),
(9, 'greetings.hello.evening'),
(10, 'greetings.goodbye.tomorrow'),
(11, 'greetings.goodbye.goodnight'),
(12, 'questions.howyou'),
(13, 'questions.creator'),
(14, 'questions.actions'),
(15, 'character.aqua'),
(16, 'character.kazuma'),
(17, 'character.darkness'),
(18, 'character.komekko'),
(19, 'character.megumin'),
(20, 'character.yunyun'),
(21, 'character.yuiyui'),
(22, 'action.ping'),
(23, 'action.ping.youhere'),
(24, 'questions.youbot'),
(25, 'questions.youperson'),
(26, 'congratulations.newyear'),
(27, 'congratulations.birthday'),
(28, 'action.ping.value');

-- --------------------------------------------------------

--
-- Структура таблицы `replies`
--

CREATE TABLE `replies` (
  `id` int(11) NOT NULL,
  `intent` int(11) NOT NULL,
  `format` text NOT NULL,
  `entities` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `replies`
--

INSERT INTO `replies` (`id`, `intent`, `format`, `entities`) VALUES
(1, 1, 'Мое имя - {name}!', '[]'),
(2, 1, 'Меня зовут {name}.', '[]'),
(3, 1, 'Меня звать {name}.', '[]'),
(4, 1, '{name}.', '[]'),
(5, 1, 'Я - {name}.', '[]'),
(6, 1, 'Называй меня {name}.', '[]'),
(7, 3, '{age}', '[]'),
(8, 3, 'Мне {age} лет.', '[]'),
(9, 3, 'Мне {age}.', '[]'),
(10, 2, 'Мое имя {name}.\r\nЯ сильнейший маг Клана Алых Мазоку, волшебник, владеющий магией Взрывов.\r\nЯ прогнала приспешников злого бога и одолела двух высших демонов.', '[]'),
(11, 6, 'С добрым утром, {username}', '[]'),
(12, 16, '//TODO Казума', '[]'),
(13, 3, '//TODO Казума', '[]'),
(14, 18, 'Комекко - моя младшая сестра.\r\n//TODO Кто хочет дописать это всё?', '[]'),
(15, 20, 'Юн-юн - ...\r\n//TODO Кто хочет дописать это всё?', '[]'),
(16, 21, 'Юйюй - ...\r\n//TODO Кто хочет дописать это всё?', '[]'),
(17, 17, 'Даркнесс - ...\r\n//TODO Кто хочет дописать это всё?', '[]'),
(18, 19, 'Мегумин - это я', '[]'),
(19, 5, 'Привет, {username}', '[]'),
(20, 7, 'Пока, {username}', '[]'),
(21, 7, 'Пока, {nickname_username}', '[]'),
(22, 7, 'До свидания, {nickname_username}', '[]'),
(23, 7, 'До свидания, {username}', '[]'),
(24, 7, 'Пока.', '[]'),
(25, 7, 'До свидания.', '[]'),
(26, 7, 'Пока, {username}.\r\nЯ буду скучать за тобой.', '[]'),
(27, 7, 'До свидания, {nickname_username}.\r\nЯ буду ждать тебя.', '[]'),
(28, 6, 'С добрым утром, {nickname_username}', '[]'),
(29, 11, 'Спокойной ночи, {username}.', '[]'),
(30, 11, 'Спокойной ночи, {nickname_username}.', '[]'),
(31, 10, 'До завтра, {nickname_username}.', '[]'),
(32, 10, 'До завтра, {username}.', '[]'),
(33, 12, 'У меня - замечательно, а у тебя?', '[]'),
(34, 12, 'Прекрасно, спасибо, что спрашиваешь.', '[]'),
(35, 12, 'Отлично.', '[]'),
(36, 13, 'Меня создал `Assasans#5999`.\r\nЯ работаю на `NodeJS` с модулем `NLP.js` для распознавания языка.', '[]'),
(37, 9, 'Доброго вечера, {username}.', '[]'),
(38, 5, 'Привет.', '[]'),
(39, 14, 'Я умею отвечать на простые вопросы.\r\nНапример спроси у меня: `сколько тебе лет?`, `как тебя зовут?`, `кто тебя создал?`, `как дела?`, `расскажи про себя`.\r\nТак-же ты можешь написать мне `привет`, `доброе утро`, `спокойной ночи` и т.д.', '[]'),
(40, 15, 'Аква - богиня воды, она сейчас находится в нашей пати.', ''),
(41, 22, 'Я тут.', '[]'),
(42, 23, 'Да, я тут.', '[]'),
(43, 4, '//TODO', '[]'),
(44, 24, 'Не совсем, я работаю под управлением `NLP.js`, эта библиотека помогает мне понимать твои слова.', '[]'),
(45, 25, 'Не совсем, я работаю под управлением `NLP.js`, эта библиотека помогает мне понимать твои слова.', '[]'),
(46, 28, 'Задержка `WebSocket` соединения: **{ping_ws} мс.**', '[]');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `args`
--
ALTER TABLE `args`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `intents`
--
ALTER TABLE `intents`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `replies`
--
ALTER TABLE `replies`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `args`
--
ALTER TABLE `args`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `intents`
--
ALTER TABLE `intents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT для таблицы `replies`
--
ALTER TABLE `replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
