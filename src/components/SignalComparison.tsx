'use client'

import { useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface SignalComparisonProps {
  noiseLevel: number
  signalIntensity: number
}

export default function SignalComparison({ noiseLevel, signalIntensity }: SignalComparisonProps) {
  const chartRef = useRef<any>(null)

  // Generate synthetic signal data
  const generateSignal = () => {
    const points = 100
    const labels = Array.from({ length: points }, (_, i) => i)

    const cleanSignal = labels.map((i) =>
      Math.sin((i / points) * Math.PI * 4) * 50 + 50
    )

    const noisySignal = cleanSignal.map((val, i) =>
      val + (Math.random() - 0.5) * noiseLevel * 100 * signalIntensity
    )

    const denoisedSignal = cleanSignal.map((val) => val * signalIntensity)

    return {
      labels,
      cleanSignal,
      noisySignal,
      denoisedSignal
    }
  }

  const data = generateSignal()

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Original Signal',
        data: data.cleanSignal,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Noisy Signal',
        data: data.noisySignal,
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.05)',
        borderWidth: 1,
        tension: 0.4,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'CNN Denoised',
        data: data.denoisedSignal,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: { size: 12, weight: 'bold' as const },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Neural Signal Denoising via CNN',
        color: '#ffffff',
        font: { size: 14, weight: 'bold' as const },
        padding: 20,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 10 },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 10 },
        },
      },
    },
  }

  return (
    <div className="glass-dark p-8 rounded-xl">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  )
}
