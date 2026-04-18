import { TasksList } from "./TasksList";
import "./HomePage.css"
import { useEffect } from "react";
import { Header } from "../../components/Header";
import addImage from '../../assets/images/Add_Plus.png'
import { CreateTask } from "./CreateTask";
import { useState } from "react";
import axios from 'axios';
import { useAuth } from "../../AuthContext";
export function HomePage({tasks, loadTaskData}) {

    const [toggleAddTask, setToggleAddTask] = useState(false);
    const { user } = useAuth();

    const handleAddTaskClick = async () => {

        await axios.post('/api/tasks', {
            "userId": user.id,
            "taskName": null,
            "expiryDate": null
        })

        await loadTaskData()
        setToggleAddTask(false)
    }

    useEffect(() => {
        async function asyncLoadTaskData() {
            await loadTaskData()

        }

        asyncLoadTaskData();
    }, [])
    return (
        <>
            <title>Home Page!</title>
            <Header/>

            <div className="create-task-overlay" style={{display: !toggleAddTask && "none"}}>
                <CreateTask setToggleAddTask={setToggleAddTask} loadTaskData={loadTaskData}/>
            </div>
            <div className="home-page">
                <TasksList type="current" data={tasks.currentTasks} newTasks={tasks.newTasks} loadTaskData={loadTaskData}/>
                <TasksList type="completed" data={tasks.completedTasks} loadTaskData={loadTaskData} />
                <TasksList type="expired" data={tasks.expiredTasks} loadTaskData={loadTaskData}/>
            </div>

            <div className="add-task-button-container">
                <button onClick={handleAddTaskClick}className="add-task-button">
                    add a task
                    <img className="add-task-image" src={addImage}></img>
                </button>
                
            </div>
            
        </>
    )
}