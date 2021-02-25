const TOKEN                     = document.getElementsByName("_token")[0].value;
const TODO_LIST_ID_ATTRIBUTE    = 'data-todo-list-id';
const GET_TODOS_URL_PATTERN     = '/todos/';
const TODO_STATUS_ICO           = '<i class="bi-square"></i>';
const TODO_STATUS_ICO_DONE      = '<i class="bi bi-check-square-fill todo-done-ico"></i>';
const NO_TODO_LIST_TEMPLATE     = document.getElementsByClassName('no-todo-list')[0];

const TODOS_CONTAINER           = document.getElementsByClassName('todos-container')[0];
const TODOS_LIST_BTN_CONTAINER  = document.getElementsByClassName('todo-list-nav')[0];
const ADD_TODO_BTN              = document.getElementById('addTodoBtn');
const ADD_TODO_TITLE_INPUT      = document.getElementById('addTodoTitle');
const ADD_TODO_LIST_BTN         = document.getElementById('addTodoListBtn');
const ADD_TODO_LIST_BTN_1       = document.getElementById('createTodoList1');


let todoListBtns = document.getElementsByClassName('todolist-nav-btn');

for (const addBtn of [ADD_TODO_LIST_BTN, ADD_TODO_LIST_BTN_1]) {

    addBtn.addEventListener('click', () => {

        clearTodosContainer();

        let todoListBtn = document.createElement('li');
        let todoListNameInput = document.createElement('input')


        todoListNameInput.setAttribute('type', 'text');
        todoListNameInput.setAttribute('value', '');
        todoListNameInput.setAttribute('placeholder', 'Input name');

        todoListBtn.classList.add('todolist-nav-btn', 'active', 'd-flex');
        todoListBtn.addEventListener('click', () => {
            todoListRemoveActive();
            todoListBtn.classList.add('active');
            buildTodoList(todoListBtn.getAttribute(TODO_LIST_ID_ATTRIBUTE))
        });

        todoListBtn.append(todoListNameInput);

        todoListRemoveActive();

        TODOS_LIST_BTN_CONTAINER.append(todoListBtn);

        todoListNameInput.focus();

        todoListNameInput.addEventListener('focusout', () => {

            let data = {
                name: todoListNameInput.value
            }

            if (todoListNameInput.value.trim().length > 0) {

                addTodoList(data).then(data => {

                    todoListNameInput.setAttribute('disabled', true);
                    todoListBtn.setAttribute('data-todo-list-id', data.id);
                    todoListBtn.append(createRemoveBtn(data.id));
                    NO_TODO_LIST_TEMPLATE.classList.remove('active');

                });

            } else {

                document.querySelectorAll('.todolist-nav-btn.active')[0].remove();

            }
        })
    });

}

if (todoListBtns.length > 0) {

    buildTodoList(todoListBtns[0].getAttribute(TODO_LIST_ID_ATTRIBUTE));

} else {

    NO_TODO_LIST_TEMPLATE.classList.add('active');

}

for (const btn of todoListBtns) {

    let todoListId = btn.getAttribute(TODO_LIST_ID_ATTRIBUTE);

    btn.append(createRemoveBtn(todoListId));

    btn.addEventListener('click', function () {

        todoListRemoveActive();

        btn.classList.add('active');

        buildTodoList(todoListId);
    })
}

function createRemoveBtn(id) {
    let todoListRemoveBtn = document.createElement('div');

    todoListRemoveBtn.classList.add('todolist-remove-btn');
    todoListRemoveBtn.innerHTML = '<i class="bi bi-x"></i>';

    todoListRemoveBtn.addEventListener('click', () => {
        deleteTodoList(id).then(data => {

            if (data.status === 200) {

                let selector = `li[data-todo-list-id='${id}']`

                let navBtns = document.getElementsByClassName('todolist-nav-btn');

                if (navBtns.length > 1) {
                    document.querySelector(selector).remove();
                    document.querySelector('.todolist-nav-btn').classList.add('active');

                } else {
                    NO_TODO_LIST_TEMPLATE.classList.add('active');
                    document.querySelector(selector).remove();
                }




            }

        })
    });
    return todoListRemoveBtn;
}

function todoListRemoveActive() {

    for (const e of todoListBtns) {
        e.classList.remove("active");
    }

}

ADD_TODO_BTN.addEventListener('click', () => {

    let todoTitle = ADD_TODO_TITLE_INPUT.value;

    let data = {
        title: todoTitle,
        todoListID: document.querySelectorAll('.todolist-nav-btn.active')[0].getAttribute(TODO_LIST_ID_ATTRIBUTE)
    }

    if (todoTitle.trim().length >= 3) {
        addTodo(data)
            .then(todo => {
                addTodoToList(todo.id, todo.title);
                ADD_TODO_TITLE_INPUT.value = '';
            });
    }
})

function buildTodoList(id) {

    clearTodosContainer();

    getTodos(id)
        .then(todos => {
            for (const todo of Object.values(todos)) {
                addTodoToList(todo.id, todo.title, todo.is_done);
            }
        });
}

