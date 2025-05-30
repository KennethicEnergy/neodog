'use client';

import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

import {
  BarController, BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController, LineElement, PointElement,
  Title, Tooltip,
} from 'chart.js';

import annotationPlugin from 'chartjs-plugin-annotation';

// ⬇️  rehistro ng components & plugins
Chart.register(
  LineController, LineElement, PointElement,
  BarController, BarElement,
  CategoryScale, LinearScale, Title, Tooltip, Legend,
  annotationPlugin
);

const Charts = ({ type }: { type: string }) => {
  const revenueRef = useRef<HTMLCanvasElement>(null);
  const clientRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // destroy helper para hindi mag-leak
    const charts: Chart[] = [];

    if (revenueRef.current) {
      charts.push(
        new Chart(revenueRef.current, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                data: [4200, 4100, 3900, 4300, 3800, 4500],
                borderColor: '#d3d3d3',
                backgroundColor: 'rgba(211,211,211,.15)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#d3d3d3',
                pointBorderColor: '#d3d3d3',
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              annotation: {
                annotations: {
                  target: {
                    type: 'line',
                    yMin: 4500,
                    yMax: 4500,
                    borderColor: '#d3d3d3',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    label: {
                      content: '$92K',
                      // enabled: true,
                      position: 'start',
                      color: '#6c757d',
                      font: { weight: 'bold', size: 14 },
                      yAdjust: -10
                    }
                  }
                }
              }
            },
            scales: {
              y: {
                min: 1000,
                max: 5000,
                ticks: {
                  callback: (value) => `$${Number(value) / 1000}K`,
                  color: '#9ca3af',
                  font: { size: 12 }
                },
                grid: {
                  color: '#f3f4f6'
                  // borderWidth: 0,    // ✅ wala nang drawBorder sa v4
                }
              },
              x: {
                ticks: {
                  color: '#9ca3af',
                  font: { size: 12 }
                },
                grid: {
                  display: false
                  // borderWidth: 0,
                }
              }
            }
          }
        })
      );
    }

    if (clientRef.current) {
      charts.push(
        new Chart(clientRef.current, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              data: [45, 55, 68, 82, 88, 70],
              backgroundColor: '#d3d3d3',
              borderRadius: 4,
              borderSkipped: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  stepSize: 25,
                  color: '#9ca3af',
                  font: { size: 12 },
                },
                grid: {
                  color: '#f3f4f6',
                  // borderWidth: 0,
                },
              },
              x: {
                ticks: {
                  color: '#9ca3af',
                  font: { size: 12 },
                },
                grid: {
                  display: false,
                  // borderWidth: 0,
                },
              },
            },
          },
        })
      );
    }
    return () => charts.forEach(c => c.destroy());
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.dashboard}>
        {type === 'revenue' && <div className={styles.card}>
          <h2 className={styles.title}>Revenue Trend</h2>
          <div className={styles.wrapper}>
            <canvas ref={revenueRef} />
          </div>
        </div>}

        {type === 'clients' && <div className={styles.card}>
          <h2 className={styles.title}>Client Growth</h2>
          <div className={styles.wrapper}>
            <canvas ref={clientRef} />
          </div>
        </div>}
      </div>
    </div>
  );
}

export default Charts;