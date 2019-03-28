import React from 'react';
import './index.css';

const Row = ({name, value, unit}) => (
    <div className="row">
        <div className={'col-1'}>{name}</div>
        <div className={'col-2 ' + (value > 0 ? 'green' : 'red')}>{(value > 0 ? '+' : '') + value + ' ' + unit}</div>
    </div>
);


class Table extends React.Component {
    render() {
        const rows = this.props.data.map((d) => <Row {...d} unit={ this.props.unit }/>);

        return (
            <div className="table">
                <div className="body">
                    {rows}
                </div>
            </div>
        );

    }
}

export default Table;
