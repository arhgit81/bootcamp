/** @odoo-module */

import {Component,onWillStart,useState} from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from '@web/core/utils/hooks';

export class TodoList extends Component {
    static template='vit_todo_inherit.todo_template';

    setup() {

        this.state = useState({
            taskList : [],
            task:{
                name:'',
                description:'',
                color:'',
                is_completed:false
            },
            activeId: null,
            isEdit:false
        })

        this.model ="vit.todo"
        this.orm = useService("orm")

        onWillStart(async ()=>{
            this.fetchAllTasks()
        } )

    }

    async fetchAllTasks(){
        console.log('Fetch All Tasks')
        this.state.taskList = await this.orm.searchRead(this.model,
            [],
            ["name","description","color","is_completed"])
        console.log(this.state.taskList)
    }

    toggleTask(){

    }

    updateColor(){

    }

    editTask(task){
        this.state.isEdit=true
        this.state.activeId = task.id
        this.state.task={
            name: task.name,
            color: task.color,
            is_completed: task.is_completed,
            description: task.description

        }

    }

    
    async saveTask(){
        if (this.state.isEdit)
            await this.orm.write(this.model,[this.state.activeId], this.state.task)
        else
            await this.orm.create(this.model,[this.state.task])

        await this.fetchAllTasks()
    }
    
    addTask(){
        this.state.activeId=false
        this.state.isEdit=false 

    }
    
    
    deleteTask(){

    }
}

registry.category('actions').add('vit_todo_inherit.action_todo_js',TodoList);