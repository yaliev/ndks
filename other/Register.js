class Register{
	constructor (props, layer){
		this.id = props.id;
		this.name = props.name;
		this.position = props.position;
		this.fill = props.fill;
		this.bitsNum = props.bitsNum;
		this.bitProp = props.bitProp;
		this.labelDistance = props.labelDistance;
	}
}// end of class

Register.prototype.createKonvaGP=function(){
	//var labelDistance = 25;
	var pading=10;
	var addDist = this.bitProp.width + pading*0.5;
	var height = this.bitProp.height+2*pading;	
	var width = addDist*(this.bitsNum)+addDist/1.4;
	var regGroup = new Konva.Group ({
		id: this.id,
		name: this.name,
		width : width,
		height: height,		
		draggable:false		
	});
	var emtyArray = [];
	emtyArray.length=this.bitsNum;
	emtyArray.fill(0);
	regGroup.setAttrs({regVals:emtyArray});
	var panRect = new Konva.Rect({
		id: regGroup.id()+'-rect',
		x: this.position.x,
		y: this.position.y,
		width : regGroup.width(),
		height: regGroup.height(),
		fill: this.fill,
		shadowColor: 'black',
		shadowBlur: 10,
		shadowOpacity: 0.5,
		cornerRadius: 4
	});
	var panLabel = new Konva.Text({
		id: regGroup.id()+'-lab',
		x: panRect.x(),
		y: panRect.y() - this.labelDistance,
		width : regGroup.width(),
		text: this.name,
		fontSize: 20,
		fontFamily: 'Calibri',
		padding: 0,
		align: 'center',
		verticalAlign: 'middle',
		fill: 'black'
	});
	regGroup.add(panRect, panLabel);

	var posX = panRect.x() + addDist/2;
	var posY = panRect.y() + pading;
	for (let i=0; i<bitsNum; i++){
		let bitGroup = new Konva.Group({
			id: regGroup.id()+'-bit'+i,
			width : this.bitProp.width,
			height: this.bitProp.height,
		});
		let rect = new Konva.Rect({
			id: bitGroup.id()+'-rect',
			x: posX,
			y: posY,
			width : bitGroup.width(), 
			height: bitGroup.height(), 
			fill: this.bitProp.fill,
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
			regGroup.getAttr('regVals')[i] = newVal;
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
	return regGroup;		
} // end of create method	