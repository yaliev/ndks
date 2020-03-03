function ALGORITHM(m, k, lang){
    let _layer = new Konva.Layer();
	let _steps = createSteps(lang);
    let _schema = createSchema(_steps, lang);
	 //let _stat = createStatistics(_layer,solveTime);
	 
    let algorithm ={
                    layer: _layer,
                    currStep : 0,
                    currSubStep:0,
                    cycle: 0,
                    m: m,
                    k: k,
                    steps: _steps,
                    schema: _schema,
                    width: _schema.width(),
                    height: _schema.height(),
                    lang: lang
    };

    //mark item
    let prop = {markFill: 'LightGreen',
                markFillyes: 'LightGreen',
                markFillno: 'Khaki',
                checkFill: 'LemonChiffon'
    };
    algorithm.schema.markItem = function(id, check){
        let item = this.items.find(item => item.id() === id);
        if (typeof item === 'undefined') return console.log('Not find item id = \''+id+'\'!');
        //item.shape.fill(prop.markFill);
        if (item.type === 'oper') item.shape.fill(prop.markFill);
        else if(item.type === 'check') {
            if (check === 'no') item.shape.fill(prop.markFillno);
            else item.shape.fill(prop.markFillyes);

        }
        else console.log('Unknown shape type for item: '+item.type);
        algorithm.layer.batchDraw();
    };

    //clear item
    algorithm.schema.resetItem = function(id){
        this.items.forEach(item => {
            if(item.id().substr(0,10) === id || item.id().substr(0,11) === id)
                if (item.type === 'oper') item.shape.fill(prop.fill);
                else if(item.type === 'check') item.shape.fill(prop.fill);
                else console.log('Unknown shape type for item: '+item.type);
        });
    };

    algorithm.validStep = function (thisStep){
        let check = lang.wrongOper;
        if (this.steps[this.currStep].sub.length > 0){
            if (this.steps[this.currStep].sub[this.currSubStep].name === thisStep)	check = true;
        }
        else if (this.steps[this.currStep].name === thisStep)	check = true;
        return check;
    };
	 
    algorithm.increment = function(){
        //this.showLastOper();
        let thisStep = this.steps[this.currStep];
        if (this.steps[this.currStep].sub.length > 0){ // for the steps with sub steps
            let subStep = thisStep.sub[this.currSubStep];
            if (this.currSubStep === 0) algorithm.schema.resetItem(thisStep.name); // clearing marks at the beginning of the cycle
            algorithm.schema.markItem(thisStep.name+'-'+subStep.name);
            if(this.currSubStep < (this.steps[this.currStep].sub.length) - 1){ // there is sub steps
                this.currSubStep++;
            }
            else{
                this.currSubStep = 0;
                if (thisStep.name === 'calcParity'){
                    //console.log(' this.cycle = '+ this.cycle+', this.m = '+this.m);
                    if (this.cycle < this.m - 1) {
                        this.cycle++;
                        algorithm.schema.markItem(thisStep.name+'-checkIR','no');
                    }
                    else {
                        this.cycle = 0;
                        this.currStep++;
                        algorithm.schema.markItem(thisStep.name+'-checkIR','yes');
                    }
                }
                else if(thisStep.name === 'shiftParity'){
                    if (this.cycle < this.k - 1){
                        this.cycle++;
                        algorithm.schema.markItem(thisStep.name+'-checkEN','no');
                    }
                    else{
                        this.cycle = 0;
                        this.currStep++;
                        algorithm.schema.markItem(thisStep.name+'-checkEN','yes');
                    }
                }
            }
        }
        else{ //  for the steps without sub steps
            algorithm.schema.markItem(thisStep.name);
            this.currStep++;
        }
    };

    algorithm.setLastOperID = function (id){
        this.lastOperID = id;
    };

    algorithm.showLastOper = function(){
        if (typeof this.lastOperID === 'undefined') this.lastOperID = 'lastOper';
        let element = document.getElementById(this.lastOperID);
        if (element !== null){
            element.textContent=this.getCurrStep().description;
            element.style.color = 'SeaGreen';
        }

        else console.log('There isn\'t HTML DOM for last operation!');
    };

    algorithm.getCurrStep = function(){
        let currStep = this.steps[this.currStep];
        if (currStep.sub.length > 0) return currStep.sub[this.currSubStep];
        else  return currStep;
    };

    algorithm.reset = function(){
        this.currStep = 0;
        this.currSubStep = 0;
        this.cycle = 0;
        this.layer.destroy();
    };

    algorithm.layer.add(algorithm.schema);
    algorithm.layer.draw();
    return algorithm;
}


