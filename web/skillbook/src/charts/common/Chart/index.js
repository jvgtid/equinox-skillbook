import React from 'react';
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { max } from 'd3-array';
import './index.css';
import { color } from "d3-color";

////////////////////////////////        CONSTANTS DEFINITION        ////////////////////////////////
// General constants
const TOOLTIP_ACTIVE_OPACITY = 0.9;
const DEFAULT_COLORS = [
    '#00AAEE',
    '#00EEAA',
    '#EEAA00',
    '#AA00EE',
    '#EE00AA'
];

// Optional properties constants
const DEFAULT_ANIMATION_DURATION = 1700;
const DEFAULT_FONT_SIZE = 13;

// Classes
const CLASS_CONTAINER = 'Chart_container';
const CLASS_TOOLTIP = 'Chart_tooltip';
const CLASS_TOOLTIP_PEAK = 'Chart_tooltipPeak';
const CLASS_TOOLTIP_TEXT = 'Chart_tooltipText';
const CLASS_POINTER = 'Chart_pointer';
const CLASS_LEGEND_ELEMENT = 'legendEl';
////////////////////////////////////////////////////////////////////////////////////////////////////


class Chart extends React.Component {
    animationTime = this.props.disableAnimations ? 0 : this.props.animationTime;
    colors = this.props.customColors.map(el => color(el));
    shouldUpdateChart = false;
    formattedData = null;
    g = null;
    tooltip = null;
    formatNumber = format('.3~s');
    legendDomain = null;
    legendElementsDefaultOpacity = 1;
    initializing = 0;
    updateTimeout = -1;

    componentDidMount() {
        this._initializeChart();
    }

    /**
     * Compares last props with next props to determine if:
     *   - component should not update: the props are equal.
     *   - chart should update: only the data is different.
     *   - chart should be recreated: there are more differences.
     */
    shouldComponentUpdate(nextProps) {
        const tempActProps = JSON.parse(JSON.stringify(this.props));
        const tempNextProps = JSON.parse(JSON.stringify(nextProps));

        const differentData = JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data);

        delete tempActProps.data; delete tempNextProps.data;
        const sameRemainProps = JSON.stringify(tempActProps) === JSON.stringify(tempNextProps);

        const shouldUpdateComponent = !(!differentData && sameRemainProps);
        this.shouldUpdateChart = differentData && sameRemainProps;

