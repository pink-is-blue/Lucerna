// Field computation worker
// Listens for messages of shape: {type:'init', neuronPoints: Array<Array<{x,y,z}>>, sensorXs: Float32Array, sensorYs: Float32Array}
// or {type:'compute', time: number}

let neurons = []
let sensorXs = null
let sensorYs = null
let sensorRes = 0

function computeGrid(time) {
  const eps = 1e-6
  const mu = 1.0
  const nx = sensorXs.length
  const ny = sensorYs.length
  const out = new Float32Array(nx * ny)

  for (let xi = 0; xi < nx; xi++) {
    for (let yi = 0; yi < ny; yi++) {
      const px = sensorXs[xi]
      const py = sensorYs[yi]
      let bx = 0, by = 0, bz = 0

      for (let ni = 0; ni < neurons.length; ni++) {
        const pts = neurons[ni]
        const L = pts.length
        // traveling pulse center along curve
        const v = 0.5 + 0.1 * ni
        const center = (time * v) % 1.0
        const sigma = 0.08

        for (let i = 0; i < L - 1; i++) {
          const p0 = pts[i]
          const p1 = pts[i + 1]
          const midx = 0.5 * (p0.x + p1.x)
          const midy = 0.5 * (p0.y + p1.y)
          const midz = 0.5 * (p0.z + p1.z)
          const dlx = p1.x - p0.x
          const dly = p1.y - p0.y
          const dlz = p1.z - p0.z

          const rx = px - midx
          const ry = py - midy
          const rz = 0.5 - midz
          const r2 = rx*rx + ry*ry + rz*rz + eps
          const r3 = Math.pow(r2, 1.5)

          // param s for segment index
          const s = i / (L - 1)
          const wave = Math.exp(-0.5 * Math.pow((s - center)/sigma, 2))
          const I = wave

          const cx = dly * rz - dlz * ry
          const cy = dlz * rx - dlx * rz
          const cz = dlx * ry - dly * rx

          const scale = mu * I / r3
          bx += cx * scale
          by += cy * scale
          bz += cz * scale
        }
      }

      const mag = Math.sqrt(bx*bx + by*by + bz*bz)
      out[yi * nx + xi] = mag
    }
  }

  return out
}

onmessage = function(e) {
  const msg = e.data
  if (msg.type === 'init') {
    neurons = msg.neuronPoints || []
    sensorXs = msg.sensorXs
    sensorYs = msg.sensorYs
    sensorRes = sensorXs.length
    postMessage({type:'init:ack'})
  } else if (msg.type === 'compute') {
    const time = msg.time || 0
    const grid = computeGrid(time)
    // transfer back
    postMessage({type:'result', grid: grid.buffer}, [grid.buffer])
  }
}
