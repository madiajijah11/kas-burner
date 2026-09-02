import { Header } from './components/Header';
import { BurnerCard } from './components/BurnerCard';
import { BalanceTracker } from './components/BalanceTracker';
import { SweepForm } from './components/SweepForm';
import { SecurityBadge } from './components/SecurityBadge';
import { WipeNotification } from './components/WipeNotification';
import { GuideAndDonation } from './components/GuideAndDonation';
import { useBurnerWallet } from './hooks/useBurnerWallet';

const DEVELOPER_DONATION_ADDRESS = "kaspa:qypgw7xw60yvxv5pcjncdv4f30wanju0g64hw3204wreayajt3025qgde344ycq";

export function App() {
  const {
    network,
    changeNetwork,
    state,
    wallet,
    balanceKAS,
    utxos,
    isPolling,
    lastSweep,
    sweepFunds,
    wipeMemory,
    generateNewBurner
  } = useBurnerWallet('mainnet');

  const handleSweep = async (destination: string) => {
    await sweepFunds(destination);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F12] text-slate-100">
      {/* Top Navigation */}
      <Header network={network} onNetworkChange={changeNetwork} />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Intro banner */}
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
            Single-Use <span className="text-kaspa-cyan">Kaspa Burner</span>
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-400">
            Receive KAS anonymously. Once funds arrive, sweep them to your cold wallet and erase the key forever.
          </p>
        </div>

        {/* Wipe Alert or Sweep Confirmation */}
        <WipeNotification sweepResult={lastSweep} state={state} />

        {/* Burner Key Card */}
        <BurnerCard wallet={wallet} onRefresh={generateNewBurner} />

        {/* Balance & Sweep Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BalanceTracker
            balanceKAS={balanceKAS}
            isPolling={isPolling}
            utxoCount={utxos.length}
          />
          <SweepForm
            balanceKAS={balanceKAS}
            network={network}
            onSweep={handleSweep}
            onEmergencyBurn={wipeMemory}
            isSweeping={state === 'SWEEPING'}
          />
        </div>

        {/* Guide & Donation Component */}
        <GuideAndDonation donationAddress={DEVELOPER_DONATION_ADDRESS} />

        {/* Security / OPSEC Guarantee */}
        <SecurityBadge />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-kaspa-border/40 py-6 text-center text-xs font-mono text-slate-500">
        <p>KasBurner • Open Source Kaspa OPSEC Tool • 0 Server Storage • Powered by Kaspa BlockDAG</p>
      </footer>
    </div>
  );
}

export default App;
