import {
  Coffee, Apple, Sandwich, IceCream, Beer, Soup, Cookie, Pizza,
  Salad, Beef, Fish, Milk, Wine, Candy, Cake, Droplet, Utensils,
} from 'lucide-react';

export function getFoodIcon(rawInput: string, className = 'w-7 h-7') {
  const t = rawInput.toLowerCase();

  // Drinks
  if (/kopi|coffee|espresso|cappuccino|latte|americano/.test(t))
    return <Coffee className={`${className} text-amber-700`} />;
  if (/teh|tea|matcha/.test(t))
    return <Coffee className={`${className} text-green-600`} />;
  if (/susu|milk|yogurt/.test(t))
    return <Milk className={`${className} text-sky-400`} />;
  if (/jus|juice|smoothie|minuman|minum|air|sirup|boba|bubble/.test(t))
    return <Wine className={`${className} text-pink-400`} />;
  if (/bir|beer|alkohol/.test(t))
    return <Beer className={`${className} text-amber-500`} />;
  if (/soda|cola|sprite|fanta|minuman bersoda/.test(t))
    return <Droplet className={`${className} text-sky-500`} />;

  // Sweets
  if (/coklat|chocolate|permen|candy|gula|gummy/.test(t))
    return <Candy className={`${className} text-rose-400`} />;
  if (/kue|cake|torte|bolu|birthday/.test(t))
    return <Cake className={`${className} text-pink-500`} />;
  if (/es krim|ice cream|gelato|sorbet/.test(t))
    return <IceCream className={`${className} text-pink-400`} />;
  if (/biskuit|biscuit|cookie|wafer|snack|keripik|chips/.test(t))
    return <Cookie className={`${className} text-amber-600`} />;
  if (/donat|donut|roti|bread|toast|croissant/.test(t))
    return <Sandwich className={`${className} text-amber-500`} />;

  // Meals
  if (/pizza/.test(t))
    return <Pizza className={`${className} text-orange-500`} />;
  if (/salad|sayur|vegetables|greens/.test(t))
    return <Salad className={`${className} text-green-500`} />;
  if (/sop|soup|bakso|soto|rawon|pho/.test(t))
    return <Soup className={`${className} text-orange-400`} />;
  if (/ayam|chicken|daging|beef|steak|sate|barbeque|bbq/.test(t))
    return <Beef className={`${className} text-rose-600`} />;
  if (/ikan|fish|seafood|udang|cumi|salmon|tuna/.test(t))
    return <Fish className={`${className} text-sky-600`} />;
  if (/buah|fruit|apple|pisang|banana|mangga|mango|jeruk|orange/.test(t))
    return <Apple className={`${className} text-green-500`} />;
  if (/nasi|rice|mie|noodle|pasta|spaghetti|burger|sandwich|wrap/.test(t))
    return <Sandwich className={`${className} text-amber-600`} />;

  // Fallback
  return <Utensils className={`${className} text-slate-400`} />;
}

export function getFoodIconSmall(rawInput: string) {
  return getFoodIcon(rawInput, 'w-5 h-5');
}