// Create steps
createSteps = function(lang){
    let steps=[];
    let step ={};
    step = {name:'setBit',
            description: lang.setBit,
            help:'Click on the bits of the Information registry.',
            sub:[]
    };
    steps.push(step);
    step = {name:'reverseIR',
            description: lang.reverseIR,
            help:'Click on the Button (R) of the Information Register.',
            sub:[]
    };
    steps.push(step);
    step = {name: 'set1SW', // SW1 => Close, SW2 => 1
            description: lang.setSW,
            help: 'Click on the Switches.',
            sub: []
    };
    steps.push(step);
    step = {name: 'calcParity',
            description: lang.calcParity,
            help: 'Executed for each Information bit (m-times)',
            sub:[{name: 'calcFB',  description: lang.calcFB,  help: 'Click on the last XOR element.'},
                 {name: 'calcXOR', description: lang.calcXOR, help: 'Click on each XOR element without the last one.'},
                 {name: 'shiftEN', description: lang.shiftEN, help: 'Click on the (>>>) button of the Еncoder.'},
                 {name: 'shiftCR', description: lang.shiftCR, help: 'Click on the (>>>) button of the Codeword registry.'},
                 {name: 'shiftIR', description: lang.shiftIR, help: 'Click on the (>>>) button of the Information registry.'}]
    };
    steps.push(step);
    step = { name: 'set2SW', // SW1 => Open, SW2 => 2
             description: lang.setSW,
             help: 'Click on the Switches.',
             sub: []
    };
    steps.push(step);
    step = {name: 'shiftParity',
            description: lang.shiftParity,
            help: 'Execute for each Encoder bit (k-times)',
            sub:[ {name: 'shiftCR', description: lang.shiftCR, help: 'Click on the (S) button of the Codeword registry.'},
                  {name: 'shiftEN', description: lang.shiftEN, help: 'Click on the (>>>) button of the Еncoder.'}]
    };
    steps.push(step);
    step = {name: 'reverseCR',
            description: lang.reverseCR,
            help: 'Click on the (R) button of the Codeword registry.',
            sub:[]
    };
    steps.push(step);

    step = {name: 'finish',
            description: lang.finish,
            help: 'For new simulation click \'Reset the Model\' button.',
            sub:[]
    };
    steps.push(step);
    return steps;
};



