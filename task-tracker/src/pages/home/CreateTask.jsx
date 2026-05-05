import { useState } from "react"
import axios from 'axios'
import { useAuth } from "../../AuthContext";

import closeImage from '../../assets/images/Close_LG.png'

export function CreateTask({setToggleAddTask, loadTaskData}) {

    const [inputTaskDate, setInputTaskDate] = useState();
    const [inputTaskTime, setInputTaskTime] = useState();
    const [inputTaskDescription, setInputTaskDescription] = useState("");
    const [asigneeList, setAsigneeList] = useState([])
    const [inputAsignee, setInputAsignee] = useState("")

    const { user } = useAuth();

    function handleDateChange(event) {
        setInputTaskDate(event.target.value)
    }

    function handleTimeChange(event) {
        setInputTaskTime(event.target.value)
    }

    function handleTaskDescriptionChange(event) {
        setInputTaskDescription(event.target.value)
    }

    function handleOnClickClose() {
        setToggleAddTask(false);
    }

    function handleAddAsignee() {
        setAsigneeList([...asigneeList, inputAsignee])
    }

    function handleAsigneeInputChange(event) {
        setInputAsignee(event.target.value)
    }

    const addTask = async () => {
        await axios.post('/api/tasks', {
            "userId": user.id,
            "taskName": inputTaskDescription,
            "expiryDate": inputTaskDate + " " + inputTaskTime
        })

        await loadTaskData()
        setToggleAddTask(false)
    }

    return (
        <div className="create-task-container">
            <button className="close-button" onClick={handleOnClickClose}>
                <img className="close-image"src={closeImage}></img>
            </button>
            <div className="create-task-header">
                <h3>Add a task</h3>
            </div>
            Task Description
            <div>
                <input value={inputTaskDescription} onChange={handleTaskDescriptionChange}></input>
            </div>
            
            Due Date and Time
            <div>
                <input type="date" value={inputTaskDate} onChange={handleDateChange}></input>
                <input type="time" value={inputTaskTime} onChange={handleTimeChange}></input>
            </div>

            Asignees
            <div>
                <input type="text" value={inputAsignee} onChange={handleAsigneeInputChange}></input>
                <button onClick={handleAddAsignee}>
                    Add
                </button>
            </div>
            <div>
                {asigneeList.map((asignee) => {
                    return (
                        asignee + ", "
                    )
                })}
            </div>
            
            <button onClick={addTask}>
                Submit
            </button>
            
        </div>
    )
}