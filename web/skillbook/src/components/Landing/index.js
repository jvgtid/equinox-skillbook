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
        dataUnit={ 'lineas' }
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
];

class Landing extends React.Component {
    state = {

    };

    render() {
        return (
            <div className={'landing-container flex-horizontal'}>
                <div className={'landing-chart'}>
                    <div>
                        {'Top technologias'}
                    </div>
                    <ResponsiveChart
                        Chart={ barChart }
                        data={ barChartDataTech }
                    />
                </div>
                <div className={'landing-chart'}>
                    <div>
                        {'Technologias con actividad reciente'}
                    </div>
                    <Table data={ tableDataTech } unit={ 'lineas '}/>
                </div>
                <div className={'landing-chart'}>
                    <div>
                        {'Top proyectos'}
                    </div>
                    <ResponsiveChart
                        Chart={ barChart }
                        data={ barChartDataProjects }
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
