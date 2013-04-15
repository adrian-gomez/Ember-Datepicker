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

App = Ember.Application.create({
  title: 'Date picker example',
  calendar: {
    month: new Date().getMonth+1,
    year: new Date().getFullYear()
  }
});

App.Store = DS.Store.extend({
  revision: 12,
  adapter: 'App.fixtureAdaptor'
});

App.Router.map(function() {
    this.route('home'),
    this.resource('calendar', {path: 'calendar/:year/:month'});
});

App.CalendarRoute = Ember.Route.extend({
  activate: function() {
    $(document).attr('title', 'Date Picker');
  },
  serialize: function(obj) {
    return {
        year: obj.year, month: obj.month
    }
  },
  model: function (params) {
    var obj = {
       weeks: calendar.getDaysInMonth(params.year, params.month),
       year: params.year,
       month: params.month
    };
    return obj;
  }, 
  setUpController: function(controller, model) {
    controller.set('content', model)
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
    var currentMonth = this.get('content.month');
    var nextMonth = parseInt(currentMonth)+1;
    if (nextMonth > 12) {
      nextMonth = 1;
      this.set('content.month', nextMonth);
      var currentYear = this.get('content.year');
      this.set('content.year', parseInt(currentYear)+1);  
    }
    var year = this.get('content.year');
    var router = this.get('target');
    
    router.transitionTo('calendar', {
      year: year,
      month: nextMonth
    });
    weeks = calendar.getDaysInMonth(year, nextMonth);
    this.set('content.weeks', weeks);
    
  },
  prev: function() {
      var currentMonth = this.get('content.month');
      var prevMonth = parseInt(currentMonth)-1;
      if (prevMonth < 1) {
          prevMonth = 12;
          this.set('content.month', prevMonth);
          var currentYear = this.get('content.year');
          this.set('content.year', parseInt(currentYear)-1);
      }
      var router = this.get('target');
      var year = this.get('content.year');
      router.transitionTo('calendar', {
        year: year,
        month: prevMonth
      });
      weeks = calendar.getDaysInMonth(year, prevMonth);
      this.set('content.weeks', weeks);
  },
  select: function(day) {
     var day = day;
     var month = this.get('content.month');
     var year = this.get('content.year');
     var date = new Date(year, month-1, day);
     Ember.set('App.DateValue.value',moment(date).format("dddd, MMMM Do, YYYY"));
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

