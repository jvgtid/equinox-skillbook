import Chart from '../common/Chart';
import PropTypes from 'prop-types';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { easeExp, easeBackOut } from 'd3-ease';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { color as d3color } from 'd3-color';
import './index.css';

////////////////////////////////        CONSTANTS DEFINITION        ////////////////////////////////
// General constants
const MARGIN_LEFT_AXIS = 90;
const MARGIN_BOTTOM_AXIS = 30;
const MARGIN_END = 40;
const TOOLTIP_TOP_MARGIN = 30;
const PADDING_TICK = 13;
const WIDTH_Y_AXIS = 60;
const DEFAULT_BAR_WIDTH_INCREMENT = 0.1;
const ANIMATION_DURATION_Y_AXIS = 700;
const ANIMATION_DURATION_BAR_BOUNCE = 200;
const ANIMATION_DURATION_LINE_OPACITY = 300;
const DEFAULT_BRIGHTER_VALUE = 0.4;
const DEFAULT_PADDING_BETWEEN_MULTIBARS = 0.1;
const DEFAULT_GROUP = 'default';
const TICK_SIZE = 12;

// Optional properties constants
export const SIZE_BIG = 'sizeBig';
export const SIZE_MEDIUM = 'sizeMedium';
export const SIZE_SMALL = 'sizeSmall';
const SIZES_MAPPER = {
    sizeSmall: 0.4,
    sizeMedium: 0.8,
    sizeBig: 1
};

const DEFAULT_N_LABELS = 10;

// Classes
const CLASS_Y_AXIS = 'LucaBarChart_yAxis';
const CLASS_X_AXIS = 'LucaBarChart_xAxis';
const CLASS_BARS_GROUP = 'LucaBarChart_groupContainer';
const CLASS_BAR_GROUP = 'LucaBarChart_barContainer';
const CLASS_BAR = 'LucaBarChart_bar';
const CLASS_POINTER = 'LucaBarChart_pointer';
const CLASS_BAR_LINE = 'LucaBarChart_barLine';
const CLASS_AXIS_LINE = 'BarChart_axisLine';
////////////////////////////////////////////////////////////////////////////////////////////////////


class BarChart extends Chart {
    group_containers = null;
    bar_containers = null;
    innerHeight = null;
    innerWidth = null;
    rectWidth = null;
    rectWidthIncremental = null;
    colorScale = null;
    xScale0 = null;
    xScale1 = null;
    xAxis = null;
    xAxisEle = null;
    yScale = null;
    yAxis = null;
    yAxisEle = null;
    barNameDomain = null;

    mainElementsClass = CLASS_BAR;

    /**
     * Formats data to follow the multibar chart format.
     */
    formatData = () => {
        this.formattedData = this.props.data.map(el => ({...el}));

        if (this.props.multibar) {
            this.formattedData = this.props.data.map(el => {
                let parents = {...el};
                parents.values = el.values.map(el => {
                    let childs = {...el};
                    childs.color = el.name;
                    childs.group = el.name;
                    childs.key = el.name;
                    return childs;
                });
                return parents;
            });
        } else {
            this.colors = [this.colors[0]];
            this.formattedData = this.props.data.map(el => {
                let childs = {...el};
                childs.values = [{
                    name: DEFAULT_GROUP,
                    group: DEFAULT_GROUP,
                    color: el.name,
                    value: el.value
                }];
                return childs;
            });
        }

        // Modify 'name' values to fit the custom length defined by labelLength property
        if (this.props.labelLength) {
            this.formattedData.map(el => {
                el.name = el.name.slice(0, this.props.labelLength);
                return el;
            });
        }

        // Updates the domain of the bars
        this.legendDomain = this.formattedData[0].values.map(el => el.name);
        this.barNameDomain = this.legendDomain;
    };


    updateChart() {
        select(this.node).selectAll(`.${CLASS_BAR_LINE}`).style('opacity', 0);

        this.updates.updateAxis();
        this.createRects();
        this.updates.updateRects();
    }

