// Данные TL Schedules. Изменяйте расписание и преподавателей здесь.
(function(){
const appConfig={DEFAULT_LESSON_DURATION:45,BASE_START_TIME:480,BREAK_DURATION:5,SHOW_KYRGYZSTAN_TIME:true,lessonTimesFixed:[{start:"8:00",end:"8:45",startMinutes:480,endMinutes:525},{start:"8:50",end:"9:35",startMinutes:530,endMinutes:575},{start:"9:40",end:"10:25",startMinutes:580,endMinutes:625},{start:"10:40",end:"11:25",startMinutes:640,endMinutes:685},{start:"11:30",end:"12:15",startMinutes:690,endMinutes:735},{start:"12:20",end:"13:05",startMinutes:740,endMinutes:785}]};
const teachersDatabase={
"Физкультура":{name:"-",cabinet:"спорт зал",phone:null},"Математика":{name:"-",cabinet:"30",phone:null},"Химия":{name:"-",cabinet:"39",phone:null},"Русская литература":{name:"Нурумова Елена",cabinet:"43",phone:"+996554603042"},"Русский язык":{name:"Нурумова Елена",cabinet:"43",phone:"+996554603042"},"Физика":{name:"-",cabinet:"38",phone:null},"История":{name:"-",cabinet:"19",phone:null},"Иностранный язык":{name:"-",cabinet:"33",phone:null},"Кыргыз тили":{name:"Томоева Гульзат",cabinet:"37",phone:"+996703151331"},"Кыргыз литература":{name:"Томоева Гульзат",cabinet:"37",phone:"+996703151331"},"Биология":{name:"-",cabinet:"30",phone:null},"ДП":{name:"-",cabinet:"7",phone:null},"География":{name:"-",cabinet:"41",phone:null},"ЧИО":{name:"-",cabinet:"19",phone:null},"Классный час":{name:"-",cabinet:"-",phone:null}};
const weekSchedule=[
{name:"Понедельник",short:"ПН",isWorkday:true,lessons:["Физкультура","Русская литература","Математика","Химия","Русский язык","Кыргыз тили"]},
{name:"Вторник",short:"ВТ",isWorkday:true,lessons:["Биология","Физика","Иностранный язык","Математика","География","Кыргыз тили"]},
{name:"Среда",short:"СР",isWorkday:true,lessons:["ДП","ДП","Математика","Русская литература","История","Классный час"]},
{name:"Четверг",short:"ЧТ",isWorkday:true,lessons:["Иностранный язык","Русский язык","Физкультура","ЧИО","Физика","Кыргыз литература"]},
{name:"Пятница",short:"ПТ",isWorkday:true,lessons:["Химия","Математика","История","Русская литература","Физика","Кыргыз тили"]},
{name:"Суббота",short:"СБ",isWorkday:false,lessons:[]},{name:"Воскресенье",short:"ВС",isWorkday:false,lessons:[]}];
  window.TL_APP_DATA = { appConfig, teachersDatabase, weekSchedule };
})();
