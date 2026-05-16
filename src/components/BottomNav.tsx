import React from "react";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { Tab } from "../types";

interface NavItem {
  id: Tab;
  icon: React.ReactNode;
  label: string;
}

interface Props {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  navItems: NavItem[];
  onAddClick: () => void;
  isInputOpen: boolean;
}

export default function BottomNav({
  activeTab,
  setActiveTab,
  navItems,
  onAddClick,
  isInputOpen,
}: Props) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex justify-center pb-4 px-8 pointer-events-none">
      <div className="relative flex items-center pointer-events-auto">
        {/* Pill */}
        <div className="flex items-center h-16 bg-white rounded-full shadow-2xl shadow-slate-400/25 px-2 gap-1">
          {navItems.map(({ id, icon }, i) => {
            const isAfterMid = i === 2;
            return (
              <React.Fragment key={id}>
                {isAfterMid && <div className="w-20" />}

                <button
                  onClick={() => setActiveTab(id)}
                  className="relative w-14 h-12 flex items-center justify-center rounded-full transition-all duration-200"
                >
                  {activeTab === id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-sky-50 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-200 ${
                      activeTab === id ? "text-sky-500" : "text-slate-600"
                    }`}
                  >
                    {icon}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -top-2">
          <motion.button
            onClick={onAddClick}
            whileTap={{ scale: 0.88 }}
            animate={{ rotate: isInputOpen ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl shadow-slate-400/40 border-4 border-white"
          >
            <Plus className="w-6 h-6" strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
