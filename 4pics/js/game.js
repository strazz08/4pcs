// object that maps the level number to its answer
// you can add more levels just by adding another
// entry to this object and incrementing nooflevels by one
var leveltoanswers = {
	1 : "CHEERDANCE",
	2 : "RAPPING",
	3 : "TABLETOP",
	4 : "GRAFFITI",
	5 : "STUNT",
	6 : "HURDLE",
	7 : "STREETDANCE",
	8 : "CARTWHEEL",
	9 : "BATTLE",
	10 : "TOUCHDOWN",
}

var nooflevels = 10; // number of levels
var currentlevel = 1; // starting level

// tempanswer will store the string of characters that
// are supposed to be in the answer string
// but have not yet been added by the player
var tempanswer = leveltoanswers[currentlevel];

var noofhints = 2; // number of hints

// mapping between ith option and a boolean which is true
// if the ith option has not been used yet.
var options = {
	0 : true, 1 : true, 2 : true, 3 : true, 4 : true, 5 : true, 6 : true, 7 : true, 8 : true, 9 : true, 10 : true, 11 : true, 12 : true, 13 : true, 14 : true, 15 : true, 16 : true, 17 : true
}

var blanks = {} // object for blanks

var letters = {} // object for letters

var freq = {} // stores the frequency of occurrence of a letter in the answer string

var tempfreq = {} // stores the frequency of occurrence of a letter in the current submission


function main() {
	// the main function
	var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var answer = leveltoanswers[currentlevel];
	for (var i = 0; i < 26; ++i) {
		// set all frequency counts to 0
		freq[alphabets[i]] = 0;
		tempfreq[alphabets[i]] = 0;
	}
	for (var i = 0; i < answer.length; ++i)
		freq[answer[i]] += 1; // count the frequency of characters in the answer string

	addimages(currentlevel); // add images for the current level
	// set onclick attribute of the images to viewfullimage
	// viewfullimage(defined in imagefullsize.js) expands the clicked image
	$(".hintimage").attr("onclick", "viewfullimage(this)");
	addblanks(currentlevel); // add blanks for this level
	addoptions(currentlevel); // add letter options for this level
}

///////////////////////////////////////////////////////////////////////////////
// check if the current submission is correct

function getsubmission() {
	var x = "";
	$(".blank").each(function(item, element) {
		x += element.innerHTML; // add individual characters from blanks
	});

	return x;
}

function checkifcorrect(level) {
	var submission = getsubmission();
	if (submission === leveltoanswers[level])
		return true;
	return false;
}

///////////////////////////////////////////////////////////////////////////////
// To add images

function addimages(level) {
	$("#smallimages").empty(); // clear the #smallimages div
	var dir = "./img/level" + level + "/"; // directory base url

	// add image elements
	for (var i = 1; i <= 2; ++i) {
		var imagelocation = dir + i + ".jpg" ;
		$("#smallimages").append("<img src=" + imagelocation + " class='hintimage'>");
	}
	$("#smallimages").append("<br>");
	for (var i = 3; i <= 4; ++i) {
		var imagelocation = dir + i + ".jpg" ;
		$("#smallimages").append("<img src=" + imagelocation + " class='hintimage'>");
	}
}

///////////////////////////////////////////////////////////////////////////////
// To add blanks

function addblanks(level) {
	$("#blanks").empty(); // clear the #blanks div
	var answer = leveltoanswers[level];
	for (var i = 0; i < answer.length; ++i) {
		$("#blanks").append("<span class='blank' onclick='deselect(\"" + i + "\")'>_</span>");
		blanks[i] = null;
	}

	// add a hint button
	$("#blanks").append("<div id='hintbutton' onclick='hint(" + level + ")'><i class='fas fa-lightbulb' style='font-size: 60px;'></i><br><span id='noofhints'></span></div><br><br>")
	$("#noofhints")[0].innerHTML = noofhints + " hint(s) remaining";
}

///////////////////////////////////////////////////////////////////////////////
// To add options

function addoptions(level) {
	 // create a string containing the answer mixed with random alphabets
	var s = createstring(level);
	for (var i = 0; i < 18; ++i) {
		letters[i] = s[i];
	}
	$("#letters").empty(); // empty the #letters div
	// add elements dynamically to the #letters div
	for (var i = 0; i < 9; ++i)
		$("#letters").append("<span class='letter' onclick='addletter(\"" + s[i] + "\", " + i + ")'>" + s[i] + "</span>");
	$("#letters").append("<br>");
	for (var i = 9; i < 18; ++i)
		$("#letters").append("<span class='letter' onclick='addletter(\"" + s[i] + "\", " + i + ")'>" + s[i] + "</span>");
}

