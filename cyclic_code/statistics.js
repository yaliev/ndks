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
        label:{ textSize: 18,
            textColor: 'white',
            fill: 'RoyalBlue',
            padding: 4
        }
    };

    let stat = new Konva.Group ({
		id: 'stat',
		name:'Statistic panel',
		draggable:true
	});
	stat.layer = new Konva.Layer();
	stat.totalTime = {min:0, sec: 0};

	// statistics vars
	stat.errors = 0;
	stat.timer = {
		id:-1,
		min:0,
		sec:0,
		ms:0
	};

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

	stat.labelRect = new Konva.Rect({
	  id: stat.id()+'-labelRect',
	  //width: stat.rect.width(),
	  height: stat.rect.height(),
	  fill: props.label.fill,
	  cornerRadius: 4
	});
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

    // mouse hover info
    stat.info = new INFO(stat.layer, stat);

	// label height setting
	stat.labelRect.width(stat.labelTxt.width()+ props.label.padding*4);
	stat.labelTxt.width(stat.labelRect.width());

	stat.timeLabel = new Konva.Text({
        id: stat.id()+'-timeLabel',
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

	stat.timeVal = new Konva.Text({
        id: stat.id()+'-timeVal',
        x: stat.timeLabel.x()+stat.timeLabel.width(),
        y: stat.timeLabel.y(),
        height: stat.rect.height(),
        text: '00 '+lang.min+'  00 '+lang.sec,
        fontSize: props.label.textSize,
        fontFamily: 'Calibri',
        padding: props.label.padding,
        align: 'left',
        verticalAlign: 'middle',
        fill: 'SeaGreen ',
	});
	stat.timeVal.hover = lang.timerHover;
    // mоuse hover event
    stat.timeVal.on('mouseover touchstart', function(){
        stat.timeVal.shadowColor('red'),
        stat.timeVal.shadowBlur(10),
        stat.timeVal.shadowOpacity(1.0),
        stage.container().style.cursor = 'pointer';
        stat.info.show('i', stat.timeVal.hover);
        stat.layer.batchDraw();
    });

    // mоuse hover out event
    stat.timeVal.on('mouseout touchend', function(){
        stat.timeVal.shadowColor(''),
        stat.timeVal.shadowBlur(0),
        stat.timeVal.shadowOpacity(0),
        stage.container().style.cursor = 'default';
        stat.info.hide();
        stat.layer.batchDraw();
    });


	stat.errorLabel = new Konva.Text({
        id: stat.id()+'-errorLabel',
        x: stat.timeVal.x()+stat.timeVal.width() + props.margin,
        y: stat.timeVal.y(),
        height: stat.rect.height(),
        text: lang.err,
        fontSize: props.label.textSize,
        fontFamily: 'Calibri',
        padding: props.label.padding,
        align: 'left',
        verticalAlign: 'middle',
        fill: 'Navy',
	});

	stat.errorVal = new Konva.Text({
        id: stat.id()+'-timeVal',
        x: stat.errorLabel.x()+stat.errorLabel.width(),
        y: stat.errorLabel.y(),
        height: stat.rect.height(),
        text: '0',
        fontSize: props.label.textSize,
        fontFamily: 'Calibri',
        padding: props.label.padding,
        align: 'left',
        verticalAlign: 'middle',
        fill: 'DarkRed',
	});

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
		stat.timeVal.text(min+' '+lang.min+' '+sec+' '+lang.sec);
		stat.layer.batchDraw();
	};

	// timer init
	stat.timer.init = function(val){
		stat.timer.min = val;
		min = val < 10 ? "0" + val : val;
		stat.timeVal.text(min+' '+lang.min+' 00 '+lang.sec);
		stat.layer.batchDraw();
	};

	stat.timer.start = function(){
		stat.timer.id = setInterval(function(){
			stat.timer.update();
		}, 1000);
		//stat.timer.ms = Date.now();
		console.log('Timer was started!');
	};

	// Stopping the timer
	stat.timer.stop = function(){
		clearInterval(stat.timer.id);
		console.log('Timer was reset!');
	};

	// incrementing the error counter
	stat.errorAdd = function(){
		stat.errors++;
		stat.errorVal.text(stat.errors);
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

	// add components to mein group
    stat.add(stat.rect, stat.labelRect, stat.labelTxt, stat.timeLabel, stat.timeVal, stat.errorLabel, stat.errorVal,  stat.info);
	stat.layer.add(stat);

	return stat;
};