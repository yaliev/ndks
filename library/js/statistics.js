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

    let stat = new Konva.Group ({
		id: 'stat',
		name:'Statistic panel',
		draggable:false
	});
    stat.lang = lang;
	stat.layer = new Konva.Layer();
	stat.totalTime = {min:0, sec: 0};
	stat.modelName='model';
	stat.userName='user';

	stat.rect =  new Konva.Rect({
		id: stat.id()+'-rect',
		width : props.width,
		height: props.height,
		fill: props.fill,
		shadowColor: 'black',
		shadowBlur: 10,
		shadowOpacity: 0.5,
		cornerRadius: 4
	});
    stat.add(stat.rect);

	stat.labelRect = new Konva.Rect({
	  id: stat.id()+'-labelRect',
	  height: stat.rect.height(),
	  fill: props.label.fill,
	  cornerRadius: 4
	});
    stat.add(stat.labelRect);

	stat.labelTxt =  new Konva.Text({
	  id: stat.id()+'-labelTxt',
	  //width:stat.labelRect.width(),
      height:stat.labelRect.height(),
	  text: lang.title,
	  fontSize: props.label.textSize,
	  fontFamily: 'Calibri',
	  padding: 0,
	  align: 'center',
	  verticalAlign: 'middle',
	  fill: props.label.textColor,
	});
    stat.add(stat.labelTxt);

	// label height setting
	stat.labelRect.width(stat.labelTxt.width()+ props.label.padding*4);
	stat.labelTxt.width(stat.labelRect.width());

	stat.timer = new Konva.Group ({id:'timer'});
	// creating timer object
	stat.timer.ID = -1;
	stat.timer.min = 0;
	stat.timer.sec = 0;
	stat.timer.maxSec = 1200; // default max time=20 min

	stat.timer.label = new Konva.Text({
        id: stat.timer.id()+'-label',
        x: stat.labelRect.x()+stat.labelRect.width() + props.margin,
        y: stat.labelRect.y(),
        height: stat.rect.height(),
        text: lang.time,
        fontSize: props.label.textSize,
        fontFamily: 'Calibri',
        padding: props.label.padding,
        align: 'left',
        verticalAlign: 'middle',
        fill: 'Navy',
	});
    stat.timer.add(stat.timer.label);

	stat.timer.val = new Konva.Text({
        id: stat.timer.id()+'-value',
        x: stat.timer.label.x()+stat.timer.label.width(),
        y: stat.timer.label.y(),
        height: stat.rect.height(),
        text: '00 '+lang.min+'  00 '+lang.sec,
        fontSize: props.label.textSize,
        fontFamily: 'Calibri',
        padding: props.label.padding,
        align: 'left',
        verticalAlign: 'middle',
        fill: 'SeaGreen ',
	});
    stat.timer.add(stat.timer.val);
    stat.add(stat.timer);

    stat.timer.val.hoverTxt = lang.maxTime +' '+ (Math.floor(stat.timer.maxSec / 60)+lang.min+ ' '+Math.floor(stat.timer.maxSec % 60)+lang.sec);
    stat.timer.val = hover1(stat.timer.val,  stat.timer);
    stat.timer.val = over(stat.timer.val);

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
		stat.timer.val.text(min+' '+lang.min+' '+sec+' '+lang.sec);
		stat.layer.batchDraw();
	};

	// set max time
	stat.timer.setMaxTime = function(time){
		if(typeof time.min === 'undefined') return console.log('The time.min is not defined!');
		if(typeof time.sec === 'undefined') time.sec = 0;
		stat.timer.maxSec = time.min*60 + time.sec;
		stat.timer.val.hoverTxt = lang.maxTime +' '+ (Math.floor(stat.timer.maxSec / 60)+lang.min+ ' '+Math.floor(stat.timer.maxSec % 60)+lang.sec);
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
    stat.error = new Konva.Group ();
    stat.error.count = 0;
	stat.error.history =[];
	stat.error.label = new Konva.Text({
        id: stat.id()+'-errorLabel',
        x: stat.timer.val.x()+stat.timer.val.width() + props.margin,
        y: stat.timer.val.y(),
        height: stat.rect.height(),
        text: lang.err,
        fontSize: props.label.textSize,
        fontFamily: 'Calibri',
        padding: props.label.padding,
        align: 'left',
        verticalAlign: 'middle',
        fill: 'Navy',
	});

    stat.error.add(stat.error.label);

	stat.error.val = new Konva.Text({
        id: stat.id()+'-timeVal',
        x: stat.error.label.x()+stat.error.label.width(),
        y: stat.error.label.y(),
        height: stat.rect.height(),
        text: stat.error.count || '0',
        fontSize: props.label.textSize,
        fontFamily: 'Calibri',
        padding: props.label.padding,
        align: 'left',
        verticalAlign: 'middle',
        fill: 'DarkRed',
	});
    stat.error.add(stat.error.val);

	stat.errHistory = new PANEL({name: lang.errHistory,
										position: {x: stat.error.val.x() + 20, y: stat.error.val.y()}
	});
	stat.add(stat.errHistory);
	stat.errHistory.size({width: 0, height: 30});
	stat.errHistory.visible(false);
	stat.errHistory.dragmove(true);

	// jquery dialog
	stat.errDialog = $("#errDialog").dialog({autoOpen : false, modal : false, show : "blind", hide : "blind", width: 'auto', height:'auto', minWidth:250, maxHeight:500});
	stat.errDialog.dialog({title: lang.errHistory});
	stat.errDialog.css({'font-size': 14, 'margin':0, 'padding': 5, 'color': 'red'});

	stat.errHistory.insert = (error) =>{
		let dist = 5;
		let pos = {x: dist, y: stat.errHistory.label.height() + dist};
		let last = stat.errHistory.findOne('#last');
		let txt = null;
		if(typeof last === 'undefined'){ // for empty history situation
			txt = new Konva.Text({
				id: 'last',
				name: 'errItem',
				position: pos,
				text: error,
				fontSize: 14,
				fontFamily: 'Calibri',
				padding: 0,
				align: 'left',
				verticalAlign: 'middle',
				fill: 'red',
			});
			stat.errHistory.add(txt);
		}
		else { // for not empty history situation
			// move the old errors with one position bottom
			stat.errHistory.find('.errItem').each(err =>{
				err.move({x:0, y: err.height() + dist});
			});
			// create the new error item
			txt = stat.errHistory.findOne('#last').clone();
			stat.errHistory.findOne('#last').id(''); // clear the 'last' id
			txt.id('last');
			txt.text(error);
			txt.move({x:0, y:-(txt.height()+dist)});
			stat.errHistory.add(txt);
		}
		$("#errDialog").append('<span>'+error+'</span></br>');

		if (stat.errHistory.width() < txt.width() + dist*2)
			stat.errHistory.size({width: txt.width() + dist*2});
		stat.errHistory.size({height:stat.errHistory.rect.height() + txt.height() + dist});
		//stat.errHistory.rect.height(stat.errHistory.rect.height() + txt.height() + dist);
	};
    stat.add(stat.error);

	stat.error.val.hoverTxt = lang.showErrors;
	stat.error.val = hover1(stat.error.val, stat.error);
	stat.error.val = over(stat.error.val);

	stat.error.on('click touchstart', function(){
		if(stat.errHistory.visible()) {
			// stat.errHistory.visible(false);
			stat.errDialog.dialog('close');
		}
		else {
			// stat.errHistory.visible(true);
			stat.errDialog.dialog('open');
		}
		stat.layer.batchDraw();


	});

	// incrementing the error counter
	stat.error.add = function(errStr){
		stat.error.count++;
		stat.error.history.unshift(errStr);
		stat.error.val.text(stat.error.count);
		stat.errHistory.insert(errStr);
		stat.layer.batchDraw();
	};
	// insert multiple errors
	stat.error.insert = function(erros){
		stat.error.count = erros.count;
		stat.error.history = erros.history;
		stat.error.val.text(stat.error.count);
		erros.history.forEach(err =>{
			stat.errHistory.insert(err);
		});
		stat.layer.batchDraw();
	};

	stat.reset = function(){
		this.timer.min = 0;
		this.timer.sec = 0;
		this.error.count = 0;
		this.error.history = '';
		this.timer.stop();
		this.layer.destroy();
	};
    stat.layer.add(stat);

    // set size;
	stat.width(stat.rect.width());
	stat.height(stat.rect.height());

	stat.logData = function(){
		let data = {fileName: stat.userName,
					modelName: stat.modelName,
					time: (stat.timer.min*60 + stat.timer.sec),
					errCount: stat.error.count,
					errDetails:stat.error.history};
		sentData(data);
	};
	return stat;
};