import React, {useState, useEffect} from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'
import './index.css'

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('a new note...')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
  
    const hook = ()=> {
      noteService.getAll().then(initialNotes => {
        console.log('promise fufilled')
        setNotes(initialNotes)
      })
    }

    useEffect(hook, [])
    console.log('redner', notes.length, 'notes')

    const addNote = (event) => {
        event.preventDefault()
        console.log('button clicked', event.target)

        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() < 0.5,
            id: notes.length + 1
        }


        noteService.create(noteObject).then(returnNote => {
          console.log(returnNote)
          setNotes(notes.concat(noteObject))
          setNewNote('')
        })
    }


    const handleNoteChange = (event) => {
        console.log(event.target.value)
        setNewNote(event.target.value)
    }

    const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

    const toggleImportance = (id) => {
      console.log('importance of ' + id + 'needs to be toggled')
      const note = notes.find(n => n.id === id)
      const changeNote = { ...note, important: !note.important }
      noteService.update(id, changeNote).then(returnNote => {
        setNotes(notes.map(note=> note.id !== id ? note : returnNote))
      }).catch(error => {
        setErrorMessage(`the note ${note.content} was already deleted from server`)
        setTimeout(()=>{
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
    }

    return (
      <div>
        <h1>Notes</h1>
        <Notification message={errorMessage} />
        <div>
            <button onClick={()=>setShowAll(!showAll)}>
                show {showAll ? 'important' : 'all'}
            </button>
        </div>
        <ul>
          {
            notesToShow.map(note => <Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)} />)
          }
        </ul>

        <form onSubmit={addNote}>
            <input value={newNote} onChange={handleNoteChange}/>
            <button type="submit">save</button>
        </form>
        <Footer />
      </div>
    )
}

export default App