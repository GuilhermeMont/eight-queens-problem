import React, {Component} from 'react'

class Queen extends Component {

    render() {

        let queen = this.props.queen ? <span key={Math.random()} className={'queen'}>Q</span> : null;

        let style = this.props.even ? 'cell even' : 'cell odd';

        style = this.props.marked ? style +' marked' : style;

        return (
            <div key={this.props.id} className={style}>
                {queen}
            </div>
        )
    }
}


export default Queen;