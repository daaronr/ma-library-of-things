import React, { useMemo } from 'react';

const HIGHLIGHT_SECTIONS = [
  {
    title: "You Can Borrow THAT From a Library?",
    emoji: "🤯",
    description: "Items that make people do a double-take",
    match: (item) => {
      const t = `${item.name} ${item.description || ''}`.toLowerCase();
      return (
        t.includes('animatronic') || t.includes('ghost hunt') ||
        t.includes('gold pan') || t.includes('tarot') ||
        t.includes('murder mystery') || t.includes('karaoke') ||
        t.includes('bee equip') || t.includes('beekeep') ||
        t.includes('cider press') || t.includes('solar oven') ||
        t.includes('egg incubator') || t.includes('theremini') ||
        t.includes('moog') || t.includes('puppet theater') ||
        t.includes('electric wood splitter')
      );
    },
  },
  {
    title: "The Great Outdoors, On Loan",
    emoji: "🏕️",
    description: "Kayaks, snowshoes, fishing gear, and state park passes",
    match: (item) => {
      const t = `${item.name} ${item.description || ''}`.toLowerCase();
      return (
        t.includes('kayak') || t.includes('paddleboard') ||
        t.includes('snowshoe') || t.includes('fishing') ||
        t.includes('state park') || t.includes('life jacket') ||
        t.includes('e-bike') || t.includes('hiking kit') ||
        t.includes('walking stick') || t.includes('camping')
      );
    },
  },
  {
    title: "Kitchen Gadgets You'll Use Once",
    emoji: "🍰",
    description: "Why buy a specialty cake pan when you can borrow one?",
    match: (item) => {
      const t = `${item.name} ${item.description || ''}`.toLowerCase();
      return (
        t.includes('cake pan') || t.includes('cookie cutter') ||
        t.includes('ice cream maker') || t.includes('spiralizer') ||
        t.includes('canning') || t.includes('pressure canner') ||
        t.includes('popcorn') || t.includes('induction cooktop') ||
        t.includes('food dehydrat')
      );
    },
  },
  {
    title: "Save Hundreds on Tools",
    emoji: "🔧",
    description: "Power tools and home improvement gear — free with a library card",
    match: (item) => {
      const t = `${item.name} ${item.description || ''}`.toLowerCase();
      return (
        t.includes('pressure washer') || t.includes('miter saw') ||
        t.includes('impact wrench') || t.includes('hammer drill') ||
        t.includes('wood splitter') || t.includes('air compressor') ||
        t.includes('circular saw') || t.includes('rotary hammer') ||
        t.includes('thickness planer') || t.includes('cement mixer')
      );
    },
  },
  {
    title: "Be a Scientist for a Week",
    emoji: "🔬",
    description: "Telescopes, microscopes, energy meters, and radon detectors",
    match: (item) => {
      const t = `${item.name} ${item.description || ''}`.toLowerCase();
      return (
        t.includes('telescope') || t.includes('microscope') ||
        t.includes('radon') || t.includes('kill-a-watt') ||
        t.includes('thermal') || t.includes('metal detector') ||
        t.includes('starry sky') || t.includes('sunspotter')
      );
    },
  },
  {
    title: "Start a Band (for Free)",
    emoji: "🎵",
    description: "Instruments and music gear you can check out today",
    match: (item) => {
      const t = `${item.name} ${item.description || ''}`.toLowerCase();
      return (
        t.includes('ukulele') || t.includes('guitar') ||
        t.includes('piano') || t.includes('drum') ||
        t.includes('record player') || t.includes('turntable') ||
        t.includes('theremini') || t.includes('moog') ||
        t.includes('cd player') || t.includes('boombox')
      );
    },
  },
  {
    title: "Party Without Buying",
    emoji: "🎉",
    description: "Projectors, PA systems, lawn games, and event supplies",
    match: (item) => {
      const t = `${item.name} ${item.description || ''}`.toLowerCase();
      return (
        t.includes('giant') || t.includes('pickleball') ||
        t.includes('bocce') || t.includes('cornhole') ||
        t.includes('disc golf') || t.includes('pa system') ||
        t.includes('projector') || t.includes('string light') ||
        t.includes('folding table') || t.includes('folding chair')
      );
    },
  },
  {
    title: "Tech You Didn't Know Libraries Lend",
    emoji: "💻",
    description: "GoPros, drones, laptops, hotspots, and VR headsets",
    match: (item) => {
      const t = `${item.name} ${item.description || ''}`.toLowerCase();
      return (
        t.includes('gopro') || t.includes('action camera') ||
        t.includes('hotspot') || t.includes('wi-fi') ||
        t.includes('film scanner') || t.includes('vhs') ||
        t.includes('8mm') || t.includes('cassette') ||
        t.includes('slide projector') || t.includes('cricut') ||
        t.includes('3d print') || t.includes('gimbal')
      );
    },
  },
  {
    title: "Wellness & Self-Care",
    emoji: "🧘",
    description: "Light therapy lamps, blood pressure monitors, and more",
    match: (item) => {
      const t = `${item.name} ${item.description || ''}`.toLowerCase();
      return (
        t.includes('light therapy') || t.includes('sad light') ||
        t.includes('blood pressure') || t.includes('massage') ||
        t.includes('yoga') || t.includes('meditation')
      );
    },
  },
];

