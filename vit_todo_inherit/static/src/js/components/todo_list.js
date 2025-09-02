/** @odoo-module */

import {Component,onWillStart,useState,useRef} from "@odoo/owl";
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

        this.searchInput = useRef('search-input')

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

    async toggleTask(e,task){
        await this.orm.write(this.model,[task.id],{is_completed:e.target.checked })
    }
    
    async updateColor(e,task){
        await this.orm.write(this.model,[task.id],{color:e.target.value })
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
        this.state.task={
            name: '',
            color: '#FF0000',
            is_completed: false,
            description: ''

        }

    }
    
    async searchTask(){
        const text = this.searchInput.el.value 
        this.state.taskList = await this.orm.searchRead(this.model,[['name','ilike',text]])
    }
    
    async deleteTask(task){
        if (confirm("Are you sute to delete this task?")){
            await this.orm.unlink(this.model,[task.id])
            await this.fetchAllTasks()
        }

    }
}

registry.category('actions').add('vit_todo_inherit.action_todo_js',TodoList);