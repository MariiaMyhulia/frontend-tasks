const taskBtn = document.getElementById('add-task-btn')
const priorityBtn = document.getElementById('priority-filter')
const tasktitle = document.getElementById('task-title')
const taskdesc = document.getElementById('task-description')
const taskPriority = document.getElementById('priority')
const todosWrapper = document.querySelector('.todos-wrapper')
let tasks;
let todoItemElems = []
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'))

function Task(title, description, priority){
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.completed = false;
}

const createTemplate = (task, index) => {
    return `
    <div class="todo-item ${task.completed ? 'checked' : ''}">
    <div class="item-content flex column"  onclick="showDescription(this)">
            <div class="title flex center">${task.title}</div>
            <div class="description hidden">${task.description}</div>
            <div class="priority">${task.priority}</div>
    </div>
            
        <div class = "buttons flex">
            <input type="checkbox" class = "btn-complete" onclick="completeTask(${index})" ${task.completed ? 'checked' : ''}>
            <button onclick="deleteTask(${index})" class="btn-delete">x</button>
        </div>
    </div>
    `
}
const showDescription = (elem) => {
    let desc = elem.querySelector('.description')
    desc.classList.contains('hidden') ? desc.classList.remove('hidden') : desc.classList.add('hidden')
}

const filterTasks = () => {
    const activeTasks = tasks.length && tasks.filter(item => item.completed == false)
    const completedTasks = tasks.length && tasks.filter(item => item.completed == true)
    tasks=[...activeTasks,...completedTasks]
}

const filterTasksByPriority = () => {
    const filteredTasks = tasks.length && tasks.sort(prioritySorting)
    tasks=[...filteredTasks]
}

const prioritySorting = (x,y) => {
    if(x.priority > y.priority) { return -1;}
    if(x.priority < y.priority) { return 1;}
    return 0;
}

const fillHtmlList = () => {
    todosWrapper.innerHTML = ''
    if(tasks.length>0){
        filterTasks()
        tasks.forEach((item,index) => {
            todosWrapper.innerHTML += createTemplate(item, index)
        })
        todoItemElems = document.querySelectorAll('.todo-item')
    }
}

fillHtmlList()

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const completeTask = index => {
    tasks[index].completed = !tasks[index].completed
    if(tasks[index].completed){
        todoItemElems[index].classList.add('checked')
    }else{
        todoItemElems[index].classList.remove('checked')
    }
    updateLocal()
    fillHtmlList()
}


taskBtn.addEventListener('click', ()=>{
    if(tasktitle.value!=''){
        if(taskPriority.value==''){
            taskPriority.value=1
        }
        tasks.push(new Task(tasktitle.value, taskdesc.value, taskPriority.value ))
        updateLocal()
        fillHtmlList()
        tasktitle.value=''
        taskdesc.value=''
        taskPriority.value=''
    }else{
        errorMessage('Please write a title')
    }
})
const errorMessage = (txt) => {

    let message = document.querySelector('#message')
    message.style =`
                animation: opasityUp 1s ease-in-out;
        `
    message.innerHTML = txt
    setTimeout(()=>{
        message.style =`
                animation: opasity 1s ease-in-out;
        `
    }, 4000)

}
priorityBtn.addEventListener('click', ()=>{
   filterTasksByPriority()
    updateLocal()
    fillHtmlList()
})

const deleteTask = (index) => {

    todoItemElems[index].classList.add('deleted')
    setTimeout(()=>{
        tasks.splice(index,1)
        updateLocal()
        fillHtmlList()
    }, 500)
}
