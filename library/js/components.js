//CYCLIC ENCODER - POLYNOMIAL ALGORITHM/////////////////////////////////////////////////////////////////////////////////////////
function CYCLIC_POLY(props, alg, stat, inReg) {
    // CONFIG DEFAULT PROPERTIES
    // GENERAL properties
    props.id = props.id || 'en';
    props.name = props.name || 'Cyclic Code Encoder - Polynomial Algorithm';
    props.position = props.position || {x: 0, y: 0};
    props.fill = props.fill || 'FloralWhite';
    props.labelSize = props.labelSize || 20;
    props.txtSize = props.txtSize || 16;
    props.labelDistance = props.labelDistance || 5;
    props.labelColor = props.labelColor || 'white';
    props.txtColor = props.txtColor || 'Navy';
    props.labelBgColor = props.labelBgColor || 'RoyalBlue';
    props.labelPadding = props.labelPadding || 4;
    props.pading = props.pading || 10;
    props.width = props.width || 800;
    props.height = props.height || 200;
    props.errDet = props.errDet || 1;
    props.checkBits = props.checkBits || 4;
    props.bitsNum = props.bitsNum || 11;
    props.draggable = props.draggable || false;
    props.process = props.process || 'enc';
    props.checkBits = props.checkBits || 4;

    let lang = props.lang;
    let mdl = new PANEL(props);
    mdl.size({width: props.width, height: props.height});
    mdl.dragmove(true);

    // Info Polynomial panel
    mdl.infoPoly = new PANEL({
        id: 'infoPolyPanel',
        name: lang.infoBitPoly,
        position: { x: 10, y:50},
        type: 2,
        labelSize: 18
    });
    mdl.add(mdl.infoPoly);
    mdl.infoPoly.size({height: 40, width: 460});
    mdl.infoPoly.text = custText('G(x)=?+?+?+?+?+?');
    mdl.infoPoly.text.position({x: 10, y: 15});
    mdl.infoPoly.add(mdl.infoPoly.text);
    mdl.infoPoly.text.fill('red'); // init color
    mdl.infoPoly.text = over(mdl.infoPoly.text);
    mdl.infoPoly.text.hoverTxt = lang.dblclick;
    mdl.infoPoly.text = hover1(mdl.infoPoly.text, mdl.infoPoly);
    //mdl.infoPoly.val = 'G(x)=x^9+x^7+x^5+x^3+x^2+x^0';
    mdl.infoPoly.val = '';
    mdl.infoPoly.text.on('dblclick tap', function() {
        //check for set bits
        if(inReg.vals.includes(undefined) === true)  {
            mdl.infoPoly.text.hover.show('e',lang.setAllBit);
            return;
        }
        if(alg.getCurrStep().name === 'setBits') alg.increment();
        alg.markCurrStep('curr');

        // set the information polynomial if it isn't done yet
        if(mdl.infoPoly.val === '') setInfoPoly();

        let thisObj =  mdl.infoPoly.text;
        thisObj.hover.hide();
        thisObj.text(strToPoly(thisObj.text(),'remove')); // remove all symbol "^"
        // let str =  thisObj.str;
        let oldStr = thisObj.str;
        editable(thisObj, function(obj){
            thisObj.text(strToPoly(thisObj.text()));
            let s = strToPoly(obj.text());
            if(s === '') return obj.text(oldStr);
            if(oldStr !== s){
                if(mdl.infoPoly.val === s){
                    alg.increment();
                    thisObj.fill(props.txtColor);
                    mdl.getLayer().batchDraw();
                    thisObj.hover.hide('r');
                    mdl.getStage().container().style.cursor = 'default';
                    thisObj.off();
                    mdl.infoPoly.autoCorrSize();
                    mdl.cwFormula.updatePos();
                    mdl.cwFormula.visible(true);
                    mdl.xk_InfoPoly.updatePos();
                    mdl.genPoly.updatePos();
                    inReg.disable();
                }
                else {
                    //error
                    thisObj.fill('red');
                    stat.error.add(lang.wrongInfoPoly);
                    return thisObj.hover.show('e', lang.wrongInfoPoly);
                }
            }

        }, mdl.infoPoly.width()-25);
    });

    // show the information polynomial
    mdl.infoPoly.show = function(){
        setInfoPoly(); // set the info polynomial value
        mdl.infoPoly.text.text(mdl.infoPoly.val);
        mdl.infoPoly.text.fill(props.txtColor);
        mdl.infoPoly.text.off();
        inReg.disable();
        mdl.infoPoly.autoCorrSize();
        mdl.cwFormula.updatePos();
        mdl.cwFormula.visible(true);
        mdl.xk_InfoPoly.updatePos();
        mdl.genPoly.updatePos();
        mdl.getLayer().batchDraw();
        alg.increment();
    };

    // set the information polynomial
    setInfoPoly = function(){
        let mems=[];
        inReg.bits.forEach(bit =>{
            if(bit.text() === '1') mems.push('x^'+bit.label.text());
        });
        mdl.infoPoly.val = strToPoly('G(x)='+mems.toString().replace(/,/g,'+'));
    };

    // Codeword formula panel
    mdl.cwFormula = new PANEL({
        id: 'cwFormula',
        name: lang.cwFormula,
        type: 2,
        labelSize: 18
    });
    mdl.cwFormula.visible(false);
    mdl.cwFormula.updatePos = function(){
        mdl.cwFormula.size({width:300, height: mdl.infoPoly.height()});
        mdl.cwFormula.position({ x: mdl.infoPoly.x()+mdl.infoPoly.width()+20, y:mdl.infoPoly.y()});
        mdl.autoCorrSize();
    };
    mdl.cwFormula.updatePos();
    mdl.add(mdl.cwFormula);
    //mdl.cwFormula.text = custText('F(x)=x^k.G(x)+R(x)');
    mdl.cwFormula.text = custText('F(x)=?+?+?+?+?+?');
    mdl.cwFormula.text.position({x: 10, y: 15});
    mdl.cwFormula.add(mdl.cwFormula.text);
    mdl.cwFormula.text.fill('red'); // init color
    mdl.cwFormula.text = over(mdl.cwFormula.text);
    mdl.cwFormula.text.hoverTxt = lang.dblclick;
    mdl.cwFormula.text = hover1(mdl.cwFormula.text, mdl.cwFormula);
    mdl.cwFormula.val = 'F(x)=x^k.G(x)+R(x)';
    mdl.cwFormula.text.on('dblclick tap', function() {
        alg.markCurrStep('curr');
        let thisObj =  mdl.cwFormula.text;
        thisObj.hover.hide();
        thisObj.text(strToPoly(thisObj.text(),'remove'));
        //// let str =  thisObj.str;
        let oldStr = thisObj.str;
        editable(thisObj, function(obj){
            obj.text(strToPoly(obj.text()));
            let s = obj.text();
            if(s === '') return obj.text(oldStr);
            if(oldStr !== s){
                if(mdl.cwFormula.val === s){
                    alg.increment();
                    thisObj.fill(props.txtColor);
                    mdl.getLayer().batchDraw();
                    thisObj.hover.hide('r');
                    mdl.getStage().container().style.cursor = 'default';
                    thisObj.off();
                    setXk_InfoPoly(); //set the x^k.G(X)
                    mdl.xk_InfoPoly.visible(true);
                }
                else {
                    //error
                    thisObj.fill('red');
                    stat.error.add(lang.wrongCWformula);
                    return thisObj.hover.show('e', lang.wrongCWformula);
                }
            }
            if(mdl.cwFormula.text.x()+mdl.cwFormula.text.width() > mdl.cwFormula.width()){
                mdl.cwFormula.size({width:mdl.cwFormula.text.x()+mdl.cwFormula.text.width() + 10});
            }

        }, mdl.cwFormula.width()-25);
    });

    // show the codeword formula
    mdl.cwFormula.show = function(){
        mdl.cwFormula.text.text(mdl.cwFormula.val);
        mdl.cwFormula.text.fill(props.txtColor);
        mdl.cwFormula.text.off();
        setXk_InfoPoly(); //set the x^k.G(X)
        mdl.xk_InfoPoly.visible(true);
        mdl.getLayer().batchDraw();
        alg.increment();
    };


    // Multiplied by x^k polynomial
    mdl.xk_InfoPoly = new PANEL({
        id: 'xk_InfoPoly',
        name: lang.polyDivisible,
        type: 2,
        labelSize: 18
    });
    mdl.xk_InfoPoly.visible(false);
    mdl.add(mdl.xk_InfoPoly);
    mdl.xk_InfoPoly.updatePos = function(){
        mdl.xk_InfoPoly.size({width: mdl.infoPoly.width(), height: mdl.infoPoly.height()});
        mdl.xk_InfoPoly.position({ x: mdl.infoPoly.x(), y:mdl.infoPoly.y()+mdl.infoPoly.height()+20});
    };
    mdl.xk_InfoPoly.updatePos();
    //mdl.xk_InfoPoly.text = custText('x^k.G(x)=x^13+x^11+x^9+x^7+x^6+x^4');
    mdl.xk_InfoPoly.text = custText('x^k.G(x)=?+?+?+?+?+?');
    mdl.xk_InfoPoly.text.position({x: mdl.infoPoly.x(), y: 15});
    mdl.xk_InfoPoly.add(mdl.xk_InfoPoly.text);
    mdl.xk_InfoPoly.text.fill('red'); // init color
    mdl.xk_InfoPoly.text = over(mdl.xk_InfoPoly.text);
    mdl.xk_InfoPoly.text.hoverTxt = lang.dblclick;
    mdl.xk_InfoPoly.text = hover1(mdl.xk_InfoPoly.text, mdl.xk_InfoPoly);
    //mdl.xk_InfoPoly.val = strToPoly('x^k.G(x)=x^13+x^11+x^9+x^7+x^6+x^4');
    mdl.xk_InfoPoly.val = strToPoly('????????');
    mdl.xk_InfoPoly.text.on('dblclick tap', function() {
        alg.markCurrStep('curr');
        let thisObj =  mdl.xk_InfoPoly.text;
        thisObj.hover.hide();
        thisObj.text(strToPoly(thisObj.text(),'remove'));
        //// let str =  thisObj.str;
        let oldStr = thisObj.str;
        editable(thisObj, function(obj){
            thisObj.text(strToPoly(thisObj.text()));
            let s = strToPoly(obj.text());
            if(s === '') return obj.text(oldStr);
            if(oldStr !== s){
                if(mdl.xk_InfoPoly.val === s){
                    alg.increment();
                    thisObj.fill(props.txtColor);
                    mdl.getLayer().batchDraw();
                    thisObj.hover.hide('r');
                    mdl.getStage().container().style.cursor = 'default';
                    thisObj.off();
                    setDivident(); // set the polynomial dividend text and values
                    mdl.div.autoCalc(); // auto calculate the polynomial division
                    mdl.genPoly.visible(true);
                    mdl.div.visible(true);
                }
                else {
                    //error
                    thisObj.fill('red');
                    stat.error.add(lang.wrongXk_InfoPoly);
                    return thisObj.hover.show('e', lang.wrongXk_InfoPoly);
                }
            }
        }, mdl.xk_InfoPoly.width()-25);
    });

    // calculating polynomial divisible
    setXk_InfoPoly = function(){
        let mems=[];
        inReg.bits.forEach(bit =>{
            if(bit.text() === '1') mems.push('x^'+(Number(bit.label.text())+Number(props.checkBits)));
        });
        mdl.xk_InfoPoly.val = strToPoly('x^k.G(x)='+mems.toString().replace(/,/g,'+'));
    };

    // show the multiplied by x^k polynomial
    mdl.xk_InfoPoly.show = function(){
        mdl.xk_InfoPoly.text.text(mdl.xk_InfoPoly.val);
        mdl.xk_InfoPoly.text.fill(props.txtColor);
        mdl.xk_InfoPoly.text.off();
        setDivident(); // set the polynomial dividend text and vals
        mdl.div.visible(true);
        mdl.genPoly.visible(true);
        mdl.div.visible(true);
        mdl.getLayer().batchDraw();
        // auto calculate the polynomial devition
        mdl.div.autoCalc();
        alg.increment();
    };

    // Generator polynomial
    mdl.genPoly = new PANEL({
        id: 'genPoly',
        name: lang.genPoly,
        type: 2,
        labelSize: 18
    });
    mdl.genPoly.visible(false);
    mdl.add(mdl.genPoly);

    mdl.genPoly.updatePos = function(){
        mdl.genPoly.size({width: mdl.cwFormula.width(), height: mdl.infoPoly.height()});
        mdl.genPoly.position({ x: mdl.cwFormula.x(), y:mdl.xk_InfoPoly.y()});
    };
    mdl.genPoly.updatePos();
    let genPoly = props.genPoly.txt.toLowerCase();
    //console.log('genPoly b = '+ genPoly);
    genPoly = genPoly.replace(/\+ 1/g,'\+x\^0');
    genPoly = genPoly.replace(/\+ x \+/g,'\+x\^1\+');
    //console.log('genPoly a = '+ genPoly);
    mdl.genPoly.text = custText('P(x)='+genPoly);
    mdl.genPoly.val =  strToPoly(mdl.genPoly.text.text());
    mdl.genPoly.text.position({x: 10, y: 15});
    mdl.genPoly.add(mdl.genPoly.text);
    mdl.genPoly.text.fill(props.txtColor); // init color

    //////////// POLYNOMIAL DIVISION PANEL///////////////////////////////
    mdl.div = new PANEL({
        id: 'divPan',
        name: lang.polyDivision,
        position: { x: mdl.infoPoly.x(), y:mdl.xk_InfoPoly.y()+mdl.xk_InfoPoly.height()+20},
        type: 2,
        labelSize: 18
    });
    mdl.div.visible(false);
    mdl.add(mdl.div);
    mdl.div.size({width: mdl.width()-20, height: 200});

    // current cycle index
    mdl.div.currCycle = 0;

    //dividend
    mdl.div.dividend = custText('??????');
    mdl.div.dividend.vals = '';
    mdl.div.dividend.position({x: 20, y: 15});
    mdl.div.add(mdl.div.dividend);
    mdl.div.dividend.fill(props.txtColor); // init color

    // set the text and values of polynomial dividend
    setDivident = function(){
        mdl.div.dividend.text(mdl.xk_InfoPoly.val.split('=')[1]);
        mdl.div.dividend.vals = mdl.xk_InfoPoly.val.split('=')[1].replace(/x/g,'').replace(/\^/g,'').split('+').map(Number);
    };

    //divisor
    mdl.div.divisor = custText(mdl.genPoly.text.text().split('=')[1]);
    mdl.div.divisor.vals = mdl.genPoly.val.split('=')[1].replace(/x/g,'').replace(/\^/g,'').split('+').map(Number);
    mdl.div.divisor.position({x: mdl.div.width()/2, y: mdl.div.dividend.y()});
    mdl.div.add(mdl.div.divisor);
    mdl.div.divisor.fill(props.txtColor); // init color
    mdl.div.divisor.line = new Konva.Line({
        points: [mdl.div.divisor.x()-5, mdl.div.divisor.y(),
                 mdl.div.divisor.x()-5, mdl.div.divisor.y()+mdl.div.divisor.height(),
                 mdl.div.divisor.x()+mdl.div.divisor.width(), mdl.div.divisor.y()+mdl.div.divisor.height()
        ],
        stroke: props.txtColor,
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round'
    });
    mdl.div.add(mdl.div.divisor.line);

    //new cycle button
    mdl.div.newCycBtn = new Button({id: 'newCycBtn',  defVal: lang.newCycle, txtSize:12});
    mdl.div.add(mdl.div.newCycBtn);
    mdl.div.newCycBtn.visible(false);
    mdl.div.newCycBtn.size({height: mdl.div.divisor.height()-5});
    mdl.div.newCycBtn.fill('Linen');
    mdl.div.newCycBtn.txt.fill('DimGrey');
    mdl.div.newCycBtn.x(mdl.div.divisor.x());
    mdl.div.newCycBtn.y(mdl.div.divisor.y()+mdl.div.divisor.y() + 10);
    mdl.div.newCycBtn.on('click touchstart', function(){
        if(mdl.div.quotients[mdl.div.currCycle].isLast === true && mdl.div.quotients[mdl.div.currCycle].completed === true) {
            //error
            stat.error.add(lang.wrongOper+'=>'+lang.newCycle);
            return this.hover.show('e',lang.wrongOper);
        }

        mdl.div.lastCycBtn.visible(false);
        mdl.div.quotients[mdl.div.currCycle].mul.text.visible(true);
        mdl.div.newCycBtn.updatePos();
        mdl.div.newCycBtn.visible(false);
        alg.resetCycle();
        mdl.getLayer().batchDraw();
    });
    // new cycle button position update
    mdl.div.newCycBtn.updatePos = function(){
        let q = mdl.div.quotients[mdl.div.currCycle];
        mdl.div.newCycBtn.x(q.mul.text.x() + q.mul.text.width()+5);
    }

    //last cycle button
    mdl.div.lastCycBtn = new Button({id: 'lastCycBtn',  defVal: lang.lastCycle, txtSize:12});
    mdl.div.lastCycBtn.visible(false);
    mdl.div.add(mdl.div.lastCycBtn);
    mdl.div.lastCycBtn.size({height: mdl.div.divisor.height()-5});
    mdl.div.lastCycBtn.fill('Linen');
    mdl.div.lastCycBtn.txt.fill('DimGrey');
    mdl.div.lastCycBtn.on('click touchstart', function(){
        if(mdl.div.quotients[mdl.div.currCycle].isLast !== true) {
            //error
            stat.error.add(lang.wrongOper+' => '+lang.lastCycle);
            return this.hover.show('e',lang.wrongOper);
        }
        mdl.div.lastCycBtn.visible(false);
        mdl.div.newCycBtn.visible(false);
        mdl.div.quotients[mdl.div.currCycle].rem.text.fill('ForestGreen');

        //set the codeword polynomial value
        setCwPoly();
        // set the position of polynomial codeword panel and show it
        mdl.cwPoly.position({x: mdl.div.x(), y: mdl.div.y() + mdl.div.height() + 20});
        //mdl.div.autoCorrSize();
        mdl.cwPoly.visible(true);
    });
    // last cycle button position update
    mdl.div.lastCycBtn.updatePos = function(){
        let q = mdl.div.quotients[mdl.div.currCycle];
        mdl.div.lastCycBtn.x(q.rem.text.x() + q.rem.text.width()+10);
        mdl.div.lastCycBtn.y(q.rem.text.y());
    };

    // show the current component
    mdl.div.show = function(component){
        if(typeof component === 'undefined') return console.log('The component is undefined!');
        let q = mdl.div.quotients[mdl.div.currCycle];
        switch (component){
            case 'mul':
               q.mul.show();
            break;
            case 'res':
                q.res.show();
            break;
            case 'rem':
                q.rem.show();
            break;
        }
    };

    //quotients
    mdl.div.quotients = [];

    // add new quotient
    mdl.div.newQuotient = function(){
        let vOffset = 10;
        let currIdx = mdl.div.quotients.length;
        let q = new Konva.Group({id: 'q-'+currIdx});

        mdl.div.add(q);
        q.completed = false;
        q.isLast = false;
        q.mul={};
        q.res={};
        q.rem={};

        //multiplicator
        q.mul.text = custText(currIdx === 0 ? strToPoly('x?'): strToPoly('+x?'));
        q.mul.text.id(q.id()+'-mul');
        if(currIdx === 0){
            q.mul.text.visible(true);
            q.mul.text.position({x: mdl.div.divisor.x(), y: mdl.div.divisor.y()+ mdl.div.divisor.height()+vOffset});
        }
        else {
            q.mul.text.visible(false);
            let last = mdl.div.quotients[currIdx-1].mul.text;
            q.mul.text.position({x: last.x()+last.width(), y: last.y()});
            if(mdl.div.divisor.line.points()[4]< q.mul.text.x()+q.mul.text.width())
                mdl.div.divisor.line.points()[4] = q.mul.text.x()+q.mul.text.width();
        }
        q.add(q.mul.text);
        //mdl.div.autoCorrSize();
        q.mul.text.fill('red'); // init color
        q.mul.text = over(q.mul.text);
        q.mul.text.hoverTxt = lang.dblclick;
        q.mul.text = hover1(q.mul.text, mdl.div);
        //q.mul.val = '';
        // calculating mul
        q.mul.val = currIdx === 0 ? mdl.div.dividend.vals[0] - mdl.div.divisor.vals[0] :
                                    mdl.div.quotients[currIdx-1].rem.vals[0] - mdl.div.divisor.vals[0];
        q.mul.text.on('dblclick tap', function(){
            alg.markCurrStep('curr');
            let thisObj =  q.mul.text;
            thisObj.hover.hide();
            thisObj.text(strToPoly(thisObj.text(),'remove'));
            //// let str =  thisObj.str;
            let oldStr = thisObj.str;
            editable(thisObj, function(obj){
                thisObj.text(strToPoly(thisObj.text()));
                let s = strToPoly(obj.text());
                if(s === '') return obj.text(oldStr);
                if(oldStr !== s){
                    if(s === '+x^') s='+x^1';
                    if(s === '+1') s='+x^0';
                    //console.log('s = '+s);
                    if('x^'+q.mul.val === s || '+x^'+q.mul.val === s){
                        alg.increment();
                        thisObj.fill(props.txtColor);
                        q.res.text.visible(true);
                        q.plus.visible(true);
                        mdl.getLayer().batchDraw();
                        q.mul.text.hover.hide('r');
                        q.mul.text.off();
                        mdl.getStage().container().style.cursor = 'default';
                        thisObj.off();
                    }
                    else {
                        //error
                        thisObj.fill('red');
                        stat.error.add(lang.wrongMul);
                        return thisObj.hover.show('e', lang.wrongMul);
                    }
                }
            });
        });

        // Result
        q.res.text = custText(strToPoly('x?+x?+x?+x?+x?+x?'));
        q.res.text.id(q.id()+'-res');
        if(currIdx === 0)
            q.res.text.position({x: mdl.div.dividend.x(), y: mdl.div.dividend.y()+ mdl.div.dividend.height()+vOffset});
        else {
            let last = mdl.div.quotients[mdl.div.quotients.length-1].rem.text;
            q.res.text.position({x: last.x(), y: last.y()+last.height()+vOffset});
        }
        q.add(q.res.text);
        //mdl.div.autoCorrSize();
        q.res.text.visible(false);
        q.res.text.fill('red'); // init color
        q.res.text = over(q.res.text);
        q.res.text.hoverTxt = lang.dblclick;
        q.res.text = hover1(q.res.text, mdl.div);
        q.res.vals = [];
        // calculating of the result
        q.res.calc = function(){
            for(let i=0; i<mdl.div.divisor.vals.length; i++)
                q.res.vals.push(q.mul.val + mdl.div.divisor.vals[i]);
            q.res.vals.sort(function(a, b){return b-a}); // Sort numbers in an array in descending order
        };
        q.res.text.on('dblclick tap', function() {
            alg.markCurrStep('curr');
            let thisObj =  q.res.text;
            thisObj.hover.hide();
            thisObj.text(strToPoly(thisObj.text(),'remove'));
            // let str =  thisObj.str;
            let oldStr =thisObj.str;
            editable(thisObj, function(obj){
                thisObj.text(strToPoly(thisObj.text()));
                let s = strToPoly(obj.text());
                if(s === '') return obj.text(oldStr);
                if(oldStr !== s){
                    let str = 'x\^'+q.res.vals.toString().replace(/,/g,'+x^');
                    //console.log('str res a = '+str);
                    s = s.replace(/\+1/g, '\+x\^0');
                    s = s.replace(/\+x\+/g, '\+x\^1\+');
                    //console.log('str s     = '+s);
                    if(str === s){
                        alg.increment();
                        thisObj.fill(props.txtColor)
                        q.rem.text.visible(true);
                        mdl.getLayer().batchDraw();
                        q.res.text.hover.hide('r');
                        q.res.text.off();
                        q.line.visible(true);
                        mdl.getStage().container().style.cursor = 'default';
                        thisObj.off();
                    }
                    else {
                        //error
                        thisObj.fill('red');
                        stat.error.add(lang.wrongRes);
                        return thisObj.hover.show('e', lang.wrongRes);
                    }
                }
            });
        });

        // Remainder
        q.rem.text = custText(strToPoly('x?+x?+x?+x?+x?+x?'));
        q.rem.text.id(q.id()+'-rem');
        q.rem.text.position({x: q.res.text.x()+10, y: q.res.text.y()+ q.res.text.height()+vOffset});
        q.add(q.rem.text);
        //mdl.div.autoCorrSize();
        q.rem.text.visible(false);
        q.rem.text.fill('red'); // init color
        q.rem.text = over(q.rem.text);
        q.rem.text.hoverTxt = lang.dblclick;
        q.rem.text = hover1(q.rem.text, mdl.div);
        q.rem.vals = [];
        // calculating of the remainder
        q.rem.calc = function(){
            let forRemove=[];
            let tempArr = q.res.vals.concat(currIdx === 0 ? mdl.div.dividend.vals : mdl.div.quotients[currIdx-1].rem.vals);
            tempArr.forEach(val => {
                if(q.rem.vals.indexOf(val) !== -1)
                    forRemove.push(val);
                q.rem.vals.push(val);
            });
            forRemove.forEach(el => {
                for( let i = 0; i < q.rem.vals.length; i++)
                    if ( q.rem.vals[i] === el)
                        q.rem.vals.splice(i--, 1);
            });
            q.rem.vals.sort(function(a, b){return b-a});
        }
        q.rem.text.on('dblclick tap', function() {
            alg.markCurrStep('curr');
            let thisObj =  q.rem.text;
            thisObj.hover.hide();
            thisObj.text(strToPoly(thisObj.text(),'remove'));
            // let str =  thisObj.str;
            let oldStr =thisObj.str;
            editable(thisObj, function(obj){
                thisObj.text(strToPoly(thisObj.text()));
                let s = strToPoly(obj.text());
                if(s === '') return obj.text(oldStr);
                if(oldStr !== s){
                    let str = 'x\^'+q.rem.vals.toString().replace(/,/g,'+x^');
                    //console.log('str rem a = '+str);
                    s = s.replace(/\+1/g, '\+x\^0');
                    s = s.replace(/\+x\+/g, '\+x\^1\+');
                    //console.log('str s     = '+s);
                    if(str === s){
                        alg.increment();
                        thisObj.fill(props.txtColor);
                        //q.enableHL(true);
                        mdl.getLayer().batchDraw();
                        q.rem.text.hover.hide('r');
                        q.rem.text.off();
                        // show last cycle button
                        mdl.div.lastCycBtn.updatePos(); // update position first
                        mdl.div.lastCycBtn.visible(true);
                        // show new cycle button
                        mdl.div.newCycBtn.updatePos();// update position first
                        mdl.div.newCycBtn.visible(true);
                        q.completed = true;
                        mdl.getStage().container().style.cursor = 'default';
                        thisObj.off();

                        //check for last cycle
                        if(q.rem.vals[0] < mdl.div.divisor.vals[0]) q.isLast = true;
                        else mdl.div.currCycle++;
                    }
                    else {
                        //error
                        thisObj.fill('red');
                        stat.error.add(lang.wrongRem);
                        return thisObj.hover.show('e', lang.wrongRem);
                    }
                    // repositioning button X coordinate according to the field width
                    mdl.div.lastCycBtn.x(q.rem.text.x() + q.rem.text.width()+10);
                }
            });
        });

        // line
        q.line = new Konva.Line({
            id: q.id()+'-line',
            points: [q.res.text.x(),                    q.res.text.y()+q.res.text.height()+vOffset-8,
                     q.rem.text.x()+q.rem.text.width(), q.res.text.y()+q.res.text.height()+vOffset-8
            ],
            visible: false,
            stroke: props.txtColor,
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
        });
        q.add(q.line);

        // plus "+" sign
        q.plus = new Konva.Text({
            id: q.id()+'-plus',
            text: '+',
            fill: props.txtColor,
            fontSize: props.txtSize,
            x: q.res.text.x()-14,
            visible: false
        });
        q.add(q.plus);
        q.plus.y(q.res.text.y() - q.plus.height()+3);

        //auto calcualting res and rem
        q.res.calc();
        q.rem.calc();

        // show mul
        q.mul.show = function(){
            q.mul.text.text(strToPoly(currIdx === 0 ? 'x^'+q.mul.val : '+x^'+q.mul.val));
            q.mul.text.off();
            q.mul.text.fill(props.txtColor);
            mdl.div.lastCycBtn.visible(false);
            q.mul.text.visible(true);
            q.res.text.visible(true);
            q.plus.visible(true);
            mdl.div.newCycBtn.updatePos();
            mdl.div.newCycBtn.visible(false);
            alg.increment();
        };
        // show res
        q.res.show = function(){
            q.res.text.text(strToPoly('x\^'+q.res.vals.toString().replace(/,/g,'+x^')));
            q.res.text.off();
            q.res.text.fill(props.txtColor);
            q.res.text.visible(true);
            q.line.visible(true);
            q.rem.text.visible(true);
            alg.increment();
        }
        // show rem
        q.rem.show = function(){
            q.rem.text.text(strToPoly('x\^'+q.rem.vals.toString().replace(/,/g,'+x^')));
            q.rem.text.off();
            q.rem.text.fill(props.txtColor);
            q.rem.text.visible(true);
            alg.increment();
            q.completed = true;
            mdl.div.lastCycBtn.updatePos(); // last cycle bu position update
            mdl.div.lastCycBtn.visible(true);
            mdl.div.newCycBtn.visible(true);

            if(q.isLast){
                mdl.div.lastCycBtn.visible(false);
                mdl.div.newCycBtn.visible(false);
                mdl.div.quotients[mdl.div.currCycle].rem.text.fill('ForestGreen');
                setCwPoly(); //set the codeword polynomial value
                // set the position of polynomial codeword panel and show it
                mdl.cwPoly.position({x: mdl.div.x(), y: mdl.div.y() + mdl.div.height() + 20});
                mdl.autoCorrSize();
                mdl.cwPoly.visible(true);
            }
            else mdl.div.currCycle++; // increment the cycle
        }

        //check for last cycle
        if(q.rem.vals[0] < mdl.div.divisor.vals[0]) q.isLast = true;

        // set the q size
        q.height(q.mul.text.y() + q.rem.text.y() + q.rem.text.height());
        q.width(q.res.text.x() + q.mul.text.x() + q.mul.text.width());

        //mdl.getLayer().batchDraw();
        mdl.div.quotients.push(q);
        mdl.div.lastCycBtn.updatePos(); // last cycle button init position

        mdl.div.autoCorrSize(); // correct panel size if it is need
        return true;
    };


    //auto calculate all cyclic
    mdl.div.autoCalc = function(){
        let count = 0;
        do {
            mdl.div.newQuotient();
            //console.log(count +' is last = '+mdl.div.quotients[mdl.div.quotients.length-1].isLast)
            if (mdl.div.quotients[mdl.div.quotients.length-1].isLast === true) return false;
            count++;
            alg.incrmtCycle();
        }
        while (true);
    }

    // CodeWord in polynomial form
    mdl.cwPoly = new PANEL({
        id: 'cwPoly',
        name: lang.cwPoly,
        type: 2,
        labelSize: 18
    });
    mdl.cwPoly.visible(false);
    mdl.add(mdl.cwPoly);
    mdl.cwPoly.size({width: mdl.div.width(), height: mdl.cwFormula.height()});
    mdl.cwPoly.text = custText('F(x) = ???????');
    mdl.cwPoly.text = over(mdl.cwPoly.text);
    mdl.cwPoly.text.hoverTxt = lang.dblclick;
    mdl.cwPoly.text = hover1(mdl.cwPoly.text, mdl.div);
    mdl.cwPoly.vals =  '';
    mdl.cwPoly.text.position({x: 10, y: 15});
    mdl.cwPoly.add(mdl.cwPoly.text);
    mdl.cwPoly.text.fill('red'); // init color
    mdl.cwPoly.text.on('dblclick tap', function() {
        alg.markCurrStep('curr');
        let thisObj =  mdl.cwPoly.text;
        thisObj.hover.hide();
        thisObj.text(strToPoly(thisObj.text(),'remove'));
        // let str =  thisObj.str;
        let oldStr =thisObj.str;
        editable(thisObj, function(obj){
            thisObj.text(strToPoly(thisObj.text()));
            let s = strToPoly(obj.text());
            if(s === '') return obj.text(oldStr);
            if(oldStr !== s){
                if(mdl.cwPoly.val === s){
                    alg.increment();
                    thisObj.fill(props.txtColor);
                    mdl.getLayer().batchDraw();
                    thisObj.hover.hide('r');
                    mdl.getStage().container().style.cursor = 'default';
                    thisObj.off();
                    // set the remainder binary values
                    setRemBin();
                    // set position of binary reminder panel
                    mdl.remBin.position({x: mdl.cwPoly.x(), y: mdl.cwPoly.y() + mdl.cwPoly.height() + 20});
                    // show the remainder binary panel
                    mdl.remBin.visible(true);
                    // check parent panel size
                    mdl.autoCorrSize();
                }
                else {
                    //error
                    thisObj.fill('red');
                    stat.error.add(lang.wrongCwPoly);
                    return thisObj.hover.show('e', lang.wrongCwPoly);
                }
            }
        }, mdl.cwPoly.width()-20);
    });

    // Show Codeword polynomial
    mdl.cwPoly.show = function(){
        mdl.cwPoly.text.text(mdl.cwPoly.val);
        mdl.cwPoly.text.fill(props.txtColor);
        mdl.cwPoly.text.off();
        // set the remainder binary values
        setRemBin();
        // set position of binary reminder panel
        mdl.remBin.position({x: mdl.cwPoly.x(), y: mdl.cwPoly.y() + mdl.cwPoly.height() + 20});
        // show the remainder binary panel
        mdl.remBin.visible(true);
        // check parent panel size
        mdl.autoCorrSize();
        mdl.getLayer().batchDraw();
        alg.increment();
    }

    // set the codeword polynomial value
    setCwPoly = function(){
        mdl.cwPoly.val = 'F(x)='+mdl.div.dividend.text() +'+'+
                          mdl.div.quotients[mdl.div.quotients.length-1].rem.text.text();
    }

    // Reminder to binary form
    mdl.remBin = new PANEL({
        id: 'remBin',
        name: lang.remBin,
        type: 2,
        labelSize: 18
    });
    mdl.remBin.visible(false);
    mdl.add(mdl.remBin);
    mdl.remBin.size({width: mdl.cwFormula.width()-48, height: mdl.cwFormula.height()});
    mdl.remBin.text = custText('???????');
    mdl.remBin.text = over(mdl.remBin.text);
    mdl.remBin.text.hoverTxt = lang.dblclick;
    mdl.remBin.text = hover1(mdl.remBin.text, mdl.div);
    mdl.remBin.val =  '';
    mdl.remBin.text.position({x: 10, y: 15});
    mdl.remBin.add(mdl.remBin.text);
    mdl.remBin.text.fill('red'); // init color
    mdl.remBin.text.on('dblclick tap', function() {
        alg.markCurrStep('curr');
        let thisObj =  mdl.remBin.text;
        thisObj.hover.hide();
        thisObj.text(strToPoly(thisObj.text(),'remove'));
        // let str =  thisObj.str;
        let oldStr =thisObj.str;
        editable(thisObj, function(obj){
            thisObj.text(strToPoly(thisObj.text()));
            let s = strToPoly(obj.text());
            if(s === '') return obj.text(oldStr);
            if(oldStr !== s){
                if(mdl.remBin.val === s){
                    alg.increment();
                    thisObj.fill(props.txtColor);
                    mdl.getLayer().batchDraw();
                    thisObj.hover.hide('r');
                    mdl.getStage().container().style.cursor = 'default';
                    thisObj.off();

                    //set the codeword binary value
                    setCwBin();
                    // set the position of polynomial codeword panel and show it
                    mdl.cwBin.position({x: mdl.remBin.x() + mdl.remBin.width() + 20, y: mdl.remBin.y()});
                    mdl.cwBin.visible(true);
                }
                else {
                    //error
                    thisObj.fill('red');
                    stat.error.add(lang.wrongRemBin);
                    return thisObj.hover.show('e', lang.wrongRemBin);
                }
            }
        }, mdl.remBin.width()-20);
    });

    // show the reminder in binary format
    mdl.remBin.show = function(){
        mdl.remBin.text.text(mdl.remBin.val);
        mdl.remBin.text.fill(props.txtColor);
        mdl.remBin.text.off();
        //set the codeword binary value
        setCwBin();
        // set the position of polynomial codeword panel and show it
        mdl.cwBin.position({x: mdl.remBin.x() + mdl.remBin.width() + 20, y: mdl.remBin.y()});
        mdl.cwBin.visible(true);
        mdl.getLayer().batchDraw();
        alg.increment();
    }

    // set the binary remainder
    setRemBin = function(){
        let bin='';
        let k = props.checkBits;
        let arr = mdl.div.quotients[mdl.div.quotients.length-1].rem.vals;

        for(let i=k-1; i>=0; i--){
            if(arr.indexOf(i) !== -1) bin +='1';
            else bin +='0';
        }
        mdl.remBin.val = bin;
    };

    // CodeWord in binary form
    mdl.cwBin = new PANEL({
        id: 'cwBin',
        name: lang.cwBin,
        type: 2,
        labelSize: 18
    });
    mdl.cwBin.visible(false);
    mdl.add(mdl.cwBin);
    mdl.cwBin.size({width: mdl.div.width() - (mdl.remBin.x() + mdl.remBin.width() + 20),
                    height: mdl.cwFormula.height()});
    mdl.cwBin.text = custText('??????????????????');
    mdl.cwBin.text = over(mdl.cwBin.text);
    mdl.cwBin.text.hoverTxt = lang.dblclick;
    mdl.cwBin.text = hover1(mdl.cwBin.text, mdl.div);
    mdl.cwBin.vals =  '';
    mdl.cwBin.text.position({x: 10, y: 15});
    mdl.cwBin.add(mdl.cwBin.text);
    mdl.cwBin.text.fill('red'); // init color
    mdl.cwBin.text.on('dblclick tap', function() {
        alg.markCurrStep('curr');
        let thisObj =  mdl.cwBin.text;
        thisObj.hover.hide();
        thisObj.text(strToPoly(thisObj.text(),'remove'));
        // let str =  thisObj.str;
        let oldStr =thisObj.str;
        editable(thisObj, function(obj){
            thisObj.text(strToPoly(thisObj.text()));
            let s = strToPoly(obj.text());
            if(s === '') return obj.text(oldStr);
            if(oldStr !== s){
                if(mdl.cwBin.val === s){
                    thisObj.fill(props.txtColor);
                    mdl.getLayer().batchDraw();
                    thisObj.hover.hide('r');
                    mdl.getStage().container().style.cursor = 'default';
                    thisObj.off();
                    alg.increment(); // pass current step
                    alg.increment(); // for finish step
                }
                else {
                    //error
                    thisObj.fill('red');
                    stat.error.add(lang.wrongCwBin);
                    return thisObj.hover.show('e', lang.wrongCwBin);
                }
            }
        }, mdl.cwBin.width()-20);
    });

    // Show Codeword polynomial
    mdl.cwBin.show = function(){
        mdl.cwBin.text.text(mdl.cwBin.val);
        mdl.cwBin.text.fill(props.txtColor);
        mdl.cwBin.text.off();
        mdl.getLayer().batchDraw();
        alg.increment(); // pass current step
        alg.increment(); // for finish step
    }

    // set codeword binary values
    setCwBin = function(){
        mdl.cwBin.val = inReg.vals.toString().replace(/,/g,'') + mdl.remBin.val;
    }

    return mdl;
}// END of CYCLIC_POLY


