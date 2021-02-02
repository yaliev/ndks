function ALGORITHM(steps, m, k, user){
    let lang = new LangPack($('input[name="lang"]:checked').val()).alg;
    let teacherUsers =['yaliev','earsova','givanova'];
    let algorithm ={
                    layer: new Konva.Layer(),
                    currStep : 0,
                    currSubStep:0,
                    cycle: 0,
                    m: m,
                    k: k,
                    steps: steps,
                    panel: createPanel(steps, lang),
                    lang: lang
    };
    algorithm.width = algorithm.panel.width();
    algorithm.height = algorithm.panel.height();

    if (tasks.stage !== 'learning') algorithm.panel.visible(false);
    if(teacherUsers.find(u => u === user)) {
        algorithm.panel.visible(true);
        algorithm.panel.mc.show();
    };


    // marks the current step asd past
    algorithm.markCurrStep = function(status){
        let currStep = this.steps[this.currStep];
        let id = currStep.name;

        if (currStep.sub.length > 0){ // check for substep
            id += '-'+ currStep.sub[this.currSubStep].name;
            try{
                 algorithm.panel.diagram.items.find(i => i.id() === id).markAs(status);
            }
            catch{}

            if (this.currSubStep === (currStep.sub.length-1) && status === 'past'){ // check for last sub step
                // mark check item as current if it is last sub current step
                try{
                     algorithm.panel.diagram.items.find(i => i.id() === currStep.name+'-check').markAs('curr');
                }
                catch(e){ console.log(e)}
            }
        }
        else{
            try{
                 algorithm.panel.diagram.items.find(i => i.id() === id).markAs(status);
            }
            catch(e){ console.log(e)}
        }
        this.layer.batchDraw();
    };

    // set step ponts
    algorithm.setPoints = function (){
    };

    // reset the current cycle
    algorithm.resetCycle = function(){
        let currStep = this.steps[this.currStep];
         algorithm.panel.diagram.items.forEach(item => {
            if(item.id().search(currStep.name) !== -1){
                item.markAs('reset');
            }
        });
        this.currSubStep = 0;
    };

    // validate the step
    algorithm.validStep = function (thisStep){
        let check = lang.wrongOper;
        if (this.steps[this.currStep].sub.length > 0){
            if (this.steps[this.currStep].sub[this.currSubStep].name === thisStep)	check = true;
        }
        else if (this.getCurrStep().name === thisStep)	check = true;
        return check;
    };

    // get the next step
    algorithm.increment = function(){
        let thisStep = this.steps[this.currStep];
        if(typeof this.steps[this.currStep] === 'undefined'){
            return  console.log('There is no step');
        }

        // check for finish step
        if(this.steps[this.currStep].name === 'finish')
        {
            //console.log(thisStep.help);
            return;
        }
        // check for sub steps
        if (this.steps[this.currStep].sub.length > 0){
            // clearing marks at the beginning of the cycle
            if (this.currSubStep === 0)  algorithm.resetCycle();

            //marks the step as past
            model.algorithm.markCurrStep('past');

            //check for last sub step
            if(this.currSubStep === (this.steps[this.currStep].sub.length - 1)){
                this.currSubStep = 0; // reset the sub step counter
                // check for last cycle
                if (this.cycle === (thisStep.cycleCount-1)){
                    this.cycle = 0; // reset the cycle counter
                     algorithm.panel.diagram.items.find(i => i.id() === thisStep.name+'-check').markAs('past');
                    this.currStep++; // increment the step counter
                }
                else{ // it is not last cycle
                    this.cycle++; // increment the cycle counter
                     algorithm.panel.diagram.items.find(i => i.id() === thisStep.name+'-check').markAs('curr');
                }
            }
            else{ // it is not last sub step
                this.currSubStep++; // // increment the sub step counter
            }
        }
        else{ //  for the steps without sub steps
            model.algorithm.markCurrStep('past');
            this.currStep++;
        }

        // check for finish step
        if(this.steps[this.currStep].name === 'finish')
        {
            model.simFinish();
            model.stat.logData();
            model.algorithm.panel.mc.hide();
            let end =  algorithm.panel.diagram.items.find(e => e.id() === 'end');
            end.markAs('past');
            end.hoverTxt = lang.showEndMsg;
            end = hover1(end, end.getParent());
            end = over(end);
            end.on('click touchstart', function(){
                $("#finishDialog" ).dialog('open');
            });
        }
    };

    // get the current step
    algorithm.getCurrStep = function(){
        let currStep = this.steps[this.currStep];
        if (currStep.sub.length > 0) return currStep.sub[this.currSubStep];
        else  return currStep;
    };

    // increment step cycleCount
    algorithm.incrmtCycle = function(arg){
        if(typeof arg === 'undefined') arg = 1;

        for(let i = 0; i< this.steps.length; i++){
            if(this.steps[i].sub.length > 0 && arg === 1){
                this.steps[i].cycleCount++;
                break;
            }
            else if(this.steps[i].sub.length > 0 && arg === 2){
                this.steps[i].cycleCount++;
                break;
            }
        }

    } // end of algorithm.incrmtCycle

    // reset the algorithm
    algorithm.reset = function(){
        this.currStep = 0;
        this.currSubStep = 0;
        this.cycle = 0;
        this.layer.destroy();
    };

    //

    algorithm.layer.add(algorithm.panel);
    algorithm.layer.draw();
    return algorithm;
}// end of ALGORITHM

