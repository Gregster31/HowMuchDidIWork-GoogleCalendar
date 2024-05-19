var CALENDAR_ID = 'TO_CHANGE'; // Replace with the ID of the calendar you want to retrieve events from 
/**
 * Runs when the add-on is installed.
 */
function onInstall(e) {
  onHomepage(e);
}

/**
 * Runs when the add-on is opened from Calendar.
 */
function onHomepage(e) {
  var card = createCard();

  // return CardService.newActionResponseBuilder()
  //     .setNavigation(CardService.newNavigation().updateCard(card))
  //     .build();

  return card
}

/**
 * Creates a card to display the total event time.
 * A card is a pane in the sidebar.
 */
function createCard() {
  var totalHours = getTotalEventTime();
  Logger.log('Total Hours: ' + totalHours);
  
  var cardSection = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
          .setText('Job Total time for the week: ' + totalHours + ' hours'));
  
  var cardBuilder = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader().setTitle('Weekly Job Time'))
      .addSection(cardSection);

  var card = cardBuilder.build();

  if (!card) {
    Logger.log('Card is null');
  }

  return card;
}



/**
 * Gets the total time of all events in a specific calendar for the current week (Sunday to Saturday).
 */
function getTotalEventTime() {
  var calendarId = CALENDAR_ID; 
  
  var now = new Date();
  var startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the current week (Sunday)
  var endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the current week (Saturday)
  
  var events = CalendarApp.getCalendarById(calendarId).getEvents(startOfWeek, endOfWeek);
  
  Logger.log('Number of events: ' + events.length);

  var totalTime = 0; // in milliseconds

  if (events.length > 0) {
    events.forEach(function(event) {
      var startTime = event.getStartTime();
      var endTime = event.getEndTime();
      totalTime += endTime - startTime;
    });
  }

  // Convert milliseconds to hours
  var totalHours = totalTime / (1000 * 60 * 60);

  // Return the total time
  return totalHours.toFixed(2); // Round to 2 decimal places for better readability
}
