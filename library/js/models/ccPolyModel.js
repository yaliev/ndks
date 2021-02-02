class ccPolyModel {
    constructor(user) {
        this.lang = new LangPack($('input[name="lang"]:checked').val()); // default language is english;
        this.layer = null;
        this.en = {};
        this.ir = {};
        this.m;
        this.k;
        this.n;
        this.t;
        this.genPoly;
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
                    break;
                case 4:
                    if(this.genPoly.val !== '4.1' && this.genPoly.val !== '4.2') return lang.wrongGenPoly;
                    break;
                case 5:
                    if(this.genPoly.val !== '5.1' && this.genPoly.val !== '5.2') return lang.wrongGenPoly;
                    break;
            }
        else if (this.t === 3)
            switch (this.k){
                case 4:
                    if(this.genPoly.val !== '3.3' && this.genPoly.val !== '3.4') return lang.wrongGenPoly;
                    break;
                case 5:
                    if(this.genPoly.val !== '4.3' && this.genPoly.val !== '4.4') return lang.wrongGenPoly;
                    break;
                case 6:
                    if(this.genPoly.val !== '5.3' && this.genPoly.val !== '5.4') return lang.wrongGenPoly;
                    break;
            }

        if (this.debug) console.log('OK');
        return true;
    }

    // initializing the model///////////////////////////////////////////////////////////////
    init() {
        // create arr for all layers
        let layers =[];
        let lang = this.lang.gn;

        // encoder
        // creating the ALGORITHM PANEL
        this.algorithm = new ALGORITHM(this.encoderSteps(this.lang.alg, 1),this.m, this.k, this.user);
        // setting the algorithm's schema to some position
        this.algorithm.panel.setPos({ x:1000 , y: 50});
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

      if(componentsPos.alg !== '') this.algorithm.panel.position(componentsPos.alg);
        if(componentsPos.ir !== '') this.ir.position(componentsPos.ir);
        if(componentsPos.en !== '') this.en.position(componentsPos.en);

        this.simFinish=function(){
            let html='';
            html='<p><b>'+lang.modeEnc+'</b><\p>';
            html +='<p><b>'+lang.codeParam+':</b> m = '+this.m+', l<sub>0</sub> = '+this.t+', k = '+this.k+', n = '+this.n+'<\p>';
            html +='<p><b>'+lang.genPoly+': </b>P(x) = '+ $('#selGenPolyBtn').html() +'<\p>';
            let valStr='';
            valStr = model.ir.vals.toString().replace(/,/g,'');
            html+='<p><b>'+lang.infoBits+':</b> X = '+valStr+'<\p>';
            html+='<p><b>'+lang.cwBits+': </b>[X] = '+model.en.cwBin.val+'<\p>';
            this.stat.timer.stop(); // stop the timer
            html+='<p><b>'+lang.solveTime+': </b>'+this.stat.timer.val.text()+'<\p>'
            html+='<p><b>'+this.stat.error.label.text()+'</b>'+this.stat.error.val.text()+'<\p>'

            // create simulation finish message
            let finishDialog=$("<div id='finishDialog' title='' class='dialog'></div>").appendTo($(".modelDiv"));
            finishDialog.dialog({
                autoOpen : false, modal : false, show : "blind", hide : "blind",
                minHeight:100, minWidth:400,  height: 'auto', width: 'auto',
                open: function (event, ui) {
                    $( this ).parent().find(".ui-dialog-titlebar-close" ).remove();
                },
                // close: function() {
                //     $("#finishDialog").css({'color':'black'});
                // }
            });
            finishDialog.dialog('option','title', lang.finishMsg);
            finishDialog.html(html);
            $('#finishDialog p').css({'margin':'1px'});
            //$(".ui-dialog-titlebar-close").hide();
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
                bit: {name: 'IR Bit', labelTxt: '', numReverse: 'true', firstNum: 0, hoverTxt: lang.regBitHover, enabled: true},
            }, layer
        );

        // IR 'Bit' click event
        this.ir.bits.forEach(bit =>{
            bit.on('click touchstart', function(){
                let check = model.algorithm.validStep('setBits');
                if (check === true) {
                    bit.setBit();
                    if(model.ir.areAllBitsSetted()) model.algorithm.markCurrStep('past');
                    else model.algorithm.markCurrStep('curr');
                }
                else {
                    bit.hover.show('e', check);
                    //model.stat.error.add(check+' ('+model.algorithm.getCurrStep().description+')');
                    //return;
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
                //return;
            }
        });
        //model.ir.load([1,0,1,0,1,0,1,1,0,1]); // for test

        // creating the encoder
        this.en = new CYCLIC_POLY({
                process: this.process,
                id: 'en',
                position: {x: this.ir.x(), y: this.ir.y()+this.ir.height()+10},
                name: lang.ccEncLabel,
                pos:{x:20, y:200},
                bitsNum: this.n,
                errDet: this.t,
                checkBits: this.k,
                genPoly: this.genPoly,
                lang:lang,
                draggable: false
            }, model.algorithm, model.stat, this.ir
        );
        this.stat.modelName = 'Cyclic code - polinomial';

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

    // run current step
    runCurrStep(){
        if(this.process === 'enc'){
            switch (this.algorithm.getCurrStep().name){
                // Set the Information Register
                case 'setBits':
                    if(arrSum(this.ir.vals) === 0) {
                        this.ir.randGen(); // if all info bit are zeros run random bits generator
                    }
                    console.log(model.algorithm.getCurrStep().description);
                    this.algorithm.increment(); // enable next step
                    break;

                // show the information polynomial
                case 'infoPoly':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.infoPoly.show();
                    break;

                // show the codeword formula
                case 'cwFormula':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.cwFormula.show();
                    break;

                // show the multipliplication result of x^k.G(x)
                case 'xk_InfoPoly':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.xk_InfoPoly.show();
                    break;

                // show the current mul
                case 'writeMul':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.div.show('mul');
                    break;

                // show the current res
                case 'writeRes':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.div.show('res');
                    break;

                // show the current rem
                case 'writeRem':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.div.show('rem');
                    break;

                // show the codeword polynomial
                case 'cwPoly':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.cwPoly.show();
                    break;

                // show the binary remainder
                case 'remBin':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.remBin.show();
                    break;

                // show the binay codeword
                case 'cwBin':
                    console.log(model.algorithm.getCurrStep().description);
                    this.en.cwBin.show();
                    break;

                // finish simulation
                default:
                    model.finish();
            }
        }

        else if(this.process === 'dec'){
            //for Decoder
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
        model.autoRunTimerId =  setInterval(function(){
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

        step = {name:'infoPoly',
            description: lang.infoPoly,
            help:lang.infoPolyHelp,
            sub:[]
        };
        steps.push(step);

        step = {name:'cwFormula',
            description: lang.cwFormula,
            help:lang.cwFormulaHelp,
            sub:[]
        };
        steps.push(step);

        step = {name:'xk_InfoPoly',
            description: lang.xk_InfoPoly,
            help:lang.xk_InfoPolyHelp,
            sub:[]
        };
        steps.push(step);


        step = {name: 'polyDivision',
            description: lang.polyDivision,
            help: '',
            cycleCount: cycleCount,
            sub:[
                {name: 'writeMul', description: lang.writeMul,  help: lang.writeMulHelp},
                {name: 'writeRes',  description: lang.writeRes,  help: lang.writeResHelp},
                {name: 'writeRem',   description: lang.writeRem, help: lang.writeRemHelp}
            ],
            exitCond: lang.divExitCond
        };
        steps.push(step);

        step = {name:'cwPoly',
            description: lang.cwPoly,
            help:lang.cwPolyHelp,
            sub:[]
        };
        steps.push(step);

        step = {name:'remBin',
            description: lang.remBin,
            help:lang.remBinHelp,
            sub:[]
        };
        steps.push(step);

        step = {name:'cwBin',
            description: lang.cwBin,
            help:lang.cwBinHelp,
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
}