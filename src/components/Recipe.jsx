import React from "react";

export class Recipe extends React.Component {
    render(){
        return (
            <div>
                {/* вывод соо только после инициализации полей */}
                { this.props.error === "" &&
                    <div>
                        <p>Новое число: {this.props.rand_number}</p>
                    </div>
                }
                <p>{this.props.error}</p>
            </div>
        )
    }
}