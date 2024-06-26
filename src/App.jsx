import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const date = new Date();

  let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

  return (
    <>
      <header>
        <div className="container">
        </div>
      </header>
      <section>
          <div className="container">
              <div className="sent">
                  <div className="row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                          <div className="card form text-bg-secondary mb-3">
                                <p>Текушая Дата: {`${day}-${month}-${year}`}</p>
                          </div>
                      </div>
                      <div claclassNamess="col-sm-6">
                          <div className="card text-bg-secondary mb-3">
                              <div className="card-header">Хедер</div>
                              <div className="card-body">
                                <h5 className="card-title">Secondary Заголовок карточки</h5>
                                <p className="card-text">Несколько быстрых примеров текста для построения на основе Заголовок карточки и составления основной части содержимого карточки.</p>
                              </div>
                          </div>
                      </div>
                    </div>
              </div>
              <div className="d-grid gap-2 col-6 mx-auto">
                  <button type="button" className="btn btn-secondary">Secondary</button>
              </div>
          </div>
      </section>
      <footer>

      </footer>
    </>
  )
}

export default App
