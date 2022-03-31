var $ = j341;

var wmpShippingTable, headerStrings;

$(document).ready(function () {
  // Remove any inline styling

  $('table.wmp-shipping').removeAttr('style').removeAttr('width').removeAttr('height');
  $('*', 'table.wmp-shipping').removeAttr('style');

  $('table.wmp-shipping tr').click(function (e) {
    $(this).toggleClass('open');
  });


  // Mark up redundant text so it can be hidden when headers are shown

  if ($('table.wmp-shipping').length) {
    wmpShippingTable = $('table.wmp-shipping').get(0);
    headerStrings = [];

    for (var i = 0; i < wmpShippingTable.tHead.rows[0].cells.length; i++) {
      var wmpCell = wmpShippingTable.tHead.rows[0].cells[i];

      if (wmpCell.nodeName == 'TH') {
        headerStrings.push(wmpCell.textContent);
      }
    }

    for (var j = 0; j < headerStrings.length; j++) {
      headerStrings[j] += '\\:?';
    }

    var reString = headerStrings.join('|');

    var re = new RegExp('^(' + reString + ')', 'gm')
    $('table.wmp-shipping td').each(function () {
      $(this).html($(this)
        .text()
        .replace(re, '<span class="repeat-text">$1</span>'));
    });
  }


});