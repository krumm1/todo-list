document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.forms.todo;
    const todoInput = document.querySelector('.todo-input');
    const todoAddBtn = document.querySelector('.todo__btn');
    const todoListElem = document.querySelector('.todo-list');
    const todoArr = JSON.parse(localStorage.getItem('todoList')) || [];

    let editableText = "";

    fillTodoList(todoArr);

    todoForm.addEventListener('submit', addNewItem);

    todoAddBtn.addEventListener('click', () => todoInput.focus());

    todoListElem.addEventListener('change', toggleItem);
    todoListElem.addEventListener('click', removeItemFromHTML);
    todoListElem.addEventListener('click', function(e) {
        e.stopPropagation();
        hideInput();

        const target = e.target;
        const clickedTodoItem = target.parentElement;

        if (!target.classList.contains('todo-txt') 
        || clickedTodoItem.classList.contains('todo-list__item--checked') ) return;

        const html = `<form>
            <input type="text" class="todo-input" value="${target.textContent}"/>
        </form>`;

        clickedTodoItem.insertAdjacentHTML('beforeend', html);
        target.remove();
        
        const input = clickedTodoItem.querySelector('.todo-input');
        input.selectionStart = input.selectionEnd = input.value.length;
        input.focus();
        editableText = input.value;
    });
    todoListElem.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const target = e.target;
        const newValue = target.querySelector('input').value;
        const currentElem = target.parentElement;
        const id = +currentElem.querySelector('[data-id]').dataset.id;

        if (newValue) {
            const html = `<span class="todo-txt">${newValue}</span>`;
            currentElem.insertAdjacentHTML('beforeend', html);
            target.remove();
            editableText = "";
            updateItemInArray(id, newValue);
        } else {
            hideInput();
        }
    });

    document.addEventListener('click', hideInput);

    function addNewItem(e) {
        e.preventDefault();
        
        const str = todoInput.value;

        if (!str) return;

        const item = {
            id: setItemId(),
            checked: false,
            text: str
        }

        todoListElem.insertAdjacentHTML('beforeend', generateItemHtml(item));
        todoArr.push(item);

        todoInput.value = '';

        saveListToLocalStorage();
    }

    function generateItemHtml(item) {
        return `<li class="todo-list__item ${item.checked ? "todo-list__item--checked" : ""}">
        <label class="todo-list__checkbox-wrapper">
            <input type="checkbox" class="todo-list__checkbox" ${item.checked ? "checked" : ""} data-id="${item.id}"/>
            <span></span>
        </label>
        <span class="todo-txt">${item.text}</span>
        <button type="button" class="todo-list__del">❌</button>
        </li>`;
    }

    function fillTodoList(arr) {
        arr.forEach(elem => {
            todoListElem.insertAdjacentHTML('beforeend', generateItemHtml(elem));
        })
    }

    function toggleItem(e) {
        const input = e.target;

        if (!input.classList.contains('todo-list__checkbox')) return;
        input.parentElement.parentElement.classList.toggle('todo-list__item--checked');

        const itemId = +input.dataset.id;
        const checkedItem = todoArr.find(el => el.id == itemId);

        checkedItem.checked = !checkedItem.checked;

        saveListToLocalStorage();
    } 

    function saveListToLocalStorage() {
        localStorage.setItem('todoList', JSON.stringify(todoArr));
    }

    function setItemId() {
        let id = todoArr.length;

        while (todoArr.findIndex(el => el.id === id) !== -1) {
            id++;
        }

        return id;
    }

    function removeItemFromArray(item) {
        const index = todoArr.findIndex(el => el == item);

        todoArr.splice(index, 1);

        saveListToLocalStorage();
    }

    function updateItemInArray(id, str) {
        const item = todoArr.find(el => el.id === id);
        item.text = str;
        saveListToLocalStorage();
    }

    function removeItemFromHTML(e) {
        const target = e.target;

        if (!e.target.classList.contains('todo-list__del')) return;

        const deleteBtn = target;
        const todoItem = deleteBtn.parentElement;
        const itemId = +todoItem.querySelector('.todo-list__checkbox').dataset.id;
        const removedItem = todoArr.find(el => el.id === itemId);
        
        removeItemFromArray(removedItem);
        todoItem.remove();
    }

    function hideInput() {
        todoListElem.querySelectorAll('form').forEach(form => {
            const elem = form.parentElement;
            const html = `<span class="todo-txt">${editableText}</span>`;
            elem.insertAdjacentHTML('beforeend', html);
            form.remove();
        })
    }
});