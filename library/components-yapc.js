//HAMMING ENCODER - GENERAL ALGORITHM/////////////////////////////////////////////////////////////////////////////////////////
function HAMMING_GA(props, layer, alg, stat) {
    // CONFIG DEFAULT PROPERTIES
    if (typeof props.arrow === 'undefined') props.arrow = {};
    // GENERAL properties
    props.id = props.id || 'en';
    props.name = props.name || 'Encoder';
    props.position = props.position || {x: 0, y: 0};
    props.fill = props.fill || 'FloralWhite';
    props.labelSize = props.labelSize || 16;
    props.labelDistance = props.labelDistance || 5;
    props.labelColor = props.labelColor || 'white';
    props.labelBgColor = props.labelBgColor || 'RoyalBlue';
    props.labelPadding = props.labelPadding || 4;
    props.pading = props.pading || 10;
    props.width = props.width || 550;
    props.height = props.height || 350;
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
    let height = props.bit.height + 2 * props.pading + 280;
    let width = addDist * (props.bitsNum) + addDist / 1.4;
    //let infoBitsIdx = [3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20]; // for t=2
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

    // CREATING REGISTER'S PANEL /////////////////////////////////////////////////////////////////
    let en = new Konva.Group({
        id: props.id,
        name: props.name,
        position: props.position,
        width: width,
        height: height,
        draggable: props.draggable,
    });
    // empty array for values
    en.process = props.process;
    en.vals = [];
    en.vals.length = props.bitsNum;
    en.vals.fill(0);
    en.bitsIdx = bitsIdx;
    // encoder language
    en.lang = props.lang;

    // Encoder's background rectangle
    en.rect = new Konva.Rect({
        id: en.id() + '-rect',
        width: width,
        height: height,
        fill: props.fill,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.5,
        cornerRadius: 4
    });

    // Encoder's label
    en.label = new Konva.Text({
        id: en.id() + '-lab',
        width: en.rect.width(),
        text: props.name,
        fontSize: props.labelSize +4,
        fontFamily: 'Calibri',
        padding: 0,
        align: 'center',
        verticalAlign: 'middle',
        fill: props.labelColor,
        visible: true
    });
    // label's background rectangle
    en.labelRect = new Konva.Rect({
        id: en.id() + '-labRect',
        width: en.rect.width(),
        height: en.label.height() + 2*props.labelPadding,
        fill: props.labelBgColor,
        cornerRadius: 4,
        opacity: 1.0,
        draggable: false
    });
    en.label.height(en.labelRect.height());

    // mouse hover info
    //en.info = new INFO(layer, en);
    // add components to mein group
    en.add(en.rect, en.labelRect, en.label);

    // enable dragable property
    en.label.on('mouseover touchstart', function () {
        en.draggable(true);
        stage.container().style.cursor = 'move';
    });
    // enable dragable property
    en.label.on('mouseout touchend', function () {
        en.draggable(false);
        stage.container().style.cursor = 'default';
    });

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
        y: en.rect.y() + 80
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

        let bit = new Button(props.bit, layer);
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
            fontSize: props.labelSize,
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
                //label.onPlace = true;
                //console.log(label.id()+' => on place');
                return true;
            } else {
                //label.onPlace = false;
                //console.log(label.id()+' => not on place');
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
        layer.batchDraw();
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
            layer.batchDraw();
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
    en.loadBits = (vals, bits) => {
        // check for bit moving animation
        if (typeof bits !== 'undefined'){
            for (let i = 0; i < bits.length; i++) {
                let cloneObj = bits[i].clone();
                bits[i].active(false);
                layer.add(cloneObj);
                cloneObj.position(bits[i].getAbsolutePosition());
                cloneObj.moveToTop();
                layer.batchDraw();
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
                        layer.batchDraw();
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
                        if (i === bits.length - 1) { // run its if it is last bit
                            en.enableBits();
                            en.loadBtn.visible(false);
                            en.equBtn.visible(true);
                            en.createCbits();
                            if(en.process === 'dec') en.createCBitCheck();
                            layer.batchDraw();
                        }
                    }
                );
            }
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

    // equation field
    en.equBtn = new Button({
        id: 'loadBtn',
        height: 40,
        width: en.bits[en.bits.length - 1].x() + en.bits[0].width() - en.bits[0].x(),
        defVal: en.lang.equBtnTxt,
        txtSize: 16,
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

    // Cbits check texts (for decoding)
    if(en.process === 'dec'){
        en.CbitCheck = new Konva.Group({id: 'CbitCheck', draggable: true, visible: true,
            position:{x: en.equBtn.x(), y: en.equBtn.y()+en.equBtn.height()+10}
        });
        en.add(en.CbitCheck);
    }
    // create error analysis (for decoding)
    if(en.process === 'dec') {
        en.error = new PANEL({
            id: 'errAnalysis',
            name: en.lang.errorAnalysis,
            position: {x: en.bits[3].x(), y: en.CbitCheck.y()}

        });
        en.error.visible(false);
        en.error.size({width: 200, height: 60});
        en.add(en.error);

        // binary code
        en.error.binCode = SUB('(?????)_2');
        en.error.binCode.id('binCode');
        en.error.binCode.defaultFill(en.equBtn.txt.fill());
        en.error.binCode.position({x: en.error.label.x() + 15, y: en.error.label.height() + 12});
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
        en.error.binCode.on('dblclick', ()=>{
            let thisObj = en.error.binCode;
            let str =  thisObj.text();
            str = str.replace('(','');
            str = str.replace(')','');
            let oldStr = str;
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
                if(oldStr !== str) en.error.check(thisObj);
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
            en.error.decCode.on('dblclick', ()=>{
                let thisObj = en.error.decCode;
                let str = thisObj.text();
                str = str.replace('(','');
                str = str.replace(')','');
                let oldStr = str;
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
                    if(oldStr !== str) en.error.check(thisObj);
                });
            });
        }

        //make error analaysis for auto mode
        en.error.makeAnalysis = () =>{
            en.error.binCode.text('('+en.error.binCode.auto+')_2');
            en.error.decCode.text('('+en.error.decCode.auto+')_2');
            en.error.updatePos();
            en.error.getLayer().batchDraw();
        };

        // check the error bin code or position
        en.error.check = (thisObj)=>{
            //console.log('auto = '+thisObj.auto, 'man = '+thisObj.man);
            if(thisObj.man !== thisObj.auto){
                thisObj.fill('red');
                if(thisObj.id() === 'binCode')        stat.error.add(en.lang.wrongBinCode);
                else if(thisObj.id() === 'decCode')   stat.error.add(en.lang.wrongDecCode);
            }
            else{
                console.log('correct error position');
                thisObj.fill(thisObj.defaultFill());
                if(thisObj.id() === 'binCode') {
                    en.error.equal.visible(true);
                    en.error.decCode.active();
                }
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
        en.equBtn.txt.text(Cbit.man.str + val.toString());
        layer.batchDraw();
        return true;
    };

    //creating bit's arrow
    en.bits.forEach(bit => {
        let arrow = {};
        let b = {x: bit.x() + bit.width() / 2, y: bit.y() + bit.height()};
        let e = {x: bit.x() + bit.width() / 2, y: en.equBtn.y()};
        arrow = new Connection();
        arrow.id('arr-' + bit.id());
        if (bit.id().search('S') !== -1) { // info bit
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
            //arrow.enableHover(false);
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
        layer.batchDraw();
    };

    // method for creating parity equatiоns for Cbits
    en.createCbits = () => {
        en.Cbits = [];
        let bitId = '';
        let obj = {equ: [], bins: [], res: ''}; // temp object
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
                    bit = {}, val = 0;
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
                    bit = {}, val = 0;
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
                    bit = {}, val = 0;
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
                    bit = {}, val = 0;
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
                    bit = {}, val = 0;
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
                    bit = {}, val = 0;
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
                    fontSize: props.labelSize,
                    fontFamily: 'Calibri',
                    align: 'left',
                    fill: en.equBtn.txt.fill()
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
                    alg.increment(); // enable next step
                    alg.increment(); // enable next step
                    if(en.isLastCbit())  alg.increment(); // enable next step
                }
            });
        });
        layer.batchDraw();
    } // end of createCBitCheck


        // add member to the current control bit equation
    en.addToEqu = (bit) => {
        //check for selected control bit
        if (typeof en.Cbits === 'undefined' || en.currCbit === '') return en.lang.noSelectedBit;
        let thisCbit = en.Cbits.find(Cbit => Cbit.id === en.currCbit);
        if (bit.id().substr(0, 1) === 'C') bit.arrow.reverse(true);

        if (!bit.arrow.visible()) { // add
            if (bit.id().substr(0, 1) === 'C') bit.arrow.reverse(true);
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
        en.equBtn.txt.text(thisCbit.man.str);
        layer.batchDraw();
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
                    en.currCbit = '';
                    en.equBtn.txt.text('');
                    en.bits.forEach(b => {
                        if (b.arrow.visible() === true) b.arrow.visible(false);
                        if (b.id().substr(0, 1) === 'C') b.hoverTxt = en.lang.selectCbit;
                    });
                    alg.resetCycle(); // set all shapes in the algorithm for cyrrent cycle in default fill color
                } else { // add to the equation of current control bit
                    en.addToEqu(this);
                }
                layer.batchDraw();
            });
        });
    };
    // select a control bit for calculating/checking
    en.selectCbit = (CbitId) =>{
        if (typeof en.Cbits === 'undefined') return console.error('The model is busy!');
        if (typeof CbitId === 'undefined' || CbitId === '') { // for outo mode
            let CbitSeq = ['C1', 'C2', 'C3', 'C4', 'C5', 'C0'];
            for (let i = 0; i < CbitSeq.length; i++) {
                let thisCbit = en.bits.find(b => b.id() === CbitSeq[i]);
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
                en.bits.find(bit => bit.id() === Cbit.id).arrow.reverse(false); // set arrow direction to up
            }
            else en.bits.find(bit => bit.id() === Cbit.id).arrow.reverse(true); // set arrow direction to down for decoding
            en.bits.forEach(b => { // hide all visible arrows
                if (b.arrow.visible() === true) b.arrow.visible(false);
                if (b.id().substr(0, 1) === 'C') b.hoverTxt = en.lang.insertToEqu;
            });
            let thisBit = en.bits.find(bit => bit.id() === Cbit.id);
            thisBit.hoverTxt = en.lang.selectCbit;
            if(en.process === 'dec') { // add to the equation
                en.equBtn.txt.text('');
                en.addToEqu(thisBit);
            }
            else en.equBtn.txt.text('');
            thisBit.arrow.visible(true); // show/hide arrow
            layer.batchDraw();
        } else console.log('Non-existent control bit =>', CbitId);
        return true;
    };

    // show current control bit equation
    en.showCurrCbitEqu = () => {
        en.Cbits.forEach(Cbit => {
            if (Cbit.id === en.currCbit) {
                en.equBtn.txt.text(Cbit.auto.str);
                Cbit.auto.equ.forEach(el => {
                    let thisBit = en.bits.find(bit => bit.id() === el.bitId);
                    if (thisBit.id().substr(0, 1) === 'C') thisBit.arrow.reverse(true);
                    thisBit.arrow.visible(true);
                });
                layer.batchDraw();
            }
        });
        return true;
    };

    // show current control bit result
    en.showCurrCbitRes = () => {
        en.Cbits.forEach(Cbit => {
            if (Cbit.id === en.currCbit) {
                en.equBtn.txt.text(Cbit.auto.str + Cbit.auto.res);
                layer.batchDraw();
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
            if (en.equBtn.txt.text() === '') return en.lang.noEqu;
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
        en.equBtn.txt.text('');
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
                //alg.increment(); // enable next step
            }
            else if(en.process === 'dec'){ // for encoding
                let str = '';
                for(let i=en.Cbits.length-1; i>=0; i--)
                {
                    if(en.Cbits[i].id === 'C0') continue;
                    str += en.Cbits[i].auto.res;
                }
                en.error.binCode.auto = str;
                en.error.decCode.auto = parseInt(str, 2).toString();
                en.error.visible(true);
                //alg.increment(); // enable next step
            }
        }
        if(mode === 'man') alg.increment(); // enable next step
        layer.batchDraw();
        return true;
    };

    // check for last control bit
    en.isLastCbit = () => {
        let check = true;
        en.Cbits.forEach(cbit =>{
            if(cbit.man.res === '') check = false;
        })

        return check;
    };

    // create equation history
    en.equs = {poss: []};
    en.equs.add = (obj) => {
        if (typeof obj === 'undefined') return console.error('Non-existing object!');
        let newPos = {}, dist = 3;
        let cloneObj = obj.clone();
        if (typeof obj.getParent() !== 'undefined') cloneObj.position(obj.getParent().position());
        cloneObj.id(obj.id + '-clone');

        // for C0 - only equation and result
        if (cloneObj.text().substr(0, 2) === 'C0') {
            let str = cloneObj.text();
            cloneObj.text(str.split('=>')[0] + ' = ' + str.split('=>')[1].split('=')[1]);
        }
        // calculatin the new position
        cloneObj.height(cloneObj.height() - 20);
        if (en.equs.poss.length === 0) {
            newPos = {x: en.bits[0].x(), y: en.rect.height() - cloneObj.height() - dist};
        } else {
            newPos.x = en.equs.poss[en.equs.poss.length - 1].x;
            newPos.y = en.equs.poss[en.equs.poss.length - 1].y - cloneObj.height() - dist;
        }
        //cloneObj.align('left');
        en.add(cloneObj);
        // moving animation
        let movement = new SmoothMovement(cloneObj.position(), newPos);
        movement.animate(
            60,
            function (currPos) { // update function
                cloneObj.position(currPos);
                layer.batchDraw();
            },
            function () { // closure function
                cloneObj.align('left');
            }
        );
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

editable = (textNode, closeFunc) => {
    // create textarea over canvas with absolute position

    // first we need to find position for textarea
    // how to find it?

    // at first lets find position of text node relative to the stage:
    let textPosition = textNode.getAbsolutePosition();

    // then lets find position of stage container on the page:
    let stageBox = stage.container().getBoundingClientRect();

    // so position of textarea will be the sum of positions above:
    let areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y
    };

    // create textarea and style it
    let textarea = document.createElement('input');

    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width()+5+'px';
    textarea.focus();

    textarea.addEventListener('keydown', function(e){
        // hide on enter
        if (e.key === 'Enter') confirm(textarea.value);
        else if(e.key === 'Escape') confirm();
    });
    textarea.addEventListener("focusout",function(){confirm();});
    confirm = function (str){
        if(str !== ''){
            textNode.text(str);
            document.body.removeChild(textarea);
            textNode.getLayer().batchDraw();
            closeFunc(textNode); // close function
        }else{
            document.body.removeChild(textarea);
            textNode.getLayer().batchDraw();
            closeFunc(textNode); // close function
        }
    }
};

// applay over and overout events
over = (obj, cursorStyle) =>{
    cursorStyle = cursorStyle || 'pointer';
    let shapes = [];
    if(obj.getType() === 'Group'){
        obj.findOne(node => {
            if(node.getType() === 'Shape')
                shapes.push(node);
        });
    }
    else{
        shapes.push(obj);
    }
    obj.on('mouseover touchstart', function(){
        shapes[0].shadowColor('red');
        shapes[0].shadowBlur(10);
        shapes[0].shadowOpacity(1.0);

        stage.container().style.cursor = cursorStyle;
        if(typeof this.hover !== 'undefined')
            if(this.hoverTxt !== '') this.hover.show('i',this.hoverTxt);
        obj.getLayer().batchDraw();
    });
    // mouse hover out event
    obj.on('mouseout touchend', function(){
        shapes[0].shadowColor('');
        shapes[0].shadowBlur(0);
        shapes[0].shadowOpacity(0);
        stage.container().style.cursor = 'default';
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
            stage.container().style.cursor = cursorStyle;
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
            stage.container().style.cursor = 'default';
            if(typeof this.hover !== 'undefined') this.hover.hide();
            layer.batchDraw();
        });
    }
    else{ // for other objects
        obj.on('mouseover touchstart', function(){
            this.shadowColor('red');
            this.shadowBlur(10);
            this.shadowOpacity(1.0);
            stage.container().style.cursor = cursorStyle;
            if(typeof this.hoverTxt !== 'undefined') this.hover.show('i',this.hoverTxt);
            layer.batchDraw();
        });
        // mouse hover out event
        obj.on('mouseout touchend', function(){
            this.shadowColor('');
            this.shadowBlur(0);
            this.shadowOpacity(0);
            stage.container().style.cursor = 'default';
            if(typeof this.hover !== 'undefined') this.hover.hide();
            layer.batchDraw();
        });
    }
    return obj;
};