export default function Highlights({ data, networks, onBack }) {
  const sections = useMemo(() => {
    if (!data?.items) return [];

    return HIGHLIGHT_SECTIONS.map(section => {
      const items = data.items
        .filter(section.match)
        .map(item => ({
          ...item,
          state: networks[item.network]?.state || '?',
          networkName: networks[item.network]?.name || item.network,
        }));

      // Dedupe by name (keep first occurrence per state for variety)
      const seen = new Set();
      const unique = items.filter(item => {
        const key = `${item.name}__${item.state}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Sort by state for variety, take up to 12
      unique.sort((a, b) => a.state.localeCompare(b.state));
      return {
        ...section,
        items: unique.slice(0, 12),
        totalCount: items.length,
      };
    }).filter(s => s.items.length > 0);
  }, [data, networks]);

  if (!sections.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading highlights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#8B4513] hover:text-[#6B3410] transition-colors font-mono text-sm"
      >
        <span>&larr;</span>
        <span>Back to Catalog</span>
      </button>

      <div className="catalog-card p-8">
        <div className="section-label mb-4">Social Media Inspiration</div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Interesting & <span className="text-[#8B4513]">Unusual</span> Things
        </h1>
        <p className="text-gray-600 max-w-2xl">
          The most surprising items you can borrow from US libraries.
          Perfect for social media posts, blog content, or just browsing for fun.
        </p>
        <p className="text-xs text-gray-400 mt-3 font-mono">
          Tip: Each section title works as a social media hook
        </p>
      </div>

      {sections.map(section => (
        <div key={section.title} className="catalog-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span>{section.emoji}</span>
                <span>{section.title}</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">{section.description}</p>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
              {section.totalCount} items nationwide
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.items.map((item, i) => (
              <div
                key={`${item.id || i}`}
                className="bg-[#FFFDF5] border border-[#E8DCC8] rounded p-3 hover:border-[#8B4513] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm text-[#2C2416] leading-snug">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#8B4513] bg-[#F5F1E6] px-1.5 py-0.5 rounded flex-shrink-0">
                    {item.state}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                )}
                <p className="text-[10px] text-gray-400 mt-1.5 truncate">{item.library}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="catalog-card p-6">
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-3">
          <span>📱</span>
          <span>Social Media Post Ideas</span>
        </h2>
        <div className="space-y-3">
          {[
            "Did you know you can borrow a KAYAK from your library? 🛶 [State] libraries lend way more than books.",
            "Your library card is worth hundreds of dollars. Pressure washers, telescopes, GoPros — all free to borrow.",
            "Libraries lend ghost hunting kits. That's it. That's the post. 👻",
            "Forget buying a $40 specialty cake pan you'll use once. Your library has them. 🎂",
            "State park passes, fishing poles, snowshoes — your library wants you to go outside. 🏞️",
            "Someone at the Burlington VT library said 'we should lend a Moog Theremini' and a hero was born. 🎵",
            "The Missoula MUD Tool Library has 3,754 tools. Your garage has maybe 12. Just saying. 🔧",
            "Your library card is a free gym membership, music store, tool shop, and outdoor gear rental all in one.",
          ].map((post, i) => (
            <div key={i} className="flex gap-3 items-start bg-[#FFFDF5] border border-[#E8DCC8] rounded p-3">
              <span className="text-gray-400 font-mono text-xs mt-0.5">{i + 1}.</span>
              <p className="text-sm text-[#2C2416]">{post}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
