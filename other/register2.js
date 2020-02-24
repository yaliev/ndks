function Register(regProp, layer){
	var addDist = regProp.bitProp.width + regProp.pading*0.5;
	var height = regProp.bitProp.height+2*regProp.pading;	
	var width = addDist*(regProp.bitsNum)+addDist/1.4;
	// creating the general register group
	var reg = new Konva.Group ({
		id: regProp.id,
		name: regProp.name,
		width : width,
		height: height,		
		draggable:false,
	});
	
	// adding register's value property to reg
	var emtyArray = [];
	emtyArray.length=regProp.bitsNum;
	emtyArray.fill(0);
	reg.values=emtyArray;
	// register's background rectangle
	reg.panRect = new Konva.Rect({
		id: reg.id()+'-rect',
		x: regProp.position.x,
		y: regProp.position.y,
		width : reg.width(),
		height: reg.height(),
		fill: regProp.fill,
		shadowColor: 'black',
		shadowBlur: 10,
		shadowOpacity: 0.5,
		cornerRadius: 4
	});
	// register's title
	reg.panTitle = new Konva.Text({
		id: reg.id()+'-lab',
		x: reg.panRect.x(),
		y: reg.panRect.y() - regProp.labelDistance,
		width : reg.width(),
		text: regProp.name,
		fontSize: 20,
		fontFamily: 'Calibri',
		padding: 0,
		align: 'center',
		verticalAlign: 'middle',
		fill: 'black'
	});
	reg.add(reg.panRect, reg.panTitle);
	
	// creating register's conection soket	
	let connR={x: reg.panRect.x() + reg.panRect.width(), y: reg.panRect.y()+(reg.panRect.height()/2), visible: false};
	let connL={x: reg.panRect.x(), y: reg.panRect.y()+(reg.panRect.height()/2), visible: false};
	let connU={x: reg.panRect.x() + reg.panRect.width()/2, y: reg.panRect.y(), visible: false};
	let connD={x: reg.panRect.x() + reg.panRect.width()/2, y: reg.panRect.y()+reg.panRect.height(), visible: false};
	//reg.soket={connU:connU, connL:connL, connD:connD, connR:connR};
	reg.soket={connU: new Konva.Circle({id: reg.id()+'-connU', x: connU.x, y: connU.y, radius: 3, fill: 'red',visible: false}), 
					connL: new Konva.Circle({id: reg.id()+'-connL', x: connL.x, y: connL.y, radius: 3, fill: 'red',visible: false}), 
					connD: new Konva.Circle({id: reg.id()+'-connD', x: connD.x, y: connD.y, radius: 3, fill: 'red',visible: false}), 
					connR: new Konva.Circle({id: reg.id()+'-connR', x: connR.x, y: connR.y, radius: 3, fill: 'red',visible: false})};
	reg.add(reg.soket.connU, reg.soket.connL, reg.soket.connD, reg.soket.connR);
	layer.batchDraw();
	// show register's sokets points
	reg.soket.show = function(){
		for (var prop in reg.soket){
			//console.log(reg.soket[prop]);
			if (prop!=='connU' && prop!=='connL' && prop!=='connD' && prop!=='connR') continue;
			reg.soket[prop].visible(true);
			layer.batchDraw();
		}
	}
	// hide register's sokets points
	reg.soket.hide = function(){
		for (var prop in reg.soket){
			if (prop!=='connU' && prop!=='connL' && prop!=='connD' && prop!=='connR') continue;
			reg.soket[prop].visible(false);
		}			
		layer.batchDraw();
	}
	
	// creating bit groups
	var posX = reg.panRect.x() + addDist/2;
	var posY = reg.panRect.y() + regProp.pading;
	reg.bits=[];
	for (let i=0; i<regProp.bitsNum; i++){
		let bit = new Konva.Group({
			id: reg.id()+'-bit'+i,
			width : regProp.bitProp.width,
			height: regProp.bitProp.height,
		});
		bit.rect = new Konva.Rect({
			id: bit.id()+'-rect',
			x: posX,
			y: posY,
			width : bit.width(), 
			height: bit.height(), 
			fill: regProp.bitProp.fill,
			cornerRadius: 2  
		});
		bit.txt = new Konva.Text({
			id: bit.id()+'-txt',
			x: posX,
			y: posY,
			width : bit.width(), 
			height: bit.height(),   
			text: '',
			fontSize: 24,
			fontFamily: 'Arial',
			align: 'center',
			verticalAlign: 'middle',
			fill: 'Navy'
		});	
		posX += addDist;
		
		bit.txt.on('click touchstart', function(){
			let currVal = bit.txt.text();
			let newVal;
			if (currVal == '0') newVal=1;
			else newVal=0;				
			bit.txt.text(newVal.toString());
			reg.values[i]=newVal;
			layer.batchDraw();
		});	
		
		bit.on('mouseover touchstart', function(){
			bit.rect.shadowColor('red'),
			bit.rect.shadowBlur(10),
			bit.rect.shadowOpacity(0.5),
			stage.container().style.cursor = 'pointer';
			layer.batchDraw();
		});
		
		bit.on('mouseout touchend', function(){
			bit.rect.shadowColor(''),
			bit.rect.shadowBlur(0),
			bit.rect.shadowOpacity(0),
			stage.container().style.cursor = 'default';
			layer.batchDraw();
		});	
		bit.add(bit.rect, bit.txt);
		reg.bits[i]=bit;
		reg.add(reg.bits[i]);			
	}
	
	// register left shift
	reg.shiftRight = function(){
		reg.values.pop();
		reg.values.unshift('');
		for (let i=0; i<regProp.bitsNum; i++){
			layer.findOne('#ir-bit'+i+'-txt').text(reg.values[i].toString());
			layer.batchDraw();
		}
		return reg.values;
	};
	// register reverse
	reg.reverse = function(){
		reg.values.reverse();
		for (let i=0; i<regProp.bitsNum; i++){
			layer.findOne('#ir-bit'+i+'-txt').text(reg.values[i].toString());
			layer.batchDraw();
		}
		return reg.values;
	};
	// register load
	reg.load = function(vals){
		if (typeof vals === 'undefined' || typeof vals === 'null'){
			console.log('The values can not be empty');
			return;
		}
		else if (reg.values.length !== vals.length) {
			console.log('The length of values must be '+reg.values.length );
			return;
		}
		reg.values=vals;
		for (let i=0; i<regProp.bitsNum; i++){
			layer.findOne('#ir-bit'+i+'-txt').text(reg.values[i].toString());
			layer.batchDraw();
		}
		return reg.values;
	};
	
	// show register
	reg.show = function (){
		reg.visible(true);
		layer.batchDraw();
	}
	// hide register
	reg.hide = function (){
		reg.visible(false);
		layer.batchDraw();
	}
	return reg;
} // end of constructor