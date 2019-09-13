
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
// MAGNIFIC
// ------------------
// $('.test-popup-link').magnificPopup({
//   type: 'image',
//   gallery: { enabled: true },
//   type: 'image',
//   image: {
//     titleSrc: 'title'
//     // this tells the script which attribute has your caption
//   }
// })

// // This will create a single gallery from all elements that have class "gallery-item"
// $('.gallery-item').magnificPopup({
//   type: 'image',
//   gallery: {
//     enabled: true
//   }
// })
