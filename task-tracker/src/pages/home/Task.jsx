import dayjs from 'dayjs'
import userImage from '../../assets/images/User_01.png'
import clockImage from '../../assets/images/Clock.png'
import completedUserImage from '../../assets/images/User_Check.png'
import editPencil from '../../assets/images/Edit_Pencil_01.png'
import deleteIcon from '../../assets/images/Trash_Full.png'
import checkImage from '../../assets/images/Check.png'
import circleImage from '../../assets/images/Circle.png'
import usersImage from '../../assets/images/Users_Group.png'
import closeImage from '../../assets/images/Close_LG.png'
import addImage from '../../assets/images/Add_Plus.png'

import axios from 'axios'
import { useAuth } from '../../AuthContext'
import { useState } from 'react'


export function Task({ taskId, name, creator, expiryDate, completed, loadTaskData, defaultEdit, assignees }) {

    const [ toggleEdit, setToggleEdit ] = useState(defaultEdit ? true : false);
    const [ timeInput, setTimeInput] = useState(expiryDate ? dayjs(expiryDate).format("HH:mm") : dayjs().format("HH:mm"));
    const [ dateInput, setDateInput ] = useState(expiryDate ? dayjs(expiryDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"));
    const [ titleInput, setTitleInput ] = useState(name ? name : "New Task")
    const [ completedToggle, setCompletedToggle ] = useState(completed ? true : false)
    const [assigneeList, setAssigneeList] = useState(new Map())

    const { user } = useAuth();

    const getPossibleAssignees = async () => {
        const response = await axios.get("/api/users")
        return response.data
    }
    const handleOnComplete = async () => {

        if(!completedToggle)
        {
            await axios.patch(`/api/tasks/${Number(taskId)}`, {
                "completedUserId": user.id
            })
            setCompletedToggle(true)
        }
        else {
            await axios.patch(`/api/tasks/${taskId}`, {
                "completedUserId": null
            })
            setCompletedToggle(false)
        }
        

        await loadTaskData();
    }

    const handleEditOnClick = async () => {
        if(toggleEdit)
        {
            await axios.patch(`/api/tasks/${taskId}`, {
                "expiryDate": dateInput + " " + timeInput,
                "taskName": titleInput
            })
        } else {
            const possibleAssignees = await getPossibleAssignees();
            let newMap = new Map(possibleAssignees.map((assignee) => {
                return [assignee.username, false]
            }))

            console.log("assignees before going to function", assignees)
            for(let i = 0; i < assignees.length; i++) {
                if(assignees[i].name)
                    newMap.set(assignees[i].name, true)
            }

            setAssigneeList(newMap);
            for (const x of assigneeList) {
                console.log(x + "\n")
            }
            console.log("finish assignee list")
        }

        

        await loadTaskData();
        setToggleEdit(!toggleEdit)
    }

    const handleDeleteOnClick = async () => {
        await axios.delete(`/api/tasks/${taskId}`)
        await loadTaskData();
    }

    function handleOnChangeTime(event) {
        setTimeInput(event.target.value)
    }

    function handleOnChangeDate(event) {
        setDateInput(event.target.value)
    }

    function handleOnChangeTitle(event) {
        setTitleInput(event.target.value)
    }

    function handleAddAsigneeOnClick(event) {

    }

    const expiryDays = dayjs(expiryDate).diff(dayjs(), 'day')

    return (
        <div className="task-container">
            <div className='task-name-container'>
                <h3>
                    {toggleEdit ? 
                        <input type="text" value={titleInput} onChange={handleOnChangeTitle}></input> : name
                    }
                </h3>
            </div>
            <div className="task-contents-container">
                
                <div className='task-information-container'>
                    
                    <div className="task-user-container">
                        <img className='task-user-image' src={userImage}></img> {creator}
                    </div>
        
                    <div className="task-expiry-container">
                        
                        <img className='task-clock-image' src={clockImage}></img> 
                        {!toggleEdit ? 
                            (
                                <>
                                    {dayjs(expiryDate).format("HH:mm on DD/MM/YYYY ")} 
                                    ({Number(expiryDays) > 0 ? expiryDays + " Days" : "Due"})
                                </>
                            ) 
                            : 
                            <>
                                <input type="time" value={timeInput} onChange={handleOnChangeTime}></input> on 
                                <input type="date" value={dateInput} onChange={handleOnChangeDate}></input> 
                            </>
                        }
                    </div>

                    <div className="task-assign-container">
                        <img className="task-assign-image" src={usersImage}>
                        </img>
                        {!toggleEdit ? (assignees && assignees.map((asignee) => {
                            return (
                                asignee.id ? asignee.name + ", " : "None"
                            )
                            
                        })) : 
                            assigneeList.entries().map((buttonAssignee) => {
                                return (
                                    <button className="edit-assignee-button">
                                        {buttonAssignee[0]}
                                        <img className="edit-assignee-image" src={buttonAssignee[1] ? closeImage : addImage}></img>
                                    </button>
                                )
                            })
                        }
                        
                        
                    </div>

                    {completedToggle ?
                        <div className="task-completed-container">
                            <img
                                className="task-completed-image"
                                src={completedUserImage}>
                            </img>

                            {completed}

                        </div> :
                        <div className='task-in-progress-container'>
                            <img
                                className='task-in-progress-image'
                                src={circleImage}
                            >
                            </img>
                            In progress
                        </div>
                    }
                </div>

                <div className='task-modify-container' style={{display: (user.username!==creator && 'none')}}>
                    <div>
                        <button className='edit-button' onClick={handleEditOnClick}>
                            <img className="edit-button-image" src={editPencil}>
                            </img>
                            edit
                        </button>
                    </div>
                    <div>
                        <button className='delete-button' onClick={handleDeleteOnClick}>
                            <img className="delete-button-image" src={deleteIcon}>
                            </img>
                            delete
                        </button>
                    </div>
                </div>
            </div>
            
            <button 
                className='task-complete-button' 
                onClick={handleOnComplete}
            >
                {completedToggle ? 
                    <>Completed <img className="completed-image" src={checkImage}></img></> : 
                    "Mark as completed"
                }
            </button>

            
            
        </div>
    )
}