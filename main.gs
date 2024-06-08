var CALENDAR_ID = 'TO CHANGE '; // Replace with the ID of the calendar you want to retrieve events from 


function onInstall(e) {
  onHomepage(e);
}


function onHomepage(e) {
  var card = createCard(e);

  return card;
}


function createCard(e) {
  var now = new Date();

  // Get the hours for the current week
  var currentWeekTotalHours = getCurrentTotalEventTime(now);

  // Create new section for hours of the current week
  var currentWeek = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Total Job time for the week: ' + currentWeekTotalHours + ' hours'));

  // Calculate the start date of the next week
  var nextWeekStartDate = new Date(now);
  nextWeekStartDate.setDate(now.getDate() + 7);
  var nextWeekTotalHours = getCurrentTotalEventTime(nextWeekStartDate);
  var nextWeek = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Total Job time for next week: ' + nextWeekTotalHours + ' hours'));

  // Calculate the start date of the previous week
  var previousWeekStartDate = new Date(now);
  previousWeekStartDate.setDate(now.getDate() - 7);
  var previousWeekTotalHours = getCurrentTotalEventTime(previousWeekStartDate);
  var previousWeek = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph()
      .setText('Total Job time for previous week: ' + previousWeekTotalHours + ' hours'));

  var cardBuilder = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle('Weekly Job Time'))
    .addSection(currentWeek)
    .addSection(nextWeek)
    .addSection(previousWeek);

  // If formInput is provided (indicating form submission), add section for chosen week
  if (e && e.formInput && e.formInput.weekPicker) {
    var selectedDate = new Date(e.formInput.weekPicker);
    var chosenWeekTotalTime = getCurrentTotalEventTime(selectedDate);
    var chosenWeek = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Total Job time for chosen week: ' + chosenWeekTotalTime + ' hours'));
    cardBuilder.addSection(chosenWeek);
  }

  var card = cardBuilder.build();

  if (!card) {
    Logger.log('Card is null');
  }

  return card;
}



function getCurrentTotalEventTime(now) {
  var startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the current week (Sunday)
  var endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the current week (Saturday)

  var events = CalendarApp.getCalendarById(CALENDAR_ID).getEvents(startOfWeek, endOfWeek);

  var totalTime = 0; // in milliseconds

  if (events.length > 0) {
    events.forEach(function(event) {
      var startTime = event.getStartTime();
      var endTime = event.getEndTime();
      totalTime += endTime - startTime;
    });
  }

  var totalHours = totalTime / (1000 * 60 * 60);

  return totalHours.toFixed(2); // Round to 2 decimal places for better readability
}
