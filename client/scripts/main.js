import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import mainTemplate from '../templates/main.hbs';
// import dateTemplate from '../templates/dates.hbs';
import resultsTemplate from '../templates/results.hbs';
import party from '../templates/_party.hbs';
// import stateItem from '../templates/_state_item.hbs';
import candidate_item from '../templates/_candidate_item.hbs';
// import date_group from '../templates/_date_group.hbs';
import './handlebars-helpers.js';
import writeCredits from './writecredits';

document.addEventListener('DOMContentLoaded', () => {
  // make hover effects work on touch devices
  oHoverable.init();

  // remove the 300ms tap delay on mobile browsers
  attachFastClick(document.body);

  // YOUR CODE HERE!
  var results = spreadsheet.results; // [{"value":22,"party":"democrat","label":"Hillary Clinton"},{"value":21,"party":"democrat","label":"Bernie Sanders"},{"value":7,"party":"republican","label":"Tom O'Malley"},{"value":8,"party":"republican","label":"Donald Trump"},{"value":7,"party":"republican","label":"Ted Cruz"},{"value":3,"party":"republican","label":"Marco Rubio"},{"value":1,"party":"republican","label":"Ben Carson"},{"value":0,"party":"republican","label":"Rand Paul"},{"value":0,"party":"republican","label":"Jeb Bush"},{"value":0,"party":"republican","label":"Chris Christie"},{"value":0,"party":"republican","label":"Mike Huckabee"},{"value":0,"party":"republican","label":"John Kasich"},{"value":0,"party":"republican","label":"Carly Fiorina"},{"value":0,"party":"republican","label":"Rick Santorum"},{"value":0,"party":"republican","label":"Jim Gilmore"}];
  var candidates = [];
  var partyNames = [];
  var credits = spreadsheet.credits;

  document.querySelector('main').innerHTML = mainTemplate(spreadsheet);

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
  // sort each result into value order
  candidates.forEach(function (party) {
    var highest_score;
    if (party.party === 'democrats') {
      highest_score = spreadsheet.options.demdelegatestotal;
    } else if (party.party === 'republicans') {
      highest_score = spreadsheet.options.repdelegatestotal;
    }
    party.candidate.forEach(candidate => candidate.totaldel = highest_score);
    party.candidate.forEach(candidate => candidate.percent_difference = candidate.value / highest_score * 100);
    party.candidate.forEach(candidate => candidate.percent_difference_superdel = candidate.superdelegates / highest_score * 100);
    party.candidate.sort((b, a) => a.total > b.total ? 1 : (a.total < b.total ? -1 : 0)); // eslint-disable-line no-nested-ternary
  });
  console.log(candidates);
  var resultsHTML = resultsTemplate(candidates, {
    partials: {
      candidate_item,
      party
    }
  });
  document.querySelector('.results').innerHTML = resultsHTML;
  document.querySelector('.party-blurb.democrats').innerHTML = spreadsheet.options.demresultsblurb;
  document.querySelector('.party-blurb.republicans').innerHTML = spreadsheet.options.represultsblurb;

  // add headers to each date based on date sheets
  // dateTitles.forEach(function (row, indx) {
  //   document.querySelector('.' + dateTitles[indx].name + ' .date-heading').innerHTML = dateTitles[indx].value;
  // });

  document.querySelector('.byline').innerHTML = writeCredits(credits);
});
