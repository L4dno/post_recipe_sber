import React from "react";

export class Recipe extends React.Component {
    render(){
        return (
            <div>
                {/* вывод соо только после инициализации полей */}
                { this.props.error === "" &&
                    <div>
                    <p>Исключения: {this.props.fast_exception_desc}</p>
                    </div>
                }
                <p>{this.props.error}</p>
            </div>
        )
    }
}