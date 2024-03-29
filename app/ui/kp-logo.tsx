import { CalculatorIcon } from '@heroicons/react/24/outline';
import { lusitana } from './fonts';

export default function KacchaPaccaLogo() {
  return (
    <div
      className={`${lusitana.className}  flex flex-row items-center leading-none text-white`}
    >
      {/* <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" /> */}
      <CalculatorIcon className="h-12 w-12 rotate-[-15deg]" />
      <p className="text-[44px]">Accounts</p>
    </div>
  );
}
