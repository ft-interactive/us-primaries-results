import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import mainTemplate from '../templates/main.hbs';
import dateTemplate from '../templates/dates.hbs';
import resultsTemplate from '../templates/results.hbs';
import party from '../templates/_party.hbs';
import state_item from '../templates/_state_item.hbs';
import candidate_item from '../templates/_candidate_item.hbs';
import date_group from '../templates/_date_group.hbs';
import hb_helper from'./handlebars-helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  // make hover effects work on touch devices
  oHoverable.init();

  // remove the 300ms tap delay on mobile browsers
  attachFastClick(document.body);

  // YOUR CODE HERE!
  var dateNames = [];
  var dates = [];
  var dataset = spreadsheet.data;
  var dateTitles = spreadsheet.dates;
  var results = spreadsheet.results;
  var candidates = [];
  var partyNames = [];
  var credits = spreadsheet.credits;

 // put the dataset into groups and add the corresponding indicators
  dateTitles.forEach(function (row) {
    dateNames.push(row.date);
    dates.push({
      date: row.date,
      annotation: row.annotation,
      state: []
    });
  });

  dataset.forEach(function (row) {
    var dateIndex = dateNames.indexOf(row.date);
    dates[dateIndex].state.push(row);
  });

  // sort dataset into date order
  dates.sort(function (a, b) {
    if (a.date > b.date) return 1;
    if (a.date < b.date) return -1;
    return 0;
  });

  // sort each date into alphabetical state order
  dates.forEach(function (date) {
    date.state.sort(function (a, b) {
      if (a.longstate > b.longstate) return 1;
      if (a.longstate < b.longstate) return -1;
      return 0;
    });
  });

  document.querySelector('main').innerHTML = mainTemplate(spreadsheet);

  var datesHTML = dateTemplate(dates, {
    partials: {
      state_item,
      date_group
    }
  });

  document.querySelector('.content').innerHTML = datesHTML;

  results.forEach(function (row) {
    if (partyNames.indexOf(row.party) === -1) {
      partyNames.push(row.party);
      candidates.push({
        party: row.party,
        candidate: []
      });
    }
    var partyIndex = partyNames.indexOf(row.party);
    candidates[partyIndex].candidate.push(row);
  });

var resultsHTML = resultsTemplate(candidates, {
    partials: {
      candidate_item,
      party
    }
  });
 document.querySelector('.results').innerHTML = resultsHTML;

  // add headers to each date based on date sheets
  // dateTitles.forEach(function (row, indx) {
  //   document.querySelector('.' + dateTitles[indx].name + ' .date-heading').innerHTML = dateTitles[indx].value;
  // });

  document.querySelector('.byline').innerHTML = writeCredits(credits);
});
