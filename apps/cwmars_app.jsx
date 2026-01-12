import React, { useState, useMemo } from 'react';

const LibraryOfThingsDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('category');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Home Improvement']));

  const items = [
    { library: "Monson Free Library", item: "Mobile Hotspot", category: "Technology", notes: "Monson residents only" },
    { library: "Monson Free Library", item: "Dash & Dot Robots", category: "Technology/STEM", notes: "Coding robots" },
    { library: "Monson Free Library", item: "Happy Light Therapy Lamp", category: "Health/Wellness", notes: "SAD/seasonal" },
    { library: "Monson Free Library", item: "Ukulele", category: "Musical Instruments", notes: "Requires form" },
    { library: "Monson Free Library", item: "Cake Pans (Novelty)", category: "Kitchen", notes: "Various designs" },
    { library: "Monson Free Library", item: "Board Games", category: "Games", notes: "Various" },
    { library: "Monson Free Library", item: "Puzzles", category: "Games/Puzzles", notes: "All ages" },
    { library: "Monson Free Library", item: "Lawn Games", category: "Outdoor Games", notes: "Various" },
    { library: "Chicopee Public Library", item: "Ukulele", category: "Musical Instruments", notes: "2 weeks, $2/day late" },
    { library: "Chicopee Public Library", item: "WiFi Hotspot", category: "Technology", notes: "2 weeks" },
    { library: "Chicopee Public Library", item: "Webcams", category: "Technology", notes: "2 weeks" },
    { library: "Chicopee Public Library", item: "Pickleball Set", category: "Outdoor Games", notes: "2 weeks" },
    { library: "Chicopee Public Library", item: "Bocce Ball Set", category: "Outdoor Games", notes: "2 weeks" },
    { library: "Chicopee Public Library", item: "Rollors Game", category: "Outdoor Games", notes: "2 weeks" },
    { library: "Chicopee Public Library", item: "Chess Sets", category: "Games", notes: "2 weeks" },
    { library: "Forbes Library", item: "Mobile WiFi Hotspots", category: "Technology", notes: "3 weeks, 1 renewal" },
    { library: "Forbes Library", item: "Ukuleles", category: "Musical Instruments", notes: "4 weeks, 1 limit" },
    { library: "Forbes Library", item: "Guitars", category: "Musical Instruments", notes: "4 weeks" },
    { library: "Forbes Library", item: "Violins", category: "Musical Instruments", notes: "4 weeks" },
    { library: "Forbes Library", item: "Theremins", category: "Musical Instruments", notes: "Electronic" },
    { library: "Forbes Library", item: "Concertinas", category: "Musical Instruments", notes: "4 weeks" },
    { library: "Forbes Library", item: "Board Games", category: "Games", notes: "4 weeks" },
    { library: "Forbes Library", item: "Jigsaw Puzzles", category: "Games/Puzzles", notes: "3 weeks" },
    { library: "Forbes Library", item: "E-Readers (Kindle)", category: "Technology", notes: "Try before buy" },
    { library: "Forbes Library", item: "Seed Library (413 Seeds)", category: "Gardening", notes: "Free seeds" },
    { library: "Forbes Library", item: "Knitting Kits", category: "Crafts/Hobbies", notes: "4 weeks" },
    { library: "Forbes Library", item: "Flower Press", category: "Crafts/Hobbies", notes: "4 weeks" },
    { library: "Forbes Library", item: "Magnifiers", category: "Tools/Accessories", notes: "4 weeks" },
    { library: "Forbes Library", item: "Museum Passes", category: "Entertainment", notes: "2 days" },
    { library: "Leominster Public Library", item: "Gaming Consoles", category: "Technology/Gaming", notes: "Check catalog" },
    { library: "Leominster Public Library", item: "Cameras", category: "Technology", notes: "Check catalog" },
    { library: "Leominster Public Library", item: "Laptops", category: "Technology", notes: "Check catalog" },
    { library: "Leominster Public Library", item: "WiFi Hotspots", category: "Technology", notes: "Check catalog" },
    { library: "Leominster Public Library", item: "Games", category: "Games", notes: "Various" },
    { library: "Leominster Public Library", item: "Device Chargers", category: "Technology", notes: "In-library only" },
    { library: "Worcester Public Library", item: "Mobile Hotspot", category: "Technology", notes: "3 weeks + 2 renewals" },
    { library: "Worcester Public Library", item: "Projector (Vankyo)", category: "Technology", notes: "Up to 250\" screen" },
    { library: "Worcester Public Library", item: "Webcam", category: "Technology", notes: "Multiple branches" },
    { library: "Worcester Public Library", item: "Stud Finder", category: "Home Improvement", notes: "Detects studs & electrical" },
    { library: "Worcester Public Library", item: "Metal Detector", category: "Home Improvement", notes: "Treasure hunting" },
    { library: "Worcester Public Library", item: "OBDII Scanner", category: "Home Improvement", notes: "Car diagnostic" },
    { library: "Worcester Public Library", item: "Radon Detector", category: "Home Improvement", notes: "Digital home testing" },
    { library: "Worcester Public Library", item: "Jackery Power Station", category: "Home Improvement", notes: "Portable battery" },
    { library: "Worcester Public Library", item: "Bike Lock with Key", category: "Home Improvement", notes: "Security" },
    { library: "Worcester Public Library", item: "Telescope", category: "Science/Education", notes: "Astronomy" },
    { library: "Worcester Public Library", item: "Paper Shredder", category: "Home Equipment", notes: "Crosscut, 8 sheets" },
    { library: "Worcester Public Library", item: "Luggage Scale", category: "Home Equipment", notes: "Digital" },
    { library: "Worcester Public Library", item: "Easel", category: "Home Equipment", notes: "Art/display" },
    { library: "Worcester Public Library", item: "Portable DVD Player", category: "Home Equipment", notes: "Entertainment" },
    { library: "Worcester Public Library", item: "Crochet Hooks Sets", category: "Crafts/Hobbies", notes: "Various sizes" },
    { library: "Worcester Public Library", item: "Knitting Needle Set", category: "Crafts/Hobbies", notes: "Complete" },
    { library: "Worcester Public Library", item: "Sewing Machine", category: "Crafts/Hobbies", notes: "Portable" },
    { library: "Worcester Public Library", item: "Light Therapy Lamp", category: "Health/Wellness", notes: "SAD/seasonal" },
    { library: "Worcester Public Library", item: "Board Games", category: "Games", notes: "Various" },
    { library: "Worcester Public Library", item: "Puzzles", category: "Games/Puzzles", notes: "Various" },
    { library: "Morse Institute Library", item: "Drill Driver Kit (20V)", category: "Home Improvement", notes: "Battery, charger, 32 bits" },
    { library: "Morse Institute Library", item: "Homeowner's Tool Kit (65-pc)", category: "Home Improvement", notes: "Hammer, tape, level, pliers, hex keys" },
    { library: "Morse Institute Library", item: "Stanley Tool Set", category: "Home Improvement", notes: "Comprehensive" },
    { library: "Morse Institute Library", item: "Socket Set (85-piece)", category: "Home Improvement", notes: "1/4\" and 3/8\" drive" },
    { library: "Morse Institute Library", item: "Hammer Set", category: "Home Improvement", notes: "Ball peen, drywall, mallet, crowbar" },
    { library: "Morse Institute Library", item: "Stud Finder", category: "Home Improvement", notes: "With case" },
    { library: "Morse Institute Library", item: "Digital Level (24-inch)", category: "Home Improvement", notes: "With guide" },
    { library: "Morse Institute Library", item: "Laser Measurer (Bosch)", category: "Home Improvement", notes: "Digital" },
    { library: "Morse Institute Library", item: "Self-Leveling Laser", category: "Home Improvement", notes: "Bosch cross-line" },
    { library: "Morse Institute Library", item: "Torque Wrench (3/8\")", category: "Home Improvement", notes: "With case" },
    { library: "Morse Institute Library", item: "Clamp Kit (4-inch)", category: "Home Improvement", notes: "4 quick grip clamps" },
    { library: "Morse Institute Library", item: "Drywall Kit", category: "Home Improvement", notes: "Joint knives, putty, goggles" },
    { library: "Morse Institute Library", item: "Plumbing Kit", category: "Home Improvement", notes: "Hacksaw, pipe wrench, snips" },
    { library: "Morse Institute Library", item: "Woodworking Planes", category: "Home Improvement", notes: "Bench & block plane" },
    { library: "Morse Institute Library", item: "Bolt Cutters (18-inch)", category: "Home Improvement", notes: "3/8\" capacity" },
    { library: "Morse Institute Library", item: "Hand Truck (Foldable)", category: "Home Improvement", notes: "275 lb capacity" },
    { library: "Morse Institute Library", item: "Portable Flood Light", category: "Home Improvement", notes: "LED with stand" },
    { library: "Morse Institute Library", item: "Pressure Washer", category: "Home Improvement", notes: "Karcher K1700" },
    { library: "Morse Institute Library", item: "Thermal Imaging Camera", category: "Home Improvement", notes: "Home inspection" },
    { library: "Morse Institute Library", item: "Electrical Test Kit", category: "Home Improvement", notes: "AC voltage tester" },
    { library: "Morse Institute Library", item: "Gas Leak Detector", category: "Home Improvement", notes: "Safety" },
    { library: "Morse Institute Library", item: "Carbon Monoxide Meter", category: "Home Improvement", notes: "CO detector" },
    { library: "Morse Institute Library", item: "Digital Radon Detector", category: "Home Improvement", notes: "10+ year life" },
    { library: "Morse Institute Library", item: "Air Quality Detector", category: "Home Improvement", notes: "USB charging" },
    { library: "Morse Institute Library", item: "Moisture Meter", category: "Home Improvement", notes: "Pinless wood" },
    { library: "Morse Institute Library", item: "Water Tester (5-in-1)", category: "Home Improvement", notes: "pH, TDS, EC, salinity" },
    { library: "Morse Institute Library", item: "Kill-A-Watt Meter", category: "Home Improvement", notes: "Electricity monitor" },
    { library: "Morse Institute Library", item: "Infrared Thermometer", category: "Home Improvement", notes: "Temperature gun" },
    { library: "Morse Institute Library", item: "Sound Level Meter", category: "Home Improvement", notes: "30-130 decibels" },
    { library: "Morse Institute Library", item: "Home Inspection Kit", category: "Home Improvement", notes: "Comprehensive" },
    { library: "Morse Institute Library", item: "Car Battery Analyzer", category: "Auto/Vehicle", notes: "BT705" },
    { library: "Morse Institute Library", item: "Car Code Scanner", category: "Auto/Vehicle", notes: "With battery tester" },
    { library: "Morse Institute Library", item: "Tire Pressure Gauge", category: "Auto/Vehicle", notes: "Digital" },
    { library: "Morse Institute Library", item: "Battery Charger/Maintainer", category: "Auto/Vehicle", notes: "Genius 5" },
    { library: "Morse Institute Library", item: "Bicycle Repair Kit (17-pc)", category: "Bicycle", notes: "Complete" },
    { library: "Morse Institute Library", item: "Bicycle Repair Stand", category: "Bicycle", notes: "60 lb capacity" },
    { library: "Morse Institute Library", item: "Bicycle Lock", category: "Bicycle", notes: "U-lock" },
    { library: "Morse Institute Library", item: "Nintendo Switch", category: "Technology/Gaming", notes: "Games separate" },
    { library: "Morse Institute Library", item: "Nintendo Switch Lite", category: "Technology/Gaming", notes: "Portable" },
    { library: "Morse Institute Library", item: "Meta Quest 2 VR", category: "Technology/Gaming", notes: "Requires Facebook" },
    { library: "Morse Institute Library", item: "NES Classic Edition", category: "Technology/Gaming", notes: "30 games built-in" },
    { library: "Morse Institute Library", item: "GoPro HERO11 Mini", category: "Technology", notes: "With mounts" },
    { library: "Morse Institute Library", item: "360 Degree Camera", category: "Technology", notes: "With tripod" },
    { library: "Morse Institute Library", item: "Trail Camera (4K)", category: "Technology", notes: "32GB SD" },
    { library: "Morse Institute Library", item: "Night Vision Goggles", category: "Technology", notes: "With SD card" },
    { library: "Morse Institute Library", item: "Mini Projector", category: "Technology", notes: "With HDMI" },
    { library: "Morse Institute Library", item: "Ring Light Kit (18\")", category: "Technology", notes: "61\" stand" },
    { library: "Morse Institute Library", item: "Smartphone Gimbal", category: "Technology", notes: "3-axis" },
    { library: "Morse Institute Library", item: "Film & Slide Scanner", category: "Technology", notes: "Multiple formats" },
    { library: "Morse Institute Library", item: "Kindle Paperwhite", category: "Technology", notes: "32GB with case" },
    { library: "Morse Institute Library", item: "Sewing Machine (Heavy Duty)", category: "Crafts/Hobbies", notes: "Hard case" },
    { library: "Morse Institute Library", item: "Cricut Explore Air 2", category: "Crafts/Hobbies", notes: "With tools & mats" },
    { library: "Morse Institute Library", item: "Die Cut Machine", category: "Crafts/Hobbies", notes: "Sizzix Big Shot" },
    { library: "Morse Institute Library", item: "Button Making Machine", category: "Crafts/Hobbies", notes: "2 1/4 inch" },
    { library: "Morse Institute Library", item: "Knitting Machine", category: "Crafts/Hobbies", notes: "With needles" },
    { library: "Morse Institute Library", item: "3D Pen", category: "Crafts/Hobbies", notes: "With PLA filament" },
    { library: "Morse Institute Library", item: "Ukulele (Tenor)", category: "Musical Instruments", notes: "With tuner & case" },
    { library: "Morse Institute Library", item: "Acoustic Guitar (39\")", category: "Musical Instruments", notes: "Beginner" },
    { library: "Morse Institute Library", item: "Electronic Keyboard (61-key)", category: "Musical Instruments", notes: "Teaching" },
    { library: "Morse Institute Library", item: "Bongo Drums", category: "Musical Instruments", notes: "With tuning wrench" },
    { library: "Morse Institute Library", item: "Kalimba Thumb Piano", category: "Musical Instruments", notes: "17 keys" },
    { library: "Morse Institute Library", item: "Karaoke Machine", category: "Entertainment", notes: "2 wireless mics" },
    { library: "Morse Institute Library", item: "Snowshoes (21/25/30\")", category: "Outdoor/Recreation", notes: "Multiple sizes" },
    { library: "Morse Institute Library", item: "Fishing Rods", category: "Outdoor/Recreation", notes: "With line & hook" },
    { library: "Morse Institute Library", item: "Hammock", category: "Outdoor/Recreation", notes: "With straps" },
    { library: "Morse Institute Library", item: "Binoculars (8x42)", category: "Outdoor/Recreation", notes: "Phone adapter" },
    { library: "Morse Institute Library", item: "Metal Detector (Garrett)", category: "Outdoor/Recreation", notes: "ACE 300" },
    { library: "Morse Institute Library", item: "Telescope (80mm)", category: "Science/Education", notes: "Travel scope" },
    { library: "Morse Institute Library", item: "Gardening Kit (8-piece)", category: "Gardening", notes: "Tote, seat, tools" },
    { library: "Morse Institute Library", item: "Gardening Kit (11-piece)", category: "Gardening", notes: "Comprehensive" },
    { library: "Morse Institute Library", item: "Bulb Planter (36\")", category: "Gardening", notes: "Depth control" },
    { library: "Morse Institute Library", item: "Soil Tester (3-in-1)", category: "Gardening", notes: "Moisture, light, pH" },
    { library: "Morse Institute Library", item: "Lawn Aerator Shoes", category: "Gardening", notes: "26 metal nails" },
    { library: "Morse Institute Library", item: "Bocce Ball Set", category: "Outdoor Games", notes: "8 balls, pallino" },
    { library: "Morse Institute Library", item: "Croquet Set", category: "Outdoor Games", notes: "6 player" },
    { library: "Morse Institute Library", item: "Pickleball Set", category: "Outdoor Games", notes: "2 paddles, 4 balls" },
    { library: "Morse Institute Library", item: "Cornhole Set", category: "Outdoor Games", notes: "2 boards, 8 bags" },
    { library: "Morse Institute Library", item: "Giant Tumbling Timber", category: "Outdoor Games", notes: "Giant Jenga" },
    { library: "Morse Institute Library", item: "Blood Pressure Monitor", category: "Health/Wellness", notes: "Omron 5 Series" },
    { library: "Morse Institute Library", item: "HappyLight Therapy Lamp", category: "Health/Wellness", notes: "10,000 lux" },
    { library: "Morse Institute Library", item: "Induction Cooktop Kit", category: "Kitchen", notes: "With pans" },
    { library: "Morse Institute Library", item: "Poker Set (300 chips)", category: "Games", notes: "Professional weight" },
    { library: "Morse Institute Library", item: "Ghost Hunting Kit", category: "Entertainment", notes: "EMF reader, spirit box" },
  ];

  const libraries = [
    { name: "Monson Free Library", location: "Monson, MA", phone: "413-267-3866", network: "CWMARS" },
    { name: "Chicopee Public Library", location: "Chicopee, MA", phone: "413-594-1800", network: "CWMARS" },
    { name: "Forbes Library", location: "Northampton, MA", phone: "413-587-1011", network: "CWMARS" },
    { name: "Leominster Public Library", location: "Leominster, MA", phone: "978-534-7522", network: "CWMARS" },
    { name: "Worcester Public Library", location: "Worcester, MA", phone: "508-799-1655", network: "CWMARS" },
    { name: "Morse Institute Library", location: "Natick, MA", phone: "508-647-6520", network: "Minuteman" },
  ];

  const categories = [...new Set(items.map(i => i.category))].sort();
  const libraryNames = [...new Set(items.map(i => i.library))].sort();

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLibrary = selectedLibrary === 'all' || item.library === selectedLibrary;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesLibrary && matchesCategory;
    });
  }, [searchTerm, selectedLibrary, selectedCategory]);

  const groupedByCategory = useMemo(() => {
    const grouped = {};
    filteredItems.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const groupedByLibrary = useMemo(() => {
    const grouped = {};
    filteredItems.forEach(item => {
      if (!grouped[item.library]) grouped[item.library] = [];
      grouped[item.library].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const toggleCategory = (cat) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(cat)) newExpanded.delete(cat);
    else newExpanded.add(cat);
    setExpandedCategories(newExpanded);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Home Improvement': '🔧', 'Technology': '💻', 'Technology/Gaming': '🎮',
      'Technology/STEM': '🤖', 'Musical Instruments': '🎸', 'Games': '🎲',
      'Games/Puzzles': '🧩', 'Outdoor Games': '🎯', 'Outdoor/Recreation': '🏕️',
      'Crafts/Hobbies': '✂️', 'Health/Wellness': '💚', 'Gardening': '🌱',
      'Kitchen': '🍳', 'Auto/Vehicle': '🚗', 'Bicycle': '🚲',
      'Science/Education': '🔬', 'Entertainment': '🎭', 'Home Equipment': '🏠',
      'Tools/Accessories': '🔨',
    };
    return icons[category] || '📦';
  };

  const homeItems = items.filter(i => ['Home Improvement', 'Auto/Vehicle', 'Bicycle', 'Gardening'].includes(i.category));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-indigo-900 mb-2">📚 Central/Western MA Library of Things</h1>
          <p className="text-gray-600 mb-4">CWMARS & Regional Libraries • {items.length} Verified Items • January 2026</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-indigo-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-700">{items.length}</div>
              <div className="text-xs text-gray-600">Total Items</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-700">{libraries.length}</div>
              <div className="text-xs text-gray-600">Libraries</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-700">{categories.length}</div>
              <div className="text-xs text-gray-600">Categories</div>
            </div>
            <div className="bg-rose-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-rose-700">{homeItems.length}</div>
              <div className="text-xs text-gray-600">Home/Tools</div>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="🔍 Search items, categories, or notes..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <select className="flex-1 min-w-32 p-2 border rounded-lg text-sm" value={selectedLibrary} onChange={(e) => setSelectedLibrary(e.target.value)}>
                <option value="all">All Libraries</option>
                {libraryNames.map(lib => <option key={lib} value={lib}>{lib}</option>)}
              </select>
              <select className="flex-1 min-w-32 p-2 border rounded-lg text-sm" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div className="flex rounded-lg overflow-hidden border">
                <button className={`px-3 py-2 text-sm ${viewMode === 'category' ? 'bg-indigo-600 text-white' : 'bg-white'}`} onClick={() => setViewMode('category')}>By Category</button>
                <button className={`px-3 py-2 text-sm ${viewMode === 'library' ? 'bg-indigo-600 text-white' : 'bg-white'}`} onClick={() => setViewMode('library')}>By Library</button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-3">Showing {filteredItems.length} of {items.length} items</div>

        {viewMode === 'category' ? (
          <div className="space-y-3">
            {Object.keys(groupedByCategory).sort().map(category => (
              <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
                <button className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white hover:from-indigo-100" onClick={() => toggleCategory(category)}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getCategoryIcon(category)}</span>
                    <span className="font-semibold text-gray-800">{category}</span>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{groupedByCategory[category].length}</span>
                  </div>
                  <span className="text-gray-400">{expandedCategories.has(category) ? '▼' : '▶'}</span>
                </button>
                {expandedCategories.has(category) && (
                  <div className="border-t">
                    {groupedByCategory[category].map((item, idx) => (
                      <div key={idx} className={`p-3 flex flex-col md:flex-row md:items-center gap-2 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{item.item}</span>
                          {item.notes && <span className="text-gray-500 text-sm ml-2">— {item.notes}</span>}
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap">{item.library}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(groupedByLibrary).sort().map(library => {
              const libInfo = libraries.find(l => l.name === library);
              return (
                <div key={library} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-white border-b">
                    <h3 className="font-bold text-gray-800">{library}</h3>
                    {libInfo && <p className="text-sm text-gray-500">{libInfo.location} • {libInfo.phone}</p>}
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{groupedByLibrary[library].length} items</span>
                  </div>
                  <div className="p-3 flex flex-wrap gap-2">
                    {groupedByLibrary[library].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 border rounded px-2 py-1 text-sm" title={item.notes}>
                        <span className="mr-1">{getCategoryIcon(item.category)}</span>{item.item}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-bold text-amber-800 mb-2">⚠️ Important Notes</h3>
          <ul className="text-sm text-amber-900 space-y-1">
            <li>• <strong>Home Improvement = diagnostic tools, hand tools</strong> — NOT power saws or chainsaws</li>
            <li>• Worcester Public Library does NOT lend chainsaws or power saws</li>
            <li>• Morse Institute Library (Natick) has the most extensive tool collection</li>
            <li>• Always contact library directly for current availability</li>
            <li>• CWMARS: catalog.cwmars.org | Minuteman: find.minlib.net</li>
          </ul>
        </div>

        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-gray-800 mb-3">📞 Library Directory</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {libraries.map(lib => (
              <div key={lib.name} className="bg-gray-50 rounded p-3 text-sm">
                <div className="font-semibold text-gray-800">{lib.name}</div>
                <div className="text-gray-600">{lib.location}</div>
                <div className="text-indigo-600">{lib.phone}</div>
                <div className="text-xs text-gray-500">{lib.network} Network</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500">Data verified January 2026 from official library websites</div>
      </div>
    </div>
  );
};

export default LibraryOfThingsDatabase;