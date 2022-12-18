import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todolar, setTodolar] = useState(null);
  const [title, setTitle] = useState("");
  const [resalt, setResalt] = useState(false);
  const [resaltMessage, setResaltMessage] = useState("");
  const [duzenlemeVarMi, setDuzenlemeVarMi] = useState(false);
  const [duzenlenecekTodo, setDuzenlenecekTodo] = useState(null)
  const [duzenlenecekTitle, setDuzenlenecekTitle] = useState("")


  const todoSil = (id) => {
    axios.delete(`http://localhost:3004/todos/${id}`)
      .then((response) => {
        setResalt(true)
        setResaltMessage("Silme işlemi başarili")
      })
      .catch((error) => {
        setResalt(true)
        setResaltMessage("Silme işlemi esnasinda bir hata oldu")

      })
  }
  const changeTodosCompleted = (todo) => {
    console.log(todo)
    const updatedTodo = {
      ...todo,
      completed: !todo.completed

    }
    axios.put(`http://localhost:3004/todos/${todo.id}`, updatedTodo)
      .then((response) => {
        setResalt(true)
        setResaltMessage("Todo başarıyla güncellendi")
      })
      .catch((error) => {
        setResalt(true)
        setResaltMessage("Todo güncellenirken bir hata oluştu")
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

  const todoGuncelleFormunuDenetle=(event)=>{
    event.preventDefault()
    if(duzenlenecekTitle===""){
      alert("Title boş bırakılamaz")
      return
    }
    const updatedTodo={
      ...duzenlenecekTodo,
      title: duzenlenecekTitle
    }

    axios.put(`http://localhost:3004/todos/${duzenlenecekTodo.id}`,updatedTodo)
    .then((response)=>{
      setResalt(true)
      setResaltMessage("Güncelleme işlemi başarılı")
      setDuzenlemeVarMi(false)
    })
    .catch((error)=>{
      setResalt(true)
      setResaltMessage("Güncelleme işlemi Esnasında bir hata oluştu")
    })
  }

   if (todolar === null){
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
            <input
              type="text"
              className="form-control"
              placeholder="Type your todo..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button
              className="btn btn-primary" type="submit">Ekle
            </button>
          </div>
        </form>
      </div>
      {duzenlemeVarMi === true && (
        <div className="row my-5">
          <form onSubmit={todoGuncelleFormunuDenetle}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="yapılacak işi girin..."
                value={duzenlenecekTitle}
                onChange={(event) =>setDuzenlenecekTitle(event.target.value)}
              />
              <button
                onClick={() => setDuzenlemeVarMi(false)}
                className="btn btn-danger"
              >
                Vazgeç
              </button>
              <button className="btn btn-primary" type="submit">
                Güncelle
              </button>
            </div>
          </form>
          </div>
        )}
          {todolar.map((todo) => (
            <div key={todo.id} className="alert alert-secondary d-flex justify-content-between align-items-center" role="alert">
              <div>
                <h1
                  style={{
                    textDecoration:
                      todo.completed === true ? "line-through" : "none",
                    color: todo.completed === true ? "red" : "blue"
                  }}>{todo.title}</h1>
                <p>{new Date(todo.date).toLocaleString()}</p>
              </div>
              <div>
                <div class="btn-group" role="group" aria-label="Basic example">
                  <button 
                  onClick={()=>{
                    setDuzenlemeVarMi(true);
                    setDuzenlenecekTodo(todo)
                    setDuzenlenecekTitle(todo.title)
                  }}
                  type="button" 
                  class="btn btn-warning">
                    Düzenle
                    </button>
                  <button onClick={() => todoSil(todo.id)} 
                  type="button" class="btn btn-danger">
                    Sil
                    </button>
                  <button onClick={() => changeTodosCompleted(todo)}
                    type="button"
                    class="btn btn-primary">
                    {todo.completed === true ? "Yapılmadı" : "Yapıldı"}
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
