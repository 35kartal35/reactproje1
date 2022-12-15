import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todolar, setTodolar] = useState(null)
  const [title, setTitle] = useState("")
  const [resalt, setResalt] = useState(false)
  const [resaltMessage, setResaltMessage] = useState("")

  const todoSil=(id)=>{
    axios.delete(`http://localhost:3004/todos/${id}`)
    .then((response)=>{
      setResalt(true)
      setResaltMessage("Silme işlemi başarili")
    })
    .catch((error)=>{
      setResalt(true)
      setResaltMessage("Silme işlemi esnasinda bir hata oldu")

    })
  }

  useEffect(() => {
    axios.get("http://localhost:3004/todos")
      .then((response) => {
        console.log(response.data)
        setTodolar(response.data);
              })
      .catch((error) => {
        console.log(error)
      });
  }, [resalt]);

  const formuDenetle = (event) => {
    event.preventDefault()
    //validation
    if (title === "") {
      alert("Yapilacak iş boş birakilamaz")
      return
    }
    //create and save todo
    const newTodo = {
      id: String(new Date().getTime()),
      title: title,
      date: new Date(),
      completed: false

    }

    axios.post("http://localhost:3004/todos", newTodo)
      .then((response) => {
        
        setTitle("");
        setResalt(true)
        setResaltMessage("Kayıt işlemi başarılı")

      })

      .catch((error) => {
        setResalt(true)
        setResaltMessage("Kaydederken bir hata oluştu")
      })

  }
  if (todolar === null) {
    return null
  }

  return (
    <div className="container">
      {resalt === true && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0,3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1
        }}>
          <div className="alert alert-success" role="alert">
            <p>{resaltMessage}</p>
            <div className="d-flex justify-content-center">
              <button onClick={() => setResalt(false)} className="btn btn-sm btn-outline-primary">Kapat</button>
            </div>
          </div>
        </div>
      )}
      <div className="row my-5">
        <form onSubmit={formuDenetle}>
          <div className="input-group mb-3">
            <input type="text"
              className="form-control"
              placeholder="Type your todo..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button
              className="btn btn-primary" type="submit">Add
            </button>
          </div>
        </form>
      </div>
      {todolar.map((todo) => (
        <div key={todo.id} className="alert alert-secondary d-flex justify-content-between align-items-center" role="alert">
          <div>
            <h1>{todo.title}</h1>
            <p>{new Date(todo.date).toLocaleString()}</p>
          </div>
          <div>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button type="button" class="btn btn-warning">Düzenle</button>
              <button onClick={()=>todoSil(todo.id)} type="button" class="btn btn-danger">Sil</button>
              <button type="button" class="btn btn-primary">
                {
                  todo.completed === true ? "Yapılmadı" : "Yapıldı" 
                }
              </button>
            </div>
          </div>
        </div>
      ))

      }
    </div>
  );
}

export default App;