// prepare a polynomial string to custText
function strToPoly(str,remove){
    if(typeof remove !== 'undefined') {
        str = str.replace(/\^/g, '');
    }
    else{
        str = str.replace(/\s/g, ''); //clear spaces
        str = str.replace(/\(x\)/g, '|');
        str = str.replace(/x/g, 'x^');
        str = str.replace(/\^\^/g, '^');
        str = str.replace('x\^\+', 'x\^1\+');
        str = str.replace(/\+1/g, '\+x\^0');
        str = str.replace(/\|/g, '\(x\)');
        //str = str.replace(/x\^0/g, '1');

        if(str.substr(str.length-4) === '+x^1'){
             //console.log('str before) = '+str);
             //str = str.replace(/\+x\^1/g, ' + x');
             //console.log('str before) = '+str);
        }

        //str = str.replace(/x\^1\+/g, 'x+');
    }
    return str;
}


///// CUSTOM TEXT OBJECT //////////////////////////////////////////////////////
function custText(string) {
    //example str =>  x^k+G(x)+x^n+1
    if (typeof (string) === 'undefined') console.error('Undefined string =>', string);
    let gr = new Konva.Group();
    gr.mems = [];
    gr.str='';

    // forming the new string members
    gr.forming = function(str){
        let mems=[];
        let elms=[];
        if(str.indexOf('^') !== -1 || str.indexOf('_') !== -1){
            let str1 = '';
            str1 = str.replace(/\s/g, ''); //clear spaces
            str1 = str1.replace(/=/g, '| = ');
            str1 = str1.replace(/\./g, '|.');
            str1 = str1.replace(/\+/g, '|+ ');
            elms = str1.split('|');
        }
        else elms = str.split('|');
        
        let nextX = 0;
        for (let i = 0; i < elms.length; i++) {
            let mem;
            mem = SUPB(elms[i]);
            mem.x(nextX);
            nextX += mem.width() + 3;
            mems.push(mem);
        }

        // ste the group size
        //console.log('width before = '+gr.width());
        gr.width(nextX-3);
        gr.height(mems[0].height());
        //console.log('width after = '+gr.width());

        gr.str = str.replace(/\s/g, '');
        return mems;
    };
    gr.mems = gr.forming(string);
    gr.mems.forEach(mem =>{gr.add(mem);});

    // update group size
    gr.updateSize = function(){
        if(gr.mems.length === 1){
            gr.width(gr.mems[0].width());
            gr.height(gr.mems[0].height());
        }
        else{
            gr.width(gr.mems[gr.mems.length - 1].x() + gr.mems[gr.mems.length - 1].width());
            gr.height(gr.mems[0].height());
        }
        console.log({str: gr.str, w: gr.width(), h: gr.height()});
        return ;

    };
    //updateSize();

    // fill
    gr.fill = function (color) {
        if (typeof color === 'undefined') return gr.mems[0].fill();
        gr.mems.forEach(mem => {
            mem.fill(color)
        });
        try {gr.getLayer().batchDraw();}
        catch (e) {}
        return true;
    };
    gr.fill('Navy'); // default text color

    // fontSize
    gr.fontSize = function (size) {
        if (typeof size === 'undefined') return gr.mems[0].fontSize();
        for(let i=0; i<gr.mems.length ;i++){
            gr.mems[i].fontSize(size);
            if(i>0) gr.mems[i].x(gr.mems[i-1].x() + gr.mems[i-1].width() + 3);
        }
        //console.log(updateSize());
        try {gr.getLayer().batchDraw();} catch (e) {}
        return true;
    };
    gr.fontSize(16); //default font size

    // enable editable
    gr.isEditable = false; // default editable is false

    // set text
    gr.text = function(newStr){
        if(typeof newStr === 'undefined') return gr.str;
        gr.removeChildren();
        let currSize = gr.fontSize();
        let currFill = gr.fill();
        gr.mems = [];
        gr.mems = gr.forming(newStr);
        //gr.str = newStr.replace(/\s/g, '');
        gr.mems.forEach(mem =>{gr.add(mem);});
        gr.fontSize(currSize);
        gr.fill(currFill);
        try {gr.getLayer().batchDraw();} catch{}
    };
    return gr;
} // End of custText


// FINDING ALL INDEXES OF THE SEARCHED SEGMENT IN STRING
function findIdxs(str, find){
    if(typeof str === 'undefined' || typeof find === 'undefined') return console.error('Incorrect argument of findIdxs');
    let f = find.toString();
    let idxs = [];
    for(let i=0; i<str.length; i++){
        if(str[i] === f) idxs.push(i)
    }
    return idxs;
}

//HAMMING ENCODER - MATRIX ALGORITHM/////////////////////////////////////////////////////////////////////////////////////////
function HAMMING_MA(props, alg, stat, inReg) {
    // CONFIG DEFAULT PROPERTIES
    // GENERAL properties
    props.id = props.id || 'en';
    props.name = props.name || 'Hamming Encoder - Matrix Algorithm';
    props.position = props.position || {x: 0, y: 0};
    props.fill = props.fill || 'FloralWhite';
    props.labelSize = props.labelSize || 20;
    props.txtSize = props.txtSize || 16;
    props.labelDistance = props.labelDistance || 5;
    props.labelColor = props.labelColor || 'white';
    props.txtColor = props.txtColor || 'Navy';
    props.labelBgColor = props.labelBgColor || 'RoyalBlue';
    props.labelPadding = props.labelPadding || 4;
    props.pading = props.pading || 10;
    props.width = props.width || 600;
    props.height = props.height || 550;
    props.errDet = props.errDet || 1;
    props.checkBits = props.checkBits || 4;
    props.bitsNum = props.bitsNum || 11;
    props.draggable = props.draggable || false;
    props.process = props.process || 'enc';
    props.checkBits = props.checkBits || 4;

    let lang = props.lang;
    let mdl = new PANEL(props);
    mdl.size({width: props.width, height: props.height});
    mdl.dragmove(true);

    // Matrices panel
    mdl.mat = new PANEL({
        id: 'matPanel',
        name: lang.matrices,
        position: { x: 20, y:50},
        type: 2,
        labelSize: 18
    });
    mdl.add(mdl.mat);

    // H matrix set size Text
    mdl.HmatSize = new Konva.Group({id:'HmatSize'});
    mdl.mat.add(mdl.HmatSize);

    // Hmat label
    mdl.HmatSize.label = new Konva.Text({   id: 'HmatSizeLabel',
                                         x: 10, y: 15,
                                         text: lang.matSize+': ',
                                         fill: props.txtColor,
                                         fontSize: props.txtSize,
    });
    mdl.HmatSize.add(mdl.HmatSize.label);
    // Hmat value
    mdl.HmatSize.valTxt = new Konva.Text({   id: 'HmatSizeVal',
                                        x: mdl.HmatSize.label.x()+mdl.HmatSize.label.width(),
                                        y: mdl.HmatSize.label.y(),
                                        text: '? x ?',
                                        fill: 'red',
                                        fontStyle: 'bold',
                                        fontSize: props.txtSize
    });
    mdl.HmatSize.add(mdl.HmatSize.valTxt);
    mdl.HmatSize.valTxt = over(mdl.HmatSize.valTxt);
    mdl.HmatSize.valTxt.hoverTxt = lang.matSizeFormat;
    mdl.HmatSize.valTxt = hover1(mdl.HmatSize.valTxt, mdl.mat);
    mdl.HmatSize.valTxt.on('dblclick tap', function() {
        //check for set bits
        if(inReg.vals.includes(undefined) === true)  {
            mdl.HmatSize.valTxt.hover.show('e',lang.setAllBit);
            return;
        };

        let thisObj =  mdl.HmatSize.valTxt;
        let str =  thisObj.text();
        let oldStr =thisObj.str;
        editable(thisObj, function(obj){
            if(alg.getCurrStep().name === 'setBits') alg.increment();
                alg.markCurrStep('curr');
            let s = obj.text();
            if(s === '') return obj.text(oldStr);
            s = s.replace(/\s/g, ''); //clear spaces
            if(oldStr !== s){
                if(mdl.HmatSize.val === s){
                    s = s.replace('x', ' x ');
                    mdl.getLayer().batchDraw();
                    thisObj.fill(props.txtColor);
                    mdl.checkBtn.visible(true);
                    mdl.Hmat.visible(true);
                    thisObj.off();
                    alg.increment();
                }
                else {
                    thisObj.fill('red');
                    s = s.replace('x', ' x ');
                    mdl.getLayer().batchDraw();
                    //error
                    stat.error.add(lang.wrongMatSize);
                    return thisObj.hover.show('e', lang.wrongMatSize);
                }
            }
            //else obj.text(s.substr(0,1)+'_'+s.substr(1));
        });
    });

    // column labels creating for H matrix
    let colLabels = [];
    let idxC, idxS = 1;
    let init, ln;
    if(props.errDet === 2) {
        init = 0;
        ln = props.bitsNum;
        idxC = 0
    }
    else{
        init = 1;
        ln = props.bitsNum + 1;
        idxC = 1;
    }
    for(let i=init; i<ln; i++){
        if(i === 0 || i === 1 || i === 2 || i === 4 || i === 8 || i === 16 || i === 32){
            colLabels.push('C_'+ idxC);
            idxC++;
        }
        else{
            colLabels.push('S_'+ idxS);
            idxS++;
        }
    }

    let rowLabels=[];
    ln = props.errDet === 2 ? (props.checkBits - 1) : props.checkBits;
    if(props.errDet === 2) rowLabels.push(0);
    for(let i=0; i<ln; i++) rowLabels.push(Math.pow(2, i));
    // H matrix creating
    mdl.Hmat = new MATRIX({  id: 'Hmat',
                                    title:'H',
                                    cols: props.bitsNum,
                                    rows: props.checkBits,
                                    firstColNum: props.errDet === 1 ? '1' : '0',
                                    colLabels: colLabels,
                                    rowLabels: rowLabels,
                                    randVals: false
    });
    mdl.mat.add(mdl.Hmat);
    // update matrices panel's height
    mdl.mat.size({height: mdl.Hmat.height()+60});
    mdl.Hmat.position({x: 10, y: mdl.mat.height()/2 - mdl.Hmat.height()/2 + mdl.HmatSize.label.height()+25});

    // get Hmat size
    mdl.HmatSize.val = mdl.Hmat.size().r+'x'+mdl.Hmat.size().c;

    // hide H matrix
    mdl.Hmat.visible(false);

    // set H matrix labels
    mdl.Hmat.colLabels.forEach(label =>{
        label.text('?');
        label.fill('red');
        label = over(label);
        label.hoverTxt = lang.dblclick;
        label = hover1(label, mdl.Hmat);
        label.on('dblclick tap', ()=>{
            let thisObj =  label;
            let str =  thisObj.text();
            if(thisObj.sub.text() !== '') str += thisObj.sub.text();
            thisObj.text(str);
            let oldStr =thisObj.str;
            editable(thisObj, function(obj){
                let s = obj.text().toUpperCase();
                if(s === '') return obj.text(oldStr);
                if(oldStr !== s){
                    if(thisObj.id() === s){
                        if(s.substr(0,1) === 'C') thisObj.fill('RoyalBlue');
                        else thisObj.fill('RosyBrown');
                        obj.text(s.substr(0,1)+'_'+s.substr(1));
                        mdl.getLayer().batchDraw();
                        thisObj.off();
                    }
                    else {
                        thisObj.fill('red');
                        obj.text(s.substr(0,1)+'_'+s.substr(1));
                        mdl.getLayer().batchDraw();
                        //error
                        stat.error.add(lang.wrongLabelHmat);
                        return thisObj.show('e', lang.wrongLabel);
                    }
                }
                else obj.text(s.substr(0,1)+'_'+s.substr(1));
            });
        });
    });

    // calc H matrix values and H' empty matrix
    let size = mdl.Hmat.size();
    const Hvals = new Array(size.r);
    const H_vals = new Array(size.r);
    for(let i=0; i<size.r; i++) {
        Hvals[i] = new Array(size.c);
        H_vals[i] = new Array(size.c);
    }
    for(let i=0; i<size.c; i++) {
        let numDec = props.errDet === 1 ? (i+1) : i;
        let numStr = parseInt(numDec, 10).toString(2);
        ln = props.errDet === 1 ? (size.r-1) : (size.r-2);
        while(numStr.length < (ln+1))  numStr = '0'+numStr;
        for (let j=ln; j>=0; j--){
            Hvals[j][i] = Number(numStr[j]);
        }
    }
    // for C0 for H matrix
    if(props.errDet === 2){
        for(let i=0; i<size.c; i++){
            Hvals[size.r-1][i] = 1;
        }
    }

    // column labels creating for H' matrix
    let colLabels1 = [];
    for(let i=0; i<colLabels.length; i++){
        if(colLabels[i].substr(0,1) === 'S') colLabels1.push(colLabels[i]);
    }
    for(let i=colLabels.length-1; i>=0; i--){
        if(colLabels[i].substr(0,1) === 'C') colLabels1.push(colLabels[i]);
    }

    // check for correct H matrix labels place
    mdl.Hmat.colLabels.check = function(){
        for(let i=0; i<this.length; i++){
            let label = mdl.Hmat.colLabels[i];
            if(label.fill() === 'red') return false;
        }
        return true;
    };

    // H' matrix creating
    mdl.H_mat = new MATRIX({ id: 'H_mat',
                                    title:'H\'',
                                    cols: props.bitsNum,
                                    rows: props.checkBits,
                                    //firstColNum: props.errDet === 1 ? '1' : '0',
                                    colLabels: colLabels1,
                                    randVals: false,
                                    layer: mdl.getLayer(),
    });
    mdl.mat.add(mdl.H_mat);
    mdl.H_mat.visible(false);
    mdl.H_mat.enable(false);
    mdl.H_mat.elmsVisible(false);
    mdl.H_mat.position({x: mdl.Hmat.x() + mdl.Hmat.width() + 20, y: mdl.Hmat.y()});

    // calculating H' matrix values
    size = mdl.Hmat.size();
    for(let i=0; i<size.c; i++){
        let colIdx = colLabels.indexOf(colLabels1[i]);
        let move = {x:8, y:0};
        for(let j=0; j<size.r; j++){
            H_vals[j][i] = Hvals[j][colIdx]; // by ordering columns

            // add distance for control bits columns
            if(colLabels1[i].substr(0,1) === 'C') {
                mdl.H_mat.elms[j][i].move(move);
                if(j===0) {
                    mdl.H_mat.colLabels[i].move(move);
                }
            }
        }
        if(i===0){
            mdl.H_mat.closeB.move(move);
        }
    }
    let H_valsTemp =  H_vals.map(function(arr) {
        return arr.slice();
    });

    //correcting model width according to the H' matrix width
    {
        let matsWidth = mdl.Hmat.width() + mdl.H_mat.width() + 90;
        //let minWidth = 645;
        let minWidth = 700;
        //console.log('matsWidth = '+matsWidth, '; minWidth = '+minWidth);
        if(matsWidth > minWidth){
            //mdl.size({width: matsWidth});
            // update matrices panel's width
            mdl.mat.size({width: matsWidth-40});
            mdl.size({width: mdl.mat.size().width +40});
        }
        else {
            mdl.size({width: minWidth});
            // update matrices panel's width
            mdl.mat.size({width: minWidth-40});
        }
    }
    // set H' matrix temp values
    mdl.H_mat.setVals(H_valsTemp);

    // set H matrix labels
    mdl.H_mat.colLabels.forEach(label =>{
        label.text('?');
        label.fill('red');
        label = over(label);
        label.hoverTxt = lang.dblclick;
        label = hover1(label, mdl.Hmat);
        label.on('dblclick tap', () => {
            alg.markCurrStep('curr');
            let thisObj = label;
            let str = thisObj.text();
            if (thisObj.sub.text() !== '') str += thisObj.sub.text();
            thisObj.text(str);
            let oldStr =thisObj.str;
            editable(thisObj, function (obj) {
                let s = obj.text().toUpperCase();
                if (s === '') return obj.text(oldStr);
                if (oldStr !== s) {
                    if (thisObj.id() === s) {
                        thisObj.fill(s.substr(0, 1) === 'C' ? 'RoyalBlue' : 'RosyBrown');
                        obj.text(s.substr(0, 1) + '_' + s.substr(1));
                        mdl.getLayer().batchDraw();
                        thisObj.off();

                        //check for labels
                        if (mdl.H_mat.colLabels.check() === true) { // right
                            mdl.H_mat.elmsVisible(true);
                            // check for control bit C0
                            if(props.errDet === 1){
                                mdl.H_mat.enableRowHL();
                                alg.increment();
                                mdl.H_mat.enable(false);
                                mdl.bitsPan.visible(true);
                            }else{
                                mdl.checkBtn.visible(true);
                                mdl.checkBtn.x(mdl.H_mat.x()+mdl.H_mat.width()/2 - mdl.checkBtn.width()/2);
                                mdl.checkMatrixId = 'H_mat';
                            }
                            mdl.getLayer().batchDraw();
                        }
                    } else { // error
                        thisObj.fill('red');
                        obj.text(s.substr(0, 1) + '_' + s.substr(1));
                        mdl.getLayer().batchDraw();
                        stat.error.add(lang.wrongLabelH_mat);
                        return thisObj.show('e', lang.wrongLabelH_mat);
                    }
                } else obj.text(s.substr(0, 1) + '_' + s.substr(1));
            }); // end of editable
        }); // end of dblclick tap
    });// end of forEach

    // check for correct H matrix labels place
    mdl.H_mat.colLabels.check = function(){
        for(let i=0; i<this.length; i++){
            if(mdl.H_mat.colLabels[i].fill() === 'red') return false;
        }
        return true;
    };

    //calculating last row for C0
    if(props.errDet === 2){
        for (let i = 0; i < size.c; i++) {
            let xor = 0;
            for (let j = 0; j < size.r; j++) xor ^= H_vals[j][i];
            H_vals[size.r - 1][i] = xor;
        }
        //enable H' matrix for editing
        mdl.H_mat.enable(true);
    }

    //check button
    mdl.checkBtn =  new Button({
        id: 'checkBtn',
        height: 25,
        defVal: lang.checkMat,
        txtSize: props.txtSize,
        clickable: true,
        fill: 'LightGrey'
    });
    mdl.mat.add(mdl.checkBtn);
    mdl.checkBtn.normPos = {x: mdl.Hmat.x() + mdl.Hmat.width()/2 - mdl.checkBtn.width()/2,
                            y: mdl.mat.height() - mdl.checkBtn.height() + 5};
    mdl.checkBtn.position(mdl.checkBtn.normPos);
    mdl.checkBtn.visible(false);

    // check button click event
    mdl.checkBtn.on('click touchstart', function(){
        if(inReg.vals.includes(undefined) === true)  { // check for all info bits
            this.hover.show('e',lang.setAllBit);
            return;
        }
        // change check button text and show H matrix
        if(this.txt.text() === lang.showHmat){
            this.txt.text(lang.checkMat);
            mdl.Hmat.visible(true);
            //mdl.tLabelsVisible(true);
            this.position(mdl.checkBtn.normPos);
            alg.increment();
            mdl.getLayer().batchDraw();
            return;
        }

        let check = mdl.checkMatrix();
        if(check !== true) {
            stat.error.add(check);
            mdl.checkBtn.hover.show('e', check);
            return;
        }

        // increment step
        if(alg.getCurrStep().name === 'setHmat' || alg.getCurrStep().name === 'setH_mat')  alg.increment();
    });

    // auto correct matix panel sizes
    mdl.mat.autoCorrSize();

    // current matrix's id for check
    mdl.checkMatrixId = 'Hmat';

    // check matrix function
    mdl.checkMatrix = function(obj){
        let cols = mdl.Hmat.size().c;
        let rows = mdl.Hmat.size().r;
        // H matrix check - labels and values
        if(mdl.checkMatrixId === 'Hmat'){
            // check for labels first
            if(mdl.Hmat.colLabels.check() === false){
                return lang.wrongLabelHmat;
            }

            // check for H matrix values
            for(let i=0; i<rows; i++)
                for(let j=0; j<cols; j++)
                    if(mdl.Hmat.vals[i][j] !== Hvals[i][j])  return lang.wrongMat+' (H)';

            mdl.H_mat.visible(true);
            mdl.Hmat.enable(false);
            // change button position to H' matrix bellow
            mdl.checkBtn.x(mdl.H_mat.x() + mdl.H_mat.width()/2 - mdl.checkBtn.width()/2);
            mdl.checkMatrixId = 'H_mat';
        }
        // H' matrix check
        else if (mdl.checkMatrixId === 'H_mat'){
            for(let i=0; i<rows; i++)
                for(let j=0; j<cols; j++)
                    if(mdl.H_mat.vals[i][j] !== H_vals[i][j]) return lang.wrongMat+' (H\')';

                mdl.H_mat.enable(false);
                mdl.H_mat.enableRowHL();
            mdl.bitsPan.visible(true);
            //alg.increment();
        }
        else return console.error('Incorrect matrix ID');
        mdl.checkBtn.visible(false);
        mdl.getLayer().batchDraw();
        return true;
    };


    //input bits panel
    mdl.bitsPan = new PANEL({
        id: 'inputBits',
        name: lang.cwBits,
        position: {
            x: mdl.mat.x(),
            y: mdl.mat.y() + mdl.mat.height()+20
        },
        type: 2,
        labelSize: 18,
    });
    mdl.bitsPan.dragmove(false);
    mdl.bitsPan.visible(false);
    mdl.bitsPan.size({width: mdl.mat.width(), height: 70});
    mdl.add(mdl.bitsPan);

    //load bits button
    mdl.loadBtn =  new Button({
        id: 'loadBtn',
        height: 25,
        defVal: lang.loadInfoBits,
        txtSize: 16,
        clickable: true,
        fill: 'LightGrey'
    });
    mdl.bitsPan.add(mdl.loadBtn);
    mdl.loadBtn.position({x: 20, y: 20});

    // load button click event
    mdl.loadBtn.on('click touchstart', function(){
        if(props.process ==='enc') mdl.loadInfo(inReg);
        else mdl.loadCW(inReg);
    });

    // required vals for bits objects and values
    mdl.selCbitId = '';
    mdl.bits = [];
    mdl.vals = [];

    //load codeword bits (decoding)
    mdl.loadCW = function(reg){
        mdl.bitsPan.visible(true);
        // increment step
        alg.increment();

        mdl.loadBtn.visible(false);
        let pos = [], relPos=[];
        let thisAbsPos = mdl.bitsPan.getAbsolutePosition();

        for(let i=0; i<mdl.Hmat.colLabels.length; i++) {
            if(i === 0){
                // first position
                relPos.push({x: 8, y: 29});
                pos.push({x:thisAbsPos.x + 8, y: thisAbsPos.y + 29});
            }else{
                pos.push({x: pos[pos.length-1].x + 26, y: pos[pos.length-1].y});
                relPos.push({x: relPos[relPos.length-1].x + 26, y: relPos[relPos.length-1].y});
            }

            //create bits
            let props = {};
            props.label = mdl.Hmat.colLabels[i].id().substr(0,1)+'_'+mdl.Hmat.colLabels[i].id().substr(1);
            props.name = 'Bit';
            props.id = mdl.Hmat.colLabels[i].id();
            props.fill = reg.bits[i].rect.fill();
            props.stroke = reg.bits[i].rect.stroke();
            props.txtColor = reg.bits[i].txt.fill();
            props.width = reg.bits[i].width();
            props.height = reg.bits[i].height();
            let bit = new Button(props);
            bit.text(reg.bits[i].text());
            bit.position(relPos[i]);
            bit.label.x(bit.rect.width()/2 - bit.label.width()/2);
            bit.label.y(bit.rect.y() - bit.label.height() - 0);

            //for control bits
            if(bit.id().substr(0,1) === 'C'){
                bit.fill('RoyalBlue');
                bit.hoverTxt = lang.selectCbit;
                bit = hover1(bit, mdl.bitsPan);

                bit.on('click touchstart', function(){
                    //check for calculated/checked result
                    let check = mdl.equ.konvaObjs.find(el => el.id === bit.id()).check;
                    if(check.visible() === true  && check.text().substr(check.text().length-1,1) !== '?'){
                        //error
                        return this.hover.show('e', lang.wasChecked);
                    }

                    // check for selected formula
                    if(mdl.equ.konvaObjs.find(el => el.id === bit.id()).formula.visible() === false){
                        // check for other selected control bit
                        if(mdl.selCbitId === '') mdl.selectCbit(bit.id());
                        else{
                            // error
                            stat.error.add(lang.аnotherSelCbit+' ('+bit.id()+')');
                            return this.hover.show('e', lang.аnotherSelCbit);
                        }
                        return;
                    }
                });

            }else
            {
                bit.enable(false);
            }

            //hide bit
            bit.visible(false);

            bit.scale({x:0.9,y:0.9});
            mdl.bitsPan.add(bit);
            mdl.bits.push(bit);
            mdl.vals.push(reg.vals[i]);

            //moving animation
            let cloneObj = reg.bits[i].clone();
            cloneObj.off();
            mdl.getLayer().add(cloneObj);
            cloneObj.position(reg.bits[i].getAbsolutePosition());
            cloneObj.moveToTop();
            mdl.getLayer().batchDraw();
            let movement = {};
            movement = new SmoothMovement(cloneObj.position(), pos[i]);
            movement.animate(
                10,
                function (pos) { // update function
                    cloneObj.position(pos);
                    mdl.getLayer().batchDraw();
                },
                function () { // closure function
                    cloneObj.scale({x:0.9,y:0.9});
                    cloneObj.destroy();
                    bit.txt.fontSize(bit.txt.fontSize()-2);
                    bit.visible(true);
                    if (i === reg.bits.length - 1) { // run its if it is last bit
                        // display equation panela
                        mdl.equ.visible(true);
                    }
                }
            );

            // change register's bit status
            reg.bits[i].active(false);
        } // end of for loop

        // creting equations for auto mode
        mdl.equ.autoCreate();

        // run auto functions of error analysis
        mdl.err.synd.setVals(mdl.equ.cbits);
        mdl.err.setErrStatus(mdl.H_mat);
        mdl.err.setErrPos(mdl.Hmat);

        mdl.getLayer().batchDraw();
        reg.disable(); // disable the register
    };

    // load information bits (encoding)
    mdl.loadInfo = function(reg){
        // increment step
        alg.increment();

        mdl.loadBtn.visible(false);
        let pos = [], relPos=[];
        let thisAbsPos = mdl.bitsPan.getAbsolutePosition();
        relPos.push({x: 8, y: 28});
        pos.push({x:thisAbsPos.x + 8, y: thisAbsPos.y + 28}); // first position
        for(let i=1; i<mdl.Hmat.colLabels.length; i++) {
            pos.push({x: pos[pos.length-1].x + 27, y: pos[pos.length-1].y});
            relPos.push({x: relPos[relPos.length-1].x + 27, y: relPos[relPos.length-1].y});
        }

        let infoIdx=0, controlIdx = props.errDet === 2 ? 0 : 1;
        for (let i = 0; i < mdl.Hmat.colLabels.length; i++) {
            let cloneObj = new Button({defVal: reg.bits[infoIdx].txt.text(), label:reg.bits[infoIdx].label.text(),
                width:reg.bits[infoIdx].width(), height:reg.bits[infoIdx].height()});
            cloneObj.position(mdl.Hmat.colLabels[i].position());
            cloneObj.id(mdl.Hmat.colLabels[i].id());
            cloneObj.fill(reg.bits[infoIdx].fill());
            cloneObj.txt.fill(reg.bits[infoIdx].txt.fill());
            cloneObj.txt.fontSize(reg.bits[infoIdx].txt.fontSize());
            cloneObj.label.position(reg.bits[infoIdx].label.position());
            cloneObj.off();

            //control bits by cloning info bit
            if(mdl.Hmat.colLabels[i].id().substr(0,1) === 'C'){
                mdl.vals.push(null);
                cloneObj.fill('RoyalBlue');
                cloneObj.text('?');
                cloneObj.label.text('C_'+(controlIdx++).toString());
                cloneObj.label.fill('RoyalBlue');

                cloneObj.scale({x:0.9,y:0.9});
                cloneObj.moveTo(mdl.bitsPan);
                cloneObj.position(relPos[i]);

                cloneObj.enable = function(){
                    cloneObj.hoverTxt = lang.selectCbit;
                    cloneObj = over(cloneObj);
                    cloneObj = hover1(cloneObj, mdl);
                    cloneObj.on('click touchstart', function(){
                        //check for calculated result
                        if(this.text() !== '?'){
                            //error
                            return this.hover.show('e', lang.wasCalculated);
                        }

                        // check for displayed formula
                        if(mdl.equ.konvaObjs.find(el => el.id === cloneObj.id()).formula.visible() === false){
                            // check for other selected control bit
                            if(mdl.selCbitId === '') mdl.selectCbit(cloneObj.id());
                            else{
                                // error
                                stat.error.add(lang.аnotherSelCbit+' ('+cloneObj.id()+')');
                                return this.hover.show('e', lang.аnotherSelCbit);
                            }
                            return;
                        }
                        // check for displayed bins
                        if(mdl.equ.konvaObjs.find(el => el.id === cloneObj.id()).bin.visible() === false){
                            //error
                            stat.error.add(lang.noEqu+' ('+cloneObj.id()+')');
                            return this.hover.show('e', lang.noEqu);
                        }
                        // check for correct result
                        if(mdl.equ.checkRes(cloneObj.id()) !== true){
                            // error
                            stat.error.add(lang.wrongCval+' ('+cloneObj.id()+')');
                            return this.hover.show('e',lang.wrongCval);
                        }

                        // mark selected cbit Id as empty
                        mdl.selCbitId = cloneObj.id();

                        // increment step for calc equation
                        if(alg.getCurrStep().name === 'calcCbit') alg.increment();

                        // write the control bit result
                        mdl.writeCbit(cloneObj.id());
                    });
                };
                cloneObj.enable();
                mdl.getLayer().batchDraw();
            }
            // moving animation for info bits
            else{
                mdl.vals.push(reg.vals[infoIdx]);
                mdl.getLayer().add(cloneObj);
                cloneObj.position(reg.bits[infoIdx].getAbsolutePosition());
                cloneObj.moveToTop();
                mdl.getLayer().batchDraw();
                reg.bits[infoIdx].active(false);
                infoIdx++;
                let movement = {};
                movement = new SmoothMovement(cloneObj.position(), pos[i]);
                movement.animate(
                    10,
                    function (pos) { // update function
                        cloneObj.position(pos);
                        mdl.getLayer().batchDraw();
                    },
                    function () { // closure function
                        cloneObj.scale({x:0.9,y:0.9});
                        cloneObj.moveTo(mdl.bitsPan);
                        cloneObj.position(relPos[i]);
                        if (i === reg.bits.length - 1) { // run its if it is last bit
                            // display equation panela
                            mdl.equ.visible(true);
                        }
                    }
                );
            }
            //cloneObj.txt.fontSize(cloneObj.txt.fontSize()-2);
            mdl.bits.push(cloneObj);
        }

        reg.disable(); // disable the register

        // creting equations for auto mode
        mdl.equ.autoCreate();
        return true;
    };

    // Equation panel
    mdl.equ = new PANEL({
        id: 'equPanel',
        name: lang.equBtnTxt,
        position: {
            x: mdl.mat.x(),
            y: mdl.bitsPan.y() + mdl.bitsPan.size().height + 20
        },
        type: 2,
        labelSize: 18
    });
    mdl.equ.visible(false);
    mdl.equ.dragmove(false);
    mdl.equ.size({width: mdl.bitsPan.width(), height: 140});
    mdl.add(mdl.equ);

    //equation auto create cbits
    mdl.equ.autoCreate = function(){
        mdl.equ.cbits = [];
        let m = props.bitsNum - props.checkBits;
        let cbitIdx = m;
        for(let i=0; i<size.r; i++){
            let obj = {};
            obj.id = mdl.H_mat.colLabels[cbitIdx++].id();
            obj.mems = [];
            obj.bins = [];
            obj.res = 0;
            obj.formula = '';

            obj.mems.push(obj.id); //insert cbit id first
            if(props.process === 'dec'){
                obj.bins.push(mdl.vals[mdl.bits.findIndex(b => b.id() === obj.id)]); // insert cbit value in binary
                obj.res ^= mdl.vals[mdl.bits.findIndex(b => b.id() === obj.id)]; // xor cbit value
            }
            for(let j=0; j<m; j++) {
                if(H_vals[i][j] === 1) {
                    obj.mems.push(mdl.H_mat.colLabels[j].id());
                    let val = mdl.vals[mdl.Hmat.colLabels.findIndex(el => el.id() === mdl.H_mat.colLabels[j].id())];
                    obj.bins.push(val);
                    obj.res ^= val;
                }
            }

            // create the formula string
            obj.formula = obj.mems.toString().replace(/,/g,'\u2295') + ' = 0';
            // append to cbit array
            mdl.equ.cbits.push(obj);
        }

        // show equation panel
        mdl.equ.visible(true);
    };

    // equation texts
    mdl.equ.konvaObjs=[];
    for(let i=props.checkBits-1; i>=0; i--){
        let txtColor = mdl.Hmat.title.fill();
        let bit = {};
        let n = props.errDet === 2 ? i : (i+1);
        bit.id =  'C'+n;

        //formula
        bit.formula = new Konva.Text({
            id: 'C'+n+'formula',
            fontSize: props.txtSize - 2,
            text: '?\u2295?\u2295?\u2295?\u2295?\u2295?\u2295?\u2295?\u2295?\u2295? = 0',
            fill: 'red',
            visible: false
        });
        mdl.equ.add(bit.formula);
        bit.formula = over(bit.formula);
        bit.formula.hoverTxt = lang.setEqu;
        bit.formula = hover1(bit.formula, mdl);
        if(i === props.checkBits-1) bit.formula.position({x:8, y:15});
        else {
            bit.formula.x(mdl.equ.konvaObjs[mdl.equ.konvaObjs.length-1].formula.x());
            bit.formula.y(mdl.equ.konvaObjs[mdl.equ.konvaObjs.length-1].formula.y()+25);
        }
        let width = bit.formula.width();
        bit.formula.on('dblclick tap', function(){
            let thisObj =  bit.formula.text;
            alg.markCurrStep('curr');
            let str =  this.text();
            let oldStr = thisObj.str;
            str = str.replace(/\u2295/g, '+');
            this.text(str);

            editable(this, function(obj){
                let s = obj.text().toUpperCase();
                s = s.replace('=', '');
                s = s.replace('C0','C9');
                s = s.replace('0', '');
                s = s.replace(/\s/g, ''); //clear spaces
                s = s.split("+").sort().toString().replace(/,/g, '\u2295') + ' = 0';
                s = s.replace('C9','C0');
                //s = s.replace(/\+/g, '\u2295');
                bit.formula.text(s);
                if(s === '') return obj.text(oldStr);
                if(oldStr !== s.replace(/\u2295/g, '+')){
                    bit.formula.text(s);
                    if(mdl.equ.checkFormula(bit.id) === false){
                        bit.formula.fill('red');
                        bit.formula.hover.show('e',lang.wrongEqu);
                        stat.error.add(lang.wrongEqu+'('+bit.id+')');
                        return;
                    }
                    bit.formula.fill(txtColor);
                    bit.formula.off();
                    mdl.equ.showBins(bit.id);
                }
                else console.log('No change');
            }, width);
        });

        //bin
        if(props.process === 'enc'){
            text = 'C'+n+' = ?\u2295?\u2295?\u2295?\u2295?\u2295?\u2295? = ?';
        }

        else
            text = '?\u2295?\u2295?\u2295?\u2295?\u2295?\u2295?\u2295? = ?';
        bit.bin = new Konva.Text({
            id: 'C'+n+'bin',
            fontSize: props.txtSize - 2,
            text: text,
            fill: 'red',
            visible: false
        });
        mdl.equ.add(bit.bin);
        bit.bin.position({x: mdl.equ.width()/2, y: bit.formula.y()});

        bit.bin = over(bit.bin);
        bit.bin.hoverTxt = lang.calcCbit;
        bit.bin = hover1(bit.bin, mdl);

        bit.bin.on('click touchstart', function(){
            let str = this.text();
            let lastStr = str.substr(str.length-1, 1);
            lastStr = lastStr === '1' ? '0' : '1';
            this.text(str.substr(0,str.length-1)+lastStr);
            alg.markCurrStep('curr');
            mdl.getLayer().batchDraw();
        });

        // creating check text of control bits for decoding process
        if(props.process === 'dec'){
            bit.check = new Konva.Text({
                id: 'C'+n+'check',
                fontSize: props.txtSize - 2,
                text: bit.id + ' \u21D2 ?',
                fill: 'red',
                visible: false
            });
            mdl.equ.add(bit.check);
            bit.check.position({x: mdl.equ.width() - 70, y: bit.formula.y()});
            bit.check.hoverTxt = lang.writeCbitCheck;
            bit.check = over(bit.check);
            bit.check = hover1(bit.check, mdl.equ);
            bit.check.on('click touchstart', function(){
                if(mdl.selCbitId !== bit.id) return this.hover.show('e',lang.wasChecked);
                if(mdl.equ.checkRes(bit.id) !== true) {
                    stat.error.add(lang.wrongCbitCheck+' ('+bit.id+')');
                    this.fill('red');
                    return this.hover.show('e',lang.wrongCbitCheck);
                }
                this.fill(txtColor);
                mdl.equ.konvaObjs.find(obj => obj.id === bit.id).bin.fill(txtColor);
                let str = bit.check.text().substr(0, bit.check.text().length-1) + mdl.equ.cbits.find(b => b.id === bit.id).res.toString();
                bit.check.text(str);

                mdl.bits.find(b => b.id() === bit.id).rect.stroke('');
                mdl.selCbitId = '';
                alg.increment(); // for control bit calculation
                alg.increment(); // for control bit write

                //if it's last control bit show the result analysis panel
                for(let i=0; i<mdl.equ.konvaObjs.length; i++) {
                    if(mdl.equ.konvaObjs[i].check.visible() === false) break;
                    if(i === mdl.equ.konvaObjs.length-1) mdl.err.visible(true);
                }

                mdl.getLayer().batchDraw();
                //bit.check.off();
            });
        }

        mdl.equ.konvaObjs.push(bit);
        if(i===0) {
            mdl.equ.size({height: 10 + (bit.formula.height()+12)*mdl.equ.konvaObjs.length});
            let bottomY = mdl.equ.y() + mdl.equ.height()+20;
            if(bottomY > mdl.height()) mdl.size({height: bottomY});
        }
    }// end of for loop

    // check formula
    mdl.equ.checkFormula = function(cbitId){
        let thisKonvaObj = mdl.equ.konvaObjs.find(elm => elm.id === cbitId);
        let thisCbit = mdl.equ.cbits.find(elm => elm.id === cbitId);
        let formula = thisKonvaObj.formula.text().toString().replace(/\+/g,',');
        if(formula === thisCbit.formula)  return true;
        return false;
    };

    mdl.equ.checkRes = function(cbitId){
        let thisKonvaObj = mdl.equ.konvaObjs.find(elm => elm.id === cbitId);
        let thisCbit = mdl.equ.cbits.find(elm => elm.id === cbitId);
        let res = Number(thisKonvaObj.bin.text().substr(thisKonvaObj.bin.text().length-1,1));
        if(res !== thisCbit.res) return false;
        return true;
    };

    mdl.equ.binsInsert = function(){
        let str='';
        let cbit = mdl.equ.cbits.find(elm => elm.id === mdl.selCbitId);
        str = cbit.bins.toString();
        str = str.replace(/,/g,'\u2295');
        str += ' = ?';
        let thisKonvaObj = mdl.equ.konvaObjs.find(elm => elm.id === mdl.selCbitId);
        if(props.process === 'enc')
            thisKonvaObj.bin.text('\u21D2   '+mdl.selCbitId+' = '+str); // for encoding process
        else{
            thisKonvaObj.bin.text('\u21D2   '+str);  // for decoding process
            thisKonvaObj.check.visible(true);
        }
        thisKonvaObj.bin.visible(true);
    };

    // display control bit formula
    mdl.equ.showBins = function(cbitId){
        let str = '', txtColor = '';
        let cbit = {};
        // for auto mode
        if(typeof cbitId === 'undefined') {
            cbitId =  mdl.selCbitId;
            cbit = mdl.equ.cbits.find(elm => elm.id === cbitId);
            str = cbit.bins.toString();
            str = str.replace(/,/g,'\u2295');
            str += ' = '+cbit.res;
            txtColor = props.txtColor;
        }

        let thisKonvaObj = mdl.equ.konvaObjs.find(elm => elm.id === cbitId);
        // for auto mode
        if(props.process === 'enc'){

            thisKonvaObj.bin.text('\u21D2   '+cbitId+' = '+str);
        }
        else{ // for decoding
            thisKonvaObj.bin.text('\u21D2   '+ str);
            //thisKonvaObj.bin.x(thisKonvaObj.formula.x() + thisKonvaObj.formula.width());
            thisKonvaObj.check.visible(true);
        }

        thisKonvaObj.bin.visible(true);
        if(txtColor !== '') thisKonvaObj.bin.fill(txtColor);

        //for auto mode
        if(str.substr(str.length-1, 1) !== '?')  thisKonvaObj.bin.off();

        alg.increment(); // increment step
        mdl.getLayer().batchDraw();
    };

    // display control bit formula
    mdl.equ.showFormula = function(cbitId){
        let str = '', txtColor = '';
        // for auto mode
        if(typeof cbitId === 'undefined') {
            cbitId =  mdl.selCbitId;
            let cbit = mdl.equ.cbits.find(elm => elm.id === cbitId);
            // str = cbit.mems.toString() + ' = 0';
            // str = str.replace(/,/g,'\u2295');
            str = cbit.formula;
            txtColor = props.txtColor;
            //mdl.equ.showBins(mdl.selCbitId);
            mdl.equ.binsInsert();
        }

        let thisKonvaObj = mdl.equ.konvaObjs.find(elm => elm.id === cbitId);
        if(str !== '') { //check for auto mode
            // if(props.process === 'enc') thisKonvaObj.formula.text(cbitId+' = '+str);
            // else                        thisKonvaObj.formula.text(str);
            thisKonvaObj.formula.text(str);
            thisKonvaObj.formula.off();
        }
        thisKonvaObj.formula.visible(true);
        if(txtColor !== '') thisKonvaObj.formula.fill(txtColor);

        if(str.substr(str.length-1, 1) !== '?') {
            alg.increment();  // increment step for auto mode
        }

        mdl.getLayer().batchDraw();
    };

    //create control bit order for auto mode
    mdl.cbitOrder = [];
    mdl.cbitIdx=0;
    mdl.H_mat.colLabels.forEach(label =>{
        if(label.id().substr(0,1) === 'C') mdl.cbitOrder.push(label.id());
    });

    // select control bit
    mdl.selectCbit = function(cbitId){
        // for auto mode
        if(typeof cbitId === 'undefined'){
            cbitId = mdl.cbitOrder[mdl.cbitIdx++];
            mdl.selCbitId = cbitId;
        }

        mdl.bits.find(bit => bit.id() === cbitId).rect.stroke('red');

        mdl.equ.showFormula(cbitId); //display formula for writing
        mdl.selCbitId = cbitId; // set this cbit as selected

        // change hover text only for encoding
        if(props.process === 'enc')mdl.bits.find(e => e.id() === cbitId).hoverTxt = lang.writeCbitVal;
        //step incremented in showFormula()
    };

    // write control bit result
    mdl.writeCbit = function(cbitId){
        // for auto mode
        if(typeof cbitId === 'undefined') {
            cbitId =  mdl.selCbitId;
        }

        let konvaObj = mdl.equ.konvaObjs.find(e => e.id === cbitId);

        let res = mdl.equ.cbits.find(el => el.id === cbitId).res;
        if(props.process === 'enc'){
            let thisCbit = mdl.bits.find(el => el.id() === cbitId);
            thisCbit.txt.text(res.toString());
            //write the result in val array
            mdl.vals[mdl.bits.findIndex(e => e.id() === cbitId)] = res;
            konvaObj.bin.fill(props.txtColor);
        }
        else{ // for decoding

            let str = konvaObj.check.text().substr(0, konvaObj.check.text().length-1) + mdl.equ.cbits.find(b => b.id === cbitId).res.toString();
            konvaObj.check.fill(props.txtColor);
            konvaObj.check.text(str);
            konvaObj.check.off();

            //if it's last control bit show the result analysis panel
            if(mdl.equ.cbits[mdl.equ.cbits.length-1].id === cbitId) mdl.err.visible(true);
        }

        // turn off konva events
        mdl.equ.konvaObjs.find(el => el.id === cbitId).bin.off();

        // clear last selected control bit
        mdl.bits.find(bit => bit.id() === cbitId).rect.stroke('');

        // mark selected cbitId as empty
        mdl.selCbitId = '';

        // increment step
        alg.increment();

        mdl.getLayer().batchDraw();
    };

    // change Z index order
    mdl.equ.setZIndex(7);
    mdl.bitsPan.setZIndex(8);

    // show H_mat column labels
    mdl.showH_columns = function(){
        mdl.H_mat.colLabels.forEach(l =>{
            l.fill(l.id().substr(0,1) === 'C' ? 'RoyalBlue' : 'RosyBrown');
            l.text(l.id().substr(0,1)+'_'+l.id().substr(1))
        });
        mdl.getLayer().batchDraw();
    };

    // show H matrix columns
    mdl.showHcolumns = function(){
        mdl.checkBtn.position(mdl.checkBtn.normPos);
        mdl.Hmat.colLabels.forEach(l =>{
            l.fill(l.id().substr(0,1) === 'C' ? 'RoyalBlue' : 'RosyBrown');
            l.text(l.id().substr(0,1)+'_'+l.id().substr(1))
        });
        mdl.getLayer().batchDraw();
    };

    // show H_mat
    mdl.H_mat.show = function(){
        // increment step
        alg.increment();
        mdl.showH_columns();
        mdl.H_mat.setVals(H_vals);
        mdl.H_mat.update();
        mdl.H_mat.visible(true);
        mdl.H_mat.elmsVisible(true);
        mdl.H_mat.enableRowHL();
        mdl.bitsPan.visible(true);
        // change button position to H' matrix bellow
        //mdl.checkBtn.x(mdl.H_mat.x() + mdl.H_mat.width()/2 - mdl.checkBtn.width()/2);
        mdl.checkBtn.visible(false);
        mdl.checkMatrixId = 'H_mat';
        mdl.getLayer().batchDraw();
    };

    // show Hmat
    mdl.HmatSize.show = function(){
        mdl.HmatSize.valTxt.text(props.checkBits+' x '+props.bitsNum);
        mdl.HmatSize.valTxt.fill(props.txtColor);
        mdl.HmatSize.valTxt.off();
        alg.increment();
        mdl.Hmat.visible(true);
        mdl.checkBtn.visible(true);
        mdl.getLayer().batchDraw();
    };


    // show Hmat
    mdl.Hmat.show = function(){
        // increment step
        alg.increment();
        //mdl.HmatSize.visible(false);
        mdl.showHcolumns();
        mdl.Hmat.enable(false);
        mdl.Hmat.setVals(Hvals);
        mdl.Hmat.update();
        mdl.Hmat.visible(true);
        mdl.checkBtn.visible(false);
        mdl.checkBtn.txt.text(lang.checkMat);
        // show H' matrix
        mdl.H_mat.visible(true);
        mdl.getLayer().batchDraw();
    };

    // Result analysis panel for decoding process
    if(props.process === 'dec'){
        mdl.err = new PANEL({
            id: 'error panel',
            name: lang.resultAnalysis,
            position: {
                x: mdl.equ.x(),
                y: mdl.equ.y() + mdl.equ.height() + 20
            },
            type: 2,
            labelSize: 18
        });
        mdl.err.visible(false);
        mdl.err.dragmove(false);
        mdl.err.size({width: mdl.equ.width(), height: 140});
        mdl.add(mdl.err);
        // increase mdl height
        mdl.size({height: mdl.err.y()+mdl.err.height() + 20});

        // SYNDROME
        mdl.err.synd= new Konva.Group({x: 5, y: 5});
        mdl.err.add(mdl.err.synd);
        // syndrome title
        mdl.err.synd.title = new Konva.Text({
            id: 'sindTitle',
            fontSize: props.txtSize - 2,
            text: lang.errSyndrome+' \u21D2 ',
            fill: props.txtColor,
            visible: true
        });
        mdl.err.synd.add(mdl.err.synd.title);
        mdl.err.synd.title.position({x:8, y: 0});

        // syndrome values
        mdl.err.synd.vals = [];
        mdl.err.synd.setVals = function(cbits){
            cbits.forEach(cbit => {
                mdl.err.synd.vals.push(cbit.res);
            });
        };

        // syndrome column
        mdl.err.synd.cbits = [];
        let pos = {x: mdl.err.synd.title.x() + mdl.err.synd.title.width()+12, y:15};
        let m = props.bitsNum-props.checkBits;
        for(let i=m; i<colLabels1.length; i++){
            let cbit =  new Konva.Text({
                id:colLabels1[i],
                fontSize: props.txtSize,
                text: '?',
                fill: 'red'
            });
            cbit.position(pos);
            mdl.err.synd.add(cbit);
            pos.y += cbit.height() + 3;
            cbit = over(cbit);
            cbit.hoverTxt = lang.setVal;
            cbit = hover1(cbit, mdl.err);
            cbit.on('click touchstart', function(){
                this.text(this.text() === '0' ? '1':'0');
                mdl.getLayer().batchDraw();
                alg.markCurrStep('curr');
            });
            mdl.err.synd.cbits.push(cbit);
        }

        // put title in the middle
        let y = mdl.err.synd.cbits[mdl.err.synd.cbits.length-1].y() + mdl.err.synd.cbits[mdl.err.synd.cbits.length-1].height() - mdl.err.synd.cbits[0].y();
        y /= 2;
        mdl.err.synd.title.y(y+mdl.err.synd.title.height()/2);

        // CHECK BUTTON
        mdl.err.checkBtn = new Button({
            id: 'checkBtn',
            height: 25,
            defVal: lang.check,
            txtSize: 16,
            clickable: true,
            fill: 'LightGrey'
        });
        //mdl.err.checkBtn.visible(false);
        mdl.err.add(mdl.err.checkBtn);
        mdl.err.checkBtn.position({x: mdl.err.synd.cbits[0].x()+30, y: mdl.err.synd.title.y()});
        mdl.err.checkBtn.on('click touchstart', function(){
            if(mdl.err.checkSynd() === true){
                mdl.err.synd.cbits.forEach(cbit => {
                    cbit.fill(mdl.err.synd.title.fill());
                    cbit.off();
                    mdl.err.status.visible(true);
                });
                this.visible(false);
            }
            else{
                mdl.err.synd.cbits.forEach(cbit => {cbit.fill('red');});
                stat.error.add(lang.wrongSyndrome);
                return this.hover.show('e',lang.wrongSyndrome);
            }

            mdl.getLayer().batchDraw();
        });

        // open brackets
        mdl.err.synd.openB = new Konva.Line({ // open bracket
            id:'openB',
            stroke: mdl.err.synd.title.fill(),
            strokeWidth: 2
        });
        mdl.err.synd.add(mdl.err.synd.openB);
        let bP = mdl.err.synd.cbits[0].position(); // begin point
        let eP = mdl.err.synd.cbits[mdl.err.synd.cbits.length-1].position(); // end point
        bP.x -= 4;
        bP.y -= 2;
        eP.x = bP.x;
        eP.y += 2 + mdl.err.synd.cbits[mdl.err.synd.cbits.length-1].height();
        mdl.err.synd.openB.points([bP.x,bP.y,  bP.x-8,bP.y,  eP.x-8,eP.y, eP.x,eP.y]);

        // close bracket
        mdl.err.synd.closeB = mdl.err.synd.openB.clone();
        mdl.err.synd.closeB.id(mdl.err.synd.id()+'closeB');
        mdl.err.synd.add(mdl.err.synd.closeB);
        bP.x += 8 + mdl.err.synd.cbits[0].width();
        eP.x = bP.x;
        mdl.err.synd.closeB.points([bP.x,bP.y,  bP.x+8,bP.y,  eP.x+8,eP.y, eP.x,eP.y]);

        // ERROR STATUS
        mdl.err.status = new Konva.Group({x: mdl.err.synd.cbits[0].x()+40, y: 20});
        mdl.err.add(mdl.err.status);
        mdl.err.status.visible(false);

        // error status val
        mdl.err.status.val = -1;
        // error status - no error
        mdl.err.status.noError = new Konva.Text({ fontSize: props.txtSize-1, text: lang.noErr, fill: 'grey'});
        mdl.err.status.add(mdl.err.status.noError);
        mdl.err.status.noError = over(mdl.err.status.noError);
        mdl.err.status.noError.hoverTxt = lang.selectErr;
        mdl.err.status.noError = hover1(mdl.err.status.noError, mdl.err);
        mdl.err.status.noError.on('click touchstart', function(){
            if(mdl.err.status.val === '0'){
                this.fill(mdl.err.synd.title.fill());
                mdl.err.setDecMessage();
                mdl.err.decMessage.visible(true);
                mdl.getLayer().batchDraw();
            }
            else{
                stat.error.add(lang.wrongErrStatus);
                this.hover.show('e', lang.wrongErrStatus);
            }
        });

        // error status - single error
        mdl.err.status.sError = new Konva.Text({ fontSize: props.txtSize-1, text: lang.singleErr, fill: 'grey'});
        mdl.err.status.add(mdl.err.status.sError);
        mdl.err.status.sError.y(mdl.err.status.noError.y() + mdl.err.status.noError.height() + 20);
        mdl.err.status.sError = over(mdl.err.status.sError);
        mdl.err.status.sError.hoverTxt = lang.selectErr;
        mdl.err.status.sError = hover1(mdl.err.status.sError, mdl.err);
        mdl.err.status.sError.on('click touchstart', function(){
            if(mdl.err.status.val !== '0' && mdl.err.status.val !== '2'){
                this.fill(mdl.err.synd.title.fill());
                mdl.err.pos.visible(true);
                mdl.getLayer().batchDraw();
            }
            else{
                stat.error.add(lang.wrongErrStatus);
                this.hover.show('e', lang.wrongErrStatus);
            }
        });

        // error status - double error
        mdl.err.status.dError = new Konva.Text({ fontSize: props.txtSize-1, text: lang.doubleErr, fill: 'grey'});
        mdl.err.status.add(mdl.err.status.dError);
        mdl.err.status.dError.y(mdl.err.status.sError.y() + mdl.err.status.sError.height() + 20);
        mdl.err.status.dError = over(mdl.err.status.dError);
        mdl.err.status.dError.hoverTxt = lang.selectErr;
        mdl.err.status.dError = hover1(mdl.err.status.dError, mdl.err);
        mdl.err.status.dError.on('click touchstart', function(){
            if(mdl.err.status.val === '2'){
                this.fill(mdl.err.synd.title.fill());
                mdl.getLayer().batchDraw();
                alg.increment();
            }
            else{
                stat.error.add(lang.wrongErrStatus);
                this.hover.show('e', lang.wrongErrStatus);
            }
        });

        // error position
        mdl.err.pos = new Konva.Group({x: mdl.err.status.x()+mdl.err.status.noError.width()+60, y:  mdl.err.status.y()});
        mdl.err.add(mdl.err.pos);
        mdl.err.pos.visible(false);
        // error position value
        mdl.err.pos.val = -1;
        // error position title
        mdl.err.pos.title = new Konva.Text({ fontSize: props.txtSize-1, text: lang.errorPos+': ', fill: mdl.err.synd.title.fill()});
        mdl.err.pos.add(mdl.err.pos.title);
        // error position text
        mdl.err.pos.txt = new Konva.Text({ fontSize: props.txtSize-1, text: '??', fill: 'red'});
        mdl.err.pos.add(mdl.err.pos.txt);
        mdl.err.pos.txt.x(mdl.err.pos.title.width()+5);
        mdl.err.pos.txt = over(mdl.err.pos.txt);
        mdl.err.pos.txt.hoverTxt = lang.setDecCode;
        mdl.err.pos.txt = hover1(mdl.err.pos.txt, mdl.err.pos);
        mdl.err.pos.txt.on('dblclick tap', function(){
            let thisObj =  this;
            let str = this.text();
            let oldStr =thisObj.str;
            editable(thisObj, function(obj){
                let s = obj.text().toUpperCase();
                if(s === '') return obj.text(oldStr);
                if(oldStr !== s){
                    if(mdl.err.pos.val === s){
                        thisObj.fill(mdl.err.pos.title.fill());
                        mdl.getLayer().batchDraw();
                        thisObj.off();
                        mdl.err.correctCW();
                        mdl.err.setDecMessage();
                    }
                    else {
                        stat.error.add(lang.wrongDecCode);
                        thisObj.fill('red');
                        return thisObj.hover.show('e', lang.wrongDecCode);
                    }
                }
                else console.log('No change');
            });
        });

        // DECODED MESSAGE PANEL
        mdl.err.decMessage = new PANEL({
            id: 'decMsg panel',
            name: lang.decodedMsg,
            position: {
                x: mdl.err.pos.x(),
                y:mdl.err.pos.y() + mdl.err.pos.txt.height() + 35
            },
            type: 2,
            labelSize: 18
        });
        mdl.err.add(mdl.err.decMessage);
        mdl.err.decMessage.visible(false);
        mdl.err.decMessage.dragmove(false);
        mdl.err.decMessage.size({ height: 50});
        mdl.err.decMessage.size({width: mdl.err.width() - mdl.err.decMessage.x() - 10});
        // decoded message txt
        mdl.err.decMessage.txt = new Konva.Text({ fontSize: props.txtSize+2, text: '?????????????????', fill: 'red',
            width: mdl.err.decMessage.width()-40,
            // height: mdl.err.decMessage.height(),
            align: 'center', verticalAlign: 'middle'
        });

        mdl.err.decMessage.add(mdl.err.decMessage.txt);
        mdl.err.decMessage.val ='';
        mdl.err.decMessage.txt.position({x:20, y: 20});
        mdl.err.decMessage.txt.hoverTxt = lang.writeDecMsg;
        mdl.err.decMessage.txt = over(mdl.err.decMessage.txt);
        mdl.err.decMessage.txt = hover1(mdl.err.decMessage.txt, mdl.err);
        mdl.err.decMessage.txt.on('dblclick tap', function(){
            let thisObj =  this;
            let str =  this.text();
            let oldStr =thisObj.str;
            editable(thisObj, function(obj){
                let s = obj.text().toUpperCase();
                if(s === '') return obj.text(oldStr);
                if(oldStr === s) return console.log('No change');
                // check
                if(mdl.err.decMessage.val === s){
                    thisObj.fill(mdl.err.pos.title.fill());
                    mdl.getLayer().batchDraw();
                    thisObj.off();
                    alg.increment();
                }
                else {
                    stat.error.add(lang.wrongDecMsg);
                    thisObj.fill('red');
                    return thisObj.hover.show('e', lang.wrongDecMsg);
                }
            });
        });

        // set decoded message
        mdl.err.setDecMessage = function(){
            let vals = [];
            mdl.bits.forEach(b => {
                if(b.id().substr(0,1) === 'S') vals.push(b.text());
            });
            vals = vals.toString();
            vals = vals.replace(/,/g, '');
            mdl.err.decMessage.val = vals;
            mdl.err.decMessage.visible(true);
        };

        // check syndrome
        mdl.err.checkSynd = function(){
          for(let i=0; i<mdl.err.synd.vals.length; i++){
              if(mdl.err.synd.vals[i].toString() !== mdl.err.synd.cbits[i].text()) return false;
          }
          return true;
        };

        // set error syndrome for auto mode
        mdl.err.setSynd = function(){
            for(let i=0; i<mdl.err.synd.vals.length; i++){
                mdl.err.synd.cbits[i].text(mdl.err.synd.vals[i].toString());
                mdl.err.synd.cbits[i].fill(mdl.err.synd.title.fill());
                mdl.err.synd.cbits[i].off();
            }
        };

        //correct the codeword
        mdl.err.correctCW = function(){
            let idx = mdl.Hmat.colNums.findIndex(n => n.text() === mdl.err.pos.val);
            let bit = mdl.bits[idx];
            mdl.vals[idx] = mdl.vals[idx] === 0 ? 1 : 0;
            bit.text(mdl.vals[idx].toString());
            bit.rect.fill('green');
            mdl.getLayer().batchDraw();
        };

        // set error status
        mdl.err.setErrStatus = function(H_mat){
            if(typeof H_mat === 'undefined') return console.error('There is no H\' matrix');
            // check for no error
            if(Math.max(...mdl.err.synd.vals) === 0){
                mdl.err.status.val = '0';
                return;
            }

            let rows = H_mat.vals.length;
            let cols = H_mat.vals[0].length;
            for(let i=0; i<cols; i++)
                for(let j=0; j<rows; j++){
                    if(H_mat.vals[j][i] !== mdl.err.synd.vals[j]) break;
                    if(j === rows-1) {
                        mdl.err.status.val = H_mat.colLabels[i].id();
                        return;
                    }
                }
            mdl.err.status.val = '2';
        };

        // set error position
        mdl.err.setErrPos = function(Hmat){
            if(mdl.err.status.val === '0' || mdl.err.status.val === '2') return ;
            let idx = Hmat.colLabels.findIndex(label => label.id() === mdl.err.status.val);
            mdl.err.pos.val = Hmat.colNums[idx].text();
        };

        // show result analysis for auto mode
        mdl.err.showAnalysis = function(){
            // show syndrome
            mdl.err.setSynd();
            mdl.err.checkBtn.visible(false);
            mdl.err.status.visible(true);
            //console.log('mdl.err.status.val',mdl.err.status.val);
            // show error status and the decoded message
            if(mdl.err.status.val === '0'){
                mdl.err.status.noError.fill(mdl.err.synd.title.fill());
                mdl.err.setDecMessage();
                mdl.err.decMessage.visible(true);
                mdl.err.decMessage.txt.text(mdl.err.decMessage.val);
                mdl.err.decMessage.txt.fill(mdl.err.synd.title.fill());
            }
            else if(mdl.err.status.val !== '1' && mdl.err.status.val !== '2'){
                mdl.err.status.sError.fill(mdl.err.synd.title.fill());
                mdl.err.pos.visible(true);
                mdl.err.pos.txt.text(mdl.err.pos.val.toString());
                mdl.err.pos.txt.fill(mdl.err.synd.title.fill());
                mdl.err.correctCW();
                mdl.err.setDecMessage();
                mdl.err.decMessage.visible(true);
                mdl.err.decMessage.txt.text(mdl.err.decMessage.val);
                mdl.err.decMessage.txt.fill(mdl.err.synd.title.fill());
            }
            else if(mdl.err.status.val === '2'){
                mdl.err.status.dError.fill(mdl.err.synd.title.fill());
            }

            mdl.err.status.noError.off();
            mdl.err.status.sError.off();
            mdl.err.status.dError.off();
            mdl.err.pos.txt.off();
            mdl.err.decMessage.txt.off();

            mdl.getLayer().batchDraw();
            alg.increment();
        };
    }

    return mdl;
}// END of HAMMING MATRIX ALGORITHM


