class ccPolyModel {
    constructor(props) {
        this.lang;
        this.process = 'enc';
        this.layer = null;
        this.en = {};
        this.ir = {};
        // this.cr = {};
        this.m;
        this.k;
        this.n;
        this.t;
        this.genPoly;
        this.algorithm = {};
        this.stat = {};
        this.debug = true;
        this.width = 0;
        this.height = 0;
        this.autoRunTimerId = -1;
    }

    //cheking the code parameters
    checkParam(param) {
        this.m = param.m;
        this.k = param.k;
        this.n = param.n;
        this.t = param.t;
        this.genPoly = {val: param.genPoly.val, txt: param.genPoly.txt};
        // this.process = param.process; // default process is encoding

        this.lang =  new LangPack(param.lang); // default language is english
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
        // creating the ALGORITHM PANEL
        this.algorithm = new ALGORITHM(this.encoderSteps(this.lang.alg, this.k),this.m, this.k, this.lang.alg);
        // setting the algorithm's schema to some position
        this.algorithm.schema.setPos({ x:1000 , y: 50});
        layers.push(this.algorithm.layer);
        this.layer = this.applyEncoder();
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
        if(componentsPos.ir !== '') this.ir.position(componentsPos.ir);
        if(componentsPos.en !== '') this.en.position(componentsPos.en);


        this.simFinish=function(){
            let end = this.algorithm.schema.items.find(e => e.id() === 'end');
            end.hoverTxt = lang.showEndMsg;
            end = hover1(end, end.getParent());
            end = over(end);
            end.on('click touchstart', function(){
                $("#msgDialog" ).dialog('open');
            });

            let str='';
            str='<p><b>'+lang.modeEnc+'</b><\p>';
            str +='<p><b>'+lang.codeParam+':</b> m = '+this.m+', l<sub>0</sub> = '+this.t+', k = '+this.k+', n = '+this.n+'<\p>';
            let valStr='';
            for(let i=0; i<model.ir.vals.length; i++) valStr += model.ir.vals[i].toString();
            str+='<p><b>'+lang.infoBits+':</b> X = '+valStr+'<\p>';
            valStr='';
            for(let i=0; i<model.en.vals.length; i++) valStr += model.en.vals[i].toString();
            str+='<p><b>'+lang.cwBits+':</b> [X] = '+valStr+'<\p>';

            $("#msgDialog").dialog('option','title', lang.finishMsg);
            $("#msgDialog").html(str);
            $("#msgDialog" ).dialog('open');
        };

        // change container width according to total component width

        this.width = this.en.width() + this.algorithm.schema.width() + 80;
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
        layers.push(this.stat.layer);
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
                position: {x:this.stat.x(), y:this.stat.y()+this.stat.height()+10},
                name: lang.irLabel,
                bitsNum: this.m,
                randHover: lang.randHover,
                randBtnLabel: lang.randInfoLabel,
                draggable: false,
                bit: {name: 'IR Bit', labelTxt: '', numReverse: 'true', firstNum: 0, hoverTxt: lang.regBitHover, enabled: true},
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
        model.ir.load([1,0,1,0,1,0,1,1,0,1]); // for test

        // console.log('this.genPoly = '+this.genPoly.txt);
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
        this.algorithm.schema.setPos({ x: this.en.x() + this.en.width() + 40, y: this.ir.y()});

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
        if(this.process === 'enc'){
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
            document.getElementById('autoRunBtn').innerHTML='Continue Autorun';
            return;
        }
        document.getElementById('autoRunBtn').innerHTML='Pause Autorun';
        speed = speed || 250;
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
        document.getElementsByName("process")[0].disabled = false;
        document.getElementsByName("process")[1].disabled = false;

        //this.en.vals.fill(0);
        this.algorithm.reset();
        this.stat.reset();
        this.layer.destroy();
        stage.clear();
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

        step = {name:'prepDiv',
            description: lang.prepDiv,
            help:lang.prepDivHelp,
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
            ]
        };
        steps.push(step);

        step = {name:'remPolyBin',
            description: lang.remPolyBin,
            help:lang.remPolyBinHelp,
            sub:[]
        };
        steps.push(step);

        step = {name:'cwPolyBin',
            description: lang.cwPolyBin,
            help:lang.cwPolyBinHelp,
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


    // for decoder
}