// check for two shapes intersection
function haveIntersection(r1, r2) {
    return !(
        r2.x() > r1.x() + r1.width() ||
        r2.x() + r2.width() < r1.x() ||
        r2.y() > r1.y() + r1.height() ||
        r2.y() + r2.height() < r1.y()
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
    props.labelPadding = props.labelPadding || 10;
    props.pading = props.pading || 10;
    props.width = props.width || 50;
    props.height = props.height || 30;

    // CREATING PANEL GROUP
    let pan = new Konva.Group ({
        id: props.id,
        name: props.name,
        position: props.position,
        visible: true,
        draggable: true
    });

    // Encoder's label
    pan.label = new Konva.Text({
        id: pan.id()+'-label',
        height: props.labelSize,
        text: props.name,
        fontSize: props.labelSize,
        fontFamily: 'Calibri',
        padding: props.labelPadding,
        align: 'center',
        verticalAlign: 'middle',
        fill: props.labelColor,
    });
    pan.label.height(pan.label.height() + 6);

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

    pan.size = function(size){
        if(typeof size === 'undefined') return {width: pan.width(), height: pan.height()};
        if(typeof size.width !== 'undefined'){
            pan.width(size.width);
            pan.rect.width(size.width);
            pan.labelRect.width(size.width);
            pan.label.width(size.width);
        }
        if(typeof size.height !== 'undefined'){
            //pan.height(size.height);
            pan.rect.height(size.height);
        }
    };

    return pan;
}

//LFSR///////////////////////////////////////////////////////////////////////////
function LFSR(props, layer){
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

    // CREATING REGISTER'S PANEL /////////////////////////////////////////////////////////////////
    let en = new Konva.Group ({
        id: props.id,
        name: props.name,
        x: props.pos.x,
        y: props.pos.y,
        width : props.width,
        height: props.height,
        draggable:false,
    });
    // empty array for values
    en.vals = [];
    en.vals.length = props.bitsNum;
    en.vals.fill(0);

    // Encoder's background rectangle
    en.rect = new Konva.Rect({
        id: en.id()+'-rect',
        width : props.width,
        height: props.height,
        fill: props.fill,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.5,
        cornerRadius: 4
    });

    // Encoder's label
    en.label = new Konva.Text({
        id: en.id()+'-lab',
        width: en.rect.width(),
        text: props.name,
        fontSize: props.labelSize + 4,
        fontFamily: 'Calibri',
        padding: 0,
        align: 'center',
        verticalAlign: 'middle',
        fill: props.labelColor,
        visible:true
    });
    // label's background rectangle
    en.labelRect = new Konva.Rect({
        id: en.id()+'-labRect',
        width : en.rect.width(),
        height: en.label.height() + 2*props.labelPadding,
        fill: props.labelBgColor,
        cornerRadius: 4,
        opacity: 1.0,
        draggable: false
    });
    en.label.height(en.labelRect.height());

    en.setW = (val)=>{
        en.width(val);
        en.rect.width(val);
        en.label.width(val);
        en.labelRect.width(val);
    };

    // create encoder's polynomial label
    en.poly = POLY(props.poly);
    en.poly.setSize(14);
    en.poly.setColor('white');
    en.poly.position({x: en.rect.x() + 5, y: en.rect.y()+en.poly.height()-5});

    // mouse hover info
    en.info = new INFO(layer, en);

    // add components to mein group
    en.add(en.rect, en.labelRect, en.label, en.poly, en.info);

    // ENCODER'S FEADBACK
    en.fb = new Konva.Group ({id: 'fb'});
    en.fb.val = 0;	// default value

    // CREATING LFSR'S BITS /////////////////////////////////////////////////////////////////
    // BIT properties
    if (typeof props.bit  === 'undefined') props.bit = {};
    props.bit.hoverTxt = props.bit.hoverTxt || 'Load Bit';
    props.bit.width = props.bit.width || 40;
    props.bit.height = props.bit.height || 50;
    props.bit.name = props.bit.name || 'LFSR Bit';
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
        let bit = new Button(props.bit,layer); // creating the current bit
        bit.position(pos); // bit positioning
        pos.x += addDist; // position change for the next bit

        en.bits[i] = bit;
        en.add(en.bits[i]);
        if (i === 0) zIndex = bit.getZIndex();
        else bit.setZIndex(zIndex);
    }

    // CREATING XORs /////////////////////////////////////////////////////////////////
    if (typeof props.xor   === 'undefined') props.xor = {};
    let dist = en.bits[1].x() - (en.bits[0].x() + en.bits[0].width());
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
        },layer);
        xor.position(pos); // xor positioning
        if (xorId === en.xorIds[en.xorIds.length -1]){
            xor.label.x(xor.label.x() - 30); // last xor's Label x cordinate correction
            xor.markAsFB(true); // mark as feedback's XOR
        }

        // reset the input value of next LSFR's bit
        if (xor.isFB === false) en.bits[Number(xor.id().substring(3))+1].inVal = xor.res;

        xor.on('mouseover touchstart', function(){
            en.info.show('i',xor.hoverTxt);
            xor.hoverOn();
        });
        // mоuse hover out event
        xor.on('mouseout touchend', function(){
            en.info.hide();
            xor.hoverOff();
        });

        layer.batchDraw();
        en.xors.push(xor);
        en.add(en.xors[en.xors.length-1]);
    });

    // CREATING SWITCHES /////////////////////////////////////////////////////////////////
    // SWITCH 1
    pos.x = en.bits[en.bits.length-1].x()+4;
    en.sw1 = new SWITCH({type:	'pos2', // switch with 2 position
        id: 'sw1',
        name: 'SW1',
        hover: props.sw.hoverTxt
    }, layer);
    en.sw1.position(pos);
    en.sw1.y(en.bits[0].y() - en.sw1.rect.height()*2.3);
    // mоuse hover event
    en.sw1.on('mouseover touchstart', function(){
        en.info.show('i', en.sw1.hoverTxt);
        en.sw1.hoverOn();
    });
    // mоuse hover leave event
    en.sw1.on('mouseout touchend', function(){
        en.info.hide();
        en.sw1.hoverOff();
    });

    en.add(en.sw1);

    // SWITCH 2
    pos.x = en.xors[en.xors.length-1].x() + 30;
    en.sw2 = new SWITCH({type:	'pos3',
        id: 'sw2',
        name: 'SW2',
        //pos: {x: pos.x},
        hover: props.sw.hoverTxt
    }, layer);
    en.sw2.position(pos);
    en.sw2.y(en.xors[en.xors.length-1].y() - en.sw2.rect.height()/2);
    en.sw2.lab.x(en.sw2.lab.x()+5);
    // mоuse hover event
    en.sw2.on('mouseover touchstart', function(){
        en.info.show('i', en.sw2.hoverTxt);
        en.sw2.hoverOn();
    });
    // mоuse hover leave event
    en.sw2.on('mouseout touchend', function(){
        en.info.hide();
        en.sw2.hoverOff();
    });
    en.add(en.sw2);

    // register's rectangle and label width correcting
    //en.rect.width((en.sw2.x() + en.sw2.rect.width()) - en.x() + props.pading*6);
    //en.label.width(en.rect.width());
    en.setW((en.sw2.x() + en.sw2.rect.width()) - en.x() + props.pading*6);


    // ENCODER IN/OUT SOKET
    en.soket = (str='') => {
        let p = str === 'abs' ? en.position():{x:0,y:0};
        return{
            connI: {x: en.xors[en.xors.length-1].soket().connD.x + p.x,
                y: en.xors[en.xors.length-1].soket().connD.y + p.y + 40
            },
            connO: {x: en.sw2.soket().connR.x + p.x,
                y: en.sw2.soket().connR.y + p.y
            }
        }
    };

    // ENCODER'S FEEDBACK set
    pos = {x: en.xors[en.xors.length-1].x() + 6,
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
        layer.batchDraw();
    };
    en.add(en.fb.add(en.fb.txtFb, en.fb.txtVal));

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



    // Shifth (>>>) Button events
    // mоuse hover event
    en.S.on('mouseover touchstart', function(){
        en.S.shadowColor('red'),
            en.S.shadowBlur(10),
            en.S.shadowOpacity(1.0),
            stage.container().style.cursor = 'pointer';
        en.info.show('i',this.hoverTxt);
        layer.batchDraw();
    });
    // mоuse hover out event
    en.S.on('mouseout touchend', function(){
        en.S.shadowColor('');
        en.S.shadowBlur(0);
        en.S.shadowOpacity(0);
        stage.container().style.cursor = 'default';
        en.info.hide();
        layer.batchDraw();
    });

    // DRAWING OF ARROWS /////////////////////////////////////////////////////////////////
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

    // connI to SW2
    b = en.soket().connI; // connection's begin position
    e = en.sw2.soket().connD; // connection's end position
    props.arrow.dir='u';
    props.arrow.id = 'conn-in-sw2';
    conn = new Connection(props.arrow);
    conn.setP([b.x, b.y, e.x, b.y, e.x, e.y]);
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
            dotProps.pos.y = conn.points()[1];
            en.dots.push(new Dot(dotProps));
            en.add(en.dots[en.dots.length-1]);
        }
    });
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

    // CREATING X-LABELS //////////////////////////////////////////////
    en.labels=[];
    let labNum = en.bits.length + 1;
    let rMidDist = (en.bits[1].soket().connL.x - en.bits[0].soket().connR.x) / 2;
    for (let i=0; i<labNum; i++){
        let xLab = new SUP('X^'+i);
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
        xLab.setID('xLabel'+i);
        xLab.position({x: pos.x, y: en.sw1.soket().connL.y - xLab.height() - 10});
        xLab.setSize(20);
        en.labels.push(xLab);
        en.add(en.labels[en.labels.length-1]);
    }

    // calculate feadback value
    en.calcFB = function(){
        en.xors.forEach(xor => {
            if (xor.isFB === true){ // only for the feedback's XOR
                xor.res = xor.calc();
                xor.showRes();
                en.fb.setVal(xor.res);
            }
            layer.batchDraw();
        });

        en.xors[en.xors.length-1].calc();
        en.fb.setVal(en.xors[en.xors.length-1].res);
        layer.batchDraw();
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
            layer.batchDraw();
        });
    };

    // reset XORs' result
    en.resetXORs = function (){
        en.xors.forEach(xor => {
            xor.reset();
        });
    };

    // shift encoder's bits to right
    en.shiftR = function(animation){
        animation = animation || false;
        let ln = en.bits.length-1;
        if (en.sw1.pos === 1){	// when the sw1 is closed
            for (let i=ln; i>=0; i--){
                let xor = en.xors.find(xor => xor.id() === 'xor'+(i-1)); // check for XOR element
                if (typeof xor !== 'undefined') { // there is XOR element
                    en.vals[i] = xor.res;
                    if (!animation) {
                        en.bits[i].txt.text(en.vals[i].toString());
                        xor.reset();
                        continue;
                    }
                    // moving animation
                    let movement = new SmoothMovement(xor.txt.position(), {x: en.bits[i].rect.x(), y:xor.txt.y()});
                    //en.bits[i].txt.visible(false);
                    movement.animate(
                        75,
                        function(pos){
                            xor.txt.position(pos);
                            layer.batchDraw();
                        },
                        function(){
                            xor.txt.position(xor.txtPos()); // set back xor's position
                            en.bits[i].txt.text(en.vals[i].toString());
                            xor.reset();
                            layer.batchDraw();
                        }
                    );
                    // xor.reset();
                }
                else{ // there isn't XOR element
                    if (i === 0){
                        let xor =en.xors[en.xors.length-1];
                        en.vals[i] = en.fb.val;
                        en.bits[i].txt.text(en.vals[i].toString());
                        xor.reset();
                    }
                    else {
                        en.vals[i] = en.vals[i-1];
                        if (!animation) {
                            en.bits[i].txt.text(en.vals[i].toString());
                            continue;
                        }
                        // moving animation
                        let movement1 = new SmoothMovement(en.bits[i-1].txt.position(), en.bits[i].rect.position());
                        en.bits[i].txt.visible(false);
                        movement1.animate(
                            50,
                            function(pos){
                                en.bits[i-1].txt.position(pos);
                                layer.batchDraw();
                            },
                            function(){
                                en.bits[i-1].txt.position( en.bits[i-1].rect.position());
                                en.bits[i].txt.text(en.vals[i].toString());
                                en.bits[i].txt.visible(true);
                                layer.batchDraw();
                            }
                        );
                    }

                }
            }
        }
        else if (en.sw1.pos === 0){ // when the sw1 is open
            for (let i=ln; i>=0; i--){
                if(i === 0){
                    en.vals[i] = -1;
                }
                else{
                    en.vals[i] = en.vals[i-1];
                }
                if (!animation) { // without moving animation
                    if (en.vals[i] < 0) en.bits[i].txt.text('');
                    else en.bits[i].txt.text(en.vals[i].toString());
                    layer.batchDraw();
                }
                else{ // with moving animation
                    if (en.vals[i] < 0) {
                        en.bits[i].txt.text('');
                        layer.batchDraw();
                    }
                    else{
                        let movement2 = new SmoothMovement(en.bits[i-1].txt.position(), en.bits[i].rect.position());
                        movement2.animate(
                            100,
                            function(pos){
                                en.bits[i-1].txt.position(pos);
                                layer.batchDraw();
                            },
                            function(){
                                en.bits[i-1].txt.position(en.bits[i-1].rect.position());
                                en.bits[i].txt.text(en.vals[i].toString());
                                layer.batchDraw();
                            }
                        );
                    }
                }
            }
        }
        return true;
    };

    // setting the LFSR's size
    en.width(en.rect.width());
    en.height(en.rect.height());

    return en;
} //end of LFSR object


