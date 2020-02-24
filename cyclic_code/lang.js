function LnagPack(thisLang){
    let l = {en:{ alg:{}, stat:{}, gn:{}},
             bg:{ alg:{}, stat:{}, gn:{}}
    };
    // for the general
    l.en.gn.enLabel='Encoder';
    l.bg.gn.enLabel='Кодер';
    l.en.gn.irLabel='Information Register';
    l.bg.gn.irLabel='Информационен регистър';
    l.en.gn.crLabel='Codeword Register';
    l.bg.gn.crLabel='Регистър на кодовата дума';
    l.en.gn.fbLabel='FB = ';
    l.bg.gn.fbLabel='ОВ = ';
    l.en.gn.wrongK='Wrong "k" value!';
    l.bg.gn.wrongK='Грешна стойност за "k"';
    l.en.gn.wrongN='Wrong "n" value!';
    l.bg.gn.wrongN='Грешна стойност за "n"';
    l.en.gn.wrongPoly='Wrong generator polynomial!';
    l.bg.gn.wrongPoly='Грешен генераторен полином!';
    l.en.gn.wrongXor='Wrong XOR value!';
    l.bg.gn.wrongXor='Грешнa XOR стойност!';
    l.en.gn.wrongSw='Wrong switch position!';
    l.bg.gn.wrongSw='Грешна позиция на ключовете!';
    l.en.gn.wrongFb='Wrong Feedback value!';
    l.bg.gn.wrongFb='Грешна стойност на ОВ!';
    l.en.gn.setAllBit='Set the all Bits!';
    l.bg.gn.setAllBit='Задай всичките битове!';
    l.en.gn.startTimer='Start the timer!';
    l.bg.gn.startTimer='Стартирай таймера!';
    l.en.gn.simFinish='The simulation is finished! For new simulation click "Reset the model" button !';
    l.bg.gn.simFinish='Симулацията приключи! За нова симулация  натиснете бутона "Нулиране на модела"!';
    l.en.gn.timerExp='The timer is expired! For new simulation click "Reset the model" button !';
    l.bg.gn.timerExp='Таймерът изтече! За нова симулация  натиснете бутона "Нулиране на модела"!';
    l.en.gn.noModel='The model is not created!!';
    l.bg.gn.noModel='Моделът не е създаден!';
    l.en.gn.sHover='Shift the register';
    l.bg.gn.sHover='Измести регистъра';
    l.en.gn.rHover='Revers the register';
    l.bg.gn.rHover='Обърни регистъра';
    l.en.gn.randHover='Generate random information bits';
    l.bg.gn.randHover='Генерирах случайни информационни битове';
    l.en.gn.swHover='Change position';
    l.bg.gn.swHover='Промени позицията';
    l.en.gn.bitHover='Set Bit';
    l.bg.gn.bitHover='Задай бит';
    l.en.gn.xorHover='Calculate XOR';
    l.bg.gn.xorHover='Изчисли XOR';
    l.en.gn.fbHover='Calculate FB';
    l.bg.gn.fbHover='Изчисли ОВ';

    // for the statistics
    l.en.stat.title='Info panel';
    l.bg.stat.title='Информационен панел';
    l.en.stat.timerHover='Start timer';
    l.bg.stat.timerHover='Стартирай таймера';
    l.en.stat.time='Time:';
    l.bg.stat.time='Време:';
    l.en.stat.min='min';
    l.bg.stat.min='мин';
    l.en.stat.sec='sec';
    l.bg.stat.sec='сек';
    l.en.stat.err='Errors: ';
    l.bg.stat.err='Грешки: ';

    // for the algorithm
    l.en.alg.setBit='Set the Information bit';
    l.bg.alg.setBit='Задаване на инф. битове';
    l.en.alg.reverseIR='Revers the Information Register.';
    l.bg.alg.reverseIR='Обръщане на инф. регистър';
    l.en.alg.setSW='Set the Switches';
    l.bg.alg.setSW='Превключване на ключовете';
    l.en.alg.calcParity='Running the Encoder’s cycle';
    l.bg.alg.calcParity='Изпълнение циклите на Кодера';
    l.en.alg.calcFB='Calculate the Feedback value';
    l.bg.alg.calcFB='Изчисляване стойн. на ОВ';
    l.en.alg.calcXOR='Calculate the XORs';
    l.bg.alg.calcXOR='Изчисляване стойн. на XOR';
    l.en.alg.calcXOR='Calculate the XORs';
    l.bg.alg.calcXOR='Изчисляване стойн. на XOR';
    l.en.alg.shiftEN='Shift the Encoder';
    l.bg.alg.shiftEN='Изместване на Кодера';
    l.en.alg.shiftCR='Shift the Codeword Register';
    l.bg.alg.shiftCR='Изместване рег. на кодовата дума';
    l.en.alg.shiftIR='Shift the Information Register';
    l.bg.alg.shiftIR='Изместване рег. на Информ. битове';
    l.en.alg.shiftParity='Shift Parity Bits from Encoder to Codeword Register';
    l.bg.alg.shiftParity='Изместване на контр. битове в рег. на КД';
    l.en.alg.reverseCR='Reverse the Codeword Register';
    l.bg.alg.reverseCR='Обръщане реги. на кодовата дума';
    l.en.alg.emptyIR='Is IR empty ?';
    l.bg.alg.emptyIR='Празен ли е ИР ?';
    l.en.alg.emptyEN='Is Encoder empty ?';
    l.bg.alg.emptyEN='Празен ли е кодера ?';
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

    return (thisLang === 'bg') ? l.bg : l.en
}





