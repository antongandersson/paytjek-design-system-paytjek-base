import { useNavigate } from "react-router-dom";
import { UNION_CONFIGS, type UnionId } from "@/lib/demoUnionConfigs";
import paytjekLogo from "@/assets/paytjek-logo.svg";

const unions: { id: UnionId; ready: boolean }[] = [
  { id: "foa", ready: true },
  { id: "hk", ready: true },
  { id: "3f", ready: true },
  { id: "djoef", ready: true },
  { id: "lederne", ready: true },
  { id: "sef", ready: true },
  { id: "sef-kontrakt", ready: true },
];

export default function DemoSelector() {
  const navigate = useNavigate();

  const handleSelect = (unionId: UnionId) => {
    navigate(`/${unionId}/welcome`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <img src={paytjekLogo} alt="PayTjek" className="h-8 mx-auto opacity-70" />
          <p className="text-sm text-slate-500">
            Vælg fagforbund
          </p>
        </div>

        <div className="grid gap-3">
          {unions.map(({ id, ready }) => {
            const config = UNION_CONFIGS[id];
            if (!config) return null;

            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                disabled={!ready}
                className="flex items-center gap-4 w-full p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ borderColor: config.primaryColor + "30", backgroundColor: config.bgColor }}
                >
                  <img
                    src={config.logo}
                    alt={config.name}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 group-hover:text-slate-700">
                    {config.name}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {config.fullName}
                  </p>
                </div>
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: config.primaryColor }}
                />
              </button>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-slate-400 pt-4">
          Provided by PayTjek
        </p>
      </div>
    </div>
  );
}