    initializeChart() {
        const margin = { ...this.props.margin };
        const {
            width, height, barSize, customBarSize, multibarPadding, nLabels, hideLeftAxis,
            yAxisMargin, endMargin, showLegend
        } = this.props;

        //----------------------------------------------------------------------------------------//
        //---                     INITIALIZATION: dimensions, margins...                       ---//
        //----------------------------------------------------------------------------------------//

        if (showLegend) {
            margin.right = max([margin.right, this.legendWidth + 52]);
        }

        this.innerWidth = width - margin.left - margin.right;
        this.innerHeight = height - margin.top - margin.bottom;
        const marginEnd = endMargin ? endMargin : MARGIN_END;
        let marginLeftAxis = yAxisMargin ? yAxisMargin : MARGIN_END;
        marginLeftAxis = !hideLeftAxis ? marginLeftAxis : marginEnd;


        //----------------------------------------------------------------------------------------//
        //---                                 SCALES AND AXIS                                  ---//
        //----------------------------------------------------------------------------------------//


        this.colorScale = scaleOrdinal()
            .domain(this.barNameDomain)
            .range(this.colors);

        // X AXIS
        this.xScale0 = scaleBand()
            .range([WIDTH_Y_AXIS + marginLeftAxis, this.innerWidth - marginEnd])
            .paddingInner(getInnerPadding());
        this.xScale1 = scaleBand()
            .padding(multibarPadding);
        this.xAxis = axisBottom(this.xScale0)
            .tickPadding(15)
            .tickSize(0);
        this.xAxisEle = this.g.append('g')
            .classed(CLASS_X_AXIS, true)
            .attr('transform', `translate(0,${this.innerHeight - MARGIN_BOTTOM_AXIS})`);

        // Y AXIS
        const nTicks = nLabels;
        this.yScale = scaleLinear()
            .range([this.innerHeight - MARGIN_BOTTOM_AXIS, TOOLTIP_TOP_MARGIN])
            .nice();
        this.yAxis = axisLeft(this.yScale)
            .ticks(nTicks)
            .tickFormat(el => this.formatNumber(el));
        this.yAxisEle = this.g.append('g')
            .classed(CLASS_Y_AXIS, true);
        this.updates.updateAxis();

        // Translate texts and remove non-necessary paths and initial label
        this.yAxisEle.selectAll('.tick line')
            .transition().duration(400).attr('x2', this.innerWidth);
        this.yAxisEle.select('path').remove();
        this.yAxisEle.select('text').remove();
        this.xAxisEle.select('path').remove();
        this.xAxisEle.selectAll('text').transition().duration(400).attr('dy', 5);


        //----------------------------------------------------------------------------------------//
        //---                              CHART SHAPES (bars)                                 ---//
        //----------------------------------------------------------------------------------------//

        this.createRects();

        // SIDE LINES
        this._create.addLine(CLASS_AXIS_LINE, WIDTH_Y_AXIS, WIDTH_Y_AXIS, 0, this.innerHeight - MARGIN_BOTTOM_AXIS + TICK_SIZE);
        this._create.addLine(CLASS_AXIS_LINE, this.innerWidth, this.innerWidth, this.innerHeight - MARGIN_BOTTOM_AXIS,
            this.innerHeight - MARGIN_BOTTOM_AXIS + TICK_SIZE);
        this._create.addLine(CLASS_AXIS_LINE, WIDTH_Y_AXIS, this.innerWidth, this.innerHeight - MARGIN_BOTTOM_AXIS,
            this.innerHeight - MARGIN_BOTTOM_AXIS);


        // Animations
        select(`.${CLASS_Y_AXIS}`).selectAll('.tick')
            .call(this.animations.initializeYAxis);

        // Hide Y axis label texts
        if (hideLeftAxis) {
            select(`.${CLASS_Y_AXIS}`).selectAll('text').style('opacity', 0);
        }

        //----------------------------------------------------------------------------------------//
        //---                                 AUX FUNCTIONS                                    ---//
        //----------------------------------------------------------------------------------------//

        /**
         * Get the padding between bars
         */
        function getInnerPadding() {
            let paddingInner = 1 - SIZES_MAPPER[barSize];
            if (customBarSize) {
                paddingInner = 1 - customBarSize;
            }

            return paddingInner;
        }
    }

    getBarColor(barId) {
        const { selectedBarsIds, selectedBarsColor } = this.props;
        if (selectedBarsIds.indexOf(barId) >= 0 && selectedBarsColor) {
            return d3color(selectedBarsColor);
        } else {
            return this.colorScale(barId)
        }
    }

