'use strict';

$(function() {
	$('.quoteIt').click(getQuote);
	renderList();
	$('.remove').click(removeStock);
});


function getQuote(e) {
	e.preventDefault();

	var symbol = $('.searchbox').val();

	$.getJSON('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=' + symbol + '&callback=?')
	.done(function(data) {
		var $myQuote = addStock(data);
		$('.myStocks').append($myQuote);
	$('.trackIt').click(trackStock);

	})
	.fail(function(err) {
		console.log('err:', err);
	})

	$.getJSON('http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + symbol + '&callback=?')
	.done(function(data) {
		var $myQuote = trackPriceChange(data);
		$('.myStocks').append($myQuote);
	})
	.fail(function(err) {
		console.log('err:', err);
	})
}

function addStock(quoteObj) {
	var $card = $('<div>').addClass('card');
	var $name = $('<p>').addClass('cardName').text(`Name: ${quoteObj[0].Name}`);
	var $symbol = $('<p>').addClass('cardSymbol').text(`Symbol: ${quoteObj[0].Symbol}`);
	var $exchange = $('<p>').addClass('cardEexchange').text(`Exchange: ${quoteObj[0].Exchange}`);
	var $button = $('<button>').text('Track It').addClass('trackIt btn');

	$card.append($name, $symbol, $exchange, $button);
	$('.searchbox').val("");
	return $card;
}

function trackPriceChange(priceObj) {
	var $card = $('.card');
	var $lastPrice = $('<p>').addClass('cardLastPrice').text(`Last Price: ${priceObj.LastPrice}`);
	var $change =$ ('<p>').addClass('cardChange').text(`Change: ${priceObj.Change}`);
	$card.append($lastPrice, $change);
	return $card;
}

function trackStock(e){

	var card = $(this).siblings();
	for(var i = 0; i<card.length; i++){
	var $cardName = card[0].textContent.replace('Name: ','');
	var $cardSymbol = card[1].textContent.replace('Symbol: ','');
	var $cardExchange = card[2].textContent.replace('Exchange: ','');
	var $cardLastPrice = card[3].textContent.replace('Last Price: ','');
	var $cardChange = card[4].textContent.replace('Change: ','');
	}
	var myCard = {name: $cardName, symbol: $cardSymbol, exchange: $cardExchange, price: $cardLastPrice, change: $cardChange};
	console.log(myCard);
	var card = MyCardData.get();
	card.push(myCard);
	MyCardData.write(card);
	$('.card').remove();
	renderList();
	location.reload();
}

function renderList() {

	var cards = MyCardData.get();
  	var arr = cards.map(function(card) {
    console.log(card)
	var symbol = card.symbol;
	var name = card.name;
	var exchange = card.exchange;
	var lastPrice = card.price;
	var change = card.change;

	var newRow = $('.rowTemplate').clone().removeClass('rowTemplate hidden');
	var newSymbol = newRow.children('#stockSym').text(symbol);

	var newName = newRow.children('#stockName').text(name);
	var newExchange = newRow.children('#stockExch').text(exchange);
	var newLastPrice = newRow.children('#stockPrice').text(lastPrice);
	var newChange = newRow.children('#stockSym').text(change);
	return newRow;
	 })
	$('.table').append(arr);
	MyCardData.write(cards);
};

function removeStock() {
	var cards = MyCardData.get();
	var index = $(this).index();
	cards.splice(index, 1);
	MyCardData.write(cards);
	location.reload();
	renderList();
}


var MyCardData = {
	get: function() {
		try {
			var MyCardData = JSON.parse(localStorage.MyCardData);
			// console.log("MyCardData", MyCardData);
		} catch(err) {
			var MyCardData = [];
		}
		return MyCardData;
	},
	write: function (card) {
		localStorage.MyCardData = JSON.stringify(card);
	}
};



