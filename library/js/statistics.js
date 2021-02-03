function STATISTICS(lang){
	return createStatistics(lang);
}// end of STAT

// Creating the Statistics Panel
createStatistics = function(lang){
    let props ={
        solveTime: 0, // in minutes
        width: 500,
        height: 30,
        fill: 'FloralWhite',
        stroke: 'SlateGray',
        margin: 15,
        label:{ textSize: 20,
				textColor: 'white',
				fill: 'RoyalBlue',
				padding: 4
        }
    };

    // create empty span tag in cpntrol panel
    let stat = $("<span id='stat' class='border border-info'></span>" ).appendTo("#cp");
    //stat.draggable();
	stat.css({backgroundColor: props.fill, "border-color": props.fill});
    stat.lang = lang;
	stat.totalTime = {min:0, sec: 0};
	stat.modelName='model';
	stat.userName='user';
	stat.css("padding-left","0px");
	stat.css("padding-top","4px");
	stat.css("padding-bottom","5px");

	// creating title of statistics panel
	stat.title = $("<label class='bg-info text-white'><b>"+lang.title+"</b></label>").appendTo(stat);
	stat.title.css("padding-left","5px");
	stat.title.css("padding-right","5px");
	stat.title.css("padding-top","3px");
	stat.title.css("padding-bottom","5px");

	// creating timer object
	stat.timer = $("<span id='timer' ></span>").appendTo(stat);
	stat.timer.ID = -1;
	stat.timer.min = 0;
	stat.timer.sec = 0;
	stat.timer.css({display: "inline-block", margin: "5px"});
	stat.timer.maxSec = 1200; // default max time=20 min

	stat.timer.label = $("<span id='timerLabel' >"+lang.time+"</span>").appendTo(stat.timer);
	//stat.timer.label.text(lang.time);
	stat.timer.label.css("display", "inline-block");
	stat.timer.label.css({color:'green'});

	stat.timer.val = $("<span id='timerVal' ></span>").appendTo(stat.timer);
	stat.timer.val.text( '00 : 00 ');
	stat.timer.val.attr('title', lang.maxTime +' '+ (Math.floor(stat.timer.maxSec / 60)+lang.min+ ' '+Math.floor(stat.timer.maxSec % 60)+lang.sec));
	stat.timer.val.css("margin-left","3px");
	stat.timer.val.css("display", "inline-block");

	stat.timer.update = function(){
		if (stat.timer.sec < 59) stat.timer.sec++;
		else {
				stat.timer.sec = 0;
				stat.timer.min++;

				// check for maxSec
				if((stat.timer.min*60) + stat.timer.sec >= stat.timer.maxSec ){
					stat.timer.stop();
					stat.timer.min = 0;
					stat.timer.sec = 0;
			}
		}

		// set time format hh:mm
		let sec, min;
		sec = stat.timer.sec < 10 ? "0" + stat.timer.sec : stat.timer.sec;
		min = stat.timer.min < 10 ? "0" + stat.timer.min : stat.timer.min;
		stat.timer.val.text(min+' : '+sec+' ');
	};

	// set max time
	stat.timer.setMaxTime = function(time){
		if(typeof time.min === 'undefined') return console.log('The time.min is not defined!');
		if(typeof time.sec === 'undefined') time.sec = 0;
		stat.timer.maxSec = time.min*60 + time.sec;
		//stat.timer.val.hoverTxt = lang.maxTime +' '+ (Math.floor(stat.timer.maxSec / 60)+lang.min+ ' '+Math.floor(stat.timer.maxSec % 60)+lang.sec);
		stat.timer.val.attr('title', lang.maxTime +' '+ (Math.floor(stat.timer.maxSec / 60)+lang.min+ ' '+Math.floor(stat.timer.maxSec % 60)+lang.sec));
	};

	stat.timer.start = function(){
		stat.timer.ID = setInterval(function(){
			stat.timer.update();
		}, 1000);
		//stat.timer.ms = Date.now();
		console.log('Timer is started!');
	};

	// Stopping the timer
	stat.timer.stop = function(){
		clearInterval(stat.timer.ID);
		console.log('Timer is stopped!');
	};


    // creating error object
	stat.error = $("<span id='error' class='menuItem' ></span>").appendTo(stat);
	stat.error.css("display", "inline-block");
    stat.error.count = 0;
	stat.error.history =[];
	stat.error.label = $("<span id='errorLabel'></span>").appendTo(stat.error);
	stat.error.label.css("display", "inline-block");
	stat.error.label.text(lang.err);
	stat.error.css({color:'red'});
	stat.error.val = $("<button id='errorVal' class='btn btn-link' type='button'></button>").appendTo(stat.error);
	stat.error.val.css("padding-left","3px");
	stat.error.val.css("display", "inline-block");
	stat.error.val.text(stat.error.count || '0');

	stat.error.val.attr('title', lang.showErrors);

	// jquery error dialog
	stat.error.errDialog = $("<div id='errDialog' class='menuItem dialog' ></div>").appendTo(stat);
	stat.error.errDialog.dialog({autoOpen : false, modal : false, show : "blind", hide : "blind",
											 width: 'auto', height:'auto', minWidth:300, maxHeight:500});
	stat.error.errDialog.dialog({title: lang.errHistory});
	stat.error.errDialog.css({'font-size': 14, 'margin':0, 'padding': 5, 'color': 'red'});


	stat.error.on('click', function(){
		stat.error.errDialog.dialog('open');
	});

	// incrementing the error counter
	stat.error.add = function(errStr){
		stat.error.count++;
		stat.error.history.unshift(errStr);
		stat.error.val.text(stat.error.count);
		stat.error.errDialog.append('<span>'+stat.error.count+'. '+errStr+'</span></br>');
	};

	stat.reset = function(){
		this.timer.min = 0;
		this.timer.sec = 0;
		this.error.count = 0;
		this.error.history = '';
		this.timer.stop();
		try{stat.errDialog.empty();}catch(err){};
		stat.errDialog = '';
		console.log('Stats was reseted!');
	};

	stat.logData = function(test=false){
		let data = {};
		data = {userName: stat.userName,
				modelName: stat.modelName,
				time: (stat.timer.min*60 + stat.timer.sec),
				errCount: stat.error.count,
				errDetails:stat.error.history};

		if(test){
			data = {userName: 'testUser',
					modelName: 'testModelName',
					time: '00:00',
					errCount: '0',
					errDetails:['Error 1','Error 2']};
			console.log('Log test data : ', data);
		}
		console.log(sentData(data));
	};
	return stat;
};