// MATRIX component
function MATRIX(props){
    if(typeof props === 'undefined') props={};
    props.id = props.id || 'mat';
    props.title = props.title || 'MAT';
    props.cols = props.cols || 12;
    props.rows = props.rows || 4;
    props.txtColor = props.txtColor || 'Navy';
    props.txtSize = props.txtSize || 23;
    props.labelColor = props.labelColor || 'Navy';
    props.labelSize = props.labelSize || 20;
    props.firstColNum = props.firstColNum || '';
    props.colLabels = props.colLabels || '';
    props.rowLabels = props.rowLabels || '';
     let cols = props.cols;
     let rows = props.rows;
    // matrix group
    let mat = new Konva.Group ({
        id: props.id,
        name: props.name,
        draggable:false
    });
    // matrix vals
    mat.vals=[];
    for(let i=0; i<props.rows; i++) {
        mat.vals[i] = [];
        for (let j = 0; j < props.cols; j++){
            if(props.randVals === true) mat.vals[i][j] = (Math.random() > 0.5) ? 1 : 0;
            else mat.vals[i][j] = 0;
        }
    }

    // matrix's label
    mat.title = new Konva.Text({
        id: mat.id()+'-title',
        text: props.title+' = ',
        fontSize: props.labelSize,
        fontFamily: 'Calibri',
        padding: 0,
        align: 'center',
        verticalAlign: 'middle',
        fill: props.labelColor
    });
    mat.add(mat.title);

    // BIT properties
    if (typeof props.bit === 'undefined') props.bit = {};

    // Matrix elements
    props.bit.name = 'Bit';
    props.bit.hoverTxt = props.bit.hoverTxt || 'Set val';
    props.bit.fill = 'RosyBrown';
    props.bit.stroke = 'RosyBrown';
    props.bit.txtColor = 'black';
    props.bit.defVal = '';
    props.bit.margin = 4;
    mat.elms=[]; // empty array for register's bits
    // first element position
    let addDist = 6;
    let pos = {x: mat.title.x()+mat.title.width()+addDist*3.5, y: mat.title.y()};

    for(let i=0; i<rows; i++){
        mat.elms[i] = [];
        for(let j=0; j<cols; j++){
            mat.elms[i][j] = new Konva.Text({
                id: mat.id()+'-elm'+i+j,
                position: pos,
                text: mat.vals[i][j].toString(),
                fontSize: props.txtSize,
                fontFamily: 'Calibri',
                align: 'center',
                verticalAlign: 'middle',
                fill: props.labelColor
            });
            mat.add(mat.elms[i][j]);
            pos.x += mat.elms[0][0].width() + addDist;
        }
        pos.y += addDist + mat.elms[0][0].height();
        pos.x = mat.elms[0][0].x();
    }
    let midY = (mat.elms[0][0].y() + mat.elms[rows-1][0].y() + mat.elms[rows-1][0].height()) / 2;
    midY -= mat.title.height()/2;
    mat.title.y(mat.title.y() + midY);

    // brackets
    mat.openB = new Konva.Line({ // open bracket
        id:mat.id()+'openB',
        stroke: mat.title.fill(),
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round'
    });
    mat.add(mat.openB);
    let bP = mat.elms[0][0].position(); // begin point
    let eP = mat.elms[rows-1][0].position(); // end point
    bP.x -= 4;
    bP.y -= 2;
    eP.x = bP.x;
    eP.y += 2 + mat.elms[rows-1][0].height();
    mat.openB.points([bP.x,bP.y,  bP.x-8,bP.y,  eP.x-8,eP.y, eP.x,eP.y]);

    // close bracket
    mat.closeB = mat.openB.clone();
    mat.closeB.id(mat.id()+'closeB');
    mat.add(mat.closeB);
    bP = mat.elms[0][cols-1].position(); // begin point
    eP = mat.elms[rows-1][cols-1].position(); // end point
    bP.x += 4 + mat.elms[0][cols-1].width();
    bP.y -= 2;
    eP.x = bP.x;
    eP.y += 2 + mat.elms[rows-1][0].height();
    mat.closeB.points([bP.x,bP.y,  bP.x+8,bP.y,  eP.x+8,eP.y, eP.x,eP.y]);

    //row highlight
    mat.rowHL = new Konva.Rect({name:'rectangle',
                                x: mat.elms[0][0].x() - 3,
                                y:  mat.elms[0][0].y(),
                                width: mat.elms[0][cols-1].x() + mat.elms[0][cols-1].width()*2 - mat.elms[0][0].x() + 4,
                                height: (mat.elms[0][0].height()) - (mat.elms[0][0].y()),
                                fill: 'RoyalBlue',
                                stroke:'',
                                cornerRadius: 3,
                                //shadowBlur: 3,
                                opacity: 0.4,
                                visible: false
    });


    // enable row background color
    mat.enableRowHL = function(){
        mat.add(mat.rowHL);
        mat.rowHL.zIndex(mat.elms[0][0].zIndex()-1);
        //mat.rowHL.visible(true);
        mat.enable(false);
        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                mat.elms[i][j] = over( mat.elms[i][j]);
                mat.elms[i][j].hoverTxt = lang.gn.markRow;
                mat.elms[i][j] = hover1(mat.elms[i][j], mat);
                mat.elms[i][j].on('click touchstart', function(){
                    mat.rowHL.y(mat.elms[i][0].y());
                    mat.rowHL.visible(mat.rowHL.visible() === true ? false:true);
                    mat.getLayer().batchDraw();
                });
            }
        }
        mat.rowHL.on('click touchstart', function(){
            this.visible(false);
            mat.getLayer().batchDraw();
        });
    };

    // update matrix size
    mat.sizeUpdate = function(){
        mat.height(mat.openB.points()[5] - mat.openB.points()[1]);
        mat.width(mat.closeB.points()[2] - mat.title.x());
    };

    // set matrix size by default
    mat.sizeUpdate();

    // hide/show matrix values
    mat.elmsVisible = function(flag){
      if(typeof flag === 'undefined') return mat.elms[0].visible();
      if(flag !== true && flag !== false) return console.error('Incorrect flag!');
        for(let i=0; i<props.rows; i++) {
            for (let j = 0; j < props.cols; j++){
                mat.elms[i][j].visible(flag);
            }
        }
    };

    // matrix enable/disable setting
    mat.enabled= false;
    mat.enable = function (flag){
      if(typeof flag === 'undefined') return  mat.enabled;
      if(flag === true  && mat.enabled === false){
          for(let i=0; i<props.rows; i++) {
              for (let j = 0; j < props.cols; j++){
                  mat.elms[i][j] = over(mat.elms[i][j]);
                  mat.elms[i][j].on('click touchstart', function(){
                      mat.vals[i][j] = mat.vals[i][j] === 0 ? 1:0;
                      mat.elms[i][j].text(mat.vals[i][j].toString());
                      mat.getLayer().batchDraw();
                  });
              }
          }
          return mat.enabled = true;
      }
      else if(flag === false && mat.enabled === true){
          for(let i=0; i<props.rows; i++) {
              for (let j = 0; j < props.cols; j++){
                  mat.elms[i][j].off();
              }
          }
          // disable column lalebs
          if(props.colLabels !== ''){
              for (let j = 0; j < props.cols; j++){
                  mat.colLabels[j].off();
              }
          }

          return mat.enabled = false;
      }
      else return mat.enabled;
    };

    // default enable setting of matrix
    mat.enable(true);

    // creating column numbers
    if (props.firstColNum !== ''){
        mat.colNums=[];
        for(let i=0; i<cols; i++){
            let n = Number(props.firstColNum) === 1 ? (i+1) : i;
            let num = new Konva.Text({
                id: mat.id()+'-col'+n,
                text: n.toString(),
                fontSize: props.txtSize-8,
                fontFamily: 'Calibri',
                fill: 'Silver'
            });
            mat.add(num);
            num.x(mat.elms[0][i].x() + mat.elms[0][i].width()/2 - num.width()/2);
            num.y(mat.elms[0][i].y() - num.height() - 5);
            mat.colNums.push(num);
        }
    }

    //create column labels
    if(props.colLabels !== ''){
        mat.colLabels=[];
        for(let i=0; i<props.colLabels.length; i++){
            let lab = SUB(props.colLabels[i]);
            lab.id(props.colLabels[i].replace('_',''));
            lab.fontSize(props.txtSize-7);
            lab.sub.x(lab.sub.x()-3);
            lab.fill(props.colLabels[i].substr(0,1) === 'C' ? 'RoyalBlue' : 'RosyBrown');
            //lab.fill('grey');
            lab.fontFamily('Calibri');
            mat.add(lab);
            lab.x(mat.elms[0][i].x() + mat.elms[0][i].width()/2 - lab.width()/2);
            lab.y(mat.elms[0][i].y() - lab.height() - 5);

            mat.colLabels.push(lab);

            if (typeof mat.colNums !== 'undefined') mat.colNums[i].y(mat.colNums[i].y() - mat.colNums[i].height() - 3);
        }

        // hide/show matrix column labels
        mat.colLabels.visible = function(flag){
            mat.colLabels.forEach(label =>{
                label.visible(flag);
            });
            if(typeof props.layer !== 'undefined') mat.getLayer().batchDraw();
        }
    }

    //create row labels
    if(props.rowLabels !== ''){
        mat.rowLabels=[];
        for(let i=0; i<props.rowLabels.length; i++){
            let lab = new Konva.Text({text: props.rowLabels[i].toString()});
            lab.fontSize(props.txtSize-8);
            lab.fill('Silver');
            lab.fontFamily('Calibri');
            mat.add(lab);
            lab.x(mat.elms[rows-1-i][0].x() - 25);
            lab.y(mat.elms[rows-1-i][0].y() + mat.elms[rows-1-i][0].height()/2 - lab.height()/2);
            mat.rowLabels.push(lab);
        }
    }

    //calc matrix's width
    mat.width(mat.closeB.points()[2] - mat.title.x());
    //calc matrix's height
    if(props.firstColNum !== '')    mat.height(mat.closeB.points()[7] - mat.colNums[0].y());
    else if(props.colLabels !== '') mat.height(mat.closeB.points()[7] - mat.colLabels[0].y());
    else                            mat.height(mat.closeB.points()[7] - mat.closeB.points()[1]);

    // update matrix elements
    mat.update = function() {
        for(let i=0; i<props.rows; i++) {
            for (let j = 0; j < props.cols; j++){
                mat.elms[i][j].text(mat.vals[i][j].toString());
            }
        }
    };

    // set matrix values
    mat.setVals = function(array){
        mat.vals=null;
        mat.vals = array.map(function(arr) {
            return arr.slice();
        });
        mat.update();
    };

    // get matrix size
    mat.size = function(){
        return {r: props.rows, c: props.cols};
    };
    return mat;
} // END of MATRIX

