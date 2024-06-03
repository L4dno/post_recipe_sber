import React from "react";

export class Button extends React.Component {
    render(){
        return (
            // поле для ввода от пользователя
            // при клике вызовем метод
            <form onSubmit={this.props.curCalendar}>
                <input type="text" name="day" placeholder="день"/>
                <button>Получить сегодняшнюю информацию</button>
            </form>
        )
    }
}