'use-strict';

class ToDoList {
    
    constructor() {
        this._button = document.getElementById('add-new');
        this._todoContainer = document.getElementById('to-do');
        this._doneContainer = document.getElementById('done');
    }

    createElement({
        type,
        parent,
        attributes = {},
        children = []
    }) {
        const element = document.createElement(type);

        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });

        children.forEach(child => {
            if (typeof child == 'object') {
                return this.createElement({...child, parent: element});
            }
            const textNode = document.createTextNode(child);
            element.appendChild(textNode);
        });

        parent.appendChild(element);
        return element;
    }

    createTodoRow(parent, text, elementId) {
        this.createElement({
            type: 'div',
            parent: parent,
            attributes: {
                class: 'todo-element',
                id: elementId
            },
            children: [{
                type: 'span',
                children: [text]
            }, {
                type: 'button',
                attributes: {
                    class: 'done-button',
                    onclick: `myToDo.deleteElement(this, '${elementId}');`
                },
                children: ['Done!']
            }, {
                type: 'input',
                attributes: {
                    type: 'checkbox',
                    class: 'todo-checkbox'
                }
            }]
        });
    }

    createDoneRow(parent, text, elementId) {
        this.createElement({
            type: 'div',
            parent: parent,
            attributes: {
                class: 'todo-element',
                id: elementId
            },
            children: [{
                type: 'span',
                children: [text]
            }, {
                type: 'button',
                attributes: {
                    class: 'done-button',
                    onclick: `myToDo.deleteElement(this, '${elementId}');`
                },
                children: ['Delete!']
            }]
        });
    }

    createHrRow(parent, taskKey) {
        this.createElement({
            type: 'hr',
            parent: parent,
            attributes: {
                class: `solid ${taskKey}`
            }
        });
    }

    deleteElement(element, hrKey) {
        let myParentElement = element.parentElement;
        this.setElementIsDone(myParentElement.id);
        //remuevo la barra separadora
        document.querySelector(`.${hrKey}`).remove();
        //remuevo el elemento
        myParentElement.remove();
    }

    addElement() {
        let task = prompt('Task description:');
        let taskKey = this.keyGenerator(task, 'todo');
        if (task?.trim()) {
            this.setTaskToStorage(taskKey, task);
            this.createTodoRow(this._todoContainer, task, taskKey);
            this.createHrRow(this._todoContainer, taskKey);
        }
    }

    setElementIsDone(taskKey) {
        let task = localStorage.getItem(taskKey);
        this.unsetTaskFromStorage(taskKey);
        if (taskKey.search('todo') !== -1) {
            let doneKey = this.keyGenerator(task, 'done');
            this.setTaskToStorage(doneKey, task);
            this.createDoneRow(this._doneContainer, task, doneKey);
            this.createHrRow(this._doneContainer, doneKey);
        }

    }

    _init() {
        for (const[k, v] of Object.entries(localStorage)) {
            if (k.search('todo') !== -1) {
                this.createTodoRow(this._todoContainer, v, k);
                this.createHrRow(this._todoContainer, k);
            } else if (k.search('done') !== -1) {
                this.createDoneRow(this._doneContainer, v, k);
                this.createHrRow(this._doneContainer, k);
            }
        }
    }

    setTaskToStorage(taskKey, taskValue) {
        if (localStorage.getItem(taskKey)) {
            localStorage.removeItem(taskKey);
        }
        localStorage.setItem(taskKey, taskValue);
    }

    unsetTaskFromStorage(taskKey) {
        localStorage.removeItem(taskKey);
    }

    keyGenerator(input, type) {
        let key = [];
        input?.split(' ').forEach(el => key.push(el[0]));
        let taskKey = `${type}-${key.join('')}`;
        if (localStorage.getItem(taskKey)) {
            taskKey = this.incrementTaskKey(taskKey);
        }
        return taskKey;
    }

    incrementTaskKey(taskKey) {
        let myTaskKey = `${taskKey}-`;
        if (localStorage.getItem(myTaskKey)) {
            return this.incrementTaskKey(myTaskKey);
        }
        return myTaskKey;
    }
}

let myToDo = new ToDoList();
myToDo._init();