//HAMMING ENCODER - GENERAL ALGORITHM/////////////////////////////////////////////////////////////////////////////////////////
function HAMMING_GA(props, layer, alg, stat) {
    // CONFIG DEFAULT PROPERTIES
    if (typeof props.arrow === 'undefined') props.arrow = {};
    // GENERAL properties
    props.id = props.id || 'en';
    props.name = props.name || 'Encoder';
    props.position = props.position || {x: 0, y: 0};
    props.fill = props.fill || 'FloralWhite';
    props.labelSize = props.labelSize || 20;
    props.labelDistance = props.labelDistance || 5;
    props.labelColor = props.labelColor || 'white';
    props.labelBgColor = props.labelBgColor || 'RoyalBlue';
    props.labelPadding = props.labelPadding || 4;
    props.pading = props.pading || 10;
    props.width = props.width || 550;
    props.height = props.height || 370;
    props.bitsNum = props.bitsNum || 12;
    props.errDet = props.errDet || 1;
    props.checkBits = props.checkBits || 4;
    props.draggable = props.draggable || false;
    props.process = props.process || 'en';

    if (typeof props.bit === 'undefined') props.bit = {};
    let ratio = 0.6, w = 26, h = w / ratio;
    props.bit.width = w;
    props.bit.height = h;
    let addDist = props.bit.width + props.pading * 1.0;
    let height = props.bit.height + 2 * props.pading + 300;
    let width = addDist * (props.bitsNum) + addDist / 1.4;
    let checkBitsIdx = [0, 1, 2, 4, 8, 16]; // for t=2
    let infoBitsIdx = [];
    for (let i = 0; i <= (props.bitsNum - props.errDet + 1); i++) {
        if (typeof checkBitsIdx.find(el => el === i) === 'undefined')
            infoBitsIdx.push(i);
    }

    let first = 0, ln = 0;
    if (props.errDet === 1) { // for t=1
        for (let i = 0; i < infoBitsIdx.length; i++) infoBitsIdx[i] -= 1;
        for (let i = 0; i < checkBitsIdx.length; i++) checkBitsIdx[i] -= 1;
        first = 1;
        ln = 1;
    }

    let bitsIdx = []; // indexes of the all bits
    for (let i = first; i < (props.checkBits + ln); i++) {
        bitsIdx.push({bit: 'C' + i, idx: checkBitsIdx[i]});
    }

    for (let i = 0; i < (props.bitsNum - props.checkBits); i++) {
        bitsIdx.push({bit: 'S' + (i + 1), idx: infoBitsIdx[i]});
    }

    let lang = props.lang;

    // CREATING REGISTER'S PANEL /////////////////////////////////////////////////////////////////
    let en = new PANEL(props);
    en.size({width: width, height: height});
    en.dragmove(true);

    // empty array for values
    en.process = props.process;
    en.vals = [];
    en.vals.length = props.bitsNum;
    en.vals.fill(0);
    en.bitsIdx = bitsIdx;
    // encoder language
    en.lang = props.lang;

    // CREATING BIT GROUPS
    // CREATING ENCODER'S BITS /////////////////////////////////////////////////////////////////
    // BIT properties
    props.bit.name = 'Bit';
    props.bit.hoverTxt = props.bit.hoverTxt || 'Set Bit';
    props.bit.fill = 'RosyBrown';
    //props.bit.stroke = 'RosyBrown';
    props.bit.txtColor = 'Snow';
    props.bit.defVal = '';
    props.bit.labelDistance = 5;

    // CREATING BITS
    en.bits = []; // empty array for encoder's bits
    // first bit position
    let pos = {
        x: addDist / 2,
        y: en.labelRect.y() + en.labelRect.height() + 50
    };
    let num = 1, sCount = 1, cCount = 1;
    if (props.errDet === 2) {
        num = 0;
        cCount = 0;
    }
    for (let i = 0; i < props.bitsNum; i++) {
        let bitType = '';
        if (num === 0 || num === 1 || num === 2 || num === 4 || num === 8 || num === 16) { // for control bits
            bitType = 'C';
            props.bit.id = bitType + cCount;
            props.bit.label = bitType + '_' + cCount;
            cCount++;
        } else { // for info bits
            bitType = 'S';
            props.bit.id = bitType + sCount;
            props.bit.label = bitType + '_' + sCount;
            sCount++;
        }

        let bit = new Button(props.bit);
        bit.txt.text('');
        bit.position(pos);
        if (bit.id().search('C') !== -1){
            bit.activeColor = 'RoyalBlue';
        }
        bit.active(true);
        bit.label.y(bit.rect.y() - bit.label.height() - 5);
        bit.label.visible(false);
        if (bitType === 'S') bit.hoverTxt = en.lang.insertToEqu;
        else bit.hoverTxt = en.lang.selectCbit;
        // bit's number
        bit.num = new Konva.Text({
            id: 'bitNum' + num,
            x: bit.label.x(),
            y: bit.label.y() - bit.label.height() - 3,
            width: bit.label.width(),
            text: num.toString(),
            fontSize: props.labelSize - 4,
            fontFamily: 'Calibri',
            padding: 0,
            align: 'center',
            verticalAlign: 'middle',
            fill: 'DimGray',
        });
        num++;
        pos.x += addDist; //  change position for the next bit
        bit.add(bit.num);
        en.add(bit);
        en.bits.push(bit);
    }

    // creating temp labels
    en.labels = [];
    pos = {x: addDist / 2, y: en.bits[0].y() + en.bits[0].height() + 10};
    // control bit temp labels
    en.bits.forEach(bit => {
        if (bit.id().search('C') !== -1) {
            let label = bit.label.clone();
            label.width(bit.label.width());
            label.height(bit.label.height());
            bit.active(false);
            label.id('label-' + bit.id());
            label.position(pos);
            pos.x += addDist;
            label.visible(true);
            label.onPlace = false;
            label.draggable(true);
            en.add(label);
            label.hoverTxt = en.lang.placeLabel;
            //console.log(label.getType());
            label = hover1(label, en);
            label = over(label);
            en.labels.push(label);
        }
    });
    // info bit temp labels
    en.bits.forEach(bit => {
        if (bit.id().search('S') !== -1){
            let label = bit.label.clone();
            label.width(bit.label.width());
            label.height(bit.label.height());
            bit.active(false);
            label.id('label-' + bit.id());
            label.position(pos);
            pos.x += addDist;
            label.visible(true);
            label.onPlace = false;
            label.draggable(true);
            en.add(label);
            label.hoverTxt = en.lang.placeLabel;
            label = hover1(label, en);
            label = over(label);
            en.labels.push(label);
        }
    });

    // check for label intersection with the bit
    en.checkLabelIntersection = (label) => {
        let targetBit = en.findOne('#' + label.id().substr(6));
        label.moveToTop();
        if (typeof targetBit !== 'undefined')
            if (haveIntersection(label, targetBit)) {
                return true;
            } else {
                return false;
            }
    };

    // placing the labels on right places
    en.placeLabels = () => {
        en.labels.forEach(label => {
            let target = en.findOne('#' + label.id().substr(6));
            let pos = {
                x: target.x() + target.width() / 2 - label.x() - 10,
                y: target.y() + target.height() / 2 - label.y() - 8
            };
            label.move({x: pos.x, y: pos.y});
            label.onPlace = true;
        });
        en.getLayer().batchDraw();
        return true;
    };

    //creating button for check label position
    en.checkLabelBtn = new Button({
        id: 'checkLabelBtn',
        height: 25,
        defVal: en.lang.checkLabels,
        txtSize: 16,
        clickable: true,
        fill: 'LightGrey'
    }, layer);
    en.checkLabelBtn.position({x: en.rect.x() + 5, y: en.rect.height() - 40});

    en.checkLabelBtn.rect = over(en.checkLabelBtn.rect);
    en.add(en.checkLabelBtn);
    en.checkLabelBtn = hover1(en.checkLabelBtn, en); // first hover enable
    en.checkLabelBtn.enable(true); // second over events

    // check for correct labels positions
    en.checkLabels = () => {
        let check = true;
        for(let i=0; i<en.labels.length; i++){
            check = en.checkLabelIntersection(en.labels[i]);
            if(check === false) break;
        }
        if (check) {
            en.labels.forEach(label => {
                label.visible(false);
            });
            en.bits.forEach(bit => {
                bit.label.visible(true);
            });
            en.checkLabelBtn.visible(false);
            en.loadBtn.visible(true);
            en.getLayer().batchDraw();
        }
        return check;
    };

    // coloring  and enabling encoder's bits
    en.enableBits = () => {
        en.bits.forEach(bit => {
            bit.active(true);
        });
    };

    // loading bits in encoder/decoder
    en.loadBits = (reg) => {
        let vals = reg.vals, bits = reg.bits;
        // check for bit moving animation
        if (typeof bits !== 'undefined'){
            for (let i = 0; i < bits.length; i++) {
                let cloneObj = bits[i].clone();
                bits[i].active(false);
                layer.add(cloneObj);
                cloneObj.position(bits[i].getAbsolutePosition());
                cloneObj.moveToTop();
                en.getLayer().batchDraw();
                // moving animation
                let movement = {};
                if(en.process === 'enc')
                    movement = new SmoothMovement(cloneObj.position(), en.bits[infoBitsIdx[i]].getAbsolutePosition());
                else if(en.process === 'dec')
                    movement = new SmoothMovement(cloneObj.position(), en.bits[i].getAbsolutePosition());
                movement.animate(
                    60,
                    function (pos) { // update function
                        cloneObj.position(pos);
                        en.getLayer().batchDraw();
                    },
                    function () { // closure function
                        if(en.process === 'enc'){
                            en.vals[infoBitsIdx[i]] = vals[i];
                            en.bits[infoBitsIdx[i]].txt.text(vals[i].toString());
                        }
                        else if(en.process === 'dec'){
                            en.vals[i] = vals[i];
                            en.bits[i].txt.text(vals[i].toString());
                        }

                        cloneObj.destroy();
                        if (i === bits.length - 1) { // run its if is last bit
                            en.enableBits();
                            en.loadBtn.visible(false);
                            en.equBtn.visible(true);
                            en.createCbits();
                            if(en.process === 'dec') en.createCBitCheck();
                            else en.equs.visible(true);
                            en.getLayer().batchDraw();
                        }
                    }
                );
            }
            reg.disable(); // disable the register's nodes
        }
        return true;
    };

    // load info bits button
    en.loadBtn = new Button({
        id: 'loadBtn',
        height: 25,
        defVal: en.lang.loadBits,
        txtSize: 16,
        fill: 'LightGrey'
    }, layer);
    en.loadBtn.position({x: en.rect.x() + 5, y: en.rect.height() - 40});
    en.add(en.loadBtn);
    en.loadBtn = hover1(en.loadBtn, en); // first hover enable
    en.loadBtn.enable(true); // second over events
    en.loadBtn.visible(false);

    // equation field/button
    en.equBtn = new Button({
        id: 'equBtn',
        height: 40,
        width: en.bits[en.bits.length - 1].x() + en.bits[0].width() - en.bits[0].x(),
        defVal: en.lang.equBtnTxt,
        txtSize: 14,
        fill: 'LightGrey',
        stroke: 'black',
        strokeWidth: 5
    }, layer);
    en.equBtn.position({x: en.bits[0].x(), y: en.bits[0].y() + 80});

    en.equBtn.visible(false);
    en.add(en.equBtn);
    en.equBtn.hoverTxt = en.lang.calcCbit;
    en.equBtn = hover1(en.equBtn, en);
    en.equBtn.enable(true);
    en.currCbit = '';

    // create error analysis (for decoding)
    if(en.process === 'dec') {
        // Cbits check panel
        en.CbitCheck = new PANEL({
            id: 'CbitCheck',
            name: en.lang.checkRes,
            position: {x: en.equBtn.x(), y: en.equBtn.y()+en.equBtn.height()+20},
            type: 2
        });
        en.CbitCheck.size({width: 65});
        en.CbitCheck.visible(false);
        en.CbitCheck.dragmove(false);

        en.add(en.CbitCheck);

        // error analysis panel
        en.error = new PANEL({
            id: 'resAnalysis',
            name: en.lang.resultAnalysis,
            position: {x: en.CbitCheck.x() + en.CbitCheck.width() + 10, y: en.CbitCheck.y()},
            type: 2
        });
        en.error.moveToTop();
        en.error.visible(false);
        en.error.size({width: 360, height: en.CbitCheck.height()});
        en.add(en.error);
        en.autoCorrSize();

        // binary code
        en.error.binCode = SUB('(?????)_2');
        en.error.binCode.id('binCode');
        en.error.binCode.defaultFill(en.equBtn.txt.fill());
        en.error.binCode.position({x: 10, y: 20});
        en.error.binCode.fontSize(18);
        en.error.binCode.auto = null;
        en.error.binCode.man = null;
        en.error.add(en.error.binCode);
        // equal symbol
        en.error.equal = new Konva.Text({text:'   =>', fontSize:16,
            fill: en.error.binCode.fill(),
            position: {x: en.error.binCode.x() + en.error.binCode.width(), y: en.error.binCode.y()},
            height:  en.error.binCode.height(),
            width:  en.error.binCode.width(),
            visible: true
        });
        en.error.add(en.error.equal);

        en.error.binCode.hoverTxt = en.lang.setBinCode;
        en.error.binCode = hover1(en.error.binCode, en.error);
        en.error.binCode = over(en.error.binCode);
        en.error.binCode.on('dblclick tap', ()=>{
            alg.markCurrStep('curr');
            let thisObj = en.error.binCode;
            let str =  thisObj.text();
            str = str.replace('(','');
            str = str.replace(')','');
            let oldStr =thisObj.str;
            thisObj.text(str);
            editable(thisObj, function(obj){
                let s = obj.text();
                thisObj.man = s;
                if(s.search('\\(') === -1 && s.search('\\)') === -1)
                    thisObj.text('('+obj.text()+')_2');
                else if(s.search('\\(') === -1 && s.search('\\)') !== -1)
                    thisObj.text('('+obj.text()+'_2');
                else if(s.search('\\(') !== -1 && s.search('\\)') === -1)
                    thisObj.text(obj.text()+')_2');
                en.error.updatePos(); // update the equal and dec code positions
                str = thisObj.text();
                str = str.replace('(','');
                str = str.replace(')','');
                thisObj.man = str;
                if(oldStr !== str)
                    if(en.error.check(thisObj))
                        en.error.binCode.off();

            });
        });

        // decimal code
        en.error.decCode = SUB('(?)_10');
        en.error.decCode.visible(true);
        en.error.decCode.id('decCode');
        en.error.decCode.defaultFill(en.error.binCode.fill());
        en.error.decCode.fill('grey');
        en.error.decCode.position({x:en.error.binCode.x()+ en.error.binCode.width()+30, y:en.error.binCode.y()});
        en.error.decCode.fontSize(18);
        en.error.decCode.auto = null;
        en.error.decCode.man = null;
        en.error.add(en.error.decCode);

        en.error.decCode.active=()=>{
            en.error.decCode.fill(en.error.decCode.defaultFill());
            en.error.decCode.hoverTxt = en.lang.setDecCode;
            en.error.decCode = hover1(en.error.decCode,en.error);
            en.error.decCode = over(en.error.decCode);
            en.error.decCode.on('dblclick tap', ()=>{
                let thisObj = en.error.decCode;
                let str = thisObj.text();
                str = str.replace('(','');
                str = str.replace(')','');
                let oldStr =thisObj.str;
                thisObj.text(str);
                editable(thisObj, function(obj){
                    let s = obj.text();
                    thisObj.man = s;
                    if(s.search('\\(') === -1 && s.search('\\)') === -1)
                        thisObj.text('('+obj.text()+')_10');
                    else if(s.search('\\(') === -1 && s.search('\\)') !== -1)
                        thisObj.text('('+obj.text()+'_10');
                    else if(s.search('\\(') !== -1 && s.search('\\)') === -1)
                        thisObj.text(obj.text()+')_10');
                    en.error.updatePos(); // update the equal and dec code positions
                    str = thisObj.text();
                    str = str.replace('(','');
                    str = str.replace(')','');
                    thisObj.man = str;
                    if(oldStr !== str){
                        if(en.error.check(thisObj) === true){
                            en.error.decCode.fill(en.error.binCode.fill());
                            en.error.errStatusShow();
                            en.error.getLayer().batchDraw();
                            en.error.decCode.off();
                        }
                    }
                });
            });
        };

        // no error text
        en.error.noErrTxt =  SUB(en.lang.noErr);
        en.error.noErrTxt.visible(false);
        en.error.noErrTxt.id('noErrTxt');
        en.error.noErrTxt.fill('grey');
        en.error.noErrTxt.position({x:en.error.binCode.x(), y:en.error.binCode.y()+30});
        en.error.noErrTxt.fontSize(14);
        en.error.noErrTxt=over(en.error.noErrTxt);
        en.error.noErrTxt.hoverTxt = en.lang.selectErr;
        en.error.noErrTxt=hover1(en.error.noErrTxt, en.error);
        en.error.add(en.error.noErrTxt);

        // single error text
        en.error.sErrTxt =  en.error.noErrTxt.clone();
        en.error.sErrTxt.text(en.lang.singleErr);
        en.error.sErrTxt.id('sErrTxt');
        en.error.sErrTxt.position({x:en.error.noErrTxt.x()+en.error.noErrTxt.width()+15, y:en.error.noErrTxt.y()});
        en.error.sErrTxt.off();
        en.error.sErrTxt = over(en.error.sErrTxt);
        en.error.sErrTxt.hoverTxt = en.lang.selectErr;
        en.error.sErrTxt=hover1(en.error.sErrTxt, en.error);
        en.error.add(en.error.sErrTxt);

        // double error text
        en.error.dErrTxt =  en.error.noErrTxt.clone();
        en.error.dErrTxt.text(en.lang.doubleErr);
        en.error.dErrTxt.id('dErrTxt');
        en.error.dErrTxt.position({x:en.error.sErrTxt.x()+en.error.sErrTxt.width()+15, y:en.error.sErrTxt.y()});
        en.error.dErrTxt.off();
        en.error.dErrTxt=over(en.error.dErrTxt);
        en.error.dErrTxt.hoverTxt = en.lang.selectErr;
        en.error.dErrTxt=hover1(en.error.dErrTxt, en.error);
        en.error.add(en.error.dErrTxt);

        // decoded message label
        en.error.decMsgLabel =  new Konva.Text({
            id: 'decMsgLabel',
            position: {x:en.error.noErrTxt.x(), y:en.error.noErrTxt.y()+30},
            text: en.lang.decodedMsg + ': X = ',
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: 'Gray',
            visible: false
        });
        en.error.add(en.error.decMsgLabel);

        // decoded message label
        en.error.decMsg =  en.error.decMsgLabel.clone();
        en.error.decMsg.text('?????????');
        en.error.decMsg.id('decMsg');
        en.error.decMsg.position({x:en.error.decMsgLabel.x()+en.error.decMsgLabel.width()+5, y:en.error.decMsgLabel.y()});
        en.error.decMsg=over(en.error.decMsg);
        en.error.decMsg.hoverTxt = en.lang.decodedMsg;
        en.error.decMsg=hover1(en.error.decMsg, en.error);
        en.error.add(en.error.decMsg);
        en.error.decMsg.on('dblclick tap', ()=>{
            let oldStr = en.error.decMsg.text();
            editable(en.error.decMsg, function(obj){
                let newStr = obj.text();
                if(oldStr !== newStr){
                    if(en.decodedMsg.auto !== newStr){
                        obj.fill('red');
                        stat.error.add(en.lang.wrongDecMsg);
                        en.error.decMsg.hover.show('e',en.lang.wrongDecMsg);
                    }
                    else{
                        en.decodedMsg.man = newStr;
                        en.error.decMsg.fill(en.error.binCode.fill());
                        alg.increment();
                        stat.timer.stop();
                    }
                }
                if(newStr === '') en.error.decMsg.text(oldStr);
                en.getLayer().batchDraw();
            });
        });

        // no error event
        en.error.noErrTxt.on('click touchstart', function(){
            en.errStatus.man='noError';
            if(en.errStatus.auto !== en.errStatus.man){
                stat.error.add(en.lang.wrongErrStatus);
                return this.hover.show('e',en.lang.wrongErrStatus);
            }
            this.fill(en.error.binCode.fill());
            en.error.decMsgLabel.visible(true);
            en.error.decMsg.visible(true);
            en.error.getLayer().batchDraw();

        });
        // single error event
        en.error.sErrTxt.on('click touchstart', function(){
            en.errStatus.man='singleError';
            if(en.errStatus.auto !== en.errStatus.man){
                stat.error.add(en.lang.wrongErrStatus);
                return this.hover.show('e',en.lang.wrongErrStatus);
            }
            // single error correcting
            if(en.errStatus.auto === 'singleError'){
                let C0 = en.Cbits.find(Cbit => Cbit.id === 'C0');
                let pos = Number(en.error.decCode.man);
                if(typeof C0 === 'undefined') pos--;
                en.bits[pos].txt.text(en.vals[pos].toString());
                en.bits[pos].txt.fill('ForestGreen');
                //en.bits[pos].txt.moveToTop();
            }

            this.fill(en.error.binCode.fill());
            en.error.decMsgLabel.visible(true);
            en.error.decMsg.visible(true);
            en.error.getLayer().batchDraw();

        });
        // double error event
        en.error.dErrTxt.on('click touchstart', function(){
            en.errStatus.man='doubleError';
            if(en.errStatus.auto !== en.errStatus.man){
                stat.error.add(en.lang.wrongErrStatus);
                return this.hover.show('e',en.lang.wrongErrStatus);
            }
            this.fill(en.error.binCode.fill());
            en.error.decMsgLabel.visible(true);
            en.error.decMsg.visible(true);
            en.error.getLayer().batchDraw();
        });

        // show error status
        en.error.errStatusShow=()=>{
            en.error.noErrTxt.visible(true);
            en.error.sErrTxt.visible(true);
            en.error.dErrTxt.visible(true);
            en.getLayer().batchDraw();
        };

        //make error analysis for auto mode
        en.error.makeAnalysis = () =>{
            en.error.binCode.text('('+en.error.binCode.auto+')_2');
            en.error.decCode.text('('+en.error.decCode.auto+')_2');
            en.error.updatePos();
            let color = en.error.binCode.fill();
            en.error.decCode.fill(color);
            if(en.errStatus.auto === 'noError') en.error.noErrTxt.fill(color);
            else if(en.errStatus.auto === 'singleError') en.error.sErrTxt.fill(color);
            else en.error.dErrTxt.fill(color);
            en.error.errStatusShow();
            for(let i=0; i<en.vals.length; i++){
                if (en.vals[i].toString() !== en.bits[i].txt.text()) {
                    en.bits[i].txt.text(en.vals[i].toString());
                    en.bits[i].txt.fill('ForestGreen');
                }
            }
            en.error.decMsgLabel.visible(true);
            en.error.decMsg.fill(color);
            en.error.decMsg.text(en.decodedMsg.auto);
            en.error.decMsg.visible(true);

            en.error.autoCorrSize();
            en.error.getLayer().batchDraw();
        };

        // check the error bin code or position
        en.error.check = (thisObj)=>{
            //console.log('auto = '+thisObj.auto, 'man = '+thisObj.man);
            if(thisObj.man !== thisObj.auto){
                thisObj.fill('red');
                if(thisObj.id() === 'binCode')        stat.error.add(en.lang.wrongBinCode);
                else if(thisObj.id() === 'decCode')   stat.error.add(en.lang.wrongDecCode);
                return false;
            }
            else{
                thisObj.fill(thisObj.defaultFill());
                if(thisObj.id() === 'binCode') {
                    en.error.equal.visible(true);
                    en.error.decCode.active();
                }
                return true;
            }
        };

        en.error.updatePos = () =>{
            en.error.equal.position({x: en.error.binCode.x() + en.error.binCode.width(), y: en.error.binCode.y()});
            en.error.decCode.position({x:en.error.binCode.x()+ en.error.binCode.width()+30, y:en.error.binCode.y()});
            //en.error.rect.width(en.error.decCode.x()+en.error.decCode.width() - en.error.binCode.x() + 20);
            let width = en.error.decCode.x()+en.error.decCode.width() - en.error.binCode.x() + 20;
            if(en.error.size().width < width) en.error.size({width:width});
        };
    }


    // Equation button click procedures
    en.equBtnCallback = () => {
        if (en.currCbit === '') return en.lang.noSelectedBit; // check for selected Cbit
        let Cbit = en.Cbits.find(b => b.id === en.currCbit);
        if (Cbit.man.equ.length === 0) return en.lang.noEquMem + ' => ' + en.currCbit; // check for selected members
        let val = Cbit.man.res;
        if (val === '') val = 0;
        else val = Number(!val);
        en.Cbits.find(b => b.id === en.currCbit).man.res = val;
        if (Cbit.man.equ.length === Cbit.auto.equ.length) {
            for (let i = 0; i < Cbit.auto.equ.length; i++)
                if (Cbit.auto.equ[i].bitId !== Cbit.man.equ[i].bitId)
                    return en.lang.wrongEqu + ' => ' + en.currCbit; // check for correct equation
        } else return en.lang.wrongEqu + ' => ' + en.currCbit; // check for correct equation
        // en.equBtn.text(Cbit.man.str + val.toString());
        let currWidth = en.equBtn.rect.width();
        en.equBtn.text(Cbit.man.str + val.toString());
        if(en.equBtn.txt.width() > currWidth) en.equBtn.txt.width(currWidth);

        en.getLayer().batchDraw();
        return true;
    };

    //creating bit's arrow
    en.bits.forEach(bit => {
        let arrow = {};
        let b = {x: bit.x() + bit.width() / 2, y: bit.y() + bit.height()};
        let e = {x: bit.x() + bit.width() / 2, y: en.equBtn.y()};
        arrow = new Connection();
        arrow.id('arr-' + bit.id());
        if (bit.id().search('S') !== -1){ // info bit
            arrow.dir = 'd'; // set arrow direction as down
            arrow.setP([b.x, b.y, e.x, e.y]);
        }
        else{ // control bit
            arrow.dir = 'u'; // set arrow direction as up
            arrow.setP([e.x, e.y, b.x, b.y]);
            //console.log(arrow.id().search('arr'));
            arrow.hoverTxt = en.lang.writeCbitVal;
            arrow.enableHover = (flag) => {
                if (typeof flag === 'undefined' || flag === true) {
                    arrow = hover1(arrow, arrow.getParent());
                    arrow = over(arrow);
                } else if (flag === false) {
                    arrow.off('click touchstart');
                    // mоuse hover event
                    arrow.off('mouseover touchstart');
                    // mоuse hover out event
                    arrow.off('mouseout touchend');
                }
            };
        }
        arrow.stroke(bit.activeColor);
        arrow.visible(false);
        bit.arrow = arrow;
        en.add(arrow);
    });

    // current control bit calculation
    en.calckCurrCbit = (CbitId) => {
        for (let i = 0; i < en.Cbits.length; i++) {
            let Cbit = en.Cbits[i];
            if (Cbit.id() === CbitId) {
                let res = -1, val;
                Cbit.equ.forEach(el => {
                    val = en.vals[en.bitsIdx.find(bit => bit.bit === el).idx];
                    Cbit.bins.push(val);
                    if (res === -1) res = val;
                    else res ^= val;
                });
                en.vals[en.bitsIdx.find(bit => bit.bit === CbitId).idx] = res;
                en.bits.find(bit => bit.id() === en.currCbit).txt.text(res.toString());
                break;
            }
        }
        en.getLayer().batchDraw();
    };

    // method for creating parity equations for Cbits
    en.createCbits = () => {
        en.Cbits = [];
        let bitId = '';
        //let obj = {equ: [], bins: [], res: ''}; // temp object
        let ln = en.bits.length;
        for (let i = 0; i < ln; i++) {
            let bit = en.bits[i];
            bitId = bit.id();
            if (bit.id().substr(0, 1) !== 'C') continue;
            let obj = {
                equ: [],
                str: '',
                res: 0
            }; // temp object
            switch (en.bits[i].id()) {
                case 'C1':
                    bit = {};
                    val = 0;
                    for (let j = i; j < ln; j += 2) {
                        if (j === i)  if(en.process === 'enc') continue;
                        thisBit = en.bits[j];
                        val = en.vals[j];
                        obj.equ.push({
                            num: Number(thisBit.num),
                            bitId: thisBit.id(),
                            bin: val
                        });
                        obj.res ^= val;
                    }
                    break;
                case 'C2':
                    bit = {};
                    val = 0;
                    for (let j = i; j < ln; j += 4) {
                        for (let t = j; t < j + 2; t++) {
                            if (t === i) if(en.process === 'enc') continue;
                            if (typeof en.bits[t] !== 'undefined') {
                                thisBit = en.bits[t];
                                val = en.vals[t];
                                obj.equ.push({
                                    num: Number(thisBit.num),
                                    bitId: thisBit.id(),
                                    bin: val
                                });
                                obj.res ^= val;
                            }
                        }
                    }
                    break;
                case 'C3':
                    bit = {};
                    val = 0;
                    for (let j = i; j < ln; j += 8) {
                        for (let t = j; t < j + 4; t++) {
                            if (t === i) if(en.process === 'enc') continue;
                            if (typeof en.bits[t] !== 'undefined') {
                                thisBit = en.bits[t];
                                val = en.vals[t];
                                obj.equ.push({
                                    num: Number(thisBit.num),
                                    bitId: thisBit.id(),
                                    bin: val
                                });
                                obj.res ^= val;
                            } else break;
                        }
                    }
                    break;
                case 'C4':
                    bit = {};
                    val = 0;
                    for (let j = i; j < ln; j += 16) {
                        for (let t = j; t < j + 8; t++) {
                            if (t === i) if(en.process === 'enc') continue;
                            if (typeof en.bits[t] !== 'undefined') {
                                thisBit = en.bits[t];
                                val = en.vals[t];
                                obj.equ.push({
                                    num: Number(thisBit.num),
                                    bitId: thisBit.id(),
                                    bin: val
                                });
                                obj.res ^= val;
                            } else break;
                        }
                    }
                    break;
                case 'C5':
                    bit = {};
                    val = 0;
                    for (let j = i; j < ln; j += 32) {
                        for (let t = j; t < j + 16; t++) {
                            if (t === i) if(en.process === 'enc') continue;
                            if (typeof en.bits[t] !== 'undefined') {
                                thisBit = en.bits[t];
                                val = en.vals[t];
                                obj.equ.push({
                                    num: Number(thisBit.num),
                                    bitId: thisBit.id(),
                                    bin: val
                                });
                                obj.res ^= val;
                            } else break;
                        }
                    }
                    break;
                case 'C0':
                    bit = {};
                    val = 0;
                    let start = en.process === 'enc' ? 1 : 0;
                    for (let j = start; j < ln; j++) {
                        thisBit = en.bits[j];
                        val = en.vals[j];
                        obj.equ.push({
                            num: Number(thisBit.num),
                            bitId: thisBit.id(),
                            bin: val
                        });
                        obj.res ^= val;
                    }
                    break;
            } // end of switch

            en.Cbits.push({
                id: bitId,
                auto: en.procesCbit(bitId, obj),
                man: {
                    equ: [],
                    str: '',
                    res: ''
                }
            });
        } // end of for

        // set the events
        en.createCbitEvt();
    }; // end of method


    // crate control bits check for decoding
    en.createCBitCheck = () =>{
        en.CbitCheck.visible(true);
        en.CbitCheck.Cbits = [];
        for(let i=0; i<en.Cbits.length; i++){
            let thisCbitId = en.Cbits[i].id;
            let txt = null;
            let dist = 5;
            if(i === 0){
                txt = new Konva.Text({
                    id: thisCbitId,
                    text: thisCbitId + ' => ',
                    fontSize: props.labelSize-2,
                    fontFamily: 'Calibri',
                    align: 'left',
                    fill: en.equBtn.txt.fill(),
                    x: 5,
                    y: 10
                });
            }
            else{
                txt = null;
                txt = en.CbitCheck.Cbits[i-1].clone();
                if(en.CbitCheck.Cbits[i-1].id() === 'C0' && i === 1) dist *=2.5;
                txt.id(thisCbitId);
                txt.y(txt.y() + txt.height() + dist);
                txt.text(thisCbitId + ' => ');
            }
            txt.val='';
            txt.hoverTxt = en.lang.writeCbitCheck;
            en.CbitCheck.add(txt);
            en.CbitCheck.Cbits.push(txt);
        }
        en.CbitCheck.autoCorrSize();

        // events
        en.CbitCheck.Cbits.forEach(Cbit =>{
            Cbit = hover1(Cbit, en.CbitCheck);
            Cbit = over(Cbit);
            Cbit.on('click touchstart', function(){
                let msg = en.writeCbitRes('man');
                if (msg !== true){
                    //error
                    stat.error.add(msg);
                    this.hover.show('e',msg);
                }
                else if(msg === true){
                    alg.increment(); // pass write step
                }
            });
        });
        en.getLayer().batchDraw();
    }; // end of createCBitCheck

    // add member to the current control bit equation
    en.addToEqu = (bit) => {
        //check for selected control bit
        if (typeof en.Cbits === 'undefined' || en.currCbit === '') return en.lang.noSelectedBit;
        let thisCbit = en.Cbits.find(Cbit => Cbit.id === en.currCbit);
        if (bit.id().substr(0, 1) === 'C') bit.arrow.flip(true);

        if (!bit.arrow.visible()) { // add
            if (bit.id().substr(0, 1) === 'C') bit.arrow.flip(true);
            alg.markCurrStep('curr');
            bit.arrow.visible(true);
            thisCbit.man.equ.push({
                num: Number(bit.num.text()),
                bitId: bit.id(),
                bin: en.vals[en.bitsIdx.find(b => b.bit === bit.id()).idx]
            });
        } else { // remove
            bit.arrow.visible(false);
            thisCbit.man.equ = thisCbit.man.equ.filter(function (obj) {
                return obj.bitId !== bit.id();
            });
        }

        en.Cbits.find(Cbit => Cbit.id === en.currCbit).man = en.procesCbit(thisCbit.id, thisCbit.man);
        // en.equBtn.text(thisCbit.man.str);
        let currWidth = en.equBtn.rect.width();
        en.equBtn.text(thisCbit.man.str);
        if(en.equBtn.txt.width() > currWidth) {
            en.equBtn.txt.width(currWidth);
            en.equBtn.rect.width(currWidth);
        }
        en.getLayer().batchDraw();
        return true;
    };

    // creating click events for the all control bits
    en.createCbitEvt = () =>{
        en.Cbits.forEach(Cbit =>{
            en.bits.find(bit => bit.id() === Cbit.id).on('click touchstart', function () {
                if (en.currCbit === '') { // there is no selected Cbit, select this one
                    alg.resetCycle(); // set all shapes in the algorithm for cyrrent cycle in default fill color
                    // check for C0 - only for encoding process
                    if (Cbit.id === 'C0' && en.process === 'enc') {
                        let allCbitsHaveRes = true;
                        en.bits.forEach(bit => {
                            if (bit.id() !== 'C0' && bit.id().substr(0, 1) === 'C') {
                                if (bit.txt.text() === '') allCbitsHaveRes = false;
                            }
                        });
                        if (allCbitsHaveRes === false) {
                            stat.error.add(model.en.lang.wronC0choice + ' => ' + Cbit.id);
                            return this.hover.show('e', model.en.lang.wronC0choice);
                        }
                    }
                    if(Cbit.man.res !== '') return this.hover.show('e', model.en.lang.wasCalculated);
                    en.selectCbit(Cbit.id); // select this control bit
                    alg.increment(); // enable next step
                }
                else if(en.currCbit === Cbit.id) { // reset the current control bit
                    en.Cbits.find(b => b.id === Cbit.id).man.equ = [];
                    en.Cbits.find(b => b.id === Cbit.id).man.res = '';
                    en.currCbit = '';
                    en.equBtn.text('');
                    en.bits.forEach(b => {
                        if (b.arrow.visible() === true) b.arrow.visible(false);
                        if (b.id().substr(0, 1) === 'C') b.hoverTxt = en.lang.selectCbit;
                    });
                    alg.resetCycle(); // set all shapes in the algorithm for current cycle in default fill color
                } else { // add to the equation of current control bit
                    en.addToEqu(this);
                }
                en.getLayer().batchDraw();
            });
        });
    };

    // select a control bit for calculating/checking
    en.selectCbit = (CbitId) =>{
        if (typeof en.Cbits === 'undefined') return console.error('The model is busy!');
        if (typeof CbitId === 'undefined' || CbitId === '') { // for auto mode
            let CbitSeq = ['C1', 'C2', 'C3', 'C4', 'C5', 'C0'];
            for (let i = 0; i < CbitSeq.length; i++) {
                let thisCbit = en.bits.find(b => b.id() === CbitSeq[i]);
                if(typeof thisCbit === 'undefined') continue;
                if(en.Cbits.find(b => b.id === thisCbit.id()).man.res === ''){
                    CbitId = thisCbit.id();
                    break;
                }
                if (i === CbitSeq.length - 1) {
                    console.log('There is no control bit for calculating!');
                    return;
                }
            }
        }

        let Cbit = en.Cbits.find(b => b.id === CbitId);
        if (typeof Cbit !== 'undefined') {
            if (typeof en.bits.find(b => b.id() === en.currCbit) !== 'undefined')
                en.bits.find(b => b.id() === en.currCbit).arrow.enableHover(false); // disable hover
            en.currCbit = Cbit.id;

            if (en.process === 'enc'){
                en.bits.find(b => b.id() === en.currCbit).arrow.enableHover(true);
                en.bits.find(bit => bit.id() === Cbit.id).arrow.flip(false); // set arrow direction to up
            }
            else en.bits.find(bit => bit.id() === Cbit.id).arrow.flip(true); // set arrow direction to down for decoding
            en.bits.forEach(b => { // hide all visible arrows
                if (b.arrow.visible() === true) b.arrow.visible(false);
                if (b.id().substr(0, 1) === 'C') b.hoverTxt = en.lang.insertToEqu;
            });
            let thisBit = en.bits.find(bit => bit.id() === Cbit.id);
            thisBit.hoverTxt = en.lang.selectCbit;
            if(en.process === 'dec') { // add to the equation
                en.equBtn.text('');
                en.addToEqu(thisBit);
            }
            else en.equBtn.text('');
            thisBit.arrow.visible(true); // show/hide arrow
            en.getLayer().batchDraw();
        } else console.log('Non-existent control bit =>', CbitId);
        return true;
    };

    // show current control bit equation
    en.showCurrCbitEqu = () => {
        en.Cbits.forEach(Cbit => {
            if (Cbit.id === en.currCbit) {
                let currWidth = en.equBtn.rect.width();
                en.equBtn.text(Cbit.auto.str);
                if(en.equBtn.txt.width() > currWidth) {
                    en.equBtn.txt.width(currWidth);
                    en.equBtn.rect.width(currWidth);
                }
                Cbit.auto.equ.forEach(el => {
                    let thisBit = en.bits.find(bit => bit.id() === el.bitId);
                    if (thisBit.id().substr(0, 1) === 'C') thisBit.arrow.flip(true);
                    thisBit.arrow.visible(true);
                });
                en.getLayer().batchDraw();
            }
        });
        return true;
    };

    // show current control bit result
    en.showCurrCbitRes = () => {
        en.Cbits.forEach(Cbit => {
            if (Cbit.id === en.currCbit) {
                en.equBtn.text(Cbit.auto.str + Cbit.auto.res);
                en.getLayer().batchDraw();
            }
        });
        return true;
    };

    // write the control bit result
    en.writeCbitRes = (mode) => {
        if(en.currCbit === '') return en.lang.noSelectedBit;
        let Cbit = en.Cbits.find(bit => bit.id === en.currCbit);
        if (mode === 'auto') {
            if(en.process === 'enc'){
                en.vals[bitsIdx.find(bit => bit.bit === Cbit.id).idx] = Cbit.auto.res;
                en.bits.find(bit => bit.id() === Cbit.id).txt.text(Cbit.auto.res.toString());
                Cbit.man.res = Cbit.auto.res;
                Cbit.man.equ = Cbit.auto.equ;
                Cbit.man.str = Cbit.auto.str;

            }
            else if(en.process === 'dec'){ // for decoding
                let CbitCheck = en.CbitCheck.Cbits.find(b => b.id() === en.currCbit);
                CbitCheck.text(CbitCheck.text() + Cbit.auto.res);
                Cbit.man.res = Cbit.auto.res;
                Cbit.man.equ = Cbit.auto.equ;
                Cbit.man.str = Cbit.auto.str;
            }
            Cbit.man.res = Cbit.auto.res;
        }
        else if (mode === 'man') {
            if (en.equBtn.text() === '') return en.lang.noEqu;
            if (Cbit.man.equ.length !== Cbit.auto.equ.length) return en.lang.wrongEqu+' => '+en.currCbit;
            if (Cbit.man.res !== Cbit.auto.res) return en.lang.wrongCval+' => '+en.currCbit; // check for correct result
            if(en.process === 'enc'){
                en.vals[bitsIdx.find(bit => bit.bit === Cbit.id).idx] = Cbit.man.res;
                en.bits.find(bit => bit.id() === Cbit.id).txt.text(Cbit.man.res.toString());
            }
            else if(en.process === 'dec'){ // for decoding
                let CbitCheck = en.CbitCheck.Cbits.find(b => b.id() === en.currCbit);
                CbitCheck.text(CbitCheck.text() + Cbit.auto.res);
            }
        }

        if(en.process === 'enc') en.equs.add(en.equBtn.txt);
        en.currCbit = '';
        en.equBtn.text('');
        en.bits.forEach(b => {
            if (b.arrow.visible() === true) b.arrow.visible(false);
        });

        //if there is no other control bits for calculation disable all encoder's bit and hide the equation field
        if (en.isLastCbit() === true) {
            en.bits.forEach(bit => {
                bit.active(false);
            });
            en.equBtn.visible(false);
            if(en.process === 'enc'){
                alg.increment(); // enable next step
            }
            else if(en.process === 'dec'){ // for encoding
                let str = '';
                // creating result analaysis for auto mode
                for(let i=en.Cbits.length-1; i>=0; i--)
                {
                    if(en.Cbits[i].id === 'C0') continue;
                    str += en.Cbits[i].auto.res;
                }
                en.error.binCode.auto = str;
                en.error.decCode.auto = parseInt(str, 2).toString();

                // set error status
                en.errStatus={auto:'', man:''};
                let C0 = en.Cbits.find(Cbit => Cbit.id === 'C0');
                if(typeof C0 === 'undefined'){
                    en.errStatus.auto = 'noError';
                    en.Cbits.forEach(cBit => {
                        if(cBit.auto.res !== 0)  en.errStatus.auto = 'singleError';
                    });
                }
                else{
                    if(C0.auto.res === 0){
                        let errCode=0;
                        en.Cbits.forEach(cBit => {
                            if(cBit.id !== 'C0' && cBit.auto.res !== 0)  errCode = 1;
                        });
                        if(errCode === 0) en.errStatus.auto = 'noError';
                        else en.errStatus.auto = 'doubleError';
                    }
                    else{ // C0=1
                        en.errStatus.auto = 'singleError';
                    }
                }

                // set decoded message
                en.decodedMsg = {auto:'', man:''};
                if(en.errStatus.auto === 'singleError'){ // single error correcting
                    let pos = en.error.decCode.auto;
                    //console.log('pos='+pos);
                    let C0 = en.Cbits.find(Cbit => Cbit.id === 'C0');
                    if(typeof C0 === 'undefined') pos--;
                    en.vals[pos] = en.vals[pos] === 0 ? 1 : 0;
                }
                // creating decoded message
                if(en.errStatus.auto !== 'doubleError'){
                    let msg = '', idx=-1;
                    en.bits.forEach(bit =>{
                        idx++;
                        if (bit.id().substr(0,1) === 'S') msg += en.vals[idx].toString();
                    });
                    en.decodedMsg.auto = msg;
                }
                else en.decodedMsg.auto = '?';

                en.error.visible(true);
                en.CbitCheck.Cbits.forEach(Cbit =>{
                    Cbit.off('click touchstart');
                    Cbit.off('mouseover touchstart');
                });
            }
        }
        alg.increment(); // enable next step
        en.getLayer().batchDraw();
        return true;
    };

    // check for last control bit
    en.isLastCbit = () => {
        let check = true;
        en.Cbits.forEach(cbit =>{
            if(cbit.man.res === '') check = false;
        });

        return check;
    };

    // Control bit equations
    en.equs = new PANEL({
        id: 'cbitEqu',
        name: en.lang.equBtnTxt,
        position: { x: en.equBtn.x(), y: (en.equBtn.y() + en.equBtn.height() + 20)},
        type: 2,
        labelSize: 16
    });
    en.add(en.equs);
    en.autoCorrSize();
    en.equs.size({width: en.equBtn.width(), height:130});
    en.equs.visible(false);
    en.equs.dragmove(false);
    en.equs.poss=[];
    en.equs.objs=[];

    en.equs.add = (obj) => {
        if (typeof obj === 'undefined') return console.error('Non-existing object!');
        let newPos = {}, dist = 5;
        let cloneObj = obj.clone();
        cloneObj.position(en.equBtn.position());
        en.add(cloneObj);
        cloneObj.id(obj.id + '-clone');

        // for C0 - only equation and result
        if (cloneObj.text().substr(0, 2) === 'C0') {
            let str = cloneObj.text();
            cloneObj.text(str.split('=>')[0] + ' = ' + str.split('=>')[1].split('=')[1]);
        }
        // calculating the new position
        if (en.equs.poss.length === 0) {
            newPos = {x: en.equs.x() +10, y: en.equs.y() + en.equs.height() - cloneObj.height() - dist};
        } else {
            newPos.x = en.equs.x() + 10;
            newPos.y = en.equs.poss[en.equs.poss.length - 1].y - cloneObj.height() - dist;
        }

        // moving animation
        let movement = new SmoothMovement(cloneObj.position(), newPos);
        movement.animate(
            60,
            function (currPos) { // update function
                cloneObj.position(currPos);
                en.getLayer().batchDraw();
            },
            function () { // closure function
                cloneObj.align('left');
                //cloneObj.fontSize(cloneObj.fontSize());
                //cloneObj.position(getRelativePosition(en.equs, cloneObj.getAbsolutePosition()));

                //cloneObj.destroy();
            }
        );
        en.equs.objs.push(cloneObj);
        en.equs.poss.push(newPos);
    };

    // creating control bit equation string and order by position number
    en.procesCbit = (bitId, obj) => {
        obj.equ.sort((a, b) => {
            return a.num - b.num
        }); // ordering by position
        let equStr = '', binStr = '';
        obj.equ.forEach(el => {
            if (equStr === '') {
                equStr = el.bitId;
                binStr = el.bin.toString();
            } else {
                equStr += '\u2295' + el.bitId;
                binStr += "\u2295" + el.bin.toString();
            }
        });
        obj.str = en.process === 'enc' ? bitId + ' = ' + equStr + ' => ' + binStr + ' = ' : bitId + ' =>  ' + binStr + ' = ';
        return obj;
    };
    return en;
}

