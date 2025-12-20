import dayjs from 'dayjs';
import 'dayjs/locale/uz-latn'; // O'zbek tili
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';

// Plaginlarni ulash
dayjs.extend(localeData);
dayjs.extend(updateLocale);

// O'zbek tilini sozlash
dayjs.locale('uz-latn');

// Oy nomlarini o'zgartirish
dayjs.updateLocale('uz-latn', {
  months: [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ],
  monthsShort: [
    'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun',
    'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'
  ]
});

export default dayjs;
