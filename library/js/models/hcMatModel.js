class hcMatModel {
    constructor(user) {
        this.lang = new LangPack($('input[name="lang"]:checked').val()); // default language is english;
        this.layer = null;
        this.en = {};
        this.ir = {};
        this.cr = {};
        this.m;
        this.k;
        this.n;
        this.t;
        this.algorithm = {};
        this.stat = new STATISTICS(this.lang.stat);
        this.debug = true;
        this.width = 0;
        this.height = 0;
        this.autoRunTimerId = -1;
        this.user = user;
    }

    //cheking the code parameters
    checkParam(param) {
        this.m = param.m;
        this.k = param.k;
        this.n = param.n;
        this.t = param.t;
        this.process = param.process; // default process is encoding

        // this.lang =  new LangPack(param.lang); // default language is english
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
            return lang.wrongK;
        }

        // codeword bit number check
        if (this.n !== (this.m + this.k)){
            return lang.wrongN;
        }
        if (this.debug) console.log('OK');
        return true;
    }

    // initializing the model///////////////////////////////////////////////////////////////
    init() {
        // create arr for all layers
        let layers =[];
        let lang = this.lang.gn;

        //this.stat.userName ='';

        // encoder
        if(this.process === 'enc'){
            // creating the ALGORITHM PANEL
            this.algorithm = new ALGORITHM(this.encoderSteps(this.lang.alg, this.k),this.m, this.k, this.user);
            // setting the algorithm's schema to some position
            this.algorithm.panel.setPos({ x:1000 , y: 50});
            layers.push(this.algorithm.layer);
            this.layer = this.applyEncoder();
        }
        // decoder
        else if(this.process === 'dec'){
            // creating the ALGORITHM PANEL
            this.algorithm = new ALGORITHM(this.decoderSteps(this.lang.alg, this.k), this.m, this.k, this.user);
            // setting the algorithm's schema to some position
            this.algorithm.panel.setPos({ x:1000 , y: 50});
            layers.push(this.algorithm.layer);
            this.layer = this.applyDecoder();
        }
        this.layer.draw();

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

        if(componentsPos.alg !== '') this.algorithm.panel.position(componentsPos.alg);
        if(this.process === 'enc'){
            if(componentsPos.ir !== '') this.ir.position(componentsPos.ir);
            if(componentsPos.en !== '') this.en.position(componentsPos.en);
        }
        else{
            if(componentsPos.cr !== '') this.cr.position(componentsPos.cr);
            if(componentsPos.dec !== '') this.dec.position(componentsPos.dec);
        }

        this.simFinish=function(){
            let html='';
            if(this.process==='enc'){ // encoding
                html='<p><b>'+lang.modeEnc+'</b><\p>';
                html +='<p><b>'+lang.codeParam+':</b> m = '+this.m+', l<sub>0</sub> = '+this.t+', k = '+this.k+', n = '+this.n+'<\p>';
                let valStr='';
                for(let i=0; i<model.ir.vals.length; i++) valStr += model.ir.vals[i].toString();
                html+='<p><b>'+lang.infoBits+':</b> X = '+valStr+'<\p>';
                valStr='';
                for(let i=0; i<model.en.vals.length; i++) valStr += model.en.vals[i].toString();
                html+='<p><b>'+lang.cwBits+':</b> [X] = '+valStr+'<\p>';
            }
            else{ // decoding
                html='<p><b>'+lang.modeDec+'</b><\p>';
                html +='<p><b>'+lang.codeParam+':</b> m = '+this.m+', l<sub>0</sub> = '+this.t+', k = '+this.k+', n = '+this.n+'<\p>';
                let valStr='';
                for(let i=0; i<model.cr.vals.length; i++) valStr += model.cr.vals[i].toString();
                html+='<p><b>'+lang.cwBits+':</b> [X] = '+valStr+'<\p>';
                if(this.dec.err.status.val === '0') valStr = lang.noErr;
                else if(this.dec.err.status.val === '2') valStr = lang.doubleErr;
                else valStr = lang.singleErr + ' ('+this.dec.err.pos.val+')';

                html+='<p><b>'+lang.errStatus+':</b> '+valStr+'<\p>';
                if(this.dec.err.status.val !== '2')
                    html+='<p><b>'+lang.decodedMsg+':</b> X = '+this.dec.err.decMessage.val+'<\p>';
            }
            html+='<p><b>'+lang.solveTime+': </b>'+this.stat.timer.val.text()+'<\p>'
            html+='<p><b>'+this.stat.error.label.text()+'</b>'+this.stat.error.val.text()+'<\p>'

            // create simulation finish dialog
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
        {
            let modelWidth, modelHeight;
            if(this.process==='enc'){
                modelWidth = this.en.width() + this.algorithm.panel.width() + 80;
                modelHeight = this.en.y() + this.en.height();
            }
            else {
                modelWidth = this.dec.width() + this.algorithm.panel.width() + 80;
                modelHeight = this.dec.y() + this.dec.height();
            }
            // correcting model height accordint to the elements height
            stage.height(modelHeight+20);
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
        //creating the Info register
        this.ir = new REGISTER1({
                process: this.process,
                id: 'ir',
                position: {x:20, y:20},
                name: lang.irLabel,
                bitsNum: this.m,
                randHover: lang.randHover,
                randBtnLabel: lang.randBitsLabel,
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
                    model.stat.error.add(check+' ('+model.algorithm.getCurrStep().description+')');
                    return;
                }
            });
        });

        // IR random button click event
        this.ir.rand.on('click touchstart', function(){
            let check = model.algorithm.validStep('setBits');
            if (check === true) {
                model.ir.randGen();
                model.algorithm.markCurrStep('curr');
                let valStr='';
                for(let i=0; i<model.ir.vals.length; i++) valStr += model.ir.vals[i].toString();
                console.log(valStr);
            }
            else {
                this.hover.show('e', check);
                model.stat.error.add(check+' ('+model.algorithm.getCurrStep().description+')');
                return;
            }
        });

        // creating the encoder
        this.en = new HAMMING_MA({
                process: this.process,
                id: 'en',
                position: {x: this.ir.x(), y: this.ir.y()+this.ir.height()+10},
                name: lang.hammEncMatLabel,
                pos:{x:20, y:200},
                bitsNum: this.n,
                errDet: this.t,
                checkBits: this.k,
                lang:lang,
                draggable: false
            }, model.algorithm, model.stat, this.ir
        );
        this.stat.modelName = 'Hamming Encoder - MA';

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
        this.algorithm.panel.setPos({ x: this.en.x() + this.en.width() + 40, y: this.ir.y()});

        // setting the model size
        this.width = this.algorithm.panel.x() + this.algorithm.panel.width();
        this.height = this.algorithm.panel.y() + this.algorithm.panel.height();

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



    // DECODER PROCESS //////////////////////////////////////////////////////////////
    applyDecoder(){
        // creating the LAYER
        let layer = new Konva.Layer();
        // get the selected language
        let lang = this.lang.gn;

        //CREATING CODEWORD REGISTER
        this.cr = new REGISTER1({
                process: this.process,
                id: 'cr',
                position: {x:20, y:20},
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
                model.algorithm.markCurrStep('curr');
                model.cr.randCWErr();
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
                model.algorithm.markCurrStep('curr');
                model.cr.randCWNoErr();
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
        // function for random codeword generating without error
        this.cr.randCWNoErr = function(){
            let randBits=[];
            for(let i=0; i<model.m; i++){
                randBits.push((Math.random() > 0.5) ? 1 : 0);
            }
            this.load(hcMatEncoder({infoBits: randBits, l:model.t}));
        };

        // dragmove event for codeword register
        this.cr.on('dragmove', function(e){
            if(typeof componentsPos.cr !== 'undefined'){
                componentsPos.cr = this.position();
            }
            else console.log('componentsPos.cr is undefined');
        });

        // function for random codeword generating with error
        this.cr.randCWErr = function(){
            let randBits=[];
            for(let i=0; i<model.m; i++){
                randBits.push((Math.random() > 0.5) ? 1 : 0);
            }
            let cw = hcMatEncoder({infoBits: randBits, l:model.t});
            //let errCount = Math.floor(Math.random() * 3);
            let max = model.t +1;
            let errCount = Math.floor(Math.random() * (max - 1) + 1);
            //console.log('errCount = '+errCount);
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
                //console.log('errPos1 = '+errPos1,'errPos2 = '+errPos2);
            }
            if(errCount === 0) console.log('No error');
            model.cr.load(cw);
        };

        // CREATING DECODER
        this.dec = new HAMMING_MA({
                process: this.process,
                id: 'dec',
                position: {x: this.cr.x(), y: this.cr.y()+this.cr.height()+10},
                name: lang.hammDecMatLabel,
                pos:{x:20, y:200},
                bitsNum: this.n,
                errDet: this.t,
                checkBits: this.k,
                lang:lang,
                draggable: false
            }, model.algorithm, model.stat, this.cr
        );
        this.stat.modelName = 'Hamming Decoder - MA';

        // dragmove event for decoder
        this.dec.on('dragmove', function(e){
            if(typeof componentsPos.dec !== 'undefined'){
                componentsPos.dec = this.position();
            }
            else console.log('componentsPos.dec is undefined');
        });

        // centring the CW register
        this.cr.x(this.dec.x()+this.dec.width()/2 - this.cr.x()-this.cr.width()/2);

        // setting the algorithm's schema position
        this.algorithm.panel.setPos({ x: this.dec.x() + this.dec.width() + 40, y: this.cr.y()});

        // setting the model size
        this.width = this.algorithm.panel.x() + this.algorithm.panel.width();
        this.height = this.algorithm.panel.y() + this.algorithm.panel.height();

        // adding the all component in the KONVA layer
        layer.add(this.cr, this.dec);

        // dragmove event for info register
        this.cr.on('dragmove', function(e){
            if(typeof componentsPos.cr !== 'undefined'){
                componentsPos.cr = this.position();
            }
            else console.log('componentsPos.cr is undefined');
        });

        return layer;

    }// end of applyDecoder

    // run current step
    runCurrStep(){
        if(this.process === 'dec'){
            //for Decoder
            switch (this.algorithm.getCurrStep().name){
                // Set the Information Register
                case 'setBits':
                    if(arrSum(this.cr.vals) === 0) {
                        this.cr.randCWErr(); // if all info bit are zeros run random bits generator
                    }
                    console.log(model.algorithm.getCurrStep().description);
                    this.algorithm.increment(); // enable next step
                    break;

                // Set the H matrix Size
                case 'setHmatSize':
                    console.log(model.algorithm.getCurrStep().description);
                    this.dec.HmatSize.show();
                    //step incremented in HmatSize.show()
                    break;

                // Set the H matrix
                case 'setHmat':
                    console.log(model.algorithm.getCurrStep().description);
                    this.dec.Hmat.show();
                    //step incremented in Hmat.show()
                    break;

                // Set the H' matrix
                case 'setH_mat':
                    console.log(model.algorithm.getCurrStep().description);
                    model.dec.showH_columns();
                    this.dec.H_mat.show();
                    this.dec.H_mat.enable(false);
                    //step incremented in H_mat.show()
                    break;

                // load Encoder
                case 'load':
                    console.log(model.algorithm.getCurrStep().description);
                    this.dec.loadCW(model.cr);
                    //step incremented in load()
                    break;

                // select next control bit
                case 'selectCbit':
                    console.log(model.algorithm.getCurrStep().description);
                    this.dec.selectCbit();
                    //step incremented in selectCbit()
                    break;

                // create equation
                case 'createEqu':
                    console.log(model.algorithm.getCurrStep().description);
                    this.dec.equ.showFormula();
                    //step incremented in showFormula()
                    break;
                // Calculate control bit
                case 'checkCbit':
                    console.log(model.algorithm.getCurrStep().description);
                    this.dec.equ.showBins();
                    //step incremented in showBins()
                    break;

                // Write control bit
                case 'writeCbit':
                    console.log(model.algorithm.getCurrStep().description);
                    this.dec.writeCbit();
                    //step incremented in writeCbit()
                    break;

                // result analysis
                case 'analysis':
                    console.log(model.algorithm.getCurrStep().description);
                    this.dec.err.showAnalysis();
                    //step incremented in showAnalysis()
                    break;
                // finish simulation
                default:
                    model.finish();
            }
        }

        //for Encoder
        else{
            switch (this.algorithm.getCurrStep().name){
                // Set the Information Register
                case 'setBits':
                    if(arrSum(this.ir.vals) === 0) {
                        this.ir.randGen(); // if all info bit are zeros run random bits generator
                    }
                    console.log(model.algorithm.getCurrStep().description);
                    this.algorithm.increment(); // enable next step
                    break;

                // Set the H matrix Size
                case 'setHmatSize':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.HmatSize.show();
                    //step incremented in HmatSize.show()
                    break;

                // Set the H matrix
                case 'setHmat':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.Hmat.show();
                    //step incremented in Hmat.show()
                    break;

                // Set the H' matrix
                case 'setH_mat':
                    console.log(model.algorithm.getCurrStep().description);
                    model.en.showH_columns();
                    this.en.H_mat.show();
                    this.en.H_mat.enable(false);
                    //step incremented in H_mat.show()
                    break;

                // load Encoder
                case 'load':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.loadInfo(model.ir);
                    //step incremented in load()
                    break;

                // select next control bit
                case 'selectCbit':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.selectCbit();
                    //step incremented in selectCbit()
                    break;

                // create equation
                case 'createEqu':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.equ.showFormula();
                    //step incremented in showFormula()
                    break;
                // Calculate control bit
                case 'calcCbit':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.equ.showBins();
                    //step incremented in showBins()
                    break;

                // Write control bit
                case 'writeCbit':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.writeCbit();
                    //step incremented in writeCbit()
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
        console.log(model.algorithm.getCurrStep().description+' '+model.algorithm.getCurrStep().help);
    }

    // Reset the Model method
    reset(){
        if(model.autoRunTimerId !== -1){
            clearInterval(model.autoRunTimerId) // stop autorun timer if it is started
        }
        document.getElementById('infoBitNum').disabled=false;
        document.getElementById('parityBitNum').disabled=false;
        document.getElementById('cwBitNum').disabled=false;
        document.getElementById('errDetectNum').disabled=false;
        document.getElementsByName("lang")[0].disabled = false;
        document.getElementsByName("lang")[1].disabled = false;
        document.getElementsByName("process")[0].disabled = false;
        document.getElementsByName("process")[1].disabled = false;

        this.algorithm.reset();
        this.stat.reset();
        this.stat.remove();
        this.layer.destroy();
        stage.clear();
        try{
            $(".ui-dialog-content").dialog("close");
        }   catch(e) {}


    } // end the reset


    // for decoder
    decoderSteps(lang, cycleCount){
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

        step = {name:'setHmatSize',
            description: lang.setHmatSize,
            help:lang.setHmatSizeHelp,
            sub:[]
        };
        steps.push(step);

        step = {name:'setHmat',
            description: lang.setHmat,
            help:lang.setHmatHelp,
            sub:[]
        };
        steps.push(step);

        step = {name:'setH_mat',
            description: lang.setH_mat,
            help:lang.setH_matHelp,
            sub:[]
        };
        steps.push(step);

        step = {name: 'load',
            description: lang.loadEN,
            help: lang.loadInfoBitsHelp,
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
                {name: 'checkCbit',   description: lang.checkCbit, help: lang.checkCbitHelp},
                {name: 'writeCbit',  description: lang.writeCbit, help: lang.writeCbitHelp}
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
    encoderSteps(lang, cycleCount){
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

        step = {name:'setHmatSize',
            description: lang.setHmatSize,
            help:lang.setHmatSizeHelp,
            sub:[]
        };
        steps.push(step);

        step = {name:'setHmat',
            description: lang.setHmat,
            help:lang.setHmatHelp,
            sub:[]
        };
        steps.push(step);

        step = {name:'setH_mat',
            description: lang.setH_mat,
            help:lang.setH_matHelp,
            sub:[]
        };
        steps.push(step);

        step = {name: 'load',
            description: lang.loadEN,
            help: lang.loadInfoBitsHelp,
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
}

// // for decoder
// decoderSteps = function(lang, cycleCount){
//     let steps=[];
//     let step;
//     step = {name:'setParam',
//         description: lang.setParam,
//         help:lang.setParamHelp,
//         sub:[]
//     };
//     steps.push(step);
//
//     step = {name:'setBits',
//         description: lang.setBits,
//         help:lang.setIrBitsHelp,
//         sub:[]
//     };
//     steps.push(step);
//
//     step = {name:'setHmat',
//         description: lang.setHmat,
//         help:lang.setHmatHelp,
//         sub:[]
//     };
//     steps.push(step);
//
//     step = {name:'setH_mat',
//         description: lang.setH_mat,
//         help:lang.setH_matHelp,
//         sub:[]
//     };
//     steps.push(step);
//
//     step = {name: 'load',
//         description: lang.loadEN,
//         help: lang.loadInfoBitsHelp,
//         sub: []
//     };
//     steps.push(step);
//
//     step = {name: 'calcCbits',
//         description: lang.calcParity,
//         help: 'Executed for each control bits',
//         cycleCount: cycleCount,
//         sub:[
//             {name: 'selectCbit', description: lang.selectCbit,  help: lang.selectCbitHelp},
//             {name: 'createEqu',  description: lang.createEqu,  help: lang.createEquHelp},
//             {name: 'calcCbit',   description: lang.calcCbit, help: lang.calcCbitHelp},
//             {name: 'writeCbit',  description: lang.writeCbit, help: lang.writeCbitHelp}
//         ]
//     };
//     steps.push(step);
//
//     step = {name: 'analysis',
//         description: lang.resAnalysis,
//         help: lang.errAnalysisHelp,
//         sub: []
//     };
//     steps.push(step);
//
//     step = {name: 'finish',
//         description: lang.finish,
//         help: lang.finishMsg,
//         sub:[]
//     };
//     steps.push(step);
//     return steps;
// };
//
// // Create steps
// encoderSteps = function(lang, cycleCount){
//     let steps=[];
//     let step;
//     step = {name:'setParam',
//         description: lang.setParam,
//         help:lang.setParamHelp,
//         sub:[]
//     };
//     steps.push(step);
//
//     step = {name:'setBits',
//         description: lang.setBits,
//         help:lang.setIrBitsHelp,
//         sub:[]
//     };
//     steps.push(step);
//
//     step = {name:'setHmat',
//         description: lang.setHmat,
//         help:lang.setHmatHelp,
//         sub:[]
//     };
//     steps.push(step);
//
//     step = {name:'setH_mat',
//         description: lang.setH_mat,
//         help:lang.setH_matHelp,
//         sub:[]
//     };
//     steps.push(step);
//
//     step = {name: 'load',
//         description: lang.loadEN,
//         help: lang.loadInfoBitsHelp,
//         sub: []
//     };
//     steps.push(step);
//
//     step = {name: 'calcCbits',
//         description: lang.calcParity,
//         help: 'Executed for each control bits',
//         cycleCount: cycleCount,
//         sub:[
//             {name: 'selectCbit', description: lang.selectCbit,  help: lang.selectCbitHelp},
//             {name: 'createEqu',  description: lang.createEqu,  help: lang.createEquHelp},
//             {name: 'calcCbit',   description: lang.calcCbit, help: lang.calcCbitHelp},
//             {name: 'writeCbit',  description: lang.writeCbit, help: lang.writeCbitHelp}
//         ]
//     };
//     steps.push(step);
//
//     step = {name: 'finish',
//         description: lang.finish,
//         help: lang.finishMsg,
//         sub:[]
//     };
//     steps.push(step);
//     return steps;
// };