// absolute to relative position
function getRelativePosition(node, absPos) {
    let nodeAbsPos = node.getAbsolutePosition();
    let relPos = {x:0, y:0};
    relPos.x = Math.abs(absPos.x - nodeAbsPos.x);
    relPos.y = Math.abs(absPos.y - nodeAbsPos.y);
    return relPos;
}

////// return array values sum ///////////////////////////////////////////////////////
function arrSum(array){
    return array.reduce(function(a, b){
        return a + b;
    }, 0);
}

/////////////////////////////////////////////////////////////////////////////
editable = (textNode, closeFunc, width) => {
    // at first lets find position of text node relative to the stage:
    let textPosition = textNode.getAbsolutePosition();
    textPosition.x += window.scrollX;
    textPosition.y += window.scrollY;

    // then lets find position of stage container on the page:
    //let stageBox = stage.container().getBoundingClientRect();
    let stageBox = textNode.getStage().container().getBoundingClientRect();

    // so position of textarea will be the sum of positions above:
    let areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y - 10
    };

    // create textarea and style it
    let textarea = document.createElement('input');
    document.body.appendChild(textarea);
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    if(typeof width !== 'undefined' &&  width > textNode.width())
        textarea.style.width = width+'px';
    else
        textarea.style.width = textNode.width()+15+'px';
    textarea.focus();

    textarea.addEventListener('keydown', function(e){
        // hide on enter
        if (e.key === 'Enter') confirm(textarea.value);
        else if(e.key === 'Escape') removeTextarea();
    });
    //textarea.addEventListener("focusout",function(){confirm();});
    textarea.addEventListener("focusout",function(){removeTextarea();});
    confirm = function (str){
        if(str !== ''){
            textNode.text(str);
            removeTextarea();
            textNode.getLayer().batchDraw();
            closeFunc(textNode); // close function
        }else{
            removeTextarea();
            textNode.getLayer().batchDraw();
            closeFunc(textNode); // close function
        }
    }
    removeTextarea = function(){
        try {document.body.removeChild(textarea);}
        catch (e) {}
    }
};

// applay over and overout events
over = (obj, cursorStyle) =>{
    cursorStyle = cursorStyle || 'pointer';
    let shapes = [];
    if(obj.getType() === 'Group'){
        shapes = obj.find('Text');
        shapes = shapes.concat(obj.find('Rect'));
    }
    else{
        shapes.push(obj);
    }
    obj.on('mouseover touchstart', function(){
        // shapes[0].shadowColor('red');
        // shapes[0].shadowBlur(10);
        // shapes[0].shadowOpacity(1.0);
        shapes.forEach(shape => {
            shape.shadowColor('red');
            shape.shadowBlur(10);
            shape.shadowOpacity(1.0);
        });

        obj.getStage().container().style.cursor = cursorStyle;
        if(typeof this.hover !== 'undefined'){
            if(this.hover.visible() === true) this.hover.hide('f');
            if(this.hoverTxt !== '') this.hover.show('i',this.hoverTxt);
        }

        obj.getLayer().batchDraw();
    });
    // mouse hover out event
    obj.on('mouseout touchend', function(){
        // shapes[0].shadowColor('');
        // shapes[0].shadowBlur(0);
        // shapes[0].shadowOpacity(0);
        shapes.forEach(shape => {
            shape.shadowColor('');
            shape.shadowBlur(0);
            shape.shadowOpacity(0);
        });
        obj.getStage().container().style.cursor = 'default';
        if(typeof this.hover !== 'undefined') this.hover.hide();
        obj.getLayer().batchDraw();
    });
    return obj;
};

// applay over and overout events
enableOver = (obj, layer, cursorStyle) =>{
    cursorStyle = cursorStyle || 'pointer';
    let parent = obj.getParent();
    //console.log(obj.id()+' parent =>', parent.id());
    if(typeof parent !== 'undefined' && obj.id().search('arr') === -1){ // also if the object is arrow
        parent.on('mouseover touchstart', function(){
            obj.shadowColor('red');
            obj.shadowBlur(10);
            obj.shadowOpacity(1.0);
            obj.getStage().container().style.cursor = cursorStyle;
            //if(typeof parent.hoverTxt !== 'undefined' && parent.hoverTxt !== '' && typeof parent.hover !== 'undefined')
            if(typeof parent.hover !== 'undefined')
                if(typeof obj.hoverTxt !== 'undefined' && parent.hoverTxt !== '')
                    parent.hover.show('i',this.hoverTxt);
                else if(typeof parent.hoverTxt !== 'undefined' && obj.hoverTxt !== '')
                    parent.hover.show('i',obj.hoverTxt);
            else console.log('There is no hover text to show!');
            layer.batchDraw();
        });
        // mоuse hover out event
        parent.on('mouseout touchend', function(){
            obj.shadowColor('');
            obj.shadowBlur(0);
            obj.shadowOpacity(0);
            obj.getStage().container().style.cursor = 'default';
            if(typeof this.hover !== 'undefined') this.hover.hide();
            layer.batchDraw();
        });
    }
    else{ // for other objects
        obj.on('mouseover touchstart', function(){
            this.shadowColor('red');
            this.shadowBlur(10);
            this.shadowOpacity(1.0);
            obj.getStage().container().style.cursor = cursorStyle;
            if(typeof this.hoverTxt !== 'undefined') this.hover.show('i',this.hoverTxt);
            layer.batchDraw();
        });
        // mouse hover out event
        obj.on('mouseout touchend', function(){
            this.shadowColor('');
            this.shadowBlur(0);
            this.shadowOpacity(0);
            obj.getStage().container().style.cursor = 'default';
            if(typeof this.hover !== 'undefined') this.hover.hide();
            layer.batchDraw();
        });
    }
    return obj;
};

// check for two shapes intersection
function haveIntersection(r1, r2, posType) {
    if (typeof posType === 'undefined')
        return !(
        r2.x() > r1.x() + r1.width() ||
        r2.x() + r2.width() < r1.x() ||
        r2.y() > r1.y() + r1.height() ||
        r2.y() + r2.height() < r1.y()
        );
    else
        return !(
        r2.absolutePosition().x > r1.absolutePosition().x + r1.width() ||
        r2.absolutePosition().x + r2.width() < r1.absolutePosition().x ||
        r2.absolutePosition().y > r1.absolutePosition().y + r1.height() ||
        r2.absolutePosition().y + r2.height() < r1.absolutePosition().y
        );
}

// Panel container/////////////////////////////////////////////////////////////////
function PANEL(props){
    props.id = props.id || '';
    props.name = props.name || 'Panel';
    props.position = props.position || {x:0, y:0};
    props.fill = props.fill || 'FloralWhite';
    props.labelSize = props.labelSize || 18;
    props.labelDistance = props.labelDistance || 5;
    props.labelColor = props.labelColor || 'white';
    props.labelBgColor = props.labelBgColor || 'RoyalBlue';
    props.labelPadding = props.labelPadding || 3;
    props.width = props.width || 100;
    props.height = props.height || 30;
    props.type = props.type || 1;

    // CREATING PANEL GROUP
    let pan = new Konva.Group ({
        id: props.id,
        name: props.name,
        position: props.position,
        visible: true,
        draggable: false
    });

    // Panel's label
    pan.label = new Konva.Text({
        id: pan.id()+'-label',
       // height: props.labelSize,
        text: props.name,
        fontSize: props.labelSize,
        fontFamily: 'Calibri',
        fontStyle: 'normal',
        padding: props.labelPadding,
        align: 'center',
        verticalAlign: 'middle',
        fill: props.labelColor,
    });
    if(props.type === 1) pan.label.height(pan.label.height() + 3);

    // label's background rectangle
    pan.labelRect = new Konva.Rect({
        id: pan.id()+'-labRect',
        width : pan.label.width(),
        height: pan.label.height(),
        fill: props.labelBgColor,
        cornerRadius: 4,
        opacity: 1.0,
    });

    // Panel's background rectangle
    pan.rect = new Konva.Rect({
        id: pan.id()+'-rect',
        width : pan.label.width(),
        height:  pan.label.height()*5,
        fill: props.fill,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.5,
        cornerRadius: 4
    });
    pan.width(pan.rect.width());
    pan.height(pan.rect.height());
    pan.add(pan.rect, pan.labelRect, pan.label);

    // for type 2
    if(props.type === 2){
        pan.labelRect.move({x:15, y: -pan.labelRect.height()/2});
        pan.label.move({x:15, y: -pan.labelRect.height()/2});
        // pan.label.fill(props.labelBgColor);
        pan.label.fill('DimGrey');
        pan.labelRect.fill(pan.rect.fill());
        pan.rect.stroke('DimGrey');
        pan.rect.shadowOpacity(0);
    }

    pan.size = function(size){
        if(typeof size === 'undefined') return {width: pan.width(), height: pan.height()};
        if(typeof size.width !== 'undefined'){
            //if(size.width < pan.label.width()) return console.log('The size.width  is < label.width()');
            pan.width(size.width);
            pan.rect.width(size.width);
            if(props.type === 1){
                pan.labelRect.width(size.width);
                pan.label.width(size.width);
            }
        }
        if(typeof size.height !== 'undefined'){
            if(size.height < pan.labelRect.height()) return;
            //pan.height(size.height);
            pan.rect.height(size.height);
        }
        pan.width(pan.rect.width());
        pan.height(pan.rect.height());
        try {pan.getLayer().batchDraw();} catch{}
        try{
            let parent = pan.getParent();
            //resize the parrent height if it necessary
            if(pan.y()+pan.height()+10 > parent.height())
                parent.size({height: pan.y()+pan.height()+10});
        } catch{ }

    };

    // auto correct the panel width according to label with
    pan.rect.width(pan.labelRect.width() + 15);
    pan.width(pan.rect.width());

    pan.dragmove = function(arg){
        if(typeof arg === 'undefined') return pan.draggable();
        if(arg !== true &&  arg !== false) return console.log('Incorrect argument for dragmove function!')
        if(arg === true){
            pan.label.on('mouseover touchstart click', function(){
                pan.moveToTop();
                pan.getLayer().moveToTop();
                pan.getStage().container().style.cursor = 'move';
                pan.draggable(true);
            });
            pan.label.on('mouseout touchend', function(){
                pan.getStage().container().style.cursor = 'default';
                pan.draggable(false);
            });
        }
        else{
            pan.label.off();
        }
        // pan.draggable(arg);
    };

    // Auto orrect the panel size if requared
    pan.autoCorrSize = function (){
        let corr = {h:false, w:false};
        let objs  =  pan.getChildren();
        for (let i = 3; i<= objs.length-1; i++){
            if(objs[i].id().search('toolTip') !== -1) continue; // skipping tooltips objects
            //console.log(objs[i].id(), ' h = '+objs[i].height(), ' w = '+objs[i].width());
            // check for height, objs[0] is the panel's rectangle object
            let diff = objs[0].height() - (objs[i].y() + objs[i].height() + 10);
            if(diff < 0)  {
                corr.h = true;
                pan.size({height: pan.height() + Math.abs(diff)});
            }

            // check for width
            diff = objs[0].width() - (objs[i].x() + objs[i].width() + 10);
            if(diff < 0)  {
                corr.w = true;
                pan.size({width: pan.width() + Math.abs(diff)});
            }
        }
        //console.log('pan id = '+pan.id(), corr);
        // correct object's parent size if it's need
        if(corr.h || corr.w){
            let parent = pan.getParent();
            if(parent === null) return;
            if(parent.getType() === 'Group'){
                parent.autoCorrSize();
            }
            try {pan.getLayer.batchDraw();} catch (e) {}
            return corr;
        }
        else return false;
    };

    return pan;
}

//LFSR///////////////////////////////////////////////////////////////////////////
function LFSR(props, ir, cr, alg, stat){

    // CONFIG DEFAULT PROPERTIES
    if (typeof props.sw    === 'undefined') props.sw = {};
    if (typeof props.arrow === 'undefined') props.arrow = {};
    // GENERAL properties
    props.id = props.id || 'en';
    props.name = props.name || 'Encoder';
    props.pos = props.pos || {x:0, y:0};
    props.fill = props.fill || 'FloralWhite';
    props.labelSize = props.labelSize || 16;
    props.labelDistance = props.labelDistance || 5;
    props.labelColor = props.labelColor || 'white';
    props.labelBgColor = props.labelBgColor || 'RoyalBlue';
    props.labelPadding = props.labelPadding || 4;
    props.pading = props.pading || 10;
    props.width = props.width || 700;
    props.height = props.height || 265;
    props.bitsNum = props.bitsNum || 3;
    props.poly = props.poly || 'P(X)= X^3 + X + 1';
    props.xorIds = props.xorIds || ['xor0','xor2'];
    props.sHover = props.sHover || 'Shift the register';
    props.fHover = props.fHover || 'Reverse the register';

    let lang = new LangPack($('input[name="lang"]:checked').val()).gn;


    // CREATING REGISTER'S PANEL /////////////////////////////////////////////////////////////////
    let en = new PANEL(props);
    en.size({width: props.width, height: props.height});
    en.label.fontSize(18);
    en.dragmove(false);

    // empty array for values
    en.vals = [];
    en.vals.length = props.bitsNum;
    en.vals.fill(0);

    // create encoder's polynomial label
    en.poly = custText(props.poly);
    en.poly.setSize(14);
    en.poly.fill('white');
    en.poly.position({x: en.label.x() + 5, y: en.label.y()+6});
    en.add(en.poly);



    // CREATING LFSR'S BITS /////////////////////////////////////////////////////////////////
    createBits = function(){
        // BIT properties
        if (typeof props.bit  === 'undefined') props.bit = {};
        props.bit.hoverTxt = props.bit.hoverTxt || 'Load Bit';
        props.bit.width = props.bit.width || 40;
        props.bit.height = props.bit.height || 50;
        props.bit.name = props.bit.name || 'bit';
        props.bit.fill = props.bit.fill || 'Teal';
        props.bit.stroke = props.bit.stroke || 'Teal';
        props.bit.txtColor = props.bit.txtColor || 'darkBlue';
        props.bit.defVal = '0';
        props.bit.clickable = false;

        en.bits=[]; // empty array for register's bits
        let zIndex = null;
        let addDist =  props.bit.width + props.pading*7;
        // first bit position
        let pos = {	x: en.rect.x() + addDist/2.5,
            y: en.rect.y() + en.rect.height() - props.bit.height - props.pading*5};
        for (let i=0; i<props.bitsNum; i++){
            props.bit.id ='d'+i;
            props.bit.label = 'D'+(i);
            let bit = new Button(props.bit); // creating the current bit
            bit.name(props.bit.name);
            bit.enable(false);
            bit.position(pos); // bit positioning
            pos.x += addDist; // position change for the next bit

            en.bits[i] = bit;
            en.add(en.bits[i]);
            if (i === 0) zIndex = bit.getZIndex();
            else bit.setZIndex(zIndex);
        }
    }
    createBits();

    // CREATING XORs /////////////////////////////////////////////////////////////////
    createXORs = function(){
        if (typeof props.xor   === 'undefined') props.xor = {};
        let dist = en.bits[1].x() - (en.bits[0].x() + en.bits[0].width());
        let pos={x:0, y:0};
        en.xors=[];
        en.xorIds=props.xorIds;
        en.xorIds.forEach(xorId =>{
            let bit = en.bits[Number(xorId.substr(3))];
            pos.x = bit.x() + bit.width() + dist/2;
            pos.y = bit.y() + bit.height()/2;
            if (xorId === en.xorIds[en.xorIds.length -1]){
                pos.x += props.pading*3; // last xor's X cordinate correction
            }
            let xor = new XOR({	id: xorId,
                label: 'XOR' + en.xors.length,
                hover: props.xor.hoverTxt,
                fbHover: props.xor.fbHover
            });
            en.add(xor);
            xor = over(xor);
            xor.hoverTxt = props.xor.hoverTxt;
            xor = hover1(xor, en);

            xor.position(pos); // xor positioning
            if (xorId === en.xorIds[en.xorIds.length -1]){
                xor.label.x(xor.label.x() - 30); // last xor's Label x cordinate correction
                xor.markAsFB(true); // mark as feedback's XOR
            }

            // reset the input value of next LSFR's bit
            if (xor.isFB === false) en.bits[Number(xor.id().substring(3))+1].inVal = xor.res;

            en.xors.push(xor);
        });
        en.updateXors = function(){
            en.xors.forEach(xor => {
                let in1, in2;
                if (xor.isFB === true){ // for XOR of the feedback
                    in1 = en.vals[en.vals.length-1];
                    in2 = ir.vals[ir.vals.length-1];
                }
                else {// for others XOR
                    in1 = en.fb.val;
                    in2 = en.vals[Number(xor.id().substr(3))];
                }
                //console.log(xor.id()+' => in1 = '+in1+', in2 = '+in2);

                xor.setInputs(in1, in2);
            });
        }
    }
    createXORs();

    // Creating switches
    createSwitches = function(){
        // CREATING SWITCHES /////////////////////////////////////////////////////////////////
        // SWITCH 1
        let pos={x:0, y:0};
        pos.x = en.bits[en.bits.length-1].x()+4;
        en.sw1 = new SWITCH({type:	'pos2', // switch with 2 position
            id: 'sw1',
            name: 'SW1',
            hover: props.sw.hoverTxt
        });
        en.add(en.sw1);
        en.sw1.position(pos);
        en.sw1.y(en.bits[0].y() - en.sw1.rect.height()*2.3);
        en.sw1 = over(en.sw1);
        en.sw1.hoverTxt = props.sw.hoverTxt;
        en.sw1 = hover1(en.sw1, en);

        // SWITCH 2
        pos.x = en.xors[en.xors.length-1].x() + 30;
        en.sw2 = new SWITCH({type:	'pos3',
            id: 'sw2',
            name: 'SW2',
            //pos: {x: pos.x},
            hover: props.sw.hoverTxt
        });
        en.add(en.sw2);
        en.sw2.position(pos);
        en.sw2.y(en.xors[en.xors.length-1].y() - en.sw2.rect.height()/2);
        en.sw2.lab.x(en.sw2.lab.x()+5);
        en.sw2 = over(en.sw2);
        en.sw2.hoverTxt = props.sw.hoverTxt;
        en.sw2 = hover1(en.sw2, en);
    }
    createSwitches();

    //en.setW((en.sw2.x() + en.sw2.rect.width()) - en.x() + props.pading*6);
    en.size({width: (en.sw2.x() + en.sw2.rect.width()) + 20});

    // ENCODER IN/OUT SOKET
    createSokets = function(){
        en.soket = (str='') => {
            let p = str === 'abs' ? en.position(): {x:0,y:0};
            return{
                connI: {x: en.xors[en.xors.length-1].soket().connD.x + p.x,
                        y: en.height() + p.y
                },
                connO: {x: en.sw2.soket().connR.x + (en.width() - en.sw2.soket().connR.x) + p.x,
                        y: en.sw2.soket().connR.y + p.y
                }
            }
        };
    }
    createSokets();

    // ENCODER'S FEEDBACK set
    createFeedBack = function(){
        // ENCODER'S FEADBACK
        en.fb = new Konva.Group ({id: 'fb'});
        en.add(en.fb);
        en.fb.val = 0;	// default value
        let pos = {x: en.xors[en.xors.length-1].x() + 6,
            y: en.xors[en.xors.length-1].y() - 90};
        //en.fb = new Konva.Group ({id: 'fb'});
        en.fb.position(pos);
        en.fb.txtFb = new Konva.Text({
            id: en.fb + '-txt',
            text: 'FB = ',
            fontSize: 18,
            fontFamily: 'Calibri',
            padding: 0,
            align: 'left',
            verticalAlign: 'middle',
            fill: 'black'
        });
        en.fb.txtVal = new Konva.Text({
            id: en.fb + '-val',
            x: en.fb.txtFb.x() + en.fb.txtFb.width(),
            y: en.fb.txtFb.y(),
            text: '?',
            fontSize: 18,
            fontFamily: 'Calibri',
            padding: 0,
            align: 'left',
            verticalAlign: 'middle',
            fill: 'black'
        });
        en.fb.reset = function(){
            en.fb.txtVal.fill('grey');
            en.fb.txtVal.text('?');
        };
        en.fb.setVal = function (val){
            en.fb.val = val;
            en.fb.txtVal.text(en.fb.val.toString());
            en.fb.txtVal.fill('black');
            en.getLayer().batchDraw();
        };
        en.fb.add(en.fb.txtFb, en.fb.txtVal);
    }
    createFeedBack();


    // Encoder's >>> button
    en.S = new Konva.Text({
        id: en.id()+'-S',
        x: en.rect.x() + en.rect.width()/2,
        text: '>>>',
        fontSize: props.labelSize + 6,
        fontFamily: 'Calibri',
        padding: 0,
        align: 'center',
        verticalAlign: 'middle',
        fill: 'grey'
    });
    en.S.y(en.rect.y()  + en.rect.height()- en.S.height() - props.labelDistance);
    en.S.hoverTxt = props.sHover;
    en.add(en.S);
    en.S = over(en.S);
    en.S.hoverTxt =  props.shiftHoverTxt;
    en.S = hover1(en.S, en);


    // DRAWING OF ARROWS /////////////////////////////////////////////////////////////////
    drawArrows = function(){
        // lfsrBit to lfsrBit/xor
        let b, e;
        en.connects=[];
        let conn ={};
        for (let i=0; i<props.bitsNum; i++){
            let xor=en.xors.find(xor => xor.id() === 'xor'+i);
            if(typeof xor === 'undefined'){ // there isn't xor element
                b = en.bits[i].soket().connR; // connection's begin position
                e = en.bits[i+1].soket().connL; // connection's end position
                props.arrow.dir='r';
                props.arrow.id='conn-d'+i+'-d'+(i+1);
            }

            else{ // there is xor element
                // connection befor xor
                b = en.bits[i].soket().connR; // connection's begin position
                e = xor.soket().connL; // connection's end position
                props.arrow.dir='r';
                props.arrow.id='conn-d'+(i)+'-xor'+(i-1);
                conn = (new Connection(props.arrow));
                conn.setP([b.x,b.y,e.x,e.y]);
                en.add(conn);
                en.connects.push(conn);
                // connection after xor
                if (i < props.bitsNum-1)
                {
                    b = xor.soket().connR; // connection's begin position
                    e = en.bits[i+1].soket().connL; // connection's end position
                    props.arrow.dir='r';
                }
            }
            conn = (new Connection(props.arrow));
            conn.setP([b.x,b.y,e.x,e.y]);
            en.add(conn);
            en.connects.push(conn);
        }
        // last XOR to SW1
        b = en.xors[en.xors.length -1].soket().connU; // connection's begin position
        e = en.sw1.soket().connR; // connection's end position
        props.arrow.dir='l';
        props.arrow.id = 'conn-xor'+en.xors[en.xors.length -1].id()+'-sw1';
        conn = (new Connection(props.arrow));
        conn.setP([b.x, b.y, b.x, e.y, e.x, e.y]);
        en.add(conn);
        en.connects.push(conn);

        // SW1 to lsfrBit[0]
        b = en.sw1.soket().connL; // connection's end position
        e = en.bits[0].soket().connL; // connection's end position
        props.arrow.dir='r';
        props.arrow.id = 'conn-sw1'+'-d0';
        conn = (new Connection(props.arrow));
        conn.setP([b.x, b.y, e.x-(props.pading*3), b.y, e.x-(props.pading*3), e.y, e.x, e.y]);
        en.add(conn);
        en.connects.push(conn);

        // SW1 to XORs
        b = en.sw1.soket().connL; // connection's begin position
        for (let i=0; i<en.xors.length-1; i++){
            e = en.xors[i].soket().connU; // connection's end position
            props.arrow.dir='d';
            props.arrow.id = 'conn-sw1-'+en.xors[i].id();
            conn = (new Connection(props.arrow));
            conn.setP([e.x, b.y, e.x, e.y]);
            en.add(conn);
            en.connects.push(conn);
        }

        // last regBits to SW2
        b = en.bits[en.bits.length-1].soket().connR; // connection's begin position
        b.x = b.x + ((en.xors[en.xors.length-1].soket().connL.x - b.x) / 2); // begin's X cord. correction
        e = en.sw2.soket().connU; // connection's end position
        props.arrow.dir='d';
        props.arrow.id = 'conn-'+en.bits[en.bits.length-1].id()+'-sw2';
        let distV = 55;
        conn = (new Connection(props.arrow));
        conn.setP([b.x, b.y, b.x, b.y-distV, e.x, b.y-distV, e.x, e.y]);
        en.add(conn);
        en.connects.push(conn);

        // connI to the last XOR
        b = en.soket().connI; // connection's begin position
        e = en.xors[en.xors.length-1].soket().connD; // connection's end position
        props.arrow.dir='u';
        props.arrow.id = 'conn-in-'+en.xors[en.xors.length-1].id();
        conn = new Connection(props.arrow);
        conn.setP([b.x, b.y, e.x, e.y]);
        en.add(conn);
        en.connects.push(conn);

        // Creating dots of lines
        en.dots=[];
        let dotProps = {id: '', pos:{}, fill: props.arrow.fill};
        // XORs' dot
        let idx=0;
        en.connects.find(conn =>{
            if(conn.id() === 'conn-sw1-'+props.xorIds[idx]){
                //console.log(conn.id());
                dotProps.id = 'dot-'+props.xorIds[idx];
                idx++;
                dotProps.pos.x = conn.points()[0];
                dotProps.pos.y = conn.points()[1];
                en.dots.push(new Dot(dotProps));
                en.add(en.dots[en.dots.length-1]);
            }
        });

        // in dot
        en.connects.find(conn =>{
            if(conn.id() === 'conn-in-'+props.xorIds[props.xorIds.length-1]){
                //console.log(conn.id());
                dotProps.id = 'dot-'+props.xorIds[idx];
                idx++;
                dotProps.pos.x = conn.points()[0];
                dotProps.pos.y = conn.points()[1]-20;
                en.dots.push(new Dot(dotProps));
                en.add(en.dots[en.dots.length-1]);
            }
        });

        // connI to SW2
        b = en.soket().connI; // connection's begin position
        b.y -= 20;
        e = en.sw2.soket().connD; // connection's end position
        props.arrow.dir='u';
        props.arrow.id = 'conn-in-sw2';
        conn = new Connection(props.arrow);
        conn.setP([b.x, b.y, e.x, b.y, e.x, e.y]);
        en.add(conn);
        en.connects.push(conn);

        // last regBit to sw2 dot
        en.connects.find(conn =>{
            if(conn.id() === 'conn-'+en.bits[en.bits.length-1].id()+'-sw2'){
                dotProps.id = 'dot-sw2';
                idx++;
                dotProps.pos.x = conn.points()[0];
                dotProps.pos.y = conn.points()[1];
                en.dots.push(new Dot(dotProps));
                en.add(en.dots[en.dots.length-1]);
            }
        });

        // SW2 to ConnO
        b = en.sw2.soket().connR; // connection's begin position
        e = en.soket().connO; // connection's end position
        props.arrow.dir='r';
        props.arrow.id = 'conn-sw2-connO';
        props.arrow.type='line';
        conn = new Connection(props.arrow);
        conn.setP([b.x, b.y, e.x, b.y, e.x, e.y]);
        en.add(conn);
        en.connects.push(conn);
    }
    drawArrows();

    // CREATING X-LABELS //////////////////////////////////////////////
    createXlabels = function(){
        let pos={x:0, y:0};
        en.labels=[];
        let labNum = en.bits.length + 1;
        let rMidDist = (en.bits[1].soket().connL.x - en.bits[0].soket().connR.x) / 2;
        for (let i=0; i<labNum; i++){
            //let xLab = new SUP('X^'+i);
            let xLab = custText('X^'+i);
            if (i === 0){ // first X-label
                pos.x = en.connects.find(conn =>{
                    if(conn.id() === 'conn-sw1-'+en.bits[0].id()){ return conn;}
                }).points()[2]-7;
            }
            else if(i === labNum-1){ // last X-label
                pos.x = en.connects.find(conn =>{
                    if(conn.id() === 'conn-xor'+en.xors[en.xors.length -1].id()+'-sw1'){ return conn;}
                }).points()[0]-7;
            }
            else{ // oters X-label
                pos.x = en.bits[i-1].soket().connR.x + rMidDist -7;
            }
            xLab.id('xLabel'+i);
            xLab.position({x: pos.x, y: en.sw1.soket().connL.y - xLab.height() - 10});
            xLab.setSize(20);
            en.labels.push(xLab);
            en.add(en.labels[en.labels.length-1]);
        }
    }
    createXlabels();

    // calculate feadback value
    en.calcFB = function(){
        en.xors.forEach(xor => {
            if (xor.isFB === true){ // only for the feedback's XOR
                xor.res = xor.calc();
                xor.showRes();
                en.fb.setVal(xor.res);
            }
            en.getLayer().batchDraw();
        });

        en.xors[en.xors.length-1].calc();
        en.fb.setVal(en.xors[en.xors.length-1].res);
        en.getLayer().batchDraw();
    };

    // check feadback value
    en.checkFB = function(){
        let pass = false;
        en.xors.forEach(xor => {
            if (xor.isFB){ // only for the feedback's XOR
                if (xor.checkRes())  pass = true;
            }
        });
        return pass;
    };

    // check XOR's value
    en.checkXOR = function(){
        let pass = true;
        en.xors.forEach(xor => {
            if (xor.isFB === false){ // only for the feedback's XOR
                if (!xor.checkRes()) return pass = false;
            }
        });
        return pass;
    };

    // calculate XORS
    en.calcXORs = function (){
        en.xors.forEach(xor => {
            if (xor.isFB === false){ // skip the feedback's XOR
                xor.res = xor.calc();
                xor.showRes();
            }
            en.getLayer().batchDraw();
        });
    };

    // reset XORs' result
    en.resetXORs = function (){
        en.xors.forEach(xor => {
            xor.reset();
        });
    };

    // shift encoder's bits to right
    createShift = function(){
        en.chain = [];
        en.moving = false; // moving flag
        en.shiftR = function(speedFactor){
            if(en.moving) return;
            en.moving = true; // enable moving flag
            let chain=[], vals=[], xorIdx = [];
            // create the chain
            for(let i=0; i<=(en.bits.length-1); i++){
                chain.push(en.bits[i]);
                vals.push(en.vals[i]);
                let xor = en.xors.find(x => x.id() === 'xor'+i);
                if(typeof xor !== 'undefined') {
                    if (en.sw1.pos === 1){ // the sw1 is closed
                        chain.push(xor);
                        let val;
                        if (xor.txt.text() !== '0' && xor.txt.text() !== '1') val = 0;
                        else val = Number(xor.txt.text());
                        vals.push(val);
                        xorIdx.push(vals.length-1);
                    }
                    else // the sw1 is open
                        xor.disable();
                }
            }

            // update te LFSR values
            if (en.sw1.pos === 1) { // the sw1 is closed
                vals.unshift(vals[vals.length-1]); // insert the last value in the beginig
            }
            else vals.unshift(''); // insert the last value in the beginig

            vals.pop(); // remove the last value;
            let newVals=[];
            for(let i=0; i<vals.length; i++) if(xorIdx.findIndex(idx => idx === i) === -1) newVals.push(vals[i]); // get only bit's values
            en.vals = [...newVals];

            let loopFirst
            let loopLast;
            if(en.sw1.pos === 1) {
                loopFirst = chain.length - 2;
                loopLast = -1;
            }else{
                loopFirst = chain.length - 1;
                loopLast = 0;
            }

            en.chain = [...chain];
            for(let i=loopFirst; i>=loopLast; i--){
                if(i === loopFirst){
                    if(en.sw1.pos === 1) {
                        chain[i].txt.visible(false);
                        continue;
                    }
                    else continue;
                }

                let movement;
                let cloneObj;
                let targetPos = {x:0, y:0};
                let moveObj;

                if(i>loopLast){ // for all bits without the first one
                    moveObj = chain[i];
                    cloneObj = chain[i].txt.clone();
                    chain[i].txt.visible(false);
                    cloneObj.position(chain[i].txt.getAbsolutePosition());
                    if(chain[i+1].id().substr(0,1) === 'x') // check for next element is XOR
                        targetPos = {x: cloneObj.x() + 20, y: cloneObj.y()} // next element is XOR
                    else
                        targetPos = chain[i+1].txt.absolutePosition(); // next element is D
                }
                else { // for the first D element
                    moveObj = chain[chain.length - 1];
                    cloneObj = chain[chain.length - 1].txt.clone();
                    chain[chain.length - 1].txt.visible(false);
                    cloneObj.position(chain[chain.length - 1].txt.getAbsolutePosition());
                    cloneObj.y(cloneObj.y()-40);
                    targetPos = chain[0].txt.absolutePosition();
                    targetPos.y -= 40;
                }
                cloneObj.off();
                en.getLayer().add(cloneObj);
                cloneObj.moveToTop();
                en.getLayer().batchDraw();
                let moveTime = function(){
                    if(typeof speedFactor === 'undefined') speedFactor = 1;
                    let time;
                    time =  speedFactor === 0 ? 90 :
                            speedFactor === 1 ? 70 :
                            speedFactor === 2 ? 60 :
                            speedFactor === 3 ? 20 : 1;

                    let dist = getPointDist(cloneObj.position(), targetPos);
                    time =  dist > 30 && dist <= 120 ? Math.round(time * 0.5) : 0.01;
                    return time;
                };
                //console.log('moveTime = '+moveTime());
                movement = new SmoothMovement(cloneObj.position(), targetPos);
                movement.animate(
                    moveTime(),
                    function(pos){
                        cloneObj.position(pos);
                        en.getLayer().batchDraw();
                    },
                    function(){
                        cloneObj.destroy();

                        if(moveObj.id().substr(0,1) === 'x'){ // current element is XOR
                            moveObj.reset();
                            moveObj.txt.visible(true);
                        }
                        if(chain[i+1].id().substr(0,1) === 'd'){
                            chain[i+1].txt.text(en.vals[Number(chain[i+1].id().substr(1))].toString());
                            chain[i+1].txt.visible(true);
                        }

                        if(i === loopLast){
                            chain[0].txt.text(en.vals[0].toString());
                            chain[0].txt.visible(true);

                            en.moving = false; // disable moving flag
                        }
                        en.getLayer().batchDraw();
                    }
                );
            }
            return true;
        };
    }
    createShift();

    // EVENTS ---------------------------------------------------------------------------------------------------------
    // Encoder '>>>' click event
    en.S.on('click touchstart', function(){
        let currStep = alg.getCurrStep();
        if (currStep.name === 'calcXOR'){ // check for correct XOR results
            if (en.checkXOR()) alg.increment(); // enable shiftEN
            else {
                //en.info.show('e', lang.wrongXor);
                this.hover.show('e', lang.wrongXor);
                stat.error.add(lang.wrongXor);
                return;
            }
        }

        let check = alg.validStep('shiftEN');
        if (check === true) {
            en.shiftR(1);
            en.fb.reset();
            alg.increment(); // enable shiftCR
            console.log(alg.getCurrStep().description);
        }
        else {
            //en.info.show('e', check);
            this.hover.show('e', check);
            stat.error.add(check);
            return;
        }
    });

    // update xors' input values
    en.updateXORs = function(){
        en.xors.forEach(xor => {
            let in1, in2;
            if (xor.isFB === true){ // for XOR of the feedback
                in1 = en.vals[en.vals.length-1];
                in2 = ir.vals[ir.vals.length-1];
            }
            else {// for others XOR
                in1 = en.fb.val;
                in2 = en.vals[Number(xor.id().substr(3))];
            }
            //console.log(xor.id()+' => in1 = '+in1+', in2 = '+in2);

            xor.setInputs(in1, in2);
        });
    }

    // Encoder 'XOR' click event
    en.xors.forEach(xor => {
        xor.on('click touchstart', function(){
            let currStep =  alg.getCurrStep().name;
            // check for correct SW position
            if (currStep === 'set1SW'){
                if (en.sw1.pos !== 1){
                    //en.info.show('e', lang.wrongSw);
                    this.hover.show('e', lang.wrongSw);
                    stat.error.add(lang.wrongSw);
                    return;
                };
                if (en.sw2.pos !== 1){
                    //en.info.show('e',  lang.wrongSw);
                    this.hover.show('e', lang.wrongSw);
                    stat.error.add(lang.wrongSw);
                    return;
                }
                // enable  calcFB (calcParity)
                alg.increment();
            }

            // check for correct operation
            let check;
            if (xor.isFB === true){ // for FB's XOR
                check = alg.validStep('calcFB');
                if (check === true){
                    alg.markCurrStep('curr');
                    xor.invertRes();
                    console.log(alg.getCurrStep().description);
                }
                else {
                    this.hover.show('e', check);
                    stat.error.add(check);
                    return;
                }
            }
            else { // for other XORs
                if (alg.getCurrStep().name === 'calcFB'){
                    en.updateXORs(); // update XORs inputs for FB's XOR
                    if(en.checkFB()) {  // FB's value validating
                        en.fb.setVal(en.xors[en.xors.length-1].res);
                        en.updateXORs(); // update XORs inputs for othet XORs
                        console.log(alg.getCurrStep().description);
                        alg.increment(); // enable calcXOR
                    }
                    else{
                        //en.info.show('e', lang.wrongFb);
                        this.hover.show('e', lang.wrongFb);
                        stat.error.add(lang.wrongFb);
                        return;
                    }
                }

                check = alg.validStep('calcXOR');
                if (check === true)  {
                    alg.markCurrStep('curr');
                    xor.invertRes();
                    console.log(alg.getCurrStep().description);
                }
                else {
                    //en.info.show('e', check);
                    this.hover.show('e', check);
                    stat.error.add(check);
                    return;
                }
            }
        });
    });
    // Encoder 'SW1' click event
    en.sw1.on('click touchstart', function(){
        let check = alg.validStep('set1SW');
        if (check === true){
            model.algorithm.markCurrStep('curr');
            en.sw1.changePos();
            console.log(alg.getCurrStep().description+' SW1 => '+en.sw1.pos);
            return;
        }

        check = alg.validStep('set2SW');
        if (check === true){
            model.algorithm.markCurrStep('curr');
            en.sw1.changePos();
            console.log(alg.getCurrStep().description +' SW1 => '+en.sw1.pos);
        }
        else {
            //en.info.show('e', check);
            this.hover.show('e', check);
            stat.error.add(check);
            return;
        }
    });
    // Encoder 'SW2' click event
    en.sw2.on('click touchstart', function(){
        let check = alg.validStep('set1SW');
        if (check === true){
            model.algorithm.markCurrStep('curr');
            en.sw2.changePos();
            // set CR's input bit according to SW2 position
            if (en.sw2.pos === 1) cr.inBit = ir.vals[ir.vals.length - 1];
            else if(en.sw2.pos === 2) cr.inBit = ir.vals[en.vals.length - 1];
            console.log(alg.getCurrStep().description +' SW2 => '+en.sw2.pos);
            return;
        }
        // for second situation
        check = alg.validStep('set2SW');
        if (check === true){
            model.algorithm.markCurrStep('curr');
            en.sw2.changePos();
            console.log(alg.getCurrStep().description +' SW2 => '+en.sw2.pos);
        }
        else {
            //en.info.show('e', check);
            this.hover.show('e', check);
            stat.error.add(check);
            return;
        }
    });
    return en;
} //end of LFSR object


