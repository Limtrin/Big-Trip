import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {eventTypeTransfer} from '../constants.js';
import {findDateDifference} from '../utils/common.js';

const Emogi = {
  flight: `✈️`,
  drive: `🚗`,
  ship: `🚢`,
  taxi: `🚕`,
  sightseeing: `🏢`,
  bus: `🚌`,
  transport: `🚊`,
  train: `🚂`,
  restaurant: `🍴`
};

Emogi[`check-in`] = `🏬`;

const dataSort = (typeLabels, dataLabels) => {
  const chartsData = typeLabels.map((chartItem, index) => {
    return {
      label: chartItem,
      data: dataLabels[index]
    };
  });

  const sortedChartsData = chartsData.sort((currentItem, nextItem) => {
    return nextItem.data - currentItem.data;
  });

  const labels = [];
  const data = [];
  sortedChartsData.forEach((sortedChartItem) => {
    labels.push(sortedChartItem.label);
    data.push(sortedChartItem.data);
  });

  return [labels, data];
};

const formatDateToTime = (array) => {
  const [days, hours, minutes] = array;
  return days * 1440 + hours * 60 + minutes;
};

const setMinutesToDaysAndHours = (minutes) => {
  let formattedTime = ``;
  const days = Math.floor(minutes / 1440);
  if (days) {
    formattedTime += `${days}D `;
    minutes -= 1440 * days;
  }
  const hours = Math.floor(minutes / 60);
  if (hours) {
    formattedTime += `${hours}H `;
    minutes -= 60 * hours;
  }
  formattedTime += `${minutes}M`;
  return formattedTime;
};

const renderChart = (ctx, dataItems, title, formatter) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: dataItems[0],
      datasets: [{
        data: dataItems[1],
        backgroundColor: dataItems[0].map(() => `#ffffff`),
        categoryPercentage: 0.5
      }]
    },
    options: {
      plugins: {
        datalabels: {
          align: `start`,
          anchor: `end`,
          font: {
            size: 16
          },
          color: `#000000`,
          formatter: formatter()
        }
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            beginAtZero: true
          },
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontSize: 16,
            fontColor: `#000000`,
            callback: (value) => {
              return `${Emogi[value]} ${value.toUpperCase()}`;
            }
          },
        }]
      },
      title: {
        display: true,
        text: title,
        fontSize: 24,
        position: `left`,
        fontColor: `#000000`
      },
    }
  });
};

const renderMoneyChart = (ctx, events) => {
  const typeLabels = events.map((event) => event.type)
  .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);

  const dataLabels = typeLabels.map((event) => events.reduce((acc, item) => {
    if (event === item.type) {
      acc += item.price;
      return acc;
    }
    return acc;
  }, 0));

  const dataItems = dataSort(typeLabels, dataLabels);

  const formatter = () => {
    return (value) => {
      return value + `€`;
    };
  };

  return renderChart(ctx, dataItems, `MONEY`, formatter);
};

const renderTransportChart = (ctx, events) => {
  const typeLabels = events.map((event) => event.type)
  .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], [])
  .filter((label) => eventTypeTransfer.includes(label));

  const dataLabels = typeLabels.map((event) => events.reduce((acc, item) => {
    if (event === item.type) {
      acc += 1;
      return acc;
    }
    return acc;
  }, 0));

  const dataItems = dataSort(typeLabels, dataLabels);

  const formatter = () => {
    return (value) => {
      return value + `x`;
    };
  };

  return renderChart(ctx, dataItems, `TRANSPORT`, formatter);
};

const renderTimeChart = (ctx, events) => {
  const typeLabels = events.map((event) => event.type)
  .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);

  const dataLabels = typeLabels.map((event) => events.reduce((acc, item) => {
    if (event === item.type) {
      const dateDifference = findDateDifference(item.dateBegining, item.dateEnding);
      acc[0] += dateDifference[0];
      acc[1] += dateDifference[1];
      acc[2] += dateDifference[2];
      return acc;
    }
    return acc;
  }, [0, 0, 0]));

  const formattedLabels = dataLabels.map((date) => formatDateToTime(date));

  const dataItems = dataSort(typeLabels, formattedLabels);

  const formatter = () => {
    return (value) => {
      return setMinutesToDaysAndHours(value);
    };
  };
  return renderChart(ctx, dataItems, `TIME SPENT`, formatter);
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics" style="background-color: #f2f2f2">
      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(events) {
    super();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._events = events;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _renderCharts() {
    const element = this.getElement();

    const ctxMoney = element.querySelector(`.statistics__chart--money`).getContext(`2d`);
    const ctxTransport = element.querySelector(`.statistics__chart--transport`).getContext(`2d`);
    const ctxTime = element.querySelector(`.statistics__chart--time`).getContext(`2d`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(ctxMoney, this._events);
    this._transportChart = renderTransportChart(ctxTransport, this._events);
    this._timeChart = renderTimeChart(ctxTime, this._events);

  }

  rerender(events) {
    this._events = events;

    super.rerender();

    this._renderCharts();
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }

  show(events) {
    super.show();

    this.rerender(events);
  }

  recoveryListeners() {}
}
