import React, { useState, useMemo } from 'react';

const libraryData = {
  "Morse Institute Library": {
    location: "Natick, MA",
    phone: "508-647-6520",
    website: "https://morseinstitute.libguides.com/library-of-things",
    color: "#1E88E5",
    highlight: true,
    notes: "MOST EXTENSIVE tool collection in Massachusetts - 168+ items including power tools"
  },
  "Robbins Library": {
    location: "Arlington, MA",
    phone: "781-316-3200",
    website: "https://www.robbinslibrary.org/collections/library-of-things/",
    color: "#43A047"
  },
  "Watertown Free Public Library": {
    location: "Watertown, MA",
    phone: "617-972-6431",
    website: "https://www.watertownlib.org/610/Library-of-Things",
    color: "#FB8C00"
  },
  "Needham Free Public Library": {
    location: "Needham, MA",
    phone: "781-455-7559",
    website: "https://needhamlibrary.org/lot/",
    color: "#8E24AA"
  },
  "Brookline Public Library": {
    location: "Brookline, MA",
    phone: "617-730-2370",
    website: "https://www.brooklinelibrary.org/",
    color: "#00ACC1"
  },
  "Framingham Public Library": {
    location: "Framingham, MA",
    phone: "508-532-5570",
    website: "https://framinghamlibrary.org/browse/libraryofthings/",
    color: "#5E35B1"
  },
  "Cary Memorial Library": {
    location: "Lexington, MA",
    phone: "781-862-6288",
    website: "https://www.carylibrary.org/library-things",
    color: "#D81B60"
  }
};

