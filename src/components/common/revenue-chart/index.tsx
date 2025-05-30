'use client';
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import React, { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
  annotationPlugin
);

const RevenueChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.15)'); // soft gray top
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    const labels = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June'
      // 'July',
      // 'August',
      // 'September',
      // 'October',
      // 'November',
      // 'December'
    ];
    const dataPoints = [1, 1.5, 2, 3, 2.4, 3, 4];

    // const generateLabels = (labels: string[]) => {
    //   return labels.map((label, index) =>  `Month: ${label}`);
    // };

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Revenue Trend',
            data: dataPoints,
            fill: 'start',
            backgroundColor: gradient,
            tension: 0.4,
            pointHoverRadius: 6,
            pointBorderColor: '#999', // outer ring
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#000', // bolder on hover
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` $${context.parsed.y}K`
            }
          },
          annotation: {
            annotations: {
              labelPoint: {
                type: 'label',
                xValue: labels[labels.length - 1],
                yValue: dataPoints[dataPoints.length - 1],
                content: [`$${dataPoints[dataPoints.length - 1]}K`],
                backgroundColor: 'transparent',
                font: { weight: 'bold', size: 16 },
                color: '#666',
                position: 'end',
                adjustScaleRange: true
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#999',
              font: { weight: 'bold' }
            }
          },
          y: {
            grid: { display: true },
            min: 0,
            max: 5, // adjust based on your dataset
            ticks: {
              callback: (value) => `$${value}K`,
              color: '#999',
              font: { weight: 'bold' }
            }
          }
        }
      }
    });

    console.log(labels[labels.length - 1], dataPoints[dataPoints.length - 1]);

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return (
    <div className={styles.revenueChart}>
      <h4>Revenue Trend</h4>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default RevenueChart;