// REGISTER OBJECT //////////////////////////////////////////////////////////////
function REGISTER(props){
    // DEFAULT REGISTER properties
    props.id = props.id || 'reg';
    props.pos = props.pos || {x: 0, y: 0};
    props.width = props.width || 100;
    props.height = props.height || 60;
    props.name = props.name || 'Register';
    props.bitsNum = props.bitsNum || 7;
    props.fill = props.fill || 'FloralWhite';
    props.stroke = props.stroke || 'RosyBrown';
    props.txtColor = props.txtColor || 'Navy';
    props.pading = props.pading || 10;
    props.label = props.label || 'black';
    props.labelColor = props.labelColor || 'white';
    props.labelBgColor = props.labelBgColor || 'RoyalBlue';
    props.labelSize = props.labelSize || 16;
    props.labelPadding = props.labelPadding || 2;
    props.labelDistance = props.labelDistance || 5;
    props.shiftHoverTxt = props.shiftHoverTxt || 'Shift the register';
    props.flipHoverTxt = props.flipHoverTxt || 'Reverse the register';
    props.randHoverTxt = props.randHoverTxt || 'Generate random information bits';
    props.flipBtnLabel = props.flipBtnLabel || 'Generate random information bits';
    props.randBtnLabel = props.randBtnLabel || 'Generate random information bits';
    //props.bit.enabled = props.bit.enabled || true;

    let lang = model.lang.gn;

    // BIT properties
    if (typeof props.bit === 'undefined') props.bit = {};
    let ratio = 0.48, w = 20, h = w / ratio;
    props.bit.width = w;
    props.bit.height = h;

    let addDist = props.bit.width + props.pading*0.5;
    let height = props.bit.height+2*props.pading + 40;
    let width = addDist*(props.bitsNum)+addDist/1.4;

    // Create Register's panel
    let reg = new PANEL(props);
    reg.label.fontSize(reg.label.fontSize() + 2);
    reg.size({width: width, height: height});
    reg.dragmove(true);

    reg.inBit=''; // get in bit function
    reg.vals = []; // adding register's value property to reg
    reg.vals.length = props.bitsNum;
    reg.vals.fill(0);

    createButtons = function(){
        // register's Random button
        reg.rand = new Konva.Text({
            id: reg.id()+'-rand',
            name: 'Random bits',
            text: props.randBtnLabel,
            fontSize: props.labelSize,
            fontFamily: 'Calibri',
            padding: 0,
            align: 'center',
            verticalAlign: 'middle',
            fill: 'grey'
        });

        reg.add(reg.rand);
        reg.rand.position({
            x: 10,
            y: reg.height()-reg.rand.height()-5
        });
        reg.rand.visible(props.bit.enabled);
        reg.rand = over(reg.rand);
        reg.rand.hoverTxt = props.randHoverTxt;
        reg.rand = hover1(reg.rand, reg);

        // register's Flip button
        reg.F = new Konva.Text({
            id: reg.id()+'-d',
            name: 'Flip button',
            text: props.flipBtnLabel,
            fontSize: props.labelSize,
            fontFamily: 'Calibri',
            padding: 0,
            align: 'center',
            verticalAlign: 'middle',
            fill: 'grey'
        });
        reg.add(reg.F);
        reg.F.position({ x: reg.rand.x() + reg.rand.width()+15, y: reg.rand.y(),});
        reg.F = over(reg.F);
        reg.F.hoverTxt = props.flipHoverTxt;
        reg.F = hover1(reg.F, reg);

        // register's Write button
        reg.writeBtn = new Konva.Text({
            id: 'writeBtn',
            name: 'writeBtn',
            text:  '[...]',
            fontSize: props.labelSize,
            fontFamily: 'Calibri',
            align: 'center',
            verticalAlign: 'middle',
            fill: 'grey',
            visible:  true
        });
        reg.add(reg.writeBtn);
        reg.writeBtn.position({x: reg.F.x()+reg.F.width()+15, y: reg.F.y()});
        reg.writeBtn.hoverTxt = lang.writeBits;
        reg.writeBtn = hover1(reg.writeBtn, reg);
        reg.writeBtn = over(reg.writeBtn);
        let d  = $("<div id='Paste' class='dialog'></div>").appendTo( "body");
        d.dialog({autoOpen : false, modal : true, show : "blind", hide : "blind", minWidth: 350});
        d.dialog({title:lang.writeBits});
        //d.css({'font-size': 14, 'margin':0, 'padding': 5, 'color': 'black'});
        d.div = $("<div class='form-inline'></div>").appendTo(d);
        d.i = $("<input id='inputReg' type='text' class='form-control'/>").appendTo(d.div);
        d.i.css({'minWidth': 250});
        d.btn = $("<button id='dialogBtn' type='button' class='btn btn-primary btn-sm '>OK</button>").appendTo(d.div);
        d.btn.css({'margin-left':10});
        d.btn.on('click', function(){
            let input = [];
            let val = d.i.val().replace(/ /g ,'');
            for(let i=0; i<val.length; i++){
                if (val[i] !== '0' && val[i] !== '1') input.push(Number('0'));
                else input.push(Number(val[i]));
            }
            let ln = reg.vals.length;
            if(ln > input.length){
                let dif = ln - input.length;
                for(let i=0; i<dif; i++) input.push(Number('0'));
            }
            if(arrSum(input.slice(0,ln)) === 0) return; // check for zeros values
            reg.load(input.slice(0,ln));
            d.dialog('close');
        });

        reg.writeBtn.on('click touchstart',function(){
            $('#inputReg').val(reg.vals.toString().replace(/,/g,''));
            d.dialog('open');
            try {model.algorithm.markCurrStep('curr');
            } catch (e) { console.log(e);}
        });

        // register's Shift button
        reg.S = new Konva.Text({
            id: reg.id()+'-d',
            name: 'Shift button',
            text: '>>>',
            fontSize: props.labelSize + 5,
            fontFamily: 'Calibri',
            padding: 0,
            align: 'center',
            verticalAlign: 'middle',
            fill: 'grey'
        });
        reg.add(reg.S);
        reg.S.position({x: reg.writeBtn.x()+reg.writeBtn.width() + 15, y: reg.writeBtn.y()-3});
        reg.S = over(reg.S);
        reg.S.hoverTxt =  props.shiftHoverTxt;
        reg.S = hover1(reg.S, reg);
    }
    createButtons();

    // CREATING BITS
    createBits = function(){
        props.bit.name = 'Bit';
        props.bit.hoverTxt = props.bit.hoverTxt || 'Set Bit';
        props.bit.fill = 'RosyBrown';
        props.bit.stroke = 'RosyBrown';
        props.bit.txtColor = 'DarkBlue';
        props.bit.defVal = '';
        props.bit.labelDistance = 5;
        //props.bit.clickable = false;
        reg.bits=[]; // empty array for register's bits
        // first bit position
        let pos = {	x: addDist/2,
            y: reg.rect.height()/2 - props.bit.height/2};
        let zIndex = null;
        for (let i=0; i<props.bitsNum; i++){
            props.bit.id = reg.id()+'-bit'+i;
            //props.bit.pos = pos;
            let bit = new Button(props.bit);
            bit.position(pos);
            pos.x += addDist; //  change position for the next bit
            // setBit bit
            bit.setBit = function(){
                // set current bit
                if (reg.vals[i] === 0)  reg.vals[i] = 1;
                else 					reg.vals[i] = 0;
                bit.text(reg.vals[i]);
                try{ bit.getLayer().batchDraw()}catch{}
                return true;
            };

            bit.add(bit.rect, bit.txt);
            reg.bits[i] = bit;
            reg.add(reg.bits[i]);
            // default clickable event
            bit.enable(props.bit.enabled);
            if (i === 0) zIndex = bit.getZIndex();
            else bit.setZIndex(zIndex);
        }
    }
    createBits();

    // creating register's conection soket
    createSokets = function(){
        reg.soket = () => {
            let p = reg.rect.position();
            let w = reg.rect.width(), h = reg.rect.height();
            return{
                connR : {x: p.x + w, y: p.y + h/2},
                connL : {x: p.x, y: p.y + h/2},
                connU : {x: p.x + w/2, y: p.y},
                connD : {x: p.x + w/2, y: p.y + h}
            };
        };
    }
    createSokets();

    createShift = function(){
        reg.moving = false; // moving flag
        // shift the registe to right
        reg.shiftR = function( inBit='', inBitVal=0, speedFactor=1, endFunc){
            reg.moving = true; // enable moving flag
            //animation = animation || false;
            // shift the resgister's values
            // inBit = inBit || '';
            // inBitVal = inBitVal || '';
            // speedFactor = speedFactor || 1;

            reg.vals.pop(); // remove the last value
            reg.vals.unshift(inBitVal);
            let ln = (reg.bits.length-1);
            let loopTo=0; //moveTime = 90;
            if(typeof inBit === 'object' ) {
                loopTo =-1;
                // = 30;
            }
            for(let i=ln; i>=loopTo; i--){
                let cloneObj;
                if(i=== -1){ // for the in bit
                    cloneObj = inBit.txt.clone();
                    inBit.txt.visible(false);
                    cloneObj.position(inBit.txt.getAbsolutePosition());
                }else{ // for the register's bits
                    if(typeof reg.vals[i] === 'undefined') continue;
                    cloneObj = reg.bits[i].txt.clone();
                    reg.bits[i].txt.visible(false);
                    cloneObj.position(reg.bits[i].txt.getAbsolutePosition());
                }

                cloneObj.off();
                reg.getLayer().add(cloneObj);
                cloneObj.moveToTop();
                reg.getLayer().batchDraw();
                let targetPos = {x:0, y:0};
                let movement;
                if (i === ln) { // for the last register's bit
                    targetPos = {x: cloneObj.x() + 20, y: cloneObj.y()}
                }
                else{
                    if(i === -1)
                        targetPos = reg.bits[i+1].txt.absolutePosition();
                    else
                        targetPos = reg.bits[i+1].txt.absolutePosition();
                }

                let moveTime = function(){
                    //if(typeof speedFactor === 'undefined') speedFactor = 1;
                    let time;
                    time =  speedFactor === 0 ? 90 :
                        speedFactor === 1 ? 80 :
                            speedFactor === 2 ? 60 :
                                speedFactor === 3 ? 20 : 1;

                    let dist = getPointDist(cloneObj.position(), targetPos);
                    time =  dist > 40 && dist <= 150 ? Math.round(time * 0.8) : 0.1;
                    return time;
                };
                movement = new SmoothMovement(cloneObj.position(), targetPos);
                movement.animate(
                    moveTime(),
                    function(pos){
                        //reg.bits[i].txt.position(pos);
                        cloneObj.position(pos);
                        reg.getLayer().batchDraw();
                    },
                    function(){
                        //reg.bits[i].txt.position(reg.bits[i].rect.position());
                        cloneObj.destroy();
                        if(i === -1){
                            //reg.bits[i+1].text(reg.vals[i+1].toString());
                            reg.bits[i+1].text(reg.vals[i+1] !== -1 ? reg.vals[i+1].toString() : '');
                            reg.bits[i+1].txt.visible(true);
                        }
                        else{
                            reg.bits[i].text(reg.vals[i] !== -1 ? reg.vals[i].toString() : '');
                            if(i !== 0) reg.bits[i].txt.visible(true);
                        }
                        reg.getLayer().batchDraw();
                        if(i === loopTo) { // last iteration
                            reg.moving = false; // disable moving flag
                            if(typeof endFunc !== 'undefined'){ // run end function
                                endFunc();
                            }
                        }
                    }
                );
            } // end of for
        };
    }
    createShift();

    // flip the register
    reg.flip = function(){
        reg.vals.reverse();
        for (let i=0; i<reg.vals.length; i++){
            if (typeof reg.vals[i] === 'undefined') return;
            reg.bits[i].txt.text(reg.vals[i].toString());
        }
        if (reg.F.fill() === 'red') reg.flip.fill('grey');
        else reg.F.fill('red');
        reg.getLayer().batchDraw();
        return true;
    };
    reg.randGen = () =>{
        let vals=[];
        for(let i=0; i<reg.vals.length; i++){
            vals.push((Math.random() > 0.5) ? 1 : 0);
        }
        console.log('Random info bits generating!');
        reg.load(vals);
    };

    // load the register
    loadRegCreate = function(){
        reg.load = function(vals){
            if (typeof vals === 'undefined' || typeof vals === 'null'){
                return console.log('The values can not be empty');
            }
            else if (reg.vals.length !== vals.length) {
                return console.log('The length of values must be '+reg.vals.length );
            }
            reg.vals=vals;
            for (let i=0; i<props.bitsNum; i++){
                reg.bits[i].txt.text(reg.vals[i].toString());
                reg.getLayer().batchDraw();
            }
            return;
        }
    }
    loadRegCreate();

    // empty the register's values
    emptyRegCreate = function(){
        reg.empty = function (){
            reg.vals = []; // adding register's value property to reg
            reg.vals.length = props.bitsNum;
            reg.vals.fill(-1);
            reg.bits.forEach(bit => bit.text(''))
            reg.getLayer().batchDraw();
        }
    }
    emptyRegCreate();


    // connect from this node to other one
    connectTo = function(){
        reg.connectTo = function(tarPos){
            let b = reg.soket().connR;
            let e = tarPos;
            e.y -= reg.y();
            e.x -= reg.x();
            reg.lineTo = new Connection({id: reg.id()+'-lineto', dir: 'd', type:'line'});
            reg.lineTo.setP( [b.x, b.y, e.x, b.y, e.x, e.y]);
            reg.add(reg.lineTo);
        };
    }
    connectTo();

    // connect from other node to this one
    connectFrom = function(){
        reg.connectFrom = function(tarPos){
            let b = tarPos;
            let e = reg.soket().connL;
            b.y -= reg.y();
            b.x -= reg.x();

            reg.lineFrom = new Connection({id: reg.id()+'-lineFrom', dir: 'r'});
            reg.lineFrom.setP( [b.x, b.y, e.x-3, e.y]);
            reg.add(reg.lineFrom);
        };
    }
    connectFrom();


    // check for all bits are setted
    reg.areAllBitsSetted = () =>{
        for(let i=0; i<reg.vals.length; i++){
            if(typeof reg.vals[i] === 'undefined') return false;
        }
        return true;
    };

    // show register
    reg.show = function (){
        reg.visible(true);
        en.getLayer().batchDraw();
    };
    // hide register
    reg.hide = function (){
        reg.visible(false);
        reg.getLayer().batchDraw();
        reg.getLayer().batchDraw();
    };

    reg.autoCorrSize();
    return reg;
} // end of Register


// REGISTER OBJECT //////////////////////////////////////////////////////////////
function REGISTER1(props){
    // DEFAULT REGISTER properties
    props.id = props.id || 'reg';
    props.position = props.position || {x: 0, y: 0};
    props.width = props.width || 100;
    props.height = props.height || 60;
    props.name = props.name || 'Register';
    props.bitsNum = props.bitsNum || 7;
    props.fill = props.fill || 'FloralWhite';
    props.stroke = props.stroke || 'RosyBrown';
    props.txtColor = props.txtColor || 'Navy';
    props.pading = props.pading || 10;
    props.label = props.label || 'black';
    props.labelColor = props.labelColor || 'white';
    props.labelBgColor = props.labelBgColor || 'RoyalBlue';
    props.labelSize = props.labelSize || 16;
    props.labelPadding = props.labelPadding || 4;
    props.labelDistance = props.labelDistance || 5;
    props.draggable = props.draggable || false;
    props.randBtnName = props.randBtnName || 'Random Bits';
    props.bit.enabled = props.bit.enabled || true;
    props.paste = props.paste || 'Paste';

    let lang = model.lang.gn;

    // BIT properties
    if (typeof props.bit === 'undefined') props.bit = {};
    let ratio = 0.65, w = 26, h = w / ratio;
    //props.bit.width = w;
    //props.bit.height = h;

    //let addDist = props.bit.width + props.pading*0.8;
    let addDist = w + props.pading * 0.8;
    let height = h + 2 * props.pading + 55;
    let width = addDist*(props.bitsNum)+addDist/1.4;

    let reg = new PANEL(props);
    reg.label.fontSize(reg.label.fontSize() + 2);
    reg.size({width: width, height: height});
    reg.dragmove(true);

    // input bit, required for shift operation
    reg.inBit = '';

    // adding register's value property to reg
    reg.vals = [];
    reg.vals.length = props.bitsNum;
    reg.vals.fill(0);

    // register's Random button
    //reg.rand = new Konva.Group ({ id: reg.id()+'-rand'});
    reg.rand = new Konva.Text({
        id: reg.id()+'-randBtn',
        name: 'randomBtn',
        text:  props.randBtnLabel,
        fontSize: props.labelSize,
        fontFamily: 'Calibri',
        align: 'center',
        verticalAlign: 'middle',
        fill: 'grey',
        visible:  true
    });
    reg.rand.position({
        x: addDist/2,
        y: reg.rect.height() - reg.rand.height() - 5
    });
    reg.add(reg.rand);
    reg.rand.hoverTxt = props.randHover;
    reg.rand = hover1(reg.rand, reg);
    reg.rand = over(reg.rand);

    // register's Write button
    reg.writeBtn = new Konva.Text({
        id: 'writeBtn',
        name: 'writeBtn',
        text:  '[...]',
        fontSize: props.labelSize,
        fontFamily: 'Calibri',
        align: 'center',
        verticalAlign: 'middle',
        fill: 'grey',
        visible:  true
    });
    reg.add(reg.writeBtn);
    reg.writeBtn.hoverTxt = lang.writeBits;
    reg.writeBtn = hover1(reg.writeBtn, reg);
    reg.writeBtn = over(reg.writeBtn);
    let d  = $("<div id='Paste' class='dialog'></div>").appendTo( "body");
    d.dialog({autoOpen : false, modal : true, show : "blind", hide : "blind", minWidth: 350});
    d.dialog({title:lang.writeBits});
    //d.css({'font-size': 14, 'margin':0, 'padding': 5, 'color': 'black'});
    d.div = $("<div class='form-inline'></div>").appendTo(d);
    d.i = $("<input id='inputReg' type='text' class='form-control'/>").appendTo(d.div);
    d.i.css({'minWidth': 250});
    d.btn = $("<button id='dialogBtn' type='button' class='btn btn-primary btn-sm '>OK</button>").appendTo(d.div);
    d.btn.css({'margin-left':10});
    d.btn.on('click', function(){
        let input = [];
        let val = d.i.val().replace(/ /g ,'');
        for(let i=0; i<val.length; i++){
            if (val[i] !== '0' && val[i] !== '1') input.push(Number('0'));
            else input.push(Number(val[i]));
        }
        let ln = reg.vals.length;
        if(ln > input.length){
            let dif = ln - input.length;
            for(let i=0; i<dif; i++) input.push(Number('0'));
        }
        if(arrSum(input.slice(0,ln)) === 0) return; // check for zeros values
        reg.load(input.slice(0,ln));
        d.dialog('close');
    });

    reg.writeBtn.on('click touchstart',function(){
        $('#inputReg').val(reg.vals.toString().replace(/,/g,''));
        d.dialog('open');
        try {model.algorithm.markCurrStep('curr');
        } catch (e) { console.log(e);}
    });

    // CREATING BIT GROUPS
    props.bit.name = props.bit.name ||  'Bit';
    props.bit.hoverTxt = props.bit.hoverTxt || 'Set Bit';
    props.bit.fill = props.bit.fill || 'RosyBrown';
    props.bit.stroke = props.bit.stroke || 'RosyBrown';
    props.bit.txtColor = props.bit.txtColor || 'Snow';
    props.bit.defVal = props.bit.defVal || '';
    //props.bit.labelTxt = props.bit.labelTxt || '';
    props.bit.labelDistance = 5;
    props.bit.firstNum = props.bit.firstNum !== 1 ? props.bit.firstNum : 1;
    props.bit.numReverse = props.bit.numReverse || 'false';
    if(typeof props.bit.firstNum === 'undefined') props.bit.firstNum = 1;
    reg.bits=[]; // empty array for register's bits
    // first bit position
    let pos = {	x: addDist/2,
        y: reg.labelRect.height() + props.pading*2.5};
    let zIndex = null;
    for (let i=0; i<props.bitsNum; i++){
        //reg.vals.push(0);
        props.bit.id = reg.id()+'-bit'+i;
        props.bit.width = w;
        props.bit.height = h;
        let num = i;
        props.bit.label = props.bit.labelTxt+(num+props.bit.firstNum);
        if(props.bit.numReverse === 'true'){
            num = props.bitsNum - 1 - i;
            props.bit.label = props.bit.labelTxt+(num-props.bit.firstNum);
        }

        let bit = new Button(props.bit);
        reg.add(bit);
        //bit.size({width: w, height: h});
        bit.position(pos);
        bit.label.y(bit.rect.y() - bit.label.height()-1);
        pos.x += addDist; //  change position for the next bit

        // setBit bit
        bit.setBit = function(){
            // set current bit
            if (reg.vals[i] === 0)  reg.vals[i] = 1;
            else 					reg.vals[i] = 0;
            bit.text(reg.vals[i]);
            try{ bit.getLayer().batchDraw()}catch{}
            return true;
        };

        reg.bits.push(bit);
        bit = hover(bit);
        // default clickable event
        bit.enable(props.bit.enabled);

        if (i === 0) zIndex = bit.getZIndex();
        else bit.setZIndex(zIndex);
    }

    // write button position
    reg.writeBtn.position({
        x: reg.width()-38,
        y: reg.rand.y()
    });

    // creating register's conection soket
    reg.soket = () => {
        let p = reg.rect.position();
        let w = reg.rect.width(), h = reg.rect.height();
        return{
            connR : {x: p.x + w, y: p.y + h/2},
            connL : {x: p.x, y: p.y + h/2},
            connU : {x: p.x + w/2, y: p.y},
            connD : {x: p.x + w/2, y: p.y + h}
        };
    };

    // check for all bits are setted
    reg.areAllBitsSetted = () =>{
        for(let i=0; i<reg.vals.length; i++){
           if(typeof reg.vals[i] === 'undefined') return false;
        }
        return true;
    };

    reg.randGen = () =>{
        let vals=[];
        for(let i=0; i<reg.vals.length; i++){
            vals.push((Math.random() > 0.5) ? 1 : 0);
        }
        console.log('Random info bits generating!');
        reg.load(vals);
    };

    // load the register
    reg.load = function(vals){
        if (typeof vals === 'undefined' || typeof vals === 'null'){
            return console.log('The values can not be empty');
        }
        else if (reg.vals.length !== vals.length) {
            return console.log('The length of values must be '+reg.vals.length );
        }
        reg.vals=vals;
        for (let i=0; i<props.bitsNum; i++){
            reg.bits[i].text(reg.vals[i]);
        }
        try{ reg.getLayer().batchDraw()}catch{}
        return true;
    };

    // connect from this node to other one
    let arrowProps = {id: '', points:[], endConn:'', pointerLength: 8, pointerWidth: 5, fill: 'RoyalBlue ', stroke: 'RoyalBlue ', strokeWidth: 3};
    reg.connectTo = function(tarPos){
        let b = reg.soket().connR;
        let e = tarPos;
        e.y -= reg.y();
        e.x -= reg.x();
        reg.lineTo = new Konva.Line({
            id: reg.id()+'-lineTo',
            points: [b.x, b.y, e.x, b.y, e.x, e.y],
            fill: arrowProps.fill,
            stroke: arrowProps.stroke,
            strokeWidth: arrowProps.strokeWidth,
        });
        reg.add(reg.lineTo);
    };

    // connect from other node to this one
    reg.connectFrom = function(tarPos){
        let b = tarPos;
        let e = reg.soket().connL;
        b.y -= reg.y();
        b.x -= reg.x();

        reg.lineFrom = new Konva.Arrow({
            id: reg.id()+'-lineFrom',
            points: [b.x, b.y, e.x-3, e.y],
            fill: arrowProps.fill,
            stroke: arrowProps.stroke,
            strokeWidth: arrowProps.strokeWidth,
            pointerLength: arrowProps.pointerLength,
            pointerWidth: arrowProps.pointerWidth
        });
        reg.add(reg.lineFrom);
    };

    // show register
    reg.show = function (){
        reg.visible(true);
        try{ reg.getLayer().batchDraw()}catch{}
    };
    // hide register
    reg.hide = function (){
        reg.visible(false);
        try{ reg.getLayer().batchDraw()}catch{}
    };

    // setting the register width and height
    reg.width(reg.rect.width());
    reg.height(reg.rect.height());

    // disable the register
    reg.disable = function() {
        let objs = reg.getChildren();
        for (let i = 3; i <= objs.length - 1; i++) {
            objs[i].off()
        }
    }

    return reg;
} // end of Register