        return shouldUpdateComponent;
    }

    /**
     * Decides whether to update or recreate the chart, depending on 'updateChart' flag.
     */
    componentDidUpdate() {
        this.shouldUpdateChart
            ? this._updateChart()
            : this._initializeChart();
    }

    /**
     * Removes previous chart and tooltip
     */
    _cleanChart() {
        select(this.node).selectAll('*').remove();
        select(this.node.parentNode).select('div').remove();
    }

    _updateChart() {
        if (this.initializing !== 0) {
            clearTimeout(this.updateTimeout);
            const elapsedTime = new Date().getTime() - this.initializing;
            const remainingTime = this.animationTime - elapsedTime;
            if (remainingTime > 0) {
                this.updateTimeout = setTimeout(() => {
                    this.initializing = 0;
                    this._updateChart();
                }, remainingTime);
            }
        } else {
            this.formatData();
            this.tooltip.transition().call(this._updates.updateTooltip);

            if (this.props.showLegend) {
                this._create.createLegend();
                this._updates.updateLegend();
            }

            this.updateChart();
        }
    }
    updateChart() {}

    _initializeChart() {
        // Sets initializing variable to true and sets a timer to reset the variable after teh start
        // animation.
        this.initializing = new Date().getTime();
        setTimeout(() => { this.initializing = 0; }, this.props.animationTime + 1);

        const { margin, showLegend } = this.props;

        this._cleanChart();
        this.formatData();

        this.g = select(this.node).append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Tooltip definition
        this.tooltip = select(this.node.parentNode).append('div')
            .classed(CLASS_TOOLTIP, true);
        this.tooltip.append('div')
            .classed(CLASS_TOOLTIP_PEAK, true);
        this.tooltipContent = this.tooltip.append('div');
        this.tooltipContent.append('div')
            .classed(CLASS_TOOLTIP_TEXT, true)
            .style('font-size', `${this.props.fontSize}px`);

        if (showLegend) {
            this.legendActWidth = 0;
            this._legendUtilities.getLegendWidth();
        }

        this.initializeChart();

        // LEGEND
        if (showLegend) {
            this._create.createLegend();
        }

        this.postInitializeChart();
    }
    initializeChart() {};
    postInitializeChart() {};

    _create = {
        /**
         * Creates a line with the class and points passed through parameter.
         */
        addLine: (className, x1, x2, y1, y2) => (
            this.g.append('line')
                .classed(className, true)
                .attr('x1', x1)
                .attr('x2', x2)
                .attr('y1', y1)
                .attr('y2', y2)
        ),
        createLegend: () => {
            const self = this;
            const domain = this.legendDomain.filter((el, pos) => this.legendDomain.indexOf(el) === pos);

            this.legendEls = this.g.selectAll('.legend')
                .data(domain);
            this.legendEls
                .enter().append('g')
                .classed(CLASS_POINTER, this.props.onLegendClick !== null)
                .on('mouseenter', this._events.legendEnter)
                .on('mouseleave', this._events.legendLeave)
                .each(function(d) {
                    self._events.addEventIfExist(this, 'click', self.props.onLegendClick, d);
                })
                .attr('pointer-events', 'none')
                .call(this.props.horizontalLegend
                    ? this._create.onCreateLegendHorizontal
                    : this._create.onCreateLegend)
                .call(this._animations.initializeLegend);
        },
        onCreateLegend: el => {
            el.classed('legend', true)
                .classed(CLASS_LEGEND_ELEMENT, true)
                .attr('transform', (d, i) => (`translate(-18,${i*20})`))
                .style('opacity',0);
            el.append('rect')
                .attr('x', this.props.width - this.props.margin.left - 14)
                .attr('width', 14)
                .attr('height', 14)
                .style('fill', d => this.colorScale(d));
            el.append('rect')
                .attr('x', this.props.width - this.legendWidth)
                .attr('width', this.legendWidth)
                .attr('height', 20)
                .attr('transform', 'translate(0,-3)')
                .style('fill', 'transparent');
            el.append('text')
                .attr('x', this.props.width - this.props.margin.left - 24)
                .attr('y', 6)
                .attr('dy', '.35em')
                .style('text-anchor', 'end')
                .style('font-size', `${this.props.fontSize}px`)
                .text(d => d);
        },
        onCreateLegendHorizontal: el => {
            el.classed('legend', true)
                .classed(CLASS_LEGEND_ELEMENT, true)
                .attr('transform', (d, i) => {
                    const actlegendWidth = this._legendUtilities.getLabelWidth(d) + 40;
                    this.legendActWidth += actlegendWidth;
                    const x = this.props.width - this.props.margin.left - this.legendActWidth - 40;
                    const y = this.props.height - this.props.margin.top - 15;
                    return `translate(${x},${y})`;
                })
                .style('opacity',0);
            el.append('circle')
                .classed('legendElement', true)
                .attr('cx', () => 0)
                .attr('cy', 7)
                .attr('r', 7)
                .style('fill', d => this.colorScale(d));
            el.append('rect')
                .attr('x', 0)
                .attr('width', d => this._legendUtilities.getLabelWidth(d) + 40)
                .attr('height', 20)
                .attr('transform', 'translate(0,-3)')
                .style('fill', 'transparent');
            el.append('text')
                .attr('x', 15)
                .attr('y', 6)
                .attr('dy', '.35em')
                .style('text-anchor', 'start')
                .style('font-size', `${this.props.fontSize}px`)
                .text(d => d);
        }
    };

    legendActWidth = 0;

    _updates = {
        updateTooltip: el => {
            el.duration(this.props.disableAnimations === true ? 0 : 100)
                .style('opacity', 0)
        },
        onUpdateLegend: el => {
            this.legendEls.exit().remove();

            el.select('.legendElement')
                .call(this._animations.updateLegendRect);
            el.select('text')
                .call(this._animations.updateLegendText);
        },
        updateLegend: () => {
            this.g.selectAll('.legend')
                .call(this._updates.onUpdateLegend);

            this._legendUtilities.getLegendWidth();
        }
    };

    _legendUtilities = {
        getLegendWidth: () => {
            const mx = this.legendDomain
                .filter(el => el.length === max(this.legendDomain, el => el.length))[0];
            select(this.node).append('g').classed('tempLabel', true).append('text').text(mx);
            const dims = select('.tempLabel').node().getBoundingClientRect();
            select('.tempLabel').remove();

            this.legendWidth = dims.width + 24 + 10;
            this.legendHeight = (dims.height + 24) * this.legendDomain.filter((el, pos) => this.legendDomain.indexOf(el) === pos).length;

            if (this.props.horizontalLegend) {
                this.legendWidth = 0;
                this.legendheight = 75;
            }
        },
        getLabelWidth: (text) => {
            const el = select(this.node).append('g').classed('tempLabel', true)
                .append('text').text(text);
            el.style('text-anchor', 'start')
                .style('font-size', `${this.props.fontSize}px`);
            const dims = select('.tempLabel').node().getBoundingClientRect();
            select('.tempLabel').remove();

            return dims.width;
        },
        addElementToLegend: (value, color) => {
            const self = this;
            const newLegendElement = this.g.append('g');

            newLegendElement.classed('newElementLegend', true)
                .classed(CLASS_LEGEND_ELEMENT, true)
                .datum(value)
                .on('mouseenter', this._events.legendEnter)
                .on('mouseleave', this._events.legendLeave)
                .each(function(d) {
                    self._events.addEventIfExist(this, 'click', self.props.onLegendClick, d);
                })
                .attr('transform', () => {
                    const actlegendWidth = this._legendUtilities.getLabelWidth(value) + 40;
                    this.legendActWidth += actlegendWidth;
                    const x = this.props.width - this.props.margin.left - this.legendActWidth - 40;

                    const y = this.props.height - this.props.margin.top - 15;
                    return `translate(${x},${y})`;
                })
                .style('opacity',0);
            newLegendElement.append('circle')
                .attr('cx', () => 0)
                .attr('cy', 7)
                .attr('r', 7)
                .style('fill', color);
            newLegendElement.append('rect')
                .attr('x', 0)
                .attr('width', this._legendUtilities.getLabelWidth(value) + 40)
                .attr('height', 20)
                .attr('transform', 'translate(0,-3)')
                .style('fill', 'transparent');
            newLegendElement.append('text')
                .attr('x', 15)
                .attr('y', 6)
                .attr('dy', '.35em')
                .style('text-anchor', 'start')
                .style('font-size', `${this.props.fontSize}px`)
                .text(value);

            newLegendElement.call(this._animations.initializeLegend);
        }
    };
    _tooltipUtilities = {
        showTooltip: (d, value, innerLeft, innerTop) => {
            const { dataUnit, margin, hideTooltip, customTooltip } = this.props;

            // Sets position and text
            if (customTooltip === null) {
                const tooltipText = this.formatNumber(value) + ' ' + dataUnit;
                this.tooltipContent.select(`.${CLASS_TOOLTIP_TEXT}`).html(tooltipText);
            } else {
                const _customTooltip = customTooltip(d, dataUnit);
                this.tooltipContent.html(ReactDOMServer.renderToString(_customTooltip));
            }

            const tooltipContainer = this.tooltip.node().getBoundingClientRect();
            const [tooltipWidth, tooltipHeight] = [tooltipContainer.width, tooltipContainer.height];
            const tooltipLeft = innerLeft + margin.left - tooltipWidth / 2;
            const tooltipTop = innerTop + margin.top - tooltipHeight - 10;

            if (!hideTooltip) {
                this.tooltip
                    .style('left', (tooltipLeft) + 'px')
                    .style('top', (tooltipTop) + 'px')
                    .style('opacity', TOOLTIP_ACTIVE_OPACITY);
            }
        },
        hideTooltip: () => {
            this.tooltip.style('opacity', 0);
        }
    };

    _events = {
        legendEnter: (key) => {
            select(this.node)
                .selectAll(`.${this.mainElementsClass}`).transition().duration(200)
                .style('opacity', el => el.key === key ? 0.8 : 0.2);

            select(this.node)
                .selectAll(`.${CLASS_LEGEND_ELEMENT}`).transition().duration(200)
                .style('opacity', el => el === key ? 1 : 0.2);
        },
        legendLeave: () => {
            select(this.node)
                .selectAll(`.${this.mainElementsClass}`).transition().duration(200)
                .style('opacity', this.legendElementsDefaultOpacity);

            select(this.node)
                .selectAll(`.${CLASS_LEGEND_ELEMENT}`).transition().duration(200)
                .style('opacity', 1);
        },
        addEventIfExist: (element, eventName, eventFunc, d) => {
            const self = this;
            if (eventFunc) {
                select(element).on(eventName, function (d) {
                    eventFunc(d, self.props.dataUnit);
                })
            }
        }
    };

    generateRandomId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

    _animations = {
        default: transition(this.generateRandomId).duration(this.animationTime),
        update: transition(this.generateRandomId).duration(this.animationTime && 400),
        updateLegend: transition(this.generateRandomId).duration(this.animationTime && 300),
        pointerEventsNone: transition(this.generateRandomId).duration(0).style('pointer-events', 'none'),
        pointerEventsAll: transition(this.generateRandomId).duration(0).style('pointer-events', 'all'),
        initializeLegend: el => (
            el.transition().duration(this.animationTime)
                .style('opacity','1')
            .transition().duration(0).attr('pointer-events', 'all')
        ),
        updateLegendRect: el => (
            el.transition().duration(this.animationTime && 400)
                .style('fill', d => this.colorScale(d))
        ),
        updateLegendText: el => (
            el.transition().duration(this.animationTime && 400)
                .text(d => d)
        ),
    };

    render() {
        return (
            <div className={CLASS_CONTAINER}>
                <svg
                    height={this.props.height}
                    ref={node => this.node = node}
                    width={this.props.width}
                />
            </div>
        );
    }
}

Chart.propTypes = {
    animationTime: PropTypes.number.isRequired,
    customColors: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    customTooltip: PropTypes.func,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.number,
            values: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string,
                value: PropTypes.number,
            }))
        }).isRequired
    ).isRequired,
    dataUnit: PropTypes.string.isRequired,
    disableAnimations: PropTypes.bool.isRequired,
    height: PropTypes.number.isRequired,
    hideTooltip: PropTypes.bool.isRequired,
    margin: PropTypes.shape({
        top: PropTypes.number.isRequired,
        right: PropTypes.number.isRequired,
        bottom: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired,
    }).isRequired,
    onMouseClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseMove: PropTypes.func,
    onLegendClick: PropTypes.func,
    showLegend: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired,
    fontSize: PropTypes.number.isRequired
};

Chart.defaultProps = {
    animationTime: DEFAULT_ANIMATION_DURATION,
    customColors: DEFAULT_COLORS,
    customTooltip: null,
    disableAnimations: false,
    hideTooltip: false,
    onMouseClick: null,
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMouseMove: null,
    onLegendClick: null,
    showLegend: false,
    horizontalLegend: false,
    fontSize: DEFAULT_FONT_SIZE
};

export default Chart;