// Creating the Algorithm's Panel
createSchema = function(steps, lang){
    let prop={
        width: 280,
        height: 10,
        fill: 'FloralWhite',
        stroke: 'SlateGray',
        markFill: 'LightGreen',
        markFillyes: 'LightGreen',
        markFillno: 'Khaki',
        checkFill: 'LemonChiffon',
        label:{ textSize: 18,
            textColor: 'white',
            fill: 'RoyalBlue',
            padding: 4
        },
        arrow:{ pointerLength: 4,
                pointerWidth: 3,
                strokeWidth: 1.5,
                fill: 'black',
                stroke: 'black'
        },
        itemDist: 15
    };
	 	 	 
	 // cteating the Algorithm panel
    let sch = new Konva.Group ({
        id: 'sch',
        name:'Algorithm panel',
        draggable:true
    });
    sch.rect = new Konva.Rect({
        id: sch.id()+'-rect',
        width : prop.width,
        height: prop.height,
        fill: prop.fill,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.5,
        cornerRadius: 4
    });
    sch.labelRect = new Konva.Rect({
        id: sch.id()+'-labelRect',
        width: sch.rect.width(),
        fill: prop.label.fill,
        cornerRadius: 4
    });
    sch.labelTxt =  new Konva.Text({
        id: sch.id()+'-labelTxt',
        width:sch.labelRect.width(),
        text: lang.title,
        fontSize: prop.label.textSize,
        fontFamily: 'Calibri',
        padding: 0,
        align: 'center',
        verticalAlign: 'middle',
        fill: prop.label.textColor,
    });
    // label height setting
    sch.labelRect.height(sch.labelTxt.height()+(prop.label.padding*2));
    sch.labelTxt.height(sch.labelRect.height());

    // add components to main group
    sch.add(sch.rect, sch.labelRect,  sch.labelTxt);

    sch.setPos = function(pos){
        sch.position(pos);
    };
    sch.items=[];
	 //////////////Creating the schema//////////////////////////////////////////////////////////////
	 let firstItemCenterPos = {x: sch.labelRect.width()/2, y: sch.labelRect.height() + prop.itemDist*2};
    
    //begin item
    let item = new createItem('begin');
    item.id('begin');
    item.position(firstItemCenterPos);
    sch.add(item);
    item.soket = {out:{x: item.x(), y: item.y() + item.circ.radius()}};
    sch.items.push(item);
    let lastItem = sch.items[sch.items.length-1];
    // other items
    steps.forEach(step =>{
        let item={};
        if (step.sub.length>0){   // for sub steps /////////////////////////////////////////////////////////////////////
            let mainStep = step.name;
            step.sub.forEach(step =>{
                lastItem = sch.items[sch.items.length-1];
                item =  new createItem('oper', step.description);
                item.id(mainStep+'-'+step.name);
                item.x(lastItem.x());
                item.y(lastItem.y() + lastItem.height() + prop.itemDist);
                item.soket = {  in: {x: item.x() + item.width()/2, y: item.y()},
                                out:{x: item.x() + item.width()/2, y: item.y() + item.height()}
                };

                sch.add(item);
                sch.items.push(item);

                lastItem = sch.items[sch.items.length-1];

                if (step.name === 'shiftIR'){
                    item =  new createItem('check',lang.emptyIR);
                    item.yesTxt.text(lang.yes);
                    item.noTxt.text(lang.no);
                    item.id(mainStep+'-checkIR');
                    item.x(lastItem.x());
                    item.y(lastItem.y() + lastItem.height()  + prop.itemDist);

                    item.soket = {  in:  {x: item.x() + item.width()/2, y: item.y()},
                                    out: {x: item.x() + item.width()/2, y: item.y() + item.height()},
                                    outL:{x: item.x() ,                 y: item.y() + item.height()/2 - 1}
                    };

                    sch.add(item);
                    sch.items.push(item);
                    lastItem = sch.items[sch.items.length-1];
                }
                else if(mainStep === 'shiftParity'  &&  step.name ==='shiftEN'){
                    item =  new createItem('check',lang.emptyEN);
                    item.yesTxt.text(lang.yes);
                    item.noTxt.text(lang.no);
                    item.id(mainStep+'-checkEN');
                    item.x(lastItem.x());
                    item.y(lastItem.y() + lastItem.height()  + prop.itemDist);

                    item.soket = {  in:  {x: item.x() + item.width()/2, y: item.y()},
                                    out: {x: item.x() + item.width()/2, y: item.y() + item.height()},
                                    outL:{x: item.x() ,                 y: item.y() + item.height()/2 - 1}
                    };

                    sch.add(item);
                    sch.items.push(item);
                    lastItem = sch.items[sch.items.length-1];
                }
            });
        }
        else{ // for main steps /////////////////////////////////////////////////////////////////////

            if (step.name === 'finish') { // for the last step
                item = new createItem('end');
                item.id('end');
                item.x(lastItem.x() + lastItem.width() / 2);
                item.y(lastItem.y() + lastItem.height() + prop.itemDist*2);
                item.soket = { in: {x: item.x() , y: item.y() - item.height()/2} };

                sch.add(item);
                sch.items.push(item);
                lastItem = sch.items[sch.items.length-1];
            }
            else{
                item =  new createItem('oper',step.description);
                item.id(step.name);
                if (sch.items.length === 1) { // for the first step
                    item.x(lastItem.x() - item.width()/2);
                    item.y(lastItem.y() + lastItem.height()  + prop.itemDist*0.5);
                }
                else{ // for the other steps
                    item.x(lastItem.x());
                    item.y(lastItem.y() + lastItem.height() + prop.itemDist);
                }

                item.soket = {  in: {x: item.x() + item.width()/2, y: item.y()},
                                out:{x: item.x() + item.width()/2, y: item.y() + item.height()}
                };

                sch.add(item);
                sch.items.push(item);
                lastItem = sch.items[sch.items.length-1];

                if(step.name === 'set1SW' || step.name === 'set2SW'){
                    item =  new createItem('join');
                    item.id(step.name+'-join');
                    item.x(lastItem.x());
                    item.y(lastItem.y() + lastItem.height() + prop.itemDist);
                    item.soket = {  in: {x: item.x() + item.width()/2, y: item.y()},
                                    inL:{x: item.x() + item.width()/2 - item.shape.width()/2, y: item.y() + item.shape.height()/2},
                                    out:{x: item.x() + item.width()/2, y: item.y() + item.height()}
                    };
                    sch.add(item);
                    sch.items.push(item);
                    lastItem = sch.items[sch.items.length-1];
                }
            }
        }
    });
    // schema's height correction
    lastItem = sch.items[sch.items.length-1];
    sch.rect.height(lastItem.y() + lastItem.height() +  prop.itemDist);

    // drawing arrows
    sch.arrows=[];
    let corr = 3;
    for (let i=1; i<sch.items.length; i++){
        let arrow = new Konva.Arrow({
            pointerLength: prop.arrow.pointerLength,
            pointerWidth: prop.arrow.pointerWidth,
            fill: prop.arrow.fill,
            stroke: prop.arrow.stroke,
            strokeWidth: prop.arrow.strokeWidth,
        });
        arrow.id(sch.items[i-1]+'-arrow');
        arrow.points([sch.items[i-1].soket.out.x, sch.items[i-1].soket.out.y,
                      sch.items[i].soket.in.x,    sch.items[i].soket.in.y - corr]);
        sch.add(arrow);
        sch.arrows.push(arrow);

        // only for romb
        if(sch.items[i-1].type === 'check'){
            arrow = new Konva.Arrow({
                pointerLength: prop.arrow.pointerLength,
                pointerWidth: prop.arrow.pointerWidth,
                fill: prop.arrow.fill,
                stroke: prop.arrow.stroke,
                strokeWidth: prop.arrow.strokeWidth,
            });

            let leftDist = 20;
            let targetItem = {};
            if (sch.items[i-1].id() === 'calcParity-checkIR') targetItem = sch.items.find(item => item.id() === 'set1SW-join');
            else targetItem = sch.items.find(item => item.id() === 'set2SW-join');
            //console.log(targetItem);
            arrow.id(sch.items[i-1]+'-arrowL');
            arrow.points([  sch.items[i-1].soket.outL.x,            sch.items[i-1].soket.outL.y,
                            sch.items[i-1].soket.outL.x - leftDist, sch.items[i-1].soket.outL.y,
                            sch.items[i-1].soket.outL.x - leftDist, targetItem.soket.inL.y,
                            targetItem.soket.inL.x - corr,          targetItem.soket.inL.y
            ]);
            sch.add(arrow);
            sch.arrows.push(arrow);
        }

    } // end of for

    // Setting the schema's size
    sch.width(sch.rect.width());
    sch.height(sch.rect.height());

    return sch;
}; // END OF CREATEALGORITH