// function for random shuffling
String.prototype.shuffle = function() {

	var that = this.split("");
	var len = that.length, t, i;
	while(len) {
		i = Math.random() * len-- | 0;
		t = that[len], that[len] = that[i], that[i] = t;
	}
	return that.join("");
}

/*
creates string by padding the answer string with
random letter that are not already in the answer
string. Then returns the shuffled string in the end.
*/
function createstring(level) {
	var answer = leveltoanswers[level];
	var numberremaining = 18 - answer.length;
	var s = answer;
	var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var possible = "";
	for (var i = 0; i < alphabets.length; ++i) {
		if (answer.indexOf(alphabets[i]) == -1)
			possible += alphabets[i];
	}
	possible = possible.shuffle();
	for (var i = 0; i < numberremaining; ++i)
		s += possible[i];
	s = s.shuffle();
	return s;
}

///////////////////////////////////////////////////////////////////////////////

// updates the tempanswer variable which stores
// the characters that are in the current level's answer
// but not in the current submission by the user.
// tempanswer will be used to add hints
function updatetempanswer() {
	var answer = leveltoanswers[currentlevel];
	var s = "";
	$(".blank").each(function(item, element){
		var xxx = element.innerHTML;
		if (xxx === "_" || xxx != answer[item]) {
			s += answer[item];
		}
	});
	tempanswer = s;
}

///////////////////////////////////////////////////////////////////////////////
// To add letters to the submission

function allfilled() {
	// check if all blanks are currently filled
	var isempty = false;
	$(".blank").each(function(item, element) {
		if (element.innerHTML == "_")
			isempty = true;
	});

	return !isempty;
}

function findfirstvacant() {
	// find the first empty blank
	var elementtoreturn;
	var index;
	var blanks = document.getElementsByClassName("blank");
	for (var i = 0; i < blanks.length; ++i) {
		if (blanks[i].innerHTML == "_") {
			index = i;
			elementtoreturn = blanks[i];
			break;
		}
	}
	// return the first empty html element(of class blank) and the index
	// of that element in the array containing elements of class blank
	return [elementtoreturn, index];
}

function addletter(lettertoadd, index) {
	// function to add letter to the current submission.
	// this is called when one of the options is clicked.
	if (options[index] == false) {
		// if letter is already used, do nothing and return
		return;
	}
	else {
		// find first empty blank
		var ffv = findfirstvacant();
		var element = ffv[0];
		var elindex = ffv[1];

		element.innerHTML = lettertoadd;
		options[index] = false; // mark the clicked option as false

		// set onclick to null and change styles
		$(".letter")[index].onclick = null;
		$(".letter")[index].style.cursor = "not-allowed";
		$(".letter")[index].style.background = "green";

		// store a reference to the letter option which was clicked to add
		// to this(first empty) blank. This will be used to deselect this option
		blanks[elindex] = index;
		updatetempanswer(); // update the tempanswer variable
		tempfreq[lettertoadd] += 1;

		// if all blanks have been filled check whether the submission
		// is correct or not. Call nextmove().
		if (allfilled())
			nextmove();
	}
}

///////////////////////////////////////////////////////////////////////////////
// DESELECT a character

function deselect(elindex) {
	// function to deselect a letter option by clicking on the
	// corresponding blank
	if ($(".blank")[elindex].innerHTML == "_") {
		// if the clicked blank is already blank ("_")
		return;
	}

	var lettertoremove = $(".blank")[elindex].innerHTML;
	tempfreq[lettertoremove] -= 1; // reduce the frequency count by one
	$(".blank")[elindex].innerHTML = "_"; // set the current .blank element's innerHTML
	var index = blanks[elindex]; // get index of the option to deselect
	options[index] = true; // enable the option
	$(".letter")[index].onclick = function() { // set onclick attribute
		addletter(letters[index], index);
	};
	// set the styles of the deselected option
	$(".letter")[index].style.cursor = "pointer";
	$(".letter")[index].style.background = "#222";
	$(".blank").css("color", "black");
	updatetempanswer(); // update tempanswer variable
}

