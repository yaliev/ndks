function LnagPack(thisLang){
    let l = {en:{ alg:{}, stat:{}, gn:{}},
             bg:{ alg:{}, stat:{}, gn:{}}
    };
    // general
    l.en.gn.hcModelTitle='Interactive Simulation Model of Hamming Code - General Algorithm';
    l.bg.gn.hcModelTitle='Интерактивен Симулационен Модел на Код на Хеминг - Обикновен Алгоритъм';
    l.en.gn.openMdlBtn='Open the Model';
    l.bg.gn.openMdlBtn='Отвори модела';
    l.en.gn.resetMdlBtn='Reset the Model';
    l.bg.gn.resetMdlBtn='Изчисти модела';
    l.en.gn.encRadio='Encoder';
    l.bg.gn.encRadio='Кодер';
    l.en.gn.decRadio='Decoder';
    l.bg.gn.decRadio='Декодер';
    l.en.gn.mode='Mode:';
    l.bg.gn.mode='Режим:';
    l.en.gn.enLabel='Hamming Encoder - General Algorithm';
    l.bg.gn.enLabel='Хеминг кодер - обикновен алгоритъм';
    l.en.gn.decLabel='Hamming Decoder - General Algorithm';
    l.bg.gn.decLabel='Хеминг декодер - обикновен алгоритъм';
    l.en.gn.irLabel='Information Register';
    l.bg.gn.irLabel='Информационен регистър';
    l.en.gn.crLabel='Codeword Register';
    l.bg.gn.crLabel='Регистър на кодовата дума';
    l.en.gn.wrongK='Wrong "k" value!';
    l.bg.gn.wrongK='Грешна стойност за "k"';
    l.en.gn.wrongN='Wrong "n" value!';
    l.bg.gn.wrongN='Грешна стойност за "n"';
    l.en.gn.setAllBit='Not all information bits are set!';
    l.bg.gn.setAllBit='Не са зададени всички информационни битове!';
    l.en.gn.setAllCwBit='Not all Codeword Bits are Set!';
    l.bg.gn.setAllCwBit='Не са зададени всички битове на кодовата дума!';
    l.en.gn.startTimer='Start the timer!';
    l.bg.gn.startTimer='Стартирай таймера!';
    l.en.gn.simFinish='The simulation is finished! For new simulation click "Reset the model" button !';
    l.bg.gn.simFinish='Симулацията приключи! За нова симулация  натиснете бутона "Нулиране на модела"!';
    l.en.gn.timerExp='The timer is expired! For new simulation click "Reset the model" button !';
    l.bg.gn.timerExp='Таймерът изтече! За нова симулация  натиснете бутона "Нулиране на модела"!';
    l.en.gn.noModel='The model is not created!';
    l.bg.gn.noModel='Моделът не е създаден!';
    l.en.gn.randHover='Generate Random Bits';
    l.bg.gn.randHover='Генерирай случайни битове';
    l.en.gn.randCwHover='Generate Random Codeword without Error';
    l.bg.gn.randCwHover='Генерирай случайна кодова дума без грешка';
    l.en.gn.randErrHover='Generate Random Codeword with Error';
    l.bg.gn.randErrHover='Генерирай случайна кодова дума с грешка';
    l.en.gn.placeLabel='Place the Label on the Correct Bit';
    l.bg.gn.placeLabel='Постави етикета върху коректния бит';
    l.en.gn.checkLabels='Check the Labels';
    l.bg.gn.checkLabels='Провери етикетите';
    l.en.gn.incorrectLabel='Incorrect Marked Bits';
    l.bg.gn.incorrectLabel='Грешно маркирани битове';
    l.en.gn.loadBits='Load the Bits';
    l.bg.gn.loadBits='Зареди битовете';
    l.en.gn.equBtnTxt='Control Bits Equation Field';
    l.bg.gn.equBtnTxt='Поле за уравнение на контролените битове';
    l.en.gn.noSelectedBit='There is no Selected Control Bit';
    l.bg.gn.noSelectedBit='Няма избран контролен бит';
    l.en.gn.noEquMem='There is no Selected Equation Members';
    l.bg.gn.noEquMem='Няма избрани членове за уравнението';
    l.en.gn.wrongEqu='Wrong Control Bit Equation';
    l.bg.gn.wrongEqu='Грешно уравнение за контролен бит';
    l.en.gn.wrongCval='Wrong Control Bit Value';
    l.bg.gn.wrongCval='Грешна стойност за контролен бит';
    l.en.gn.writeCbitVal='Write the Control Bit Value';
    l.bg.gn.writeCbitVal='Запши стойността на контролния бит';
    l.en.gn.noEqu='There is no Equation';
    l.bg.gn.noEqu='Няма уравнение';
    l.en.gn.calcCbit='Calculate the equation';
    l.bg.gn.calcCbit='Изчисли уравнението';
    l.en.gn.insertToEqu='Insert to the Equation';
    l.bg.gn.insertToEqu='Добави към уравнението';
    l.en.gn.selectCbit='Select the Control Bit';
    l.bg.gn.selectCbit='Избери контролния бит';
    l.en.gn.wronC0choice='Wrong Control Bit Choice';
    l.bg.gn.wronC0choice='Грешен избор на контролен бит';
    l.en.gn.wasCalculated='This Control Bit is calculated';
    l.bg.gn.wasCalculated='Този контролен бит е изчислен';
    l.en.gn.writeCbitCheck='Write Control bit value';
    l.bg.gn.writeCbitCheck='Запиши стойността на контролния бит';
    l.en.gn.randCWLabel='Random CW';
    l.bg.gn.randCWLabel='Случайна КД';
    l.en.gn.randCwErrLabel='Random CW with Error';
    l.bg.gn.randCwErrLabel='Случайна КД с грешка';
    l.en.gn.randInfoLabel='Random Bits';
    l.bg.gn.randInfoLabel='Случайни битове';
    l.en.gn.setDecCode='Set the Error Position';
    l.bg.gn.setDecCode='Задайте позицията на грешката';
    l.en.gn.setBinCode='Set the Error Binary Code';
    l.bg.gn.setBinCode='Задай двоичния код на грешката';
    l.en.gn.wrongBinCode='Wrong the Error Binary Code';
    l.bg.gn.wrongBinCode='Грешен двоичен код на грешката';
    l.en.gn.wrongDecCode='Wrong the Error position';
    l.bg.gn.wrongDecCode='Грешна позиция на грешката';
    l.en.gn.resultAnalysis='Result Analysis';
    l.bg.gn.resultAnalysis='Анализ на резултата';
    l.en.gn.mTitle='Number of information bits';
    l.bg.gn.mTitle='Брой на информационните битове';
    l.en.gn.lTitle='Number of errors the code can detect';
    l.bg.gn.lTitle='Брой на грешките, които кода може да открива';
    l.en.gn.kTitle='Number of control bits';
    l.bg.gn.kTitle='Брой на контролните битове';
    l.en.gn.nTitle='Number of codeword bits';
    l.bg.gn.nTitle='Брой на битовете на кодовата комбинация';



    // statistics
    l.en.stat.title='Statistics';
    l.bg.stat.title='Статистика';
    l.en.stat.startTimer='Start the Timer';
    l.bg.stat.startTimer='Стартирай таймера';
    l.en.stat.stopTimer='Stop the Timer';
    l.bg.stat.stopTimer='Спри таймера';
    l.en.stat.time='Time:';
    l.bg.stat.time='Време:';
    l.en.stat.min='min';
    l.bg.stat.min='мин';
    l.en.stat.sec='sec';
    l.bg.stat.sec='сек';
    l.en.stat.maxTime='The maximum time is: ';
    l.bg.stat.maxTime='Максималното време е: ';
    l.en.stat.err='Errors: ';
    l.bg.stat.err='Грешки: ';
    l.en.stat.showErrors='Show Errors';
    l.bg.stat.showErrors='Покажи грешките';
    l.en.stat.hideErrors='Hide Errors';
    l.bg.stat.hideErrors='Скрий грешките';

    // algorithm
    l.en.alg.setBits='Set the Information Bits';
    l.bg.alg.setBits='Задаване на инф. битове';
    l.en.alg.setBitsCW='Set the Codeword Bits';
    l.bg.alg.setBitsCW='Задаване на кодовата дума';
    l.en.alg.markBitsEN='Marking the Encoder Bits';
    l.bg.alg.markBitsEN='Маркиране битовете на кодера';
    l.en.alg.markBitsDEC='Marking the Decoder Bits';
    l.bg.alg.markBitsDEC='Маркиране битовете на декодера';
    l.en.alg.loadEN='Loading the Encoder';
    l.bg.alg.loadEN='Зареждане на кодера';
    l.en.alg.loadDEC='Loading the Decoder';
    l.bg.alg.loadDEC='Зареждане на декодера';
    l.en.alg.calcCbits='Calculating the Control Bit';
    l.bg.alg.calcCbits='Изчисляване на контролния бит';
    l.en.alg.calcEqu='Calculating the Equation';
    l.bg.alg.calcEqu='Изчисляване на уравнението';
    l.en.alg.selectCbit='Selecting а Control Bit';
    l.bg.alg.selectCbit='Избиране на контролен бит';
    l.en.alg.createEqu='Creating an Equation';
    l.bg.alg.createEqu='Съставяне на уравнение';
    l.en.alg.lastCbit='Last control bit?';
    l.bg.alg.lastCbit='Последен контролен бит?';
    l.en.alg.calcCbit='Calculating the Control Bit';
    l.bg.alg.calcCbit='Изчисляване на контролен бит';
    l.en.alg.writeCbit='Writing the Control Bit';
    l.bg.alg.writeCbit='Записване на контроления бит';
    l.en.alg.finish='The simulation finish!';
    l.bg.alg.finish='Симулацията приключи!';
    l.en.alg.yes='Yes';
    l.bg.alg.yes='Да';
    l.en.alg.no='No';
    l.bg.alg.no='Не';
    l.en.alg.title='Algorithm';
    l.bg.alg.title='Алгоритъм';
    l.en.alg.wrongOper='Wrong operation';
    l.bg.alg.wrongOper='Грешна операция';
    l.en.alg.setParam='Setting the Code Parameters';
    l.bg.alg.setParam='Задаване на параметрите на кода';
    l.en.alg.resAnalysis='Analysis of the Result';
    l.bg.alg.resAnalysis='Анализ на резултата';

    l.en.alg.setParamHelp='Set the value of: m, l, k and n';
    l.bg.alg.setParamHelp='Задайте стойностите на: m, l, k и n';
    l.en.alg.setIrBitsHelp='Click on Info register\'s bits or "'+l.en.gn.randInfoLabel+'"';
    l.bg.alg.setIrBitsHelp='Кликнете върху битовете на Информационния регисър или бърху "'+l.bg.gn.randInfoLabel+'"';
    l.en.alg.markBitsENHelp='Drag all labels on the correct bits after click the "'+l.en.gn.checkLabels+'" button';
    l.bg.alg.markBitsENHelp='Провлачете всички етикети върху правилните битове и след това кликнете върху бутона "'+l.bg.gn.checkLabels+'"';
    l.en.alg.loadBitsHelp='Click on "'+l.en.gn.loadBits+'" button';
    l.bg.alg.loadBitsHelp='Кликнете върху бутона "'+l.bg.gn.loadBits+'"';
    l.en.alg.selectCbitHelp='Click on the control bit that we will calculate/check';
    l.bg.alg.selectCbitHelp='Кликнете върху контролния бит, който ще изчислявате/проверявате';
    l.en.alg.createEquHelp='Click on the bits involved in the equation';
    l.bg.alg.createEquHelp='Кликнете върху битовете, участващи в уравнението';
    l.en.alg.calcCbitHelp='Click on the equation field';
    l.bg.alg.calcCbitHelp='Кликнете върху полето на уравнението';
    l.en.alg.writeCbitHelp='Click the arrow on the calculated control bit';
    l.bg.alg.writeCbitHelp='Кликнете върху стрелката на изчисления контролен бит';
    l.en.alg.finishMsg='The simulation finished! Click on "'+l.en.gn.resetMdlBtn+'" button for new simulation.';
    l.bg.alg.finishMsg='Симулацията приключи! Кликнете върху бутона "'+l.bg.gn.resetMdlBtn+'" за нова симулация.';

    l.en.alg.setCwBitsHelp='Click on CW register\'s bits or "'+l.en.gn.randCWLabel+'" or "'+l.en.gn.randCwErrLabel+'"';
    l.bg.alg.setCwBitsHelp='Кликнете върху битовете на Регистъра на кодовата дума или върху "'+l.bg.gn.randCWLabel+'" или върху "'+l.bg.gn.randCwErrLabel+'"';
    l.en.alg.writeCbitCheckHelp='Click on the checked control bit, below the equation';
    l.bg.alg.writeCbitCheckHelp='Кликнете върху проверявания контролен бит, под уравнението';
    l.en.alg.errAnalysisHelp='Set the binary error code. Then the error position if there is a possibility of correction';
    l.bg.alg.errAnalysisHelp='Задайте двоичния код на грешката. След това задайте десетичния код на грешката.';

    return (thisLang === 'bg') ? l.bg : l.en
}