Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.epoch-calendar.com */

  dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(),0,1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = (day >= 0 ? day : day + 7);
  var daynum = Math.floor((this.getTime() - newYear.getTime() - 
  (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if(day < 4) {
    weeknum = Math.floor((daynum+day-1)/7) + 1;
    if(weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1,0,1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
        the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  }
  else {
    weeknum = Math.floor((daynum+day-1)/7);
  }
  return weeknum;
};

var Calendar = {
  today: function(){
    return new Date();
  }(),
  monthArray: [],
  init: function(year, month, date){
    var self = this;
    self.month = month || self.today.getMonth();
    self.year = year || self.today.getFullYear();
  },
  whatWeek: function(){
    var self = this;
    let week = new Date (self.year, self.month, 1).getWeek();
    let cleanWeek = week % 9;
    if (self.year === 2018){
      return cleanWeek + 8;  
    } else {
      return undefined;
    }
  },
  weekArray: [[2,6,4,8],[2,7,5,9],[3,7,1,5],[4,8,1,6],[4,9,2,6],[5,9,3,8],[1,5,3,7]],
    // dim N:(2,6)  D:(4,8)
    // lun N:(2,7)  D:(5,9)
    // mar N:(3,7)  D:(1,5)
    // mer N:(4,8)  D:(1,6)
    // jeu N:(4,9)  D:(2,6)
    // ven N:(5,9)  D:(3,8)
    // sam N:(1,5)  D:(3,7)

    // [day-->[nightTeam, dayTeam]]
  createCal: function(){
    var self = this;
    self.numberOfDays = new Date (self.year, self.month+1, 0).getDate();
    self.firstDay = new Date (self.year, self.month, 1).getDay();
    self.lastDayPrev = new Date (self.year, self.month, 0).getDate();
    self.monthArray = [];
    
    var lastDayPrev = self.lastDayPrev,
      nextDay = 1,
      day = 1,
      hasDays = true,
      i = 0;
    
    while (hasDays){
      self.monthArray[i]= [];
    
      for (let j = 0; j < 7; j++){
        self.monthArray[i][j] = [];
        if (i === 0){
          if(j === self.firstDay){
            self.monthArray[i][j].push(day++);
            self.firstDay++;
          } else {
            self.monthArray[i][j].push(lastDayPrev + 1 - self.firstDay);
            lastDayPrev++;
          }
        } else if (day <= self.numberOfDays){
          self.monthArray[i][j].push(day++);
        } else {
          self.monthArray[i][j].push(nextDay++);
          hasDays = false;
        }
        if (day > self.numberOfDays){
          hasDays = false;
        }
        self.monthArray[i][j].push(self.weekArray[j])
      } i++;
    }
  },
  nextMonth: function(){
    var self = this;
    if (self.month === 11){
      self.month = 0;
      self.year ++;
    } else {
      self.month++;
    }
    self.createCal();
    displayCal.call(self, self.letter);
  },
  prevMonth: function(){
    var self = this;
    if(self.month === 0){
      self.month = 11;
      self.year += -1;
    } else {
      self.month += -1;
    }
    self.createCal();
    displayCal.call(self, self.letter);
  },
  changeLetter: function(arg){
    var self = this;
    self.letter = arg;
    displayCal.call(self, self.letter);
  }
}

var displayCal = function(arg){
  var self = this;
  self.createCal();
  var letter = arg || 7;

  var monthName = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  var dayName = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  
  document.querySelector("#month-title").innerHTML = monthName[self.month] + ' ' + self.year;
  let table = document.querySelector("#table"),
  row = [];
  table.innerHTML = '';

  //table week
  for (var j = 0; j < self.monthArray.length; j++){
    row[j] = table.insertRow(j);

    //table days
    for(var i = 0; i<=6; i++){
      let cell = [];
      cell[i] = row[j].insertCell(i);
      cell[i].innerHTML = self.monthArray[j][i][0];

      //prev-month, next-month CSS class Logic
      if(self.monthArray[j][i][0] > 10 && j < 1){
        cell[i].className = 'prev-month';
      } else if (self.monthArray[j][i][0] < 10 && j >= 4){
        cell[i].className = 'next-month';
      }

      //current-day logic
      if(self.monthArray[j][i][0] === self.today.getDate() && self.month === self.today.getMonth()){
        if(j < 1 && self.monthArray[j][i][0] < 10){
          cell[i].className = 'current-day';
        }else if (self.monthArray[j][i][0] > 10 && j >= 4){
          cell[i].className = 'current-day';
        }else if (j >= 1 && j < 4){
          cell[i].className = 'current-day';
        }
      }

      function modulus(){
        return (j + letter + self.whatWeek()) % 9 + 1;
      }
      //night class logic
      if(self.monthArray[j][i][1][0] === (modulus()) || self.monthArray[j][i][1][1] === (modulus())){
        cell[i].className = 'night';
      }

      //days class logic
      if(self.monthArray[j][i][1][2] === (modulus()) || self.monthArray[j][i][1][3] === (modulus())){
        cell[i].className = 'day';
      }
    }
  }
  //day name header (thead)
  let header = table.createTHead();
  let head = header.insertRow(0);
  for(var k = 0; k<=6; k++){
    let dayCell = [];
    dayCell[k] = head.insertCell(k);
    dayCell[k].innerHTML = dayName[k];
  }
}