const items = [
  // MORSE - HOME IMPROVEMENT
  { library: "Morse Institute Library", category: "Home Improvement", name: "20V Drill Driver Kit", description: "Denali drill, battery, charger, 32 bits, 3 drill bits" },
  { library: "Morse Institute Library", category: "Home Improvement", name: "Homeowner's Tool Kit (65pc)", description: "Hammer, tape, knife, level, pliers, screwdrivers, hex keys, ratchet, sockets" },
  { library: "Morse Institute Library", category: "Home Improvement", name: "Socket Set (85pc)", description: "1/4\" and 3/8\" drive sockets, ratchets, extensions" },
  { library: "Morse Institute Library", category: "Home Improvement", name: "Hammer Set", description: "Ball peen, drywall, 16oz, rubber mallet, crowbar, tape, goggles" },
  { library: "Morse Institute Library", category: "Home Improvement", name: "Woodworking Planes", description: "Bench plane (9.75\") and block plane (7\")" },
  { library: "Morse Institute Library", category: "Home Improvement", name: "Bolt Cutters (18\")", description: "3/8\" capacity for rods, bolts, chains" },
  { library: "Morse Institute Library", category: "Home Improvement", name: "Clamp Kit", description: "4 quick grip clamps (4-inch)" },
  { library: "Morse Institute Library", category: "Home Improvement", name: "Drywall Kit", description: "Joint knives, putty knife, goggles" },
  { library: "Morse Institute Library", category: "Home Improvement", name: "Plumbing Kit", description: "Hacksaw, pipe wrench, snips" },
  { library: "Morse Institute Library", category: "Home Improvement", name: "Torque Wrench", description: "3/8\" drive torque wrench" },
  { library: "Morse Institute Library", category: "Home Improvement", name: "Pressure Washer", description: "Karcher K1700 with nozzles, 20ft hose" },
  // MORSE - MEASUREMENT
  { library: "Morse Institute Library", category: "Measurement & Detection", name: "Laser Measurer", description: "Bosch laser measure" },
  { library: "Morse Institute Library", category: "Measurement & Detection", name: "Self-Leveling Laser", description: "Bosch GLL 30 cross-line laser" },
  { library: "Morse Institute Library", category: "Measurement & Detection", name: "Digital Level (24\")", description: "Digital level with guide" },
  { library: "Morse Institute Library", category: "Measurement & Detection", name: "Stud Finder", description: "Electronic stud finder" },
  { library: "Morse Institute Library", category: "Measurement & Detection", name: "Metal Detector", description: "Garrett ACE 300 complete kit" },
  { library: "Morse Institute Library", category: "Measurement & Detection", name: "Thermal Imaging Camera", description: "HT19 thermal camera" },
  // MORSE - HOME INSPECTION
  { library: "Morse Institute Library", category: "Home Inspection", name: "Electrical Test Kit", description: "AC voltage tester, AC/DC tester" },
  { library: "Morse Institute Library", category: "Home Inspection", name: "Gas Leak Detector", description: "Combustible gas detector" },
  { library: "Morse Institute Library", category: "Home Inspection", name: "Carbon Monoxide Meter", description: "Handheld CO detector" },
  { library: "Morse Institute Library", category: "Home Inspection", name: "Digital Radon Detector", description: "Portable radon monitor" },
  { library: "Morse Institute Library", category: "Home Inspection", name: "Air Quality Detector", description: "Indoor air quality monitor" },
  { library: "Morse Institute Library", category: "Home Inspection", name: "Moisture Meter", description: "Pinless wood moisture meter" },
  { library: "Morse Institute Library", category: "Home Inspection", name: "Kill-A-Watt Meter", description: "Electricity usage monitor" },
  // MORSE - AUTO/BICYCLE
  { library: "Morse Institute Library", category: "Auto/Vehicle", name: "Car Code Scanner", description: "OBD2 scanner and battery tester" },
  { library: "Morse Institute Library", category: "Auto/Vehicle", name: "Battery Charger", description: "Genius 5 maintainer" },
  { library: "Morse Institute Library", category: "Bicycle", name: "Bicycle Repair Kit (17pc)", description: "Chain tool, wrenches, patch kit" },
  { library: "Morse Institute Library", category: "Bicycle", name: "Bicycle Repair Stand", description: "Sportneer stand, 60 lb capacity" },
  // MORSE - GARDENING
  { library: "Morse Institute Library", category: "Gardening", name: "Gardening Kit (11pc)", description: "Trowels, weeder, shears, gloves, kneeling pad" },
  { library: "Morse Institute Library", category: "Gardening", name: "Soil Tester (3-in-1)", description: "Moisture, light, pH tester" },
  { library: "Morse Institute Library", category: "Gardening", name: "Bulb Planter (36\")", description: "Long-handled planter" },
  { library: "Morse Institute Library", category: "Gardening", name: "Lawn Aerator Shoes", description: "Spike shoes for lawn" },
  // MORSE - OUTDOOR/CAMPING
  { library: "Morse Institute Library", category: "Outdoor/Camping", name: "Snowshoes (21\"/25\"/30\")", description: "Multiple sizes available" },
  { library: "Morse Institute Library", category: "Outdoor/Camping", name: "Hammock", description: "Nylon with straps, carabiners" },
  { library: "Morse Institute Library", category: "Outdoor/Camping", name: "Camp Chairs & Table", description: "Folding chairs and aluminum table" },
  { library: "Morse Institute Library", category: "Outdoor/Camping", name: "LED Camping Lantern", description: "Rechargeable LED" },
  { library: "Morse Institute Library", category: "Outdoor/Camping", name: "Night Vision Goggles", description: "With 32GB SD card" },
  { library: "Morse Institute Library", category: "Outdoor/Camping", name: "Trail Camera", description: "4K with SD card" },
  { library: "Morse Institute Library", category: "Outdoor/Camping", name: "Binoculars", description: "Carson 8x42mm" },
  { library: "Morse Institute Library", category: "Outdoor/Camping", name: "Travel Telescope", description: "80mm refractor with backpack" },
  // MORSE - OUTDOOR GAMES
  { library: "Morse Institute Library", category: "Outdoor Games", name: "Cornhole Set", description: "2 boards, 8 bean bags" },
  { library: "Morse Institute Library", category: "Outdoor Games", name: "Bocce Ball Set", description: "8 balls, pallino, bag" },
  { library: "Morse Institute Library", category: "Outdoor Games", name: "Croquet Set", description: "6 mallets, balls, wickets" },
  { library: "Morse Institute Library", category: "Outdoor Games", name: "Giant Tumbling Timber", description: "Giant Jenga-style (56 blocks)" },
  { library: "Morse Institute Library", category: "Outdoor Games", name: "Giant Four-In-A-Row", description: "2'x3' standing game" },
  { library: "Morse Institute Library", category: "Outdoor Games", name: "Pickleball Set", description: "2 paddles, 4 balls" },
  { library: "Morse Institute Library", category: "Outdoor Games", name: "Disc Golf Set", description: "6 discs with bag" },
  // MORSE - CRAFTS
  { library: "Morse Institute Library", category: "Crafts/Sewing", name: "Sewing Machine", description: "Heavy duty with accessories" },
  { library: "Morse Institute Library", category: "Crafts/Sewing", name: "Cricut Explore Air 2", description: "Cutting machine with tools" },
  { library: "Morse Institute Library", category: "Crafts/Sewing", name: "Knitting Machine", description: "Automatic knitter" },
  { library: "Morse Institute Library", category: "Crafts/Sewing", name: "Die Cut Machine", description: "Sizzix Big Shot" },
  { library: "Morse Institute Library", category: "Crafts/Sewing", name: "Button Maker", description: "2.25\" button maker" },
  { library: "Morse Institute Library", category: "Crafts/Sewing", name: "3D Pen", description: "Scrib3D 3D printing pen" },
  // MORSE - TECHNOLOGY
  { library: "Morse Institute Library", category: "Technology", name: "Nintendo Switch/Lite", description: "Gaming consoles" },
  { library: "Morse Institute Library", category: "Technology", name: "Meta Quest 2 VR", description: "Virtual reality headset" },
  { library: "Morse Institute Library", category: "Technology", name: "GoPro HERO11 Mini", description: "Action camera with mounts" },
  { library: "Morse Institute Library", category: "Technology", name: "360 Degree Camera", description: "360 camera with tripod" },
  { library: "Morse Institute Library", category: "Technology", name: "Mini Projector", description: "Portable projector" },
  { library: "Morse Institute Library", category: "Technology", name: "Film/Slide Scanner", description: "Digitize old media" },
  { library: "Morse Institute Library", category: "Technology", name: "Ring Light Kit", description: "18\" light with stand" },
  { library: "Morse Institute Library", category: "Technology", name: "PA Speaker & Mic", description: "Portable PA system" },
  // MORSE - MUSIC
  { library: "Morse Institute Library", category: "Music", name: "Acoustic Guitar", description: "Full size 39\" beginner" },
  { library: "Morse Institute Library", category: "Music", name: "Ukulele (Tenor)", description: "Tenor with accessories" },
  { library: "Morse Institute Library", category: "Music", name: "Electronic Keyboard", description: "61-key teaching keyboard" },
  { library: "Morse Institute Library", category: "Music", name: "Karaoke Machine", description: "10\" subwoofer, 2 mics" },
  { library: "Morse Institute Library", category: "Music", name: "Turntable", description: "Victrola Bluetooth" },
  // MORSE - PARTY
  { library: "Morse Institute Library", category: "Party/Event", name: "Bubble Machine", description: "Electric bubbles" },
  { library: "Morse Institute Library", category: "Party/Event", name: "Balloon Pump", description: "Electric pump" },
  { library: "Morse Institute Library", category: "Party/Event", name: "Hand Truck", description: "Foldable, 275 lb capacity" },
  // MORSE - DOLLS
  { library: "Morse Institute Library", category: "Dolls", name: "American Girl Dolls", description: "Claudie, Joss, Evette, Tan Family" },
  // ROBBINS
  { library: "Robbins Library", category: "Kitchen", name: "Instant Pot", description: "Multi-use pressure cooker" },
  { library: "Robbins Library", category: "Kitchen", name: "Pasta Maker", description: "Manual pasta machine" },
  { library: "Robbins Library", category: "Home Improvement", name: "Thermal Camera", description: "Heat detection" },
  { library: "Robbins Library", category: "Crafts/Sewing", name: "Cricut Joy", description: "Compact cutter" },
  { library: "Robbins Library", category: "Party/Event", name: "PA System", description: "Speaker with mic" },
  { library: "Robbins Library", category: "Wellness/Health", name: "Blood Pressure Monitor", description: "Digital BP cuff" },
  { library: "Robbins Library", category: "Wellness/Health", name: "Light Therapy Lamp", description: "SAD therapy" },
  // WATERTOWN
  { library: "Watertown Free Public Library", category: "Kitchen", name: "Dumpling Maker", description: "Dumpling/ravioli tools" },
  { library: "Watertown Free Public Library", category: "Kitchen", name: "Food Dehydrator", description: "Food dehydrating machine" },
  { library: "Watertown Free Public Library", category: "Technology", name: "WiFi Hotspot", description: "Mobile internet" },
  // NEEDHAM
  { library: "Needham Free Public Library", category: "Outdoor/Camping", name: "Dome Tent (6-person)", description: "Family camping tent" },
  { library: "Needham Free Public Library", category: "Outdoor/Camping", name: "Bird Watching Kit", description: "Binoculars + guide" },
  { library: "Needham Free Public Library", category: "Music", name: "Ukulele", description: "Beginner ukulele" },
  { library: "Needham Free Public Library", category: "Technology", name: "WiFi Hotspot", description: "Mobile internet" },
  // BROOKLINE
  { library: "Brookline Public Library", category: "Technology", name: "WiFi Hotspots", description: "Most popular item!" },
  { library: "Brookline Public Library", category: "Outdoor/Camping", name: "Telescope", description: "High-end (high demand)" },
  { library: "Brookline Public Library", category: "Technology", name: "iPad", description: "Tablet checkout" },
  // FRAMINGHAM
  { library: "Framingham Public Library", category: "Home Improvement", name: "Tool Kit", description: "Basic tools" },
  { library: "Framingham Public Library", category: "Technology", name: "WiFi Hotspot", description: "Mobile internet" },
  // LEXINGTON
  { library: "Cary Memorial Library", category: "Home Improvement", name: "Kill-A-Watt Meter", description: "Electricity monitor" },
  { library: "Cary Memorial Library", category: "Technology", name: "WiFi Hotspot", description: "Mobile internet" },
];

