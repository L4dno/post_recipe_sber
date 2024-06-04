import React from "react";

export class Button extends React.Component {
    render(){
        return (
            // поле для ввода от пользователя
            // при клике вызовем метод
            <Button onClick={this.props.getNumber} text="Нажми меня" />
        )
    }
}