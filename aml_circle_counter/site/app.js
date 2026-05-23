const result = document.getElementById('result')

const show = (label, value) => {
  result.textContent = JSON.stringify({ label, value }, null, 2)
}

const walletContext = async () => {
  const [walletInfo, walletBalance] = await Promise.allSettled([
    window.OctraCircle.request('wallet.info'),
    window.OctraCircle.request('wallet.balance')
  ])
  return {
    wallet: walletInfo.status === 'fulfilled' ? walletInfo.value : { error: walletInfo.reason?.message || String(walletInfo.reason) },
    balance: walletBalance.status === 'fulfilled' ? walletBalance.value : { error: walletBalance.reason?.message || String(walletBalance.reason) }
  }
}

const diagnosticErrorOf = async (label, error) => {
  const message = error?.message || String(error)
  if (message.includes('circle owner authorization required')) {
    return {
      label,
      error: message,
      hint: 'program.info can be owner-auth on sealed runtime circles; use Wallet info, Get counter, Get label, and Increment to exercise the live runtime path'
    }
  }
  if (!message.includes('sender not found')) {
    return { label, error: message }
  }
  return {
    label,
    error: message,
    hint: 'active wallet sender is missing on this RPC; confirm the browser is attached to the funded local wallet on http://127.0.0.1:18421 and RPC http://127.0.0.1:18081',
    context: await walletContext()
  }
}

const run = async (label, action) => {
  try {
    const value = await action()
    show(label, value)
  } catch (error) {
    result.textContent = JSON.stringify(await diagnosticErrorOf(label, error), null, 2)
  }
}

document.getElementById('wallet-info').addEventListener('click', () => run('wallet.info', walletContext))

document.getElementById('load-info').addEventListener('click', () => run('program.info', () =>
  window.OctraCircle.request('program.info')
))

document.getElementById('load-counter').addEventListener('click', () => run('get_counter', () =>
  window.OctraCircle.request('program.view', { method: 'get_counter', params: [] })
))

document.getElementById('load-label').addEventListener('click', () => run('get_label', () =>
  window.OctraCircle.request('program.view', { method: 'get_label', params: [] })
))

document.getElementById('inc').addEventListener('click', () => run('inc', async () => {
  const context = await walletContext()
  const tx = await window.OctraCircle.request('program.call', {
    method: 'inc',
    params: [],
    amount: '0',
    ou: '1000'
  })
  const counter = await window.OctraCircle.request('program.view', { method: 'get_counter', params: [] })
  const label = await window.OctraCircle.request('program.view', { method: 'get_label', params: [] })
  return { tx, counter, label, context }
}))
