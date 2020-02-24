	var width = window.innerWidth;
	var height = window.innerHeight;

	var stage = new Konva.Stage({
		container: 'container',
		width: width,
		height: height,
		cursor: 'default'
	});
	
	var layer = new Konva.Layer();	
	var initX = width*0.07, initY = height*0.2, distX = width*0.1, distY = height*0.15, corrX=width*0.005;
	var colorA = 'red', colorP='black', colorO='Maroon'; colorAfill = 'black'; colorAstroke = 'black';
	var colorRfill = 'white'; colorRstroke = 'blue'; colorShadow = 'black', colorPstroke='Cornsilk', colorPfill='Cornsilk';
	var labelDistance = 25; pading=10;
	var ratio = 0.48, width = 20, height = width / ratio;
	var bitProp={width: width, height: height, fill: 'RosyBrown', stroke: 'RosyBrown'};
	ratio = 0.8, width = 40, height = width / ratio;
	var lsfrProp={width: width, height: height, fill: 'Teal', stroke: 'Teal'};
	ratio = 0.8, width = lsfrProp.width, height = width / ratio;
	var xorProp={width: width, height: height, radius: lsfrProp.width*0.35, fill: 'silver', stroke: 'silver'};
	ratio = 1.2, width = 60, height = width / ratio;
	var swProp={width: width, height: height, fill: 'Moccasin  ', stroke: 'SlateBlue'};
	var arrowProp={pointerLength: 8, pointerWidth: 5, fill: 'blue', stroke: 'blue', strokeWidth: 3};
	var infoBitsNum;	
	var lsfrBitNum;
	var cwBitsNum ;
	var xorIds=[];
	var arrows=[];
	var panels=[];
	panels.push({id:'en', name:'Encoder',              width:780, height:260, position:{x:25, y:50}, fill:'Cornsilk'});
	panels.push({id:'ir', name:'Information Register', width:200, height:80,  position:{x:50, y:350}, fill:'Cornsilk'});
	panels.push({id:'cw', name:'Codeword Register',    width:600, height:80,  position:{x:200, y:195}, fill:'Cornsilk'});
	/* generatePanels(); // en, ir and cw panels
	generatePanSokets();	
	generateArrows();	
	generateDots();	
	generateXlabels(); */
	//generateConnSokets();
  
	layer.draw();
	stage.add(layer); 	
				
	function generateXlabels(){
		let xorNum = layer.find('.xor').length;
		let posY = layer.findOne('#sw1-rect').y();
		let posX;
		let str;
		for(let i=0; i<=lsfrBitNum; i++){
			if (i == 0){ // the first
				posX = layer.findOne('#r'+i).getAttr('soket').connL.x -40;
			}
			else if(i == (lsfrBitNum)){ // the last 
				posX = layer.findOne('#r'+(i-1)).getAttr('soket').connR.x + 80;	
			}
			else{
				// others
				posX = layer.findOne('#r'+i).getAttr('soket').connL.x - 50;			
			}
			let id ='x'+i;
			let str = 'X';
			let degree= (i).toString();
			let xLabel = strToSup(id, str,degree)
			xLabel.position({x:posX, y:posY});
			layer.findOne('#en').add(xLabel);
		}
	} 
	function strToSup(id, str,degree){
		let strGroup = new Konva.Group();
		let txt = new Konva.Text({
			id: id,
			x: 0,
			y: 0,
			text: str,
			fontSize: 24,
			fontFamily: 'Arial',
			align: 'lext',
			verticalAlign: 'middle',
			fill: 'black'
		});
		let sup = new Konva.Text({
			id: txt.id()+'sup',
			x: txt.x()+18,
			y: txt.y()-5,
			text: degree,
			fontSize: txt.fontSize()-7,
			fontFamily: txt.fontFamily(),
			align: 'lext',
			verticalAlign: 'middle',
			fill: txt.fill()
		});
		strGroup.add(txt,sup);	
		return strGroup;	
	}
	
	function generateDots(){
		let dots=[];
		// dot0
		let arrow = layer.findOne('#arr-arr-r'+(lsfrBitNum-1)+'-xor'+(lsfrBitNum-1)+'-sw2');
		let x = arrow.points()[0];
		let y = arrow.points()[1];
		dots.push({id:dots.length,x:x,y:y});
		// dot1
		arrow = layer.findOne('#arr-ir-sw2');
		x = arrow.points()[0];
		y = arrow.points()[1];
		dots.push({id:dots.length,x:x,y:y});
		// dot sw1_xors
		for(let i=0; i<lsfrBitNum-1; i++){			
			if (typeof (layer.findOne('#arr-sw1-xor'+i)) == 'undefined') continue;
			arrow = layer.findOne('#arr-sw1-xor'+i);
			x = arrow.points()[0];
			y = arrow.points()[1];
			dots.push({id:dots.length,x:x,y:y});			
		}
			
		dots.forEach(dot => {
			let circ = new Konva.Circle({
				id: 'dot'+dot.id,
				x: dot.x,
				y: dot.y,
				radius: 4,
				fill: arrowProp.fill
		});	
		layer.findOne('#en').add(circ);
		})		
	}
	
	function generateArrows(){
		//arrows r-xor and xor-r
		for (let i=0; i<lsfrBitNum; i++){
			if (i < lsfrBitNum-1){
				var fromId='r'+i
				var toId='xor'+i;
				if((typeof  (layer.findOne('#'+toId))) !== 'undefined')
				{   // arrow => r-xor					
					let from = layer.findOne('#'+fromId).getAttr('soket').connR;
					let to = layer.findOne('#'+toId).getAttr('soket').connL;
					let arrow = {id:'arr-'+fromId+'-'+toId, from: from, to:to};
					arrows.push(arrow);
					// arrow => xor-r
					fromId='xor'+i, toId='r'+(i+1);
					from = layer.findOne('#'+fromId).getAttr('soket').connR;
					to = layer.findOne('#'+toId).getAttr('soket').connL;
					arrow = {id:'arr-'+fromId+'-'+toId, from: from, to:to};
					arrows.push(arrow);
				}
				else{
					// arrow => r-r
					fromId='r'+i, toId='r'+(i+1);
					from = layer.findOne('#'+fromId).getAttr('soket').connR;
					to = layer.findOne('#'+toId).getAttr('soket').connL;
					arrow = {id:'arr-'+fromId+'-'+toId, from: from, to:to};
					arrows.push(arrow);
				}			
			}
			else if(i == lsfrBitNum-1){
				let fromId='r'+i, toId='xor'+i;
				let from = layer.findOne('#'+fromId).getAttr('soket').connR;
				let to = layer.findOne('#'+toId).getAttr('soket').connL;
				let arrow = {id:'arr-'+fromId+'-'+toId, from: from, to:to};
				arrows.push(arrow);
				
				fromId='arr-r'+i+'-xor'+i, toId='sw2';
				let point1 = layer.findOne('#r'+i).getAttr('soket').connR;
				let point2 = layer.findOne('#xor'+i).getAttr('soket').connL;
				from = {x:point1.x+(point2.x-point1.x)/2 , y: point1.y};
				to = layer.findOne('#'+toId).getAttr('soket').connU;
				arrow = {id:'arr-'+fromId+'-'+toId, from: from, to:to};
				arrows.push(arrow);	
			}
		}
		
		// xor3-sw1
		fromId='xor'+(lsfrBitNum-1), toId='sw1';
		from = layer.findOne('#'+fromId).getAttr('soket').connU;
		to = layer.findOne('#'+toId).getAttr('soket').connR;
		arrow = {id:'arr-'+fromId+'-'+toId, from: from, to:to};
        arrows.push(arrow);	
		// sw1-r0
		fromId='sw1', toId='r0';
		from = layer.findOne('#'+fromId).getAttr('soket').connL;
		to = layer.findOne('#'+toId).getAttr('soket').connL;
		arrow = {id:'arr-'+fromId+'-'+toId, from: from, to:to};
        arrows.push(arrow);	
		// ir-xor3
		fromId='ir', toId='xor'+(lsfrBitNum-1);
		from = layer.findOne('#'+fromId).getAttr('soket').connR;
		to = layer.findOne('#'+toId).getAttr('soket').connD;
		arrow = {id:'arr-'+fromId+'-'+toId, from: from, to:to};
        arrows.push(arrow);	
		// arr-ir-sw2
		fromId='xor'+(lsfrBitNum-1), toId='sw2';
		let arrPoints = layer.findOne('#xor'+(lsfrBitNum-1)+'-circ').position();
		from = {x:arrPoints.x, y:arrPoints.y+60};
		to = layer.findOne('#'+toId).getAttr('soket').connD;
		arrow = {id:'arr-ir-'+toId, from: from, to:to};
        arrows.push(arrow);
		//sw2-cw
		fromId='sw2', toId='cw';
		from = layer.findOne('#'+fromId).getAttr('soket').connR;
		to = layer.findOne('#'+toId).getAttr('soket').connL;
		arrow = {id:'arr-'+fromId+'-'+toId, from: from, to:to};
        arrows.push(arrow);	
						
		// sw1-xors
		for(let i=0; i<(lsfrBitNum-1); i++){
			if (typeof (layer.findOne('#xor'+i)) === 'undefined') continue;
			fromId='sw1', toId='xor'+i;			
			from = layer.findOne('#'+fromId).getAttr('soket').connL;
			to = layer.findOne('#'+toId).getAttr('soket').connU;
			arrow = {id:'arr-'+fromId+'-'+toId, from: from, to:to};
			arrows.push(arrow);
		}
				
		arrows.forEach(arrow =>{
			let thisArrow = new Konva.Arrow({
			id: arrow.id,
			pointerLength: arrowProp.pointerLength, 
			pointerWidth: arrowProp.pointerWidth, 
			fill: arrowProp.fill, 
			stroke: arrowProp.stroke, 
			strokeWidth: arrowProp.strokeWidth
			});
			layer.findOne('#en').add(thisArrow);
			layer.add(thisArrow);
		});	
		drawArrows();
	}
	
	function drawArrows(){
		var corr = 3;
		arrows.forEach(arrow => {
			let thisArrow =layer.findOne('#'+arrow.id);
			var points=[];
			if(thisArrow.id() == 'arr-xor'+(lsfrBitNum-1)+'-sw1'){
				points=[arrow.from.x, arrow.from.y,
						arrow.from.x, arrow.to.y,
						arrow.to.x+corr, arrow.to.y];
			}
			else if(thisArrow.id() == 'arr-sw1-r0'){
				points=[arrow.from.x, arrow.from.y,
						arrow.to.x-30, arrow.from.y,
						arrow.to.x-30, arrow.to.y,
						arrow.to.x-corr, arrow.to.y];
			}
			else if (thisArrow.id() == 'arr-r'+(lsfrBitNum-1)+'-xor'+(lsfrBitNum-1)+'-sw2'){
				points=[arrow.from.x, arrow.from.y,
						arrow.from.x, arrow.from.y+50,
						arrow.to.x, arrow.from.y+50,
						arrow.to.x-corr, arrow.to.y];
			}
			else if (thisArrow.id() == 'arr-arr-r'+(lsfrBitNum-1)+'-xor'+(lsfrBitNum-1)+'-sw2'){
				points=[arrow.from.x, arrow.from.y,
						arrow.from.x, arrow.from.y-60,
						arrow.to.x, arrow.from.y-60,
						arrow.to.x, arrow.to.y-corr];
			}
			else if (thisArrow.id() == 'arr-ir-xor'+(lsfrBitNum-1)){
				let corrElm=layer.findOne('#ir');
				points=[arrow.from.x, arrow.from.y,
						arrow.to.x, arrow.from.y,
						arrow.to.x, arrow.to.y+corr];
			}
			else if (thisArrow.id() == 'arr-sw2-cw'){
				points=[arrow.from.x, arrow.from.y,						
						arrow.to.x-corr, arrow.to.y];
			}
			else if (thisArrow.id() == 'arr-ir-xor'+(lsfrBitNum-1)+'-sw2'){
				points=[arrow.from.x, arrow.from.y,	
						arrow.to.x, arrow.from.y,					
						arrow.to.x, arrow.to.y+corr];
			}
			else if (thisArrow.id() == 'arr-ir-sw2'){
				points=[arrow.from.x, arrow.from.y,	
						arrow.to.x, arrow.from.y,					
						arrow.to.x, arrow.to.y+corr];
			}
			else if (thisArrow.id().substr(0,11) == 'arr-sw1-xor'){
				points=[arrow.to.x, arrow.from.y,					
						arrow.to.x, arrow.to.y-corr];
			}			
			else{
				points=[arrow.from.x, arrow.from.y,
						arrow.to.x-corr, arrow.to.y];
			}				
			thisArrow.points(points);
			layer.findOne('#en').add(thisArrow);
			layer.batchDraw();		
		});		
	}

	function generatePanSokets(){
		var ids=['ir','cw','en',];		
		ids.forEach(id => {
			let node=layer.findOne('#'+id+'-rect');			
			let connR={x: node.x() + node.width(), y: node.y()+(node.height()/2)};
			let connL={x: node.x(), y: node.y()+(node.height()/2)};
			let connU={x: node.x() + node.width()/2, y: node.y()};
			let connD={x: node.x() + node.width()/2, y: node.y()+node.height()};
			let soket={connR:connR, connL:connL, connU:connU, connD:connD};
			layer.findOne('#'+id).setAttrs({soket:soket});
		})					
	}
	
	function generateConnSokets(){		
		//var ids=['ir','cw','en','sw1','sw2','r0','r1','r2','r3','xor0','xor1','xor2','xor3'];
		var ids=['ir','cw','en','sw1','sw2'];
		for(let i=0; i<lsfrBitNum; i++) ids.push('r'+i);
		xorIds.forEach(xorId => {
			ids.push(xorId);
		})
		//console.log('ids of sokets: ' +ids);
		ids.forEach(id =>{
			//let id='ir';
			let node=layer.findOne('#'+id);				
			let thisConn=node.getAttr('soket').connL;
			let circL = new Konva.Circle({id: id+'-connL', x: thisConn.x, y: thisConn.y, radius: 3, fill: 'red'});	
			thisConn=node.getAttr('soket').connR;
			let circR = new Konva.Circle({id: id+'-connR', x: thisConn.x, y: thisConn.y, radius: 3, fill: 'red'});
			thisConn=node.getAttr('soket').connU;
			let circU = new Konva.Circle({id: id+'-connU', x: thisConn.x, y: thisConn.y, radius: 3, fill: 'red'});
			thisConn=node.getAttr('soket').connD;
			let circD = new Konva.Circle({id: id+'-connD', x: thisConn.x, y: thisConn.y, radius: 3, fill: 'red'});
			node.add(circL,circR,circU,circD);
		})		
	}
			
	function generateEN(){
		let group = layer.findOne('#en');
		let panRect = layer.findOne('#en-rect');
		let addDist =  lsfrProp.width + pading*8;
		let posX = panRect.x() + addDist/3;
		let posY = panRect.y() + panRect.height() - lsfrProp.height - pading*5;
		
		// creating LSFR's bits
		for (let i=0; i<lsfrBitNum; i++){
			let bitGroup = new Konva.Group({
				id: 'r'+i,
				name: 'LSFR', 
				width : lsfrProp.width, 
				height: lsfrProp.height,
			});
			let connL= {x: posX, y: posY+lsfrProp.height/2};
			let connR= {x: posX+lsfrProp.width, y: posY+lsfrProp.height/2};
			let connU= {x: posX+lsfrProp.width/2, y: posY};
			let connD= {x: posX+lsfrProp.width/2, y: posY+lsfrProp.height};
			let soket={connL:connL, connR:connR, connU:connU, connD:connD};			
			bitGroup.setAttrs({soket:soket});			
			let rect = new Konva.Rect({
				id: 'r'+i+'-rect',
				x: posX,
				y: posY,
				width : lsfrProp.width, 
				height: lsfrProp.height, 
				fill: lsfrProp.fill,
				cornerRadius: 2,
			});
			let txt = new Konva.Text({
				id: bitGroup.id()+'-txt',
				x: posX,
				y: posY,
				width : lsfrProp.width, 
				height: lsfrProp.height,  
				text: '0',
				fontSize: 26,
				fontFamily: 'Calibri',
				align: 'center',
				verticalAlign: 'middle',
				fill: 'black'
			});	
			posX += addDist;
					
			group.add(bitGroup.add(rect, txt));		
		}
		
		// creating xors
		{
			let r0=layer.findOne('#r0-rect');
			let r1=layer.findOne('#r1-rect');
			let dist = r1.x()-(r0.x()+r0.width());
			for (let i=0; i<lsfrBitNum; i++){	
				var xorId= xorIds.find(xor => xor === 'xor'+i);
				if((typeof  xorId) === 'undefined') continue;
				let r=layer.findOne('#r'+i+'-rect');
				let posX = r.x()+r.width() + dist/2;
				let posY = r.y()+r.height()/2;
				let xorGroup = new Konva.Group({
					id: 'xor'+i,
					name: 'xor', 
					width : xorProp.width, 
					height: xorProp.height,
				});
				if (i==(lsfrBitNum-1)) posX +=pading*5;
				let connL= {x: posX-xorProp.radius, y: posY};
				let connR= {x: posX+xorProp.radius, y: posY};
				let connU= {x: posX, y: posY-xorProp.radius};
				let connD= {x: posX, y: posY+xorProp.radius};
				let soket= {connL:connL, connR:connR, connU:connU, connD:connD};
				xorGroup.setAttrs({soket:soket});
				xorGroup.setAttrs({result:0});
				
				let circ = new Konva.Circle({
					id: 'xor'+i+'-circ',
					x: posX,
					y: posY,
					radius: xorProp.radius,
					fill: xorProp.fill,
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOpacity: 0.1,
				});			
				let txt = new Konva.Text({
					id: xorGroup.id()+'-txt',
					x: circ.x()-xorProp.radius,
					y: circ.y()-xorProp.radius,
					width: xorProp.radius*2,  
					height: xorProp.radius*2,  
					text: '+',
					fontSize: 25,
					fontFamily: 'Calibri',
					align: 'center',
					verticalAlign: 'middle',
					fill: 'black'
				});
				let res = new Konva.Text({
					id: xorGroup.id()+'-res',
					x: circ.x()-xorProp.radius+20,
					y: circ.y()-xorProp.radius-18,
					width: xorProp.radius*2,  
					height: xorProp.radius*2,  
					text: '',
					fontSize: 18,
					fontFamily: 'Calibri',
					align: 'center',
					verticalAlign: 'middle',
					fill: 'DimGray'
				});
				group.add(xorGroup.add(circ,txt,res));						
			}
		}
		
		// creating switch 1 container
		{
			let sw1Group = new Konva.Group({
				id: 'sw1',
				name: 'switch', 
				draggable: false				
			});
			let r=layer.findOne('#r'+(lsfrBitNum-1)+'-rect');
			let posX=r.x()-5;
			let posY=panRect.y()+swProp.height/1.5;			
			let connR= {x: posX+swProp.width, y: posY+swProp.height-(swProp.height/3)};
			let connL= {x: posX, y: connR.y};
			let connU= {x: posX+swProp.width/2, y: posY};
			let connD= {x: posX+swProp.width/2, y: posY+swProp.height};
			let soket={connL:connL, connR:connR, connU:connU, connD:connD};
			sw1Group.setAttrs({soket:soket});
			//sw1Group.setAttrs({'pos':0});
			sw1Group.pos=0;
			
			let rect = new Konva.Rect({
				id: sw1Group.id()+'-rect',
				x: posX,
				y: posY,
				width : swProp.width, 
				height: swProp.height, 
				fill: swProp.fill,
				cornerRadius: 2,
			});
			let txt = new Konva.Text({
				id: sw1Group.id()+'-lаb',
				x: posX,
				y: posY-labelDistance,
				width: swProp.width,
				text: 'SW1',
				fontSize: 18,
				fontFamily: 'Calibri',
				align: 'center',
				verticalAlign: 'middle',
				fill: 'black',				
			});			
			group.add(sw1Group.add(rect,txt));
			drawSW(sw1Group.id());
		}
		// creating switche 2 container
		{
			let xor=layer.findOne('#xor'+(lsfrBitNum-1)+'-circ');
			let posX=xor.x()+50;
			let posY=xor.y()-swProp.height/2;
			let connD= {x: posX+swProp.width/5, y: posY+swProp.height}; //down connection
			let connU= {x: connD.x, y: posY};  //up connection
			let connR= {x: posX+swProp.width, y: posY+swProp.height/2};
			let connL= {x: posX, y: posY+swProp.height/2};
			let soket={connD:connD, connU:connU, connR:connR, connL:connL};			
			let sw2Group = new Konva.Group({
				id: 'sw2',
				name: 'switch',
			});
			sw2Group.setAttrs({soket:soket});
			//sw2Group.setAttrs({'pos':0});
			sw2Group.pos=0;
			let panelCW=panels.find(panel => panel.id === 'cw');
			let enRect=layer.findOne('#en-rect');
			panelCW.position.y = connR.y - panelCW.height/2;
			enRect.width((posX+swProp.width+pading*2) - enRect.x());
			layer.findOne('#en-lab').width(enRect.width());
			panelCW.position.x = enRect.x()+enRect.width()+pading*6;
			
			let rect = new Konva.Rect({
				id: sw2Group.id()+'-rect',				
				x: posX,
				y: posY,
				width : swProp.width, 
				height: swProp.height, 
				fill: swProp.fill,
				cornerRadius: 2,
			});	
			
			let txt = new Konva.Text({
				id: sw2Group.id()+'-lаb',
				x: posX,
				y: posY-labelDistance,
				width: swProp.width,
				text: 'SW2',
				fontSize: 18,
				fontFamily: 'Calibri',
				align: 'right',
				verticalAlign: 'middle',
				fill: 'black',				
			});
			let txt1 = new Konva.Text({
				id: sw2Group.id()+'pos1-lаb',
				x: posX - 5,
				y: posY + rect.height()+5,
				text: '1',
				fontSize: 18,
				fontFamily: 'Calibri',
				align: 'right',
				verticalAlign: 'middle',
				fill: 'green',				
			});
			let txt2 = new Konva.Text({
				id: sw2Group.id()+'pos2-lаb',
				x: posX - 5,
				y: posY - 20,
				text: '2',
				fontSize: 18,
				fontFamily: 'Calibri',
				align: 'right',
				verticalAlign: 'middle',
				fill: 'green',				
			});		
			group.add(sw2Group.add(rect,txt,txt1,txt2));
			drawSW(sw2Group.id());
		}		
		layer.add(group);
	}
	
	// setting the switch position
	function setSW(swId, setPos){
		if (swId == 'sw1'){
			let l1 = layer.findOne('#sw1-l1');
			let points = l1.points();
			if (setPos == 1)
				points[points.length-1] = points[points.length-3];
			else if(setPos == 0)
				points[points.length-1] = points[points.length-1]-20;
			layer.findOne('#'+swId).pos=setPos;
			l1.points(points);	
			// hiding the xors' result
			xorIds.forEach(xorId => {layer.findOne('#'+xorId+'-res').text(''); layer.batchDraw();})
		}
		else if(swId == 'sw2'){
			let l1 = layer.findOne('#sw2-l1');
			let c2 = layer.findOne('#sw2-circ2');
			let c3 = layer.findOne('#sw2-circ3');
			let points = l1.points();
			if (setPos == 1)
				points[points.length-1] = c2.y();						
			else if (setPos == 2)
				points[points.length-1] = c3.y();
			layer.findOne('#'+swId).pos=setPos;
			l1.points(points);		
		}
		layer.batchDraw();
	}
	
	// drawing the switch inner lines and dots
	function drawSW(swId){
		var strokeColor = 'green';
		var swGroup =  layer.findOne('#'+swId);
		var sw=swGroup.getAttr('soket');
		var rect = layer.findOne('#'+swId+'-rect');		
		if (swId == 'sw1'){ //sw1
			let connR = sw.connR;
			let connL = sw.connL;
			let points=[connR.x,connR.y, 
						connR.x-10, connR.y, 
						connL.x+10, connL.y-20];			
			let line1 = new Konva.Line({
				id: swId+'-l1', 
				stroke: strokeColor, 
				strokeWidth: 3,
				points:points
			});
			let circ1 = new Konva.Circle({
				id: swId+'-circ1',
				x: points[points.length-4],
				y: points[points.length-3],
				radius: 3,
				fill: 'green',
			});
			points=[connL.x,connR.y, 
					connL.x+10, connL.y];			
			let line2 = new Konva.Line({
				id: swId+'-l2', 
				stroke: strokeColor, 
				strokeWidth: 3,
				points:points
			});
			let circ2 = new Konva.Circle({
				id: swId+'-circ2',
				x: points[points.length-2],
				y: points[points.length-1],
				radius: 3,
				fill: strokeColor,
			});	
			swGroup.add(line1,circ1,line2,circ2);	
			
			swGroup.on('click touchstart', function(){
				let setPos;
				if (this.pos == 0) setPos=1;
				else setPos = 0;
				setSW(swGroup.id(), setPos);
				layer.batchDraw();
			});		
		}
		else if(swId == 'sw2'){ // sw-2		
			let connD = sw.connD;
			let connU = sw.connU;
			let connR = sw.connR;
			let points=[connR.x, connR.y,
						connR.x-10, connR.y,
						connD.x, connR.y];			
			//long line
			let line1 = new Konva.Line({
				id: swId+'-l1', 
				stroke: strokeColor, 
				strokeWidth: 3,
				points:points
			});
			let circ1 = new Konva.Circle({
				id: swId+'-circ1',
				x: points[points.length-4],
				y: points[points.length-3],
				radius: 3,
				fill: strokeColor,
			});
			points=[connD.x,connD.y,
					connD.x,connD.y-7];	
			// short line down
			let line2 = new Konva.Line({
				id: swId+'-l2', 
				stroke: strokeColor, 
				strokeWidth: 3,
				points:points
			});
			let circ2 = new Konva.Circle({
				id: swId+'-circ2',
				x: points[points.length-2],
				y: points[points.length-1],
				radius: 3,
				fill: strokeColor,
			});
			points=[connU.x,connU.y,
					connU.x,connU.y+7];	
			// short line down
			let line3 = new Konva.Line({
				id: swId+'-l3', 
				stroke: strokeColor, 
				strokeWidth: 3,
				points:points
			});
			let circ3 = new Konva.Circle({
				id: swId+'-circ3',
				x: points[points.length-2],
				y: points[points.length-1],
				radius: 3,
				fill: strokeColor,
			});			
			swGroup.add(line1,circ1,line2,circ2,line3,circ3);	

			swGroup.on('click touchstart', function(){
				let setPos;
				if (this.pos == 0)     setPos=1;
				else if(this.pos == 1) setPos = 2;
				else if(this.pos == 2) setPos = 1;
				setSW(swGroup.id(), setPos);				
			}); 			
		}
		swGroup.on('mouseover touchstart', function(){
			rect.shadowColor('red'),
			rect.shadowBlur(10),
			rect.shadowOpacity(0.5),
			stage.container().style.cursor = 'pointer';
			layer.batchDraw();
		});
		swGroup.on('mouseout touchend', function(){
			rect.shadowBlur(0),
			rect.shadowOpacity(0),				
			stage.container().style.cursor = 'default';
			layer.batchDraw();
		});
	}	
	
	function generatePanels(){		
		panels.forEach(panel => {
			let group = new Konva.Group({
				id: panel.id,
				name: panel.name, 
				width : panel.width, 
				height: panel.height,
				draggable:false			
			});
			let rect = new Konva.Rect({
				id: panel.id+'-rect',
				x: panel.position.x,
				y: panel.position.y,
				width : panel.width, 
				height: panel.height, 
				fill: panel.fill,
				shadowColor: 'black',
				shadowBlur: 10,
				shadowOpacity: 0.5,
				cornerRadius: 4  
			});
			let label = new Konva.Text({
				id: panel.id+'-lab',
				x: panel.position.x,
				y: panel.position.y - labelDistance,
				width : panel.width,  
				text: panel.name,
				fontSize: 20,
				fontFamily: 'Calibri',
				padding: 0,
				align: 'center',
				verticalAlign: 'middle',
				fill: 'black'
			});	
			if(panel.id === 'ir'){
				rect.on('click touchstart', function(){
					reverseIR();
				});
			}else if(panel.id === 'cw'){
				rect.on('click touchstart', function(){
					reverseCW();
				});
			}
			group.add(rect, label);			
			layer.add(group);	
			
			if      (panel.id == 'en') generateEN();
			else if	(panel.id == 'ir') generateIR();	
			else if	(panel.id == 'cw') generateCW();				
		}); // end of panels	
	}
	
	function generateIR(){
		let group = layer.findOne('#ir');
		let panRect = layer.findOne('#ir-rect');
		let addDist =  bitProp.width + pading*0.5;
		panRect.height(bitProp.height+2*pading);		
		panRect.width(addDist*(infoBitsNum)+addDist/1.4);
						
		let label = layer.findOne('#ir-lab').width(panRect.width());
		let posX = panRect.x() + addDist/2;
		let posY = panRect.y() + pading;
		for (let i=0; i<infoBitsNum; i++){
			let bitGroup = new Konva.Group({
				id: 'ir'+i,
				name: 'Information bit', 
				width : bitProp.width, 
				height: bitProp.height,
			});
			let rect = new Konva.Rect({
				id: bitGroup.id()+'-rect',
				x: posX,
				y: posY,
				width : bitProp.width, 
				height: bitProp.height, 
				fill: bitProp.fill,
				cornerRadius: 2  
			});
			let txt = new Konva.Text({
				id: bitGroup.id()+'-txt',
				x: posX,
				y: posY,
				width : bitProp.width, 
				height: bitProp.height,  
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
				let i = txt.id().substring(2, 3);
				infoReg[Number(i)]=newVal;
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
			group.add(bitGroup.add(rect, txt));
			layer.add(group);
		}		
	}
	
	function generateCW(){
		let group = layer.findOne('#cw');
		let panRect = layer.findOne('#'+group.id()+'-rect');
		let addDist =  bitProp.width + pading*0.5;
		let sw2ConnRposY=layer.findOne('#sw2').getAttr('soket').connR.y;	
		panRect.height(bitProp.height+2*pading);		
		panRect.width(addDist*(cwBitsNum)+addDist/2);
		panRect.y(sw2ConnRposY-panRect.height()/2);
		let label = layer.findOne('#'+group.id()+'-lab').width(panRect.width());
		label = layer.findOne('#'+group.id()+'-lab').y(panRect.y()-labelDistance);
		let posX = panRect.x() + addDist/2;
		let posY = panRect.y() + pading;
		for (let i=0; i<cwBitsNum; i++){
			let bitGroup = new Konva.Group({
				id: 'cw'+i,
				name: 'Codeword bit', 
				width : bitProp.width, 
				height: bitProp.height,
			});
			let rect = new Konva.Rect({
				id: bitGroup.id()+'-rect',
				x: posX,
				y: posY,
				width : bitProp.width, 
				height: bitProp.height, 
				fill: bitProp.fill,
				cornerRadius: 2  
			});
			let txt = new Konva.Text({
				id: bitGroup.id()+'-txt',
				x: posX,
				y: posY,
				width: bitProp.width,  
				height: bitProp.height,  
				text: '',
				fontSize: 24,
				fontFamily: 'Arial',
				align: 'center',
				verticalAlign: 'middle',
				fill: 'Navy'
			});	
			posX += addDist;
			group.add(bitGroup.add(rect, txt));
			layer.add(group);
		}		
	}
	
	function shiftIR(){
		if (debug) console.log('Shifting Infor Register');
		infoReg.pop();
		infoReg.unshift('');
		for (let i=0; i<infoBitsNum; i++){
			layer.findOne('#ir'+i+'-txt').text(infoReg[i].toString());
			layer.batchDraw();
		}
	}
	function shiftCW(){
		if (debug) console.log('Shifting Codeword Register');
		let sw2Pos=layer.findOne('#sw2').pos;
		if ( sw2Pos == 1)      cwReg.unshift(infoReg[infoReg.length-1]);
		else if (sw2Pos == 2) cwReg.unshift(lsfrReg[lsfrReg.length-1]);
		else {
			if (debug) console.log('The switch 2 is on 0 position!');
			return;
		}
		for (let i=0; i<cwReg.length; i++){
			layer.findOne('#cw'+i+'-txt').text(cwReg[i].toString());
			layer.batchDraw();
		}		
	}	
	function calcFB(){
		if (debug) console.log('Calculating the feadback value');
		fbVal = infoReg[infoReg.length-1] ^ lsfrReg[lsfrReg.length-1]; 
		layer.findOne('#'+xorIds[xorIds.length-1]+'-res').text(fbVal.toString());
		layer.batchDraw();
	}	
	/* function calcXOR(){
		if (debug) console.log('Calculating the XORs\' result');		
		for (let i=0; i<(xorIds.length-1); i++){		
			let res = fbVal ^ lsfrReg[Number(xorIds[i].substr(3))];			
			layer.findOne('#'+xorIds[i]+'-res').text(res.toString());
			layer.batchDraw();
		} 
	}*/
	function setLSFR(){
		if (debug) console.log('Setting LSFR');
		let sw1Pos=layer.findOne('#sw1').pos;
		
		if (sw1Pos != 0){ // when the sw1 is closed
			for (let i=(lsfrReg.length-1); i>=0; i--){
				let xor = layer.findOne('#xor'+(i-1)+'-res');
				if(i==0) 
					lsfrReg[i] = fbVal;
				else if (typeof xor !== 'undefined') {
					//tempAray[i] = Number(xor.text());
					lsfrReg[i] = lsfrReg[i-1] ^ fbVal;
				}							
				else 
					lsfrReg[i] = lsfrReg[i-1];			
			}
		}else { // when the sw1 is opened
			for (let i=(lsfrReg.length-1); i>=0; i--){
				if(i==0) lsfrReg[i] = '';
				else lsfrReg[i] = lsfrReg[i-1];			
			}
		}		
		//console.log(lsfrReg);
		for (let i=0; i<lsfrReg.length; i++){
			layer.findOne('#r'+i+'-txt').text(lsfrReg[i].toString());
			layer.batchDraw();
		}
	}
	
	function reverseIR(){
		infoReg.reverse();
		for (let i=0; i<infoBitsNum; i++){
			layer.findOne('#ir'+i+'-txt').text(infoReg[i].toString());
			layer.batchDraw();
		}
	}
	function reverseCW(){
		cwReg.reverse();
		for (let i=0; i<cwBitsNum; i++){
			layer.findOne('#cw'+i+'-txt').text(cwReg[i].toString());
			layer.batchDraw();
		}
	}