function addTodoToList(id, title, isDone = false) {

    let todo = document.createElement("li");

    let todoBtnGroup = document.createElement("div");
    let todoFinishedBtn = document.createElement("button");
    let todoEditBtn = document.createElement("button");
    let todoRemoveBtn = document.createElement("button");


    todo.draggable = true;

    todo.addEventListener('dragstart', (evt) => {

        evt.target.classList.add(`selected`);

    })

    todo.addEventListener('dragend', (evt) => {

        evt.target.classList.remove(`selected`);

        let todosOrder = [];
        let data = {};
        let todoItems = TODOS_CONTAINER.getElementsByClassName('todo-item');

        for (let i = 0; i < todoItems.length; i++) {

            todosOrder.push(todoItems.item(i).id)

        }

        data.order = todosOrder;

        updateTodoPosition(data).then(resp => {

        });

    })

    const getNextElement = (cursorPosition, currentElement) => {
        const currentElementCoord = currentElement.getBoundingClientRect();
        const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

        return (cursorPosition < currentElementCenter) ?
            currentElement :
            currentElement.nextElementSibling;

    };

    todo.addEventListener(`dragover`, (evt) => {
        evt.preventDefault();

        const activeElement = TODOS_CONTAINER.querySelector(`.selected`);
        const currentElement = evt.target;
        const isMoveable = activeElement !== currentElement &&
            currentElement.classList.contains(`todo-item`);

        if (!isMoveable) {
            return;
        }

        const nextElement = getNextElement(evt.clientY, currentElement);

        if (
            nextElement &&
            activeElement === nextElement.previousElementSibling ||
            activeElement === nextElement
        ) {
            return;
        }

        TODOS_CONTAINER.insertBefore(activeElement, nextElement);

    });


    todoFinishedBtn.classList.add('btn', 'btn-success');
    todoFinishedBtn.setAttribute('type', 'text');
    todoFinishedBtn.innerHTML = '<i class="bi-check-square"></i>';
    todoFinishedBtn.addEventListener('click', () => {

        todoDoneSwitcher(id);

    })

    todoEditBtn.classList.add('btn', 'btn-light');
    todoEditBtn.setAttribute('type', 'text');
    todoEditBtn.innerHTML = '<i class="bi-pen"></i>';
    todoEditBtn.addEventListener('click', () => {

        let todoTitleInput = document.getElementById(id)
            .getElementsByClassName('todo-item-title')[0];

        if (!todoTitleInput.classList.contains('done')) {
            todoTitleInput.removeAttribute('disabled');
            todoTitleInput.classList.add('active');
            todoTitleInput.focus();
        }

        todoTitleInput.addEventListener('focusout', () => {

            todoTitleInput.setAttribute('disabled', true);
            todoTitleInput.classList.remove('active');

            let data = {

                title: todoTitleInput.value,
                isDone: false

            }

            updateTodo(id, data)
                .then(data => {

                        if (data.status === 200) {

                        }
                    }
                )
        });

    })

    todoRemoveBtn.classList.add('btn', 'btn-danger');
    todoRemoveBtn.setAttribute('type', 'text');
    todoRemoveBtn.innerHTML = '<i class="bi-trash">';
    todoRemoveBtn.addEventListener('click', () => {

        deleteTodo(id)
            .then(data => {

                if (data.status === 200) {
                    document.getElementById(id).remove();
                }
            });
    })

    todoBtnGroup.classList.add('todo-item-right-side', 'd-flex')
    todoBtnGroup.append(todoFinishedBtn, todoEditBtn, todoRemoveBtn);


    todo.classList.add('todo-item', 'd-flex', 'justify-content-lg-between');
    todo.id = id;


    let statusIco = isDone ? TODO_STATUS_ICO_DONE : TODO_STATUS_ICO;
    let statusInputClass = isDone ? 'done' : '';


    todo.innerHTML = `<div class="todo-item-left-side d-flex">

                            <div class="todo-item-status d-flex  justify-content-center align-items-center">
                               ${statusIco}
                            </div>

                            <input class="todo-item-title ${statusInputClass}" type="text" value="${title}" disabled>

                        </div>`;

    todo.append(todoBtnGroup);

    TODOS_CONTAINER.append(todo);

}

function todoDoneSwitcher(id) {

    let todoTitle = document.getElementById(id).getElementsByClassName('todo-item-title')[0];
    let todoStatusIco = document.getElementById(id).getElementsByClassName('todo-item-status')[0];

    let isDone = todoTitle.classList.contains('done')


    let data = {

        title: todoTitle.value,
        isDone: !isDone

    }

    updateTodo(id, data)
        .then(data => {

                if (data.status === 200) {
                    isDone ? todoTitle.classList.remove('done') : todoTitle.classList.add('done');
                    todoStatusIco.innerHTML = isDone ? TODO_STATUS_ICO : TODO_STATUS_ICO_DONE;
                }
            }
        )

}

function clearTodosContainer() {

    let todos = document.querySelectorAll(".todo-item");

    for (const todo of todos) {
        todo.remove();
    }

}


async function addTodoList(data) {
    const response = await fetch('/todo-list', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-Token": TOKEN
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteTodoList(id) {
    return await fetch('/todo-list/' + id, {
        method: 'DELETE',

        headers: {
            "X-CSRF-Token": TOKEN
        },
        referrerPolicy: 'no-referrer',
    });
}

async function getTodos(id) {
    let url = '/todo/' + id;

    const response = await fetch(url, {
        cache: 'no-cache',
        referrerPolicy: 'no-referrer'
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function addTodo(data) {
    const response = await fetch('/todo', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-Token": TOKEN
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteTodo(id) {
    return await fetch('/todo/' + id, {
        method: 'DELETE',

        headers: {
            "X-CSRF-Token": TOKEN
        },
        referrerPolicy: 'no-referrer',
    });
}

async function updateTodo(id, data) {
    return await fetch('/todo/' + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-Token": TOKEN
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
}

async function updateTodoPosition(data) {
    return await fetch('/todo', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-Token": TOKEN
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
}





