import React from 'react';
import './index.css';

////////////////////////////////        CONSTANTS DEFINITION        ////////////////////////////////
const CLASS_CHART_COMPONENT = 'dashboard-responsive-chart-component full-dimensions';
const CLASS_CHART_COMPONENT_CONTENT = 'dashboard-responsive-chart-component-content full-dimensions';
const CLASS_CHART_CONTAINER = 'dashboard-responsive-chart-component-res full-dimensions';

const EVENT_RESIZE = 'resize';
////////////////////////////////////////////////////////////////////////////////////////////////////


class ResponsiveChart extends React.Component {
    state = {
        width: null,
        height: null
    };

    /**
     * Updates dimensions and add on resize event listener
     */
    componentDidMount() {
        this.fitParentContainer();
        window.addEventListener(EVENT_RESIZE, this.fitParentContainer);
    }

    /**
     * Remove resize event listener before removing the component
     */
    componentWillUnmount() {
        window.removeEventListener(EVENT_RESIZE, this.fitParentContainer);
    }

    /**
     * Updates width and height values with the container ones.
     */
    fitParentContainer = () => {
        const width = this.state.width;
        const currentWidth = this.chartComponent.getBoundingClientRect().width;
        const currentHeight = this.chartComponent.getBoundingClientRect().height;

        // Values will be updated only if they are different than in previous state.
        const shouldResize = width !== currentWidth;

        if (shouldResize) {
            this.setState({
                width: currentWidth,
                height: currentHeight,
                chartKey: 'chartKey'
            });
        }
    };

    /**
     * Renders actual chart.
     */
    renderChart() {
        const parentWidth = this.state.width;
        const parentHeight = this.state.height;

        return (
            <this.props.Chart
                { ...this.props.otherProps }
                height={ parentHeight }
                width={ parentWidth }
                data={ this.props.data }
                onMouseClick={ this.props.onClickHandler }
            />
        );
    }

    render() {
        const { width } = this.state;
        const shouldRenderChart = width !== null;

        return (
            <div className={CLASS_CHART_COMPONENT}>
                <div className={CLASS_CHART_COMPONENT_CONTENT}>
                    <div
                        className={CLASS_CHART_CONTAINER}
                        ref={el => this.chartComponent = el}
                    >
                        {shouldRenderChart && this.renderChart()}
                    </div>
                </div>
            </div>
        );
    }
}

export default ResponsiveChart;