// creating schema's item
createItem = function(type, text){
    let item = new Konva.Group({draggable: false});
    let prop = {circRadius: 10,
                rectWidth : 200,
                rectHeight: 20,
                fill: 'FloralWhite',
                stroke: 'black',
                strokeWidth: 1.5,
                fontColor: 'black',
                fontSize: 12,
                padding: 4
    };

    switch (type){
        case 'begin':{
            item.type = 'begin';
            item.circ = new Konva.Circle({
                id: item.id()+'-circ',
                radius: prop.circRadius,
                fill: prop.fill,
                stroke: prop.stroke,
                strokeWidth: prop.strokeWidth
            });
            item.width(item.circ.width());
            item.height(item.circ.height());
            item.add(item.circ);
            break;
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////
        case 'end':{
            item.type = 'end';
            item.circ1 = new Konva.Circle({
                id: item.id()+'-circ1',
                radius: prop.circRadius,
                fill: prop.fill,
                stroke: prop.stroke,
                strokeWidth: prop.strokeWidth
            });
            item.circ2 = new Konva.Circle({
                id: item.id()+'-circ2',
                x: item.circ1.x(),
                y: item.circ1.y(),
                radius: prop.circRadius-3,
                stroke: prop.stroke,
                strokeWidth: prop.strokeWidth,
                fill: prop.fill
            });
            item.width(item.circ1.width());
            item.height(item.circ1.height());
            item.add(item.circ1, item.circ2);
            break;
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////
        case 'oper':{
            item.type='oper';
            item.shape = new Konva.Rect({
                width: prop.rectWidth,
                fill: prop.fill,
                stroke: prop.stroke,
                strokeWidth: prop.strokeWidth,
                cornerRadius: 2
            });
            item.txt = new Konva.Text({
                width: item.shape.width(),
                height: prop.rectHeight,
                text: text,
                fontSize: prop.fontSize,
                fontFamily: 'Calibri',
                padding: 3,
                align: 'center',
                verticalAlign: 'middle',
                fill: prop.fontColor,
            });

            item.shape.height(item.txt.height());
            item.width(item.shape.width());
            item.height(item.shape.height());
            item.add(item.shape, item.txt);
            break;
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////
        case 'check':{
            item.type='check';
            let width = prop.rectWidth*1;
            let height = prop.rectHeight*1.5;
            item.shape = new Konva.Line({
                points:[width/2, 0,
                        width, height/2,
                        width/2, height,
                        0, height/2],
                fill: prop.fill,
                stroke: prop.stroke,
                strokeWidth: prop.strokeWidth,
                closed: true
            });
            item.txt = new Konva.Text({
                width:  item.shape.width(),
                height: item.shape.height(),
                text: text,
                fontSize: prop.fontSize,
                fontFamily: 'Calibri',
                padding: 3,
                align: 'center',
                verticalAlign: 'middle',
                fill: prop.fontColor,
            });
            //console.log('item.shape.points = '+item.shape.points()[0]);
            item.yesTxt = new Konva.Text({
                x: item.shape.points()[4] + 10,
                y: item.shape.points()[5] + 2,
                text: 'Yes',
                fontSize: prop.fontSize,
                fontFamily: 'Calibri',
                padding: 0,
                align: 'center',
                verticalAlign: 'middle',
                fill: prop.fontColor,
            });
            item.noTxt = new Konva.Text({
                x: item.shape.points()[6],
                y: item.shape.points()[7] - 15,
                text: 'No',
                fontSize: prop.fontSize,
                fontFamily: 'Calibri',
                padding: 0,
                align: 'center',
                verticalAlign: 'middle',
                fill: prop.fontColor,
            });

            item.width(item.shape.width());
            item.height(item.yesTxt.y() + item.yesTxt.height() - item.shape.y() - 12);
            item.add(item.shape, item.txt, item.yesTxt, item.noTxt);
            break;
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////
        case 'join':{
            item.type='join';
            let width = prop.rectWidth*0.06;
            let height = prop.rectHeight*0.5;
            item.shape = new Konva.Line({
                points:[width/2, 0,
                        width, height/2,
                        width/2, height,
                        0, height/2],
                fill: prop.fill,
                stroke: prop.stroke,
                strokeWidth: prop.strokeWidth,
                closed: true
            });
            item.shape.x(prop.rectWidth/2 - item.shape.width()/2);
            item.width(prop.rectWidth);
            item.height(item.shape.height());
            item.add(item.shape);
            break;
        }
    }
    return item;
};