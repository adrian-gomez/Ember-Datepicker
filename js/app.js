/* the basics */
/* Code below */
var calendar = {
  getDaysInMonth: function(month, year) {
    var currentDate = new Date();
    // just make an array of this month
    
    var month = month;
    var year = year;
    var daysInMonth = moment(year + "-" +  month, "YYYY-M").daysInMonth();
    var weeks = [];
    var days = [];
    var j = 0;
    var step = 7;
    
    // first week setup
    var dayCounter = 1;
    var dateObjMonth = parseInt(month)-1;
    var firstDay = new Date(year, dateObjMonth, dayCounter);
    var firstDayOfWeek = firstDay.getDay();

    while (firstDayOfWeek != j) {
      days.push(' ');
      j++;
    }

    while (j < step) {
      var date = new Date(year, dateObjMonth, dayCounter);
      days.push(moment(date).format('DD'));
      dayCounter++;
      j++;
    }
    weeks.push({'days': days}); 
    //days.length = 0;
    for (var i=dayCounter; i<=daysInMonth; i+=step) {
        var nextdays = [];
        for (var k = i; k < i + step; k++) {
            day = k;
            if (k > daysInMonth) {
              nextdays.push(' ');
            } else {
              var date = new Date(year, dateObjMonth, day);
              nextdays.push(moment(date).format('DD'));
          }
        } // end inner for loop
        weeks.push({'days': nextdays}); 
    } 
  return weeks; 
  } // end get month
} // end calendar object

App = Ember.Application.create();

App.Store = DS.Store.extend({
  revision: 12,
  adapter: 'App.fixtureAdaptor'
});

App.Router.map(function() {
    this.resource('calendar', { path: '/calendar/:currentYear/:currentMonth'});
});

App.CalendarRoute = Ember.Route.extend({
  model: function (params) {
    var obj = {
       weeks: calendar.getDaysInMonth(params.currentMonth, params.currentYear),
       currentMonth: params.currentMonth,
       currentYear: params.currentYear
    };
    return obj;
  }
});

App.Datepicker = Ember.TextField.extend({
    click: function() {
      $('#popover').show();
      var date = new Date();
      var month = date.getMonth()+1;
      var year = date.getFullYear();
      var route = '#/calendar/'
      window.location.href= route + year + '/' + month;
    },
    valueBinding: 'App.DateValue.value'
});

App.DateValue = Em.Object.create({
    value: ''
});

App.CalendarController = Ember.Controller.extend({
  next: function() {
    var currentMonth = this.get('content.currentMonth');
    var nextMonth = parseInt(currentMonth)+1;
    this.changeMonth(nextMonth);
  },
  prev: function() {
      var currentMonth = this.get('content.currentMonth');
      var prevMonth = parseInt(currentMonth)-1;
      this.changeMonth(prevMonth);
  },
  select: function(day) {
     var day = day;
     var month = this.get('content.currentMonth');
     var year = this.get('content.currentYear');
     var date = new Date(year, month-1, day);
     Ember.set('App.DateValue.value',moment(date).format("dddd, MMMM Do, YYYY"));
  },
  changeMonth: function(monthMove) {
    var weeks;
    var yearEnd = 12;
    var yearBegin = 1;
    if (monthMove > yearEnd) {
      monthMove = 1;
      this.set('content.currentMonth', monthMove);
      var currentYear = this.get('content.currentYear');
      this.set('content.currentYear', parseInt(currentYear)+1);
      weeks = calendar.getDaysInMonth(monthMove,this.get('content.currentYear'));
      this.set('content.weeks', weeks);
    } else if (monthMove < yearBegin) {
      monthMove = 12;
      this.set('content.currentMonth', monthMove);
      var currentYear = this.get('content.currentYear');
      this.set('content.currentYear', parseInt(currentYear)-1);
      weeks = calendar.getDaysInMonth(monthMove,this.get('content.currentYear'));
      this.set('content.weeks', weeks);
    } else {
      this.set('content.currentMonth', monthMove);
      weeks = calendar.getDaysInMonth(monthMove,this.get('content.currentYear'));
      this.set('content.weeks', weeks);
    }
  }
});

/* Calendar bound helper */
Ember.Handlebars.registerBoundHelper('month', function(currentMonth) {
  return moment().month(currentMonth-1).format('MMMM');
});

Ember.Handlebars.registerBoundHelper('showMonthTable', function(daysList) {
    html = "";
    var len = daysList.length;
      for (var i = 0; i < len; i++) {
         var obj = daysList[i];
         if (i % 7 == 0) {
            if (i == 0) {
              html += '<tr>';
            } else if (i == len-1) {
              html += '</tr>';
            } else {
              html += '</tr><tr>';
            }
         }
         html += '<td>';
         html += daysList[i];
         html += '</td>';
      } // end for loop
      return new Handlebars.SafeString(html);
});