    createRects = () => {
        const self = this;

        // bar width and bar width after animation
        this.rectWidth = this.xScale1.bandwidth();
        this.rectWidthIncremental = this.rectWidth * DEFAULT_BAR_WIDTH_INCREMENT;

        this.group_containers = this.g.selectAll('g.' + CLASS_BARS_GROUP)
            .data(this.formattedData);
        this.bar_containers = this.group_containers.enter().append('g')
                .classed(CLASS_BARS_GROUP, true)
                .attr('transform',d => (`translate(${this.xScale0(d.name)},0)`));

        this.group_containers.exit().remove();

        const rects = this.g.selectAll(`g.${CLASS_BARS_GROUP}`)
            .selectAll(`g.${CLASS_BAR_GROUP}`)
            .data(d => d.values);
        rects.exit().remove();

        const newRects = rects.enter()
            .append('g')
            .classed(CLASS_BAR_GROUP, true);
        newRects.append('rect')
            .classed(CLASS_BAR, true)
            .classed(CLASS_POINTER, this.props.onMouseClick !== null)
            .attr('id', d => `${d.color}_barchart`)
            .attr('x', d => this.xScale1(d.group))
            .attr('height', 0)
            .attr('y', this.innerHeight - MARGIN_BOTTOM_AXIS)
            .attr('width', this.rectWidth)
            .attr('fill', d => this.getBarColor(d.color))
            .on('click', this.props.onMouseClick)
            .on('mouseenter', function(d) {self.events.onBarEnter(d, this)})
            .on('mouseleave', function(d) {self.events.onBarLeave(d, this)})
            .on('mousemove', function() {});
        newRects.insert('line', 'rect')
            .attr('class', (d) => (`${CLASS_BAR_LINE} ` + d.group))
            .attr('x1', d => self.xScale1(d.group))
            .attr('x2', function() {
                const parentD = select(this.parentNode.parentNode).datum();
                return -self.xScale0(parentD.name) + WIDTH_Y_AXIS;
            })
            .attr('y1', d => this.yScale(d.value))
            .attr('y2', d => this.yScale(d.value));

        // Animations
        newRects.selectAll('rect').style('pointer-events', 'none')
            .transition()
                .call(this.animations.initializeBars)
            .transition()
                .style('pointer-events', 'all');
    };

    updates = {
        updateAxis: () => {
            let dataMax = max(this.formattedData, d => max(d.values, dd => dd.value));

            this.xScale0.domain(this.formattedData.map(d => d.name));
            this.xScale1.domain(this.barNameDomain).rangeRound([0, this.xScale0.bandwidth()]);

            this.xAxisEle.transition().duration(400).call(this.xAxis);

            const tickPadding = this.xScale0.bandwidth() / 2 + (this.xScale0.step() -
                this.xScale0.bandwidth()) / 2;

            this.xAxisEle.selectAll('.tick line')
                .attr('x1', tickPadding)
                .attr('x2', tickPadding)
                .attr('y1', TICK_SIZE)
                .attr('transition', `translate(${this.xScale0.bandwidth()},0)`);

            this.xAxisEle.selectAll('.tick:last-of-type line').attr('y1', 0);

            this.yScale.domain([0, dataMax]);
            this.yAxisEle.transition().duration(400).call(this.yAxis);

            this.yAxisEle.selectAll('.tick line').call(this.animations.updateYAxisLine);
            this.yAxisEle.select('path').remove();

            this.yAxisEle.selectAll('.tick line')
                .attr('x1', WIDTH_Y_AXIS);

            this.yAxisEle.selectAll('.tick text')
                .attr('transform', `translate(${WIDTH_Y_AXIS},${PADDING_TICK})`);

            this.g.selectAll('.tick text')
                .style('font-size', `${this.props.fontSize}px`);
        },
        updateRects: () => {
            const self = this;

            this.group_containers
                .selectAll(`g.${CLASS_BAR_GROUP}`)
                .data(d => d.values).enter();
            const barGroups = this.group_containers
                .selectAll(`g.${CLASS_BAR_GROUP}`);

            this.group_containers.call(this.animations.updateGroups);
            barGroups.select('rect')
                .transition().call(function(el) {
                    return self.animations.updateRects(el, self);
                });
            barGroups.select('line').call(this.animations.updateLines);
        }
    };

    events = {
        /**
         * Shows the tooltip after entering a bar.
         */
        onBarEnter: (d, rect) => {
            const {dataUnit, hideLeftAxis, onMouseEnter} = this.props;

            const parentD = select(rect.parentNode.parentNode).datum();

            const tooltipInnerLeft = this.xScale0(parentD.name) + this.xScale1(d.group) +
                this.rectWidth / 2;
            const tooltipInnerTop =this.yScale(d.value);
            this._tooltipUtilities.showTooltip(d, d.value, tooltipInnerLeft, tooltipInnerTop);

            // Animate the bars (bounce out effect on the bars width)
            select(rect)
                .attr('fill', this.getBarColor(d.color).brighter(DEFAULT_BRIGHTER_VALUE))
                .transition().call(this.animations.enterBar);

            if (!hideLeftAxis) {
                select(rect.parentNode).select('line')
                    .transition().call(this.animations.enterBarShowLabel);
            }

            onMouseEnter(d, dataUnit);
        },
        /**
         * Hides the tooltip after leaving a bar.
         */
        onBarLeave: (d, rect) => {
            // pointer-events = none dispatchs onBarLeave on each update, this check prevents this
            // for happening.
            if (select(rect).style('pointer-events') !== 'none') {
                this._tooltipUtilities.hideTooltip();

                select(rect)
                    .attr('fill', this.getBarColor(d.color))
                    .transition().call(this.animations.leaveBar);

                select(rect.parentNode).select('line')
                    .transition().call(this.animations.leaveBarLine);

                this.props.onMouseLeave(d, this.props.dataUnit);
            }
        }
    };

