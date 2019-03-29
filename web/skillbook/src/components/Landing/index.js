import React from 'react';
import ResponsiveChart from '../ResponsiveChart';
import BarChart from '../../charts/BarChart';
import Table from '../Table';
import './index.css';


const barChart = props => (
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

const barChartDataTech = [
    { name: 'Js', value: 100 },
    { name: 'Py', value: 90 },
    { name: 'Go', value: 80 },
    { name: 'React', value: 75 },
    { name: 'jQuery', value: 48 },
    { name: 'Node', value: 23 },
    { name: 'Flask', value: 21 },
];
const tableDataTech = [
    { name: 'Javascript', value: -1576 },
    { name: 'CSV', value: 1276 },
    { name: 'MD', value: 997 },
    { name: 'Go', value: 576 },
    { name: 'Python', value: -493 },
    { name: 'HTML', value: 364 },
    { name: 'Django', value: -2 },
];
const barChartDataProjects = [
    { name: 'Lucacomms', value: 100 },
    { name: 'Lucafleet', value: 90 },
    { name: 'Aura', value: 80 },
    { name: 'Smart Steps', value: 75 },
    { name: 'Home', value: 48 },
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
                        {'Top tecnologias'}
                    </div>
                    <ResponsiveChart
                        Chart={ barChart }
                        data={ topLanguages }
                        otherProps={{ dataUnit: 'contribuidores' }}
                    />
                </div>
                <div className={'landing-chart'}>
                    <div>
                        {'Tecnologias con actividad reciente'}
                    </div>
                    <Table data={ tableDataTech } unit={ 'lineas '}/>
                </div>
                <div className={'landing-chart'}>
                    <div>
                        {'Top proyectos'}
                    </div>
                    <ResponsiveChart
                        Chart={ barChart }
                        data={ topProjects }
                        otherProps={{ dataUnit: 'puntos de habilidad' }}
                    />
                </div>
                <div className={'landing-chart'}>
                    <div>
                        {'Proyectos con actividad reciente'}
                    </div>
                    <Table data={ tableDataProject } unit={ 'commits' }/>
                </div>
            </div>
        );
    }
}

export default Landing;