// HOVER METHOD
hover = (obj, layer) =>{
    let hover = new Konva.Label({
        id: obj.id()+'-toolTip',
        opacity: 0.75,
        visible: false
    });

    hover.add(
        new Konva.Tag({
            id: 'bg',
            fill: 'red',

            //visible: false
        })
    );

    hover.add(
        new Konva.Text({
            id: 'txt',
            text: '',
            fontFamily: 'Calibri',
            fontSize: 18,
            padding: 5,
            fill: 'white'
        })
    );
    // show info on pointer position
    hover.show = function(flag, str){
        console.log('Showing Hover');
        flag = flag || 'i';
        this.findOne('#txt').text(str);
        if (flag === 'e'){
            this.findOne('#bg').fill('red');
        }
        else if (flag === 'i')	this.findOne('#bg').fill('black');
        this.position(getRelativePointerPosition(obj));
        this.y(this.y()+22);
        if(typeof this.getParent() !== 'undefined') this.getParent().moveToTop();
        else  this.moveToTop();
        //this.moveToTop();
        this.visible(true);
        layer.batchDraw();
    };
    // hide info
    hover.hide = function(){
        this.visible(false);
        layer.batchDraw();
    };
    //obj.getParent().add(hover);
    //console.log(obj.getParent());
    if(obj.getParent() === null)  obj.add(hover);
    else obj.getParent().add(hover);
    obj.hover = hover;
    return obj;
} // end of HOVER

// HOVER METHOD
hover1 = (obj, group) =>{

    obj.hover = new Konva.Label({
        id: obj.id()+'-toolTip',
        opacity: 0.75,
        visible: false
    });

    obj.hover.add(
        new Konva.Tag({
            id: 'bg',
            fill: 'red',
            pointerDirection: 'left',
            pointerWidth: 10,
            pointerHeight: 10,
            lineJoin: 'round'
            //visible: false
        })
    );

    obj.hover.add(
        new Konva.Text({
            id: 'txt',
            text: '',
            fontFamily: 'Calibri',
            fontSize: 16,
            padding: 5,
            fill: 'white'
        })
    );
    // show info on pointer position
    obj.hover.show = function(flag, str){
        if(typeof str === 'undefined') return;
        //set width
        if(str.length > 40){
            this.findOne('#txt').width(250);
            this.findOne('#txt').fontSize(15);
        }

        flag = flag || 'i';
        this.findOne('#txt').text(str);
        if (flag === 'e') this.findOne('#bg').fill('red');
        else if (flag === 'i')	this.findOne('#bg').fill('black');

        let absPos = obj.absolutePosition();

        this.absolutePosition({x: absPos.x + obj.width(), y: absPos.y + obj.height()/2});
        if(obj.name() === 'arrow')  this.position(getRelPointerPos(obj, group));
        else                        this.absolutePosition({x: absPos.x + obj.width(), y: absPos.y + obj.height()/2});

        group.moveToTop();
        //obj.getLayer().moveToTop();
        obj.hover.moveToTop();
        obj.hover.visible(true);
        obj.getLayer().batchDraw();
    };
    // hide info
    obj.hover.hide = function(arg){
        // if(typeof arg !== 'undefined') return;
        if(this.findOne('#bg').fill() === 'red' && typeof arg === 'undefined') return;
        this.visible(false);
        try{obj.getLayer().batchDraw();} catch{}
    };

    // hide error messages
    obj.hover.on('mouseover touchstart', function(){
        obj.hover.visible(false);
        try{obj.getLayer().batchDraw();} catch{}
    });

    group.add(obj.hover);
    //obj.hover = hover;
    return obj;
} // end of HOVER

// get distance between two point
getPointDist = function(p1,p2){
    if(   typeof p1.x === 'undefined' || typeof p1.y === 'undefined'
       || typeof p2.x === 'undefined' || typeof p2.y === 'undefined') return console.log('Undefined points');

    let a,b;
    a= Math.abs(p2.y - p1.y);
    b= Math.abs(p2.x - p1.x);
    return Math.round((Math.sqrt((a * a) + (b * b))));
}


// get pointer position
getRelPointerPos = function(obj, group) {
    //console.log(obj.getParent().id());
    if(typeof group === 'undefined') return console.log('Cannot find pointer position');
    //console.log(parent.id());
    // the function will return pointer position relative to the passed node
    let transform = group.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();
    // get pointer (say mouse or touch) position
    let pos = group.getStage().getPointerPosition();
    // now we find relative point
    return transform.point(pos);
};

// get pointer position
getRelativePointerPosition = function(obj) {
    //console.log(obj.getParent().id());
    let parent = obj.getParent();
    if(typeof parent.getParent() === 'undefined') return console.log('Cannot find pointer position');
    if(parent.getParent().id() === '') return console.log('Cannot find pointer position');
    parent = parent.getParent();
    //console.log(parent.id());
    // the function will return pointer position relative to the passed node
    let transform = parent.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();
    // get pointer (say mouse or touch) position
    let pos = parent.getStage().getPointerPosition();
    // now we find relative point
    return transform.point(pos);
};

// INFO OBJECT
function INFO(layer, gr){
    let info = new Konva.Group ({id: gr.id()+'info', visible: false});
    info.rect = new Konva.Rect({
        id: info.id()+'-rect',
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        cornerRadius: 2,
    });
    info.txt = new Konva.Text({
        id: info.id()+'-txt',
        x: info.rect.x()+1,
        y: info.rect.y()+1,
        text: 'empty',
        fontSize: 14,
        fontFamily: 'Calibri',
        padding: 4,
        align: 'center',
        verticalAlign: 'middle',
        fill: 'black '
    });
    info.add(info.rect, info.txt);
    // show info on pointer position
    info.show = function(flag, str){
        // flag => 'i' = info; 'e' = error
        info.txt.text(str);
        if (flag === 'e') info.txt.fill('red');
        else if (flag === 'i')	info.txt.fill('black');
        info.rect.width(info.txt.width()+2);
        info.rect.height(info.txt.height()+1);
        info.position(gr.getRelativePointerPosition());
        info.y(info.y()+22);
        info.moveToTop();
        info.visible(true);
        layer.batchDraw();
    };
    // hide info
    info.hide = function(){
        info.visible(false);
        layer.batchDraw();
    };
    // get pointer position
    gr.getRelativePointerPosition = function() {
        // the function will return pointer position relative to the passed node
        let transform = gr.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // get pointer (say mouse or touch) position
        let pos = gr.getStage().getPointerPosition();
        // now we find relative point
        return transform.point(pos);
    };
    return info;
} // end of INFO


///// Button OBJECT //////////////////////////////////////////////////////
function Button(props){
    // BIT properties
    props.id = props.id || '';
    props.width = props.width || 20;
    // props.height = props.height || 41.6;
    props.height = props.height || 40;
    props.name = props.name || 'Button';
    props.hoverTxt = props.hoverTxt || '';
    props.fill = props.fill || 'RosyBrown';
    props.passivefill = props.passivefill || 'Silver';
    props.stroke = props.stroke || 'RosyBrown';
    props.strokeWidth = props.strokeWidth || 0;
    props.txtColor = props.txtColor || 'Navy';
    props.defVal = props.defVal || '0';
    props.label = props.label || '';
    props.labelSize = props.labelSize || 16;
    props.txtSize = props.txtSize || 26;
    props.labelDistance = props.labelDistance || 5;
    props.enabled = props.enabled || true;
    //console.log(props.id+' => clickable = '+props.clickable);
    // btn group
    let btn = new Konva.Group({
        width : props.width,
        height: props.height,
        id: props.id,
        name: props.name,
    });

    // btn rectangle
    btn.rect = new Konva.Rect({
        id: btn.id()+'-rect',
        name: 'rect',
        width : props.width,
        height: props.height,
        fill: props.fill,
        cornerRadius: 2,
    });
    btn.add(btn.rect);

    //btn hover text set
    btn.hoverTxt = props.hoverTxt;

    // default button's input value
    btn.inVal = 0;

    // creating btn soket
    btn.soket = () => {
        let p = btn.position();
        let w = btn.width(), h = btn.height();
        return{
            connR : {x: p.x + w, y: p.y + h/2},
            connL : {x: p.x, y: p.y + h/2},
            connU : {x: p.x + w/2, y: p.y},
            connD : {x: p.x + w/2, y: p.y + h}
        };
    };

    // put text in the center and middel of the rectangle
    btn.textCentering = function(){
        if(btn.rect.width() <= btn.txt.width()) btn.rect.width(btn.txt.width()+6);
        if(btn.rect.height() <= btn.txt.height()) btn.rect.height(btn.txt.height()+6);
        btn.txt.x(btn.rect.width()/2 - btn.txt.width()/2);
        btn.txt.y(btn.rect.height()/2 - btn.txt.height()/2);
        btn.height(btn.rect.height());
        btn.width(btn.rect.width());
        try{btn.getLayer().batchDraw();} catch{}
    }

    // // btn's text
    btn.name('text');
    // btn.txt = SUPB(props.defVal);
    btn.txt = new Konva.Text({name: 'text', text:props.defVal, align: 'center', verticalAlign: 'middle'});
    btn.add(btn.txt);
    btn.txt.fontSize(props.txtSize);
    btn.txt.fill(props.txtColor);
    //textCentering(); // centering the text

    // btn's label
    if (typeof props.label !== 'undefined'){
        let pos = {x: btn.rect.x(), y: btn.rect.y() + btn.rect.height() + 5};
        btn.label = SUPB(props.label);
        btn.name('label');
        //btn.label.position(pos);
        btn.label.x(btn.rect.width()/2 - btn.label.width()/2);
        btn.label.y(btn.rect.height() + 5);
        btn.label.fill(props.fill);
        btn.label.fontSize(props.labelSize);
        //btn.label.setColor(props.fill);
        //btn.label.setSize(props.labelSize);

        btn.label.x(btn.rect.x()+btn.rect.width()/2 - btn.label.width()/2);
        //btn.label = SUB(props.label);
        btn.add(btn.label);
    }

    btn.activeColor = props.fill;
    btn.passiveColor = props.passivefill;

    // btn size
    btn.width(btn.rect.width());
    btn.height(btn.rect.height());
    btn.size = function(size){
        if(typeof size === 'undefined') return {width: btn.width(), height: btn.height()};
        if(typeof size.width !== 'undefined'){
            if(size.width < btn.txt.width()) return console.log('size.width < btn.txt.width()');
            btn.rect.width(size.width);
        }
        //else console.log('size.width is undefined');
        if(typeof size.height !== 'undefined'){
            //if(size.height < btn.txt.height()) return console.log('size.height < btn.txt.height()');
            btn.rect.height(size.height);
        }

        btn.textCentering(); // centering the text
        //try {btn.getLayer().batchDraw();} catch{};
    };

    //text
    btn.text = function(str){
        if(typeof str === 'undefined') return btn.txt.text();
        btn.txt.text(str.toString());
        btn.textCentering(); // centering the text
    };

    //fill
    btn.fill = function(color){
        if(typeof color === 'undefined') return btn.rect.fill();
        btn.rect.fill(color);
        btn.label.fill(color);
        return true;
    };

    //stroke
    btn.stroke = function(color){
        if(typeof color === 'undefined') return btn.rect.stroke();
        btn.rect.stroke(color);
        return true;
    };

    //label fill
    btn.labelFill = function(color){
        if(typeof color === 'undefined') return btn.label.fill();
        btn.label.fill(color);
        return true;
    };


    btn.active = (flag) =>{
        if(typeof flag === 'undefined') return btn.isActive;
        if (flag === true){
            btn.isActive = true;
            btn.enable(true);
            btn.rect.fill(btn.activeColor);
            btn.label.fill(btn.activeColor);
        }
        else if (flag === false){
            btn.isActive = false;
            btn.enable(false);
            btn.rect.fill(btn.passiveColor);
            btn.label.fill(btn.passiveColor);
        }
        //if(typeof btn.getLayer() !== 'null') btn.getLayer().batchDraw();
    };

    // clickable method
    btn.enable = function (val){
        if(typeof val === 'undefined') val = true;
        if (val === true){
            // mоuse hover event
            btn = hover1(btn, btn);
            btn = over(btn);
        }
        else{
            // click event
            btn.off('click touchstart');
            // mоuse hover event
            btn.off('mouseover touchstart');
            // mоuse hover out event
            btn.off('mouseout touchend');
        }
    };

    // set new value of the element
    btn.update = function(){
        btn.txt.text(btn.inVal.toString());
    };
    btn.textCentering(); // centering the text

    // default btn hover events
    btn.active(props.enabled);
    return btn;
} // enf of button

///// POLY OBJECT //////////////////////////////////////////////////////
function POLY(str){
    console.log('str', str);
    //example str =>  P(X)=X^5+X^4+X^2+1
    //let name = str.split('=')[0];
    let polyMem = str.split('=')[1].split('+'); // [X^5, X^4, X^2, 1]
    polyMem.unshift(str.split('=')[0]); // add 'P(X)' in the begining of polyMem
    let poly = new Konva.Group();
    let corr = 1.1;
    poly.members=[];
    // creating the poly
    for (let i=0; i < polyMem.length; i++){
        let mem ={};
        if (i === 0){
            mem = SUP(polyMem[i]+' =');
            mem.position({x: 0, y: 0});
        }
        else if (i === 1){
            mem = SUP(polyMem[i]);
            mem.position({x: poly.members[i-1].x() + poly.members[i-1].width()*corr,
                y: poly.members[i-1].y()});
        }
        else{
            mem = SUP('+ '+polyMem[i]);
            mem.position({x: poly.members[i-1].x() + poly.members[i-1].width()*corr,
                y: poly.members[i-1].y()});
        }

        mem.setSize(16); // default poly size
        poly.members.push(mem);
        poly.add(poly.members[i]);
    }

    // calc the poly height and width
    poly.height(poly.members[0].height());
    poly.width(poly.members[0].x() - (poly.members[poly.members.length-1].x()+poly.members[poly.members.length-1].width()));

    // set poly size
    poly.setSize = function(val){
        let i=0;
        poly.members.forEach(mem =>{
            mem.setSize(val);
            if (i === 0){
                mem.x(0);
            }
            else if (i === 1){
                mem.x(poly.members[i-1].x() + poly.members[i-1].width()*corr);
            }
            else{
                mem.x(poly.members[i-1].x() + poly.members[i-1].width()*corr);
            }
            i++;
        });
        // recalc the poly height and width
        poly.height(poly.members[0].height());
        poly.width(poly.members[0].x() - (poly.members[poly.members.length-1].x()+poly.members[poly.members.length-1].width()));
    }
    // set poly color
    poly.setColor = function(color){
        poly.members.forEach(mem =>{
            mem.setColor(color);
        });
    }

    return poly;
} // end of POLY

///// SUP OBJECT //////////////////////////////////////////////////////
function SUP1(el){
    let str = new Konva.Group(); // empty Konva group
    str.txt = new Konva.Text({
        id: 'txt',
        x: str.x(),
        y: str.y(),
        text: el.split("^")[0],
        fontSize: 16,
        fontFamily: 'Arial',
        align: 'lext',
        verticalAlign: 'middle',
        fill: 'black'
    });
    str.sup = new Konva.Text({
        id: 'sup',
        x: str.txt.x() + str.txt.width()*1.1,
        text: el.split("^")[1],
        fontSize: str.txt.fontSize() * 0.75,
        fontFamily: str.txt.fontFamily(),
        align: 'lext',
        verticalAlign: 'middle',
        fill: str.txt.fill()
    });
    str.sup.y(str.txt.y() - str.sup.height()/2);

    // calc the group width end height
    str.width(str.txt.width() + str.sup.width());
    str.height(str.txt.height());

    // setting id
    str.setID = function(id){
        str.id(id);
        str.txt.id(id+'-txt');
        str.sup.id(id+'-sup');
    };

    // setting font size
    str.setSize = function(val){
        str.txt.fontSize(val);
        str.sup.fontSize(str.txt.fontSize() * 0.75);
        str.sup.x(str.txt.x() + str.txt.width()*1.1);
        str.sup.y(str.txt.y() - str.sup.height()/2);
        // recalc the group width end height
        str.width(str.txt.width() + str.sup.width());
        str.height(str.txt.height());
    };

    // setting color
    str.setColor = function(color){
        str.txt.fill(color);
        str.sup.fill(color);
    };

    // set str group size
    str.width(str.txt.width()+str.sup.width());
    str.height(str.txt.height()+5);

    str.add(str.txt,str.sup);
    return str;
} // end of SUP

///// SUP OBJECT //////////////////////////////////////////////////////
function SUPB(el){
    let str = new Konva.Group(); // empty Konva group
    let basis, idx;
    str.type = 'txt';
    basis = el.toString();
    // only text
    if(el.indexOf('^') !== -1){
        str.type = 'sup';
        basis = el.split("^")[0];
        idx = el.split("^")[1]
    }
    else if(el.indexOf('_') !== -1){
        str.type = 'sub';
        basis = el.split("_")[0];
        idx = el.split("_")[1];
    }

    str.str=el.toString();

    str.txt = new Konva.Text({
        name:'base',
        text: basis,
        fontFamily: 'Arial',
        align: 'left',
        verticalAlign: 'middle',
        fill: 'black'
    });
    str.add(str.txt);

    if(str.type !== 'txt'){
        str.supb = new Konva.Text({
            name:'index',
            text: idx,
            fontFamily: str.txt.fontFamily(),
            align: 'left',
            verticalAlign: 'middle',
            fill: str.txt.fill()
        });
        str.add(str.supb);
    }

    // correct the supb position after change
    str.updatePos = function(){
        if(str.type === 'sup')
            str.supb.position({ x: str.txt.width()*1.02 ,
                y: -str.txt.height()*0.2
            });
        else if(str.type === 'sub'){ // for sub
            str.supb.position({ x: str.txt.width()*1.02,
                y: str.txt.height()*0.5
            });
        }
        str.updateSize();
    };

    // set str group size
    str.updateSize = function(){
        if(str.type === 'txt'){
            str.width(str.txt.width());
            str.height(str.txt.height());
            return;
        }
        str.width(str.supb.x() + str.supb.width());
        if(str.type === 'sub')
            str.height(str.supb.y()+str.supb.height());
        if(str.type === 'sup')
            //str.height(str.txt.height() - str.supb.y());
            str.height(str.txt.height());
    };

    str.updatePos();

    // set font family
    str.fontFamily = function(font){
        if(typeof font === 'undefined') return str.txt.fontFamily();
        str.txt.fontFamily(font);
        if(str.type !== 'txt')
            str.supb.fontFamily(font);
        str.updatePos();
    };


    // set fontfamily
    str.fill = function(color){
        if(typeof color === 'undefined') return str.txt.fill();
        str.txt.fill(color);
        if(str.type !== 'txt')
            str.supb.fill(color);
    };

    // set default fill color
    str.defaultColor = 'black';
    str.defaultFill = (color)=>{
        if(typeof color === 'undefined') return str.defaultColor;
        str.defaultColor = color;
        str.fill(color);
    };

    // set text
    str.text = function(t){
        if(typeof t === 'undefined') return str.str;
        if(str.type !== 'txt'){
            if (str.type === 'sup'){
                str.txt.text(t.split("^")[0]);
                str.supb.text(t.split("^")[1]);
            }else if(str.type === 'sub'){
                str.txt.text(t.split("_")[0]);
                str.supb.text(t.split("_")[1]);
            }
        }
        else{
            str.txt.text(t);
        }

        str.str = t.toString();
        str.updatePos();
    };

    // setting id
    str.setID = function(id){
        str.id(id);
        str.txt.id(id+'-txt');
        if(str.type !== 'txt') str.supb.id(id+'-supb');
    };

    // set font size
    str.fontSize = function(val){
        if(typeof val === 'undefined') return str.txt.fontSize();
        str.txt.fontSize(val);
        if(str.type !== 'txt'){
            str.supb.fontSize(str.txt.fontSize() * 0.75);
        }
        str.updatePos();
    };

    //str.setSize(16);
    str.fontSize(16);

    // setting color method 1
    str.setColor = function(color){
        str.txt.fill(color);
        if(str.type !== 'txt')
            str.supb.fill(color);
    };
    // setting color method 2
    str.fill = function(color){
        if(typeof color === 'undefined') return  str.txt.fill();
        str.txt.fill(color);
        if(str.type !== 'txt')
            str.supb.fill(color);
    };
    return str;
} // end of SUPB

///// SUB OBJECT //////////////////////////////////////////////////////
function SUB(el){
    // only text
    if(el.search('_') === -1 && el.search('_') === -1) {
        let txt = new Konva.Text({
            text: el,
            fontFamily: 'Arial',
            align: 'left',
            verticalAlign: 'middle',
            fill: 'black',
            fontSize: 16
        });
        txt.defaultColor = 'black';
        return txt;
    }

    let str = new Konva.Group(); // empty Konva group
    str.str=el.toString();

    str.txt = new Konva.Text({
        name:'base',
        text: el.split("_")[0],
        fontFamily: 'Arial',
        align: 'left',
        verticalAlign: 'middle',
        fill: 'black'
    });
    str.sub = new Konva.Text({
        name:'sub',
        text: el.split("_")[1],
        fontFamily: str.txt.fontFamily(),
        align: 'left',
        verticalAlign: 'middle',
        fill: str.txt.fill()
    });
    // set font family
    str.fontFamily = function(font){
        if(typeof font === 'undefined') return str.txt.fontFamily();
        str.txt.fontFamily(font);
        str.sub.fontFamily(font);
    };


    // set fontfamily
    str.fill = function(color){
        if(typeof color === 'undefined') return str.txt.fill();
        str.txt.fill(color);
        str.sub.fill(color);
    };

    // set default fill color
    str.defaultColor = 'black';
    str.defaultFill = (color)=>{
        if(typeof color === 'undefined') return str.defaultColor;
        str.defaultColor = color;
        str.fill(color);
    };

    // set align
    str.align = function(align){
        if(typeof align === 'undefined') return str.txt.align();
        str.txt.align(align);
        str.sub.align(align);
    };

    // set verticalAlign
    str.verticalAlign = function(verticalAlign){
        if(typeof verticalAlign === 'undefined') return str.txt.verticalAlign();
        str.txt.verticalAlign(verticalAlign);
        str.sub.verticalAlign(verticalAlign);
    };

    // set text
    str.text = function(t){
        if(typeof t === 'undefined') return str.txt.text();
        if(t.search('_') !== -1){
            str.txt.text(t.split("_")[0]);
            str.sub.text(t.split("_")[1]);
            // str.sub.position({x:str.txt.x() + str.txt.width()*1.0 , y: str.txt.y() + str.sub.height()/2 + 2});
            str.updatePos();
        }
        else{
            str.txt.text(t);
            str.sub.text('');
        }
    };

    // set height
    str.height = function(val){
        if(typeof val === 'undefined') return str.txt.height();
        if(str.height() > val) return console.log('The height is lover than text size!');
        str.txt.y((val - str.txt.height()) / 2);
        // str.sub.position({x:str.txt.x() + str.txt.width()*1.0 , y: str.txt.y() + str.sub.height()/2 + 2});
        str.updatePos();
    };
    // set width
    str.width = function(val){
        if(typeof val === 'undefined') return str.txt.width() + str.sub.width();
        if(str.txt.width() > val) return console.log('The width is lover than text size!');
        str.txt.x((val - str.txt.width() + str.sub.width()) / 4);
        // str.sub.position({x:str.txt.x() + str.txt.width()*1.0 , y: str.txt.y() + str.sub.height()/2 + 2});
        str.updatePos();
    };

    // setting id
    str.setID = function(id){
        str.id(id);
        str.txt.id(id+'-txt');
        str.sub.id(id+'-sub');
    };

    // setting font size
    str.setSize = function(val){
        str.txt.fontSize(val);
        str.sub.fontSize(str.txt.fontSize() * 0.7);
        // str.sub.position({x:str.txt.x() + str.txt.width()*1.08 , y: str.txt.y() + str.sub.height()/2 + 2});
        str.updatePos();
        // recalc the group width end height
        str.width(str.txt.width() + str.sub.width());
        str.height(str.txt.height());
    };

    str.updatePos = function(){
        str.sub.position({x:str.txt.x() + str.txt.width()*1.0 , y: str.txt.y() + str.sub.height()/2 + 5});
    };

    // set font size
    str.fontSize = function(val){
        if(typeof val === 'undefined') return str.txt.fontSize();
        str.txt.fontSize(val);
        str.sub.fontSize(str.txt.fontSize() * 0.7);
        // str.sub.x(str.txt.x() + str.txt.width()-5);
        // str.sub.y(str.txt.y() + str.sub.height()/2 + 2);
        str.updatePos();
        // recalc the group width end height
        str.width(str.txt.width() + str.sub.width());
        str.height(str.txt.height());
    };

    //str.setSize(16);
    str.fontSize(16);


    // setting color method 1
    str.setColor = function(color){
        str.txt.fill(color);
        str.sub.fill(color);
    };
    // setting color method 2
    str.fill = function(color){
        if(typeof color === 'undefined') return  str.txt.fill();
        str.txt.fill(color);
        str.sub.fill(color);
    };

    // set str group size
    str.width(str.txt.width()+str.sub.width());
    str.height(str.txt.height());

    str.add(str.txt,str.sub);
    return str;
} // end of SUB

//// DOT OBJECT //////////////////////////////////////////////////////
function Dot(props){
    let dot = new Konva.Circle({
        id: 'dot'+props.id,
        x: props.pos.x,
        y: props.pos.y,
        radius: 4,
        fill: props.fill
    });
    return dot;
} // end of DOT

//// CONNECTION OBJECT //////////////////////////////////////////////////////
function Connection(props){
    // DEFAULT arrow properties
    //console.log(props);
    if(typeof props === 'undefined') props={};
    props.id = props.id || '';
    props.points = props.points || [0, 0, 0, 0];
    props.dir = props.dir || 'd';
    props.pointerLength = props.pointerLength || 8;
    props.pointerWidth = props.pointerWidth || 5;
    props.strokeWidth = props.strokeWidth || 3;
    props.fill = props.fill || 'RoyalBlue ';
    props.stroke = props.stroke || 'RoyalBlue ';
    props.type = props.type || 'arrow';

    let conn;
    if(props.type === 'arrow')
        conn = new Konva.Arrow({
            id: props.id,
            name: 'arrow',
            pointerLength: props.pointerLength,
            pointerWidth: props.pointerWidth,
            fill: props.fill,
            stroke: props.stroke,
            strokeWidth: props.strokeWidth,
            points: props.points
        });
    else
        conn = new Konva.Line({
            id: props.id,

            name: 'line',
            fill: props.fill,
            stroke: props.stroke,
            strokeWidth: props.strokeWidth,
            points: props.points
        });

    conn.dir = props.dir;
    conn.corr = 4;
    conn.flipped = false;
    conn.setP = function(p){
        switch (conn.dir){
            case 'r':
                p[p.length-2] -= conn.corr;
                break;
            case 'u':
                p[p.length-1] += conn.corr;
                break;
            case 'l':
                p[p.length-2] += conn.corr;
                break;
            case 'd':
                p[p.length-1] -= conn.corr;
                break;
            default:
                p[p.length-1] -= conn.corr;
                break;
        }
        conn.points(p);
    };

    conn.flip = (flag) =>{
        if (typeof flag === 'undefined') return conn.flipped;
        else if ((flag === true && conn.flipped === false) || (flag === false && conn.flipped === true)){
            let tp =  conn.points();
            let p = [];
            let ln = tp.length;
            p.push(tp[ln-2]);
            p.push(tp[ln-1]);
            p.push(tp[0]);
            p.push(tp[1]);
            conn.flipped = !conn.flipped;
            if (conn.dir === 'r') {
                conn.dir = 'l';
                p[0] += conn.corr;
                p[p.length-2] += conn.corr;
            }
            else if (conn.dir === 'l') {
                conn.dir = 'r';
                p[0] -= conn.corr;
                p[p.length-2] -= conn.corr;
            }
            else if (conn.dir === 'u') {
                conn.dir = 'd';
                p[1] -= conn.corr;
                p[p.length-1] -= conn.corr;
            }
            else if (conn.dir === 'd') {
                conn.dir = 'u';
                p[1] += conn.corr;
                p[p.length-1] += conn.corr;
            }
            conn.points(p);
            return 'flipped'
        }
        else return conn.flipped;
    };

    return conn;
}//end of CONNECTION

//// SWITCH OBJECT //////////////////////////////////////////////////////
function SWITCH(props){
    //CONFIG DEAFULT PROPERTIES
    if (typeof props.pos === 'undefined') props.pos = {};
    props.id = props.id || 'sw';
    props.name = props.name || 'Switch';
    props.hoverTxt = props.hoverTxt || 'Change position';
    props.pos.x = props.pos.x || 0;
    props.pos.y = props.pos.y || 0;
    props.width = props.width || 60;
    props.height = props.height || 50;
    props.fill = props.fill || 'DarkSeaGreen';
    props.stroke = props.stroke || 'DarkSeaGreen';
    props.pinColor = props.pinColor || 'RoyalBlue ';
    props.labelSize = props.labelSize || 16;
    props.labelDistance = props.labelDistance || 5;
    // switch group
    let sw = new Konva.Group({
        id: props.id,
        width : props.width,
        height: props.height,
        name: props.name,
        draggable: false
    });
    // switch's rectangle
    sw.rect = new Konva.Rect({
        id: sw.id()+'-rect',
        width : props.width,
        height: props.height,
        fill: props.fill,
        cornerRadius: 2,
    });
    // switch's title
    sw.lab = new Konva.Text({
        id: sw.id()+'-lab',
        y: sw.height() + props.labelDistance,
        width: sw.width(),
        text: props.name,
        fontSize: props.labelSize,
        fontFamily: 'Calibri',
        align: 'center',
        verticalAlign: 'middle',
        fill: props.fill,
    });
    sw.add(sw.rect, sw.lab);
    sw.type = props.type;

    // set hover info
    sw.hoverTxt = props.hoverTxt;

    sw.pos=0 // default swith's position
    // ---------------for switch with two positions---------------
    if(sw.type === 'pos2')
    {
        // creating switch's soket
        sw.soket = () => {
            let p = sw.position();
            let w = sw.rect.width(), h = sw.rect.height();
            return{
                connR : {x: p.x + w, y: p.y + h*2/3},
                connL : {x: p.x, y: p.y + h*2/3}
            };
        };

        // drawing the switch
        let points=[sw.soket().connR.x,sw.soket().connR.y,
            sw.soket().connR.x-10, sw.soket().connR.y,
            sw.soket().connL.x+10, sw.soket().connL.y-20];
        sw.line1 = new Konva.Line({
            id: sw.id()+'-l1',
            stroke: props.pinColor,
            strokeWidth: 3,
            points:points
        });
        sw.circ1 = new Konva.Circle({
            id: sw.id()+'-circ1',
            x: points[points.length-4],
            y: points[points.length-3],
            radius: 3,
            fill: props.pinColor
        });
        points=[sw.soket().connL.x,sw.soket().connR.y,
            sw.soket().connL.x+10, sw.soket().connL.y];
        sw.line2 = new Konva.Line({
            id: sw.id()+'-l2',
            stroke: props.pinColor,
            strokeWidth: 3,
            points:points
        });
        sw.circ2 = new Konva.Circle({
            id: sw.id()+'-circ2',
            x: points[points.length-2],
            y: points[points.length-1],
            radius: 3,
            fill: props.pinColor,
        });
        sw.add(sw.line1,sw.circ1,sw.line2,sw.circ2);

        // switch change position
        sw.setPos = function (pos){

            let points = sw.line1.points();
            if (pos === 1){
                sw.pos = 1;
                points[points.length-1] = points[points.length-3];
            }
            else if(pos === 0){
                sw.pos = 0;
                points[points.length-1] = points[points.length-1]-20;
            }
            sw.line1.points(points);
            sw.getLayer().batchDraw();
            return true;
        }

    }
    // ---------------for switch with three positions---------------
    else if(sw.type === 'pos3'){
        // creating switch's soket
        sw.soket = () => {
            let p = sw.position();
            let w = sw.rect.width(), h = sw.rect.height();
            return{
                connR : {x: p.x + w, y: p.y + h/2},
                connU : {x: p.x + w/4, y: p.y},
                connD : {x: p.x + w/4, y: p.y + h}
            };
        };

        // drawing the switch
        //long line
        let points=[sw.soket().connR.x, sw.soket().connR.y,
            sw.soket().connR.x-10, sw.soket().connR.y,
            sw.soket().connD.x, sw.soket().connR.y];
        sw.line1 = new Konva.Line({
            id: sw.id()+'-l1',
            stroke: props.pinColor,
            strokeWidth: 3,
            points:points
        });
        sw.circ1 = new Konva.Circle({
            id: sw.id()+'-circ1',
            x: points[points.length-4],
            y: points[points.length-3],
            radius: 3,
            fill: props.pinColor,
        });
        points=[sw.soket().connD.x,sw.soket().connD.y,
            sw.soket().connD.x,sw.soket().connD.y-7];
        // short line down
        sw.line2 = new Konva.Line({
            id: sw.id()+'-l2',
            stroke: props.pinColor,
            strokeWidth: 3,
            points:points
        });
        sw.circ2 = new Konva.Circle({
            id: sw.id()+'-circ2',
            x: points[points.length-2],
            y: points[points.length-1],
            radius: 3,
            fill: props.pinColor,
        });
        points=[sw.soket().connU.x,sw.soket().connU.y,
            sw.soket().connU.x,sw.soket().connU.y + 7];
        // short line down
        sw.line3 = new Konva.Line({
            id: sw.id()+'-l3',
            stroke: props.pinColor,
            strokeWidth: 3,
            points:points
        });
        sw.circ3 = new Konva.Circle({
            id: sw.id()+'-circ3',
            x: points[points.length-2],
            y: points[points.length-1],
            radius: 3,
            fill: props.pinColor,
        });
        sw.txt1 = new Konva.Text({
            id: sw.id()+'pos1',
            x: sw.rect.x() - 5,
            y: sw.rect.y() + sw.rect.height()+5,
            text: '1',
            fontSize: 16,
            fontFamily: 'Calibri',
            align: 'right',
            verticalAlign: 'middle',
            fill: props.pinColor,
        });
        sw.txt2 = new Konva.Text({
            id: sw.id()+'-pos2',
            x: sw.rect.x() - 5,
            y: sw.rect.y() - 20,
            text: '2',
            fontSize: 16,
            fontFamily: 'Calibri',
            align: 'right',
            verticalAlign: 'middle',
            fill: props.pinColor,
        });
        sw.add(sw.line1,sw.circ1,sw.line2,sw.circ2,sw.line3,sw.circ3,sw.txt1,sw.txt2);

        // switch change position method
        sw.setPos = function (pos){

            let points = sw.line1.points();
            if (pos === 1){
                sw.pos = 1;
                points[points.length-1] = sw.circ2.y();
            }
            else if(pos === 2){
                sw.pos = 2;
                points[points.length-1] = sw.circ3.y();
            }
            sw.line1.points(points);
            sw.getLayer().batchDraw();
            return true;
        }
    }

    sw.changePos = function(){
        let pos = sw.pos;
        if (sw.type === 'pos2'){
            if (pos === 0)      pos = 1;
            else if (pos === 1) pos = 0;
        }
        else if (sw.type === 'pos3'){
            if (pos === 0)     pos = 1;
            else if(pos === 1) pos = 2;
            else if(pos === 2) pos = 1;
        }
        sw.setPos(pos);
    };
    return sw;
}// end of SWITCH


