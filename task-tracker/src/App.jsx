import { Routes, Route } from 'react-router'
import { HomePage } from './pages/home/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/login/LoginPage'
import { useState } from 'react'
import axios from 'axios'
import { AuthProvider } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'

function App() {
  
  const [currentTasks, setCurrentTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [expiredTasks, setExpiredTasks] = useState([])
  const [newTasks, setNewTasks] = useState([])

  const loadTaskData = async () => {
    try {
      let response;

      response = await axios.get("/api/tasks/all")
      setCurrentTasks(response.data.current_tasks)
      setExpiredTasks(response.data.expired_tasks)
      setCompletedTasks(response.data.completed_tasks)
      setNewTasks(response.data.new_tasks)
    } catch(error) {
      console.log(error)
    }
      
  }

  
  return (
    <AuthProvider>
      <Routes>
        <Route 
          index 
          element={
            <ProtectedRoute>
              <HomePage 
                loadTaskData={loadTaskData}
                tasks={{
                  currentTasks: currentTasks, 
                  completedTasks: completedTasks, 
                  expiredTasks: expiredTasks,
                  newTasks: newTasks
                }}
              />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/index" 
          element={
          <HomePage 
            tasks={{
              currentTasks: currentTasks, 
              completedTasks: completedTasks, 
              expiredTasks: expiredTasks,
              newTasks: newTasks
            }}
            />
          }
        />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </AuthProvider>
    
  )
}

export default App
