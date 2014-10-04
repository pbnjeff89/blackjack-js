/* Blackjack - Assume a deck comprised of many decks
*  such that the probability of taking any card out of
*  the deck at any time is equally probable.
*/

var game = new Game();

function Game() {
    var money = 1000;
    var minBet = 50;
    var bet;
    var betSplit;
    var insurance;
    var validBet;
    var playerHand;
    var playerHandSplit;
    var dealerHand;
    var deckPos;
    var pCardCount;
    var dCardCount;
    var playerCount;
    var dealerCount;
    var dealerTurn;
    var pList;
    var dList;
    var i,j;

    var nHands;
    var turn;
    

    // -----------------------
    // Hand checks
    // -----------------------

    function handValue(hand) {
        var i;
        var aces = 0;
        var count = 0;
        var value;
        for (i=0; i < hand.length; i++) {
            value = hand[i] % 13;
            if (value == 0) {
                count += 11;
                aces++;
            }
            else if (value > 0 && value < 9) count += value + 1;
            else count += 10;
        }

        while (count > 21 && aces > 0) {
            count -= 10;
            aces--;
        }

        return count;
    }

    // -----------------------
    // Button-functions
    // -----------------------

    this.doubleDown = function() {
        bet *= 2;
        playerHand.push(deck[deckPos]);
        pCardCount++;
        deckPos++;
        document.getElementById("dd").disabled = true;
        display();
        dealerTurn = 1;
        dealerPlay();
    }

    this.splitHand = function() {

        // split up hand
        // create separate bet amt
        // continue playing

        playerHandSplit.push(playerHand[1]);
        playerHand.pop(playerHand[1]);

        betSplit = bet;

    }



    this.initialDeal = function() {
        bet = document.getElementById("bet").value;
        validBet = checkBet(bet);
        if (validBet === 1) {
        
            bet = parseInt(bet);
            playerHand.push(deck[deckPos]);
            pCardCount++;
            deckPos++;
            dealerHand.push(deck[deckPos]);
            dCardCount++;
            deckPos++;
            playerHand.push(deck[deckPos]);
            pCardCount++;
            deckPos++;
            dealerHand.push(deck[deckPos]);
            dCardCount++;
            deckPos++;

            display();

            document.getElementById("dd").disabled = false;
            document.getElementById("start").disabled = true;
            document.getElementById("hit").disabled = false;
            document.getElementById("stay").disabled = false;

            if (dealerHand[0] % 13 == 0) document.getElementById("insurance").disabled = false;
            if (playerHand[0] % 13 === playerHand[1] % 13) document.getElementById("split").disabled = false;
        }
    }

    this.hit = function() {
        document.getElementById("dd").disabled = true;
        playerHand.push(deck[deckPos]);
        pCardCount++;
        deckPos++;
        display();

        if (handValue(playerHand) > 21) {
            document.getElementById("hit").disabled = true;
            document.getElementById("stay").disabled = true;
            dealerTurn = 1;

            dealerPlay();
        }
    
        return;
    }

    this.stay = function() {
        document.getElementById("hit").disabled = true;
        document.getElementById("stay").disabled = true;
        document.getElementById("dd").disabled = true;
    
        dealerTurn = 1;
        dealerPlay();
        return;
    }

    // ------------------------
    // Internal game operations
    // ------------------------

    function checkBet(amt) {
        if (isNaN(amt)) {
            document.getElementById("winner").innerHTML = "Give a number.";
            return 0;
        }
        if (amt < minBet) {
            document.getElementById("winner").innerHTML = "Bet at least the minimum.";
            return 0;
        }
        if (Math.ceil(amt) != Math.floor(amt)) {
            document.getElementById("winner").innerHTML = "Give an integer";
            return 0;
        }
        if (amt > money) {
            document.getElementById("winner").innerHTML = "Bet no more money than what you have.";
            return 0;
        }
        else return 1;
    }
            

    function dealerPlay() {
        display();

        while (handValue(dealerHand) < 17) {
            dealerHand.push(deck[deckPos]);
            dCardCount++;
            deckPos++;
            display();
        }

        display();
        winner();
    }

    function winner() {
        var playerVal = handValue(playerHand);
        var dealerVal = handValue(dealerHand);

        var win;

        if (playerVal > 21) win = 0;
        else if (dealerVal > 21) win = 1;
        else if (dealerVal > playerVal) win = 0;
        else if (dealerVal == playerVal) win = 2;
        else win = 1;

        if (win == 1) {
            document.getElementById("winner").innerHTML = "You win!";
            money += bet;
        }
        else if (win == 2) {
            document.getElementById("winner").innerHTML = "Push.";
        }
        else {
            document.getElementById("winner").innerHTML = "You lose...";
            money -= bet;
        }
    
        document.getElementById("restart").disabled = false;
        return;
    }

    // -----------------------
    // Interface functions
    // -----------------------

    function display() {
        var temp = new Array();
        temp = dealerHand[0];
        var pList = "";
        var dList = "";

        for (i=0; i<pCardCount; i++) {
            pList += "<img src=\"" + playerHand[i] + ".jpg\" />";
        }

        document.getElementById("playerN").innerHTML = "You have: " + handValue(playerHand);
        	document.getElementById("player").innerHTML = pList;

        if (dealerTurn == 0) {
            dList = "<img src=\"" + dealerHand[0] + ".jpg\" />" + "<img src=\"back.png\" />";
            document.getElementById("dealerN").innerHTML = "The dealer has: ??";
        }
        else {
            for (i=0; i<dCardCount; i++) {
                dList += "<img src=\"" + dealerHand[i] + ".jpg\" />";
            }
            document.getElementById("dealerN").innerHTML = "The dealer has: " + handValue(dealerHand);
        }
        document.getElementById("dealer").innerHTML = dList;
    }

    // -----------------------
    // Helper functions
    // -----------------------
    
    this.initialize = function() {
        playerHand = new Array();
        dealerHand = new Array();
        deckPos = 0;
        pCardCount = 0;
        dCardCount = 0;
        playerCount = 0;
        dealerCount = 0;
        dealerTurn = 0;
        pList = "";
        dList = "";
        firstHand = 1;

        deck = shuffleDeck();
        deckMap = setNames();
        numPlayers = 2;
        i,j;

        document.getElementById("hit").disabled = true;
        document.getElementById("stay").disabled = true;
        document.getElementById("restart").disabled = true;
        document.getElementById("dd").disabled = true;
        document.getElementById("split").disabled = true;
        document.getElementById("insurance").disabled = true;
        document.getElementById("start").disabled = false;
        document.getElementById("insurancebet").disabled = true;


        document.getElementById("money").innerHTML = "Money: $" + money;
        document.getElementById("minbet").innerHTML = "Minimum bet: $" + minBet;
    }
    // creates a randomized deck
    function shuffleDeck() {
        var deckCheck = new Array(52);
        var deck = new Array();
        var k;
        var i;
        var counter = 0;

        // fill up 52-array with 1's, indicating that the
        // card still is there
        for (i=0; i<52; i++) {
            deckCheck[i] = 1;
        }

        while (counter < 52) {
            k = Math.floor(Math.random() * 52);

            if (deckCheck[k] == 1) {
                deck[deck.length] = k;
                deckCheck[k] = 0;
                counter++;
            }
        }
        return deck;
    }

    // returns a deck that holds the names of the cards
    function setNames() {
        var deck = new Array();
        var counter;
        var num;
        var name;
        var i;

        for (i=0; i<52; i++) {
            counter = 0;
            num = i;
            name = "";

            while (num > 12) {
                num -= 13;
                counter++;
            }

            switch (counter) {
                case 0:
                    name += "&clubs;";
                    break;
                case 1:
                    name += "&diams;";
                    break;
                case 2:
                    name += "&hearts;";
                    break;
                case 3:
                    name += "&spades;";
            }
        
            if (num == 0) name += "A ";
            else if (num > 0 && num < 10) name += (num + 1) + " ";
            else if (num == 10) name += "J ";
            else if (num == 11) name += "Q ";
            else if (num == 12) name += "K ";

            deck[i] = name;
        }

        return deck;
    }
    this.initialize();
}