//// XOR OBJECT //////////////////////////////////////////////////////
function XOR(props){
    // DEFAULT XOR properties
    props.id = props.id || '';
    props.name = props.name || 'xor';
    props.pos = props.pos || {x: 0, y: 0};
    props.width = props.width || 0; // 28
    props.height = props.height || 0;  // 28
    props.radius = props.radius || 15;
    props.hoverTxt = props.hoverTxt || 'Calculate XOR';
    props.fill = props.fill || 'DarkSalmon';
    props.stroke = props.stroke || 'DarkSalmon';
    props.resColor = props.resColor || 'black';
    props.labelSize = props.labelSize || 16;
    props.labelDistance = props.labelDistance || 5;
    props.txtSize = props.txtSize || 26;
    props.txtColor = props.txtColor || 'darkBlue';

    // xor group
    let xor = new Konva.Group({
        id: props.id,
        name: props.name,
        width : props.width,
        height: props.height,
    });

    // is this feedback XOR
    xor.isFB = false; // default is false

    // set hover text
    xor.hoverTxt = props.hoverTxt;

    // default XOR's result
    xor.res = 0;
    // the circle
    xor.circ = new Konva.Circle({
        id: xor.id()+'-circ',
        radius: props.radius,
        fill: props.fill,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.1,
    });

    xor.txtPos= () =>{
        return {x: xor.circ.x()-props.radius ,y: xor.circ.y()-props.radius};
    };

    // xor's plus sign
    xor.txt = new Konva.Text({
        id: xor.id()+'-txt',
        x: xor.txtPos().x,
        y: xor.txtPos().y,
        width: props.radius*2,
        height: props.radius*2,
        text: '+',
        fontSize:  props.txtSize,
        fontFamily: 'Calibri',
        align: 'center',
        verticalAlign: 'middle',
        fill: props.txtColor
    });
    // xor's result field
    xor.resTxt = new Konva.Text({
        id: xor.id()+'-res',
        x: xor.circ.x()-props.radius+20,
        y: xor.circ.y()-props.radius-18,
        width: props.radius*2,
        height: props.radius*2,
        text: xor.res.toString(),
        fontSize: 18,
        fontFamily: 'Calibri',
        align: 'center',
        verticalAlign: 'middle',
        fill: props.resColor,
        visible: false
    });
    // xor's label
    xor.label = new Konva.Text({
        id: xor.id()+'-lab',
        x: xor.circ.x() - props.radius - 5,
        y: xor.circ.y() + props.radius + props.labelDistance,
        width: props.radius*3,
        text: props.label,
        fontSize: props.labelSize,
        fontFamily: 'Calibri',
        align: 'center',
        verticalAlign: 'middle',
        fill: props.fill,
    });

    xor.add(xor.circ, xor.txt, xor.resTxt, xor.label);

    // creating xor's soket
    xor.soket = () => {
        let p = xor.position();
        let r = xor.circ.radius();
        return{
            connR : {x: p.x + r, y: p.y},
            connL : {x: p.x - r, y: p.y},
            connU : {x: p.x, y: p.y - r},
            connD : {x: p.x, y: p.y + r}
        };
    };


    // mark this Xor as feedback's XOR
    xor.markAsFB = function (val){
        if (val === true) {
            xor.isFB = true;
            xor.hoverTxt = props.fbHover;
        }
        else xor.isFB = false;
    };

    // setting XOR's input values
    xor.setInputs = function(in1, in2){
        xor.in1=in1;
        xor.in2=in2;
    };

    // Calculate this XOR
    xor.calc = function (){
        return  xor.in1 ^ xor.in2;
    };

    //Check this XOR's result
    xor.checkRes = function (){
        return xor.res === xor.calc() ? true : false;
    };

    // Invert the current result of this XOR
    xor.invertRes = function(){
        // if (xor.res === 0) xor.res = 1;
        // else xor.res = 0;
        if(xor.txt.text() === '+') xor.res = 0;
        else if (xor.res === 0) xor.res = 1;
        else xor.res = 0;
        xor.showRes();
        xor.getLayer().batchDraw();
    };

    // Reset this XOR
    xor.reset = function (){
        //xor.hideRes();
        //xor.resTxt.fill('DarkGray');
        xor.txt.text('+');
        xor.getLayer().batchDraw();
    };

    xor.showRes = function (){
        xor.txt.text(xor.res.toString());
        //xor.resTxt.fill(props.resColor);
        //xor.resTxt.visible(true);
        xor.getLayer().batchDraw();
    };

    xor.hideRes = function (){
        xor.resTxt.visible(false);
        xor.getLayer().batchDraw();
    };

    xor.disable = function(){
        xor.off();
        xor.circ.fill('DarkGrey');
        xor.txt.fill('DimGrey');
        xor.label.fill('DimGrey');
        xor.getLayer().batchDraw();
    }

    return xor;
}//end of XOR

function getHost(){
    let url=''; // url to php script
    let dbServerName=''
    let local  // true = localhost; false = public (ciot.uni-ruse.bg)
    // check for localhost by href
    let currHref = (window.location.href).split('//')[1].split('/')[0];
    if(currHref === 'localhost') local = true;
    else local = false;
    if(local){
        dbServerName = 'localhost';
        url = 'php/';
    }else{
        dbServerName = '172.20.138.121';
        url = 'https://ciot.uni-ruse.bg/ndks/';
    }
    return {dbServerName: dbServerName, url:url};
}

//sent data to data base
function sentData (params){
    // let url=''; // url to php script
    // let local  // true = localhost; false = public (ciot.uni-ruse.bg)
    // // check for localhost by href
    // let currHref = (window.location.href).split('//')[1].split('/')[0];
    // if(currHref === 'localhost') local = true;
    // else local = false;
    // if(local){
    //     params.dbServerName = 'localhost';
    //     url = 'php/logToDB.php';
    // }else{
    //     params.dbServerName = '172.20.138.121';
    //     url = 'https://ciot.uni-ruse.bg/ndks/logToDB.php';
    // }

    let host = getHost();
    let url = host.url;
    params.dbServerName = host.dbServerName;

    const form = document.createElement('form');
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];
            form.appendChild(hiddenField);
        }
    }
    $.ajax({
        url: url+'logToDB.php',
        type:'post',
        data:$(form).serialize(),
        success:function(response){
            console.log('Data are sent!');
            console.log('Ajax response: ',response);
        }
    });
}

// Hamming Encoder, return codeword;
function hcEncoder(props){
    if(typeof props.infoBits === 'undefined') {return console.log('Info bits aren\'t defined!');}
    if(typeof props.l === 'undefined') props.l=1;
    if(typeof props.errCount === 'undefined') props.errCount=0;
    let m, l, k, n, infoBits;
    infoBits = props.infoBits;
    l = props.l;
    m =  infoBits.length;
    // calculating control bits number k
    for(let i=3; i<7; i++){
        if(((Math.pow(2, i) - i) >= (m + 1))){
            if(l === 1) k = i;
            else k = i+1;
            break;
        }
    }
    n=m+k;
    let cw= new Array(n).fill(0);

    let cBitsIdx=[];
    if(l===1) {
        for(let i=0; i<k; i++) cBitsIdx.push(Math.pow(2, i)-1);
    }
    else{
        cBitsIdx.push(0);
        for(let i=0; i<k-1; i++) cBitsIdx.push(Math.pow(2, i));
    }
    let iBitsIdx=0;
    for(let i=0; i<n; i++){
        if(typeof cBitsIdx.find(el => el===i) !== 'undefined') continue;
        cw[i] = infoBits[iBitsIdx];
        iBitsIdx++;
    }

    for(let i=0; i<k; i++){
        if (l===2 && i===0) continue;
        let pow = i;
        if(l === 2) pow -=1;
        let gr = Math.pow(2, pow);
        let res=0;
        for(let j=cBitsIdx[i]; j<n; j+=gr*2){
            for(let t=j; t<j+gr; t++){
                res ^=cw[t];
            }
        }
        cw[cBitsIdx[i]]=res;
    }
    if (l===2){
        let res=0;
        for(let i=1; i<n; i++) res ^=cw[i];
        cw[0]=res;
    }

    if(props.errCount > 0 && props.errCount < cw.length){
        let errPos = [];
        let idx=[];
        for(let i=0; i<cw.length; i++) idx.push(i);
        for(let i=0; i<props.errCount; i++){
            let pos = idx[Math.floor(Math.random() * idx.length)];
            errPos.push(pos);
            idx.splice(idx.indexOf(pos),1);
        }
        errPos.forEach(i =>{
            cw[i] = cw[i] === 0 ? 1 : 0;
        });
    };

    return cw;
}

// Hamming Encoder, return codeword;
function hcMatEncoder(props){
    if(typeof props.infoBits === 'undefined') {return console.log('Info bits aren\'t defined!');}
    if(typeof props.l === 'undefined') props.l=1;
    if(typeof props.errCount === 'undefined') props.errCount=1;
    let m, l, k, n, infoBits;
    infoBits = props.infoBits;
    l = props.l;
    m =  infoBits.length;
    // calculating control bits number k
    for(let i=3; i<7; i++){
        if(((Math.pow(2, i) - i) >= (m + 1))){
            if(l === 1) k = i;
            else k = i+1;
            break;
        }
    }
    n=m+k;
    let cw= new Array(n).fill(2);

    let cBitsIdx=[];
    if(l===1) {
        for(let i=0; i<k; i++) cBitsIdx.push(Math.pow(2, i)-1);
    }
    else{
        cBitsIdx.push(0);
        for(let i=0; i<k-1; i++) cBitsIdx.push(Math.pow(2, i));
    }
    let iBitsIdx=0;
    for(let i=0; i<n; i++){
        if(typeof cBitsIdx.find(el => el===i) !== 'undefined') continue;
        cw[i] = infoBits[iBitsIdx++];
    }

    // creating H matrix column labels
    let colLabels = [];
    let idxC, idxS = 1;
    let init, ln;
    if(l === 2) {
        init = 0;
        ln = n;
        idxC = 0;
    }
    else{
        init = 1;
        ln = n + 1;
        idxC = 1;
    }
    for(let i=init; i<ln; i++){
        if(i === 0 || i === 1 || i === 2 || i === 4 || i === 8 || i === 16 || i === 32){
            colLabels.push('C'+ idxC++);
        }
        else{
            colLabels.push('S'+ idxS++);
        }
    }

    // calc H matrix values
    let size = {r: k, c: n};
    let Hv = new Array(size.r);
    for(let i=0; i<size.r; i++) {
        Hv[i] = new Array(size.c);
    }
    for(let i=0; i<size.c; i++) {
        let numDec = l === 1 ? (i+1) : i;
        let numStr = parseInt(numDec, 10).toString(2);
        let ln = l === 1 ? (size.r-1) : (size.r-2);
        while(numStr.length < (ln+1))  numStr = '0'+numStr;
        for (let j=ln; j>=0; j--){
            Hv[j][i] = Number(numStr[j]);
        }
    }
    // for C0 of H matrix
    if(l === 2){
        for(let i=0; i<size.c; i++){
            Hv[size.r-1][i] = 1;
        }
    }

    // creating H' matrix column labels
    let colLabels1 = [];
    for(let i=0; i<colLabels.length; i++){
        if(colLabels[i].substr(0,1) === 'S') colLabels1.push(colLabels[i]);
    }
    for(let i=colLabels.length-1; i>=0; i--){
        if(colLabels[i].substr(0,1) === 'C') colLabels1.push(colLabels[i]);
    }

    let H_v = new Array(size.r);
    for(let i=0; i<size.r; i++) H_v[i] = new Array(size.c);
    // calculating H' matrix values
    for(let i=0; i<size.c; i++){
        let colIdx = colLabels.indexOf(colLabels1[i]);
        for(let j=0; j<size.r; j++){
            H_v[j][i] = Hv[j][colIdx]; // by ordering columns
        }
    }
    //calculating last row for C0
    if(l === 2){
        for (let i = 0; i < size.c; i++) {
            let xor = 0;
            for (let j = 0; j < size.r; j++) xor ^= H_v[j][i];
            H_v[size.r - 1][i] = xor;
        }
    }

    // calculating control bits
    let cbits = [];
    let cbitIdx = m;
    for(let i=0; i<size.r; i++){
        let id = colLabels1[cbitIdx++];
        let res = 0;
        for(let j=0; j<m; j++) {
            if(H_v[i][j] === 1) {
                let val = cw[colLabels.indexOf(colLabels1[j])];
                res ^= val;
            }
        }

        cw[colLabels.indexOf(id)] = res;
    }
    return cw;
}


/*

SmoothMovement.js

Facilitates smooth movement effects

Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a SmoothMovement. A SmoothMovement produces integer position values
 * representing movement towards a target position, with a maximum acceleration
 * or deceleration of one distance unit per time unit squared. The parameters
 * are:
 *
 * position - the initial position - this optional parameter defaults to zero
 * target   - the target position - this optional parameter defaults to the
 *            value of the position parameter
 */
function SmoothMovement(position, target){
    position.x = Math.round(position.x);
    position.y = Math.round(position.y);
    target.x = Math.round(target.x);
    target.y = Math.round(target.y);
    // initialise the position, target, velocity, and animation interval
    this.position          = (position == undefined ? {x: 0, y:0}   : position);
    this.target            = (target   == undefined ? this.position : target);
    this.velocity          = {x:0, y:0};
    this.animationInterval = null;
}

/* Updates the position an velocity for this SmoothMovement, and returns the
 * new position.
 */
SmoothMovement.prototype.update = function(){

    // check whether the velocity X is negative
    if (this.velocity.x < 0){
        // check whether we must decelerate or can accelerate
        if (this.target.x > this.position.x - this.velocity.x * (this.velocity.x - 1) / 2){

            // we must decelerate to avoid overshooting, so decrease the speed
            this.velocity.x ++;

        }else if (this.target.x <= this.position.x - (this.velocity.x - 1) * (this.velocity.x - 2) / 2){
            // we can accelerate without overshooting, so increase the speed
            this.velocity.x --;
        }

    }else{
        // check whether we must decelerate or can accelerate
        if (this.target.x < this.position.x + this.velocity.x * (this.velocity.x + 1) / 2){
            // we must decelerate to avoid overshooting, so decrease the speed
            this.velocity.x--;

        }else if (this.target.x >= this.position.x + (this.velocity.x + 1) * (this.velocity.x + 2) / 2){
            // we can accelerate without overshooting, so increase the speed
            this.velocity.x++;
        }

    }

    // check whether the velocity Y is negative
    if (this.velocity.y < 0){
        // check whether we must decelerate or can accelerate
        if (this.target.y > this.position.y - this.velocity.y * (this.velocity.y - 1) / 2){
            // we must decelerate to avoid overshooting, so decrease the speed
            this.velocity.y ++;

        }else if (this.target.y <= this.position.y - (this.velocity.y - 1) * (this.velocity.y - 2) / 2){

            // we can accelerate without overshooting, so increase the speed
            this.velocity.y --;
        }

    }else{
        // check whether we must decelerate or can accelerate
        if (this.target.y < this.position.y + this.velocity.y * (this.velocity.y + 1) / 2){
            // we must decelerate to avoid overshooting, so decrease the speed
            this.velocity.y--;

        }else if (this.target.y >= this.position.y + (this.velocity.y + 1) * (this.velocity.y + 2) / 2){
            // we can accelerate without overshooting, so increase the speed
            this.velocity.y++;
        }
    }

    // update the position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // return the new position
    return this.position;

}

/* Returns true if this SmoothMovement has stopped, and false otherwise. Note
 * that this means that both the velocity and acceleration are zero (or
 * equivalently, that the velocity is zero and the position is at the target).
 */
SmoothMovement.prototype.hasStopped = function(){

    // return whether we have stopped
    return ((this.position.x === this.target.x && this.velocity.x === 0) && (this.position.y === this.target.y && this.velocity.y === 0));

}

/* Animates this SmoothMovement by calling the update function repeatedly until
 * the SmoothMovement has stopped. The parameters are:
 *
 * interval       - the interval between updates, in milliseconds
 * updateListener - a function to call after each update. This function is
 *                  passed the new position and the SmoothMovement as its
 *                  first and second parameters.
 * stopListener   - a function to call when the SmoothMovement has stopped. This
 *                  function is passed the SmoothMovement as its parameter. This
 *                  parameter is optional.
 */
SmoothMovement.prototype.animate = function(interval, updateListener, stopListener){

    // clear any current animation interval
    if (this.animationInterval) window.clearInterval(this.animationInterval);

    // create the new animation interval
    this.animationInterval = window.setInterval(
        this.createAnimationClosure(updateListener, stopListener), interval);

};

/* Creates a closure for use in the animate function. This function is not
 * intended to be used elsewhere. The parameters are:
 *
 * updateListener - a function to call after each update
 * stopListener   - a function to call when the SmoothMovement has stopped
 */
SmoothMovement.prototype.createAnimationClosure = function(updateListener, stopListener){

    // store a reference to the 'this' object
    var thisObject = this;

    // return the animation closure
    return function(){

        // update the SmoothMovement
        thisObject.update();

        // call the update listener
        updateListener(thisObject.position, thisObject);

        // check whether the SmoothMovement has stopped
        if (thisObject.hasStopped()){
            // clear the animation interval
            window.clearInterval(thisObject.animationInterval);
            thisObject.animationInterval = null;

            // call the stop listener if one was supplied
            if (stopListener) stopListener(thisObject);
        }
    }
}



// Class Tasks
class Tasks{
    constructor (model, reference){
        this.stage ='learning';
        this.model = model;
        let rowTasks = new TasksList(model);
        let tasks=[]; // all tasks
        let div = $("<div class='tabs'></div>"); // container
        let outerDiv = $("<div class='tab-button-outer'></div>").appendTo(div);
        let ul = $("<ul id='tab-button'></ul>").appendTo(outerDiv);
        rowTasks.forEach(t =>{
            let task = {}; // single temp task
            task.id = t.id;
            // tab's button (title)
            let li = $("<li id='li-"+t.id+"'></li>").appendTo(ul)
            task.title = $("<a href='#"+t.id+"'>"+t.title+"</a>").appendTo(li);
            // tab's content
            let contentDiv = $("<div id='"+t.id+"' class='tab-contents'></div>").appendTo(div); // main div
            if(t.id === 'task0')
                task.content = $("<p class='task' id='t"+t.id.substring(4)+"'>"+t.text+"</p>").appendTo(contentDiv);
            else
                task.content = $("<p class='task hidden' id='t"+t.id.substring(4)+"'>"+t.text+"</p>").appendTo(contentDiv);

            task.content.append("<hr>");
            task.solutions = $("<div class='solDiv' id='solDiv"+t.id.substring(4)+"'></div>").appendTo(contentDiv);
            task.dialogs = [];
            task.footer = $("<div id='footerTask"+t.id.substring(4)+"' class='footer'></div>").appendTo(contentDiv);

            // add button for solving task in learning stage
            if(t.id === 'task0') {
                task.footer.btn = $("<button id='solveTasksBtn' type=\"button\" class=\"btn btn-primary btn-sm\" style='display: none; margin:5px'>Решаване на задачите</button>").appendTo(task.footer);
                task.footer.btn.on('click', () => {
                    this.stage = 'solving';
                    $(".hidden").removeClass("hidden");
                    $('#solveTasks').hide();
                    $('#multiBtn').click();
                    this.tasks.find(t => t.id==='task1').title.click();
                });
            }

            tasks.push(task); // insert task in the array
        });

        // append after reference element
        $( "#"+reference).after(div);
        this.applyTabsIA();
        this.tasks = tasks;
    }

    //  find binary combination in the tasks
    check(dialog) {
        //let tasks = $(".task");
        let keywords=[];
        let cls = '';

        // get the active tab
        let aTab = tasks.tasks[parseInt($(".is-active")[0].id.substr(7))];
        // parse all bolded strings inside active tab
        keywords = aTab.content[0].innerHTML.match(/<b>(.*?)<\/b>/g).map(function(val){
            return val.replace(/<\/?b>/g,'');
        });

        // create message text
        let text = '';
        if (this.stage === 'learning') {
            if(this.model !== 'ccPolyModel' && this.model !== 'ccLFSRModel')
                text = 'Решен пример в ' + (model.process === 'enc' ? model.lang.gn.modeEnc.toLowerCase() : model.lang.gn.modeDec.toLowerCase())+'.';
            else
                text  = 'Решен пример с код откриващ '+ (model.t === 2 ? 'двойни' : 'тройни') +' грешки.'
        } else {
            text = 'Решение.';
        }

        let matchs = [];
        // searching of keywords
         for(let i=0; i<keywords.length; i++){
            matchs[i] = false;
            switch (keywords[i]){
                case 'кодира':
                case 'encoded':
                case 'кодиране':
                case 'encoding':
                    if(model.process === 'enc') matchs[i] = true;
                break;

                case 'декодира':
                case 'decode':
                case 'декодиране':
                case 'decoding':
                    if(model.process === 'dec') matchs[i] = true;
                break;

                case 'единични':
                case 'единична':
                case 'single':
                    if(model.t === 1) matchs[i] = true;
                break;

                case 'двойни':
                case 'двойна':
                case 'double':
                    if(model.t === 2) matchs[i] = true;
                break;

                case 'тройни':
                case 'тройна':
                case 'triple':
                    if(model.t === 3) matchs[i] = true;
                break;

                default: // for binary values
                    let bins = (model.process === 'enc' ?
                                model.ir.vals.toString().replace(/,/g,'') :
                                model.cr.vals.toString().replace(/,/g,''));
                    if(keywords[i] === bins) matchs[i] = true;
            }
        } // end of for

        // set the class of button
        // if (model.stat.error.count === 0)   cls = 'alert-success';
        // else                                cls = 'alert-danger';
        cls = model.stat.error.count === 0 ? 'btn btn-success' : 'btn btn-danger';

        let append = false;
        if (this.stage === 'learning'){
            append = matchs.find(el => {if (el === true) return true});
        }
        else{ // task cheking
            append = matchs.every((flag) => flag === true);
        }

        // append message
        if (append) {
            let btn = $("<button type='button'  class='" + cls + "' style='padding:5px; margin:5px;'>"+(aTab.dialogs.length +1)+". " + text + "</button>").appendTo(aTab.solutions);
            btn.on('click', function(){
                dialog.dialog('isOpen') === true ?  dialog.dialog('close') : dialog.dialog('open');
            });
            dialog.dialog('option','title',(aTab.dialogs.length +1)+'. '+ dialog.dialog('option','title'))
            aTab.dialogs.push(dialog);
        }
        else console.log('Keywords: ',keywords.toString(), ' => Not found!');

        if(this.stage === 'learning'){
            // check for unlocking tasks
            let unlock = true;
            //console.log('text = ', aTab.solutions[0].innerText);
            //console.log('keywords: ', keywords.toString());
            keywords.forEach(keyword => {
                if(aTab.solutions[0].innerText.search(keyword) === -1)  unlock = false;
            });
            if(unlock) $('#solveTasksBtn').show(); // show unlock button
        }
    } // end of check

    // for for tabs
    applyTabsIA() {
        let $tabButtonItem = $('#tab-button li'),
            $tabSelect = $('#tab-select'),
            $tabContents = $('.tab-contents'),
            activeClass = 'is-active';

        $tabButtonItem.first().addClass(activeClass);
        $tabContents.not(':first').hide();

        $tabButtonItem.find('a').on('click', function(e) {
            let target = $(this).attr('href');
                $tabButtonItem.removeClass(activeClass);
            $(this).parent().addClass(activeClass);
            $tabSelect.val(target);
            $tabContents.hide();
            $(target).show();
            e.preventDefault();
        });

        $tabSelect.on('change', function() {
            let target = $(this).val(), targetSelectNum = $(this).prop('selectedIndex');
            $tabButtonItem.removeClass(activeClass);
            $tabButtonItem.eq(targetSelectNum).addClass(activeClass);
            $tabContents.hide();
            $(target).show();
        });
    } // end of applyTabsIA


}// end of Task tabs


// generate random bits
function randBits(length){
    let vals=[];
    for(let i=0; i<length; i++) vals.push((Math.random() > 0.45)  ?  1 : 0);
    return {vals: vals,
            str: vals.toString().replace(/,/g,'')}
}

// cyclic code generator polynomial
class ccGenPolyDialog{
    constructor(opt){
        if(typeof opt === 'undefined') return console.error('GenPoly option not fount!')
        this.gpDialog = $("<div id='genPolyDialog' class='menuItem dialog' ></div>").appendTo('body');
        this.gpDialog.dialog({autoOpen : false, modal : false, show : "blind", hide : "blind",
            width: 'auto', height:'auto'});
        this.gpDialog.dialog({title: lang.gn.genPolys});
        this.gpDialog.css({'font-size': 14, 'margin':0, 'padding': 5, 'color': 'DarkBlue'});

        // create table
        this.table = {};
        let thisDialog = this.gpDialog;
        let btn=$('#selGenPolyBtn');
        btn.html(lang.gn.selGenPoly);
        btn.css({'font-size': '17px', 'padding-left': '0px'});
        btn.click(function(){thisDialog.dialog('open');});
        this.setTable(opt); //set genPoly table
    }

    setTable(opt){
        try{$("#genPolyList").remove();} catch(e){}

        //let tableSpan = $('<span style="padding: 1px"></span>').appendTo(this.gpDialog);
        let $table = $('<table id="genPolyList" class="table table-bordered table-sm">').appendTo(this.gpDialog);
        let $tbody = $table.append('<tbody/>').children('tbody');
        if(opt === 't3'){
            // for t = 3
            $table.append('<thead>').children('thead')
                .append('<tr />').children('tr').append('<th>Степен на полинома <i>s</i></th> ' +
                '                                              <th>Неприводим полином (1+x).P<sub>1</sub>(x)</th> ' +
                '                                              <th>Показател <i>l = 2<sup>s</sup> - 1</i></th>');
            for(let i=3; i<=5; i++){
                switch(i){
                    case 3:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+(i+1)+"</td>")
                            .append("<td><button name = 'X^4 + X^3 + X^2 + 1' val='3.3' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>4</sup>+x<sup>3</sup>+x<sup>2</sup>+1</button><br>" +
                                "        <button name = 'X^4 + X^2 + 1' val='3.4'  type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>4</sup>+x<sup>2</sup>+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 4:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+(i+1)+"</td>")
                            .append("<td><button name = 'X^5 + X^4 + X^2 + 1' val='4.3' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>5</sup>+x<sup>4</sup>+x<sup>2</sup>+1</button><br>" +
                                "        <button name = 'X^5 + X^3 + X + 1' val='4.4' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>5</sup>+x<sup>3</sup>+x+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 5:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+(i+1)+"</td>")
                            .append("<td><button name = 'X^6 + X^5 + X^3 + X^2 + X + 1' val='5.3' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>6</sup>+x<sup>5</sup>+x<sup>3</sup>+x+1</button><br>" +
                                "        <button name = 'X^6 + X^5 + X^4 + X^3 + X + 1' val='5.4' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>6</sup>+x<sup>5</sup>+x<sup>4</sup>+x<sup>3</sup>+x+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                }
            }
        }else{
            // for t = 2
            $table.append('<thead>').children('thead')
                .append('<tr />').children('tr').append('<th>Степен на полинома <i>s</i></th> ' +
                '                                              <th>Неприводим полином P<sub>1</sub>(x)</th> ' +
                '                                              <th>Показател <i>l = 2<sup>s</sup> - 1</i></th>');
            for(let i=1; i<=10; i++){
                switch(i){
                    case 1:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+i+"</td>")
                            .append("<td><button name = 'X+1' val='1.1' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 2:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+i+"</td>")
                            .append("<td><button name = 'X^2+X+1' val='2.1' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>2</sup>+x+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 3:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+i+"</td>")
                            .append("<td><button name = 'X^3+X+1' val='3.1' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>3</sup>+x+1</button><br>" +
                                "        <button name = 'X^3+X^2+1' val='3.2' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>3</sup>+x<sup>2</sup>+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 4:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+i+"</td>")
                            .append("<td><button name = 'X^4+X+1' val='4.1' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>4</sup>+x+1</button><br>" +
                                "        <button name = 'X^4+X^3+1' val='4.2' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>4</sup>+x<sup>3</sup>+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 5:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+i+"</td>")
                            .append("<td><button name = 'X^5+X^2+1' val='5.1' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>5</sup>+x<sup>2</sup>+1</button><br>" +
                                "        <button name = 'X^5+X^3+1' val='5.2' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>5</sup>+x<sup>3</sup>+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 6:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+i+"</td>")
                            .append("<td><button name = 'X^6+X+1' val='6.1' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>6</sup>+x+1</button><br>" +
                                "        <button name = 'X^6+X^5+1' val='6.2' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>6</sup>+x<sup>5</sup>+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 7:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+i+"</td>")
                            .append("<td><button name = 'X^7+X+1' val='7.1' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>7</sup>+x+1</button><br>" +
                                "        <button name = 'X^7+X^3+1' val='7.2' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>7</sup>+x<sup>3</sup>+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 8:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+i+"</td>")
                            .append("<td><button name = 'X^8+X^4+X^3+X^2+1' val='8.1' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>8</sup>+x<sup>4</sup>+x<sup>3</sup>+x<sup>2</sup>+1</button><br>" +
                                "        <button name = 'X^8+X^6+X^5+X^4+1' val='8.2' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>8</sup>+x<sup>6</sup>+x<sup>5</sup>+x<sup>4</sup>+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 9:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+i+"</td>")
                            .append("<td><button name = 'X^9+X^5+1' val='9.1' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>9</sup>+x<sup>5</sup>+1</button><br>" +
                                "        <button name = 'X^9+X^4+1' val='9.2' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>9</sup>+x<sup>4</sup>+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                    case 10:
                        $tbody.append('<tr />').children('tr:last')
                            .append("<td>"+i+"</td>")
                            .append("<td><button name = 'X^10+X^7+1' val='10.1' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>10</sup>+x<sup>7</sup>+1</button><br>" +
                                "        <button name = 'X^10+X^3+1' val='10.2' type=\"button\" class=\"btn btn-link genPolyBtn\" style='padding: 1px'>x<sup>10</sup>+x<sup>3</sup>+1</button></td>")
                            .append("<td>"+(Math.pow(2, i)-1)+"</td>");
                        break;
                }
            }
        }

        // set table css
        $table.css({'margin-top':'10px', 'border-color': 'black'});
        $('#genPolyList th').css({'padding':'5px' ,'white-space': 'nowrap'});
        $('#genPolyList td').css({'padding':'2px' ,'white-space': 'nowrap', 'text-align':'center'});


        // poly button click event
        let btn=$('#selGenPolyBtn');
        let thisDialog = this.gpDialog;
        $(".genPolyBtn").click(function(){
            btn.html(this.innerHTML);
            btn.attr('val',$(this).attr('val'));
            btn.attr('name',$(this).attr('name'));
            thisDialog.dialog('close')
        });
        this.table = $table;
    }
}

// Running as page opens
function initialOpening(){
    $("#navHome").click(function() { loadPage('models');});

    // login dialog
    let loginDiv = $("<div id='loginDiv' title='Login'></div>").appendTo('body');
    let loginForm = $("<form id='loginForm' method='post'></form>").appendTo(loginDiv);

    let fieldset1 =  $("<div class='form-group'></div>").appendTo(loginForm);
    fieldset1.append("<legend for='userName' id='userNameTxt'>User name</legend>");
    fieldset1.append("<input type='text' class='form-control' id='userName' name='userName'>");

    let fieldset2 =  $("<div class='form-group'></div>").appendTo(loginForm);
    fieldset2.append("<legend id='passTxt'>Password</legend>");
    fieldset2.append("<input type='password' name='password' id='password' value='' class='form-control' placeholder='За студенти без парола'>");

    //$("<hr>").appendTo(loginForm);
    let fieldset3 =  $("<div class='form-group'></div>").appendTo(loginForm);
    fieldset3.append("<legend id='selLang'>Select a language</legend>");
    fieldset3.append("<label for='langBG'>Български</label>");
    fieldset3.append("<input class='form-control' type='radio' name='lang' id='langBG' value='bg' checked>");
    fieldset3.append("<label for='langEN'>English</label>");
    fieldset3.append("<input class='form-control' type='radio' name='lang' id='langEN' value='en'>");

    loginForm.append("<p class='validateTips' id='loginErrMsg'></p>");
    $("#loginErrMsg").css({'display':'none'});


    // password dialog
    let passDiv = $("<div id='passDiv' title='Set password'></div>").appendTo('body');
    let passForm = $("<form></form>").appendTo(passDiv);
    passForm.append("<p class='validateTips' id='wrongPass'></p>")
    $("#wrongPass").css({'display':'none'});
    let fieldset4 =  $("<fieldset></fieldset>").appendTo(passForm);
    fieldset4.append("<legend id='passTxt'>Password</legend>");
    fieldset4.append("<input type='password' name='password' id='password' value='???????' class='text ui-widget-content ui-corner-all'>");


    // MESSAGE DIALOG
    let msgDialog=$("<div id='msgDialog' title='' class='dialog'></div>").appendTo('body');
    msgDialog.dialog({
        autoOpen : false, modal : false, show : "blind", hide : "blind",
        minHeight:100, minWidth:100,  height: 'auto', width: 'auto',
        close: function() {
            $("#msgDialog").css({'color':'black'});
        }
    });
    msgDialog.dialog('close');

    // CURRENT SETTINGS
    $('#navbar').css({display:'block'}); // hide navbar
    $('input:radio[name=lang]').filter('[value=bg]').prop('checked', true);
    // let currLang = 'bg';
    lang =  new LangPack($('input[name="lang"]:checked').val());
    userName = 'yaliev';
    //let userName = '123456';

    // language change function
    langChange = function(){
        //lang = null;
        lang =  new LangPack($('input[name="lang"]:checked').val());
        $('#userNameTxt').html(lang.gn.userNameTxt);
        $('#selLang').html(lang.gn.selLang);
        $('#loginBtn').html(lang.gn.login);
        $('#loginDiv' ).dialog({title: lang.gn.login});
        $('#passDiv' ).dialog({title: lang.gn.passTxt});
        $('#wrongUserName').text(lang.gn.wrongUserName);
        $('#passTxt').text(lang.gn.passTxt);
        $('#wrongPass').text(lang.gn.wrongPass);
    }

    // About language radio buttons
    $("#langBG").checkboxradio();
    $("#langEN").checkboxradio();
    $('input[name ="lang"]').change(function(){
        langChange();
    });

    // check the password function
    checkPass = function(){
        $('#wrongPass').css('display', 'none');
        if($.MD5($('#password').val()) === '88a2fdd0aa43fea0d282b21c4a32895e'){
            $('#wrongPass').text('');
            $("#passDiv").dialog('close');
            $("#loginDiv").dialog('close');
            loadPage('models');
        }
        else {
            $('#wrongPass').text(lang.gn.wrongPass);
            $('#wrongPass').css('display', 'inline');
            $("#wrongPass" ).effect( 'shake', effectCallback );
        }
    };


    // create a fade in effect for 1000ms
    effectCallback = function () {
        setTimeout(function() {
            $( "#effect" ).removeAttr( "style" ).hide().fadeIn();
        }, 1000 );
    };

    // login form submit function
    loginForm.submit(function(e) {
        loginBtnEvent();
        e.preventDefault();
    });

    // login button click event
    loginBtnEvent = function(){
        $("<div class='loader' id='loader'></div>").appendTo(loginForm);
        $('#loginErrMsg').css('display', 'none'); // hide the wrong pass message
        let user = $('#userName').val();
        let password = $.MD5($('#password').val());
        let host = getHost();
        const form = document.createElement('form');
        let params = {userName:user, dbServerName: host.dbServerName, password: password};
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
        $.ajax({
            headers: { 'Access-Control-Allow-Origin': 'https://ciot.uni-ruse.bg/' },
            url: host.url+'login.php',
            type:'post',
            data:$(form).serialize(),
            success:function(response){
                //console.log('response = ', response);
                let res = jQuery.parseJSON(response);
                $('#loader').remove();
                loginResCheck(res);
            }
        });

        return;
        // if(user === 'yaliev' || user === 'earsova' || user === 'givanova'){
        //     $("#passDiv").dialog('open');
        //     userName = user;
        // }
        // else{
        //     if(user.length !== 6){
        //         $("#wrongUserName").css('display', 'inline');
        //         $("#wrongUserName").effect( 'shake', effectCallback );
        //         return;
        //     }
        //     $("#loginDiv" ).dialog('close');
        //     userName = user;
        //     loadPage('models');
        // }
    };

    loginResCheck = function(res){
        if(typeof res !== 'object'){
            let tag = $("#loginErrMsg");
            if(res === 'userNotFound') tag.text(lang.gn.userNotFaund);
            else if(res === 'wrongPass') tag.text(lang.gn.wrongPass);
            else console.log(res);
            tag.css('display', 'inline');
            tag.effect( 'shake', effectCallback );
            return;
        }
        session.user = res;
        $("#loginDiv" ).dialog('close');
        $("#loginErrMsg").css('display', 'none');
        loadPage('models');
    }

    // Load page function
    loadPage = function(pageName){
       $("#content").load('pages/'+pageName+'.html');
       try{session.lastPage = pageName;} catch (e){}
    }

    // set the loginDiv as dialog
    loginDiv.dialog({
        autoOpen : false, modal : true, show : "blind", hide : "blind",
        minWidth: 320,
        height: 'auto',
        width: 400,
        buttons: { 'login': loginBtnEvent },
        open: function (event, ui) {
            $( this ).parent().find(".ui-dialog-titlebar-close" ).remove();
        },
    });

    // set the passDiv as dialog
    passDiv.dialog({
        autoOpen: false,
        height: 'auto',
        width: 'auto',
        modal: true,
        show : "blind",
        buttons: {
            "OK": checkPass,
            Cancel: function() {
                passDiv.dialog("close");
            }
        },
        close: function() {
            form[0].reset();
        }
    });

    // set the passDiv dialog's form submit event
    let form = passDiv.find( "form" ).on( "submit", function( event ) {
        event.preventDefault();
        checkPass();
    });

    //hide the dialogs' close icon
    //$(".ui-dialog-titlebar-close").hide();


    // for tests
    loginDiv.dialog('open');
    let page = 'hamming-matrix';

    langChange(); // set current language
    let session = {user:{id:'1', name:'yaliev'}, lastPage:page };

    //loadPage('models');
    //loadPage('hamming-general');
    //loadPage(page);
    //loadPage('cyclic-polynomial');
    //loadPage('cyclic-lfsr');

    return session;

}// end of initialOpening