    animations = {
        initializeBars: el => (
            el.duration(this.animationTime)
                .ease(easeExp)
                .attr('height', d => this.innerHeight - MARGIN_BOTTOM_AXIS - this.yScale(d.value))
                .attr('y', d => this.yScale(d.value))
        ),
        initializeYAxis: el => (
            el.transition()
                .duration(ANIMATION_DURATION_Y_AXIS)
                .style('opacity', 1)
        ),
        initializeLegend: el => (
            el.duration(this.animationTime === 0 ? 0 : 300)
                .delay((d, i) => (this.animationTime === 0 ? 0 : this.animationTime/2 + 100 * i))
                .style('opacity','1')
        ),
        updateGroups: el => (
            el.transition().duration(400)
                .attr('transform',(d) => (`translate(${this.xScale0(d.name)},0)`))
        ),
        updateRects: (el, self) => (
            el.duration(0).style('pointer-events', 'none')
                .transition()
                    .duration(this.props.disableAnimations ? 0 : 400)
                    .attr('id', d => `${d.color}_barchart`)
                    .attr('x', d => this.xScale1(d.group))
                    .attr('height', d => this.innerHeight - MARGIN_BOTTOM_AXIS - this.yScale(d.value))
                    .attr('y', d => this.yScale(d.value))
                    .attr('width', this.rectWidth)
                    .attr('fill', function(d) {
                        return self.getBarColor(d.color);
                    })
                .transition().duration(0).style('pointer-events', 'all')
        ),
        updateLines: el => {
            const self = this;
            el.transition().duration(400)
                .attr('x1', d => this.xScale1(d.group))
                .attr('x2', function () {
                    const parentD = select(this.parentNode.parentNode).datum();
                    return -self.xScale0(parentD.name) + WIDTH_Y_AXIS;
                })
                .attr('y1', d => this.yScale(d.value))
                .attr('y2', d => this.yScale(d.value))
        },
        updateYAxisLine: el => (
            el.transition().duration(400)
                .attr('x2', this.innerWidth)
        ),
        updateTooltip: el => (
            el.duration(this.props.disableAnimations === true ? 0 : 100)
                .style('opacity', 0)
        ),
        enterBar: el => (
            el.duration(this.props.disableAnimations === true ? 0 : 200)
                .ease(easeBackOut)
                .attr('x', d => this.xScale1(d.group) - this.rectWidthIncremental / 2)
                .attr('width', this.rectWidth + this.rectWidthIncremental)
        ),
        enterBarShowLabel: el => (
            el.duration(this.props.disableAnimations === true ? 0 : 300)
                .style('opacity', 1)
        ),
        leaveBar: el => (
            el.duration(ANIMATION_DURATION_BAR_BOUNCE)
                .ease(easeBackOut)
                .attr('x', d => this.xScale1(d.group))
                .attr('width', this.rectWidth)
        ),
        leaveBarLine: el => (
            el.duration(ANIMATION_DURATION_LINE_OPACITY)
                .style('opacity', 0)
        ),
    };
}

const propTypes = {
    barSize: PropTypes.string.isRequired,
    customBarSize: PropTypes.number,
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
    endMargin: PropTypes.number,
    hideLeftAxis: PropTypes.bool.isRequired,
    labelLength: PropTypes.number,
    multibarPadding: PropTypes.number.isRequired,
    nLabels: PropTypes.number.isRequired,
    yAxisMargin: PropTypes.number,
    selectedBarsIds: PropTypes.arrayOf(PropTypes.string),
    selectedBarsColor: PropTypes.string
};

const defaultTypes = {
    barSize: SIZE_MEDIUM,
    customBarSize: null,
    endMargin: null,
    hideLeftAxis: false,
    labelLength: null,
    multibar: false,
    multibarPadding: DEFAULT_PADDING_BETWEEN_MULTIBARS,
    nLabels: DEFAULT_N_LABELS,
    showLegend: false,
    yAxisMargin: null,
    selectedBarsIds: [],
    selectedBarsColor: null
};

BarChart.propTypes = {...Chart.propTypes, ...propTypes};
BarChart.defaultProps = {...Chart.defaultProps, ...defaultTypes};

export default BarChart;
