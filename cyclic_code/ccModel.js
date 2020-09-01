class ccModel{
	constructor(){
		this.layer={};
		this.en={};
		this.ir={};
		this.cr={};
		this.m;
		this.k;
		this.n;
		this.t;
		this.poly={val:'', txt:''};
		this.xorIds;
		this.algorithm = {};
		this.stat = {};
		this.debug=true;
		this.runType = '';
		this.width = 0;
		this.height = 0;
		this.autoRunTimerId = -1;
		this.cover = {};
		this.currLang = new LnagPack(document.querySelector('input[name="lang"]:checked').value);
	}
	
	//cheking the code parameters
	checkParam(param){
        let lang = this.currLang.gn;
		this.m = param.m;
		this.k = param.k;
		this.n = param.n;
		this.t = param.t;
		this.poly = {val: param.poly.val, txt: param.poly.txt};
		if (this.debug) console.log('Checking parameters...');		
		// parity bit number check
		if ((Math.pow(2, this.k) - this.k) < (this.m + 1 + this.t - 2)){
			alert(lang.wrongK);
			return;
		}
		// codeword bit number check
		if(this.n !== (this.m + this.k)){
			alert(lang.wrongN);
			return;
		}	
		// poly check
		if (this.t === 2)
			switch (this.k){
				case 3:
					if(this.poly.val === '3.1')       this.xorIds=['xor0','xor2'];			
					else if(this.poly.val === '3.2')  this.xorIds=['xor1','xor2'];
					else {
						alert(lang.wrongPoly);
						return;
					}	
				break;
				case 4:
					if(this.poly.val === '4.1')       this.xorIds=['xor0','xor3'];			
					else if(this.poly.val === '4.2')  this.xorIds=['xor2','xor3'];
					else {
						alert(lang.wrongPoly);
						return;
					}	
				break;
				case 5:
					if     (this.poly.val === '5.1')  this.xorIds=['xor1','xor4'];
					else if(this.poly.val === '5.2')  this.xorIds=['xor2','xor4'];
					else {
						alert(lang.wrongPoly);
						return;
					}
				break;
			}					
		else if (this.t === 3)
			switch (this.k){
				case 4:
					if(this.poly.val === '3.3')       this.xorIds=['xor1','xor2','xor3'];			
					else if(this.poly.val === '3.4')  this.xorIds=['xor1','xor3'];
					else {
						alert(lang.wrongPoly);
						return;
					}	
				break;
				case 5:
					if(this.poly.val === '4.3')       this.xorIds=['xor1','xor3','xor4'];			
					else if(this.poly.val === '4.4')  this.xorIds=['xor0','xor2','xor4'];
					else {
						alert(lang.wrongPoly);
						return;
					}	
				break;
				case 6:
					if     (this.poly.val === '5.3')  this.xorIds=['xor0','xor1','xor2','xor4','xor5'];
					else if(this.poly.val === '5.4')  this.xorIds=['xor0','xor2','xor3','xor4','xor5'];
					else {
						alert(lang.wrongPoly);
						return;
					}
				break;
			}
		if (this.debug) console.log('OK');
		return true;
	}
		
	// initializing the model
	init(){
	    // check selected language
        let thisLang = document.querySelector('input[name="lang"]:checked').value;
        this.currLang = new LnagPack(thisLang); // load from file

		let lang = this.currLang.gn;

		// creating the LAYER
		this.layer = new Konva.Layer();	
	
		// creating the LFSR ENCODER //////////////////////////////////////////////
		this.en = new LFSR({
			name: lang.enLabel,
			pos:{x:20, y:40},
			bitsNum: this.k,
			xorIds: this.xorIds,
			poly: 'P(X)='+this.poly.txt,
			sHover: lang.sHover,
			fHover: lang.fHover,
			sw: {hover: lang.swHover},
			xor:{hover:lang.xorHover,
				 fbHover:lang.fbHover}
			}, this.layer
		);
		this.en.fb.txtFb.text(lang.fbLabel);

		// Encoder '>>>' click event
		model.en.S.on('click touchstart', function(){
			let currStep = model.algorithm.getCurrStep();
			if (currStep.name === 'calcXOR'){ // check for correct XOR results
                if (model.en.checkXOR()) model.algorithm.increment(); // enable shiftEN
                else {
					model.en.info.show('e', lang.wrongXor);
					model.stat.errorAdd();
					return;
				}
			}

			let check = model.algorithm.validStep('shiftEN');
			if (check === true) {
				model.en.shiftR(true);
                model.en.fb.reset();
                model.algorithm.increment(); // enable shiftCR
				console.log(model.algorithm.getCurrStep().description);
			}
			else {
				model.en.info.show('e', check);
				model.stat.errorAdd();
				return;
			}
		});

		// Encoder 'XOR' click event
		model.en.xors.forEach(xor => {
			xor.on('click touchstart', function(){
				let currStep =  model.algorithm.getCurrStep().name;
				// check for correct SW position
				if (currStep === 'set1SW'){
					if (model.en.sw1.pos !== 1){
						model.en.info.show('e', lang.wrongSw);
						model.stat.errorAdd();
						return;
					}; 
					if (model.en.sw2.pos !== 1){						
						model.en.info.show('e',  lang.wrongSw);
						model.stat.errorAdd();
						return;
					}	
					// enable  calcFB (calcParity)
					model.algorithm.increment(); 
				}

				// check for correct operation
				let check;
				if (xor.isFB === true){ // for FB's XOR
					check = model.algorithm.validStep('calcFB');
					if (check === true){
						xor.invertRes();
						console.log(model.algorithm.getCurrStep().description);
					}
					else {
						model.en.info.show('e', check);
						model.stat.errorAdd();
						return;
					}
				}
				else { // for other XORs
					if (model.algorithm.getCurrStep().name === 'calcFB'){ // FB's value validating
						model.updateXORs();
						if(model.en.checkFB()) {
							 model.en.fb.setVal(model.en.xors[model.en.xors.length-1].res);
							 model.updateXORs(); // update XORs inputs
							 console.log(model.algorithm.getCurrStep().description);
							 model.algorithm.increment(); // enable calcXOR
						}
						else{
							 model.en.info.show('e', lang.wrongFb);
							 model.stat.errorAdd();
							 return;
						}
					}

					check = model.algorithm.validStep('calcXOR');
					if (check === true)  {
						xor.invertRes();
						console.log(model.algorithm.getCurrStep().description);
					}
					else {
						model.en.info.show('e', check);
						model.stat.errorAdd();
						return;
					}
				}

			});
		});
		// Encoder 'SW1' click event
		model.en.sw1.on('click touchstart', function(){
			let check = model.algorithm.validStep('set1SW');
			if (check === true){
				model.en.sw1.changePos();
				console.log(model.algorithm.getCurrStep().description+' SW1 => '+model.en.sw2.pos);
				return;
			}

			check = model.algorithm.validStep('set2SW');
			if (check === true){
				model.en.sw1.changePos();
				console.log(model.algorithm.getCurrStep().description +' SW1 => '+model.en.sw2.pos);
			}
			else {
				model.en.info.show('e', check);
				model.stat.errorAdd();
				return;
			}
		});
		// Encoder 'SW2' click event
		model.en.sw2.on('click touchstart', function(){
			let check = model.algorithm.validStep('set1SW');
			if (check === true){
				model.en.sw2.changePos();
				// set CR's input bit according to SW2 position
				if (model.en.sw2.pos === 1) model.cr.inBit = model.ir.vals[model.ir.vals.length - 1];
				else if(model.en.sw2.pos === 2) model.cr.inBit = model.ir.vals[model.en.vals.length - 1];
				console.log(model.algorithm.getCurrStep().description +' SW2 => '+model.en.sw2.pos);
				return;
			}
			// for second situation
			check = model.algorithm.validStep('set2SW');
			if (check === true){
				model.en.sw2.changePos();
				console.log(model.algorithm.getCurrStep().description +' SW2 => '+model.en.sw2.pos);
			}
			else {
				model.en.info.show('e', check);
				model.stat.errorAdd();
				return;
			}
		});

		// creating  the INFORMATION REGISTER //////////////////////////////////////////////
		let pos={};
		pos.x = this.en.rect.absolutePosition().x;
		pos.y = this.en.rect.absolutePosition().y + this.en.rect.height() + 40;
		this.ir = new REGISTER({
			id: 'ir',
			name: lang.irLabel,
			bitsNum: this.m,
			sHover: lang.sHover,
			rHover: lang.rHover,
			randHover: lang.randHover,
			bit: {name: 'IR Bit', hover: lang.bitHover, enabled: true},
		   }, this.layer
		);
		this.ir.position(pos);
		// connection between IR and Encoder
		this.ir.connectTo(this.en.soket('abs').connI);
		// init IR update method
        this.ir.updateInBit = function(){
            model.ir.inBit = '';
        };
		// IR 'Bit' click event
		this.ir.bits.forEach(bit =>{
			bit.on('click touchstart', function(){
				let check = model.algorithm.validStep('setBit');
				if (check === true) {
					bit.setBit();
					console.log(model.algorithm.getCurrStep().description +' => '+ bit.id());
				}
				else {
					model.ir.info.show('e', check);
					model.stat.errorAdd();
					return;
				}
			});
		});
		// IR 'R' click event
		this.ir.R.on('click touchstart', function(){
			let currStep = model.algorithm.getCurrStep().name;
			if (currStep === 'setBit'){
				let check;
				model.ir.bits.forEach(bit => {
					if (bit.txt.text() === '') return check = 'emptyBit';
				});
				if (check === 'emptyBit'){
					model.ir.info.show('e', lang.setAllBit);
					model.stat.errorAdd();
					return;
				}
				else {
                    model.algorithm.increment();  // enable reverseIR
				}
			}
			let check = model.algorithm.validStep('reverseIR');
			if (check === true)  {
				model.ir.reverse();
				console.log(model.algorithm.getCurrStep().description);
                model.algorithm.increment();  // enabling the next step
			}
			else {
				model.ir.info.show('e', check);
				model.stat.errorAdd();
				return;
			}
		});

        // IR 'Random' click event
        this.ir.rand.on('click touchstart', function(){
            let check = model.algorithm.validStep('setBit');
            if (check === true) {
                model.ir.randGen();
                this.fill('red');
                console.log(model.algorithm.getCurrStep().description);
            }
            else{
                model.ir.info.show('e', check);
                model.stat.errorAdd();
                return;
            }
        });
                // IR '>>>' click event
		this.ir.S.on('click touchstart', function(){
			let check = model.algorithm.validStep('shiftIR');
			if (check === true) {
				model.ir.updateInBit(); // update input bit
				model.ir.shiftR(true);
				model.updateXORs(); // update XORs inputs
				console.log(model.algorithm.getCurrStep().description);
				model.algorithm.increment(); // enable set1SW or set2SW
			}
			else {
				model.ir.info.show('e', check);
				model.stat.errorAdd();
				return;
			}
		});

		// creating  the CODEWORD REGISTER ////////////////////////////////////////////////
		this.cr = new REGISTER({
			id: 'cw',
			name: lang.crLabel,
			pos:{x: this.en.soket().connO.x + 80, y: 0},
			bitsNum: this.n,
			bit : {name: 'CR Bit', enabled: false},
			sHover: lang.sHover,
			rHover: lang.rHover,
		  }, this.layer);

		// codeword register position correction
		this.cr.y(this.en.soket('abs').connO.y - this.cr.rect.height()/2);
		// connection between Encoder and CR
		this.cr.connectFrom(this.en.soket('abs').connO);
		// CR input bit update
		this.cr.updateInBit = function(){
			if (model.en.sw2.pos === 1) model.cr.inBit = model.ir.vals[model.ir.vals.length - 1];
			else if (model.en.sw2.pos === 2) model.cr.inBit = model.en.vals[model.en.vals.length - 1];
			//console.log('CR updateInBit => inBit = '+model.cr.inBit);
		};

		// CR '>>>' click event
		this.cr.S.on('click touchstart', function(){
			// check SW's position if current step is  'set2SW'
			let currStep = model.algorithm.getCurrStep();
			if(currStep.name === 'set2SW') {
				if (model.en.sw1.pos !== 0){
					model.en.info.show('e', lang.wrongSw);
					model.stat.errorAdd();
					return;
				}		 
				if (model.en.sw2.pos !== 2){
					model.en.info.show('e', lang.wrongSw);
					model.stat.errorAdd();
					return;
				}		
				model.algorithm.increment(); // enable  shiftEN (shiftParity)
			}

			let check = model.algorithm.validStep('shiftCR');
			if (check === true){
				model.cr.updateInBit(); // update input bit
				model.cr.shiftR(true);
				console.log(model.algorithm.getCurrStep().description);
				model.algorithm.increment(); // enable shiftIR
			}
			else {
				model.cr.info.show('e', check);
				model.stat.errorAdd();
				return;
			}
		});
		// CR 'R' click event
		this.cr.R.on('click touchstart', function(){
			let check = model.algorithm.validStep('reverseCR');
			if (check === true){
				model.cr.reverse();
				console.log(model.algorithm.getCurrStep().description);
                model.algorithm.increment(); // last operation
                model.finish();
			}
			else {
				model.cr.info.show('e', check);
				model.stat.errorAdd();
				return;
			}
		});

        // creating the ALGORITHM PANEL
		this.algorithm = new ALGORITHM(this.m, this.k, this.currLang.alg);
		// setting the algorithm's schema position
		this.algorithm.schema.setPos({ x: this.cr.x() + this.cr.width() + 40, y: 5
		});

      	// setting the model size
		this.width = this.algorithm.schema.x() + this.algorithm.schema.width();
		this.height = this.algorithm.schema.y() + this.algorithm.schema.height();

		// creating the model cover
		this.cover = new Konva.Rect({
			id: 'cover',
			x: this.en.x(),
			y: this.en.y(),
			width: this.cr.x()+ this.cr.width(),
			height: this.ir.y()+ this.ir.height(),
			fill: 'Beige',
			cornerRadius: 4,
			opacity: 0
		});

		this.cover.on('click touchstart', function(){
			model.cr.info.show('e', lang.startTimer);
		});
		this.cover.on('mouseout touchend', function(){
			model.cr.info.hide();
		});

        // creating the Statistics panel
        this.stat = new STATISTICS(this.currLang.stat);
        // setting the Statistics's panel position
        this.stat.position({ x: this.en.x(), y: 5});
        this.stat.rect.width(this.en.width());

        // initing timer
        this.stat.timer.init(5);
		// starting timer
		this.stat.timeVal.on('click touchstart', function(){
			if (model.algorithm.getCurrStep().name === 'finish') {
				model.cr.info.show('e', lang.simFinish);
				return;
			}
			else if (model.stat.timer.min === 0 && model.stat.timer.sec === 0) {
				model.cr.info.show('e', 'The timer is expired! Click "Reset the model" button for new simulation!');
				return;
			}
			if(model.stat.timer.id !== -1) {
				model.stat.timer.stop();
				model.stat.timer.id = -1;
				model.cover.visible(true);
				model.layer.batchDraw();
				return;
			}

			model.stat.timer.start();
			model.cover.visible(false);
			model.layer.batchDraw();
		});

		// adding the all component in the KONVA layer
		this.layer.add(this.en, this.ir, this.cr, this.cover);
		this.layer.draw();

		// the all layers
		let layers = [this.algorithm.layer, this.layer, this.stat.layer];

        // changing the large-container size
        document.getElementById("large-container").style.width = (model.width + 100)+"px";
        document.getElementById("large-container").style.height = (model.height + 50)+"px";
        document.getElementsByName("lang")[0].disabled = true;
        document.getElementsByName("lang")[1].disabled = true;

		return layers;
	} // end of init()

    // finishing simulation
    finish(){
        model.stat.timer.stop();
        alert(model.algorithm.getCurrStep().description+' '+model.algorithm.getCurrStep().help);
		document.getElementById('nextBtn').disabled=true;
		document.getElementById('autoRunBtn').disabled=true;
    }
	
	// set the XOR's input values
	updateXORs(){ 
		this.en.xors.forEach(xor => {
			let in1, in2;
			if (xor.isFB === true){ // for XOR of the feedback
				in1 = this.en.vals[this.en.vals.length-1];
				in2 = this.ir.vals[this.ir.vals.length-1];
			}
			else {// for others XOR
				in1 = this.en.fb.val;
				in2 = this.en.vals[Number(xor.id().substr(3))];
			}
			//console.log(xor.id()+' => in1 = '+in1+', in2 = '+in2);
			
			xor.setInputs(in1, in2);
		});
	}

    // run current step
    runCurrStep(){
	    if(typeof this.ir.bits === 'undefined') return alert(lang.noModel);
        switch (this.algorithm.getCurrStep().name){
            // Set the Information Register
            case 'setBit':
                let check;
                this.ir.bits.forEach(bit => {
                    if (bit.txt.text() === '') return check = 'empty';
                });
                if (check === 'empty'){
                    let infoBits = [1,0,0,1,1,0,1,0,0,1,1]; // example info bits
                    this.ir.load(infoBits);
                    console.log(model.algorithm.getCurrStep().description);
                    this.algorithm.increment(); // enable next step
                }
                else {
                    console.log(model.algorithm.getCurrStep().description);
                    this.algorithm.increment(); // enable next step
                }
            break;

            // Reverse  Information’s bits
            case 'reverseIR':
                this.ir.reverse();
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
                this.updateXORs();
                this.en.calcFB();
                this.updateXORs();
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
                this.en.shiftR();
                console.log(model.algorithm.getCurrStep().description);
                this.algorithm.increment(); // enable next step
            break;

            // Shift Codeword Bits
            case 'shiftCR':
                this.cr.updateInBit(); // update input bit
                this.cr.shiftR();
                console.log(model.algorithm.getCurrStep().description);
                this.algorithm.increment(); // enable next step
            break;

            // Shift Informations Bits
            case 'shiftIR':
                this.ir.shiftR();
                console.log(model.algorithm.getCurrStep().description);
                this.algorithm.increment(); // enable next step
            break;

            case 'reverseCR':
                this.cr.reverse();
                console.log(model.algorithm.getCurrStep().description);
                this.algorithm.increment(); // enable next step
            break;

            // finish simulation
            default:
                model.finish();
        }
    } // end runCurrStep()
	
    // autorun
	autoRun(speed){
		if (model.autoRunTimerId !== -1){ // stop timer if it is running at the moment
			clearInterval(model.autoRunTimerId);
			model.autoRunTimerId = -1;
			document.getElementById('autoRunBtn').innerHTML='Autorun';
			return;
		}
		document.getElementById('autoRunBtn').innerHTML='Pause Autorun';
		speed = speed || 100;
		model.autoRunTimerId =  setInterval(function(){
			model.runCurrStep();
			if (model.algorithm.getCurrStep().name === 'finish'){
				clearInterval(model.autoRunTimerId);
				model.autoRunTimerId = -1;
				model.finish();
				document.getElementById('autoRunBtn').innerHTML='Autorun';
			}
		}, speed);
		//clearInterval(refreshIntervalId);
	}

	// Reset the Model method
	reset(){		
		document.getElementById('checkBtn').disabled=false;
		document.getElementById('infoBitNum').disabled=false;
		document.getElementById('parityBitNum').disabled=false;
		document.getElementById('cwBitNum').disabled=false;
		document.getElementById('errDetectNum').disabled=false;
		document.getElementById('genPoly').disabled=false;
		document.getElementById('nextBtn').disabled=true;
		document.getElementById('resetBtn').disabled=true;
		document.getElementById('autoRunBtn').disabled=true;
        document.getElementsByName("lang")[0].disabled = false;
        document.getElementsByName("lang")[1].disabled = false;
			
		this.en.vals.fill(0);		
		this.algorithm.reset();
		this.stat.reset();
		this.layer.destroy();
		stage.clear();
	} // end the reset
} // end of ccModel


// Function to download data to a file
function download(data, filename, type) {
    let file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}