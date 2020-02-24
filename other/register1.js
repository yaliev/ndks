class Register{
	constructor (props, layer){
		this.gp = this.constructor.createKonvaGP(props, layer);
	} // end of constructor
	
	static createKonvaGP(props, layer){		
		var pading=10;
		var addDist = props.bitProp.width + pading*0.5;
		var height = props.bitProp.height+2*pading;	
		var width = addDist*(props.bitsNum)+addDist/1.4;
		// creating the general register group
		var regGroup = new Konva.Group ({
			id: props.id,
			name: props.name,
			width : width,
			height: height,		
			draggable:false,
		});
		
		// adding register's value property to regGroup
		var emtyArray = [];
		emtyArray.length=props.bitsNum;
		emtyArray.fill(0);
		regGroup.regVals=emtyArray;
		// register's background rectangle
		var panRect = new Konva.Rect({
			id: regGroup.id()+'-rect',
			x: props.position.x,
			y: props.position.y,
			width : regGroup.width(),
			height: regGroup.height(),
			fill: props.fill,
			shadowColor: 'black',
			shadowBlur: 10,
			shadowOpacity: 0.5,
			cornerRadius: 4
		});
		// register's title
		var panTitle = new Konva.Text({
			id: regGroup.id()+'-lab',
			x: panRect.x(),
			y: panRect.y() - props.labelDistance,
			width : regGroup.width(),
			text: props.name,
			fontSize: 20,
			fontFamily: 'Calibri',
			padding: 0,
			align: 'center',
			verticalAlign: 'middle',
			fill: 'black'
		});
		regGroup.add(panRect, panTitle);
		
		// creating register's conection soket	
		let connR={x: panRect.x() + panRect.width(), y: panRect.y()+(panRect.height()/2), visible: false};
		let connL={x: panRect.x(), y: panRect.y()+(panRect.height()/2), visible: false};
		let connU={x: panRect.x() + panRect.width()/2, y: panRect.y(), visible: false};
		let connD={x: panRect.x() + panRect.width()/2, y: panRect.y()+panRect.height(), visible: false};
		//regGroup.soket={connU:connU, connL:connL, connD:connD, connR:connR};
		regGroup.soket={connU: new Konva.Circle({id: regGroup.id()+'-connU', x: connU.x, y: connU.y, radius: 3, fill: 'red',visible: false}), 
						connL: new Konva.Circle({id: regGroup.id()+'-connL', x: connL.x, y: connL.y, radius: 3, fill: 'red',visible: false}), 
						connD: new Konva.Circle({id: regGroup.id()+'-connD', x: connD.x, y: connD.y, radius: 3, fill: 'red',visible: false}), 
						connR: new Konva.Circle({id: regGroup.id()+'-connR', x: connR.x, y: connR.y, radius: 3, fill: 'red',visible: false})};
		regGroup.add(regGroup.soket.connU, regGroup.soket.connL, regGroup.soket.connD, regGroup.soket.connR);
		layer.batchDraw();
		// show register's sokets points
		regGroup.soket.show = function(){
			for (var prop in regGroup.soket){
				//console.log(regGroup.soket[prop]);
				if (prop!=='connU' && prop!=='connL' && prop!=='connD' && prop!=='connR') continue;
				regGroup.soket[prop].visible(true);
				layer.draw();
			}
		}
		// hide register's sokets points
		regGroup.soket.hide = function(){
			for (var prop in regGroup.soket){
				if (prop!=='connU' && prop!=='connL' && prop!=='connD' && prop!=='connR') continue;
				regGroup.soket[prop].visible(false);
			}			
			layer.draw();
		}
		
		// creating bit groups
		var posX = panRect.x() + addDist/2;
		var posY = panRect.y() + pading;
		for (let i=0; i<props.bitsNum; i++){
			let bitGroup = new Konva.Group({
				id: regGroup.id()+'-bit'+i,
				width : props.bitProp.width,
				height: props.bitProp.height,
			});
			let rect = new Konva.Rect({
				id: bitGroup.id()+'-rect',
				x: posX,
				y: posY,
				width : bitGroup.width(), 
				height: bitGroup.height(), 
				fill: props.bitProp.fill,
				cornerRadius: 2  
			});
			let txt = new Konva.Text({
				id: bitGroup.id()+'-txt',
				x: posX,
				y: posY,
				width : bitGroup.width(), 
				height: bitGroup.height(),   
				text: '',
				fontSize: 24,
				fontFamily: 'Arial',
				align: 'center',
				verticalAlign: 'middle',
				fill: 'Navy'
			});	
			posX += addDist;
			
			txt.on('click touchstart', function(){
				let currVal = txt.text();
				let newVal;
				if (currVal == '0') newVal=1;
				else newVal=0;				
				txt.text(newVal.toString());
				regGroup.regVals[i]=newVal;
				layer.batchDraw();
			});	
			
			bitGroup.on('mouseover touchstart', function(){
				rect.shadowColor('red'),
				rect.shadowBlur(10),
				rect.shadowOpacity(0.5),
				stage.container().style.cursor = 'pointer';
				layer.batchDraw();
			});
			
			bitGroup.on('mouseout touchend', function(){
				rect.shadowColor(''),
				rect.shadowBlur(0),
				rect.shadowOpacity(0),
				stage.container().style.cursor = 'default';
				layer.batchDraw();
			});				
			regGroup.add(bitGroup.add(rect, txt));	
				
		}
		// register left shift
		regGroup.shiftRight = function(){
			regGroup.regVals.pop();
			regGroup.regVals.unshift('');
			for (let i=0; i<props.bitsNum; i++){
				layer.findOne('#ir-bit'+i+'-txt').text(regGroup.regVals[i].toString());
				layer.batchDraw();
			}
			return regGroup.regVals;
		};
		// register reverse
		regGroup.reverse = function(){
			regGroup.regVals.reverse();
			for (let i=0; i<props.bitsNum; i++){
				layer.findOne('#ir-bit'+i+'-txt').text(regGroup.regVals[i].toString());
				layer.batchDraw();
			}
			return regGroup.regVals;
		};
		// register load
		regGroup.load = function(vals){
			if (typeof vals === 'undefined' || typeof vals === 'null'){
				console.log('The values can not be empty');
				return;
			}
			else if (regGroup.regVals.length !== vals.length) {
				console.log('The length of values must be '+regGroup.regVals.length );
				return;
			}
			regGroup.regVals=vals;
			for (let i=0; i<props.bitsNum; i++){
				layer.findOne('#ir-bit'+i+'-txt').text(regGroup.regVals[i].toString());
				layer.batchDraw();
			}			
			
			return regGroup.regVals;
		};
		return regGroup;
	}; // end of konvaGP
	
} // end of class