function ALGORITHM(steps, m, k, lang){
    let _layer = new Konva.Layer();
	//let _steps = createSteps(lang);
    let _schema = createSchema(steps, lang, _layer);
    //let _stat = createStatistics(_layer,solveTime);
	 
    let algorithm ={
                    layer: _layer,
                    currStep : 0,
                    currSubStep:0,
                    cycle: 0,
                    m: m,
                    k: k,
                    steps: steps,
                    schema: _schema,
                    width: _schema.width(),
                    height: _schema.height(),
                    lang: lang
    };
    //mark item

    // marks the current step asd past
    algorithm.markCurrStep = function(status){
        let currStep = this.steps[this.currStep];
        let id = currStep.name;
        if (currStep.sub.length > 0){
            id += '-'+ currStep.sub[this.currSubStep].name;
            if (this.currSubStep === (currStep.sub.length-1)) // mark check item as current if it is last sub current step
                algorithm.schema.items.find(i => i.id() === currStep.name+'-check' && status === 'past').markAs('curr');
        }
        try{
            algorithm.schema.items.find(i => i.id() === id).markAs(status);
        }
        catch{}
        this.layer.batchDraw();
    };

    // reset the current cycle
    algorithm.resetCycle = function(){
        let currStep = this.steps[this.currStep];
        algorithm.schema.items.forEach(item => {
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
        else if (this.steps[this.currStep].name === thisStep)	check = true;
        return check;
    };

    // get the next step
    algorithm.increment = function(){
        let thisStep = this.steps[this.currStep];
        if(typeof this.steps[this.currStep] === 'undefined'){
            return  console.log('There is no step');
        }
        if (this.steps[this.currStep].sub.length > 0){ // for the steps with sub steps
            let subStep = thisStep.sub[this.currSubStep];
            if (this.currSubStep === 0)
                algorithm.resetCycle(); // clearing marks at the beginning of the cycle
            model.algorithm.markCurrStep('past');
            if(this.currSubStep < (this.steps[this.currStep].sub.length) - 1){ //check for last substep
                model.algorithm.markCurrStep('past');
                this.currSubStep++;
            }
            else{ // new cycle
                this.currSubStep = 0;
                if (this.cycle === thisStep.cycleCount-1) { // check for last cycle
                    this.cycle = 0;
                    this.currStep++;
                    algorithm.schema.items.find(i => i.id() === thisStep.name+'-check').markAs('past');
                }
                else{ // it isn't last cycle
                    model.algorithm.markCurrStep('past');
                    algorithm.schema.items.find(i => i.id() === thisStep.name+'-check').markAs('curr');
                    this.cycle++;
                }
            }
        }
        else{ //  for the steps without sub steps
            model.algorithm.markCurrStep('past');
            this.currStep++;
        }

        // check for finish step
        thisStep = this.steps[this.currStep];
        if(thisStep.name === 'finish')
        {
            model.stat.logData();
            alert(thisStep.help);
        }
    };

    // get the current step
    algorithm.getCurrStep = function(){
        let currStep = this.steps[this.currStep];
        if (currStep.sub.length > 0) return currStep.sub[this.currSubStep];
        else  return currStep;
    };

    // reset the algorithm
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

// Creating the Algorithm's Panel
createSchema = function(steps, lang, layer){
    let prop={
        width: 280,
        height: 10,
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
    let sch = new Konva.Group ({
        id: 'sch',
        name:'Algorithm panel',
        draggable:false
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

    // add components to mein group
    sch.add(sch.rect, sch.labelRect,  sch.labelTxt);

    // enable dragable property
    sch.labelTxt.on('mouseover touchstart', function(){
        sch.draggable(true);
        stage.container().style.cursor = 'move';
    });
    // disable dragable property
    sch.labelTxt.on('mouseout touchend', function(){
        sch.draggable(false);
        stage.container().style.cursor = 'default';
    });


    sch.items=[];
	 //////////////Creating the schema//////////////////////////////////////////////////////////////
	 let firstItemCenterPos = {x: sch.labelRect.width()/2, y: sch.labelRect.height() + prop.itemDist*2};
    
    //begin item
    let item = new createItem('begin','', layer);
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
            let mainStepName = step.name;
            let stepCount=-1;
            let stepLn = step.sub.length;
            step.sub.forEach(step =>{
                lastItem = sch.items[sch.items.length-1];
                stepCount++;
                // first cycle element is join element
                if (stepCount === 0){
                    item =  new createItem('join','', layer);
                    item.id(mainStepName+'-join');
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

                lastItem = sch.items[sch.items.length-1];
                item =  new createItem('oper', step.description, layer);
                item.id(mainStepName+'-'+step.name);
                item.x(lastItem.x());
                item.y(lastItem.y() + lastItem.height() + prop.itemDist);
                item.soket = {  in: {x: item.x() + item.width()/2, y: item.y()},
                                out:{x: item.x() + item.width()/2, y: item.y() + item.height()}
                };

                item.hoverTxt = step.help;
                item = hover1(item,  sch);
                item = over(item);

                sch.add(item);
                sch.items.push(item);
                lastItem = sch.items[sch.items.length-1];
                // check for last element of cycle
                if (stepCount === stepLn-1){
                    item =  new createItem('check',lang.lastCbit, layer);
                    item.yesTxt.text(lang.yes);
                    item.noTxt.text(lang.no);
                    item.id(mainStepName+'-check');
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
                item = new createItem('end','', layer);
                item.id('end');
                item.x(lastItem.x() + lastItem.width() / 2);
                item.y(lastItem.y() + lastItem.height() + prop.itemDist*2);
                item.soket = { in: {x: item.x() , y: item.y() - item.height()/2} };

                sch.add(item);
                sch.items.push(item);
                lastItem = sch.items[sch.items.length-1];
            }
            else{
                item =  new createItem('oper',step.description, layer);
                item.id(step.name);
                if (sch.items.length === 1) { // for the first step
                    item.x(lastItem.x() - item.width()/2);
                    item.y(lastItem.y() + lastItem.height() + prop.itemDist*0.5);
                }
                else{ // for the other steps
                    item.x(lastItem.x());
                    item.y(lastItem.y() + lastItem.height() + prop.itemDist);
                }

                item.soket = {  in: {x: item.x() + item.width()/2, y: item.y()},
                                out:{x: item.x() + item.width()/2, y: item.y() + item.height()}
                };
                item.hoverTxt = step.help;
                item = hover1(item,  sch);
                item = over(item);

                sch.add(item);
                sch.items.push(item);
                lastItem = sch.items[sch.items.length-1];
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

        // only for check elements
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
            // check for check item
            if (sch.items[i-1].id().search('-check') !== -1){
                let mainStepName = sch.items[i-1].id().split("-")[0];
                targetItem = sch.items.find(item => item.id() === mainStepName+'-join');
            }

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

    // set the position of schema
    sch.setPos = function(pos){
        sch.position(pos);
    };

    // resize the schema
    sch.sizeTo = function(points){
        let size={width:'', height:''};
        if(typeof points.y !== undefined){
            points.y = Math.round(points.y);
            size.height = points.y - sch.y();
            sch.height(sch.rect.height(size.height));
        }
        if(typeof points.x !== undefined){
            points.x = Math.round(points.x);
            size.width = points.x - sch.x();
            sch.width(sch.rect.width());
        }

        layer.batchDraw();
    };


    return sch;
}; // END OF CREATEALGORITH

// creating schema's item
createItem = function(type, text, layer){
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
        this.shape.fill(color);
        layer.batchDraw();
    };
    return item;
} // end of createItem