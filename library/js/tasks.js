class TasksList{
    constructor(modelName){
        let task;
        switch(modelName){
            case 'hcModel':     return this.hcModelTasks();
            case 'hcMatModel':  return this.hcMatModelTasks();
            case 'ccPolyModel': return this.ccPolyModelTasks();
            case 'ccLFSRModel': return this.ccLFSRModelTasks();
            default: console.error('Model name is not found!')
        }
    }

    //  Hemming Code  - general ----------------------------------------------------------------------------------------
    hcModelTasks(){
        let tasks = [];
        let count = 0;
        let task = {};
        task = {
            id: 'task'+count++,
            model: 'hcModel',
            title: 'Обучение',
            text: 'Запознаване с интерактивния сумулационен модел на код на Хеминг - обикновен алгоритъм. По време на обучението ще може да се използва интерактивен алгоритъм, който би бил полезен при работата с модела.' +
                '<br> <i>Указания:'+
                '<br> - Използвайте генератора за случни битове на информационния регистър (кодиране) и генератора на кодови комбинации (декодиране).' +
                '<br> - Декодирайте кодови комбинации: без грешка, с единична грешка и с двойна грешка.' +
                '<br> - Решете един пример в режим на <b>кодиране</b> и един в режим на <b>декодиране</b>, за да преминете към следващия етап - решаване на конкретни задачи.</i>'
        };
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'hcModel',
            title: 'Задача '+count++,
            mode: 'encoder',
            bits: randBits(10)
        };
        task.text = 'Да се <b>кодира</b> в код на Хеминг (обикновен алгоритъм), откриващ и коригиращ всички <b>единични</b> грешки за информационната комбинация: <b>'+task.bits.str+'</b>. Изберете правилните параметри на кода.';
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'hcModel',
            title: 'Задача '+count++,
            mode: 'decoder',
            bits: {vals:hcEncoder({infoBits: randBits(12).vals, l:1, errCount:2})}
        };
        task.bits.str = task.bits.vals.toString().replace(/,/g, '');
        task.text = 'Да се <b>декодира</b> кодовата комбинация <b>'+task.bits.str+'</b>, кодирана с код на Хеминг (обикновен алгоритъм), откриващ и коригиращ всички <b>единични</b> грешки за 12 битова информационна комбинация.';
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'hcModel',
            title: 'Задача '+count++,
            mode: 'encoder',
            bits: randBits(10)
        };
        task.text = 'Да се <b>кодира</b> в код на Хеминг (обикновен алгоритъм), откриващ и коригиращ всички <b>двойни</b> грешки за информационната комбинация: <b>'+task.bits.str+'</b>. Изберете правилните параметри на кода.';
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'hcModel',
            title: 'Задача '+count++,
            mode: 'decoder',
            bits: {vals:hcEncoder({infoBits: randBits(12).vals, l:2, errCount:1})}
        };
        task.bits.str = task.bits.vals.toString().replace(/,/g, '');
        task.text = 'Да се <b>декодира</b> кодовата комбинация <b>'+task.bits.str+'</b>, кодирана с код на Хеминг (обикновен алгоритъм), откриващ и коригиращ всички <b>двойни</b> грешки за 12 битова информационна комбинация.';
        tasks.push(task);

        return tasks;
    }

    // Hamming - matrix ------------------------------------------------------------------------------------------------
    hcMatModelTasks(){
        let tasks = [];
        let count = 0;
        let task = {};
        task = {
            id: 'task'+count++,
            model: 'hcMatModel',
            title: 'Обучение',
            text: 'Запознаване с интерактивния сумулационен модел на код на Хеминг - матричен алгоритъм. По време на обучението ще може да се използва интерактивен алгоритъм, който би бил полезен при работата с модела.' +
                '<br> <i>Указания:'+
                '<br> - Използвайте генератора за случни битове на информационния регистър (кодиране) и генератора на кодови комбинации (декодиране).' +
                '<br> - Декодирайте кодови комбинации: без грешка, с единична грешка и с двойна грешка.' +
                '<br> - Решете един пример в режим на <b>кодиране</b> и един в режим на <b>декодиране</b>, за да преминете към следващия етап - решаване на конкретни задачи.</i>'
        };
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'hcMatModel',
            title: 'Задача '+count++,
            mode: 'encoder',
            bits: randBits(10)
        };
        task.text = 'Да се <b>кодира</b> в код на Хеминг (обикновен алгоритъм), откриващ и коригиращ всички <b>единични</b> грешки за информационната комбинация: <b>'+task.bits.str+'</b>. Изберете правилните параметри на кода.';
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'hcMatModel',
            title: 'Задача '+count++,
            mode: 'decoder',
            bits: {vals:hcEncoder({infoBits: randBits(12).vals, l:1, errCount:2})}
        };
        task.bits.str = task.bits.vals.toString().replace(/,/g, '');
        task.text = 'Да се <b>декодира</b> кодовата комбинация <b>'+task.bits.str+'</b>, кодирана с код на Хеминг (обикновен алгоритъм), откриващ и коригиращ всички <b>единични</b> грешки за 12 битова информационна комбинация.';
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'hcMatModel',
            title: 'Задача '+count++,
            mode: 'encoder',
            bits: randBits(10)
        };
        task.text = 'Да се <b>кодира</b> в код на Хеминг (обикновен алгоритъм), откриващ всички <b>двойни</b> грешки за информационната комбинация: <b>'+task.bits.str+'</b>. Изберете правилните параметри на кода.';
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'hcMatModel',
            title: 'Задача '+count++,
            mode: 'decoder',
            bits: {vals:hcEncoder({infoBits: randBits(12).vals, l:2, errCount:1})}
        };
        task.bits.str = task.bits.vals.toString().replace(/,/g, '');
        task.text = 'Да се <b>декодира</b> кодовата комбинация <b>'+task.bits.str+'</b>, кодирана с код на Хеминг (обикновен алгоритъм), откриващ всички <b>двойни</b> грешки за 12 битова информационна комбинация.';
        tasks.push(task);

        return tasks;
    }

    // Cyclic code polynomial ------------------------------------------------------------------------------------------
    ccPolyModelTasks(){
        let tasks = [];
        let count = 0;
        let task = {};
        task = {
            id: 'task'+count++,
            model: 'ccPolyModel',
            title: 'Обучение',
            text: 'Запознаване с интерактивния сумулационен модел на цикличен код в полиномна форма. По време на обучението ще може да се използва интерактивен алгоритъм, който би бил полезен при работата с модела.' +
                '<br> <i>Указания:'+
                '<br> - Използвайте генератора за случни битове на информационния регистър.' +
                '<br> - Решете един пример с код откиращ всички <b>двойни</b> и един пример с код откиращ всички <b>тройни</b> грешки, за да преминете към следващия етап - решаване на конкретни задачи.</i>'
        };
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'ccPolyModel',
            title: 'Задача '+count++,
            mode: 'encoder',
            bits: randBits(10)
        };
        task.text = 'Да се кодира в цикличен код, откриващ всички <b>двойни</b> грешки за информационната комбинация: <b>'+task.bits.str+'</b>. Изберете правилните параметри на кода.';
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'ccPolyModel',
            title: 'Задача '+count++,
            mode: 'encoder',
            bits: randBits(10)
        };
        task.text = 'Да се кодира в цикличен код, откриващ всички <b>тройни</b> грешки за информационната комбинация: <b>'+task.bits.str+'</b>. Изберете правилните параметри на кода.';
        tasks.push(task);

        return tasks;
    }

    // Cyclic code polynomial ------------------------------------------------------------------------------------------
    ccLFSRModelTasks(){
        let tasks = [];
        let count = 0;
        let task = {};
        task = {
            id: 'task'+count++,
            model: 'ccPolyModel',
            title: 'Обучение',
            text: 'Запознаване с интерактивния сумулационен модел на цикличен код чрез използване на линеен с обратна връзка изместващ регистър. По време на обучението ще може да се използва интерактивен алгоритъм, който би бил полезен при работата с модела.' +
                '<br> <i>Указания:'+
                '<br> - Използвайте генератора за случни битове на информационния регистър.' +
                '<br> - Решете един пример с код откиращ всички <b>двойни</b> и един пример с код откиращ всички <b>тройни</b> грешки, за да преминете към следващия етап - решаване на конкретни задачи.</i>'
        };
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'ccPolyModel',
            title: 'Задача '+count++,
            mode: 'encoder',
            bits: randBits(10)
        };
        task.text = 'Да се кодира в цикличен код, откриващ всички <b>двойни</b> грешки за информационната комбинация: <b>'+task.bits.str+'</b>. Изберете правилните параметри на кода.';
        tasks.push(task);

        task = {
            id: 'task'+count,
            model: 'ccPolyModel',
            title: 'Задача '+count++,
            mode: 'encoder',
            bits: randBits(10)
        };
        task.text = 'Да се кодира в цикличен код, откриващ всички <b>тройни</b> грешки за информационната комбинация: <b>'+task.bits.str+'</b>. Изберете правилните параметри на кода.';
        tasks.push(task);

        return tasks;
    }
}// end of TasksList class