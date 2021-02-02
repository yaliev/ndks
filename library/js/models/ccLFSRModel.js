class ccLFSRModel{
	constructor(user) {
		this.lang = new LangPack($('input[name="lang"]:checked').val());
		this.layer = null;
		this.en = {};
		this.ir = {};
		this.m;
		this.k;
		this.n;
		this.t;
		this.genPoly;
		this.xorIds;
		this.algorithm = {};
		this.stat = new STATISTICS(this.lang.stat);
		this.debug = true;
		this.width = 0;
		this.height = 0;
		this.autoRunTimerId = -1;
		this.process = 'enc'; // default process is encoding
		this.user = user;
	}

	//checking the code parameters
	checkParam(param) {
		this.m = param.m;
		this.k = param.k;
		this.n = param.n;
		this.t = param.t;
		this.genPoly = {val: param.genPoly.val, txt: param.genPoly.txt};

		//this.lang =  new LangPack(param.lang); // default language is english
		let lang = this.lang.gn;
		if (this.debug) console.log('Checking parameters...');

		// parity bit number check
		if ((Math.pow(2, this.k) - this.k) < (this.m + 1 + this.t - 2)){
			return (lang.wrongK);
		}

		// codeword bit number check
		if (this.n !== (this.m + this.k)){
			return lang.wrongN;
		}

		// poly check
		if (this.t === 2)
			switch (this.k){
				case 3:
					if(this.genPoly.val !== '3.1' && this.genPoly.val !== '3.2') return lang.wrongGenPoly;
					this.xorIds = this.genPoly.val === '3.1'? ['xor0','xor2'] : ['xor1','xor2'];
					break;
				case 4:
					if(this.genPoly.val !== '4.1' && this.genPoly.val !== '4.2') return lang.wrongGenPoly;
					this.xorIds = this.genPoly.val === '4.1'? ['xor0','xor3'] : ['xor2','xor3'];
					break;
				case 5:
					if(this.genPoly.val !== '5.1' && this.genPoly.val !== '5.2') return lang.wrongGenPoly;
					this.xorIds = this.genPoly.val === '5.1'? ['xor1','xor4'] : ['xor2','xor4'];
					break;
			}
		else if (this.t === 3)
			switch (this.k){
				case 4:
					if(this.genPoly.val !== '3.3' && this.genPoly.val !== '3.4') return lang.wrongGenPoly;
					this.xorIds = this.genPoly.val === '3.3'? ['xor1','xor2','xor3'] : ['xor1','xor3'];
					break;
				case 5:
					if(this.genPoly.val !== '4.3' && this.genPoly.val !== '4.4') return lang.wrongGenPoly;
					this.xorIds = this.genPoly.val === '4.3'? ['xor1','xor3','xor4'] : ['xor0','xor2','xor4'];
					break;
				case 6:
					if(this.genPoly.val !== '5.3' && this.genPoly.val !== '5.4') return lang.wrongGenPoly;
					this.xorIds = this.genPoly.val === '5.3'? ['xor0','xor1','xor2','xor4','xor5'] : ['xor0','xor2','xor3','xor4','xor5'];
					break;
			}

		if (this.debug) console.log('OK');
		return true;
	} // end of checkParam()
		
	// initializing the model
	init(){
		// create arr for all layers
		let layers =[];
		let lang = this.lang.gn;

		// encoder
		// creating the ALGORITHM PANEL
		this.algorithm = new ALGORITHM(this.encoderSteps(this.lang.alg, this.m, this.k),this.m, this.k, this.user);
		// setting the algorithm's schema to some position
		this.algorithm.panel.setPos({ x:1100 , y: 50});
		layers.push(this.algorithm.layer);
		this.layer = this.applyEncoder();
		//this.layer.draw();

		// dragmove event for algorithm panel
		this.algorithm.panel.on('dragmove', function(e){
			if(typeof componentsPos.alg !== 'undefined'){
				componentsPos.alg = this.position();
			}
			else console.log('componentsPos.alg is undefined');
		});

		// set timer max time
		model.stat.timer.setMaxTime({min:20});
		// starting the timer
		model.stat.timer.start();

		// mark the step setParam as pass
		this.algorithm.increment();

		this.simFinish=function(){
			model.ir.vals = [...model.ir.valsBack];
			let html='';
			html='<p><b>'+lang.modeEnc+'</b><\p>';
			html +='<p><b>'+lang.codeParam+':</b> m = '+this.m+', l<sub>0</sub> = '+this.t+', k = '+this.k+', n = '+this.n+'<\p>';
			html +='<p><b>'+lang.genPoly+': </b>P(x) = '+ $('#selGenPolyBtn').html() +'<\p>';
			let valStr='';
			valStr = model.ir.vals.toString().replace(/,/g,'');
			html+='<p><b>'+lang.infoBits+':</b> X = '+valStr+'<\p>';
			html+='<p><b>'+lang.cwBits+': </b>[X] = '+model.cr.vals.toString().replace(/,/g,'')+'<\p>';
			this.stat.timer.stop(); // stop the timer
			html+='<p><b>'+lang.solveTime+': </b>'+this.stat.timer.val.text()+'<\p>'
			html+='<p><b>'+this.stat.error.label.text()+'</b>'+this.stat.error.val.text()+'<\p>'

			// create simulation finish message
			let finishDialog=$("<div id='finishDialog' title='' class='dialog'></div>").appendTo($(".modelDiv"));
			finishDialog.dialog({
				autoOpen : false, modal : false, show : "blind", hide : "blind",
				minHeight:100, minWidth:400,  height: 'auto', width: 'auto',
				close: function() {
					$("#finishDialog").css({'color':'black'});
				}
			});
			finishDialog.dialog('option','title', lang.finishMsg);
			finishDialog.html(html);
			$('#finishDialog p').css({'margin':'1px'});
			$(".ui-dialog-titlebar-close").hide();
			finishDialog.dialog('open');

			// check for task
			tasks.check(finishDialog);
		};

		// change container width according to total component width
		this.width = this.en.width() + this.algorithm.panel.width() + 80;
		this.height = this.en.y() + this.en.height();

		if(this.width > stage.width()) {
			stage.width(this.width);
			$(".model").width(this.width);
			this.stat.rect.width(this.width - 40);
		}
		if(this.width > stage.height()) {
			stage.height(this.width);
			$(".model").height(this.width);
		}

		layers.push(this.layer);
		return layers;
	} // end of init()


	// ENCODER PROCESS //////////////////////////////////////////////////////////////
	applyEncoder(){
		// creating the LAYER
		let layer = new Konva.Layer();
		// get the selected language
		let lang = this.lang.gn;

		// creating the INFORMATION REGISTER //////////////////////////////////////////////
		let ir = new REGISTER({
			id: 'ir',
			name: lang.irLabel,
			bitsNum: this.m,
			shiftHoverTxt: lang.shiftHover,
			flipHoverTxt: lang.flipHover,
			randHoverTxt: lang.randHover,
			randBtnLabel: lang.randBitsLabel,
			flipBtnLabel: lang.flipBtnLabel,
			bit: {name: 'IR Bit', hover: lang.regBitHover, enabled: true},
		});
		layer.add(ir);
		ir.dragmove(false);
		ir.S.visible(false);

		// creating  the CODEWORD REGISTER ////////////////////////////////////////////////
		let cr = new REGISTER({
			id: 'cw',
			name: lang.crLabel,
			bitsNum: this.n,
			bit : {name: 'CR Bit', enabled: false},
			shiftHoverTxt: lang.shiftHover,
			flipHoverTxt: lang.flipHover,
			randHoverTxt: lang.randHover,
			randBtnLabel: lang.randBitsLabel,
			flipBtnLabel: lang.flipBtnLabel,
		});
		layer.add(cr);
		cr.empty();
		cr.dragmove(false);
		cr.writeBtn.visible(false);

		// creating the LFSR ENCODER //////////////////////////////////////////////
		let en = new LFSR({
				name: lang.ccLFSRLabel,
				bitsNum: this.k,
				xorIds: this.xorIds,
				poly: 'P(x)='+this.genPoly.txt.toLowerCase(),
				sHover: lang.sHover,
				fHover: lang.fHover,
				sw: {hoverTxt: lang.swHover},
				xor:{hoverTxt:lang.xorHover,
					fbHover:lang.fbHover}
		}, ir, cr, this.algorithm, this.stat);
		en.position({x:20, y:40});
		layer.add(en);
		en.dragmove(false);
		en.fb.txtFb.text(lang.fbLabel);

		// creating  the INFORMATION REGISTER //////////////////////////////////////////////
		let pos={};
		pos.x = en.rect.absolutePosition().x;
		pos.y = en.rect.absolutePosition().y + en.rect.height() + 40;

		ir.position(pos);
		ir.inBit = function(){return '';};
		// IR 'Bit' click event
		ir.bits.forEach(bit =>{
			bit.on('click touchstart', function(){
				let check = model.algorithm.validStep('setBits');
				if (check === true) {
					bit.setBit();
					if(ir.areAllBitsSetted()) model.algorithm.markCurrStep('past');
					else model.algorithm.markCurrStep('curr');
				}
				else {
					bit.hover.show('e', check);
					//model.stat.error.add(check+' ('+model.algorithm.getCurrStep().description+')');
					return;
				}
			});
		});
		// IR 'F' click event
		ir.F.on('click touchstart', function(){
			let currStep = model.algorithm.getCurrStep().name;
			if (currStep === 'setBits'){
				let check;
				ir.bits.forEach(bit => {
					if (bit.txt.text() === '') return check = 'emptyBit';
				});
				if (check === 'emptyBit'){
					this.hover.show('e', lang.setAllBit);
					//model.stat.error.add(lang.setAllBit);
					return;
				}
				else {
					model.algorithm.increment();  // enable flipIR
				}
			}
			let check = model.algorithm.validStep('flipIR');
			if (check === true) {
				ir.valsBack = [...ir.vals]; // backup the register's values
				ir.flip();
				console.log(model.algorithm.getCurrStep().description);
				model.algorithm.increment();  // enabling the next step
			}
			else {
				this.hover.show('e', check);
				model.stat.error.add(check);
				return;
			}
		});

		// IR 'Random' click event
		ir.rand.on('click touchstart', function(){
			let check = model.algorithm.validStep('setBits');
			if (check === true) {
				model.algorithm.markCurrStep('curr');
				ir.randGen();
				//this.fill('red');
				console.log(model.algorithm.getCurrStep().description);
			}
			else{
				//ir.info.show('e', check);
				this.hover.show('e', check);
				model.stat.error.add(check);
				return;
			}
		});
		// IR '>>>' click event
		// ir.S.on('click touchstart', function(){
		// 	let check = model.algorithm.validStep('shiftIR');
		// 	if (check === true) {
		// 		ir.shiftR('', '', 2);
		// 		console.log(model.algorithm.getCurrStep().description);
		// 		model.algorithm.increment(); // enable set1SW or set2SW
		// 	}
		// 	else {
		// 		//ir.info.show('e', check);
		// 		this.hover.show('e', check);
		// 		model.stat.error.add(check);
		// 		return;
		// 	}
		// });

		// codeword register position set
		cr.position({x: en.x()+en.width() + 40, y: en.soket('abs').connO.y - cr.rect.height()/2});

		// connection between IR and Encoder
		ir.connectTo(en.soket('abs').connI);

		// connection between Encoder and CR
		cr.connectFrom(en.soket('abs').connO);

		// cr.inBit = function(){
		// 	return en.sw2.pos === 1 ? ir.vals[ir.vals.length - 1]: en.vals[en.vals.length - 1];
		// };

		// CR '>>>' click event
		cr.S.on('click touchstart', function(){
			// check SW's position if current step is  'set2SW'
			let currStep = model.algorithm.getCurrStep();
			if(currStep.name === 'set2SW') {
				if (model.en.sw1.pos !== 0){
					this.hover.show('e', lang.wrongSw);
					model.stat.error.add(lang.wrongSw);
					return;
				}
				if (model.en.sw2.pos !== 2){
					this.hover.show('e', lang.wrongSw);
					model.stat.error.add(lang.lang.wrongSw);
					return;
				}
				model.algorithm.increment(); // enable  shiftEN (shiftParity)
			}

			let check = model.algorithm.validStep('shiftCR');
			if (check === true){
				let endFunc = function(){ir.shiftR('', '', 2);};
				if(model.en.sw2.pos === 1) cr.shiftR(ir.bits[ir.bits.length -1], ir.vals[ir.vals.length -1], 1, function(){ir.shiftR('', '', 2);});
				else if(model.en.sw2.pos === 2) cr.shiftR(en.bits[en.bits.length -1], en.vals[en.vals.length -1], 1, function(){en.shiftR(2);});
				console.log(model.algorithm.getCurrStep().description);
				model.algorithm.increment(); // enable shiftIR
			}
			else {
				//cr.info.show('e', check);
				this.hover.show('e', check);
				model.stat.error.add(check);
				return;
			}
		});
		// CR 'R' click event
		cr.F.on('click touchstart', function(){
			let check = model.algorithm.validStep('flipCR');
			if (check === true){
				cr.flip();
				console.log(model.algorithm.getCurrStep().description);
				model.algorithm.increment(); // last operation
				model.finish();
			}
			else {
				//cr.info.show('e', check);
				this.hover.show('e', check);
				model.stat.error.add(check);
				return;
			}
		});

		let gr = new Konva.Group();
		gr.draggable(true);
		gr.add(ir,cr,en);
		layer.add(gr);

		this.en = en;
		this.ir = ir;
		this.cr = cr;

		return layer;

	} // end of applyEncoder


    // finishing simulation
    finish(){
        model.stat.timer.stop();
        alert(model.algorithm.getCurrStep().description+' '+model.algorithm.getCurrStep().help);
		document.getElementById('nextBtn').disabled=true;
		document.getElementById('autoRunBtn').disabled=true;
    }

    // run current step
    runCurrStep(){
		let autoRunStarted = model.autoRunTimerId !== -1; // autorun flag
	    if(typeof this.ir.bits === 'undefined') return alert(lang.noModel);
        switch (this.algorithm.getCurrStep().name){
            // Set the Information Register
            case 'setBits':
				if(arrSum(this.ir.vals) === 0) {
					this.ir.randGen(); // if all info bit are zeros run random bits generator
				}
				console.log(model.algorithm.getCurrStep().description);
				this.algorithm.increment(); // enable next step
				break;

            // Reverse Information’s bits
            case 'flipIR':
				this.ir.valsBack = [...this.ir.vals]; // backup the register's values
                this.ir.flip();
                console.log(model.algorithm.getCurrStep().description);
                this.algorithm.increment(); // enable next step
            break;

            // Set switches position 1
            case 'set1SW':
                this.en.sw1.setPos(1); // sw1 => Close
                this.en.sw2.setPos(1); // sw2 => 1
                console.log(model.algorithm.getCurrStep().description);
                this.algorithm.increment(); // enable next step
            break;

            // Set switches position 2
            case 'set2SW':
                this.en.sw1.setPos(0); // sw1 => Open
                this.en.sw2.setPos(2); // sw2 => 2
                console.log(model.algorithm.getCurrStep().description);
                this.algorithm.increment(); // enable next step
                break;

            // Calculate Feedback value (Calculate last XOR element)
            case 'calcFB':
				if(model.ir.moving || model.cr.moving) return; // wait for the info register's bits shifting to complete
                this.en.updateXORs();
                this.en.calcFB();
                this.en.updateXORs();
                console.log(model.algorithm.getCurrStep().description);
                this.algorithm.increment(); // enable next step
            break;

            // Calculate XORs
            case 'calcXOR':
                this.en.calcXORs();
                console.log(model.algorithm.getCurrStep().description);
                this.algorithm.increment(); // enable next step
            break;

            // Shift Encoder’s Bits
			case 'shiftEN':
				this.en.shiftR(model.algorithm.panel.mc.speedIdx);
				console.log(model.algorithm.getCurrStep().description);
				this.algorithm.increment(); // enable next step
				break;

            // Shift Codeword Bits
            case 'shiftCR':
            	if(model.en.moving || model.cr.moving) return; // wait for the encoder's bits shifting to complete
				if(model.en.sw2.pos === 1) this.cr.shiftR(	model.ir.bits[model.ir.bits.length -1],
															model.ir.vals[model.ir.vals.length -1],
															model.algorithm.panel.mc.speedIdx,
															function(){model.ir.shiftR('', '', 1);});
				else if(model.en.sw2.pos === 2) this.cr.shiftR(	model.en.bits[model.en.bits.length -1],
																model.en.vals[model.en.vals.length -1],
																model.algorithm.panel.mc.speedIdx,
																function(){model.en.shiftR('', '', 1);});
				console.log(model.algorithm.getCurrStep().description);
				this.algorithm.increment(); // enable next step
            break;

            // Shift Informations Bits
			case 'shiftIR':
				if(model.cr.moving) return; // wait for the codeword register's bits shifting to complete
				this.ir.shiftR('', '',model.algorithm.panel.mc.speedIdx);
				console.log(model.algorithm.getCurrStep().description);
				this.algorithm.increment(); // enable next step
            break;

            case 'flipCR':
                this.cr.flip();
                console.log(model.algorithm.getCurrStep().description);
                this.algorithm.increment(); // enable next step
            break;

            // finish simulation
            default:
                model.finish();
        }
        return true;
    } // end runCurrStep()

	// autorun
	autoRun(speed){
		if (model.autoRunTimerId !== -1){ // stop timer if it is running at the moment
			clearInterval(model.autoRunTimerId);
			model.autoRunTimerId = -1;
			return false;
		}

		speed = speed || 1000;
		model.autoRunTimerId = setInterval(function(){
			model.runCurrStep();
			if (model.algorithm.getCurrStep().name === 'finish'){
				clearInterval(model.autoRunTimerId);
				model.autoRunTimerId = -1;
			}
		}, speed);
		return true;
	}

	// finishing simulation
	finish(){
		console.log(model.algorithm.getCurrStep().description);
	}

	// Reset the Model method
	reset(){
		if(model.autoRunTimerId !== -1){
			clearInterval(model.autoRunTimerId) // stop autorun timer if it is started
			//document.getElementById('autoRunBtn').innerHTML='Autorun';
		}

		$("#infoBitNum").prop('disabled', false);
		$("#parityBitNum").prop('disabled', false);
		$("#cwBitNum").prop('disabled', false);
		$("#errDetectNum").prop('disabled', false);
		$("#selGenPolyBtn").prop('disabled', false);

		this.algorithm.reset();
		this.stat.reset();
		this.stat.remove();
		this.layer.getStage().clear();
		this.layer.destroy();
		try{
			$(".ui-dialog-content").dialog("close");
		} catch(e) {console.log(e)}
	} // end the reset


	// Create steps
	encoderSteps(lang, cycleCount1, cycleCount2){
		let steps=[];
		let step;
		step = {name:'setParam',
			description: lang.setParam,
			help:lang.setParamHelp,
			sub:[]
		};
		steps.push(step);

		step = {name:'setBits',
			description: lang.setBits,
			help:lang.setIrBitsHelp,
			sub:[]
		};
		steps.push(step);

		step = {name:'flipIR',
			description: lang.flipIR,
			help:lang.flipIRHelp,
			sub:[]
		};
		steps.push(step);

		step = {name: 'set1SW', // SW1 => Close, SW2 => 1
			description: lang.setSW,
			help: lang.setSWHelp,
			sub: []
		};
		steps.push(step);

		step = {name: 'calcParity',
			description: lang.calcParity,
			help: 'Executed for each Information bit (m-times)',
			cycleCount: cycleCount1,
			sub:[{name: 'calcFB',  description: lang.calcFB,  help: lang.calcFBHelp},
				{name: 'calcXOR', description: lang.calcXOR, help: lang.calcXORHelp},
				{name: 'shiftEN', description: lang.shiftEN, help: lang.shiftENHelp},
				{name: 'shiftCR', description: lang.shiftCR, help: lang.shiftCRHelp},
				//{name: 'shiftIR', description: lang.shiftIR, help: lang.shiftIRHelp}
			],
			exitCond: lang.mTimesExitCond
		};
		steps.push(step);

		step = {name: 'set2SW', // SW1 => open, SW2 => 2
			description: lang.setSW,
			help: lang.setSWHelp,
			sub: []
		};
		steps.push(step);

		step = {name: 'shiftParity',
			description: lang.shiftParity,
			help: 'Execute for each Encoder bit (k-times)',
			cycleCount: cycleCount2,
			sub:[ {name: 'shiftCR', description: lang.shiftCR, help: lang.shiftCRHelp},
				//{name: 'shiftEN', description: lang.shiftEN, help: lang.shiftENHelp}
			],
			exitCond: lang.kTimesExitCond
		};
		steps.push(step);

		step = {name:'flipCR',
			description: lang.flipCR,
			help:lang.flipCRHelp,
			sub:[]
		};
		steps.push(step);


		step = {name: 'finish',
			description: lang.finish,
			help: lang.finishMsg,
			sub:[]
		};
		steps.push(step);
		return steps;
	};
} // end of ccModel


