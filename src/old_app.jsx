import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

import './App.css';
//import { TaskList } from './pages/TaskList';
import {Info} from './components/Info'
import {Button} from './components/Button'
import {Recipe} from './components/Recipe'

// const initializeAssistant = (getState/*: any*/) => {
//   if (process.env.NODE_ENV === "development") {
//     return createSmartappDebugger({
//       token: process.env.REACT_APP_TOKEN ?? "",
//       initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
//       getState,
//     });
//   }
//   return createAssistant({getState});
// };

// функция для инстанцирования объекта сберассистента
const initializeAssistant = (getState /*: any*/, getRecoveryState) => {
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? '',
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,                                           
      // getRecoveryState: getState,                                           
      nativePanel: {
        defaultText: 'ччччччч',
        screenshotMode: false,
        tabIndex: -1,
    },
    });
  } else {
  return createAssistant({ getState });
  }
};

// мейн класс 
export class App extends React.Component {
  // конструктор заполнит поля нашего App и что-то кинет ассисненту?
  constructor(props) {
    super(props);
    console.log('constructor');

    this.state = {
      recipe: undefined, // зарезервированная строка + число
      button_text: undefined, // подсказка на кнопке
      rand_number: undefined,
      error: undefined
    };

    // this.state = {
    //   notes: [{ id: Math.random().toString(36).substring(7), title: 'тест' }],
    //   message: ''
    // };

    this.assistant = initializeAssistant(() => this.getStateForAssistant());

    // при получении данных что-то делает
    this.assistant.on('data', (event /*: any*/) => {
      console.log(`assistant.on(data)`, event);
      if (event.type === 'character') {
        console.log(`assistant.on(data): character: "${event?.character?.id}"`);
      } else if (event.type === 'insets') {
        console.log(`assistant.on(data): insets`);
      } else {
        const { action } = event;
        this.dispatchAssistantAction(action);
      }
    });

    // обрабатывает старт
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

  getNumber = async (e) => {
    e.preventDefault();

  }

  // async позволяет не обновлять страничку после запросов
  getCalendar = async (e) => {
      // отменяет стандартное поведение (перезагрузку)
      e.preventDefault();
      var cal = "gregorian";
      var year = 2024;
      var month = 6;
      // var day = 2; 
      // ссылка на поле в другом компоненте
      const day = e.target.elements.day.value;
      
      if (day) {
          const api_url = await fetch(`https://orthocal.info/api/${cal}/${year}/${month}/${day}/`);
          const data = await api_url.json();
          console.log(data);
          // присваиваем значения полям
          this.setState({
              fast_exception_desc: data.fast_exception_desc,
              fast_level: data.fast_level,
              fast_level_desc: data.fast_level_desc,
              error: undefined
          });
      }
      else {
          this.setState({
              fast_exception_desc: undefined,
              fast_level: undefined,
              fast_level_desc: undefined,
              error: "day was not set"
          });
      }
  }

  // хз
  componentDidMount() {
    console.log('componentDidMount');
  }

  // возвращает состояние ассистента (не нужен?)
  // надо ли поменять слова??
  getStateForAssistant() {
    console.log('getStateForAssistant: this.state:', this.state);
    const state = {
      item_selector: {
        items: this.state.notes.map(({ id, title }, index) => ({
          number: index + 1,
          id,
          title,
        })),
        ignored_words: [
          'добавить','установить','запиши','поставь','закинь','напомнить', // addNote.sc
          'удалить', 'удали',  // deleteNote.sc
          'выполни', 'выполнил', 'сделал' // выполнил|сделал
        ],
      },
    };
    console.log('getStateForAssistant: state:', state);
    return state;
  }

  // формирует состояние ассистента для отправки на бэк
  dispatchAssistantAction(action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'show_recipe':
          return this.show_recipe(action);

        // case 'show_info':
        //   return this.show_info(action);

        default:
          throw new Error();
      }
    }
  }

  show_recipe(action) {
    console.log("show_message", action);
    this.setState({
      message: action.message
    });
  }

  // show_info(action) {
  //   console.log('add_note', action);
  //   this.setState({
  //     notes: [
  //       ...this.state.notes,
  //       {
  //         id: Math.random().toString(36).substring(7),
  //         title: action.note,
  //         completed: false,
  //       },
  //     ],
  //   });
  // }

  // done_note(action) {
  //   console.log('done_note', action);
  //   this.setState({
  //     notes: this.state.notes.map((note) =>
  //       note.id === action.id ? { ...note, completed: !note.completed } : note
  //     ),
  //   });
  // }

  // _send_action_value(action_id, value) {
  //   const data = {
  //     action: {
  //       action_id: action_id,
  //       parameters: {
  //         // значение поля parameters может быть любым, но должно соответствовать серверной логике
  //         value: value, // см.файл src/sc/noteDone.sc смартаппа в Studio Code
  //       },
  //     },
  //   };
  //   const unsubscribe = this.assistant.sendData(data, (data) => {
  //     // функция, вызываемая, если на sendData() был отправлен ответ
  //     const { type, payload } = data;
  //     console.log('sendData onData:', type, payload);
  //     unsubscribe();
  //   });
  // }

  // play_done_note(id) {
  //   const completed = this.state.notes.find(({ id }) => id)?.completed;
  //   if (!completed) {
  //     const texts = ['Молодец!', 'Красавчик!', 'Супер!'];
  //     const idx = (Math.random() * texts.length) | 0;
  //     this._send_action_value('done', texts[idx]);
  //   }
  // }

  // delete_note(action) {
  //   console.log('delete_note', action);
  //   this.setState({
  //     notes: this.state.notes.filter(({ id }) => id !== action.id),
  //   });
  // }

  render() {
    console.log("render");
    return (
      // <div className="wrapper"> - подключение стиля из App.css
      <>
        <Info />
        <Recipe getNumber={this.getNumber}/>
        <Button />
      </>
    )
  }

  // render() {
  //   console.log('render');
  //   return (
  //     <>
  //      <div>{this.state.message}</div>
  //       <TaskList
  //         items={this.state.notes}
  //         onAdd={(note) => {
  //           this.add_note({ type: 'add_note', note });
  //         }}
  //         onDone={(note) => {
  //           this.play_done_note(note.id);
  //           this.done_note({ type: 'done_note', id: note.id });
  //         }}
  //       />
  //     </>
  //   );
  // }
}