// REGISTER OBJECT //////////////////////////////////////////////////////////////
function REGISTER(props, layer){
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
    props.sHover = props.sHover || 'Shift the register';
    props.rHover = props.rHover || 'Reverse the register';
    props.randHover = props.randHover || 'Generate random information bits';
    //props.bit.enabled = props.bit.enabled || true;


    // BIT properties
    if (typeof props.bit === 'undefined') props.bit = {};
    let ratio = 0.48, w = 20, h = w / ratio;
    props.bit.width = w;
    props.bit.height = h;

    let addDist = props.bit.width + props.pading*0.5;
    let height = props.bit.height+2*props.pading + 40;
    let width = addDist*(props.bitsNum)+addDist/1.4;
    // creating the general register group
    let reg = new Konva.Group ({
        id: props.id,
        name: props.name,
        x: props.pos.x,
        y: props.pos.y,
        width : width,
        height: height,
        draggable:false
    });

    // input bit, required for shift operation
    reg.inBit = '';

    // adding register's value property to reg
    reg.vals = [];
    reg.vals.length = props.bitsNum;
    //emtyArray.fill(0);
    // register's background rectangle
    reg.rect = new Konva.Rect({
        id: reg.id()+'-rect',
        width : width,
        height: height,
        fill: props.fill,
        //stroke: props.fill,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.5,
        cornerRadius: 4,
        draggable: false
    });
    // register's label
    reg.label = new Konva.Text({
        id: reg.id()+'-lab',
        text: props.name,
        fontSize: props.labelSize + 4,
        fontFamily: 'Calibri',
        padding: 0,
        align: 'center',
        verticalAlign: 'middle',
        fill: props.labelColor
    });
    reg.label.width(reg.label.width() + 10 * props.labelPadding);
    // correct the rectangle width if it is smaller from label width
    if (reg.rect.width() < reg.label.width()) 	reg.rect.width(reg.label.width());
    else 										reg.label.width(reg.rect.width());

    reg.labelRect = new Konva.Rect({
        id: reg.id()+'-labRect',
        width : reg.rect.width(),
        height: reg.label.height() + 2*props.labelPadding,
        fill: props.labelBgColor,
        cornerRadius: 4,
        draggable: false
    });
    reg.label.height(reg.labelRect.height());

    // register's Reverse button
    reg.R = new Konva.Text({
        id: reg.id()+'-d',
        name: 'Reverse button',
        x: reg.rect.x() + props.labelDistance + 1,
        text: 'Rreverse',
        fontSize: props.labelSize,
        fontFamily: 'Calibri',
        padding: 0,
        align: 'center',
        verticalAlign: 'middle',
        fill: 'grey'
    });
    reg.R.y(reg.rect.y() + reg.rect.height() - reg.R.height() - props.labelDistance);
    reg.R.hoverTxt = props.rHover;

    // register's Shift button
    reg.S = new Konva.Text({
        id: reg.id()+'-d',
        name: 'Shift button',
        x: reg.rect.x() + reg.rect.width() - props.labelDistance*8,
        text: '>>>',
        fontSize: props.labelSize + 5,
        fontFamily: 'Calibri',
        padding: 0,
        align: 'center',
        verticalAlign: 'middle',
        fill: 'grey'
    });
    reg.S.y(reg.rect.y() + reg.rect.height() - reg.S.height() - props.labelDistance);
    reg.S.hoverTxt = props.sHover;

    // register's Random button
    reg.rand = new Konva.Text({
        id: reg.id()+'-rand',
        name: 'Random bits',
        x: reg.rect.x() + reg.rect.width()/2,
        text: 'Random',
        fontSize: props.labelSize,
        fontFamily: 'Calibri',
        padding: 0,
        align: 'center',
        verticalAlign: 'middle',
        fill: 'grey'
    });
    reg.rand.position({
        x: reg.rand.x() - reg.rand.width()/2,
        y: reg.R.y()
    });
    reg.rand.hoverTxt = props.randHover;
    reg.rand.visible(props.bit.enabled);

    // info group
    reg.info = new INFO(layer, reg);

    reg.add(reg.rect, reg.labelRect,reg.label, reg.R, reg.rand, reg.S, reg.info);

    // Random Button events
    reg.rand.on('mouseover touchstart', function(){
        this.shadowColor('red');
        this.shadowBlur(10);
        this.shadowOpacity(1.0);
        this.scale({x: 1.2, y:1.2});
        stage.container().style.cursor = 'pointer';
        reg.info.show('i', this.hoverTxt);
        layer.batchDraw();
    });
    reg.rand.on('mouseout touchend', function(){
        this.shadowColor('');
        this.shadowBlur(0);
        this.shadowOpacity(1.0);
        this.scale({x: 1.0, y:1.0});
        stage.container().style.cursor = 'default';
        reg.info.hide();
        //layer.batchDraw();
    });

    // revers button events
    // mоuse hover event
    reg.R.on('mouseover touchstart', function(){
        reg.R.shadowColor('red');
        reg.R.shadowBlur(10);
        reg.R.shadowOpacity(1.0);
        stage.container().style.cursor = 'pointer';
        reg.info.show('i', this.hoverTxt);
        layer.batchDraw();
    });
    // mоuse hover out event
    reg.R.on('mouseout touchend', function(){
        reg.R.shadowColor('');
        reg.R.shadowBlur(0);
        reg.R.shadowOpacity(0);
        stage.container().style.cursor = 'default';
        reg.info.hide();
        //layer.batchDraw();
    });

    // >>> Button events
    // mоuse hover event
    reg.S.on('mouseover touchstart', function(){
        reg.S.shadowColor('red'),
            reg.S.shadowBlur(10);
        reg.S.shadowOpacity(1.0);
        reg.S.scale({x: 1.2, y:1.2});
        stage.container().style.cursor = 'pointer';
        reg.info.show('i', this.hoverTxt);
        layer.batchDraw();
    });
    // mоuse hover out event
    reg.S.on('mouseout touchend', function(){
        reg.S.shadowColor(''),
            reg.S.shadowBlur(0),
            reg.S.shadowOpacity(0),
            reg.S.scale({x: 1, y:1});
        stage.container().style.cursor = 'default';
        reg.info.hide();
        layer.batchDraw();
    });

    // CREATING BIT GROUPS
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
        let bit = new Button(props.bit, layer);
        bit.position(pos);

        pos.x += addDist; //  change position for the next bit

        bit.on('mouseover touchstart', function(){
            reg.info.show('i', bit.hoverTxt);
        });
        // mоuse hover out event
        bit.on('mouseout touchend', function(){
            reg.info.hide();
        });

        // setBit bit
        bit.setBit = function(){
            // set current bit
            if (reg.vals[i] === 0)  reg.vals[i] = 1;
            else 					reg.vals[i] = 0;
            bit.txt.text(reg.vals[i].toString());
            layer.batchDraw();
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

    // shift the registe to right
    reg.shiftR = function(animation){
        animation = animation || false;
        // shift the resgister's values
        reg.vals.pop();
        if (reg.inBit === '') reg.vals.unshift('');
        else reg.vals.unshift(reg.inBit);

        if (!animation){
            for(let i=0; i<=reg.bits.length-1; i++){
                if(typeof reg.vals[i] === 'undefined') continue;
                reg.bits[i].txt.text(reg.vals[i].toString());
            }
            layer.batchDraw();
            return;
        }
        console.log('Moving animation!');
        // moving animation
        let ln = (reg.bits.length-1);
        for(let i=ln; i>=0; i--){
            if(typeof reg.vals[i] === 'undefined') continue;
            let movement;
            if (i === ln) // for the last bit
                movement = new SmoothMovement(reg.bits[i].rect.position(), {x: reg.bits[i].rect.x()+30, y: reg.bits[i].rect.y()});
            else
                movement = new SmoothMovement(reg.bits[i].rect.position(), reg.bits[i+1].rect.position());
            movement.animate(
                30,
                function(pos){
                    reg.bits[i].txt.position(pos);
                    layer.batchDraw();
                },
                function(){
                    reg.bits[i].txt.position(reg.bits[i].rect.position());
                    reg.bits[i].txt.text(reg.vals[i].toString());
                    layer.batchDraw();
                }
            );
        } // end of for
    };
    // reverse the register
    reg.reverse = function(){
        reg.vals.reverse();
        for (let i=0; i<reg.vals.length; i++){
            if (typeof reg.vals[i] === 'undefined') return;
            reg.bits[i].txt.text(reg.vals[i].toString());
        }
        if (reg.R.fill() === 'red') reg.R.fill('grey');
        else reg.R.fill('red');
        layer.batchDraw();
        return true;
    };
    reg.randGen = () =>{
        let vals=[];
        for(let i=0; i<reg.vals.length; i++){
            vals.push((Math.random() > 0.5) ? 1 : 0);
        };
        console.log('Random info bits generating!');
        reg.load(vals);
    };

    // load the register
    reg.load = function(vals){
        if (typeof vals === 'undefined' || typeof vals === 'null'){
            console.log('The values can not be empty');
            return;
        }
        else if (reg.vals.length !== vals.length) {
            console.log('The length of values must be '+reg.vals.length );
            return;
        }
        reg.vals=vals;
        for (let i=0; i<props.bitsNum; i++){
            reg.bits[i].txt.text(reg.vals[i].toString());
            layer.batchDraw();
        }
        return;
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
        layer.batchDraw();
    };
    // hide register
    reg.hide = function (){
        reg.visible(false);
        layer.batchDraw();
    };

    // setting the register width and height
    reg.width(reg.rect.width());
    reg.height(reg.rect.height());

    return reg;
} // end of Register


// REGISTER OBJECT //////////////////////////////////////////////////////////////
function REGISTER1(props, layer){
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
    // props.sHover = props.sHover || 'Shift the register';
    // props.rHover = props.rHover || 'Reverse the register';
    // props.randHover = props.randHover || 'Generate random information bits';
    props.bit.enabled = props.bit.enabled || true;

    // BIT properties
    if (typeof props.bit === 'undefined') props.bit = {};
    let ratio = 0.6, w = 26, h = w / ratio;
    props.bit.width = w;
    props.bit.height = h;

    let addDist = props.bit.width + props.pading*0.8;
    let height = props.bit.height+2*props.pading + 55;
    let width = addDist*(props.bitsNum)+addDist/1.4;
    // creating the general register group
    let reg = new Konva.Group ({
        id: props.id,
        name: props.name,
        position: props.position,
        width : width,
        height: height,
        draggable: props.draggable
    });

    // input bit, required for shift operation
    reg.inBit = '';

    // adding register's value property to reg
    reg.vals = [];
    reg.vals.length = props.bitsNum;
    //emtyArray.fill(0);
    // register's background rectangle
    reg.rect = new Konva.Rect({
        id: reg.id()+'-rect',
        width : width,
        height: height,
        fill: props.fill,
        //stroke: props.fill,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.5,
        cornerRadius: 4,
        draggable: false
    });
    // register's label
    reg.label = new Konva.Text({
        id: reg.id()+'-lab',
        text: props.name,
        fontSize: props.labelSize + 4,
        fontFamily: 'Calibri',
        padding: 0,
        align: 'center',
        verticalAlign: 'middle',
        fill: props.labelColor
    });
    reg.label.width(reg.label.width() + 10 * props.labelPadding);
    // correct the rectangle width if it is smaller from label width
    if (reg.rect.width() < reg.label.width()) 	reg.rect.width(reg.label.width());
    else 										reg.label.width(reg.rect.width());

    reg.labelRect = new Konva.Rect({
        id: reg.id()+'-labRect',
        width : reg.rect.width(),
        height: reg.label.height() + 2*props.labelPadding,
        fill: props.labelBgColor,
        cornerRadius: 4,
        draggable: false
    });
    reg.label.height(reg.labelRect.height());

    // enable dragable property
    reg.label.on('mouseover touchstart', function(){
        reg.draggable(true);
        stage.container().style.cursor = 'move';
    });
    // disable dragable property
    reg.label.on('mouseout touchend', function(){
        reg.draggable(false);
        stage.container().style.cursor = 'default';
    });

    reg.add(reg.rect, reg.labelRect, reg.label);
    // put the register over others
    reg.on('click touchstart dragmove', function(){
        //this.moveToTop();
    });

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

    // CREATING BIT GROUPS
    props.bit.name = props.bit.name ||  'Bit';
    props.bit.hoverTxt = props.bit.hoverTxt || 'Set Bit';
    props.bit.fill = props.bit.fill || 'RosyBrown';
    props.bit.stroke = props.bit.stroke || 'RosyBrown';
    props.bit.txtColor = props.bit.txtColor || 'Snow';
    props.bit.defVal = props.bit.defVal || '';
    props.bit.labelTxt = props.bit.labelTxt || '';
    props.bit.labelDistance = 5;
    if(typeof props.bit.firstNum === 'undefined') props.bit.firstNum = 1;
    reg.bits=[]; // empty array for register's bits
    // first bit position
    let pos = {	x: addDist/2,
        y: reg.labelRect.height() + props.pading*2.5};
    let zIndex = null;
    for (let i=0; i<props.bitsNum; i++){
        props.bit.id = reg.id()+'-bit'+i;
        //props.bit.pos = pos;
        if(props.bit.firstNum === 0) props.bit.label = props.bit.labelTxt+i;
        else props.bit.label = props.bit.labelTxt+(i+props.bit.firstNum);
        let bit = new Button(props.bit, layer);
        bit.position(pos);
        bit.label.y(bit.rect.y() - bit.label.height() - 5);
        pos.x += addDist; //  change position for the next bit

        // setBit bit
        bit.setBit = function(){
            // set current bit
            if (reg.vals[i] === 0)  reg.vals[i] = 1;
            else 					reg.vals[i] = 0;
            bit.txt.text(reg.vals[i].toString());
            layer.batchDraw();
            return true;
        };

        reg.bits[i]=bit;
        reg.add(bit);

        bit.add(bit.rect, bit.txt);
        bit = hover(bit,layer);
        // default clickable event
        bit.enable(props.bit.enabled);

        if (i === 0) zIndex = bit.getZIndex();
        else bit.setZIndex(zIndex);
    }

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
            console.log('The values can not be empty');
            return;
        }
        else if (reg.vals.length !== vals.length) {
            console.log('The length of values must be '+reg.vals.length );
            return;
        }
        reg.vals=vals;
        for (let i=0; i<props.bitsNum; i++){
            reg.bits[i].txt.text(reg.vals[i].toString());
            layer.batchDraw();
        }
        return;
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
        layer.batchDraw();
    };
    // hide register
    reg.hide = function (){
        reg.visible(false);
        layer.batchDraw();
    };

    // setting the register width and height
    reg.width(reg.rect.width());
    reg.height(reg.rect.height());

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
        if (flag === 'e') this.findOne('#bg').fill('red');
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
            //visible: false
        })
    );

    obj.hover.add(
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
    obj.hover.show = function(flag, str){
        flag = flag || 'i';
        this.findOne('#txt').text(str);
        if (flag === 'e') this.findOne('#bg').fill('red');
        else if (flag === 'i')	this.findOne('#bg').fill('black');
        this.position(getRelPointerPos(obj,group));
        this.y(this.y()+22);
        group.moveToTop();
        obj.hover.moveToTop();
        obj.hover.visible(true);
        obj.getLayer().batchDraw();
    };
    // hide info
    obj.hover.hide = function(){
        this.visible(false);
    };
    group.add(obj.hover);
    //obj.hover = hover;
    return obj;
} // end of HOVER

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
function Button(props, layer){
    // BIT properties
    props.id = props.id || '';
    props.width = props.width || 20;
    props.height = props.height || 41.6;
    props.name = props.name || 'Button';
    props.hoverTxt = props.hoverTxt || '';
    props.fill = props.fill || 'RosyBrown';
    props.passivefill = props.passivefill || 'Silver';
    props.stroke = props.stroke || 'RosyBrown';
    props.strokeWidth = props.strokeWidth || 0;
    props.txtColor = props.txtColor || 'Navy';
    props.defVal = props.defVal || '';
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
        width : props.width,
        height: props.height,
        fill: props.fill,
        //stroke: props.stroke,
        //strokeWidth: props.strokeWidth,
        cornerRadius: 2,
    });

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

    // btn's text
    if(props.defVal.search('_') !== -1 && props.defVal !==''){
        btn.txt = SUB(props.defVal);
        btn.txt.fontSize(props.txtSize);
        btn.txt.fill(props.txtColor);
        btn.txt.align('left');
        btn.txt.verticalAlign('middle');
        btn.txt.height(btn.rect.height());

        if (btn.txt.width() > btn.rect.width()) {
            btn.rect.width(btn.txt.width() + 10);
            btn.txt.width(btn.rect.width());
        }else
        {
            btn.txt.width(btn.rect.width());
        }

    }
    else if(props.defVal.search('^') !== -1 && props.defVal.search('^') !== 0 && props.defVal !=='') {
        console.log('txt as sup',props.defVal.search('^'));

    }else{ // only text
        btn.txt = new Konva.Text({
            id: props.id +'-txt',
            //width : btn.rect.width(),
            height: btn.rect.height(),
            text: props.defVal,
            fontSize: props.txtSize,
            fontFamily: 'Calibri',
            align: 'center',
            verticalAlign: 'middle',
            fill: props.txtColor
        });


        if (btn.txt.width() > btn.rect.width()) {
            btn.rect.width(btn.txt.width() + 10);
            btn.txt.width(btn.rect.width());
        }else
        {
            btn.txt.width(btn.rect.width());
        }
    }


    btn.add(btn.rect, btn.txt);
    // btn's label
    if (typeof props.label !== 'undefined'){
        let pos = {x:  btn.rect.x(), y: btn.rect.y() + btn.rect.height() + 5};
        if (props.label.search("_") === -1){
            btn.label = new Konva.Text({
                id: props.id +'-lab',
                position: pos,
                text: props.label,
                fontSize: props.labelSize,
                fontFamily: 'Calibri',
                align: 'center',
                verticalAlign: 'middle',
                fill: props.fill
            });
        }
        else{
            btn.label = SUB(props.label);
            btn.label.position(pos);
            btn.label.setColor(props.fill);
            btn.label.setSize(props.labelSize);
        }
        btn.label.x(btn.rect.x()+btn.rect.width()/2 - btn.label.width()/2);
        //btn.label = SUB(props.label);
        btn.add(btn.label);
    }

    btn.activeColor = props.fill;
    btn.passiveColor = props.passivefill;


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
        layer.batchDraw();
    };

    // clickable method
    btn.enable = function (val){
        if (val === true){
            // mоuse hover event
            btn = hover1(btn, btn);
            btn = over(btn, layer);
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

    btn.width(btn.rect.width());

    // default btn hover events
    btn.active(props.enabled);

    return btn;
} // enf of button

///// POLY OBJECT //////////////////////////////////////////////////////
function POLY(str){
    //example str =>  P(X)=X^5+X^4+X^2+1
    let name = str.split('=')[0];
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
function SUP(el){
    let str = new Konva.Group(); // empty Konva group
    str.txt = new Konva.Text({
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

///// SUB OBJECT //////////////////////////////////////////////////////
function SUB(el){
    // only text
    if(el.search('_') === -1) {
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

    str.txt = new Konva.Text({
        id:'txt',
        text: el.split("_")[0],
        fontFamily: 'Arial',
        align: 'left',
        verticalAlign: 'middle',
        fill: 'black'
    });
    str.sub = new Konva.Text({
        id:'sub',
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
            str.sub.position({x:str.txt.x() + str.txt.width()*1.0 , y: str.txt.y() + str.sub.height()/2 + 2});
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
        str.sub.position({x:str.txt.x() + str.txt.width()*1.0 , y: str.txt.y() + str.sub.height()/2 + 2});

    };
    // set width
    str.width = function(val){
        if(typeof val === 'undefined') return str.txt.width() + str.sub.width();
        if(str.txt.width() > val) return console.log('The width is lover than text size!');
        str.txt.x((val - str.txt.width() + str.sub.width()) / 4);
        str.sub.position({x:str.txt.x() + str.txt.width()*1.0 , y: str.txt.y() + str.sub.height()/2 + 2});
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
        str.sub.position({x:str.txt.x() + str.txt.width()*1.08 , y: str.txt.y() + str.sub.height()/2 + 2});
        // recalc the group width end height
        str.width(str.txt.width() + str.sub.width());
        str.height(str.txt.height());
    };

    // set font size
    str.fontSize = function(val){
        if(typeof val === 'undefined') return str.txt.fontSize();
        str.txt.fontSize(val);
        str.sub.fontSize(str.txt.fontSize() * 0.7);
        str.sub.x(str.txt.x() + str.txt.width()*1.08);
        str.sub.y(str.txt.y() + str.sub.height()/2 + 2);
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


    let conn = new Konva.Arrow({
        id: props.id,
        pointerLength: props.pointerLength,
        pointerWidth: props.pointerWidth,
        fill: props.fill,
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        points: props.points
    });
    conn.dir = props.dir;
    conn.corr = 4;
    conn.reversed = false;
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

    conn.reverse = (flag) =>{
        if (typeof flag === 'undefined') return conn.reversed;
        else if ((flag === true && conn.reversed === false) || (flag === false && conn.reversed === true)){
            let tp =  conn.points();
            let p = [];
            let ln = tp.length;
            p.push(tp[ln-2]);
            p.push(tp[ln-1]);
            p.push(tp[0]);
            p.push(tp[1]);
            conn.reversed = !conn.reversed;
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
            return 'reversed'
        }
        else return conn.reversed;
    };

    return conn;
}//end of CONNECTION

//// SWITCH OBJECT //////////////////////////////////////////////////////
function SWITCH(props, layer){
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
        draggable: true
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
            layer.batchDraw();
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
            layer.batchDraw();
            return true;
        }
    }

    // mouse hover actions
    sw.hoverOn = function(){
        sw.rect.shadowColor('red'),
            sw.rect.shadowBlur(10),
            sw.rect.shadowOpacity(1.0),
            stage.container().style.cursor = 'pointer';
        layer.batchDraw();
    };
    // mouse hover left actions
    sw.hoverOff = function(){
        sw.rect.shadowColor(''),
            sw.rect.shadowBlur(0),
            sw.rect.shadowOpacity(0),
            stage.container().style.cursor = 'default';
        layer.batchDraw();
    };

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
function XOR(props,layer){
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
        //xor.res = xor.in1 ^ xor.in2;
        //xor.resTxt.text(xor.res.toString());
        //xor.showRes();
        return  xor.in1 ^ xor.in2;
    };

    //Check this XOR's result
    xor.checkRes = function (){
        return xor.res === xor.calc() ? true : false;
    };

    // Invert the current result of this XOR
    xor.invertRes = function(){
        if (xor.res === 0) xor.res = 1;
        else xor.res = 0;
        //xor.resTxt.text(xor.res.toString());
        xor.showRes();
        layer.batchDraw();
    };

    // Reset this XOR
    xor.reset = function (){
        //xor.hideRes();
        //xor.resTxt.fill('DarkGray');
        xor.txt.text('+');
        layer.batchDraw();
    };

    xor.showRes = function (){
        xor.txt.text(xor.res.toString());
        //xor.resTxt.fill(props.resColor);
        //xor.resTxt.visible(true);
        layer.batchDraw();
    };

    xor.hideRes = function (){
        xor.resTxt.visible(false);
        layer.batchDraw();
    };

    // mouse hover actions
    xor.hoverOn = function(){
        xor.circ.shadowColor('red'),
            xor.circ.shadowBlur(10),
            xor.circ.shadowOpacity(1.0),
            stage.container().style.cursor = 'pointer';
        layer.batchDraw();
    };
    // mouse hover left actions
    xor.hoverOff = function(){
        xor.circ.shadowColor(''),
            xor.circ.shadowBlur(0),
            xor.circ.shadowOpacity(0),
            stage.container().style.cursor = 'default';
        layer.batchDraw();
    };

    return xor;
}//end of XOR