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

	// creating timer object
    stat.timer = new Konva.Group ();
    stat.timer.ID = -1;
    stat.timer.mun = 0;
    stat.timer.sec = 0;
    stat.timer.ms = 0;

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

    stat.timer.val.hoverTxt = lang.startTimer;
    stat.timer.val = hover1(stat.timer.val,  stat.timer);
    stat.timer.val = over(stat.timer.val);

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
    // error history panel
    stat.errHistory = new Konva.Group ({
		id: stat.error.id()+'errHistory',
		x: stat.error.val.x() + 20,
		y: stat.error.val.y(),
		draggable: true,
		visible: false
    });
	stat.add(stat.errHistory);
	stat.errHistory.rect = new Konva.Rect({
		id: stat.errHistory.id()+'-rect',
		width: 0,
		height: 5,
		fill: 'FloralWhite',
		opacity: 0.9,
		shadowColor: 'black',
		shadowBlur: 10,
		shadowOpacity: 0.5,
		cornerRadius: 4
	});
	stat.errHistory.add(stat.errHistory.rect);
    stat.errHistory = over(stat.errHistory);


	stat.errHistory.insert = (error) =>{
		let dist = 5;
		let pos = {x: dist, y: dist};
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

		if (stat.errHistory.rect.width() < txt.width() + dist*2)
			stat.errHistory.rect.width(txt.width() + dist*2);
		stat.errHistory.rect.height(stat.errHistory.rect.height() + txt.height() + dist);
	};

    stat.add(stat.error);

	stat.error.val.hoverTxt = lang.showErrors;
	stat.error.val = hover1(stat.error.val, stat.error);
	stat.error.val = over(stat.error.val);

	stat.error.on('click touchstart', function(){
		if(stat.errHistory.visible()) stat.errHistory.visible(false);
		else stat.errHistory.visible(true);
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

	stat.timer.update = function(){
		if (stat.timer.sec > 0) stat.timer.sec--;
		else {
			stat.timer.sec = 59;
			stat.timer.min--;

			if(stat.timer.min < 0){
				stat.timer.stop();
				stat.timer.min = 0;
				stat.timer.sec = 0;
			}
		}

		let sec, min;
		sec = stat.timer.sec < 10 ? "0" + stat.timer.sec : stat.timer.sec;
		min = stat.timer.min < 10 ? "0" + stat.timer.min : stat.timer.min;
		stat.timer.val.text(min+' '+lang.min+' '+sec+' '+lang.sec);
		stat.layer.batchDraw();
	};

	// timer init
	stat.timer.init = function(val){
		stat.timer.min = val;
		min = val < 10 ? "0" + val : val;
		stat.timer.val.text(min+' '+lang.min+' 00 '+lang.sec);
		stat.layer.batchDraw();
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


	stat.reset = function(){
		this.totalTime.min += this.timer.min;
		this.totalTime.sec += this.timer.sec;
		if(this.totalTime.sec > 59) {
			this.totalTime.sec = this.totalTime.sec % 60;
			this.totalTime.min++;
		}
		this.timer.min = 0;
		this.timer.sec = 0;
		this.timer.stop();
		this.layer.destroy();
	};
    stat.layer.add(stat);

    // set size;
	stat.width(stat.rect.width());
	stat.height(stat.rect.height());

	return stat;
};