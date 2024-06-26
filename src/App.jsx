import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

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

const initializeAssistant = (getState /*: any*/, getRecoveryState) => {
    if (process.env.NODE_ENV === 'development') {
        return createSmartappDebugger({
            token: process.env.REACT_APP_TOKEN ?? '',
            initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
            getState,                                           
            // getRecoveryState: getState,                                           
            nativePanel: {
                defaultText: 'Новый рецепт',
                screenshotMode: false,
                tabIndex: -1,
            },
        });
    }
    else {
        return createAssistant({ getState });
    }
};


  export class App extends React.Component {

    constructor(props) {
      super(props);
      console.log('constructor');
  
      this.state = {
        recipe: "init string"
      };
  
      this.assistant = initializeAssistant(() => this.getStateForAssistant());
      this.get_recipe = this.get_recipe.bind(this);
  
      this.assistant.on('data', (event /*: any*/) => {
        console.log(`assistant.on(data)`, event);
        if (event.type === 'character') {
          console.log(`assistant.on(data): character: "${event?.character?.id}"`);
        } else if (event.type === 'insets') {
          console.log(`assistant.on(data): insets`);
        } else {
          const { action } = event;
          // если приходящий от ассистента ивент отличен от первых двух
          // то выполняем его отдельно
          this.dispatchAssistantAction(action);
        }
      });
  
      // инициализация при старте приложения
      this.assistant.on('start', (event) => {
        let initialData = this.assistant.getInitialData();
  
        console.log(`assistant.on(start)`, event, initialData);
      });
  
      this.assistant.on('command', (event) => {
        console.log(`assistant.on(command)`, event);
      });
  
      this.assistant.on('error', (event) => {
        console.log(`assistant.on(error)`, event);
      });
  
      this.assistant.on('tts', (event) => {
        console.log(`assistant.on(tts)`, event);
      });
    }
  
    // метод вызываемый после монтирования (рендера)
    componentDidMount() {
      console.log('componentDidMount');
      
    }
  
    // инициализация объекта типа AssistantAppState
    // хранит данные, которые нужны в бэке для принятия решения
    // дает два лога
    getStateForAssistant() {
      console.log('getStateForAssistant: this.state:', this.state);
      const state = {
        // сопоставляет голосовые команды и действия в приложении
        item_selector: {
          // массив соответствий команд и действий 
          //(number-номер в массиве, id - строка-айди, title - слово-активатор для действия)
          // нам не нужно по идее
          // items: this.state.notes.map(({ id, title }, index) => ({
          //   number: index + 1,
          //   id,
          //   title,
          // })),
          // слова, определенные в сценариях
          ignored_words: [
            'показать', 'создать', 'сделать', 'сгенерировать', 'обновить'
          ],
        },
      };
      console.log('getStateForAssistant: state:', state);
      return state;
    }
  
    // выполнение действия по команде
    dispatchAssistantAction(action) {
      console.log('dispatchAssistantAction', action);
      if (action) {
        switch (action.type) {
          case 'new_recipe':
            this.setState({ recipe: action.recipe });
            console.log('returned text', this.state.recipe);
            break;
  
          default:
            throw new Error("this is no such code on front");
        }
      }
    }
  
   
    // отправка данных на бэк (название и параметр)
    _send_action_value(action_id, value) {
      console.log('send_action', action_id,value);
      // тип AssistantServerAction
      const data = {
        action: {
          action_id: action_id
          //parameters: {
            // значение поля parameters может быть любым, но должно соответствовать серверной логике
          //  value: value, // см.файл src/sc/noteDone.sc смартаппа в Studio Code
          //},
        },
      };
      // в unsubsribe записана функция, которую вернет ассистент
      // вторым аргументом идет лямбда
      const unsubscribe = this.assistant.sendData(data, (data) => {
        // функция, вызываемая, если на sendData() был отправлен ответ
        console.log('sendData onData: data:', data);      
  
        // в data помещается ответ и данные с бэка в payload?
        const { type, payload } = data;
        
        // вернем число
        unsubscribe();
        //console.log('sendData onData:', type, payload);
        //return payload;
      });
    }
  
    get_recipe() {
      console.log('get_recipe');
      
      //const tmp = this._send_action_value('gen', 'message from front method gen');
      this._send_action_value('done', 'message from front method to debug');
      
    }
  
  // нужно заменить на рендер компонент
    render() {
      console.log('render');
      return (
        <>
          <div>{this.state.recipe}</div>
          <button type="submit" onClick={this.get_recipe}>тык</button>
        </>
      )
    }
  
  }



export default App
