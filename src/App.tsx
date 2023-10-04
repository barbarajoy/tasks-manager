import { useState, useEffect, useRef, useMemo } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([])

  const [editTask, setEditTask] = useState({
    enabled: false,
    task: ''
  })

  useEffect(() => {
    const savedTasks = localStorage.getItem("@reactclass")

    if(savedTasks){
      setTasks(JSON.parse(savedTasks));
    }
  }, [])

  useEffect(() => {
    if(firstRender.current){
      firstRender.current = false;
      return;
    }

    localStorage.setItem("@reactclass", JSON.stringify(tasks))
  }, [tasks]);

  function handleRegister() {
    if(!input){
      alert("Write the name of your task")
      return;
    }
    if(editTask.enabled){
      handleSaveEdit();
      return;
    }

    setTasks(todos => [...todos, input])
    setInput("")
  }

  function handleSaveEdit(){
    const findIndexTask = tasks.findIndex(task => task === editTask.task);
    const allTasks = [...tasks];

    allTasks[findIndexTask] = input;
    setTasks(allTasks);

    setEditTask({
      enabled: false,
      task: ''
    })
    setInput("")
  }

  function handleDelete(item: string){
    const removeTask = tasks.filter( task => task !== item)
    setTasks(removeTask)
  }

  function handleEdit(item:string){
    inputRef.current?.focus();
    setInput(item)
    setEditTask({
      enabled: true,
      task: item
    })
  }

  const totalTasks = useMemo(() => {
    return tasks.length
  }, [tasks])

  return (
    <div className='container'>
      <h1>Tasks Manager</h1>

      <input
        placeholder="Type your task..."
        value={input}
        onChange={ (e) => setInput(e.target.value) }
        ref={inputRef}
      />

      <button className="button" onClick={handleRegister}>
        {editTask.enabled ? "Update task" : "Add task"}
      </button>

      <hr />

      <strong>You have {totalTasks} tasks!</strong>

    {tasks.map( (item, index) => (
      <section key={item} className='task'>
        <span>{item}</span>
        <button className='button-edit' onClick={ () => handleEdit(item) }>
          <FontAwesomeIcon icon={faEdit} style={{ color: '#000' }} />
        </button>

        <button className='button-delete'onClick={() => handleDelete(item) }>
          <FontAwesomeIcon icon={faTrash} style={{ color: '#000' }} />
        </button>
      </section>
    ))}

    </div>
  )
}