///////////////////////////////////////////////////////////////////////////////
// NEXT MOVES

function nextmove() {
	if (checkifcorrect(currentlevel)) {
		// if current submission is correct

		if (currentlevel === nooflevels) {
			// if the answer for the last level is correct
			// redirect to congratulations page
			window.location = "congrats.html";
		}

		// show next level
		currentlevel++;
		tempanswer = leveltoanswers[currentlevel];

		// reset everything
		options = {
			0 : true, 1 : true, 2 : true, 3 : true, 4 : true, 5 : true, 6 : true, 7 : true, 8 : true, 9 : true, 10 : true, 11 : true, 12 : true, 13 : true, 14 : true, 15 : true, 16 : true, 17 : true
		}

		blanks = {
		}

		letters = {
		}

		noofhints = 2;
		main(); // call main to update images, blanks and letter options
	}

	else {
		// current submission is incorrect, mark incorrect.
		markincorrect();
	}
}


function markincorrect() {
	// set color to red to show incorrect submission
	$(".blank").css("color", "red");
}

///////////////////////////////////////////////////////////////////////////////
// HINT
// Adding a hint will add a character in the correct position as it
// appears in the final answer string

function findLetter(letter) {
	// function to return the index of the letter option element
	// which will be marked as selected when the hint letter is added
	var index;
	$(".letter").each(function(item, element) {
		if (element.innerHTML == letter) {
			index = item;
		}
	});
	return index;
}

function getRandomLetter() {
	// function to get one letter from the tempanswer string
	// this letter is chosen at random
	var position = Math.floor(Math.random() * tempanswer.length); // random index
	var letter = tempanswer.charAt(position); // get character at index position

	// remove this letter from the tempanswer string
	tempanswer = tempanswer.substr(0, position) + tempanswer.substr(position + 1, tempanswer.length);
	var pos; // pos will store the index where the hint letter should be added
	var answer = leveltoanswers[currentlevel]; // get current level's answer
	for (var i = 0; i < answer.length; ++i) {
		if (answer[i] == letter && $(".blank")[i].innerHTML != letter) {
			pos = i;
			break;
		}
	}

	return [letter, pos]; // return the hint letter and its position in the final answer string
}

function addhint(lettertoadd, index, position) {
	// function to add hints given the hint letter, its position
	// and the index of the letter option to be marked as selected
	var answer = leveltoanswers[currentlevel];
	if (tempfreq[lettertoadd] == freq[lettertoadd]) {
		/*
		if the hint letter appears the same number of times in both
		the current submission and the answer string, we need to remove
		one of these letter from the current submission (since we already
		know that one of the hint letter is not in its correct position
		in the current submission).
		*/
		var firstfoundat;
		for (var i = 0; i < answer.length; ++i) {
			if ($(".blank")[i].innerHTML == lettertoadd) {
				firstfoundat = i;
				break;
			}
		}

		deselect(firstfoundat);
		tempfreq[lettertoadd] -= 1;
	}

	// get the blank at index = position
	var element = $(".blank")[position];
	var elindex = position;

	if (element.innerHTML != "_")
		deselect(position);

	// add the hint letter in the blank
	element.innerHTML = lettertoadd;
	options[index] = false; // disable the letter option at the given index
	$(".letter")[index].onclick = null; // disable the click event handler

	// the same code as addletter() method above
	$(".letter")[index].style.cursor = "not-allowed";
	$(".letter")[index].style.background = "green";
	blanks[elindex] = index;
	$(".blank")[elindex].onclick = null;
	$(".blank")[elindex].style.cursor = "not-allowed";
	tempfreq[lettertoadd] += 1;
	if (allfilled())
		nextmove();
}

function hint() {
	// function to add hints
	if (noofhints <= 0) {
		// if all hints have been used, do nothing and return
		return;
	}
	var grl = getRandomLetter(); // get the hint letter from tempanswer string
	var letter = grl[0];
	var position = grl[1];
	var index = findLetter(letter); // find the hint letter in the letter options
	noofhints--; // decrement number of hints by one
	addhint(letter, index, position); // add hint
	$("#noofhints")[0].innerHTML = noofhints + " hint(s) remaining"; // update the innerHTML for number of hints remaining
}

///////////////////////////////////////////////////////////////////////////////
