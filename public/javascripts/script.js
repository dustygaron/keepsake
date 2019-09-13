
// ------------------
// DATEPICKER
// ------------------
$('.datepicker').pickadate({
  // labelMonthNext: 'Go to the next month',
  // labelMonthPrev: 'Go to the previous month',
  labelMonthSelect: 'Pick a month from the dropdown',
  labelYearSelect: 'Pick a year from the dropdown',
  selectMonths: true,
  selectYears: 30,
  selectYear: 'picker__select--year',
  // formatSubmit: 'yyyy/mm/dd',
  hiddenName: true,
  min: undefined,
  max: true
})
// fix for auto close bug in chrome
$('.datepicker').on('mousedown', function (event) { event.preventDefault() })

// ------------------
// MODAL
// ------------------

$(document).ready(function () {
  $('.modal').modal()
})

// ------------------
// TOOLTIP
// ------------------
//   document.addEventListener('DOMContentLoaded', function() {
var elems = document.querySelectorAll('.tooltipped');
var instances = M.Tooltip.init(elems, options);
  });