const categoryIcons = {
  "Home Improvement": "🔧", "Measurement & Detection": "📏", "Home Inspection": "🔍",
  "Auto/Vehicle": "🚗", "Bicycle": "🚲", "Gardening": "🌱", "Outdoor/Camping": "⛺",
  "Outdoor Games": "🎯", "Crafts/Sewing": "🧵", "Technology": "💻", "Music": "🎸",
  "Kitchen": "🍳", "Party/Event": "🎉", "Wellness/Health": "❤️", "Dolls": "👧"
};

export default function MinutemanLibraryOfThings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCats, setExpandedCats] = useState(['Home Improvement', 'Measurement & Detection', 'Home Inspection']);

  const categories = useMemo(() => [...new Set(items.map(i => i.category))].sort(), []);
  const libraryNames = useMemo(() => Object.keys(libraryData).sort(), []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLib = selectedLibrary === 'all' || item.library === selectedLibrary;
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      return matchSearch && matchLib && matchCat;
    });
  }, [searchTerm, selectedLibrary, selectedCategory]);

  const itemsByCat = useMemo(() => {
    const g = {};
    filteredItems.forEach(i => { if (!g[i.category]) g[i.category] = []; g[i.category].push(i); });
    return g;
  }, [filteredItems]);

  const toggleCat = (c) => setExpandedCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  const toolCount = items.filter(i => 
    ['Home Improvement', 'Measurement & Detection', 'Home Inspection', 'Auto/Vehicle', 'Bicycle', 'Gardening'].includes(i.category)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📚</span>
            <div>
              <h1 className="text-2xl font-bold text-indigo-900">Minuteman Library Network</h1>
              <p className="text-indigo-600">Library of Things - MetroWest Boston</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4 text-center">
            <div className="bg-indigo-50 rounded-lg p-2">
              <div className="text-xl font-bold text-indigo-700">{items.length}</div>
              <div className="text-xs text-indigo-600">Items</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <div className="text-xl font-bold text-green-700">{libraryNames.length}</div>
              <div className="text-xs text-green-600">Libraries</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-2">
              <div className="text-xl font-bold text-orange-700">{categories.length}</div>
              <div className="text-xs text-orange-600">Categories</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2">
              <div className="text-xl font-bold text-purple-700">{toolCount}</div>
              <div className="text-xs text-purple-600">Tool Items</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500 text-sm text-blue-800">
            <strong>⭐ Featured:</strong> Morse Institute Library (Natick) has the most extensive tool collection in MA!
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="🔍 Search items..."
              className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-3 border-2 border-gray-200 rounded-lg"
              value={selectedLibrary}
              onChange={(e) => setSelectedLibrary(e.target.value)}
            >
              <option value="all">All Libraries</option>
              {libraryNames.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select
              className="p-3 border-2 border-gray-200 rounded-lg"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{categoryIcons[c]} {c}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="text-sm text-gray-600 mb-4">Showing {filteredItems.length} of {items.length} items</div>
          <div className="space-y-2">
            {Object.entries(itemsByCat).sort().map(([cat, catItems]) => (
              <div key={cat} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCat(cat)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{categoryIcons[cat] || '📦'}</span>
                    <span className="font-semibold">{cat}</span>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-sm">{catItems.length}</span>
                  </div>
                  <span>{expandedCats.includes(cat) ? '−' : '+'}</span>
                </button>
                {expandedCats.includes(cat) && (
                  <div className="p-3 space-y-2">
                    {catItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                        <span 
                          className="text-xs px-2 py-1 rounded-full text-white whitespace-nowrap"
                          style={{ backgroundColor: libraryData[item.library]?.color || '#666' }}
                        >
                          {item.library.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">📍 Library Directory</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(libraryData).map(([name, info]) => (
              <div key={name} className="border rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: info.color }} />
                  <div>
                    <h3 className="font-bold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-600">{info.location} • {info.phone}</p>
                    <a href={info.website} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
                      View Library of Things →
                    </a>
                    {info.highlight && (
                      <div className="mt-2 text-xs text-orange-700 bg-orange-50 p-2 rounded">⭐ {info.notes}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white text-sm">
          <h2 className="text-lg font-bold mb-3">📋 Important Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Network Benefits:</h3>
              <ul className="text-indigo-100 space-y-1">
                <li>• 12,000+ total items across 40+ libraries</li>
                <li>• Single card works at all MLN libraries</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Borrowing Rules:</h3>
              <ul className="text-indigo-100 space-y-1">
                <li>• Things return to owning library only</li>
                <li>• Most require lending agreement</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs text-indigo-200">
            Database compiled January 2026. Visit individual library websites for complete listings.
          </p>
        </div>
      </div>
    </div>
  );
}
