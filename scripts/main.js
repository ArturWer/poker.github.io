"use strict"
let suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
let ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
let hand = getRandomHand();
let btn = document.querySelector(".newCards");
let cards = document.querySelectorAll(".cards img");
let msg = document.querySelector(".msg");
let WIDTH = window.innerWidth;
/* it's for better testing
	hand = [
	{suit:"Spades",rank:9},
	{suit:"Spades",rank:"Queen"},
	{suit:"Hearts",rank:"Queen"},
	{suit:"Diamonds",rank:"Queen"},
	{suit:"Clubs",rank:5}];
*/

function setupCardsSize(){
	console.log(WIDTH);
}
function random(num){
  return Math.random()*num;
};

function getRadomCard(){
	let randomSuit = Math.floor(random(suits.length));
	let randomRank = Math.floor(random(ranks.length));
	return {suit:suits[randomSuit], rank:ranks[randomRank]};
};

function getRandomHand(){
	let hand = [];
	for (var i = 0; i < 5; i++) {
		let card = getRadomCard();
		/* check if it's new card or no */
		if (hand.length>0) {
			hand.forEach(oldCard=>{
				if (oldCard.suit === card.suit) {
					if (oldCard.rank === card.rank) {
						console.log("Need new card");
						card = getRadomCard();
					}
				}
			});
		} 
		hand.push(card);
	};
	return hand;
};

function drawCards(){
	for (let i = 0; i < hand.length; i++){
		let src = `img/${hand[i].suit}/${hand[i].rank}_${hand[i].suit}.png`;
		cards[i].src = src;
	}

};
/* array strings n-times exercise*/
function arrayContainsNTimes (array, nTimes, string){
	let count = 0;
	array.forEach((value)=>{
		if (value === string) {
			count++;
		}
	});
	if (count >= nTimes) {
		return true;
	} else return false;
};

function checkTwoPairs(ranks){
	let firstCard = ranks.shift();
	let pairsArray = [];

	function searchPairs(array){
		array.forEach((item, index)=>{
			if (firstCard === item) {
				pairsArray.push(firstCard);
				ranks.splice(index, 1);
			}
		});
	};
	for (var i = ranks.length - 1; i > 0; i--) {
		searchPairs(ranks);
		firstCard = ranks.shift();
	}
	
	if (pairsArray.length === 2) {
		return pairsArray;
	} else return false;
};
function convertNameCarts(card){
	if (card === "Jack") return 11;
	else if (card === "Queen") return 12;
	else if (card === "King") return 13;
	else if (card === "Ace") return 14;
	else return Number(card);
};
function checkStraight(ranks){
	let  isStraight = true;
	ranks = ranks.sort();
	let newArr = ranks.map(card=>{
		return convertNameCarts(card);
	});
	/* Ace is 1 or 14 */
	if ((Number(newArr[0]) === 2) && newArr[4] === 14) 
		newArr[4] = 1;

	newArr = newArr.sort((a,b)=>{
		return a-b;
	});
	for (var i = 0; i < newArr.length; i++) {
		if ((i >= 0) && (i <= 3)) {
			if((newArr[i]+1) !== newArr[i+1])
				isStraight = false;
		}
	}
	return isStraight;
};

function checkFullHouse(ranks){
	let pair = [];
	let trio = [];
	let isNOTFullHouse;
	pair = ranks.splice(0, 1);
	ranks.forEach(rank=>{
		if (pair[0] === rank) 
			pair.push(rank);
		else if (trio.length === 0) 
			trio.push(rank);
		else if (trio[0] === rank) 
			trio.push(rank);
		else
			isNOTFullHouse = true;
	});
	return !isNOTFullHouse;
};

function checkFlush(){
	let isFlush = true;
	let firstSuit;
	let suits = hand.map(card=>{
		return card.suit;
	});
	firstSuit = suits[0];
	suits.forEach(suit=>{
		if (suit !== firstSuit) 
			isFlush = false;
	});
	return isFlush;
};
function checkRoyalFlush(){
	let ranks = hand.map(card=>{
		return card.rank;
	});
	let newNumArr = ranks.map(card=>{
		return convertNameCarts(card);
	});
	newNumArr = newNumArr.sort((a,b)=>{
		return a-b;
	});
	if (newNumArr[0] === 10) {
		document.body.style.backgroundColor = "red";
		return true;
	}
}

function find(ranks){
	let isPair = false;
	let isTrio = false;
	let is4Cards = false;
	let twoPairs = false;
	let isStraight = false;
	let isFullHouse = false;
	let isFlush = false;
	let isRoyalFlush = false;
	ranks.forEach(rank=>{
		if (!isPair) 
			isPair = arrayContainsNTimes(ranks, 2, rank);
		if (!isTrio) 
			isTrio = arrayContainsNTimes(ranks, 3, rank);
		if (!is4Cards) 
			is4Cards = arrayContainsNTimes(ranks, 4, rank);
	});
	if (isPair && !isTrio) 
		twoPairs = checkTwoPairs(ranks);
	if (!isPair && !isTrio && !is4Cards)
		isStraight = checkStraight(ranks);
	if (isTrio)
		isFullHouse = checkFullHouse(ranks);
	if (!isPair && !isTrio && !is4Cards && !twoPairs)	
		isFlush = checkFlush();
	if (isFlush && isStraight)
		isRoyalFlush = checkRoyalFlush();

	let para = document.createElement("p");
	if (is4Cards) para.textContent = "You have FOUR of a kind";	
	else if (isRoyalFlush) para.textContent = "You have ROYAL FLUSH";
	else if (isFlush && isStraight) para.textContent = "You have STRAIGHT FLUSH";
	else if (isStraight) para.textContent = "You have STRAIGHT";
	else if (isFlush) para.textContent = "You have FLUSH";
	else if (isFullHouse) para.textContent = "You have FULL HOUSE";	
	else if (isTrio) para.textContent = "Three of a kind";	
	else if (twoPairs) para.textContent = `You have TWO pairs: ${twoPairs[0]}\'s and ${twoPairs[1]}\'s`;
	else if (isPair && !twoPairs) para.textContent = "You have ONE pair";	
	else {
		document.body.style.backgroundColor = "black";
		para.className = "red";
		para.textContent = "No game \:\(   Try again";
	}
	msg.appendChild(para);
}

function checkCards(){
	if (hand.length === 5) {
		let ranks = hand.map((card)=>{
			return card.rank;
		});
		find(ranks);
	}
};

function getNewCard(){
	msg.innerHTML = "";
	hand = getRandomHand();
	document.body.style.backgroundColor = "darkgreen";
	drawCards();
	checkCards();
};
btn.addEventListener("click", getNewCard);

document.addEventListener("keyup", e=>{
	if (e.code === "Space") 
		getNewCard();
});

setupCardsSize();
drawCards();
checkCards();