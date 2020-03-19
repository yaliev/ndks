class hcModel {
    constructor(props) {
        this.process;
        this.lang;
        this.layer = null;
        this.en = {};
        this.ir = {};
        this.cr = {};
        this.m;
        this.k;
        this.n;
        this.t;
        this.algorithm = {};
        this.stat = {};
        this.debug = true;
        this.runType = '';
        this.width = 0;
        this.height = 0;
        this.autoRunTimerId = -1;
        this.cover = {};
    }

    //cheking the code parameters
    checkParam(param) {
        this.m = param.m;
        this.k = param.k;
        this.n = param.n;
        this.t = param.t;
        this.process = param.process; // default process is encoding
        this.lang =  new LnagPack(param.lang); // default language is english
        let lang = this.lang.gn;

        if (this.debug) console.log('Checking parameters...');
        // parity bit number check
        let k_mustBe;
        for(let i=3; i<7; i++){
            if(((Math.pow(2, i) - i) >= (this.m + 1))){
                if(this.t === 1) k_mustBe = i;
                else k_mustBe = i+1;
                break;
            }
        }
        if (this.k !== k_mustBe){
            alert(lang.wrongK);
            return lang.wrongK;
        }

        // codeword bit number check
        if (this.n !== (this.m + this.k)){
            alert(lang.wrongN);
            return lang.wrongN;
        }
        if (this.debug) console.log('OK');
        return true;
    }

    // initializing the model///////////////////////////////////////////////////////////////
    init(errors) {
        // create arr for all layers
        let layers =[];
        let lang = this.lang.gn;

        // creating the Statistics panel
        this.stat = new STATISTICS(this.lang.stat);
        this.stat.position({ x: 20, y: 5});
        this.stat.rect.width(stage.width() - this.stat.x()*3);
        this.stat.userName ='';


        // if there is error to now add to the stat obj
        if(errors.count !== 0){
            model.stat.error.insert(errors);
        }
        // encoder
        if(this.process === 'enc'){
            // creating the ALGORITHM PANEL
            this.algorithm = new ALGORITHM(encoderSteps(this.lang.alg, this.k),this.m, this.k, this.lang.alg);
            // setting the algorithm's schema to some position
            this.algorithm.schema.setPos({ x:1000 , y: 50});
            layers.push(this.algorithm.layer);
            this.layer = this.applyEncoder();
        }
        // decoder
        else if(this.process === 'dec'){
            // creating the ALGORITHM PANEL
            this.algorithm = new ALGORITHM(decoderSteps(this.lang.alg, this.k), this.m, this.k, this.lang.alg);
            // setting the algorithm's schema to some position
            this.algorithm.schema.setPos({ x:1000 , y: 50});
            layers.push(this.algorithm.layer);
            this.layer = this.applyDecoder();
        }
        this.layer.draw();

        // dragmove event for algorithm panel
        this.algorithm.schema.on('dragmove', function(e){
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

        if(componentsPos.alg !== '') this.algorithm.schema.position(componentsPos.alg);
        if(this.process === 'enc'){
            if(componentsPos.ir !== '') this.ir.position(componentsPos.ir);
            if(componentsPos.en !== '') this.en.position(componentsPos.en);
        }
        else{
            if(componentsPos.cr !== '') this.cr.position(componentsPos.cr);
            if(componentsPos.dec !== '') this.dec.position(componentsPos.dec);
        }

        this.simFinish=function(){
            let str='';
            if(this.process==='enc'){ // encoding
                str='<p>'+lang.modeEnc+'<\p>';
                str +='<p>'+lang.codeParam+': m = '+this.m+', l<sub>0</sub> = '+this.t+', k = '+this.k+', n = '+this.n+'<\p>';
                let valStr='';
                for(let i=0; i<model.ir.vals.length; i++) valStr += model.ir.vals[i].toString();
                str+='<p>'+lang.infoBits+': X = '+valStr+'<\p>';
                valStr='';
                for(let i=0; i<model.en.vals.length; i++) valStr += model.en.vals[i].toString();
                str+='<p>'+lang.cwBits+': [X] = '+valStr+'<\p>';
            }
            else{ // decoding
                str='<p>'+lang.modeDec+'<\p>';
                str +='<p>'+lang.codeParam+': m = '+this.m+', l<sub>0</sub> = '+this.t+', k = '+this.k+', n = '+this.n+'<\p>';
                let valStr='';
                for(let i=0; i<model.cr.vals.length; i++) valStr += model.cr.vals[i].toString();
                str+='<p>'+lang.cwBits+': [X] = '+valStr+'<\p>';
                if(this.dec.errStatus.auto === 'noError') valStr = lang.noErr;
                else if(this.dec.errStatus.auto === 'singleError') valStr = lang.singleErr + ' ('+this.dec.error.decCode.auto+')';
                else valStr = lang.doubleErr;
                str+='<p>'+lang.errStatus+': '+valStr+'<\p>';
                str+='<p>'+lang.decodedMsg+': X = '+this.dec.decodedMsg.auto+'<\p>';
            }


            $("#div-simFinish").dialog('option','title', lang.finishMsg);
            $("#simFinishMsg").html(str);
            $("#div-simFinish" ).dialog('open');
        };

        layers.push(this.layer);
        layers.push(this.stat.layer);
        return layers;
    } // end of init()


    // DECODER PROCESS //////////////////////////////////////////////////////////////
    applyDecoder(){
        // creating the LAYER
        let layer = new Konva.Layer();
        // get the selected language
        let lang = this.lang.gn;

        //creating the CW register
        this.cr = new REGISTER1({
                process: this.process,
                id: 'cr',
                position: {x:this.stat.x(), y:this.stat.y()+this.stat.height()+10},
                name: lang.crLabel,
                bitsNum: this.n,
                randHover: lang.randCwHover,
                randBtnLabel: lang.randCWLabel,
                draggable: false,
                bit: {name: 'CW Bit', firstNum: this.t === 1 ? 1 : 0, labelTxt:'', hoverTxt: lang.regBitHover, enabled: true},
            }, layer
        );
        layer.add(this.cr);

        // CR 'Bit' click event
        this.cr.bits.forEach(bit =>{
            bit.on('click touchstart', function(){
                let check = model.algorithm.validStep('setBits');
                //let check = true;
                if (check === true) {
                    bit.setBit();
                    if(model.cr.areAllBitsSetted()) model.algorithm.markCurrStep('past');
                    else model.algorithm.markCurrStep('curr');
                }
                else {
                    bit.hover.show('e', check);
                    return;
                }
            });
        });

        //
        this.cr.randErr = this.cr.rand.clone();
        this.cr.add(this.cr.randErr);
        this.cr.randErr.text(lang.randCwErrLabel);
        this.cr.randErr.x(this.cr.rand.x() + this.cr.rand.width() + 20);
        this.cr.randErr.off();
        this.cr.randErr=over(this.cr.randErr);
        this.cr.randErr.hoverTxt = lang.randErrHover;
        this.cr.randErr=hover1(this.cr.randErr, this.cr);

        // CR 'Random CW with Error' click event
        this.cr.randErr.on('click touchstart', function(){
            let check = model.algorithm.validStep('setBits');
            if (check === true) {
                let randBits=[];
                for(let i=0; i<model.m; i++){
                    randBits.push((Math.random() > 0.5) ? 1 : 0);
                }
                let cw = hcEncoder({infoBits: randBits, l:model.t});
                //let errCount = Math.floor(Math.random() * 3);
                let errCount = Math.floor(Math.random() * (1+model.t));
                if(errCount === 1){
                    let errPos = Math.floor(Math.random() * (cw.length));
                    //console.log('errPos = '+errPos);
                    cw[errPos] = cw[errPos] === 0 ? 1 : 0;
                }
                else if (errCount === 2){
                    let errPos1 = Math.floor(Math.random() * (cw.length));
                    let errPos2;
                    while(true){
                        errPos2 = Math.floor(Math.random() * (cw.length));
                        if(errPos1 !== errPos2) break;
                    }
                    cw[errPos1] = cw[errPos1] === 0 ? 1 : 0;
                    cw[errPos2] = cw[errPos2] === 0 ? 1 : 0;
                    console.log('errPos1 = '+errPos1,'errPos2 = '+errPos2);
                }
                if(errCount === 0) console.log('No error');
                model.cr.load(cw);
                model.algorithm.markCurrStep('curr');
            }
            else {
                this.hover.show('e', check);
                model.stat.error.add(check);
                return;
            }
        });

        // CR 'Random CW' click event
        this.cr.rand.on('click touchstart', function(){
            let check = model.algorithm.validStep('setBits');
            if (check === true) {
                let randBits=[];
                for(let i=0; i<model.m; i++){
                    randBits.push((Math.random() > 0.5) ? 1 : 0);
                }
                model.cr.load(hcEncoder({infoBits: randBits, l:model.t}));
                model.algorithm.markCurrStep('curr');

                console.log('Random codeword without error generating.');
                let valStr='';
                for(let i=0; i<model.cr.vals.length; i++) valStr += model.cr.vals[i].toString();
                console.log(valStr);

            }
            else {
                this.hover.show('e', check);
                model.stat.error.add(check);
                return;
            }
        });

        // dragmove event for codeword register
        this.cr.on('dragmove', function(e){
            if(typeof componentsPos.cr !== 'undefined'){
                componentsPos.cr = this.position();
            }
            else console.log('componentsPos.cr is undefined');
        });

        // creating the encoder
        this.dec = new HAMMING_GA({
                process: this.process,
                id: 'dec',
                position: {x: this.cr.x(), y: this.cr.y()+this.cr.height()+10},
                name: lang.decLabel,
                pos:{x:this.cr.x(), y: this.cr.y()+this.cr.height()+10},
                bitsNum: this.n,
                errDet: this.t,
                checkBits: this.k,
                lang:lang,
                draggable: false
            }, layer, model.algorithm, model.stat
        );
        layer.add(this.dec);
        this.stat.modelName = 'Hamming Decoder - GA';

        // load button click event
        this.dec.loadBtn.on('click touchstart', function(){
            if(!model.dec.loadBits(model.cr.vals, model.cr.bits)){
                //error
                model.stat.error.add(lang.setAllCwBit);
                this.hover.show('e',lang.setAllCwBit);
            }
            else{
                model.algorithm.increment(); // enable next step
            }
        });

        // labels click events
        this.dec.labels.forEach(label =>{
            label.on('dragmove', function(e) {
                //model.dec.checkLabelIntersection(label);
                if (model.cr.areAllBitsSetted()){
                    if (model.algorithm.getCurrStep().name === 'setBits')
                         model.algorithm.increment(); // enable next step
                    this.hover.hide();
                }
                else{
                    // error
                    return this.hover.show('e',lang.setAllCwBit);
                }
                model.algorithm.markCurrStep('curr');
            });

        });

        // check labels position button
        this.dec.checkLabelBtn.on('click touchstart', function(){
            if(!model.cr.areAllBitsSetted()){
                model.stat.error.add(lang.setAllBit);
                this.hover.show('e',lang.setAllBit);
                return;
            }
            if (!model.dec.checkLabels()) {
                // error
                model.stat.error.add(lang.incorrectLabel);
                this.hover.show('e',lang.incorrectLabel);
            }
            else{
                //model.algorithm.markCurrStep('past');
                model.algorithm.increment(); // enable next step
            }
        });

        // click event for the all info bits
        this.dec.bits.forEach(bit => {
            if (bit.id().substr(0,1) === 'S'){
                bit.on('click touchstart', function(){
                    let msg = model.dec.addToEqu(bit);
                    if (msg !== true){
                        //error
                        this.hover.show('e',msg);
                    }
                });
            }
        });

        // Eguation button click event
        this.dec.equBtn.on('click touchstart', function(){
            let msg = model.dec.equBtnCallback();
            if (msg !== true){ // check for correct control bit equation
                // error
                model.stat.error.add(msg);
                this.hover.show('e',msg);
            }
            else{
                model.algorithm.markCurrStep('past');
                if(model.algorithm.getCurrStep().name === 'createEqu') model.algorithm.increment(); // enable next step
                model.algorithm.markCurrStep('curr');
            }
        });

        // dragmove event for decoder
        this.dec.on('dragmove', function(e){
            if(typeof componentsPos.dec !== 'undefined'){
                componentsPos.dec = this.position();
            }
            else console.log('componentsPos.dec is undefined');
        });

        // setting the algorithm's schema position
        this.algorithm.schema.setPos({ x: this.dec.x() + this.dec.width() + 40, y: this.cr.y()});
        return layer;
    }


    // ENCODER PROCESS //////////////////////////////////////////////////////////////
    applyEncoder(){
        // creating the LAYER
        let layer = new Konva.Layer();
        // get the selected language
        let lang = this.lang.gn;
        //creating the Info register
        this.ir = new REGISTER1({
                process: this.process,
                id: 'ir',
                position: {x:this.stat.x(), y:this.stat.y()+this.stat.height()+10},
                name: lang.irLabel,
                bitsNum: this.m,
                randHover: lang.randHover,
                randBtnLabel: lang.randInfoLabel,
                draggable: false,
                bit: {name: 'IR Bit', labelTxt: 'S_', hoverTxt: lang.regBitHover, enabled: true},
            }, layer
        );

        // IR 'Bit' click event
        this.ir.bits.forEach(bit =>{
            bit.on('click touchstart', function(){
                let check = model.algorithm.validStep('setBits');
                //let check = true;
                if (check === true) {
                    bit.setBit();
                    if(model.ir.areAllBitsSetted()) model.algorithm.markCurrStep('past');
                    else model.algorithm.markCurrStep('curr');
                }
                else {
                    bit.hover.show('e', check);
                    //model.stat.error.add();
                    return;
                }
            });
        });
        this.ir.rand.on('click touchstart', function(){
            let check = model.algorithm.validStep('setBits');
            if (check === true) {
                model.ir.randGen();
                model.algorithm.markCurrStep('curr');
                let valStr='';
                for(let i=0; i<model.ir.vals.length; i++) valStr += model.ir.vals[i].toString();
                console.log(valStr);
                // if(model.ir.areAllBitsSetted()) model.algorithm.markCurrStep('past');
                // else model.algorithm.markCurrStep('curr');
            }
            else {
                this.hover.show('e', check);
                model.stat.error.add(check);
                return;
            }
        });

        // creating the encoder
        this.en = new HAMMING_GA({
                process: this.process,
                id: 'en',
                position: {x: this.ir.x(), y: this.ir.y()+this.ir.height()+10},
                name: lang.enLabel,
                pos:{x:20, y:200},
                bitsNum: this.n,
                errDet: this.t,
                checkBits: this.k,
                lang:lang,
                draggable: false
            }, layer, model.algorithm, model.stat
        );
        this.stat.modelName = 'Hamming Encoder - GA';

        // load button click event
        this.en.loadBtn.on('click touchstart', function(){
            if(!model.en.loadBits(model.ir.vals, model.ir.bits)){
                //error
                model.stat.error.add(model.en.lang.setAllBit);
                this.hover.show('e',model.en.lang.setAllBit);
            }
            else{
                model.algorithm.increment(); // enable next step
            }
        });

        // drag events for the labels
        this.en.labels.forEach(label =>{
            label.on('dragmove', function(e) {
                //model.en.checkLabelIntersection(label);
                if (model.ir.areAllBitsSetted()){
                    if (model.algorithm.getCurrStep().name === 'setBits')
                        model.algorithm.increment(); // enable next step
                        this.hover.hide();
                }
                else{
                    // error
                    return this.hover.show('e',model.en.lang.setAllBit);
                }
                model.algorithm.markCurrStep('curr');
            });
        });

        // click event for labels position button
        this.en.checkLabelBtn.on('click touchstart', function(){
            if(!model.ir.areAllBitsSetted()){
                model.stat.error.add(model.en.lang.setAllBit);
                this.hover.show('e',model.en.lang.setAllBit);
                return;
            }
            if (!model.en.checkLabels()) {
                // error
                model.stat.error.add(model.en.lang.incorrectLabel);
                this.hover.show('e',model.en.lang.incorrectLabel);
            }
            else{
                model.algorithm.increment(); // enable next step
            }
        });

        // click event for Eguation button
        this.en.equBtn.on('click touchstart', function(){
            let msg = model.en.equBtnCallback();
            if (msg !== true){ // check for correct control bit equation
                // error
                model.stat.error.add(msg);
                this.hover.show('e',msg);
            }
            else{
                model.algorithm.markCurrStep('past');
                if(model.algorithm.getCurrStep().name === 'createEqu') model.algorithm.increment(); // enable next step
                model.algorithm.markCurrStep('curr');
            }
        });

        // click events for the all info bits
        this.en.bits.forEach(bit => {
            if (bit.id().substr(0,1) === 'S'){
                bit.on('click touchstart', function(){
                    let msg = model.en.addToEqu(bit);
                    if (msg !== true){
                        //error
                        this.hover.show('e',msg);
                    }
                });
            }
        });

        // click event to control bits' arrow
        this.en.bits.forEach(bit => {
            if (bit.id().substr(0,1) === 'C'){
                bit.arrow.on('click touchstart', function(){
                    if(bit.id() === model.en.currCbit){
                        let msg = model.en.writeCbitRes('man');
                        if (msg !== true){
                            //error
                            model.stat.error.add(msg);
                            this.hover.show('e',msg);
                        }
                        else if(msg === true){
                            model.algorithm.increment(); // enable next step
                            //model.algorithm.increment(); // enable next step
                            if(model.en.isLastCbit()) {
                                model.algorithm.increment();
                                model.stat.timer.stop();
                            } // enable next step}
                        }
                    }
                });
            }
        });
        // dragmove event for encoder
        this.en.on('dragmove', function(e){
            if(typeof componentsPos.en !== 'undefined'){
                componentsPos.en = this.position();
            }
            else console.log('componentsPos.en is undefined');
        });

        // centring the info register
        this.ir.x(this.en.x()+this.en.width()/2 - this.ir.x()-this.ir.width()/2);

        // setting the algorithm's schema position
        this.algorithm.schema.setPos({ x: this.en.x() + this.en.width() + 40, y: this.ir.y()});
        // if(this.algorithm.schema.height() < this.en.y()+this.en.height())
        //     this.algorithm.schema.sizeTo({y:this.en.y()+this.en.height()});

        // setting the model size
        this.width = this.algorithm.schema.x() + this.algorithm.schema.width();
        this.height = this.algorithm.schema.y() + this.algorithm.schema.height();

        // adding the all component in the KONVA layer
        layer.add(this.ir, this.en);

        // dragmove event for info register
        this.ir.on('dragmove', function(e){
           if(typeof componentsPos.ir !== 'undefined'){
               componentsPos.ir = this.position();
           }
           else console.log('componentsPos.ir is undefined');
        });

        return layer;
    } // end of applyEncoder


    // run current step
    runCurrStep(){
        if(this.process === 'dec'){
            //for Decoder
            switch (this.algorithm.getCurrStep().name){
                // Set the Information Register
                case 'setBits':
                    let check;
                    this.cr.bits.forEach(bit => {
                        if (bit.txt.text() === '') return check = 'empty';
                    });
                    if (check === 'empty'){
                        this.cr.randGen();
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    else {
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;

                // Mark the encoder's bits
                case 'markBits':
                    this.dec.placeLabels();
                    if(model.dec.checkLabels() === true){
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;

                // load decoder
                case 'load':
                    if(this.dec.loadBits(model.cr.vals, model.cr.bits) === true){
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;

                // select next control bit
                case 'selectCbit':
                    if(this.dec.selectCbit('',this.algorithm) === true){
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;
                // create equation
                case 'createEqu':
                    if(this.dec.showCurrCbitEqu() === true){
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;
                // Calculate control bit
                case 'calcEqu':
                    if(this.dec.showCurrCbitRes() === true){
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;
                // Write control bit
                case 'writeCbit':
                    console.log(model.algorithm.getCurrStep().description);
                    if(this.dec.writeCbitRes('auto') === true){
                        //this.algorithm.increment(); // enable next step
                    }
                    break;
                case 'analysis':
                    this.dec.error.makeAnalysis();
                    console.log(model.algorithm.getCurrStep().description);
                    this.algorithm.increment(); // enable next step
                    break;
                // finish simulation
                default:
                  model.finish();
            }
        }

        //for Encoder
        else{
            if(typeof this.ir.bits === 'undefined') return alert(lang.noModel);
            switch (this.algorithm.getCurrStep().name){
                // Set the Information Register
                case 'setBits':
                    let check;
                    this.ir.bits.forEach(bit => {
                        if (bit.txt.text() === '') return check = 'empty';
                    });
                    if (check === 'empty'){
                        this.ir.randGen();
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    else {
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;

                // Mark the encoder's bits
                case 'msrkBits':
                    this.en.placeLabels();
                    if(model.en.checkLabels() === true){
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;

                // load Encoder
                case 'load':
                    if(this.en.loadBits(model.ir.vals, model.ir.bits) === true){
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;

                // select next control bit
                case 'selectCbit':
                    if(this.en.selectCbit() === true){
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;

                // create equation
                case 'createEqu':
                    if(this.en.showCurrCbitEqu() === true){
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;
                // Calculate control bit
                case 'calcCbit':
                    if(this.en.showCurrCbitRes() === true){
                        console.log(model.algorithm.getCurrStep().description);
                        this.algorithm.increment(); // enable next step
                    }
                    break;

                // Write control bit
                case 'writeCbit':
                    if(this.en.writeCbitRes('auto') === true){
                        console.log(model.algorithm.getCurrStep().description);
                        //algorithm is incremented in the writeCbitRes method
                    }
                    break;
                // finish simulation
                default:
                    model.finish();
            }
        }

        // check for finish step
        if(this.algorithm.getCurrStep().name === 'finish') this.stat.timer.stop();

    } // end runCurrStep()

    // autorun
    autoRun(speed){
        if (model.autoRunTimerId !== -1){ // stop timer if it is running at the moment
            clearInterval(model.autoRunTimerId);
            model.autoRunTimerId = -1;
            document.getElementById('autoRunBtn').innerHTML='Continue Autorun';
            return;
        }
        document.getElementById('autoRunBtn').innerHTML='Pause Autorun';
        speed = speed || 500;
        model.autoRunTimerId =  setInterval(function(){
            model.runCurrStep();
            if (model.algorithm.getCurrStep().name === 'finish'){
                clearInterval(model.autoRunTimerId);
                model.autoRunTimerId = -1;
                //model.finish();
                document.getElementById('autoRunBtn').innerHTML='Autorun';
            }
        }, speed);
    }

    // finishing simulation
    finish(){
        //model.stat.timer.stop();
        //alert(model.algorithm.getCurrStep().description);
        console.log(model.algorithm.getCurrStep().description+' '+model.algorithm.getCurrStep().help);
        document.getElementById('nextBtn').disabled=true;
        document.getElementById('autoRunBtn').disabled=true;
    }

    // Reset the Model method
    reset(){
        if(model.autoRunTimerId !== -1){
            clearInterval(model.autoRunTimerId) // stop autorun timer if it is started
            document.getElementById('autoRunBtn').innerHTML='Autorun';
        }
        document.getElementById('checkBtn').disabled=false;
        document.getElementById('infoBitNum').disabled=false;
        document.getElementById('parityBitNum').disabled=false;
        document.getElementById('cwBitNum').disabled=false;
        document.getElementById('errDetectNum').disabled=false;
        document.getElementById('nextBtn').disabled=true;
        document.getElementById('resetBtn').disabled=true;
        document.getElementById('autoRunBtn').disabled=true;
        document.getElementsByName("lang")[0].disabled = false;
        document.getElementsByName("lang")[1].disabled = false;
        document.getElementsByName("process")[0].disabled = false;
        document.getElementsByName("process")[1].disabled = false;

        //this.en.vals.fill(0);
        this.algorithm.reset();
        this.stat.reset();
        this.layer.destroy();
        stage.clear();
    } // end the reset
}

// for decoder
decoderSteps = function(lang, cycleCount){
    let steps=[];
    let step;
    step = {name:'setParam',
        description: lang.setParam,
        help:lang.setParamHelp,
        sub:[]
    };
    steps.push(step);
    step = {name:'setBits',
        description: lang.setBitsCW,
        help:lang.setCwBitsHelp,
        sub:[]
    };
    steps.push(step);
    step = {name:'markBits',
        description: lang.markBitsDEC,
        help:lang.markBitsENHelp,
        sub:[]
    };
    steps.push(step);
    step = {name: 'load',
        description: lang.loadDEC,
        help: lang.loadBitsHelp,
        sub: []
    };
    steps.push(step);
    step = {name: 'checkCbits',
        description: lang.calcParity,
        help: 'Executed for each control bits',
        cycleCount: cycleCount,
        sub:[
            {name: 'selectCbit', description: lang.selectCbit,  help: lang.selectCbitHelp},
            {name: 'createEqu',  description: lang.createEqu,  help: lang.createEquHelp},
            {name: 'calcEqu',    description: lang.calcEqu, help: lang.calcCbitHelp},
            {name: 'writeCbit',  description: lang.writeCbit, help: lang.writeCbitCheckHelp}
        ]
    };
    steps.push(step);
    step = {name: 'analysis',
        description: lang.resAnalysis,
        help: lang.errAnalysisHelp,
        sub: []
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

// Create steps
encoderSteps = function(lang, cycleCount){
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
    step = {name:'msrkBits',
        description: lang.markBitsEN,
        help:lang.markBitsENHelp,
        sub:[]
    };
    steps.push(step);
    step = {name: 'load',
        description: lang.loadEN,
        help: lang.loadBitsHelp,
        sub: []
    };
    steps.push(step);
    step = {name: 'calcCbits',
        description: lang.calcParity,
        help: 'Executed for each control bits',
        cycleCount: cycleCount,
        sub:[
            {name: 'selectCbit', description: lang.selectCbit,  help: lang.selectCbitHelp},
            {name: 'createEqu',  description: lang.createEqu,  help: lang.createEquHelp},
            {name: 'calcCbit',   description: lang.calcCbit, help: lang.calcCbitHelp},
            {name: 'writeCbit',  description: lang.writeCbit, help: lang.writeCbitHelp}
        ]
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