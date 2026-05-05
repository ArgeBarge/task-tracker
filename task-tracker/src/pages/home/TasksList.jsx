import { Task } from "./Task";
import sliderImage from '../../assets/images/Slider_02.png'
import { useEffect, useRef } from "react";
export function TasksList({ type, data, loadTaskData, newTasks }) {

    const divRef = useRef(null);

    const colours = {
        current: "#FFD580",
        expired: "#F08080",
        completed: "#98D8AA"
    }

    useEffect(() => {
        divRef.current.scrollTo({
            top: divRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [newTasks])

    return (
        <div  className="task-list-container">
            <div className="task-list-header" 
                style={{borderColor: colours[type]}}
            >
                <div className="task-list-header-title">
                    {type === "current" ? 
                        <div className="list-title" style={{color: colours.current}}>
                            current tasks {data.length}
                        </div> : 
                    <></>}
                    {type === "completed" ? 
                    <   div className="list-title"style={{color: colours.completed}} >
                            completed tasks {data.length} 
                        </div> : 
                    <></>}
                    {type === "expired" ? 
                        <div className="list-title"style={{color: colours.expired}} >
                            expired tasks {data.length} 
                        </div> : 
                    <></>}
                </div>
                

                <button className="filter-button">
                    <img 
                        src={sliderImage}
                        className="filter-button-image"
                    >
                    </img>
                </button>

                
            </div>
            <div ref={divRef} className="task-list">
                
                {data.map((task) => {
                    console.log(task.ASIGNEES)
                    return (
                        <Task 
                            key={task.taskId} 
                            taskId={task.taskId} 
                            name={task.taskName} 
                            creator={task.creator_username}
                            assignees={task.ASIGNEES ?? null} 
                            expiryDate={task.expiryDate} 
                            completed={task.completer_username}
                            loadTaskData={loadTaskData}
                        />
                    )
                })}

                {
                    newTasks && newTasks.map((task) => {
                        return (
                            <Task 
                                key={task.taskId} 
                                taskId={task.taskId} 
                                name={task.taskName} 
                                creator={task.creator_username} 
                                expiryDate={task.expiryDate} 
                                completed={task.completer_username}
                                loadTaskData={loadTaskData}
                                defaultEdit={true}
                            />
                        )
                    })
                }
        
            </div>
        </div>
        
        
        
    )
        
}