// Creating the Algorithm's Panel
createPanel = function(steps, lang){
    let prop={
        width: 280,
        height: 10,
        name: lang.title,
        fill: 'FloralWhite',
        stroke: 'SlateGray',
        markFill: 'LightGreen',
        markFillyes: 'LightGreen',
        markFillno: 'Khaki',
        checkFill: 'LemonChiffon',
        label:{ textSize: 20,
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
    let panel = new PANEL(prop);
    panel.id('AlgorithmPanel');
    panel.label.fontSize(prop.label.textSize-2);
    panel.size({width:  prop.width, height:  prop.height});
    panel.dragmove(true);


    //////////////Creating the diagram//////////////////////////////////////////////////////////////
    let diagram = new Konva.Group();
    panel.add(diagram);
    diagram.items=[];
    let firstItemCenterPos = {x: panel.labelRect.width()/2, y: panel.labelRect.height() + prop.itemDist*2};

    //begin item
    let item = new createItem('begin','');
    item.id('begin');
    item.position(firstItemCenterPos);
    diagram.add(item);
    item.soket = {out:{x: item.x(), y: item.y() + item.circ.radius()}};
    diagram.items.push(item);
    let lastItem = diagram.items[diagram.items.length-1];

    // other items
    steps.forEach(step =>{
        let item={};
        if (step.sub.length>0){   // for sub steps /////////////////////////////////////////////////////////////////////
            //let mainStepName = step.name;
            let stepCount=-1;
            let stepLn = step.sub.length;
            step.sub.forEach(subStep =>{
                lastItem = diagram.items[diagram.items.length-1];
                stepCount++;
                // first cycle element is join element
                if (stepCount === 0){
                    // join item
                    item =  new createItem('join','');
                    item.id(step.name+'-join');
                    item.x(lastItem.x());
                    item.y(lastItem.y() + lastItem.height() + prop.itemDist);
                    item.soket = {  in: {x: item.x() + item.width()/2, y: item.y()},
                        inL:{x: item.x() + item.width()/2 - item.shape.width()/2, y: item.y() + item.shape.height()/2},
                        out:{x: item.x() + item.width()/2, y: item.y() + item.height()}
                    };
                    diagram.add(item);
                    diagram.items.push(item);
                    lastItem = diagram.items[diagram.items.length-1];
                }
                lastItem = diagram.items[diagram.items.length-1];
                // operation item
                item =  new createItem('oper', subStep.description);
                item.id(step.name+'-'+subStep.name);
                item.x(lastItem.x());
                item.y(lastItem.y() + lastItem.height() + prop.itemDist);
                item.soket = {  in: {x: item.x() + item.width()/2, y: item.y()},
                                out:{x: item.x() + item.width()/2, y: item.y() + item.height()}
                };

                item.hoverTxt = subStep.help;
                item = hover1(item,  panel);
                item = over(item);

                diagram.add(item);
                diagram.items.push(item);
                lastItem = diagram.items[diagram.items.length-1];

                // check for last element of cycle
                if (stepCount === stepLn-1){
                    let str = typeof step.exitCond !== 'undefined'? step.exitCond : lang.lastCbit;
                    item =  new createItem('check', str);
                    item.yesTxt.text(lang.yes);
                    item.noTxt.text(lang.no);
                    item.id(step.name+'-check');
                    item.x(lastItem.x());
                    item.y(lastItem.y() + lastItem.height()  + prop.itemDist);

                    item.soket = {  in:  {x: item.x() + item.width()/2, y: item.y()},
                                    out: {x: item.x() + item.width()/2, y: item.y() + item.height()},
                                    outL:{x: item.x() ,                 y: item.y() + item.height()/2 - 1}
                    };

                    diagram.add(item);
                    diagram.items.push(item);
                    lastItem = diagram.items[diagram.items.length-1];
                }
            });
        }
        else{ // for main steps /////////////////////////////////////////////////////////////////////

            if (step.name === 'finish') { // for the last step
                item = new createItem('end','');
                item.id('end');
                item.x(lastItem.x() + lastItem.width() / 2);
                item.y(lastItem.y() + lastItem.height() + prop.itemDist*2);
                item.soket = { in: {x: item.x() , y: item.y() - item.height()/2} };

                diagram.add(item);
                diagram.items.push(item);
                lastItem = diagram.items[diagram.items.length-1];
            }
            else{
                item =  new createItem('oper',step.description);
                item.id(step.name);
                if (diagram.items.length === 1) { // for the first step
                    item.x(lastItem.x() - item.width()/2);
                    item.y(lastItem.y() + lastItem.height() + prop.itemDist*0.5);
                }
                else{ // for the other steps
                    item.x(lastItem.x());
                    item.y(lastItem.y() + lastItem.height() + prop.itemDist);
                }

                item.soket = { in: {x: item.x() + item.width()/2, y: item.y()},
                               out:{x: item.x() + item.width()/2, y: item.y() + item.height()}
                };
                item.hoverTxt = step.help;
                item = hover1(item,  panel);
                item = over(item);

                diagram.add(item);
                diagram.items.push(item);
                lastItem = diagram.items[diagram.items.length-1];
            }
        }
    });
    //diagram.items.forEach(item => console.log('item id = '+item.id()));

    // schema's height correction
    lastItem = diagram.items[diagram.items.length-1];
    panel.rect.height(lastItem.y() + lastItem.height() +  prop.itemDist);

    // DRAWING ARROWS
    let arrows=[];
    let corr = 3;
    for (let i=1; i<diagram.items.length; i++){
        let arrow = new Konva.Arrow({
            pointerLength: prop.arrow.pointerLength,
            pointerWidth: prop.arrow.pointerWidth,
            fill: prop.arrow.fill,
            stroke: prop.arrow.stroke,
            strokeWidth: prop.arrow.strokeWidth,
        });
        arrow.id(diagram.items[i-1].id()+'-arrow');
        arrow.points([diagram.items[i-1].soket.out.x, diagram.items[i-1].soket.out.y,
                      diagram.items[i].soket.in.x,    diagram.items[i].soket.in.y - corr]);
        diagram.add(arrow);
        arrows.push(arrow);

        // only for check elements
        if(diagram.items[i-1].type === 'check'){
            arrow = new Konva.Arrow({
                pointerLength: prop.arrow.pointerLength,
                pointerWidth: prop.arrow.pointerWidth,
                fill: prop.arrow.fill,
                stroke: prop.arrow.stroke,
                strokeWidth: prop.arrow.strokeWidth,
            });

            let leftDist = 20;
            let targetItem = {};

            // check for check item
            if (diagram.items[i-1].id().search('-check') !== -1){
                let stepName = diagram.items[i-1].id().split("-")[0];
                // console.log('mainStepName = '+mainStepName);
                //targetItem = diagram.items.find(item => item.id() === mainStepName+'-join');
                targetItem = diagram.items.find(item => item.id() === stepName+'-join');
            }

            arrow.id(diagram.items[i-1].id()+'-arrowL');
            arrow.points([  diagram.items[i-1].soket.outL.x,            diagram.items[i-1].soket.outL.y,
                            diagram.items[i-1].soket.outL.x - leftDist, diagram.items[i-1].soket.outL.y,
                            diagram.items[i-1].soket.outL.x - leftDist, targetItem.soket.inL.y,
                            targetItem.soket.inL.x - corr,          targetItem.soket.inL.y
            ]);
            diagram.add(arrow);
            arrows.push(arrow);
        }

    } // end of for
    diagram.arrows = arrows;

    // Setting the schema's size
    panel.width(panel.rect.width());
    panel.height(panel.rect.height());

    // set the position of schema
    panel.setPos = function(pos){
        panel.position(pos);
    };

    // resize the schema
    panel.sizeTo = function(points){
        let size={width:'', height:''};
        if(typeof points.y !== undefined){
            points.y = Math.round(points.y);
            size.height = points.y - panel.y();
            panel.height(panel.rect.height(size.height));
        }
        if(typeof points.x !== undefined){
            points.x = Math.round(points.x);
            size.width = points.x - panel.x();
            panel.width(panel.rect.width());
        }

        //layer.batchDraw();
        panel.getLayer().batchDraw();
    };

    ////////////// Creating Control buttons /////////////////////////////////////////////////////
    panel.mc = new PANEL({
        id: 'MCPanel',
        name: lang.modelControl,
        position: { x: 20, y: 0},
        type: 2,
        labelSize: 16
    });
    panel.add(panel.mc);
    panel.mc.size({width: panel.rect.width()-40, height:50});
    panel.mc.visible(false);
    panel.mc.dragmove(false);

    // run step button
    panel.mc.runStepBtn = new Button({
        id: 'runStepBtn',
        height: 25,
        defVal: ' \u25B6\u2503',
        txtSize: 14,
        clickable: true,
        fill: 'LightGrey'
    });
    panel.mc.runStepBtn.hoverTxt = lang.runStep;
    panel.mc.runStepBtn = hover1(panel.mc.runStepBtn,panel.mc);
    panel.mc.add(panel.mc.runStepBtn);
    panel.mc.runStepBtn.position({x: 10, y:15});

    panel.mc.runStepBtn.on('click touchstart', function(){
        try { model.runCurrStep()} catch(e){console.log(e)};
    });


    // autorun speed button
    panel.mc.speedBtn = new Button({
        id: 'speedBtn',
        height: 25,
        defVal: 'Speed',
        txtSize: 14,
        clickable: true,
        fill: 'LightGrey'
    });
    panel.mc.speedBtn.hoverTxt = lang.speedRun;
    panel.mc.speedBtn = hover1(panel.mc.speedBtn,panel.mc);
    panel.mc.add(panel.mc.speedBtn);
    panel.mc.speedBtn.size({width:75});
    panel.mc.speedBtn.position({x: panel.mc.runStepBtn.x() + panel.mc.runStepBtn.width() + 30,
        y: panel.mc.runStepBtn.y()});
    panel.mc.speedBtn.on('click touchstart', function(){
        panel.mc.speedIncrement();
    });

    panel.mc.speedIdx = 2; // default speed
    panel.mc.speedBtn.text(lang.speed[panel.mc.speedIdx]);
    panel.mc.speedVals = [2000, 1500, 800, 300, 50]; // interval between steps: 2s, 1.5s, 1s, 0.5s and 0.25s

    //increment speed
    panel.mc.speedIncrement = function(){
      if(panel.mc.speedIdx === 4)   panel.mc.speedIdx = 0;
      else panel.mc.speedIdx++;
      panel.mc.speedBtn.text(lang.speed[panel.mc.speedIdx]);
      try {panel.getLayer().batchDraw();} catch(e) {};
    };


    // autorun button
    let playChar = ' \u25B6 ';
    let pauseChar = ' \u2503\u2503 ';
    panel.mc.autoRunBtn = new Button({
        id: 'autoRunBtn',
        height: 25,
        defVal: playChar,
        txtSize: 14,
        clickable: true,
        fill: 'LightGrey'
    });
    panel.mc.autoRunBtn.hoverTxt = lang.autoRun;
    panel.mc.autoRunBtn = hover1(panel.mc.autoRunBtn,panel.mc);
    panel.mc.add(panel.mc.autoRunBtn);
    panel.mc.autoRunBtn.position({x: panel.mc.speedBtn.x() + panel.mc.speedBtn.width() + 15,
        y: panel.mc.speedBtn.y()});

    panel.mc.autoRunBtn.on('click touchstart', function(){
        if (model.autoRunTimerId === -1)  panel.mc.autoRunStart();
        else panel.mc.autoRunStop();
    });
    // model autorunStart function
    panel.mc.autoRunStart = function(){
        if (model.autoRunTimerId !== -1) return; // return if autorun has already started
        model.autoRun( panel.mc.speedVals[panel.mc.speedIdx]);
        panel.mc.autoRunBtn.text(pauseChar);
        panel.mc.autoRunBtn.hoverTxt = lang.stopAutoRun;
        panel.mc.cover.visible(true);
    }

    // model autorunStop function
    panel.mc.autoRunStop = function(){
        if (model.autoRunTimerId === -1) return; // return if autorun has already stoped
        model.autoRun( panel.mc.speedVals[panel.mc.speedIdx]);
        panel.mc.autoRunBtn.text(playChar);
        panel.mc.autoRunBtn.hoverTxt = lang.autoRun;
        panel.mc.cover.visible(false);
    };

    // model control cover rectangle for disable runStepBtn and speedBtn
    panel.mc.cover = new Konva.Rect({
        id: 'mcCoverRect',
        x: panel.mc.runStepBtn.x(),
        y: panel.mc.runStepBtn.y(),
        width : panel.mc.speedBtn.x()+panel.mc.speedBtn.width(),
        height: panel.mc.runStepBtn.height(),
        fill: 'white',
        opacity: 0.4,
        visible: false
    });
    panel.mc.add(panel.mc.cover);

    // function for showing the model control panel
    panel.mc.show = function(){
        panel.rect.height(panel.rect.height()+panel.mc.height() +10);
        panel.mc.y(panel.rect.height() - (panel.mc.height() +10));
        panel.mc.visible(true);
        try {panel.getLayer().batchDraw();} catch(e) {};
    }
    // function for hiding the model control panel
    panel.mc.hide = function(){
        if(panel.mc.visible() === false) return;
        panel.rect.height(panel.rect.height() - (panel.mc.height() +10));
        //panel.mc.y(panel.rect.height() - (panel.mc.height() +10));
        panel.mc.visible(false);
        try {panel.getLayer().batchDraw();} catch(e) {};
    }

    //panel.mc.show();  // for test
    panel.diagram = diagram;
    return panel;
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
                //height: prop.rectHeight,
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
            if(text.length >=22) {
                let add = 10;
                height += add;
            }

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
    let colors = {  past: 'LightGreen',
                    reset: prop.fill,
                    curr: 'Gold',
    };
    item.markAs = function(status){
        let color;
        if (status === 'past') color = colors.past;
        else if (status === 'reset') color = colors.reset;
        else if (status === 'curr') color = colors.curr;
        else color = colors.past;
        if(item.type === 'end') this.circ2.fill(color); // for 'end' shape only
        else this.shape.fill(color);
        //layer.batchDraw();
        item.getLayer().batchDraw();
    };
    return item;
}; // end of createItem