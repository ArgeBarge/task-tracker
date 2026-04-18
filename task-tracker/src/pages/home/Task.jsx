import dayjs from 'dayjs'
import userImage from '../../assets/images/User_01.png'
import clockImage from '../../assets/images/Clock.png'
import completedUserImage from '../../assets/images/User_Check.png'
import editPencil from '../../assets/images/Edit_Pencil_01.png'
import deleteIcon from '../../assets/images/Trash_Full.png'
import checkImage from '../../assets/images/Check.png'
import circleImage from '../../assets/images/Circle.png'
import usersImage from '../../assets/images/Users_Group.png'
import axios from 'axios'
import { useAuth } from '../../AuthContext'
import { useState } from 'react'


export function Task({ taskId, name, creator, expiryDate, completed, loadTaskData, defaultEdit, assignees }) {

    const [ toggleEdit, setToggleEdit ] = useState(defaultEdit ? true : false);
    const [ timeInput, setTimeInput] = useState(expiryDate ? dayjs(expiryDate).format("HH:mm") : dayjs().format("HH:mm"));
    const [ dateInput, setDateInput ] = useState(expiryDate ? dayjs(expiryDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"));
    const [ titleInput, setTitleInput ] = useState(name ? name : "New Task")
    const [ completedToggle, setCompletedToggle ] = useState(completed ? true : false)

    const { user } = useAuth();
    const handleOnComplete = async () => {

        if(!completedToggle)
        {
            console.log(user)
            console.log(taskId)
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
        console.log("i ran")
        if(toggleEdit)
        {
            await axios.patch(`/api/tasks/${taskId}`, {
                "expiryDate": dateInput + " " + timeInput,
                "taskName": titleInput
            })
        }

        await loadTaskData();
        setToggleEdit(!toggleEdit)
        console.log(dateInput)
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

    const expiryDays = dayjs(expiryDate).diff(dayjs(), 'day')

    console.log("taskName " + name + " assignees " + assignees)
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
                        {assignees && assignees.map((asignee) => {
                            console.log("hello" + asignee)
                            return (
                                asignee.id ? asignee.name + ", " : "None"
                            )
                            
                        })}
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