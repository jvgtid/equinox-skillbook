import React from 'react';
import ResponsiveChart from '../ResponsiveChart';
import BarChart from '../../charts/BarChart';
import DonuChart from '../../charts/DonutChart';
import Table from '../Table';
import './index.css';


const barChart1 = props => (
    <BarChart
        { ...props }
        margin={{ top: 35, right: 50, bottom: 15, left: 0 }}
        customColors={ ['#63ace5'] }
        customBarSize={ 0.55 }
        endMargin={ 15 }
        yAxisMargin={ 15 }
        nLabels={ 6 }
        fontSize={ 12 }
    />
);
const barChart2 = props => (
    <BarChart
        { ...props }
        margin={{ top: 35, right: 50, bottom: 15, left: 0 }}
        customColors={ ['#63ace5'] }
        customBarSize={ 0.55 }
        endMargin={ 30 }
        yAxisMargin={ 30 }
        nLabels={ 6 }
        fontSize={ 12 }
    />
);
const donutChart = props => (
    <DonuChart
        { ...props }
        margin={{ top: 35, right: 50, bottom: 15, left: 0 }}
        customColors={ ['#005a74', '#80a696', '#f05f55', '#f3ce3d', '#5c2561', '#4fc2e9', '#de62ec'] }
        customTextAtCenter={(d, du) => [d.value, du]}
        thickness={0.20}
        hideTooltip
    />
);

const tableDataTech = [
    { name: 'Javascript', value: -1576 },
    { name: 'CSV', value: 1276 },
    { name: 'MD', value: 997 },
    { name: 'Go', value: 576 },
    { name: 'Python', value: -493 },
    { name: 'HTML', value: 364 },
    { name: 'Django', value: -2 },
];
const tableDataProject = [
    { name: 'Lucafleet', value: 12 },
    { name: 'Lucacomms', value: 11 },
    { name: 'Aura', value: 9 },
    { name: 'Smartsteps', value: 9 },
    { name: 'Digits', value: 5 },
    { name: 'Energy', value: 2 },
    { name: 'Gaudi', value: 1 },
];
const donutChartData = [
    { name: 'Madrid', surname: '', value: 8631 },
    { name: 'Barcelona', surname: '', value: 5427 },
    { name: 'London', surname: '', value: 3216 },
    { name: 'Valencia', surname: '', value: 854 },
    { name: 'Huesca', surname: '', value: 324 },
    { name: 'Granada', surname: '', value: 319 },
    { name: 'Boecillo', surname: '', value: 289 },
];

class Landing extends React.Component {
    state = {

    };

    render() {
        const topLanguages = this.props.top_langs.map(el => ({
            name: el[0],
            value: el[1]
        }));
        const topProjects = this.props.top_projects.map(el => ({
            name: el[0],
            value: el[1]
        }));

        return (
            <div className={'landing-container flex-horizontal'}>
                <div className={'landing-chart'}>
                    <div>
                        {'Top tecnologías'}
                    </div>
                    <ResponsiveChart
                        Chart={ barChart1 }
                        data={ topLanguages }
                        otherProps={{ dataUnit: 'contribuidores' }}
                    />
                </div>
                <div className={'landing-chart'}>
                    <div>
                        {'Top proyectos'}
                    </div>
                    <ResponsiveChart
                        Chart={ barChart2 }
                        data={ topProjects }
                        otherProps={{ dataUnit: 'puntos de habilidad' }}
                    />
                </div>
                <div className={'landing-chart'}>
                    <div>
                        {'Skills por Sede'}
                    </div>
                    <ResponsiveChart
                        Chart={ donutChart }
                        data={ donutChartData }
                        otherProps={{ dataUnit: 'puntos de habilidad' }}
                    />
                </div>
                <div className={'landing-chart'}>
                    <div>
                        {'Tecnologías con actividad reciente'}
                    </div>
                    <Table data={ tableDataTech } unit={ 'lineas '}/>
                </div>
            </div>
        );
    }
}

export default Landing;
