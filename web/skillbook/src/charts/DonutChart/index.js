import React from 'react';
import PropTypes from 'prop-types';
import { easeExp, easeBackOut, easeExpOut } from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import { format } from 'd3-format';
import { scaleOrdinal } from "d3-scale";
import { select, mouse } from "d3-selection";
import { arc, pie } from 'd3-shape';
import { legendColor } from 'd3-svg-legend';
import { transition } from 'd3-transition';
import { zoom, zoomTransform } from 'd3-zoom';
import './index.css';


////////////////////////////////        CONSTANTS DEFINITION        ////////////////////////////////
// General constants
const MIN_LATERAL_MARGIN = 20;
const OUTER_RADIUS_INCREMENT = 0.04;
const SPACE_BETWEEN_ARCS = 0.000;
const ROTATION_SPEED = -10;
const PADDING_WIDTH_LEGEND = 70;
const PADDING_HEIGHT_LEGEND = 20;
const LEGEND_TOP_MARGIN = 35;
const TOOLTIP_ACTIVE_OPACITY = 0.8;
const TOOLTIP_BOTTOM_MARGIN = 10;
const CENTER_TEXT_TITLE_SIZE = 0.25;
const CENTER_TEXT_BODY_SIZE = 0.15;
const CENTRAL_TEXT_ANIMATION_DURATION = 300;
const LABEL_RADIUS = 6;
const LABEL_OFFSET = 15;
const TWEEN_ANIMATION_DURATION = 200;

// Optional properties constants
export const SIZE_BIG = 'sizeBig';
export const SIZE_MEDIUM = 'sizeMedium';
export const SIZE_SMALL = 'sizeSmall';
const SIZES_MAPPER = {
    sizeSmall: 0.5,
    sizeMedium: 0.75,
    sizeBig: 1
};

const DEFAULT_THICKNESS = 0.16;
const DEFAULT_TRANSITION_DURATION = 1700;
const DEFAULT_COLORS = ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099"];

// Classes
const CLASS_CONTAINER = 'LucaDonutChart_container';
const CLASS_TOOLTIP = 'LucaDonutChart_tooltip';
const CLASS_TOOLTIP_TITLE = 'LucaDonutChart_tooltipTitle';
const CLASS_TOOLTIP_VALUE = 'LucaDonutChart_tooltipValue';
const CLASS_CENTRAL_TEXT = 'LucaDonutChart_centralText';
const CLASS_CENTRAL_TEXT_TITLE = CLASS_CENTRAL_TEXT + ' title';
const CLASS_CENTRAL_TEXT_BODY = CLASS_CENTRAL_TEXT + ' body';
const CLASS_LEGEND = 'LucaDonutChart_legend';
const CLASS_ARC = 'LucaDonutChart_arc';
const CLASS_POINTER = 'LucaDonutChart_pointer';
const CLASS_ARC_DISABLED = 'LucaDonutChart_arcDisabled';
const CLASS_BOLD = 'LucaDonutChart_bold';
const CLASS_THIN = 'LucaDonutChart_thin';
////////////////////////////////////////////////////////////////////////////////////////////////////

class DonutChart extends React.Component {
    tooltip = null;
    svg = null;
    shouldUpdateChart = null;
    g = null;
    legendEl = null;
    legendSequential = null;
    colorScale = null;
    pieEL = null;
    arcs = null;
    arcEl = null;
    radius = null;
    radiusIncrement = 0;
    diameterToDecrease = 0;
    arcThickness = null;
    center = null;
    legendWidth = 0;
    legendHeight = 0;
    tooltipAtCenter = this.props.tooltipAtCenter;

