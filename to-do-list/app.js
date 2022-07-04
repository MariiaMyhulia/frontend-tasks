ToDoListConstructor = function () {


    const toDoList = document.getElementById('task-list');

    function removetask(event) {
        if (event.target.classList.contains('remove-task')) {
            event.target.parentElement.remove();
        }

    }


    this.addThisTask = function (event) {
        event.preventDefault();

        let prior = document.getElementById('prior').value;
        let titleText = document.getElementById('title').value;
        let task = document.getElementById('task').value;


        const removeBtn = document.createElement('a');
        removeBtn.classList = 'remove-task';
        removeBtn.textContent = 'X';
        removeBtn.addEventListener('click', function (e) {
            removetask(e)
        })


        const li = document.createElement('li');
        li.title = prior;
        let dl = document.createElement('dl');
        let dt = document.createElement('dt');
        dt.textContent = titleText;
        dl.appendChild(dt);

        let dd = document.createElement('dd');
        dd.textContent = task;
        dl.appendChild(dd);
        li.appendChild(dl);
        li.appendChild(removeBtn);

        toDoList.appendChild(li);

        toDoList.addEventListener('click', this.removetask);

    }


};

function init() {
    let taskAppObj = new ToDoListConstructor();
    document.querySelector('#test').addEventListener('click', taskAppObj.addThisTask);
};

function clearVars() {
    let taskAppObj = null;
}

document.addEventListener("DOMContentLoaded", function(){
    init();
});


