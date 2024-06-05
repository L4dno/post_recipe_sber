import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

import './App.css';

import {Info} from './components/Info'
import {Button} from './components/Button'
import {Recipe} from './components/Recipe'

export class App extends React.Component {
  constructor(props) {
    console.log('constructor');
    super(props);

    // Функция инициализации ассистента
    this.initialize = (getState, getRecoveryState) => {
      if (process.env.NODE_ENV === 'development') {
        // Инициализация ассистента для development среды
        return createSmartappDebugger({
          token: process.env.REACT_APP_TOKEN ?? '',
          initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
          getState,
          getRecoveryState: getState,
          nativePanel: {
            defaultText: 'Новый рецепт',
            screenshotMode: false,
            tabIndex: -1,
          },
        });
      } else {
        // Инициализация ассистента для production среды
        return createAssistant({ getState, getRecoveryState });
      }
    };

    this.state = {
        recipe: undefined, // зарезервированная строка + число
        button_text: undefined, // подсказка на кнопке
        rand_number: undefined,
        error: undefined
      };

    // Инициализация ассистента
    this.assistant = this.initialize(() => this.state, () => this.recoveryState);

    // Обработчик события 'data'
    this.assistant.on('data', (command) => {
        console.log(`assistant.on(data)`, command);
      if (command.navigation) {
        // Обработка навигационных команд ассистента
        switch (command.navigation.command) {
          case 'UP':
            window.scrollTo(0, 0);
            break;
          case 'DOWN':
            window.scrollTo(0, 1000);
            break;
          default:
            break;
        }
      }
    });
  }

  // Обработчик нажатия кнопки
  handleOnClick = () => {
    // Отправка сообщения ассистенту
    this.assistant.sendData({ action: { action_id: 'gen_number', parameters: { param: 7} } });
  };

  // Обработчик нажатия кнопки обновления
  handleOnRefreshClick = () => {
    // Отправка сообщения бэкенду с возможностью подписки на ответ
    const unsubscribe = this.assistant.sendAction(
      { action_id: 'some_action_name', parameters: { param: 'some' } },
      (data) => {
        // Обработка данных, переданных от бэкенда
        unsubscribe();
      },
      (error) => {
        // Обработка ошибки, переданной от бэкенда
      }
    );
  };

  render() {
    return (
      <div>
        {/* Кнопка */}
        <button onClick={this.handleOnClick}>Отправить сообщение ассистенту</button>
        
        {/* Кнопка обновления */}
        <button onClick={this.handleOnRefreshClick}>Отправить сообщение бэкенду</button>
      </div>
    );
  }
}

export default MyComponent;