    componentDidMount() {
        this.initiallizeChart();
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

    componentDidUpdate() {
        this.shouldUpdateChart
            ? this.updateChart()
            : this.initiallizeChart();
    }

    /**
     * Removes previous chart and tooltip
     */
    cleanChart() {
        select(this.node).selectAll('*').remove();
        select(this.node.parentNode).select('div').remove();
    }

    updateChart() {
        this.createArcs();
        if (!this.props.hideLegend) {
            this.updates.updateLegend();
        }
        this.updates.updateArcs();
        this.calculateDimensions();
        this.centerChart();
        this.tooltip.transition().duration(100).style('opacity', 0);
    }

    initiallizeChart() {
        this.cleanChart();

        const { data, disableRotation, customColors, hideLegend } = this.props;
        // rotation prop depends on tooltipAtCenter prop.
        const rotationDisabled = disableRotation;

        const self = this;
        const node = this.node;


        //----------------------------------------------------------------------------------------//
        //---      INITIALIZATION: dimensions, margins, tooltip, main SVG, cental text...      ---//
        //----------------------------------------------------------------------------------------//

        // Tooltip definition
        this.tooltip = select(node.parentNode).append('div')
            .classed(CLASS_TOOLTIP, true);
        this.tooltip.append('div')
            .classed(CLASS_TOOLTIP_TITLE, true);
        this.tooltip.append('div')
            .classed(CLASS_TOOLTIP_VALUE, true);

        this.svg = select(node);
        this.g = this.svg.append('g');

        // Central text
        this.svg.append('text').classed(CLASS_CENTRAL_TEXT_TITLE, true);
        this.svg.append('text').classed(CLASS_CENTRAL_TEXT_BODY, true)
            .attr('dy', '1em');


        //----------------------------------------------------------------------------------------//
        //---                                     SCALES                                       ---//
        //----------------------------------------------------------------------------------------//

        this.colorScale = scaleOrdinal().range(customColors);

        
        //----------------------------------------------------------------------------------------//
        //---                                     LEGEND                                       ---//
        //----------------------------------------------------------------------------------------//

        this.legendEl = this.svg.append('g').attr('class', CLASS_LEGEND);

        if (!hideLegend) {
            // Legend must be created before the arcs, diameter depends on legend height. This will
            // create an invisible pie chart that will make possible to create a legend. After
            // creating the legend, the final donut chat will be created.
            this.g.selectAll('path').data(pie()(data)).enter().append('path')
                .attr('fill', (d, i) => this.colorScale(i));

            this.legendSequential = legendColor()
                .shape('circle')
                .shapeRadius(LABEL_RADIUS)
                .labelOffset(LABEL_OFFSET)
                .orient('vertical')
                .scale(this.colorScale);

            this.updates.updateLegend();

            // Highlights arc legend is pointing to
            this.legendEl.selectAll('g.cell')
                .on('mouseover', el => {
                    const arc = this.g
                        .selectAll(`.${CLASS_ARC}`).filter(arc => arc.data.name === el);
                    this.tooltipAtCenter = true;
                    this.events.arcEnter(arc.datum(), arc.node());
                })
                .on('mouseleave', el => {
                    const arc = this.g
                        .selectAll(`.${CLASS_ARC}`).filter(arc => arc.data.name === el);
                    this.events.arcLeave(arc.datum(), arc.node());
                    this.tooltipAtCenter = this.props.tooltipAtCenter;
                })
        }


        //----------------------------------------------------------------------------------------//
        //---                              CHART SHAPES (arcs)                                 ---//
        //----------------------------------------------------------------------------------------//

        // ARC DIMENSIONS
        this.calculateDimensions();

        // INNER CIRCLE (for rotation event)
        const gInnerCircle = this.g.append('circle')
            .attr('r', Math.max(0, this.radius - this.arcThickness))
            .attr('fill', 'transparent');

        this.centerChart();

        // DONUT CHART ARCS
        this.arcEl = arc()
            .innerRadius(this.radius - this.arcThickness)
            .outerRadius(this.radius);

        this.pieEL = pie()
            .value(d => (d.value))
            .sort(null);

        this.g.selectAll('path').remove();   // Removes hidden initial pie chart
        this.createArcs();


        //----------------------------------------------------------------------------------------//
        //---                                   ANIMATIONS                                     ---//
        //----------------------------------------------------------------------------------------//

        this.arcs.transition().call(this.animations.initializeArcs)
            .call(this.animations.enablePointerEvents);

        // ROTATION EFFECT
        let rotation = 0, lastZoomScale = 0;

        const zoomEl = zoom().on('zoom', zoomed);
        if (!rotationDisabled) {
            gInnerCircle.call(zoomEl).on('mousedown.zoom', null);
        }


        //----------------------------------------------------------------------------------------//
        //---                                 AUX FUNCTIONS                                    ---//
        //----------------------------------------------------------------------------------------//

        /**
         * Rotates the chart. Zoom direction determines the direction.
         */
        function zoomed() {
            // Rotation based on direction
            rotation += zoomTransform(gInnerCircle.node()).k > lastZoomScale
                ? ROTATION_SPEED
                : -ROTATION_SPEED;

            self.g.transition()
                .duration(1000)
                .ease(easeExpOut)
                .attr('transform', `translate(${self.center[0]},${self.center[1]})rotate(${rotation})`);
            lastZoomScale = zoomTransform(gInnerCircle.node()).k;
        }
    }

    createArcs = () => {
        const self = this;

        this.arcsP = this.g.selectAll('path')
            .data(this.pieEL(this.props.data));
        this.arcs = this.arcsP.enter()
            .append('path')
            .classed(CLASS_ARC, true)
            .classed(CLASS_POINTER, this.props.onMouseClick !== null)
            .style('pointer-events', 'none')
            .attr('d', this.arcEl)
            .attr('fill', (d, i) => self.colorScale(i))
            .on('click', this.props.onMouseClick)
            .on('mouseenter', function(d) {self.events.arcEnter(d, this)})
            .on('mouseleave', function(d) {self.events.arcLeave(d, this)})
            .on('mousemove', this.events.arcMove)
            .each(function(d) {
                this._current = self.setCurrent(d);
            });

        if (this.shouldUpdateChart) {
            this.arcs.each(function() {
                this._current = {
                    startAngle: 2 * Math.PI,
                    endAngle: 2 * Math.PI,
                    innerRadius: self.radius - self.arcThickness,
                    radius: self.radius
                };
            });
        }
    };

    getRadius = () => {
        const { width, height, margin, customSize } = this.props;

        let diameter = height - margin.top - margin.bottom - this.legendHeight - LEGEND_TOP_MARGIN;
        diameter = Math.min(diameter, width - 2 * MIN_LATERAL_MARGIN);

        // Size prop decreases the size
        this.diameterToDecrease = diameter * (1 - SIZES_MAPPER[this.props.size]);
        if (customSize !== null) {
            this.diameterToDecrease = diameter * (1 - customSize.outerRadius);
        }

        diameter -= this.diameterToDecrease;

        return diameter / 2;
    };

    calculateDimensions = () => {
        this.radius = this.getRadius();
        this.radiusIncrement = this.radius * OUTER_RADIUS_INCREMENT;

        this.radius -= this.radiusIncrement;

        this.arcThickness = this.radius * this.props.thickness;
        if (this.props.customSize !== null) {
            this.arcThickness = this.radius * (1 - this.props.customSize.innerRadius);
        }
        if (this.props.isPieChart) {
            this.arcThickness = this.radius;
        }
    };


    /**
     * Centers chart and center text (if any)
     */
    centerChart = () => {
        const {height, width, margin} = this.props;
        this.center = [width / 2, (height - margin.top - margin.bottom - this.legendHeight) / 2 +
            margin.top];

        this.g.transition().duration(400).attr('transform', `translate(${this.center[0]},${this.center[1]})`);

        if (this.props.customTextAtCenter !== null) {
            this.svg.selectAll(`.${CLASS_CENTRAL_TEXT}`)
                .attr('transform', `translate(${this.center[0]},${this.center[1]})`);
        }
    };

    /**
     * Defines the position of the legend elements.
     *
     * This emulates how flexbox works. If an element does not fit in a row, it will be
     * positioned on the next one.
     */
    formatLegend = () => {
        const self = this;
        let lastX = 0, lastY = 0;
        this.svg.selectAll('.cell')
            .attr('transform', function () {
                const end = lastX + this.getBBox().width;

                if (end >= self.props.width - 2 * PADDING_WIDTH_LEGEND) {
                    lastX = 0;
                    lastY += 1;
                }

                const xOff = lastX;
                const yOff = lastY * PADDING_HEIGHT_LEGEND - self.props.margin.bottom;

                lastX += this.getBBox().width + 12 + 15;
                return `translate(${xOff},${yOff})`;
            });
    };

    /**
     * Defines teh position of the legend.
     */
    positionateLegend = () =>{
        this.formatLegend();

        // Now we can get the legend dimensions and center it
        const legendDims = this.legendEl.node().getBoundingClientRect();
        this.legendWidth = legendDims.width;
        this.legendHeight = legendDims.height;
        const legendOffset = (this.props.width - 2 * PADDING_WIDTH_LEGEND - this.legendWidth) / 2;

        const lengendPos = [PADDING_WIDTH_LEGEND + legendOffset, this.props.height - this.legendHeight];
        this.legendEl.attr('transform', `translate(${lengendPos[0]},${lengendPos[1]})`);
    };

    setCurrent = d => {
        return {
            startAngle: d.startAngle,
            endAngle: d.endAngle,
            innerRadius: this.radius - this.arcThickness,
            radius: this.radius
        };
    };

    updates = {
        updateArcs: () => {
            const self = this;
            this.g.selectAll('.' + CLASS_ARC)
                .transition().duration(0).style('pointer-events', 'none')
                .transition().duration(400)
                .attrTween('d', function(d) {
                    const arcTween = self.arcTweens.updateArcEnter(d, this);
                    this._current = self.setCurrent(d);

                    return arcTween;
                })
                .transition().duration(0).style('pointer-events', 'all');

            this.g.selectAll('path').classed(CLASS_ARC_DISABLED, false);
            this.svg.selectAll('text.label').classed(CLASS_BOLD, false);
            this.svg.selectAll('text.label').classed(CLASS_THIN, false);

            this.arcsP.exit()
                .transition().duration(400)
                .attrTween('d', function(d) {
                    return self.arcTweens.updateArcExit(d, this);
                })
                .remove();
        },
        updateLegend: () => {
            this.legendSequential.labels(this.props.data.map(el => (el.name)));
            this.legendEl.call(this.legendSequential);
            this.legendEl.selectAll('g.cell')
                .data(this.props.data.map(el => (el.name)))
                .exit().remove();

            this.positionateLegend();
        }
    };

    events = {
        arcEnter: (d, arc) => {
            const { customTextAtCenter, dataUnit, customTooltipTitleFormat, disableHighlight,
                customTooltipBodyFormat, onlyShowTooltipBody, onMouseEnter } = this.props;
            const formatNumber = format('.3~s');

            // Shows the custom text at center
            if (customTextAtCenter !== null) {
                const customText = customTextAtCenter(d, dataUnit);
                this.svg.select(`.${CLASS_CENTRAL_TEXT}.title`)
                    .style('font-size', CENTER_TEXT_TITLE_SIZE * this.radius)
                    .html(customText[0])
                    .transition()
                    .call(this.animations.animationCentralTextEnter);
                if (customText.length > 1) {
                    this.svg.select(`.${CLASS_CENTRAL_TEXT}.body`)
                        .style('font-size', CENTER_TEXT_BODY_SIZE * this.radius)
                        .html(customText[1])
                        .transition()
                        .call(this.animations.animationCentralTextEnter);
                }
            }

            // Sets tooltip texts
            let title = customTooltipTitleFormat === null
                ? d.data.surname
                : customTooltipTitleFormat(d, dataUnit);
            let body = customTooltipBodyFormat === null
                ? formatNumber(d.data.value) + ' ' + dataUnit
                : customTooltipBodyFormat(d, dataUnit);

            this.tooltip.select(`.${CLASS_TOOLTIP_VALUE}`).html(body);
            if (!onlyShowTooltipBody) {
                this.tooltip.select(`.${CLASS_TOOLTIP_TITLE}`).html(title);
            }

            // Makes an out tween animations and highlights hovered arc over the rest
            if (!disableHighlight) {
                select(arc).transition()
                    .call(this.animations.animationArcHighlight);

                this.g.selectAll('path').classed(CLASS_ARC_DISABLED, true);
                select(arc).classed(CLASS_ARC_DISABLED, false);

                this.svg.selectAll('text.label').each(function (text) {
                    if (text === d.data.name)       {select(this).classed(CLASS_BOLD, true);}
                    else                            {select(this).classed(CLASS_THIN, true);}
                });
            }

            this.events.arcMove(d);
            onMouseEnter();
        },
        arcLeave: (d, arc) => {
            if (select(arc).style('pointer-events') !== 'none') {
                const { disableHighlight, customTextAtCenter, onMouseLeave } = this.props;
                this.tooltip.style('opacity', 0);

                // Removes highlight and makes an in tween animation
                if (!disableHighlight) {
                    select(arc).transition()
                        .call(this.animations.animationOutArcHighlight);

                    this.g.selectAll('path').classed(CLASS_ARC_DISABLED, false);

                    this.svg.selectAll('text.label').classed(CLASS_BOLD, false);
                    this.svg.selectAll('text.label').classed(CLASS_THIN, false);
                }

                // Hides text at center (if any)
                if (customTextAtCenter !== null) {
                    this.svg.selectAll(`.${CLASS_CENTRAL_TEXT}`)
                        .transition()
                        .call(this.animations.animationOutCentralTextEnter);
                }

                onMouseLeave();
            }
        },
        arcMove: (d) => {
            const { hideTooltip, width, onMouseMove } = this.props;

            // Sets tooltip position and visibility
            if (!hideTooltip) {
                const tooltipDims = this.tooltip.node().getBoundingClientRect();
                const tooltipWidth = tooltipDims.width;
                const tooltipHeight = tooltipDims.height;
                let tooltipTop, tooltipLeft;

                if (this.tooltipAtCenter) {
                    const centroid = this.arcEl.centroid(d);

                    tooltipLeft = width / 2 + centroid[0] - tooltipWidth / 2;
                    tooltipTop = centroid[1] + this.center[1] - tooltipHeight;
                } else {
                    const mouseEl = mouse(this.svg.node()).map(d => parseInt(d, 10));

                    tooltipLeft = mouseEl[0] - tooltipWidth / 2;
                    tooltipTop = mouseEl[1] - tooltipHeight - TOOLTIP_BOTTOM_MARGIN;
                }

                this.tooltip
                    .style('left', (tooltipLeft) + 'px')
                    .style('top', (tooltipTop) + 'px')
                    .style('opacity', TOOLTIP_ACTIVE_OPACITY);
            }

            onMouseMove();
        }
    };

    /**
     * Generates an arc interpolator from initial state (s_*) to final state (e_*)
     */
    arcTweenGenerator = (
        initialStartAngle, initialEndAngle, initialInnerRadius, initialOuterRadius,
        finalStartAngle, finalEndAngle, finalInnerRadius, finalOuterRadius) =>
    {
        const start = {
            startAngle: initialStartAngle, endAngle: initialEndAngle,
            innerRadius: initialInnerRadius, outerRadius: initialOuterRadius,
        };
        const end = {
            startAngle: finalStartAngle, endAngle: finalEndAngle,
            innerRadius: finalInnerRadius, outerRadius: finalOuterRadius,
        };

        const interpolateFunc = interpolate(start, end);
        const arcD = arc();

        return function (t) {
            return arcD(interpolateFunc(t));
        };
    };

    arcTweens = {
        initial: d => (
            this.arcTweenGenerator(0, 0, 0, 0,
                d.startAngle + SPACE_BETWEEN_ARCS, d.endAngle,
                this.radius - this.arcThickness, this.radius)
        ),
        enterArc: d => (
            this.arcTweenGenerator(d.startAngle, d.endAngle, this.radius - this.arcThickness, this.radius,
                d.startAngle, d.endAngle + SPACE_BETWEEN_ARCS, this.radius - this.arcThickness,
                this.radius + this.radiusIncrement)
        ),
        leaveArc: d => (
            this.arcTweenGenerator(d.startAngle, d.endAngle, this.radius - this.arcThickness,
                this.radius + this.radiusIncrement, d.startAngle + SPACE_BETWEEN_ARCS, d.endAngle,
                this.radius - this.arcThickness, this.radius)
        ),
        updateArcEnter: (d, self) => {
            return this.arcTweenGenerator(self._current.startAngle + SPACE_BETWEEN_ARCS, self._current.endAngle, self._current.innerRadius,
                self._current.radius, d.startAngle + SPACE_BETWEEN_ARCS, d.endAngle,
                this.radius - this.arcThickness, this.radius);
        },
        updateArcExit: (d, self) => {
            return this.arcTweenGenerator(self._current.startAngle, self._current.endAngle,
                this.radius - this.arcThickness, this.radius, 2 * Math.PI,
                2 * Math.PI, this.radius - this.arcThickness, this.radius);
        }
    };
    
    animations = {
        initializeArcs: el => {
            el.duration(this.props.animationTime)
                .ease(easeExp)
                .attrTween('d', this.arcTweens.initial);
        },
        animationCentralTextEnter: el => {
            el.duration(CENTRAL_TEXT_ANIMATION_DURATION)
                .style('opacity', 1);
        },
        animationArcHighlight: (el) => {
            el.duration(TWEEN_ANIMATION_DURATION)
                .ease(easeBackOut)
                .attrTween('d', this.arcTweens.enterArc);
        },
        animationOutArcHighlight: (el) => {
            el.duration(TWEEN_ANIMATION_DURATION)
                .ease(easeBackOut)
                .attrTween('d', this.arcTweens.leaveArc);
        },
        animationOutCentralTextEnter: (el) => {
            el.duration(CENTRAL_TEXT_ANIMATION_DURATION)
                .style('opacity', 0);
        },
        enablePointerEvents: (el) => {
            el.on('end', function () {
                select(this).style('pointer-events', 'all');
            })
        },
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

DonutChart.propTypes = {
    animationTime: PropTypes.number.isRequired,
    customColors: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    customSize: PropTypes.number,
    customTextAtCenter: customTextAtCenterChecker,
    customTooltipBodyFormat: PropTypes.func,
    customTooltipTitleFormat: PropTypes.func,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            surname: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        }).isRequired
    ).isRequired,
    dataUnit: PropTypes.string.isRequired,
    disableHighlight: PropTypes.bool.isRequired,
    disableRotation: PropTypes.bool.isRequired,
    height: PropTypes.number.isRequired,
    hideLegend: PropTypes.bool.isRequired,
    hideTooltip: PropTypes.bool.isRequired,
    isPieChart: PropTypes.bool.isRequired,
    margin: PropTypes.shape({
        top: PropTypes.number.isRequired,
        bottom: PropTypes.number.isRequired,
    }).isRequired,
    onMouseClick: PropTypes.func,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onlyShowTooltipBody: PropTypes.bool.isRequired,
    size: PropTypes.oneOf([SIZE_SMALL, SIZE_MEDIUM, SIZE_BIG]).isRequired,
    thickness: PropTypes.number.isRequired,
    tooltipAtCenter: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired,
};

DonutChart.defaultProps = {
    animationTime: DEFAULT_TRANSITION_DURATION,
    customSize: null,
    customTooltipBodyFormat: null,
    customColors: DEFAULT_COLORS,
    customTextAtCenter: null,
    customTooltipTitleFormat: null,
    disableHighlight: false,
    disableRotation: false,
    hideLegend: false,
    hideTooltip: false,
    isPieChart: false,
    onMouseClick: null,
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMouseMove: () => {},
    onlyShowTooltipBody: false,
    size: SIZE_BIG,
    thickness: DEFAULT_THICKNESS,
    tooltipAtCenter: false,
};

function customTextAtCenterChecker(props, propName, componentName) {
    const prop = props[propName];
    if (prop === null) {
        return;
    }

    const result = prop('', '');
    if (Array.isArray(result)) {
        if (result.length !== 0 && result.length <= 2) {
            return;
        }
    }

    return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
    );
}

export default DonutChart;
